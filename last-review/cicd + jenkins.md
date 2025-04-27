## 测试环境部署

### 手动部署

前置操作：

- 1. 在服务器机器上安装docker （不装也行，就是nginx 配合 机器目录了，不过现在一般装，方便一点）
- 2. 把服务器启动：用docker 直接启动 docker run -d -p 80:80 -v /app/html:/usr/share/nginx/html nginx
  - 在docker 中启动nginx 服务器， 暴露docker 80端口；把docker的nginx 文件夹挂载出来，挂载到/app/html；
  - 后面部署时把前端项目压缩包上传到/app/html



每一次部署时的操作：每次代码有更改，要部署时
- 1. 前端资源打包
- 2. 把打包后的资源上传到服务器，解压对应用静态资源目录



- 额外知识补充：
  - 80:80：将本地主机的80端口映射到容器的80端口。这样，你可以通过访问本地主机的80端口来访问容器内运行的Nginx服务
  - 挂载：
    - -v /app/html:/usr/share/nginx/html：这个选项用于挂载卷，格式为host_path:container_path。
      - /app/html：本地目录； /usr/share/nginx/html：容器内的目录，Nginx的默认静态文件目录；
      - 本地目录/app/html中的内容将被挂载到容器内的/usr/share/nginx/html目录中。Nginx会将该目录中的文件作为静态文件进行服务。
        - 挂载是将宿主机的目录或文件映射到容器的目录或文件，使得容器内可以访问和使用宿主机上的资源。它提供了一个双向的共享机制，而不是简单的替换。因此，在挂载后，任何对宿主机目录的改动会直接反映在容器内的对应目录中，反之亦然。

## 自动部署


前置操作：
1. 把代码托管到github类仓库（gitLab等）
2. 在服务器上安装jenkins
   - 直接安装jenkins 的docker 镜像
     - 在这个jenkins 镜像里，还可以安装docker 来使用docker的功能，比如安装各种node， java等各种语言对应的镜像环境，实现动态化，不过如果这里需要部署的项目类别比较固定，比如只部署前端项目，就不需要了，在jenkins镜像里，配一套node环境就行了; 安装docker 再配置环境，会方便一些，尤其是在环境容易变化的时候；
   - 安装好jenkins镜像，启动后，就能根据ip（域名）访问jenkins操作界面；jenkins第一次安装需要填管理员密码: 用 docker logs 容器id， 可以查看到密码
   - 第一进入jenkins操作界面，安装默认推荐的插件即可
   - 然后注册登录，就能看见熟悉的，jenkins操作界面了；如果有需要还可以点击manage jenkins来安装自己需要的插件（比如Docker相关插件， BlueOcean插件，BlueOcean可以装饰可视化界面）；
   - 如果运行流水线的时候，在某一步没通过，可以在jenkins得系统管理的全局工具配置里， 安装需要的工具


- 1. 推送与通知：每次代码更改推送到代码托管仓库时， 代码仓库会通知jenkins开始自动部署流程
  - 1. 获取jenkins 流水线触发地址
    - 代码托管中心一般都有类似 web hooks的机制, 当代码推送后，给jenkins服务器发请求出发，jenkins流水线; 把jenkins 配置里的构建出发器的触发远程构建点开，得到的一个地址;
    - 为了能有远程触发的权限，一般需要在jenkins里配置一个令牌，在jenkins系统管理的管理用户admin用户里，设置api token; 最终地址里带上api token 然后放到web hook 对应区域就行了；
    - 默认会有跨域问题:在jenkins的全局安全配置里的跨站请求伪造里，把启用代理兼容勾上
  - 2. 将地址配置到代码托管中心的web hook 里
    - Bitbucket或者gitLab： 在管理里的WebHook，配置对应jenkins 触发流水线的地址就行了
- 2. 自动部署：分为三个stage
  - 1. jenkins 从托管仓库拉取代码
  - 2. 项目打包
  - 3. 项目部署到服务器



## 在定义jenkins脚本： 自动部署步骤

公司里基本上都是流水线脚本，一般不是手动配置的， 定义jenkins 流水线脚本，就是jenkins的高阶用法


- 概念：
  - stages: 阶段， 拉取代码，项目打包， 项目部署 都是不同的阶段
    - steps: 步骤，每个阶段里都有很多步骤， 每一个步骤都是一个命令





ps: 如果不知道jenkins 具体脚本命令怎么写， 在流水线脚本下面有个流水线语法提示，点进去，用可视化界面，配置就会生成命令； 比如 sh `ls -a`, 运行sh脚本命令



在configure 里，高级项目选项中，做如下配置：

- 1. 拉取代码： 用jenkins， 拉取代码这一步，配置一下代码仓库和分支就行，不用写任何脚本命令
  - 定义流水线，配置项目的仓库地址
    - 定义选择pipeline script from SCM :  意思是从代码管理中心拉取代码
      - 在SCM 代码管理管理里填写项目的git 仓库地址， 默认拉取master分支
      - 为了能够免登录，需要添加一个全局凭据在Credentials下点添加：把账号密码写上去
- 2. 打包构建
  - 1. 配置项目脚本路径文件 Jenkinsfile：用jenkins的脚本语法pipeline, stages, stage, steps, 脚本命令， 这个文件里的内容，就是整个流水线各阶段的内容
    - 现代Jenkins项目通常会使用 Jenkinsfile 来定义流水线
  - 0. 检查node 版本
  - 1. 安装项目依赖: npm install
  - 2. 打包： npm run build
- 3. 打包制品，方便回滚： 为了产生历史版本；把拉取的静态资源代码压缩成一个压缩包，让jenkins 保存管理这个制品，如果后续流水线失败，可以会滚到这个版本
  - 1. 默认目录是在  /var/jenkins_home/workplace/你的项目名
  - 2. 切换到需要压缩的目录，执行压缩命令： tar -zcvf docs.tar.gz *
  - 3. `archiveArtifacts artifacts: 'xxx.tar', *`
    - 这个命令让jenkins把，压缩包内容当成历史版本保存起来
- 4. 部署
  - 1. 把对应打包产物复制到nginx服务器的项目目录里: cp -r build/* /var/www/html/




简单Jenkinsfile示例：(Archive 英文是档案的意思， Artifacts 是制品的意思)


```

pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    stages {
        stage('拉取代码') {
            steps {
                // 从指定的Git仓库拉取代码。
                git 'https://github.com/your-repo.git'
            }
        }
        stage('装依赖') {
            steps {
                sh 'npm install'
            }
        }
        stage('打包构建') {
            steps {
                sh 'npm run build'
            }
        }
        stage('归档') {
            steps {
                // 将构建生成的文件归档，便于后续访问。
                archiveArtifacts artifacts: 'build/**/*', allowEmptyArchive: false
            }
        }
        stage('部署到当前服务器') {
            when {
                branch 'main'
            }
            steps {
                script {
                    // 使用 cp 命令将构建文件复制到Nginx的web根目录 /var/www/html/。
                    sh 'cp -r build/* /var/www/html/'

                    // 执行 sudo systemctl restart nginx 命令以重启Nginx服务。
                    sh 'sudo systemctl restart nginx'
                }
            }
        }
    }
    post {
        // 在构建完成后始终清理工作空间，避免占用磁盘空间。
        always {
            cleanWs()
        }
    }
}




```

pipeline { ... }：
定义一个Pipeline。

agent any：
指定在任何可用的节点上运行。

environment { NODE_ENV = 'production' }：
设置环境变量，指定Node.js的运行环境。

stages { ... }：
定义多个构建阶段。