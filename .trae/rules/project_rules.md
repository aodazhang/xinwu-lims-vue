# 前端项目代码生成规范

## 1. 项目技术栈

### 核心框架

1. **编辑器**: 使用 Visual Studio Code
2. **框架**: 使用 Vue (>=3)
3. **语言**: 使用 TypeScript (>=5)
4. **包管理**: 使用 pnpm (>=9)
5. **Node**: 使用 LTS 版本 (>=20)

### 开发工具链

1. **代码格式化**: Prettier
2. **代码检查**: ESLint
3. **提交规范**: Commitlint + Commitizen
4. **Git钩子**: Husky

## 2.文件结构规范

### 目录结构

Vue 项目 **必须** 遵循以下目录结构创建对应文件。

```
public/              # 非 vite 处理静态资源
src/                 # 项目目录
├── api/             # API 接口
├── assets/          # vite 处理静态资源
│   ├── 3d/          # gltf、glb、fbx 模型
│   ├── audio/       # mp3、wav 音频
│   ├── font/        # otf、ttf、woff、woff2 字体
│   ├── gif/         # gif 图片
│   ├── hdr/         # hdr 图片
│   └── image/       # jpg、jpeg、png、webp 图片
│   └── json/        # json 数据
│   └── svg/         # svg 图标
│   └── texture/     # 纹理图片
│   └── video/       # mp3、mp4、webm 视频
├── components/      # 公共组件
├── layout/          # 布局组件
├── model/           # 数据模型
├── router/          # 路由配置
│   └── modules/     # 模块化 router
├── store/           # 状态管理
│   └── modules/     # 模块化状态管理
├── use/             # 自定义 Composition API
│   └── modules/     # 模块化 Composition API
├── utils/           # 工具函数
├── views/           # 页面组件
├── App.vue          # 应用根组件
├── element.scss     # element-plus 样式
├── main.ts          # 应用入口
└── tailwindcss.scss # tailwindcss 样式
tests/               # 单元测试
├── tool/            # 单元测试工具函数
└── unit/            # 单元测试用例
types/               # 全局类型定义
```

### 文件命名

1. **目录名**: 使用 `kebab-case` (短横线命名)，例如 `home`
2. **js/ts 文件名**: 使用 `camelCase` (小驼峰命名)，例如 `userProfile.ts`
3. **vue 文件名**: 使用 `kebab-case` (短横线命名)，例如 `user-profile.vue`
4. **页面路径**: 小写字母加连字符

## 3.Git 提交规范

### 提交格式

提交信息格式为 `type(scope): subject`，例如 `feat(login): 新增登录页 UI`

### 提交类型

- `feat`: 新功能
- `fix`: 修复 Bug
- `test`: 单元、集成测试变更
- `refactor`: 已有功能重构
- `style`: 代码风格变更 (格式、分号等)
- `build`: webpack、rollup 变更
- `chore`: 构建过程、辅助工具变更
- `ci`: 持续集成变更
- `perf`: 性能、体验提升
- `revert`: 回滚先前提交
- `docs`: 文档变更

### 影响范围

- `api`: API 接口相关
- `assets`: 静态资源
- `components`: 公共组件相关
- `layout`: 布局组件相关
- `model`: 数据模型
- `router`: 路由配置
- `store`: 状态管理
- `use`: Composition API 相关
- `utils`: 工具函数
- `views`: 页面相关

## 4.代码编写规范

### 命名规范

1. **js/ts 变量名**: 使用 `camelCase` (小驼峰命名)，例如 `userProfile`
2. **js/ts 常量名**: 使用 `UPPER_SNAKE_CASE` (大写下划线命名)，例如 `USER_PROFILE`
3. **js/ts 函数名**: 使用 `camelCase` (小驼峰命名)，例如 `getUserProfile`
4. **vue 组件名**: 使用 `PascalCase` (大驼峰命名)，例如 `UserProfile`
5. **vue props 属性名**: 使用 `camelCase` (小驼峰命名)，例如 `userProfile`
6. **vue 事件名**: 使用 `kebab-case` (短横线命名)，例如 `@user-profile-click`

### 注释规范

1. **js/ts 注释**: 函数使用 JSDoc 注释，解释其功能、参数和返回值，例如 `/** @param {string} name - 用户名 */`
2. **临时注释**: 未实现功能代码使用 `// TODO:` 标记，例如 `// TODO: 实现用户登录功能`

### Vue 文件结构

1. **结构顺序**: 按照模板、脚本、样式的固定结构顺序创建 vue 文件，例如：

```vue
<!-- 1.模板 html -->
<template></template>

<!-- 2.脚本 -->
<script setup lang="ts"></script>

<!-- 3.样式 -->
<style lang="scss" scoped></style>
```

2. **导入顺序**: Vue 相关库 > 第三方库 (按字母顺序) > 内部绝对路径 (按路径层级) > 相对路径 (按路径层级)，例如：

```ts
// 1. Vue 相关库
import { computed, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// 2. 第三方库 (按字母顺序)
import axios from 'axios'
import dayjs from 'dayjs'

// 3. 内部绝对路径 (按路径层级)
import { useStore } from '@/store'
import type { User } from '@/types/user'
import { dateToString } from '@/utils/date'
import { useTable } from '@/use'
import api from '@/api'
import { CommentModel } from '@/model'

// 4. 相对路径 (按路径层级)
import UserProfile from './components/user-profile.vue'
```

3. **组件规范**: 使用 Composition API 并遵循 `<script setup lang="ts">` 语法
4. **Props 规范**: 使用 `defineProps` 定义 props 并通过 ts 定义 props 类型，使用 `defineEmits` 定义事件并通过 ts 定义事件类型

## 5.CSS 样式规范

### 命名规范

1. **css 类名**: 使用 `kebab-case` (短横线命名)，并遵循 BEM 准则，例如 `user-profile__header`

### 工具和组件库

1. **css 样式**：使用 tailwindcss 编写移动优先的样式，响应式只考虑 `md:` 断点（>= 768px）

## 6.性能优化规范

### 资源优化

1. 图片压缩: 控制单张图片 < 500KB
2. 图片格式: 优先使用 WebP
3. 图片懒加载: 长列表使用懒加载
