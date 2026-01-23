---
name: 'code-refactor'
description: '代码重构助手。支持多种重构任务（目前支持魔法数字检测和Vue组件拆分）。当用户想要重构代码、查找硬编码值、进行代码审计或拆分Vue组件时调用。'
---

# 代码重构助手 (Code Refactor)

这是一个通用的代码重构工具集，旨在帮助开发者发现代码中的潜在问题并辅助重构。

## 功能列表

目前支持以下重构检测任务：

- **magic-numbers** (魔法数字检测):
    - 扫描 `src` 目录下的 `.vue` 文件。
    - 查找在严格相等比较 (`===` 或 `!==`) 中使用的硬编码数字或字符串。
    - 示例：`if (status === 1)` 或 `if (type !== 'admin')`。

- **vue-split** (Vue 组件拆分提示词生成):
    - 扫描指定目录（自动选最大的 .vue 文件）或指定文件。
    - 统计 Template/Script/Style 行数占比。
    - 自动检测 Template 中的大循环（>30行）。
    - **生成 AI 重构提示词**：输出一段详细的 Prompt，可以直接发送给 AI，让其根据分析数据和文件内容生成具体的拆分代码（Components, Hooks, Utils）。

## 使用方法

使用 Node.js 运行入口脚本，并通过 `--type` 参数指定任务类型。

### 1. 检测魔法数字

```bash
node .trae/skills/code-refactor/index.js --type magic-numbers
```

### 2. 生成 Vue 拆分提示词

```bash
# 扫描 src 目录，自动分析最大的文件
node .trae/skills/code-refactor/index.js --type vue-split --path src

# 分析指定文件
node .trae/skills/code-refactor/index.js --type vue-split --path src/views/Home.vue
```

### 3. 查看帮助

如果不带参数运行，将显示帮助信息和支持的任务列表：

```bash
node .trae/skills/code-refactor/index.js
```

## 扩展性

该 Skill 采用策略模式设计。如需添加新的重构功能（例如“提取方法”或“变量重命名”），只需在 `strategies` 目录下添加新的脚本，并在 `index.js` 中注册即可。
