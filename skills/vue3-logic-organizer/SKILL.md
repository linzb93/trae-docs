---
name: 'vue3-logic-organizer'
description: '将 Vue 3 script setup 代码按逻辑块进行组织，并使用中文注释分隔。当用户要求整理 Vue 代码或清理 script setup 时调用。'
---

# Vue 3 逻辑整理器

此 Skill 用于将 Vue 3 `<script setup>` 代码块重组为清晰的逻辑分组。

请遵循以下规则文件中定义的逻辑整理规范：
[Vue 3 逻辑整理规范](../../rules/vue3-logic-organization.md)

## 快速指令

当被调用时，请直接应用上述规则文件中的逻辑，无需额外解释。

1.  **分析** `<script setup>` 代码块。
2.  **分组** 相关代码（Import, 功能模块, 生命周期）。
3.  **添加** 中文注释分隔符 `// --- [功能名称] ---`。
