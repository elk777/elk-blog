
## 概述
为了处理文件上传，Nest提供了一个内置的基于multer中间件包的Express模块。Multer 处理以 multipart/form-data 格式发送的数据，该格式主要用于通过 HTTP POST 请求上传文件。

### 使用插件
```shell
# @nestjs/platform-express  NestJS内置的
# multer @types/multer 需要额外安装

pnpm i -D multer @types/multer
```

### 基本使用
**1、通过 nest -g resource upload 生成一套上传模版**
```shell
nest -g resource upload
```

**2、module中引入注册文件目录**
- upload.module.ts

```typescript
import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';

import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
    imports: [
        MulterModule.register({
            storage: diskStorage({
                destination: './uploads', // 存放目录
                filename: (req, file, cb) => {
                    const filename = `${Date.now()}-${file.originalname}`;
                    return cb(null, filename);
                }
            })
        })
    ],
    controllers: [ UploadController ],
    providers: [ UploadService ]
})
```
**3、controller中的使用，获取file文件，进行处理**

- upload.controller.ts

```typescript
import {Controller, Post, UseInterceptors, UploadedFile} from '@nestjs/common';
import {UploadService} from './upload.service';
import {FileInterceptor} from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}
    
    @Post('album')
    @UseInterceptors(FileInterceptor('file'))
    UploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log('上传的文件信息：', file);
        return '上传了，成功不成功不知道！！！'
    }
}
```
**4、生成静态目录，访问上传之后的图片**

- main.ts

```typescript

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname,'uploads'),{
     prefix: '/files'
  })
  await app.listen(3000);
}
```
