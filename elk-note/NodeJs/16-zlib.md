
## 概述
Nodejs中的zlib模块提供了使用Gzip、Deflate/inflate以及Brotli实现压缩的功能，为了减少数据的传输大小和提高性能
压缩和解压缩是围绕node-api中的流构建的

主要作用：
> **数据压缩**：数据压缩：使用 zlib 模块可以将数据以无损压缩算法（如 Deflate、Gzip）进行压缩，减少数据的大小。这在网络传输和磁盘存储中特别有用，可以节省带宽和存储空间。
> 
> **数据解压缩**： zlib 模块还提供了对压缩数据的解压缩功能，可以还原压缩前的原始数据。
> 
> **流压缩**：zlib 模块支持使用流（Stream）的方式进行数据的压缩和解压缩。这种方式使得可以对大型文件或网络数据流进行逐步处理，而不需要将整个数据加载到内存中。
> 
> **压缩格式支持**：zlib 模块支持多种常见的压缩格式，如 Gzip 和 Deflate。这些格式在各种应用场景中广泛使用，例如 HTTP 响应的内容编码、文件压缩和解压缩等。
## gzip
gzip 压缩是一种常用的数据压缩方法，它使用 Gzip 算法来压缩数据。Gzip 算法是基于 DEFLATE 压缩算法的一种实现，通常用于压缩网页、图片、视频等，以减少数据传输的时间和带宽消耗。
```javascript
const zlib = require("node:zlib");
const fs = require("node:fs");

// 创建可读流
const readStream = fs.createReadStream('index.txt');
//创建可写流
const writeStream = fs.createWriteStream("index.txt.gz");
// gzip压缩
const gzip = zlib.createGzip();
readStream.pipe(gzip).pipe(writeStream);

// 创建可读流
const unreanStream = fs.createReadStream('index.txt.gz');
// 创建可写流
const unwriteStream = fs.createWriteStream("index2.txt");
// gzip解压
const ungzip = zlib.createGunzip();
unreadStream.pipe(ungzip).pipe(unwriteStream)

```
## deflate
deflate是zlib模块提供的一种用于数据压缩的方式。这个方法使用DEFLATE/INFLATE算法来压缩数据，通常用于压缩需要传输的数据以减少网络传输时间或保存空间。
```javascript
// 压缩
const readStream = fs.createReadStream('index.txt');
const writeStream = fs.createWriteStream('index.txt.deflate');
const deflate = zlib.createDeflate();
readStream.pipe(deflate).pipe(writeStream);

// 解压
const readUnStream = fs.createReadStream('index.txt.deflate');
const writeUnStream = fs.createWriteStream('index3.txt');
const unzip = zlib.createUnzip();
readUnStream.pipe(unzip).pipe(writeUnStream);
```
### http请求压缩
```javascript
const http = require("node:http");
const zlib = require("node:zlib");
const server = http.createServer((req, res) => {
    const txt = 'elk'.repeat(1000);
    // 未压缩 - 3.2kb
    res.setHeader("Content-type", 'text/plan:charset=utf-8');
    res.end(txt);

    // deflate压缩 219b
    res.setHeader("Content-Encoding", "deflate");
    const deflate = zlib.deflateSync(txt);
    res.end(deflate)

    //gzip压缩 228b
    res.setHeader("Content-Encoding", "gzip");
    const gzip = zlib.gzipSync(txt);
    res.end(gzip)

});
server.listen(3471);
```
## 区别
> **压缩算法**：Gzip 使用的是 Deflate 压缩算法，该算法结合了 LZ77 算法和哈夫曼编码。LZ77 算法用于数据的重复字符串的替换和引用，而哈夫曼编码用于进一步压缩数据。
>
> **压缩效率**：Gzip 压缩通常具有更高的压缩率，因为它使用了哈夫曼编码来进一步压缩数据。哈夫曼编码根据字符的出现频率，将较常见的字符用较短的编码表示，从而减小数据的大小。
>
> **压缩速度**：相比于仅使用 Deflate 的方式，Gzip 压缩需要更多的计算和处理时间，因为它还要进行哈夫曼编码的步骤。因此，在压缩速度方面，Deflate 可能比 Gzip 更快。
> 
> **应用场景**：Gzip 压缩常用于文件压缩、网络传输和 HTTP 响应的内容编码。它广泛应用于 Web 服务器和浏览器之间的数据传输，以减小文件大小和提高网络传输效率。
