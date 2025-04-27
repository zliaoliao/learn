
## webpack 复习方向

流程
关键节点原理： loader原理（done）, plugin原理（done），模块原理（done）， 热更新原理（有点麻烦用到问到再学吧）， 联邦模块原理

> 后面有时间补充，plugin原理， 和 热更新原理  【之前没见有人问，实际项目也基本用不到】

> 但是由衷的说一句插件机制用不到么，如果想做些自定义处理，技术项目，还是有可能用到的，所以插件机制还是学吧，大不了，多加一天

性能优化（面试前两天结合项目学习 todo 5.23）


## 工程化

一个项目的生命周期包括： 工程立项，需求分析，产品原型，开发实施， 测试部署，上线运行，
一个项目从立项到交付的过程中，我们用到的各种工具和技术，对他们的运用就叫工程化。

对于前端来说，就是从开发实施，到上线运行这个过程，通过各种工具和技术，提升前端开发效率的过程。
> 前端工程化的内容： 各种工具和技术
> 目的： 开发效率， 其实就是使用工具，解决前端问题， 

前端问题，比如：

项目上线前，代码需要压缩(删去空格，把长变量名换成短变量名)

想要使用es6或css3新特性，要解决兼容问题

想要使用less增强css的编程性，但是浏览器不能直接支持less

多人协作开发，代码风格无法统一


把要前端工程主要要解决的问题做个分类：

1. 压缩工具
2. 转换工具
3. 格式化工具(标准化规范): eslint,stylelint,prettier
4. 自动化工具: 
   > 自动化构建： npm srcipts , scripts hook, gulp 。 
   > 自动化部署：git hook, CI/CD
   > 自动化测试： jest, enzyme
5. 模块化打包工具： webpack, rollup
6. 脚手架工具： 
   > 专用型：create-react-app, vue-cli
   > 通用型： yeoman


前端工程化大部分的工具，都是用node.js 开发的， node.js 是前端生态圈繁荣的基础，不会node的前端不是好前端

## 什么是webpack，什么是构建

什么是webpack？

简单来说就是一个 模块打包工具, 可以将互相依赖的html、css、js以及图片字体等资源文件，经过处理打包成一个静态前端项目


为啥要用webpack？

因为传统再html的script里引入大量js，css，不仅会命名冲突，而且全量引入会使得项目体积变大。

node.js 出现后，js项目支持通过require 进行模块化开发，并且支持npm 方便管理依赖；

由于浏览器和node 都是js的运行时，这样前端项目可以在nodejs下开发，完成之后把代码构建成浏览器支持的形式。


什么是构建？

我们写的模块化代码是没办法直接运行在浏览器的，我们需要把写的代码自动转换成可在生产环境运行（比如：浏览器）的代码, 这个转换过程叫构建。它包括了编译（比如：es6转换为es5, less转换为css, ts转换为js）
> 前端构建步骤一般包括：代码检查，运行单元测试，语言编译，依赖分析、打包、替换等，代码压缩、图片压缩等，版本生成

另外一个比较容易误会的概念的编译： 编译是指将源代码变为目标代码的过程，从源代码的语言转变为另外一种计算机语言（一般为比源代码语言更为底层的语言）。

## 编译时与运行时

编译时： 就是代码的转换（源代码的加工）
运行时：就是代码的执行 （有的时候，运行时指的是运行环境）

### 构建方式

#### npm scripts

npm scripts是实现自动化构建的最简方式
> npm init -y 生成的package.json 里的scripts， npm 允许使用scripts的字段自定义脚本命令
> 具体操作： 把命令行里要写的命令，提前写好在scripts里(这样后面执行的时候，就可以用简单的命令，执行自定义长命令)

npm scripts命令的执行方式：

```
并行执行：  任务1 & 任务2  

任务之间没有先后顺序，同时执行可以提高执行效率

串行执行： 任务1 && 任务2

任务之间有先后顺序，先执行前一个，后执行下一个


```

#### 分类

前端开发构建工具目前有两大类： bundle和no bundle, 其中，

bundle类工具主要代表： webpack, parcel， rollup, esbuild.

no bundle类主要代表： snowpack, vite.

在过去的几年，webpack之类的bundle打包工具，成为大多数web应用程序构建的必要步骤。这是因为：

1. 在HTTP 1.x时代， 浏览器客户端在同一时间，针对同一域名下的请求有一定数量限制。超过限制数目的请求会被阻塞，从而影响性能，因此合并请求非常有必要；
2. 在以前的浏览器中， nodejs的CommonJS模块和ES模块，普遍都无法直接运行，必须转换处理，这也为bundler的存在提供了合理性。
3. bundle处理本身也有很多优点，比如webpack支持很多插件，可以支持各种文件处理以及混淆压缩等。

