
## 介绍
装饰器（Decorators）是一种特殊类型的声明，它可以被附加到类声明、方法、访问符、属性或参数上。装饰器使用 @表达式 这种形式，其中 @ 符号表示装饰器，而 表达式 求值后必须为一个函数，这个函数会在运行时被调用，被装饰的声明信息作为参数传入。

装饰器的种类有多种：
- 类装饰器
- 方法装饰器
- 属性装饰器
- 参数装饰器
## 使用
- tsconfig.json
```json
/* Language and Environment */
"target": "es2016",                                  /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */
// "lib": [],                                        /* Specify a set of bundled library declaration files that describe the target runtime environment. */
// "jsx": "preserve",                                /* Specify what JSX code is generated. */
"experimentalDecorators": true,  // 将这块打开
```
### 类装饰器
```typescript
const doc:ClassDecorator = (target: any) => {
  console.log("🚀 ~ doc ~ target:", target) // 接收的是class A这个类
}
@doc
class A {
  name: string
  constructor(name: string) {
    this.name = name
  }
}
// 想当于向下兼容  doc(A)
```
### 属性装饰器
```typescript
const prop:PropertyDecorator = (target: Object, propertyKey: string | symbol) => {
  console.log("🚀 ~ prop ~ target:", target) // 接收的是class B类的原型对象
  console.log("🚀 ~ prop ~ propertyKey:", propertyKey) // 接收的是name这个属性
}
class B {
    @prop
    name: string
    constructor(name: string) {
      this.name = name
    }
}
```
### 方法装饰器
```typescript
const method: MethodDecorator = (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
  console.log("🚀 ~ method ~ target:", target) // 接收的是class C类的原型对象
  console.log("🚀 ~ method ~ propertyKey:", propertyKey) // 接收的是getName这个方法
  console.log("🚀 ~ method ~ descriptor:", descriptor) // 接收的是getName方法的描述对象
  /* 
    descriptor
     {
        value: ƒ getName(), // 表示getName方法
        writable: true,     // 表示是否可以修改
        enumerable: false,  // 表示是否可以枚举
        configurable: true  // 表示是否可以配置
     }
  */
}
class C {
    name: string
    constructor(name: string) {
      this.name = name
    }
    @method
    getName() {
      return this.name
    }
}
```
### 参数装饰器
```typescript
const params:ParameterDecorator = (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) => {
  console.log("🚀 ~ params ~ target:", target) // 接收的是class D类的原型对象
  console.log("🚀 ~ params ~ propertyKey:", propertyKey) // 接收的是getName这个方法
  console.log("🚀 ~ params ~ parameterIndex:", parameterIndex) // 接收的是getName方法的第0个参数
}
class D {
    name: string
    constructor(name: string) {
      this.name = name
    }
    getName(@params name: string) {
      return this.name
    }
}
```
