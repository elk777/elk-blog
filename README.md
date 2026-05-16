# elk-blog

<p align="center">
  <img src="public/icon.png" alt="logo" width="80" />
</p>

<p align="center">
  <strong>灰原同学的猫 — 个人技术博客与知识库</strong>
</p>

<p align="center">
  keep awake, keep progress
</p>

<p align="center">
  <a href="https://elk777.github.io/elk-blog/">在线访问</a> ·
  <a href="https://github.com/elk777/elk-blog/issues">反馈建议</a>
</p>

---

一个基于 [VitePress](https://vitepress.dev/) 搭建的个人技术博客与知识管理站点，内容涵盖 TypeScript、Node.js、NestJS 等前端与全栈技术栈的学习笔记，同时记录项目实践与个人成长。

## 内容

### 技术笔记（87+ 篇）

| 分类 | 篇数 | 涵盖内容 |
|------|------|----------|
| **TypeScript** | 16 | 基础类型、接口、泛型、装饰器、类型体操等 |
| **Node.js** | 45 | 模块化、核心模块、Express、MySQL、Redis、JWT、Socket.IO、爬虫等 |
| **NestJS** | 26 | IoC/DI、RESTful API、中间件、守卫、Swagger、TypeORM、事务等 |

### 项目实践

- **elk-admin-v2** — Vue 2 后台管理模板
- **elk-bigscreen** — 基于 Vue 3 + Pinia + ECharts 的数据可视化大屏

### 个人成长

- 技术踩坑记录、旅行随笔等

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| [VitePress](https://vitepress.dev/) | ^1.1.3 | 静态站点生成 |
| [vitepress-theme-demoblock](https://github.com/xinlei3166/vitepress-theme-demoblock) | ^2.0.2 | 在文档中嵌入可交互的 Vue 组件 Demo |
| Vite | - | 构建工具 |
| GitHub Actions | - | CI/CD 自动部署 |

## 快速开始

### 环境要求

- Node.js >= 18
- npm

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/elk777/elk-blog.git
cd elk-blog

# 安装依赖
npm install

# 启动开发服务器
npm run docs:dev

# 构建生产版本
npm run docs:build

# 预览生产构建
npm run docs:preview
```

## 目录结构

```
├── .github/workflows/   # GitHub Actions 部署配置
├── .vitepress/          # VitePress 配置
│   ├── config.mjs       # 站点配置（标题、导航、页脚等）
│   ├── elkConf/         # 导航栏与侧边栏配置
│   └── theme/           # 自定义主题（紫色渐变配色）
├── elk-note/            # 技术笔记内容
│   ├── TypeScript/
│   ├── NodeJs/
│   └── NestJs/
├── elk-project/         # 项目实践
├── elk-growth/          # 个人成长
├── libs/                # 工具函数（侧边栏自动生成）
├── public/              # 静态资源
└── index.md             # 首页
```

## 部署

项目通过 GitHub Actions 自动部署到 GitHub Pages：

- 推送到 `master` 分支时触发 CI
- 使用 Node.js 20 构建
- 通过 `actions/deploy-pages@v4` 部署

详细配置见 [.github/workflows/deploy.yml](.github/workflows/deploy.yml)。

## License

[MIT](LICENSE)

---

<p align="center">
  Made with <a href="https://vitepress.dev/">VitePress</a> by elk
</p>
