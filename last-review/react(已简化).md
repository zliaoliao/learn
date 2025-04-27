## 总体思路，总体认知

1. 生僻冷门的知识点在面试中就算考倒了面试者也没什么意义，面试只是为了甄别应试者的技能熟练度
2. 细节过程在面试中会用算法考，询问的时候其实就是交流思路方向，关键节点和注意事项，不会抓繁琐的细节过程，因为很难说明白，也没必要。

## 建立自己的知识体系：

1. 梳理知识体系

用先对比，后分类的模式去梳理新概念的认知往往建立在同类事物对比的基础上

2. 锤炼表达技巧

让别人能听懂最重要的点在于结构化表达。

比如：

概念类： 从概念（最好一句话描述），用途，原理，优缺点四方面去说
技术选型： 三步走，一句话解释技术，将技术的核心概念，方案对比 
如果找不到结构化表达方法就分类，分类是最简单易懂的结构化思路，5种分类方法： 分类要求，不重不漏，相互独立，完全穷尽
> 1. 2分法（把事物分为两类）   2. 矩阵法（比如：重要紧急，重要不紧急，不重要紧急，不重要不紧急）  3. 公式法（比如：天才=99%的汗水 + 1%的努力）  4. 过程法（通过梳理流程的方式完成分类）  5. 要素法（需要对事物进行高度抽象，比如营销包含： 产品，品牌，价格，渠道，推广，促销，六大要素）

3. 拓展技术视野

跟踪相关团队的技术博客与代码仓库issue, 你可以学到对于当前技术发展的深度思考以及新的方向，再次基础上才会有真正有价值的技术视野

4. 第一性原理： 就是后一个东西的核心一般就是一个点，然后最初都是很简单的一个点，然后从这个点延伸出来，复杂化的，我们只需要抓住这个点


5.  学习开源库

梳理： 梳理是一种结构化展示认知的方式，可以从整体到局部，从宏观到微观，从外到内，如果没有很好的思路，那就分类，
分类是永不过时的梳理技巧


从实现原理，工作方式两个方面去探索。

实现原理： 应该由外到内去探索，每个库的根本原理是立足于自身生态以外的（跳出生态区找答案），然后到生态内部的具体实践方案

工作方式： 从整体到局部，从宏观视角挖掘架构设计模式，到局部的关键模块（官方文档提到的模块）


> 可以用浏览器的performance 功能辅助看前端框架（react）源码，可以每个调用栈可以点进去

## react

React 是一款框架： 具备自己开发的独立思想（mvc: Model View Controller)

1. 划分组件开发
2. 基于路由的spa单页面开发
3. 基于es6来编写代码（最后部署上线的时候，我们需要把es6编译成es5=> 基于Babel来完成编译）
4. 可能用到less/Sass等， 我们也需要使用对应的插件把他们进行预编译
5. 最后为了优化性能（减少http请求次数）， 我们需要把js或者css进行合并压缩
6. webpack 来完成以上页面组件合并，js/css编译加合并等工作

前端工程化开发：

1. 基于框架的组件化/模块化开发
2. 基于webpack的自动部署

## create-react-app （脚手架）

### 使用：

```
npm install create-react-app -g   
把模块安装在全局（目的:可以使用命令），mac电脑安装的时候，前面加sudo

create-react-app 【项目名称】
基于脚手架命令，创建出一个基于React的自动化/工程化项目目录， 和npm发包时候的命名规范一样，项目名称中不能出现： 大写字母、中文汉字、特殊符号（-或者_是可以的）等

```

### 脚手架生成目录中的一些内容

1. node_modules 当前项目中依赖的包都安装在这里
> .bin 本地项目中可执行命令，在package.json的scripts中配置对应的脚本即可，（其中有一个就是：react-scripts命令）

2. public 存放的是当前项目的html页面（单页面应用放一个index.html即可，多页面根据自己需求放置需要的页面）

在react框架中，所有的逻辑都是在js中完成的（包括页面结构的创建），如果想给当前的页面导入一些css样式或者img图片等内容，我们有两种方式：
> 1. 在js中基于es6 module模块规范，使用import导入，这样webpack在编译合并js的时候，会把导入的资源文件等插入到页面的结构中（jsx中，绝对不能在js管控的结构中通过相对目录导入资源../或./，导入资源，因为在webpack编译的时候，地址就不再是之前的相对地址了）
> 2. 如果不想在js中导入（js中导入的资源最后都会基于webpack编译），我们也可以把资源手动的在html中导入，但是html最后也要基于webpack编译，导入的地址也不建议写相对地址，而是使用 %PUBLIC_URL% 写成绝对地址

3. src 项目结构中最主要的目录，因为后期所有的js、路由、组件等都是放到这里面（包括需要编写的css或者图片等）
> index.js 是当前目录的入口文件

4. package.json 当前项目的配置清单；gitignore Git 提交的时候的忽略目录；

基于脚手架生成工程目录，自动帮我们安装了三个模块： react/react-dom/react-scripts

react-scripts集成了webpack需要的内容： babel 一套， css处理的一套， eslint 一套， webpack 一套， 其他的；没有less/sass的处理内容（项目中如果使用less, 我们需要自己额外安装）；

#### 可执行脚本

```
"scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }

```

start 开发预览: 开发环境下，基于webpack编译处理，最后可以预览当前开发的项目成果
> 在webpack中安装了dev-server插件，基于这个插件会自动创建一个web服务 【端口号默认是3000】,按照webpack.config.dev.js 把项目编译


build 打包: 项目需要部署到服务器上， 我们先执行yarn build ，把项目整体编译打包
> 生成一个build文件夹，这个文件夹包含了所有编译后的内容，我们把它上传到服务器即可
> 而且在服务器上进行部署的时候，不需要安装任何模块了（因为webpack已经把需要的的内容都打包到一个js中了），只需要把build中的内容发布即可

eject: create-react-app脚手架为了让结构目录清晰，把安装的webpack及 配置文件都集成在了react-scripts模块中，放到了node_modules中,但是真实项目中，我们需要在脚手架默认安装的基础上，额外安装一些需要的模块： 例如： react-router-dom/axios ... 再比如： less/less-loader...
> 如果需要修改webpack配置，首先需要把隐藏到node_modules 中的配置项暴露到项目中， `yarn eject`
> 一旦暴露后，项目目录中多了两个文件夹：config 和 scripts
> config: 存放的是webpack的配置文件, webpack.config.dev.js 开发环境下的配置项（yarn start),webpack.config.prod.js 生产环境的配置项（yarn build)， path.js 基本配置项（包含项目的入口信息）
> scripts： start.js   yarn start    执行的就是这个js， build.js     yarn  build  执行的就是这个js

#### 修改环境变量

```
set HTTPS=true&&npm start  开启HTTPS协议模式（设置环境变量）

还可以修改端口号什么的

set HTTPS=false&&set PORT=3000&&yarn start


linux下
没set和 &&
HTTPS=true yarn start

```

## react && react-dom

渐进式框架：一种最流行的框架设计思想，一般框架中都包含很多内容，这样导致框架的体积过于臃肿，拖慢加载速度，真实项目中，我们使用一个框架，不一定用到所有的功能，此时我们应该框架的功能进行拆分，用户想用什么，让其自由组合即可

REACT全家桶：react/create-react-app/react-dom/react-router/redux/react-redux/axios/ant/dva/saga/mobx...

```
react: react 框架的核心部分，提供了Component类可以供我们进行组件开发，提供了钩子函数（生命周期函数：所有的生命周期函数其实都是基于回调函数完成的）
react-dom: 把jsx语法（react独有的语法）渲染为真实dom（能够放到页面中展示的结构都叫做真实dom）的组件

```

jsx: react独有语法， javascript + xml(html)

### {} 中的内容

在jsx中出现的{}是存放js的，但是要求js代码执行完成需要有返回结果（js表达式）

### jsx渲染机制

1. 基于babel中的语法解析模块（babel/babel-loader/babel-preset-react-app)把jsx语法编译为React.createElement(...) 结构

> createElement中至少两个参数，没有上限
>第一个：当前元素标签的标签名（字符串）
>第二个：属性（没有给元素设置属性则为null）
>第三个及以后：当前元素的所有子元素内容（只要子元素是html，就会变为新的createElement）

2. 执行React.creatElement(type, props, children), 创建一个对象（虚拟dom），这个对象里面有如下属性：

```
type: "h1"
props: {
	id:'',
	className: '',
	style: ...,
	children: '珠峰培训' => 存放的是元素中的内容（子元素），如果有多个子元素，就以数组的形式存储信息
}
ref: null
key: null
...
__proto__: Object.prtotype


```

3. ReactDOM.render(jsx语法最后生成的对象， 容器)， 基于render方法把生成的对象动态创建为dom元素，插入到指定的容器中

> render渲染的时候，我们需要做处理，首先判断type的类型，如果是字符串，就创建一个元素标签，如果是函数或者类，就是把函数执行，把默认把props（包含里面的children)传递给函数，作为函数的参数（类是挂在实例上），并且把返回的jsx对象创建成新的
>在执行类函数的时候，把函数中render的jsx转换为新的对象（通过create-element), 把这个对象返回； 紧接着render按照以往的渲染方式，创建dom元素，插入到 指定的容器中即可

#### 类声明式组件

基于createElement把jsx转换为一个对象，当render渲染这个对象的时候，遇到type是一个函数或者类，不是直接创建元素，而是先把方法执行：

如果是函数式声明的组件，就把它当做普通方法执行（方法中的this是undefined），把函数返回的jsx元素（也就是解析后的对象）进行渲染

如果是类声明式的组件，会把当前类new它执行，创建类的一个实例（当前本次调取的组件就是它的实例），执行constructor之后，会执行this.render(), 把render中返回的jsx拿过来渲染， 所以“类声明式组件”，必须有一个render方法，方法中返回一个jsx元素


类声明式组件特点：

1. 调取组件相当于创建类的实例（this），把一些私有属性挂载到实例上了，这样组件类内所有方法中都可以基于实例获取这些值（包括：传递的属性和自己管理的状态）
2. 有自己的状态管理，当状态改变的时候，react会重新渲染视图（差异更新：基于domDiff。。。


PROPS特点：

```
1. PROPS接收属性

constructor(props)， 如果给constructor传了props，就可以使用props接受到属性，
如果给super传了props, SUPER(PROPS)：在继承父类私有的时候，就把传递的属性挂载到了子类的实例上，
CONSTRUCTOR中就可以使用THIS.PROPS了，即使在CONSTRUCTOR中不设置形参PROPS接收属性，执行SUPPER的时候也不传这个属性，除了CONSTRUCTOR中不能直接使用THIS.PROPS，其它生命周期函数中都可以使用

2. THIS.PROPS是只读的

```

与标准类不同的地方
1. 标准类{}中是不能直接设置类与类原型的普通属性的，而react中可以,这是因为webpack中做了相关编译处理
2. 标准类中原型上的方法不可以直接使用箭头函数，react中可以，而且箭头函数中的this指向当前实例，而且为了让我们在类中写的方法中的this指向实例，我们一般都使用箭头函数

## 面试专项

react16: 旧版本，类时代

