Page({
  data: {
    brandName: '味食记菜谱',
    brandSlogan: '用心做菜，记录美味',
    searchValue: '',
    greeting: '今天想做什么菜？',
    categoryList: [
      { id: 1, name: '家常菜', icon: '家', color: '#FFF0E6' },
      { id: 2, name: '快手菜', icon: '快', color: '#EEF8F0' },
      { id: 3, name: '汤羹', icon: '汤', color: '#F4F5FF' },
      { id: 4, name: '轻食', icon: '轻', color: '#FFF6EE' }
    ],
    topicList: [
      { id: 1, title: '今日灵感', desc: '用简单食材做一顿舒服晚餐。', tag: '编辑推荐' },
      { id: 2, title: '本周常做', desc: '适合工作日晚上的高完成度菜谱。', tag: '热门清单' }
    ],
    recommendRecipes: [
      { id: 1, title: '清炒时蔬', desc: '十分钟完成，清爽不油腻。', time: '10 分钟', difficulty: '简单', image: '/images/recipes/gongbao-hero.jpg', isFavorite: false },
      { id: 2, title: '番茄牛腩', desc: '酸甜开胃，周末慢炖很合适。', time: '45 分钟', difficulty: '中等', image: '/images/recipes/gongbao-hero.jpg', isFavorite: false },
      { id: 3, title: '香煎鸡胸', desc: '少油低负担，搭配沙拉也很适合。', time: '18 分钟', difficulty: '简单', image: '/images/recipes/gongbao-hero.jpg', isFavorite: false }
    ],
    recentMenu: [
      { id: 11, title: '一周三餐灵感', note: '适合上班日的省心做饭节奏。' },
      { id: 12, title: '清冰箱计划', note: '把常见食材重新组合成新菜。' }
    ]
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: '味食记菜谱'
    })
    this.syncFavorites()
  },

  onShow() {
    this.syncFavorites()
  },

  onPullDownRefresh() {
    this.syncFavorites()
    wx.stopPullDownRefresh()
  },

  syncFavorites() {
    const favoriteIds = (wx.getStorageSync('favoriteRecipes') || []).map((item) => item.id)
    const recommendRecipes = this.data.recommendRecipes.map((item) => ({
      ...item,
      isFavorite: favoriteIds.includes(item.id)
    }))

    this.setData({ recommendRecipes })
  },

  onSearchInput(e) {
    this.setData({
      searchValue: e.detail.value
    })
  },

  onSearch() {
    const keyword = (this.data.searchValue || '').trim()
    if (!keyword) {
      wx.showToast({
        title: '请输入想搜索的菜名',
        icon: 'none'
      })
      return
    }

    wx.showToast({
      title: `搜索：${keyword}`,
      icon: 'none'
    })
  },

  onCategoryTap(e) {
    const { name } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/recipe-list/recipe-list?categoryName=${name}`
    })
  },

  onRecipeTap(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/recipe-detail/recipe-detail?id=${id}`
    })
  },

  onFavoriteTap(e) {
    const { id, index } = e.currentTarget.dataset
    const recipe = this.data.recommendRecipes[index]
    let favorites = wx.getStorageSync('favoriteRecipes') || []
    const exists = favorites.some((item) => item.id === id)

    if (exists) {
      favorites = favorites.filter((item) => item.id !== id)
    } else {
      favorites.unshift(recipe)
    }

    wx.setStorageSync('favoriteRecipes', favorites)
    this.syncFavorites()
    wx.showToast({
      title: exists ? '已取消收藏' : '已加入收藏',
      icon: 'none'
    })
  },

  onTopicTap(e) {
    const { title } = e.currentTarget.dataset
    wx.showToast({
      title,
      icon: 'none'
    })
  },

  onQuickActionTap() {
    wx.switchTab({
      url: '/pages/favorite/favorite'
    })
  }
})
