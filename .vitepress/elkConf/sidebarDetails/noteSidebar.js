

/*
* 专题栏： 学习笔记
* */

import { voluntarilySideBar } from '../../../libs/utils.js'

export const  noteSidebarDetails = {
    // TS知识点目录
    '/elk-note/TypeScript/': [ voluntarilySideBar('/elk-note/', 'TypeScript') ],
    // NodeJs知识点目录
    '/elk-note/NodeJs/': [ voluntarilySideBar('/elk-note/', 'NodeJs') ],
    // NestJs知识点目录
    '/elk-note/NestJs/': [ voluntarilySideBar('/elk-note/', 'NestJs') ],
    // TS知识点目录
    // '/elk-note/TypeScript/': [
    //     {
    //         text: 'TypeScript',
    //         items: [
    //             {
    //                 text: '01-基本类型',
    //                 link: '/elk-note/TypeScript/01-基本类型'
    //             },
    //             {
    //                 text: '02-任意类型',
    //                 link: '/elk-note/TypeScript/02-任意类型'
    //             },
    //             {
    //                 text: '03-interface接口',
    //                 link: '/elk-note/TypeScript/03-interface接口'
    //             },
    //             {
    //                 text: '04-数组类型',
    //                 link: '/elk-note/TypeScript/04-数组类型'
    //             },
    //             {
    //                 text: '05-函数类型',
    //                 link: '/elk-note/TypeScript/05-函数类型'
    //             },
    //             {
    //                 text: '06-联合|交叉类型、类型断言',
    //                 link: '/elk-note/TypeScript/06-联合、交叉类型，类型断言'
    //             },
    //             {
    //                 text: '07-内置对象',
    //                 link: '/elk-note/TypeScript/07-内置对象'
    //             },
    //             {
    //                 text: '08-Class类',
    //                 link: '/elk-note/TypeScript/08-Class类'
    //             },
    //             {
    //                 text: '09-元组类型',
    //                 link: '/elk-note/TypeScript/09-元组类型'
    //             },
    //             {
    //                 text: '10-枚举类型',
    //                 link: '/elk-note/TypeScript/10-枚举类型'
    //             },
    //             {
    //                 text: '11-类型推论|类型别名',
    //                 link: '/elk-note/TypeScript/11-类型推论|类型别名'
    //             },
    //             {
    //                 text: '12-symbol类型',
    //                 link: '/elk-note/TypeScript/12-symbol类型'
    //             },
    //             {
    //                 text: '13-泛型',
    //                 link: '/elk-note/TypeScript/13-泛型'
    //             },
    //             {
    //                 text: '14-模块解析',
    //                 link: '/elk-note/TypeScript/14-模块解析'
    //             },
    //             {
    //                 text: '15-声明文件d_ts',
    //                 link: '/elk-note/TypeScript/15-声明文件d_ts'
    //             },
    //             {
    //                 text: '16-装饰器',
    //                 link: '/elk-note/TypeScript/16-装饰器.md'
    //             },
    //         ]
    //     }
    // ],
    // NodeJs知识点目录
    // '/elk-note/NodeJs/': [
    //     {
    //         text: 'NodeJs',
    //         items: [
    //             {
    //                 text: '01-介绍',
    //                 link: '/elk-note/NodeJs/01-介绍'
    //             },
    //             {
    //                 text: '02-模块化',
    //                 link: '/elk-note/NodeJs/02-模块化'
    //             },
    //             {
    //                 text: '03-全局变量',
    //                 link: '/elk-note/NodeJs/03-全局变量'
    //             },
    //             {
    //                 text: '04-CSR|SSR|SEO',
    //                 link: '/elk-note/NodeJs/04-CSR|SSR|SEO'
    //             },
    //             {
    //                 text: '05-path',
    //                 link: '/elk-note/NodeJs/05-path'
    //             },
    //             {
    //                 text: '06-os',
    //                 link: '/elk-note/NodeJs/06-os'
    //             },
    //             {
    //                 text: '07-process',
    //                 link: '/elk-note/NodeJs/07-process'
    //             },
    //             {
    //                 text: '08-child_process',
    //                 link: '/elk-note/NodeJs/08-child_process'
    //             },
    //             {
    //                 text: '09-ffmpeg',
    //                 link: '/elk-note/NodeJs/09-ffmpeg'
    //             },
    //             {
    //                 text: '10-events',
    //                 link: '/elk-note/NodeJs/10-events'
    //             },
    //             {
    //                 text: '11-util',
    //                 link: '/elk-note/NodeJs/11-util'
    //             },
    //             {
    //                 text: '12-fs',
    //                 link: '/elk-note/NodeJs/12-fs'
    //             },
    //             {
    //                 text: '13-crypto',
    //                 link: '/elk-note/NodeJs/13-crypto'
    //             },
    //             {
    //                 text: '14-cli',
    //                 link: '/elk-note/NodeJs/14-cli'
    //             },
    //             {
    //                 text: '15-markdown-html',
    //                 link: '/elk-note/NodeJs/15-markdown-html'
    //             },
    //             {
    //                 text: '16-zlib',
    //                 link: '/elk-note/NodeJs/16-zlib'
    //             },
    //             {
    //                 text: '17-http',
    //                 link: '/elk-note/NodeJs/17-http'
    //             },
    //             {
    //                 text: '18-express',
    //                 link: '/elk-note/NodeJs/18-express'
    //             },
    //             {
    //                 text: '19-express-hotLink',
    //                 link: '/elk-note/NodeJs/19-express-hotLink'
    //             },
    //             {
    //                 text: '20-express-req-res',
    //                 link: '/elk-note/NodeJs/20-express-req-res'
    //             },
    //             {
    //                 text: '21-mysql',
    //                 link: '/elk-note/NodeJs/21-mysql'
    //             },
    //             {
    //                 text: '22-mysql-sql',
    //                 link: '/elk-note/NodeJs/22-mysql-sql'
    //             },
    //             {
    //                 text: '23-mysql-query',
    //                 link: '/elk-note/NodeJs/23-mysql-query'
    //             },
    //             {
    //                 text: '24-mysql-crud',
    //                 link: '/elk-note/NodeJs/24-mysql-crud'
    //             },
    //             {
    //                 text: '25-mysql-function',
    //                 link: '/elk-note/NodeJs/25-mysql-function'
    //             },
    //             {
    //                 text: '26-mysql-child',
    //                 link: '/elk-note/NodeJs/26-mysql-child'
    //             },
    //             {
    //                 text: '27-mysql2',
    //                 link: '/elk-note/NodeJs/27-mysql2'
    //             },
    //             {
    //                 text: '28-knex',
    //                 link: '/elk-note/NodeJs/28-knex'
    //             },
    //             {
    //                 text: '29-prisma',
    //                 link: '/elk-note/NodeJs/29-prisma'
    //             },
    //             {
    //                 text: '30-mvc',
    //                 link: '/elk-note/NodeJs/30-mvc'
    //             },
    //             {
    //                 text: '31-jwt',
    //                 link: '/elk-note/NodeJs/31-jwt'
    //             },
    //             {
    //                 text: '32-redis',
    //                 link: '/elk-note/NodeJs/32-redis'
    //             },
    //             {
    //                 text: '33-redis-basic',
    //                 link: '/elk-note/NodeJs/33-redis-basic'
    //             },
    //             {
    //                 text: '34-redis-publish',
    //                 link: '/elk-note/NodeJs/34-redis-publish'
    //             },
    //             {
    //                 text: '35-redis-lasting',
    //                 link: '/elk-note/NodeJs/35-redis-lasting'
    //             },
    //             {
    //                 text: '36-redis-replication',
    //                 link: '/elk-note/NodeJs/36-redis-replication'
    //             },
    //             {
    //                 text: '37-ioredis',
    //                 link: '/elk-note/NodeJs/37-ioredis'
    //             },
    //             {
    //                 text: '38-lua',
    //                 link: '/elk-note/NodeJs/38-lua'
    //             },
    //             {
    //                 text: '39-lua-basic',
    //                 link: '/elk-note/NodeJs/39-lua-basic'
    //             },
    //             {
    //                 text: '40-lua-practice-1',
    //                 link: '/elk-note/NodeJs/40-lua-practice-1'
    //             },
    //             {
    //                 text: '41-timedTask',
    //                 link: '/elk-note/NodeJs/41-timedTask'
    //             },
    //             {
    //                 text: '42-serverLess',
    //                 link: '/elk-note/NodeJs/42-serverLess'
    //             },
    //             {
    //                 text: '43-net',
    //                 link: '/elk-note/NodeJs/43-net'
    //             },
    //             {
    //                 text: '44-socketIO',
    //                 link: '/elk-note/NodeJs/44-socketIO'
    //             },
    //             {
    //                 text: '45-reptile',
    //                 link: '/elk-note/NodeJs/45-reptile'
    //             }
    //         ]
    //     }
    // ],
    // NestJs知识点目录
    //     [
    //     {
    //         text: 'NestJs',
    //         items: [
    //             {
    //                 text: '01-介绍',
    //                 link: '/elk-note/NestJs/01-介绍'
    //             }
    //         ]
    //     }
    // ]
}
