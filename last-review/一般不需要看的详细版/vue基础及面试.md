# 一、vue粗看

### 1. 创建vue 实例与 data() 数据

选项式api中
1. data 函数里返回的对象是数据, data(){   return {}   }
2. 模版里引用数据用插值表达式{{}}


```
// Vue.createApp创建vue实例，mount将新的vue实例挂载到dom某个地方；没挂载的地方不受vue影响;原生html,css,js可以和vue并存
        Vue.createApp({
            data(){
                return {
                    title: '零食清单'
                }
            }
        }).mount('#app'); 

// 选项式api
// data 函数里返回的对象是数据
// 模版里引用数据用插值表达式{{}}

```

一些通用的理解：

- vue 实例中：函数形式的属性有data, 其他都是对象
- vue 的template中，vue指令或者v-bind后的引号中""内容, 写的是js，会当成js去解析，而不是字符串,  样式相关style和class例外，绑定style,和class的时候，值要用{}包起来才能取到变量值（当然也可以把这个{}理解为对象，那就还是js）





### 2. 数据绑定 v-bind, v-model

- v-bind将数据绑定到属性上面，是单向的，从数据到dom, vue数据变动，dom就会变动,可以简写为 : 
- v-model 是双向的，vue数据变动，dom跟着变动，dom变动，vue数据跟着变动

### v-for, 

1. v-for ，for 循环, 使用v-for的时候，一般要加key, 默认会用index作为key，在某些情况下index就不准了，最好自己给他加上给唯一key,否则可能dom对比，渲染会出问题


### v-show, v-if

v-show 是用css的display:none/block 来控制的, dom依然在， v-if显示隐藏是将dom元素整个添加或删除；

v-if由false变为true的时候，触发组件的beforeCreate、create、beforeMount、mounted钩子，由true变为false的时候触发组件的beforeDestory、destoryed方法。

v-if有更高的切换消耗；
v-show有更高的初始渲染消耗；

v-if 可以和 v-else-if, v-else 一起使用，也可以单独用v-if, 和我们平时用if判断的原理类似，判断为true，就显示，为false就跳过

### vue 实例中的 computed 对象

computed 是一个对象， 这个对象的每个属性是一个函数，它的返回值就是计算属性值， 计算属性在需要时才更新，提升了不少性能；

在计算属性里的this指向vue实例, 可以用this直接取到data的数据；

使用时计算属性直接使用函数名即可，不需要加括号；


```
<body>
    <div id="app">
        <section v-show="afterBuy.length">
            <h2>已购零食</h2>
            <ul>
                <li v-for="food in afterBuy" :key="food.id">
                    <img :src="food.image">
                    <span>{{ food.name }}</span>
                    <input type="checkbox" v-model="food.purchased">
                </li>
            </ul>
        </section>
        
        <section v-show="beforeBuy.length">
            <h2>未购零食</h2>
            <ul>
                <li v-for="food in beforeBuy" :key="food.id">
                    <img :src="food.image">
                    <span>{{ food.name }}</span>
                    <input type="checkbox" v-model="food.purchased">
                </li>
            </ul>
        </section>
        
    </div>

    <script>
        Vue.createApp({
            data() {
                return {
                    foods: [
                        { id: 1, name: '原味鱿鱼丝', image: './images/原味鱿鱼丝.png', purchased: false },
                        { id: 2, name: '辣味鱿鱼丝', image: './images/辣味鱿鱼丝.png', purchased: false },
                        { id: 3, name: '炭烧味鱿鱼丝', image: './images/炭烧味鱿鱼丝.png', purchased: false }
                    ]
                }
            },
            computed: {
                beforeBuy(){
                    return this.foods.filter(item=> !item.purchased)
                },
                afterBuy(){
                    return this.foods.filter(item=> item.purchased)
                },

            }
        }).mount('#app');
    </script>
</body>

```

### vue 实例中的 template 属性:模版

template属性就是往里写html的， 我们会将vue实例挂载到对应的dom节点上，所以就可以不用在html里写东西，直接在template上写html,然后把内容挂到dom上，比如每个页面都有同样的元素，就不用多次书写html，而是用vue一对多的挂载上去， 所以vue里有组件概念

### vue 实例中的 components属性： 注册组件

- 在使用子组件的时候需要用components属性注册组件，components 接受一个对象，对象里写入组件的名字就行了； 
- 注册的时候，对于components对象属性， 可以使用驼峰命名，但是*html标签是不区分大小写的，因此，约定，template里的标签，统一都用小写的形式，驼峰命名要变成 - 的形式* （你硬是要不按常理写成大写，或者不用-也是能渲染出来）
  > html属性的大小写就不做限制了，可以用驼峰
- createApp使用的根组件创建vue实例时，不需要注册子组件这一步


```
import AppSection from "./AppSection.js"

export default {
  components: {
    AppSection
  },
  template: `<app-section></app-section>`
}
```

### vue 实例中的 props属性

- props在子组件使用，接受父组件传过来的属性，props为一个对象或数组形式，对象key是父组件属性，值为属性类型， 如果不想限制类型用数组就行了，也就是表明从父组件接收了哪些属性
- props 接受的属性数据，可以像data一样，直接在模版里使用