但是bundler的存在，却真实的增加了前端应用开发很多的复杂性，也一定程度影响开发效率， 比如bundle体积过大，热更新速度慢等。而且到了2020后的现代，以上的问题基本上都不复存在：

1. http2多路复用，允许同时通过单一的http2连接发起多重的请求-响应消息。随着http2的普及，合并请求变得没那么必要。
2. 浏览器普遍开始支持ESM模块。

当然no bundle也不是真的no bundle， 毕竟bundle还是有很多优势的，在构建发布时也依然用到bundle工具, 如snowpack可以选择bundler如webpack，vite使用了rollup.

总结：

webpack升级到5.x,依然是强大的主流选择，但是不再是一统天下了。
esbuild 和 rollup 都是小巧玲珑，主打先进和快，仅用于javascript。
vite 未来主要依然是用于vue 3.0的生态中。


### 打包工具

前端为什么需要打包工具？

webpack 就是一种打包工具。

模块化的出现，促使打包工具出现，没有打包工具之前面临的主要问题：

1. es module 的浏览器兼容问题（模块化方案不统一，浏览器不兼容各种各样的模块化）

2. 模块文件过多导致频繁发送网络请求的问题（项目越来越大，拆分的文件越来越多，客户端加载时就需要发送很多请求）

3. 资源模块化问题（html,css也需要模块化）

为了解决这些问题，开发阶段享受模块化带来的便利，又不需要担心在生产环境下，因为模块化而产生问题，所以才出现打包工具。

webpack 可以实现以下功能：

1. 代码转换（loader功能）： 将es6， ts等高级语言转换为浏览器可识别的低级语言
2. 文件优化： 通过代码压缩，图片压缩，文件合并等方式来减小体积，加快页面加载速度
3. 模块合并： 将多个模块合并为一个模块，减少http请求数量
4. 依赖管理（按需加载）：通过分析模块间依赖关系，自动加载所需的模块
5. 插件扩展: 通过插件扩展功能，满足不同项目的需要

## webpack

### webpack 配置

webpack.config.js

