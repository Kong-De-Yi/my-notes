
# 概念
* 在Javascript引擎(如Chrome中的V8)中执行的纯文本形式的“脚本”
* 语言规范ECMAScript
* 能做什么取决于运行环境(浏览器环境中削弱，Node.js中权限全面)

## 浏览器环境能做什么
* 操作HTML和CSS
* 响应用户行为
* 与服务器交换数据
* 本地存储数据

## 浏览器环境不能做什么
* 不能直接访问操作系统功能
* 同源策略，只能与当前页面所在的服务器通信

# 浏览器环境中代码位置
* 内嵌HTML中：`<script>javascript代码</script>`
* 外部脚本导入到HTML中：`<script src="/path/to/script.js"></script>`
  
# 代码结构
* 语句（分号分隔）：
```
alert("Hello");
alert("World");
```
* 注释
```
alert("Hello");//单行注释
/*这是一个多行
注释*/
alert("Hello");
alert("World");
```
* 现代模式"use strict"，放置在代码最顶部

# 变量
## 变量的定义（声明）：let
```
let mesage;
let message="Hello";
let user="John",age=25,messge="Hello";
```

* 严格模式下先定义再使用
* 减少变量的重用
* 不要重复定义
  
## 变量的命名：
* 字母、数字、$、_
* 首字母非数字
* 驼峰式命名：myVeryLongName
* 区分大小写
* 不要用保留字

# 常量
## 常量的定义：const
* 常规命名(执行前未知)：
```
const myBirthday="1987.02.23";
```
* 大写命名(执行前已知，硬编码)：
```
const COLOR_RED="#F00";
const COLOR_GREEN="#0F0";
let color=COLOR_RED;
```
# 数据类型
* 动态数据类型：同一个变量存放的数据类型可以变化
## Number：整数和浮点数
```
let n=123;
n=12.345;
```
* 支持运算+、-、*、/
* 特殊数值
  * Infinity(无穷大 ∞，1/0)
  * NaN(计算错误，粘性传播，例外NaN**0=1)
* 范围±(2**53-1)

## BigInt：任意长度的整数
```
//尾部的"n"表示BigInt类型
const bigInt=12345n;
```

## String：字符串
```
let str="Hello";  //双引号
let str='Single quotes are ok too';  //单引号
 //反引号(嵌入变量和表达式)
let phrase=`can embed another ${str}`; 
let result=`result is ${a+b}`;
```

## Boolean：逻辑类型
```
//只有true和false两个值
let nameFieldChecked=true;
let ageFieldChecked=false;
let isGreater=4>1;
```

## null：值未知
```
let age=null;
//不同于空指针，仅表示未知的特殊值
```

## undefined：声明的变量未赋值
```
let age;
alert(age);//结果是undefined
```
## Object：存储数据集合和复杂实体
## Symbol：对象的唯一标识符

## typeof运算符：字符串形式返回参数的数据类型
```
typeof undefined;  //返回"undefined"
typeof 0;  //返回"number"
typeof 10n;  //返回"bigint"
typeof true;  //返回"boolean"
typeof "foo";  //返回“string"
typeof Symbol("id");  //返回”symbol"
typeof Math;  //返回"object"
typeof null;  //返回"object"(语言遗留错误)
typeof alert;  //返回"function"(实际是object)
```
* 另一种习惯写法：typeof(x)

# 用户交互
* alert：通知模态窗
```
alert("Hello");
```
* prompt：输入模态窗
  * title:窗口显示文本
  * default:输入默认值
  * 返回用户输入值或者null
```
let result=null;
result=prompt(title,[default]);
```
* confirm：确认模态窗
  * question:窗口显示文本
  * 返回true或者false
```
let result=null;
result=confirm(question);
```
# 类型转换
## 自动转换：运算符和函数会进行自动转换
## 显式转换
### 字符串转换：String()
```
let value=true;
value=String(value);  //"true"
```
### 数字型转换：Number()
```
let str="123";
let num=Number(str);  //123
```
* 非有效数字转换为NaN
* undefined->NaN
* null->0
* true->1
* false->0
* ""->0
* string=>number或者NaN
### 布尔型转换：Boolean()
* 0、空字符串、null、undefined、NaN->false
* 其他->true
  
# 运算符
##　运算元：运算符应用的对象
* 一元运算符
* 二元运算符
* 同一个符号可以表征不同的运算符，如减号-，取决于运算元的个数和类型
## 数学运算
* 加+、减-、乘*、除/、取余%、求幂**(含非整数幂)
* 除+，其他运算符都会自动将string转number
```
let result=6-'2';  //4
let result='6'/'2';  //3
```
## 字符串连接：+（二元）
```
let s="my"+"string";  //"mystring"
```
* 注意：只要任意一个运算元是string，另一个运算元也自动转换成string
```
let str="1"+2;  //"12"
let str=2+2+"1";  //"41"
let str="1"+2+2;  //"122"
```
## 数字转换：+（一元）
* 将非number转成number，等效于Number()
```
let result=+true;  //1
let result=+"";  //0
let apples='2';
let oranges='3';
let total=+apples++oranges;  //5，等效于let total=Number(apples)+Numbe(oranges)
```
## 运算符优先级：一元高于二元
## 赋值运算符：=
* 有返回值
```
let a=1;
let b=2;
let c=3-(a=b+1); //0

let a,b,c;
a=b=c=2+2; //链式赋值
```
## 增强赋值运算符：+=、-=、*=、/= ...
```
let n=2;
n=n+5;
n=n*2;

let n=2;
n+=5; //缩写写法
n*=2; //缩写写法
```
## 自增、自减：++、--（前置、后置）
```
let counter=2;
counter++;  //返回原值后再+1
counter--;  //返回原值后再-1
++counter;  //+1后再返回
--counter;  //-1后再返回
```
## 位运算符：在32位整数的二进制形式上操作
## 逗号运算符：,（返回最后一个表达式的值）
```
for(a=1,b=3,c=a*b;a<10;a++){...}
```
## 逻辑运算符：结果为boolean
* 大于/小于：a>b,a<b
* 大于等于/小于等于：a>=b,a<=b
* 相等：a==b（自动转number,不能区分0,"",false)
* 不相等：a!=b
* 严格相等：a===b（不做类型转换)
* 严格不相等：a!==b（不做类型转换)
* 字符串比较：按unicode编码顺序比较
* 不同类型间比较：先转number再比较
* 在<、>、<=、>=中null->0，undefined->NaN
* null与undefined在==中不做类型转换，除了互等，不等于任何值
```
null===undefined  //false
null==undefined  //true
```
# 条件分支：if和'?'
## "if"语句
* 布尔转换：会将括号内的表达式结果转换成boolean
```
let year=prompt("Please input year","");
if(year==2015){
    alert("You are right");
    alert("That's correct");
}
```
* "else"语句：可选
```
let year=prompt("Please input year","");
if(year==2015){
    alert("You are right");
    alert("That's correct");
}else{
    alert("You are wrong");
}
```
* 多个条件"else if"
```
let year=prompt("Please input year","");
if(year<2015){
    alert("Too early");
}else if(year>2015){
    alert("Too late");
}else{
    alert("exactly!");
}
```