// pages/favorite/favorite.js
Page({
  data: {
    favoriteRecipes: [
      {
        id: 1,
        title: '宫保鸡丁',
        image: '/images/recipes/gongbao-hero.jpg',
        difficulty: '简单',
        time: '30分钟',
        rating: 4.8,
        category: '川菜'
      },
      {
        id: 2,
        title: '红烧肉',
        image: '/images/recipes/gongbao-hero.jpg',
        difficulty: '中等',
        time: '60分钟',
        rating: 4.9,
        category: '鲁菜'
      },
      {
        id: 3,
        title: '白切鸡',
        image: '/images/recipes/gongbao-hero.jpg',
        difficulty: '简单',
        time: '45分钟',
        rating: 4.7,
        category: '粤菜'
      }
    ],
    isEmpty: false
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: '收藏'
    })
    this.loadFavoriteRecipes()
  },

  onShow() {
    wx.setNavigationBarTitle({
      title: '收藏'
    })
    // 每次显示页面时刷新收藏列表
    this.loadFavoriteRecipes()
  },

  // 演示数据（用于空列表时预览两列网格样式）
  getDemoFavorites() {
    return [
      { id: 101, title: '宫保鸡丁', image: '/images/recipes/gongbao-hero.jpg', category: '川菜' },
      { id: 102, title: '鱼香肉丝', image: '/images/recipes/gongbao-hero.jpg', category: '川菜' },
      { id: 103, title: '白切鸡', image: '/images/recipes/gongbao-hero.jpg', category: '粤菜' },
      { id: 104, title: '清蒸鱼', image: '/images/recipes/gongbao-hero.jpg', category: '粤菜' }
    ]
  },

  // 加载收藏的菜谱（为空时注入演示数据，便于查看样式）
  loadFavoriteRecipes() {
    let favorites = wx.getStorageSync('favoriteRecipes') || []
    if (favorites.length === 0) {
      favorites = this.getDemoFavorites()
      // 写入本地，便于后续删除/清空逻辑正常工作
      wx.setStorageSync('favoriteRecipes', favorites)
    }
    this.setData({
      isEmpty: favorites.length === 0,
      favoriteRecipes: favorites
    })
  },

  // 点击菜谱
  onRecipeTap(e) {
    const recipeId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/recipe-detail/recipe-detail?id=${recipeId}`
    })
  },

  // 取消收藏
  onRemoveFavorite(e) {
    const recipeId = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    
    wx.showModal({
      title: '确认取消收藏',
      content: '确定要取消收藏这道菜吗？',
      success: (res) => {
        if (res.confirm) {
          // 从本地存储中移除
          let favorites = wx.getStorageSync('favoriteRecipes') || []
          favorites = favorites.filter(item => item.id !== recipeId)
          wx.setStorageSync('favoriteRecipes', favorites)
          
          // 更新页面数据
          const favoriteRecipes = this.data.favoriteRecipes
          favoriteRecipes.splice(index, 1)
          this.setData({
            favoriteRecipes: favoriteRecipes,
            isEmpty: favoriteRecipes.length === 0
          })
          
          wx.showToast({
            title: '已取消收藏',
            icon: 'success'
          })
        }
      }
    })
  },

  // 清空收藏
  onClearAll() {
    if (this.data.favoriteRecipes.length === 0) {
      wx.showToast({
        title: '收藏列表为空',
        icon: 'none'
      })
      return
    }
    
    wx.showModal({
      title: '清空收藏',
      content: '确定要清空所有收藏吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('favoriteRecipes')
          this.setData({
            favoriteRecipes: [],
            isEmpty: true
          })
          wx.showToast({
            title: '已清空收藏',
            icon: 'success'
          })
        }
      }
    })
  },

  // 跳转首页
  goToHome() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})
