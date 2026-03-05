# Component Descriptions

## src/components/ui

- `/components/ui/Alert.vue`: 警告框组件，支持自定义背景色、文本颜色，并提供前缀、内容和右侧按钮的插槽。
- `/components/ui/FixBottom.vue`: 底部固定按钮组件，通常用于页面底部的提交或操作按钮。
- `/components/ui/BottomPopup.vue`: 底部弹窗组件。
- `/components/ui/form/src/ActionSheet.vue`: 表单动作面板组件，封装了 `van-action-sheet`，用于表单中的选择操作。
- `/components/ui/form/src/Checkbox.vue`: 表单复选框组件，在一个底部弹窗中展示 `van-checkbox-group` 供用户选择。
- `/components/ui/form/src/Form.vue`: 表单容器组件，处理表单的验证和提交逻辑，支持自定义提交按钮。
- `/components/ui/form/src/FormItem.vue`: 表单项组件，负责表单项的布局、标签显示以及描述信息，包裹具体的表单控件。
- `/components/ui/form/src/Input.vue`: 表单输入框组件，封装了原生 input 元素，处理输入事件和样式。
- `/components/ui/form/src/MtTextarea.vue`: 表单文本域组件，在一个底部弹窗中展示 `van-field` (type="textarea") 供用户输入多行文本。
- `/components/ui/form/src/Picker.vue`: 表单选择器组件，在一个底部弹窗中展示 `van-picker` 供用户滚动选择。

## src/components/common

- `/components/common/SettingHeader.vue`: 设置页头部组件。
- `/components/common/SettingBottom.vue`: 设置页底部组件。
