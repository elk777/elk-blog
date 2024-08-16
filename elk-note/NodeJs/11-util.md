

## 概述
满足node内部api的需求，提供的一个实用工具
```javascript
const util = require("node:util")
```

## 常用API

### promisify
采用遵循常见的错误优先的回调风格的函数（也就是将 (err, value) => ... 回调作为最后一个参数）返回一个promise对象

```javascript
const util = require("node:util")
const { exec } = require("node:child_process");
const fnPromise = util.promisify(exec)

// exec
exec("node -v",(err, stdout, stderr) => {
    if(err) return err
    console.log("🚀 ~ stdout,stderr", stdout, stderr)
})

fnPromise("node -v").then( res => {
    console.log("🚀 ~ res:", res) // { stdout: 'v20.11.0', stderr: '' }
})
```
#### 实现原理
> 接收一个函数作为参数
> 
> 返回一个新的函数
> 
> 调用真正的函数，将参数透传给形参，失败就reacet 成功就resolve，如果多个参数传一个对象

> **注意：**
> 
> 当前方法返回的是 { '0': 'v20.11.0\n', '1': '' },无法拿到stdout和 stderr这个key
> 
> 因为 nodejs内部 没有对我们开放 这个Symbol kCustomPromisifyArgsSymbol
```javascript
const myPromisify = (original) => {
    return (...args) => {
        return new Promise((resolve, reject) => {
            original(...args,(err, ...value) => {
                if(err) {
                    reject(err)
                }
                if(value && value.length > 1) {
                    let obj = {}
                    for(let key in value) {
                        obj[key] = value[key]
                    }
                    resolve(obj)
                } else {
                    resolve(value[0])
                }
            })
        })
    }
}
```

### callbackify
将一个promise对象转换为一个回调函数<br/>

采用 async 函数（或返回 Promise 的函数）并返回遵循错误优先回调风格的函数，即将 (err, value) => ... 回调作为最后一个参数。在回调中，第一个参数将是拒绝原因（如果 Promise 已解决，则为 null），第二个参数将是已解决的值
> 接收和返回
> 
> original：接收参数 async函数
> 
> Function：返回回调风格的函数
```javascript
const util = require("node:util");
const promiseFn = (type) => {
    if( type == 1) {
        return Promise.resolve(null, "成功了")
    }else {
        return  Promise.reject("失败了", null)
    }
}
const callbackFn = util.callbackify(promiseFn)
callbackFn(1, (err,res) => {
    console.log("🚀 ~ err:", err) // 1: null  2: 出错了
    console.log("🚀 ~ res:", res) // 1: 成功了 2： null
})
```
#### 实现原理
> 接收一个async函数
> 
> 返回一个新的函数
> 
> 
```javascript
const myCallbackify = (original) => {
    return (...args) => {
        const callback = args.pop();
        original(...args).then( res => {
            return callback(null ,res)
        }).catch(err => {
            return callback(err, null)
        })
    }
}
const myCallbackFn = myCallbackify(promiseFn)
myCallbackFn(1, (err,res) => {
    console.log("🚀 ~ err:", err) // 1: null  2: 出错了
    console.log("🚀 ~ res:", res) // 1: 成功了 2： null
})
```
