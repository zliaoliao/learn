[toc]
## node 基础

熟悉整体流程，才能不畏惧，统领全局；
输入关键细节，才能不迷茫，学到东西。

### node 是什么

node 是一个js runtime(运行时， 运行环境)，基于chrome v8引擎构建的，可以让js运行在服务端。

node 的特点： 事件驱动， 非阻塞i/o, (支持esmascript, 内置模块，第三方模块)

> js组成： js包括 ecmascript, dom, bom, 但是node里就没有dom，bom, 目前也没用es6 模块规范（import）， 其余的node都有，node 还提供了额外的功能, 比如文件的操作，服务端的创建


1. 事件驱动：

指程序按照事件的发生顺序来触发响应的处理，能够在不阻塞其他事件的情况下处理多个事件。（事件驱动是是一种思想，事件环是其实现方式）node中也有一个事件环，不断地检查事件队列中是否有新的事件，并触发相应的回调函数。适用于网络应用程序和i/o密集型程序。

2. 非阻塞i/o

当程序发出i/o请求时，如果不能立即得到结果，不会阻塞程序执行，而是立即返回，以便程序可以继续执行其他任务


- 单线程   
  
优点： 节约内存资源，没有锁的问题， 调试容易， 适合i/o密集型操作（读取，和输出，读文件，调接口）

缺点： 无法充分利用多核cpu（需要通过其他方式去解决）, 复杂操作会阻塞主线程

-  多线程

优点： 可以同时处理多个任务，每次请求到来都会开启一个新的线程（会有最高线程数量限制，也就是可以用线程池去优化），可以利用多
cpu资源适合cpu密集型任务（压缩，合并，运算）

缺点： 线程间通信复杂，多线程间锁的问题，较浪费内存（每个线程都会占用一定的内存


> 每次请求都会开启一个新的线程（会有最高线程数量限制，也就是线程池），这样就比），好处是多个请求可以同时处理，
> 这里的同时处理其实是高速切换任务，也会浪费性能， 真正的好处是，适合大量的运算


### node 的使用场景

搭建服务端： 采用koa, express, nestjs, eggjs等
编写前端工具链： gulp, webpack, vite, rollup以及常用命令行工具
为前端服务： 作为中间层，解决跨域问题，进行数据处理bff
ssr服务端渲染（只能用node做服务端渲染，因为如果用java实现服务端渲染就得用java解析js语法，会非常麻烦）
实现及时通讯应用，爬虫等


### 同步和异步

当我们调用一个方法后，是否需要等待这个操作返回的结果（不需要等待就是异步，等待操作的返回就是同步）

- Promise.then,  setTimeout, mutationObserver(h5提供的api),ajax请求，用户事件， setImmediate(ie独有) script脚本， ui渲染
- node 特有： process.nextTick  i/o  setImmediate
- requestAnimationFrame, requestIDleCallback, 到达渲染时机后，每一帧先执行requestAnimationFrame， 帧执行之后剩余时间执行requestIDleCallback， 这两方法是因为浏览器渲染是异步的，造成他们看似是异步的



异步任务划分：  宏任务，微任务 

微任务：（宿主环境提供的，语言本身有的，不过这个描述并不是十分准确） promise.then, MutationObserver（h5方法，监控页面dom节点变化，异步触发回调函数）, process.nextTick
宏任务： 脚本script, ajax, 事件， requestFrameAnimation, setTimeout, setInterval, MessageChannel, I/O, ui渲染
> requestAnimationFrame, requestIDleCallback可以认为是宏任务

#### 同步，异步， 阻塞，非阻塞

阻塞，非阻塞 是对调用者来说的，是等结果还是不等结果。

同步异步，是对被调用者来说的，是等待结果返回（让调用方等着），还是不需要等待结果返回（让调用方别等）

常见的情况就是同步阻塞，异步非阻塞，


#### 浏览器事件环

js是主线程是单线程的，在执行环境中执行是从升到下的执行， 如果遇到异步任务（比如定时器，事件，请求），会另外开启对应线程。

定时器会等时间到了后把定时任务放到队列里，主栈代码执行完毕后会把队列里的任务依次拿到主栈中执行；微任务也类似。

常见的宏任务： js渲染，ui渲染

代码第一次执行，肯定是宏任务先执行，因为script脚本是个宏任务， 执行过程中产生的宏任务会放进宏任务队列（宏任务成功后再放入宏任务队列，不是立刻放入），微任务会放进微任务队列（微任务立即放入微任务队列），主栈代码执行完后，先清空一遍微任务（清空微任务过程中产生的微任务会放进当前微任务队列）再执行一个宏任务（也就是执行下一个宏任务之前会先清空微任务队列，也可以说执行完一个宏任务清空微任务队列）。

微任务清空后会看一下，有没有达到页面的刷新时间，如果达到了会做一个gui界面的渲染（如果需要的话），整个过程是由事件触发线程用事件循环机制控制的， 然后再取下一个宏任务，如此循环。
> gui渲染并不属于事件环的一部分，只不过渲染的时机和事件环有一些联系

事件环可以理解为是死循环的，不停的去扫描


#### node 事件环

1. 我们写的js代码交给v8引擎进行处理
2. 代码中可能会调用node api, node 会交给libuv库处理
3. libuv通过阻塞i/o和多线程实现异步i/o
   > 阻塞i/o，比如读文件，读完文件再返回
   > 多线程实现异步i/o, 比如同时读多个文件， 也就是说底层是通过多线程，来实现异步
4. 通过事件驱动方式，将结果放到事件队列里，最终交给我们的应用

node 11 后， node事件环表现形式就和浏览器一致了，执行过程有一些区别。

主栈代码执行完后，会有这么6个阶段（队列）：主要关注 定时器， 轮询，和 检测阶段的三个队列

- 定时器（timer）： 里面放setTimeout和setInterval的定时任务
> - 待定回调： 上一轮循环没执行完的i/o回调 (我们无法操作)
> - idle, prepare: 仅系统内部调用(我们无法操作)

- 轮询（poll）： 放i/o操作(检索新的i/o事件，比如文件读写；执行与i/o相关的回调)
> 如果检测阶段没有任务，代码逻辑还没执行完，会阻塞在这个阶段，等待定时器到达时间，或者新的i/o操作， 避免不停地循环查找。

- 检测（check）： setImmediate 回调函数将在此处执行
> 关闭回调函数： 一些准备关闭的回调函数，如： socket.on('close', ...)

在主模块中，先写一个0毫秒的定时器，setTimeout再写setImmediate，他们的执行顺序是不确定的，与电脑性能有关，
如果执行代码是定时器时间到了就会执行定时器，如果没到，就行继续走到检测阶段执行setImmediate。

但是如果在i/o操作的回调函数中去写这两个，执行顺序是确定的，因为i/o下一个阶段是检测setImmediate，所以会先执行setImmediate；

其余的大体执行顺序和浏览器差不多， 主栈代码执行完，便会清空微任务(微任务先执行)，然后取下一个宏任务，然后清空微任务，再继续。（定时器，轮询，检测阶段执行的都是宏任务）

process.nextTick 是node自己实现用来替代promise的，比promise 快，优先级高，就是会先执行process.nextTick，然后清空微任务队列


### 进程和线程的区别

#### 进程

进程是系统进行资源分配和调度的基本单位。多个进程之间是独立的，相互隔离的，因此一个进程挂掉不会影响到其他进程。
> 浏览器采用的就是多进程模型，一个网页(tab)就是一个进程，一个网页挂掉不会影响别的网页，网页之间代码也不能相互访问

浏览器中进程的组成：

浏览器主进程（管理浏览器整体界面）
渲染进程（每个页面一个，负责页面内容及相应页面交互）
网络进程（加载资源的进程）
插件进程（独立的进程）
gpu绘图进程（通过gpu来处理图形渲染和图形处理的进程）
....


前端主要考虑的是渲染进程，渲染进程里包含着我们代码的执行过程，渲染进程里包含：

js引擎线程（执行js代码）
渲染线程（渲染页面，布局，画页面）
> js引擎线程和渲染线程 是互斥的
网络线程（处理页面的网络请求）
gpu线程（使用gpu进行图形渲染）
合成线程（将多个图层合并为单个图像）
事件触发线程（调度任务，eventLoop，也就是事件循环来调度任务）
> js 主线程式单线程的，js执行的过程中还会创建一些其他线程（定时器，http请求，事件）

> 前端最需要掌握的就是：js引擎线程， 渲染线程，这两个主要线程，以及事件触发线程是怎么调度任务的（事件循环）


一个进程中可以有多个线程，比如： 渲染线程，js引擎线程，http请求线程等， 进程表示一个程序，线程是进程中的单位，主线程只有一个

一个进程只可以占用1核cpu

node 是单进程，单线程的，无法充分利用电脑cpu, 但是node 可以开子进程， 也就是说node 主进程，开多个子进程，每个子进程里有一个线程

进程和线程的区别：
1. 某个线程出错会导致整个进程崩溃
2. 进程与进程之间相互隔离。某个进程崩溃，不会影响其他进程的运行，可以通过一定机制（ipc）进行通信。
3. 进程所占用的资源在其关闭后会被操作系统回收。
4. 线程之间可以共享所属进程的数据



## http

## node 模块化

> 模块化规范： iife(自执行函数), cmd(cjs，好几年没更新，没人管了)， amd（用的人也不多了）, umd（统一模块管理，支持amd,commonjs）, esmodule, commonjs, 

模块化提升代码通用性，和可扩展性，方便维护，解决变量冲突问题，node中实现模块，采用函数来进行模块划分

### commonjs 流程与原理

每个js文件都是一个模块，每个模块想要去引用别人的模块，需要用require语法，每个模块想要被别人使用需要采用module.exports进行导出。

内部采用同步读取方案，将文件内容获取到，require内容是同步的， 底层用的是同步读取fs.readFileSync
   > 核心流程就三点：require做的主要就是根据文件名获取内容, 进行函数包裹，并且把获取到的内容放到module.exports上

require流程：

1. 每个文件都是一个模块，通过new Module的方式来创建模块
2. 我们调用的require方法是 Module.prototype.require
3. 根据文件名加载文件，通过Module._load方法
4. 用Module._resolveFilename 来根据用户传入文件名获取对应的名字（绝对路径+后缀）
5. 同一个模块加载多次应该只运行一次，所以内部做了缓存了
6. 如果是内置模块就加在内置模块
7. 通过new Module 创建模块，exports 属性默认是{}
8. module.load 根据文件名读取文件
9. 根据后缀名来找到对应的解析策略
10.  读取文件内容fs.readFileSync
11.  给文件内容添加一个函数module._compile
12.  wrapSafe 给内容进行包裹 （里面用vm.compileFunction   将内容编译成函数）
13.  执行函数
14.  最终返回module.exports


```

commonjs 流程模拟实现


const path = require('path')
const fs = require('fs')
const vm = require('vm')

function Module(id){
  this.exports = {};
  this.id = id;
};

Module._cache = {}; // 模块缓存
Module._extentions = {
  '.js'(module){
    const content = fs.readFileSync(module.id, 'utf-8');
    // 把字符串内容包装成函数（
    // 可以考虑new Function, 但是new Function 创建的函数，上级作用域是全局作用域，而不是实际创建时的作用域，有点反常识
    // 也可以考虑eval，不过eval, 执行的时候，会查找上级作用域, 就无法做到变量的隔离，可能会找到模块外的变量，我们希望模块间是相互独立的
    // vm.compileFunction  支持沙箱，可以保证作用域不污染
    const wrapperFunction = vm.compileFunction(content, ['module', 'exports', 'require', '__dirname', '__filename'])
    
    let exports = module.exports;
    let require = req;
    let __dirname = path.dirname(module.id); // 获取文件对应的目录
    let __filename = module.id; // 绝对路径
    // 执行函数
    Reflect.apply(wrapperFunction, exports, [module,exports, require, __dirname, __filename ]) // 改下this
    // wrapperFunction()

  },
  '.json'(module){
    // json的处理
    const content = fs.readFileSync(module.id, 'utf-8');
    module.exports = JSON.parse(content)
  }
}

// 处理成完整的文件名
Module._resolveFilename = function(id){
  const exts = Object.keys(Module._extentions)
  if(fs.existsSync(path.resolve(__dirname, id))) return path.resolve(__dirname, id);

  for(let i=0;i<exts.length;i++){
    const fileUrl = path.resolve(__dirname, id) + exts[i];
    if(fs.existsSync(fileUrl)){
      return fileUrl;
    }
  }
  throw new Error('模块找不到')
}

Module.prototype.load = function(){
  const ext = path.extname(this.id);
  Module._extentions[ext](this); // 根据文件的后缀采取不同的加载策略
}

function req(id){
  // 1. 根据用户传递的id来进行模块加载，相对路径转换为绝对路径
  const filename = Module._resolveFilename(id)
  
  // 2. 创建模块
  let existsModule = Module._cache[filename]; // 模块是否已经缓存过
  if(existsModule){
    return existsModule.exports;  // 返回模块之前导致的结果
  }
  const mod = new Module(filename); // 多次require模块，这个模块只会被读取一次(也就是里面的代码只会运行一次)
  Module._cache[filename] = mod; // 缓存模块

  // 3. 加载这个模块
  mod.load()  // 加载完模块后，就可以拿到模块的最终导出结果

  return mod.exports;
}

const a = req('./a.js');
const b = req('./b');
console.log(a, b);

```

