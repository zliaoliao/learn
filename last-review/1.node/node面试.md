
## node 架构

### 1. 概念与优缺点

Node.js是一个基于*JavaScript运行时的开发平台*，用于构建高性能、可扩展的网络应用程序。它的特点之一是*采用了非阻塞I/O模型，使其非常适合处理事件驱动、高并发的应用。*

优点： 

- 性能高：Node.js使用V8 JavaScript引擎，它*编译并执行JavaScript*，其性能非常高。
- 非阻塞I/O: Node.js*采用非阻塞I/O模型来处理并发*,能力很强，是高并发、I/O密集型应用的优秀解决方案
- 对前端友好： 前后端语言统一  

缺点： 
- 不适合CPU密集型任务: 如果有大量的计算，会导致CPU占用过高，影响Node.js接收新的请求，所以不适合CPU密集型应用
- 异常处理: Node.js使用的是单线程异步事件驱动架构，一旦没有捕获到异常，将会引起整个系统的崩溃。

### 核心架构

- 1. V8引擎：Node.js的基础，负责解析和执行JavaScript代码。
- 2. Libuv库: 是一个跨平台的异步I/O库，提供了包括事件循环, 异步I/O操作, 管理定时器等功能。Node.js通过使用libuv实现了异步的非阻塞I/O模型。
- 3. JavaScript内建模块:  fs, path, events(events 模块提供了 EventEmitter 类), (stream, crypto, http 和 https, os, 这些可说可不说)

## node 的运行机制

1. JavaScript 代码被 V8 引擎解析。
2. 在代码执行过程中，遇到 Node.js API （例如文件I/O，网络操作等）时，会触发底层的 libuv 库。
3. libuv 库负责管理一个事件循环和一个线程池，用于处理异步任务。
4. 它将不同的任务分配给不同的线程，形成一个Event Loop（事件循环），当一个 I/O 操作完成后（或者定时器时间到了之后），它的回调函数会被放入各自事件队列。
5. 事件循环不断从队列中取出事件，并处理其回调函数。
6. 回调函数执行的结果，会经过 V8 引擎处理，然后最终返回给用户。

这整个过程是非阻塞的。这全程中，*JavaScript 代码（包括用户代码和 Node.js 的回调函数等）是在单一主线程上运行，而 I/O 操作等耗时任务的处理则交给 libuv 的工作线程*，这使得 Node.js 能在单一线程上处理大量并发请求。


线程池: 线程池是一种并发执行任务的方式，它事先创建好一堆线程（线程的数量可以设定），然后在有新的任务到来时，直接从线程池中取一个线程来执行任务，当任务执行完毕后，线程不会被销毁，而是返回池中，以供后续复用。
>线程池：Node.js 本身在主线程上执行 JavaScript 代码，这个主线程是单线程的。然而，在 Node.js 的底层中，处理 I/O 操作、DNS 查询等阻塞任务的却是libuv, 它有一个线程池。

>这个线程池默认有 4 个线程（可以通过环境变量 UV_THREADPOOL_SIZE 调整，最大为128），这些线程会在后台运行，负责执行那些需要花费一定时间完成的任务，比如文件 I/O 操作、网络请求、计算密集型任务等。这些任务如果在主线程中处理，会导致主线程阻塞，无法执行其他代码，这是我们不希望看到的。

>一旦这些任务在后台线程中异步执行完毕，它们的回调函数就会被加入到事件队列，将结果返回给主线程。这是一个典型的生产者消费者模型。工作线程产生结果，然后提交到队列，主线程则从队列中消费这些结果。
>这样的设计带给 Node.js 极大的优势，使得它对 I/O 密集型任务有出色的处理能力。虽然 JavaScript 是单线程的，但是因为其非阻塞的特性以及 libuv 的线程池，Node.js 能够有效地并发处理大量网络请求，并保持高性能。



## 事件循环

