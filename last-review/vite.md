

## vite

Vite 是一个现代的前端构建工具，具有快速启动、热模块替换（HMR）和高效的构建性能。


它主要由两部分组成：
- 一个开发服务器： 它基于 原生 ES 模块 提供了 丰富的内建功能，如速度快到惊人的 模块热更新（HMR）
- 一套构建指令： 它使用 Rollup 打包你的代码，并且它是预配置的，可输出用于生产环境的高度优化过的静态资源

## 核心功能

- 1. NPM 依赖解析和预构建：  
  - CommonJS 和 UMD 兼容性: 预构建 可以提高页面加载速度，并将 CommonJS / UMD 转换为 ESM 格式
  - 性能: 重写导入为合法的 URL，例如 /node_modules/.vite/deps/my-dep.js?v=f3sf2ebd , 通过将 lodash-es 预构建成单个模块，我们只需要一个HTTP请求。
  - 依赖是强缓存的
- 2. 模块热替换
- 3. TypeScript： Vite 天然支持引入 .ts 文件。
- 4. JSX： .jsx 和 .tsx 文件同样开箱即用。JSX 的转译同样是通过 esbuild。Vue 用户应使用官方提供的 @vitejs/plugin-vue-jsx 插件
- 5. CSS： 导入 .css 文件将会把内容插入到 <style> 标签中，同时也带有 HMR 支持。
- 6. 态资源处理： 导入一个静态资源会返回解析后的 URL


## 构建工具是什么

- 构建工具是用于自动化处理前端项目中的各种任务的软件，任务包括：
  - 模块化开发: 
    - 前端开发通常采用模块化的方式，将代码分成多个模块或文件。构建工具可以将这些模块打包成一个或多个文件，方便浏览器加载和执行。
  - 转译和编译: 
    - 前端开发中常用的语言如 TypeScript、JSX（React）、Sass 等需要转译成浏览器可执行的 JavaScript 和 CSS。构建工具可以自动完成这些转译和编译任务。
  - 代码优化: 
    - 构建工具可以通过压缩和代码拆分等技术，优化代码的体积和性能，减少加载时间，提高用户体验。
  - 热模块替换（HMR）: 
    - 在开发过程中，构建工具可以提供热模块替换（HMR）功能，使得代码修改后无需刷新整个页面，立即更新模块，提高开发效率。


## vite 和 webpack 对比

- vite
  - 优势：
    - 1. 速度更快：启动和热模块替换（HMR）快
      - 原生 ES 模块：Vite 利用浏览器对原生 ES 模块的支持，实现了快速启动。它直接在浏览器中加载 ES 模块，而不是像 Webpack 那样需要先打包整个应用
      - 即时 HMR：Vite 的 HMR 基于原生 ES 模块，能够实现更快速的模块热替换，几乎是即时的。开发者可以立即看到代码修改的效果，而无需等待整个应用重新打包。
      - ps: Webpack 在开发模式下需要对整个项目进行打包, 然后才能看见项目， Webpack 的热模块替换（HMR）机制需要重新打包受影响的模块并更新浏览器中的模块。这种打包的过程，会导致启动慢，热更新慢
   - 2. 按需编译
     - Vite 只在浏览器请求时编译模块，这意味着只编译实际被访问的文件，而不是整个项目。这种按需编译大大减少了初次启动时间和资源消耗。
     - ps: Webpack 在开发模式下需要对整个项目进行编译，即使某些模块并未被实际访问
   - 3. 更简单的配置
     - Vite 提供了开箱即用的默认配置，适用于大多数项目。开发者只需进行最少的配置即可开始使用。
     - ps： Webpack 的配置文件可能会非常复杂， 并且Webpack 依赖大量的插件和加载器


- vite的启动加速原理
  - Vite 通过在一开始将应用中的模块区分为 依赖 和 源码 两类，改进了开发服务器启动时间。 
    - 依赖： 大多为在开发时不会变动的纯 JavaScript。一些较大的依赖（例如有上百个模块的组件库）处理的代价也很高。依赖也通常会存在多种模块化格式
      - Vite 将会使用 esbuild 预构建依赖。esbuild 使用 Go 编写，并且比以 JavaScript 编写的打包器预构建依赖快 10-100 倍。
    - 源码：通常包含一些并非直接是 JavaScript 的文件，需要转换（例如 JSX，CSS 或者 Vue/Svelte 组件），时常会被编辑
      - Vite 以 原生 ESM 方式提供源码。这实际上是让浏览器接管了打包程序的部分工作。Vite 只需要在浏览器请求源码时进行转换并按需提供源码。根据情景动态导入代码，即只在当前屏幕上实际使用时才会被处理。

