
## 表达式
MySQL表达式是一种在MySQL数据库中使用的计算式或逻辑式。它们可用于查询、更新和过滤数据，以及进行条件判断和计算。
> 算术表达式：可以执行基本的数学运算，例如加法、减法、乘法和除法。例如：SELECT col1 + col2 AS sum FROM table_name;
> 
> 字符串表达式：可以对字符串进行操作，例如连接、截取和替换。例如：SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM table_name;
> 
> 逻辑表达式：用于执行条件判断，返回布尔值（TRUE或FALSE）。例如：SELECT * FROM table_name WHERE age > 18 AND gender = 'Male';
> 
> 条件表达式：用于根据条件返回不同的结果。例如：SELECT CASE WHEN age < 18 THEN 'Minor' ELSE 'Adult' END AS age_group FROM table_name;
> 
> 聚合函数表达式：用于计算数据集的聚合值，例如求和、平均值、最大值和最小值。例如：SELECT AVG(salary) AS average_salary FROM table_name;
> 
> 时间和日期表达式：用于处理时间和日期数据，例如提取年份、月份或计算日期差值。例如：SELECT YEAR(date_column) AS year FROM table_name;
```sql
-- 查询的时候值增加返回
SELECT age + 100 FROM elk_user 

-- 更换一个列名 as
SELECT age + 100 as age FROM elk_user 
```
## 函数
MySQL提供了大量的内置函数，用于在查询和操作数据时进行计算、转换和处理。
### 字符串函数
- CONCAT(str1, str2, ...)：将多个字符串连接起来。
- SUBSTRING(str, start, length)：从字符串中提取子字符串。
- UPPER(str)：将字符串转换为大写。
- LOWER(str)：将字符串转换为小写。
- LENGTH(str)：返回字符串的长度。

### 数值函数
- ABS(x)：返回x的绝对值。
- ROUND(x, d)：将x四舍五入为d位小数。
- CEILING(x)：返回不小于x的最小整数。
- FLOOR(x)：返回不大于x的最大整数。
- RAND()：返回一个随机数。

### 日期和时间函数
- NOW()：返回当前日期和时间。
- CURDATE()：返回当前日期。
- CURTIME()：返回当前时间。
- DATE_FORMAT(date, format)：将日期格式化为指定的格式。
- DATEDIFF(date1, date2)：计算两个日期之间的天数差。

### 条件函数
- IF(condition, value_if_true, value_if_false)：根据条件返回不同的值。
- CASE WHEN condition1 THEN result1 WHEN condition2 THEN result2 ELSE result END：根据条件返回不同的结果。

### 聚合函数
- COUNT(expr)：计算满足条件的行数。
- SUM(expr)：计算表达式的总和。
- AVG(expr)：计算表达式的平均值。
- MAX(expr)：返回表达式的最大值。
- MIN(expr)：返回表达式的最小值。

```sql
-- 字符串拼接
SELECT CONCAT(name, '最帅') FROM elk_user

-- 生成随机数
SELECT RAND() FROM elk_user

-- 求和
SELECT SUM(money) FROM elk_user

-- 获取总数
SELECT COUNT(*) FROM elk_user
```