react17:过渡版本，官方发布日志称react17最大的特点就是无新特性，这个版本主要目标是让React能渐进式升级，它允许多版本混用共存，可以说是为更远的未来版本做准备了。

v17 和 v18 的区别就是：从同步不可中断更新变成了异步可中断更新，v17可以通过一些试验性的API开启并发模式，而v18则全面开启并发模式。

### state  合并更新（批处理）

可能以后都不会问state 相关的问题了，没啥区别了
> 18版本之前, 在合成事件之外的原生事件中(例如 setTimeout, onclick, promise) , 更新状态并不会进行批量处理, 18版本优化了这个问题，都会做批量处理了

旧版（ReactDOM.render）： class 组件里，状态合并异步更新。同步打印不能取到最新的值，一样的状态属性设置两次后面的会覆盖前面的。

新版(ReactDOM.createRoot)：用createRoot就开启了并发模式（新版默认），允许在获取数据的过程中去渲染界面， 不像以前必须拿到数据才能去渲染界面。渲染可以中断，可以根据优先级去暂停，比如用户的交互可以暂停阻塞渲染， 用户交互完了，可以继续渲染。
render 阶段把需要更新的收集起来，这个过程是可以被打断的，commit 阶段就是把那些差异点更新到dom上

比如如下代码再旧版里打印： 0,0,2,3; 在新版里打印  0, 0,1,1 （不开启StrictMode的情况下打印结果, 在原生定时器里的也会批量更新）， 开启StrictMode 会走两遍（这种的结果不用关心），第一遍是检查作用，第一遍打印 0,0,0,0   第二遍打印1,1,1,1

开启StrictMode hooks函数组件在开发环境会走两遍（生产环境只会走一次）： 因为render 阶段是可中断的，被打断然后恢复，一个组件可能会渲染两遍，有可能会产生bug，为了让开发者提前发现可能存在的问题，默认开发阶段就会渲染两遍。一般写库的时候会开，开发业务可以不开，开启这个后，代码表现可能有点反常识。



```
import React from 'react'

class C extends React.Component {
  state={
    val: 0
  }

  componentDidMount(){
    this.setState({val: this.state.val + 1});
    console.log(this.state.val, 'a');

    this.setState({val: this.state.val + 1});
    console.log(this.state.val, 'b');

    setTimeout(()=>{
      this.setState({val: this.state.val + 1});
      console.log(this.state.val, 'c');

      this.setState({val: this.state.val + 1});
      console.log(this.state.val, 'd');
    })
  }

  render(){
    return null;
  }
}

// 0, 0, 1, 1


```

#### setState

setState 是同步还是异步？setState 本身既不是同步也不是异步，而是批量结算state, 开始都推入队列里（数组里），然后开启一个微任务（queueMicrotask）去结算，队列里的state; 如果要同步结算，就不需要推入队列里，直接结算就好了。


react setState 后有个调度，用的微任务
渲染阶段有个调度，用的MessageChannel

### hooks

effects  return 的清除副作用函数什么时候执行，每次依赖变更后都会执行，页面卸载也会执行

### hooks 常见问题

#### 1. 闭包陷阱

我们把每一次渲染，被外界持有变量就会形成闭包：比如绑定事件，定时器，持有变量的那一次闭包（一般是第一次），会一直不销毁；

破闭包陷阱的方法：

1. 用ref

```
const obj = useRef();
obj.current = stateVal;  // 让ref 去持有你的状态变量，那么这个ref因为类似一种全局变量，只要你的state更新了，他永远可以拿到最新的状态; 每次渲染都会重新给obj.current 赋值最新的； 定时器里直接拿到的状态值是闭包里的（定时器定义时的），用obj.current引用的就是最新的；

```
2.  加依赖，依赖变化，重新定义定时器，或者绑定事件，重新取值, 不过性能消耗大， 只限于在hook里想拿最新状态
3. 给setState 改状态的函数传参，只限于在修改状态(setState)时需要拿到最新状态


简单理解： 

useEffect 中，每一个effect 版本“看到”值都来自于它属于的那次渲染（如果用到定时器，那么定时器看到的值就是挂载时的变量值）。如果要取到最新的需要把用到的变量加入到依赖里；

从源码理解：

前情： 

在 React 中，class 组件可以使用 this.state 和 this.setState 来管理组件的状态，这是因为 class 组件具有实例，可以将状态存储在实例属性中。

而函数组件则没有实例，无法将状态存储在实例属性中。为了解决这个问题，React 引入了 React Hooks，比如useState， useState 是通过闭包来实现的。

当我们调用 useState 时，它会返回一个数组，其中第一个元素是当前状态的值，第二个元素是更新状态的函数。

当我们在组件内部调用 setCount 函数时，React 会在内部使用闭包来访问和更新 count 变量。

> 因为count 变量无法存储在实例属性中， 调用setCount 函数时又需要访问 count 变量， 所有React 使用了闭包，将 count 变量保存在内部函数中

当组件重新渲染时，React （hook?）会创建一个新的闭包，并将 count 变量的值更新为新的状态值。这个新的闭包会在下一次调用 setCount 函数时被使用。

原理：

```
const hookStates = [];
let hookIndex = 0;
​
const useState = (init) => {
  hookIndex++;
  hookStates[hookIndex] = hookStates[hookIndex] || init;
  const setState = (newState) => {
      hookStates[hookIndex] = newState;
      // 然后开始进入更新应用逻辑
      ...
    }
  return [hookStates[hookIndex], setState];
}


伪代码模拟：

const com = () => {
  let fn;
  const ref = {
    c: null,
  }
 for(let i =0;i<5;i++){
  ref.c = i;
  if(i===0){
    fn = () =>{
      console.log(i, ref.c);
    }
  }
 }
 return fn;
}


```

源码里,hooks状态是存在函数组件对应的fiber节点上，也不是用数组存储，是用链表来存储hook的相关信息，顺序呢，就是每次找当前节点的next就好了



#### 2. 状态改变后（dom变更后）需要立即去做某件事

状态改变后立即去做某件事, 类似于下面的逻辑，在hooks时代怎么实现

```
class C extends React.Component {
  state={
    val: 0
  }
  
  componentDidMount(){
   this.setState({
    a:1,
   },()=>{
    console.log(window.innerWidth);
    console.log(this.state.a)
   })
  }

  render(){
    return null;
  }
}

```

1. 用useLayoutEffect（dom更新后， 界面渲染前）,把状态作为依赖
  - 0. useEffect: 组件挂载完成后，  vdom 更新 ==> dom 更新 ==> useEffect
  - 1. useLayoutEffect: 组件vdom更新后， vdom更新 ===> useLayoutEffect ==> dom更新
    - 避免界面闪动

2. 用flushSync， 会在dom更改后再执行后面的代码，这个api不能跨端（比如在 react native 里没有），是放在react-dom(不是react-dom/client)里的，不过pc用足够了
>  react18的更新，flushSync 同步更新 dom，此函数接受回调函数，在回调内的状态更新, 此函数过后dom 更新，能获取最新状态，
> 注意如果是在事件，或者定时器里取最新状态会收到闭包的影响，要用ref破闭包

```
function App() {

  const [count, setCount] = useState(1);
  const obj = useRef();
  obj.current = count;
  

  return (
    <div className="App" style={{border: 'solid 1px red', height:'500px'}} onClick={()=>{
      flushSync(()=>{
        setCount(2)
        console.log(count, '同步内打印1, dom 还没改，无法立即获取最新状态2', obj.current)
      });
      // 到这里，dom 已经更新
      console.log(count, '同步后打印2,dom已经改变， 可用ref破闭包获取最新状态', obj.current) 
      // 注意这里count打印1, 是因为闭包的原因， 在事件里去打印状态会被闭包影响
      // 如果不想影响用ref去存状态值，用ref去取值能取得到最新的
      setCount(3);
      console.log(count, '异步后打印2,状态还未更改，无法立即获取最新状态3', obj.current)
    }}>
      <C/>
    </div>
  );
}

打印结果：

1 '同步前打印'
1 '同步内打印1, dom 还没改，无法立即获取最新状态2' 1
1 '同步后打印2,dom已经改变， 可用ref破闭包获取最新状态' 2
1 '异步后打印2,状态还未更改，无法立即获取最新状态3' 2

```
3. 用useEffect, 把状态作为依赖，不过是在下一次更新时（界面渲染后），不能在本次立即拿到

#### 3. 撕裂

伯约也没找到合理的案例，触发概率不详，所以面试其实也很难提问：可以先不深究

就是知道大概在hooks时代，用外置状态比如redux, mobx,
由于函数组件可能会多次执行（因为render 渲染节点可中断恢复），造成组件内部状态和外部状态不统一。

这对redux等状态库是个挑战，因为公共库必须考虑更多的东西。

### 说说对react的理解

react 官网说是用于构建 Web 和原生交互界面的库。
> 是一个网页ui框架，通过组件化方式解决视图层开发复用问题，本质是一个组件化框架。

它的核心设计思路有三点，分别是声明式，组件化，与通用性。

声明式的优势在于直观与组合。

组件化的优势在于视图的拆分与模块复用，可以更容易做到高内聚，低耦合。

通用性在于一次学习，随处编写，比如React Native等，这里主要靠虚拟dom来实现。

这使得react 适用范围变得足够广，无论web, Native, Vr， 甚至shell 应用都可以进行开发，这也是react的优势。
> 优势后，可以承接一下对于react 优势的看法，对虚拟dom的看法
> 也可以向自己主导过的项目上引导，谈谈react相关的工程架构与设计模式

但作为一个视图层的框架，react劣势也十分明显，它并没有提供完整的一揽子解决方案，在开开发大型前端应用时，需要向社区寻求并整合
解决方案。虽然一定程度上促进了社区的繁荣，但也为开发者在技术选型上和学习适用上造成一定成本。

### 说说对jsx 的理解

jsx是js的语法拓展

在react 中并不强制使用jsx, 即便使用了也会在构建的过程中通过babel 插件编译为React.createElement, jsx其实就是React.createElement的语法糖

所以从这里可以看出，react团队并不想引入js以外的开发体系，而是通过合理的关注点分离，保持组件开发的纯粹性

>关注点分离： 在计算机科学中，将代码分割成不同部分的设计原则，是面向对象程序设计的核心概念。
>关注点分离的价值在于简化开发和维护，当关注点分开，各部分可以重复使用，独立开发和更新，修改代码时无需知道其他部分的细节。

方案对比：

方案1：模版，react团队认为引入模版是一种不佳的实现，因为引入了更多的概念，比如新的模版语法，模版指令等。

方案2： jsx, jsx并不会引入太多的概念，它仍然是js，连循环，条件表达式都是js, 代码更简洁，更具可读性，代码提示友好。

方案3：模版字符串，开发起来结构描述更复杂，代码提示也会变得困难


#### 可能会追问babel 插件如何实现jsx到js的编译

答案在： 伯约 02，03， 里为什么使用jsx里，末尾部分 todo

大概是babel读取代码（jsx）生成ast， 再将ast传入插件转换成react.creatElement 的结构

### 如何设计react 组件

这个问题有点玩概念，暂时不管这个吧；

一个主题，多个场景。 

无状态组件（展示组件）：只做展示，独立运行，不额外增加功能
有状态组件： 处理业务逻辑与数据状态