```

// webpack 使用主要分为开发环境和生产环境
// 开发环境要求打包快，因为需要频繁预览
// 生产环境可以打包慢一点

// module 一个文件
// chunk 从入口模块出发通过依赖找到的模块，整体作为一个chunk
// bundle 结果代码块，chunk构建完成就是一个bundle





// 获取环境变量
const NODE_ENV = process.env.NODE_ENV;
const isProduction = NODE_ENV === 'production';



const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 使用MiniCssExtractPlugin 提取css，有两步1. 换掉 style-loader 2. new MiniCssExtractPlugin()
// 提取需要时间，开发环境就不用这个
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 代码检查插件eslint
const EslintWebpackPlugin = require('eslint-webpack-plugin');



module.exports = {
  mode: 'development',
  // mode: isProduction?'production':'development',
  devtool: false,
  entry:"./src/entry1.ts",
  // entry: ["./src/entry1.js", "./src/entry2.js"] // 数组多入口，会生成一个文件
  // entry: { // 对象模式给入口命名，对象多入口，会根据key名生成多个文件
  //   entry1: "./src/entry1.js",
  //   entry2: "./src/entry2.js"
  // },
  // chunk 是代码块，从入口文件开始，找到所有的依赖模块，这些模块代码打包到一起就是一个代码块（一个入口一个代码块？）
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出目录
    // filename: 'main.js', // 输出文件名
    filename: '[name].js', // 用中括号包起来的叫模版变量， name 表示entry的key(如果有两个入口不用变量控制文件名都叫main.js就冲突了)
    clean: true, // 在新的打包之前清除历史打包文件
  },
  resolve:{
    extensions: [".js", ".ts"]
  },
  module:{ // 模块加载器
    // webpack 里一切(js,css,图标，字体)皆模块，但是只有js可以直接运行和使用，
   // loader 可以把非js都转换为webpack可以处理的有效模块（js）
    rules: [
      // webpack5 内置了图片类型的加载器不需要再配置对应loader, 也可以用module.rules.type去配置图片的加载
      // asset/resource 把文件当成静态资源输出（生成单独的文件并导出 URL） asset/inline 把图片变成base64（导出资产的数据 URI）  asset 会在输出文件和base64之间自动选择，要加配置parser
      // base64 不需要额外的请求，但是会加大静态文件体积，所以图片小的时候可以使用base64
      {
        test: /\.png$/,
        type: 'asset',
        parser:{
          // 如果图片小于某个阈值（单位k），则转换为base64，否则输出单独文件
          dataUrlCondition:{
            maxSize: 1024
          }
        }
      },
      // 响应式加载图片responsive-loader ，响应式图片是指能够根据设备屏幕大小和分辨率等因素动态调整显示大小和清晰度的图片， 知道就行，用的时候再查
      // 知道有图片压缩image-webpack-loader就行，可以配置具体那种图片怎么压缩，可以用的时候再查文档
      // {
      //   test: /\.(jpe?g|png|gif|svg)$/i,
      //   use: [
      //     {
      //       loader: 'image-webpack-loader',
      //       options: {
      //         disabled: !isProduction, // 只有生产环境才压缩
      //       }
      //     }
      //   ],
      // },
       // asset/source 原样输出（导出资产的源代码）
       {
        test: /\.txt$/,
        type: 'asset/source'
      },
      {
        test: /\.ts$/,
        use: [
          // 'ts-loader'
          {
            loader: 'babel-loader',   // ts-loader 有些慢，转换ts可用babel-loader
            options: {
              presets: [ "@babel/preset-typescript"]
            },
          }
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        exclude: /node_modules/, // node_modules下的代码不编译
        use: [
          {// 如果需要给loader传参数的话，配置的loader就要写成对象形式
            loader: 'babel-loader',
            options: { // options 的内容，可以在这里写，也可以单独拿出去，写在.babelrc或babel.config.js 里
              // 对预设presets的理解： 我们使用了很多es6的特性，要把它从es6转成es5，需要编写对应的babel插件，每一种预发对应一个插件
              // 一个一个配插件比较麻烦，为了方便，我们可以把这些插件放一个包了，称为一个预设preset， 当你配了一个预设就相当于配了一堆插件
              presets: [
                // @babel/preset-env 根据指定的执行环境，检测当前代码是否需要转换，并根据需要转换目标代码，所以我们需要指定执行环境 Browserslist
                // 可以通过@babel/preset-env 里的 targets， 或者.browserslistrc 配置文件，或package.json 里的 browserslist 字段 3种方式指定环境
                // browserslist 是用来给不同的前端工具（Autoprefixer, @babel/preset-env）共享 target browsers 和 Node.js versions 配置的. 一般推荐将配置写在 package.json 里的 browserslist 字段。
                "@babel/preset-env",  
              ]
            }
          }
        ]

      },
      {
        test: /\.css$/,  // 匹配文件路径
        use: [
          // 'style-loader',  
          isProduction ? MiniCssExtractPlugin.loader:'style-loader',  
          'css-loader', 
        ]  // loader从后往前依次执行
        // 1. webpack通过node.js读取css内容，交给css-loader处理  
        // 2. css-loader 把 css 转换为js代码（loader 是个函数，css 字符串赋值给一个变量，然后返回）
        // 3. 可以将 CSS 样式注入到 Webpack 打包后的 JavaScript 文件中，接收上一个loader函数的返回，style-loader用js动态创建style 标签，将样式动态插入到HTML里（创建一个style标签，然后用style.innerHTML赋值就行了），
        // ps： 这样创建style标签打包结果就只有一个main.js了，没有单独的样式文件了， 如果要单独提取出来需要用到mini-css-extract-plugin 插件，然后link的方式引入
      },
      {
        test: /\.less$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader:'style-loader',  
          'css-loader', 
          'less-loader'
        ] 
      },
      
    ]
  },
  plugins: [
    // 根据模版生成html文件,自动引入打包结果到html。避免手动在打包结果里创建html，然后手动引入打包结果
    new HtmlWebpackPlugin({ 
      template: './src/index.html', // 指定模版
    }),
    // css单独提取出来，生成css文件。当我们使用style-loader时，style-loader 将 CSS 样式注入到 js 文件中时，css 和js 都打包到一个js文件，会导致这个文件过大，如果在html头部加载还会阻塞页面渲染。
    // 提取出来后，页面加载时，可以并行加载css（css加载和js加载可以并行）,同时style-loader那里也要改，使用
    // MiniCssExtractPlugin.loader
    new MiniCssExtractPlugin(),
    // 要使用eslint 插件还要写 .eslintrc 配置文件
    new EslintWebpackPlugin({
      extensions: ['.js', '.ts'] // 要检查哪些后缀名文件
    }),
  ],
  // 打包完了之后，我需要手动打开打包好的html才能看到结果很麻烦，webpack-dev-server 可以帮我们自己打开，
  // 同时webpack-dev-server 是一个基于express 的web服务器，它可以为 Webpack 打包后的代码提供一个本地开发环境，提供了实时预览，热更新，自动构建等功能提高开发效率
  devServer: { // 用webpack serve 命令去启动这个开发服务器
    host: 'localhost', // 主机名
    port: 9000, // 端口号
    open: true, // 构建结束后自动打开浏览器预览项目
    // compress为true, 启动本地服务器gzip 压缩，当文件从服务器发给客户端的时候，可以先在服务器压缩，
    // 这样体积就小了，压缩完发给客户端，客户端进行解压,提高传输效率
    compress: true, 
    hot: true, // 启动模块热替换，改动一小部分内容，不需要整体刷新
    // 是否启用html5的历史记录api, 用于处理单页应用的路由问题，
    // （当点击前进后退）不管访问哪个路径，都会把请求重定向到index.html,交给前端路由来处理
    historyApiFallback: true,
    //  proxy 代理后端服务器
    // proxy:{
    //   // key 是路径前缀， 值是请求路径 或者是一个配置对象
    //   // '/api': 'http://localhost:4000',
    //   '/api': {
    //     target: 'http://localhost:4000',
    //     pathRewrite: { // 路径重写
    //       '^/api': ''
    //     }
    //   },
    // },
    // proxy代理是我们有了后端服务，然后去做代理，如果我们没有后端服务想实现类似代理,返回数据的逻辑，可以用onBeforeSetupMiddleware
    onBeforeSetupMiddleware({app}){
      app.get('/api/users', (req, res)=>{
        res.json([
          {
            id:1222,
            name: 'bob'
          }
        ])
      })
    }
  }
}

```

