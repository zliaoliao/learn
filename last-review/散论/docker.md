## 传统分层架构 vs 微服务

简单系统（初创公司）适合用分层架构，所有代码在一起， 易部署，易测试， 易横向扩展，这时如果用微服务会增加系统复杂性， 
把集中部署变成分布式部署：
-  需要实现基于或者rpc 的进程间通讯， 需要处理部分失败等分布式系统的复杂问题，
-  微服务采用分区数据库架构， 一个事务需要更新不同微服务的数据库， 分布式事务更复杂（失败回滚）
-  测试更复杂
-  部署监控更复杂

随着系统开始变的复杂，这时候就要用微服务架构了，如果还用分层架构，会有以下缺点：
- 难以理解整体，没有一个人能了解系统的所有
- 不易快速维护
- 启动慢，部署慢
- 变更引起的回归问题多
- 难以做持续集成和持续部署
如果这时用微服务架构，有如下好处：
- 部署更快
- 更容易维护和理解系统，不同服务由不同team维护， 分工更细， 更关注业务
- 开发团队可以自主选择技术栈
- 微服务架构使每个服务独立部署，易于持续集成和持续部署
## 微服务改造

分离微服务建议：一般按业务逻辑拆分

一些常用的可微服务化的组件： 
- 用户和账户管理
- 授权和会话管理
- 系统配置
- 通知和通讯服务
- 照片，元数据， 多媒体等

## 微服务之间的通讯

- 1. 点对点
  - 多用于系统内部多组件之间的通讯
  - 缺少统一规范，如监控， 审计等功能
  - 后期维护成本高， 服务和服务的依赖关系错综复杂难以管理
- 2. 基于api网关
  - 基于一个轻量级message gateway
  - 新api通过注册至gateway实现
  - 整合实现Common function

# docker

基于linux内核的cgroup, namespace, 以及union fs等技术， 对进程进行封装隔离， 属于操作系统层面的虚拟化技术， 
由于隔离的进程独立于宿主和其它的隔离的进程， 因此也称为容器；

docker在容器的基础上， 进行了进一步的封装， 从文件系统， 网络互联到进程隔离等等， 极大的简化了容器的创建和维护， 使得docker技术比虚拟化技术更为轻便，快捷；

## 为什么要用docker

- 更高效的利用系统资源，资源利用率高
- 更快速的启动时间
- 一致的运行环境，可以构建成镜像
- 持续交付和部署
- 更轻松的迁移
- 更轻松的维护和扩展

与其他方式对比，虚拟化，一定要有虚拟机， 虚拟机是要虚拟操作系统的，有不少资源开销。
- 底层物理机server => *host os 主机系统 => hypervisor 虚拟化技术 => xx os 虚拟机操作系统 => 应用资源*

容器化，基于cgroup, namespace，不要虚要虚拟化任何东西，不需要占用很多额外资源。  
- 底层物理机server => *host os 主机系统 => docker engine 进程  => 应用资源*


低优先级，大概知道就行，以后需要再学吧