无状态组件复用性更强，有状态组件更专注于业务本身。

展示组件：

1. 代理组件
2. 样式组件
3. 布局组件


高阶组件：

逻辑复用： react 中复用逻辑的高级技术，高阶组件是参数组件，返回值为新组件的函数， 其实就是装饰器。
渲染劫持： 通过控制render 函数，控制渲染内容


### react 流程原理

总的理解：

react 和 vue 都是基于 vdom 的前端框架，之所以用 vdom 是因为可以精准的对比关心的属性，而且还可以跨平台渲染。

但是开发不会直接写 vdom，而是通过 jsx 这种接近 html 语法，编译产生 render function，执行后产生 vdom。

vdom 的渲染就是根据不同的类型来用不同的 dom api 来操作 dom。

渲染组件的时候，如果是函数组件，就执行它拿到 vdom。class 组件就创建实例然后调用 render 方法拿到 vdom。vue 的那种 option 对象的话，就调用 render 方法拿到 vdom。

组件本质上就是对一段 vdom 产生逻辑的封装，函数、class、option 对象甚至其他形式都可以。

react 和 vue 最大的区别在状态管理方式上，vue 是通过响应式，react 是通过 setState 的 api。我觉得这个是最大的区别，因为它导致了后面 react 架构的变更。

react 的 setState 的方式，导致它并不知道哪些组件变了，需要渲染整个 vdom 才行。但是这样计算量又会比较大，会阻塞渲染，导致动画卡顿。

所以 react 后来改造成了 fiber 架构，目标是可打断的计算。

为了这个目标，不能边对比变更新 dom 了，所以把渲染分为了 render 和 commit 两个阶段，render 阶段通过 schedule 调度来进行 reconcile，也就是找到变化的部分，创建 虚拟dom，打上增删改的 tag，等全部计算完之后，commit 阶段一次性更新到 dom。

打断之后要找到父节点、兄弟节点，所以 vdom 也被改造成了 fiber 的数据结构，有了 parent、sibling 的信息。

所以 fiber 既指这种链表的数据结构，又指这个 render、commit 的流程。

reconcile 阶段每次处理一个 fiber 节点，处理前会判断下 shouldYield，如果有更高优先级的任务，那就先执行别的。

commit 阶段不用再次遍历 fiber 树，为了优化，react 把有 effectTag 的 fiber 都放到了 effectList 队列中，遍历更新即可。

在dom 操作前，会异步调用 useEffect 的回调函数，异步是因为不能阻塞渲染。

在 dom 操作之后，会同步调用 useLayoutEffect 的回调函数，并且更新 ref。

所以，commit 阶段又分成了 before mutation、mutation、layout 这三个小阶段，就对应上面说的那三部分。

我觉得理解了 vdom、jsx、组件本质、fiber、render(reconcile + schedule) + commit(before mutation、mutation、layout)的渲染流程，就算是对 react 原理有一个比较深的理解了。


“React 如何模拟 requestIdleCallback”，这问题本来就很奇怪，React 根本就无法模拟，React怎么知道浏览器空闲时间？无法知道。它简单来说就是类似函数节流一样，将时间无脑的分片成5ms，5ms一过就停止任务的执行，让出线程。剩余任务放到下一个宏任务，继续5ms一个分片执行。


### 说说虚拟dom

虚拟dom 的工作原理是js对象模拟dom的节点。

初期是为了提高代码抽象能力，避免人为的dom操作，降低代码整体风险（防xss攻击）。

React.createElement 执行后会返回会返回一个objec 对象，他会描述自己的type类型，props属性，以及children 情况等，
这些object通过树形结构组成一颗虚拟dom树，当状态发生变更时将变更前后虚拟dom树，将变更前后的虚拟dom树进行差异比较，这个过程
称为diff,生成的结果称为patch, 计算之后会渲染patch 完成对真实dom的操作。

虚拟dom的优点主要有三点：

1. 改善大规模操作的性能
2. 规避xss风险
3. 较低的成本实现跨平台开发

缺点：
1. 内存占用高
2. 因为需要模拟整个网页的真实dom, 高性能运用场景，存在难以优化的情况


处理渲染页面，虚拟dom 还有哪些应用场景呢？

比如： 记录真实的dom变更，它甚至可以用于埋点统计与数据记录等，类似rrweb

## 说说dom diff


方向： diff 主要说思路方向，关键节点，扣细节，扣具体过程没必要，也很难说明白。这么多年陷入了一个源码思维，沉迷在冗杂繁琐的困难细节中，其实是走入歧途了。 细节过程在面试中会用算法考，询问的时候其实就是交流思路方向，关键节点和注意事项。在diff 算法中我们只需要描述大的策略即可，因为细节很难用语言表达清楚，策略包括:
**三个优化策略，可以说diff数组children 中小的策略, 以及和vue的区别**；

diff 算法探讨的是虚拟dom树发生变化后生成dom树更新补丁的方式，通过对比新旧两个dom树的变更差异，将更新补丁作用于真实dom, 以最小的成本完成视图更新。

所以diff 是一个这样的过程，触发更新，生成补丁，应用补丁，react diff 算法触发更新的时机主要在 state 变化后，
此时触发虚拟dom 变更遍历，采用深度优先的算法，传统的遍历方式效率较低，为了优化效率采用分治的方式，将单一节点比对，
转化为三种类型节点的比对，分别是树，组件，元素。

树比对，由于网页视图中较少有夸层级的节点移动，两颗虚拟dom树只对同一层级的节点进行比对。
组件比对，如果组件是同一类型则进行树比对，如果不是则直接放入补丁中
元素比对，主要发生在同层级中，通过标记节点操作生成补丁，节点操作对真实的dom操作

以上是经典的react dom diff 内容，自react 16起，引入了fiber 架构，为了使整个过程可随时暂停恢复， 节点与树分别采用了FiberNode 和 FiberTree 进行重构， fiberNode 采用了双链表的结构，可以直接找到兄弟节点，与子节点，整个更新过程由current 与 workInProgress 两颗树双缓冲完成，当workInProgress 更新完成后，通过修改current 相关
指针指向的节点

如何根据react diff 算法原理优化代码？

1. 尽量避免跨层级节点移动，
2. 设置唯一的key进行优化
3. 尽量减少组件层级深度，过深的层级会加深遍历深度，带来性能问题


具体流程为：
1. 真实dom映射为虚拟dom
2. 当虚拟dom发生变化后，根据差异计算生成patch, patch是结构化数据，包含增加，更新，移除等
3. 根据patch去更新真实dom, 反馈到用户界面上

更新时机： 触发更新，进行差异对比的时机，state以后

遍历算法： react diff算法 采用深度优先遍历的算法（广度优先遍历的算法会让react生命周期错乱）。

优化策略： react 对diff算法做的优化

虽然深度优先遍历的算法保证了组件的生命周期不错乱， 但传统的diff算法带来了一个严重的性能瓶颈，时间复杂度为O(n^3),
其中n表示树的节点总数，react 使用了一个经典的手法将复杂度降低为O(n), 这个方法就是分治，通过“分而治之”的思想分解问题。

### diff 策略

从树，组件，元素，三个层面进行分治，加**了三个策略**：

1. 忽略节点跨层级操作场景（只对同级元素进行Diff），提升对比效率
  > 需要进行 树比对，对树进行分层比对，两颗树只对同一层次节点进行比较，如果发现节点已经不存在，则该节点及其子节点都会被直接删除
2. 如果组件的class 一致， 则默认为有相似的树结构，否则默认为不同的树结构（两个不同类型的元素会产生出不同的树）
  > 在组件比对的过程中，如果组件是同一类型则进行树比对，如果不是则直接放入补丁中，只要父组件类型不同就会重新渲染
3. 同一层级的子节点可以通过标记key的方式进行列表对比
  > 元素比对主要发生在同层级间，通过标记节点操作生成补丁，节点操作包含插入，移动，删除等，其中节点重新排序性能消耗最大，
  > 此时策略3起到重要的作用，通过标记key的方式，react 可以直接移动dom节点，降低内耗

fiber 对diff 算法带来的影响：

fiber 机制下节点与树分别采用了FiberNode 和 FiberTree 进行重构

fiber机制下整个更新过程由current 与 workInProgress 两颗树双缓冲完成， 当workInProgress 更新完成后，通过修改current 相关指针指向的节点，直接抛弃老树


对于同一层的子元素为数组的diff策略：

React团队发现，在日常开发中，相较于新增和删除，更新组件发生的频率更高。所以Diff会优先判断当前节点是否属于更新。
所以， **子元素为数组的Diff的整体逻辑会经历两轮遍历**：

第一轮遍历：处理更新的节点。

> 从索引0开始遍历newChildren， 同时从子元素第一个oldFiber开始，用sibling 同时遍历老节点，如果遇到不可复用的或者新旧有一个遍历完了，则结束第一轮遍历（key或type不同）

第二轮遍历：处理剩下的不属于更新的节点。
> 结束第一轮遍历时，newChildren与oldFiber，有四种情况，同时遍历完（1种），一个遍历完，一个没遍历完（两种），这三种好处理，最后一种：newChildren与oldFiber都没遍历完，意味着有节点在这次更新中改变了位置，这是Diff算法最精髓也是最难懂的部分（其实很难用语言描述明白，面试就不用讲，如果想了解看：https://react.iamkasong.com/diff/multi.html#%E7%AC%AC%E4%BA%8C%E8%BD%AE%E9%81%8D%E5%8E%86）
> 将所有还未处理的oldFiber存入以key为key，oldFiber为value的Map中,接下来遍历剩余的newChildren，通过newChildren[i].key就能在existingChildren中找到key相同的oldFiber,然后去标记节点是否移动就行了


todo ===> tag 打在哪里？ oldfiber,newChildren,还是newFiber

vue 的 diff 和react diff 整体思路相同，但在元素对比时，如果新旧两个元素是同一元素，且没有设置key时，
vue 在diff子元素时，会一次性对比旧节点，新节点以及他们的首尾元素四个节点，以验证列表是否有变化

vue的列表比对，采用从两端到中间的比对方式，而react则采用从左到右依次比对的方式。当一个集合，只是把最后一个节点移动到了第一个，react会把前面的节点依次移动，而vue只会把最后一个节点移动到第一个。总体上，vue的对比方式更高效。
> react newChildren中每个组件进行比较的是current fiber，同级的Fiber节点是由sibling指针链接形成的单链表，即不支持双指针遍历。


### 说一说react渲染流程

react 的渲染过程大致一致，但是协调并不相同，以react16为分界线，分为stackReconciler 和 fiberReconciler,这里的协调从狭义上来讲，特指react的diff算法，广义上来讲也指react的 Reconciler模块，它通常包含了diff算法和一些公共逻辑。

stackReconciler的核心调度方式是递归，调度的基本处理单位是事务，它的事务基类是transtion, 这个事务参照后端事务的概念，在react16以前，
挂载主要靠react mount模块完成，更新通过react update模块完成，模块之间相互分离，落脚执行点是事务。

在react16及以后，协调改为了fiberReconciler。 它的调度方式主要有两个特点，第一个是协作式多任务模式，在这个模式下线程会定时放弃自己的运行权，交还给主线程，通过requestIdleCallback 实现（兼容性不好，react自己实现了类似机制用的是MessageChannel）。 第二个特点是策略优先级，调度任务通过标记tag的方式，分优先级执行，比如动画，或者标记为high 的任务可以优先执行。

