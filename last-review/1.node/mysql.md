## 开始

关系型数据库： 建立在关系模型基础上， 由多张相互连接的二维表组成的数据库
- 1. 使用表结构存储数据， 格式统一，便于维护
- 2. 使用sql语言操作， 标准统一，使用方便

一个数据库服务器中，可以创建多个数据库，一个数据库可以创建多张表；

找到适配的mysql版本，安装；

将mysql 加入环境变量；

链接mysql: mysql -u root -p , 然后输入密码，就链接成功了

# sql 语句

## sql 的通用语法

- 1. sql语句可以单行或者多行书写，以分号结尾；
- 2. sql语句可以使用空格/缩进来增强可读性
- 3. mysql 数据库的sql语句不区分大小写， 关键字建议大写
- 4. 注释
  - 单行注释： -- 注释内容， 或者 # 注释内容（mysql特有）
  - 多好注释： /* 注释内容 */ 

## sql的分类

数据库定义语言（ddl）: 用来定义*数据库*对象（数据库， 表，字段）
数据操作语言（dml）: 用来对*数据库表中的数据*进行增删改
数据查询语言（dql： data query language）: 用来*查询数据库表*的记录
数据控制语言（dcl： data control language）: 用来管理数据库用户， 控制*数据库的访问权限*。

## 数据定义语言（ddl）

数据库操作，表操作；

### 数据库操作

查询所有数据库：
`SHOW DATABASES;`
查询当前数据库：
`SELECT DATABASE();`
创建数据库：CREATE 
`CREATE DATABASE [ IF NOT EXISTS ] 数据库名 [ DEFAULT CHARSET 字符集] [COLLATE 排序规则 ];`
删除数据库：
`DROP DATABASE [ IF EXISTS ] 数据库名;`
使用数据库：
`USE 数据库名;`

注意事项
UTF8字符集长度为3字节，有些符号占4字节，所以推荐用utf8mb4字符集


### 表操作

查询当前数据库所有表：
`SHOW TABLES;`
查询表结构：
`DESC 表名;`
查询指定表的建表语句：
`SHOW CREATE TABLE 表名;`


创建表：

```
CREATE TABLE 表名(
    字段1 字段1类型 [COMMENT 字段1注释],
    字段2 字段2类型 [COMMENT 字段2注释],
    字段3 字段3类型 [COMMENT 字段3注释],
    ...
    字段n 字段n类型 [COMMENT 字段n注释]
)[ COMMENT 表注释 ];


```
最后一个字段后面没有逗号；上面中括号表示可选；

#### 字段类型

主要分为： `数值类型， 字符串类型， 日期类型` 三大类；

- 数值类型：表示的范围与有符号（SIGNED）和 无符号（UNSIGNED，也就是正数）有关

TINYINT：  1个字节（2的8次方，有符号时可以表示-128到127， 无符号时表示0到255）， 小整数值；
SMALLINT： 2个字节， 大整数值；
MEDIUMINT： 3个字节，大整数值；
INT或INTEGER： 4个字节(2的32次方)， 大整数值；
BIGINT： 8个字节， 超大整数值；

FLOAT： 4个字节， 单精度浮点数值；
DOUBLE： 8个字节， 双精度浮点数值；
DECIMAL：  字节数依赖于M(精度，整个数值的长度)和D(标度，小数位数)的值， 小数值（精确定点数）

单精度和双精度： 表明单精度和双精度精确的范围不一样， 精度主要取决于尾数部分的位数，float小数部分只能精确到小数点后面6位，加上小数点前的一位，即有效数字为7位； 双精度精确到小数点后15位，有效位数为16位。这俩类型的区别就是小数点后面的保留位数不一样

比如：
年龄： age TINYINT UNSIGNED
分数： score double(4,1) UNSIGNED


- 字符串类型：

CHAR   ： 0到255个字节， 定长字符串
VARCHAR： 0到65535个字节， 变长字符串

