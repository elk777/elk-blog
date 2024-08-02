

## 概述
提供当前nodejs进程的信息以及进行相关操作
```javascript
const process = require("node:process");
```
## 相关API
### process.arch
返回系统的cpu架构
```javascript
const arch = process.arch;
// console.log("🚀 ~ arch:", arch) // arm64
```

### process.cwd()
返回当前运行文件的目录
```javascript
const cwd = process.cwd();
// console.log("🚀 ~ cwd:", cwd) // /Users/lucky_elk/Desktop/demo_project/vue_demo/vue3_project/NodeJs
```

### process.execPath
返回启动nodejs进行的可执行文件的绝对路径
```javascript
const execPath = process.execPath;
// console.log("🚀 ~ execPath:", execPath); //  /usr/local/bin/node
```

### process.argv
返回执行进程后面的参数，返回一个数组
>   第一个参数是 process.execPath 第二个参数是执行文件的绝对路径
```javascript
const argv = process.argv;
console.log("🚀 ~ argv:", argv);
/* 
    [
        '/usr/local/bin/node',
        '/Users/lucky_elk/Desktop/demo_project/vue_demo/vue3_project/NodeJs/07-process.js'
    ]
*/
```

### process.memoryUsage()
返回描述nodejs进行的内存使用量的对象
```javascript
const memoryUsage = process.memoryUsage();
console.log("🚀 ~ memoryUsage:", memoryUsage)
/* 
    {
        rss: 33259520,      // 常驻集大小
        heapTotal: 4194304, // v8的内存使用量
        heapUsed: 3549192,  // v8堆内存使用量
        external: 1379237,  // 外部内存使用量
        arrayBuffers: 10507 // ArrayBuffer的内存使用量
    }
*/
```

### process.exit()
调用这个对象，将nodejs进程关闭
```javascript
setTimeout(() => {
    console.log('定时器执行5s延迟完成');
}, 5000);
setTimeout(() => {
    console.log('强制关闭后面的定时器');
    process.exit(); // 5s延迟定时器不在执行
}, 3000);
// 监听exit事件，执行完exit事件之后，关闭nodejs进程
process.on('exit', (code) => {
    console.log('退出码为:', code);
});
// 不执行exit： 3s后输出 强制关闭后面的定时器  在等待2s 输出定时器执行5s延迟完成 
// 执行exit:   3s后输出 强制关闭后面的定时器  进程结束
```
### process.env
返回包含用户环境的对象，可进行修改和查询
> 修改不会影响当前系统的环境，只针对当前线程环境，线程结束释放

#### 环境变量的应用
> npm install cross-env: 跨平台设置环境变量 可在windows、posix上设置
> 
> 原理： 
> 
>   windwos: set NODE_ENV = "development"
>  
>   posix: export NODE_ENV = "development"
```javascript
// package.json 
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "cross-env NODE_ENV=development node 07-process.js",
    "build": "cross-env NODE_ENV=production node 07-process.js"
}
// 之后可在终端直接执行 npm run dev 等效于执行 node 07-process

```
