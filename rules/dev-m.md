---
alwaysApply: false
---

# 编写代码规则说明

## 样式

样式的规则请查看 [样式调用规则](styles.md)，需要将该文件内容添加进上下文。

## 其他

- 在`.vue`文件中，定义变量不要使用`reactive`，全部使用`ref`。
- 使用`ref`访问子组件时，请使用`useTemplateRef`，如：`const childRef = useTemplateRef('childRef')`。
- 项目编写完后，不需要在终端运行任何代码。
- 这个是移动端的项目，尺寸需要按移动端的大小来设置，是系统识别到的尺寸的2倍。
- 组件的使用，优先使用项目封装的组件，其次是`vant`的组件，最后才是系统自己写组件。
