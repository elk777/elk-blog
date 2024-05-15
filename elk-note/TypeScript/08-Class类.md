
## Class类型

### 类的定义
面向对象编程的一个语法，本身是一个语法糖，通过class关键字定义的类，其内部会自动添加一个constructor方法，用来初始化对象。

### 类的修饰符
> public：公有，可以在任意位置访问，默认值<br/>
> protected：受保护的，只能在当前类和当前类的子类中访问<br/>
> private：私有的，只能在当前类中访问
````typescript
class Person {
    // TS中需在constructor上提前定义
    static id: number;
    private hobby: number;
    protected sex: string;
    name: string;
    age: number;
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
    getName() {
        return this.name;
    }
}
class Student extends Person {
    constructor(name: string, age: number) {
      super('lucky', 22)
    }
    create() {
      // this.hobby   // 继承 内部不能访问
      this.sex // 继承 内部能访问
    }
  }
let elk = new Person('elk', 18);
elk.name = 'elk';
// elk.hobby; // 访问不到
// elk.sex // 访问不到
````
### 静态成员
> 静态属性: static id <br/>
> 静态方法: static getId() { return this.id }
````typescript
class Person {
    static id: number;
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    static getId() {
        // 同为static属性可以使用this访问
        return this.id;
    }
}

````

### 虚拟dom[简单实现demo]
