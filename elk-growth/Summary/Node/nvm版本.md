

## 简介
nvm（node.js version management），是一个nodejs的版本管理工具。nvm和n都是node.js版本管理工具，为了解决node.js 各种版本存在不兼容现象 可以通过它可以安装和切换不同版本的node.js。「可同时在一个环境中安装多个node.js版本（和配套的npm）」

## 常用命令
> nvm  list   查看已安装的版本
> 
> nvm install  (version)   安装指定版本
> 
> nvm uninstall  (version)  卸载指定版本
> 
> nvm use  (version)  切换使用指定版本
> 
> nvm ls  列出所有版本
>

## 问题

使用nvm use 切换到14版本的时候，发现node -v 提示出了对应版本，但是使用npm -v 会出错 「npm 不是内部或外部命令，也不是可运行的程序或批处理文件」

## 处理
1、node版本对应npm版本查询<br/>
2、下载对应版本的npm<br/>

    1)下载成功后解压文件，把解压后的 node_modules/npm 拷贝到 nvm 目录下对应的node版本node_module目录中 改名为 npm
    2)将下载的npm/bin里的 npm npm.cmd 这两个文件放到node_modules同一层

