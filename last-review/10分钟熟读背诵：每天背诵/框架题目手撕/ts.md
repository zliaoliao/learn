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
