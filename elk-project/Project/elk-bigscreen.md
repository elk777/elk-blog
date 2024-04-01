## vue3大屏可视化

### 前言
本项目基于vue3.4+echarts5来实现数据可视化展示模版，采用了scale动态屏幕适配方案，来解决浏览器放大、缩小导致数据大屏变形的问题。

代码仓库：https://github.com/elk777/elk-largeScreen

### 项目概述
> 1、搭建：基于官网： npm create vue@latest 创建的应用。

> 2、设计：按照 1920*1080比例设计，支持不同尺寸的同比例缩放。

> 3、按需加载：Echarts数据采用了按需引入的方式。

### 数据模拟
本项目采用json-server工具模拟后端api服务，封装了axios请求。
### 屏幕适配方案
1、vw/vh：按照设计稿尺寸，将px按比例换算为vw和vh。

2、scale：根据屏幕大小进行等比例缩放，通过设计稿宽高比和窗口宽高比的大小，决定使用宽比还是高比。

3、rem/vw/vh：动态计算html根元素的font-size从而改变rem的大小。

本项目采用的是方案二「scale」
#### 实现思路
如果**屏幕宽高比 > 设计稿宽高比**，则按照**屏幕宽/设计稿宽缩放**。

如果**屏幕宽高比 < 设计稿宽高比**，则按照**屏幕高/设计稿高缩放**。

假设我们的设计稿宽高为：1920✖️1080px，我们的屏幕大小是1440✖️900px，此时1440/900 = 1.6，1920/1080 = 1.7。

此时 1.7 > 1.6 「设计稿宽高比 大于 屏幕宽高比」

我们需要缩放的比例是：屏幕宽度/设计稿宽度 = 1440/1920 = 0.75
#### 实现方案
缩放hooks函数的封装，核心代码在resize这个函数中，主要也是根据上方的实现思路去进行设计实现。
##### 设计
```javascript
import { ref, onMounted, onBeforeUnmount } from 'vue'
// 默认适配宽高
export const width = 1920
export const height = 1080
export const useResize = (options = {}) => {
  const { w = width, h = height } = options
  const scale = ref(1)
  const screenRef = ref()
  function resize() {
    const clientWidth = document.documentElement.clientWidth || document.body.clientWidth,
      clientHeight = document.documentElement.clientHeight || document.body.clientHeight,
      scaleW = clientWidth / w,
      scaleH = clientHeight / h
    if (clientWidth / clientHeight > w / h) {
      scale.value = scaleH
    } else {
      scale.value = scaleW
    }
    screenRef.value.style.transform = `scale(${scale.value}) translate(-50%, -50%)`
  }
  onMounted(() => {
    if (screenRef.value) {
      resize()
      screenRef.value.style.width = `${width}px`
      screenRef.value.style.height = `${height}px`
      window.addEventListener('resize', resize)
    }
  })
  onBeforeUnmount(() => {
    console.log('实例卸载了吗....')
    window.removeEventListener('resize', resize)
  })
  return { screenRef, scale }
}

```
##### 使用
```javascript
<template>
    <div ref="screenRef">
        xxx
    </div>
</template>

<script>
import { useResize } from '@/hooks/viewportResize/index.js'
const { screenRef } = useResize()  
</script>
```

### 图表组件封装

#### 安装插件

```javascript
npm install echarts -S
```
#### 目录结构
```
components
  Chart
    options
       bar.js
       line.js
       xxx
    config.js
    index.vue
```

options/xxx.js：里面存放不同图表中的配置项「例如：banr.js 存储圆柱图表配置」。

config.js: echarts的图表和组件统一管理「按需引入」。

index.vue：echart组件的封装核心。

#### 封装和使用

index.vue 接收四个参数：

- width 图表宽度

- height 图表宽度

- autoResize 是否自动调整大小

- chartOption 图表的配置
      

```javascript
<template>
  <div class="chart-container">
    <div ref="chart" :style="{ height: height, width: width }"></div>
  </div>
</template>

<script setup>
import echarts from './config.js'
import { ref, onMounted, onBeforeUnmount, watch, markRaw } from 'vue'
/* 接收传递的参数 */
const props = defineProps({
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '500px'
  },
  autoResize: {
    type: Boolean,
    default: true
  },
  chartOption: {
    type: Object,
    required: true
  }
})

/* 监听数据变化 */
watch(
  () => props.chartOption,
  (newVal) => {
    setOptions(newVal)
  }
)
/* 定义chart */
let chart = ref(null)
/* 初始化图表 */
const initChart = () => {
  chart.value = markRaw(echarts.init(chart.value))
  chart.value.setOption(props.chartOption)
}
/* 开启图表自适应 */
const openResize = () => {
  chart.value.resize()
}
/* 清除图表 */
const clearChart = () => {
  chart.value.dispose()
}
/* 更新配置信息 */
const setOptions = () => {
  clearChart()
  openResize()
  if (chart.value) {
    chart.value.setOption(props.chartOption)
  }
}
onMounted(() => {
  initChart()
  if (chart.value && props.autoResize) {
    window.addEventListener('resize', openResize)
  }
})
onBeforeUnmount(() => {
  if (chart.value && props.autoResize) {
    window.removeEventListener('resize', openResize)
  }
  chart.value.dispose()
  chart.value = null
})
</script>

```
- 注册组件 /src/man.js
```javascript
import chartView from './components/Chart/index.vue'
app.component('chart-view', chartView)
```
- 使用组件
```javascript
<template>
    <chart-view :chart-option="barOption" :auto-resize="true" :height="'100%'" />
</template>
<script>
import {ref} from 'vue'
const barOption = ref({
    xxxx
})
</script>
```
### 总结
本项目重点就是**屏幕适配**和**图表的组件封装**，此项目中的适配方案「scale」其实也有对应的第三方库，直接使用更方便「v-scale-screen、autofit.js」
图表的封装，每个人都有自己的封装习惯，都是为了复用，自己用着顺手就行。