npm 包， webpack 配置

```
// umd 包括amd, commonjs, commonjs2; commonjs2 是 commonjs的升级版


const path = require('path');
const {merge} = require('webpack-merge');

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackNodeExternals = require('webpack-node-externals')
const webpack = require('webpack')

console.log(process.env.NODE_ENV, 'node')

const baseConfig = {
  mode: process.env.NODE_ENV,
  devtool: false,
  entry:'./src/index.js',
  //externals 不需要打包进来的(指定外部模块)， 用了这个之后,需要用户自己装依赖，一般要在package.json里配置peerDependencies
  // peerDependencies 表示同级依赖，包要想就是Dependencies，要想工作会依赖peerDependencies，就是包不会自动装，需要用户自己装的意思
  externals:[ 
    // 键为模块名，值表示模块在哪些环境下使用该模块以及环境下的名字(打包代码里会require该名字)，root表示未指定的环境下的名字
    // {
    //   jquery:{
    //     commonjs: 'jquery',
    //     commonjs2: 'jquery',
    //     amd: 'jquery',
    //     root: '$'
    //   },
    //   lodash:{
    //     commonjs: 'lodash',
    //     commonjs2: 'lodash',
    //     amd: 'lodash',
    //     root: '_'
    //   },
    // }
    // 如果外部模块太多， 可以用简写方式排除所有第三方模块
    WebpackNodeExternals(),
  ],
  // output对象中的library选项允许我们将模块导出的内容作为库（library）暴露给外部使用
  output: {
    // library属性用于指定库的名称，可以是一个字符串或者一个对象。如果是一个字符串，则将其作为全局变量暴露给浏览器环境。
    // 如果是一个对象，则可以在对象中指定library的名称和导出方式等相关选项
    library:'math', 
    // libraryExport: 'add', // 可以指定导出的方法
    // clean: true,
    // libraryTarget 指定库的导出方式，可以是以下值之一：
    // 全局变量的形式
    // var：将库导出为一个变量，该变量在全局作用域下可用
    // assign：将库导出为一个变量，该变量在全局作用域下可用，但可以被其他库或模块覆盖
    // this：将库导出为一个变量，该变量在this对象下可用
    // window：将库导出为一个变量，该变量在window对象下可用（仅在浏览器环境下有效）
    // global：将库导出为一个变量，该变量在global对象下可用（仅在Node.js环境下有效）
    // 模块的形式
    // commonjs：将库导出为一个CommonJS模块，该模块在Node.js环境下可用
    // commonjs2：将库导出为一个CommonJS2模块，该模块在Node.js环境下可用
    // amd：将库导出为一个AMD模块，该模块在浏览器环境下可用
    // 上面的所有加载一起就是umd, umd 就是commonjs + amd + 全局变量
    // umd：将库导出为一个UMD模块，该模块既可在浏览器环境下，也可在Node.js环境下使用
    // libraryTarget: 'commonjs2'
  },
  module:{
    rules:[
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin(),
    // new webpack.DefinePlugin({
    //   "process.env.NODE_ENV": JSON.stringify('production')
    // })
  ]
}

// 一般来说，现代化的npm包都会输出多种格式，比如有umd,amd,commonJs,esmodule
module.exports = [
  // 合并webpack 配置
  merge(baseConfig, {
    output: {
      filename: '[name]-commonjs.js',
      libraryTarget: 'commonjs2'
    },
  }),
  merge(baseConfig, {
    output: {
      filename: '[name]-amd.js',
      libraryTarget: 'amd'
    },
  }),
]
  


```

### webpack 核心原理流程

