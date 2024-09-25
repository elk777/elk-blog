

## 概述
express是一个流行的Node.js Web应用程序框架，用于构建灵活且可扩展的Web应用程序和API。它是基于Node.js的HTTP模块而创建的，简化了处理HTTP请求、响应和中间件的过程。

## 基本使用
```javascript
import express from 'express';
// 开启服务
const app = express();  // 是一个函数
app.use(express.json()); // 否则req.body为undefined
/*
*   第一个参数是请求路径
*   第二个参数是请求对象-接收客户端传递的参数
*   第三个参数是响应对象-传递给客户端的内容
* */
// get普通请求
app.get("/get", (req, res) => {
    // req.query
    res.send("普通get请求成功")
})
// get动态参数请求
app.get("/getSync/:id", (req, res) => {
    // req.params
    res.send("动态参数请求")
})
// post请求
app.post("/post", (req, res) => {
    // req.body
    res.send("post请求成功")
})
// 监听端口
app.listen(3323, () => {
    console.log("服务启动成功，端口号3323")
})
```
## 路由模块化
Express允许将路由处理程序拆分为多个模块，每个模块负责处理特定的路由。通过将路由处理程序拆分为模块，可以使代码逻辑更清晰，易于维护和扩展。
- app.js
```javascript
import express from 'express';
import User from './src/user.js';
import List from './src/list.js'
// 开启服务
const app = express();  // 是一个函数
app.use(express.json()); // 否则req.body为undefined
//注册路由
app.user("/user", User);
app.user("/list", List),
    
// 监听端口
app.listen(3034, () => {
    console.log("服务启动成功，端口号3034")
})
```
- src/ user | list
```javascript
import express from 'express';
const router = express.Router();

// user.js
router.post("/register", (req, res) => {
    res.send("注册成功")
})
router.post("/login", (req, res) => {
    res.send("登录成功")
})
// list.js
router.get("/artcleList", (req, res) => {
    res.json({
        code: 200,
        data: [
            { id:1, title: '文章1'},
            { id:2, title: '文章2'},
        ]
    })
})
export default router
```
- express.http
```http request
GET http://localhost:3034/list/articleList HTTP/1.1

# POST http://localhost:3034/user/register HTTP/1.1
# Content-Type: application/json


# POST http://localhost:3034/user/login HTTP/1.1
# Content-Type: application/json
```
## 中间件的使用
中间件是处理HTTP请求和服务器响应的函数，位于请求和处理函数返回中间，可以对请求和响应进行修改，执行额外的逻辑和执行其他的任务。

中间件函数接收三个参数
> req: 请求对象
> 
> res: 响应对象
> 
> next: 下一个中间件函数，通过next(),可以将控制器传递给下一个中间件函数，如果不调用next(),就会一直中止在这，不会传递给下一个中间件或者路由函数
>
### 实现一个日志中间件
log4js日志记录库: https://log4js-node.github.io/log4js-node/index.html
```shell
npm install log4js
```
- /middleware/logger.js
```javascript
import log4js from "log4js";
// 配置logger
log4js.configure({
	appenders: {
		out: { type: "stdout" },
		file: { type: "file", filename: "logs/app.log" },
	},
	categories: {
		default: { appenders: ["out", "file"], level: "debug" },
	},
});
// 获取logger
const logger = log4js.getLogger('default');

// 自定义logger中间件
const loggerMiddleware = (req, res, next) => {
    logger.debug(`[${req.method}], [${req.url}]`);
    next();
};
export default loggerMiddleware;
```
- app.js
```javascript
// 引入中间件
import loggerMiddleware from './middleware/logger.js';
// 注册中间件
app.use(loggerMiddleware)
```
> 最后调用接口的时候就会记录下来，控制台会输出，对应的/logs/app.log 也会有文档记录
