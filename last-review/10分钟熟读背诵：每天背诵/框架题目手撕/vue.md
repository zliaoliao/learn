非常好，下面是整理好的 **Vue 中高级面试中最常见的 Top 10 手写题/实战题目**（适用于 Vue 2 和 Vue 3，特别是 Vue 3 Composition API 场景），每题都给出：

* ✅【考点解释】
* 🧠【实际使用场景】
* 💡【面试作答建议】

---

# ✅ Vue 中高级面试 Top 10 高频题（附场景说明）

---

### 🥇 1. `防抖/节流`函数封装 + 指令封装（v-debounce）

* ✅【考点】：函数控制、事件指令封装、组件通信基础
* 🧠【场景】：搜索框防抖、按钮节流防止重复提交
* 💡【作答建议】：先手写 `debounce` 函数，再封装为指令

```ts
// debounce.ts
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// v-debounce 指令封装
app.directive('debounce', {
  mounted(el, binding) {
    const [fn, delay] = binding.value;
    el.addEventListener('click', debounce(fn, delay));
  }
});
```

---

### 🥈 2. `v-model` 的自定义封装（组件双向绑定）

* ✅【考点】：`modelValue` + `emit('update:modelValue')`
* 🧠【场景】：表单组件封装，如 Input、Select
* 💡【作答建议】：说出 `defineProps + defineEmits` 或 `props: ['modelValue']` 和 emit 的结构

```vue
<!-- MyInput.vue -->
<template>
  <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
</template>

<script setup>
defineProps(['modelValue'])
defineEmits(['update:modelValue'])
</script>
```

---

### 🥉 3. 父组件调用子组件方法（ref + `expose`）

* ✅【考点】：组件通信，`ref` 和 `defineExpose`
* 🧠【场景】：让父组件控制弹窗打开/关闭、表单重置等
* 💡【作答建议】：Vue2 用 `$refs` + `$emit`，Vue3 用 `defineExpose`

```vue
<!-- 子组件 -->
<script setup>
function focus() { console.log('focus') }
defineExpose({ focus })
</script>

<!-- 父组件 -->
<Child ref="childRef" />
<button @click="childRef.focus()">点击调用子方法</button>
```

---

### 🏅 4. 动态表单生成 + 校验

* ✅【考点】：组件动态渲染、动态 `v-model`、`v-for` 生成
* 🧠【场景】：后台管理系统的动态表单构建、配置表驱动 UI
* 💡【作答建议】：结合 `computed` / `watch` 管理值与校验结果

---

### 🏅 5. 虚拟列表渲染（Virtual List）

* ✅【考点】：性能优化，`scrollTop` + `slice` 可视数据
* 🧠【场景】：长列表数据（几千项）优化
* 💡【作答建议】：描述“通过设置容器高度 + 占位 + translateY 来实现”

---

### 🏅 6. 手写组件缓存机制（类 KeepAlive）

* ✅【考点】：`<keep-alive>`、缓存组件实例、副作用处理
* 🧠【场景】：表单多 Tab 切换，缓存上一个页面
* 💡【作答建议】：解释 keep-alive 的生命周期配合 `activated/deactivated` 使用

---

### 🏅 7. 组件通信模式总结与选型

* ✅【考点】：Vue 各种通信方式对比（props、emit、inject/provide、mitt、pinia）
* 🧠【场景】：父子、兄弟、跨层级通信
* 💡【作答建议】：可列出如下：

  * props / emit：父子通信
  * ref / defineExpose：父调用子
  * eventBus（mitt）：兄弟通信
  * provide / inject：跨层级通信
  * pinia / vuex：全局状态共享

---

### 🏅 8. `watch` / `watchEffect` 深浅监听问题

* ✅【考点】：Vue3 响应式系统、浅/深监听区别
* 🧠【场景】：监听对象属性变化、表单变化监控
* 💡【作答建议】：举例说明 shallow 与 deep 的差别

```ts
watch(obj, (newVal) => {}, { deep: true }) // 对整个对象深度监听
```

---

### 🏅 9. 批量注册全局组件 / 自定义插件机制

* ✅【考点】：插件机制 `install`，全局自动注册逻辑
* 🧠【场景】：组件库封装、全局指令/组件批量注册
* 💡【作答建议】：描述如何在 `install` 中挂载组件 / 指令

```ts
MyPlugin.install = (app) => {
  app.component('MyComp', MyComp)
}
```

---

### 🏅 10. Composition API 的组合式逻辑复用（vs Mixin）

* ✅【考点】：组合式函数复用 vs 选项式 Mixin 的对比
* 🧠【场景】：逻辑复用、状态复用（如分页、请求、权限等）
* 💡【作答建议】：

```ts
export function usePagination() {
  const current = ref(1);
  const pageSize = ref(10);
  const total = ref(0);
  return { current, pageSize, total };
}
```

---

## 🎯 面试策略总结

| 类型    | 常见面试切入角度                                  |
| ----- | ----------------------------------------- |
| 功能实现  | 如何封装组件/指令，实现功能抽象                          |
| 性能优化  | 虚拟列表、组件缓存、懒加载                             |
| 状态管理  | pinia/vuex 应用与模块拆分                        |
| 通信机制  | props、emit、expose、eventBus、provide/inject |
| 工程能力  | 插件机制、组件自动注册、模块结构优化                        |
| 响应式原理 | shallow vs reactive vs ref，依赖追踪、proxy 实现  |

---

如果你需要我把这 10 道 Vue 高频手写题和实战面试题整理成 Markdown/PDF 速查笔记，并配上代码、使用场景、答题模板，我可以继续为你整理好。需要吗？