fiberReconciler的基本执行单位是fiber, fiber 基于过去的reactElement 进行了二次封装，提供了指向父子
兄弟节点的引用，为diff工作的双向链表提供了实现基础。在新的架构下整个生命周期被划分为render 和 commit 两个阶段。

render阶段的执行特点是可中断，可停止，无副作用，主要是通过构造workInProgress 树，计算出diff, 以current树为基础，将每个fiber作为一个基本单位，自下而上的逐个节点检查并构造workInProgress 树， 这个过程不在是递归，而是基于循环来完成，在执行上通过requestIdleCallback来调度执行每组任务，每组的每个计算任务被称为work,每个work完成后确认是否有优先级更高的work需要插入，如果有就让位，没有就继续。

优先级通常是标记为动画或者high的先处理，每完成一组后将调度权交还给主线程，直到下一次requestIdleCallback调用
再继续构建workInProgress树。在commit阶段需要处理effects列表，effects包含了根据diff更新dom树，回调生命周期，这个阶段是同步执行的不可中断。

如果只是一般页面，比如后台管理两者性能差距并不大，但在动画 场景下，stackReconciler的设计会占用主线程，造成卡顿，而fiberReconciler的设计则能带来高性能的表现。


### 另一个版本的渲染流程

参考这一篇文章，写的太好了，可以全文记忆： https://juejin.cn/book/6945998773818490884/section/6959902333199351816

#### fiber 的更新机制：

1. 初始化

```

1. 第一步：创建fiberRoot和rootFiber

 创建fiberRoot（整个 React 应用的根基）和rootFiber（通过 ReactDOM.render 渲染出来的）。一个 React 应用可以有多 ReactDOM.render 创建的 rootFiber ，但是只能有一个 fiberRoot（应用根节点）。第一次挂载的过程中，会将 fiberRoot 和 rootFiber 建立起关联， 让fiberRoot的current指向rootFiber。

image.png

2. 第二步：workInProgress和current。

workInProgress：正在内存中构建的 Fiber 树称为 workInProgress Fiber 树。在一次更新中，所有的更新都是发生在 workInProgress 树上。在一次更新之后，workInProgress 树上的状态是最新的状态，那么它将变成 current 树用于渲染视图。

current：正在视图层渲染的树叫做 current 树。

接下来会到 rootFiber 的渲染流程，首先会复用当前 current 树（ rootFiber ）的 alternate（候补者） 作为 workInProgress，如果没有 alternate （初始化的 rootFiber 是没有 alternate ），那么会创建一个 fiber 作为 workInProgress。

让他们的alternate属性相互指向彼此，建立workInProgress 与 current的关联。这个关联过程只有初始化第一次创建 alternate 时候进行。 


3. 第三步：深度调和子节点，渲染视图

接下来会按照上述第二步，在新创建的 alternates 上，完成整个 fiber 树的遍历，包括 fiber 的创建。
最后会以 workInProgress 作为最新的渲染树，fiberRoot 的 current 指针指向 workInProgress 使其变为 current Fiber 树。到此完成初始化流程。

```

2. 更新

```
如果对于上述初始化，开发者点击一次按钮发生更新，接下来会发生什么呢?

重新创建一颗 workInProgresss 树，复用当前 current 树上的 alternate ，作为新的 workInProgress，
，由于初始化后的 rootfiber 有 alternate ，所以对于剩余的子节点，React 还需要创建一份，，和 current 树上的 每个fiber节点 建立起 alternate 关联。渲染完毕后，workInProgresss 再次变成 current 树。


如果如上又发生一次点击，会发生什么？

如果进行下一次更新，那么会将 current 的 alternate（也就是旧树） 作为基础，复制一份作为 workInProgresss ，然后进行更新。


```

双缓冲树：

在内存中构建并直接替换的技术叫做双缓存。

React 用 workInProgress 树(内存中构建的树) 和 current (渲染树) 来实现更新逻辑。

canvas 绘制动画的时候，如果上一帧计算量比较大，导致清除上一帧画面到绘制当前帧画面之间有较长间隙，就会出现白屏。为了解决这个问题，canvas 在内存中绘制当前动画，绘制完毕后直接用当前帧替换上一帧画面，由于省去了两帧替换间的计算时间，不会出现从白屏到出现画面的闪烁情况。这种在内存中构建并直接替换的技术叫做双缓存。

React 用 workInProgress 树(内存中构建的树) 和 current (渲染树) 来实现更新逻辑。双缓存一个在内存中构建，一个渲染视图，两颗树用 alternate 指针相互指向，在下一次渲染的时候，直接复用缓存树做为下一次渲染树，上一次的渲染树又作为缓存树，这样可以防止只用一颗树更新状态的丢失的情况，又加快了 DOM 节点的替换与更新。


#### fiber reconciler 的两大阶段： render 与 commit

render 阶段和 commit 阶段是整个 fiber Reconciler 的核心.

1. render阶段

```
function workLoop (){
    while (workInProgress !== null ) {
      workInProgress = performUnitOfWork(workInProgress);
    }
}

```
每一个 fiber 可以看作一个执行的单元，在调和过程中，每一个发生更新的 fiber 都会作为一次 workInProgress 。那么 workLoop 就是执行每一个单元的调度器，如果渲染没有被中断，那么 workLoop 会遍历一遍 fiber 树。 performUnitOfWork 包括两个阶段 beginWork 和 completeWork 。

```
function performUnitOfWork(){
    next = beginWork(current, unitOfWork, renderExpirationTime);
    if (next === null) {
       next = completeUnitOfWork(unitOfWork);
    }
}

```

beginWork：是向下调和的过程。就是由 fiberRoot 按照 child 指针逐层向下调和，期间会执行函数组件，实例类组件，diff 调和子节点，打不同effectTag。

completeUnitOfWork：是向上归并的过程，如果有兄弟节点，会返回 sibling兄弟，没有返回 return 父级，一直返回到 fiebrRoot ，期间可以形成effectList，对于初始化流程会创建 DOM ，对于 DOM 元素进行事件收集，处理style，className等。

这么一上一下，构成了整个 fiber 树的调和。


总结beginWork 作用如下:

对于组件，执行部分生命周期，执行 render ，得到最新的 children 。
向下遍历调和 children ，复用 oldFiber ( diff 算法)，diff 流程在第十二章已经讲过了。
打不同的副作用标签 effectTag ，比如类组件的生命周期，或者元素的增加，删除，更新。

常用的 effectTag ：

```
export const Placement = /*             */ 0b0000000000010;  // 插入节点
export const Update = /*                */ 0b0000000000100;  // 更新fiber
export const Deletion = /*              */ 0b0000000001000;  // 删除fiebr
export const Snapshot = /*              */ 0b0000100000000;  // 快照
export const Passive = /*               */ 0b0001000000000;  // useEffect的副作用
export const Callback = /*              */ 0b0000000100000;  // setState的 callback
export const Ref = /*                   */ 0b0000010000000;  // ref

```

向上归并 completeUnitOfWork:

首先 completeUnitOfWork 会将 effectTag 的 Fiber 节点会被保存在一条被称为 effectList 的单向链表中。在 commit 阶段，将不再需要遍历每一个 fiber ，只需要执行更新 effectList 就可以了。

completeWork 阶段对于组件处理 context ；对于元素标签初始化，会创建真实 DOM ，将子孙 DOM 节点插入刚生成的 DOM 节点中；会触发 diffProperties 处理 props ，比如事件收集，style，className 处理


2. commit 阶段

commit 阶段做的事情是：

一方面是对一些生命周期和副作用钩子的处理，比如 componentDidMount ，函数组件的 useEffect ，useLayoutEffect ；

另一方面就是在一次更新中，添加节点（ Placement ），更新节点（ Update ），删除节点（ Deletion ），还有就是一些细节的处理，比如 ref 的处理。

总体来说，主要做的事就是执行effectList，更新DOM，执行生命周期，获取ref等操作。

commit 细分可以分为：

Before mutation 阶段（执行 DOM 操作前）： 会异步调用 useEffect ，在生命周期章节讲到 useEffect 是采用异步调用的模式，其目的就是防止同步执行时阻塞浏览器做视图渲染。
mutation 阶段（执行 DOM 操作）： 置空 ref 。对新增元素，更新元素，删除元素。进行真实的 DOM 操作。
layout 阶段（执行 DOM 操作后）： 对于函数组件会执行 useLayoutEffect 钩子。


### react18

react17是过渡版本。

react18最大的特点是Concurrent, 并发并行。

Concurrent并不是API之类的新特性，但是呢，它很重要，因为它是React18大部分新特性的实现基础，包括Suspense、transitions、流式服务端渲染等。


Concurrent（并行） 最大的特点就是：渲染是可以中断的。 做到渲染是可以中断的，就需要依赖fiber, fiber本身是链表结构，利用它的指针就可以记录任务在哪里中断的。

Concurrent模式下有一些特点：


遗弃：

Concurrent模式下，有些update可能会被遗弃掉。因为用户不关心过程中的ui变化，只关心自己想要的结果。 比如在一个模糊搜索里，
我搜老人与海，我输入老人时， 这个结果并不重要， 这时模糊查询框'老人'对应的ui的update相对于input的update就是低优先级的。
在react18中这个模糊查询的相关ui可以被当做transition


状态的复用：

Concurrent模式下，还支持状态的复用。某些情况下，比如用户走了，又回来，那么上一次的页面状态应当被保存下来，而不是完全从头再来。目前，React正在用Offscreen组件来实现这个功能。

另外，使用OffScreen，除了可以复用原先的状态，我们也可以使用它来当做新UI的缓存准备，就是虽然新UI还没登场，但是可以先在后台准备着嘛，这样一旦轮到它，就可以立马快速地渲染出来。


与react17，16的区别：

+ 创建一个初次渲染或者更新，以前我们用的是ReactDOM.render，现在改用react-dom/client中的createRoot
+ 批量更新。 以前： setState 在promises、setTimeout或者原生事件中是同步更新的，批量更新是依赖于合成事件的。 现在： 无论在哪里setState都是批量更新，state的批量更新不再与合成事件有直接关系，而是自动批量处理。

> setState批量处理，但是如果你有一些其它理由或者需要应急，想要同步setState，这个时候可以使用flushSync

+ suspense ,Suspense 让组件‘等待’异步操作，异步请求结束后在进行组件的渲染，也就是所谓的异步渲染。以前一般这种情况会写if xx 返回组件，否则返回loading;


Suspense 是组件，有一个 fallback 属性，用来代替当 Suspense 处于 loading 状态下渲染的内容，Suspense 的 children 就是异步组件

现在的异步请求方式比较繁琐，主要是是通过类组件 componentDidMount 或者函数组件 useEffect 进行数据交互，获得数据后通过调用 setState 或 useState 改变 state 触发视图的更新。

传统模式：挂载组件-> 请求数据 -> 再渲染组件。
异步模式：请求数据-> 渲染组件。

那么异步渲染相比传统数据交互相比好处就是：

不再需要 componentDidMount 或 useEffect 配合做数据交互，也不会因为数据交互后，改变 state 而产生的二次更新作用。
代码逻辑更简单，清晰。


