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