TINYTEXT: 0到255个字节， 短文本字符串
TEXT: 0到65535个字节， 长文本数据
MEDIUMTEXT: 0到16 777 215个字节， 中等长度文本数据
LONGTEXT: 更多的字节，极大文本数据

TYNIBLOB: 0到255个字节，不超过255个字符的二进制数据
BLOB: 0到65535个字节， 二进制形式长文本数据
MEDIUMBLOB: 0到166 777 215 个字节， 二进制形式中等长度文本数据
LONGBLOB: 更多的字节，二进制形式极大文本数据

一般二进制数据，比如音视频，存到文件服务器中比较好，存到数据库中性能并不高。所以BLOB类型用的并不多；

char 和 varchar ：后面都可以接受参数，表示最多能接受的字符数；
  - char(10), 即使你存一个字符，也会占用是十个字符的空间,未占用的会用空格补位； `性能高`，char类型每次修改的数据长度相同，效率更高
  - varchar(10), 你存一个字符，就只占用一个字符的空间， `性能相对较差`,因为在使用时需要根据内容去计算占用空间，效率更低
  - 所以，定长字符串用char， 变长字符串用varchar


- 日期类型

  DATE： 日期值，格式为YYYY-MM-DD
  TIME： 时间值或者持续时间， 格式为HH:MM:SS
  YEAR: 年份值， 格式为YYYY
  DATETIME： 混合日期和时间， 格式为YYYY-MM-DD HH:MM:SS
  TIMESTAMP： 混合日期和时间的时间戳， 不过最大只能到2038年，格式为YYYY-MM-DD HH:MM:SS

#### 修改表结构

修改表： alter table
- add
- modify
- change
- rename to
- drop: 删除字段，表， 数据库都可以用关键字
- truncate

*对表的操作（ create, drop, alter）table 表名  + 对字段的操作 （(), add, drop, modify, change ）或 对表名操作（rename to）*


添加字段：alter...add...

`ALTER TABLE 表名 ADD 字段名 类型(长度) [COMMENT 注释] [约束];`

例：ALTER TABLE emp ADD nickname varchar(20) COMMENT '昵称';

修改字段类型：modify

`ALTER TABLE 表名 MODIFY 字段名 新数据类型(长度);`

修改字段名和字段类型：change

`ALTER TABLE 表名 CHANGE 旧字段名 新字段名 类型(长度) [COMMENT 注释] [约束];`

例：将emp表的nickname字段修改为username，类型为varchar(30)
ALTER TABLE emp CHANGE nickname username varchar(30) COMMENT '昵称';

删除字段：drop

`ALTER TABLE 表名 DROP 字段名;`

修改表名：rename to

`ALTER TABLE 表名 RENAME TO 新表名`

删除表：drop

`DROP TABLE [IF EXISTS] 表名;`

删除表，并重新创建该表：truncate, 也就是删除及急表中数据，然后新建一张同结构的空表，相当于把表中数据清空

`TRUNCATE TABLE 表名;`

## mysql 图像化界面

图像化界面，主要用于提升mysql开发效率;

常用的有：sqlyog（免费）, navicat, datagrip(使用方便，而且比前两种强大)

一般先要链接数据库，输入域名（主机），端口号，用户名，及密码，就行


## 数据操作语言（dml）

dml: 对数据库中表的数据记录进行增删改查

- insert into; 
- update;
- delete from;

*对数据的操作（insert into, update, delete from）表名 + ...*

添加数据： insert into

指定字段：
`INSERT INTO 表名 (字段名1, 字段名2, ...) VALUES (值1, 值2, ...);`

全部字段：
`INSERT INTO 表名 VALUES (值1, 值2, ...);`

批量添加数据：

`INSERT INTO 表名 (字段名1, 字段名2, ...) VALUES (值1, 值2, ...), (值1, 值2, ...), (值1, 值2, ...);`
`INSERT INTO 表名 VALUES (值1, 值2, ...), (值1, 值2, ...), (值1, 值2, ...);`