流程：

Suspense 让子组件在渲染之前进行等待，并在等待时显示 fallback 的内容
Suspense 内的组件子树比组件树的其他部分拥有更低的优先级

整个 render 过程都是同步执行一气呵成的，但是在 Suspense 异步组件情况下允许调用 Render => 发现异步请求 => 悬停，等待异步请求完毕 => 再次渲染展示数据。

在 render 函数中可以使用异步请求数据

react 会从我们的缓存中读取

如果缓存命中，直接进行 render

如果没有缓存，会抛出一个 promise 异常

当 promise 完成后，react 会重新进行 render，把数据展示出来

完全同步写法，没有任何异步 callback




Suspense原理：

Suspense 在执行内部可以通过 try{}catch{} 方式捕获异常，这个异常通常是一个 Promise ，可以在这个 Promise 中进行数据请求工作，Suspense 内部会处理这个 Promise ，Promise 结束后，Suspense 会再一次重新 render 把数据渲染出来，达到异步渲染的效果。

渲染错误边界：static getDerivedStateFromError()

React 组件渲染过程如果有一个环节出现问题，就会导致整个组件渲染失败，那么整个组件的 UI 层都会显示不出来，这样造成的危害是巨大的，如果越靠近 APP 应用的根组件，渲染过程中出现问题造成的影响就越大，有可能直接造成白屏的情况。

为了防止渲染异常情况 React 增加了 componentDidCatch 和 static getDerivedStateFromError() 两个额外的生命周期，去挽救由于渲染阶段出现问题造成 UI 界面无法显示的情况。

React更期望用 getDerivedStateFromError 代替 componentDidCatch 用于处理渲染异常的情况。

getDerivedStateFromError 是静态方法，内部不能调用 setState。getDerivedStateFromError 返回的值可以合并到 state，作为渲染使用。用 getDerivedStateFromError 处理渲染异常，来降级UI渲染。


```

但当我们用 Suspense 时, 如何捕获错误呢？ 

每当使用 Promises，大概率我们会用 catch() 来做错误处理。但当我们用 Suspense 时，我们不等待 Promises 就直接开始渲染，loading已经渲染到界面了，这时 catch() 就不适用了

在 Suspense 中，获取数据时抛出的错误和组件渲染时的报错处理方式一样——你可以在需要的层级渲染一个错误边界组件来“捕捉”层级下面的所有的报错信息。利用类组件的生命周期 static getDerivedStateFromError

class MyErrorBoundary extends Component {
  state = {
    error: null,
  };

  static getDerivedStateFromError(error) {
    // 更新 state，下次渲染可以展示错误相关的 UI
    return { error: error };
  }

  render() {
    if (this.state.error) {
      // 渲染出错时的 UI
      return <p>Something broke</p>;
    }
    return this.props.children;
  }
}
 
```

用法：

在 React 18 中，虽然仍然可以使用useEffect来完成一些事情，如使用 API 接口读取的数据填充状态，但实际上不应该将其用于此类目的

嗯， 目前似乎是需要和React.lazy 配合使用


+ transition。 
   
react 把update 分为两种，一种是紧急更新（urgent），默认是这一种，比如用户交互，如点击，输入。 
另一种是过渡更新(transition)，比如ui从一个视图向另一个视图更新，这种更新用户不着急看到，优先级就没有那么高。

在视图更新的时，startTransition 能够保持页面有响应，这个 api 能够把 React 更新标记成一个特殊的更新类型 transitions(过渡更新) ，在这种特殊的更新下，React 能够保持视觉反馈和浏览器的正常响应

解决的问题：

一种数据量大，DOM 元素节点多的场景, 一次更新带来的变化可能是巨大的，所以频繁的更新,浏览器要执行大量的渲染工作，所以给用户感觉就是卡顿。

可以说 React 18 更青睐于良好的用户体验。从 concurrent Mode 到 suspense 再到 startTransition 无疑都是围绕着更优质的用户体验展开。


startTransition可以用在任何你想更新的时候。但是从实际来说，以下是两种典型适用场景：

渲染慢：如果你有很多没那么着急的内容要渲染更新。(我理解是，你觉的这个过渡更新的界面或者部分界面，用户不在意看没看到，或者不在意慢一点看到，比如loading界面，就可以用transition, 用 startTransition 接收你的状态更新函数，在一些比较快的设备上用户就看不到这个过渡界面，保证了ui的连续性；)
网络慢：如果你的更新需要花较多时间从服务端获取。这个时候也可以再结合Suspense。

- transition 有几个相关的api: startTransition, useTransition, useDeferredValue

 transitions 并没有减少渲染次数，只是低优先级去更新。

```
useTransition 是一个让你在不阻塞 UI 的情况下来更新状态的 React Hook, 将状态更新标记为非阻塞转换状态。标记为转换状态的状态更新将被其他状态更新打断。例如，如果你在转换状态中更新图表组件，但在图表正在重新渲染时开始在输入框中输入，React 将在处理输入更新后重新启动对图表组件的渲染工作。

useTransition 返回一个具有两个项的数组：

1. isPending 标志，告诉你是否存在挂起的转换状态。（那么当任务处于悬停状态的时候，isPending 为 true，可以作为用户等待的 UI 呈现，一旦开始更新就不是挂起了，isPending 置为 false）
2. startTransition 方法 允许你将状态更新标记为转换状态。


function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}



```

+ useDeferredValue：可以让你延迟更新你的部分ui。


useDeferredValue和useTransition 类似。

相同点：

useDeferredValue 本质上和内部实现与 useTransition 一样都是标记成了过渡更新任务。

不同点：

useTransition 是把 startTransition 内部的更新任务变成了过渡任务transtion,而 useDeferredValue 是把原值通过过渡任务得到新的值，这个值作为延时状态。 一个是处理一段逻辑，另一个是生产一个新的状态。


useDeferredValue 还有一个不同点就是这个任务，本质上在 useEffect 内部执行，而 useEffect 内部逻辑是异步执行的 ，所以它一定程度上更滞后于 useTransition。 useDeferredValue = useEffect + transtion


没有这个api时，就是要自己用防抖节流去实现， 只不多防抖节流减少了渲染，transtion与useDeferredValue 则没有， 防抖节流还需要考虑响应时间问题，transtion则不需要。

```

import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

```

原理：


startTransition 原理特别简单， 就是通过设置开关的方式，而开关就是 transition = 1 ，然后执行更新，里面的更新任务都会获得 transtion 标志。


模拟实现useTranstion：

```
function mountTransition(){
    const [isPending, setPending] = mountState(false);
    const start = (callback)=>{
        setPending(true);
        const prevTransition = ReactCurrentBatchConfig.transition;
        ReactCurrentBatchConfig.transition = 1;
        try {
            setPending(false);
            callback();
        } finally {
            ReactCurrentBatchConfig.transition = prevTransition;
        }
    }
     return [isPending, start];
}


```
useDeferredValue 的内部实现原理：

```
function updateDeferredValue(value){
  const [prevValue, setValue] = updateState(value);
  updateEffect(() => {
    const prevTransition = ReactCurrentBatchConfig.transition;
    ReactCurrentBatchConfig.transition = 1;
    try {
      setValue(value);
    } finally {
      ReactCurrentBatchConfig.transition = prevTransition;
    }
  }, [value]);
  return prevValue;
}


```

从上面可以看到 useDeferredValue 本质上是 useDeferredValue = useState + useEffect + transition
通过传入 useDeferredValue 的 value 值，useDeferredValue 通过 useState 保存状态。

然后在 useEffect 中通过 transition 模式来更新 value 。 这样保证了 DeferredValue 滞后于 state 的更新，并且满足 transition 过渡更新原则。



+ useSyncExternalStore: useSyncExternalStore 是一个让你订阅外部 store 的 React Hook。在组件顶层调用 useSyncExternalStore 以从外部 store 读取值。最重要的它解决了并发模式状态读取问题。

在 concurrent 模式下，render 可能会被执行多次，那么在读取外部数据源的会存在一个问题，比如一个 render 过程中读取了外部数据源状态 1 ，那么中途遇到更高优先级的任务，而中断了此次更新，就在此时改变了外部数据源，然后又恢复了此次更新，那么接下来又读取了数据源，由于中途发生了改变，所以这次读取的是外部数据源状态 2 ，那么一次更新中出现了这种表现不一致的情况。这个问题叫做 tearing（撕裂） 。

useSyncExternalStore 能够让 React 组件在 concurrent 模式下安全地有效地读取外接数据源，在组件渲染过程中能够检测到变化，并且在数据源发生变化的时候，能够调度更新。当读取到外部状态发生了变化，会触发一个强制更新，来保证结果的一致性。

但是这里强调的一点是， 正常的 React 开发者在开发过程中不需要使用这个 api ，这个 hooks 主要是对于 React 的一些状态管理库，比如 redux ，通过它的帮助可以合理管理外部的 store，保证数据读取的一致。



核心原理就是： 用一个 useEffect 来监听组件 render ，只要组件渲染就会调用 updateStoreInstance 。这一步是关键所在，在 concurrent 模式下渲染会中断，那么如果中断恢复 render ，那么这个 effect 就解决了这个问题。当 render 就会触发 updateStoreInstance 。updateStoreInstance 很简单就是判断 state 是否发生变化，变化就更新。


```
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}

它返回 store 中数据的快照。你需要传两个函数作为参数：

1. subscribe 函数应当订阅该 store 并返回一个取消订阅的函数。
2. getSnapshot 函数应当从该 store 读取数据的快照。


```


### 如何分析和调优性能瓶颈

伯约 02，13

内容有用，整理起来有点费时，有时间再整理吧

todo 

### hooks 的使用限制

为啥用hooks
1. 类组件之间难以复用状态逻辑 （需要用高阶组件；对于更复杂的场景，多级组件共享状态需要用redux, mobx)
2. 复杂的组件变得难以理解（主要指生命周期函数没能提供最佳代码编程实践范式）
3. 人和机器都容易混淆类（一个是只类中的this难以理解，一个是难以编译优化）

原理：

hooks 是用链表实现的，在链表中是有序的，如果在循环，条件后嵌套函数中使用hook，很有可能导致hook取值错位。


限制；

1. 不要在循环，条件后嵌套函数中使用hook
2. 在react 函数中使用hook

解决方案：

这些限制可能导致新手会写错，可以用eslint 的hooks检查插件

### react router

从实现原理到工作方式来答。

现在的网页大部分是以单页应用的方式完成交付的，当访问 http://www.xx.com/a 或 http://www.xx.com/b 时，
路由完全由前端开发者在网页层通过js自行控制。

但在过去的多页应用时代，路由完全是由服务端进行控制的。

前端并不能真正的去控制路由，比如请求http://www.xx.com/a 或 http://www.xx.com/b， 一定会返回两个页面，这就需要一种方案去模拟路由，所以hash路由登上了舞台，通过在hash中添加路由路径的方式来控制前端路由，随着浏览器对h5 中的 history pushState 的支持，有了浏览器路由，写法和最初时相同，比如：http://www.xx.com/a 或 http://www.xx.com/b

history api 可以怎么实现路由的呢？（基础原理）

它分两部分进行：