### commonjs 细节 与常见问题

#### commonjs 循环引用

1. 在a中引用b, 在b中引用a, 代码会如何执行，如何表现

```
module-a.js

const b = require('./module-b');
console.log('在a中引用b', b);

module.exports = 'a'

```

```
module-b.js

const a = require('./module-a');
console.log('在b中引用a', a);

module.exports = 'b'

```

1).  从a模块开始执行，那肯定先模块化a， new Module(a)  exports为空对象{}, a模块引用b, 就模块化b, new Module(b)  exports为空对象{}
2). b模块引用a, 由于a已经缓存过了，直接拿过来，但是由于此时a模块代码还没有执行完，a.exports为空对象{}， 所以b中打印, '在b中引用a', {},
3). 继续执行a模块的代码，由于此时b模块代码已经走完，可以拿到b.exports为'b', 所以 a 中打印'在a中引用b', 'b'
如果由b模块开始执行则结果相反

先模块化，先引入的那个模块，能拿到另一个模块的完整导出；

可以断定，循环引用不会死循环，因为有缓存，运行的时候会先将模块缓存起来；对commonjs来说可以实现模块代码部分加载

> ps： 正常人不会写这种代码

2. 如果想a,和b互相调用，还都能拿到完整导出，如何解决？

不要使用强依赖，利用第三个模块，通过延后处理的方式来解决，在第三个模块里把两个本需要相互引用的模块都引入进来，然后写逻辑；
当然，更好的做法不要用这类写法，把公共方法提出去；


#### module.exports 和 exports

```
模块里， exports = module.exports = {};  exports 和 module.exports 指向同一个对象，导出结果默认空对象，
最终导出结果是由module.exports控制的;

1. 如果改变exports 的属性值,比如 exports.a = xxx，这同时改变了module.exports的属性值
2. 如果重新给exports 赋值，比如exports=xxx，则 exports 与 module.exports无关了，也与模块导出结果无关了

模块里，this = exports;  this指向的也是exports, 改变this上的属性也会改变导出结果

this, exports, module.exports, 最开始他们三个同时指向一个空对象(也就是最初的默认导出对象)

正确导出的方式有： 

1. module.exports
2. expots.xxx = xx
3. this.xxx = xx
4. module.exports.xxx = xx


```

#### 多次require

多次require 拿到的是第一次导出的值的拷贝或对象的引用，如果是值则永远不会变，如果是对象，拿到的是第一次的引用，则有如果对象的属性变化，重新获取则可以拿到有新属性的对象；

#### 模块查找

模块分为三类，查找顺序为： 内置模块，第三方模块，文件模块

1) 如果模块是内置模块则直接返回，不去解析了
2）如果是第三方模块，会列出所有查找目录（node_modules),找到同名文件夹，并且看一下文件夹中有没有package.json,
如果有则找main对应的入口，没有则默认使用index.js
3) 如果是文件模块，根据文件名来解析绝对路径，并且尝试添加后缀，先找文件，如果没找到文件则直接查找同名文件夹，
看一下文件夹中有没有package.json,如果有则找main对应的入口，没有则默认使用index.js


## npm 

### 全局模块

全局模块 在命令行中使用

安装全局模块，一般会在/usr/local/bin 下创建一个软链（快捷方式） 安装的包在/usr/local/lib/node_modules 下，
/usr/local/bin 这个目录可以直接执行（在命令行）的原因是它是系统目录（在系统环境变量中存在，所以可以直接访问）

写全局包流程：

1). npm init -y 
2). 在package.json 里写bin命令，与对应的执行文件

```
"bin": {
    "my-server": "./bin/www"
  }
  
```
  
执行文件一般放在bin目录下， 在文件第一行说明用什么来执行该脚本,一般写js脚本用`#! /usr/bin/env node`, 然后写脚本内容
> 也就是说，安装到全局，执行bin里的命令，找对应的命令执行
3). 在项目目录下，npm link，来测试


npm link 把当前项目链接到全局,如果更改运行方式，需要重新link; npm link 常用本地包测试，避免频繁发布然后安装的流程


### 本地项目模块

1. package-lock.json 锁版本的，按道理来说是要上传到git的，避免不同的人使用的版本不一致（虽然传有时会有冲突）
2. 可以通过script 脚本配置运行一些固定的逻辑（长命令变短命令）
3. 通过npm run 命令(script 脚本配置)来运行一些包（比如webpack, 为了保证项目中使用的版本都是一样的，我们会将webpack安装到项目里而不是全局） 


npx 是5.2版本提供的，可以实现不安装就可以使用, 相当于npm run, 运行时发现包没有就会安装，用完就删除，如果包存在则直接运行，一般初始化项目和测试某个包用的多点（脚手架）


### npm包发布

1. npm 切换到官方源 (nrm use npm)
2. npm 登录（npm login， 输入邮箱，密码，用户名）【登录时如果没有账号会提示新建账号】
  > 如果没有账号可以先注册，npm addUser
3. 发布， npm publish (包名就是项目，package.json里的name)
> npm publish --access public,  如果有重名的就会报错
>  发包可能会重名，可以发作用域包，就不会重名，比如@username/xx, username 为用户名

如果想把包卸掉，用npm unpublish


## node中的全局对象

node 全局对象global， 放到global 上的属性都是全局属性，上有：
global
setInterval 及 clearInterval
setTimeout 及 clearTimeout
setImmediate 及 clearImmediate
queueMicrotask
performance

有一些隐藏属性直接打印看不到可以这么打印：
```
console.dir(global, {
  showHidden:true
})

```

最需要掌握的是全局属性是：

process
setImmediate
setTimeout
Buffer


node中，为了实现模块化(commanjs)，node每个文件外面都会包着一层函数，并且将函数中的this指向module.exports(模块导出对象)，
函数传了五个个参数， exports, require, module, __filename, __dirname, 这几个参数也可以直接使用

> node全局中的this默认是一个空对象, this = exports, exports = module.exports={}, 最开始他们三个同时指向一个空对象(也就是最初的默认导出对象),如果使用赋值属性的方式，就是给这个对象里加值，最终三个是相等的，如果直接改变他们三个的值，或指针，三个就不相等了；
> 在函数中this指向的是global对象
> 把变量放到global 上，无需require ，全局都可以直接使用了，不过会污染全局，一般不这么做

浏览器中，直接打印this，指向window,并且var 声明的变量，最终会作为window的一个属性



### process 进程

属性：

process.platform: 平台字符串，比如： windows 是 win32,  mac 是 darwin

process.argv： 包含命令行参数的数组。第一个元素会是'node'（node可执行文件），第二个元素将是.js文件的名称，接下来的参数依次是命令行参数

process.env: 获取当前运行环境的对象，常规可以用来进一步获取环境变量、用户名等系统信息

```
可以设置环境变量，然后在process.env 里去拿

windows 设置： set xxx=xx
mac 设置：  export xxx=xx

这两种方式都是临时的，在哪个命令窗口下设置，在哪个窗口下执行文件，就能获取到，如果换一个命令窗口就获取不到，也就是临时设置环境变量，每次运行文件都要设置，不过一般都设置临时的环境变量，就是把设置环境变量和启动文件的命令一起写: 

export env=dev && node b.js

跨平台设置环境变量： cross-env


```

方法：

process.cwd(): 返回当前（进程的）工作目录（执行文件时，所在的目录,也就是在哪个目录下执行的运行命令，工作目录就是哪个）
> 如果使用相对路径去执行读取等操作时，是相对process.cwd() ，也就是当前的工作目录， 也就是说，用相对路径在node中是有歧义的， 会根据当前工作目录去找,可能会找不到文件，在node中为避免这种歧义，读写等路径，一般用绝对路径

process.nextTick(callback): 微任务


```
1.

setTimeout(()=>{
  console.log('time');
})

setImmediate(()=>{
  console.log('setImmediate');
})

// 这么写执行顺序不一定，与电脑性能有关，如果主栈代码执行完，到定时器时间了，那么定时器回调先执行，如果没到setImmediate的回调先执行


2.

fs.readFile('./b.js',()=>{
  setTimeout(()=>{
    console.log('time');
  })
  
  setImmediate(()=>{
    console.log('setImmediate');
  })
})

// 这么写一定是先走setImmediate，因为读文件是poll阶段，poll 阶段走完了会走check阶段

```

### buffer 概念

buffer 是为了在node中处理二进制数据（读写）， buffer 表示内存中存的二进制数据
> 我们每个文件在计算机中都是用二进制数据存储的，只是我们通过不同的编码格式展现了不同的结果
> 二进制 0b开头， 八进制0开头， 十六进制 0x开头


```
1. 

// parseInt 其他进制，转换为10进制
底层可以用,乘权求和的方式， 也就是 比如111  ==> 1*2^0 + 1*2^1 + 1*2^2 = 7

console.log(parseInt('111', 2));


2.

// toString 可以把任意进制转换为任意进制
console.log((100).toString(16));

console.log(Buffer.from('帅').toString('base64'));


3. 0.1 +0.2  精度丢失

因为都是转换为二进制计算的，小数转换为二进制是乘2取整法，结果在JavaScript提供的有效数字最长为53个二进制位（64位浮点的后52位+有效数字第一位的1）里存不下的，会有精度丢失



```

#### buffer 操作

buffer 代表的是内存中存的二进制数据（buffer中存放的是引用类型）

buffer 一旦声明了大小之后不能更改大小

buffer 的声明方式 3种 ：

1)通过长度来声明 2）通过数组方式来声明（基本用不到,因为参数是buffer数组）
3） 通过字符串来声明

```
// 编写是没有提示， 可以安装ts 类型工具， @types/node, 给所有的node方法编写了类型，写的时候就有提示

// buffer 中都是以字节为单位的，buffer显示的时候一般用16进制的字节显示
const buf = Buffer.alloc(3);
console.log(buf);

const buf2 = Buffer.from([0x10, 0x20, 0x30])
console.log(buf2);

const buf3 = Buffer.from('你好');
console.log(buf3);

```

buffer 常用属性方法： 

```

常用属性方法： 

.length;
.concat;
.isBuffer;
.slice;
.split;(自己封装的)


buffer拼接： 经常需要将多个buffer 拼接成一个buffer
// 1) 大文件的断点续传，分片上传
// 2) http请求也是分段传输的

// buffer 可以通过长度（字节长度）和索引来访问

// buffer 扩容问题： 创建一个新的空间，把老的拷贝进去
const buf1 = Buffer.from('你好')
const buf2 = Buffer.from('世界')
const buf3 = Buffer.alloc(buf1.length + buf2.length);


copy: 拷贝buffer(一般不用)

// 手写copy
Buffer.prototype.copy = function(target, targetStart, sourceStart=0, sourceEnd=this.length){
  for(let i=0;i<sourceEnd-sourceStart;i++){
    target[targetStart+i] = this[sourceStart+i];
  }
}

buf1.copy(buf3, 0);
buf2.copy(buf3, 6)
console.log(buf3.toString());



concat: 一般多段buffer拼接用concat， 底层基于copy

// 手写concat
Buffer.concat = function(bufferList, total=bufferList.reduce((pre, cur)=>pre+cur.length, 0)){
  let buf = Buffer.alloc(total);
  let offset = 0;
  // 循环拷贝total越界了没关系，也不会报错，拷贝不进去
  for(let i=0;i<bufferList.length;i++){
    const cur = bufferList[i];
    cur.copy(buf, offset);
    offset += cur.length;
  }
  // 我们可以将不需要的截掉, 用slice, 和数组的slice规则一样（如果total传多了）
  return buf.slice(0, offset)
}


// 一般不用copy，太麻烦， 一般多段buffer拼接用concat， 底层基于copy
console.log(Buffer.concat([buf1, buf2], 3).toString()); // 你


Buffer.isBuffer(): 判断是否是buffer

slice： 用slice要慎用，slice是浅截取，截取后修改新buffer，会改变老buffer的值（其引用与原始缓冲区相同的内存）；
如果想生成一个新的buffer 和原来内容一样，应该采用的是创建一个新的buffer， 把内容粘过去(类似copy的机制)，而不是采用slice


split: buffer 默认没有，需要自己封装

// 封装split
Buffer.prototype.split = function(sep){
  const sepLen = Buffer.isBuffer(sep)? sep.length : Buffer.from(sep).length;
  let offset = 0;
  const arr = [];
  let cur = 0;

  while((cur = this.indexOf(sep, offset)) !== -1){
    arr.push(this.slice(offset, cur));
    // 从当前截取的下一个分割符号的位置开始继续找
    offset = cur + sepLen;
  };
  // 最后一段也放进来
  arr.push(this.slice(offset))
  return arr;
}

const a = fs.readFileSync('./d.txt');
console.log(a);

console.log(a.split('\n'));

```

#### 编码问题 发展历程

