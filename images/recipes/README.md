# 本地图片使用说明

将菜谱相关图片放在当前目录，并保持与示例一致的命名：

- gongbao-hero.jpg               # 主图
- gongbao-step1.jpg ~ step7.jpg  # 步骤图

也可以替换为你自己的命名，只需同时修改 `pages/recipe-detail/recipe-detail.js` 中对应的相对路径（以 `/images/recipes/xxx.jpg` 开头）。

图片尺寸建议：
- 主图：750x400 或同比例
- 步骤图：至少 600px 宽，JPG/PNG 均可

后续接入接口后：
- 将 `onLoad` 中的 `loadRecipeDetail` 对接接口
- 后端返回的 `image`、`steps[n].image` 字段将覆盖本地路径
- 在接口未返回图片时，可保留本地图片作为占位图
