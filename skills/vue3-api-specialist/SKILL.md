---
name: 'vue3-api-specialist'
description: '专注 Vue3 业务逻辑。当需要编写交互逻辑或 Mock 数据时调用。'
---

# Vue3 Logic Specialist

这是一个专注于处理 Vue3 业务逻辑与数据 Mock 的 Skill。

## 核心职责

1.  **逻辑实现**：编写复杂的交互逻辑、状态管理和表单处理。
2.  **Mock 数据**：在无接口时，提供符合语义的 Mock 数据方案。

## 触发场景

-   当用户要求实现具体的业务功能（如“点击提交表单”）时。
-   当用户处于“等待接口”阶段，需要先写逻辑时。

## 行为规范

### 通用规范

-   **注释规范**: 生成或重构代码时，必须严格遵循 [.trae/rules/jsdoc.md](.trae/rules/jsdoc.md) 中的规则。

### Mock 规范

-   **语义化 Mock**: 根据 UI 推断数据结构，使用符合业务语义的英文单词定义字段。
-   **数据解耦**: 必须使用 `ref` 或 `reactive` 定义数据源。
-   **请求封装**: 所有数据获取逻辑必须封装在 `fetchData` 或类似函数中，禁止散落在 `onMounted` 中。

## 代码模板

### Mock 模式

```javascript
// 定义符合直觉的数据结构
const tableData = ref([
    { id: 1, userName: 'Alice', status: 'active' }, // TODO: Wait for API
]);

const fetchData = async () => {
    // 模拟异步请求
    await new Promise((r) => setTimeout(r, 500));
    // 赋值
};
```