ascii  最大值是127，有127个字符， 一个字节2^8可以表示256个不同的东西，也就是说一个ascii码是一个字节（就够了）
> 最早起源于美国，他们最开始只想表示英文字符

gb2312 支持简体中文， 两个字节表示一个汉字，如果字节大于127，我们就认为这两个字节组合成一个汉字，6000多个简体中文汉字就能表示了
> 汉字比较多，一个字节就不够了，在ascii的基础上扩展
> 但是字节有点浪费 （255-127） （255-127）

gbk 双字节，只要一个字节超过了127， 我们就认为下一个字节就是汉字的另一部分，就可以同时表示中文简体，和繁体了
> 基于gb2312扩展

gb18030 基于gb2312和gbk 扩展，一个更加完美的中文编码
> 到目前为止，一个汉字需要两个字节

unicode 编码，统一用两个字节表示世界所有字符  255*255 
> 虽然能表示很多字符了，但是还不够

utf8 对unicode进行编码， 编成1到4个可变长度的字节，10w+字符，一个字母一一个字节，一个汉字用三个字节 
> node中默认不支持gbk, 基本都用utf-8



#### base64

Base64是一种二进制到文本的编码方式。如果要更具体一点的话，可以认为它是一种将 byte数组编码为字符串的方法，而且编码出的字符串只包含ASCII基础字符。

> Base64就是为了解决各系统以及传输协议中二进制不兼容的问题而生的,目前由于传输导致的二进制改变已经很少见了，各种系统对二进制的兼容性处理也越来越好
> 转成base64后体积增大了30%，因为有三个字节，变成了4个字节

js在使用的时候传的默认都是文本（比如http协议），想要传二进制就不方便，就需要将二进制文件编码传输，变成字符串

base64的核心就是让每个字节都在64位内，也就是小于64， 2^6-1, 也就一个二进制字节（8个位），前两位为0；


```
转成base64原理

1. 将原始数据每三个字节作为一组，每个字节是8个bit，所以一共是 24 个 bit
2. 将 24 个 bit 分为四组，每组 6 个 bit
3. 在每组前面加补 00，将其补全成四组8个bit
4. 到此步，原生数据的3个字节已经变成4个字节了，增大了将近30%
根据Base64码表得到扩展后每个字节的对应符号

// 编码表
let code = 'ABCDEFGHIJKRMNOPQRSTUVWSYZ';
code += code.toLocaleLowerCase();
code += '0123456789'
code += '/+'


```

使用场景： 
1. 网页中的一些小图片，可以直接以 base64 编码的方式嵌入，不用再链接请求消耗网络资源
2. 证书
...


console.log(Buffer.from('帅').toString('base64'));


#### 常用第三方包

commander  命令行工具，解析命令行参数, 配置命令提示,写前端工具会用到
mime  检测文件是什么类型，比如application/javascript
querystring 解析请求参数




## node 的内置模块

### path


path 模块核心就是来处理路径的


path.resolve(): 返回当前模块的绝对路径； 拼 ../ 回到上一级；
> 参数里如果遇到单独的/，会回到根路径(如果有/开头的路径，就不能用这个解析)
> 第一个参数是绝对路径，后面是相对的，如果都是绝对路径，以最后一个为主

```
// resolve特点： 返回绝对路径。如果要的是当前文件的绝对路径一定要添加__dirname
console.log(path.resolve(__dirname, './test.txt'));

// 不写__dirname, 只写一一个相对路径默认会将process.cwd()拼接在前面，来转换为绝对路径。
console.log(path.resolve('./test.txt')); 


```


```
node 中 esmodlue 写法

esModule(用mjs标识,嫌弃加mjs后缀麻烦的话，可以在package.json， 里生命type: "module", 表示模块是用esmodule来写的) 在node12+ 版本才支持， 一般写ts就用esModule写法了（import）

esmodlue 在node中实现了自己的模块加载器，本质是给每个每个模块增加了立即执行函数（作用域），外层this执行undefined, 
参数__dirname, __filename,也没有了

// 如果想拿到__dirname，__filename， 得用下面的方式去拿
const obj = new URL(import.meta.url);
console.log(obj, import.meta.url);

const __dirname = path.dirname(obj.pathname);
const __filename = obj.pathname;
console.log(__dirname);


```

path.join(): 路径拼接，不会产生绝对路径，除非拼接的参数里有绝对路径；拼 ../ 回到上一级；
> 参数里如果遇到单独的/,会拼接起来
> 正常情况下，resolve 和 join 能用不同的写法达到相同的目的，但是有单独的/的情况下， 要拼接，只能用join


path.dirname(): 取目录路径。

path.extname(): 获取扩展名; 如： .js

path.basename(): 除去扩展名的路径名,接受路径和扩展名两个参数，会在路径上把扩展名去除

```
console.log(path.basename('a.js','s')); // a.j
```


### events

用法

```
// events node中的发布订阅模块，实现异步处理。核心就是解耦合，在一个类中订阅事件，另一个类中发布事件，这两个类可以没有关系。
const EventEmitter = require('./events');

// class G extends EventEmitter {}
function G(){}
Object.setPrototypeOf(G.prototype, EventEmitter.prototype);  // (es6方式)

const e = new G();

// newListener监听到事件绑定，就会触发newListener 的回调
e.on('newListener', (name)=>{
  process.nextTick(()=>{
    console.log(name, 22);
  })
})

const fn = function(name){
  console.log(name, 11);
}

// 绑定后就移除
e.on('失恋',fn)
e.once('失恋',fn)
e.off('失恋',fn)
e.emit('失恋')
e.emit('失恋')


### fs   

fs 文件系统,实现i/o操作

fs上大部分方法都有同步异步两种

同步： 好处是能立刻拿到返回值，性能好， 坏处是阻塞主线程； 异步： 不阻塞主线程
一般代码已经跑起来了，不希望阻塞主线程，监听类的操作，用异步，一般node里用异步多一点；

常用方法：

```
let fs = require('fs');

目录操作：

fs.mkdir / fs.mkdirSync： 创建文件夹， 用Sync的是同步创建，反之没有是异步，想要实现无阻塞i/o操作，我们一般都是用异步操作完成要处理的事情，如果递归创建，需要给第二个参数对象配置属性： recursive: true

fs.rmdir / fs.rmSync ： 删除文件夹, 如果递归删除，需要给第二个参数对象配置属性： recursive: true

fs.readdir  / fs.readdirSync： 读取文件目录中的内容（获取一个数组）

fs.stat / fs.statSync : 返回stat 对象，对象上有isDirectory(), isFile()方法 可以判断当前是不是目录，是不是文件




文件操作：

判断文件是否存在：

fs.existsSync(path)： path为绝对路径，存在则返回 true，否则返回 false。


fs.accessSync(path[, mode]) : 要搭配try...catch使用...，同步地测试用户对 path 指定的文件或目录的权限。mode 参数是可选的整数，指定要执行的可访问性检查，如果任何可访问性检查失败，将抛出 Error。 否则，该方法将返回 undefined。

fs.access(path[, mode], callback)



fs.readFile : 读取文件中的内容

fs.writeFile ： 向文件中写入内容（覆盖写入： 写入的新内容会替换原有的内容）

fs.appendFile : 向文件中写入内容（追加写入）

fs.copyFile： 拷贝文件到新的目录下

fs.unlink  : 删除文件

```

#### 流的用法

流会将你想要从（网络）接受的资源分成一个个小的分块，然后按位处理它。

这里先只谈论文件流。

readFile 读文件，内容全部读来内存中，不适合大文件，会淹没可用内存
小的文件可以，超过64k就不建议（不过也不是死标准），建议用流的方式（node 中文件流读取的方式，默认每次读取64k）

文件流底层用的是open,read,write， 这些api 很复杂，参数多，不用记（也不好记），一般用不到，在node中已经被封装成了更好操作的文件流的方式, 比如copy（文件复制功能）, 实现原理就是不一次性读完，读几个字节，然后写几个字节，如此循环下去，直至读完。


了解文件可读流可写流原理，最终为了理解rs.pipe(ws)这一句代码。

流的初步使用： pipe

```
const fs = require('fs')
const path = require('path')
// 把比较底层的open, read, write, close 方法进行封装，然后加上fs发布订阅模式（EventsEmitter），成了比较好操作的流
let rs = fs.createReadStream(path.resolve(__dirname, './test.txt'),{
  highWaterMark: 3, // 每次读取多少个字节,如果不给这个参数默认每次读取64k 
})

let ws = fs.createWriteStream(path.resolve(__dirname, './copy.txt'),{
  highWaterMark: 1, // 写入过程占用（浪费）的内存，期望值
})

// 创建了可读流，文件就打开了
// rs.on('open', (fd)=>{
//   console.log(fd);
// })

// 监听到可读流data事件 
rs.on('data', (chunk)=>{
  console.log(chunk);
  const flag = ws.write(chunk); // 返回true，表示可写流管道空闲可以继续写；返回false表示可写流管道满了（写入过程内存占用超出期望值），最好不要继续写了
  if(!flag){
    rs.pause(); // 暂停读取,不再触发data事件了
  }
})

// 监听到可写流写完
ws.on('drain', ()=>{
  console.log('写完了');
  rs.resume(); // 恢复读取，恢复触动data事件
})

```

上面的过程还是有点麻烦，还有更简单的方式： 
pipe: 管道，将文件读取出来传递到其他地方, 开发中更多的是用这种方式。

```
// 可代替上面的监听data和drain事件

rs.pipe(ws);  // 可以实现读取一部分写入一部分(自动读取数据，写入到可写流)，内部是异步的，不会阻塞主线程，可以处理大文件

pipe 的原理其实就是把上面代码（on data 和 on drain）在可读流里封装了一下，pipe方法接收可写流参数，在可读流里监听data事件，然后用可写流写入(ws.write)，可写流写入返回false就暂停读取，监听到可写流的drain事件，就恢复读取

```

#### 可读流

可读流的使用:

```
// 文件流 ===> 文件中自己实现了一个可读流（可读流范围很大，比如： 一个成功fetch请求的响应体也是一个可读流）

const fs = require('fs');
const path = require('path');

// 底层封装了fs.open(), fs.read(), fs.close();

const rs = fs.createReadStream(path.resolve(__dirname, './test.txt'), {
  flags: 'r', // r意味着读取操作
  highWaterMark: 4, // 每次（会触发一次data事件）读取多少字节， 默认64k
  // encoding: 'utf-8', // 读取后用什么形式展现给我们。默认值是null, 默认读取出来的是buffer
  start: 0,
  end: 6,  // 会读取 0123 456;  206范围请求就是靠start和end实现，从那个字节读到那个字节，视频播放也是；
  autoClose: true, // 内部调用fs.close 方法
  emitClose: true, // 内部会发射一个close事件
})


// 对于文件流， 有两个独有的特殊的方法(事件)，其他可读流没有： open 和 close
rs.on('open', (fd)=>{
  console.log(fd);  // fd 文件描述符，打开一个文件给一个数字描述
})

rs.on('close', ()=>{
  console.log('close');express1
})


// 所有可读流，都有两个关键方法(事件)： data 和 end

// 网络传输数据， 比如1m的内容，tcp分段传输，就类似这种
const arr = [];
// 用户监听了data事件变化开始读取指定内容（内部通过newListener来监听 用户监听data事件 这个动作）, 也就是由默认的非流动模式，变成流动模式
rs.on('data', (chunk)=>{
  // 控制读取速度
  arr.push(chunk);
  console.log(chunk);
  rs.pause(); // 暂停，不要再触发data事件, 如果不停的读，会都读到内存里，其实就跟readFile没区别了，关键就在于控制读取速度
})

// 指定的内容读取完毕后会触发end事件
rs.on('end', ()=>{
  console.log('end');
  const buf = Buffer.concat(arr);
  console.log(buf, buf.toString());
})

setTimeout(()=>{
  rs.resume()
},1000)


```

可读流的原理: 不用去记，主要是掌握它的核心编程思想： 比如说延迟操作，用发布订阅的模式去处理， 包括发布订阅和事件的思想结合，
还有比如怎么去暂停恢复


```
发布订阅:

订阅一个函数到数组，发布的时候执行数组里的函数

事件思想：

绑定事件时，添加事件对对应事件数组，触发事件时执行数组里的函数; 还可以用特殊的事件就监听绑定的动作；
用户调用可读流会给它绑定一些事件，内部调用相关方法时会触发相应事件；


暂停恢复：

给一个标识flowing，每读取一段，看一下标识，为flase时不继续调用读取方法。
给一个恢复方法，恢复时，把标识改为true, 然后继续调用读取方法;


```

#### 可写流

使用： 

```
const fs = require('fs');
const path = require('path');
const ws = fs.createWriteStream(path.resolve(__dirname, './b.txt'), {
  flags: 'w', // w意味着写入操作，文件没有会新建
  highWaterMark: 2, // 建议每次写入多少字节， 默认是16k
  start: 0,
  autoClose: true, // 需要调用fs.close 方法
  emitClose: true, // 内部发射一个close事件
})


// 文件流里特定的两个方法依旧存在 fs.open  fs.close