事件循环(Event Loop)：Node.js的事件循环是其*非阻塞I/O模型的核心*。它允许Node.js同时处理多个事件，使得应用程序能够高效地响应事件驱动的需求。共有六个阶段，前端主要关注下面三个阶段：
  - 1. 定时器阶段： Node.js检查所有已经设置的定时器，看是否有定时器到期
  - 2. 轮询阶段: Node.js会*检查I/O操作队列*是否为空, Node.js将*依次执行队列中的回调函数*（完成的 I/O 操作的回调函数，将被推入到事件队列中，等待事件循环来执行；当异步 I/O 操作（包括定时器）在 libuv 的线程池中完成后，他们的回调函数就会被添加到事件队列中。）如果check（检查）阶段没有任务，则会停留在这一阶段，等待新的任务;
    - I/O操作包括： 网络请求、文件读写、数据库查询
  - 3. 检查阶段: Node.js会执行setImmediate的回调函数, setImmediate有以下应用场景
    - 处理异步回调优先级： 你希望某些回调函数在其他I/O事件处理之后，但在下一个事件循环迭代之前执行
    - 在事件循环迭代之间执行任务： 有些任务可能需要等到当前事件循环迭代完成后执行，以避免阻塞I/O事件处理。

微任务:
- process.nextTick, Promise： 每个阶段的宏任务结束后，微任务队列会在执行下一个宏任务之前完全清空
- *微任务的回调是立即进入队列的*,如果在微任务执行过程中，又添加了新的微任务到微任务队列，那么这些新的微任务也会在当前的事件循环中被执行，直到所有的微任务都执行完毕。只有当微任务队列清空之后，事件循环才会进入下个阶段。
- *process.nextTick比promise 先执行*，process.nextTick 是一个特殊的情况，虽然它是微任务，但它的优先级更高，它和常规微任务不同，有自己单独的微任务队列nextTickQueue， 先清空nextTickQueue， 然后清空microtask queue，Node.js 在每次执行完一个阶段的任务后，都会优先处理所有的 process.nextTick 的任务。
- process.nextTick适用场景：
  - 需要在当前操作完成后立即执行的场景（避免阻塞 I/O）。process.nextTick 在当前执行栈的事件完成后就马上执行，它插队在 Promise 和其他异步操作之前。 



浏览器和node的事件循环的区别：
- 浏览器上每个宏任务执行完都会清空微任务
- 在node中是每个事件循环阶段结束后才会清空一次微任务

  

1. **事件触发器(Event Emitters)**：Node.js使*用事件触发器来触发和监听事件*。这是*构建事件驱动应用程序的基础*。事件触发器是Node.js中实现事件驱动编程的机制。
  - 1. 事件和监听器： 事件触发器允许对象发出事件，并允许其他对象注册监听器来响应这些事件。
  - 2. 核心模块： *Node.js的核心模块events提供了事件触发器的实现*
  - 3. 自定义事件： 开发者可以创建*自定义事件触发器，通常通过继承EventEmitter类来实现*。
  - 4. 异步事件处理： 事件监听器通常是异步的，这意味着它们不会阻塞主线程。当事件发生时，所有注册的监听器都会被调用。

2. **模块系统**：Node.js具有*内置的模块系统，允许开发者轻松地组织和管理代码*。它还支持npm（Node Package Manager）来管理第三方模块。
  - 1. *CommonJS规范*
  - 2. 模块加载， require函数
  - 3. 模块导出， 通过module.exports或exports对象
  - 4. 循环依赖解决
  - 5. 模块缓存， *Node.js在内部维护一个模块缓存，以避免多次加载相同的模块*

3. **核心库和API**：Node.js提供了一系列的核心库和API，用于处理文件系统、网络通信、HTTP请求、流处理等任务。

**第三步：谈论Node.js的工作原理**
解释Node.js的工作原理有助于理解其架构。你可以提到以下几点：

1. **单线程**：Node.js运行在单线程中，但通过事件循环实现异步操作，因此能够高效地处理并发请求。

2. **非阻塞I/O**：Node.js使用非阻塞I/O操作，这意味着它不会等待I/O操作完成，而是将回调函数注册到事件循环中，继续执行其他任务。

3. **事件驱动**：Node.js应用程序通过事件驱动的方式工作。当某个事件发生时，Node.js会触发相应的回调函数。

**第四步：讨论适用场景**
提到Node.js适用于开发高性能、实时、事件驱动的应用程序，例如网络服务器、聊天应用、实时通信应用、IoT设备控制、数据流处理等等。

**第五步：安全性和性能**
强调Node.js的架构在安全性和性能方面的优点和挑战。可以谈论如何通过一些最佳实践来确保Node.js应用程序的安全性和性能优化。