## 为什么生产环境仍需打包

尽管原生 ESM 现在得到了广泛支持，但由于嵌套导入会导致额外的网络往返，在生产环境中发布未打包的 ESM 仍然效率低下（即使使用 HTTP/2）。为了在生产环境中获得最佳的加载性能，最好还是将代码进行 tree-shaking、懒加载和 chunk 分割（以获得更好的缓存）。



## vite 环境变量

Vite 在一个特殊的 `import.meta.env` 对象上暴露环境变量

- 环境变量文件：Vite 支持使用 .env 文件来定义环境变量。根据不同的环境，可以创建不同的 .env 文件。Vite 使用 dotenv 从你的 环境目录 中的下列文件加载额外的环境变量
  - env：默认的环境变量文件，适用于所有环境。
  - env.[mode]：特定模式的环境变量文件，例如 .env.development、.env.production。
- 环境变量的命名规则：
  - 为了在 Vite 中使用环境变量，这些变量的名称必须以 VITE_ 为前缀
- 使用环境变量：
  - 在 Vite 项目中，可以通过 import.meta.env 访问环境变量
  - 在 Vite 项目中，import.meta.env 是一个特殊的对象，提供了一种访问环境变量的方式。这些环境变量通常定义在 .env 文件中，并在构建过程中注入到项目中。



- 这里有一些在所有情况下都可以使用的内建变量
  - import.meta.env.MODE： 应用运行的模式。默认情况下，开发服务器 (dev 命令) 运行在 development (开发) 模式，而 build 命令则运行在 production (生产) 模式
  - import.meta.env.BASE_URL: 部署应用时的基本 URL。他由base 配置项决定
  - import.meta.env.PROD: 应用是否运行在生产环境
  - import.meta.env.DEV: 应用是否运行在开发环境
  - import.meta.env.SSR: 应用是否运行在 server 上

## vite脚手架

`yarn create vite` 的意思就是： 下载并运行 create-vite 脚手架工具，帮助你生成一个新的 Vite 项目


## vite 重要配置

通过合理配置路径别名、代理、环境变量、CSS 预处理器、代码拆分、Source Maps、自动导入组件、代码质量工具和部署优化

在 vite.config.js 文件中：

- 1. 路径别名： 简化模块导入路径

```
resolve: {
  alias: {
    '@': '/src'
  }
}

```

- 2. 代理配置: 处理跨域问题

```
server: {
  proxy: {
    '/api': {
      target: 'https://api.example.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}

```

- 3. CSS 预处理器： 配置 CSS 预处理器，如 Sass、Less 

```
css: {
  preprocessorOptions: {
    scss: {
      additionalData: `@import "@/styles/global.scss";`
    }
  }
}

```

- 4. 通过 Rollup 的 manualChunks 配置来实现代码拆分，提高应用的加载性能

```
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['vue']
      }
    }
  }
}


```

- 5. Source Maps: 在生产环境中生成 Source Maps，有助于调试和错误追踪

```
build: {
  sourcemap: true
}


```

- 6. 部署优化: 如开启 gzip 压缩

```
import vue from '@vitejs/plugin-vue';
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [vue(), compression()],
  // 其他配置
});

```



在.env文件中

- 1. 环境变量： 用环境变量来配置不同环境下的变。在项目根目录中创建 .env 文件。
- 

## 构建生产版本

- 公共基础路径： 如果你需要在嵌套的公共路径下部署项目，只需指定 base 配置项，然后所有资源的路径都将据此配置重写
- 自定义构建： 通过 build.rollupOptions 直接调整底层的 Rollup 选项
- 产物分块策略： 通过配置 build.rollupOptions.output.manualChunks 来自定义 chunk 分割策略
- 文件变化时重新构建
 
## vite编译流程




- 依赖预构建： vite 会找到对应依赖， 然后调用esbuild,将其他规范代码转换为esmodule代码，然后放到node_modules/.vite/deps里

## vite遍历结果
## vite 原理


## 性能优化

面所罗列的功能会自动应用为构建过程的一部分，除非你想禁用它们，否则没有必要显式配置。