// ws.write, 参数是字符串，或者buffer类型， 写文件的highWaterMark 是给读取来用的， 也就是说期望写入的过程占用多少个字节，每次读取多少个字节给我

let idx = 0;
function write(){
  if(idx<10){
    let r = ws.write(idx++ + ''); // 给我的(包括正在写入的和内存里准备写入的)在预期内(highWaterMark),在就返回true, 超过就返回false
    console.log(r);
    if(r){
      write();
    }
  }
}

write();

// 只有当我写入的内容超过预期（>=highWaterMark）,并且被清理干净才会触发drain事件
ws.on('drain', function(){
  console.log('drain');
  write();
})


```


可写流的原理： 了解大概过程即可。
要注意的点是：ws.write 的内容，第一次是直接放文件里写的，第二次会放入内存（如果第一次还没写完），这个内存(缓存，其实就是一个存储对象)， 有可能正在写的+放入内存的会等于或超出highWaterMark， ws.write就返回false,这种情况下内存里写完会触发drain事件（你就可以监听drain事件来继续写入），也有可能正在写的+放入内存的小于highWaterMark, ws.write就返回true， 表示还可以（建议）继续写， 这种情况下内存里写完也不会触发drain事件。 也就是返回ws.writefalse之后再清空管道内存，就会触发drain事件;
> 除了drain后的第一次，写入，后续的在内存里排队，保证写入的顺序不会乱


#### 流的分类

可读流（Readable Stream 从目标读取数据的流）： 都有on('data') 和 on('end') 事件, 有pipe() 方法
- http响应， 在客户端读取服务端的响应
- http请求， 在服务端读取客户端的请求
- 文件系统的可读流
- zlib streams 数据压缩和解压
- crypto streams 数据加密和解密
- tcp sockets tcp套接字
- child process stdout and stderr 子进程标准输出和错误输出（打印操作，类似console.log）
- process.stdin 监听进程的输入(可以监听用户输入，命令行交互底层用的就是这个)

```
process.stdin.on();

```


可写流（Writable stream 将数据写入目标的流）：都有 write() 和 end() 方法
- http 请求（在客户端将数据写入请求体）
- http 响应（在服务端响应内容写入响应）
- 文件系统的可写流
- zlib streams 数据压缩和解压
- crypto streams 数据加密和解密
- tcp sockets tcp套接字
- child procss stdin 子进程的标准输入
- process.stdout and process.stderr 进程标准输出和错误输出（打印操作,类似console.log）

```

process.stdin.on("data", data => {
    data = data.toString().toUpperCase()
    process.stdout.write(data + "\n")
})

```


双工流（Duplex stream 可以读取和写入数据的流， 读取和写入操作可以完全无关）：
- zlib streams 数据压缩和解压
- crypto streams 数据加密和解密
- tcp sockets tcp套接字


转化流（Transform stream 将读取到的数据进行转换，变成可读可写的流）： 类似双工流，不过读写有相关性（写的基本就是读到的内容），比如把数据做一个压缩，先要将数据读取，然后把数据压缩完，再写入
- zlib streams 数据压缩和解压
- crypto streams 数据加密和解密



还可以自己实现流，不过一般不会这么做，可以简单了解其代码运行方式：


#### 自己实现流

了解代码是怎么跑起来的即可，后期都是用别人写好的库

可读流

```
const {Readable, Writable, Duplex, Transform} = require('stream')

// 父类提供了一个read方法， 当on('data')的时候，会触发父类的Readable.read() 方法，
// 父类会调用（子类的实现）_read方法，我们自己实现的逻辑就可以放在_read中

class MyReadStream extends Readable {
  constructor(){
    super();
    this.idx =0;
  }

  _read(){
    // 自己决定将什么数据传递给on('data')的回调
    // 底层是封装了 fs.open  fs.read fs.close
    if(this.idx<10){
      this.push(this.idx++ + '')
    }else{
      this.push(null); // 数据为null的时候为触发end事件
    }
  }
}

const mrs = new MyReadStream();
mrs.on('data', (chunk)=>{
  console.log(chunk);
})

mrs.on('end', ()=>{
  console.log('end');
})


```

可写流


```
class MyWriteStream extends Writable {
  // 实例调用父类的write， 父类调用子类的_write
  _write(chunk, encoding, clearBuffer){
    console.log(chunk);
    clearBuffer(); // 清楚缓存（管道）中的内容，不然只有第一次能写入内容，其他都在缓存管道里
  }
}

const mws = new MyWriteStream();
mws.write('ok')
mws.write('ok')
mws.write('ok')

```

### zlib 和 crypto 的使用

zlib streams 数据压缩和解压, 既是双工流，又是转化流

```
const fs = require('fs');
const path = require('path');

const zlib = require('zlib'); // 内置模块

// 先读取内容.pipe(压缩).pipe(写入新文件)
const rs = fs.createReadStream(path.resolve(__dirname, './test.txt'));
const ws = fs.createWriteStream(path.resolve(__dirname, './copy.txt.gz'));

// zlib streams 压缩，解压，就是一个转化流
// gzip 压缩， 核心原理就是替换重复内容； 比如视频，音频是不需要做gzip的，静态文件这种重复性高的就比较适合
// zlib.createUnzip()
const gzip = zlib.createGzip();
rs.pipe(gzip).pipe(ws)

```

crypto streams 数据加密和解密, 既是双工流，又是转化流

```
// crypto用来做一些加密和摘要。 加密就可以解密，是可逆的，摘要不可逆
const crypto = require('crypto')

// 普通crypto api 写法
// md5 有一定的风险，因为相同的输入会得到相同的输出， md5特点 1） md5 不可逆 2）输入相同，输出相同  3）输入不同，输入的长度永远相同
const r = crypto.createHash('md5').update('1234567890').digest('base64');
console.log(r); 


// 流的写法
const rsp = crypto.createHash('md5');
rsp.setEncoding('base64');
rs.pipe(rsp).pipe(ws)

```

#### 文件目录操作

实现, fs.rmdirSync(path.resolve(__dirname, 'a'), {recursive: true}) 及 rmdir的recursive的递归参数


1. 用深度和广度遍历删除（同步）多级文件（菜单递归处理，权限菜单都类似）

```
// 深度
const myRmrirSync = (directory) =>{
  const arr = fs.readdirSync(directory).map(item=>path.resolve(directory, item))
  for(let i=0;i<arr.length;i++){
    const dir=arr[i];
    const stat = fs.statSync(dir);
    if(stat.isFile()){
      fs.unlinkSync(dir);
    }else{
      myRmrirSync(dir)
    }
  }
  fs.rmdirSync(directory)
}




// 广度
const myRmrirSync = (directory) =>{
  let arr = [directory];
  let index = 0;
  while(cur = arr[index++]){ // 这里的终止条件处理的很妙，cur 取到的值为空，就停止
    const children = fs.readdirSync(cur).map(item=>path.resolve(cur, item))
    arr = [...arr, ...children];
  }
  for(let i=arr.length-1; i>=0;i--){
    fs.rmdirSync(arr[i])
  }
}

myRmrirSync(path.resolve(__dirname, './a'))


```

2. 使用异步方法实现

```
// 异步并发，递归删除多级目录文件
// 这种回调来回调去，参数传来传去的方式容易把人搞晕
const myRmdir = (directory, callback) =>{
  fs.stat(directory, (err, stat)=>{
    if(err) return callback(err);
    if(stat.isFile()){
      fs.unlink(directory, callback);// 把外层的回调函数传给他就好了
    }else{
      fs.readdir(directory, (err, dirs)=>{
        if(err) return callback(err); // 如果有错误肯定返回，抛错
        // 只有最后才会调用callback， 中间的回调都是传递done， 第一层传递的是callback,如果中间没有手动执行callback,那么直只有调用原生的unlink和rmdir才会在删除成功后调用callback
        if(dirs.length===0) fs.rmdir(directory, callback); 
        const paths = dirs.map(item=>path.resolve(directory, item));
        let index = 0;
        const done = () => {
          index++;
          if(index===dirs.length){ // 子目录删完后，把自己删掉
            //易错点： 这里要传一个done么， 回调在这里意味着啥，必须传么，直接传一个done 就死循环了，考虑两层（第一二层）删完了，要最第一层的回调callback
            myRmdir(directory, callback) 
          }
        }
        paths.forEach(dir=>{
          myRmdir(dir, done)
        })
      })
    }
  });
}

```

3. 使用promise 实现

```
// promise 返回promise, 内部把成功的回调改成resolve, 失败的回调改成reject, 本身不需要回调
const myRmdirPromise = (directory) => {
  return new Promise((resolve, reject) => {
    fs.stat(directory, (err, stat) => {
      if (err) return reject(err);
      if (stat.isFile()) {
        fs.unlink(directory, resolve);
      } else {
        fs.readdir(directory, (err, dirs) => {
          if (err) return reject(err);
          const paths = dirs.map(item => myRmdirPromise(path.resolve(directory, item)));
          console.log(paths, 11);
          Promise.all(paths).then(()=>{
            fs.rmdir(directory, resolve);
          })
        })
      }
    });
  })
}

```

4. async await 方式

```
const fsp = require('fs').promises;

// async 方式， 以后主要采用async 方式或者promise方式处理回调
const myRmdirAsync = async (directory) => {
  try {
    const stat = await fsp.stat(directory);
    if (stat.isFile()) {
      await fsp.unlink(directory);
    } else {
      const dirs = await fsp.readdir(directory);
      // async 这个循环怎么写， 因为用async 包裹了所以,必须后返回promise, 所以可以await?
      const dirsp = dirs.map(dir => {
        return myRmdirAsync(path.resolve(directory, dir))
      })
      await Promise.all(dirsp)
      await fsp.rmdir(directory);
    }
  } catch (e) {
    reject(e)
  }
}


```

## node 执行外部命令

在 Node.js 中执行 Git 命令，您可以使用 Node.js 的 child_process 模块中的 exec 或 spawn 函数。这两个函数都可以用来执行外部命令，并且都有相应的异步和同步版本。

exec 函数可以让您在子进程中执行命令，并将结果缓存在缓冲区中，直到子进程完全退出后一次性返回给父进程。

另一个可供选择的选项是使用 spawn 函数，它允许您在子进程中执行命令，并将其输出作为流传输到父进程

```
const { exec } = require('child_process');

exec('git status', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});


