# vant组件使用规范

## 列表展示规范

列表分为有分页列表和无分页列表。

- **空值判断**：所有列表都必须具备空数据状态的处理逻辑。默认空值提示文案是“暂无数据”。

### 有分页列表

- **分页反馈**：分页列表在加载完成后，必须显示“没有更多了”的文案。

```html
<van-list :data="list" :loading="loading" :finished="finished">
    <template #finished>
        <empty v-if="list.length === 0">暂无数据</empty>
        <p v-else>没有更多了</p>
    </template></van-list
>
```

### 无分页列表

无分页列表不使用`<van-list>`组件，用变量`loaded`控制显示，初始值为`false`。在数据加载完成后，将`loaded`设为`true`。

```html
<template v-if="loaded">
    <ul class="list" v-if="list.length > 0">
        <li v-for="item in list" :key="item.id">{{ item.name }}</li>
    </ul>
    <empty v-else>暂无数据</empty></template
>
```

## 弹窗 (Popup) 清理机制

- **列表清理**：弹窗关闭后（触发 `closed` 事件），必须清空其中的列表数据。
- **分页重置**：如果列表涉及分页，关闭时需将 `pageIndex` 重置为 `1`。
- **状态重置**：对于分页列表，使用`<van-list>`组件，关闭时需将 `loading` 设为 `true`，`finished` 设为 `false`。
- **表单清理**：弹窗关闭后，内部表单数据必须清空。如果使用了表单验证组件（如 Vant 的 Form），必须调用 `resetFields` 或类似方法重置验证状态和数据。

## 日历组件（van-calendar）

- **日期选择**：如果用户选择日期范围，需要将`allow-same-day`设为`true`，允许选择同一天。
- **iOS兼容问题**：在 iOS 设备上，日历组件的日期选择可能会有兼容性问题，导致刚打开的时候白屏。因此需要添加以下代码：

```js
import { nextTick, watch } from 'vue';

watch(showCalendar, (newVal) => {
    if (!newVal) {
        return;
    }
    nextTick(() => {
        const dom = document.querySelector('.van-calendar__body');
        if (dom) {
            let scrollTop = dom.scrollTop;
            // 模拟滑动，避免白屏
            setTimeout(() => {
                scrollTop = dom.scrollTop;
                dom.scrollTop = scrollTop - 4;
            }, 50);
            setTimeout(() => {
                dom.scrollTop = scrollTop;
            }, 100);
        }
    });
});
```

## 提示(Toast / Dialog)

在本项目使用的vant v4版本中，不是直接引入提示组件（Toast / Dialog）本身，而是有`showToast`和`showDialog`等方法。

```js
// vant v4中使用的提示方法
import { showToast, showDialog, showConfirmDialog, showLoadingToast, closeToast } from 'vant';
```

## 使用原生HTML标签，而不是vant组件的元素

- 图片(Image)
- 按钮(Button)
- 输入框(Input)
- 表单(Form)
