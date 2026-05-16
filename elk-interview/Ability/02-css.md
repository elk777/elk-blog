


### CSS选择器与优先级

#### 常见CSS选择器

CSS选择器用于匹配HTML文档中的元素，常见的选择器类型如下：

| 选择器类型 | 语法 | 示例 | 说明 |
|-----------|------|------|------|
| 元素选择器 | `标签名` | `div {}` | 选择所有指定标签元素 |
| 类选择器 | `.className` | `.box {}` | 选择所有含该 class 的元素 |
| ID选择器 | `#id` | `#header {}` | 选择指定 id 的元素 |
| 后代选择器 | `A B` | `div p {}` | 选择 A 内部所有 B（含嵌套） |
| 子代选择器 | `A > B` | `div > p {}` | 选择 A 的直接子元素 B |
| 相邻兄弟选择器 | `A + B` | `h1 + p {}` | 选择紧接在 A 后面的 B |
| 通用兄弟选择器 | `A ~ B` | `h1 ~ p {}` | 选择 A 之后所有的 B |
| 属性选择器 | `[attr]` | `[type="text"] {}` | 选择具有指定属性的元素 |
| 伪类选择器 | `:pseudo-class` | `a:hover {}` | 选择处于特定状态的元素 |
| 伪元素选择器 | `::pseudo-element` | `p::first-line {}` | 选择元素的特定部分 |

```css
/* 后代选择器 */
.container p { color: red; }

/* 子代选择器 */
.container > p { color: blue; }

/* 属性选择器 */
input[type="text"] { border: 1px solid #ccc; }

/* 伪类选择器 */
a:hover { color: orange; }
li:first-child { font-weight: bold; }
li:nth-child(2n) { background: #f5f5f5; }

/* 伪元素选择器 */
p::before { content: ">> "; }
p::after { content: " <<"; }
```

#### 选择器优先级

当多个选择器作用于同一元素时，浏览器根据优先级决定最终生效的样式。优先级从高到低依次为：

| 优先级 | 来源 | 权重值 |
|-------|------|--------|
| 1 | `!important` | 最高（慎用，会破坏层叠规则） |
| 2 | 内联样式 `style=""` | 1000 |
| 3 | ID选择器 `#id` | 100 |
| 4 | 类选择器 / 伪类 / 属性选择器 | 10 |
| 5 | 元素选择器 / 伪元素选择器 | 1 |
| 6 | 通配符 `*` / 继承的样式 | 0 |

优先级的计算方式：从左到右依次比较，每一位之间不进位。

```css
/* 权重: 0,1,0 */
.box { color: red; }

/* 权重: 0,0,1 */
p { color: blue; }

/* 权重: 1,0,0 — 最高优先级 */
#main { color: green; }

/* 权重: 0,1,1 — 类选择器 + 元素选择器 */
.container p { color: orange; }
```

实际开发中应尽量避免使用 `!important`，优先通过提高选择器特异性或调整样式顺序来解决优先级冲突。


### CSS盒模型

#### 盒模型的理解

CSS中每个元素都被视为一个矩形盒子，由四个部分组成，从内到外依次为：

- **content（内容区）**：元素的实际内容，由 `width` 和 `height` 控制
- **padding（内边距）**：内容与边框之间的空间
- **border（边框）**：围绕内边距和内容的边框线
- **margin（外边距）**：边框与其他元素之间的空间

```css
/* 标准盒模型（默认） */
.box {
  width: 200px;
  padding: 20px;
  border: 5px solid #333;
  margin: 10px;
  /* 实际占用宽度: 200 + 20*2 + 5*2 = 250px */
}

/* IE盒模型（border-box） */
.box {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 5px solid #333;
  /* 实际占用宽度: 200px（content 区域被压缩为 200 - 20*2 - 5*2 = 150px） */
}
```

`box-sizing: border-box` 在实际开发中被广泛使用，它让 `width` 包含 `padding` 和 `border`，使布局计算更加直观。通常在全局重置中使用：

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

#### margin 合并（Margin Collapsing）

在垂直方向上，相邻元素的 margin 会发生合并，取较大值而非相加。常见场景：

