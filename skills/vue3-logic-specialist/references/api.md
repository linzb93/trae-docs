# API 接口规范

本规范定义了 Skill 在处理接口相关功能时的标准和要求。

## 1. 接口类型限制

- **只允许使用 POST 类型请求**
- **禁止使用 GET、PUT、DELETE 等其他类型请求**

## 2. 类型声明文件

在 `types/index.ts` 文件中为所有接口的出入参编写 TypeScript 类型声明。

### 示例格式

```typescript
export interface LoginRequest {
    username: string; // 用户名，用于身份验证的唯一标识
    password: string; // 密码，用户登录凭证
}

export interface LoginResponse {
    ok: boolean; // 登录校验结果，true表示验证通过，false表示验证失败
    token: string; // 用户身份令牌，验证成功后返回，用于后续接口调用
    userId: number; // 用户ID，验证成功后返回的用户唯一标识
}
```

## 3. 接口调用文件

创建单独的 API 调用文件（如 `shared/api.js`），所有接口调用代码必须放在此文件中，禁止直接在 `.vue` 文件中编写接口调用代码。

### 示例格式

```javascript
import { post } from '@/utils/request';

/**
 * 用户登录接口
 * @param {import('../types').LoginRequest} data 登录请求参数
 * @returns {Promise<import('../types').LoginResponse>}
 */
export const login = (data) => {
    return post('/login', data);
};
```

## 4. Mock 接口规范

### 4.1 Mock 数据文件

在对应模块目录下创建 `mock.json` 文件，写入模拟数据，**严禁在代码中硬编码模拟数据**。

```json
{
    "login": {
        "ok": true,
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
        "userId": 12345
    }
}
```

### 4.2 使用方式

使用 `json-server` 启动本地服务，通过 `@/utils/request` 工具方法请求 Mock 接口（设置 `{ useMock: true }` 参数）。

```javascript
// 在业务逻辑中调用
const res = await login({ username, password }, { useMock: true, showLoading: false });
```

## 5. API 文档规范

在模块目录下创建一个 `.md` 文档（如 `api-docs.md`），记录：

- Mock 接口地址及含义
- 入参、出参字段及其含义，**每个字段都需备注其业务含义**

### 示例格式

```markdown
# 用户登录接口

- **接口地址**: `POST /login`
- **含义**: 校验用户名与密码并返回结果
- **入参**:
    - `username` (string): 用户名，用于身份验证的唯一标识
    - `password` (string): 密码，用户登录凭证，需加密传输
- **出参**:
    - `ok` (boolean): 登录校验结果，true表示验证通过，false表示验证失败
    - `token` (string): 用户身份令牌，验证成功后返回，用于后续接口调用
    - `userId` (number): 用户ID，验证成功后返回的用户唯一标识
```

## 6. 在 Vue 组件中的使用

在 `.vue` 文件中，通过导入 API 文件来使用接口：

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { login } from './shared/api';

const loading = ref(false);

/**
 * 处理登录按钮点击
 * @param {string} username 用户名
 * @param {string} password 密码
 */
async function onSubmit(username: string, password: string) {
    if (!username || !password) {
        alert('请输入用户名和密码');
        return;
    }

    loading.value = true;
    try {
        const res = await login({ username, password }, { useMock: true, showLoading: false });
        if (res?.ok) {
            // 路由跳转逻辑
        } else {
            alert('用户名或密码错误');
        }
    } finally {
        loading.value = false;
    }
}
</script>
```

## 7. 禁止事项

- ❌ 禁止在 `.vue` 文件中直接编写接口调用代码
- ❌ 禁止使用 GET、PUT、DELETE 等非 POST 类型请求
- ❌ 禁止在代码中硬编码模拟数据
- ❌ 禁止省略接口字段的业务含义说明