---
alwaysApply: false
---

# 读取设计稿规则说明

当用户上传设计稿的时候，需要系统完成以下任务，并**用中文**输出结果

一、识别出这种是以下哪一种页面，开发的时候需要参考对应页面的代码。

- 列表页 - src/views/demo/list.vue
- 表单页 - src/views/demo/form.vue
- 底部弹出层 - src/views/demo/popup.vue
- 其他页面（没有参考）

二、点列出设计稿中每个页面的布局，由哪些结构组成，需要用到Iconfont中的哪个图标（每个图标的含义在`src\styles\memory-bank\iconfont.md`）,如果没有识别出来，也需要输出未识别到对应图标。

当识别页面完成后，不要编写代码，等用户确认并纠正后，再根据识别的内容编写代码。
