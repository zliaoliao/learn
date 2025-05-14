非常好，下面是整理好的 **中高级前端 React 面试最常考的 Top 10 手撕题目及参考答案**，涵盖常用 Hook、性能优化、组件通信、控制流等核心点。

---

# ✅ React 中高级面试 Top 10 手撕题目（含答案）

---

### 🥇 1. 实现 `useDebounce` Hook

```ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
```

useDebounce 的核心价值，不是减少 render，而是控制基于状态变化产生的副作用的触发频率（如请求、日志、回调等）。


---

### 🥈 2. 实现 `useThrottle` Hook

```ts
import { useRef, useState, useEffect } from 'react';

export function useThrottle<T>(value: T, delay: number): T {
  const [throttled, setThrottled] = useState(value);
  const lastExec = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    if (now - lastExec.current >= delay) {
      setThrottled(value);
      lastExec.current = now;
    }
  }, [value, delay]);

  return throttled;
}
```

---

### 🥉 3. 实现 `usePrevious` Hook（获取上一次的值）

```ts
import { useEffect, useRef } from 'react';

export function usePrevious<T>(value: T): T | undefined {
  const prev = useRef<T>();
  useEffect(() => {
    prev.current = value;
  }, [value]);
  return prev.current;
}
```

---

### 🏅 4. 实现 `useUpdateEffect`（忽略首次执行）

```ts
import { useEffect, useRef } from 'react';

export function useUpdateEffect(effect: () => void, deps: any[]) {
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    return effect();
  }, deps);
}
```

---

### 🏅 5. 实现 `useEventListener`（通用事件监听）

```ts
import { useEffect, useRef } from 'react';

export function useEventListener<K extends keyof WindowEventMap>(
  type: K,
  handler: (event: WindowEventMap[K]) => void,
  target: Window | Document = window
) {
  const savedHandler = useRef(handler);
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const listener = (event: Event) => savedHandler.current(event as any);
    target.addEventListener(type, listener);
    return () => target.removeEventListener(type, listener);
  }, [type, target]);
}
```

---

你提的问题非常有深度，这正是从“背题”走向“理解题目价值”的关键阶段。

---

## ✅ 你的核心疑问是：

> 这些 hook，比如 `usePrevious`、`useUpdateEffect`、`useEventListener`，**真的面试有考察价值吗？意义在哪里？**

结论是：

### ✅ **它们不是考你会不会写，而是考你是否真的理解 React 的“生命周期 + 闭包 + 状态隔离”这些核心机制。**

下面我来分析每个 hook 背后真正的“考点价值”。

---

### 🥉 `usePrevious`：考察点不是功能，而是**闭包 vs ref**认知

#### ❓面试官可能这样问你：

* React 中如何获取上一次的 props 或 state？
* 为什么不能直接 `let prev = value`？
* `useRef` 能保存状态不变，它和 `useState` 有什么区别？

#### ✅ 实际价值：

* 说明你知道函数组件中闭包的陷阱，**`useRef` 保存跨 render 的状态**；
* 如果你说得出来 `useRef` 不变，但 render 会更新，那你是进阶选手。

---

### 🏅 `useUpdateEffect`：考察点是**副作用首次执行问题**

#### ❓面试官可能这样问你：

* 我不想在组件首次渲染时就执行 `useEffect`，怎么办？
* 如何模拟 componentDidUpdate 行为？

#### ✅ 实际价值：

* 你是否理解 React 的**副作用默认会在第一次 render 后执行一次**；
* 能否熟练绕过这个机制，**体现你对生命周期的细腻掌握**；
* 面试官看你是否熟练用 `useRef` 控制逻辑判断，不是乱写。

---

### 🏅 `useEventListener`：考察点是**闭包陷阱 + 事件绑定优化**

#### ❓面试官可能这样问你：

* React 中绑定 `window.addEventListener` 有什么要注意的？
* 为什么直接 `useEffect(() => { window.addEventListener(...) })` 会出 bug？

