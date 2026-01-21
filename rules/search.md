---
alwaysApply: false
---

# 查找可用代码规则说明

本规则要求系统完成以下任务：

## 创建目录、文件与路由配置

如果用户没有指定模块名称，那么模块名称由系统自定义。完成以后，在`src/views`目录下新建同名目录，在该目录下新建`index.vue`文件，作为模块的首页。然后在`src/router/index.js`配置路由：

```javascript
// 下面这个是模块的首页
{
    path: '/im',
    name: 'im',
    component: () => import('@/views/im/index.vue'),
}
```

如果创建的是模块的子页面，就在这个模块目录的`children`目录下新建文件，文件名就是子页面的名称，例如：`setting.vue`，然后配置路由：

```javascript
// 下面这个是模块的子页面
{
    path: '/im/setting',
    name: 'im-setting',
    component: () => import('@/views/im/children/setting.vue'),
}
```

## 查找需要用到的组件

列出需要用到什么通用组件(每个组件的含义在文件`src\components\memory-back\DESCRIPTION.md`中)。

## 其他要求

完成本规则的任务后，不要编写代码，等用户确认后，再根据识别的内容编写代码。
