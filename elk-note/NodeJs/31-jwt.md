
## 概述
JWT（JSON Web Token）是一种开放的标准（RFC 7519），用于在网络应用间传递信息的一种方式。它是一种基于JSON的安全令牌，用于在客户端和服务器之间传输信息。 
[jwt.io/](https://jwt.io/)

JWT由三部分组成，它们通过点（.）进行分隔：

- Header（头部）：包含了令牌的类型和使用的加密算法等信息。通常采用Base64编码表示。
- Payload（负载）：包含了身份验证和授权等信息，如用户ID、角色、权限等。也可以自定义其他相关信息。同样采用Base64编码表示。
- Signature（签名）：使用指定的密钥对头部和负载进行签名，以确保令牌的完整性和真实性。

**JWT的工作流程如下**：

1、用户通过提供有效的凭证（例如用户名和密码）进行身份验证。

2、服务器验证凭证，并生成一个JWT作为响应。JWT包含了用户的身份信息和其他必要的数据。

3、服务器将JWT发送给客户端。

4、客户端在后续的请求中，将JWT放入请求的头部或其他适当的位置。

5、服务器在接收到请求时，验证JWT的签名以确保其完整性和真实性。如果验证通过，服务器使用JWT中的信息进行授权和身份验证。

## 依赖
**passport**：passport是一个流行的用于身份验证和授权的Node.js库

**passport-jwt**：Passport-JWT是Passport库的一个插件，用于支持使用JSON Web Token (JWT) 进行身份验证和授权

**jsonwebtoken**：生成token的库
```shell
npm install passport passport-jwt jsonwebtoken --save-dev

# 使用的ts提示让安装对应的声明文件
npm install @types/passprot @types/jsonwebtoken @types/passport-jwt --save
```
## 编写
代码还是在上一章的mvc代码基础上进行添加

多了个目录 /src/jwt/index.ts，/src/login/controller.ts、service.ts、login.dto.ts

- /src/jwt/index.ts
```typescript
import passport from 'passport'
import jsonwebtoken from 'jsonwebtoken'
import { injectable } from 'inversify'

import { Strategy, ExtractJwt } from "passport-jwt"

@injectable()
export class JWT {
    private secretKey = 'elk!@#$%^qwdw123121*@#@#'
    private jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: this.secretKey
    }
    constructor() {
        // new的时候，初始化jwt
        this.strategy();
    }
    /**
     * @description 中间件，需要经过这个jwt验证
     * */
    public middleware() {
        return passport.authenticate('jwt', { session: false })
    }
    /**
     * @description 初始化jwt
     * */
    public strategy() {
        // new Strategy(options, verify)
        // options : 配置项
        // verify： 回调函数
        const strategy = new Strategy(this.jwtOptions,(jwt_payload, done) => {
            // 这里面可以写判断条件
            done(null, jwt_payload)
        })
        // passport-jwt只是passport的一个插件，需要在passport中使用
        passport.use(strategy)
    }
    /**
     * @description 生成token
     * @params data object
     * */
    public createToken(data: object) {
       return jsonwebtoken.sign(data, this.secretKey, { expiresIn: '7d' })
    }
    /**
     * @description 关联exporess
     * */
    public init() {
        passport.initialize();
    }
}
```
- main.ts
进行引入容器
```typescript
import "reflect-metadata";
import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import express from 'express'

import { UserService } from "./src/user/service";
import { UserController } from "./src/user/controller";

import { PostController } from "./src/post/controller";
import { PostService } from "./src/post/service";

import { LoginService } from "./src/login/service";
import { LoginController } from "./src/login/controller";

import { PrismaClient } from '@prisma/client'
import { PrismaDB } from "./src/db";

import { JWT } from "./src/jwt"; // jwt引入
//Ioc搞个容器
const container = new Container();

/* 
    登录模块
*/
container.bind<LoginService>(LoginService).to(LoginService)
container.bind<LoginController>(LoginController).to(LoginController)
/* 
    User模块
*/
container.bind<UserService>(UserService).to(UserService) // 添加到容器
container.bind<UserController>(UserController).to(UserController) // 添加到容器

/* 
    Post模块
*/
container.bind<PostController>(PostController).to(PostController)
container.bind<PostService>(PostService).to(PostService)

/*
   JWT模块
*/
container.bind<JWT>(JWT).to(JWT)
/* 
    prisma依赖注入
*/
// 注入工厂封装prisma
container.bind<PrismaClient>('PrismaClient').toFactory( () => {
    return () => {
        return new PrismaClient();
    }
})
container.bind<PrismaDB>(PrismaDB).to(PrismaDB)
// 创建一个server
const server = new InversifyExpressServer(container);
server.setConfig((app) => {
	app.use(express.json());
    // 在express中引入jwt插件
    app.use(container.get(JWT).init())
});
// app就是express
const app = server.build();
// 监听服务
app.listen(8813, () => {
	console.log("server start");
});
```
- /src/login/controller.ts

login服务控制层
```typescript
import { controller, httpGet as Get, httpPost as Post  } from 'inversify-express-utils'
import { inject } from 'inversify';
import { LoginService } from './service'
import type { Request, Response } from 'express'
import { JWT } from '../jwt'
const { middleware } = new JWT()
 
@controller("/login")
export class LoginController {
    constructor(
        @inject(LoginService) private readonly LoginService: LoginService
    ) {}
    // 模拟测试拿user数据，开启鉴权验证
    @Get("/list",middleware())
    public async getUser(req: Request, res: Response) {
        // 业务逻辑层
        const data = await this.LoginService.getList()
        return data
    }
    // 登录接口
    @Post("/")
    public loginUser(req: Request, res: Response) {
        const data = this.LoginService.login(req.body)
        // 业务逻辑层
        return data
    }
}
```
- /src/login/service.ts

登录服务业务逻辑层

```typescript
import { injectable, inject } from 'inversify'
import { PrismaDB } from '../db'
import { JWT } from '../jwt'

interface ILogin {
    name: string
    password: string
}

@injectable()
export class LoginService {
    constructor(
        @inject(PrismaDB) private readonly PrismaDB: PrismaDB,
        @inject(JWT) private  readonly JWT:JWT
    ) {}
    // 获取用户信息
    public async getList() {
        const data = await  this.PrismaDB.prisma.user.findMany();
        return data
    }
    // 登录接口
    public login(data:ILogin) {
        // 测试直接通过验证，不进行数据库查询
        return {
            code: 200,
            data: "登录成功",
            token: this.JWT.createToken(data)
        }
    }
}
```
- request.http
```http request

# 获取测试 鉴权
GET http://localhost:8813/login/list HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZWxrIiwicGFzc3dvcmQiOiIxMjMxMjMiLCJpYXQiOjE3Mjk4MjQ3NzMsImV4cCI6MTczMDQyOTU3M30.vwxTi9zBOEzfL7tE7vMFZdK3MEWbqNCDrVfzpkxn3FQ

# 登录验证
POST http://localhost:8813/login HTTP/1.1
Content-Type: application/json

{
 "name": "elk",
 "password": "123123"
}
```
