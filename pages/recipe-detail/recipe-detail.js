// pages/recipe-detail/recipe-detail.js
Page({
  data: {
    recipe: {
      id: 1,
      title: '宫保鸡丁',
      image: '/images/recipes/gongbao-hero.jpg',
      difficulty: '简单',
      time: '30分钟',
      servings: '2-3人份',
      rating: 4.8,
      author: '美食达人',
      description: '宫保鸡丁是一道经典的川菜，以鸡肉为主料，配以花生米、黄瓜等辅料，口感鲜嫩，味道香辣。',
      ingredients: [
        { name: '鸡胸肉', amount: '300g', unit: '克' },
        { name: '花生米', amount: '50g', unit: '克' },
        { name: '黄瓜', amount: '1根', unit: '根' },
        { name: '胡萝卜', amount: '半根', unit: '根' },
        { name: '干辣椒', amount: '10个', unit: '个' },
        { name: '花椒', amount: '1小勺', unit: '勺' },
        { name: '大葱', amount: '2根', unit: '根' },
        { name: '生姜', amount: '3片', unit: '片' },
        { name: '大蒜', amount: '3瓣', unit: '瓣' },
        { name: '生抽', amount: '2勺', unit: '勺' },
        { name: '老抽', amount: '1勺', unit: '勺' },
        { name: '料酒', amount: '1勺', unit: '勺' },
        { name: '白糖', amount: '1勺', unit: '勺' },
        { name: '盐', amount: '适量', unit: '' },
        { name: '淀粉', amount: '1勺', unit: '勺' }
      ],
      steps: [
        {
          step: 1,
          title: '准备食材',
          description: '将鸡胸肉切成1.5cm见方的小丁，黄瓜和胡萝卜也切成同样大小的丁。大葱切段，生姜切片，大蒜拍碎。',
          image: '/images/recipes/gongbao-hero.jpg',
          tips: '鸡肉丁不要切得太小，否则容易炒老'
        },
        {
          step: 2,
          title: '腌制鸡肉',
          description: '在鸡肉丁中加入生抽、料酒、盐和淀粉，用手抓匀，腌制15分钟。',
          image: '/images/recipes/gongbao-hero.jpg',
          tips: '腌制时间不宜过长，否则肉质会变老'
        },
        {
          step: 3,
          title: '炸花生米',
          description: '热锅下油，放入花生米小火炸至金黄，捞出沥油备用。',
          image: '/images/recipes/gongbao-hero.jpg',
          tips: '花生米要小火慢炸，避免炸糊'
        },
        {
          step: 4,
          title: '炒制主料',
          description: '热锅下油，放入腌制好的鸡肉丁，大火快速翻炒至变色，盛起备用。',
          image: '/images/recipes/gongbao-hero.jpg',
          tips: '炒制时间要短，保持鸡肉的嫩滑'
        },
        {
          step: 5,
          title: '爆炒调料',
          description: '锅中留底油，放入干辣椒、花椒爆香，再放入葱段、姜片、蒜瓣炒香。',
          image: '/images/recipes/gongbao-hero.jpg',
          tips: '火候要掌握好，避免辣椒炒糊'
        },
        {
          step: 6,
          title: '合炒调味',
          description: '倒入炒好的鸡肉丁，加入黄瓜丁、胡萝卜丁，调入生抽、老抽、白糖，大火翻炒均匀。',
          image: '/images/recipes/gongbao-hero.jpg',
          tips: '调味要均匀，让每块肉都裹上酱汁'
        },
        {
          step: 7,
          title: '出锅装盘',
          description: '最后加入炸好的花生米，快速翻炒几下即可出锅装盘。',
          image: '/images/recipes/gongbao-hero.jpg',
          tips: '花生米最后放，保持脆嫩口感'
        }
      ],
      nutrition: {
        calories: '320',
        protein: '28g',
        fat: '18g',
        carbs: '12g'
      }
    },
    isFavorited: false,
    showShare: false
  },

  onLoad(options) {
    // 获取传递的菜谱ID
    const recipeId = options.id || 1
    this.loadRecipeDetail(recipeId)
    
    // 设置导航栏标题
    wx.setNavigationBarTitle({
      title: this.data.recipe.title
    })
    
    // 浏览记录静态模式：暂不写入
     // recordBrowseHistory(recipeId)
   },

  onShow() {
    // 检查是否已收藏
    this.checkFavoriteStatus()
  },

  // 加载菜谱详情
  loadRecipeDetail(recipeId) {
    // 这里后期可以对接API
    console.log('加载菜谱详情:', recipeId)
    // 模拟API调用
    // const recipe = await recipeApi.getRecipeDetail(recipeId)
    // this.setData({ recipe })
  },

  // 检查收藏状态
  checkFavoriteStatus() {
    const favorites = wx.getStorageSync('favoriteRecipes') || []
    const isFavorited = favorites.some(item => item.id === this.data.recipe.id)
    this.setData({ isFavorited })
  },

  // 收藏/取消收藏
  onFavoriteTap() {
    const { recipe, isFavorited } = this.data
    let favorites = wx.getStorageSync('favoriteRecipes') || []
    
    if (isFavorited) {
      // 取消收藏
      favorites = favorites.filter(item => item.id !== recipe.id)
      wx.showToast({
        title: '已取消收藏',
        icon: 'success'
      })
    } else {
      // 添加收藏
      favorites.push(recipe)
      wx.showToast({
        title: '已添加收藏',
        icon: 'success'
      })
    }
    
    // 保存到本地存储
    wx.setStorageSync('favoriteRecipes', favorites)
    this.setData({ isFavorited: !isFavorited })
  },

  // 分享菜谱
  onShareTap() {
    this.setData({ showShare: true })
  },

  // 分享到微信
  onShareToWechat() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  // 复制链接
  onCopyLink() {
    wx.setClipboardData({
      data: `菜谱：${this.data.recipe.title} - 来自菜谱大全小程序`,
      success: () => {
        wx.showToast({
          title: '链接已复制',
          icon: 'success'
        })
      }
    })
    this.setData({ showShare: false })
  },

  // 关闭分享弹窗
  onCloseShare() {
    this.setData({ showShare: false })
  },

  // 查看营养信息
  onNutritionTap() {
    wx.showModal({
      title: '营养信息',
      content: `热量：${this.data.recipe.nutrition.calories}卡路里\n蛋白质：${this.data.recipe.nutrition.protein}\n脂肪：${this.data.recipe.nutrition.fat}\n碳水化合物：${this.data.recipe.nutrition.carbs}`,
      showCancel: false
    })
  },

  // 查看作者信息
  onAuthorTap() {
    wx.showToast({
      title: '查看作者主页',
      icon: 'none'
    })
  }
})

// 浏览记录静态模式：已移除写入逻辑，后期可恢复为接口或本地记录
// recordBrowseHistory(recipeId) {
//   /* 保留占位，未来接入接口或本地写入 */
// }
