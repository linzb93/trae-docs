import path from 'path';
// 静态引入策略模块
import * as magicNumbersStrategy from './magic-numbers.js';
import * as vueSplitStrategy from './vue-split.js';

// 解析命令行参数
const args = process.argv.slice(2);
const typeArgIndex = args.indexOf('--type');
const type = typeArgIndex !== -1 ? args[typeArgIndex + 1] : null;

const pathArgIndex = args.indexOf('--path');
const pathArg = pathArgIndex !== -1 ? args[pathArgIndex + 1] : null;

// 定义支持的策略列表
const strategies = {
    'magic-numbers': magicNumbersStrategy,
    'vue-split': vueSplitStrategy,
};

/**
 * 显示帮助信息
 */
function showHelp() {
    console.log(`
Code Refactor Skill (代码重构助手)
==================================
用法:
  node .trae/skills/code-refactor/index.js --type <task-type> [--path <path>]

可用任务类型 (<task-type>):
  magic-numbers   : 查找 .vue 文件中的魔法数字和字符串 (===/!==)
  vue-split       : 分析 Vue 组件结构并提供拆分建议

参数:
  --path          : 指定要分析的文件或目录 (默认: src)

示例:
  node .trae/skills/code-refactor/index.js --type magic-numbers
  node .trae/skills/code-refactor/index.js --type vue-split --path ./src/views/Home.vue
`);
}

/**
 * 主函数
 */
async function main() {
    if (!type || !strategies[type]) {
        console.error('错误: 请指定有效的重构任务类型。');
        showHelp();
        globalThis.process?.exit?.(1);
    }

    const strategyModule = strategies[type];

    try {
        // 确定目标路径
        let targetPath;
        if (pathArg) {
            targetPath = path.resolve(globalThis.process?.cwd?.() ?? '', pathArg);
        } else {
            targetPath = path.resolve(globalThis.process?.cwd?.() ?? '', 'src');
        }

        // 执行策略
        if (typeof strategyModule.run === 'function') {
            await strategyModule.run(targetPath);
        } else {
            console.error(`错误: 模块 ${type} 没有导出 run 方法。`);
        }
    } catch (error) {
        console.error('执行出错:', error);
    }
}

main();
