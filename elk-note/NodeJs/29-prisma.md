
## 介绍
Prisma 是一个现代化的数据库工具套件，用于简化和改进应用程序与数据库之间的交互。它提供了一个类型安全的查询构建器和一个强大的 ORM（对象关系映射）层，使开发人员能够以声明性的方式操作数据库。

Prisma 支持多种主流数据库，包括 PostgreSQL、MySQL 和 SQLite，它通过生成标准的数据库模型来与这些数据库进行交互。使用 Prisma，开发人员可以定义数据库模型并生成类型安全的查询构建器，这些构建器提供了一套直观的方法来创建、更新、删除和查询数据库中的数据。

> **类型安全**： Prisma 自动生成 TypeScript 或 JavaScript 类型定义，确保在编译时就能捕捉到错误。
> 
> **简化的api**：Prisma 提供了一个简洁的 API，用于执行 CRUD（创建、读取、更新、删除）操作和其他数据库查询。
> 
> **自动迁移**：Prisma 迁移系统允许你以声明式方式定义数据库 schema 的变化，并自动应用这些变化。
> 
> **模型生成**：Prisma 可以根据数据库 schema 自动生成模型代码，减少了手动编写模型的需要。
> 
> **多数据库支持**：Prisma 支持多种数据库，包括 PostgreSQL、MySQL 和 SQLite。
> 
> **实时数据订阅**：Prisma 支持实时数据订阅，允许你监听数据库变化并实时获取更新。
> 
> **强大的查询构建器**：Prisma 提供了一个强大的查询构建器，用于构建复杂的查询而不需要编写 SQL 代码。
> 
> **跨平台**：Prisma 可以在多种环境中运行，包括 Node.js 和 TypeScript 项目。
## 安装和使用
参考文档： https://prisma.nodejs.cn/

创建一个项目目录进入并在终端打开
```shell
mkdir prisma  
cd prisma
```
使用npm初始化TypeScript项目
```shell
npm init -y
npm install typescript ts-node @type/node --save-dev
```
初始化TypeScript
```shell
npx tes --init
```
安装prisma CLI作为开发依赖
```shell
npx install prisma --save-dev
```
使用prisma CLI的init命令设置一个prisma ORM
```shell
# 最后面那个使用什么库，写什么库
npx prisma init -datasource-provider mysql
```
此时会创建一个带有 schema.prisma 文件的新 prisma 目录，并将 mysql 配置为你的数据库

连接mysql
- .env 
```javascript
DATABASE_URL="mysql://[账号]:[密码]@[主机]:[端口号]/[库名]"

DATABASE_URL="mysql://root:123456@localhost:33061/prisma_test"
```
## 创建表
- schema.prisma
```javascript
// 创建用户表
model User {
  id Int  @id @default(autoincrement()) // id 主键、自增
  name String  // 姓名
  email String @unique // 邮箱 唯一的
  posts Post[] 
}

// 创建文章表
model Post {
  id Int @id @default(autoincrement()) // id 主键、自增
  title String   // 文章标题
  content String  // 文章内容
  author User @relation(fields: [authorId], references: [id]) // 作者 关联表 关联关系：authorId关联User表中的id
  authorId Int  // 关联id
}
```
执行命令，创建表
> 此命令会覆盖当前库所有内容，建议创建新库
```shell
npx prisma migrate dev 
```
## 增删改查
-app.ts
```typescript
import express from "express"
import { PrismaClient } from "@prisma/client"

// 初始化prisma
const prisma = new PrismaClient();
// 初始化客户端
const app = express();
app.use(express.join()); // 获取body

// 查询所有
app.get("/", async(req, res) => {
    const result = await prisma.user.findMany({
        // 开启之后，可查询关联信息表
        include: {
            posts: true
        }
    });
    res.json(result || [])
})
// 查询单个
app.get("/:id", async(req, res) => {
    const id = req.params.id;
    const row = await prisma.user.findUnique({
        where: {
            id: Number(id) //number类型，需转一下
        }
    })
    res.json(row || [])
})
// 新增数据
app.post("/create", async(req, res) => {
    const { name, email } = req.body;
    try {
        const result = await  prisma.user.create({
            data: {
                name,
                email,
                posts: [
                    {
                        title: '文章1', content: '文章1的内容'
                    },
                    {
                        title: '文章2', content: '文章2的内容'
                    }
                ]
            }
        })
        res.json(result)
    }catch(err) {
        res.status(500).json({ error: '创建失败' });
    }
})
// 修改数据
app.post("/update", async(req, res) => {
    const { name, email, id } = req.body;
    const row = await prisma.user.update({
        where: { id: Number(id)},
        data: {
            name,
            email
        }
    })
    res.json(row)
})
// 删除数据
app.post('/delete', async (req, res) => {
    const { id } = req.body;
    // 直接删除带有关联关系的数据，会提示报错，违反外键约束
    // 将关联的数据也一并删除
    await prisma.post.deleteMany({
        where: { authorId: Number(id) }
    })
    const result = await prisma.user.delete({
        where: { id: Number(id) },
    });
    res.json(result);
})

// 端口号
const port = 8012;
// 监听服务
app.listen(port, () => {
    console.log("服务启动成功")
})
```
- request.http
```http request

# 查询所有
 GET http://localhost:8012/ HTTP/1.1

# 单个查询
 GET http://localhost:8012/1 HTTP/1.1

# 新增数据
 POST http://localhost:8012/create HTTP/1.1
 Content-Type: application/json

 {
     "name": "elk",
     "email": "123@qq.com"
 }

# 修改数据
 POST http://localhost:8012/update HTTP/1.1
 Content-Type: application/json

 {
     "id": 1,
     "name": "elk2"
 }

# 删除数据
POST http://localhost:8012/delete HTTP/1.1
Content-Type: application/json

{
    "id": 1
}
```
- 执行
```shell
ts-node app.ts
```
