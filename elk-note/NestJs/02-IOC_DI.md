
## 介绍
### IOC控制反转
控制反转是一种设计原则，将对象之间的控制逻辑从对象本身转移到容器中去，在传统的编程中，一个类可能会
直接创建它依赖的其他类的实例，这导致了类之间产生强耦合，IoC的思想是将这种控制权反转，让外部容器「
而不是类本身」来决定如何实例化和组装对象。

### DI依赖注入
依赖注入是实现控制反转的一种方式，它将创建和维护对象依赖关系的职责从对象本身转移到容器。

依赖注入有两种主要形式：
- 构造函数注入：通过构造函数参数传递依赖项。
- setter注入：通过setter方法或属性赋值传递依赖项。
## 案例和实现
- 案例
```typescript
// 定义了一个A类
class A {
    name:string
    // constructor() {
    //     this.name = 'elk'
    // }
    // 此时修改A类, 改成传参的形式,B、C都会受到影响
    constructor(name:string) {
        this.name = name
    }
}
// B类应用A类
class B {
    a:any
    constructor() {
        // 此时B类使用会受到影响
        this.a = new A().name
    }
}
// C类也应用了A类
class C {
    a:any
    constructor() {
        // 此时C类使用会受到影响
        this.a = new A().name
    }
}
```
- 实现

```typescript
class A {
    name: string

    constructor( name: string ) {
        this.name = name
    }
}

class B {
    name: string

    constructor( name: string ) {
        this.name = name
    }
}

// 创建一个容器，来存储
class Container {
    modules: any

    constructor() {
        this.modules = {}
    }

    // 设置一个注入的方法
    inject( key: string, modules: any ) {
        this.modules[key] = modules
    }

    // 获取对应的类
    getKey( key: string ) {
        return this.modules[key]
    }
}

const mo = new Container();
mo.inject('a', new A('elk'))
mo.inject('b', new B('lucky'))

class C {
    a: any
    b: any
    constructor(container: Container) {
        // 此时在C类中已经与A、B两类进行解耦
        // 即使后续改动了A或B类，只需改动注入那块的代码
        // 不用单个去寻找使用A、B两类的其他类去改动
        this.a = mo.getKey("a");
        this.b = mo.getKey("b")
    }
}

const c = new C(mo);
console.log("🚀 ~ c:", c);
// 🚀 ~ c: C { a: A { name: 'elk' }, b: B { name: 'lucky' } }
```