注意事项:
- 插入数据时， 指定的字段顺序，需要与值的顺序一一对应
- 字符串和日期类型数据应该包含在引号中
- 插入的数据大小应该在字段的规定范围内


修改数据：update... set
`UPDATE 表名 SET 字段名1 = 值1, 字段名2 = 值2, ... [ WHERE 条件 ];`
例：
UPDATE emp SET name = 'Jack' WHERE id = 1;

注意： where 条件可以有也可以没有，如果没有就是修改整张表的数据

删除数据：delete from
`DELETE FROM 表名 [ WHERE 条件 ];`

注意： delete 条件语句可以有也可以没有， 如果没有条件， 则会删除整张表的所有数据；
delete 语句不能删除某一个字段的值（可以用update, 把字段值改为null就行了）

## dql 数据查询语言

用来查询数据库表中数据；

查询关键字： select

语法： 编写顺序

`SELECT  字段列表 FROM  表名  WHERE  条件列表  GROUP BY  分组字段列表  HAVING  分组后的条件列表 ORDER BY 排序字段列表 LIMIT 分页参数`

分组与聚会函数相关： count, max, min, avg, sum

### 基础查询

查询多个字段：

`SELECT 字段1, 字段2, 字段3, ... FROM 表名;`

`SELECT * FROM 表名;`

注意： 在实际开发当中，尽量不要写*， 因为不直观（把字段罗列出来，人家一看就知道要查询返回啥）， 而且会影响效率

设置别名：对于查询返回的结果设置别名，增强可读性， 其中 as 关键字可以省略

`SELECT 字段1 [ AS 别名1 ], 字段2 [ AS 别名2 ], 字段3 [ AS 别名3 ], ... FROM 表名;`

去除重复记录：distinct

`SELECT DISTINCT 字段列表 FROM 表名;`

### 条件查询

语法：`SELECT 字段列表 FROM 表名 WHERE 条件列表;`

where 后的条件可以是一个也可以是多个；

where后的条件，可以跟上比较运算符，逻辑运算符；

比较运算符：

小于大于等于不等于： >	大于； >=	大于等于； <	小于； <=	小于等于； =	等于； <> 或 !=	不等于；

BETWEEN … AND …	：在某个范围内（含最小、最大值）
IN(…)	：在in之后的列表中的值，多选一
LIKE ：占位符	模糊匹配（_匹配单个字符，%匹配任意个字符）
IS NULL	：是NULL

逻辑运算符：

AND 或 &&： 并且（多个条件同时成立）
OR 或 ||： 或者（多个条件任意一个成立）
NOT 或 !： 非，不是


```
-- 有身份证
select * from employee where idcard is not null;

-- 姓名为两个字
select * from employee where name like '__';
-- 身份证最后为X
select * from employee where idcard like '%X';

```

ps： 为了让条件看起来更加清晰，多个条件并列时，可以选择给条件加上括号，效果是一样的；

#### 聚合函数

将一列数据作为一个整体， 进行纵向计算。

常见聚合函数：
count： 统计数量
max: 最大值
min: 最小值
avg: 平均值
sum: 求和

注意： null 值不参与聚合函数的运算

语法：
`SELECT 聚合函数(字段列表) FROM 表名;`

#### 分组查询: GROUP BY

语法：
`SELECT 字段列表 FROM 表名 [ WHERE 条件 ] GROUP BY 分组字段名 [ HAVING 分组后的过滤条件 ];`

where 和 having 的区别:
- 执行时机不同：where是分组之前进行过滤，不满足where条件不参与分组；having是分组后对结果进行过滤。
- 判断条件不同：where不能对聚合函数进行判断，而having可以。


注意：

- 执行顺序： where>聚合函数>having
- 分组之后，查询的字段一般为*聚合函数和分组字段*，查询其他字段无任何意义（因为分组之后只能展示第一个其他字段的值，其他的值展示不出来了）


```

年龄小于45，并根据工作地址分组，获取员工数量大于等于3的工作地址

select workaddress, count(*) address_count from employee where age < 45 group by workaddress having address_count >= 3;


address_count 为别名；

```

