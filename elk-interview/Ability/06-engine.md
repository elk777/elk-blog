

### Webpack 的基本概念和核心作用

Webpack 是一个**模块打包工具**，将项目中的各种资源（JS、CSS、图片、字体等）视为模块，通过依赖分析打包成浏览器可运行的静态资源。

#### 核心概念

| 概念 | 说明 |
|------|------|
| **Entry（入口）** | 打包的起点，Webpack 从入口文件开始构建依赖图 |
| **Output（出口）** | 打包后输出的文件路径和文件名 |
| **Module（模块）** | 项目中的每个文件都是一个模块（JS/CSS/图片等） |
| **Chunk（代码块）** | 打包过程中被组合的模块集合（entry chunk / async chunk） |
| **Bundle（产物）** | 最终输出的文件（一个或多个 chunk 组成） |
| **Loader（加载器）** | 让 Webpack 能处理非 JS 文件（将 CSS/TS 等转为 JS） |
| **Plugin（插件）** | 扩展 Webpack 功能（打包优化、资源管理等） |
| **Mode（模式）** | `development` / `production` / `none`，内置对应优化 |

```javascript
// webpack.config.js 基础配置
const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash:8].js',
    clean: true  // 构建前清理 dist
  },
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.tsx?$/, use: 'ts-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './public/index.html' })
  ]
};
```


### 如何配置多环境的不同构建配置

#### 方案：cross-env + webpack-merge

```
webpack.common.js   # 公共配置
webpack.dev.js      # 开发环境
webpack.prod.js     # 生产环境
```

```javascript
// webpack.common.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash:8].js'
  },
  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './public/index.html' })
  ]
};

// webpack.dev.js
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    port: 8080,
    hot: true,
    open: true
  }
});

// webpack.prod.js
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimizer: [new TerserPlugin({ parallel: true })],
    splitChunks: { chunks: 'all' }
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'css/[name].[contenthash:8].css' })
  ]
});
```

```json
// package.json
{
  "scripts": {
    "dev": "cross-env NODE_ENV=development webpack serve --config webpack.dev.js",
    "build": "cross-env NODE_ENV=production webpack --config webpack.prod.js"
  }
}
```

#### 通过 DefinePlugin 注入环境变量

```javascript
const webpack = require('webpack');

plugins: [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.API_BASE': JSON.stringify('https://api.example.com')
  })
]
```


### 入口和出口配置

#### 单入口

```javascript
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
};
```

#### 多入口

```javascript
module.exports = {
  entry: {
    main: './src/index.js',
    admin: './src/admin.js'
  },
  output: {
    filename: '[name].[contenthash:8].js'  // [name] 对应 entry 的 key
  }
};
```

#### 动态入口

```javascript
module.exports = {
  entry: () => {
    // 根据条件动态生成入口
    return {
      main: './src/index.js',
      ...getPlugins()
    };
  }
};
```

#### Output 常用配置

| 配置项 | 说明 | 示例 |
|--------|------|------|
| `path` | 输出目录 | `path.resolve(__dirname, 'dist')` |
| `filename` | 文件名模板 | `[name].[contenthash:8].js` |
| `publicPath` | 资源引用前缀 | `https://cdn.example.com/` |
| `clean` | 构建前清理输出目录 | `true` |
| `assetModuleFilename` | 静态资源文件名 | `assets/[hash:8][ext]` |


### Loader 和 Plugin 的作用和区别

#### 核心区别

| 对比项 | Loader | Plugin |
|--------|--------|--------|
| 作用 | **转换**文件内容（模块层面） | **扩展** Webpack 功能（构建层面） |
| 工作时机 | 模块加载时（每个文件） | 整个构建过程的生命周期钩子 |
| 配置位置 | `module.rules` | `plugins` 数组 |
| 输入输出 | 接收源文件 → 输出转换后的文件 | 监听构建事件 → 执行自定义逻辑 |

#### 常见 Loader

