
## 介绍
RESTful（Representational State Transfer，表现层状态转移）是一种软件架构风格，用于设计网络应用程序。它由Roy Fielding博士在2000年的博士论文中提出，作为HTTP协议的架构风格。RESTful架构风格强调客户端和服务器之间的交互应该是无状态的、可缓存的，并且以资源为中心。

### 核心概念
- 资源（Resource）: 在RESTful架构中，所有的数据和服务器上的功能都被视为“资源”。资源可以是任何内容，如用户数据、文档、图片等。资源通过URI（统一资源标识符）进行标识。
- 无状态（Stateless）: 每个请求从客户端到服务器必须包含所有必要的信息，以便服务器能够理解请求并独立地处理它。服务器不需要保存会话信息或之前的请求信息。
- 可缓存（Cacheable）: 响应应该被设计成可缓存的，这样客户端就可以缓存数据以提高效率。HTTP头信息，如ETag和Last-Modified，可以用来确定数据是否被修改过。
- 统一接口（Uniform Interface）: RESTful架构强调有一个统一的接口，这意味着不同的系统和组件可以通过相同的方式进行交互。这有助于系统的可维护性和可扩展性。
- 分层系统（Layered System）: 通信应该是分层的，客户端不应该直接与它无法感知的其他层通信。这允许系统的不同部分独立地演化。

### RESTful接口规范

-  GET：获取资源。请求一个资源，应返回资源的状态。
- 
  POST：创建资源。提交数据以创建新资源。
- 
  PUT：更新资源。更新一个资源的全部或部分。
- 
  DELETE：删除资源。删除指定的资源。
- 
  PATCH：部分更新资源。对资源进行部分修改。

### 案例
```javascript
// 获取文章列表：
GET /api/posts

// 创建新文章：
POST /api/posts

// 获取单个文章：
GET /api/posts/{id}

// 更新文章：
PUT /api/posts/{id}

// 删除文章：
DELETE /api/posts/{id}

// 部分更新文章：
PATCH /api/posts/{id}
```
## 版本控制
|  |  |
|----------| ---- | 
| URI Versioning | 版本将在请求的 URI 中传递（默认） |
| Header Versioning | 自定义请求标头将指定版本 |
| Media Type Versioning | 请求的Accept标头将指定版本 |
### 配置

#### main.ts
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// 引入版本控制
import { VersioningType } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 开启版本控制
  app.enableVersioning({
    type: VersioningType.URI,
  });
  await app.listen(3000);
}
bootstrap();
```
#### article.controller.ts 控制器

##### 整体路由版本控制
```typescript
// @Controller('article')
@Controller({
  path: 'article',
  version: '1',
})
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  
  @Get()
  findAll() {
    return this.articleService.findAll();
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }
}
// 之前访问：http://localhost:3000/article
// 现在访问：http://localhost:3000/v1/article
```
##### 单个方法版本控制
```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
} from '@nestjs/common';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  
  @Get()
  findAll() {
    return this.articleService.findAll();
  }
  
  @Get(':id')
  @Version('1')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }
}
// 访问单个: http://localhost:3000/v1/article/1
// 访问所有: http://localhost:3000/article
```
## code码规范
- 200 : OK

- 304 : Not Modified 协商缓存了

- 400 : Bad Request 参数错误

- 401 : Unauthorized token错误

- 403 : Forbidden referer origin 验证失败

- 404 : Not Found 接口不存在

- 500 : Internal Server Error 服务端错误

- 502 : Bad Gateway 上游接口有问题或者服务器问题
