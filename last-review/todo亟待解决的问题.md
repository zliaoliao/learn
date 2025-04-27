promisify  node 第一天讲的   5.30

```

function promisify(fn) {
  return function (...args) {
    return new Promise( (resolve, reject) => {
      fn(...args, (err, data)=>{
        if(err) reject(err);
        resolve(data);
      })
    })
  }
}

```



async ===> 做了啥


原理：

```
async 函数的实现原理，就是返回一个自动执行器函数，并给它传入生成器（generator）函数， 最终自动执行器函数返回一个promise。


async function fn(args) {
  // ...
}
// 等同于
function fn(args) {
  return spawn(function* () {
    // ...
  });
}

所有的async函数都可以写成上面的第二种形式，其中的spawn函数就是自动执行器。

spawn函数的实现

function spawn(genF){
  return new Promise((resolve, reject)=>{
    const gen = genF();
    const step = (nextF) => {
      let next;
      try{
        next = nextF();
      }catch(e){
        return reject(e);
      }
      if(next.done){
        return resolve(next.value)
      }
      Promise.resolve(next.value).then((v)=>{
        step(()=>gen.next(v))
      }, (e)=>{
        step(()=>gen.throw(e))
      })
    }
    step(()=>gen.next(undefined))
  })
}


```

Promise.resolve() :

```
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))

```


css  :local 局部作用域（编译后类名变）？ :global 全局作用域（编译后类名不变）

> CSS Modules 允许使用:global(.className)的语法，声明一个全局规则。凡是这样声明的class，都不会被编译成哈希字符串。
> 产生局部作用域的唯一方法，就是使用一个独一无二的class的名字，不会与其他选择器重名。这就是 CSS Modules 的做法。CSS Modules 还提供一种显式的局部作用域语法:local(.className)

```
:local(.title) {
  color: red;
}

:global(.title) {
  color: green;
}

```


看一下这个getLocalIdent: getCSSModuleLocalIdent 具体是干嘛的

getLocalIdent 是css-loader的配置默认为undefined，值为一个function，可以自定义生成的类名（自己设置类名规则，比如给每个类名加一个标记字段）,即使是css文件，不是.module.css文件，修改modules里的配置也是一样的



webpack 里 publicPath 干嘛用的？

该配置会为index.html中引入的<script> <link>等标签中的资源路径添加前缀
> 这对你手动引入的静态资源不生效

nginx里的root 和 alias?

使用root，实际的路径就是：root值 + location值。  (可以root理解为资源目录)
使用alias，实际的路径就是：alias值。

有一张图片，URL是：www.awaimai.com/static/a.jpg, 它在服务器的路径是：/var/www/app/static/a.jpg, 那么root配置为：

```
location /static/ {
root /var/www/app/;
}

> 注意： static 后面有杠

```

用alias的配置就是：

location /static/ {
alias /var/www/app/static/;
}



微前端，不明白如何去加载html的？ 是直接请求子应用的html，挂在到对应节点么，那么一个节点是怎么能挂载<html>标签的呢，应该只是能挂载<div>类标签的吧？还有里面的scritps怎么处理的，scritps是单独拿出来远行处理的么？

qiankun 的加载是怎么运行的？

qiankun的隔离是怎么做的？

加载流程： 

先注册register应用，然后start( 这里可以配置预加载参数prefetch，开启预加载策略，当前匹配的应用加载完毕后，在浏览器空闲的时候再去加载其他子应用，用的是requestIdleCallback, 也就是每一帧的空闲时间)。

当路径匹配后开始加载。首先拉取入口html文件，解析拿到tmplate模版（html里会把所有的script脚本， link样式都注释掉），script脚本和style样式表 (<script> <link> 这种外部引用的， script脚本和style样式表分别都用requestIdleCallback 加载，这样就能每次空闲请求一部分)， 以及加载script脚本后可执行的script的内容（请求回script脚本才能执行， 不过也有部分script可能不需要请求）

