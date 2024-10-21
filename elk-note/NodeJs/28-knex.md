
## 介绍
Knex是一个基于JavaScript的查询生成器，它允许你使用JavaScript代码来生成和执行SQL查询语句。它提供了一种简单和直观的方式来与关系型数据库进行交互，而无需直接编写SQL语句。你可以使用Knex定义表结构、执行查询、插入、更新和删除数据等操作

https://knexjs.org/
## 安装和设置
> knex支持多种数据库 pg sqlite3 mysql2 oracledb tedious

用什么数据库安装对应的数据库即可
```shell
#安装knex
$ npm install knex --save

#安装你用的数据库
$ npm install pg
$ npm install pg-native
$ npm install sqlite3
$ npm install better-sqlite3
$ npm install mysql
$ npm install mysql2
$ npm install oracledb
$ npm install tedious
```
### 连接数据库
```javascript
// 创建knex连接数据库
const db = knex({
    client: 'mysql2',     // 绑定数据库
    connection: config.db // 连接配置项
})
```
## 定义表结构
-- app.js
```javascript
db.schema.createTableIfNotExists('list', table => {
    table.increments('id'), // 主键 自增
    table.string('name'),   // 姓名
    table.string('email'), // 邮箱
    table.timestamps(true, true) // 创建时间和更新时间
}).then(() => {
    console.log("创建成功")
})
```
## 增删改查
-- app.js
```javascript
import mysql2 from "mysql2/promise";
import express from "express";
import jsyaml from "js-yaml";
import fs from "fs";
import knex from "knex";
// 引入配置文件
const yaml = fs.readFileSync("./db.config.yaml", "utf8");
// 将配置文件转为对象「字符串 -> 对象」
const config = jsyaml.load(yaml);

// 顶层await写法：创建一个mysql连接
// const sql = await mysql2.createConnection({...config.db});

// 创建knex连接数据库
const db = knex({
    client: 'mysql2',
    connection: config.db
})

// 定义表结构
db.schema.createTableIfNotExists('list', table => {
    table.increments('id'), // 主键 自增
    table.string('name'),   // 姓名
    table.string('email'), // 邮箱  唯一的
    table.timestamps(true, true) // 创建时间和更新时间
}).then(() => {
    console.log("创建成功")
})

const app = express();
// 解析body
app.use(express.json())

// 查询所有 query传参
app.get('/', async (req, res) => {
    const data = await db('list').select('*');
    const total = await db('list').count('* as total');
    // const [data] = await sql.query("select * from elk_user");
    res.send({
        code: 200,
        data,
        total
    });
})
// 条件查询 params传参
app.get('/row/:id', async (req, res) => {
    const id = req.params.id
    const row = await db('list').select('*').where({id})
    // const [row] = await sql.query("select * from elk_user where id=?", [req.params.id]);
    res.send(row);
})
// 新增数据 post
app.post("/add", async (req, res) => {
    const { name, email, address, money } = req.body;
    await db('list').insert({
        name,
        email,
    })
    // await sql.query('insert into elk_user(name,age,address,money) values (?,?,?,?)', [name, age, address, money])
    res.send({
        code : 200,
        data: '新增成功'
    })
})

// 修改数据 post
app.post("/update", async (req, res) => {
    const { id, name, email, address, money } = req.body;
    await db('list').update({
        name,
        email
    }).where({id})
    // await sql.query('update elk_user set name=?,age=?,address=?,money=? where id=?', [name, age, address, money, id])
    res.send({
        code : 200,
        data: '修改成功'
    })
})

// 删除数据
app.post('/delete', async (req, res) => {
    const {id} = req.body;
    await db('list').delete().where({id})
    // await sql.query('delete from elk_user where id=?', [id])
    res.send({
        code : 200,
        data: '删除成功'
    })
})

const port = 8082;
app.listen(port, () => {
	console.log(`server is running at prot ${port}`);
});
```
## 事务
事务来确保一组数据库操作的原子性，即要么全部成功提交，要么全部回滚

### 案例
A - B 转钱

例如A给B转钱，需要两条语句，如果A语句成功了，B语句因为一些场景失败了，那这钱就丢了，所以事务就是为了解决这个问题，要么都成功，要么都回滚，保证金钱不会丢失。
```javascript
//伪代码
db.transaction(async (trx) => {
    try {
        await trx('list').update({money: -100}).where({ id: 1 }) //A
        await trx('list').update({money: +100}).where({ id: 2 }) //B
        await trx.commit() //提交事务
    }
    catch (err) {
        await trx.rollback() //回滚事务
    }
})
```
