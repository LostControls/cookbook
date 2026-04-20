# 图标解决方案

## 当前状态
项目已经移除了图标配置，现在可以正常编译运行。

## 添加图标的步骤

### 方法1：使用在线图标生成器
1. 访问 https://www.iconfont.cn/ 或 https://iconpark.cn/
2. 搜索以下关键词：
   - 首页：home, 房子, 首页
   - 分类：category, 分类, 列表
   - 收藏：star, 收藏, 五角星
   - 我的：user, 用户, 个人
3. 下载PNG格式，尺寸81x81px
4. 重命名并放入images目录

### 方法2：使用AI生成图标
1. 使用ChatGPT、Claude等AI工具
2. 提示词示例：
   ```
   请生成一个81x81像素的PNG图标，主题是[首页/分类/收藏/我的]，
   未选中状态使用灰色#7A7E83，选中状态使用绿色#3cc51f，
   风格简洁现代，适合微信小程序使用
   ```

### 方法3：使用设计工具
1. 使用Figma、Sketch等设计工具
2. 创建81x81px的画布
3. 设计简洁的图标
4. 导出为PNG格式

## 需要的文件列表
```
images/
├── home.png          # 首页图标
├── home-active.png   # 首页选中图标
├── category.png      # 分类图标
├── category-active.png # 分类选中图标
├── favorite.png      # 收藏图标
├── favorite-active.png # 收藏选中图标
├── profile.png       # 我的图标
└── profile-active.png # 我的选中图标
```

## 添加图标后的配置
在app.json中恢复图标配置：
```json
{
  "pagePath": "pages/index/index",
  "iconPath": "images/home.png",
  "selectedIconPath": "images/home-active.png",
  "text": "首页"
}
```
