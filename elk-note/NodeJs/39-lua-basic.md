
## 基本使用
### 全局变量和局部变量
- 全局变量是在全局作用域下定义的变量，可以在脚本任意地方访问
- 全局变量赋值时不需要加任意关键字，直接赋值即可
```lua
name = 'elk'

print(name) -- 'elk'
```
- 局部变量是在特定作用域下定义的变量，只能在当前的作用域内访问
- 局部变量通常在函数内部、或者代码块使用do...end」中定义
- 局部变量使用关键字 local 声明
```lua
-- 代码块
do
    local name = 'lucky'
    print(name) -- 'lucky'
end

print(name) -- nil  代表未声明 类似于 null
```
### 条件语句
在lua中也是使用 if  elseif  else 来实现条件判断
> elseif  中间是连着的
> 
> if、elseif 后面跟then
> 
> 最后结尾跟 end
```lua
local name = 'elk'

if name == 'elk' then
  print("elk的附属")
elseif name == 'lucky' then
  print("lucky的附属")
else 
  print("未知名的附属")
end
```
### 函数
在Lua中，函数是一种可重复使用的代码块，用于执行特定的任务或操作
```lua
local name = 'elk'

function fun(name)
    if name == 'elk' then
      print("elk的附属")
      return name
    elseif name == 'lucky' then
      print("lucky的附属")
      return name
    else 
      print("未知名的附属")
      return "未知名"
    end
end

local fn = fun(name)
print(fn)

```


## 数据类型
Lua 中有八种基本类型

- nil : 一个没有意义的值、无效值
- boolean : 布尔值，true和false
- number : 数值，整数和浮点数
- string : 字符串，由字符序列组成
- function : 函数，用于封装可执行的代码块
- userdata : 用户自定义数据类型，通常与C语言库交互使用
- thread : 协程，用于实现多线程编程。
- table : 表，一种关联数组，用于存储和组织数据。

1、数据类型的用法
```lua
type = 1     -- 整数
type = 1.1   -- 浮点数
type = false -- 布尔值
type = 'elk' -- 字符串
type = nil   -- nil 就是null

print(type)
```
2、字符串拼接
```lua
local name = 'elk'
local desc = '打工人'

print( name .. '是' .. desc )  --  elk是打工人
```

3、table：描述对象、数组
> lua 索引下标从1开始
```lua
-- 数组
local tableArr = { 1, '2', 3.14, 4 }

print(tableArr[0]) --  nil
print(tableArr[1]) --  1
print(tableArr[-1]) -- nil 

-- 对象
local tableObj = {
    name = 'elk',
    age = 18
}

print(tableObj.name)  -- 'elk'
print(tableObj.age)   --  18
```
4、循环
语法： 

for 临时变量名=开始值,结束值,步长 do

循环的代码

end

步长可以省略，默认为1
```lua
-- for循环
for i = 1, 10, 1 do
    if i == 5 then
        print('中断了', i）
    end
    print(i)
end
-- 1 2 3 4 5 ... 10

-- 中断循环
for i = 1, 10, 1 do
    if i == 5 then
        print('中断了',i)
        break
    end
    print(i)
end
-- 1 2 3 4 中断了 5
```
5、循环对象、数组
```lua
-- 循环数组
local tableArr = { 1, '2', 3.14, 4 }
for index, value in ipairs(tableArr) do
    print(index, value)
end
-- 1  1
-- 2  '2'
-- 3  3.14
-- 4  4

-- 循环对象
local tabelObj = {
    name = 'elk',
    age = 18
}
for key, value in pairs(tabelObj) do
    print(key, value)
end
-- name 'elk'
-- age  18
```
## 模块化
- module.lua
```lua
local Module = {}
-- Module.methods 直接通过.追加方法

-- 求和方法
function Module.sum(a,b)
    return a + b
end

-- 求乘方法
function Module.qua(a,b)
    return a * b
end

return Module  -- return就行
```
- index.lua
```lua
local module = require('./module')

local sum = module.sum(1,2)
local qua = module.qua(1,2)

print(sum)  -- 3
print(qua)  -- 2
```