```
父组件：

import AppSectionlist from "./AppSectionlist.js";

export default {
    components: {
        AppSectionlist
    },
    template: /*html*/ `
        <app-sectionlist headline="未购零食" :BuyChild="filters.beforeBuy"></app-sectionlist>
        <app-sectionlist headline="已购零食" :BuyChild="filters.afterBuy"></app-sectionlist>
    `,
    data() {
        return {
            foods: [
                { id: 1, name: '原味鱿鱼丝', image: './images/原味鱿鱼丝.png', purchased: false },
                { id: 2, name: '辣味鱿鱼丝', image: './images/辣味鱿鱼丝.png', purchased: false },
                { id: 3, name: '炭烧味鱿鱼丝', image: './images/炭烧味鱿鱼丝.png', purchased: false }
            ]
        }
    },
    computed: {
        filters(){
            return {
                beforeBuy:  this.foods.filter(item => !item.purchased),
                afterBuy: this.foods.filter(item => item.purchased)
            }
        }
    }
}



子组件： 

export default {
  template: /*html*/ `
  <section v-show="BuyChild.length">
            <h2>{{headline}}</h2>
            <ul>
                <li v-for="food in BuyChild" :key="food.id">
                    <img :src="food.image">
                    <span>{{ food.name }}</span>
                    <input type="checkbox" v-model="food.purchased">
                </li>
            </ul>
        </section>
  `,
  props: {
    headline: String,
    BuyChild: Array,
  }
}


```

### 绑定事件： v-on, vue 实例中的属性: methods

- 事件绑定用v-on , 可以简写为@, v-on 绑定的事件函数写在 vue 实例中的属性methods中， methods 是一个对象， 在里面定义方法, 在template里使用的时候，使用方法名就可以了。
- 阻止事件的默认行为，在事件名后加.prevent


### $emit


子传父： $emit方法在vue实例上,表示触发事件，$emit它是一个函数，接收事件名和事件参数（这个参数就是我们可以传给父组件的值）； 然后在父组件（html元素，用v-on或者@）监听对应事件就行了；

父传子： 用props

### 插槽

在组件模版里留出一个坑位，等着组件子元素去填充，用来处理组件接收模板内容的场景；

也可以理解为， 让父组件可以向子组件指定位置插入html结构， 也是一种组件间通信的方式， 适用于 父组件 ===> 子组件

插槽有默认插槽， 具名插槽， 作用域插槽；

- 组件用 子元素(插槽内容) 去填充 组件模版的插槽；如果传具名内容（有名字的），可以给插槽内容的加上v-slot指令`v-slot:插槽名`，还可以将插槽内容用`template`标签包起来，再用`v-slot:`指令，`v-slot:插槽名`，可以简写为#， 给插槽内容的`template`标签加上`#插槽名` 属性, 插槽名如果是变量，要这么写`#[插槽名]` 
- 组件模版用`slot`标签留坑(插槽出口), `slot`的name属性默认为default,如果给name属性赋值，那它就变成了一个具名插槽（<slot> 元素是一个插槽出口 (slot outlet)，标示了父元素提供的插槽内容 (slot content) 将在哪里被渲染。）
- 当一个组件同时接收默认插槽和具名插槽时，所有位于顶级的非 <template> 节点都被隐式地视为默认插槽的内容。（也就是所有顶级没命名的插槽内容，都放进默认插槽的位置）


> template 可以包裹元素，最终却不生成真实元素；

渲染作用域：
*插槽内容可以访问到父组件的数据作用域*，因为插槽内容本身是在父组件模板中定义的。*插槽内容无法访问子组件的数据。需要子组件传递*
> 父组件模板中的表达式只能访问父组件的作用域；子组件模板中的表达式只能访问子组件的作用域。

举例： 

默认插槽：

```
组件 <SubmitButton>模版： 

<button type="submit">
  <slot>
    Submit <!-- 默认内容 -->
  </slot>
</button>


父组件使用：

<SubmitButton>Save</SubmitButton>

```

具名插槽：

```
组件<BaseLayout>模版：

<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>


父组件使用：

<BaseLayout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <!-- 隐式的默认插槽 -->
  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</BaseLayout>

```





作用域插槽： 

1. 理解： 数据在组件自身， 但根据数据生成的结构，需要父组件决定


组件模版里，可以直接给<slot>标签绑定自定义数据属性， 默认父组件里插槽内容通过v-slot 指令接受数据，

注意区分： `v-slot: 插槽名="插槽数据"`



```
默认插槽： 

组件<MyComponent> 的模板：

<div>
  <slot :text="greetingMessage" :count="1"></slot>
</div>

父组件使用：

<MyComponent v-slot="slotProps">
  {{ slotProps.text }} {{ slotProps.count }}
</MyComponent>

```

```
具名作用域插槽：

子组件模版： 

<slot name="header" message="hello"></slot>


父组件使用： 

<MyComponent>
  <template #header="headerProps">
    {{ headerProps }}
  </template>

  <template #default="defaultProps">
    {{ defaultProps }}
  </template>

  <template #footer="footerProps">
    {{ footerProps }}
  </template>
</MyComponent>
```





### 单文件组件 .vue

为了方便项目管理vue推出了单文件组件sfc, 也就是.vue结尾的文件， 也就是一个组件；

单文件组件结构为：

html 写进 template 标签里面，js写进script标签里面，css写进style标签里面

### 路由： vue-router

- 路由就是一组key-value 的对应关系， key是路径， value可能是function 或者 component（组件）
  > 前端路由value是component, 用于展示页面内容；当浏览器路径变化时， 对应的组件就会显示
  > 后端路由value是function, 用于处理客户端的请求；当服务器收到一个请求时， 根据请求路径找到匹配的函数来处理请求，返回响应数据。
- 多个路由（route）要经过路由器的管理(router)

基本流程： 路径变化，经过router匹配到route路由规则，在对应路由展示区，展示对应组件

vue中的路由，为了实现spa应用的导航区，和展示区来来回回的切换。

需要安装，vue-router, 这是个插件，需要用 Vue.use 的方式去使用


spa: 单页web应用， 整个应用只用一个完整的页面，点击页面中的导航链接页面不会刷新，只会做页面的局部更新，数据需要通过ajax请求获取

#### 1. 路由基本使用

1. 安装vue-router,`npm i vue-router` 
2. 应用插件：`Vue.use(VueRouter)` ,(引入 import VueRouter from 'vue-router')
3. 编写router配置项：

