
## 爬虫介绍

爬虫，也称为网络爬虫或网络蜘蛛，是指一种自动化程序或脚本，用于在互联网上浏览和提取信息。爬虫模拟人类用户在网页上的行为，通过HTTP协议发送请求，获取网页内容，然后解析并提取感兴趣的数据

> 在使用爬虫时，需要遵守法律法规和网站的使用条款

- 网站的使用条款：每个网站都有自己的使用条款和隐私政策，这些规定了对网站内容和数据的访问和使用限制。在使用爬虫之前，务必仔细阅读并遵守网站的使用条款。
- 知识产权：爬虫可能涉及到对网站上的内容进行复制、提取或分发。在进行这些操作时，你应该尊重知识产权法律，包括版权和商标法。确保你有合法的权利使用、复制或分发所爬取的内容。
- 网络破坏和滥用：使用爬虫时，应避免对目标网站造成不必要的负载、干扰或破坏。不得以恶意方式使用爬虫，如进行DDoS攻击、破解安全措施或非法搜集个人信息。
- 数据隐私和个人信息保护：在爬取网站上的数据时，需特别注意处理个人身份信息和隐私数据的合规性。遵守适用的数据保护法律，确保合法地处理和存储用户数据。
- 欺诈和滥用：不得使用爬虫进行欺诈、仿冒、垃圾邮件或其他非法活动。尊重其他用户和网站的利益，遵守公平竞争原则

[掘金规则](https://juejin.cn/robots.txt)

## 依赖安装

### Puppeteer
Puppeteer是一个Node库，它提供了一个高级API来通过DevTools协议控制Chromium或Chrome。Puppeteer默认以headless模式运行，但也可以通过修改配置文件运行“有头”模式。您可以使用Puppeteer完成绝大多数在浏览器中手动执行的操作，例如生成页面PDF、抓取SPA（单页应用）并生成预渲染内容、自动提交表单、进行UI测试、键盘输入等
```shell
npm install puppeteer
```
### python
使用python脚本进行分词和生成词云图
#### wordcloud
WordCloud是一个用于生成词云的Python库。它可以根据给定的文本数据，根据词频生成一个美观的词云图像，其中词语的大小表示其在文本中的重要程度或频率。WordCloud库提供了丰富的配置选项，可以控制词云的外观、颜色、字体等属性。你可以根据需求定制词云的样式和布局。WordCloud还提供了一些方便的方法，用于从文本中提取关键词、过滤停用词等。你可以使用pip安装WordCloud库，并参考官方文档进行使用。
```shell
pip install wordcloud #生成词云图
```
#### jieba
jieba是一个开源的中文分词库，用于将中文文本切分成单个词语。中文分词是NLP（自然语言处理）中的一个重要任务，jieba库提供了一种有效且灵活的分词算法，可以在中文文本中准确地识别出词语边界。jieba支持三种分词模式：精确模式、全模式和搜索引擎模式。你可以根据需要选择适合的分词模式
```shell
pip install jieba #中文分词
```
## 脚本编写

### index.js
Node端代码编写
```javascript
import puppeteer from "puppeteer";
import { spawn } from 'child_process';

// 获取执行命令后输入的关键字
const btnText = process.argv[2];

// 关闭无头模式
const browser = await puppeteer.launch({headless: false});

// 打开浏览器
const page = await browser.newPage();

// 设置浏览器窗口内容大小
page.setViewport({width: 1980, height: 1000});

// 跳转到掘金的首页
await page.goto("https://juejin.cn/");

// 等待左侧导航栏加载完毕后再获取
await page.waitForSelector('.side-navigator-wrap')

// 获取左侧导航栏的标题元素
const elements = await page.$$('.side-navigator-wrap .nav-item-wrap span');

/*
*  获取左侧导航栏对应的推荐列表内容
* */
// 存储推荐列表内容
const contentList = []
const collectFn = async () => {
    // 等待推荐内容加载完再获取
    await page.waitForSelector('.entry-list')
    // 获取推荐内容标题元素
    const contents = await page.$$('.entry-list .title-row a');
    // 遍历推荐内容标题元素，得到标题元素中的内容
    for await (let el of contents) {
        const text = await el.getProperty("innerText") // 获取el的属性
        const name = await text.jsonValue() // 获取span中的内容
        contentList.push(name) // 将得到的标题内容，push到数组集合中
    }
    console.log("🚀 ~ forawait ~ contentList:", contentList) // 打印测试一下
    // 创建子进程，调用phthon脚本，传递标题参数，生成词云图
    const pythonProcess = spawn("python3",["index.py", contentList.join(",")])
    // 监听子进程的输出
    pythonProcess.stdout.on("data", (data) => {
        console.log("输出data", data)
    })
    // 监听子进程的错误输出
    pythonProcess.stderr.on("data", (err) => {
        console.log("输出错误", err);
    })
    // 监听子进程的取消
    pythonProcess.on("close", (code) => {
        console.log("是否取消", code)
    })
}

// 循环遍历标题元素，得到内容
for await (let el of elements) {
    const text = await el.getProperty("innerText") // 获取el的属性
    const name = await text.jsonValue() // 获取span中的内容
    if(name.trim() === ( btnText || '前端' )) {
        el.click(); // 触发点击对应的菜单
        collectFn(); // 调用方法获取推荐内容
    }
}
```
### index.py
编写执行python脚本的内容，生成词云图
```python
import jieba #引入结巴库
from wordcloud import WordCloud #引入词云库
import matplotlib.pyplot as plt
import sys

# 接收node传递的参数
text = sys.argv[1]
# 进行分词
words = jieba.cut(text);
# 引入执行的中文字体
font = './font.ttf';
# wordcloud本身不支持中文，需指定中文字体
wc = WordCloud( font_path = font, width=1000, height=800, background_color+='white' );
wc.generate( ' '.join(words) )

# 输出词云图
plt.imshow(wc,interpolation='bilinear')
plt.axis('off')
plt.show() # 直接打开图片
# plt.savefig('wordcloud.png', format='png')
# plt.close()  # 关闭plt，避免内存泄漏
```
