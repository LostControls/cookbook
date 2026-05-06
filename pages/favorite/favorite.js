const { userApi } = require('../../services/api.js')
const { isLoggedIn } = require('../../utils/auth.js')

const normalizeFavorite = (item = {}) => ({
  ...item,
  id: item.id || item.recipe_id || item.recipeId || 0,
  image: item.image || item.cover || item.cover_url || item.thumb || item.thumbnail || '/images/recipes/gongbao-hero.jpg',
  title: item.title || item.name || item.recipe_name || '未命名菜谱'
})

Page({
  data: {
    favoriteRecipes: [],
    isEmpty: true,
    page: 1,
    pageSize: 10,
    total: 0,
    hasMore: true,
    loading: false
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: '收藏'
    })
    this.loadFavoriteRecipes(true)
  },

  onShow() {
    wx.setNavigationBarTitle({
      title: '收藏'
    })
    this.loadFavoriteRecipes(true)
  },

  onPullDownRefresh() {
    this.loadFavoriteRecipes(true).finally(() => {
      wx.stopPullDownRefresh()
    })
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadFavoriteRecipes(false)
    }
  },

  async loadFavoriteRecipes(reset = false) {
    if (!isLoggedIn()) {
      this.setData({
        favoriteRecipes: [],
        isEmpty: true,
        page: 1,
        total: 0,
        hasMore: false,
        loading: false
      })
      return
    }

    if (this.data.loading) {
      return
    }

    const nextPage = reset ? 1 : this.data.page + 1
    this.setData({ loading: true })

    try {
      const result = await userApi.getFavoriteList({
        page: nextPage,
        page_size: this.data.pageSize
      })

      const payload = result.data || {}
      const list = Array.isArray(payload.list) ? payload.list.map(normalizeFavorite) : []
      const pagination = payload.pagination || {}
      const mergedList = reset ? list : this.data.favoriteRecipes.concat(list)

      this.setData({
        favoriteRecipes: mergedList,
        isEmpty: mergedList.length === 0,
        page: Number(pagination.page || nextPage),
        pageSize: Number(pagination.page_size || this.data.pageSize),
        total: Number(pagination.total || mergedList.length),
        hasMore: Boolean(pagination.has_more),
        loading: false
      })
    } catch (error) {
      this.setData({ loading: false })
      wx.showToast({
        title: '收藏加载失败',
        icon: 'none'
      })
    }
  },

  onRecipeTap(e) {
    const recipeId = e.currentTarget.dataset.id
    if (!recipeId) {
      return
    }

    wx.navigateTo({
      url: `/pages/recipe-detail/recipe-detail?id=${recipeId}`
    })
  },

  updateLocalFavorites(recipeId) {
    const localFavorites = (wx.getStorageSync('favoriteRecipes') || []).filter((item) => {
      return item.id !== recipeId && item.recipe_id !== recipeId && item.recipeId !== recipeId
    })
    wx.setStorageSync('favoriteRecipes', localFavorites)
  },

  onRemoveFavorite(e) {
    const recipeId = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index

    wx.showModal({
      title: '取消收藏',
      content: '确定要移除这道收藏菜谱吗？',
      success: async (res) => {
        if (!res.confirm) {
          return
        }

        try {
          await userApi.removeFavorite(recipeId)
          this.updateLocalFavorites(recipeId)

          const favoriteRecipes = this.data.favoriteRecipes.slice()
          favoriteRecipes.splice(index, 1)

          this.setData({
            favoriteRecipes,
            isEmpty: favoriteRecipes.length === 0,
            total: Math.max(0, this.data.total - 1)
          })

          wx.showToast({
            title: '已取消收藏',
            icon: 'success'
          })
        } catch (error) {
          wx.showToast({
            title: '取消收藏失败',
            icon: 'none'
          })
        }
      }
    })
  },

  onClearAll() {
    const favorites = this.data.favoriteRecipes || []
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
      success: async (res) => {
        if (!res.confirm) {
          return
        }

        try {
          for (const item of favorites) {
            await userApi.removeFavorite(item.recipe_id || item.id)
          }

          wx.removeStorageSync('favoriteRecipes')

          this.setData({
            favoriteRecipes: [],
            isEmpty: true,
            page: 1,
            total: 0,
            hasMore: false
          })

          wx.showToast({
            title: '已清空收藏',
            icon: 'success'
          })
        } catch (error) {
          wx.showToast({
            title: '清空收藏失败',
            icon: 'none'
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
