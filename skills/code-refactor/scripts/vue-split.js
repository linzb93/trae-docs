import fs from 'fs';
import path from 'path';
import { findAllVueFiles, countNonEmptyLines } from '../utils.js';

const MAX_LINES_THRESHOLD = 700;

/**
 * 递归扫描并找到行数最多的 .vue 文件
 * @param {string} dir - 目标目录
 * @returns {{filePath: string|null, lines: number}} - 文件路径和行数
 */
function findLargestVueFile(dir) {
    let maxLines = -1;
    let maxFile = null;

    const files = findAllVueFiles(dir);

    files.forEach((filePath) => {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = countNonEmptyLines(content);
        if (lines > maxLines) {
            maxLines = lines;
            maxFile = filePath;
        }
    });

    return { filePath: maxFile, lines: maxLines };
}

/**
 * 解析 Vue 文件结构
 * @param {string} content
 */
function parseVueFile(content) {
    const lines = content.split('\n');
    const sections = {
        template: { lines: 0, content: '' },
        script: { lines: 0, content: '' },
        style: { lines: 0, content: '' },
    };

    let currentSection = null;

    lines.forEach((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('<template')) {
            currentSection = 'template';
            sections.template.lines++;
            sections.template.content += line + '\n';
        } else if (trimmed.startsWith('<script')) {
            currentSection = 'script';
            sections.script.lines++;
            sections.script.content += line + '\n';
        } else if (trimmed.startsWith('<style')) {
            currentSection = 'style';
            sections.style.lines++;
            sections.style.content += line + '\n';
        } else if (
            trimmed.startsWith('</template>') ||
            trimmed.startsWith('</script>') ||
            trimmed.startsWith('</style>')
        ) {
            if (currentSection) {
                sections[currentSection].lines++;
                sections[currentSection].content += line + '\n';
            }
            currentSection = null;
        } else {
            if (currentSection) {
                sections[currentSection].lines++;
                sections[currentSection].content += line + '\n';
            }
        }
    });

    return sections;
}

/**
 * 分析 Template 寻找拆分点
 * @param {string} content
 */
function analyzeTemplate(content) {
    const suggestions = [];
    const lines = content.split('\n');

    // 2. 查找大循环
    let loopStarts = []; // { index, tagName, indent }

    const tagStartRegex = /<(\w+)([^>]*?)v-for/i; // 捕获标签名
    const tagEndRegex = /<\/(\w+)>/;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // 检查开始标签是否有 v-for
        const startMatch = line.match(tagStartRegex);
        if (startMatch) {
            loopStarts.push({
                lineIndex: i,
                tagName: startMatch[1],
                active: true,
            });
        }

        // 检查是否有闭合标签
        const endMatch = line.match(tagEndRegex);
        if (endMatch) {
            const tagName = endMatch[1];
            // 查找最近的一个匹配的 v-for 开始
            for (let j = loopStarts.length - 1; j >= 0; j--) {
                if (loopStarts[j].active && loopStarts[j].tagName === tagName) {
                    const startInfo = loopStarts[j];
                    const length = i - startInfo.lineIndex;
                    if (length > 30) {
                        suggestions.push({
                            type: 'loop',
                            line: startInfo.lineIndex + 1,
                            length: length,
                            message: `Template 第 ${startInfo.lineIndex + 1} 行检测到 >30 行的 v-for 循环 (长度: ${length})，建议拆分为子组件。`,
                        });
                    }
                    loopStarts[j].active = false; // 标记为已处理
                    break;
                }
            }
        }
    }

    return suggestions;
}

/**
 * 运行 Vue 拆分分析
 * @param {string} targetPath - 目标文件或目录
 */
export async function run(targetPath) {
    let targetFile = targetPath;

    // 1. 确定目标文件
    if (fs.statSync(targetPath).isDirectory()) {
        const result = findLargestVueFile(targetPath);
        if (!result.filePath) {
            console.log('未找到 .vue 文件。');
            return;
        }

        if (result.lines <= MAX_LINES_THRESHOLD) {
            console.log(
                `最大文件 (${path.basename(result.filePath)}) 仅 ${result.lines} 行，未超过 ${MAX_LINES_THRESHOLD} 行，结束任务。`,
            );
            return;
        }

        targetFile = result.filePath;
    } else {
        if (!targetFile.endsWith('.vue')) {
            console.log('错误: 请提供 .vue 文件或包含 .vue 文件的目录。');
            return;
        }
    }

    const content = fs.readFileSync(targetFile, 'utf-8');
    const totalLines = countNonEmptyLines(content);

    // 2. 占比分析
    const sections = parseVueFile(content);
    const stats = {};
    ['template', 'script', 'style'].forEach((sec) => {
        const count = sections[sec].lines;
        const percent = totalLines > 0 ? ((count / totalLines) * 100).toFixed(1) : 0;
        stats[sec] = { count, percent };
    });

    // 3. 结构化分析
    const templateSuggestions = analyzeTemplate(sections.template.content);

    // 4. 生成 Prompt
    const fileDir = path.dirname(targetFile);

    console.log(`
请作为 Vue 重构专家，帮助我拆分以下组件。

**目标文件**: \`${targetFile}\`

**代码统计**:
- 总行数: ${totalLines}
- Template: ${stats.template.count} 行 (${stats.template.percent}%)
- Script: ${stats.script.count} 行 (${stats.script.percent}%)
- Style: ${stats.style.count} 行 (${stats.style.percent}%)

**自动检测**:
${templateSuggestions.length > 0 ? templateSuggestions.map((s) => `- ${s.message}`).join('\n') : '- 未检测到明显的 Template 大循环。'}

**重构要求**:
1. **深度分析**: 请阅读该文件代码，识别过大的函数、复杂的 Watch/Computed 逻辑、以及可以解耦的子组件。
2. **拆分原则**: 
   - 将通用逻辑提取为 Hooks (放在 \`${fileDir}/hooks\` 或同级目录)。
   - 将纯函数提取为 Utils (放在 \`${fileDir}/utils\` 或同级目录)。
   - 将子组件提取到 \`${fileDir}/components\`。
   - **重要**: 所有新生成的文件都必须放在该组件所在的模块目录下（即 \`${fileDir}\` 及其子目录）。
3. **输出内容**: 
   - 请给出拆分后的目录结构。
   - 请给出拆分出的新文件代码（Hooks, Utils, Components）。
   - 请给出重构后的父组件代码。
4. **注释规范**:
   - 必须严格遵循 \`.trae/rules/jsdoc.md\` 中的 JSDoc 规则。
   - 请在生成代码前读取该规则文件。

请开始分析并重构。
`);
}
