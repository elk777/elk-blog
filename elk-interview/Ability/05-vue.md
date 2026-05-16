

### Vue 2 和 Vue 3 的区别

| 对比项 | Vue 2 | Vue 3 |
|--------|-------|-------|
| 响应式原理 | `Object.defineProperty` | `Proxy` |
| API 风格 | Options API | Composition API（支持）+ Options API |
| 组合逻辑 | Mixins（命名冲突、来源不清） | Composition Function（灵活、可追溯） |
| TypeScript | 支持较弱（需 vue-class-component） | 原生支持，重写类型系统 |
| 打包体积 | 整体打包，不支持 Tree Shaking | 按需引入，支持 Tree Shaking |
| Fragment | 单根节点限制 | 支持多根节点（Fragment） |
| Teleport | 无 | `<Teleport to="body">` |
| Suspense | 无 | `<Suspense>` 异步组件加载 |
| 性能 | 较好 | 重写编译器和虚拟 DOM，性能提升 1.3-2 倍 |
| 生命周期 | `beforeDestroy` / `destroyed` | `beforeUnmount` / `unmounted` |
| 全局 API | `Vue.use()` / `Vue.component()` | `app.use()` / `app.component()`（实例化） |
| v-model | 单个，`value` + `input` | 多个，默认 `modelValue` + `update:modelValue` |
| 移除的 API | `$on` / `$off` / `$once`（事件总线） | 移除，推荐 mitt 等外部库 |


### Vue 的组件通信方式

#### Vue 2 组件通信

| 方式 | 方向 | 适用场景 |
|------|------|---------|
| `props` / `$emit` | 父 → 子 / 子 → 父 | 最基础的父子通信 |
| `$refs` | 父 → 子 | 父组件直接调用子组件方法/数据 |
| `$parent` / `$children` | 父 ↔ 子（不推荐） | 紧耦合，Vue 3 已移除 `$children` |
| `provide` / `inject` | 祖先 → 后代 | 深层嵌套传值 |
| `$attrs` / `$listeners` | 父 → 孙 | 透传属性和事件给子组件 |
| EventBus（`$on` / `$emit`） | 任意 | 兄弟/跨层级通信（Vue 3 已移除） |
| Vuex | 任意 | 复杂的全局状态管理 |

```vue
<!-- props / emit -->
<Child :msg="message" @update="handleUpdate" />

<!-- provide / inject -->
<script>
export default {
  provide() { return { theme: this.theme }; }
};
</script>
<script>
export default {
  inject: ['theme']
};
</script>
```

#### Vue 3 组件通信

Vue 3 在 Vue 2 基础上新增/调整：

```vue
<!-- defineProps / defineEmits（<script setup>） -->
<script setup>
const props = defineProps({ msg: String });
const emit = defineEmits(['update']);
emit('update', value);
</script>

<!-- defineExpose（暴露子组件方法/数据给父组件） -->
<script setup>
const count = ref(0);
const increment = () => count.value++;
defineExpose({ count, increment });
</script>

<!-- attrs（不再需要 $listeners，统一合并到 attrs） -->
<script setup>
const attrs = useAttrs(); // 包含未声明的 props 和事件
</script>

<!-- mitt 替代 EventBus -->
import mitt from 'mitt';
const bus = mitt();
bus.emit('foo', data);
bus.on('foo', handler);
```


### Vue 的生命周期

#### Vue 2 生命周期

```
beforeCreate → created → beforeMount → mounted → beforeUpdate → updated → beforeDestroy → destroyed
```

| 钩子 | 触发时机 | 常见用途 |
|------|---------|---------|
| `beforeCreate` | 实例初始化后，data/methods 还未代理 | 极少使用 |
| `created` | 实例创建完成，data/methods 可用 | 发起异步请求、初始化数据 |
| `beforeMount` | 挂载前，模板已编译但未渲染 | 极少使用 |
| `mounted` | DOM 挂载完成 | 操作 DOM、初始化第三方库 |
| `beforeUpdate` | 数据变化，DOM 更新前 | 保存更新前的状态 |
| `updated` | DOM 更新完成 | DOM 更新后的操作（慎用，避免死循环） |
| `beforeDestroy` | 实例销毁前 | 清除定时器、解绑事件监听 |
| `destroyed` | 实例销毁后 | 最终清理 |

