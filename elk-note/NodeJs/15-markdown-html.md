
## 概述
将markdown文件转为html文件

markdown： 一种轻量级标记语音，可以使用纯文本格式编写文档

## 工具介绍

### EJS
文档：https://ejs.bootcss.com
> 一款强大的JavaScript模板引擎，它可以帮助我们在HTML中嵌入动态内容。使用EJS，您可以轻松地将Markdown转换为美观的HTML页面。
```ejs
1、纯脚本标签
可以是任意的js，用于流程控制，无输出
<% alart("hello ejs") %>

2、输出转义的html标签
<%= value %>  变量
<%= a ? b : c %> 表达式
<%= a + b %>

用<%=，最好保证里面内容不要有HTML字符

3、输出非转义的数据到模板
<%- 富文本数据 %> 通常用于输出富文本，即 HTML内容

4、引入模版
<%- include('***文件路径') %>

5、判断
<% if(a){ %>
        <p> 我是a的内容</p>
<% } else if (b) { %>
        <p> 我是b的内容</p>   
<% } else { %>
        <p> 我是c的内容</p>  
<% } %>

6、循环
<% for(var css of cssArr) { %>
  <link rel="stylesheet" href="<%= css %>" />
<% } %>
```
### Marked
文档：https://github.com/markedjs/marked
> 一个流行的Markdown解析器和编译器，它可以将Markdown语法转换为HTML标记。Marked是一个功能强大且易于使用的库，它为您提供了丰富的选项和扩展功能，以满足各种转换需求。
### BrowserSync
文档：https://browsersync.devjs.cn/
> 一个强大的开发工具，它可以帮助您实时预览和同步您的网页更改。当您对Markdown文件进行编辑并将其转换为HTML时，BrowserSync可以自动刷新您的浏览器，使您能够即时查看转换后的结果。

## 代码编写

- template.ejs <br/>

初始化模板 到时候会转换成html代码
```ejs
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= title %></title>
</head>
<body>
    <%- content %>
</body>
</html>
```
- index.js
```javascript
const ejs = require("ejs"); // 导入ejs，用于渲染模版
const fs = require("fs"); // 导入fs，用于系统文件操作
const marked = require("marked"); // 导入marked，用于markdown转html
const readme = fs.readFileSync("README.md"); // 读取文档
const browserSync = require("browser-sync"); // 引入browser-sync，用于实时预览和同步浏览器

const openBrowser = () => {
	const browser = browserSync.create();
	browser.init({
		server: {
			baseDir: "./",
			index: "index.html",
		},
	});
	return browser;
};
ejs.renderFile(
	"template.ejs",
	{
		content: marked.parse(readme.toString()),
		title: "markdown to html",
	},
	(err, result) => {
		if (err) throw err;
        let writeStream = fs.createWriteStream('index.html');
        writeStream.write(result);
        writeStream.close();
        writeStream.on("finish", function () {
            openBrowser()
        });
	}
);
```