**第六步：总结**
最后，总结一下Node.js的架构，强调其核心组件和工作原理，以及在哪些应用场景下它是一个合适的选择。同时，可以提到Node.js社区的活跃性和第三方库的丰富性，这些都是Node.js的优势之一。

这个回答可以帮助你清晰地解释Node.js的架构，展示你对Node.js的理解和知识水平，同时回答了面试官的问题。


## v8 引擎

### 怎么查看v8引擎的内存使用情况

process.memoryUsage()

### v8 垃圾回收机制

- 新生代和老生代（等大）： V8 引擎的垃圾回收基于分代垃圾回收机制，把内存分为新生代和老生代两个区域。
  - 新生代中存储的对象都是生存时间短的对象，而老生代中则是生存时间久的对象
- 新生代的垃圾回收实施策略：诱捕算法
    - 对象区与空闲区：新生代空间有两个区域，一个区域是对象区，即新对象创建时的存放区域，另一个区域则为空闲区
    - 当对象区满时，垃圾回收器会检查这个区域，清理掉那些已经死亡的对象（也就是不再被任何其他对象引用），存活下来的对象则进行一次复制到空闲区，之后把对象区和空闲区进行角色对换
    - 如果有一些对象经过多次复制依然存活，就会被晋升到老生代中。
- 老生代的垃圾回收策略：标记清除算法 和  标记整理算法
  - 标记清除： 首先是运行 标记清除算法，遍历所有对象，标记活的对象，清除未被标记的对象
  - 标记整理：垃圾回收器会标记所有活着的对象， 在标记完成后，整理阶段开始，此时会移动活动对象，使它们在地址上保持连续，减少内存碎片。
  - 老生代垃圾回收的触发时间： 没有一个固定的周期，主要根据内存使用情况动态进行。为了避免过于频繁的垃圾回收导致的性能问题


## 错误处理


- 常规捕获错误： 
   - 同步代码：try...catch
   - 异步代码: promise.catch
- 未捕获的异常或者错误：
  - 监听 process 上的 'uncaughtException' 
    - 当 JavaScript 抛出错误并且该错误没有被一个 try { } catch(e) { } 语句捕获时，uncaughtException 事件就会被触发。
  - 监听 process 上的'unhandledRejection' 
    - 当一个 Promise 被拒绝并且在该 Promise 上没有附加任何错误处理函数时（也就是它被拒绝，但没有调用 .catch()），unhandledRejection 事件就会被触发。

## 进程与线程

进程： 进程是*操作系统进行资源分配和调度的一个基本单位*，每个进程都有自己独立的内存空间和系统资源。
- 拥有自己独立的内存空间和执行环境
- 每个进程都是独立的，并且进程之间不互相影响。如果一个进程崩溃，其它进程不会受到影响。
- 进程之间的通信需要以通信的方式（IPC）进行，比较麻烦

线程：线程是进程中的一个执行单元，也是程序执行的最小单元。
- 一个进程通常至少包含一个线程，即共享进程的内存空间和系统资源
- 对于多线程来说，任何一个线程的错误都可能导致整个进程的崩溃。
- 不同线程之间可以直接通信，更容易共享数据

利用多核处理器的优势，现代操作系统通常采用*多进程加多线程*的方式来提高系统的并发性和吞吐率。进程用来进行任务隔离，线程用来进行并发执行。


## cluster 




如何利用node 的多核
- Node.js 是单线程的，它主要依赖其事件驱动和非阻塞 I/O 特性来实现并发控制
- 高计算密集型任务中，如图像处理、文件加密等，Node.js 的单线程特性会成为瓶颈, 会阻塞线程
- 利用现代服务器的多核 CPU，我们可以使用 Node.js 的 cluster 模块来创建多个进程，充分利用 CPU 多核性能


应用场景：
- cluster 模块可以提高性能，但它也会给你的代码引入更多的复杂性。只有当你的应用真正受到 CPU 的限制时，你才应该考虑采用 cluster
- 1. 用在后台服务器上，处理大量的并发请求的Web服务比较需要这个。创建多个进程，避免请求阻塞。比如一个路由内计算量大，别的路由请求来了可以分配给其他进程。


使用方法:
- 手动管理
  - cluster.isMaster, 判断当前进程是否是主进程，在主进程中创建子进程， 否则的话（子进程中），就执行自己原本的代码逻辑
  - cluster.fork()， 创建一个子进程
  - OS.cpus().length 计算cpu核数
