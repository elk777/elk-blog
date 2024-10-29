
## 字符串操作
```shell
SET key value [NX|XX] [EX seconds] [PX milliseconds] [GET]
```
- key : 要设置的键名
- value : 要设置的键值。
- NX : 可选参数 如果设置的键名不存在才生效。
- XX : 可选参数 如何设置的键名存在更新值,不存在不生效。
- EX seconds : 可选参数 将键的过期时间设置为指定的秒数。
- PX milliseconds : 可选参数 将键的过期时间设置为指定的毫秒数。
- GET : 可选参数 返回键的旧值

```shell
# 1、设置键名为 'name', 键值为 'elk'
set name 'elk'

# 2、只有键名 age 不存在时， NX 才生效 键值为 18
set age 18 nx

# 3、只有键名存在时， xx才生效，键值为20
set age 20 xx

# 4、设置键名 email，键值为123@qq.com 过期时间为6s
set email 123@qq.com ex 6

# 5、删除单个键名
del age

# 6、批量删除多个键名
del key1 key2 key3

# 7、删除不存在的键名，不会报错，返回0
del money
```
## 集合操作
集合（Set）是一种无序且不重复的数据结构，用于存储一组独立的元素。集合中的元素之间没有明确的顺序关系，每个元素在集合中只能出现一次。

```shell
# 1、添加成员到集合 family
sadd family 'elk'
sadd family 'lucky'

# 2、获取集合family中所有成员
smembers family

# 3、检查成员是否在family集合中,存在返回1 不存在返回0
sismember family tom

# 4、从集合family移除成员
srem family elk

# 5、获取集合的数量
scard family
```
## 哈希表操作
哈希表（Hash）是一种数据结构，也称为字典、关联数组或映射，用于存储键值对集合。在哈希表中，键和值都是存储的数据项，并通过哈希函数将键映射到特定的存储位置，从而实现快速的数据访问和查找。

```shell
# 1、设置哈希中的值
hset obj name elk age 18

# 2、获取哈希中的字段值
hget obj name  # "elk"

# 3、获取哈希表中所有的字段值
hgetall obj  # name elk age 18

# 4、删除哈希表中的字段
hdel obj age

# 5、检查哈希表中是否存在指定字段
hexists obj name # 存在返回1 不存在返回0

# 6、获取哈希表中的字段的数量
hlen obj

# 7、获取哈希表中所有的字段
hkeys obj # name age

# 8、获取哈希表中所有的值
hvals obj # elk 18
```
## 列表操作
列表（List）是一种有序、可变且可重复的数据结构。在许多编程语言和数据存储系统中，列表是一种常见的数据结构类型，用于存储一组元素。

- **LPUSH key element1 element2 ...**：将一个或多个元素从列表的左侧插入，即将元素依次插入列表的头部。如果列表不存在，则在执行操作前会自动创建一个新的列表。

- **RPUSH key element1 element2 ...**：将一个或多个元素从列表的右侧插入，即将元素依次插入列表的尾部。如果列表不存在，则在执行操作前会自动创建一个新的列表。

```shell
# 1、添加元素
rpush key element1 [element2 ...] // 将元素从右侧插入列表 正序
lpush key element1 [element2 ...] // 将元素从左侧插入列表 倒序

# 2、获取元素
lindex key index  # 获取列表中指定索引位置的元素
lrange key start stop  # 获取列表中指定范围内的元素

# 3、修改元素
lset key 0 X  # [ lset key index element]

# 4、删除元素
lpop key  # 从列表的左侧移除并返回第一个元素
rpop key  # 从列表的右侧移除并返回最后一个元素
lrem key count value  # 从列表中删除指定数量的指定值元素

# 5、获取列表长度
llen key
```
