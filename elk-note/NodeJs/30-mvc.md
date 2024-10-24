

## MVC
MVC（Model-View-Controller）是一种常用的软件架构模式，用于设计和组织应用程序的代码。它将应用程序分为三个主要组件：模型（Model）、视图（View）和控制器（Controller），各自负责不同的职责。

- 模型（Model）：模型表示应用程序的数据和业务逻辑。它负责处理数据的存储、检索、验证和更新等操作。模型通常包含与数据库、文件系统或外部服务进行交互的代码。
- 视图（View）：视图负责将模型的数据以可视化的形式呈现给用户。它负责用户界面的展示，包括各种图形元素、页面布局和用户交互组件等。视图通常是根据模型的状态来动态生成和更新的。
- 控制器（Controller）：控制器充当模型和视图之间的中间人，负责协调两者之间的交互。它接收用户输入（例如按钮点击、表单提交等），并根据输入更新模型的状态或调用相应的模型方法。控制器还可以根据模型的变化来更新视图的显示。

MVC 的主要目标是将应用程序的逻辑、数据和界面分离，以提高代码的可维护性、可扩展性和可重用性。通过将不同的职责分配给不同的组件，MVC 提供了一种清晰的结构，使开发人员能够更好地管理和修改应用程序的各个部分。
## IoC控制反转和依赖注入
控制反转（Inversion of Control，IoC）和依赖注入（Dependency Injection，DI）是软件开发中常用的设计模式和技术，用于解耦和管理组件之间的依赖关系。虽然它们经常一起使用，但它们是不同的概念。

- 控制反转（IoC）是一种设计原则，它将组件的控制权从组件自身转移到外部容器。传统上，组件负责自己的创建和管理，而控制反转则将这个责任转给了一个外部的容器或框架。容器负责创建组件实例并管理它们的生命周期，组件只需声明自己所需的依赖关系，并通过容器获取这些依赖。这种反转的控制权使得组件更加松耦合、可测试和可维护。

- 依赖注入（DI）是实现控制反转的一种具体技术。它通过将组件的依赖关系从组件内部移动到外部容器来实现松耦合。组件不再负责创建或管理它所依赖的其他组件，而是通过构造函数、属性或方法参数等方式将依赖关系注入到组件中。依赖注入可以通过构造函数注入（Constructor Injection）、属性注入（Property Injection）或方法注入（Method Injection）等方式实现。

## 安装依赖
inversify + reflect-metadata 实现依赖注入 https://doc.inversify.cloud/zh_cn/

接口编写express https://www.expressjs.com.cn/

连接工具 inversify-express-utils https://www.npmjs.com/package/inversify-express-utils

orm框架 prisma https://prisma.nodejs.cn/

dto class-validator + class-transformer https://www.npmjs.com/package/class-validator
## 项目目录
基于 prisma构建的项目
目录结构
- mvc
  - /src
    - post
      - controller.ts
      - service.ts
      - post.dto.ts
    - user
      - controller.ts
      - service.ts
      - user.dto.ts
  - main.ts 
  - prisma
    - schema.prisma
  - .env
  - .gitignore
  - package.json
  - tsconfig.json
## 代码编写
- requset.http
```http request
# 获取测试
GET http://localhost:8813/user/list HTTP/1.1

# 新增测试
POST http://localhost:8813/user/create HTTP/1.1
```
- main.ts
```typescript
import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import express from 'express';

import { UserService } from "./src/user/service";
import { UserController } from "./src/user/controller";

// 3.1
import { PrismaClient } from "@prisma/client"
import { PrismaDB } from "./src/db";
// Ioc搞个容器
const container = new Container();
/*
    User模块 2.3
*/
// 添加到容器中
container.bind<UserService>(UserService).to(UserService)
container.bind<UserController>(UserController).to(UserController)
/*
* Prisam注入工厂封装db 3.1
* */
container.bind<PrismaClient>(PrismaClient).toFactory( () => {
    return () => {
        return new PrismaClient()
    }
})
container.bind<PrismaDB>(PrismaDB).to(PrismaDB)
// 创建一个server
const server = new InversifyExpressServer(Container);
// 设置中间件，支持post body获取参数
server.setConfig((app) => {
  app.use(express.json());
});
// 创建一个web服务
const app = server.build();

// 监听服务
app.listen(8813, () => {
    console.log("启动成功！！！")
})
```
编写路由服务 /src/xxx
- user/controller.ts

user服务控制层
```typescript
// 2.1
import { controller, httpGet as Get, httpPost as Post } from 'inversify-express-utils'

// 2.4
import { UserService } from './service.ts';
import { inject } from 'inversify';
import type { Request, Response } from 'express'

// 2.1
@controller("/user")
export class UserController {
    // 2.4
    constructor(@inject(UserService) private readonly UserService: UserService) {}
    @Get("/list")
    // 获取用户信息
    public async getUser(req: Request, res: Response) {
        // 这里面调用逻辑层，不写具体逻辑
        // 2.4
        const result =  await this.UserService.getList()
        res.send(result)
    }
  
    @Post("/create")
    // 新增用户信息
    public async createUser(req: Request, res: Response) {
        // 这里面调用逻辑层，不写具体逻辑
        // 2.4
        const result =  await this.UserService.createUser(req.body)
        res.send(result)
    }
}
```
- /user/service.ts

user服务逻辑层
```typescript
import { injectable, inject } from 'inversify' // 引入注入器

import { UserDto } from './user.dto'
import { plainToClass } from 'class-transformer' //dto验证
import { validate } from 'class-validator' //dto验证

// 3.3
import { PrismaDB } from '../db/index.ts'
interface Iuser  {
  name: string
  email: string
}
// 注入 2.2
@injectable()
export class UserService {
    // 3.3
    constructor(@inject(PrismaDB) private readonly PrismaDB: PrismaDB) {}
    // 返回所有数据
    public async  getList() {
        const data = await this.PrismaDB.prisma.user.findMany()
        return data
    }
    // 新增数据
    public async createUser(user: UserDto) {
      const userDto = plainToInstance(UserDto, user);
      const errors = await validate(userDto);
      const dto = [];
      if (errors.length) {
        // 说明通过验证存在不满足情况
        errors.forEach((error) => {
          Object.keys(error.constraints).forEach((key) => {
            dto.push({
              [error.property]: error.constraints[key],
            });
          });
        });
        return dto;
      } else {
        const form = await this.PrismaDB.prisma.user.create({
          data: {
            name: user.name,
            email: user.email,
          },
        });
        return { code: 200, data: "新增成功"};
      }
  }
}
```
- /db/index.ts

封装prisma工厂注入
```typescript
// 3.2
import { injectable, inject } from 'inversify';
import { PrismaClient } from '@prisma/client'
// 注入
@injectable()
export class PrismaDB {
    prisma: PrismaClient
    constructor(@inject('PrismaClient') private readonly PrismaClient: () => PrismaClient ) {
        this.prisma = PrismaClient()
    }
}

```

- tsconfig.ts

支持装饰器和反射 打开一下 严格模式关闭
```json
"experimentalDecorators": true,               
"emitDecoratorMetadata": true,    
"strict": false,  
```