打包的过程中有有两个重要的点，webpack 本质是个打包工具，通过loader 和 plugin 处理一些额外的任务：
1. loader处理特殊资源（样式，图片等）的加载
2. plugin 处理自动化构建任务（转换，压缩，发布等）

工作流程：

总体上讲是，通过一个js为入口（当然以可以配置多个js入口），把项目所有的，各种类型的文件，通过打包的方式，转换成一个或几个文件。
 
从entry开始，递归解析entry依赖的所有module,

根据module.rules里配置的loader进行相应的转换处理，对module转换后再解析出当前module依赖的其他模块，解析出一个一个的chunk(这些module在entry里会进行分组，即一个个的chunk)，最后所有的chunk会转换成文件输出的output.

在整个构建流程中，webpack会在恰当的时机执行plugin里 定义的那些插件。从而完成plugin插件里的任务。

如果流程再详细点：
1. 初始化参数：从配置文件和 Shell 语句中读取并合并参数,得出最终的配置对象
2. 用上一步得到的参数初始化 Compiler 对象(Compiler 是用来管理编译过程的编译器)
3. 在Compiler 对象上加载所有配置的插件（拿到所有的插件实例，执行他们的apply方法（在插件里订阅相应事件），并传入complier对象作为参数）
4. 执行Compiler 对象的 run 方法开始执行编译
5. 根据配置中的entry找出入口文件
6. 从入口文件出发,调用所有配置的Loader对模块进行编译
7. 再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
8. 根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk
9. 再把每个 Chunk 转换成一个单独的文件加入到输出列表
10. 在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

> 在以上过程中，Webpack 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果

entry: 模块入口，让源文件加入到构建流程中
output: 配置如何输出
module: 配置各种类型模块的处理规则
plugin: 配置扩展插件
devServer: 实现本地服务，包括 http, 模块热替换，source map等服务

详细工作流程可以看： /Users/zxq/学习/2023 面试练习/learn-2023/webpack-learn/webpack-flow 这个项目，手写了简版webpack

### webpack 打包结果分析

#### webpack4:

打包结果总体是个自执行函数，入参： modules, 表示所有的模块，是一个数组，数组里每个元素都是函数，对应着源代码中的一个模块，
也就是说webpack 会把我们的每一个模块最终都包裹在一个函数中，从而实现模块的私有作用域。

然后我们展开这个函数，函数里用installedModules 去缓存每一个我们加载过的模块，用定义__webpack_require__去加载指定模块，
然后在__webpack_require__上去挂钩一些数据和工具函数， 最后调用__webpack_require__，传入模块id为0，这样就开始加载源代码的入口模块


#### webpack5:

以下是打包结果

打包commonjs模块

```
// 打包的结果整个是一个自执行函数
(() => {
  // 除去入口文件的，所有模块的模块映射。key是模块ID, 也就是模块相对于当前根目录的相对路径; 值是一个函数，函数内容是模块源码
  var webpackModules = {
    "./src/test.js": module => {
      const a = 1;
      const b = a++;
      module.exports = {
        b
      };
    },
    "./src/title.js": module => {
      module.exports = "title";
    }
  };
  // 定义require函数，require的时候，缓存对象里有，就根据模块id从缓存里取出结果，缓存对象里没有就执行模块代码，最后返回module.exports最为require的结果
  var webpackModuleCache = {};
  function webpackRequire(moduleId) {
    var cachedModule = webpackModuleCache[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = webpackModuleCache[moduleId] = {
      exports: {}
    };
    webpackModules[moduleId](module, module.exports, webpackRequire);
    return module.exports;
  }
  var webpackExports = {};
  // 执行入口模块代码
  (() => {
    let title = webpackRequire("./src/title.js");
    const {
      a
    } = webpackRequire("./src/test.js");
    console.log(title, a);
  })();
})();


```

打包esmodule模块， 相比于打包commonjs， 多了require.r和require.d两个函数, require.r声明模块为es6模块，
require.d 遍历模块每一个导出的属性，定义它们的getter, 这样每次取用这个值就会通过一个getter，读取的是最新的值,esmodule的导出就变成了值的引用

