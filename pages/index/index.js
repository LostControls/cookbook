// pages/index/index.js
Page({
  // 设置导航栏标题
  onLoad() {
    wx.setNavigationBarTitle({
      title: ''
    })
    console.log('首页加载')
  },
  data: {
    searchValue: '',
    bannerList: [
      {
        id: 1,
        image: '/images/recipes/gongbao-hero.jpg',
        title: '今日推荐',
        desc: '精选美味菜谱'
      },
      {
        id: 2,
        image: '/images/recipes/gongbao-hero.jpg',
        title: '川菜专场',
        desc: '麻辣鲜香'
      }
    ],
    quickCategories: [
      { name: '川菜', icon: '🌶️', color: '#ff6b6b' },
      { name: '粤菜', icon: '🦐', color: '#4ecdc4' },
      { name: '湘菜', icon: '🌶️', color: '#45b7d1' },
      { name: '鲁菜', icon: '🥟', color: '#f9ca24' }
    ],
    recommendRecipes: [
      {
        id: 1,
        title: '宫保鸡丁',
        image: '/images/recipes/gongbao-hero.jpg',
        difficulty: '简单',
        time: '30分钟',
        rating: 4.8,
        author: '美食达人'
      },
      {
        id: 2,
        title: '红烧肉',
        image: '/images/recipes/gongbao-hero.jpg',
        difficulty: '中等',
        time: '60分钟',
        rating: 4.9,
        author: '厨神小王'
      },
      {
        id: 3,
        title: '白切鸡',
        image: '/images/recipes/gongbao-hero.jpg',
        difficulty: '简单',
        time: '45分钟',
        rating: 4.7,
        author: '粤菜师傅'
      }
    ]
  },


  onShow() {
    wx.setNavigationBarTitle({
      title: ''
    })
  },

  // 搜索输入
  onSearchInput(e) {
    this.setData({
      searchValue: e.detail.value
    })
  },

  // 搜索
  onSearch() {
    if (!this.data.searchValue.trim()) {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none'
      })
      return
    }
    
    wx.navigateTo({
      url: `/pages/search/search?keyword=${this.data.searchValue}`
    })
  },

  // 点击快速分类
  onCategoryTap(e) {
    const categoryName = e.currentTarget.dataset.name
    wx.navigateTo({
      url: `/pages/recipe-list/recipe-list?categoryName=${categoryName}`
    })
  },

  // 点击推荐菜谱
  onRecipeTap(e) {
    const recipeId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/recipe-detail/recipe-detail?id=${recipeId}`
    })
  },

  // 收藏菜谱
  onFavoriteTap(e) {
    const recipeId = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    
    // 获取当前收藏列表
    let favorites = wx.getStorageSync('favoriteRecipes') || []
    const recipe = this.data.recommendRecipes[index]
    
    // 检查是否已收藏
    const isFavorited = favorites.some(item => item.id === recipeId)
    
    if (isFavorited) {
      // 取消收藏
      favorites = favorites.filter(item => item.id !== recipeId)
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
  }
})