```

Execa 是一个 Node.js 库，可以替代 Node.js 的原生 child_process 模块，用于执行外部命令

## 网络

从输入url到网页展现都发生了什么？

> 网络是非常庞大的结构，OSI七层模型（理想化模型）， 分层就是将通信的过程就行划分，分而治之。
> 下层是为了上层服务的


七层结构：


物理层   【理解：最下层，用交通工具进行传输】
> 传输的介质（双绞线，光纤...）
> 核心就是传递比特流的，如何将数据从一个点传递到另一个点
数据链路层   【理解：根据路线将内容进行中转】
> 设备之间的数据传递，将传递的数据封装成帧
网络层     【理解：加一个地址】
> 寻址，找到对方并能传输，控制速度
传输层     【理解：加一个门牌号】
> 分段， 分片，排号，数据丢失如何处理

【理解： 会话，表示，应用都是准备内容的】
会话层    
> 负责建立，管理，断开会话的
表示层
> 数据是如何表示的，可以将数据进行编码，解码
应用层
> 用户最终使用的接口

记忆方法： 物数网传会表应


最终表现可以理解为四层，真实使用中也是使用这四层：

- 网络接口层（物理层， 数据链路层）   数据包 + 增加mac地址 ===> 数据帧
- 网络层                         数据段 + ip地址  ==> 数据包
- 传输层                         原文内容 + 端口号； 拆分； ==> 数据段
- 应用层（会话层， 表示层，应用层）   原文内容


ip地址和mac地址是什么关系？

- ip 是逻辑地址（收讯地址，可变的）， mac地址是物理地址（唯一的，网卡里面就有的）
- ip地址是用来查找对应的mac地址的，最终我们是靠mac地址来通信的
- ip地址，主要使用的ipv4,大概有42亿个（四段，每一段有八个位）， ipv6目前还没有普及


各层对应的物理设备？ 

物理层：

- 中继器： 通过网线传输，最大传输距离是100米，超过就需要通过中继器连接来放大信号远距离传输。默认中继器只有两个口，可以连接双方，实现信号放大的功能。
- 集线器： 本质有多个口的中继器，可以在同一个网络（局域网）下实现多人的互联。不记录彼此的端口mac地址。缺点是广播发送数据，有的人不需要也会收到消息（没有缓存，没有记录功能）

链路层：

- 交换机： 有多个端口，将物理设备和端口关联在一起。只有第一次通过广播的方式，后续通信可以直接找到对应的人(机器)

网络层：

- 路由器： 也是多口，并且两种类型的口， wan 口（提供上网能力，给外网用的），lan口（通过网线可以实现局域连接，给内网用的）。电脑连着lan口，外部网线连着wan口。 wan口可以提供上网能力，没有wan口的路由器，可以当做交换机。路由器将本地的ip地址转换为外网的ip地址（也就是网关的功能），并且给每个连接的机器分配一个端口号，有了外网ip就能访问互联网了。

> 三层的工作模型，最终通过网卡来进行通信，通过ip找到对应mac地址才能进行通信

对于前端来说， 物理设备相对没那么重要，最重要的还是协议。

#### 协议

协议是网络中计算机或设备之间进行通信的一系列规则的集合

物理层，数据链路层的协议我们不考虑，对于我们来说，只有三层及以上的才叫协议, 这些协议统称为，tcp/ip协议簇

- 网络层： ip协议 （arp协议只能用于局域网，它的作用是根据ip地址找到mac地址，实现端到端的通信，这个协议有歧义，有人认为他是链路层，但是只有三层以上才算协议，所以只能算作网络层） 
- 传输层： tcp/udp （面试问的最多的）
- 应用层： http  DHCP(只要我们电脑连接了路由器，路由器自动分配ip)  DNS域名解析协议(域名解析协议，把域名解析成对应的ip)


dns 解析的方式？（传输层采用的是udp协议）

先看操作系统中，有没有缓存后的结果，如果有则不用解析，直接返回（ip）即可; 然后看host文件里有没有配置，有配置直接返回ip;
如果没有缓存，和host相关配置，则根据网址*递归的进行查找*，*从后向前*查找对应的ip(一级一级的找，一个点一级域名，二个点2级域名，每一个点都连带后面部分都算一级域名，需要一次查找，比如www.baidu.com，先找.com, 再.com再找.baidu, 在.baidu.com下再找www)，每次查找的结果dns 都会缓存


#### tcp、 udp


tcp 是面向连接的协议（需要提前打招呼确认，比较慢，可靠安全）， udp是面向无连接的（不需要提前打招呼，快，可能会丢包）
> http1.1， htt2 底层用的是tcp

- tcp 可以保证内容的顺序和完整性，收到数据会回复对应的消息
- udp 发出消息，不用等待回复

tcp 是一个全双工协议（双方可以同时互相发消息），还有半双工（你发完消息后，我再回复，比如http请求），单工协议（只有一方能发消息）


tcp和udp 的区别：

tcp 和udp都工作在传输层，他们的目标都是在程序之间传输数据，数据可以是文本，视频，图片，对于tcp和udp来说，都是一堆二进制数，并没有太多区别。

tcp 是基于连接的，udp是基于非连接的，举个例子，如果不考虑速度因素，tcp类似于电话(接通电话，互相通话，结束挂断，一系列流程都能得到及时反馈，并且能确认对方准确的收到)，udp类似于写信（信寄出去之后，不知道对方有没有收到，收到的内容是不是完整，先后寄两封信是否按照顺序接受）。

tcp的优缺点：
优点: 传输可靠，有序，是面向连接的， （有一些好的机制，比如滑动窗口，拥塞控制，快重传，快恢复），粘包
缺点： 需要建立连接（比较浪费性能），需要排队（有队头阻塞，前面没有处理完，后面不能走），有端口累计问题（如果有大量tcp连接）


tcp 是如何保证信息的传输的稳定可靠的，有三个关键点： 三次握手，传输确认，四次挥手

```
另一个版本的解释：

如何保证传输的可靠性？

可靠性包含这么几个方面:

建立起可靠的传输：三次握手

数据不能有丢包，解决这个问题要靠:

- 重传机制 重发丢失的数据包来保证数据整体的完整
- 流量控制 避免收发速度不匹配导致的缓冲区满造成丢包问题；流量控制的过程中涉及到 TCP 的接收和发送缓冲区的设置以及 滑动窗口 的使用
- 同样的，流量控制 和 重传机制 只能最大程度缓解 TCP 本身的丢包问题，但是网络拥堵导致的丢包问题，他们无能为力，但是为了可靠的传输过程，TCP 同样也想到了 拥塞控制 来实时感受网络的拥塞程度，进而对发送方的发送速度进行限制


数据传输过程中不能有错误，解决这个靠 检验和（checksum）

信息不能乱序：通常信息的乱序问题是由于丢包或者网络情况不好引起的，所以这篇文章中把如何保证消息的顺序也包含在上述各种技术和算法的介绍中

可靠的连接断开：四次挥手

```

#### tcp, 为什么握手是三次，断开是4次？

  核心： tcp 是双工的


  >  tcp里用了SYN（请求建立连接， connect的时候）， ACK(应答号,表示收到了，on('data')的时候), SEQ（序列号）， FIN（完成断开）， PUSH(发送消息)；


三次握手： 
  
三次握手是建立连接的过程，当客户端向服务端发起连接时。

第一次挥手： 客户端发送连接请求数据包(SYN包)，过去询问一下，能否与你建立连接
第二次： 服务端回复SYN+ACK包，表示同意连接
第三次： 客户端收到之后回复AKC包，连接就建立了

> 这个过程发送了三包数据，所以称为三次握手

为什么是三次握手而不是两次握手？

为了防止已失效的请求报文突然又传到服务器引起错误 
> 如果两次握手就建立连接（服务端回复SYN+ACK包，就建立连接），客户发送SYN包时可能因为某种原因没有到达服务器，在中途产生了滞留，为了建立链接客户端会重新发送SYN包，这次数据包正常送到，服务端回复SYN+ACK包后建立起连接，但是第一包SYN数据阻塞的网络节点突然恢复，第一次SYN包又突然到达服务器，这时客户端会误认为是客户端又发送了一次新的建立连接的请求，从而在两次握手之后，进入数据等待状态， 服务端认为是两次连接，客户端认为是一次连接，造成了状态不一致。如果在三次握手的情况下，服务端收不到最后的ACK包，自然不会认为链接建立成功，所以三次握手本质上来说就是为了解决网络信道不可靠的问题，在不可靠信道上保证可靠的连接


```
  建立链接过程：三次握手

  握手是双方ack 和 seq都为1， 表示建立了双向链接；
  - 第一次，客户端发送SYN包：seq=0
  - 服务端回复SYN+ACK包: seq=0, ack=1(对面seq+1)
  - 客户端回复ACK包: seq=1(对面的ack), ack=1(对面seq+1)  【也就是对面有ack,用对面ack作为自己的seq;对面有seq，用对面seq加一作为自己的ack】
  > 最终，客户端和服务端的seq, ack都是1；

  > 三次握手的主要目的：是确认自己和对方的发送和接收都是正常的，从而保证了双方能够进行可靠通信。
  > 

  ```


  在不可靠信道上保证可靠的连接，那么就有几个问题？【以下文字描述可以回答tcp数据传输过程】

  一包数据有可能会被被拆成多包发送，如何处理丢包问题，这些数据包到达的先后顺序不同，如何处理乱序问题

  tcp协议，为每一个连接，建立发送缓冲区，建立连接后的第一个字节序列号为0，后面每个字节的序列号会增加1。
  发送数据时，从发送缓冲区取一部分数据组成发送报文，在其tcp协议头中，会附带序列号（seq）和 长度(len)。
  接收端在收到数据后，需要回复确认报文： *确认报文中的ack = 接收序列号 + 长度 = 下一包数据的起始序列号*。
  这样一问一答的发送方式，能够使发送端确认发送的数据，已经被对方收到，发送端也可以一次性发送连续的多包数据，
  接收端只需要回复一次ACK就可以了。
  
  这样发送端可以把待发送的数据，分割成一些列的碎片，发送到对端，对端根据序列号和长度，
  在接收后，重构出完整的数据，假设其中丢失了某些数据包，在接收端可以要求发送端重传，比如丢失了100~199，这99个字节，
  接收端向发送端发送ACK=100的报文，发送端收到后，重传这一包数据，接收端进行补齐。以上过程不区分客户端和服务端，tcp连接
  是全双工的，对于两端来说均采用上述机制。



```
  数据传输过程：举例， 客户端给服务端发送消息， 要保证顺序，比如有十个字节，第一次发4个，第二次发6个

  - 客户端发送： seq=1, ack=1, len=4(第一次发送四个字节) 
  - 服务端响应： ack=5(对面的seq+对面的len, 表示收到的字节数，下次从第5个字节开始发送), seq=1(对面的ack), len=0(没有发送数据)
  - 客户端发送（响应）： seq=5(对面的ack), ack=1(对面的seq+对面的len), len=6(第二次发6个字节)
  - 服务端响应： seq=1, ack=11, len=0
  - 客户端响应：ack=1, seq=11, len=0

  > 总体来讲：ack 就是表示回复，连接后一共收到了多少个字节（对面的seq+len）， seq表示连接后一共发送了多少个字节（也就是对面的ack，正在发送的不算）；*面试要知道是通过双方的ack 和seq来维护双方发送的序号, 这样就可以描述对面发送多少数据了，从那个字节开始发的，就能保证数据的有序了*

```

四次挥手：

处于连接状态的客户端和服务端，都可以发起关闭连接请求。此时需要四次挥手来进行连接关闭。

假设客户端主动发起连接关闭请求。

第一次挥手： 客户端向服务端发起一个FIN包，表示要关闭连接，自己进入终止等待1状态（FIN-WAIT-1）
第二次： 服务端收到FIN包，发送ACK包，表示自己进入关闭等待状态（close-wait），客户端收到，进入终止等待2状态（FIN-WAIT-2），服务端此时还可以发送未发送的数据，客户端还可以接受数据, 服务端发送完数据就进入第三次挥手。
第三次： 服务端发送FIN包,进入最后确认状态
第四次： 客户端收到之后回复ACK包，进入超时等待状态（time-wait）， 经过超时时间后关闭连接，而服务端收到 ACK包后立即关闭连接

为什么客户端需要等待超时时间？

为了保证第四次挥手是，服务端能收到ACK包，假设客户端发送完最后一包ACK包就关闭连接，一旦ACK包在网络中丢失，服务端将一直停留在最后确认状态。如果客户端发送最后一包ACK包后，等待一段时间，这时服务端因为没有收到ACK包，会重发FIN包，客户端会响应这个FIN包，重发ACK包并刷新超时时间。 这个机制跟三次握手类似，也是为了保证在不可靠的网络信道中，保证可靠的连接断开确认。

```

断开操作，双方ack和seq都加一，就表示断开了，问题在于：

  - 客户端发送一个FIN标记包，说关闭连接
  - 服务端发送一个ACK的确认包，说收到
  - 服务端发送FIN标记的包， 说断开 
  - 客户端发送ACK标记的确认包，进入TIME_WAIT状态（发送ACK包，这个过程有可能丢包了：这时客户端真的断开，会导致重发异常，服务端会不停的问，我说断开，你咋不回复呢？所以在说完最后一句话的时候，需要等待，
    看有没有消息过来，如果没有就关闭本次连接；大量创建tcp,并关闭，会有端口累计问题，采用长连接来解决）

```

#### tcp的滑动窗口（win）

滑动窗口出现的原因： 

tcp要成功的发送一个分包，必须是发送方发送分包，接受方回应ACK。如果我们每发送一个分包都要等待上一个分包的ACK回来，这样效率就很低了。 tcp做了一些改进，发送方在等待ack的时候，是没有必要停止后续分包的发送的，网络传输虽然不够稳定，但是大部分分包都是可达的。如果遇到了丢包，我们就可以根据最近接受到的ACK,根据一定的策略去尝试发送这个序列号之后的丢失的包。发送方需要缓存已经发出但是没有收到ACK的分包，接受端在收到分包，但是在没有分包交给用户进程之前，也需要先存一下收到的包，但是缓存是有大小限制的，所以发送方和接受方都需要一种机制，来限制可发送或接收的数据的最大范围。

win:

传输过程中的win字段表示滑动窗口，为了控制流量的发送。滑动窗口本质上是描述接受方的TCP数据报缓冲区大小的数据，发送方根据这个数据来计算自己最多能发送多长的数据。 控制读取速率，保证顺序传输，只要窗口里当前最前面的序号收到后，窗口才会移动，否则需要等待。


#### tcp粘包处理

多个发送操作,会被合并。这是为了减少头部，默认情况下每个数据段，都要增加20个字节的头部（tcp固定的头部结构），每次发送一个字节就要浪费20个字节，可以采用粘包的方式，把多个数据合并成一个。

发送过程中的粘包操作，有两个算法，一个nagle算法（默认采用nagle算法），最多只能有一个未被确认的数据段，没被确认就等着，等待的过程后续数据就拼接在一起，最大能拼1460个字节。 但是这样，如果数据发送和接收的很快，都能很快确认，就没有时间做粘包操作了，还是还浪费性能。这时候，就有另一个算法，cork算法，将小的数据段拼接在一起发送（不超过最大值约1460个字节）


#### tcp 拥塞处理（快重传，快恢复）

中间的丢包过程，是如何处理的？

reno 版本的拥塞控制（本质就是探测最大传输带宽）: 

快重传： 在发送过程中可能会出现丢包。 此时不要立即回退到*慢开始阶段*，而是对已经收到的3次重复的报文确认，
则立即重传。 这就是快恢复算法（减少超时重传的出现），降低重置cwnd(拥塞窗口变量，在传输过程中没有拥塞就将此值增大，如果出现拥塞，也就是超时重传，就将此值减小)的频率；


#### udp

udp协议是基于非连接的，发送数据就是简单的把数据包封装一下，然后从网卡发出去就可以了，数据包直接并没有状态上的联系。
正因为udp 这种简单的处理方式，导致他的性能损耗非常小，对于cup, 内存资源的占用也远小于tcp, 但是对于网络传输的过程中产生的丢包，
udp协议并不能保证，所以udp 在传输稳定性上要弱于tcp。

tcp 传输数据稳定可靠，适用于对网络通讯质量要求较高的场景，需要准确无误的传输给对方，比如传输文件，发送邮件，浏览网页等
udp 的优点是速度快， 但是可能产生丢包，所以适用于对实时性要求较高，但是对少量丢包，并没有太高要求的场景，比如域名查询，语音通话，
视频直播等， udp 还有一个非常重要的应用场景就是隧道网络（比如我们常用的vpn, sdn用到的vxlan）。
> upd协议主要在DHCP协议（主机分配），DNS协议（dns解析），QUIC协议（也就是http3视频直播游戏）底层中使用


## http

### http 发展历程

1990年 http/0.9 为了便于服务器和客户端处理，采用了纯文本格式，只能使用get请求。在响应请求后会立即关闭连接。

1996年 http/1.0 增强了0.9版本，引入了http header 的概念，传输数据不再仅限于文本，可以解析图片、音乐等，增加了响应状态码，
和 post， head等请求方法。 (整体来说是增加了内容协商功能)

1999年 广泛使用http/1.1 版本， 这是正式标准，允许持久连接，允许响应数据分块，增加了缓存管理和控制，增加了put, delete等新的方法。 (它的问题是 多个请求并发时， http对头阻塞问题)

2015年 http/2, 使用hpack算法压缩头部，减少数据传输量，允许服务器主动向客户端推送数据，是二进制协议可发起多个请求，使用时需要对请求加密通信。

2018年 http/3, 基于udp 的quic协议

### http 1.1

- http/1.1 是可靠传输协议， 基于tcp/ip协议
- 采用应答模式，客户端主动发起请求，服务器被动回复请求
- http是无状态的，每个请求都是相互独立的
- http 的请求报文和响应报文的结构基本相同，由三部分组成

```
请求报文：

