非常好，下面是整理好的 **TypeScript 中高级前端面试中频率最高的 15 道题目**，并系统整理了对应的基础知识点与参考答案，帮助你快速掌握常考点。

---

# ✅ TypeScript 中高级前端面试 Top 15 高频题 + 核心知识讲解

---

## 🧩 一、基础核心 & 类型体操（工具类型篇）

### 🥇1. **TS 常见工具类型有哪些？作用是什么？（高频）**

| 工具类型                       | 含义                      |
| -------------------------- | ----------------------- |
| `Partial<T>`               | 将 `T` 所有属性变为可选          |
| `Required<T>`              | 将 `T` 所有属性变为必填          |
| `Readonly<T>`              | 所有属性变为只读                |
| `Pick<T, K>`               | 从 `T` 中挑选出指定 `K` 属性     |
| `Omit<T, K>`               | 从 `T` 中剔除指定 `K` 属性      |
| `Record<K, T>`             | 构造一个以 K 为键、T 为值的对象类型    |
| `Exclude<T, U>`            | 从 `T` 中排除可分配给 `U` 的类型   |
| `Extract<T, U>`            | 提取出可分配给 `U` 的类型         |
| `NonNullable<T>`           | 排除 `null` 和 `undefined` |
| `ReturnType<T>`            | 获取函数返回值类型               |
| `Parameters<T>`            | 获取函数参数类型组成的元组           |
| `ConstructorParameters<T>` | 获取构造函数的参数类型元组           |
| `InstanceType<T>`          | 获取构造函数实例的类型             |

✅ 面试建议：结合实际业务场景说清用途，如 API 参数的部分更新使用 `Partial<T>`。

---

### 🥈2. 实现 `MyPartial<T>`（手写题）

```ts
type MyPartial<T> = {
  [K in keyof T]?: T[K]
}
```

---

### 🥉3. 实现 `MyPick<T, K>`（手写题）

```ts
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}
```

---

### 🏅4. `keyof`、`typeof`、`in`、`extends` 分别是什么？

| 关键词       | 说明                |
| --------- | ----------------- |
| `keyof`   | 获取对象类型所有键名的联合类型   |
| `typeof`  | 获取变量/函数的类型        |
| `in`      | 遍历联合类型用于映射类型      |
| `extends` | 条件判断、继承限制（类型体操核心） |

```ts
type Keys = keyof { a: string, b: number } // 'a' | 'b'
type ValueType = typeof someVar
type Copy<T> = { [K in keyof T]: T[K] }
```

---

### 🏅5. 实现 `MyOmit<T, K>`（手写题）

```ts
type MyOmit<T, K extends keyof any> = {
  [P in keyof T as P extends K ? never : P]: T[P]
}
```

---

## 🧩 二、函数/泛型相关

### 🏅6. TS 中函数参数是协变还是逆变？（高级）

* 参数是**逆变**（子类型不能赋给父类型参数）
* 返回值是**协变**（子类型可以赋给父类型返回）

---

### 🏅7. 实现 `MyReturnType<T>`（模拟 ReturnType）

```ts
type MyReturnType<T extends (...args: any) => any> = 
  T extends (...args: any) => infer R ? R : never;
```

---

### 🏅8. 如何实现 `currying` 类型体操？

```ts
type Curry<F> = F extends (...args: infer Args) => infer R
  ? Args extends [infer A, ...infer Rest]
    ? (a: A) => Curry<(...args: Rest) => R>
    : R
  : never;
```

---

## 🧩 三、类型守卫 & 条件类型

### 🏅9. 什么是类型守卫？有哪些常用方式？

* `typeof`：`typeof x === 'string'`
* `instanceof`：`x instanceof Date`
* 自定义守卫函数：

```ts
function isString(val: unknown): val is string {
  return typeof val === 'string';
}
```

---

### 🏅10. 条件类型的语法结构及常见用法？

```ts
T extends U ? X : Y
```

例子：实现 `IsString<T>` 判断是否为字符串

```ts
type IsString<T> = T extends string ? true : false;
```

---

## 🧩 四、泛型进阶应用 & 实战场景

### 🏅11. 如何约束泛型只能传对象？

```ts
function merge<T extends object, U extends object>(a: T, b: U): T & U {
  return { ...a, ...b };
}
```

---

### 🏅12. TS 中如何实现深度只读 DeepReadonly？

