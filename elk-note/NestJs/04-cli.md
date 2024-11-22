
## 安装
```shell
# 使用npm全局安装cli
npm install -g @nestjs/cli
nest new [项目名]

# 使用npx安装一个nest-cli项目
npx @nestjs/cli new [项目名]
```
## 目录介绍
- nest-demo
  - src
    - **app.controller.spec.ts**: 对于基本控制器的单元测试样例。
    - **app.controller.ts**: 一个示例控制器，处理 HTTP 请求并返回响应。
    - **app.module.ts**: 根模块文件，定义了应用程序的主模块，通常包含应用级别的提供者、控制器和守卫等。
    - **app.service.ts**: 与 app.controller.ts 相关联的服务，包含业务逻辑。
    - **main.ts**: 应用程序入口文件。它使用 NestFactory 用来创建 Nest 应用实例。
  - test
    - **app.e2e-spec.ts**: 端到端测试文件，用于编写集成测试。
    - **jest-e2e.json**: Jest 测试框架的配置文件，专门用于配置端到端（End-to-End, E2E）测试。
  - **.eslintrc.js**:  ESLint 代码质量检查工具的配置文件。
  - **.gitignore**: Git 版本控制忽略文件列表，用于排除不需要版本控制的文件和目录。
  - **.prettierrc**: 代码格式化工具的配置文件。
  - **nest-cli.json**: NestJS CLI 的配置文件，可以自定义构建和启动脚本等。
  - **package.json**: 项目的元数据和依赖列表。它包含了项目的详细信息，如名称、版本、脚本、依赖项等。
  - **pnpm-lock.yaml**: PNPM 包管理器的锁定文件。
  - **README.md**: 项目的自述文件，通常包含项目的简介和基本使用说明。
  - **tsconfig.build.json**: TypeScript 编译器的配置文件，专门用于构建（编译）过程。
  - **tsconfig.json**: TypeScript 编译器的配置文件，定义了编译选项和包含/排除文件的规则。

## 重点介绍
- app.controller.ts
```typescript
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// 控制器
@Controller('/get')
export class AppController {
  // 依赖注入，不需要实例化，appService内部帮我们实例化
  constructor(private readonly appService: AppService) {}

  // Get代表使用的是get请求方法
  @Get('/hello')
  getHello(): string {
    // 使用app.service中注入的方法
    return this.appService.getHello();
  }
  @Get('/list')
  getList(): object[] {
    return this.appService.getList();
  }
}
```
- app.module.ts
```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```
- app.service.ts
```typescript
import { Injectable } from '@nestjs/common';

// 注入，将下面的业务逻辑注入到容器中
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getList(): object[] {
    return [
        { id: 1, name: '张三' },
        { id: 2, name: '李四' },
    ];
  }
}
```
- 启动项目
```shell
# 监听模式，自动更新
pnpm nest start --watch 
```
- 访问
```http request
http://localhost:3000/get/hello
# Hello World!

http://localhost:3000/get/list
# [ {id:1,name:'张三'}, {id:2,name:'李四'} ] 

```