#### Vue 3 生命周期

```
beforeCreate → created → onBeforeMount → onMounted → onBeforeUpdate → onUpdated → onBeforeUnmount → onUnmounted
```

```vue
<script setup>
import { onMounted, onBeforeUnmount, onUpdated, ref } from 'vue';

const el = ref(null);

onMounted(() => {
  // DOM 已挂载
  console.log(el.value);
});

onBeforeUnmount(() => {
  // 清理工作
  clearInterval(timer);
});

// Vue 3 新增
onRenderTracked((e) => { /* 跟踪响应式依赖 */ });
onRenderTriggered((e) => { /* 触发重新渲染 */ });
</script>
```

#### Vue 2 vs Vue 3 生命周期对照

| Vue 2 | Vue 3（Composition API） |
|-------|------------------------|
| `beforeCreate` | `setup()` 开始执行时 |
| `created` | `setup()` 执行完成时 |
| `beforeMount` | `onBeforeMount` |
| `mounted` | `onMounted` |
| `beforeUpdate` | `onBeforeUpdate` |
| `updated` | `onUpdated` |
| `beforeDestroy` | `onBeforeUnmount` |
| `destroyed` | `onUnmounted` |
| `activated` | `onActivated`（keep-alive） |
| `deactivated` | `onDeactivated`（keep-alive） |
| `errorCaptured` | `onErrorCaptured` |


### 父子组件生命周期调用顺序

#### 加载渲染过程

```
父 beforeCreate → 父 created → 父 beforeMount
  → 子 beforeCreate → 子 created → 子 beforeMount → 子 mounted
→ 父 mounted
```

**规律：由外到内创建，由内到外挂载完成。**

#### 子组件更新过程

```
父 beforeUpdate → 子 beforeUpdate → 子 updated → 父 updated
```

#### 销毁过程

```
父 beforeDestroy → 子 beforeDestroy → 子 destroyed → 父 destroyed
```

**规律：由外到内开始销毁，由内到外销毁完成。**


### v-show 和 v-if 的区别

| 对比项 | `v-show` | `v-if` |
|--------|---------|--------|
| 实现方式 | CSS `display: none` | 真正的 DOM 创建/销毁 |
| 编译过程 | 始终编译，初始渲染 | 条件为真才编译 |
| 初始渲染开销 | 较高（无论真假都渲染） | 较低（条件为假不渲染） |
| 切换开销 | 低（仅切换 CSS） | 高（创建/销毁 DOM） |
| 适用场景 | 频繁切换 | 条件很少变化 |
| 搭配 `template` | 不支持 | 支持 `<template v-if>` |
| `v-else` 配合 | 不支持 | 支持 |

```vue
<!-- 频繁切换：用 v-show -->
<div v-show="isVisible">内容</div>

<!-- 条件不常变：用 v-if -->
<div v-if="isAdmin">管理员面板</div>
<div v-else-if="isUser">用户面板</div>
<div v-else>请登录</div>
```


### v-for 和 v-if 为什么不同时使用

**原因：`v-for` 的优先级高于 `v-if`（Vue 2），同时使用会导致性能浪费。**

在 Vue 2 中，`v-for` 优先级更高，每个元素都会先执行循环再判断 `v-if`，即使大部分元素会被过滤掉。

在 Vue 3 中，`v-if` 优先级更高，同时使用会报错。