#### ✅ 实际价值：

* 你是否知道：

  * handler 是闭包，如果不更新会用到旧的值；
  * 没清除监听器会造成内存泄露；
* 面试官不在乎你写得多炫，他要看你是否能安全、正确地封装事件监听，**体现代码鲁棒性**。

---

## 🎯 总结这些 Hook 的真正面试价值

| Hook               | 真正考点              | 面试层级      |
| ------------------ | ----------------- | --------- |
| `usePrevious`      | ref vs state、闭包陷阱 | 中级基础必会    |
| `useUpdateEffect`  | 生命周期模拟、避免首 render | 中高级细节意识   |
| `useEventListener` | 闭包陷阱 + 清理机制       | 高级代码鲁棒性能力 |

---

## 📌 面试官最满意的答案不是 copy，而是这种思考方式：

> “我知道 React 的函数组件每次渲染会重新定义变量，但 `useRef` 保持的是引用不变，所以我们用它来保存上一次的值。像 `useUpdateEffect` 就是利用这个特性避免首次副作用，而 `useEventListener` 则用它解决闭包陷阱 + 内存泄漏问题。”

---

如果你希望我基于这个思路，帮你筛选出“真正有意义的 React 手写题”，并按：

* ✅ 题目
* 🧠 真实考点
* 📈 面试价值
* 💡 答题模板

整理成一份 **中高级 React 面试深度版题库文档**，我可以立刻开始整理，是否继续？


### 🏅 6. 实现一个 `Modal` 弹窗组件（支持挂载到 `body`）

```tsx
// Modal.tsx
import React from 'react';
import ReactDOM from 'react-dom';

export const Modal = ({ visible, children, onClose }: any) => {
  if (!visible) return null;
  return ReactDOM.createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
};
```

---

### 🏅 7. 实现父组件调用子组件方法（`forwardRef + useImperativeHandle`）

```tsx
// 子组件
import React, { forwardRef, useImperativeHandle, useRef } from 'react';

const Child = forwardRef((props, ref) => {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
  }));

  return <input ref={inputRef} />;
});

// 父组件
function Parent() {
  const childRef = useRef();

  return (
    <div>
      <Child ref={childRef} />
      <button onClick={() => childRef.current.focus()}>聚焦</button>
    </div>
  );
}
```

---

### 🏅 8. 实现一个 `useMounted` 判断是否挂载

```ts
import { useEffect, useRef } from 'react';

export function useMounted(): () => boolean {
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return () => mounted.current;
}
```

---

### 🏅 9. 实现 `shallowEqual`（浅比较函数）

```ts
export function shallowEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }
  return true;
}
```

---

你问得非常好，这四个题看起来偏“实战”，但它们背后的面试价值其实非常明确 —— 都考察了 React 的**高级机制理解、代码健壮性、性能优化意识与组件设计能力**。

下面我详细分析每一题**面试官的真实意图、核心考点、你该怎么答才能高分**：

---

## 🏅 6. 实现一个 `Modal` 弹窗组件（支持挂载到 `body`）

### ✅ 真正考察点：

| 维度               | 含义                                       |
| ---------------- | ---------------------------------------- |
| **createPortal** | React 组件脱离父级 DOM 层级的渲染能力                 |
| **组件封装能力**       | 判断 `visible`，结构清晰、事件冒泡控制                 |
| **UI 隔离**        | 提升弹窗 z-index、安全性，避免嵌套样式干扰                |
| **性能优化**         | `visible` 为 false 时直接 return null，不渲染组件树 |

### 💡 面试官想听你说：

> “我们使用 `ReactDOM.createPortal` 把弹窗挂载到 `document.body`，避免它被父级样式污染。为了避免无谓渲染，`visible=false` 时直接返回 null。点击遮罩关闭弹窗时，需要 `stopPropagation` 防止误关闭。”

---

## 🏅 7. 实现父组件调用子组件方法（`forwardRef + useImperativeHandle`）

### ✅ 真正考察点：

