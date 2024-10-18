

## 子查询
子查询（Subquery），也被称为嵌套查询（Nested Query），是指在一个查询语句中嵌套使用另一个完整的查询语句。子查询可以被视为一个查询的结果集，它可以作为外层查询的一部分，用于进一步筛选、计算或操作数据。
```sql
-- elk_user中存的用户基本信息「姓名、性别...」 user_child存这用户婚姻和工作
-- 关联关系 elk_user中的id 关联 user_child中的main_id
-- 需要通过名字查看user_child的信息，但是user_child没有存名字
-- 思路：通过名字查询user表中的id，然后通过user中的id去查询child中的main_id来
-- 来实现通过名字去查询child表中的信息

select * from user_child where main_id in ((select id from elk_user where name = 'elk'))
```
## 连表
Mysql的连表分为内连接，外连接，交叉连接。

### 内连接
内连接是最常用的连接类型，它只返回两个表中连接条件相匹配的行。如果连接条件不匹配，则该行不会被包括在结果集中。
```sql
-- 旧式写法
select * from elk_user,user_child where elk_user.id = user_child.main_id

-- 新式写法 「INNER JOIN ... ON ...」
select * from elk_user inner join user_child on elk_user.id = user_child.main_id
```

### 外连接
外连接返回至少在一个表中匹配的行，即使另一个表中没有匹配的行也会返回。外连接可以是左外连接、右外连接或全外连接。
#### 左外连接
- 关键字 「 LEFT OUTER JOIN ... ON ...」

左外连接返回左表（第一个表）的所有行，即使右表（第二个表）中没有匹配的行。
> 右表没有值补充null
```sql
-- 查询所有
select * from elk_user left outer join user_child on elk_user.id = user_child.main_id

-- 右表没值为NULL
select * from elk_user left outer join user_child on elk_user.id = user_child.id
```
#### 右外连接
- 关键字 「 RIGHT OUTER JOIN ... ON ... 」

右外连接返回右表（第二个表）的所有行，即使左表（第一个表）中没有匹配的行。
> 左表没有值补充null
```sql
-- 查询所有
select * from elk_user right outer join user_child on elk_user.id = user_child.main_id

-- 左侧为NULL
select * from elk_user right outer join user_child on elk_user.id = user_child.id
```
#### 全外连接
全外连接返回两个表中所有行，无论它们是否匹配。如果某一侧没有匹配，结果将包含 NULL 值。
- 关键字 「 FULL OUTER JOIN .. ON ... 」

```sql
select * from elk_user full outer join user_child on elk_user.id = user_child.main_id
```
