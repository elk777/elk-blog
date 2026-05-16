

### 前端性能指标（Web Vitals）

Google 提出的 Web Vitals 是衡量网页用户体验的核心指标：

| 指标 | 全称 | 含义 | 优秀标准 |
|------|------|------|---------|
| **LCP** | Largest Contentful Paint | 最大内容元素渲染时间 | ≤ 2.5s |
| **INP** | Interaction to Next Paint | 交互响应延迟（2024年取代 FID） | ≤ 200ms |
| **CLS** | Cumulative Layout Shift | 累计布局偏移 | ≤ 0.1 |
| **FCP** | First Contentful Paint | 首次有内容渲染时间 | ≤ 1.8s |
| **TTI** | Time to Interactive | 可交互时间 | ≤ 3.8s |
| **TBT** | Total Blocking Time | 总阻塞时间 | ≤ 200ms |
| **TTFB** | Time to First Byte | 首字节时间 | ≤ 800ms |

```javascript
// 使用 web-vitals 库监控
import { onLCP, onINP, onCLS, onFCP, onTTFB } from 'web-vitals';

onLCP(console.log);
onINP(console.log);
onCLS(console.log);
onFCP(console.log);
onTTFB(console.log);
```


### 网络优化

#### HTTP/2 & HTTP/3

- **HTTP/2**：多路复用、头部压缩（HPACK）、服务器推送、二进制分帧
- **HTTP/3**：基于 QUIC 协议（UDP），解决队头阻塞，连接建立更快
- 实际配置需服务器和 CDN 支持

#### CDN（内容分发网络）

```html
<!-- 静态资源使用 CDN -->
<script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.js"></script>
```

- 将静态资源分发到全球节点，用户就近访问
- 配置合理的缓存策略（长期缓存 + 文件名 hash）
- 国内常用：阿里云 CDN、腾讯云 CDN、又拍云

#### DNS 预解析与预连接

```html
<!-- DNS 预解析 -->
<link rel="dns-prefetch" href="https://api.example.com">

<!-- 预连接（DNS + TCP + TLS） -->
<link rel="preconnect" href="https://cdn.example.com">

<!-- 预加载关键资源 -->
<link rel="preload" href="/fonts/main.woff2" as="font" crossorigin>
```

#### 减少请求数

- 合理合并小文件（CSS Sprites、图标字体、SVG Sprite）
- 使用 HTTP/2 后合并的收益降低，更应关注单个资源的体积
- 接口合并：GraphQL 或 BFF 层聚合多个 API

#### 资源压缩

- **Gzip**：通用压缩，压缩比约 60-80%
- **Brotli**：Google 开发，压缩比优于 Gzip 约 15-25%
- 服务器配置开启压缩（Nginx 示例）：

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1024;

# Brotli（需安装模块）
brotli on;
brotli_types text/plain text/css application/json application/javascript;
```


### 资源加载优化

#### 懒加载与预加载

```html
<!-- 图片懒加载（原生） -->
<img src="photo.jpg" loading="lazy" alt="photo">

<!-- 图片懒加载（IntersectionObserver） -->
<script>
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
});
document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
</script>

<!-- 预加载关键资源 -->
<link rel="preload" href="/critical.css" as="style">
<link rel="preload" href="/hero.webp" as="image">

<!-- 预获取下一页资源 -->
<link rel="prefetch" href="/next-page.js">
```

#### 图片优化

| 格式 | 特点 | 适用场景 |
|------|------|---------|
| JPEG | 有损压缩，体积小 | 照片、大图 |
| PNG | 无损，支持透明 | Logo、图标、需要透明 |
| WebP | 有损+无损，比 JPEG 小 25-35% | 现代浏览器首选 |
| AVIF | 最新格式，压缩比最高 | 追求极致压缩 |
| SVG | 矢量，无损缩放 | 图标、简单图形 |

```html
<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" alt="hero">
</picture>
```

#### 代码分割与按需加载

```javascript
// React 懒加载组件
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

// Vue 路由懒加载
const routes = [
  {
    path: '/dashboard',
    component: () => import('./views/Dashboard.vue')
  }
];

// Webpack 魔法注释（命名 chunk）
const Admin = () => import(/* webpackChunkName: "admin" */ './Admin.vue');
```


### 渲染优化

#### 关键渲染路径优化

- CSS 放 `<head>` 中（避免 FOUC）
- JS 放 `<body>` 底部或使用 `async`/`defer`

```html
<!-- async：下载完立即执行，不保证顺序 -->
<script async src="analytics.js"></script>