- 第三方管理：
  - 以上手动管理方式可以用第三方包pm2代替: `pm2 start test.js -i 0`; -i 0 表示根据cpu核数启动对应数量的进程



手写上述部分关键原理: 

### require实现简写 

关键点： 

1. *node 中一般路径都用绝对路径*；因为相对路径，相对的是工作目录（执行node指令的位置）
2. fs 模块中， readFile, *readFileSync， 默认读取文件是buffer，加第二个参加编码，才是字符串*
3. new Function(), Function 的最后一个参数才是函数体，之前的参数都是函数的形参（字符串）： ('arg1', 'arg2', ..., functionBody)
4. new Funcion 并不会从上级作用域继承任何东西，它运行在全局作用域中；所以运行函数时，需要拼接字符串将 exports, module.exports 等传入
5. *提前定义好module, 最后返回module.exports 就行*，并不需要res；因为在node中，我们导出的（存储的）是module.exports(引入的也是module.exports), 而不是模块运行的结果，可能我们导出的就是一个函数
6. 由于node模块是运行在独立的作用域中,为提供一个相对隔离的环境（沙箱环境：避免全局变量污染，提高代码安全性，不影响其他代码），*使用的是vm.runInThisContext*, 而不是new Function 实现； 如果要给沙箱环境传入变量需要用vm.createContext()；
7. 在我们自己写require 里是没有__dirname, __filename 等模块默认传入的参数的，不过这不是重点，而且处理起来比较麻烦，一般直接用path.resolve 处理就好,然后注意启动项目的时候再当前目录就好了；

步骤：
1. 解析绝对路径
2. 读取缓存，如果有就返回缓存结果
3. 更新缓存
4. 加载模块，返回module.exports

```
const path = require('path');
const fs = require('fs');
const vm = require('vm');


const cache = {};
const req = (filePath) => {
  // 解析路径
  const id = path.resolve(filePath);
  const __filename = path.basename(id);
  const __dirname = path.dirname(id);
  
  // 读取缓存
  if(cache[id]){
    return cache[id].exports;
  }

  // 更新缓存
  const module = {
    id,
    exports: {}
  };
  cache[id] = module;

  // 加载模块
  const content = fs.readFileSync(id, 'utf8');
  const fnStr = `(module, exports, require, __dirname, __filename) => {${content}}`;
  const fn = vm.runInThisContext(fnStr);
  fn(module, module.exports, req, __dirname, __filename);
  return module.exports;
}

console.log(req('./test/index.js'));



```

### 手写events:事件触发器

1. on 绑定就是push到事件数组;
2. off移除就是把绑定函数从事件数组里过滤掉
3. emit发射就是把事件数组里的绑定函数依次执行，同时要带上参数
4. on, once 绑定操作不需要传参，不可能绑定函数的时候就把参数固定了;*emit， wrapper 触发事件时才需要传参*,这样才能保证传参的灵活性;
5. once 绑定的是内部自定义的wrapper, 在*wrapper 直接执行once传入的监听函数就行了*, 执行完后off移除wrapper;
6. *once 绑定后，怎么手动移除，是个难点*； 无法直接移除，因为绑定的是内部自定义的wrapper,不是传入的fn， ,所以要想办法利用传入的fn作为标识移除掉wrapper;

```
class EventEmitter {

  store = {}

  on = (name, fn) =>{
    this.store[name] = this.store[name] || [];
    this.store[name].push(fn);
  }

  off = (name, fn) => {
    if(!this.store[name]) return;
    this.store[name] = this.store[name].filter(listener=>{
      return listener != fn && listener.fn != fn;
    })
  }

  emit = (name, ...params) => {
    if(!this.store[name]) return;
    this.store[name].forEach(listener=>{
      listener(...params)
    })
  }

  once = (name, fn) => {
    const wrapper = (...params) => {
      fn(...params);
      this.off(name, wrapper)
    }
    wrapper.fn = fn;

    this.on(name, wrapper)
  }
}

```

## http
## 登录

### 如何处理登录

### 密码传输与存储

密码传输：我们可以用「https + 非对称加密算法（如RSA）」 传输用户密码
- 需要有一个接口获取非对称加密算法的公钥
- 调用登录接口时，再用加密算法加密，比如JavaScript库jsencrypt，就是基于rsa的封装


