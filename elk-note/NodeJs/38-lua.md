
## 介绍
Lua是一种轻量级、高效、可嵌入的脚本语言，最初由巴西里约热内卢天主教大学（Pontifical Catholic University of Rio de Janeiro）的一个小团队开发而成。它的名字"Lua"在葡萄牙语中意为"月亮"，寓意着Lua作为一门明亮的语言。

Lua具有简洁的语法和灵活的语义，被广泛应用于嵌入式系统、游戏开发、Web应用、脚本编写等领域。它的设计目标之一是作为扩展和嵌入式脚本语言，可以与其他编程语言无缝集成。Lua的核心只有很小的代码库，但通过使用模块和库可以轻松地扩展其功能。

**特点和用途介绍**：

1、简洁高效：Lua的语法简单清晰，语义灵活高效。它使用动态类型和自动内存管理，支持面向过程和函数式编程风格，并提供了强大的协程支持。

2、嵌入式脚本语言：Lua被设计为一种可嵌入的脚本语言，可以轻松地与其他编程语言集成。它提供了C API，允许开发者将Lua嵌入到C/C++程序中，或者通过扩展库将Lua嵌入到其他应用程序中。

3、游戏开发：Lua在游戏开发中广泛应用。许多游戏引擎（如Unity和Corona SDK）都支持Lua作为脚本语言，开发者可以使用Lua编写游戏逻辑、场景管理和AI等。

4、脚本编写：由于其简洁性和易学性，Lua经常被用作脚本编写语言。它可以用于编写各种系统工具、自动化任务和快速原型开发。

5、配置文件：Lua的语法非常适合用作配置文件的格式。许多应用程序和框架使用Lua作为配置文件语言，因为它易于阅读、编写和修改。

<br/>
为了增强性能和扩展性，可以将Lua与Redis和Nginx结合使用。这种组合可以用于构建高性能的Web应用程序或API服务。


1、Redis：Redis是一个快速、高效的内存数据存储系统，它支持各种数据结构，如字符串、哈希、列表、集合和有序集合。与Lua结合使用，可以利用Redis的高速缓存功能和Lua的灵活性来处理一些复杂的计算或数据查询。

- 缓存数据：使用Redis作为缓存存储，可以将频繁访问的数据存储在Redis中，以减轻后端数据库的负载。Lua可以编写与Redis交互的脚本，通过读取和写入Redis数据来提高数据访问速度。
- 分布式锁：通过Redis的原子性操作和Lua的脚本编写能力，可以实现分布式锁机制，用于解决并发访问和资源竞争的问题。



2、Nginx：Nginx是一个高性能的Web服务器和反向代理服务器。它支持使用Lua嵌入式模块来扩展其功能。

- 请求处理：使用Nginx的Lua模块，可以编写Lua脚本来处理HTTP请求。这使得可以在请求到达应用程序服务器之前进行一些预处理、身份验证、请求路由等操作，从而减轻后端服务器的负载。
- 动态响应：通过结合Lua和Nginx的subrequest机制，可以实现动态生成响应。这对于根据请求参数或其他条件生成动态内容非常有用。
- 访问控制：使用Lua脚本，可以在Nginx层面对访问进行细粒度的控制，例如IP白名单、黑名单、请求频率限制等。

## 安装和使用
### windows安装

[lua地址](https://www.lua.org/download.html)

[luarocks地址](https://luarocks.github.io/luarocks/releases/)

官网提供了两种下载方式: 下载压缩包、在线压缩包

**这边以下载压缩包为例**：

1、点击下载压缩包

![img_32.png](img_32.png)

2、解压压缩包

3、配置环境变量
- 右键点击“我的电脑”或“此电脑”，选择“属性”，然后点击“高级系统设置”。
- 在“系统属性”窗口中，点击“环境变量”按钮。
- 在“系统变量”区域中找到并选择“Path”变量，然后点击“编辑”。
- 点击“新建”，将Lua的bin目录路径（例如C:\Lua\bin）添加到列表中。
- 确认保存后，您可以通过在命令提示符（cmd）中输入lua来验证Lua是否正确安装。

### mac安装
```shell
# 使用homebrew安装
# luarocks : 类似与nodejs的npm包
brew install lua luarocks 

# 检查版本
lua -v   # 5.4.7
luarocks --version  # 3.11.1
```
### 使用
- demo.lua
```lua
a = 2

print(a)
```
```shell
lua demo.lua // 终端输出2 代表安装成功且可以使用
```