对模版进行一些处理，不过head标签要换一个名，比如qiankun-head， 创建一个div， 把请求回来的模版（html）放到div里
> div 里 可以包html， 只不过在展示是，html 会自动把内存html和head标签去掉, 所以可以改下head标签名，把head标签留下来

然后把再在沙箱里去执行js



http1 和 http2的区别？https

并发控制



### 第二遍复习

从node开始，

6.16看到path哪里，6.17 继续， 项目和八股笔记复习；



关于算法部分，动态规划暂时跳过，有时间再专门研究。


## 第二次面试



#### 图片懒加载

页面有很多图片的时候，图片加载需要一定的时间，这样很耗费服务器性能，不仅会影响渲染速度，还会浪费带宽。

懒加载就是优先加载可视区域的内容，其他内容等进入可视区域再进行加载。

如何加载图片？

图片是根据图片上的src属性进行加载的，所以可以在图片进入可视区域前，我们先不给src赋值（或者给一个很小的loading图）,等图片进入可视区域后，再给src赋上真正的地址


如何判断进入可视区域？

有四种方式： 

-  通过getBoundingClientRect api， 这个api会返回这个图片元素的大小，极其相对于视口的位置， 所以我们只需要判断这个元素的top,是否小于可视窗口的高度（document.body.clientHeight）， 如果小于说明在可视窗口内，这是给图片赋上真正的值
- 通过图片元素的  offsetTop 实现， 判断元素的offsetTop， 是否小于:document.body.clientHeight + document.body.scrollTop

```
e.offsetTop<document.body.clientHeight+document.body.scrollTop




ps： js 盒模型，有三种类型（client, offset）, 每种类型各有两组属性表示元素尺寸的width/height, 表示元素与外界关系的left/top;

三种类型: client 盒内 (包括内容+padding), offset 盒子本身， 也就是client + 边框border，scroll 如果内容不溢出，结果就是盒内client, 如果溢出就是真实宽高。

有特殊:

clientLeft/Top 表示边框宽度;
offsetLeft/Top 距离其父参照物（一般父参照物都是body, 如果给元素增加一个定位属性， 会让它的子孙元素父参照物指向当前元素）的左偏移， 上偏移（从边框外沿开始算）
scrollLeft/Top 滚动条卷去的宽度/高度, js盒模型， 13个属性，只有这两个是可读写的，快速定位到底部scrollTop = 0;


```


- IntersectionObserver （这个api又叫交叉观察器）, 这个api可以自动观察元素是否可见（目标元素与视口是否产生了一个交叉区）

```
intersectionObserver(){
        let images = document.getElementsByTagName('img');
        const observer = new IntersectionObserver((imgs) => {
          console.log('imgs===', imgs)
          // imgs: 目标元素集合
          imgs.forEach((img) => {
            // img.isIntersecting代表目标元素可见，可见的时候给src赋值
            if (img.isIntersecting) {
              const item = img.target
              item.src = item.dataset.src
              observer.unobserve(item);
            }
          })
        })
      //定时器和Array.from的目的是让images可遍历
      setTimeout(()=>{
        Array.from(images).forEach(item => {
          observer.observe(item);
        })
      },300)
    }

```


tcp队头阻塞

全局错误处理： 接口统一错误处理？

或者

window.addEventListener('unhandledrejection', function (event) {
处理事件对象
event.reason //获取到catch的err的原因(内容) 与控制台报错一致
event.promise //获取到未处理的promise对象
.....
});



### 代码规范

代码规范用的啥，eslint ，prettier配置怎么统一的要传到git上吗？

eslint, prettier， 但是他们之间会有一些冲突，所以还要装，eslint-plugin-prettier(相等于先使用prettier，然后eslint检测)
> 它们都有自己的rc配置，

### cra

create-react-app 常用的工具原理有必要了解一下

通过命令行交互工具启动一个命令，在命令行交互中， 获取用户输入，然后创建对应的代码文件。

