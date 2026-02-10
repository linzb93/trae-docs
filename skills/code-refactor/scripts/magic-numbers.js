import fs from 'fs';
import { findAllVueFiles } from '../utils.js';

/**
 * 运行魔法数字检测
 * @param {string} targetDir - 要扫描的目标根目录
 */
export async function run(targetDir) {
    console.log(`正在扫描目录: ${targetDir}`);
    console.log('检测任务: 魔法数字 (Magic Numbers)');
    console.log('--------------------------------------------------');

    if (!fs.existsSync(targetDir)) {
        console.error(`错误: 目录不存在 ${targetDir}`);
        return;
    }

    const vueFiles = findAllVueFiles(targetDir);

    // 正则说明:
    // (===|!==)       : 匹配操作符
    // \s*             : 可选空格
    // (               : 值捕获组
    //   (['"])\d+(\.\d+)?\3 : 带引号的数字 (如 '1', "10")
    //   |                   : 或
    //   \d+(\.\d+)?         : 纯数字 (如 1, 10.5)
    // )
    const regex = /(===|!==)\s*((['"])\d+(\.\d+)?\3|\d+(\.\d+)?)/g;

    // 白名单模式列表 (正则)
    // 如果匹配到的行包含这些模式，则忽略
    const ignoredPatterns = [
        /\.length\s*(===|!==)/, // 忽略 .length 判断
        // 可以在此处添加更多忽略规则，例如:
        // /index\s*(===|!==)/,
    ];

    let foundCount = 0;

    vueFiles.forEach((file) => {
        const content = fs.readFileSync(file, 'utf-8');
        const lines = content.split('\n');
        lines.forEach((line, index) => {
            let match;
            const lineRegex = new RegExp(regex);

            // 每次匹配前，先检查是否命中白名单
            const isIgnored = ignoredPatterns.some((pattern) => pattern.test(line));
            if (isIgnored) {
                return; // 跳过当前行
            }

            while ((match = lineRegex.exec(line)) !== null) {
                foundCount++;
                console.log(`${file}:${index + 1}  Found: ${match[0].trim()}`);
            }
        });
    });

    console.log('--------------------------------------------------');
    console.log(`扫描完成。共发现 ${foundCount} 处潜在的魔法值。`);
}
