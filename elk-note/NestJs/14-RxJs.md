
## 概述
RxJs 使用的是观察者模式，用来编写异步队列和事件处理。

Observable 可观察的物件

Subscription 监听Observable

Operators 纯函数可以处理管道的数据 如 map filter concat reduce 等


[RxJs文档](https://cn.rx.js.org/)

## 案例

### 迭代器

类似于迭代器 next 发出通知  complete通知完成

subscribe 订阅  observable  发出的通知 也就是一个观察者

```typescript
import { Observable } from "rxjs";
 
//类似于迭代器 next 发出通知  complete通知完成
const observable = new Observable(subscriber=>{
    subscriber.next(1)
    subscriber.next(2)
    subscriber.next(3)
 
    setTimeout(()=>{
        subscriber.next(4)
        subscriber.complete()
    },1000)
})
 
observable.subscribe({
    next:(value)=>{
       console.log(value)
    }
})
```

### 五秒执行一次程序

interval 五百毫秒执行一次 pipe 就是管道的意思 管道里面也是可以去掉接口的支持处理异步数据 去处理数据 这儿展示 了 map  和 filter 跟数组的方法是一样的  最后 通过观察者  subscribe 接受回调

```typescript
import { Observable, interval, take } from "rxjs";
import { map, filter,reduce,find,findIndex } from 'rxjs/operators'

const subs = interval(500).pipe(map(v => ({ num: v })), filter(v => (v.num % 2 == 0))).subscribe((e) => {
    console.log(e)
    if (e.num == 10) {
        subs.unsubscribe()
    }
})
```

### 操作DOM
Rxjs 也可以处理事件 不过我们在Nestjs 里面就不用操作DOM 了 你如果Angular 或则 Vue 框架看可以使用  fromEvent
```typescript
import { Observable, interval, take,of,retry,fromEvent } from "rxjs";
import { map, filter,reduce,find,findIndex } from 'rxjs/operators'
 
const dom = fromEvent(document,'click').pipe(map(e=>e.target))
dom.subscribe((e)=>{
 
})
```
