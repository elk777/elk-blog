

## 概述
FFmpeg 是一个开源的跨平台多媒体处理工具，可以用于处理音频、视频和多媒体流。它提供了一组强大的命令行工具和库，可以进行视频转码、视频剪辑、音频提取、音视频合并、流媒体传输等操作。

> **格式转换**：FFmpeg 可以将一个媒体文件从一种格式转换为另一种格式，支持几乎所有常见的音频和视频格式，包括 MP4、AVI、MKV、MOV、FLV、MP3、AAC 等
> 
> **视频处理**：FFmpeg 可以进行视频编码、解码、裁剪、旋转、缩放、调整帧率、添加水印等操作。你可以使用它来调整视频的分辨率、剪辑和拼接视频片段，以及对视频进行各种效果处理。
>
> **音频处理**：FFmpeg 可以进行音频编码、解码、剪辑、混音、音量调节等操作。你可以用它来提取音频轨道、剪辑和拼接音频片段，以及对音频进行降噪、均衡器等处理
> 
> **流媒体传输**：FFmpeg 支持将音视频流实时传输到网络上，可以用于实时流媒体服务、直播和视频会议等应用场景。
> 
> **视频处理效率高**：FFmpeg 是一个高效的工具，针对处理大型视频文件和高分辨率视频进行了优化，可以在保持良好质量的同时提供较快的处理速度
> 
> **跨平台支持**：FFmpeg 可以在多个操作系统上运行，包括 Windows、MacOS、Linux 等，同时支持多种硬件加速技术，如 NVIDIA CUDA 和 Intel Quick Sync Video

## 安装
官方地址：http://ffmpeg.p2hp.com/download.html <br/>
选择指定的操作系统进行下载，最后输入ffmpeg -version 不报错即可
> **macos**: brew install ffmpeg

## 实例
### demo转gif
```javascript
const { execSync }  = require("node:child_process");
execSync(`ffmpeg -i demo.mp4 -r 1 -f image2 demo.gif`,{stdio:'inherit'})
```
### 添加水印
> -vf 就是video filter
> 
> drawtext 添加文字 fontsize 大小 xy垂直水平方向 fontcolor 颜色 text 水印文案 全部小写
```javascript
const { execSync }  = require("node:child_process");
execSync(`ffmpeg -i demo.mp4 -vf drawtext=text="elk":fontsize=30:fontcolor=white:x=10:y=10 demo2.mp4`,{stdio:'inherit'})
```

### 去掉水印
> w h 宽高
> 
> xy 垂直 水平坐标
> 
> delogo使用的过滤参数删除水印
```javascript
const { execSync }  = require("node:child_process");
execSync(`ffmpeg -i demo2.mp4 -vf delogo=w=120:h=30:x=10:y=10 demo3.mp4`,{stdio:'inherit'})
```
