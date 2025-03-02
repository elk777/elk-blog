
## 概述
自定义装饰器；在NestJs中使用了大量装饰器 decorator，同时也允许我们自定义装饰器

## 参数装饰器
Nest 提供了一组非常实用的参数装饰器，可以结合 HTTP 路由处理器（route handlers）一起使用。下面的列表展示了Nest 装饰器和原生 Express（或 Fastify）中相应对象的映射。

| NestJs                   | express                          |
|--------------------------|----------------------------------|
| @Request()，@Req()        | req                              |
| @Response()，@Res()       | res                              | 
| @Next()                  | next                             |
| @Session()               | req.session                      |
| @Param(param?: string)   | req.params / req.params[param]   |
| @Body(param?: string)    | req.body / req.body[param]       |
| @Query(param?: string)   | 	req.query / req.query[param]    |
| @Headers(param?: string) | req.headers / req.headers[param] |
| @Ip()                    | req.ip                           |
| @HostParam()             | req.hosts                        |

## 案例

自定义权限装饰器：将上篇文章中的智能守卫「@SetMetadata」进行自定义装饰器封装

```shell
# 快速创建自定义装饰器模版
nest g d role
```
- src/guard/role/role.guard.ts
```typescript
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    /**
     * 使用 Reflector 从当前处理程序中获取名为 'admin' 的元数据
     * 该元数据预期是一个字符串数组
     * @param 'admin' - 元数据的键名
     * @param context.getHandler() - 当前执行的处理程序
     */
    const reflector = this.reflector.get<string[]>(
      'admin',
      context.getHandler(),
    );
    /**
     * 从执行上下文中切换到 HTTP 上下文，并获取当前的 HTTP 请求对象
     * 这里假设使用的是 Express 框架，因此请求对象类型为 Request
     */
    const request = context.switchToHttp().getRequest<Request>();
    /**
     * 检查是否存在 'admin' 元数据，并且请求查询参数中的 'role' 不在元数据列表中
     * 如果满足条件，则表示当前用户的角色不符合要求，返回 false 拒绝访问
     */
    if (reflector && !reflector.includes(request.query.role as string)) {
      return false;
    }
    /**
     * 如果不满足上述条件，则表示当前用户的角色符合要求，返回 true 允许访问
     */
    return true;
  }
}
```

- src/guard/role/role.decorator.ts
```typescript
import {
  SetMetadata,
} from '@nestjs/common';

export const Role = (...args: string[]) => SetMetadata('admin', args);
```
- src/guard/guard.controller.ts
```typescript
import {
  Controller,
  Get,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { GuardService } from './guard.service';
import { CreateGuardDto } from './dto/create-guard.dto';
import { UpdateGuardDto } from './dto/update-guard.dto';
import { RoleGuard } from './role/role.guard';
import { Role } from './role/role.decorator';

@Controller('guard')
@UseGuards(RoleGuard)
export class GuardController {
  constructor(private readonly guardService: GuardService) {}

  @Get()
  // @SetMetadata('admin', ['admin'])
  @Role('admin', 'elk') // 自定义装饰器
  findAll(@ReqUrl() url) {
    console.log('🚀 ~ GuardController ~ findAll ~ url:', url);
    return this.guardService.findAll();
  }
}
```
> @SetMetadata('admin', ['admin']): 第一个参数是元数据键 需跟guard文件中进行匹配 ，第二个参数是值
```typescript
// guard.ts
const reflector = this.reflector.get<string[]>(
      'admin',  // 跟装饰器第一个参数相互匹配，想当于名字
      context.getHandler(),
);
// request.query.role 传递参数时 role为键名 否则不对
if (reflector && !reflector.includes(request.query.role as string)) {
    return false;
}
```

> **当前封装的自定义装饰器，其实是一个方法装饰器**

## 传递数据
当装饰器的行为取决于某个特定的条件时，可以通过使用data参数将参数传递给装饰器的工厂函数，
一个用例是自定义装饰器，它通过键从请求对象中提取属性。

// 1、Post请求传递这些参数
```json
{
  "id": 101,
  "firstName": "elk",
  "lastName": "lucky",
  "email": "elk@email.com",
  "roles": ["admin","elk"]
}
```
// 2、通过@User('参数名')，获取指定参数值
- guard.controller.ts
```typescript
@Post()
findAll(@User('id') user) {
    console.log('🚀 ~ GuardController ~ findAll ~ user:', user);
    return this.guardService.findAll();
}
```
// 3、定义一个将属性名作为键的装饰器，如果存在则返回关联的值（如果不存在或者尚未创建 user 对象，则返回 undefined）。
- src/guard/role/role.decorator.ts
```typescript
import {
  SetMetadata,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import type { Request } from 'express';
export const Role = (...args: string[]) => SetMetadata('role', args);

export const User = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        console.log('🚀 ~ data:', data);
        const request = ctx.switchToHttp().getRequest<Request>();
        const user = request.body;
        return data ? user && user[data] : user;
    },
);
```
## 装饰器聚合
Nest 提供了一种辅助方法来聚合多个装饰器。

```typescript
import { applyDecorators } from '@nestjs/common';

export function Auth(...roles: Role[]) {
    return applyDecorators(
        SetMetadata('roles', roles),
        UseGuards(AuthGuard, RolesGuard),
        ApiBearerAuth(),
        ApiUnauthorizedResponse({ description: 'Unauthorized"' })
    );
}
```
```typescript
@Get('users')
@Auth('admin')
findAllUsers() {}

```