- 相邻兄弟元素的上下 margin
- 父元素与第一个/最后一个子元素的 margin
- 空元素自身的上下 margin

```css
/* 上元素 margin-bottom: 20px，下元素 margin-top: 30px */
/* 实际间距为 30px，而非 50px */
```


### CSS隐藏元素的方式

CSS中隐藏元素有多种方式，它们在行为上有本质区别：

| 方式 | 是否占据空间 | 是否触发事件 | 是否在DOM中 |
|------|------------|------------|------------|
| `display: none` | 否 | 否 | 是 |
| `visibility: hidden` | 是 | 否 | 是 |
| `opacity: 0` | 是 | 是 | 是 |
| `position: absolute` + 移出视口 | 否 | 是 | 是 |
| `z-index: -1`（被覆盖） | 是 | 视情况 | 是 |
| `clip-path: inset(50%)` | 是 | 否 | 是 |
| `width/height: 0` + `overflow: hidden` | 否 | 否 | 是 |

```css
/* display: none — 完全移除布局流 */
.hidden { display: none; }

/* visibility: hidden — 保留空间，不响应事件 */
.invisible { visibility: hidden; }

/* opacity: 0 — 保留空间，响应事件 */
.transparent { opacity: 0; }

/* 常用于无障碍隐藏：视觉隐藏但屏幕阅读器可读 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

**选用建议**：
- 需要完全移除元素对布局的影响：`display: none`
- 需要保留空间但隐藏：`visibility: hidden`
- 需要隐藏但仍可交互（如动画渐隐）：`opacity: 0`
- 无障碍场景（隐藏文字但屏幕阅读器可读）：`sr-only` 方案


### CSS水平居中与垂直居中

#### 水平居中

```css
/* 行内/行内块元素：text-align */
.parent { text-align: center; }

/* 块级元素：margin: 0 auto */
.child { width: 200px; margin: 0 auto; }

