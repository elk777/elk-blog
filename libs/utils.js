/*
 * @Author: elk
 * @Date: 2024-11-14 11:04:55
 * @LastEditors: elk
 * @LastEditTime: 2024-11-14 15:19:53
 * @FilePath: /NodeJs/27-reptile/index.js
 * @Description: 自动生成侧边导航栏脚本编写
 */

import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'url';
// 获取当前文件的路径
const __filename = fileURLToPath(import.meta.url);
// 获取当前文件所在的目录路径
const __dirname = path.dirname(__filename);
// 获取根目录的绝对路径
// 假设你想要获取项目根目录，可以向上遍历两级
const rootDir = path.resolve(__dirname, '../');

/**
 * @description: 自动生成侧边导航栏
 * params dir {string}  根目录
 * params textDir {string} 侧边栏标题
 * @return {*}
 */
export const voluntarilySideBar = (dir, textDir = '') => {
    // 存储包装好的数据结构
    let results = [];
    // 获取指定地址下的文件目录信息
    const catalogues = fs.readdirSync(rootDir + dir + textDir);
    // 过滤掉后缀名以及index.md文件和非.md文件
    const mapCatalogs = catalogues.filter(item => item !== 'index.md' && path.extname(item) == '.md' ).map( item => item.split(".")[0])
    // 添加完整路径
    mapCatalogs.forEach( item => {
        results.push({
            text: item,
            link: path.join(dir, textDir, item)
        })
    })
    return {
        text: textDir,
        items:results
    }
}
