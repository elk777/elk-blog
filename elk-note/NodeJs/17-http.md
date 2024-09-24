

## 概述
HTTP「超文本传输协议」是NodsJs中创建和处理HTTP服务器和客户端的核心模块，它使得构建基于 HTTP 协议的应用程序变得更加简单和灵活。

## 示例
```javascript
const http = require("node:http");  // 引入http模块
const url = require("node:url");    // 引入url模块

const server = http.createServer((req, res) => {
    // 获取请求路径和请求参数，处理get请求，将参数变为对象 query.xxx 
    const { pathname,query } = url.parse(req.url, true);
    const method = req.method;
    if(method === "GET") {
        if(pathname === "/reg") {
            res.statusCode = 200;
            console.log("🚀 ~ server ~ query:", query)
            res.end("hello world get");
        }else {
            res.statusCode = 404;
            res.end("get 404");
        }
    }else if (method === "POST") {
        // http中post无法直接通过req.body进行参数获取
        if(pathname === "/login") {
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            })
            req.on("end", () => {
                res.setHeader("Content-Type", "application/json");
                res.statusCode = 200;
                res.end(data);
            })
        }
    } else {
        res.statusCode = 404;
        res.end("404");
    }
});

server.listen(3343, () => {
    console.log("server is running at port 3343");
});
```

## 反向代理
反向代理（Reverse Proxy）是一种网络通信模式，它充当服务器和客户端之间的中介，将客户端的请求转发到一个或多个后端服务器，并将后端服务器的响应返回给客户端。
> **负载均衡**：反向代理可以根据预先定义的算法将请求分发到多个后端服务器，以实现负载均衡。这样可以避免某个后端服务器过载，提高整体性能和可用性。
>
> **高可用性**：通过反向代理，可以将请求转发到多个后端服务器，以提供冗余和故障转移。如果一个后端服务器出现故障，代理服务器可以将请求转发到其他可用的服务器，从而实现高可用性。
>
> **缓存和性能优化**：反向代理可以缓存静态资源或经常访问的动态内容，以减轻后端服务器的负载并提高响应速度。它还可以通过压缩、合并和优化资源等技术来优化网络性能。
>
> **安全性**：反向代理可以作为防火墙，保护后端服务器免受恶意请求和攻击。它可以过滤恶意请求、检测和阻止攻击，并提供安全认证和访问控制。
>
> **域名和路径重写**：反向代理可以根据特定的规则重写请求的域名和路径，以实现 URL 路由和重定向。这对于系统架构的灵活性和可维护性非常有用。

<br/>

> 用到的库： **http-proxy-middleware**
> 
> https://github.com/chimurai/http-proxy-middleware
### 代码实现
- elk-config.js
```javascript
module.exports = {
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3343',
                changeOrigin: true
            },
            '/text': {
                target: 'http://localhost:3343',
                changeOrigin: true
            }
            // ...可以是多个
        }
    }
}
```
- index.js
```javascript
const http = require("node:http");
const url = require("node:url");
const fs = require("node:fs");
const { createProxyMiddleware } = require("http-proxy-middleware");

const config = require("./elk.config.js");
const html = fs.readFileSync("./index.html");

http.createServer((req, res) => {
    const { pathname } = url.parse(req.url);
    const proxyList = Object.keys(config.server.proxy); // ['/api', '/text', ....]
    // 如果请求路径在proxyList中，进行代理
    if(proxyList.includes(pathname)){
        // createProxyMiddleware(<pathFilter>)  pathFilter匹配的路径，可以是数组多个
        createProxyMiddleware(config.server.proxy[pathname])(req, res)
        return
    }
    res.wrirteHead(200, {
        "Content-Type": 'text/html'
    })
    res.end(html)
    
})
```
- index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>反向代理</title>
</head>
<body>
    <div id="app">未代理</div>
    <script>
        fetch('/api').then( res => {
            return res.text()
        }).then(res => {
            const app = document.getElementById('app')
            app.innerHTML = res
        })
    </script>
</body>
</html>
```
- text.js
```javascript
// 代理服务器
const http = require("node:http")
const url = require("node:url")

http.createServer((req, res) => {
    const { pathname } = url.parse(req.url);
    if(pathname === '/api') {
        res.end("sucess proxy")
    }
}).listen(3343, () => {
    console.log("server is running at port 3343");
})
```
## 动静分离
动静分离是一种在Web服务器架构中常用的优化技术，旨在提高网站的性能和可伸缩性。它基于一个简单的原则：将动态生成的内容（如动态网页、API请求）与静态资源（如HTML、CSS、JavaScript、图像文件）分开处理和分发。

通过将动态内容和静态资源存储在不同的服务器中，使用不同的处理机制，可以有效提供网站的处理效率和访问速度。

> **性能优化**：将静态资源与动态内容分离可以提高网站的加载速度。由于静态资源往往是不变的，可以使用缓存机制将其存储在CDN（内容分发网络）或浏览器缓存中，从而减少网络请求和数据传输的开销。
>
> **负载均衡**：通过将动态请求分发到不同的服务器或服务上，可以平衡服务器的负载，提高整个系统的可伸缩性和容错性。
>
> **安全性**：将动态请求与静态资源分开处理可以提高系统的安全性。静态资源通常是公开可访问的，而动态请求可能涉及敏感数据或需要特定的身份验证和授权。通过将静态资源与动态内容分离，可以更好地管理访问控制和安全策略。

### 实现方法
- 使用反向代理服务器（如Nginx、Apache）将静态请求和动态请求转发到不同的后端服务器或服务。
- 将静态资源部署到CDN上，通过CDN分发静态资源，减轻源服务器的负载。
- 使用专门的静态文件服务器（如Amazon S3、Google Cloud Storage）存储和提供静态资源，而将动态请求交给应用服务器处理
### 代码实现
用到了一个插件 mime
<br/>https://github.com/broofa/mime
```shell
npm install mime
```
```javascript
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import mime from 'mime';

