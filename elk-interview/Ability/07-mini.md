

### 微信小程序的基本概念和作用

微信小程序是一种不需要下载安装即可使用的应用，依托微信生态，实现了"触手可及"的应用体验。

#### 与 H5 的区别

| 对比项 | 微信小程序 | H5 网页 |
|--------|-----------|---------|
| 运行环境 | 微信客户端内 | 浏览器 |
| 渲染方式 | 双线程（逻辑层 + 渲染层） | 单线程（主线程） |
| API 能力 | 调用微信原生能力（摄像头、位置等） | 受浏览器 API 限制 |
| 更新机制 | 热更新（无需审核后再次下载） | 实时更新 |
| 包体限制 | 主包 ≤ 2MB，总包 ≤ 20MB | 无限制 |
| 开发语言 | WXML + WXSS + JS（类 Vue） | HTML + CSS + JS |

#### 双线程架构

小程序采用双线程模型：
- **逻辑层（App Service）**：执行 JS 业务逻辑，处理数据和事件
- **视图层（View）**：渲染 WXML + WXSS，展示 UI 界面
- 两者通过微信客户端（Native）的 `JSBridge` 进行通信

这种架构避免了 JS 线程阻塞 UI 渲染，但也带来了通信开销，因此需要尽量减少 `setData` 的数据量。


### 微信小程序的生命周期函数

#### 应用生命周期（App）

在 `app.js` 中定义，全局只执行一次：

```javascript
App({
  onLaunch(options) {
    // 小程序初始化完成时触发（全局只触发一次）
    // 常用于：获取用户信息、初始化全局数据、检查登录态
    console.log('小程序启动', options);
  },
  onShow(options) {
    // 小程序启动或从后台进入前台时触发
    // 常用于：恢复定时器、刷新数据
  },
  onHide() {
    // 小程序从前台进入后台时触发
    // 常用于：暂停定时器、保存状态
  },
  onError(error) {
    // 小程序发生脚本错误或 API 调用失败时触发
    // 常用于：错误上报
  }
});
```

#### 页面生命周期（Page）

在每个页面的 `.js` 文件中定义：

```javascript
Page({
  data: { count: 0 },

  onLoad(options) {
    // 页面加载时触发（只触发一次）
    // options 携带页面参数
    // 常用于：发起网络请求获取数据
  },
  onShow() {
    // 页面显示时触发（每次显示都触发）
    // 常用于：刷新页面数据、重新开始动画
  },
  onReady() {
    // 页面初次渲染完成时触发（只触发一次）
    // 常用于：操作 DOM、获取组件实例
  },
  onHide() {
    // 页面隐藏时触发（如跳转到其他页面）
    // 常用于：暂停播放、清除定时器
  },
  onUnload() {
    // 页面卸载时触发（如 redirectTo、navigateBack）
    // 常用于：释放资源、清除监听
  },
  onPullDownRefresh() {
    // 用户下拉刷新时触发
    // 需在 json 中配置 "enablePullDownRefresh": true
  },
  onReachBottom() {
    // 页面上拉触底时触发
    // 常用于：加载更多数据
  },
  onShareAppMessage() {
    // 用户点击右上角分享时触发
    return { title: '分享标题', path: '/pages/index' };
  }
});
```

#### 生命周期调用顺序

首次进入页面：`onLoad` → `onShow` → `onReady`

跳转到新页面：旧页面 `onHide` → 新页面 `onLoad` → `onShow` → `onReady`

返回上一页：当前页面 `onUnload` → 上一页 `onShow`


### 微信小程序路由跳转

| API | 说明 | 是否保留当前页面 | 限制 |
|-----|------|----------------|------|
| `wx.navigateTo` | 跳转到非 tabBar 页面 | 是（压入栈中） | 最多 10 层 |
| `wx.redirectTo` | 关闭当前页，跳转到非 tabBar 页面 | 否 | - |
| `wx.switchTab` | 跳转到 tabBar 页面 | 只保留 tabBar 页面 | 会关闭所有非 tabBar 页面 |
| `wx.reLaunch` | 关闭所有页面，打开某个页面 | 否 | - |
| `wx.navigateBack` | 返回上一页面 | - | 可指定 delta 返回层数 |

```javascript
// 跳转（保留当前页面，可返回）
wx.navigateTo({
  url: '/pages/detail/detail?id=123'
});

// 重定向（关闭当前页面）
wx.redirectTo({
  url: '/pages/login/login'
});

// 跳转 tabBar 页面
wx.switchTab({
  url: '/pages/home/home'
});

// 关闭所有页面打开新页面
wx.reLaunch({
  url: '/pages/index/index'
});

// 返回上一页
wx.navigateBack({ delta: 1 });
```

