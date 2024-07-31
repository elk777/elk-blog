
## 概述
用于处理文件和目录的路径的工具
```javascript
 const path = require('node:path')
```
## windows和posix
> path模块在不同操作系统有差异「 windows | posix 」
> 
> windows: windows操作系统
> 
> posix： 可移植操作系统接口
### 差异
    windows并没有完全遵循POSIX标准
在windows中使用反斜杠 \ 来表示路径分隔符， posix使用正斜杠 / 来表示

## 常用API

### path.basename
返回给定路径的最后一部分
> 当路径中使用反斜杠的时候，posix就无法解析直接返回F:\node\05-path.js
> 
> windows可以解析，返回 05-path.js
```javascript
const baseNamePosix = path.posix.basename('F:\\node\\05-path.js')
const baseName = path.win32.basename('F:\\node\\05-path.js');
console.log("🚀 ~ baseNamePosix:", baseNamePosix) //  F:\node\05-path.js
console.log("🚀 ~ baseName:", baseName)   // 05-path.js
```

### path.dirname
返回给定路径的目录部分
```javascript
const dirName = path.dirname('/elk-demo/index.html')
console.log("🚀 ~ dirName:", dirName) // /elk-demo
```

### path.extname
返回文件的扩展名「 包含 . 多个. 返回最后一个，没有扩展名返回空」
```javascript
const extName = path.extname('/elk-demo/package.json');
const extName2 = path.extname('/elk-demo/package.json.js.ts');
const extName3 = path.extname('/elk-demo/package');
console.log("🚀 ~ extName:", extName) // .json
console.log("🚀 ~ extName2:", extName2) // .ts
console.log("🚀 ~ extName3:", extName3) // 
```

### path.join
拼接路径
```javascript
const join = path.join('/elk-demo','index.html');
console.log("🚀 ~ join:", join) // /elk-demo/index.html
```

### path.resolve
将相对路径解析成绝对路径
```javascript
const resolve = path.resolve('index.html');
const resolve2 = path.resolve(__dirname, 'modules.js')
console.log("🚀 ~ resolve:", resolve) //   /Users/lucky_elk/Desktop/demo_project/vue_demo/vue3_project/NodeJs/index.html
console.log("🚀 ~ resolve2:", resolve2) // /Users/lucky_elk/Desktop/demo_project/vue_demo/vue3_project/NodeJs/modules.js
```

### path.parse 和 path.format
将路径字符串解析成对象、将对象解析成路径字符串
```javascript
const parse = path.parse('/elk-demo/index.html');
console.log("🚀 ~ parse:", parse)
/* 
    {
        root: '/',  // 路径的根目录
        dir: '/elk-demo', // 文件所在目录
        base: 'index.html', // 带扩展名的文件名
        ext: '.html', // 扩展名
        name: 'index' // 文件名
    }
*/
const format = path.format({
    root: '/',
    dir: '/elk-demo',
    base: 'index.html',
    ext: '.html',
    name: 'index'
})
console.log("🚀 ~ format:", format) // /elk-demo/index.html
```
