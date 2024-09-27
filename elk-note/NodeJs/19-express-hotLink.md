
## 概述
防盗链「hotlinking」是在网页或者其他网络资源中，通过直接链接到其他网站上的图片、视频或者其他文件资源，应用到自己的网页上，但是这种操作往往给被链接的网站带来带宽消耗和资源浪费，侵犯了原始网站的版权

### 预防措施
> **通过HTTP引用检查**：网站可以检查HTTP请求的来源，如果来源网址与合法的来源不匹配，就拒绝提供资源。这可以通过服务器配置文件或特定的脚本实现。
> 
> **使用Referrer检查**：网站可以检查HTTP请求中的Referrer字段，该字段指示了请求资源的来源页面。如果Referrer字段不符合预期，就拒绝提供资源。这种方法可以在服务器配置文件或脚本中实现。
>
> **使用访问控制列表（ACL）**：网站管理员可以配置服务器的访问控制列表，只允许特定的域名或IP地址访问资源，其他来源的请求将被拒绝。
>
> **使用防盗链插件或脚本**：一些网站平台和内容管理系统提供了专门的插件或脚本来防止盗链。这些工具可以根据需要配置，阻止来自未经授权的网站的盗链请求。
>
> **使用水印技术**：在图片或视频上添加水印可以帮助识别盗链行为，并提醒用户资源的来源。
## 代码
- app.js
```javascript
import express from "express";
const app = express();

const whitelist  = ["localhost"] // 设置白名单列表
// 防盗链中间件
const preventHotLinKing = (req, res, next) => {
    // 获取请求头中的referer字段
    const referer = req.get("referer"); // 获取请求头中的referer
    // 如何直接访问.png这类资源不存在referer，必须含有请求接口才会有referer
    // 如在index.html中放一个img标签，此时会触发图片请求，得到referer
    // 当referer不为undefined的时候才进行执行判断
    if(referer) {
        const { hostname } = new URL(referer) // 解析出主机名
        if(!whitelist.includes(hostname)) {
            // 不在白名单，直接中断，禁止访问  
            res.status(403).send("禁止访问")
            return
        }
    }
    next(); // 如何在白名单列表中，直接放行
}
// 挂载中间件
app.use(preventHotLinKing);
// 挂载静态资源
app.use("/assets",express.static("static"));

app.listen(3023,() => {
    console.log("server is running at port 3023");
})
```
- static/ index.html | img.png
```shell
node app.js 
#  http://localhost:3023/assets/index.html
#  http://localhost:3023/assets/img.jpeg
```
> 后端可以伪造referer