```ts
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}
```

---

### 🏅13. 如何定义可选链类型 `a?.b?.c` 的类型？

> TS 会自动支持：`type Result = A['b']?.['c']`，也可封装为安全取值：

```ts
type SafeGet<T, K extends keyof T> = T[K] extends undefined ? never : T[K];
```

---

## 🧩 五、TS 与项目结合场景

### 🏅14. 项目中 TS 类型管理的最佳实践？

* 类型拆分为 `types` 目录，如 `User`, `Article` 等模块
* 接口数据和业务状态拆开
* 明确接口返回值结构，使用 `axios.interceptors` 封装统一泛型

---

### 🏅15. 如何在组件库中封装支持泛型的组件？

```ts
// 泛型传递给组件 props
interface TableProps<T> {
  data: T[];
  renderRow: (row: T) => JSX.Element;
}
```

---

## 📌 面试建议答题模板

> “TS 的工具类型是为了让类型在运行中更灵活，比如 `Partial<T>` 用于接口 patch 部分字段，`Pick` 和 `Omit` 用于构造子类型。项目中我们经常结合接口返回值结构定义类型，搭配工具类型做复用，使用泛型提升组件通用性，如表格、分页器都依赖泛型数据结构。”

---

## ✅ 总结 & 输出建议

如果你希望：

* 整理为 **一份 Markdown/PDF 格式的 TS 中高级面试资料**
* 题目 + 基础讲解 + 手写答案 + 实战场景 + 模板答法

我可以立刻为你生成完整文档。需要吗？



你这个问题非常关键：**“映射类型” 到底是怎么回事？`[K in keyof T]: T[K]` 为啥 `T[K]` 能自动“跟着 K 变化”？**

我们来一步步讲清楚这个核心概念——**这是 TS 类型系统最根本、最容易被搞混的知识点之一。**

---

## ✅ 一、什么是映射类型（Mapped Type）？

**映射类型**（Mapped Type）是 TypeScript 提供的一种**根据已有类型自动构造新类型**的方式。

### 🌱 基本语法：

```ts
type NewType = {
  [K in keyof T]: T[K]
}
```

可以理解为：

> 遍历 `T` 的所有键名 `K`，把每个 `K` 和它对应的 `T[K]` 复制过来。

这就是映射类型的“遍历 +复制”核心机制。

---

## ✅ 二、哪个符号表示遍历？为什么说 `in` 是关键？

```ts
[K in keyof T]: T[K]
```

* `in` 是用来**遍历联合类型**的关键字；
* `keyof T` 返回的是 `T` 的键名组成的联合类型；
* 所以 `K in keyof T` 就等价于：对所有键名做一次遍历；
* 类似于：`for...in` 结构，但是**类型层面**的！

---

## ✅ 三、那为什么 `T[K]` 能“自动跟着变化”？

这是 TypeScript 的**类型参数绑定机制**：

* `[K in keyof T]` 遍历时，**每次 K 是一个确定的键名**
* 那么 `T[K]` 就会**解析成该键对应的值类型**

来看一个完整示例理解👇：

```ts
type T = { name: string; age: number }

type MyType = {
  [K in keyof T]: T[K]
}
```

* `keyof T` 等于 `'name' | 'age'`
* 第一次遍历时：`K = 'name'`，`T[K]` → `T['name']` → `string`
* 第二次遍历时：`K = 'age'`，`T[K]` → `T['age']` → `number`

所以最终变为：

```ts
type MyType = {
  name: string;
  age: number;
}
```

---

## ✅ 四、它们是“连在一起”的语法吗？

是的：`[K in keyof T]: T[K]` 是**一整套语法结构**，类型映射中不可以拆开。

你可以想象它像这样：

```js
// JS 中类似的结构
const newObj = {}
for (const key in T) {
  newObj[key] = T[key]
}
```

在类型层面：

```ts
type NewType = {
  [key in keyof T]: T[key]
}
```

---

## ✅ 五、映射类型还能“变形”：加可选 / 只读 / 重映射

| 目标       | 写法                              |
| -------- | ------------------------------- |
| 所有属性可选   | `[K in keyof T]?: T[K]`         |
| 所有属性只读   | `readonly [K in keyof T]: T[K]` |
| 删除某些 key | `as P extends X ? never : P`    |
| 重命名 key  | `as NewName`                    |

---

## 🧠 总结记忆：

