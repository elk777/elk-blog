
## 概述
中间件是路由处理程序之前调用的对象，中间件函数可以访问请求和响应对象，以及应用程序请求响应周期中的
next（）中间件函数。

中间件函数可以执行以下任务:

- 执行任何代码。
- 对请求和响应对象进行更改。
- 结束请求-响应周期。
- 调用堆栈中的下一个中间件函数。
- 如果当前的中间件函数没有结束请求-响应周期, 它必须调用 next() 将控制传递给下一个中间件函数。否则, 请求将被挂起。

## 简单应用
根目录feat- /middleware/logger.middleware.ts

### logger.middleware.ts
```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class  LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        console.log("请求开始进行拦截了！！！");
        next(); // 放行
    }
}
```
### app.module.ts
```typescript
import { NestModule,RequestMethod, MiddlewareConsumer  } from '@nestjs/common';
import { LogerMiddleware } from './middleware/loger.middleware';

import { CatsController } from './cats/cats.controller';

// 默认是 export class  AppModule {}
export  class  AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        //  1.拦截指定/user路由的所有请求
        consumer.apply(LogerMiddleware).forRoutes('user'); 
        /* 
        *   2.拦截指定路由，指定方法的请求
        *   consumer.apply(LogerMiddleware).forRoutes({
        *      path: 'user', method: RequestMethod.GET 
        *   })
        * */
        // 3.也可以把xx.controller.ts 放到forRoutes中,会拦截其中的请求，经过中间件处理
        console.apply(LogerMiddleware).forRoutes(CatsController)
    }
}
```
## 函数式中间件

> logger.middleware.ts 抛出一个函数即可

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// @Injectable()
// export class  LoggerMiddleware implements NestMiddleware {
//     use(req: Request, res: Response, next: NextFunction) {
//         console.log("请求开始进行拦截了！！！");
//         next(); // 放行
//     }
// }

export function LoggerMiddleware(req: Request, res: Response, next: NextFunction) {
    console.log("函数式中间件：请求开始进行拦截了！！！");
    next(); // 放行
}

// 应用时跟之前一样，只是定义的时候，定义了一个函数然后进行抛出
```

## 多个中间件
定义分为两种，函数式和类式，应用的时候有些变化

在apply方法中进行逗号隔离
```typescript
consumer.apply(cats, user, logger).forRoutes('user')
```
## 全局中间件

> 只能使用函数式中间件,做一个白名单拦截

### main.ts

```typescript
import {Response} from "@algolia/requester-common";
import {Connect} from "vite";
import NextFunction = Connect.NextFunction;

const whiteList = ['/list'];

function middlewareAll( req: Request, res: Response, next: NextFunction ) {
    if (whiteList.includes(req.originalUrl) ) {
        next();
    } else {
      res.send("抓住你了，小黑子！！！")  
    }
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(middlewareAll);
    await app.listen(3000);
}
bootstrap();
```


