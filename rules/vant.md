---
alwaysApply: false
---

本文件是使用 vant 组件的规则。

# Toast

- 需要用到 Toast 时，不要使用 `this.$toast` 来调用，应该是引入`Toast`。

# Dialog

- 需要用到 Dialog 时，不要使用 `this.$dialog` 来调用，应该是引入`Dialog`。
- Dialog 不能通过`<van-dialog />`来调用,有需要使用弹窗的请使用`<van-popup />`组件。

# List

- 使用<van-list/>组件时，需要设置 `finished-text` 属性。loading 属性初始值为 true，finished 属性初始值为 false。