1. 请求行： 请求方式，uri（资源路径），协议
2. 请求头（告诉服务端请求的内容是什么格式的）
3. 请求主体（参数）


响应报文：
1. 响应行： 协议，状态码，状态码的原因短语
2. 响应头（告诉客户端响应的内容是什么格式的）
3. 响应主体

```

学http 主要就是学习它的报文, 学习它的各种头；

#### http/1.1 的特点

- 1. 长连接

tcp 的连接和关闭非常耗时间，所以我们可以复用tcp创建的连接。 http/1.1默认会增加Connection: keep-alive。
在一个tcp连接中发送多个http请求（通过content-length, chunked）对请求进行分割。


content-length: 是HTTP消息长度, 用十进制数字表示字节数目， 服务端/客户端通过它来得知后续要读取消息的长度
> 如果Content-Length > 实际长度, 服务端/客户端读取到消息结尾后, 会等待下一个字节, 自然会无响应直到超时.
> Content-Length < 实际长度, 如果这个长度小于实际长度, 首次请求的消息会被截取,读取消息出错（在开启Connection:keep-alive的情况下），如果Connection:close，所产生的现象就是每一次的请求都被截断, 但不会产生解析混乱

确定Content-Length的值怎么办?

Content-Length首部指示出报文中实体主体的字节大小. 但如在请求处理完成前无法获取消息长度, 我们就无法明确指定Content-Length, 此时应该使用Transfer-Encoding: chunked

```
数据以一系列分块的形式进行发送. Content-Length 首部在这种情况下不被发送. 在每一个分块的开头需要添加当前分块的长度, 以十六进制的形式表示，后面紧跟着 \r\n , 之后是分块本身, 后面也是\r\n. 终止块是一个常规的分块, 不同之处在于其长度为0.

```

总之： 
  - Content-Length如果存在且生效, 必须是正确的, 否则会发生异常.(大于实际值会超时, 小于实际值会截断并可能导致后续的数据解析混乱)
  - 如果报文中包含Transfer-Encoding: chunked首部, 那么Content-Length将被忽略.

- 2. 管线化

在同一个tcp 连接进行数据的收发，就会变成串行模式，如果某个请求过慢就会发生阻塞问题， 也就是Head-of-line blocking（队头阻塞）。 http/1.1 用管线化处理这个问题， 管线化就是在同一个tcp连接中同时发送多个http请求。

> 默认浏览器不开启管线化。一般常用的解决队头阻塞的方法是多开连接，一个域名可以开启6个tcp连接（缺点是6次慢启动，会导致带宽竞争问题）。多增加域名可以多开启更多的tcp连接（域名多了需要做dns解析的就多，浪费性能， 可以做预解析，不过还是会浪费性能）

- 3. cookie

set-cookie/cookie 用户第一次访问服务器的时候，服务器会写入身份标识，下次再请求的时候会携带cookie。 通过cookie可以实现有状态会话。


- 4. 内容协商

客户端和服务端进行协商，返回对应结果


| 客户端header |  服务端header | 
|---|---|---|
|Accept|Content-Type|我给你发送的数据是什么类型|
|Accept-encoding|Content-Encoding|我发送给你的数据是用什么格式压缩（gzip, deflate, br）|
|Accept-Language||根据客户端支持的语言返回（多语言）|
|Range|Content-Range| 范围请求数据 206|


- 5. http 缓存

强缓存： 服务器会将数据和缓存规则一并返回，缓存规则信息包含在响应头中， Cache-Control。

对比缓存（协商缓存）： if-Modified-Since/if-None-Match(最后修改时间), Last-Modified/Etag


- 6. restful 风格 （还有一种叫graphql风格）

强调使用http动词（get, post, put...）对资源进行操作

get (通过url传参，是有长度限制的，可缓存，不安全)
post(请求体传输数据，不可缓存，相对安全)
options (预检请求，跨域时复杂请求之前出现。 get, post，head 是简单请求，如果加了自定义header就是复杂请求，其他请求方式的是复杂请求。)
put
... 
> 虽然方法很多，但开发中常用就get,post， 开发中不算是完全的restful风格

- 7. 状态码

- 1xx (信息性状态码)
  - 101 切换协议， websocket
- 2xx (成功状态码)
  - 200 成功
  - 204 成功，无响应体
  - 206 断点续传
- 3xx (重定向状态码)
  - 301 永久重定向
  - 302 临时重定向
  - 304 使用客户端缓存
- 4xx (客户端错误状态码)
  - 400  (请求错误，参数错误)
  - 401 （未登录）
  - 403 （无权限）
  - 404  (找不到资源)
  - 405 （请求方法错误）
- 500 （服务器端错误状态码）
  - 500 服务端内部出错
  - 502 服务端宕机
  - 503 并发过大超载


### http 基础使用

```
const http = require('http');
const  url = require('url')


// 通过浏览器请求，都是get请求；如果想发post请求，可以通过ajax, 或第三方工具比如：postman， appiza, 还可以通过curl 在命令行发送请求
const server = http.createServer((req,res)=>{
  // req 代表的是客户端，是一个可读流，读取用户传输的内容，也就意味着他有一个方法on('data')
  // res 代表的是服务端，是一个可写流，给客户端写入数据， 也意味着他有两个方法 write()  end()


  // req 里的一些方法需要背下来（与请求报文相关的，请求行，请求头，请求体）: method, url极其解析, headers, on('data'), on('end')
  console.log(req.method.toLocaleLowerCase()); // req.method 获取的请求方法默认是大写的,一般为了方便处理要转成小写
  console.log(req.url);  // 请求路径，只包含pathname/query, 也就是资源路径和查询参数; 我们拿到的是字符串，需要通过url解析
  // 完整的url:  url协议://用户名:密码@ip地址/:端口号/资源路径?查询参数#hash
  const {pathname, query} = url.parse(req.url, true); // url.parse 第二个参数给true, 会将字符串值，变成对象展现;
  console.log(pathname, query);  // 我们需要掌握的就是pathname,query
  console.log(req.httpVersion);

  console.log(req.headers); // 所有的headers key都是小写的（默认浏览器发的是大驼峰的形式，node做了处理）

  // 客户端发送的数据，流的形式； 底层 this.push(读取到的数据)  this.push(null)
  const arr=[]
  req.on('data', (chunk)=>{
    // 有数据（请求体）才触发(post请求才有请求体数据，get没有)
    console.log(chunk);
    arr.push(chunk)
  })
  req.on('end', ()=>{
    // 不管有没有，最后都触发
    console.log('end', Buffer.concat(arr).toString());
  })


  // 响应  res； 响应就是给浏览器写入消息；
  // statusCode 和 statusMessage 一般不自己写，默认会加
  res.statusCode= 800;
  res.statusMessage = 'okkk'  // 状态码描述；
  res.setHeader('token', '123') // 所有的http协议中不能有中文(header 中不能有中文)，中文设计到编码问题


  res.write('ok');
  res.write('no');
  res.end('111'); // 不调用end浏览器会认为服务端一直在写东西没结束呢
  // 对于浏览器直接访问接口会把内容显示在页面上，如果用接口访问就会返回到接口的响应体中

  // 我们原则上应该根据不同的路径返回不同的内容，这叫路由
})

// 根据端口占用情况累加，一般写服务端的时候不需要这样，写一些工具的时候需要
let port = 3000;
server.listen(port, ()=>{
  console.log('server is start on' + port);
}); // 下面那个就不用加回调了，重新listen 成功了，也会调用这个回调


server.on('error', (err)=>{
  if(err && err.code === 'EADDRINUSE'){
    server.listen(++port)
  }
})


// 服务端代码修改后需要重启才能生效
// 本地开发可以安装 nodemon 监听文件变化，自动重启(启动的时候得用nodemon 启动， nodemon 文件名)； 线上一般用pm2;

```


#### http 的头

// 各种头主要做内容协商用，我给你什么内容，你怎么处理这些内容
// 

如何进行处理跨域：

```
Access-Control-Allow-Origin
Access-Control-Allow-Headers
Access-Control-Allow-Methods
Access-Control-Max-Age


// cors 跨域资源共享，服务端配置的
if(req.headers.origin){
      // 这里最好不写*，因为当cookie允许跨域的时候，*是不支持的
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
      res.setHeader('Access-Control-Allow-Headers', 'a')
      res.setHeader('Access-Control-Allow-Methods', 'PUT,DELETE')
      res.setHeader('Access-Control-Max-Age', 20) // 20秒内只发一次options
      if(req.method === "OPTIONS"){
        res.end();
        return true;
      }
    }

```

如何处理参数，及返回的内容类型和编码,根据请求header来解析发来的数据: content-type, 请求头和响应头都有这个

```


content-type，请求的时候


// get 参数
const {pathname, query} = url.parse(req.url, true)


// post 参数 有两种形式
 if(req.headers['content-type']='application/x-www-form-urlencoded'){
          // key=value&a=1
          resolve(querystring.parse(payload, '&', '='));
        }else if(req.headers['content-type']='application/json'){
          resolve(JSON.parse(payload));
        }


content-type，响应的时候

// 内容协商，文件类型和编码； 浏览器不知道你的内容是什么编码，默认是中文是jbk， 你要告诉他你用的是utf-8,否则中文会乱码
// 文件类型后加编码; 文件类型和编码都要给
res.setHeader('Content-Type', mime.getType(filePath) || "text/plain"+";charset=utf-8") 


```


如何处理缓存：

```
Cache-Control
Expires

Last-Modified ===> if-modified-since
Etag ===> if-none-match

第一个资源(从浏览器里直接输入地址访问的资源)不能被强制缓存，默认访问的资源，请求头会自动添加Cache-Control: max-age=0;，防止断网了还能访问


强缓存： 

// expires 一个绝对的过期时间，你无法保证客户端时间和服务端的一致， 这种方式不推荐, 旧版本使用，有时为了兼容，expires和cache-control两个都用
res.setHeader('Expires', new Date((Date.now() + 10*1000)).toGMTString())

res.setHeader('Cache-Control', 'max-age=10')

协商缓存：

// 服务端给客户端一个last-modified， 下次客户端访问的时候(浏览器默认)会带一个if-modified-since
// 如果1s内修改了文件, Last-Modified这种也监控不到，修改时间只能精确到秒;
  res.setHeader('Last-Modified', statObj.ctime.toGMTString())

// 直接比较内容性能差，采用折中的方案， 用 last-modified + size, 用文件大小代替文件内容，在加上文件修改时间，基本上就可以确定是否可以走缓存
// 如果文件修改时间肯定也改了，大概率文件内容也是改了，就算偶尔多请求几次也没关系； 如果1s内修改了文件，大概率长度会变化（这是跟用last-modified的区别）；
// 相对于用last-modified和用内容做摘要，这里etag综合内容和时间两者做一个优化；相当于在last-modified的基础上加了size;
// 不过为了兼容， etag, last-modified 往往会同时用
const etag = statObj.ctime.getTime() + '-' + statObj.size;
res.setHeader('Etag', etag);
if(req.headers['if-none-match'] === etag){
  res.statusCode=304;
  res.end();
  return true;
}


 // 比如以上代码, 10s内是强缓存阶段，无需访问服务器，直接使用缓存
