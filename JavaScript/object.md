# 对象

- 定义：拥有一系列属性的数据集合
- 属性：键值对（key:value)
  - key：string 或 symbol
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

let user = {
  name: "John",
  age: 30,
  "likes birds": true, //多词属性名必须加引号
};

//动态获取属性的值
let key = prompt("What do you want to know about the user?", "name");
alert(user[key]);
```

- 属性的添加：`user.isAdmin=true;`（直接赋值）
- 属性的删除：`delete user.age;`

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

- key 无保留字限制，可以是任何字符串和 symbol,**除 symbol 外其他原始类型访问时会自动转为 string**

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

- symbol 键会被跳过

```javascript
let id = Symbol("id");
let user = {
  name: "John",
  age: 30,
  [id]: 123,
};
for (let key in user) {
  alert(key); //name,age(没有symbol)
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

## 对象间的比较

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

- \>、<、>=、<=的比较，对象会被先转换为原始类型

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
- 垃圾回收器：监控对象的状态，删除不可达对象

```javascript
let user = { name: "John" }; //全局变量user引用了对象{name: "John"}
user = null; //对象{name: "John"}没有引用了，变成不可达的，会被垃圾回收器删除，释放内存

let user = { name: "Jonh" };
let admin = user;
user = null; //通过admin全局变量仍然可以访问{name: "John"},是可达的
```

```javascript
function marry(man, women) {
  women.husband = man;
  man.wife = women;
  return {
    father: man,
    mother: women,
  };
}
//{name: "John"}对象虽然持有对{name: "Ann"}的引用，但没有被任何变量引用，变成不可达
let family = marry({ name: "John" }, { name: "Ann" });
delete family.father;
delete family.mother.husband;
```

```javascript
function marry(man, women) {
  women.husband = man;
  man.wife = women;
  return {
    father: man,
    mother: women,
  };
}
//{name: "John"}与{name: "Ann"}互相引用，但外部没有对其任意对象的引用，整体变成不可达
let family = marry({ name: "John" }, { name: "Ann" });
family = null;
```

- 内部算法：从根出发，遍历并标记所有引用，删除没有被标记的对象（mark-and-sweep）

## 对象方法

- 本质：作为对象属性的函数

```javascript
let user = {
  name: "John",
  age: 30,
  sayHi: function () {
    alert("Hello");
  },
};

user.sayHi(); //Hello
```

- 方法简写

```javascript
let user = {
  name: "John",
  age: 30,
  sayHi() {
    alert("Hello"); //与 sayHi:function(){...} 一样
  },
};
```

- 对象方法访问对象属性："this"指代调用该方法的对象（点符号前面的对象）

```javascript
let user = {
  name: "John",
  age: 30,
  sayHi() {
    alert(this.name); //this指当前的对象，即user
  },
};
user.sayHi(); //John
```

- 使用外部变量名引用属性是不可靠的

```javascript
let user = {
  name: "John",
  age: 30,
  sayHi() {
    alert(user.name); //使用外部变量名引用属性
  },
};
let admin = user;
user = null;
admin.sayHi(); //类型错误
```

- "this"不专属于对象方法，是在被调用时计算出来的

```javascript
let user = { name: "John" };
let admin = { name: "Admin" };

function sayHi() {
  alert(this.name);
}

user.f = sayHi;
admin.f = sayHi;

user.f(); //John (this == user)
admin.f(); //Admin (this == admin)
admin["f"](); //Admin (this == admin)
```

- 没有对象的情况下调用：this==undefined（"use strict"模式下）

```javascript
function sayHi() {
  alert(this.name);
}
sayHi(); //undefined
```

- 箭头函数没有自己的"this"

```javascript
let user = {
  firstName: "Ilya",
  sayHi() {
    let arrow = () => alert(this.firstName); //this来自user.sayHi()中的user
    arrow();
  },
};
user.sayHi(); //Ilya
```

## 构造函数和"new"

- 本质是用 "new" 调用的常规函数，约定命名以大写字母开头，可以复用创建对象的代码

```javascript
function User(name) {
  this.name = name;
  this.isAdmin = false;
}

let user = new User("Jack");
alert(user.name); //Jack
alert(user.isAdmin); //false
```

- "new" 的执行步骤（用 new 调用产生的效果）
  - 创建空对象并赋值给 this
  - 执行函数体（修改 this，添加属性...)
  - 返回 this

```javascript
function User(name) {
  //this={};(隐式创建)
  //添加属性到this
  this.name = name;
  this.isAdmin = false;
  //return this;(隐式返回)
}
```

- 立即调用的一次性构造函数

```javascript
let user = new (function () {
  this.name = "John";
  this.isAdmin = false;
  //其他复杂的逻辑
})();
```

- 测试构造器模式：new.target（常规调用返回 undefined,new 调用返回函数本身）

```javascript
function User(name) {
  if (!new.target) {
    return new User(name); //没用使用new调用，重新用new调用
  }
  this.name = name;
}
```

- 构造函数中的 return
  - return 一个对象，则用该对象替换 this 返回
  - return 一个原始类型或者空则忽略

```javascript
function BigUser() {
  this.name = "John";
  return { name: "Godzilla" }; //返回该对象
}
alert(new BigUser().name); //Godzilla

function SmallUser() {
  this.name = "John";
  return; //或者return 1,依然返回 this
}

alert(new SmallUser().name); //John
```

- 无参数的构造函数用 new 调用时可省略括号`let user = new User;//等同于let user = new User();`

## 不存在的属性和可选链"?."