```

import VueRouter from 'vue-router'
// 引入组件
import A from '../components/A'
import B from '../components/B'

// 创建路由实例对象，去管理一组组路由规则

const router = new VueRouter({
  routes: [
    {
      path: '/about',
      component: A,
    },
    {
      path: '/home',
      component:B ,
    },
  ]
})

```

4. 实现切换（active-class可配置高亮样式）
```
<router-link active-class="active" to="/about">About</router-link>

```
5. 指定展示位置

```
<router-view></router-view>

```

#### 2. 路由几个注意点

- 路由组件通常存放在pages文件夹， 一般组件通常存放在components文件夹
- 通过切换'隐藏'了的组件，默认是被销毁（卸载）掉的， 需要的时候再去挂载
- 每个组件都有自己的$route属性，里面存储着自己的路由信息
- 整个应用只有一个router,可以通过组件的$router属性获取到

#### 3. 多级路由

- 配置路由规则， 使用children配置项：

```
routes: [
  {
    path: '/about',
    component: A,
  },
  {
    path: '/home',
    component: B,
    children: [// 通过children配置子级路由
      {
        path: 'news', // 子级路由前不能加'/'
        component: News,
      },
      {
        path: 'message', // 子级路由前不能加'/'
        component: Message,
      },
    ]
  }
]


```

- router-link 跳转时，路径要完整

```
<router-link to="/home/news">News</router-link>

```

#### 4. 路由的query参数

- 传递参数

```
<!-- 跳转并携带query参数， to的模版字符串写法 -->
<router-link :to="`/home/message/detail?id=${m.id}&title=${m.title}`">跳转</router-link>


<!-- 跳转并携带query参数， to的对象写法 -->

<router-link
  :to="{
    path: '/home/message/detail',
    query: {
      id: 666,
      title: '你好'
    }
  }"
>
跳转
</router-link>

```

- 接收参数

```
$route.query.id
$route.query.title
```

#### 5. 路由的params 参数

- 配置路由，声明接收params参数

```
routes: [
  {
    path: '/about',
    component: A,
  },
  {
    path: '/home',
    component: B,
    children: [
      {
        path: 'news', 
        component: News,
      },
      {
        name: 'm', // 给路由命名
        path: 'message/:id/:title',  // 使用占位符声明接收params参数
        component: Message,
      },
    ]
  }
]


```

- 传递参数

```
<!-- 跳转并携带params参数， to的模版字符串写法 -->
<router-link :to="`/home/message/${m.id}/${m.title}`">跳转</router-link>


<!-- 跳转并携带params参数， to的对象写法 -->

<router-link
  :to="{
    name: 'm', // 注意： 当路由携带params参数， 若使用to的对象写法， 则不能使用path配置项，只能用命名路由的name配置项
    params: {
      id: 666,
      title: '你好'
    }
  }"
>
跳转
</router-link>

```

- 接收参数

```
$route.params.id
$route.params.title

```

#### 6. 命名路由

作用： 给路由起个名字，可以简化路由的跳转，避免写比较长的路由路径

- 给路由命名

```
routes: [
  {
    path: '/about',
    component: A,
  },
  {
    path: '/home',
    component: B,
    children: [
      {
        path: 'news', 
        component: News,
      },
      {
        name: 'm', // 给路由命名
        path: 'message', 
        component: Message,
      },
    ]
  }
]

```

2. 简化跳转（只能写成对象方式）

```
<!-- 简化前，需要写完整路径 -->
<router-link to="/home/message">跳转</router-link>


<!-- 简化后，用名字代替路径 -->
<router-link to="{
  name: 'm'
}">跳转</router-link>


```

#### 7. 路由的props配置

作用： 让路由组件更方便的接收到参数

```
{
  name: 'xiangqing',
  path: 'detail/:id',
  conponent: Detail,

  // 第一种写法： props值为对象， 该对象中所有的key-value的组合最终都会通过props传给Detail组件
  // props:{ a: 90},

  // 第二种写法： props值为布尔值， 为true时， 路由会把所有收到的params参数通过props传给Detail组件（这个处理不了query参数）
  // props: true,

  第三种写法： props值为函数， 该函数返回的对象中每一组key-value都会通过props传给Detail组件,把route信息都给你，自己决定给组件那些路由参数（让组件去路由参数更方便）
  props(route){
    return {
      id: route.query.id,
      title: route.query.title, 
    }
  }
}

```







### vite

新一代的构建工具（相对应就是webpack上一代）；

优势是： 
  - 开发环境中，*无需打包操作*，可快速的冷启动
  - 轻量快速的热重载（HMR）
  - 真正的按需编译，不再等待整个应用编译完成
  > 用webpack开发，是把项目打包好，再扔给开发服务器, 开发服务器才准备好, 用户才可以访问
  > 用vite开发，服务器一开始就准备好了，直接启动了，用户可以直接访问，根据用户的请求，再按需去处理响相应的模块

  ```
  npm init vite-app <project-name>
  
  ```

# 二、常用 Composition API

### setup

理解： 
- setup 是vue3中一个重要的配置项，值为一个函数， 组件中所用到的数据、方法等，均要配置在setup中。
- setup函数有两种返回值：
- 1. 若是返回一个对象， 则对象中的属性，方法，在模版中均可以直接使用（重点关注）
- 2. 若返回一个渲染函数，则可以自定义渲染内容，覆盖模版内容（了解）
> setup 不能是一个async 函数，因为这样返回的就是promise， 而不是对象数据了，模版里就拿不到数据(后期也可以返回一个Promise实例，但需要Suspense和异步组件的配合)
>    vue2 的配置和vue3的配置不要混用。因为在vue3的setup中不能读取到vue2配置的数据，方法等（比如用this去读data数据，和methods方法）, 容易出问题； vue2和vue3如果配置重名，vue3优先；


注意事项：

setup的执行时机： 在beforeCreate之前执行一次， this是undefined