第一部分在浏览器中完成，h5引入了history.pushState() 和 history.replaceState()两个函数，
他们分别可以添加和修改历史记录条目，pushState 修改当前浏览器地址栏的网址路径，replace 则是替换网址路径。
此时浏览器仅仅是修改网址，并不会刷新页面，如果用户刷新页面才会重新拉取。既然http://www.xx.com/a 本身指向编译产物
index.html, 那么http://example.com/a也需要指向index.html, 那就需要服务端去配置完成。

第二部分是在服务端进行配置修改，被称为historyApiFallback。 需要在nginx 或者node层去配置historyApiFallback，
将404请求响应到index.html就可以了

react router 内部是怎样的呢？

在react router 中路由通过抽象history库（react router自己封装的库）完成统一管理，history 库支持BrowserHistory 与 MemoryHistory 两种类型，
打开源码看一下可以得知，BrowserHistory实际上调用的是浏览器的history api， 也就是上面的基础原理部分。

而react native并不是运行在浏览器环境中的，所以需要在内存中构建一个自己的版本，原理上就是一个数组。

使用context api来完成内部数据共享。

在关键模块上有三类组件。第一类是容器组件，有Router 和 MemoryRouter 主要提供上下文消费容器。
第二类是直接消费者，提供路由匹配功能，分别是Route, Redirect, Switch。 第三类是与平台关联的功能组件，
分别是react-router-dom 中的Link, NavLink

ps: react-router 是没有ui层的，react-router-dom = react-router + Dom ui


### react 常用库

常用的工具库都融入到前端的开发工作流中：

初始化： 

官方：create-react-app 配置足够简单，拓展极其麻烦，常用 react-app-rewired 对create-react-app进行拓展。
国内还有dva, umi 这样一站式解决方案

开发： 在开发过程中使用的库，有路由，样式，基础组件，功能组件，状态管理

路由： react-router

样式： 有两种解决方案，分别是css模块化和css in js。 css 模块化，主要由css loader来完成（可用less, sass）, Css in js(方案有 styled-components, emotio)

基础组件： antd， 面向c端的话主要是团队内部封装的组件

功能组件： react-dnd 和 react-draggable 用于实现拖拽， react-pdf-viewer 用于实现pdf, 
Video-React用于播放视频， react-window 和 react-virtualized 用于长列表问题的解决

构建工具： webpack（大型项目交付） , esbuild（高性能构建）, rollup（库交付）

检查： 代码规范检查 eslint, 代码测试有jest(测试框架), enzyme（测试工具库），react-hoos-testing-library(针对hooks测试工具库)

发布： 在发布环节通常是由构建起完成打包，再丢到服务器上运行，此时静态文件可通过cdn服务商的回源服务加速静态资源，这个过程不需要任何代码改动。 另一种方式是自行手动上传静态资源文件到cdn（我搜管理的工程静态资源主要托管在cdn上）, 这里需要s3-plugin-webpack一类插件处理静态资源的上传


### monorepo 与 mutirepo

mutirepo： 多仓， 就是我们常用的开发方式，一个仓库对应一个工程，子团队自行维护

monorepo：单仓，让工程代码对团队中的每一个人都具有透明度，在同一次迭代中库之间相互引用代码也更为容易，
通常会用lerna 作为开发管理，



### 说说hook原理

useState

```
const hookStates = [];
let hookIndex = 0;
​
const useState = (init) => {
  hookIndex++;
  hookStates[hookIndex] = hookStates[hookIndex] || init;
  const setState = (newState) => {
      hookStates[hookIndex] = newState;
      // 然后开始进入更新应用逻辑
      ...
    }
  return [hookStates[hookIndex], setState];
}

```

源码里呢，hooks状态是存在函数组件对应的fiber节点上，也不是用数组存储，是用链表来存储hook的相关信息


useEffect

```
const hookStates = [];// 保存数据状态的数组,每个组件只有一个
let hookIndex = 0; // 索引
​
// useLayoutEffect（这个hook咱们后面说） 和 useEffect 实现一样，只不过useLayoutEffect是同步的（在同步代码的最后执行）， useEffect 用宏任务，还多了个销毁步骤
function useEffect(callback, deps){
  if(hookStates[hookStates]){ // 说明不是第一次
    let [oldDestroy,lastDeps] = hookStates[hookIndex];
    const same = deps.every((item, index) => item === lastDeps[index]); // 浅比较
    if(same){
      hookIndex++; // 如果依赖相同就不执行副作用
    }else{
      oldDestroy(); // 执行副作用前，先执行清除函数
      let destroy;
      // 添加一个宏任务，在本次渲染之后执行
      setTimeout(()=>{
        destroy = callback();
        hookStates[hookIndex++] = [destroy,deps]; // 存一下清除函数，和依赖，下次更新用
      }, 0);
    }
  }else{ // 初始化
    let destroy;
    // 添加一个宏任务，在本次渲染之后执行
    setTimeout(()=>{
      destroy = callback();
      hookStates[hookIndex++] = [destroy,deps];
    }, 0);
  }
}

```
useRef:

useRef() 和自己建一个 {current: ...} 对象的唯一区别是，useRef 会在每次渲染时返回同一个 ref 对象, 类似于在 class 中使用实例（this）字段的方式（可以把其返回值看做一个全局变量，多次渲染指向始终不变）;


useImperativeHandle 和 forwardRef：todo（有时间再补充一下）




## 常问问题

1. 执行渲染时，调度任务用什么让出主线程？为什么用MessageChannel，不用setTimeout。

如果判断超时，或者有高优先级的任务进来，就会把本次任务暂停，让出主线程

用宏任务，MessageChannel， 因为希望这个宏任务的时间差越小越好，如果没有别的事情在做，最好立即就能接管回来执行。
> 早期的时候（17）用的是requestIdleCallback,但是这个兼容性不是很好，后面用了MessageChannel


## 状态管理

hooks 出现之前：潮流是 redux（单向数据源）, mobx（响应式）
hooks后： 潮流是原子化(尤其是spa驱动的前端)，atom 和 showTime，但是原子化对于大型的应用场景又不够用，还是会回到redux，mobx那一套。

redux 核心设计包含三大原则： 单向数据源，纯函数reducer， state是只读的， rudux另一核心点是处理副作用，比如ajax请求的异步工作，
有两种解决方案，通常是在dispatch 的时候，有一个middleware 中间层，拦截分发的action 并添加额外的复杂行为，这一类的流行方案有，
redux-thunk, redux-promise,redux-soga 等， 除此之外社区还提供了更为工程化的方案，比如dva;



mobx 通过监听数据属性的变化，可以直接在数据上更改触发ui的渲染，在使用上更接近于vue, 以mobx5 为分界点，5以前是使用Object.defineProperty的方案，5以后用的是Proxy, 优点是样板代码少，简单粗暴，响应式自动更新数据让开发者心智负担更低


还有hooks 的 useReducer

### react 深度使用

- 1. useMemo, useCallback 依赖的深度对比

```
const useMemoTest = () => {
  const [state, setState] = useState({val: 2});
  const oldVal = useRef();
  //重新执行render了，state是最新的值；在事件里改了状态之后，当时拿不到最新值，因为有事件合并，这时候可以拿到旧的值，用ref取记录一下

  const m = useMemo(()=>{
    return {
      a:state.val+1
    }
  }, [isEqual(oldVal.current, state)])


  return <div>
      {m.a}
      <button onClick={()=>{
        setState({val: 2})
        oldVal.current = state;  
      }}>改状态对象地址</button>
    </div>

}

export default useMemoTest;


```

### redux原理
// 其实核心是发布订阅

原理

```
function createStore(reducer, initState){
  // 定义一个状态变量，并赋默认值
  let state = initState;
  let listeners = [];
  function getState(){
    return state;
  }

  function subscribe(listener){
    listeners.push(listener)
    // 返回清除订阅的函数
    return ()=>{
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1)
    }
  }

  function dispatch(action){
    // 接收reducer，计算新的state
    state = reducer(state, action);
    listeners.forEach(l=>l()); // 派发的每一个函数都会触发所有的订阅函数执行
  }

  const store = {
    getState,  // 获取最新state
    subscribe, // 订阅与取消订阅
    dispatch, // 更改状态，发布
  }

  return store;
}

```

手写redux-thunk todo

手写 redux

#### redux 中间件

todo 有点难，需要一天时间，后面有时间再看吧；
// 参考珠峰视频，加上csdn 博客 https://blog.csdn.net/m0_62118859/article/details/124490882

中间件作用： 用来处理副作用（比如异步请求），
中间件执行时机：在 dispatching action 和 到达 reducer 之间。
中间件原理：封装了 redux 自己的 dispatch 方法, 没有中间件就是 Redux 库自己提供的 dispatch 方法，用来发起状态更新,
使用中间件就是中间件封装处理后的 dispatch，但是，最终一定会调用 Redux 自己的 dispatch 方法发起状态更新
函数的拓展比较容易，想给函数加功能，一般用hoc高阶函数

中间件使用方式

// 导入 thunk 中间件
import thunk from 'redux-thunk'
// 将 thunk 添加到中间件列表中
// 知道：如果中间件中使用 logger 中间件，logger 中间件应该出现在 applyMiddleware 的最后一个参数
const store = createStore(rootReducer, applyMiddleware(thunk, logger))

下面是参照伯约写的中间件原理，没太懂，主要是他写的compose 函数和我想象的不一样，然后中间件的整个流程我也不是很清楚

```
const applyMiddlewares = (...middlewares) => {
  // 传进去的值:next 就是createStore
  return (next) => {
    // 返回的本质也是一个createStore， 因为这个函数接收的参数：reducer, initState， 其实和createStore 接收的是一样的
    return (reducer, initState={}) =>{
      const store = next(reducer, initState);
      let dispatch = store.dispatch;
      // middlewares 就是修改dispath的
      // 这里会带两个参数
      const  middlewareArgs = {
        getState: store.getState,
        dispatch: action => dispatch(action)
      }

      const chain = middlewareArgs.map(m=>m(middlewareArgs))
      // 是用一个compose 的组合函数，去柯理化，自己写的话是下面这样的;一层层的包裹，洋葱模型,有点像koa的中间件，中间件设计都是类似下面的模式
      // compose(A, B, C)的返回值是：(arg) => A(B(C(arg)))， 也就是把函数的参数（也是函数）输入，变成一层层函数包裹执行
      // 修改dispatch
      dispatch = chain.reduceRight((composed, f)=>f(composed), store.dispatch)
      return {
        ...store,
        dispatch,
      }
    }
  }
}

```

#### react-redux （低优先）

遇到再说，可以不看： 不是很重要以前都很少问，感觉以后更不会咋问了

redux 是个框架无关的库，如果要桥接到一个框架之上的话，要加一个连接层，因为redux 本身是无法驱动ui更新的，
它管理的是状态。

那么最核心的，react-redux 是如何更新react 组件（驱动ui变化）的呢？

第一性原理（核心原理）：不做任何数据校验，只要store 更新，就刷新组件

react-redux = Provider + Connect



#### hook 时代下的redux（了解即可）

我们用hooks api 的时候，基本不怎么用redux了,用useReducer 就可以了，特别复杂的，中型，大型的才用（比如 elecron 的app 这种重前端任务，调试起来方便），一般用的是redux tookit