/* 绝对定位 + transform */
.child {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

/* flexbox */
.parent { display: flex; justify-content: center; }
```

#### 垂直居中

```css
/* 行内元素：line-height 等于 height */
.child { height: 40px; line-height: 40px; }

/* 绝对定位 + transform */
.child {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

/* flexbox */
.parent { display: flex; align-items: center; }

/* grid */
.parent { display: grid; place-items: center; }
```

#### 水平垂直同时居中

```css
/* 方式一：flexbox（推荐） */
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 方式二：grid（最简洁） */
.parent {
  display: grid;
  place-items: center;
}

/* 方式三：绝对定位 + transform */
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 方式四：绝对定位 + margin auto */
.child {
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  margin: auto;
  width: 200px;
  height: 100px;
}
```


### 弹性布局（Flexbox）

#### Flexbox基础概念

Flexbox（弹性盒子布局）是一种一维布局模型，用于在容器内高效地分配和对齐子元素。核心概念：

- **主轴（main axis）**：默认水平方向，由 `flex-direction` 决定
- **交叉轴（cross axis）**：垂直于主轴的方向
- **容器（flex container）**：设置了 `display: flex` 的父元素
- **项目（flex item）**：容器的直接子元素

```css
/* 容器属性 */
.container {
  display: flex;
  flex-direction: row;          /* 主轴方向：row | column | row-reverse | column-reverse */
  justify-content: center;      /* 主轴对齐：flex-start | center | space-between | space-around | space-evenly */
  align-items: center;          /* 交叉轴对齐：stretch | flex-start | center | flex-end | baseline */
  flex-wrap: wrap;              /* 换行：nowrap（默认） | wrap | wrap-reverse */
  align-content: flex-start;    /* 多行对齐（需 flex-wrap: wrap） */
  gap: 10px;                    /* 项目间距 */
}

/* 项目属性 */
.item {
  flex-grow: 1;     /* 放大比例，默认0（不放大） */
  flex-shrink: 1;   /* 缩小比例，默认1（空间不足时缩小） */
  flex-basis: 200px; /* 主轴初始尺寸 */
  flex: 1;          /* 简写 = flex-grow: 1; flex-shrink: 1; flex-basis: 0% */
  order: 0;         /* 排列顺序，数值越小越靠前 */
  align-self: auto; /* 单独设置交叉轴对齐 */
}
```

#### 常见布局场景

```css
/* 两栏布局：左侧固定宽度，右侧自适应 */
.layout {
  display: flex;
}
.sidebar { width: 200px; flex-shrink: 0; }
.main { flex: 1; }

/* 圣杯布局：头部+底部固定，中间三栏 */
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.header, .footer { height: 60px; }
.body {
  flex: 1;
  display: flex;
}
.left { width: 200px; flex-shrink: 0; }
.center { flex: 1; }
.right { width: 200px; flex-shrink: 0; }

/* 等分布局 */
.row {
  display: flex;
  gap: 16px;
}
.row > .col { flex: 1; }
```


### 响应式布局

#### 理解与原理

响应式布局是指网页能够根据不同设备的屏幕尺寸自动调整布局和内容展示，核心手段包括：

- **媒体查询（Media Queries）**：根据屏幕宽度应用不同样式
- **弹性单位**：`%`、`vw/vh`、`rem`、`em`
- **Flexbox / Grid**：弹性布局自动适配
- **图片响应式**：`max-width: 100%`

```css
/* 移动端优先（推荐） */
/* 默认样式：移动端 */
.container { padding: 16px; }

/* 平板 */
@media (min-width: 768px) {
  .container { max-width: 720px; margin: 0 auto; }
}

/* 桌面端 */
@media (min-width: 1024px) {
  .container { max-width: 960px; }
  .sidebar { display: block; }
}

/* 大屏 */
@media (min-width: 1440px) {
  .container { max-width: 1200px; }
}
```

#### rem 适配方案

```css
/* 根据屏幕宽度动态设置 html font-size */
html {
  font-size: 16px;
}

@media (min-width: 768px) {
  html { font-size: 18px; }
}

@media (min-width: 1024px) {
  html { font-size: 20px; }
}

/* 或通过 JS 动态计算（配合 postcss-pxtorem 等插件使用） */
/* document.documentElement.style.fontSize = document.documentElement.clientWidth / 10 + 'px' */
```

#### 视口单位

```css
/* vw: 视口宽度的 1% */
.full-width { width: 100vw; }

/* vh: 视口高度的 1% */
.full-height { height: 100vh; }

/* 结合 clamp() 实现流体排版 */
.title {
  font-size: clamp(1.5rem, 4vw, 3rem);
}
```


### BFC（块级格式化上下文）

#### 理解

BFC（Block Formatting Context）是页面中一块独立的渲染区域，内部元素的布局不会影响外部元素，外部元素也不会影响 BFC 内部。

#### 触发 BFC 的条件

满足以下任一条件即可触发 BFC：

- `overflow` 不为 `visible`（如 `auto`、`hidden`、`scroll`）
- `display: flow-root`（专门为触发 BFC 设计）
- `display: flex` / `inline-flex` / `grid` / `inline-grid`
- `position: absolute` / `fixed`
- `float` 不为 `none`
- 根元素 `<html>`

```css
/* 最常用方式 */
.bfc {
  overflow: hidden;
}

/* 更语义化的方式（推荐） */
.bfc {
  display: flow-root;
}
```

#### BFC 的特性与应用场景

**特性一：BFC 内部的 Box 会在垂直方向上一个接一个排列**

**特性二：BFC 的区域不会与 float 元素重叠**

```css
/* 两栏布局：左侧浮动，右侧触发 BFC 避免被覆盖 */
.left { float: left; width: 200px; }
.right { overflow: hidden; /* 触发 BFC */ }
```

**特性三：BFC 内部 margin 不会传递到外部（解决 margin 塌陷）**

```css
/* 父子元素 margin 塌陷问题 */
.parent {
  overflow: hidden; /* 触发 BFC，阻止子元素 margin 传递 */
}

/* 或者用 padding / border 替代 */
.parent {
  padding-top: 1px;
}
```

**特性四：BFC 计算高度时包含浮动元素（解决高度塌陷）**

```css
/* 清除浮动的常用方式 */
.clearfix::after {
  content: '';
  display: block;
  clear: both;
}

/* 或通过触发 BFC */
.container {
  overflow: hidden;
}
```
