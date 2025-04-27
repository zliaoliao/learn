## 概念

Nginx 是一个高性能的 HTTP 和反向代理服务器。它以高并发、高稳定性和低资源消耗著称，广泛用于 Web 服务器和反向代理服务器。

### 关键功能

#### 反向代理

反向代理是指代理服务器接收客户端请求，然后将请求转发给内部服务器，并将服务器的响应返回给客户端。Nginx 常用于反向代理以提高网站性能和安全性。

配置关键词： listen， server_name， location

#### 负载均衡

Nginx 可以将流量分发到多台服务器上，均衡负载，提升性能和可靠性。常用的负载均衡算法包括轮询（round-robin）、最少连接（least connections）、IP 哈希（IP hash）等。

配置关键词： upstream

#### 动静分离

动静分离是指将动态请求和静态请求分开处理。静态资源如图片、CSS、JavaScript 文件、静态 HTML 页面直接由 Nginx 处理，动态请求如 PHP、Python 等由后端服务器处理。


配置关键词： location


## nginx 安装

简单安装可以之间docker 安装nginx镜像，启动容器，nginx就自动启动了，然后： $ docker run --name some-nginx -d -p 8080:80 some-content-nginx


一般安装nginx后默认：
 - 配置文件的位置 /etc/nginx/nginx.conf。
 - 默认站点文件：/usr/share/nginx/html

默认访问nginx 端口是80， 但是直接访问是访问不了的，需要在防火墙中放开这个端口；


## 常用命令

检查 Nginx 配置文件路径： `nginx -t`
- 该命令将输出配置文件的位置，一般是 /etc/nginx/nginx.conf, 同时会测试 Nginx 的配置文件是否有语法错误


启动nginx: `nginx`
- 守护进程方式启动：nginx -g 'daemon off;'

停止nginx: nginx -s quit 或者 `nginx -s stop`
- nginx -s quit 命令是用来*优雅地停止 Nginx 服务的*。当执行这个命令时，Nginx 会停止接收新的连接，但会继续处理当前正在处理的连接，直到所有的连接都处理完成后，Nginx 才会退出。
- nginx -s stop 直接粗暴停止

重启nginx：`nginx -s reload`
- 改了nginx配置文件，如果想要配置生效，就得重启nginx


在 Nginx 的命令中，*-s 是一个选项，表示 "signal"，也就是 "信号"*。当你在命令行中执行 nginx -s <signal> 时，你实际上是在给 Nginx 进程发送一个操作信号。


额外知识：

- ps -ef
  - 用于在类 Unix 操作系统中显示当前运行的所有进程的快照。
    - ps: 显示系统当前的进程状态。
    - -e: 显示所有进程，等同于 -A。
    - -f: 以完整格式显示进程的信息。full
  - 返回：
    - UID：用户 ID，表示进程的所有者。
    - PID：进程 ID。


## nginx 的配置文件

nginx 是由配置文件中指定的*指令控制模块*组成。指令可分为*简单指令和块指令*。
- 简单的指令： 由指令名称和参数组成，空格隔开，并以分号 ; 结尾
- 块指令: 块指令具有与简单指令相同的结构，但不是以分号结尾，而是以大括号{}包围的一组附加指令结尾。如果块指令的大括号内部可以有其它指令，则称这个块指令为上下文。如（events，http，server 和 location）。
- 配置文件中被放置在任何上下文之外的指令都被认为是主上下文 main



Nginx 的配置主要集中在 nginx.conf 文件中，这个文件的结构大致可以分为几个主要部分：

- 1. 全局块：这部分设置一些影响 Nginx 服务器整体运行的配置指令，包括进程数，用户，错误日志路径等。
- 2. events 块：这部分主要设置网络相关的选项，比如连接数限制，客户端超时时间等。
- 3. http 块：这是最频繁使用的块，可以包含多个 server 块。这部分主要设置 HTTP 服务器，包括文件路径，日志路径，连接超时时间，单链接请求数限制等。
  - server 块：这部分设置虚拟主机的相关参数，一个 http 块中可以有多个 server 块。
    - location 块：location 定义了如何处理特定类型的请求。一个 server 块中可以有多个 location 块。
  
Nginx 的配置文件使用一种简单的文本格式，每个指令后面都要跟一个分号表示结束。指令和参数之间以空格分隔。



### http块

listen: 端口;  // 监听端口
server_name: 服务器域名或者ip;

ps: http 块和 server 块都可以设置 listen 和 server_name 指令;为了灵活性；

http 块是 Nginx 配置的全局设置，所有的 server 块都会继承这里的配置（除非在 server 块中明确指定）
server 块是针对特定虚拟主机的设置。

## server块

location 块: 一旦 nginx 决定由哪个 server 来处理请求，它会根据 server 块中定义的 location 指令的参数来检验请求头中指定的URI
  - *用location 匹配路径*， 如果有几个匹配上的 location 块指令，nginx 将选择location路径最长的。
  - *匹配到的路径会添加到root路径后*，形成完整路径，去查找服务器文件
    - root 可以看做是基础路径
```
server {
  location / {
      root /data/www;
  }
}
```

root: root 配置指令用于指定资源的访问根目录（基础目录），如果在 location 块中没有指定 root，那么 Nginx 会使用 server 块中的 root 指令。如果在 server 块中也没有定义 root，那么 Nginx 会使用 http 块中的 root 指令。这种向上级块查找方式称为*配置继承*。
  - location 块中的配置可以没有 root，但是这时候必须要在上级的 server 块或者 http 块中定义 root，否则 Nginx 不知道去哪里找资源


alias: root 和 alias 都是用来定义服务器静态资源文件的映射路径的，但是它们的使用场景和处理方式有所不同:
 - root：这个指令会将请求的 URI 添加到指定的路径后面
 - alias：这个指令会用指定的路径替换掉请求中的匹配路径部分（alias 指令的路径会直接替换掉请求路径）
 - 这两个指令不能同时使用

## 反向代理

关键指令： proxy_pass
- 一旦location匹配到路径，将通过proxy_pass 转发到对应服务器

```
server {
    location / {
        proxy_pass http://localhost:8080;
    }

    location /images/ {
        root /data;
    }
}


```


## 使用

### 定义变量

可以使用 set 指令来定义变量：

`set $variable value;`

为指定的 variable 设置一个 value，value 可以包含文本、变量及其组合。上下文是server、location、if。

### 获取参数

`$arg_<parameter_name>`

用$arg_参数名，获取url的问号传参。

例如，对于 URL http://example.com/test?foo=bar，可以使用 $arg_foo 来获取参数 foo 的值


