// pages/recipe-list/recipe-list.js
// 当前页面使用本地静态数据，无需请求接口

Page({
  data: {
    categoryId: null,
    categoryName: '',
    searchValue: '',
    recipes: [],
    allRecipes: []
  },

  onLoad(options) {
    const { categoryId = '', categoryName = '' } = options || {}
    this.setData({ categoryId, categoryName })
    wx.setNavigationBarTitle({ title: categoryName || '分类菜谱' })
    this.buildStaticRecipes()
  },

  onShow() {
    wx.setNavigationBarTitle({ title: this.data.categoryName || '分类菜谱' })
  },

  // 本地静态数据构建
  buildStaticRecipes() {
    const name = this.data.categoryName || ''
    const common = [
      { id: 101, title: '宫保鸡丁', image: '/images/recipes/gongbao-hero.jpg', difficulty: '简单', time: '30分钟', rating: 4.8, author: '美食达人' },
      { id: 102, title: '鱼香肉丝', image: '/images/recipes/gongbao-hero.jpg', difficulty: '中等', time: '40分钟', rating: 4.7, author: '川菜小能手' },
      { id: 103, title: '麻婆豆腐', image: '/images/recipes/gongbao-hero.jpg', difficulty: '简单', time: '25分钟', rating: 4.6, author: '豆腐控' },
      { id: 104, title: '回锅肉', image: '/images/recipes/gongbao-hero.jpg', difficulty: '中等', time: '45分钟', rating: 4.9, author: '厨神小王' }
    ]
    const catalog = {
      '川菜': common,
      '粤菜': [
        { id: 201, title: '白切鸡', image: '/images/recipes/gongbao-hero.jpg', difficulty: '简单', time: '35分钟', rating: 4.7, author: '广味小厨' },
        { id: 202, title: '清蒸鱼', image: '/images/recipes/gongbao-hero.jpg', difficulty: '简单', time: '25分钟', rating: 4.8, author: '海鲜爱好者' },
        { id: 203, title: '叉烧肉', image: '/images/recipes/gongbao-hero.jpg', difficulty: '中等', time: '60分钟', rating: 4.6, author: '烧腊达人' }
      ],
      '湘菜': [
        { id: 301, title: '剁椒鱼头', image: '/images/recipes/gongbao-hero.jpg', difficulty: '中等', time: '45分钟', rating: 4.8, author: '湘味十足' },
        { id: 302, title: '辣椒炒肉', image: '/images/recipes/gongbao-hero.jpg', difficulty: '简单', time: '20分钟', rating: 4.7, author: '辣味控' }
      ]
    }
    const list = catalog[name] || common
    this.setData({ recipes: list, allRecipes: list })
  },

  // 搜索输入
  onSearchInput(e) {
    this.setData({ searchValue: e.detail.value })
  },

  // 搜索（本地过滤）
  onSearch() {
    const keyword = (this.data.searchValue || '').trim()
    if (!keyword) {
      this.setData({ recipes: this.data.allRecipes })
      return
    }
    const list = (this.data.allRecipes || []).filter(r =>
      (r.title || '').includes(keyword) || (r.author || '').includes(keyword)
    )
    this.setData({ recipes: list })
  },

  // 点击菜谱进入详情
  onRecipeTap(e) {
    const recipeId = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/recipe-detail/recipe-detail?id=${recipeId}` })
  },

  // 收藏菜谱（本地）
  onFavoriteTap(e) {
    const recipeId = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    let favorites = wx.getStorageSync('favoriteRecipes') || []
    const recipe = this.data.recipes[index]
    const isFavorited = favorites.some(item => item.id === recipeId)
    if (isFavorited) {
      favorites = favorites.filter(item => item.id !== recipeId)
      wx.showToast({ title: '已取消收藏', icon: 'success' })
    } else {
      favorites.push(recipe)
      wx.showToast({ title: '已添加收藏', icon: 'success' })
    }
    wx.setStorageSync('favoriteRecipes', favorites)
  }
})