### 🌟 映射类型口诀：

```
in 是遍历，K 是键名，T[K] 就是值；
keyof 拿联合，条件改键名；
as 控制输出键，?: 控制可选；
```

---

## ✅ 面试时推荐这样解释：

> “映射类型是 TypeScript 中根据已有类型批量构造新类型的手段。它的核心结构是 `[K in keyof T]: T[K]`，表示遍历 T 的键名，用 T\[K] 获取对应的值类型。in 是遍历联合类型，T\[K] 会根据 K 自动解析出来，T\[K] 其实是类型上的索引操作，和 JS 里的 T\[key] 类似。”

---

在映射类型中，当 key 被映射为 never 时，就会被抹掉，不生成属性。

如你希望，我可以整理一份「映射类型 + 条件类型 + infer + 分布式类型」的系统性理解图谱和面试训练题，是否继续？


你问得非常专业，这涉及到了 TypeScript 的**类型系统方向性（Variance）**，这是在高级 TS 面试中经常出现但容易让人混淆的一块内容。

我们来逐个解释你的两个问题：

---

## ✅ 一、TS 中函数参数是协变还是逆变？

### 📌 结论先讲：

* ✅ **参数是**：逆变（**参数类型要“更广泛”才能兼容**）
* ✅ **返回值是**：协变（**返回值要“更具体”才能兼容**）

### 🚩什么是协变（Covariant）？

协变是指：如果 A 是 B 的子类型，那么 `Foo<A>` 是 `Foo<B>` 的子类型。

* ✅ 常用于“返回值类型”

### 🚩什么是逆变（Contravariant）？

逆变是指：如果 A 是 B 的子类型，那么 `Foo<B>` 是 `Foo<A>` 的子类型。

* ✅ 常用于“函数参数类型”

---

## ✅ 举例说明协变 vs 逆变

我们来对比两个函数：

```ts
type Parent = { name: string }
type Child = { name: string; age: number }

type Fn1 = (val: Parent) => Parent
type Fn2 = (val: Child) => Child
```

### ✅ 看参数（逆变）：

```ts
let f1: Fn1
let f2: Fn2

f1 = f2 // ❌ 不行，f2 要求参数是 Child，更严格，不兼容
f2 = f1 // ✅ 可以，f1 只要求 Parent，f2 能接受更详细的 Child
```

说明参数是 **逆变**（要越宽松越好）

---

### ✅ 看返回值（协变）：

```ts
type G1 = () => Parent
type G2 = () => Child

let g1: G1
let g2: G2

g1 = g2 // ✅ 可以，g2 返回的是 Child，更具体，更“安全”
g2 = g1 // ❌ 不行，g1 返回 Parent，g2 期望 Child
```

说明返回值是 **协变**（越具体越好）

---

### ✅ 小结：

| 项目        | 原因           | 举例                                        |
| --------- | ------------ | ----------------------------------------- |
| **参数是逆变** | 调用方不能提供更严格要求 | `(child) => void` 不能赋给 `(parent) => void` |
| **返回是协变** | 接收方可以接受更详细数据 | `() => child` 可以赋给 `() => parent`         |

---

## ✅ 二、`MyReturnType<T>` 是什么机制？

```ts
type MyReturnType<T extends (...args: any[]) => any> =
  T extends (...args: any[]) => infer R ? R : never
```

这是一个典型的 **条件类型 + 类型推断（`infer`）** 的用法：

### 📌 拆解理解：

1. `T extends (...args: any[]) => any` 是个函数类型约束
2. `T extends (...args: any[]) => infer R` 是条件判断：

   * 如果 T 符合函数签名结构
   * 就从这个函数中**推断返回值类型**，命名为 `R`
   * 然后返回 `R` 类型
3. 否则返回 `never`

### 🧠 举例：

```ts
type Fn = () => number
type R = MyReturnType<Fn> // 推导出 R = number
```

---

### ✅ 你应该在面试这样解释：

> TypeScript 中，返回值是协变的，意味着返回值类型越具体越安全。而 `MyReturnType<T>` 利用了条件类型和 `infer` 关键字，从函数类型中提取出返回类型，是构建类型工具的基础能力之一。我们通过 `T extends (...args) => infer R` 结构，把函数返回类型抽取出来，赋值给 R，然后返回。

---

## ✅ 延伸面试题（常考）：