setup的参数：
- 第一个参数props: 值为对象， 包含组件外部传递过来，并且在组件内部用props声明接收了的属性
- 第二个参数：上下文对象，有几个关键属性值
  - attrs: 值为对象， 包含组件外部传递过来，但是没有在props配置中声明的属性， 相当于vue2的`this.$attrs`
  - slots: 收到的插槽内容， 相当于vue2的`this.$slots`
  - emit: 分发自定义事件的函数， 相当于`this.$emit`


### ref 函数

作用： 定义一个响应式的数据
语法： `const xx = ref(initValue)`

- 创建一个包含响应式的引用对象（reference 对象, 简称ref对象）
- 在js中操作数据： xx.value;
- 模版中读取数据方式： 不需要.value, 直接 xx(vue解析的时候将value取出来) 

备注：

- 接收的数据可以是基本类型，也可以是对象类型
- ref可以定义基本类型的数据： 响应式依然是靠Object.defineProperty()的get 和 set完成；
- ref可以定义对象类型的数据：ref处理对象类型的数据时， 内部求助于vue3 中的新函数reactive， reactive 函数底层用的是Proxy

### reactive 函数

作用： 定义一个对象类型的响应式数据（基本类型不要用它，用`ref`函数)
语法： `const 代理对象 = reactive(源对象)` 接收一个对象或者数组， 返回一个代理对象（Proxy的实力对象,简称Proxy对象）

- reactive定义响应式数据时深层次的，内部基于Proxy实现，通过代理对象对源对象内部数据进行操作


### 响应式原理

#### vue2 的响应式原理

实现原理：
- 对象类型： 通过`Object.defineProperty()`对属性的读取、修改进行拦截（数据劫持）
- 数组类型： 通过重写更新数组的一系列方法实现拦截。（对数组的变更方法进行了包裹）

存在的问题：

- 直接新增、删除数据属性，界面不会更新
- 直接通过下标修改数组， 界面不会自动更新

#### vue3 响应式原理

实现原理： 
- 通过Proxy(代理)：拦截对象中任意属性的变化，包括：属性值的读取， 添加， 修改， 删除；
- 通过Reflect(反射)：对源对象属性进行操作

```
 new Proxy(data, {
      // 拦截属性值读取
      get(target, prop){
        return Reflect.get(target, prop);
      },
      // 拦截属性值修改或者添加
      set(target, prop, value){
        return Reflect.set(target, prop, value);
      },
      // 拦截属性值删除
      deleteProperty(target, prop){
        return Reflect.deleteProperty(target, prop)
      }
    })


```

对于对象的操作，有两种方式，一种是 . ,另一种就是Reflect，它提供拦截 对象 操作的方法， 这些方法与Proxy的handler方法一一对应。

Reflect的目的是：
1. 把Object对象上的一些方法放到Reflect上，现阶段一些方法同时在Object和Reflect部署，未来的一新方法只部署在Reflect对象上
2. 修改某些Object方法的返回结果，让其变得更加合理， 比如Object.defineProperty(obj, prop, descriptor)，而Reflect.defineProperty(obj, prop, descriptor)则会返回flase, 这样就可以减少很多try catch，尤其是在写库的时候很有用
3. 让Object操作都变成函数行为， 比如之前的命令式的操作，name in obj, delete obj.prop, 变成Reflect.has(obj,name),
   Reflect.deleteProperty(obj,name), 这样就对象操作就更加统一

### ref 和 reactive 对比

从定义数据的角度： 
- ref用来定义：基本类型数据
- reactive用来定义： 对象（或数组）类似类型的数据
- 备注： ref也可以用来定义对象（或数组）类型数据，它内部会通过reactive转为代理对象

从原理角度对比：
- ref通过`Object.defineProperty()`的get与set来实现响应式（数据劫持）
- reactive通过使用Proxy来实现响应式（数据劫持），并通过Reflect操作源对象内部的数据

从使用角度对比：
- ref定义的数据： 操作数据需要`.value`, 在模版中读取数据时直接读取，不需要`.value`
- reactive 定义的数据： 操作数据与读取数据，均不需要`.value`



### 计算属性与监视

#### computed函数， 计算属性

- 与vue2中的computed 配置功能一致
  - 初始化的时候执行一次，所依赖的数据变化后执行一次
  - 计算属性值会基于其响应式依赖被缓存， 这意味着如果其依赖不改变，取值时，不会重新执行，而是直接返回结果
    - 最佳实践： 1. 计算属性的 getter 应只做计算而没有任何其他的副作用，不要在 getter 中做异步请求或者更改 DOM； 
    - 最佳实践： 2. 从计算属性返回的值是派生状态。可以把它看作是一个“临时快照”，更改快照是没有意义的，因此计算属性的返回值应该被视为只读的，不要去主动改它
- 写法, computed函数的参数可以接收函数，和对象， 接收函数就是单纯的一个只读的计算属性， 接收对象，配置get,set就可以可写的计算属性

```
import {reactive, computed} from 'vue'

export default {
  name: 'App', // 给当前组件取个名字
  setup(){
    let person = reactive({
      firstName: '张',
      lastName: '三'
    })

    // 计算属性-精简， 只读的
      person.name = computed(()=>{
      return person.firstName + '-' + person.lastName;
    })

    // 计算属性-完整版，可读，可写的
    person.name = computed({
      get(){
        return person.firstName + '-' + person.lastName;
      },
      set(val){
        const [firstName, lastName] = val.split('-');
        person.firstName= firstName;
        person.lastName = lastName;
      }
    })

    return {
      person
    }

```

#### watch 函数， 侦听器

- 与vue2 中watch配置功能一致， 我们可以使用 watch 选项在每次响应式属性发生变化时触发一个函数
  - 默认浅层，需要深层侦听配置deep: true; 
  - 需要在创建侦听器时，立即执行一遍回调，配置immediate: true
  - 用户创建的侦听器回调，都会在 Vue 组件更新之前被调用。这意味着你在侦听器回调中访问的 DOM 将是被 Vue 更新之前的状态,如果想在侦听器回调中能访问被 Vue 更新之后的 DOM，你需要指明 flush: 'post' 选项
