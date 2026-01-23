---
name: 'vue3-api-specialist'
description: '专注 Vue3 逻辑与数据对接。当需要编写交互逻辑、Mock 数据、对接 API 或根据接口文档重构字段时调用。'
---

# Vue3 Logic & API Integration Specialist

这是一个专注于处理 Vue3 业务逻辑、数据 Mock 以及后端 API 对接的 Skill。

## 核心职责

1.  **逻辑实现**：编写复杂的交互逻辑、状态管理和表单处理。
2.  **Mock 数据**：在无接口时，提供符合语义的 Mock 数据方案。
3.  **API 对接**：根据接口文档（JSON），对接真实 API 并处理字段映射。

## 触发场景

- 当用户提供接口文档（JSON）要求对接时。
- 当用户要求实现具体的业务功能（如“点击提交表单”）时。
- 当用户处于“等待接口”阶段，需要先写逻辑时。

## 行为规范

### 通用规范

- **注释规范**: 生成或重构代码时，必须严格遵循 [.trae/rules/jsdoc.md](.trae/rules/jsdoc.md) 中的规则。

### 阶段一：无接口（Mock 阶段）

- **语义化 Mock**: 根据 UI 推断数据结构，使用符合业务语义的英文单词定义字段。
- **数据解耦**: 必须使用 `ref` 或 `reactive` 定义数据源。
- **请求封装**: 所有数据获取逻辑必须封装在 `fetchData` 或类似函数中，禁止散落在 `onMounted` 中。
- **预留注释**: 在关键数据定义处添加注释 `// TODO: API_FIELD_MAPPING`，便于后续替换。

### 阶段二：有接口（对接/重构阶段）

- **结构映射**: 对比“现有 Mock 字段”与“真实 API 字段”，生成映射关系。
- **适配器模式**: 如果字段差异过大，优先创建一个 Adapter 函数转换数据，而不是重写整个 UI 模板。
    - _Example_: `const uiData = adaptApiToUi(apiResponse)`
- **字段重构**: 如果差异较小，使用重构工具批量替换变量名。
- **类型修正**: 检查并修正数据类型不一致的问题（如 `null` vs `[]`）。

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

### 对接模式 (Adapter)

```javascript
// 接口返回: { user_id, u_name, st_code }
// UI 需要: { id, userName, status }

const adaptUser = (data) => ({
    id: data.user_id,
    userName: data.u_name,
    status: data.st_code === 1 ? 'active' : 'inactive',
});
```