#### 排序查询： ORDER BY

语法：
`SELECT 字段列表 FROM 表名 ORDER BY 字段1 排序方式1, 字段2 排序方式2;`

排序方式：
ASC: 升序（默认）
DESC: 降序

注意： 如果是多字段排序， 当第一个字段值相同时， 才会根据第二个字段进行排序；

```
-- 两字段排序，根据年龄升序排序，入职时间降序排序
SELECT * FROM employee ORDER BY age ASC, entrydate DESC;

```

### 分页查询：

语法：
`SELECT 字段列表 FROM 表名 LIMIT 起始索引, 查询记录数;`


注意事项:
- 起始索引从0开始，起始索引 = （查询页码 - 1） * 每页显示记录数
- 分页查询是数据库的方言，不同数据库有不同实现，MySQL是LIMIT
- 如果查询的是第一页数据，起始索引可以省略，直接简写 LIMIT 10



```
-- 查询第一页数据，展示10条
SELECT * FROM employee LIMIT 0, 10;
-- 查询第二页
SELECT * FROM employee LIMIT 10, 10;


```

### 查询语句总体执行顺序

查询语句总体执行顺序:
*FROM（从哪个表查） -> WHERE（查询条件） -> GROUP BY（分组） -> SELECT（查询返回哪些字段） -> ORDER BY（排序） -> LIMIT（分页）*


这限制这你在哪里定义别名，先执行的定义了别名，后执行的才能用；

## 数据控制语言（dcl： data control language）

管理数据库用户， 控制*数据库的访问权限*。

查询用户：mysql的用户心性都放在系统数据库mysql的user表里

```
USE mysql;
SELECT * FROM user;

```

创建用户:

`CREATE USER '用户名'@'主机名' IDENTIFIED BY '密码';`

修改用户密码：

`ALTER USER '用户名'@'主机名' IDENTIFIED WITH mysql_native_password BY '新密码';`

删除用户：

`DROP USER '用户名'@'主机名';`

注意：

- 主机名可以用%通配
- 这类sql 开发人员操作的比较少， 主要是数据库管理员使用


### 权限控制

ALL, ALL PRIVILEGES：	所有权限
SELECT：	查询数据
INSERT：	插入数据
UPDATE：	修改数据
DELETE：	删除数据
ALTER：	修改表
DROP：	删除数据库/表/视图
CREATE：	创建数据库/表 


查询权限：
`SHOW GRANTS FOR '用户名'@'主机名';`

授予权限：grant ...on... to
`GRANT 权限列表 ON 数据库名.表名 TO '用户名'@'主机名';`

撤销权限：revoke...on... from
`REVOKE 权限列表 ON 数据库名.表名 FROM '用户名'@'主机名';`

注意事项:
- 多个权限用逗号分隔
- 授权时，数据库名和表名可以用 * 进行通配，代表所有


# 函数

字符串函数
数值函数
日期函数
流程函数

## 字符串函数

mysql 中内置了很多字符串函数， 常用的几个如下： 


CONCAT(s1, s2, …, sn):	字符串拼接，将s1, s2, …, sn拼接成一个字符串
LOWER(str):	将字符串全部转为小写
UPPER(str):	将字符串全部转为大写
LPAD(str, n, pad):	左填充，用字符串pad对str的左边进行填充，达到n个字符串长度
RPAD(str, n, pad):	右填充，用字符串pad对str的右边进行填充，达到n个字符串长度
TRIM(str):	去掉字符串头部和尾部的空格
SUBSTRING(str, start, len):	返回从字符串str从start位置起的len个长度的字符串
REPLACE(column, source, replace):	替换字符串

更新员工的workno, 不足6位的前面补0：
 
```
update emp set workno=lpad(workno, 6, 0);

```

## 数值函数

常见函数： 