```vue
<!-- 错误写法 -->
<li v-for="item in list" v-if="item.isActive">{{ item.name }}</li>

<!-- 正确写法 1：用 computed 过滤 -->
<li v-for="item in activeList">{{ item.name }}</li>

<script setup>
const activeList = computed(() => list.filter(item => item.isActive));
</script>

<!-- 正确写法 2：用 <template> 包裹 -->
<template v-for="item in list">
  <li v-if="item.isActive">{{ item.name }}</li>
</template>
```


### computed 和 watch 的区别和使用场景

| 对比项 | computed | watch |
|--------|----------|-------|
| 缓存 | 有缓存，依赖不变不重新计算 | 无缓存 |
| 返回值 | 必须有返回值 | 不需要返回值 |
| 异步 | 不支持异步 | 支持异步操作 |
| 同步修改 | 可以（通过 setter） | 不直接修改监听值 |
| 使用场景 | 派生状态（计算属性） | 副作用（请求、操作 DOM） |

```vue
<script setup>
import { ref, computed, watch } from 'vue';

const price = ref(10);
const count = ref(3);

// computed：有缓存，依赖不变不会重新计算
const total = computed(() => price.value * count.value);

// computed 带 setter
const fullName = computed({
  get: () => `${firstName.value} ${lastName.value}`,
  set: (val) => {
    [firstName.value, lastName.value] = val.split(' ');
  }
});

// watch：监听变化，执行副作用
watch(count, (newVal, oldVal) => {
  console.log(`count changed: ${oldVal} → ${newVal}`);
});

// watch 深度监听
watch(obj, (newVal) => {
  console.log('obj changed');
}, { deep: true });

// watch 立即执行
watch(source, (newVal) => {}, { immediate: true });
</script>
```


### watch 和 watchEffect 的区别

| 对比项 | watch | watchEffect |
|--------|-------|-------------|
| 依赖追踪 | 显式指定数据源 | 自动追踪回调中所有响应式依赖 |
| 初始执行 | 默认不执行（`immediate` 可配置） | 立即执行一次 |
| 获取新旧值 | 可以（`(new, old) => {}`） | 不能（无法拿到旧值） |
| 懒执行 | 支持（`{ lazy: true }` Vue 3.5+） | 默认立即执行 |

```vue
<script setup>
import { ref, watch, watchEffect } from 'vue';

const keyword = ref('');

// watch：显式指定监听源
watch(keyword, (newVal, oldVal) => {
  fetchData(newVal);
});

// watchEffect：自动追踪 keyword 依赖，立即执行
watchEffect(() => {
  // keyword 变化时自动重新执行
  document.title = keyword.value || '默认标题';
});

// watchEffect 清理副作用
watchEffect((onCleanup) => {
  const controller = new AbortController();
  onCleanup(() => controller.abort()); // 上一次请求取消

  fetch(`/api/search?q=${keyword.value}`, { signal: controller.signal });
});
</script>
```


### Vue 3 的 ref 和 reactive 的区别

| 对比项 | `ref` | `reactive` |
|--------|-------|-----------|
| 适用类型 | 任意类型（基本类型/引用类型） | 仅引用类型（对象/数组） |
| 访问方式 | `.value`（JS 中）/ 自动解包（模板中） | 直接访问属性 |
| 响应式丢失 | 不会（始终包装为 RefImpl） | 会（直接赋值解构会丢失） |
| 整体替换 | 可以直接替换 `.value` | 可以直接替换属性 |
| 适用场景 | 基本类型、DOM 引用、需要整体替换 | 复杂对象/表单数据 |

```vue
<script setup>
import { ref, reactive, toRefs } from 'vue';

// ref
const count = ref(0);
console.log(count.value);  // JS 中需要 .value
count.value++;

// reactive
const form = reactive({ name: '', age: 18 });
form.name = 'elk';  // 直接访问

// reactive 解构会丢失响应式（错误）
const { name, age } = form; // name, age 不再响应式

// 正确方式：用 toRefs
const { name, age } = toRefs(form); // 保持响应式

// reactive 整体替换也可以
Object.assign(form, { name: 'cat', age: 20 });
</script>
```

