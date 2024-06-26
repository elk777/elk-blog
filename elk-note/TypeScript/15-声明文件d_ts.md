
## 声明文件d.ts

### 定义
TS用于声明类型定义的文件扩展名，声明类型文件中只有类型代码，没有具体的代码实现，命名一般是「模块名.d.ts」的形式

### 示例
```typescript
// common.ts
export const fn = (a:number, b:number) => {
    return a + b;
}
export A = 1;
export B = '2';

// index.vue
import { A, B, fn } from './common'; // 此时提示未找到对应common.d.ts文件

// 声明common.d.ts文件
const A:number
const B:string
const function fn(a:number, b:number):number

// 此时index.vue引入不在提示错误
```

### declare关键字
> 1.declare可以描述变量、type或者interface声明的类型、class、Enum、函数、模块和命名空间
<br/>
> 2.declare 是描述 TS 文件之外信息的一种机制，它的作用是告诉 TS 某个类型或变量已经存在，不用给出具体实现。比如只描述函数的类型，不给出函数的实现，如果不使用declare，是做不到的
<br/>
> 3.declare 只能用来描述已经存在的变量和数据结构，不能用来声明新的变量和数据结构。另外所有 declare 语句都不会出现在编译后的文件里面。

### declare示例
```typescript
// common.d.ts
declare  A:number
declare  B:string
declare  function  fn(a:number,b:number):number
export  {
    A,
    B,
    fn
}

// 模块  moment
declare module 'moment' {
    interface Render {
        add(component: string):string
    }
    interface App {
        get(name:string):void
    }
    interface Moment {
        render: Render
        app: App
    }
    const moment:Moment
    export default moment
}
```
