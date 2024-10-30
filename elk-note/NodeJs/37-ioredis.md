
## 介绍
ioredis 是一个强大且流行的 Node.js 库，用于与 Redis 进行交互。Redis 是一个开源的内存数据结构存储系统。ioredis 提供了一个简单高效的 API，供 Node.js 应用程序与 Redis 服务器进行通信。

- 高性能：ioredis 设计为快速高效。它支持管道操作，可以在一次往返中发送多个 Redis 命令，从而减少网络延迟。它还支持连接池，并且可以在连接丢失时自动重新连接到 Redis 服务器。

- Promises 和 async/await 支持：ioredis 使用 promises，并支持 async/await 语法，使得编写异步代码和处理 Redis 命令更加可读。

- 集群和 sentinel 支持：ioredis 内置支持 Redis 集群和 Redis Sentinel，这是 Redis 的高级功能，用于分布式设置和高可用性。它提供了直观的 API，用于处理 Redis 集群和故障转移场景。

- Lua 脚本：ioredis 允许你使用 eval 和 evalsha 命令在 Redis 服务器上执行 Lua 脚本。这个功能使得你可以在服务器端执行复杂操作，减少客户端与服务器之间的往返次数。

- 发布/订阅和阻塞命令：ioredis 支持 Redis 的发布/订阅机制，允许你创建实时消息系统和事件驱动架构。它还提供了对 BRPOP 和 BLPOP 等阻塞命令的支持，允许你等待项目被推送到列表中并原子地弹出它们。

- 流和管道：ioredis 支持 Redis 的流数据类型，允许你消费和生成数据流。它还提供了一种方便的方式将多个命令进行管道化，减少与服务器之间的往返次数。

## 使用

### 初始化实例
```shell
npm install ioredis
```
```javascript
import Ioredis from 'ioredis'

const ioredis = new Ioredis({
    host: "127.0.0.1",
    port: 63795
})
```
### 字符串
```javascript
// 1、普通存储
ioredis.set('name', 'elk');
// 2、读取
ioredis.get('name').then(data => {
    console.log(data);
})
// 3、设置过期时间
ioredis.setex('name', 10, 'lucky');
```
### 集合
```javascript
// 1、添加数据到集合中
ioredis.sadd("elk","e1","e2","e3")

// 2、移除指定集合内容
ioredis.srem("elk","e1")

// 3、检查元素是否存在集合中
ioredis.sismember("elk","e3").then(data => {
    console.log("是否存在",data) // 1 | 0
})

// 4、获取集合所有元素
ioredis.smembers("elk").then(data => {
    console.log("集合元素：",data)
})
```
### 哈希
```javascript
// 1、添加数据到哈希中
ioredis.hset("user","name","elk","age","18")

// 2、获取哈希数据
ioredis.hget("user","name").then(data => {
    console.log("哈希数据：",data)
})

// 3、获取哈希所有数据
ioredis.hgetall("user").then(data => {
   console.log("哈希数据：",data)
})

// 4、删除哈希值
ioredis.hdel("user", 'name')
```
### 列表
```javascript
// 1、添加数据到列表中
ioredis.lpush("list","1","2","3")
ioredis.rpush("list","4","5","6")

// 2、获取队列所有内容
ioredis.lrange("list",0,-1).then(data => {
    console.log("列表内容", data) // 3 2 1 4 5 6
})

// 3、获取列表的长度
ioredis.llen("list").then( length => {
    console.log("列表长度:", length) // 6
})
```