- 两个小坑
  - 监视reactive定义的响应式数据时： oldValue无法正确获取（和newValue是一样的）， 强制开启了深度监视（deep 配置失效）
  - 监视reactive定义的响应式数据的某个属性时： deep配置有效

watch 接收三个参数：
- 第一个参数：监视的变量，可以是数组，如果是reactive的某个属性，需要写成函数形式
  - watch 的第一个参数可以是不同形式的“数据源”：它可以是一个 ref (包括计算属性)、一个响应式对象、一个 getter 函数、或多个数据源组成的数组：如果是reactive对象， 会隐式地创建一个深层侦听器；
- 第二个参数： 回调函数，参数是变量的新值和旧值
- 第三个参数： watch的配置

开发中一般监视reactive对象就行了；

```
...

// 监视ref 对象
watch([num, age], (newVal, oldVal)=>{
      console.log(newVal,oldVal );
      console.log(`num和age 变了，新值${newVal}, 旧值${oldVal}`);
    })

// 监视reactive对象， 会隐式地创建一个深层侦听器
watch(person, (newVal, oldVal)=>{
      console.log(newVal, oldVal);
      console.log(`person变了， 新值${newVal}， 旧值${oldVal}`);
    })

// 监视reactive对象的属性，需要用函数形式
watch(()=>person.firstName, (newVal, oldVal)=>{
    console.log(newVal, oldVal);
    console.log(`111111person.firstName变了， 新值${newVal}， 旧值${oldVal}`);
})

// 深层监视reactive对象的属性，需要手动配置deep
watch(()=>person.a.b.c, (newVal, oldVal)=>{
    console.log(newVal, oldVal);
    console.log(`22222person.firstName变了， 新值${newVal}， 旧值${oldVal}`);
},  {
    deep: true, // 深度监视
})


```

#### watchEffect函数

- watch的套路是： 既要指明监听的属性（数据源），也要指明监听的回调，watch 会避免在发生副作用时追踪依赖，因此，我们能更加精确地控制回调函数的触发时机。
- watchEffect的套路是： 它会在同步执行过程中，自动追踪所有能访问到的响应式属性；这更方便，而且代码往往更简洁，但有时其响应性依赖关系会不那么明确。
  - watchEffect 仅会在其同步执行期间，才追踪依赖。在使用异步回调时，只有在第一个 await 正常工作前访问到的属性才会被追踪。
  - watchEffect第一个参数是副作用逻辑，第二个参数是清除副作用的函数，会在组件卸载时执行
- watchEffect有点像computed:
  - 但computed注重的是计算出来的值（回调函数的返回值）， 所以必须写返回值， 并且不可以用来处理副作用
  - 而watchEffect更注重的是过程（回调函数的函数逻辑）， 所以不用写返回值，可以用来处理副作用



```
watchEffect(async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
})


```


触发回调的时机：

用户创建的侦听器回调，都会在 Vue 组件更新之前被调用。这意味着你在侦听器回调中访问的 DOM 将是被 Vue 更新之前的状态。

如果想在侦听器回调中能访问被 Vue 更新之后的 DOM，你需要指明 flush: 'post'；

后置刷新的 watchEffect() 有个更方便的别名 watchPostEffect()：


### 生命周期

v2到v3, 选项式api写法的变化：

- beforeDestroy 改为  beforeUnmount
- destroyed 改为 unmounted

v3也提供了组合api形式的生命周期钩子， 与vue2的对应关系如下：除了beforeCreate和created， 其余生命周期前加on就行

- beforeCreate ==> setup()
- created ==> setup()   , 也就是说beforeCreate，created 这俩，不用往setup里写了
- beforeMount ==> onBeforeMount
- mounted ===> onMounted
- beforeUpdate ==> onBeforeUpdate
- updated ===> onUpdated
- beforeUnmount ===> onBeforeUnmount
- unmounted ===> onUnmounted


### 自定义hook

hook 本质是一个函数，把setup函数中使用的Composition api进行了封装, 方便复用代码， 让setup中的代码逻辑更加清晰易懂；

类似于vue2中的mixin

### toRef

作用： 创建一个ref对象， 其value 值指向另一个对象中的某个属性
语法： `const name=toRef(obj, 'name')`
应用： 要将响应式对象中的某个属性单独提供给外部使用， 还想保持响应性(通俗点说就是想省去对象那一层，免得取每个属性都要用点取)
扩展： toRefs 与 toRef 功能一致，但可以批量创建多个ref对象，语法： `toRefs(person)`


# 三、其它 Composition API

#### shallowReactive 与 shallowRef

- shallowReactive: 只处理对象最外层属性的响应式（浅响应式，只处理一层）
- shallowRef: 只处理基本数据类型的响应式， 不进行对象的响应式处理
- 什么时候使用？
  - 如果有一个对象数据， 结构比较深， 但变化时只是外层属性变化, 用shallowReactive
  - 如果一个对象数据， 后续功能不修改该对象中的属性， 而是用新生的对象来替代， 用shallowRef （就是说，用shallowRef包裹的对象不会变成Proxy对象， 也就不会是响应式的）

#### readonly 与 shallowReadonly

readonly: 接受一个对象 (不论是响应式还是普通的) 或是一个 ref，返回一个原值的只读代理。（深只读）
shallowReadonly: 要避免深层级的转换行为，请使用 shallowReadonly() 作替代。(浅只读，只有第一层是只读的，深层可以改)
应用场景： 不希望数据被改时（比如接受别的组件定义的数据，交给你了，但是不希望你改）


> 所谓的代理就是Proxy对象


#### toRaw 和 markRaw