**选用建议**：
- 需要返回：`navigateTo`
- 不需要返回（如登录页）：`redirectTo`
- 切换 Tab：`switchTab`
- 重启应用：`reLaunch`


### 微信小程序的登录流程

小程序登录的核心是获取用户的**唯一标识（openid）**，流程如下：

```
客户端                    微信服务器                    业务服务器
  |                          |                           |
  |-- wx.login() ---------->|                           |
  |<-- 临时 code -----------|                           |
  |                                                     |
  |-- code + appId + secret --------------------------->|
  |                                                     |-- 请求微信服务器换取 session
  |<-- openid + session_key (不经过客户端) --------------|
  |                                                     |-- 生成自定义登录态 token
  |<-- 自定义登录态 token --------------------------------|
  |                                                     |
  |-- 保存 token 到 Storage                            |
  |-- 后续请求携带 token ------------------------------>|
```

```javascript
// 1. 前端调用 wx.login 获取 code
async function login() {
  const { code } = await wx.login();

  // 2. 将 code 发送到业务服务器
  const res = await wx.request({
    url: 'https://api.example.com/login',
    method: 'POST',
    data: { code }
  });

  // 3. 保存登录态
  wx.setStorageSync('token', res.data.token);
}

// 服务端（Node.js 示例）
async function loginHandler(code) {
  // 用 code 换取 openid 和 session_key
  const res = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
    params: {
      appid: APP_ID,
      secret: APP_SECRET,
      js_code: code,
      grant_type: 'authorization_code'
    }
  });

  const { openid, session_key } = res.data;

  // 生成自定义登录态并返回给客户端
  const token = generateToken({ openid, session_key });
  return { token };
}
```

**注意事项：**
- `session_key` 不要传给客户端，存储在服务端
- 登录态 token 需设置合理的过期时间
- 不要依赖 `wx.getUserInfo`（已废弃），使用 `wx.getUserProfile` 或微信头像昵称填写组件


### 微信小程序的支付流程

```
客户端                    业务服务器                    微信支付服务器
  |                          |                           |
  |-- 提交订单信息 --------->|                           |
  |                          |-- 统一下单 API ---------->|
  |                          |<-- prepay_id -------------|
  |                          |-- 生成支付签名参数 ------->|
  |<-- 支付参数 (paySign) ---|                           |
  |                                                     |
  |-- wx.requestPayment() ----------------------------->|
  |<-- 支付结果回调 -------------------------------------|
  |                                                     |
  |                          |<-- 异步通知回调 ----------|
  |                          |-- 更新订单状态            |
```

```javascript
// 前端：发起支付
async function pay(orderId) {
  // 1. 请求后端获取支付参数
  const { payParams } = await wx.request({
    url: 'https://api.example.com/pay',
    method: 'POST',
    data: { orderId }
  });

  // 2. 调起微信支付
  try {
    await wx.requestPayment({
      timeStamp: payParams.timeStamp,
      nonceStr: payParams.nonceStr,
      package: payParams.package,     // prepay_id=xxx
      signType: payParams.signType,   // RSA
      paySign: payParams.paySign
    });

    // 3. 支付成功
    wx.showToast({ title: '支付成功' });
    wx.redirectTo({ url: '/pages/order/detail?id=' + orderId });
  } catch (err) {
    // 支付失败或用户取消
    console.error('支付失败', err);
  }
}
```

**支付参数说明：**

| 参数 | 说明 |
|------|------|
| `timeStamp` | 时间戳（秒） |
| `nonceStr` | 随机字符串 |
| `package` | 统一下单接口返回的 prepay_id，格式为 `prepay_id=xxx` |
| `signType` | 签名类型，目前推荐 RSA |
| `paySign` | 签名，由服务端生成 |


### 小程序的发布流程

```
开发 -> 上传 -> 提交审核 -> 审核通过 -> 全量发布
```

#### 完整流程

1. **本地开发与调试**：在微信开发者工具中开发测试
2. **上传代码**：点击开发者工具的「上传」按钮，填写版本号和项目备注
3. **提交审核**：在微信公众平台 -> 版本管理 -> 开发版本 -> 提交审核
   - 填写功能页面、测试账号（如需）
   - 选择隐私协议和类目
4. **审核通过**：通常 1-3 个工作日，通过后变为「审核通过」状态
5. **全量发布**：点击「全量发布」上线，所有用户可见

#### 版本管理