- CSS 代码分割： Vite 会自动地将一个异步 chunk 模块中使用到的 CSS 代码抽取出来并为其生成一个单独的文件
- 预加载指令生成： Vite 会为入口 chunk 和它们在打包出的 HTML 中的直接引入自动生成 <link rel="modulepreload"> 指令。
- 异步 Chunk 加载优化

## 插件

- 添加一个插件
  - 若要使用一个插件，需要将它添加到项目的 devDependencies 并在 vite.config.js 配置文件中的 plugins 数组中引入它。
- 强制插件排序
  - 为了与某些 Rollup 插件兼容，可能需要强制修改插件的执行顺序
    - 可以使用 enforce 修饰符来强制插件的位置
    - pre：在 Vite 核心插件之前调用该插件
    - post：在 Vite 构建插件之后调用该插件。 默认post



## hmr原理

- webpack
  - 1. 代码修改：当你修改代码并保存时，Webpack 会检测到文件变化。
  - 2. 重新打包：Webpack 会重新编译受影响的模块，生成新的打包结果。
  - 3. 模块替换：Webpack 将新的模块发送到浏览器，并替换掉旧的模块，而无需刷新整个页面。
  - 4. 模块更新：浏览器中的应用状态保持不变，只更新修改的模块。


- vite:
  - 1. 文件监听: Vite 使用 chokidar 监听文件系统中的文件变化
    - 文件监听底层机制: node 的fs系统
      - fs.watch： 一个跨平台文件系统监听 API， 
      - fs.watchFile： 使用轮询机制来检测文件变化。虽然这种方法比较可靠，但性能较差，特别是在监听大量文件时
  - 2. 模块依赖分析: Vite 分析被修改模块的依赖关系，确定哪些模块需要更新。由于 Vite 使用原生的 ES 模块，模块之间的依赖关系是显式的，这使得依赖分析更加高效。
    - 通过解析模块的导入和导出语句，构建模块依赖图， 根据解析结果构建模块依赖图，记录每个模块的依赖关系
  - 3. 更新通知: Vite 通过 WebSocket 向客户端发送更新通知。客户端在接收到通知后，会根据通知内容确定需要更新的模块。
  - 4. 模块替换:客户端通过动态导入（dynamic import）重新加载被修改的模块，并使用新的模块替换旧的模块。由于 ES 模块的热替换是基于模块的粒度，因此只会替换受影响的模块，而不会重新加载整个页面。


## WebSocket


- 概念
  - 全双工通信： WebSocket 是一种在单个 TCP 连接上进行全双工通信的协议，它允许服务器和客户端之间实时交换数据
  - 持久连接： 与传统的 HTTP 请求-响应模式不同，WebSocket 连接一旦建立，就可以在客户端和服务器之间持续存在，直到显式关闭
  - 低延迟： 由于 WebSocket 连接是持久的，它可以实现低延迟的数据传输，适合实时应用，如聊天应用、在线游戏和实时数据推送等



- 0. WebSocket
  - open：连接成功建立时触发。可以执行一些初始化操作，比如发送初始数据。
  - message：接收到消息时触发。你可以在这个事件中处理接收到的数据。
  - close：连接关闭时触发。可以在这个事件中执行一些清理操作，比如释放资源或重新尝试连接
  - error：连接发生错误时触发。可以在这个事件中处理错误并记录日志。


- 1. 在浏览器中使用 WebSocket： 现代浏览器都原生支持 WebSocket

```
// 创建 WebSocket 连接， 会向服务器 ws://localhost:8080 发送一个 WebSocket 握手请求
const socket = new WebSocket('ws://localhost:8080');

// 连接打开时触发
socket.addEventListener('open', (event) => {
  console.log('WebSocket is open now.');
  // 向服务器发送数据
  socket.send('Hello Server!');
});

...

```


- 2. 在node 中使用: 需要用ws 库

```
const WebSocket = require('ws');

// 创建 WebSocket 服务器， 会启动一个 WebSocket 服务器，监听端口 8080
const wss = new WebSocket.Server({ port: 8080 });

  // 监听连接事件， 当客户端发起 WebSocket 握手请求并成功建立连接后，服务器会触发 connection 事件
   wss.on('connection', (ws) => {
     console.log('Client connected');

     // 监听消息事件
     ws.on('message', (message) => {
       console.log('Received:', message);
       // 向客户端发送消息
       ws.send('Hello Client!');
     });

     // 监听关闭事件
     ws.on('close', () => {
       console.log('Client disconnected');
     });

     // 监听错误事件
     ws.on('error', (error) => {
       console.error('WebSocket error:', error);
     });
   });


```