toRaw: 
- 作用： 将一个由reactive生成的响应式对象转换为普通对象
- 使用场景： 用于读取响应式对象对应的普通对象，对这个普通对象的所有操作， 不会引起页面更新

markRaw: 
- 作用： 标记一个对象，使其永远不会成为响应式对象。（对象数据虽然可以改，但是永远不会是响应式的了，即使作为一个响应式数据的某个属性值）
- 应用场景：
  - 1. 有些值不应该被设置为响应式， 例如复杂的第三方类库等
  - 2. 当渲染具有不可变数据源的大列表时， 跳过响应式转换可以提高性能

#### customRef 自定义ref响应机制

作用： 创建一个自定义ref, 并对其依赖项跟踪， 和更新触发进行显示控制

- customRef的回调函数接收两个参数，反应有get,set的对象，第一个track追踪依赖（告知get的返回值是需要追踪的，这样才能取到最新的值），track() 应该在 get() 方法中调用，第二个trigger 触发更新，trigger() 应该在 set() 中调用

> 有点类似于react的setState，修改数据状态后，手动触发更新



```
创建一个防抖 ref，即只在最近一次 set 调用后的一段固定间隔后再调用：

import { customRef } from 'vue'

export function useDebouncedRef(value, delay = 200) {
  let timeout
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      }
    }
  })
}


模版：

<script setup>
import { useDebouncedRef } from './debouncedRef.js'
const text = useDebouncedRef('hello', 1000)
</script>

<template>
  <p>{{ text }}</p>
  <input v-model="text" />
</template>


```

#### provide 与 inject

作用： 实现祖先与后代组件间通讯
套路： 祖先组件有一个`provide`选项来提供数据， 后代组件有一个`inject`选项来接收这些数据

具体写法： 

```
1. 祖先组件中：

setup(){
    setup(){ 
    let car = reactive({name: '奔驰', price: '40万'})
    provide('car', car);
  }
}

2. 后代组件中：

 setup(){ 
    ...
    const car = inject('car');
    return {car}
  }

```

### 响应式数据的判断

isRef: 检查一个值是否为一个ref对象
isReactive: 检查一个对象是否是由 reactive() 或 shallowReactive() 创建的代理。
isReadonly: 通过 readonly() 和 shallowReadonly() 创建的代理都是只读的
isProxy: 检查一个对象是否是由 reactive()、readonly()、shallowReactive() 或 shallowReadonly() 创建的代理。


# 五、新的组件

#### Fragment

在vue2中： 组件必须有一个根标签
在vue3中： 组件可以没有根标签，内部会将多个标签包含在一个Fragment虚拟元素中
好处： 减少标签层级，减少内存占用

#### Teleport

`Teleport`是一种能够将我们的组件html结构移动到指定位置的技术（也就是说能够指定父元素）

- <Teleport> 接收一个 to 属性 来指定传送的目标。to 的值可以是一个 CSS 选择器字符串，也可以是一个 DOM 元素对象
- <Teleport> 只改变了渲染的 DOM 结构，它不会影响组件间的逻辑关系
- 多个 <Teleport> 组件可以将其内容挂载在同一个目标元素上，而顺序就是简单的顺次追加，后挂载的将排在目标元素下更后面的位置上。
- <Teleport> 挂载时，传送的 to 目标必须已经存在于 DOM 中。理想情况下，这应该是整个 Vue 应用 DOM 树外部的一个元素。如果目标元素也是由 Vue 渲染的，你需要确保在挂载 <Teleport> 之前先挂载该元素。 

```
<teleport to="目标父元素">
    <div>
      ...内容
    </div>
   </teleport>
```


#### Suspense

<Suspense> 是一项实验性功能

- 等待异步组件时渲染一些其他功能， 让应用有更好的用户体验
  
使用步骤：

- 1. 异步引入组件：异步组件的setup里可以返回Promise 对象

```
import {defineAsyncComponent} from 'vue'
const child = defineAsyncComponent(()=>import('./components/Child.vue'))

export default {
  name: 'App', // 给当前组件取个名字
  components:{Child},
  setup(){ 
  }
}


```
- 2. 使用Suspense包裹组件， 并配置好defalut与fallback

```
<template>
  <div class="app">
    <h3>我是app组件</h3>
    <Suspense>
      <template v-slot:default>
        <Child/>
      </template>
      <template v-slot:fallback>
        <h3>加载中...</h3>
      </template>
    </Suspense>
  </div>
</template>


```


# 六、其他

## 1.全局API的转移

- Vue 2.x 有许多全局 API 和配置。
  - 例如：注册全局组件、注册全局指令等。

    ```js
    //注册全局组件
    Vue.component('MyButton', {
      data: () => ({
        count: 0
      }),
      template: '<button @click="count++">Clicked {{ count }} times.</button>'
    })
    
    //注册全局指令
    Vue.directive('focus', {
      inserted: el => el.focus()
    }
    ```

- Vue3.0中对这些API做出了调整：

  - 将全局的API，即：```Vue.xxx```调整到应用实例（```app```）上

    | 2.x 全局 API（```Vue```） | 3.x 实例 API (`app`)                        |
    | ------------------------- | ------------------------------------------- |
    | Vue.config.xxxx           | app.config.xxxx                             |
    | Vue.config.productionTip  | <strong style="color:#DD5145">移除</strong> |
    | Vue.component             | app.component                               |
    | Vue.directive             | app.directive                               |
    | Vue.mixin                 | app.mixin                                   |
    | Vue.use                   | app.use                                     |
    | Vue.prototype             | app.config.globalProperties                 |
  

## 2.其他改变

- data选项应始终被声明为一个函数。

- 过度类名的更改：

  - Vue2.x写法

    ```css
    .v-enter,
    .v-leave-to {
      opacity: 0;
    }
    .v-leave,
    .v-enter-to {
      opacity: 1;
    }
    ```

  - Vue3.x写法

    ```css
    .v-enter-from,
    .v-leave-to {
      opacity: 0;
    }
    
    .v-leave-from,
    .v-enter-to {
      opacity: 1;
    }
    ```

