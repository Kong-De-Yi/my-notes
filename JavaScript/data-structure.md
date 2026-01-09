# 对象

- 定义：拥有一系列属性的数据集合
- 属性：键值对（key:value)
  - key：string
  - value：任意类型
- 对象的创建

```javascript
let user = new Object(); //构造函数语法

//字面量语法
let user = {};
let user = {
  name: "John",
  age: 30,
};
```

- 计算属性：对 key 使用方括号

```javascript
let fruit = prompt("Which fruit to buy?", "apple");
let bag = {
  [fruit]: 5,
  [fruit + "Computers"]: 500,
};
alert(bag.apple); //5
alert(bag.appleComputers); //500
```

- 属性的访问：
  - 点符号法：只适用单词文本字符串属性名
  - 方括号法：支持多词属性名（需带引号）和表达式属性名

```javascript
//点符号法
alert(user.name); //John
alert(user.age); //30

//方括号法
let user = {};
user["likes birds"] = true;
alert(user["likes birds"]); //true
delete user["like birds"]; //删除

//动态获取属性的值
let key = prompt("What do you want to know about the user?", "name");
alert(user[key]);
```

- 属性的添加：`user.isAdmin=true;`
- 属性的删除：`delete user.age;`
- key 为多词需加引号：

```javascript
let user = {
  name: "John",
  age: 30,
  "likes birds": true, //多词属性名必须加引号
};
```

- 最后一个属性以逗号结尾，方便添加，删除和移动属性
- 属性简写：key 与 value 相同时可用

```javascript
function makeUser(name, age) {
  return {
    name, //与name: name相同
    age, //与age: age相同
    sex: "man", //可以和正常方式混用
  };
}
```

- key 无保留字限制，可以是任何字符串和 symbol,**访问时会自动转为 string**

```javascript
//保留字正常使用
let obj = {
  for: 1,
  let: 2,
  return: 3,
};
alert(obj.for + obj.let + obj.return); //6

let obj = {
  0: "test", //等同 "0":"test"
};
alert(obj["0"]); //test
alert(obj[0]); //test
```

- key 为\_\_proto\_\_时，不能赋值为非对象的值

```javascript
let obj = {};
obj.__proto__ = 5; //忽略
```

## 属性存在性测试："in"操作符

- 访问不存在的属性返回 undefined

```javascript
let user = {};
alert(user.noSuchProperty); //undefined
```

- in 以 boolean 形式检查属性是否存在：`key in object`

```javascript
let user = { name: "John", age: 30 };
alert("age" in user); //true
alert("blala" in user); //false

let key = "name";
alert(key in user); //true
```

- 使用 in 的必要性： 能区分 key 存在，但 value 为 undefined 的情况

## "for...in"循环

- 遍历所有的 key：

```javascript
for (key in object) {
  alert(key);
  alert(object[key]);
}

for (let prop in object) {
  alert(prop);
  alert(object[prop]);
}
```

- 遍历时 key 的顺序
  - 整数 key 会排序
  - 非整数 key 按创建顺序

```javascript
let codes = {
  49: "Germany",
  41: "Switzerland",
  1: "USA",
};
for (let code in codes) {
  alert(code); //1,41,49
}

let user = {
  name: "John",
  surname: "Smith",
};
user.age = 25;
for (let prop in user) {
  alert(prop); //name,surname,age
}
```

## 对象的引用和复制

- 原始类型作为整体存储和复制
- 对象通过引用（内存地址）存储和复制
  - 把对象赋值给变量，变量存储的是对象的地址
  - 复制对象变量时复制的是内存地址，对象本身没有复制

```javascript
let user = { name: "John" };
let admin = user;
admin.name = "Pete";
alert(user.name); //Pete
```

- const 声明的对象变量可以修改属性,但不能修改自身的值

```javascript
const user = { name: "John" };
user.name = "Pete"; //可以修改
user = { name: "Pete", age: 30 }; //报错
```

## 对象的比较

- 仅当两个对象变量引用的是同一个对象时才相等

```javascript
let a = {};
let b = a;
alert(a == b); //true
alert(a === b); //true

let a = {};
let b = {};
alert(a == b); //false
```

- ->、<、>=、<=的比较，对象会被先转换为原始类型

## 对象的克隆与合并（浅拷贝）

- 在原始类型值层面复制属性

```javascript
let user = {
  name: "John",
  age: 30,
};
let clone = {};
for (let key in user) {
  clone[key] = user[key];
}
```

- 使用：`Object.assign(dest,[src1,src2,src3...])`
  - 将所有源对象的属性拷贝到目标对象
  - dest：目标对象
  - src：需要复制的源对象
  - 返回 dest 对象
  - 会覆盖已存在的相同 key 的属性

```javascript
//合并多个对象
let user = { name: "John" };
let permissions1 = { canView: true };
let permissions2 = { canEdit: true };
//user={name: "John",canView: true,canEdit: true}
Object.assign(user, permissions1, permissions2);

//已存在相同key的属性会被覆盖
let user = { name: "John" };
Object.assign(user, { name: "Pete" });
alert(user.name); //Pete

//简单克隆
let user = {
  name: "John",
  age: 30,
};
let clone = Object.assign({}, user);
```

## 对象的深层克隆（深拷贝）

- 问题：对象的属性也是对象时，浅拷贝复制的是属性对象的引用，造成原副对象共享一个属性对象

```javascript
let user = {
  name: "John",
  sizes: {
    height: 182,
    width: 50,
  },
};

let clone = Object.assign({}, user);
alert(user.sizes === clone.sizes); //true，同一个对象

user.sizes.width++;
alert(clone.sizes.width); //51
```

- 解决办法：递归检查对象的属性是否为对象，若是则复制属性对象的结构
- 现有实现：lodash 库的\_.cloneDeep(obj)

# 垃圾回收

## 可达性

- 根（roots）：
  - 当前执行函数的局部变量和参数
  - 当前嵌套调用链上其他函数的局部变量和参数
  - 全局变量
  - 内部实现的值
- 可达性：如果一个值可以从根引用或引用链进行访问，则该值是可达的
- 垃圾回收器：监控对象的状态，删除不可达的对象

```javascript
let user = { name: "John" }; //全局变量user引用了对象{name: "John"}
user = null; //对象{name: "John"}没有引用了，变成不可达的，会被垃圾回收器删除，释放内存
```
