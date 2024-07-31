
## 概述
之前提到node环境中无法使用DOM和BOM的相关api，那么如果要在node环境中使用，该怎么办呢？
可以借助第三方库 jsdom 来实现
## 案例
> npm install jsdom
```javascript
const { JSDOM } = require('jsdom');
const fs = require('node:fs');

const root = new JSDOM(`<!DOCTYPE html><div id='app'></div>`)

const window = root.window;
const document = window.document;

fetch('https://api.thecatapi.com/v1/images/search?limit=10&page=1').then( res => res.json()).then( data => {
    const app = document.getElementById('app')
    data.forEach(item => {
        const img = document.createElement('img');
        img.src = item.url;
        img.style.width = 200 + 'px';
        img.style.height = 200 + 'px';
        app.appendChild(img);
    })
    // 写入一个文件
    fs.writeFileSync('./index.html', root.serialize())
})

// 在相同目录下生成了一个index.html，使用浏览器打开会看到一张张猫猫的图片
```
## CSR、SSR
### 概述
> CSR：vue、react等框架在客户端进行渲染加载的
> 
> SSR：在服务端请求数据和渲染加载，都在服务端中完成的
### CSR、SSR的区别
<br/>

#### 1.加载方式
> CSR: 客户端渲染，服务端返回的是一个初始的HTML页面，在客户端进行下载和执行javascript
> 文件进行页面的渲染和更新
> 
> SSR：服务端渲染，服务端返回的是一个完整的HTML页面，在服务器就把javascript脚本执行了，渲染并更新了页面
#### 2.内容生成和渲染
> CSR: javascript脚本在客户端进行下载执行，页面的渲染和更新是在客户端进行操心，重新生成了DOM，实现页面
> 的动态变化，可以实现复杂的交互和动画效果
> 
> SSR：javascript脚本在服务端进行了执行，页面的初始化内容是在服务端完成的，对应一些静态和少交互的页面
> 优化了首次加载的性能
#### 3.用户交互和体验
> CSR：客户端完成页面的渲染，渲染完成如何要改变页面，需要通过ajax或WebSocket进行于服务器进行交互获取数据，通过javascript代码
> 进行页面的更新，能够得到更快的反应速度和更好的交互体验
> 
> SSR：服务端完成页面的渲染，用户操作需要再服务器进行，执行完服务端返回一个更新过的页面，提供了更好的
> 首次加载时间快的体验和对搜索引擎友好的内容，便于SEO
## SEO

### 概念
Search Engine Optimization 搜索引擎优化
> CSR：对SEO并不友好, CSR在首次加载的时候是一个基础的HTML页面，可知信息很少，搜索引擎爬虫
> 无法抓取完整的页面内容
> 
> SSR：首次加载得到的是一个完整的HTML页面，搜索引擎爬虫可以直接得到完整的页面内容，更加便于搜索引擎的理解和评估

### 应用场景
> CSR: ToB 后台管理系统 大屏可视化 都可以采用CSR渲染不需要很高的SEO支持
> 
> SSR：内容密集型应用大部分是ToC 新闻网站 ，博客网站，电子商务，门户网站需要更高的SEO支持