密码存储：
- 使用BCrypt + 盐，加密用户密码，然后存储
  - 可以用「哈希摘要算法加密密码」，再保存到数据库，哈希摘要不可逆
  - 为了防止黑客想暴力破解，使用BCrypt + 盐存储用户密码, BCrypt 生而为保存密码设计的算法，相比 MD5 要慢很多
    - 采取更「慢一点」的算法，让黑客破解密码付出更大的代价，甚至迫使他们放弃
- *在得到前端登录请求时，用同样的算法加密用户密码，两次结果一致则登录成功， 密码正确则颁发令牌*

在感知到暴力破解危害的时候，「开启短信验证、图形验证码、账号暂时锁定」等防御机制来抵御暴力破解。


#### 登录状态维持： JWT

JWT
- JWT 的三个部分依次为： Header（头部）， Payload（负载）， Signature（签名）， 中间以 . 分隔
  - *头部主要存储签名的算法*
  - *负载部分用来存放实际需要传递的数据， 一般是用户信息（姓名，角色）和 过期时间*
    - 负载部分默认是不加密的，任何人都可以读到，只是用 Base64URL 算法转成字符串，所以不要把敏感信息放在这个部分
  - *Signature 部分是对前两部分的签名，防止数据篡改。*
    - 需要指定一个密钥（secret）。这个密钥只有服务器才知道，不能泄露给用户。
- jwt 最大的好处就是无状态，服务端不需要存储登录状态


使用方式：
- 客户端收到服务器返回的 JWT，客户端每次与服务器通信，都要带上这个 JWT。你可以把它放在 Cookie 里面自动发送，但是这样不能跨域，所以更好的做法是*放在 HTTP 请求的头信息Authorization字段*里面。
  - 放在请求头中，主要是便于前端控制： 前端可以更容易地控制JWT信息的传输方式和处理。前端可以明确添加JWT到请求头中，而对Cookie的操作可能需要后端的干预。


特点：
- JWT 本身包含了认证信息，*一旦泄露，任何人都可以获得该令牌的所有权限*。为了减少盗用，JWT 的有效期应该设置得比较短。对于一些比较重要的权限，使用时应该再次对用户进行认证。


验证登录状态的时候，可以用:
- koa 用koa-jwt第三方包，可以用路由中间件方式使用：
  - 
  ```
  const Router = require('@koa/router')
  const jwt = require('koa-jwt')
  ...
  Router.post('xxx/path', jwt({ secret: config.secretKey }), xxController)
  ```
  - 令牌通常在 HTTP 标头 （ Authorization ） 中提供，但也可以通过将 opts.cookie 选项设置为包含令牌的 cookie 的名称来在 cookie 中提供
- egg也有egg-jwt, 思路一样， 在路由中间件里用


遗留疑问： 有了jwt还需要cookie吗？cookie存什么？openai的回答：
- jwt: 一种用于在客户端和服务器之间传递信息的令牌（token）标准
  - 适合存储身份验证和授权信息,比如用户id, 角色
  - 由于JWT是基于令牌的，它通常用于无状态身份验证，因此服务器无需在每个请求中维护会话状态。
  - JWT通常用于前后端分离应用程序或移动应用程序，因为它们可以在客户端存储，无需依赖服务器端存储。 
- cookie:
  - 适合存储服务器端会话状态信息, 例如用户会话标识符(sessionId)。
  - 有些应用程序可能依赖传统的会话管理方式，其中服务器需要存储会话数据，而客户端仅存储会话标识符。
  - Cookie还可以用于存储一些与用户界面相关的信息，例如*用户首选项、主题选择*等，这些信息可以在多个页面之间共享。
- 是否需要同时使用JWT和Cookie:
  - 通常情况下，*您可以选择使用JWT来处理身份验证和授权，同时使用Cookie来处理会话状态*。
    - 例如： 用户在登录后可以通过JWT进行身份验证和访问控制，而会话状态（例如购物车内容）可以存储在Cookie中，以确保用户在会话期间保持持久性状态

## 日志处理

日志怎么记录？

- 日志记录，Express，koa 都没有内置日志记录功能。但你可以使用第三方库，如 winston,koa-logger(koa专用) 等来进行日志记录。
  
错误怎么捕获？

