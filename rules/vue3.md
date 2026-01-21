---
alwaysApply: false
---
# 将Vue2文件重构成Vue3规则说明
重构完就可以，系统不需要说明改了什么，除非有什么建议。
以下是重构要求：
1. 所有filters都需要用methods来实现
2. 使用组合式API的setup语法糖实现，如：
```vue
<script setup>
import { ref } from 'vue';
const count = ref(0);
function handleClick() {
    count.value++;
}
</script>
```
3. 定义可变值不使用`reactive`，只使用`ref`。
4. 属性中的`.sync`修饰符，在Vue3中被移除，需要用`v-model`来替代，例如：
```vue
<template>
    <!-- vue2 -->
    <popup :visible.sync="visible" />
    <!-- vue3 -->
    <popup v-model:visible="visible" />
</template>
```
5. 将同一功能的状态、方法、计算属性等聚合在一起。
6. 在vue2中，子组件需要使用`ref`的，在vue3中，需要引入vue的`useTemplateRef`来使用。
7. 对于双向绑定的变量，主要是弹窗组件控制弹窗显示，在子组件中，请使用`defineModel`定义。