// 10s后开始协商缓存， 会使用if-none-match 的值和 服务器etag做对比,
// 变了返回新的，不变返回304, 并且告诉客户端10s内无需访问服务器

// 优先级默认如下
//  cache-control > expires
// etag > last-modified
// 具体的，可以在代码里控制

```

如何进行压缩处理:

```

请求头：accept-encoding
响应头： Content-Encoding


 // 内容协商， 如何进行压缩处理
  compress = (req, res) => {
    const encoding = req.headers['accept-encoding'];
    if(encoding.includes('gzip')){
      // 压缩后要告诉前端，是用什么方式压缩的，不然前端会乱码； 如果重复内容不多，压缩完还可能会变大，html,js,css适合用gzip
      // 一般gzip， 放在前端做就行了，因为后端去做的话还要每次读取文件然后压缩，然后放到结果里，会增加服务器开销（一般静态文件也不会放在后端服务器，一般放在静态资源服务器），
      // 前端gzip, webpack里有gzip插件（compression-webpack-plugin）配置一下，直接压缩好放到服务器上，然后在nginx里开启gzip, （后端要加一个相应的响应头Content-Encoding， nginx成功开启gzip压缩后就默认配置了这个响应头）；
      res.setHeader('Content-Encoding', 'gzip'); 
      return zlib.createGzip()
    }else if(encoding.includes('deflate')){
      res.setHeader('Content-Encoding', 'deflate');
      return zlib.createDeflate()
    }else if(encoding.includes('br')){
      res.setHeader('Content-Encoding', 'br');
      return zlib.createBrotliCompress()
    }
  }


```

Accept-Language: zh-CN,zh;q=0.9,en;q=0.8  根据浏览器提供的语言类型，返回对应内容，适合早期后端来实现前端业务
现在一般不咋用这个做多语言，一般用路径区分就好了，如 www.baidu.com/zh  www.baidu.com/en


accept-ranges: bytes 范围请求，206 , 实现的话： createReadStream(filePath, {start, end}).pipe(res); 



## url

```
url.parse(url, [,flag]):把一个url地址进行解析，把地址中的每一部分按照对象键值对的方式存储起来

第二个参数默认是false，设置为true可以把问号传参的部分（query）也解析成对象键值对方法

结果：

Url {
  protocol: 'https:', 协议
  slashes: true,    是否有斜线
  auth: null,      作者
  host: 'cn.vuejs.org',  域名+端口
  port: null,   端口
  hostname: 'cn.vuejs.org',  域名
  hash: '#vm-listeners',   哈希值
  search: null,   问号传参
  query: null,     问号传参，不包含问号
  pathname: '/v2/api/',   请求资源的路径和名称和名称
  path: '/v2/api/',
  href: 'https://cn.vuejs.org/v2/api/#vm-listeners' }


```

## koa

1. 对res, req, 进行了一些封装代理
2. 中间件机制（需要知道他的洋葱模型，运行原理）

```


// 中间件机制内部会将多个中间件组合成一个大的promise, 这个promise只要成功了，整个就结束了，就会开始相应到浏览器上
// 在koa中间件中所有next前面， 需要加上await 或者 return, 这样才有等待效果, 否则如果后续next里异步国际,可能无法处理到后续的异步逻辑，我们不知道后面有没有异步逻辑，所以next前面都增加await 或者 return

// 把公共逻辑提取出来，封装成插件（其实就是中间件），用中间件来处理公共逻辑

```

### koa 核心原理



1. 用Object.create，做两次隔离

```
1. 每个请求之间是相互独立的，http是无状态的 （每个请求基于应用的context 再创建context）
2. 每个应用之间上下文也不应该相同（每个应用的context是隔离的）

也就是说每次请求来，通过__proto__找的是当前应用的context,每个应用通过__proto__找的是最终的context;


const context = require('./context');
const request = require('./request');
const response = require('./response');


constructor() {
    super();
    this.context = Object.create(context)
    this.request = Object.create(request)
    this.response = Object.create(response)
}

...

const ctx = Object.create(this.context)
const request = Object.create(this.request)
const response = Object.create(this.response)


```

2. 对res, req, 进行一些封装代理：

```
封装： ctx是koa封装的一个对象，里面包含了原生node中的req,和res；koa内部，基于原生的req,和res再次封装了两个对象 request 和 response;不建议使用原生的，建议使用封装好的方法


ctx.request = request;
ctx.response = response;
ctx.req = ctx.request.req = req;
ctx.res = ctx.response.res = res;


代理：

从context上获取一些属性，代理到从request上获取；从context上获取一些属性，代理到从response上获取；

在context上设置一些属性，代理到在reponse上设置；

所以实际项目中可以用简化写法，从context 上取值；

function delegatgeGet(target, key){
  // 类似 Object.defineProperties 中 的get方法, 做一个代理
  context.__defineGetter__(key, function(){
    return this[target][key]
  })
}

function delegatgeSet(target, key){
  // 类似 Object.defineProperties 中 的set方法, 做一个代理
  context.__defineSetter__(key, function(val){
    this[target][key] = val
  })
}

```


3. 中间件机制

> 内部会将多个中间件组合成一个大的promise, 这个promise只要成功了，整个就结束了，就会开始响应到浏览器上
> 在koa中所有next前面， 需要加上await return, 这样才有等待效果; 否则可能无法处理到后续的异步逻辑，我们不知道后面有没有异步逻辑，所以next前面都增加await

```
本质是一个组合函数，把一系列函数按照一定的顺序执行，执行顺序是洋葱模型；

常见的组合函数，一个是redux里的组合函数，一个是koa这里的，都是固定写法；express 的中间件原理核心也是这个，只不过，最后没有包装成promise;

// 核心就是dispatch 里的三句，是compose 的固定写法需要记下来
compose = (ctx, layers, next) => {  
    const dispatch = (i) => {
      // 终止条件, 这里是一部分终止，如果是整个流程终止，可以用Promise.resolve()
      if(i===layers.length) return next(); 

      const fn = layers[i].cb;  // 取出当前函数

      // 执行函数，并传入下一个函数，把执行结果包装promise
      return Promise.resolve(fn(ctx, ()=>dispatch(i+1)))  
    }
    dispatch(0)
}


// 完整版，处理重复调用next 和错误
compose = (ctx, midddlewares) => {
    let idx = -1;

    function dispatch(i){
      // 防止函数内部多次调用next()
      if(idx === i) return Promise.reject(new Error('next() called multiple times'))

      if(i===midddlewares.length) return Promise.resolve();

      idx = i;

      let fn = midddlewares[i]; // 一个个取出变成promise,将dispatch 传递给下一个
      try{
        return Promise.resolve(fn(ctx, ()=>dispatch(i+1)))
      }catch(e){ // 防止第一个fn执行的时候报错，后续的fn，被包在promise里了，所以后续的错误可以在promise最后捕获到
        return Promise.reject(e)
      }
      
    }

    return dispatch(0);
  }
```

4. 插件（中间件提出来写）, 可以传参

```
比如写一个解析post 参数的插件

const bodyParser = async (ctx, next) => {
  ctx.request.body = await new Promise((resolve, reject)=>{
    const arr= [];
    ctx.req.on('data', (chunk)=>{
      arr.push(chunk)
    });
    ctx.req.on('end', ()=>{
      resolve(Buffer.concat(arr))
    })
  })
  return next();
}

module.exports = bodyParser;


使用：

app.use(bodyParser)

```

## cookie,session 和  token

### cookie

HTTP 是无状态的协议（对于事务处理没有记忆能力，每次客户端和服务端会话完成时，服务端不会保存任何会话信息
> 所以服务器与浏览器为了进行会话跟踪（知道是谁在访问我），就必须主动的去维护一个状态


cookie 存储在客户端： cookie 是服务器发送到用户浏览器并保存在本地的一小块数据，它会在浏览器下次向同一服务器再发起请求时被携带。

cookie 是不可跨域的： 每个 cookie 都会绑定单一的域名，无法在别的域名下获取使用，一级域名和二级域名之间是允许共享使用的（靠的是 domain）。


理解： 总而言之，cookie是存储在浏览器的一段明文信息,用于记录会话状态，客户端和服务端都可以设置，每次请求会被带上，不可以跨域（除非同一个一级后二级域名）

cookie 重要的属性:

name=value : 键值对，设置 Cookie 的名称及相对应的值，都必须是字符串类型

domain: 指定 cookie 所属域名，默认是当前域名

maxAge: cookie 失效的时间，单位秒。如果为整数，则该 cookie 在 maxAge 秒后失效。如果为负数，该 cookie 为临时 cookie ，关闭浏览器即失效，浏览器也不会以任何形式保存该 cookie 。如果为 0，表示删除该 cookie 。默认为 -1。

expires: 过期时间(绝对时间)，在设置的某个时间点后该 cookie 就会失效。一般不用；

secure： 该 cookie 是否仅被使用安全协议传输。安全协议有 HTTPS，SSL等，在网络上传输数据之前先将数据加密。默认为false。
当 secure 值为 true 时，cookie 在 HTTP 中是无效，在 HTTPS 中才有效。

httpOnly： 如果给某个 cookie 设置了 httpOnly 属性，则无法通过 JS 脚本 读取到该 cookie 的信息，但还是能通过 Application 中手动修改 cookie，所以只是在一定程度上可以防止 XSS 攻击，不是绝对的安全


### session

session 是另一种记录服务器和客户端会话状态的机制

session 是基于 cookie 实现的，session 存储在服务器端，sessionId 会被存储到客户端的cookie 中

session 认证流程：

1、用户向服务器发送用户名和密码。

2、服务器验证通过后，在当前对话（session, 一个对象）里面保存相关数据，比如用户角色、登录时间等等，session主要存的关键信息就是一个过期时间。

3、服务器向用户返回一个 session_id，写入用户的 Cookie。

4、用户随后的每一次请求，都会通过 Cookie，将 session_id 传回服务器。

5、服务器收到 session_id，找到前期保存的数据，由此得知用户的身份。




缺点： 扩展性（scaling）不好，单机当然没有问题，如果是服务器集群，或者是跨域的服务导向架构，就要求 session 数据共享，每台服务器都能够读取 session。

举例来说，A 网站和 B 网站是同一家公司的关联服务。现在要求，用户只要在其中一个网站登录，再访问另一个网站就会自动登录，请问怎么实现？

这样就不能把session 写成内存中的一个对象，一种解决方案是 session 数据持久化，写入数据库或别的持久层。各种服务收到请求后，都向持久层请求数据。这种方案的优点是架构清晰，缺点是工程量比较大。另外，持久层万一挂了，就会单点失败。

另一种方案是服务器索性不保存 session 数据了，所有数据都保存在客户端，每次请求都发回服务器。JWT 就是这种方案的一个代表。


Cookie 和 Session 的区别：

安全性： Session 比 Cookie 安全，Session 是存储在服务器端的，Cookie 是存储在客户端的。
存取值的类型不同：Cookie 只支持存字符串数据，想要设置其他类型的数据，需要将其转换成字符串，Session 可以存任意数据类型。
存储大小不同： 单个 Cookie 保存的数据不能超过 4K，Session 可存储数据远高于 Cookie，但是当访问量过多，会占用过多的服务器资源。

### jwt

原理：

JWT 的原理是，服务器认证以后，生成一个 JSON 对象，发回给用户，就像下面这样。

```
{
  "姓名": "张三",
  "角色": "管理员",
  "到期时间": "2018年7月1日0点0分"
}

```

以后，用户与服务端通信的时候，都要发回这个 JSON 对象。服务器完全只靠这个对象认定用户身份。为了防止用户篡改数据，服务器在生成这个对象的时候，会加上签名。

服务器就不保存任何 session 数据了，也就是说，服务器变成无状态了，从而比较容易实现扩展。


数据结构：

JWT 的三个部分依次为： Header（头部）， Payload（负载）， Signature（签名）， 中间以 . 分隔


Header 部分是一个 JSON 对象,默认如下：alg表示签名的算法， typ属性表示这个令牌类型

```
{
  "alg": "HS256",
  "typ": "JWT"
}

```

Payload 部分也是一个 JSON 对象，用来存放实际需要传递的数据。

> JWT 默认是不加密的，任何人都可以读到，只是用 Base64URL 算法转成字符串，所以不要把秘密信息放在这个部分。


Signature 部分是对前两部分的签名，防止数据篡改。需要指定一个密钥（secret）。这个密钥只有服务器才知道，不能泄露给用户。

使用 Header 里面指定的签名算法（默认是 HMAC SHA256），按照下面的公式产生签名。

```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret)

