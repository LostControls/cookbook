// pages/favorite/favorite.js
const DEMO_FAVORITE_IDS = [101, 102, 103, 104]

const isDemoFavoriteList = (favorites = []) => {
  if (!Array.isArray(favorites) || favorites.length !== DEMO_FAVORITE_IDS.length) {
    return false
  }

  const ids = favorites.map((item) => item.id).sort((a, b) => a - b)
  return ids.every((id, index) => id === DEMO_FAVORITE_IDS[index])
}

Page({
  data: {
    favoriteRecipes: [],
    isEmpty: true
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
    this.loadFavoriteRecipes()
  },

  getDemoFavorites() {
    return [
      { id: 101, title: '宫保鸡丁', image: '/images/recipes/gongbao-hero.jpg', category: '川菜' },
      { id: 102, title: '鱼香肉丝', image: '/images/recipes/gongbao-hero.jpg', category: '川菜' },
      { id: 103, title: '白切鸡', image: '/images/recipes/gongbao-hero.jpg', category: '粤菜' },
      { id: 104, title: '清蒸鱼', image: '/images/recipes/gongbao-hero.jpg', category: '粤菜' }
    ]
  },

  loadFavoriteRecipes() {
    let favorites = wx.getStorageSync('favoriteRecipes') || []

    if (isDemoFavoriteList(favorites)) {
      wx.removeStorageSync('favoriteRecipes')
      favorites = []
    }

    const list = favorites.length > 0 ? favorites : this.getDemoFavorites()
    this.setData({
      isEmpty: favorites.length === 0,
      favoriteRecipes: list
    })
  },

  onRecipeTap(e) {
    const recipeId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/recipe-detail/recipe-detail?id=${recipeId}`
    })
  },

  onRemoveFavorite(e) {
    const recipeId = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index

    wx.showModal({
      title: '确认取消收藏',
      content: '确定要取消收藏这道菜吗？',
      success: (res) => {
        if (res.confirm) {
          let favorites = wx.getStorageSync('favoriteRecipes') || []
          favorites = favorites.filter((item) => item.id !== recipeId)
          wx.setStorageSync('favoriteRecipes', favorites)

          const favoriteRecipes = this.data.favoriteRecipes.slice()
          favoriteRecipes.splice(index, 1)

          if (favorites.length === 0) {
            this.setData({
              favoriteRecipes: this.getDemoFavorites(),
              isEmpty: true
            })
            wx.showToast({
              title: '已取消收藏',
              icon: 'success'
            })
            return
          }

          this.setData({
            favoriteRecipes,
            isEmpty: false
          })

          wx.showToast({
            title: '已取消收藏',
            icon: 'success'
          })
        }
      }
    })
  },

  onClearAll() {
    const favorites = wx.getStorageSync('favoriteRecipes') || []
    if (favorites.length === 0) {
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
            favoriteRecipes: this.getDemoFavorites(),
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

  goToHome() {
    wx.switchTab({
      url: '/pages/home/home'
    })
  }
})
