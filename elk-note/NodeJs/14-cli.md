
## 概述

### 什么是脚手架
例如： vue-cli、Create React App、Angular CLI
一个定制化的工具，用于快速生成项目的基础结构和代码文件，以及一些常用的命令和功能

> **项目结构**：脚手架定义了项目的基本结构，包含源代码。配置项和静态资源
> 
> **文件模版**：脚手架提供了一些基础的模版，比如HTML模版、样式表、配置文件等，加快开发者使用上手
> 
> **命令行接口**：脚手架通常提供一个命令行接口，通过输入命令和参数，开发者可以执行各种任务，如创建新项目、生成代码文件、运行测试等
> 
> **依赖管理**：脚手架可以帮助开发者管理项目的依赖项，自动安装和配置所需的库和工具。
> 
> **代码生成**：脚手架可以生成常见的代码结构，如组件、模块、路由等，以提高开发效率。
> 
> **配置管理**：脚手架可以提供一些默认的配置选项，并允许开发者根据需要进行自定义配置。

## 工具介绍
### commander
https://github.com/tj/commander.js/blob/master/Readme_zh-CN.md <br/>
构建命令行工具
> Commander 是一个用于构建命令行工具的 npm 库。它提供了一种简单而直观的方式来创建命令行接口，并处理命令行参数和选项。使用 Commander，你可以轻松定义命令、子命令、选项和帮助信息。它还可以处理命令行的交互，使用户能够与你的命令行工具进行交互.
### inquirer
https://github.com/SBoudrias/Inquirer.js <br/>
命令行交互工具
> Inquirer 是一个强大的命令行交互工具，用于与用户进行交互和收集信息。它提供了各种丰富的交互式提示（如输入框、选择列表、确认框等），可以帮助你构建灵活的命令行界面。通过 Inquirer，你可以向用户提出问题，获取用户的输入，并根据用户的回答采取相应的操作。
### ora
https://github.com/sindresorhus/ora <br/>
命令行执行动画
> Ora 是一个用于在命令行界面显示加载动画的 npm 库。它可以帮助你在执行耗时的任务时提供一个友好的加载状态提示。Ora 提供了一系列自定义的加载动画，如旋转器、进度条等，你可以根据需要选择合适的加载动画效果，并在任务执行期间显示对应的加载状态。
### download-git-repo
git仓库下载
> Download-git-repo 是一个用于下载 Git 仓库的 npm 库。它提供了一个简单的接口，可以方便地从远程 Git 仓库中下载项目代码。你可以指定要下载的仓库和目标目录，并可选择指定分支或标签。Download-git-repo 支持从各种 Git 托管平台（如 GitHub、GitLab、Bitbucket 等）下载代码。

## 代码编写

- index.js
```javascript
#!/usr/bin/env node

import { program } from 'commander';
import inquirer from 'inquirer'
import fs from 'fs';
import { checkPath, downloadGit } from './utils.js'

const json = fs.readFileSync("../package.json", 'utf-8');
const version = JSON.parse(json).version;

//获取版本命令
program.version(version);
//创建模版命令
program.command("create <projectName>").description("创建项目").action(projectName => {
//    使用命令行交互工具
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: "请输入项目名称：",
            default: projectName
        },
        {
            type: 'confirm',
            name: 'isTs',
            message: "是否使用TypeScript"
        }
    ]).then( res => {
        if(checkPath(res.projectName)){
            console.log("文件已存在!")
            return
        }
        if(res.isTs) {
            downloadGit('ts', res.projectName)
        }else {
            downloadGit('js', res.projectName)
        }
    })
})

// 解析
program.parse(process.argv);
```
- utils.js
```javascript
import fs from 'fs';
import ora from 'ora';
import download from 'download-git-repo'

//验证文件是否存在
export const checkPath = (path) => {
    return fs.existsSync(path);
}

//下载git仓库
const spinner = ora('下载中...')
export const downloadGit = (branch, projectName) => {
    //开启动画
    spinner.start();
    return new Promise((resolve, reject) => {
        download(`direct:https://gitee.com/chinafaker/vue-template.git#${branch}`, projectName, {clone: true}, err => {
            if(err) reject(err);
            resolve();
            //关闭动画
            spinner.succeed("下载完成")
        })
    })
}
```
## 使用

本cli支持两个命令 -V 、 create <name />  
<br/>package.json
```json
{
  "bin": {
    "elk-vue-cli" : "src/index.js"
  }
}
```
终端
```shell
 # 创建软链接
 npm link 
 
 # 获取版本
 elk-vue-cli -V  
 
 # 创建应用
 elk-vue-cli create <projectName>
```








