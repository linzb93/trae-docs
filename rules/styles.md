---
alwaysApply: false
---

# 样式调用规则说明

## Flex布局工具类说明

所有布局相关的请使用`flex`，不要使用`grid`。

### 基础类

- `.zdb-flexitem-1` - 设置 flex 子元素的伸缩比例为 1，如果有超过2个元素在一行左右顶格排列，可以使用这个，例如：

```html
<div class="box zdb-flex">
    <div class="zdb-flexitem-1 zdb-flex">
        <div class="child1" />
        <div class="child2" />
    </div>
    <div class="child3" />
</div>
```

### 垂直对齐类

- `.zdb-flex-center` - 水平垂直居中，子元素只有一个。
- `.zdb-flexalign-start` - 垂直方向顶部对齐
- `.zdb-flexalign-end` - 垂直方向底部对齐
- `.zdb-flexalign-center` - 垂直方向居中对齐

### 水平分布类

- `.zdb-flexpack-center` - 水平方向居中对齐
- `.zdb-flexpack-end` - 水平方向右对齐
- `.zdb-flexspace-between` - 水平方向两端对齐，项目间隔相等

## 细边框类说明

当元素有一条细边框时，请使用下面这些类

- `.border-t` - 上边框，在`before`伪类中修改border-color
- `.border-l` - 左边框，在`after`伪类中修改border-color，下同。
- `.border-b` - 下边框。
- `.border-r` - 右边框。
  `border-radius`也是在伪类中修改，数值是正常的2倍。

## 其他要求

- `font-weight`不要使用数字，请使用`normal`或者`bold`。
- 父组件改写子组件样式，不要使用`::v-deep`，请使用`:deep()`。