- <strong style="color:#DD5145">移除</strong>keyCode作为 v-on 的修饰符，同时也不再支持```config.keyCodes```

- <strong style="color:#DD5145">移除</strong>```v-on.native```修饰符

  - 父组件中绑定事件

    ```vue
    <my-component
      v-on:close="handleComponentEvent"
      v-on:click="handleNativeClickEvent"
    />
    ```

  - 子组件中声明自定义事件

    ```vue
    <script>
      export default {
        emits: ['close']
      }
    </script>
    ```

- <strong style="color:#DD5145">移除</strong>过滤器（filter）

  > 过滤器虽然这看起来很方便，但它需要一个自定义语法，打破大括号内表达式是 “只是 JavaScript” 的假设，这不仅有学习成本，而且有实现成本！建议用方法调用或计算属性去替换过滤器。

- ......


### vuex

vuex 与 redux 的 区别:

- vuex是redux的基础上进行改变，对仓库的管理更加明确
- 使用mutation来替换redux中的reducer,来做状态变更管理
- vuex有自动渲染的功能，所以不需要更新


vuex:

- state：存放多个组件共享的状态（数据）
- mutations：存放更改state里状态的方法，用于变更状态，是唯一一个更改状态的属性
- getters：将state中某个状态进行过滤，然后获取新的状态，类似于vue中的computed
- actions：用于调用事件动作，并传递给mutation
- modules：主要用来拆分state

vueComnent——》(dispatch)Action——》（commit）——》Mutations——》（mutate）State——》（render）VueComponent


## vue 面向面试

- 生命周期
- 指令
    - v-bind: 简写`:`,单向绑定数据到dom
    - v-model: 双向绑定
    - v-on: 简写`@`， 绑定事件
    - v-for: 循环 与in连用， `v-for="item in arr"`
    - v-if: 是否渲染，会走生命周期
    - v-show: 是否显示，用css display 实现
- 属性
    - data： 一般写成函数形式，返回的数据可以在模版里直接用
    - props: 对象或者数组，指定接收父组件那些属性，可以用对象指定类型，无需指定类型用数组
      - props 接受的属性数据，可以像data一样，直接在模版里使用
    - components：在使用子组件的时候需要用components属性注册组件 
    - template： 模版，往里写html
      - 模版里引用数据用插值表达式：小胡子 {{}}
      - vue指令后的引号中""内容, 写的是js，会当成js去解析，而不是字符串
      - 绑定style和class的时候，值要用{}包起来才能取到变量值（当然也可以把这个{}理解为对象，那就还是js）
    - computed： 对象形式， 每个属性都是一个函数， 有缓存
    - watch: 处理数据变了之后的副作用
- 插槽： 让父组件可以向子组件指定位置插入html结构（类似于react的传递组件）
    - 默认插槽： 组件（父元素）用 子元素(插槽内容) 去填充 组件模版的插槽<slot></slot>
    - 具名插槽：
      - 插槽内容：插槽内容用template包起来，在template加上v-slot指令`v-slot:插槽名`, 简写`#插槽名`,  所有位于顶级的非 <template> 节点都被隐式地视为默认插槽的内容;插槽名如果是变量，要这么写`#[插槽名]`
      - 给模板里的<slot> 加上name属性，<slot name="插槽名"></slot> 
    - 插槽作用域： 
      - 插槽内容可以访问到父组件的数据作用域，因为插槽内容本身是在父组件模板中定义的
      - 插槽内容无法访问子组件的数据,需要子组件传递
        - 组件模版里，可以直接给<slot>标签绑定自定义数据属性:<slot :text="xxx"></slot>
        - 父组件里插槽内容通过v-slot 指令接受数据:`#插槽名="slotProps"`, 使用 {{slotProps.text}}
- 父子互调
    - 父传子，用props
    - 子传父：$emit
      - $emit方法在vue实例上,表示触发事件
      - $emit是函数，接收事件名和事件参数（这个参数就是我们可以传给父组件的值）
      - 在父组件（@）监听对应事件就行了
- 路由
    - 概念：路由就是一组key-value 的对应关系， key是路径， value是component（组件）,多个路由（route）要经过路由器的管理(router)
    - 目的： vue中的路由，为了实现spa应用导航区对应展示区来来回回的切换。
    - 流程: 路径变化，经过router匹配到route路由规则，在对应路由展示区，展示对应组件
    - 切换路由：通过切换'隐藏'了的组件，默认是被销毁（卸载）掉的， 需要的时候再去挂载
    - vue-router： vue路由， `npm i vue-router` 
      - 这是个插件，需要用 Vue.use 的方式去使用
      - 使用：
        - 1. 安装vue-router,`npm i vue-router`
        - 2. 应用插件：`Vue.use(VueRouter)`, (引入 import VueRouter from 'vue-router')
        - 3. 编写router配置项：
        ```
          import VueRouter from 'vue-router'
          // 引入组件
          import A from '../components/A'
          import B from '../components/B'
          const router = new VueRouter({
              routes: [
              {
                path: '/about',
                component: A,
              },
              {
                path: '/home',
                component:B ,
              },
            ]
          })

          ```
        - 4. 实现切换（active-class可配置高亮样式）:
          - `<router-link active-class="active" to="/about">About</router-link>`
        - 5. 指定展示位置: `<router-view></router-view>`
    - 路由参数: 都有模版字符串写法和对象写法
      - query参数: 问号传参, 传参是直接用问号写在路径后面， 取的时候用query取
      - params 参数： 冒号传参，以路径的形式传，需要路由用冒号声明接收params参数
    - 命名路由： 给路由起个名字，可以简化路由的跳转，避免写比较长的路由路径
      - 只能写成对象方式
    - 路由的props配置： 让路由组件更方便的接收到参数