- 访问嵌套对象属性的安全方式，避免中间对象不存在时出现错误

```javascript
let user = {};
alert(user.address.street); //出现错误，嵌套对象address不存在，尝试读取undefined.street

//如果 document.querySelector('.elem') 的结果为 null，则会出现错误
let html = document.querySelector(".elem").innerHTML;
```

- 原理：对于表达式 value?.prop
  - 若 value 为 undefined 或者 null，返回 undefined
  - 否则返回 value.prop
  - 使?.前面的值成为可选值，对其后面的值不起作用

```javascript
let user = {};
alert(user?.address?.street);

let html = document.querySelector(".elem")?.innerHTML;
```

- 不要滥用,应使用在?.前面的值可以不存在的情况，必要时用代码逻辑去判断，如 user 对象必须存在，应该用`user.address?.street`，而不是`user?.address?.street`
- ?.前面的值必须先声明，可以 delete 属性，但不能给属性赋值

```javascript
delete user?.name;//如果user存在，则删除user.name

let user={};
user?.name="John"//Uncaught SyntaxError: Invalid left-hand side in assignment
```

- 短路效应：?.前面的值不存在会立即停止运算返回

```javascript
let user = null;
let x = 0;
user?.sayHi(x++); //user不存在，代码不会执行sayHi()和x++
alert(x); //0
```

- 变体：?.()—调用一个可能不存在的函数

```javascript
let userAdmin = {
  admin() {
    alert("I am admin");
  },
};
let userGuest = {};
userAdmin.admin?.(); //I am admin
userGuest.admin?.(); //啥都没发生
```

- 变体：?.[]—访问属性所属对象可能不存在

```javascript
let key = "firstName";
let user1 = {
  fristName: "John",
};
let user2 = null;

alert(user1?.[key]); //John
alert(user2?.[key]); //undefined
```

## symbol 类型

- 表示唯一的标识符
- 创建方法：

```javascript
let id = Symbol();
//带symbol名的symbol
let id = Symbol("id"); //id是描述为"id"的symbol
```

- symbol 具有唯一性，即使 symbol 名相同

```javascript
let id1 = Symbol("id");
let id2 = Symbol("id");
alert(id1 == id2); //false
```

- symbol 不会被自动转换为字符串，可调用 toString() 方法进行转换（也可访问 description 属性）

```javascript
let id = Symbol("id");
alert(id); //类型错误：无法将symbol值转换为字符串
alert(id.toString()); //Symbol(id)
alert(id.description); //id
```

- symbol 的作用：防止属性被重写（string 键会重名）

```javascript
let user = {
  name: "John",
};
//我的代码
let id = Symbol("id");
user[id] = 1; //使用symbol键

//别人的代码
let id = Symbol("id");
user[id] = "Their id value"; //不会覆盖我的代码中的user[id]，因为symbol总是不同的
```

- 对象字面量中需要对 symbol 键使用方括号

```javascript
let id = Symbol("id");
let user = {
  name: "John",
  [id]: 123,
};
```

- for...in 遍历，Object.keys(obj)：会忽略 symbol 属性（隐藏符号属性原则）
- Object.assign(dest,src1,...,srcN)：会同时复制 string 和 symbol 属性
- 全局 symbol（注册表）：
  - 作用：确保相同 symbol 名返回同一个 symbol
  - `Symbol.for(key)`：从注册表中读取 symbol 名为 key 的 symbol，没有则创建并存入注册表
  - `Symbol.keyFor(symbol)`：从注册表中查询并返回 symbol 的 symbol 名,非全局 symbol 返回 undefined

```javascript
let id = Symbol.for("id"); //读取symbol名为"id"的symbol，没有则创建
let idAgain = Symbol.for("id"); //重新获取symbol名为"id"的symbol
alert(id === idAgain); //true

let sym = Symbol.for("name");
let sym2 = Symbol.for("id");
alert(Symbol.keyFor(sym)); //name
alert(Symbol.keyFor(sym2)); //id

let globalSymbol = Symbol.for("name");
let localSymbol = Symbol("name");
alert(Symbol.forKey(globalSymbol)); //name，全局symbol
alert(Symbol.forKey(localSymbol)); //undefined,非全局symbol

alert(localSymbol.description); //name，所有symbol都有description属性
```

- 系统 symbol：可以改变系统内建行为
  - Symbol.hasInstance
  - Symbol.isConcatSpreadable
  - Symbol.iterator
  - Symbol.toPrimitive

## 对象——原始值转换

- javascript 不支持运算符重载，会将对象自动转换为原始值，再用原始值进行运算
- 转换规则：
  - —> Boolean：始终为 true
  - —> Number 和 String：通过 hint ["string","number","default"]
- hint 转换过程：
  1. 调用 obj\[Symbol.toPrimitive](hint)得到返回的原始值（如果存在该方法，否则往下）
  2. hint: "string" —> 调用 obj.toString() 或 obj.valueOf()
  3. hint: "number"或"default" —> 调用 obj.valueOf() 或 obj.toString()

```javascript
obj[Symbol.toPrimitive] = function (hint) {
  //这里是将此对象转换为原始值的代码
  //必须返回一个原始值
  //hint="string"、"number"或"default"中的一个
};

let user = {
  name: "John",
  money: 1000,
  [Symbol.toPrimitive](hint) {
    alert(`hint:${hint}`);
    return hint == "string" ? `{name:"${this.name}"}` : this.money;
  },
};

alert(user); //hint:string -> {name:"John"}
alert(+user); //hint:number -> 1000
alert(user + 500); //hint:default -> 1500
```
