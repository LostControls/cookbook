# 微信小程序项目 - Cookbook

这是一个基础的微信小程序项目框架，包含了小程序开发的基本结构和示例代码。

## 项目结构

```
cookbook/
├── app.js                 # 小程序入口文件
├── app.json              # 小程序全局配置
├── app.wxss              # 小程序全局样式
├── sitemap.json          # 站点地图配置
├── project.config.json   # 项目配置文件
├── pages/                # 页面目录
│   ├── index/            # 首页
│   │   ├── index.js      # 页面逻辑
│   │   ├── index.wxml    # 页面结构
│   │   └── index.wxss    # 页面样式
│   └── logs/             # 日志页面
│       ├── logs.js       # 页面逻辑
│       ├── logs.wxml     # 页面结构
│       └── logs.wxss     # 页面样式
└── utils/                # 工具函数目录
    └── util.js           # 工具函数
```

## 功能特性

- ✅ 基础页面结构（首页、日志页）
- ✅ 用户信息获取和展示
- ✅ 页面导航功能
- ✅ 本地存储功能
- ✅ 时间格式化工具函数
- ✅ 响应式布局设计

## 开发说明

### 1. 环境要求
- 微信开发者工具
- 微信小程序开发账号

### 2. 开发步骤
1. 使用微信开发者工具打开项目目录
2. 在开发者工具中预览和调试
3. 根据需要修改页面内容和样式

### 3. 主要文件说明

- **app.js**: 小程序入口文件，包含全局数据和生命周期函数
- **app.json**: 全局配置文件，定义页面路由和窗口样式
- **pages/index/**: 首页，包含用户信息展示和导航功能
- **pages/logs/**: 日志页面，展示小程序启动日志
- **utils/util.js**: 工具函数，包含时间格式化等功能

## 接口配置

### 配置文件位置
- `config/api.js` - 接口地址和环境配置
- `utils/request.js` - 网络请求封装
- `services/api.js` - API服务类

### 环境配置
项目支持多环境配置（开发/测试/生产），在 `config/api.js` 中修改：

```javascript
// 修改接口地址
const devConfig = {
  baseUrl: 'https://your-dev-api.com',  // 开发环境
  // ...
}

const prodConfig = {
  baseUrl: 'https://your-prod-api.com', // 生产环境
  // ...
}
```

### 使用方式
```javascript
// 在页面中使用API
const { userApi, recipeApi } = require('../../services/api.js')

// 获取用户信息
const result = await userApi.getUserInfo()

// 获取菜谱列表
const recipes = await recipeApi.getRecipeList({ page: 1 })
```

## 扩展建议

1. 添加更多页面和功能模块
2. 集成网络请求和数据管理 ✅
3. 添加组件化开发
4. 优化用户体验和界面设计

## 注意事项

- 请确保在微信开发者工具中正确配置AppID
- 开发时注意小程序的包大小限制
- 遵循微信小程序的开发规范和最佳实践
