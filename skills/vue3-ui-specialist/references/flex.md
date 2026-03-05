# Flex 布局常用类参考

本文档记录了 [flex.scss](/src/styles/common/flex.scss) 中定义的常用 Flex 布局类及其使用场景。

## 基础容器

- **.zdb-flex**
    - **描述**: 基础 Flex 容器。
    - **用途**: 设置元素为 `display: flex`。

## 对齐与分布

- **.zdb-flex-center**
    - **描述**: 水平垂直居中。
    - **用途**: 当需要子元素在容器中完全居中时使用。
- **.zdb-flexalign-start**
    - **描述**: 侧轴（垂直方向）顶部对齐。
    - **用途**: `align-items: flex-start`。
- **.zdb-flexalign-end**
    - **描述**: 侧轴（垂直方向）底部对齐。
    - **用途**: `align-items: flex-end`。
- **.zdb-flexalign-center**
    - **描述**: 侧轴（垂直方向）居中对齐。
    - **用途**: `align-items: center`。
- **.zdb-flexpack-center**
    - **描述**: 主轴（水平方向）居中对齐。
    - **用途**: `justify-content: center`。
- **.zdb-flexpack-end**
    - **描述**: 主轴（水平方向）尾部对齐。
    - **用途**: `justify-content: flex-end`。
- **.zdb-flexspace-between**
    - **描述**: 两端对齐，子元素之间间隔相等。
    - **用途**: `justify-content: space-between`。
- **.zdb-flexspace-around**
    - **描述**: 每个子元素两侧的间隔相等。
    - **用途**: `justify-content: space-around`。

## 子元素属性

- **.zdb-flexitem-1**
    - **描述**: 弹性缩放。
    - **用途**: 设置子元素占据剩余所有空间 (`flex: 1`)。

## 换行

- **.zdb-flex-wrap**
    - **描述**: 允许换行。
    - **用途**: `flex-wrap: wrap`。