const server = http.createServer((req, res) => {
    const { method, url } = req;
    // 处理静态资源
    if(method === 'GET' && url.startsWith('/static')) {
        const filePath = path.join(process.cwd(), url);
        const mimeType = mime.getType(filePath);
        fs.readFile(filePath, (err, data) => {
            if(err) {
                res.writHead(500, {
                    "Content-Type": 'text/plan'
                })
                res.end("访问出错")
            }else {
                res.writHead(200, {
                    "Content-Type": mimeType, // 设置响应头mime类型
                    "Cache-Control": 'public, max-age=3600' // 设置缓存控制头
                })
                res.end(data)
            }
        })
    }
    // 处理动态资源
    if((method === 'GET' || method === 'POST') && url.startsWith('/api')) {
        res.end("动态资源访问成功！！！")
    }
})

server.listen(80, () => {
    console.log("服务器启动成功，端口号80")
})
```
## 邮件服务
**任务分配与跟踪**：邮件服务可以用于分配任务、指派工作和跟踪项目进展。通过邮件，可以发送任务清单、工作说明和进度更新，确保团队成员了解其责任和任务要求，并监控工作的完成情况。




**错误报告和故障排除**：当程序出现错误或异常时，程序员可以通过邮件将错误报告发送给团队成员或相关方。这样可以帮助团队了解问题的性质、复现步骤和相关环境，从而更好地进行故障排除和修复。邮件中可以提供详细的错误消息、堆栈跟踪和其他相关信息，以便其他团队成员能够更好地理解问题并提供解决方案。




**自动化构建和持续集成**：在持续集成和自动化构建过程中，邮件服务可以用于通知团队成员构建状态、单元测试结果和代码覆盖率等信息。如果构建失败或出现警告，系统可以自动发送邮件通知相关人员，以便及时采取相应措施。


### 代码实现
> yaml: 是一种用于配置文件的格式，它以易于阅读的方式存储数据和配置参数。YAML 的设计目标是让人类用户能够轻松地阅读和编写配置文件，同时也易于被计算机解析
> 
> https://github.com/nodeca/js-yaml
> 
> nodemailer: 是一个基于 Node.js 的模块，用于发送电子邮件。它支持 SMTP 协议以及多种传输选项，可以发送纯文本邮件、HTML 邮件以及带有附件的邮件
>
> https://nodemailer.com
```shell
npm install yaml nodemailer
```
- elk.yaml
```yaml
pass: 授权码 | 密码
user: xxx@qq.com
```
- index.js
```javascript
import http from 'node:http';
import fs from 'node:fs';
import url from 'node:url';
import yaml from 'yaml';
import nodemailer from 'nodemailer';

// 获取yaml配置文件内容
const yamlConfig = yaml.load(fs.readFileSync('./elk.yaml','utf-8'));

// 初始化一个邮件服务
const transporter = nodemailer.createTransport({
    service: 'qq',
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    auth: {
        user: yamlConfig.user,
        pass: yamlConfig.pass
    }
});

// 创建一个应用服务
const server = http.createServer((req, res) => {
    const { pathName } = url.paser(req.url);
    const { method } = req;
    if(method === 'POST' && pathname === '/send/email') {
        let emailInfo = "";
        req.on('data', (chunk) => {
            emailInfo += chunk.toString();
        })
        req.on('end', () => {
            const { to, subject, text} = JSON.parse(emailInfo)
            let mailOptions = {
                from: yamlConfig.user, // 发件人
                to,  // 收件人
                subject, // 主题
                text, // 内容
            }
            transporter.sendMail(mailOptions, (error, info) => {
                if(error) {
                    res.end(JSON.stringify({
                        code: 500,
                        msg: '发送失败'
                    }))
                } else {
                    res.end(JSON.stringify({
                        code: 200,
                        msg: '发送成功'
                    }))
                }
            })
        })
    }
})
```
- index.http
```http request
POST http://localhost:3023/send/email HTTP/1.1
Content-Type: application/json

{
    "to": "xxx@qq.com",
    "subject": "品如",
    "text": "品如，你好烧"
}
```

- qq邮箱服务地址-获取授权码

  https://wx.mail.qq.com/list/readtemplate?name=app_intro.html#/agreement/authorizationCode