CEIL(x):	向上取整
FLOOR(x):	向下取整
MOD(x, y):	返回x/y的模, 就是取余
RAND():	返回0~1内的随机数
ROUND(x, y):	求参数x的四舍五入值，保留y位小数


## 日期函数

CURDATE()：	返回当前日期
CURTIME()：	返回当前时间
NOW()：	返回当前日期和时间
YEAR(date)：	获取指定date的年份
MONTH(date)：	获取指定date的月份
DAY(date)：	获取指定date的日期
DATE_ADD(date, INTERVAL expr type)：	返回一个日期/时间值加上一个时间间隔expr后的时间值, INTERVAL关键字，expr 增加的时间，  type 增加时间的单位
DATEDIFF(date1, date2)：	返回起始时间date1和结束时间date2之间的天数, 单位是：天


举例： 

1. 

select date_add('2018-11-3', interval 3 month );

2. 

```
查询所有员工的入职天数，并拒此倒序排列：
select datediff(curdate(), entrydate) countday, name from emp order by countday desc;

```

## 流程函数

IF(value, t, f)：	如果value为true，则返回t，否则返回f
IFNULL(value1, value2)：	如果value1不为空，返回value1，否则返回value2
CASE WHEN [ val1 ] THEN [ res1 ] … ELSE [ default ] END：	如果val1为true，返回res1，… 否则返回default默认值

CASE [ expr ] WHEN [ val1 ] THEN [ res1 ] … ELSE [ default ] END：	如果expr的值等于val1，返回res1，… 否则返回default默认值


举例：

```
查询所有员工，当在昌平的时候，描述为近， 在朝阳的时候描述为不近， 其他地方描述为远

select name, workaddress, (case workaddress when '昌平' then '近' when '朝阳' then '不近' else '远' end) 描述 from emp;


```

多个连续的when时，后面的when走的是'否则'的逻辑；

```
85分以上为优先，60以上为及格，其他不及格

select name, math, (case when math>=85 then '优秀' when math>=60  then '及格' else '不及格' end) '评价' from score;

```

# 约束

概念： 约束是作用域表中字段的规则， 用于限制存储在表中的数据
目的： 保证数据库数据的正确性， 有效性 和完整性；
约束是作用于表中字段上的，可以再创建表/修改表的时候添加约束。


非空约束：	限制该字段的数据不能为null；	`NOT NULL`
唯一约束:	保证该字段的所有数据都是唯一、不重复的;	`UNIQUE`
主键约束:	主键是一行数据的唯一标识，要求非空且唯一	`PRIMARY KEY`, 如果要求自增`auto_increment`
默认约束:	保存数据时，如果未指定该字段的值，则采用默认值	`DEFAULT`
检查约束（8.0.1版本后）:	保证字段值满足某一个条件	`CHECK`
外键约束:	用来让两张图的数据之间建立连接，保证数据的一致性和完整性	`FOREIGN KEY`

## 外键约束

外键让两张表的数据之间建立连接， 从而保证数据的一致性和完整性；

具有外键的表称为子表，外键所关联的表称为父表；

添加外键：

```
CREATE TABLE 表名(
    字段名 字段类型,
    ...
    [CONSTRAINT] [外键约束名称] FOREIGN KEY(外键字段名) REFERENCES 主表(主表列名)
);


ALTER TABLE 表名 ADD CONSTRAINT 外键约束名称 FOREIGN KEY (外键字段名) REFERENCES 主表(主表列名);
-- 例子


上面的括号不能省略；

```

举例：

```

alter table emp add constraint fk_emp_dept_id foreign key(dept_id) references dept(id);

```

删除外键：
`ALTER TABLE 表名 DROP FOREIGN KEY 外键约束名;`


约定删除/更新行为:

NO ACTION：（默认如此）	当在父表中删除/更新对应记录时，首先检查该记录是否有对应外键，如果有则不允许删除/更新（与RESTRICT一致）
RESTRICT：（默认如此）	当在父表中删除/更新对应记录时，首先检查该记录是否有对应外键，如果有则不允许删除/更新（与NO ACTION一致）
CASCADE：级联，	当在父表中删除/更新对应记录时，首先检查该记录是否有对应外键，如果有则也删除/更新外键在子表中的记录
SET NULL：置空，	当在父表中删除/更新对应记录时，首先检查该记录是否有对应外键，如果有则设置子表中该外键值为null（要求该外键允许为null）
SET DEFAULT：置为默认,	父表有变更时，子表将外键设为一个默认值（Innodb不支持）


# 多表查询

## 多表关系

项目开发中，在进行数据库表结构设计时，会根据业务需求及业务模块之间的关系，分析并设计表结构，由于业务之间相互关联， 所以
各个表结构之间也存在各种联系， 基本分为三种：


- 一对多（多对一）
  - 比如：部门和员工之间的关系： 一个部门对应多个员工，一个员工对应一个部门
  - 实现： *在多的一方建立外键，指向一的一方的主键*
- 多对多
  - 比如：学生和课程之间的关系，一个学生可以选择多门课程， 一门课程也可以供给多个学生
  - 实现： *建议第三张中间表，中间表至少包含两个外键，分别关联两方主键*
- 一对一
  - 比如： 用户与用户详情的关系
  - 多用于单表拆分， 将一张表的基础字段放到一张表中， 其他详情字段放到另一张表中 ， 以提升操作效率
  - 实现： *在任意一方加入外键， 关联另一方的主键， 并且设置外键为唯一的（unique）*

## 多表查询

多表查询指： 从多张表中查询到数据
笛卡尔积： 笛卡尔积是指在数学中， 两个集合a集合和b集合的所有组合情况（多表查询时， 需要消除无效的笛卡尔积）


合并查询（笛卡尔积，会展示所有组合结果）：
`select * from employee, dept;`

消除无效笛卡尔积：
`select * from employee, dept where employee.dept = dept.id;`


多表查询分类
- 内连接： 内连接查询的是两张表交集的部分数据
- 外连接： 
  - 左外连接： 查询左表的所有数据， 以及两张表交集部分数据
  - 右外连接： 查询右表的所有数据， 以及两张表交集部分的数据
自连接： 当前表与自身的连接查询， 自连接必须使用表别名
子查询：


###  内连接查询

内连接查询的是两张表交集的部分

隐式内连接：
`SELECT 字段列表 FROM 表1, 表2 WHERE 条件 ...;`

显式内连接： inner join ...on...
`SELECT 字段列表 FROM 表1 [ INNER ] JOIN 表2 ON 连接条件 ...;`

显式性能比隐式高

举例：

```
select e.name, d.name from emp e inner join dept d on e.dept_id=d.id;

```


### 外连接查询

左外连接：
查询左表所有数据，以及两张表交集部分数据
`SELECT 字段列表 FROM 表1 LEFT [ OUTER ] JOIN 表2 ON 条件 ...;`
相当于查询表1的所有数据，包含表1和表2交集部分数据

右外连接：
查询右表所有数据，以及两张表交集部分数据
`SELECT 字段列表 FROM 表1 RIGHT [ OUTER ] JOIN 表2 ON 条件 ...;`


可以理解为交集部分，加（左/右）表其余部分；

举例：

```
左： 

select e.*, d.name from emp e  left join dept d on e.dept_id = d.id;


右：

select e.name, d.name, d.id from emp e right join dept d on e.dept_id = d.id;

```

ps: 实际开发中写左连接多一点，因为右连接也可以用左连接实现，只需要把表名的位置调换一下

### 自连接查询

当前表与自身的连接查询，自连接必须使用表别名， *虽然是一张表，但是可以看成两张表,这样比较好理解*

语法：
`SELECT 字段列表 FROM 表A 别名A JOIN 表A 别名B ON 条件 ...;`

自连接查询，可以是内连接查询，也可以是外连接查询;

比如： 查询员工所属领导的名字，而领导其实也是员工，所以可以通过记录的领导id去查

举例：