```
(() => {
  // 除去入口文件的，所有模块的模块映射。key是模块ID, 也就是模块相对于当前根目录的相对路径; 值是一个函数，函数内容是模块源码,
  // 对于esmodule模块多了webpackRequire.r 和 webpackRequire.d两个函数 
  var webpackModules = {
    "./src/test.js": module => {
      const a = 1;
      const b = a++;
      module.exports = {
        b
      };
    },
    "./src/title.js": (unusedWebpackModule, webpackExports, webpackRequire) => {
      "use strict";
      webpackRequire.r(webpackExports);
      webpackRequire.d(webpackExports, {
        age: () => age,  // 导的属性放在一个函数里返回， 这样每次取用这个值就会通过一个getter，读取的是最新的值，//esmodule的导出就变成了值的引用
        "default": () => webpackDefaultExport
      });
      const webpackDefaultExport = 'title_name';
      const age = 'title_age';
    }
  };
  // 定义require
  var webpackModuleCache = {};
  function webpackRequire(moduleId) {
    var cachedModule = webpackModuleCache[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = webpackModuleCache[moduleId] = {
      exports: {}
    };
    webpackModules[moduleId](module, module.exports, webpackRequire);
    return module.exports;
  }
  // 给esmodule 每一个导出的属性定义getter
  (() => {
    webpackRequire.d = (exports, definition) => {
      for (var key in definition) {
        if (webpackRequire.o(definition, key) && !webpackRequire.o(exports, key)) {
          Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key]
          });
        }
      }
    };
  })();
  (() => {
    webpackRequire.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
  })();
  // webpackRequire.r 将模块标记为esmodule
  (() => {
    webpackRequire.r = exports => {
      if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, {
          value: 'Module'
        });
      }
      Object.defineProperty(exports, 'esmodule', {
        value: true
      });
    };
  })();
  var webpackExports = {};
  (() => {
    let title = webpackRequire("./src/title.js");
    const {
      a
    } = webpackRequire("./src/test.js");
    console.log(title, a);
  })();
})();

```

打包动态引入import() 【手写版】

```
// 异步模块加载，用jsonp, 动态的向html里添加一个脚本（script）,路径（src）是要加载的js文件地址
// 然后浏览器会请求这个资源，然后资源执行，异步加载的核心就是拿到新的模块定义（模块内容），然后进行合并，让require能够读取到模块内容
// 然后正常require加载就行了
// 每遇到一个import 都放入单独的代码块里

var modules = {};
function require(moduleId) {
  var module = {
    exports: {}
  };
  modules[moduleId](module, module.exports, require);
  return module.exports;
}
require.m = modules;

require.r = exports => {
  if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
    Object.defineProperty(exports, Symbol.toStringTag, {
      value: 'Module'
    });
  }
  Object.defineProperty(exports, 'esmodule', {
    value: true
  });
};

require.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);

require.d = (exports, definition) => {
  for (var key in definition) {
    if (require.o(definition, key) && !require.o(exports, key)) {
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: definition[key]
      });
    }
  }
};

require.f = {};
// 各代码块的状态
var installedChunks = {
  main: 0, // main 代码块加载完成
}
// 创建script动态 加载代码块
require.l = (url) =>{
  const script = document.createElement('script');
  script.src = url;
  document.head.appendChild(script);
}
require.p = ''; // 相当于publicPath
// 返回此代码块chunk的文件名
require.u = (chunkId) => `${chunkId}.main.js`;

// 通过jsonp 的方式去异步加载chunkId
require.f.j = (chunkId, promises) =>{
  let installedChunkData; // 当前已经安装好的代码块
  let promise = new Promise((resolve, reject)=>{
    installedChunkData = installedChunks[chunkId] = [resolve, reject]
  })
  installedChunkData[2] = promise;
  promises.push(promise);
  // 获取异步代码块的路径，加载了这个脚本并执行src_title_js.main
  const url = require.p + require.u(chunkId);
  console.log(url) // src_title_js.main.js
  require.l(url);
}

// 创建promise 加载代码块，等待promise成功
require.e = function(chunkId){
  let promises = [];
  require.f.j(chunkId, promises);
  return Promise.all(promises);
}

// 调用jsop回调了就说明脚本加载成功了，加一下成功标识
function webpackJsonpCallback([chunkIds, moreModules]){
  const resolves = [];
  for(let i=0;i<chunkIds.length;i++){
    const chunkId = chunkIds[i];
    // 拿到resolve 方法
    const resolve = installedChunks[chunkId][0];
    resolves.push(resolve);
    
    installedChunks[chunkId] = 0;
  }
  // 合并模块定义, 把新的模块定义合并到modules里
  for(const moduleId in moreModules){
    modules[moduleId] = moreModules[moduleId]
  }
  // 取出所有的resolve执行，让其对应的promise 成功
  while(resolves.length){
    console.log(resolves)
    resolves.shift()();
  }
}
var chunkLoadingGlobal = window['someName'] = [];
chunkLoadingGlobal.push = webpackJsonpCallback
require.e("src_title_js") // 加载代码块
.then(()=>{
  return require('./src/title.js')
})
.then((exports)=>{
  console.log(exports)
})


```

```
src_title_js.main.js

"use strict";
// self 就是window
(window["someName"] = window["someName"] || []).push([["src_title_js"], {
  "./src/title.js": (unusedWebpackModule, webpackExports, webpackRequire) => {
    webpackRequire.r(webpackExports);
    webpackRequire.d(webpackExports, {
      age: () => age,
      "default": () => webpackDefaultExport
    });
    const webpackDefaultExport = 'title_name';
    const age = 'title_age';
  }
}]);


```



