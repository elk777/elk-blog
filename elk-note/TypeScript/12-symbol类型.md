
## symbol类型

### 定义
ES2015引入的一个新的原始类型的值，类似于字符串，每一个Symbol的值都是独一无二的
```typescript
let s1:symbol = Symbol()
let s2:symbol = Symbol()
console.log("symbol:", s1 === s2)  // false
```

### unique symbol
表示单个的、某个具体的Symbol值，只能通过const定义
```typescript
let s1:unique symbol = Symbol() // 报错
const s2:unique symbol = Symbol() // 正确

const a1:unique symbol = Symbol();
const b1:unique symbol = Symbol();
a1 === b1 // 报错

const a2:unique symbol = Symbol();
const b2:unique symbol = a2; // 报错

const a3:unique symbol = Symbol();
const b3:typeof a3 = a3; // 正确

const a4:unique symbol = Symbol();
const b4:symbol = a4; // 正确
const c4:unique symbol = b4; // 报错
```

### 类型推断
如果变量声明没有定义指定类型，TS会进行类型推断推断出变量的类型
```typescript
let s5 = Symbol();    // 推断为symbol类型
const s6 = Symbol();  // 推断为unique symbol类型
const s7:symbol = Symbol();  // 类型为bsymbol类型
s5 = s6 // s5也为symbol类型
```