```
select a.name, b.name as leader from emp a join emp b  on a.leader=b.id;

```

### 联合查询： union, union all

对于union查询， 就是把多次查询的结果合并起来， 形成一个新的查询结果

```
语法：

SELECT 字段列表 FROM 表A ...
UNION [ALL]
SELECT 字段列表 FROM 表B ...

```

注意事项
- UNION ALL 会有重复结果（因为可能有一条数据满足多个条件），UNION 不会
- 联合查询有点像是或的逻辑，不过比使用or效率高，不会使索引失效


### 子查询

sql语句中嵌套select 语句，称为嵌套查询，又称为子查询。

`SELECT * FROM t1 WHERE column1 = ( SELECT column1 FROM t2);`
子查询外部的语句可以是 INSERT / UPDATE / DELETE / SELECT 的任何一个

根据子查询结果可以分为：
- 标量子查询（子查询结果为单个值, 也就是单行单列）
- 列子查询（子查询结果为一列）
- 行子查询（子查询结果为一行）
- 表子查询（子查询结果为多行多列）


根据子查询位置可分为：
- WHERE 之后
- FROM 之后
- SELECT 之后


子查询一般可以把需求分为多步拆解，然后在组合在一起；


#### 标量子查询


子查询返回的结果是单个值（数字、字符串、日期等）。
常用操作符：- < > > >= < <=

举例：

```

查询研发部所有员工的信息： 1. 查到研发部的id  2. 根据研发部id查询研发部所有员工信息

select * from emp where emp.dept_id=(select id from dept where dept.name="研发");


查询fds入职后，入职的员工信息；

select * from emp where entrydate>(select entrydate from emp where name = 'fds');

```

#### 列子查询

返回的结果是一列（可以是多行）。


常用操作符：

IN：	在指定的集合范围内，多选一
NOT IN：	不在指定的集合范围内
ANY：	子查询返回列表中，有任意一个满足即可
SOME：	与ANY等同，使用SOME的地方都可以使用ANY
ALL：	子查询返回列表的所有值都必须满足



举例：

```
-- 查询销售部和市场部的所有员工信息
select * from employee where dept in (select id from dept where name = '销售部' or name = '市场部');
-- 查询比财务部所有人工资都高的员工信息
select * from employee where salary > all(select salary from employee where dept = (select id from dept where name = '财务部'));
-- 查询比研发部任意一人工资高的员工信息
select * from employee where salary > any (select salary from employee where dept = (select id from dept where name = '研发部'));


```


#### 行子查询

返回的结果是一行（可以是多列）。
常用操作符：=, <, >, IN, NOT IN

*多个字段与多个值的匹配方式： (f1,f2) = (val1, val2);*

举例：

```

-- 查询与xxx的薪资及直属领导相同的员工信息
select * from employee where (salary, manager) = (12500, 1);
select * from employee where (salary, manager) = (select salary, manager from employee where name = 'xxx');


```

#### 表子查询

返回的结果是多行多列
常用操作符：IN

把子查询结果当成一张表，一般放在from之后, 和别的表联查;


举例：

```
-- 查询与xxx1，xxx2的职位和薪资相同的员工
select * from employee where (job, salary) in (select job, salary from employee where name = 'xxx1' or name = 'xxx2');
-- 查询入职日期是2006-01-01之后的员工，及其部门信息
select e.*, d.* from (select * from employee where entrydate > '2006-01-01') as e left join dept as d on e.dept = d.id;

```

#### 综合练习

- 1. 要注意的一点是，默认的笛卡尔积（也就是隐式内连接）会遍历所有的组合，这个本身就能解决很多问题，然后我们再用限定条件把无关的去除，让符合条件的行拼接在一起；*隐式内联写起来比较简单，没过过多要求的内联，可以用隐式内联*
- 2. n张表连接，会有n-1个连接条件，两个两个的去梳理连接条件
- 3. *可以先把不好确定的值成定值，假设已经知道具体值，然后再思考,如何替换成变量*，类似一种变量变成的思想，每一行处理条件时，其实已经拿到了行中每一个字段的数据
- 4. select 后也可以出现子查询