| 维度           | 含义                         |
| ------------ | -------------------------- |
| **组件通信机制**   | 子组件如何暴露行为给父组件              |
| **ref 使用方式** | 使用 forwardRef 传递 ref 到函数组件 |
| **封装思维**     | 控制哪些方法对外暴露（不是暴露整个实例）       |

### 💡 面试官想听你说：

> “在 React 中，函数组件没有实例，所以不能像类组件那样 `ref.focus()`，我们使用 `forwardRef` 和 `useImperativeHandle` 精确暴露子组件能力，比如 focus/reset 等行为，增强了组件的封装性与安全性。”

---

## 🏅 8. 实现一个 `useMounted` 判断是否挂载

### ✅ 真正考察点：

| 维度          | 含义                          |
| ----------- | --------------------------- |
| **异步副作用处理** | 避免组件卸载后还执行 `setState` 报错    |
| **生命周期控制**  | 精准控制组件是否还“活着”               |
| **健壮性**     | 异步流中判断 isMounted 是非常重要的实践手段 |

### 💡 面试官想听你说：

> “我们在异步请求中，组件可能已经卸载，但 promise 回调还在执行，会导致 `setState` 报错。`useMounted` 返回一个状态函数，在执行副作用前先判断组件是否还存在，从而提升稳定性。”

---

## 🏅 9. 实现 `shallowEqual`（浅比较函数）

### ✅ 真正考察点：

| 维度          | 含义                             |
| ----------- | ------------------------------ |
| **性能优化意识**  | 用于 `React.memo` 自定义 props 比较函数 |
| **对象结构理解**  | keys 比较、值引用比较                  |
| **组件重渲染控制** | 理解浅比较与深比较的取舍场景                 |

### 💡 面试官想听你说：

> “`shallowEqual` 用于对 props 进行浅比较，避免不必要的重新渲染。比如在 `React.memo` 中可以传入 `areEqual` 函数，只有 props 内容变化时才触发更新。这种方式可用于优化大型组件性能。”

---

## 🧠 这些题真正体现你能力的地方在于：

* **你不仅能写出代码，还能说出为什么要这样写**
* **你知道这段代码对应的是 React 哪个特性、生命周期陷阱、性能陷阱**
* **你能结合实际场景讲出应用**

---

## 📌 模拟高分回答片段示例

> “我们实现 Modal 的时候，使用了 `ReactDOM.createPortal` 来脱离父组件 DOM 限制。这种结构在遇到层级冲突、弹窗阻挡、或全屏遮罩时特别有用，而且 return null 可以避免虚拟树构建。配合 `stopPropagation` 可以防止点击内容区误关闭弹窗。”

---

如果你想要我把这些题按：

* ✍️ 手写实现代码
* 🎯 核心考点提炼
* 💡 面试答题思路模板
* 📘 实战中如何用

整理为一份系统的 **React 中高级手写题 & 面试答题指南**，我可以马上帮你生成。需要吗？


### 🏅 10. 实现一个简版 `useMemo`（只支持基本类型和依赖比较）

```ts
import { useRef } from 'react';

export function useSimpleMemo<T>(fn: () => T, deps: any[]): T {
  const prev = useRef<{ deps: any[]; value: T }>();

  if (!prev.current || deps.some((d, i) => d !== prev.current!.deps[i])) {
    prev.current = { deps, value: fn() };
  }

  return prev.current.value;
}
```

---

## 📌 备注与使用建议

* 每道题都可以结合使用示例写一遍；
* 最佳练习方式是：先不看答案独立写一次，再对比；
* 多个 Hook、组件题目可以组合（如节流输入框、Modal中调用子组件方法）；

---

如果你需要我将这些整理为一份**可打印的 Markdown/笔记/速查卡片文档**，或要继续补充下一个 Top 20\~30 的题库，我也可以继续帮你完善。需要吗？


非常实用的问题！下面我为你总结这 **React 中高级手撕题 Top 10** 的典型 **使用场景 + 示例代码**，让你不仅会写，还知道**什么时候用，怎么用**，在面试或项目中脱颖而出。

