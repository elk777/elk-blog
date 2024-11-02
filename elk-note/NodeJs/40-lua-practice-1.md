
## 限流功能
基于reids、lua、nodejs，做一个抽奖限流功能，当抽奖点击次数过多的时候，就会提示稍后重试，进行限制。

## 所需依赖
ioredis: 操作redis

express: 搭建web服务器
```shell
npm install ioredis express
```
## 代码实现
- 目录
  - practice
      - index.js
      - index.html
      - index.lua
      - package.json


- index.js
```javascript
import express from 'express';
import ioredis from 'ioredis';
import fs from 'node:fs';
// 获取lua脚本内容
const lua = fs.readFileSync("./index.lua", "utf8");

const app = express()
const ioRedis = new ioredis();

let KEY = 'lottery',  // redis存储的key
    TIME = 30,        // 间隔时间
    LIMIT = 5;         // 间隔时间内的最大连击数

// 处理跨域
app.use('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next()
})

// get请求测试
app.get("/lottery", (req, res) => {
    /*
    * 执行脚本方法1：
    *   ioRedis.eval('script', numkey, ...keys, ...args, callback(err, result))
    *       script: 要执行的lua脚本
    *       numkey: 在脚本中使用的key的数量
    *       keys: 在脚本中使用的键的列表
    *       args: 传递给脚本的参数列表
    * */
    ioRedis.eval(lua, 1, KEY, TIME, LIMIT, (err, result) => {
        if(err) {
            console.log("err",err)
        }
        if(result) {
            res.send("抽奖成功")
        }else {
            res.send("请稍后重试！")
        }
    })
  
    /*
    * 执行脚本方法2：
    *   ioRedis.defineCommand(name, { numberOfKeys, lua })
    *       name: 定义的命名名称
    *       numberOfKeys: 脚本中使用的键的数量
    *       lua: Lua脚本字符串
    *   ioRedis.[name](...keys, ...args, callback(err, result))
    *       name: 定义的命令名称
    *       keys: 在脚本中使用的key的列表
    *       args: 传递给脚本的参数列表
    * */
    ioRedis.defineCommand('myLua', { numberOfKeys: 1, lua })
    ioRedis.myLua(KEY, TIME, LIMIT, (err, result) => {
      if(err) {
        console.log("err",err)
      }
      if(result) {
        res.send("抽奖成功")
      }else {
        res.send("请稍后重试！")
      }        
    })
})

app.listen(8822, () => {
    console.log("服务器启动成功！！！")
})

```
- index.lua
```lua
local key = KEYS[1]  -- 接收key值
local time = tonumber(ARGV[1])   -- 接收传递的参数 间隔时间
local limit = tonumber(ARGV[2])  -- 接收传递的参数 最大连击数
local count = tonumber(redis.call("get",key) or "0") -- 获取redis中key的值

if( count + 1 > limit ) then
  return 0
else
  redis.call("incr", key) -- 使key值递增+1
  redis.call("expire", key, time) -- 给key设置过期时间
  return 1
end
```
- index.html
```html
<body>
  <button id="btn">按钮</button>
  <script>
    const btn = document.getElementById("btn")
    btn.onclick = function() {
      fetch("http://localhost:8822/lottery").then(res => {
        return res.text()
      }).then( res => {
        alert(res)
      })
    }
  </script>
</body>
```
