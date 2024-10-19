
## 介绍
这章主要介绍mysql结合nodejs实现数据增删改查等基本操作
### 安装依赖
- express： 用于构建服务器和web应用
- mysql2：  用于连接和操作mysql的一个库
- js-yaml： 用于解析和生成yaml配置文件
```shell
npm install express mysql2 js-yaml
```
## 应用

- db.config.yaml
```yaml
db:
  host: 'localhost'
  port: 33061   # mysql对应的端口号
  user: 'root'  # 数据库账号
  password: '123456'  # 数据库密码 必须是字符串
  database: 'demo-elk' # 数据库名
```
- app.js
```javascript
import express from 'express';
import mysql2 from  'mysql2/promise';
import jsyaml from 'js-yaml';
import fs from 'node:fs';
// 获取配置文件
const yaml = fs.readFileSync('./db.config.yaml', 'utf8');
// 解析配置文件转为对象
const config = jsyaml.load(yaml);
// 顶层await写法：创建一个mysql连接
const sql = await mysql2.createConnection({
    ...config.db
})
// 创建web应用
const app = express();
// 解析body
app.use(express.join())

// 查询所有数据 query传参
app.get('/', async (req, res) => {
    const [data] = sql.query(`select * from elk_user`);
    res.send(data)
})
// 查询单个数据 params传参
app.get("/user/:id", async(req, res) => {
    const {id} = req.params
    const [row] = sql.query(`select * from elk_user where id=?`,[id])
    res.send(row)
})
// 新增数据
app.post('/add', async(req, res) => {
    const {name, age, address} = req.body
    await sql.query(`insert into elk_user (name,age,address) values (?, ?, ?)`, [name, age, address])
    res.send({
        code: 200,
        data: "新增成功"
    })
})
// 修改数据
app.post('/update', async(req, res) => {
    const {id, name, age, address} = req.body
    await sql.query(`update elk_user set name = ? ,age = ?, address = ? where id = ?`,[name, age, address, id])
    res.send({
        code: 200,
        data: "修改成功"
    })
})
// 删除数据
app.post('/delete', async(req, res) => {
    const {id} = req.body
    await sql.query(`delete from elk_user where id=?`,[id])
    res.send({
        code: 200,
        data: "删除成功"
    })
})
// 设置端口号
const port = 8082;
// 监听服务
app.listen(port, () => {
    console.log("服务启动成功")
})
```
- app.http
```http request

# 查询所有
 GET http://localhost:8082/ HTTP/1.1

# 条件查询
 GET http://localhost:8082/user/2 HTTP/1.1

# 新增数据
 POST http://localhost:8082/add HTTP/1.1
 Content-Type: application/json

 {
     "name": "test",
     "age": 18,
     "address": "中国",
     "money": "1个小目标"
 }

# 修改数据
 POST http://localhost:8082/update HTTP/1.1
 Content-Type: application/json

 {
     "id": 12,
     "name": "haibara",
     "age": 18,
     "address": "日本",
     "money": "999999"
 }

# 删除数据
POST http://localhost:8082/delete HTTP/1.1
Content-Type: application/json

{
    "id": 12
}
```
