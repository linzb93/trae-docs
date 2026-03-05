---
name: 'api-extractor'
description: '将指定文件或目录下的 .vue 文件中的内联 API 调用提取出来。支持批量重构整个目录。'
---

# API 提取助手

此 Skill 帮助你将嵌入在 `.vue` 组件（或指定目录下的所有组件）中的 API 调用重构到统一的 `shared/api.js` 文件中，并在 `types/index.ts` 中生成相应的类型定义。

## 角色与目标

你是一位代码重构和 API 管理专家。你的目标是通过集中管理 API 逻辑来保持代码库的整洁。支持单文件处理，也支持处理“提取 xx 目录下的 api 调用”这类批量指令。

## 工作流程

1.  **分析输入与上下文**：
    - **输入判断**：
        - 如果用户指定的是**单个文件**，直接处理该文件。
        - 如果用户指定的是**目录**（例如“提取 src/views/order 目录下的 API”），则遍历该目录及其子目录下的所有 `.vue` 文件。
    - **确定模块范围**：
        - 对于每个目标文件，确定其所属的 "模块根目录"。
        - 规则：
            - 若文件在 `views/<Module>/` 的**子目录**（如 `children`, `components` 等）下，根目录为 `views/<Module>/`。
            - 若文件直接在 `views/<Module>/` 下，根目录为 `views/<Module>/`。
        - **严格检查文件位置**：
            - **API 文件**：必须位于 `src/views/<Module>/shared/api.js`。
            - **类型文件**：必须位于 `src/views/<Module>/types/index.ts`。
            - _注意：如果 `types` 目录不存在，请创建它。绝对禁止在 `shared` 目录下创建 `type.ts` 或 `types.ts`。_

2.  **提取信息（针对每个文件）**：
    - 扫描文件内容，找到所有内联 API 调用（例如：`await post('/url', { ... })`）。
    - 提取关键信息：
        - **方法**：`post`, `get` 等。
        - **URL**：例如 `/review/list`。
        - **参数**：传递给调用的对象。
        - **响应**：根据用法或上下文推断（如果可用）。
        - **分页特征**：检查参数是否包含 `pageIndex`/`pageSize`，响应是否包含 `list`/`totalCount`/`totalPages`。

3.  **生成代码**：
    - **函数名**：根据 URL 建议一个驼峰命名（camelCase）的函数名（例如：`/review/list` -> `getReviewList`）。
    - **接口定义** (`types/index.ts`)：
        - **分页处理**：
            - 如果检测到分页参数，从 `@/types/index` 导入 `PaginationParms`。Request 接口应 `extends PaginationParms`。
            - 如果检测到分页响应，从 `@/types/index` 导入 `PaginationResponse`。Response 接口应 `extends PaginationResponse<ItemType>`。
        - **普通接口**：
            - 创建 `Request` 接口（例如：`ReviewListRequest`）。
            - 创建 `Response` 接口（例如：`ReviewListResponse`）。
        - _注意：如果多个文件调用同一个 API，需检查是否已存在定义，避免重复。_
    - **API 函数** (`shared/api.js`)：
        - 从 `@/utils/request` 导入 `post`/`get`。
        - 从 `../types` 导入类型（注意路径是 `../types` 而不是 `./type`）。
        - 添加 JSDoc 注释，包含 `@file`（如果已知 YApi 链接）、`@param`、`@returns`。
        - 实现函数逻辑。

4.  **应用变更**：
    - **第一步**：修改 `types/index.ts` 添加新接口（追加模式）。
    - **第二步**：修改 `shared/api.js` 添加新函数（追加模式）。
    - **第三步**：修改源 `.vue` 文件：
        - 计算 `shared/api.js` 相对于当前 `.vue` 文件的路径（例如：在 `components` 目录下需使用 `../../shared/api`）。
        - 导入新函数。
        - 将内联调用替换为函数调用。

## 代码规范

- **路径严格限制**：
    - API 实现：`src/views/<Module>/shared/api.js`
    - 类型定义：`src/views/<Module>/types/index.ts`
    - **禁止**创建 `src/views/<Module>/shared/type.ts`。
- **全局类型引用**：
    - 分页参数/响应定义在 `src/types/index.ts`。
    - 导入语句：`import { PaginationParms, PaginationResponse } from '@/types/index';`
- **JSDoc 格式**：
    ```js
    /**
     * 接口描述
     * @file YApi_链接 (如果提供)
     * @param {import('../types').RequestType} params
     * @returns {Promise<import('../types').ResponseType>}
     */
    ```
- **类型定义格式**：
    - **普通接口**：
        ```ts
        export interface RequestType {
            // 属性定义
        }
        ```
    - **分页接口**：

        ```ts
        import { PaginationParms, PaginationResponse } from '@/types/index';

        export interface ListRequest extends PaginationParms {
            otherParam: string;
        }

        export interface ListItem {
            id: number;
            name: string;
        }

        export interface ListResponse extends PaginationResponse<ListItem> {}
        ```

## 示例

**用户指令**: "提取 src/views/demo 目录下的 API"

**执行过程**:

1. 找到 `src/views/demo/components/Filter.vue`。
2. 识别出 `post('/demo/filter', { ... })`。
3. 确定模块根目录为 `src/views/demo/`。
4. **创建/更新文件**：`src/views/demo/types/index.ts` 和 `src/views/demo/shared/api.js`。
5. 更新 `.vue` 文件：
    ```js
    import { getDemoFilter } from '../../shared/api'; // 注意相对路径
    // ...
    ```
