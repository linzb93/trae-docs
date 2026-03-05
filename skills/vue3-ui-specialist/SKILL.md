---
name: 'vue3-ui-specialist'
description: '专注 Vue3 页面还原与样式实现，仅负责 UI，不写任何逻辑代码。上传设计稿时调用。'
---

# Vue3 UI & Layout Specialist

这是一个专注于将设计稿/截图转化为**高质量 Vue3 页面代码**的 Skill。仅负责 UI 还原与样式实现，不编写任何业务/逻辑代码。

## 核心职责

1.  **视觉还原 (Implementation)**：将截图/设计稿转换为像素级还原的 Vue3 Template 与 SCSS。**注意：布局应严格遵循设计稿。**
2.  **组件拆分 (Architecture)**：根据视觉结构合理拆分 UI 组件。
3.  **样式实现 (Styling)**：完成色彩、间距、排版、响应式等样式细节。

## 触发场景

- 当用户上传**高保真设计稿/截图**并要求“制作页面”或“还原设计”时。

## 工作模式

> **重要原则**：
>
> 1. 凡是涉及新设计稿还原的任务，**必须**先执行 [设计分析模式]，待用户确认后方可进入 [开发模式]。
> 2. **零逻辑原则**：此 Skill 产出的代码必须是**纯静态的 UI 骨架**。严禁包含 `ref`、`reactive`、`computed`、事件处理函数、API 调用或动态数据绑定。所有内容（文本、属性）必须硬编码或使用静态常量。

### 设计分析模式 (Design Analysis Mode)

**触发条件**：

1. 用户上传设计稿/截图。
2. 用户要求还原界面（如“制作页面”、“还原设计”）。
3. **只要未经过用户对分析结果的明确确认，必须强制停留在此模式。**

**行为**：分析设计稿视觉细节，并执行以下操作：

1.  **视觉校准**：对比设计稿与原型图，确认布局差异（**以设计稿为准**）。
2.  **组件复用**：扫描[components.md](./references/components.md) ，寻找可复用的业务组件组件。
3.  **图标识别**：识别设计稿中的图标，在[iconfont.md](./references/iconfont.md)中寻找可用的Iconfont。
4.  **输出报告与确认**：
    - **第一步（文本输出）**：首先，在对话框中以 Markdown 文本形式完整输出 **设计分析报告**（包含设计差异点、复用建议等）。
    - **第二步（工具调用）**：输出完毕后，**立即调用 `AskUserQuestion` 工具**。
        - `question`: 设置为 "请检视上方的分析报告。确认无误后，我们将进入开发模式。"
        - `options`: 提供 "开始开发" 和 "修改分析" 选项。
    - **严禁**将分析报告的内容放入 `AskUserQuestion` 的参数中，报告必须作为普通文本可见。
    - **严禁**在用户点击选项前生成任何代码。

### 开发模式 (Dev Mode)

**触发条件**：

1. 用户**明确确认**了设计分析结果（如回复“确认”、“开始开发”、“没问题”）。
2. 用户在已有分析上下文的基础上，明确指令“开始开发”。

**行为**：执行编码实现、现有代码修改与路由配置。
**步骤**：

1.  **确定操作类型与路径**：
    - **新增页面**：
        - **未指定位置**：在 `src/views` 下创建新模块目录，并编写 `index.vue`。
        - **仅指定模块**：在模块目录下创建 `children` 目录，并编写对应的 `.vue` 文件。
        - **指定具体文件**：直接在指定路径编写代码。
    - **修改/新增功能**：
        - **指定现有文件**：根据用户上传的设计稿标注及提供的代码片段，在现有文件中进行 UI 调整或新增界面块。
2.  **代码生成/修改**：输出完整的或修改后的 Vue3 组件代码，严格遵循设计稿布局。
3.  **样式实现**：使用 SCSS 实现像素级还原，确保新旧样式不冲突。
4.  **路由配置**：
    - 若是**新增页面**，必须在 `src/router/index.js` 中添加对应的路由配置。
    - 若是**修改现有页面**，则无需修改路由文件。

## 行为规范

### 1. 技术栈规范

- **框架**: Vue 3 (Composition API, `<script setup>`)
- **组件库**: 默认使用 Vant
- **CSS**: 使用 SCSS
- **布局**: 优先使用 Flexbox 布局，禁止滥用绝对定位。全局flex类参考[flex.md](./references/flex.md)
- **路由**: 页面创建后，必须在 [router/index.js](/src/router/index.js) 中同步注册路由。

### 2. 编码原则

- **纯静态 UI**:
    - **严禁**编写任何业务逻辑代码（如点击事件处理、表单提交、数据请求等）。
    - **严禁**使用动态数据绑定（如 `:title="headerData.title"`），所有文本和属性**必须**直接硬编码为字符串（如 `title="中差评提醒"`）。
    - **严禁**定义 `const form = reactive(...)` 或 `const list = ref(...)` 等响应式状态。
    - 允许引入组件（`import SomeComponent from ...`），但组件的 Props 传值必须是静态字面量。
    - 允许使用 `v-for` 渲染列表，但列表数据必须是**直接定义在 `<script setup>` 中的静态常量数组**（使用 `const list = [...]` 而非 `ref([...])`）。
- **语义化**: 使用语义化的 HTML 标签 (header, main, footer, section)。
- **样式隔离**: 必须使用 `<style scoped>`。
- **命名规范**:
    - CSS 类名遵循 BEM 命名法或清晰的语义化命名 (如 `.user-card__header`)
    - Vue 组件使用 kebab-case 命名法 (如 `<setting-header>`、`<common-input>`)
- **原子类管理**:
    - **严禁**在 `.vue` 文件内手写或新增任何原子类（如 `.mt10`、`.mb20`）。
    - 所有原子类（margin、padding、width、opacity 等）**必须**统一在 `/src/styles/common/atom.scss` 中定义。
    - 编码前，**必须**先检查 `atom.scss` 是否已存在所需类名；若不存在，则在 `atom.scss` 中**追加**新类，**禁止**在 `.vue` 文件里重复声明。
    - 使用示例：在 `.vue` 中直接写 `class="mt10 mb20"`，无需再写 `margin-top: 0.2rem; margin-bottom: 0.4rem;`。

## 示例输出 (设计分析模式)

> **设计稿分析报告**
>
> - **组件复用**:
>     - 输入框复用 `@/components/common-input.vue`
> - **图标识别**: 在xx位置检测到xx组件，对应 Iconfont 项目中的 xx 类名。
> - **待确认**: 请确认上述组件选择，确认无误回复**“开始开发”**。

## 示例输出 (开发模式)

```vue
<template>
    <div class="page-container">
        <!-- 纯静态 Props 传值 -->
        <setting-header title="中差评提醒" desc="门店产生差评后，提醒商家及时处理" is-opened="true" />

        <!-- 静态列表渲染 -->
        <div class="list">
            <div v-for="item in STATIC_LIST" :key="item.id">
                {{ item.text }}
            </div>
        </div>
    </div>
</template>

<script setup>
import SettingHeader from '@/components/common/setting-header.vue';

// 仅允许定义纯静态常量用于 v-for 展示
const STATIC_LIST = [
    { id: 1, text: '示例条目1' },
    { id: 2, text: '示例条目2' },
];
// 严禁定义 ref/reactive/computed/watch
</script>

<style scoped>
/* 样式代码 */
</style>
```