- 错误的捕获主要通过错误处理中间件实现
  
日志怎么存储，要上传到哪里？

- 文件存储： 最简单的做法是将日志记录到服务器的文件系统中。这种做法适用于本地开发或者单台服务器运行的情况
- 数据库存储：如果你希望能更方便地查询日志，或者日志数据需要长期保留，可以考虑将日志存储到数据库。（可以是SQL数据库（如MySQL，PostgreSQL）或NoSQL数据库（如MongoDB，Elasticsearch））
- 标准输出流： 在某些情况下，应用将日志写入到标准输出（stdout）和标准错误流（stderr）。容器化应用就常常使用这种方式，容器运行时（如Docker，Kubernetes）会捕获这些输出并将其转发到一个集中的地方。


日志上传时机：
- 实时上传：对于错误日志或重要事件，你可能希望立即将日志上传到服务器以便快速做出反应。
- 定期上传：对于不太重要的日志，或者数量大而频繁的日志，你可能希望定期上传，例如每5分钟或每小时上传一次。你可以设置一个定时任务来执行这个操作。
- 根据日志大小决定时机：如果日志文件达到一定大小，就执行上传，这样可以避免日志文件过大占用过多磁盘空间。
- 应用生命周期的特定点上传：在某些应用程序的生命周期中特定的点上传日志，例如在应用启动或关闭时。


### 错误处理中间件：

koa: 

在Koa应用程序中，*编写一个专门的错误处理中间件来捕获并处理错误。这个中间件应该在所有其他中间件之前加载，以确保它可以捕获到发生的错误*。示例代码如下：

```
app.use(async (ctx, next) => {
  try {
    await next(); // 继续执行后续中间件
  } catch (error) {
    // 处理错误
    logger.error(error); // 记录错误到日志
    ctx.status = error.status || 500;
    ctx.body = {
      message: error.message || 'Internal Server Error'
    };
  }
});

```
这个中间件捕获所有路由处理函数中抛出的错误，并将它们记录到日志中，同时返回适当的错误响应。


express:

错误处理中间件是在Express的中间件栈中最后进行定义的,当一个中间件或路由处理函数中出现错误时，他们会调用next(err)来传递错误对象。这时，Express会跳过后面的所有普通中间件，直接找到参数最多（四个）的错误处理中间件来进行错误处理。

```
app.get('/', function (req, res, next) {
  fs.readFile('/file-does-not-exist', function (err, data) {
    if (err) {
      next(err) // Pass errors to Express.
    } else {
      res.send(data)
    }
  })
})

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

```

- 3. 在路由处理函数中使用错误处理：

在您的路由处理函数中(业务中)，可以使用throw语句来抛出自定义错误，这样做可以触发上一步中的错误处理中间件来捕获和处理错误, 例如：

```
router.get('/api/something', async (ctx) => {
  if (someConditionIsNotMet) {
    const error = new Error('Some condition is not met');
    error.status = 400; // 设置HTTP状态码
    throw error;
  }

  // 正常处理请求
  ctx.body = 'Success';
});
```

如果您需要捕获更细粒度的业务逻辑错误并将其记录下来: 

- 1. 定义一些自定义错误类型，以便更好地区分不同类型的业务逻辑错误
  - 例如，在您的应用程序中创建一个名为BusinessError的类，该类可以接受自定义消息和错误代码
  ```

  class BusinessError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'BusinessError';
        this.code = code || 'UNKNOWN_ERROR';
        this.status = 400; // 默认HTTP状态码
    }
  }

  ```
- 2. 当业务逻辑出现错误时，您可以抛出自定义错误，同时提供自定义消息和错误代码
  ```
  router.get('/api/something', async (ctx) => {
    if (someConditionIsNotMet) {
      throw new BusinessError('Some condition is not met', 'CONDITION_NOT_MET');
    }

    // 正常处理请求
    ctx.body = 'Success';
  });

  ```