1. 通过命令行交互询问用户问题
2. 根据用户回答结果生成文件

首先： ejs创建模版文件

然后调用命令行工具，根据用户回答生成文件。

初始化脚手架各种命令
创建package.json
处理并验证命令参数，搜集依赖
安装前置依赖
处理package.json的react/react-dom依赖版本号，并校验node版本是否符合要求
验证所提供的react-scripts依赖，并通过子进程调用依赖下的react-scripts/scripts/init.js，进行项目模板初始化
安装模板依赖，用到ts则初始化其配置
验证代码仓库，做兼容处理；若没有添加仓库，初始化git


### 组件性能如何优化
 只知道useCallback 和 useMemo 似乎不太够啊

 主要是一个组件复用，和减少重复渲染。

 1. 组件复用: 同一层级，同一类型，同一个key值， 才会复用，所以尽量保证三者的稳定性， 常见的不规范写法就是:key=index，
 这时index能够标记唯一性也行，不过很多时候index容易变化。

 2. 减少子组件重复渲染： 重新render会导致组件重新进入协调（diff), 比较耗时，如果能减少协调就能加快渲染完成速度。如果组件没有进入协调，我们称之为进入baiout阶段，意思是组件在这层组件退出更新

让组件进入baiout 阶段有以下方法：

- shouldComponentUpdate 类组件的一个生命周期，当用户用户定义函数返回false就进入baiout阶段
- PureComponent: 更新前自行浅比较新旧props与state是否改变，如果两者都没变，则进入baiout阶段
- memo: 函数组件就可以使用memo优化，它的第一个参数是函数组件，第二个参数是用户自定义比较函数（接受prevProps 和 nextProps），如果没有自定义，默认使用浅比较， 比较组件更新前后props是否相同，如果相同则进入baiout阶段；
  > 简单用法就是用memo将函数组件包一下，将函数组件作为参数， 最终会返回一个新组件；

 
还可以用useCallback 和 useMemo 做些缓存。useMemo 缓存函数执行完的结果，useCallback缓存函数本身；
 
 

是否对新的技术保持热情：   react18 更新了什么，对新的react， 最新两个版本新特性的了解， 对新的js特性的了解

### webpack 热更新

开启方式， devServer里hot设为true, 从webpack4开始 默认就是true， 默认开启；

无需刷新，在内存环境中即可替换掉旧的模块。

在 webpack 的运行时中 __webpack__modules__ 用以维护所有的模块。

而热模块替换的原理最核心的，即通过 chunk 的方式加载最新的 modules，找到 __webpack__modules__ 中对应的模块逐一替换，并删除其上下缓存。

```
// webpack 运行时代码
const __webpack_modules = [
  (module, exports, __webpack_require__) => {
    __webpack_require__(0);
  },
  () => {
    console.log("这是一号模块");
  },
];
 
// HMR Chunk 代码
// JSONP 异步加载的所需要更新的 modules，并在 __webpack_modules__ 中进行替换
self["webpackHotUpdate"](0, {
  1: () => {
    console.log("这是最新的一号模块");
  },
});


```

其下为更具体更完整的流程，每一步都涉及众多。 感觉下面的可以不计。

1. webpack-dev-server 将打包输出 bundle 使用内存型文件系统控制，而非真实的文件系统。此时使用的是 memfs(opens in a new tab) 模拟 node.js fs API
2. 每当文件发生变更时，webpack 将会重新编译，webpack-dev-server 将会监控到此时文件变更事件，并找到其对应的 module。此时使用的是 chokidar(opens in a new tab) 监控文件变更
3. webpack-dev-server 将会把变更模块通知到浏览器端，此时使用 websocket 与浏览器进行交流。此时使用的是 ws(opens in a new tab)
4. 浏览器根据 websocket 接收到 hash，并通过 hash 以 JSONP 的方式请求更新模块的 chunk
5. 浏览器加载 chunk，并使用新的模块对旧模块进行热替换，并删除其缓存



node项目用到的一些技术