### loader 原理

1. 输入是加载到的资源内容
2. 输出是加工后的结果: 处理后的结果得是js代码(代码字符串)

如果有多个loader,从后往前执行


### 插件原理

webpack 实现插件机制的大体方式是：
1. 创建 - webpack 在其内部对象上创建各种钩子；
2. 注册 - 插件将自己的方法注册到对应钩子上，交给 webpack；
3. 调用 - webpack 编译过程中，会适时地触发相应钩子，因此也就触发了插件的方法。

Webpack 本质上是一种事件流的机制，它的工作流程就是将各个插件串联起来，而实现这一切的核心就是 Tapable，，webpack 中最核心的负责编译的 Compiler 和负责创建 bundle 的 Compilation 都是 Tapable 的实例，通过事件和注册和监听，触发 webpack 生命周期中的函数方法

> 插件向第三方开发者提供了 webpack 引擎中完整的能力。使用阶段式的构建回调，开发者可以引入它们自己的行为到 webpack 构建流程中。创建插件比创建 loader 更加高级，因为你将需要理解一些 webpack 底层的内部特性来做相应的钩子


总的原理：

插件主要就是实现插件类的apply方法，在apply方法里去监听（tap）某个内置hook（各种时机的hook，使用时需查文档）的插件事件（一般是当前插件本身类名），监听到后，（在某个时机，webpack内部调用call触发插件事件, 并传入相应参数数据，如果是async类还会有回调函数参数），
拿到对应hook传给我们的数据，用数据做一些我们自己的想处理的操作，然后调用传入的回调函数（如果传了，并且需要的话）；可能会在apply里监听多个事件，在各个时机执行对应操作


> 插件体系过于复杂，插件有很多，上百个，我们只需要了解其运行原理，然后在用的时候再查文档

#### 创建插件

插件是一个类,类上有一个apply的实例方法,apply 的参数是compiler。

在插件开发中最重要的两个资源就是compiler和compilation对象。理解它们的角色是扩展 webpack 引擎重要的第一步。

- compiler 对象代表了完整的 webpack 环境配置。这个对象在启动 webpack 时被一次性建立，并配置好所有可操作的设置，包括 options，loader 和 plugin。当在 webpack 环境中应用一个插件时，插件将收到此 compiler 对象的引用。可以使用它来访问 webpack 的主环境。

- compilation 对象代表了一次资源版本构建。当运行 webpack 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 compilation，从而生成一组新的编译资源。一个 compilation 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。compilation 对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。


hook的插件监听与触发方式分类： 
1. 基础hook,执行每一个事件函数，不关心函数的返回值,有 SyncHook、AsyncParallelHook、AsyncSeriesHook
2. 保险hook, 执行每一个事件函数，遇到第一个结果 result !== undefined 则返回，不再继续执行。有：SyncBailHook、AsyncSeriesBailHook, AsyncParallelBailHook
3. 瀑布hook, 如果前一个事件函数的结果 result !== undefined,则 result 会作为后一个事件函数的第一个参数,有 SyncWaterfallHook，AsyncSeriesWaterfallHook
4. 循环 hook, 不停的循环执行事件函数，直到所有函数结果 result === undefined,有 SyncLoopHook 和 AsyncSeriesLoopHook



### 设置环境变量（区分环境）的三种方式

设置环境变量，会决定： process.env.NODE_ENV 的值

1. --mode用来设置模块内的process.env.NODE_ENV

> 在package.json 的命令里设置，会覆盖webpack配置里的mode属性

```
"build:prod": "webpack --mode=production"
```
2. DefinePlugin webpack插件用来设置模块内的全局变量

以上两种都不能设置webpack 配置文件运行环境里的环境变量，但是设置源代码里的环境变量，如果想设置webpack 配置文件运行环境里的环境变量，得用下面这种

3. cross-env只能用来设置node环境的process.env.NODE_ENV

```
"build:prod": "cross-env NODE_ENV=production webpack"

```

可以用cross-env 配合 DefinePlugin 或者webpack 配置的mode  来使用，让源代码里也能拿到node环境的process.env.NODE_ENV

```
const webpack = require('webpack')

new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    })

```

```
mode: process.env.NODE_ENV

```

## 联邦模块 Module Federation

**应用或应用块共享其他其他应用块或者库**， 一种代码共享机制，由webpack插件和webpack共同实现

当我们一个公共模块被多个项目使用时，我们一般会把它打包成npm包，通过发包的方式进行进行组件/方法的复用。 当组件（方法）有一些更新时候，尤其是更改了某些存在的bug，就不得不通知依赖模块进行升版；如果存在多个依赖方，这种“发布npm-> 通知-> 更改多个项目->重新发布多个项目”模式无疑是低效率的；