- 3. 修改错误处理中间件
  - 需要修改错误处理中间件以处理这些自定义错误,在中间件中，检查捕获到的错误类型，然后根据错误类型执行不同的操作，例如记录到日志或返回适当的HTTP响应

  ```
  app.use(async (ctx, next) => {
  try {
    await next(); // 继续执行后续中间件
  } catch (error) {
    if (error instanceof BusinessError) {
      // 处理业务逻辑错误
      logger.error(`BusinessError: ${error.code} - ${error.message}`);
      ctx.status = error.status || 400;
      ctx.body = {
        error: error.code,
        message: error.message
      };
    } else {
      // 处理其他错误类型
      logger.error(error);
      ctx.status = error.status || 500;
      ctx.body = {
        message: error.message || 'Internal Server Error'
      };
    }
  }
  });


  ```
  

- 4. 记录日志：

在您的路由处理函数中，您可以使用logger来记录自定义日志消息，以便监视应用程序的行为。示例：

```
router.get('/api/something', async (ctx) => {
  logger.info('Received a request for /api/something');
  
  // 正常处理请求
  ctx.body = 'Success';
});

```
这样，您可以跟踪应用程序的运行情况并记录有用的信息。


日志搜索：
- 对于本地文件日志，您可以使用命令行工具如grep（Linux/macOS）或findstr（Windows）来搜索日志文件， 'grep "关键词" /path/to/logfile.log'
- 如果日志存储在云端，您可以使用云服务提供的控制台界面来搜索和过滤日志
- 专用日志分析工具： 对于大规模或复杂的日志数据，可以考虑使用专门的日志分析工具，如Elasticsearch、Logstash、Kibana（ELK Stack）、Splunk等

- 5. 高级错误处理和监控：

根据项目的需求，您还可以考虑将*错误信息发送到监控工具（如Sentry、New Relic等）以及实施更复杂的错误处理策略*，例如回退机制或警报系统，以便实时响应问题。




## koa 和 express

### 执行流程

正常来讲koa和express 接收请求，经过中间件处理，然后返回，整个执行流程是相同的。不过有一点不同，
由于koa是洋葱模型，express 是线性模型， 当express 在某个中间件响应了请求，那么整个请求响应流程就会在这里结束不会继续往下执行执行程序了。而当koa中间的某个中间件响应了请求，流程依然依然会向下走，直到把整个程序走完。

>Express 的线性模型指的是从第一个中间件开始，处理并向下传递到下一个直到完成，如果你在一个中间件中发送了响应，那么后面的中间件将不会被执行。而 Koa 的洋葱模型则是通过嵌套的方式在中间件间传递控制权，允许你在进入和退出每层中间件时执行代码，而且你在一个中间件中响应请求后，之前的中间件仍然可以执行（就像你从一个洋葱的中心层层剥开然后再层层封上那样）。

这就是说，如果你需要在发送响应后执行一些代码，例如一些错误处理、日志记录、资源清理，Koa 会更加方便，因为它保证了即使在中间件/路由中响应请求之后，之前的中间件仍然有机会执行。

- 在 Express 中，你必须非常小心地确保这些都在发送响应之前完成。
- 但在 Koa 中，你只需要确保这些都在 await next() 之后做就行了。

## 区别

Koa 和 Express 的设计风格非常类似，*底层也都是共用的同一套 HTTP 基础库*,但是有几个显著的区别:

- 1. 默认异步解决方案不同
  - koa基于async await
  - Expres基于回调，有两个明显问题 
    - 回调地狱
    - 异步函数中可能同步调用 callback 返回数据，带来不一致性


- 2. Koa 的中间件和 Express 不同
  - Koa 选择了洋葱圈模型
    - *所有的请求经过一个中间件的时候都会执行两次*,请求的时候经过一次，响应的时候经过一次,对比 Express 形式的中间件，*Koa 的模型可以非常方便的实现后置处理逻辑*

