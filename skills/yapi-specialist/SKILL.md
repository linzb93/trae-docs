---
name: 'yapi-specialist'
description: '处理 YApi 接口文档相关任务。支持打开接口文档、独立生成类型定义，以及在解析接口实现代码时同步生成类型和注释。'
---

# YApi Specialist

这是一个专注于处理 YApi 接口文档相关任务的 Skill。

## 核心职责

1.  **打开文档**：根据接口路径查找并打开 YApi 文档页面。
2.  **生成类型**：独立解析 YApi 接口文档，生成接口类型定义文件 (`type.ts`)。
3.  **代码实现**：解析 YApi 接口文档，生成或修改业务代码，并同步生成类型定义和添加文档链接注释。

## 触发场景

- 当用户说“打开 xx 接口的文档”时。
- 当用户要求为某个接口生成类型定义时（独立使用）。
- 当用户提供 YApi 接口文档地址要求解析文档、生成代码或修改现有逻辑时（综合使用）。

## 行为规范

### 1. 打开接口文档

**指令**: 用户请求打开文档 (e.g., "打开 /api/demo... 的文档")。

**操作**:

- 运行以下命令:
    ```bash
    node .trae/skills/yapi-specialist/scripts/open-yapi.js <api_path>
    ```
- 脚本会自动读取 `docs/api/index.json`，匹配路径，构建 URL 并调用系统浏览器打开。

### 2. 独立生成接口类型

**指令**: 用户请求生成类型 (e.g., "生成这个接口的类型", "只生成 type.ts")。

**操作步骤**:

1.  **解析文档**:
    - 运行解析脚本:
        ```bash
        node .trae/skills/yapi-specialist/scripts/create/index.js {url}
        ```
    - 读取脚本输出中的 `project_id` 和 `doc_id`。
    - 在 `docs/api/content/{project_id}-{doc_id}` 目录下找到 `origin.json`。

2.  **生成文件**:
    - 在接口所属的**项目模块目录**下新建 `type.ts` 文件。
    - 如果该目录已有 `types/index.ts`，优先遵循现有规范，否则创建 `type.ts`。
    - **解析规则**: 解析返回值时，检查返回体顶层是否包含 `result` 字段。
        - **包含 `result`**: 提取 `result` 字段内部的结构作为主要类型定义。
        - **不包含**: 解析整个返回体结构。
    - 根据解析出的 `origin.json` 数据导出 Interface 定义。
    - **注意**: 如果没有提供具体的 JSON 响应数据，请根据上下文推断或请求用户提供数据。

### 3. 解析接口与代码生成

**指令**: 用户提供 YApi 接口文档地址 (e.g., "解析这个接口 http://...", "根据这个文档修改代码")。

**操作步骤**:

1.  **解析生成说明文件**:
    - 运行解析脚本 (同上):
        ```bash
        node .trae/skills/yapi-specialist/scripts/create/index.js {url}
        ```
    - 生成 `api.md` 用于参考。

2.  **生成接口类型 (`type.ts`)**:
    - 执行与 **“2. 独立生成接口类型”** 相同的步骤，确保 `type.ts` 存在且是最新的。

3.  **生成/修改业务代码**:
    - **原则**: 以接口文档为准。不要在代码中新增接口文档中没有的字段。
    - **字段修正**: 直接修改字段名为文档中的名称 (e.g., `cycle` -> `days`)，包括`script`和`template`里面，**禁止**使用映射/Adapter。
    - **保留**: 表单标签名、表格列名、原有逻辑保持不变。
    - **添加注释**: 在调用函数上方添加 JSDoc `@file` 注释，链接格式: `http://192.168.0.107:3000/project/{projectId}/interface/api/{id}` (通过查找 `docs/api/index.json` 获取)。
    - **代码示例**:
        ```javascript
        /**
         * @file http://192.168.0.107:3000/project/1386/interface/api/97271
         * @type {import('./types').IMConfig}
         */
        await post('/api/demo', {
            data: 1,
        });
        ```
        ```typescript
        /**
         * IM配置接口
         * @file http://192.168.0.107:3000/project/1386/interface/api/97271
         */
        export interface IMConfig {
            data: number;
        }
        ```