**最佳实践**：基本类型和简单值用 `ref`，复杂对象用 `reactive`（或 `ref` 包裹对象也行）。


### Vue 的动态组件

```vue
<!-- 使用 <component :is> 切换组件 -->
<template>
  <button @click="current = 'Home'">首页</button>
  <button @click="current = 'About'">关于</button>

  <component :is="currentComponent" />
</template>

<script setup>
import { ref, computed, shallowRef } from 'vue';
import Home from './Home.vue';
import About from './About.vue';

const current = ref('Home');
const components = { Home, About };

// 用 shallowRef 避免不必要的深度响应式
const currentComponent = shallowRef(Home);
</script>
```

**配合 keep-alive 缓存组件状态：**

```vue
<keep-alive :include="['Home', 'About']" :max="10">
  <component :is="currentComponent" />
</keep-alive>
```

**异步组件（按需加载）：**

```vue
<script setup>
import { defineAsyncComponent, shallowRef } from 'vue';

const HeavyChart = defineAsyncComponent(() => import('./HeavyChart.vue'));
</script>
```


### Vue 中插槽的定义和使用场景

#### 默认插槽

```vue
<!-- 子组件 Child.vue -->
<template>
  <div class="card">
    <slot>默认内容</slot>  <!-- 没传内容时显示默认值 -->
  </div>
</template>

<!-- 父组件 -->
<Child>
  <p>这里是插槽内容</p>
</Child>
```

#### 具名插槽

```vue
<!-- 子组件 Layout.vue -->
<template>
  <header><slot name="header"></slot></header>
  <main><slot></slot></main>         <!-- 默认插槽，等价于 name="default" -->
  <footer><slot name="footer"></slot></footer>
</template>

<!-- 父组件 -->
<Layout>
  <template #header>  <!-- # 是 v-slot 的缩写 -->
    <h1>标题</h1>
  </template>
  <p>主体内容</p>
  <template #footer>
    <span>页脚</span>
  </template>
</Layout>
```

#### 作用域插槽（子组件向父组件传数据）

```vue
<!-- 子组件 List.vue -->
<template>
  <ul>
    <li v-for="item in list" :key="item.id">
      <slot :item="item" :index="index">
        {{ item.name }}  <!-- 默认渲染 -->
      </slot>
    </li>
  </ul>
</template>

<!-- 父组件：自定义每一项的渲染 -->
<List :list="users">
  <template #default="{ item, index }">
    <span>{{ index + 1 }}. {{ item.name }} - {{ item.email }}</span>
  </template>
</List>
```

**使用场景：**
- **默认插槽**：布局组件的主内容区
- **具名插槽**：页面布局（header/footer/sidebar）
- **作用域插槽**：列表组件自定义渲染、表格列自定义、弹窗内容定制


### Vue 项目可做哪些性能优化

#### 代码层面

- `v-if` vs `v-show` 按场景选择
- `v-for` 添加唯一 `key`
- 避免 `v-for` 和 `v-if` 同时使用
- 长列表使用虚拟滚动
- 使用 `computed` 缓存计算结果
- 组件懒加载（路由懒加载）
- 图片懒加载

#### 构建层面

- 开启 Gzip / Brotli 压缩
- 代码分割（SplitChunks）
- 按需引入第三方库（如 Element Plus 按需导入）
- 移除生产环境 console / debugger
- CDN 外链大型依赖

#### 网络层面

- HTTP/2
- DNS 预解析
- 静态资源 CDN 缓存
- 接口数据缓存

#### 用户体验

- 骨架屏 / Loading 状态
- 路由过渡动画
- PWA 离线缓存

```javascript
// 按需引入 Element Plus
import { ElButton, ElInput } from 'element-plus';

// 路由懒加载
const routes = [
  { path: '/dashboard', component: () => import('./views/Dashboard.vue') }
];
```


### nextTick 的定义和使用场景