| Loader | 作用 |
|--------|------|
| `babel-loader` | ES6+ 转 ES5 |
| `ts-loader` / `esbuild-loader` | TypeScript 编译 |
| `css-loader` | 解析 CSS 中的 `@import` 和 `url()` |
| `style-loader` | 将 CSS 注入到 `<style>` 标签 |
| `less-loader` / `sass-loader` | 预处理器编译 |
| `file-loader` / `asset/resource` | 处理文件资源 |
| `url-loader` / `asset/inline` | 小文件转 Base64 |
| `html-loader` | 处理 HTML 中的图片引用 |
| `thread-loader` | 多线程打包（放在其他 loader 前） |
| `cache-loader` | 缓存 loader 结果 |

#### 常见 Plugin

| Plugin | 作用 |
|--------|------|
| `HtmlWebpackPlugin` | 生成 HTML 文件并注入打包资源 |
| `MiniCssExtractPlugin` | CSS 提取为独立文件 |
| `CleanWebpackPlugin` | 清理输出目录（`output.clean` 可替代） |
| `TerserPlugin` | JS 压缩混淆 |
| `CssMinimizerPlugin` | CSS 压缩 |
| `DefinePlugin` | 定义全局变量 |
| `CopyWebpackPlugin` | 复制静态资源 |
| `BundleAnalyzerPlugin` | 打包体积分析 |
| `CompressionPlugin` | 生成 Gzip 文件 |
| `webpack.HotModuleReplacementPlugin` | HMR 热更新 |

#### 自定义 Loader 和 Plugin

```javascript
// 自定义 Loader（本质是一个函数）
// my-loader.js
module.exports = function(source) {
  // source 是文件内容
  return source.replace(/console\.log/g, '// console.log');
};

// 自定义 Plugin
class MyPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('MyPlugin', (compilation) => {
      console.log('构建完成，输出文件数量:', Object.keys(compilation.assets).length);
    });
  }
}
```


### Webpack 的优化策略

#### 构建速度优化

| 方案 | 说明 |
|------|------|
| `thread-loader` | 多线程编译，放在耗时 loader 前面 |
| `cache-loader` / `hard-source-webpack-plugin` | 缓存编译结果，二次构建更快 |
| `babel-loader` 开启缓存 | `cacheDirectory: true` |
| 缩小查找范围 | `resolve.modules`、`resolve.extensions`、`include/exclude` |
| `IgnorePlugin` | 忽略不需要的模块（如 moment 的 locale） |
| `DLLPlugin` | 预编译不常变化的依赖 |
| 并行压缩 | `TerserPlugin({ parallel: true })` |

```javascript
// 缩小查找范围
module: {
  rules: [{
    test: /\.js$/,
    include: path.resolve(__dirname, 'src'),  // 只处理 src 目录
    use: [{
      loader: 'babel-loader',
      options: { cacheDirectory: true }
    }]
  }]
},

// IgnorePlugin（moment 优化）
plugins: [
  new webpack.IgnorePlugin({ resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ })
]
```

#### 产物体积优化

| 方案 | 说明 |
|------|------|
| **Tree Shaking** | 移除未使用的代码（需 ES Module + `sideEffects: false`） |
| **Code Splitting** | `splitChunks` 分割公共代码 |
| **按需加载** | `import()` 动态导入 |
| **压缩** | Terser（JS）+ CssMinimizer（CSS） |
| **CDN 外链** | `externals` 排除大型依赖 |
| **Gzip** | `CompressionPlugin` 预压缩 |
| **图片压缩** | `image-webpack-loader` |

```javascript
// splitChunks 配置
optimization: {
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        priority: 10
      },
      common: {
        minChunks: 2,
        priority: 5,
        reuseExistingChunk: true
      }
    }
  }
},

// externals（CDN 外链）
externals: {
  vue: 'Vue',
  'vue-router': 'VueRouter',
  axios: 'axios'
}
```


### Vite 的基本概念和核心优势