```


> 前面提到，Header 和 Payload 串型化的算法是 Base64URL。这个算法跟 Base64 算法基本类似，但有一些小的不同。
> JWT 作为一个令牌（token），有些场合可能会放到 URL（比如 api.example.com/?token=xxx）。Base64 有三个字符+、/和=，在 URL 里面有特殊含义，所以要被替换掉：=被省略、+替换成-，/替换成_ 。这就是 Base64URL 算法。


使用方式：

客户端收到服务器返回的 JWT，客户端每次与服务器通信，都要带上这个 JWT。你可以把它放在 Cookie 里面自动发送，但是这样不能跨域，所以更好的做法是放在 HTTP 请求的头信息Authorization字段里面。

```
Authorization: Bearer <token>
```
另一种做法是，跨域的时候，JWT 就放在 POST 请求的数据体里面。


jwt 最大的好处就是无状态，服务端不需要存储登录状态


特点：

1. JWT 默认是不加密，但也是可以加密的。生成原始 Token 以后，可以用密钥再加密一次。
2. JWT 不加密的情况下，不能将秘密数据写入 JWT。
3. JWT 本身包含了认证信息，一旦泄露，任何人都可以获得该令牌的所有权限。为了减少盗用，JWT 的有效期应该设置得比较短。对于一些比较重要的权限，使用时应该再次对用户进行认证。



```
// 手写jwt
const jwt = {
  sign(content, secret){
    return crypto.createHmac('sha256', secret).update(content).digest('base64url')
  },
  base64(content){
    return Buffer.from(content).toString('base64url')
  },
  encode(payload, secret){
    const A = this.base64(JSON.stringify({typ:'JWT', alg: 'HS256'}));
    const B = this.base64(JSON.stringify(payload));
    const C = this.sign(A+'.'+B, secret);
    return A + '.' + B + '.' + C
  },
  decode(token, secret){
    const [header, content, signed] = token.split('.');
    if(this.sign(header + '.' + content, secret ) === signed){
      // 解密的时候只需要返回content 内容, 这部分是之前转为base64的，基本也不需要解密，转一下就好了
      return Buffer.from(content, 'base64url').toString()
    }else{
      throw Error('出错了')
    }
  }
}

```

## express

代码不用急，只是记住思路，思想；解决什么问题，如何解决的；


最简版express: 其实就是收到请求，遍历查找路由，执行对应函数

```
const http = require('http')
const url = require('url')

// 最简版express

// 前端路由 1）hash 2) history api
// 默认强制刷新访问的或者接口访问的都是后端路由， 如果是react, 刷新会先走到后端路由，后端返回后，前端再根据前端路由跳转
function createApplication (){
  const routes = [
    {
      path: "*",
      callback: function(req, res){
        res.end(`Cannot ${req.method} ${req.url}`)
      }
    }
  ];

  // 写成这种对象的模式是最简单的方式，但是不好扩展
  return {
    get(path, callback){
      routes.push({
        path,
        callback,
        method: 'get'
      })
    },
    listen(...args){
      http.createServer(function(req, res){
        const method = req.method.toLocaleLowerCase();
        const {pathname, query} = url.parse(req.url, true);
        for(let i=0;i<routes.length;i++){
          const layer = routes[i];
          if(layer.method === method && layer.path === pathname){
            return layer.callback(req, res);
          }
        }
        routes[0].callback(req, res);

      }).listen(...args);
    }

  }
}

// 所有逻辑堆在入口文件也不太好
// 现将应用的逻辑拿出去

module.exports = createApplication;

```

### express 路由与中间件

express 中内置了路由系统，中间件系统和模版引擎系统；

路由和中间件系统有点耦合，其实机制是一样的；

想要的公共逻辑；或者工具方法属性，都可以做的中间件里扩展，后面就可以直接用了；
所有的中间件被抽离出去都写成插件的形式，可以传参；

```
function static(dirname){
  return function(req,res, next){
    const url = path.join(dirname, req.path)
    fs.readFile(url, function(err, data){
      if(err) return next();
      res.end(data);
    })
  }
}


app.use(static(__dirname))

```


基本架构：

![Alt text](img/express1.png)


中间件基本原理：

```
// 核心逻辑

Router.prototype.handle = function(req, res, out){
  const method = req.method.toLocaleLowerCase();
  const {pathname, query} = url.parse(req.url, true);

  // 异步串行执行, 这是精髓所在，那时候没有promise
  let idx = 0;
  const next = (err) => {
    if(idx=== this.stack.length) return out(); // 结束，跳出路由系统

    const layer = this.stack[idx++]; // 依次取对应的层 （外层）
    if(layer.match(pathname)){ // 如果路径匹配到这一层
      // 没有route 就是中间件, 并且不能是错误中间件; 有route就是路由
      if(!layer.route && layer.handler.length !== 4) {
        req.url = req.url.slice(removed.length)
        layer.handle_request(req, res, next);
      }else{
        if(layer.route.methods[method]){ // 当前路由层的route上有此方法才进入
          layer.handle_request(req, res, next);  // 传入next,方便内层结束后调用，让外层继续走
        }else{
          next();
        }
      }
    }else{
      next(); // 路径不匹配说明此层不匹配，直接找下一层（外层）
    }
  }
  next();
}

上面的layer.handle_request 最终执行的是下面的方法， 形成一个两层的串行执行的线性结构：


Route.prototype.dispatch = function(req, res, out){
  let idx = 0;
  const next = (err) => {
    if(err) return out(); // 如果传递了错误信息，跳出内层
    if(idx === this.stack.length) return out(); 
    
    const layer = this.stack[idx++];
    if(layer.method === req.method.toLowerCase()){
      // 方法匹配到了
      layer.handler(req, res, next)
    }else{
      next()
    }
  }
  next();
}


```


多层路由：

有removed 记录当前路径要删除的

遇到中间件， 要将req.url里中间件给出的前缀删除掉，这样进入下一层路由才能匹配上； 单独的/不用删；

removed 有值说明进入的时候删除过， 那么出来的时候，需要添加回来（出来，也就是调用当前层下一个next）


理解： 

中间件，路由，多层路由，本质是一个类似compose的函数，将需要组合的函数一个个的执行，用一个数组stack将要执行的函数存好；compose函数本身负责开始执行, 也就是取第一个函数出来执行 dispath(0)， 以及结束执行，如果要的下一个索引为stack.length, 就结束执行，调用出入的结束函数。中间的过程，就是在用户使用中间件或者路由的时候，在回调函数里写完自己的逻辑，然后调用next，就继续执行下一个中间件或者路由回调函数。

中间件是一层，路由可能是多层的， 他们使用的是同一套机制。如果是多层，就将多层compose机制组合在一起。到了结束的时候，调用的结束函数可能是真的结束，跳出这个连续执行机制，也有可能是上一层的next,调用它就跳到上一层， 继续在上一层进行函数的连续执行。


本质上这个机制，可以是类似发布订阅的，订阅了事件，然后连续执行对应函数，这不过，这里的函数里可能会有异步，所以直接粗暴的forEach连续执行是不行的，所以有了next机制,这个next机制，其实本质也是一个'forEach', 解决了异步代码串联执行的问题；


整体的机制：

```
// 下面是冒号传参统一处理逻辑； 中间件或者说路由系统的核心原理就是类似这样的；这不过这里处理冒号传参，又重写了一遍类似的机制；


proto.handle_params = function(layer, req, res, done){
  // 当请求到来后，我们先处理params, 处理后调用真实的路由处理逻辑done 函数
  // req.params 冒号传参
  // router.params = {id:[], name:[]}  冒号传参对应的订阅
  // layer.keys [id, name], 冒号传参对应的key
  // layer 路由层

  const keys = layer.keys.map(key=>key.name);
  if(!keys.length){
    return done()
  }

  // 通过keys 去调用订阅好的回调
  let idx = 0;
  let fns;
  let key; // 当前处理的key
  // 第一层扫描key
  const next = () => {
    if(idx === keys.length) return done();
    key = keys[idx++];
    fns = this.params[key];
    if(fns && fns.length> 0){
      process_callback()  //处理第一个key对应的回调
    }else{
      next();
    }
  }
  
  // 第二层扫描每个key,对应的fns
  let idx2= 0;
  const process_callback = () => {
    let fn = fns[idx2++];
    if(!fn){
      idx2 = 0; // 当一个key处理完毕后，将idx2 归零
      next();
    }else{
      fn(req, res, process_callback, req.params[key], key);
    }
  }
  next();
}

```

### express , koa , koa2

#### 核心描述

用法区别：

Express 是基于回调的， 也是node种最常见的Error-First 模式（第一个参数是error对象）， koa
使用号称异步终极解决方案的async + await ,基于promise, 使用try, catch 来捕获错误。 koa 改新增了
一个context对象， 基于原生的http.createServer 的回调函数接收的req, res做了封装， express没有这个封装，使用的就是原生的req, res;


中间件区别：

express 的中间件是线性模型（一个接一个的执行）， koa的中间件事洋葱模型


```

koa2 的中间件: 

1. 基于promise 实现，基于async await 来处理中间件， 中间件的执行顺序是"洋葱模型"， Koa 的洋葱模型指的是以 next() 函数为分割点，先由外到内执行 Request 的逻辑，再由内到外执行 Response 的逻辑
2. 中间件之间通过next函数联系，当一个中间件调用next()后， 会将控制权交给下一个中间件, 直到下一个中间件不再执行next()后， 会原路返回， 将控制权交给前一个中间件。


express 的中间件：

1. 一个接一个顺序执行， response响应写在最后一个中间件里
2. 特点:
  1) 遇到app请求根据path 和 method 判断触发那些中间件（或者说根据path决定第一层中间件，根据mehod决定路由中间件）
  2） 实现next机制， 即上一个中间件会通过next触发下一个中间件


不过实际上，express 的中间件也可以形成“洋葱圈”模型，在 next 调用后写的代码同样会执行到，不过express中一般不会这么做，因为 express的response一般在最后一个中间件，那么其它中间件 next() 后的代码已经影响不到最终响应结果了;


```


集成度：

Express 捆绑了多个中间件，比如Router 和 static（视图） 的中间件等，体积较大

koa 不捆绑中间件，需要自行安装Router（koa-router） 和 static 中间件等，体积较小

社区活跃度：

目前来讲用express 的多一些



目前来讲用express 的多一些，。Koa 只是 Express 的一个更轻量级的版本，没有内置提供路由和模板引擎等功能。

koa 和 express 不是标准的mvc框架，每个人写出来代码风格都有所不同，导致代码无法统一；

koa 和 express 都可以用于开发后端服务，但是没有规范。

所以，基于koa，又封装了eggjs。 基于express 又封装了 nestjs, 写法有点类似angler, 文档是英文的。两者都是约定式的框架， 可以按照人家的规范来实现；

express 和 koa最大的区别在于， express的中间件是基于回调的, 模型为线型，而koa的中间件基于 Promise,模型为洋葱模型。express 中间件, 异步的，可以在异步逻辑完成之后再调用next， koa处理这种逻辑的话，就得等（await）了， 不等就直接跳过了；



## node项目

如何监控node服务：

1. 用一些攻击 heapdump/cpu profile,   heapdump 来分析内存, cpu profile 用来分析函数的执行耗时，不过需要手动
2. 生产环境可以用， alinode



部署：

pm2


node log:

log4js 可以指定几种类型，比如http, 查询数据库， redis

日志可以存到磁盘上，线上可以传到阿里云的系统中（或者别的什么云）


还可以用winston


## 对于中间件的理解：

- 1. 函数式编程思想：*中间件本质上就是一系列可以组合的函数*，用于对 HTTP 请求和响应进行处理。在 Node.js 中，中间件通常采用函数式编程的思想，将一个请求处理流程分解成多个函数，*每个函数都负责一个特定的任务*。这些函数可以组合起来，形成一个完整的请求处理流程，以实现对 HTTP 请求和响应的各种处理。

- 2. 路由处理： 中间件的主要作用是对 HTTP 请求进行预处理或后处理，因此需要实现路由匹配和请求转发的功能。

- 3. 错误处理：中间件需要能够处理各种可能出现的错误情况，如请求超时、路由不存在等等。因此，*中间件通常要实现错误处理机制*，以便在出现错误时能够及时地进行处理和响应。

- 4. 异步处理：在 Node.js 中，*中间件通常是异步执行的*，因为处理 HTTP 请求和响应通常需要访问数据库、发送网络请求等耗时的操作。因此，中间件需要能够支持异步处理，以便能够在长时间的处理过程中不会阻塞 Node.js 的事件循环。

- 5. 链式调用：*中间件通常可以链式调用*，这意味着多个中间件可以组合起来，形成一个请求处理流程。在链式调用中，每个中间件都能够对请求和响应进行一定的处理，并将处理后的请求和响应传递给下一个中间件。这样，多个中间件就可以协同完成一个复杂的请求处理任务。


中间件原理简化：

```
// 核心原型就是dispatch 里的三句，是compose 的固定写法需要记下来（可根据具体场景随机应变）
compose = (layers) => {  
    const dispatch = (i) => {
      // 1. 终止条件
      if(i===layers.length) return; 

      // 2. 取出当前函数
      const fn = layers[i].cb;  

      // 3. 执行函数，并传入 下一个函数 作为参数
      return fn(()=>dispatch(i+1)) 
    }
    dispatch(0)
}


```


## 随学随复习

6.6 到tcp