<!-- defer：下载完等 DOM 解析完再按顺序执行 -->
<script defer src="app.js"></script>
```

#### 避免重排（Reflow）和重绘（Repaint）

**触发重排的操作：**
- 修改元素尺寸（width/height/padding/margin）
- 修改元素位置（top/left/position）
- 增删 DOM 元素
- 修改文字内容导致尺寸变化
- `window.resize`、`font-size` 变化

**优化策略：**

```javascript
// 批量修改 DOM（使用 DocumentFragment）
const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
  const div = document.createElement('div');
  fragment.appendChild(div);
}
container.appendChild(fragment);

// 读写分离（避免强制同步布局）
// 错误：读写交替触发强制同步布局
for (let i = 0; i < items.length; i++) {
  items[i].style.width = container.offsetWidth + 'px'; // 读了马上写
}

// 正确：先批量读，再批量写
const width = container.offsetWidth;
for (let i = 0; i < items.length; i++) {
  items[i].style.width = width + 'px';
}

// 使用 transform 代替 top/left（只触发合成层，不触发重排）
// 差
element.style.left = '100px';
// 好
element.style.transform = 'translateX(100px)';

// 使用 CSS contain 限制重排范围
.item { contain: layout style paint; }
```

#### 虚拟列表

渲染大量数据时，只渲染可视区域内的元素：

```javascript
// 原理示意
const visibleCount = Math.ceil(viewportHeight / itemHeight);
const startIndex = Math.floor(scrollTop / itemHeight);
const endIndex = startIndex + visibleCount;

// 只渲染 visibleCount + buffer 个元素
const visibleItems = list.slice(startIndex - buffer, endIndex + buffer);
```

常用库：`react-window`、`react-virtualized`、`vue-virtual-scroller`


### 构建优化

#### Tree Shaking

自动移除未使用的代码，需满足：
- 使用 ES Module（`import/export`），不能使用 CommonJS
- 配置 `package.json` 的 `sideEffects: false`

```json
// package.json
{
  "sideEffects": false
}
```

#### 代码压缩与混淆

```javascript
// vite.config.js
export default {
  build: {
    minify: 'terser',        // 或 'esbuild'（更快但压缩率稍低）
    terserOptions: {
      compress: {
        drop_console: true,  // 移除 console
        drop_debugger: true  // 移除 debugger
      }
    }
  }
};
```

#### 分包策略

```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-vue': ['vue', 'vue-router', 'pinia'],
          'vendor-ui': ['element-plus'],
          'vendor-echarts': ['echarts']
        }
      }
    }
  }
};
```

#### 持久化缓存

- 文件名带 hash：`app.3a7b2c.js`
- 配置长期缓存：`Cache-Control: max-age=31536000, immutable`
- 公共代码单独抽 chunk（避免修改业务代码导致 vendor hash 变化）


### 缓存策略

#### HTTP 缓存

**强缓存（不发请求，直接用缓存）：**

```
Cache-Control: max-age=31536000, immutable    # 缓存一年
Cache-Control: no-cache                       # 跳过强缓存，走协商缓存
Cache-Control: no-store                       # 不缓存
Expires: Thu, 01 Dec 2025 16:00:00 GMT       # 绝对过期时间（HTTP/1.0）
```

**协商缓存（发请求验证是否过期）：**

```
# 服务端返回
ETag: "33a64df5"                     # 资源的唯一标识（hash）
Last-Modified: Wed, 21 Oct 2024     # 资源最后修改时间

# 客户端请求
If-None-Match: "33a64df5"           # 搭配 ETag
If-Modified-Since: Wed, 21 Oct 2024 # 搭配 Last-Modified

# 304 Not Modified → 使用缓存
```

**推荐策略：**

| 资源类型 | 缓存策略 |
|---------|---------|
| HTML | `no-cache`（每次都验证） |
| 带 hash 的 JS/CSS | `max-age=1year, immutable` |
| 图片/字体 | `max-age=30days` |
| API 接口 | `no-store` 或 `no-cache` |

#### Service Worker 缓存

```javascript
// sw.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then(cache => {
      return cache.addAll(['/index.html', '/style.css', '/app.js']);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
```


### 运行时优化

#### 防抖与节流

```javascript
// 滚动事件用节流
window.addEventListener('scroll', throttle(handleScroll, 200));