Vite 是下一代前端构建工具，由 Vue 作者尤雨溪开发，利用浏览器原生 ES Module 支持实现了极速开发体验。

#### Vite vs Webpack

| 对比项 | Webpack | Vite |
|--------|---------|------|
| 开发模式 | 先打包再启动服务器 | 先启动服务器，按需编译 |
| 冷启动 | 慢（需打包所有模块） | 快（无需打包，按需编译） |
| HMR | 慢（重新构建整个模块链） | 快（精确失效，与模块总数无关） |
| 构建工具 | webpack（JS） | 开发用 esbuild（Go），生产用 Rollup |
| 配置 | 复杂（需大量 Loader/Plugin） | 简单（开箱即用） |
| 原理 | Bundle（打包所有模块） | No-Bundle（利用浏览器 ESM） |

#### 核心原理

```
开发阶段：
  浏览器请求 → Vite 服务器
    ├── 模块按需编译（esbuild 构建依赖）
    ├── 源码直接通过 ESM 提供给浏览器
    └── 浏览器自身解析 import，按需请求

生产阶段：
  使用 Rollup 打包（成熟的打包工具，Tree Shaking 效果好）
```


### Vite 的依赖加载机制

#### 依赖预构建（Pre-bundling）

Vite 在首次启动时使用 **esbuild** 对项目依赖进行预构建：

1. **将 CommonJS / UMD 转为 ESM**：兼容非 ESM 格式的依赖
2. **合并零碎依赖**：如 `lodash-es` 有 600+ 个模块，预构建合并为一个，减少 HTTP 请求

```javascript
// vite.config.js 中配置预构建
export default {
  optimizeDeps: {
    include: ['lodash-es', 'axios'],   // 强制预构建
    exclude: ['your-local-package'],    // 排除预构建
    needsInterop: ['problematic-lib']  // 需要兼容处理的依赖
  }
};
```

#### 加载流程

```
浏览器请求 /src/main.js
  │
  ├── Vite 服务器识别 import 语句
  │     ├── node_modules 中的依赖 → 返回预构建后的 ESM（缓存在 node_modules/.vite）
  │     ├── 源码文件 → 实时编译（TS→JS、Vue SFC→JS）
  │     └── CSS/图片 → 转换后返回
  │
  └── 浏览器继续请求依赖的 import，递归处理
```


### Vite 多环境配置

Vite 通过 `.env` 文件支持多环境配置：

```
.env                  # 所有环境都会加载
.env.local            # 所有环境，git 忽略
.env.development      # 开发环境
.env.development.local # 开发环境，git 忽略
.env.production       # 生产环境
```

```bash
# .env.development
VITE_API_BASE=http://localhost:3000
VITE_APP_TITLE=My App (Dev)

# .env.production
VITE_API_BASE=https://api.example.com
VITE_APP_TITLE=My App
```

```json
// package.json 中指定 mode
{
  "scripts": {
    "dev": "vite --mode development",
    "build:test": "vite build --mode staging",
    "build": "vite build --mode production"
  }
}
```

```javascript
// vite.config.js 动态配置
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    base: mode === 'production' ? '/app/' : '/',
    define: {
      __APP_VERSION__: JSON.stringify('1.0.0')
    }
  };
});
```

**加载优先级：** `.env.mode.local` > `.env.mode` > `.env.local` > `.env`（后加载的覆盖先加载的）


### Vite 环境变量

Vite 使用 `import.meta.env` 访问环境变量：

```javascript
// 只有 VITE_ 开头的变量才会暴露给客户端代码
console.log(import.meta.env.VITE_API_BASE);  // 正常访问
console.log(import.meta.env.SECRET_KEY);     // undefined（未暴露）

// 内置变量
import.meta.env.MODE;     // 'development' | 'production'
import.meta.env.BASE_URL; // base 配置值
import.meta.env.PROD;     // 是否生产环境（boolean）
import.meta.env.DEV;      // 是否开发环境（boolean）
```

#### 封装使用

