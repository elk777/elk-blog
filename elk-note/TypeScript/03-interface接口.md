

## interface接口

### 定义

接口是一种规范，它定义了某个类应该具有的共有属性和方法，接口中的方法都是抽象方法，接口中的属性都是常量。

### 语法

interface接口名 {
    属性名: 类型
}

### 特点
<br/>

#### 不能多属性，也不能少属性
````typescript
interface Person {
    name: string
    age: number
}

let elk: Person = {
    name: 'elk',
}
// 此时elk会报错，因为缺少age属性
let lucky: Person = {
    name: 'lucky',
    age: 18
}
// lucky ok
````
#### 相同名字的interface可以合并
````typescript
interface Person: {
    name: string
    age: number
}
interface Person: {
    sex: string
}
let elk:Person = {
    name: 'elk',
    age: 18,
}
// 此时elk会报错，因为缺少sex属性
let lucky: Person = {
    name: 'lucky',
    age: 18,
    sex: '未知'
}
// lucky ok
````
#### 可选属性 ? (可写可不写)
````typescript
interface Person: {
    name: string
    age: number
    sex?: string
}
let elk:Person = {
    name: 'elk',
    age: 18,
    sex: '男' // 当前属性添加不添加都正常，不会报错
}
````
#### 只读属性 readonly
````typescript
interface Person: {
    readonly id: number
    name: string
}
let elk:Person = {
    id: 1,
    name: 'elk'
}
elk.id = 2 // 报错
elk.name = 'lucky' // 进行了修改
````
#### 任意属性
>写法[key: string]: any

````typescript
interface Person: {
    name: string,
    [key: string]: any
}
let elk:Person = {
    name: 'elk', //name 是必须的
    age: 18,
    sex: '男'
    // 随机＋ 满足[key: string]: any即可
}
````
#### 接口继承
>关键字 extends
````typescript
interface Person1: {
    name: string,
}
interface Person extends Person1 {
    age: number
}
let elk:Person = {
    age: 18,
}
// 此时elk会报错，它继承了Person1，所以它必须包含name属性
let lucky:Person = {
    name: 'lucky',
    age: 18,
}
// lucky ok
````

#### 接口的函数
>写法: (paramName: string) => void
````typescript
interface Person {
    name: string,
    setName: (name: string) => void
}
let elk:Person = {
    name: 'elk',
    setName(name: string): void {
        console.log('姓名：',name)
    }
}
````