`nextTick` 将回调延迟到下次 DOM 更新循环之后执行。在修改数据后立即使用，等待 DOM 更新完毕。

```vue
<script setup>
import { ref, nextTick } from 'vue';

const list = ref([]);
const listRef = ref(null);

async function addItem() {
  list.value.push({ id: Date.now() });

  // 此时 DOM 还未更新
  console.log(listRef.value.children.length); // 旧值

  await nextTick();

  // DOM 已更新
  console.log(listRef.value.children.length); // 新值
}
</script>
```

**常见使用场景：**

1. **数据变化后操作更新后的 DOM**（获取新元素的尺寸、位置）
2. **弹窗/抽屉打开后初始化第三方库**（确保 DOM 已渲染）
3. **表单聚焦**：弹窗打开后自动 focus 输入框
4. **列表滚动到底部**：添加消息后自动滚到底部
5. **图表初始化**：等容器 DOM 尺寸确定后初始化 ECharts

```javascript
// 实际项目示例：聊天室自动滚底
async function sendMessage() {
  messages.value.push(newMsg);
  await nextTick();
  chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
}
```


### Vuex 中 mutation 和 action 的区别

| 对比项 | Mutation | Action |
|--------|----------|--------|
| 同步/异步 | 必须同步 | 可以包含异步操作 |
| 修改方式 | 直接修改 `state` | 提交 `mutation` 间接修改 |
| 调用方式 | `commit('mutationName')` | `dispatch('actionName')` |
| 调试 | DevTools 可追踪每次变更 | DevTools 追踪 dispatch |

```javascript
// store/index.js
const store = createStore({
  state: { count: 0 },
  mutations: {
    INCREMENT(state, payload) {
      state.count += payload;  // 必须同步
    }
  },
  actions: {
    async incrementAsync({ commit }, payload) {
      const res = await api.increment(payload);
      commit('INCREMENT', res.data);  // 异步完成后再提交 mutation
    }
  }
});

// 组件中
this.$store.commit('INCREMENT', 1);          // 同步修改
this.$store.dispatch('incrementAsync', 1);   // 异步操作
```


### Vuex 和 Pinia 的区别

| 对比项 | Vuex | Pinia |
|--------|------|-------|
| Vue 版本 | Vue 2/3（需适配） | Vue 3（官方推荐） |
| API 风格 | 单一 Store，分 mutations/actions/getters | 扁平化，无 mutations |
| TypeScript | 支持较弱 | 原生完整支持 |
| DevTools | 支持 | 支持（更完善） |
| 模块化 | 嵌套模块（namespace） | 扁平化，天然支持多 Store |
| 代码量 | 较多 | 更简洁 |
| 体积 | 较大 | ~1KB |

```javascript
// Pinia 使用
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({ name: '', token: '' }),
  getters: {
    isLoggedIn: (state) => !!state.token
  },
  actions: {
    async login(form) {
      const res = await api.login(form);
      this.token = res.token;
      this.name = res.name;
    },
    logout() {
      this.$reset();  // 重置 state
    }
  }
});

// 组件中
const userStore = useUserStore();
userStore.login({ username: 'elk', password: '123' });
```


### Vue Router 导航

#### 路由模式

| 模式 | URL 格式 | 原理 |
|------|---------|------|
| `hash` | `/#/home` | `hashchange` 事件 |
| `history` | `/home` | `pushState` / `replaceState`（需服务器配置兜底） |

#### 路由守卫

```javascript
// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 权限校验
  if (to.meta.requireAuth && !getToken()) {
    next('/login');
  } else {
    next();
  }
});

// 全局后置钩子
router.afterEach((to) => {
  document.title = to.meta.title || '默认标题';
});

// 路由独享守卫
const routes = [
  {
    path: '/admin',
    component: Admin,
    beforeEnter: (to, from, next) => {
      // 仅针对该路由的守卫
    }
  }
];

// 组件内守卫
onBeforeRouteLeave((to, from) => {
  // 离开前确认（如表单未保存）
});
```