```typescript
// env.ts — 集中管理环境变量
interface ImportMetaEnv {
  readonly VITE_API_BASE: string;
  readonly VITE_APP_TITLE: string;
}

export const env = {
  apiBase: import.meta.env.VITE_API_BASE,
  appTitle: import.meta.env.VITE_APP_TITLE,
  isProd: import.meta.env.PROD
};

// api.ts
import axios from 'axios';
const http = axios.create({ baseURL: env.apiBase });
```

#### TypeScript 类型声明

```typescript
// env.d.ts
interface ImportMetaEnv {
  readonly VITE_API_BASE: string;
  readonly VITE_APP_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```


### Vite 插件机制

Vite 插件基于 Rollup 插件接口，扩展了 Vite 特有的钩子。

#### 插件基础结构

```javascript
// my-plugin.js
export default function myPlugin() {
  return {
    name: 'my-plugin',          // 插件名称
    enforce: 'pre',             // 执行顺序：pre | post（默认）

    // 常用钩子
    config(config, env) {
      // 修改 Vite 配置
      return { ...config, server: { port: 3000 } };
    },
    transform(code, id) {
      // 转换文件内容
      if (id.endsWith('.md')) {
        return `export default ${JSON.stringify(code)}`;
      }
    },
    configureServer(server) {
      // 配置开发服务器中间件
      server.middlewares.use((req, res, next) => {
        next();
      });
    }
  };
}
```

#### 常用插件

| 插件 | 作用 |
|------|------|
| `@vitejs/plugin-vue` | Vue SFC 支持 |
| `@vitejs/plugin-react` | React JSX 支持 |
| `@vitejs/plugin-legacy` | 兼容旧浏览器 |
| `vite-plugin-pwa` | PWA 支持 |
| `vite-plugin-compression` | Gzip/Brotli 压缩 |
| `vite-plugin-svg-icons` | SVG 图标自动导入 |
| `unplugin-auto-import` | API 自动导入（免写 import） |
| `unplugin-vue-components` | 组件自动导入 |
| `vite-plugin-mock` | 数据 Mock |
| `vite-plugin-inspect` | 调试插件中间状态 |

```javascript
// vite.config.js
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';

export default {
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dts: 'src/auto-imports.d.ts'
    }),
    Components({
      dts: 'src/components.d.ts'
    })
  ]
};
```


### Vite 的优化策略

#### 预构建优化

```javascript
export default {
  optimizeDeps: {
    include: ['lodash-es', 'axios', 'element-plus'],
    // 强制预构建高频依赖
  }
};
```

#### 依赖外部化（CDN）

```javascript
import { viteExternalsPlugin } from 'vite-plugin-externals';

export default {
  plugins: [
    viteExternalsPlugin({
      vue: 'Vue',
      'vue-router': 'VueRouter'
    })
  ]
};
```

#### 构建优化

```javascript
export default {
  build: {
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: true, drop_debugger: true }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-vue': ['vue', 'vue-router', 'pinia'],
          'vendor-ui': ['element-plus']
        }
      }
    },
    chunkSizeWarningLimit: 1000,  // chunk 大小警告阈值
    reportCompressedSize: false    // 禁用 gzip 大小报告（加速构建）
  }
};
```

#### 服务器优化

```javascript
export default {
  server: {
    host: '0.0.0.0',
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
};
```

#### 优化策略对比

| 优化方向 | Webpack | Vite |
|---------|---------|------|
| 开发构建速度 | thread-loader / cache-loader | esbuild（天然快 10-100 倍） |
| 生产 Tree Shaking | 手动配置 `sideEffects` | Rollup 内置，自动生效 |
| 代码分割 | `splitChunks` | Rollup `manualChunks` |
| 压缩 | TerserPlugin | Terser 或 esbuild（更快） |
| 预构建 | DLLPlugin | `optimizeDeps`（自动） |
| 持久化缓存 | `cache-loader` / `hard-source` | Vite 5 内置持久化缓存 |