面向hooks的重构
1. ts重写
2. 订阅发布改为闭包函数（跟我理解的原理一致，中间有段时间改为过类，现在又改回来了）
3. 比较重要的api：  useSyncExternalStore

useSyncExternalStore 不仅是redux在用，基本所有外置存储的状态库都在用，本身也是尝试解决撕裂问题的。

useSyncExternalStore 本身是个订阅函数（用来更新视图的订阅函数），如果store 更新，
useSyncExternalStore就执行。

把useSyncExternalStore 传给react, 写在useEffect里，react 会在渲染阶段结束后去执行它，
也就是说useSyncExternalStore 去更新视图的时候，react 本身可以决定什么时候调用它，可以避免在渲染阶段不停地被触发更新


### mobx

#### mobx 基础理解

第一性原理： 响应式框架， 类似vue

以下是两者对应, 概念上基本完全一致， 设计原理与vue 3.0 很类似
```
mobx api   VS    vue3.0
observable       reactive
observer         effect
computed         computed
autorun          watch


```

但是它们开发理念差距很大。

领域模型：

前端设计一般用的是充血模型，业务逻辑和数据模型是在一起的，比如会写在同一个类里。
后端设计一般用贫血模型，业务逻辑和数据模型是分开的。
而mobx 用的是贫血模型，一个组件对于一个数据model store, 把model store绑定在组件上，甚至请求数据的时候都可以在model初始化时（constructor里）就可以请求，没必要等到组件渲染时在请求。(有一种ui与业务逻辑分离的感觉，数据有了，完全就不依赖渲染框架了，可以自己选择任意渲染框架)


mobx用法理念：

用mobx 后，组件的更新可以完全不依赖于react 的state, 它的组件去更新的方式，其实类似于redux, 数据变动强制推动组件更新。
mobx就像是一个没有ui的响应式框架，整个是一个外置数据源。 它并不怕你给每个组件绑定一个model原型（store）, 是可以实现精确更新的。要想要好的开发体验，尽可能不要把autorun 的操作放在组件那一层，如果用mobx就尽量不要在组件上直接更新东西了，把数据更新都移到模型里，直接操作可能会引发一些性能问题，也就是后尽量把ui和逻辑（model数据）分开，ui要改数据就用action去操作，尽量也不要组件自己内部的state。

因为能精确控制，所以比较适合比较复杂的情况，做性能的精确控制，比如编辑器，大长表单等。
> ps: 问题在于它的文档写的有点复杂，没写好


mobx 的三个基本概念：

state： 当前模型的状态，替代的是react 的state
actions: 更新state 的操作，如果要更新数据源就要用action（action 函数一般被标记为action)
derivations (派生): 监听state 变化进行响应， 有两种：第一种是计算属性computed(类似vue中的computed)，第二种是reactive (类似vue中的watch)

#### mobx 原理

1. 在被观察者和观察者之间建立依赖关系（或者叫收集依赖）: 通过一个Reaction来追踪一个函数，该函数中访问了Observable（被观察者）变量，Observable变量的get方法会被执行，此时可以进行依赖收集，将此函数加入到该Observable变量的依赖中。
2. 触发依赖函数： 上一步中Observable中，已经收集到了该函数。一旦Observable被修改，会调用set方法，就是依次执行该Observable之前收集的依赖函数，当前函数就会自动执行。
3. mobx-react如何更新react状态： observer这个装饰器，对React组件的render方法进行追踪。将render方法，加入到各个observable的依赖中。当observable发生变化，依赖方法就会执行。
追踪中，还是先进行依赖收集，调用forceUpdate去更新组件，每次都进行依赖收集的原因是，每次执行依赖可能会发生变化。



理解：

1. 先把对象变成observable（可观察的）;代理每一个属性时， 实例化一个反应（Reaction， 依赖收集类）,实例属性给一个唯一id, 并在get时（获取属性时）开始收集依赖函数，把依赖函数加入此id的收集数组中， 在set 时触发此id的依赖数组;

2. autorun 时，传输函数fn， 开始收集fn里的依赖，把函数fn放在Reaction类的一个属性上，比如nowFn（就相当定义了一个全局变量）;
然后执行fn, 在这个过程中会触发内部observable 对象的get属性，就会开始加newFn 添加到对应属性id 的依赖数组里， 这样属性改变函数就可以重新执行；autorun最后把Reaction.nowFn置为null;


```
let nowFn = null;
let counter = 0;

// 响应
// 收集可观察对象的依赖函数， 一个observable对象，可能依赖了多个函数（存在多个函数里）
class Reaction {
  constructor(){
    //给一个id, 对每个observable的对象，进行proxy 标记都会加一，表示这个可观察对象的唯一标识;id 可以正向去加，也可以用Symbol 去建
    this.id = ++counter;  
    this.store = {};  // 存储可观察对象id，极其对应依赖
    //todo: 低优先级， 有个问题，为什么要定义一个store，一个对象依赖多个函数放在数组里就好了啊？（不影响核心原理的理解有时间再看）
  }

  // 收集依赖
  collect(){
    if(nowFn){// 当你在autorun 里跑的时候才会依赖收集, 收集（订阅）传给autorun 的函数
      this.store[this.id] = this.store[this.id] || [];
      this.store[this.id].push(nowFn);
    }
  }

  // 执行依赖，类似发布订阅
  run(){
    if(this.store[this.id]){
      this.store[this.id].forEach(w=>{
        w();
      })
    }
  }

  static start(handler){
    nowFn = handler;  // 开始收集订阅函数
  }

  static end(){
    nowFn = null;
  }

}

function deepProxy(val ,handler){
  if(Object(val) !== val){// 如果不是一个Object
    return val;
  }
  for(let key in val){
    val[key] = deepProxy(val[key], handler);
  }

  // 因为new Proxy 对于this指向是有影响的，所以一般new Proxy 搭配 reflect 使用, 
  return new Proxy(val, handler());
}

// 把一个对象变成可观测对象
function createObserable(val){
  
  return deepProxy(val, ()=>{
    let reaction = new Reaction()
    return {
      get (target, key){
        reaction.collect(); // 收集依赖（这个属性依赖于哪个函数，在哪个函数里）
        return Reflect.get(target, key)
      },
      set (target, key,value){
        if(key  === 'length'){
          return true;
        }
        const result = Reflect.set(target, key,value);
        reaction.run(); // 发布订阅的函数， 属性变了，它的依赖函数要执行一次
        return result;

      }

    }
  })

}

function observable(target, key, descriptor){
  return createObserable(target)
}

function autorun(handler){ // 收集可观察对象的依赖函数
  Reaction.start(handler);
  handler(); // 第一次的时候执行一下,执行的目的是为了收集依赖（收集这个订阅函数，需要的依赖，也就是用了可观察对象的哪些属性）
  Reaction.end();
}

const obj = observable({
  name: 'boyue'
})
autorun(()=>{
  console.log('changed', obj.name)
})
obj.name = 'boyue-xx'  // 每次修改都会走依赖函数


export default {
  autorun,   // 类似于watch
  observable,  // 把对象变成一个客观测对象
}

```

### 父组件调用子组件的方法

1. 用ref ， 类组件写法

在父组件里创建ref，传递给子组件的ref， 这用父组件就能拿到子组件的ref;

```
import React , { Component } from "react"

class Child extends Component {
	func(){
		console.log("执行我")
	}
	render(){
		return (<div>子组件</div>);
	}
}

class Parent extends Component {
	constructor(props) {
	    super(props);
	 	this.Child = React.createRef();
	}
	handleOnClick = ()=>{
		this.Child.current.func();
	}
	render(){
		return (<div>
			<button onClick={this.handleOnClick}>click</button>
			<Child ref={this.Child}></Child>	
		</div>);
	}
}

```

2. forwardRef 和 useImperativeHandle

```
import {
  forwardRef,
  useState,
  useCallback,
  useImperativeHandle,
  createRef
} from "react";

export default function App() {
  let c = createRef(null);
  const handleChick = useCallback(() => {
    console.log("父组件点击了");
    c.current.add();
  }, [c]);
  return (
    <div className="App">
      <button onClick={handleChick}>点我运行子组件方法</button>
      <Child ref={c} />
    </div>
  );
}

const Child =  forwardRef((props, ref)=> {
  const [num, setNum] = useState(0);
  useImperativeHandle(
    ref,
    () => ({ add })
  );
  const add = () => {
    setNum((num) => ++num);
  };
  return (
    <div>
      <button onClick={add}>这是子组件自己调用</button>
      子组件的值：{num}
    </div>
  );
});

```


> 容易错以为是：利用构造函数里的super
> 这个是错的，这是父类调用子类的方法； super的时候执行父类的constructor, constructor去用this调用子类的方法



#### mobx react 原理

### 设计模式

todo: 发布订阅 和   区别
// 发布订阅是你手动要去做一个事情
  // 观察者模式是值发生变化后，自动去做

  // todo： Reflect 的作用是呀

