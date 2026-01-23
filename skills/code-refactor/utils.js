import fs from 'fs';
import path from 'path';

/**
 * 递归扫描文件，获取所有 .vue 文件路径
 * @param {string} dir - 目标目录
 * @param {string[]} fileList - 文件列表
 * @returns {string[]} - 包含所有 .vue 文件的绝对路径列表
 */
export function findAllVueFiles(dir, fileList = []) {
    // 检查目录是否存在
    if (!fs.existsSync(dir)) {
        return fileList;
    }

    const files = fs.readdirSync(dir);
    files.forEach((file) => {
        const filePath = path.join(dir, file);
        try {
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                // 忽略 node_modules, .git, dist 目录
                if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
                    findAllVueFiles(filePath, fileList);
                }
            } else {
                if (file.endsWith('.vue')) {
                    fileList.push(filePath);
                }
            }
        } catch (error) {
            console.warn(`无法访问文件: ${filePath}`, error.message);
        }
    });
    return fileList;
}

/**
 * 统计非空行数
 * @param {string} content
 * @returns {number}
 */
export function countNonEmptyLines(content) {
    if (!content) return 0;
    return content.split('\n').filter((line) => line.trim() !== '').length;
}