```

# 查询所有员工的工资等级:见上1, 有员工表和等级表

select e.*, s.grade from emp e, salgrade s where e.salary between  s.losal and s.hisal;


# 查询低于本部门平均薪资的员工信息 1. 查询指定部门的平均薪资 2. 查询低于本部门平均薪资的员工

select avg(salary) from emp where emp.dept_id = 1;

// 把1替换为变量

select e.*, d.name  from emp e, dept d where e.salary<(select avg(e2.salary) from emp e2 where e2.dept_id = e.dept_id)


# 查询所有部门信息， 并统计部门人数，见上4， 3

select d.id, d.name, (select count(*) from emp e where e.dept_id = d.id) from dept d;

```

# 事务

## 事务简介

*事务是一组操作的集合*，它是一个不可分割的工作单位， 事务会把所有的操作*作为一个整体一起向系统提交或者撤销操作请求*，即
*这些操作要么同时成功，要么同时失败*

ps: 默认mysql的事务是自动提交的， 也就是说， 当执行一条dml语句， mysql会立即隐式的提交事务

一般步骤为：
- 1. 开启事务
- 2. 抛异常则回滚事务；正常则提交事务


第一种方式： 修改事务的提交方式

-- 查看事务提交方式
`SELECT @@AUTOCOMMIT;`
-- 设置事务提交方式，1为自动提交，0为手动提交，该设置只对当前会话(窗口)有效, 两个@符表示系统变量；
`SET @@AUTOCOMMIT = 0;`
-- 提交事务
`COMMIT;`
-- 回滚事务
`ROLLBACK;`


举例： 张三向李四转账1000

原始写法：

```

SET @@AUTOCOMMIT = 0;

-- 1. 查询张三账户余额
select * from account where name = '张三';
-- 2. 将张三账户余额-1000
update account set money = money - 1000 where name = '张三';
-- 此语句出错后张三钱减少但是李四钱没有增加
模拟sql语句错误
-- 3. 将李四账户余额+1000
update account set money = money + 1000 where name = '李四';

成功后再commit;
COMMIT;

```

第一种方式： 修改事务的提交方式 start transaction 或begin

开启事务：
`START TRANSACTION 或 BEGIN`
提交事务：
`COMMIT;`
回滚事务：
`ROLLBACK;`

## 四大特性ACID

原子性(Atomicity)：事务是不可分割的最小操作但愿，要么全部成功，要么全部失败
一致性(Consistency)：事务完成时，必须使所有数据都保持一致状态
隔离性(Isolation)：数据库系统提供的隔离机制，保证事务在不受外部并发操作影响的独立环境下运行
持久性(Durability)：事务一旦提交或回滚，它对数据库中的数据的改变就是永久的


## 并发事务

并发事务引发的问题：


脏读：	一个事务读到另一个事务*还没提交的数据* 
不可重复读：	一个事务先后读取同一条记录，但*两次读取的数据不同*  
幻读：	一个事务按照条件*查询数据时，没有*对应的数据行，但是再*插入数据时，又发现这行数据已经存在*; 这边明明已经插入提交了，那边事务中去读不到新插入的数据;

read uncommited： 有三个问题
read commited： 解决了脏读问题
repeatable read: 解决脏读和不可重复读
serializable: （串行）解决上述问题, 事务没结束那边就不能操作相同的表，会阻塞；


查看事务隔离级别：
`SELECT @@TRANSACTION_ISOLATION;`
设置事务隔离级别：
`SET [ SESSION | GLOBAL ] TRANSACTION ISOLATION LEVEL {READ UNCOMMITTED | READ COMMITTED | REPEATABLE READ | SERIALIZABLE };`
SESSION 是会话级别，表示只针对当前会话有效，GLOBAL 表示对所有会话有效

注意： 事务的隔离级别越高， 数据越安全， 但是性能越差；