#### 动态路由

```javascript
// 根据权限动态添加路由
router.addRoute({
  path: '/admin',
  component: Admin,
  children: [{ path: 'users', component: Users }]
});
```

#### 路由懒加载

```javascript
const routes = [
  {
    path: '/dashboard',
    component: () => import('./views/Dashboard.vue')
  }
];
```


### keep-alive 的理解和使用场景

`<keep-alive>` 是 Vue 的内置组件，用于**缓存不活动的组件实例**，避免重复创建和销毁。

```vue
<!-- 基本用法 -->
<keep-alive>
  <component :is="currentComponent" />
</keep-alive>

<!-- 配合路由 -->
<router-view v-slot="{ Component }">
  <keep-alive :include="['Home', 'User']" :max="10">
    <component :is="Component" />
  </keep-alive>
</router-view>
```

| 属性 | 说明 |
|------|------|
| `include` | 字符串/正则/数组，匹配的组件名才缓存 |
| `exclude` | 字符串/正则/数组，匹配的组件不缓存 |
| `max` | 最大缓存数，超出时最久没访问的被销毁 |

**缓存后的生命周期：**
- 进入缓存组件：`onActivated`
- 离开缓存组件：`onDeactivated`

**使用场景：**
- 列表页 → 详情页 → 返回列表页时保持滚动位置和筛选状态
- Tab 切换页面，保持各 Tab 的状态
- 表单页面，切换 Tab 后保留填写内容

```vue
<script setup>
import { onActivated, onDeactivated } from 'vue';

onActivated(() => {
  // 从缓存中恢复时执行
  // 如：重新开始轮询、恢复动画
});

onDeactivated(() => {
  // 进入缓存时执行
  // 如：暂停轮询、保存滚动位置
});
</script>
```


### Vue 中常用的修饰符

#### 事件修饰符

| 修饰符 | 作用 | 示例 |
|--------|------|------|
| `.stop` | 阻止事件冒泡 | `@click.stop="handle"` |
| `.prevent` | 阻止默认行为 | `@submit.prevent="onSubmit"` |
| `.capture` | 使用捕获模式 | `@click.capture="handle"` |
| `.self` | 仅当事件目标是元素本身时触发 | `@click.self="handle"` |
| `.once` | 只触发一次 | `@click.once="handle"` |
| `.passive` | 不阻止默认行为（优化滚动性能） | `@scroll.passive="onScroll"` |

#### 按键修饰符

```vue
<input @keyup.enter="submit" />
<input @keyup.esc="cancel" />
<input @keyup.ctrl.s="save" />
<input @click.ctrl.exact="onCtrlClick" />  <!-- 精确匹配 -->
```

#### 表单修饰符

| 修饰符 | 作用 |
|--------|------|
| `.lazy` | `change` 事件时同步（失焦/回车），而非 `input` |
| `.number` | 自动转为数字类型 |
| `.trim` | 自动去除首尾空格 |

```vue
<input v-model.lazy="msg" />
<input v-model.number="age" />
<input v-model.trim="name" />
```

#### v-model 修饰符（组件）

```vue
<!-- Vue 3 组件 v-model 修饰符 -->
<MyInput v-model.trim="value" />

<!-- 子组件接收 -->
<script setup>
const [model, modifiers] = defineModel('value');
// modifiers = { trim: true }
</script>
```


### 什么是 MVVM

MVVM（Model-View-ViewModel）是一种软件架构模式：

```
Model（数据层） ←→ ViewModel（绑定层） ←→ View（视图层）
```

| 层 | 职责 | Vue 中的对应 |
|----|------|-------------|
| **Model** | 数据和业务逻辑 | `data` / `state` 中的数据 |
| **View** | 用户界面 | 模板（`template`） |
| **ViewModel** | 连接 Model 和 View，自动同步数据 | Vue 实例 / Composition API |

