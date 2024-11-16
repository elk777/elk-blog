

export const nav = [
    { text: '首页', link: '/' },
    {
        text: "个人成长",
        items: [
            {text: '环游世界',link:'/elk-growth/Travel/'},
            {text: '问题总结',link: "/elk-growth/Summary/"}
        ]
    },
    {
        text: "个人项目",
        items: [
            {text: '项目实践',link:'/elk-project/Project/'},
            // {text: '工具实践',link: "/elk-project/Tools/"}
        ]
    },
    {
        text: "学习笔记",
        items: [
            {text: 'TypeScript',link:'/elk-note/TypeScript/'},
            {text: 'NodeJS',link: "/elk-note/NodeJs/"},
            {text: 'NestJS',link: "/elk-note/NestJs/"},
        ]
    },
    {
        text: "关于我",
        items: [
            {text: 'github',link:'https://github.com/elk777'},
            {text: '掘金社区',link: "https://juejin.cn/user/3940246036416872"}
        ]
    },
]
