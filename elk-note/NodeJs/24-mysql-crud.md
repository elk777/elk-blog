
## 增删改操作

### 新增数据
> insert into 「表名」 (字段名1, 字段名2 ...) values (值1, 值2 ...)
```sql
INSERT INTO elk_user (`name`, `age`, `address`) VALUES ('Tom', 1, '纽约市')
```
### 删除数据
> delete from 表名  where 字段名 = 值
```sql
DELETE FROM elk_user WHERE name = 'Tom'
```
### 批量删除
> delete from 表名 where name in (值1, 值2)
```sql
DELETE FROM elk_user WHERE name IN ('Tom1', 'Tom2')
```
### 修改数据
> update 表名 set 字段1 = 值1, 字段2 = 值2 ... where 字段 = 值
```sql
UPDATE elk_user name = 'tom', age = 1 WHERE name = 'Tom'
```