todo: ref破闭包陷阱一直有点不懂， 既然赋值给ref的是值，那么如何能在值变化时，及时更新呢？
  

  7.3 第二遍复习到： 说一说react渲染流程

  ### react 面试简记


  #### react 常规特性及渲染

  - 0. react 版本
      - 16： 旧版本，类时代
      - 17： 过渡版本， 无新特性， 这个版本主要目标是让React能渐进式升级，它允许多版本混用共存，可通过一些试验性的API开启并发模式
     
      - 18： *从 同步不可中断更新 变成了 异步可中断更新*，默认开启并发模式
        - 1. 创建一个初次渲染或者更新，以前我们用的是ReactDOM.render，现在改用react-dom/client中的createRoot
        - 2. 渲染可以中断，可以根据优先级去暂停，比如用户的交互可以暂停阻塞渲染， 用户交互完了，可以继续渲染。
        - 3. 关于状态批量更新见下面state
        - 4. 开启StrictMode hooks函数组件在开发环境会走两遍（生产环境只会走一次）
          因为render 阶段是可中断的，被打断然后恢复，一个组件可能会渲染两遍，有可能会产生bug，为了让开发者提前发现可能存在的问题，一般写库的时候会开，开发业务可以不开
     
  - 1. state  
      - 1. 合并更新： 同步打印不能取到最新的值，*一样的状态属性设置两次后面的会覆盖前面的*
          - 17 版本： 在合成事件之外的原生事件中(例如 setTimeout, onclick, promise) , 更新状态并不会进行批量处理
          - 18 版本： 一个事件循环里（取一个宏任务开始），状态都是批量更新的; （可以理解为同步批量一次，异步批量一次）
      - 2. setState: setState 本身既不是同步也不是异步，而是批量结算state, *开始都推入队列里（数组里），然后开启一个微任务（queueMicrotask）去结算，队列里的state*
      - 3. 状态改变后需要立即去做某件事：
        - 用useLayoutEffect（dom更新后， 界面渲染前）,把状态作为依赖
        - 用flushSync，同步更新 dom, 在flushSync回调内的更新状态, 此函数过后dom 更新，能获取最新状态； 如果在绑定事件里，可能会有闭包的影响，可以用ref破闭包;
  - 2. hooks
      - 1. 常用hook：
        - effects  return 的清除副作用函数什么时候执行： 每次依赖变更后都会执行，页面卸载也会执行
      - 2. 闭包陷阱： 每一次渲染，有被外界持有变量就会形成闭包： 比如绑定事件，定时器，*被外界持有的变量，定义时的那一次渲染形成闭包（一般是第一次挂载的时候），会一直不销毁*
        - 破闭包陷阱的方法：
          - 1. ref: 把更新后的状态放在ref.current （相当于一个全局变量）上，在定时器中用这个ref.current 去拿状态最新值   【常用】
            - `const obj = useRef();  obj.current = stateVal;`
          - 2. 给setState 改状态的函数传参，只限于在修改状态(setState)时需要拿到最新状态  【常用】
          - 3. 加依赖，依赖变化，重新定义定时器，或者绑定事件，重新取值, 不过性能消耗大， 只限于在hook里想拿最新状态  【不推荐】
      - 3. hook 原理：
        - hooks状态是存在函数组件对应的fiber节点上
        - 用链表来存储各个hook的相关信息
        - 执行hook的时候判断，有没有存过hook状态，没有则是挂载，将hook状态存到fiber节点上，有则是更新，更新新的hook状态， 根据具体hook做相应操作

  - 3. fiber
      - 为了render渲染可中断引入的机制
      - 本质是一种有parent（父）、child（子）、sibling（兄弟）,的链表数据结构


  - 4. 渲染： render 和 commit 两个阶段
      - 基于babel把jsx语法编译为React.createElement(...) 结构(jsx其实就是React.createElement的语法糖)
        - babel读取代码（jsx）生成ast， 再将ast传入插件转换成react.creatElement 的结构
      - 基于render方法把生成的对象动态创建为dom元素，插入到指定的容器中
        - react17: ReactDOM.render
      - render阶段:
        - *通过 schedule 调度来进行 reconcile(调和)*, *reconcile也就是找到变化的部分， 创建 虚拟dom，打上增删改的 tag*，也就是diff过程，等全部计算完之后，commit 阶段一次性更新到 dom。
          - requestIdleCallback兼容性不好，React 如何模拟 requestIdleCallback 做调度？
            - 通过MessageChannel模拟，它的调度有两个特点:
              - 协作式多任务： *将时间无脑的分片成5ms，5ms一过就停止任务的执行,让出线程。剩余任务放到下一个宏任务，继续5ms一个分片执行。*（定时放弃自己的运行权）
              - 策略优先级: 度任务通过标记tag的方式，分优先级执行；*每次处理一个 fiber 节点，处理前会判断下 shouldYield，如果有更高优先级的任务，那就先执行别的。*，优先级通常是标记为动画或者high的先处理
        - 为了让这个render阶段可以中断和恢复， 所以 vdom 也被改造成了 fiber 的数据结构，有了 parent、sibling 的信息
        
      - commit阶段：可细分为三个阶段
        - 无需再次遍历 fiber 树，*react 把有 effectTag 的 fiber 都放到了 effectList 队列中，遍历更新即可。*
        - 三个阶段：
          - 1. Before mutation（执行 DOM 操作前）： 会异步调用 useEffect 的回调函数，异步是为了防止同步执行时阻塞浏览器做视图渲染
          - 2. mutation （执行 DOM 操作）： 操作dom
          - 3. layout （执行 DOM 操作后）: 会同步调用 useLayoutEffect 的回调函数，并且更新 ref。

  - 5. react 18 新的特性与api, 最大的特点是Concurrent, 并发并行, 也就是渲染是可以中断的
      - 特点：
        - 1. 遗弃：Concurrent模式下，有些update可能会被遗弃掉。因为用户不关心过程中的ui变化，只关心自己想要的结果。
          - 在一个模糊搜索里，我搜老人与海，我输入老人时， 这个结果并不重要，这时模糊查询框'老人'对应的ui的update相对于input的update就是低优先级的。
        - 2. 状态的复用：Concurrent模式下，还支持状态的复用
          - 比如用户走了，又回来，那么上一次的页面状态应当被保存下来，而不是完全从头再来。
          - React正在用Offscreen组件来实现这个功能。此功能还在开发。
      - 新api：
        - 1. Suspense 让组件‘等待’异步操作，异步请求结束后在进行组件的渲染，也就是所谓的异步渲染。
          - 目前2023.09， 只有启用了 Suspense 的数据源才会激活 Suspense 组件，它们包括：
            - 支持 Suspense 的框架如 Relay 和 Next.js。
            - *使用 lazy 懒加载组件代码*
          - 优势与使用：
            - 以前的异步请求方式比较繁琐，主要是是通过类组件 componentDidMount 或者函数组件 useEffect 进行数据交互，获得数据后通过调用 setState 或 useState 改变 state 触发视图的更新。
              - 传统模式：挂载组件-> 请求数据 -> 再渲染组件。
              - 异步模式：请求数据-> 渲染组件。
            - Suspense 是组件，有一个 fallback 属性，用来代替当 Suspense 处于 loading 状态下渲染的内容，以前一般这种情况会写if xx 返回组件，否则返回loading;
            - 嗯， 目前似乎是需要和React.lazy 配合使用?
          - 流程原理：
            - 1. Render => 发现异步请求 => 悬停，显示 Suspense fallback 的内容，等待异步请求完毕 => 再次渲染展示Suspense 组件内容。
              - Suspense 内的组件子树比组件树的其他部分拥有更低的优先级
            - 2. react 会从我们的缓存中读取数据， 如果缓存命中，直接进行 render
            - 3. 如果没有缓存，会抛出一个 promise 异常，可以在这个 Promise 中进行数据请求工作
              - Suspense 执行内部通过 try{}catch{} 方式捕获异常
            - 4. 当 promise 完成后，react 会重新进行 render，把数据渲染出来，达到异步渲染的效果。
          - 但当我们用 Suspense 时, 如何捕获错误呢？
            - 每当使用 Promise，大概率我们会用 catch() 来做错误处理。当我们用 Suspense 时，我们不等待 Promises 就直接开始渲染，loading已经渲染到界面了，这时 catch() 就不适用了
            - 错误边界捕获：
              - 你可以在需要的层级渲染一个错误边界组件来“捕捉”层级下面的所有的报错信息
              - static getDerivedStateFromError() React 新增生命周期
                - getDerivedStateFromError 返回的值会合并到组件的state上，更新state



-  vue 和 react 对比
   -  最大区别： 在状态管理方式
      -  vue 是通过响应式
      -  react 是通过 setState
         -  react 的 setState 的方式，导致它并不知道哪些组件变了，需要渲染整个 vdom 才行。但是这样计算量又会比较大，会阻塞渲染，导致动画卡顿。
         -  为解决节点过多卡顿，react 后来改造成了 fiber 架构，目标是可打断的计算
   -  组件写法
      -  react: jsx, jsx并不会引入太多的概念，它仍然是js, react团队并不想引入js以外的开发体系，而是通过合理的关注点分离，保持组件开发的纯粹性
      -  模版: 更多的概念，比如新的模版语法，模版指令等。



#### react 深度使用

这些深度使用内容，以及react18新特性拿一天出来自己

- react.lazy
  - react18之前的 React 的版本中，你总是可以使用 Suspense 与客户端侧的 React.lazy 配合进行代码分割。
  - todo 自己试一下react18 suspense的效果
- useMemo, useCallback 依赖的深度对比: 用uesRef
  - *在事件里改了状态之后，当时拿不到最新值，因为有事件合并，这时候可以拿到旧的值，用ref取记录一下*
  - 重新执行render了，state是最新的值；
  - 在useMemo或者useCallback去执行函数对比新旧状态值；
- Memo的深度对比
  - memo(Component, arePropsEqual?)， *第二个参数表示组件属性是否相同，true则不更新， false则更新*
- useRef
  - 可以使用 ref 操作 DOM， 将你的 ref 对象作为 ref 属性传递给你想要操作的 DOM 节点的 JSX， 通过ref.current拿到dom节点
  - useRef 类似一个react组件里的全局变量，你可以改变它的 current 属性来存储信息
- forwardRef 与 useImperativeHandle
  - forwardRef 允许你的组件使用 ref *将一个 DOM 节点暴露给父组件。* `const SomeComponent = forwardRef(render)`
    - 
    ```
    import { forwardRef } from 'react';

    const MyInput = forwardRef(function MyInput(props, ref) {
      const { label, ...otherProps } = props;
      return (
        <label>
          {label}
          <input {...otherProps} />
        </label>
      );
    });

    ```
  - *暴露一个受限制的方法集，而不是暴露整个 DOM 节点*,将收到的 ref 传递给 useImperativeHandle 并指定你想要暴露给 ref 的值, useImperativeHandle(ref, createHandle, dependencies?)

    - 
    ```
    import { forwardRef, useRef, useImperativeHandle } from 'react';

      const MyInput = forwardRef(function MyInput(props, ref) {
        const inputRef = useRef(null); // inputRef这是自己要用的不受限制的ref; 暴露给父组件ref(或者说父组件传来的ref)已经收到useImperativeHandle的限制，就只能调用给定的方法

        useImperativeHandle(ref, () => {
          return {
            focus() {
              inputRef.current.focus();
            },
            scrollIntoView() {
              inputRef.current.scrollIntoView();
            },
          };
        }, []);

        return <input {...props} ref={inputRef} />;
      });
    ```
  
- 传送门
- react本身的状态管理（不引入外部状态库）: createContext 配合 useReducer, useContext
  - *用 createContext  创建上下文对象* `ValContext = createContext()`
  - *用 useReducer 创建全局状态管理*： `const [state, dispatch ] = useReducer(reducer,initState)`
    - *reducer 是状态管理函数需要自己定义，第二个参数表示动作类型*，利用老的状态,根据不同的动作类型，返回新的状态， `const reducer = (state,action) => {}`
  - *用上下文对象的Provider包裹组件，并给定要往下传的值*： `<ValContext.Provider value={{state, dispatch}}>...</ValContext.Provider>`
  - *用 useContext获取上下文的值*： `const {state, dispatch} = useContext(ValContext)`
- ref 在 React 和 Vue 中的行为确实取决于它所引用的对象。用ref获取，如果子组件是个类组件，或者函数组件，获取的就是组件实例，如果是个普通的标签获取的就是dom元素。其中如果子组件是react 函数组件，子组件就需要用forwardRef 包一下，配合useImperativeHandle。


## forwardRef 和  useImperativeHandle

父组件: `<MyComponent ref={myRef} />`

子组件：`const MyComponent = React.forwardRef((props, ref) => {...})`


useImperativeHandle Hook 会接收两个参数：ref 和一个返回实例值的函数。这个ref就是父组件传进来的ref,函数返回的实例值会被附加到 ref.current 上。这样，父组件就可以通过 ref.current 来访问这些实例值


## react 面试题 （2024）

### 用户根据不同的权限去查看不同的页面

- 1. 通过过滤路由
  - 0. 获取用户权限对应的路由
- 2. 通过渲染时拦截
  - 1. 给组件包一层，在useEffect里，判断有权限再渲染，包一层的这个组件可以封装一下比如叫： withAuth
  - 2. 在路由配置里，需要做权限判断的，用withAuth 包一下

### 复习记录

 8.14 目前似乎是需要和React.lazy 配合使用