1. 实现 `MyParameters<T>`（提取参数类型元组）：

   ```ts
   type MyParameters<T extends (...args: any[]) => any> = 
     T extends (...args: infer P) => any ? P : never
   ```

2. 实现 `MyConstructorParameters<T>`：

   ```ts
   type MyConstructorParameters<T extends abstract new (...args: any) => any> =
     T extends abstract new (...args: infer P) => any ? P : never
   ```

3. 实现 `MyInstanceType<T>`：

   ```ts
   type MyInstanceType<T extends new (...args: any) => any> =
     T extends new (...args: any) => infer R ? R : never
   ```

---

如果你需要，我可以将这些**条件类型 + infer 推导题**整理成一套“TS 工具类型推导题大全”加答题模板。需要我继续帮你生成吗？


很好，**`infer` 是 TypeScript 类型系统中最核心、最有魔力的关键词之一**，但也是最容易理解错误的。

---

# ✅ 什么是 `infer`？

> **`infer` 是用在条件类型中的关键字，用来“在类型结构中声明一个待推断的类型变量”。**

它只在 `extends ... ? ... : ...` 结构的条件类型中使用，用来**推断某个类型的内部组成部分**。

---

## 🧠 换句话说：

* `infer R` 就是声明一个“占位符”，让 TypeScript 在类型检查中自动推导出 `R` 的真实类型。
* 类似 JS 的解构赋值，只不过是**类型层面的解构与提取**。

---

## ✅ 经典语法结构：

```ts
T extends SomeStructure<infer X> ? X : FallbackType
```

> 如果 `T` 满足结构 `SomeStructure<X>`，就把其中的类型参数 X 推导出来，命名为 `X`，然后返回。

---

## ✅ 一步一步理解例子

### 🌰 示例 1：模拟 `ReturnType<T>`

```ts
type MyReturnType<T> = 
  T extends (...args: any[]) => infer R ? R : never;
```

解释：

* 如果 `T` 是一个函数类型，推导它的返回值类型为 `R`
* 否则返回 `never`

✅ 用法：

```ts
type Fn = () => number;
type Result = MyReturnType<Fn>; // Result = number
```

---

### 🌰 示例 2：模拟 `Parameters<T>`

```ts
type MyParameters<T> = 
  T extends (...args: infer P) => any ? P : never;
```

解释：

* 如果 `T` 是函数类型，则把参数类型元组推导为 `P`

✅ 用法：

```ts
type Fn = (a: string, b: number) => void;
type Args = MyParameters<Fn>; // [string, number]
```

---

### 🌰 示例 3：提取 Promise 的返回值

```ts
type UnwrapPromise<T> = 
  T extends Promise<infer R> ? R : T;
```

✅ 用法：

```ts
type A = UnwrapPromise<Promise<string>> // string
type B = UnwrapPromise<number>          // number
```

---

## ✅ 小结记忆

| 概念              | 类比                          | 举例                            |
| --------------- | --------------------------- | ----------------------------- |
| `infer` 是类型解构工具 | 类似 JS 的解构赋值                 | `const {a} = obj` ↔ `infer A` |
| 用于类型内部结构提取      | 提取函数返回值、参数、类成员等             | `T extends (...) => infer R`  |
| 只能在条件类型中使用      | `T extends ... ? ... : ...` | ❌ 不能单独写 `infer`               |

---

## ✅ 面试建议这样说：

> “`infer` 是用于条件类型中的推断关键字。它允许我们从复杂类型结构中提取某一部分，比如函数的返回值、参数、Promise 包装类型等等。它本质上是类型级的解构工具，常配合 `extends` 使用，用于构建工具类型。”

---

## 🧠 常见面试题中 infer 的用法：

| 题目           | 示例                                                      |
| ------------ | ------------------------------------------------------- |
| 获取返回值类型      | `T extends (...args: any[]) => infer R ? R : never`     |
| 获取参数类型       | `T extends (...args: infer P) => any ? P : never`       |
| 获取 Promise 值 | `T extends Promise<infer R> ? R : never`                |
| 获取数组元素类型     | `T extends (infer U)[] ? U : T`                         |
| 获取构造函数实例类型   | `T extends new (...args: any[]) => infer R ? R : never` |

---

如果你想，我可以为你整理一份 **“TS infer 推导模板题 10 套+使用场景图解”笔记卡片**，帮助你彻底掌握 infer 的所有变体与思维方式。是否需要？