| 版本类型 | 说明 |
|---------|------|
| 开发版本 | 开发者上传，仅开发团队可见 |
| 体验版本 | 审核通过前，指定体验成员可访问 |
| 审核版本 | 微信官方审核中的版本 |
| 线上版本 | 全量发布后所有用户可用 |

#### 灰度发布

支持按比例灰度发布，降低上线风险：
- 在「版本管理」中选择「灰度发布」
- 设置灰度比例（如 10%）
- 观察数据后决定全量或回滚


### 小程序的调试流程

#### 开发者工具调试

- **Console 面板**：查看日志输出、执行 JS 命令
- **Sources 面板**：打断点、单步调试
- **Network 面板**：查看网络请求
- **AppData 面板**：实时查看和修改页面 data 数据
- **WXML 面板**：查看和编辑 WXML 节点、样式
- **Storage 面板**：查看本地缓存

#### 真机调试

1. 开发者工具点击「真机调试」
2. 手机扫码进入调试模式
3. 在电脑端开发者工具中远程调试手机上的小程序
4. 可查看手机端的 Console、Network 等信息

#### vConsole

在真机上显示调试面板：
```javascript
// app.js 中开启
App({
  onLaunch() {
    // 开发版和体验版默认开启 vConsole
    // 正式版需手动开启
  }
});

// 或在页面中手动启用
const vConsole = new (require('vconsole'))();
```

#### 常见调试技巧

- **白屏问题**：检查页面路径是否正确、data 中是否有循环引用
- **样式问题**：使用 rpx 而非 px，检查 WXSS 是否被覆盖
- **接口问题**：检查是否配置了合法域名、HTTPS 是否有效
- **性能问题**：使用「性能分析面板」查看渲染耗时、setData 调用频率


### 小程序的性能优化

#### setData 优化

`setData` 是小程序性能优化的核心，它会将数据从逻辑层传输到视图层，触发页面重新渲染。

```javascript
// 错误：频繁调用 setData
for (let i = 0; i < 100; i++) {
  this.setData({ [`list[${i}]`]: data[i] });
}

// 正确：合并为一次调用
const updates = {};
for (let i = 0; i < 100; i++) {
  updates[`list[${i}]`] = data[i];
}
this.setData(updates);
```

**优化原则：**
- 减少 setData 的**数据量**：只传变化的数据，不要传整个大对象
- 减少 setData 的**调用频率**：合并多次更新为一次
- 不要在 `onPageScroll` 中频繁调用 setData
- 使用 `数据路径`（`list[0].name`）精确更新局部数据

#### 图片优化

- 使用 WebP 格式，体积比 PNG/JPEG 小 30%+
- 使用 CDN 压缩图片
- 列表图片使用懒加载：`<image lazy-load />`
- 使用适当尺寸，不要用 2x 图显示在 1x 位置

#### 骨架屏

在数据加载完成前显示占位 UI，提升用户感知性能：
- 微信开发者工具 -> 详情 -> 本地设置 -> 勾选「启用骨架屏」
- 或手动编写骨架屏组件

#### 分包加载

将小程序划分为一个主包和多个分包，用户首次只下载主包，按需加载分包（详见下一节）。


### 小程序的分包加载

#### 基本概念

| 包类型 | 说明 | 限制 |
|--------|------|------|
| 主包 | 包含启动页面和公共资源 | 主包 ≤ 2MB |
| 普通分包 | 按需加载的业务模块 | 总包 ≤ 20MB |
| 独立分包 | 不依赖主包即可独立启动 | 需配置 `independent: true` |
| 分包预下载 | 进入某个页面时预下载其他分包 | 限制总大小 ≤ 2MB |

#### 配置方式

```json
// app.json
{
  "pages": [
    "pages/index/index",
    "pages/mine/mine"
  ],
  "subpackages": [
    {
      "root": "pages/order",
      "name": "order",
      "pages": [
        "list/list",
        "detail/detail"
      ]
    },
    {
      "root": "pages/product",
      "name": "product",
      "pages": [
        "list/list",
        "detail/detail"
      ],
      "independent": true
    }
  ],
  "preloadRule": {
    "pages/index/index": {
      "network": "wifi",
      "packages": ["order"]
    }
  }
}
```

#### 分包策略

- **按业务模块划分**：订单、商品、用户中心等各自一个分包
- **大资源放分包**：图片、视频等静态资源放到对应分包中
- **主包精简**：只保留首页、tabBar 页面、公共组件和工具类
- **合理使用预下载**：用户大概率会访问的分包配置预下载

#### 分包大小查看

开发者工具 -> 详情 -> 本地 -> 基础库版本 ≥ 2.3.0 支持查看各包大小，帮助分析优化。
