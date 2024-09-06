
## 概述
提供了加密功能，其中包括了用于 OpenSSL 散列、HMAC、加密、解密、签名、以及验证的函数的一整套封装。

## 对称加密
### 概念
对称加密是采用相同的密钥进行数据的加密和解密。<br/>
特点就是加密和解密速度快，适合大量数据的加密。<br/>
核心API：createCipher「加密」、createDecipher「解密」<br/>
应用场景：文件加密「大量数据加密，如文件或数据库记录」、通信加密「在不担心密钥交换下，内网通信」

### createCipher、createDecipher
> algorithm：算法规则
> 
> key：算法规则的原始密钥
> 
> iv： 初始化向量
> 
> options：配置项

### 示例
```javascript
// 引入模块
const crypto = require("node:crypto");

// 生成随机16字节的初始化变量 iv
const iv = crypto.randomBytes(16);

//  生成随机32字节的key
const key = crypto.scryptSync('password','salt', 32);

// 创建加密实例，使用 AES-256-CBC 算法，提供密钥和初始化向量
const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

// 对输入数据进行加密，并输出加密结果的十六进制表示

// ```两者配合使用 update 和 final 来保证加密数据的完整性```

// 分块加密数据
let encrypted = cipher.update("node学习知识点", "utf8", "hex");
// 完成加密数据，返回最终加密数据
encrypted += cipher.final("hex");

console.log("🚀 ~ 加密：encrypted:", encrypted);

// 解密
const de = crypto.createDecipheriv("aes-256-cbc", key, iv);

// 使用十六进制格式处理加密数据
let decrypted = de.update(encrypted, "hex", "utf8");
// 最后一部分数据
decrypted += de.final("utf8");

console.log("🚀 ~ 解密：decrypted:", decrypted);
```
## 非对称加密

### 概念
非对称加密使用一对密钥，公钥和私钥，公钥可以共享，用于加密，私钥保密，用于解密。<br/>
特点是加密安全性较高，但是加密和解密速度慢，用于小量数据加密处理。<br/>
核心API：generateKeyPairSync「生成密钥对」、publicEncrypt「加密」、privateDecrypt「解密」<br/>
应用场景：安全通信「在需要确保数据传输安全的场合，如SSL/TLS协议」、数字签名「验证数据的完整性和来源，如软件下载、电子邮件」、身份验证「在需要验证用户身份的场景中，如登录系统」
    
### generateKeyPairSync
用于生成密钥对
>  type: 'rsa'、'rsa-pss'、'dsa'、'ec'、'ed25519'、'ed448'、'x25519'、'x448' 或 'dh'。
>
> options: {
> modulusLength： 单位的密钥大小  越长越安全，但是越慢
> }
> 
> 返回：{
> publicKey:  公钥
> privateKey： 私钥
> }

### publicEncrypt、privateDecrypt
加密和解密数据
> key:  公钥、私钥
> 
> buffer:  加密：要加密的数据， 解密：加密生成后的buffer
> 
> 返回： 加密：返回加密内容的新buffer，解密：返回解密内容的新buffer

### 示例
```javascript
// 引入模块
const crypto = require("node:crypto");

// 生成RSA密钥对
const { publickey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048
})

// 要加密的数据
const  contant = '非对称加密'

// 加密数据
const encrypetdData = crypto.publicEncrypt(publickey, Buffer.from(contant));
console.log("🚀 ~ encryptedData:", encryptedData)

// 解密数据
const decrypetdData = crypto.privateDecrypt(privateKey,encrypetdData);
console.log("🚀 ~ decryptedData:", decryptedData.toString())
```
## 哈希函数

### 概述
哈希函数是一个单向加密算法，可以将任意长度的数据变成固定的哈希值<br/>
特点就是不可逆，常用于验证数据的完整性<br/>
核心API：createHash「创建hash对象」<br/>
应用场景：密码存储「存储用户密码的哈希值，而不是明文密码」、数据完整性验证「确保文件或数据在传输过程中未被篡改」、唯一性检查「检查数据库中是否存在重复记录」
### createHash
> algorithm: 算法  md5 sha256...
> 
> options: 配置项

### 示例
```javascript
// 引入模块
const crypto = require("node:crypto");

// 计算内容
const hashContant = "哈希函数";

// 使用sha256创建hash对象
const hash = crypto.createHash("sha256");

// 更新数据并计算hash值
const hashVal = hash.update(hashContant).digest("hex");

console.log("🚀 ~ hashContant:", hashContant)
console.log("🚀 ~ hashVal:", hashVal)
```