联邦模块正是解决这种问题的一种方案，只需要更新一个项目，其他项目即可引用最新的模块。


### 联邦模块：应用和容器

使用Module Federation时，每个应用块都是一个独立的构建，这些构建都将编译为容器，容器可以被其他应用或者其他容器应用。

一个被引用的容器被称为remote, 引用者被称为host。remote暴露模块给host, host则可以使用这些暴露的模块，这些模块被成为remote模块


### 联邦模块使用

```
const path = require('path');
const webpack = require('webpack');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  output:{
    // 当我们把生成后的boundle.js文件写入html的时候，需要添加的前缀, 后面的杠注意加上
    publicPath: 'http://localhost:3000/'
  },
  devServer: {
    port: 3000,
  },
  module:{
    rules:[
      {
        test:/\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  "@babel/preset-react",
                  {
                    "runtime":"automatic" // automatic 文件里不用手动引入react ， 如果想手动引入配置classic
                  }
                ]
              ]
            }
          }
        ]
      }
    ]
  },
  plugins:[
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    // 本地容器属性 remotes,  远程容器属性：filename（文件名）, name（模块名）, exposes（组件名）    通用属性： shared
    new ModuleFederationPlugin({
      filename: 'remoteEntry.js', // 输出文件名，被其他应用引入的js文件名称(一般约定写remoteEntry)
      name: 'remote', //模块名（filename表示的文件暴露的全局变量）
      exposes: { // 暴露的组件
        './NewsList': './src/NewsList'   // key（别名）的， . 表示远程应用（模块），./不能省， 引用的时候 remote/NewsList ， 也就是 ${name}/${expose}
      }, 
      remotes:{
         // 远程应用的别名隐射，声明需要引用的远程应用(远程模块)。 remotes :{ 自定义 : 远端组件name@URL/远端组件filename }， 远端组件name是被远程文件暴露的全局变量
        // key 为自定义模块名（项目里引用远程组件要使用此名+远程组件名）
        host: 'host@http://localhost:8000/remoteEntry.js'
      }, 
      // 模块共享，相当于host 和 remote有一个共享作用域，各自有的一些模块会往里面放，注册到共享作用域里面，而且是带版本号的,双方需要用的时候直接在里面取就行了，
      // 这样相同代码（包）只加载一次就好了
      shared: {
        react: {
          singleton: true, // 单例，表示这个依赖项是共享的，并且只有一个实例，确保这个依赖项在所有应用程序中都只加载一次
          requiredVersion: '^18.2.0'
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^18.2.0'
        }
      }
    })
 ]
}

```


### 联邦模块基本原理

Webpack 会把 ModuleFederationPlugin 选项配置了 expose的组件单独打包出一份chunk，如图一所示； 而如果把这份chunk的URL和filename配置在remote属性下，即表示webpack会帮你去请求这份代码，然后帮你挂载到全局变量，并解析放入你的组件中



联邦模块能用来代替microApp吗？

不能，两者不是同一生态位的应用， 联邦模块不具备样式隔离，监听路由等功能。但联邦模块可以与microApp结合使用。

为什么入口文件index.js和真正的文件app.js之间多了一个bootstrap.js?

是为了避免远端的依赖（组件）还未请求，就开始加载渲染



## 新一代构建工具vite

随着我们的项目越来越大，模块越来越多，就会遇到性能瓶颈，比如开发服务器启动慢，改变内容后去浏览器里看也需要等一会。

因为webpack 里及时你改了很少的内容，依然会整个的把所有内容编译打包，然后输出，刷新。

这样打包成了一个问题，因为现在浏览器是支持es module的，vite的设计原理就是在开发阶段不打包。

vite 先启动一个服务器，不打包，访问服务器时根据访问，去加载相应模块。
> 访问入口html, 然后根据依赖依次去请求响应文件，因为现在浏览器直接支持了es module, 虽然可能实际返回的可能是.vue文件，浏览器不认识也没关系
> 因为浏览器，认为返回的结果就是js, 浏览器认的是关键字,有响应头： Content-type: application/javascript， 这是vite服务器读取代码返回时加的响应头
> 对于文件中的vue代码，也是通过loader 的方式进行编译，生成js


浏览器是支持es module的意思是： 浏览器可以将import 转换成网络请求（类似图片资源里的src）,
这样虽然请求会很多，不过现在浏览器都支持了http 2.0，http 2.0 启用了链路复用和头部压缩，所以无所谓。


除此之外，vite 还开启了缓存，一个是本地服务器有缓存(给文件添加了唯一标识，标识不变，即使http缓存被禁用，也会给服务器缓存文件)，一个是http缓存（有响应头： Cache-control: max-age=31...）