// 输入搜索用防抖
input.addEventListener('input', debounce(handleSearch, 500));
```

#### Web Worker

将耗时计算放到独立线程，避免阻塞主线程：

```javascript
// main.js
const worker = new Worker('worker.js');
worker.postMessage({ data: largeArray });
worker.onmessage = (e) => console.log(e.data);

// worker.js
self.onmessage = (e) => {
  const result = heavyComputation(e.data);
  self.postMessage(result);
};
```

#### 虚拟滚动

数据量大时（1000+ 条），使用虚拟滚动只渲染可见区域：

```vue
<!-- vue-virtual-scroller -->
<RecycleScroller :items="list" :item-size="50" key-field="id">
  <template #default="{ item }">
    <div class="item">{{ item.name }}</div>
  </template>
</RecycleScroller>
```

#### 骨架屏

在数据加载完成前展示占位 UI：

```vue
<template>
  <div v-if="loading" class="skeleton">
    <div class="skeleton-line"></div>
    <div class="skeleton-line short"></div>
  </div>
  <div v-else>
    <!-- 真实内容 -->
  </div>
</template>
```


### 首屏加载优化

#### SSR / SSG

| 方案 | 特点 | 适用场景 |
|------|------|---------|
| CSR（客户端渲染） | 纯前端渲染，首屏白屏 | 管理后台 |
| SSR（服务端渲染） | 服务端生成 HTML，首屏快 | SEO 敏感、首屏要求高 |
| SSG（静态站点生成） | 构建时生成 HTML | 博客、文档站 |
| ISR（增量静态再生） | SSG + 按需重新生成 | 内容偶尔更新 |

```javascript
// Nuxt 3 SSR
export default defineNuxtConfig({
  ssr: true,
  nitro: {
    prerender: {
      routes: ['/about', '/contact']
    }
  }
});
```

#### 流式渲染

```javascript
// React 18 流式 SSR
import { renderToPipeableStream } from 'react-dom/server';

app.get('/', (req, res) => {
  const { pipe } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/app.js'],
    onShellReady() {
      res.setHeader('content-type', 'text/html');
      pipe(res);  // 流式发送 HTML
    }
  });
});
```

#### 组件异步加载

```javascript
// Vue 异步组件
const HeavyChart = defineAsyncComponent({
  loader: () => import('./HeavyChart.vue'),
  loadingComponent: LoadingSpinner,
  delay: 200,
  timeout: 5000
});
```

#### 预渲染

```javascript
// vite-plugin-ssr 或 vite-plugin-ssg
// 构建时预渲染关键路由为静态 HTML
export default {
  plugins: [
    prerender({ routes: ['/', '/about', '/products'] })
  ]
};
```


### 结合项目阐述实际优化经验

#### 典型优化场景与效果

**场景一：首屏加载优化**

```
问题：首屏 LCP 4.2s，TTI 6.1s
优化：
  1. 路由懒加载：首屏 JS 从 1.2MB 降到 350KB
  2. 首屏关键 CSS 内联：减少 FCP 0.8s
  3. 图片转 WebP + 懒加载：首屏图片体积减少 40%
  4. 第三方 SDK 延迟加载：GTM/GA 改为 idle 时加载
效果：LCP 降至 1.8s，TTI 降至 3.2s
```

**场景二：列表页渲染卡顿**

```
问题：1000+ 条数据列表滚动卡顿，FPS < 30
优化：
  1. 引入虚拟列表（只渲染可视区域 + 缓冲区）
  2. 长列表图片懒加载 + 占位图
  3. 避免 v-for 中使用 v-if（改为计算属性过滤）
  4. 对静态节点使用 v-once
效果：FPS 稳定 60，内存占用降低 60%
```

**场景三：Webpack 构建优化**

```
问题：开发环境 HMR 需要 12s，生产构建 3 分钟
优化：
  1. 升级到 Vite：开发启动 < 1s，HMR < 100ms
  2. 生产构建 splitChunks 优化：vendor 单独打包
  3. 开启 Brotli 压缩：产物体积减少 15%
  4. 配置持久化缓存：二次构建时间减少 70%
效果：开发体验显著提升，产物体积减小
```

**场景四：接口请求优化**

```
问题：首页需要 6 个串行接口，总耗时 2.3s
优化：
  1. 无依赖接口改为并行请求（Promise.all）
  2. 后端 BFF 层聚合接口，6 个请求合并为 2 个
  3. 列表数据开启 HTTP 缓存（ETag + max-age）
  4. 非首屏数据改为懒加载
效果：首屏接口耗时降至 600ms
```