**核心原理：数据绑定 + 数据劫持**
- ViewModel 监听 Model 的变化 → 自动更新 View（数据驱动视图）
- ViewModel 监听 View 的变化 → 自动更新 Model（双向绑定）

**优势：**
- 低耦合：View 和 Model 通过 ViewModel 解耦
- 可复用：ViewModel 可复用于不同 View
- 自动同步：开发者只需关注数据变化，DOM 更新由框架处理

**与 MVC 的区别：**
- MVC：Controller 处理用户交互，手动更新 View
- MVVM：ViewModel 自动同步，无需手动操作 DOM


### 什么是 VDOM 和 DOM

#### DOM（Document Object Model）

DOM 是浏览器将 HTML 解析为树形结构的对象模型。操作 DOM 是昂贵的，每次修改可能触发重排重绘。

#### VDOM（Virtual DOM）

VDOM 是用 JavaScript 对象模拟的 DOM 结构，是一个轻量级的抽象层。

```javascript
// 真实 DOM
<div id="app"><p>hello</p></div>

// 对应的 VDOM（简化表示）
{
  tag: 'div',
  props: { id: 'app' },
  children: [
    { tag: 'p', props: {}, children: ['hello'] }
  ]
}
```

#### 联系与区别

| 对比项 | 真实 DOM | 虚拟 DOM |
|--------|---------|---------|
| 本质 | 浏览器中的 DOM 节点 | JS 对象 |
| 操作成本 | 高（直接操作 DOM） | 低（操作 JS 对象） |
| 更新方式 | 手动操作 | Diff 算法计算最小变更 |
| 性能 | 频繁操作性能差 | 批量更新 + 最小化 DOM 操作 |
| 跨平台 | 浏览器专属 | 可用于 SSR、Native（React Native） |

#### Diff 算法

Vue 的 Diff 算法（Snabbdom）采用**同层比较**策略：

1. **Tree Diff**：只比较同层级节点，不跨层级移动
2. **Element Diff**：通过 `key` 判断节点是否复用
3. **最小操作**：找到最少的 DOM 操作将旧 VDOM 变为新 VDOM

```javascript
// Vue 2 的双端比较（4 个指针）
// 旧列表：[A, B, C, D]
// 新列表：[D, A, C, B]
// 通过 oldStart/newStart/oldEnd/newEnd 四个指针从两端向中间比较

// Vue 3 的最长递增子序列优化
// 找到不需要移动的节点（最长递增子序列），只移动其余节点
```


### Vue 初始化过程的详细描述

```
new Vue() / createApp()
  │
  ├── 1. 初始化事件和生命周期
  │     ├── initEvents
  │     └── initLifecycle
  │
  ├── 2. 调用 beforeCreate 钩子
  │
  ├── 3. 初始化注入（provide/inject）
  │     ├── initState（data/methods/computed/watch）
  │     └── initProps / initMethods / initData / initComputed / initWatch
  │
  ├── 4. 调用 created 钩子
  │
  ├── 5. 编译模板
  │     ├── 有 el → 自动挂载
  │     ├── 有 template → 编译 template
  │     └── 无 template → 编译 el 的 outerHTML
  │     └── 编译结果：render 函数 + staticRenderFns
  │
  ├── 6. 调用 beforeMount 钩子
  │
  ├── 7. 创建 Watcher（渲染 watcher）
  │     ├── 调用 render 函数生成 VDOM
  │     ├── VDOM → 真实 DOM
  │     └── 建立依赖收集（Dep 与 Watcher 的关联）
  │
  ├── 8. 调用 mounted 钩子
  │
  └── 9. 进入响应式更新循环
        ├── data 变化 → setter 触发 → 通知依赖的 Watcher
        ├── 调用 beforeUpdate
        ├── 重新 render → VDOM Diff → patch 更新 DOM
        └── 调用 updated
```

