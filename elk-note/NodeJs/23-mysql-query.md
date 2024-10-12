
## 查询
查询是使用频率最高的语句
> select 「字段名」 from 「表名」
### 查询单个列
```sql
SELECT `name` FROM elk_user
```
### 查询多个列，逗号隔开
```sql
SELECT `name`,`id` FROM elk_user
```
### 查询所有列 *
```sql
SELECT * FROM elk_user
```
### 列的别名 as
```sql
SELECT `name`as `user_name` FROM elk_user
```
### 排序
> order by 「字段名称」
> 
> desc 降序
> 
> asc 升序
```sql
SELECT * FROM elk_user ORDER BY id desc
```

### 限制查询结果
limit 「开始位置」「限制条数」
> 位置是从0开始数的，跟数组一样
```sql
SELECT * FROM elk_user LIMIT 1,3
```
### 条件查询
```sql
SELECT * FROM elk_user WHERE name = 'elk'
```
### 多个条件联合查询
> and：相当于 && 都满足 返回 name = lucky 并且 age = 0 的数据
> 
> or：相当于 || 满足一个 返回前后满足条件的所有数据 「 name = lucky 和 age = 0 的数据都返回」
```sql
SELECT * FROM elk_user WHERE name = 'lucky' AND age = 0

SELECT * FROM elk_user WHERE name = 'lucky' OR age = 1
```
### 模糊查询
> 关键字： LIKE
> 
> "e%"：匹配以'e'开头的字符串，后面可以是任意字符串
> 
> "%e"：匹配以'e'结尾的字符串，前面可以是任意字符串
> 
> "%e%"：匹配包含'e'的字符串，前面和后面可以是任意字符串
```sql
SELECT * FROM elk_user WHERE name LIKE '%e'

SELECT * FROM elk_user WHERE name LIKE 'e%'

SELECT * FROM elk_user WHERE name LIKE '%l%'
```