---

## ✅ 1. `useDebounce` — 防止频繁请求

### 🔧 场景：搜索输入框防抖，避免频繁请求 API

```tsx
const [query, setQuery] = useState('');
const debouncedQuery = useDebounce(query, 500);

useEffect(() => {
  if (debouncedQuery) {
    fetch(`/search?q=${debouncedQuery}`);
  }
}, [debouncedQuery]);
```

---

## ✅ 2. `useThrottle` — 控制函数执行频率

### 🔧 场景：滚动监听、resize，防止高频调用

```tsx
const [scrollY, setScrollY] = useState(window.scrollY);
const throttledScroll = useThrottle(scrollY, 200);

useEffect(() => {
  const handler = () => setScrollY(window.scrollY);
  window.addEventListener('scroll', handler);
  return () => window.removeEventListener('scroll', handler);
}, []);
```

---

## ✅ 3. `usePrevious` — 获取上一次的状态或值

### 🔧 场景：比较前后状态差异，做动画、逻辑判断等

```tsx
const [count, setCount] = useState(0);
const prevCount = usePrevious(count);

useEffect(() => {
  if (prevCount !== undefined && prevCount < count) {
    console.log('Count 增加了');
  }
}, [count]);
```

---

## ✅ 4. `useUpdateEffect` — 忽略首次渲染

### 🔧 场景：在初次加载后才触发的副作用，如弹窗提示、校验

```tsx
useUpdateEffect(() => {
  alert(`你选择了：${value}`);
}, [value]);
```

---

## ✅ 5. `useEventListener` — 添加跨组件安全事件监听

### 🔧 场景：监听键盘事件、点击事件等，自动清除

```tsx
useEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});
```

---

## ✅ 6. `Modal` — 弹窗组件

### 🔧 场景：通用模态弹窗，点击遮罩关闭

```tsx
<Modal visible={visible} onClose={() => setVisible(false)}>
  <h2>确认删除？</h2>
  <button onClick={handleConfirm}>确认</button>
</Modal>
```

---

## ✅ 7. `forwardRef + useImperativeHandle` — 父组件调用子方法

### 🔧 场景：让父组件控制子组件行为，如聚焦 input

```tsx
const inputRef = useRef();
<CustomInput ref={inputRef} />
<button onClick={() => inputRef.current.focus()}>聚焦输入框</button>
```

---

## ✅ 8. `useMounted` — 异步操作时判断组件是否还挂载

### 🔧 场景：防止 setState 内存泄漏警告

```tsx
const isMounted = useMounted();

useEffect(() => {
  fetchData().then(data => {
    if (isMounted()) {
      setData(data); // 避免内存泄漏
    }
  });
}, []);
```

---

## ✅ 9. `shallowEqual` — props 浅比较优化

### 🔧 场景：实现自定义 memo、避免无效重渲染

```tsx
function areEqual(prevProps, nextProps) {
  return shallowEqual(prevProps, nextProps);
}

export default React.memo(MyComponent, areEqual);
```

---

## ✅ 10. `useSimpleMemo` — 缓存值避免重复计算

### 🔧 场景：计算密集型值（如排序、过滤）

```tsx
const expensiveValue = useSimpleMemo(() => {
  return list.sort((a, b) => a.id - b.id);
}, [list]);
```

---

## 🎯 总结：如何在面试/项目中说出来

> “我们在项目中封装了通用 Hooks，比如 `useDebounce` 用于搜索场景防抖处理，`useMounted` 防止 setState 警告，`useImperativeHandle` 让父组件能安全调用子组件方法，另外自定义 `Modal` 组件配合 `ReactDOM.createPortal` 处理挂载到 body 之外的弹窗等逻辑，也有实际使用。”

---

如果你想，我可以把这 **10 个 Hook + 使用场景 + 示例代码** 整理成 Markdown 笔记或速查 PDF 方便你随时查阅。是否需要？