- 3. Koa 增加了一个 Context 的对象
  - Koa和 Express 只有 Request 和 Response 两个对象不同，这两个对象都提供了大量的便捷方法辅助开发
    - express用的是http模块原生的request 和 response
      - 原生request请求上有： method, url, headers, on('data'), on('end')， 等常用属性方法, 主要请求方法，请求路径，请求头， 以及可读流固有的事件
      - 原生response响应上有：response.body， response.status， 等属性可以设定，主要来设置，响应体，和状态码
    - koa 的 Request 和 Response对res, req, 进行了一些封装代理
  - Koa 增加了一个 Context 的对象，作为这次请求的上下文对象,我们可以将一次请求相关的上下文都挂载到这个对象上,类似 traceId 这种需要贯穿整个请求（在后续任何一个地方进行其他调用都需要用到）的属性就可以挂载上去。
  - 同时 Context 上也挂载了 Request 和 Response 两个对象, 并做了个代理， 可以直接在context上获取，request，response上才有的属性, 可以直接在context上设置，response上才能设置的属性


 - 4. 异常处理
   - koa通过同步方式编写异步代码带来的另外一个非常大的好处就是异常处理非常自然,*使用 try catch 就可以将按照规范编写的代码中的所有错误都捕获到*,这样我们可以很便捷的编写一个自定义的错误处理中间件。

   ```
    async function onerror(ctx, next) {
      try {
        await next();
      } catch (err) {
        ctx.app.emit('error', err);
        ctx.body = 'server error';
        ctx.status = err.status || 500;
      }
    }

    只需要将这个中间件放在其他中间件之前，就可以捕获它们所有的同步或者异步代码中抛出的异常了。


   ```


 egg 个功能书写位置：
 -   

## koa中间件原理手写

koa中间件原理,本质是一个组合函数，把一系列函数按照一定的顺序执行，执行顺序是洋葱模型:

- 内部会将多个中间件组合成一个大的promise, 这个promise只要成功了，整个就结束了，就会开始响应到浏览器上
- 在koa中所有next前面， 需要加上await return, 这样才有等待效果; 
  - 否则可能无法处理到后续的异步逻辑，我们不知道后面有没有异步逻辑，所以next前面都增加await
  - 加return就是请求会经过这个中间件，加await 响应时可以走await后的逻辑

express 的中间件原理核心也是这个，只不过，最后没有包装成promise，核心如下：

```
// 核心就是dispatch 里的三句，是compose 的固定写法需要记下来
// midddlewares表示所有中间件
compose = (ctx, midddlewares) => {  
    const dispatch = (i) => {
      // 终止条件，返回promise
      if(i===midddlewares.length) return Promise.resolve(); 

      const fn = midddlewares[i].cb;  // 取出当前函数

      // 执行函数，并传入下一个函数，把执行结果包装promise
      return Promise.resolve(fn(ctx, ()=>dispatch(i+1)))  
    }
    dispatch(0)
}
```


## node项目, 实践向

一个成熟的后端项目一般有分层设计： 
- 路由层（routes）
- controller层（处理参数，调用service层，返回数据）
- service层调用model数据模型，进行数据库增删改查
- model层，数据模型

此分层设计是按照Model-View-Controller（mvc来的）， 数据模型， 视图（前端部分）， 控制器（链接视图和数据）


### 本地开发

在开发 Node.js 应用时，如果你直接使用 node 命令启动应用，那么当你的代码有更改时，Node.js 不会自动重新加载你的代码。

nodemon 是一个非常流行的工具，它可以监听你的代码更改，并自动重启你的应用。 可以用nodemon 启动项目;



### 数据库连接

数据库（mysql, mongodb）

操作数据库： 可视化工具，与命令行； （连接数据库前，先要启动数据库）

mongodb启动：
> 命令启动： mongod --fork --dbpath data --logpath log/mongo.log --logappend

连接数据库： 在代码里用orm框架连接(node系， mysql 用 sqllize ,mongodb 用 mongoose)


### 登录jwt

第一次登录： 后端给token， 前端存token
后续： 前端每次请求带上token， 后端校验token是否过期，如果在有效期内，则刷新过期时间， 否则返回401

前端存token: axios响应拦截器里拿到，存到localStorage里
前端统一带token方法： 创建axios实例时从localStorage里取，或者用axios请求拦截器（,每次从localStorage里取
后端统一拦截方法： 中间件, 1. 如果token 有效，更新token， next()放行  2. 如果token 过期， 返回401 3. login 接口直接放行，因为没登录则没有token，无需校验



node使用 jsonwebtoken 第三方包, 比原始的jwt模块好用；


### 文件传输

express 中 上传输文件：

前端: 数据格式multipart/form-data, 需要把普通数据包装成这种格式

```

const params = new FormData();
      for(let i in userForm){
        params.append(i, userForm[i])
        console.log(params);
      }

      ...

headers:{ // 因为是带文件的所以加上这个
          'Content-Type': 'multipart/form-data'
        }

```

后端： 接受不能用默认的，req.body 接收，收不到文件，需要用到第三方中间件multer， 然后用req.file 去接收