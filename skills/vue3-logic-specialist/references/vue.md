# vue使用规范

针对使用vue3的项目编写的规范。

## computed

- 计算属性不使用`get`和`set`方法，只使用`get`方法。

```js
import { computed } from 'vue';

// 示例代码
const count = ref(0);
const doubleCount = computed(() => count.value * 2);
```

## ref与reactive

禁止使用`reactive`，统一使用`ref`声明响应式变量。

## defineModel

所有弹窗显示的控制，请使用`defineModel`方法，而不是`props`配合`emit`。