- 见下
  - vue2 与 3的区别见下
  - vue原理见下
  - vuex见下
  - vue生态见下



### vue3 与 vue2 的区别

主要讲的就是响应式原理和composition api 两块；

1. 源码层面核心原理

    响应原理，由Object.defineProperty ， 变为 Proxy

     - 1. 因为*Object.defineProperty 无法监听 数据对象新增或者删除属性，也无法监听用索引去修改数组的某个元素值 的操作*（因为Object.defineProperty 的get，set只能监听到读取和修改操作，监听数据变化不到界面就不会更新）， *所以vue2 增加了一个Vue.set*（vue实例可以调用：this.$set， 有个$）， 和 Vue.delete(vue实例可以调用：this.$delete) 的方法， *通过这种增加api的方法来解决这个问题*，但是这么做，还是麻烦（*对于数组，还有一种处理方法，就是调用数组的变更方法*，也就是能改变原数组的方法，这种操作也可以被监听到，原理是vue内部将这些方法包装了一层）
     - 2. *不过Proxy不能代理简单数据类型，所以vue3提供了ref方法，用来处理简单数据类型的响应性*，这个方法本质上并没有进行数据的监听，而且构建了一个Refimpl的类, 通过set和get标记了这个类里的value方法，以此来实现，所以ref必须通过.value去触发，本质上是调用value函数


2. 新特性，*新增组合式api*: composition api， 
   - 1. 最初的composition api 必须以setup函数作为入口， *setup函数必须返回两种类型的值，一种是对象， 一种是函数， 当setup返回对象时，对象中的属性和方法可以在template中直接使用， 当setup返回函数时， 这个函数会被作为render函数*，但是这个setup的形式并不好，因为所有的逻辑都放在setup函数中， 就会出现一个巨大的setup函数，不好维护
     
   - 2. vue3.2 的时候，新增了`<script setup>` 的语法糖， 就不需要写setup函数了


options api 和 composition api 对比：

- options api的问题： *使用传统options api，新增或者修改一个功能，可能需要分别在data, methods, computed里修改逻辑分散到各处，不好维护*；
- composition api 的优势： *可以更加优雅的组织代码， 让相关功能的代码可以组合在一起， 可以配合自定义hook使用，让代码更好维护*；



其他一些细节写法区别:

1. Vue3组件中的template模版结构，可以没有根标签, 不像vue2要把内容包裹在一个根标签里


## vue-router


理解路由：

router-link ： 本质是一个可以跳转的a标签，只不过跳转的是路由
router-view: 展示路由组件的区域，其父级是他的上级路由

嵌套路由： 先渲染外层路由组件，一般是布局，比如侧边栏，顶部区域等外层的容器布局，然后子路由是内容区；

### 动态路由

- router.removeRoute()

- router.addRoutes()

动态添加路由， 第一个参数为父级路由名（可以没有父级），第二个参数是具体路由

```
router.addRoute({ name: 'admin', path: '/admin', component: Admin })
router.addRoute('admin', { path: 'settings', component: AdminSettings })

```

### 路由信息

从useRoute 里拿到一些路由相关的信息，比如当前路由路径： route.fullPath

```
import { useRoute, useRouter } from 'vue-router';
const route = useRoute(); // 当前路由对象

const router = useRouter(); // 这个路由对象

```

### 对于路由参数改变跳转的处理

路由改变直接路由跳转就好，但是如果仅仅路由参数改变，跳转是没有的，页面不要刷新，因为不会触发挂载钩子，执行相应的数据获取逻辑；

对于从详情跳转到详情的场景： watchEffect

这时就要用副作用函数: watchEffect, 类似于React里的Effect, 把挂载后获取数据（刷新视图）的逻辑放到（回调）里面, 只要回调函数里依赖的值变化（会自动追踪依赖）， 就会触发watchEffect；这个函数会返回一个取消当前副作用的方法；


取消副作用：onBeforeUnmount

如果这个副作用超出自己设计的范围，那么一种处理方式就是在，组件卸载前取消这个副作用的监听:onBeforeUnmount


```
const stop = watchEffect(() => {
  console.log(newsForm, 'newsForm');
}) 
onBeforeUnmount(() => {
  stop()
})



```



### 复习记录

8.16 看到常用 Composition API


10.23 晚 看到 ## vue 面向面试

## 实践向

### ref, reactive

对于表单赋值，这种一次改变多个对象属性的，要么用ref监控一层，直接替换，value值，要么用reactive， 需要用到Object.assign 对象合并（如果改变对象是不生效的，对象属性是响应式的，对象本身这个引用地址不是响应式的）


```
userForm = Object.assign(userForm, res.data)

```

### 指令

vue中指令就是一种拿到dom，进行操作的方式， 它也有一些和vue类似生命周期钩子


### 权限

1. 组件里，根据权限控制目录显示
2. 路由中， 给路由加上权限字段，配合路由守卫，每次进入路由前检查权限（避免直接从url进入）


## 对vue不熟悉的地方

computed, watch

:属性， @时间

vuex, pina

插槽

### 父子通信

1. 在vue中，原生的一些组件比如input, select等，可以用v-model, 做数据管理
2. 对于自定义的组件，数据管理则需要用自己定义的值（父传子）和事件（子传父）；

### vuex


Mutation: 管理同步
action： 管理异步


在vue组件用用useStore 钩子去获取store状态，在js文件中需要引入创建的store对象才能获取store状态；


### 表单初始值

对于编辑表单，赋初始值，如果在挂载后赋初始值（从后台取的值），有时由于表单初始化的时候，还没有值，所以可能赋不上值；

这时可以选择在dom处加判断，有初始值之后再赋值；

### elementPlus

popover 悬浮框的显示与隐藏，除了默认的触发点，还可以通过visible 去自定义控制