**核心步骤总结：**
1. 合并配置 → 初始化生命周期/事件/data/methods/props/computed/watch
2. 编译模板 → 生成 render 函数
3. 首次渲染 → render → VDOM → 真实 DOM → 挂载
4. 建立响应式 → 依赖收集 → 数据变化触发更新


### Vue 响应式系统实现原理

#### Vue 2：Object.defineProperty

```javascript
// 核心原理：劫持对象属性的 getter/setter
function defineReactive(obj, key, val) {
  const dep = new Dep(); // 每个属性一个依赖收集器

  Object.defineProperty(obj, key, {
    get() {
      // 收集依赖：如果当前有 Watcher，添加到 dep 中
      if (Dep.target) {
        dep.addSub(Dep.target);
      }
      return val;
    },
    set(newVal) {
      if (newVal === val) return;
      val = newVal;
      // 通知更新：所有依赖该属性的 Watcher 重新执行
      dep.notify();
    }
  });
}

// 递归劫持所有属性
function observe(obj) {
  Object.keys(obj).forEach(key => defineReactive(obj, key, obj[key]));
}
```

**Vue 2 的局限：**
- 无法检测对象属性的**新增/删除**（需用 `Vue.set` / `Vue.delete`）
- 无法检测数组**通过索引修改元素**（`arr[0] = 1` 不触发更新）
- 数组变异方法（`push/pop/splice` 等）被重写以触发更新
- 初始化时需要递归遍历所有属性，性能开销大

#### Vue 3：Proxy

```javascript
// 核心原理：代理整个对象，拦截所有操作
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      track(target, key); // 收集依赖
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver);
      trigger(target, key); // 触发更新
      return result;
    },
    deleteProperty(target, key) {
      const result = Reflect.deleteProperty(target, key);
      trigger(target, key); // 删除也能触发更新
      return result;
    },
    has(target, key) {
      track(target, key);
      return Reflect.has(target, key);
    }
  });
}
```

**Vue 3 Proxy 的优势：**

| 对比项 | Vue 2 (defineProperty) | Vue 3 (Proxy) |
|--------|----------------------|---------------|
| 监听范围 | 只能劫持已有属性 | 拦截所有操作（增删改查） |
| 数组支持 | 需要重写方法 | 原生支持索引修改 |
| 新增属性 | 需要 `Vue.set` | 自动响应式 |
| 性能 | 初始化时递归遍历 | 惰性代理（访问时才代理嵌套对象） |
| Map/Set | 不支持 | 支持（`reactive(new Map())`） |
| 浏览器兼容 | IE9+ | 不支持 IE |

#### 依赖收集与触发更新

```
响应式数据（Proxy/defineProperty）
  │
  ├── track(target, key)  收集依赖
  │     └── 当前活跃的 effect（渲染函数/computed/watch）
  │           └── 添加到 targetMap[key] 的 Set 中
  │
  └── trigger(target, key)  触发更新
        └── 遍历 targetMap[key] 的所有 effect
              └── 执行 effect（重新渲染/重新计算/执行回调）
```

```javascript
// Vue 3 简化版依赖收集
const targetMap = new WeakMap();

function track(target, key) {
  if (activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) targetMap.set(target, (depsMap = new Map()));
    let dep = depsMap.get(key);
    if (!dep) depsMap.set(key, (dep = new Set()));
    dep.add(activeEffect);
  }
}

function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const dep = depsMap.get(key);
  if (dep) dep.forEach(effect => effect());
}
```

#### ref vs reactive 在响应式上的区别

```javascript
// ref 对基本类型：通过 .value 的 getter/setter 实现
function ref(val) {
  return {
    get value() { track(this, 'value'); return val; },
    set value(newVal) { val = newVal; trigger(this, 'value'); }
  };
}

// ref 对引用类型：内部调用 reactive 进行深层代理
function ref(val) {
  if (isObject(val)) {
    return reactive(val);  // 深层代理
  }
  return { get value() {}, set value() {} };
}
```
