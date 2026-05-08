// pages/recipe-detail/recipe-detail.js
const { recipeApi, userApi } = require('../../services/api.js')
const { isLoggedIn } = require('../../utils/auth.js')

const fallbackRecipe = {
  id: 0,
  title: '菜谱详情',
  image: '/images/recipes/gongbao-hero.jpg',
  difficulty: '',
  time: '',
  servings: '',
  rating: 0,
  author: '',
  author_avatar: '',
  author_desc: '',
  description: '',
  ingredients: [],
  steps: [],
  nutrition: {
    calories: '',
    protein: '',
    fat: '',
    carbs: ''
  }
}

Page({
  data: {
    currentRecipeId: 0,
    recipe: fallbackRecipe,
    isFavorited: false,
    showShare: false
  },

  onLoad(options) {
    const recipeId = Number(options.id || 0)
    this.setData({ currentRecipeId: recipeId })

    if (!recipeId) {
      wx.showToast({
        title: '菜谱不存在',
        icon: 'none'
      })
      return
    }

    this.loadRecipeDetail(recipeId)
  },

  onShow() {
    this.checkFavoriteStatus()
  },

  loadRecipeDetail(recipeId) {
    recipeApi.getRecipeDetail(recipeId).then((result) => {
      const recipe = result.data || {}

      this.setData({
        currentRecipeId: Number(recipe.id || recipeId),
        recipe: {
          ...fallbackRecipe,
          ...recipe,
          nutrition: {
            ...fallbackRecipe.nutrition,
            ...(recipe.nutrition || {})
          },
          ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
          steps: Array.isArray(recipe.steps) ? recipe.steps : []
        }
      })

      wx.setNavigationBarTitle({
        title: recipe.title || '菜谱详情'
      })

      this.checkFavoriteStatus()

      if (isLoggedIn()) {
        userApi.recordBrowseHistory({
          recipe_id: Number(recipe.id || recipeId)
        }).catch(() => {})
      }
    }).catch(() => {
      wx.showToast({
        title: '菜谱详情加载失败',
        icon: 'none'
      })
    })
  },

  checkFavoriteStatus() {
    const recipeId = Number(this.data.recipe.id || this.data.currentRecipeId || 0)
    if (!recipeId || !isLoggedIn()) {
      this.setData({ isFavorited: false })
      return
    }

    userApi.getFavoriteList({
      recipe_id: recipeId,
      page: 1,
      page_size: 10
    }).then((result) => {
      const payload = result.data || {}
      const list = Array.isArray(payload.list) ? payload.list : []
      const isFavorited = list.some((item) => Number(item.recipe_id || item.id) === recipeId)
      this.setData({ isFavorited })
    }).catch(() => {
      this.setData({ isFavorited: false })
    })
  },

  onFavoriteTap() {
    const { recipe, isFavorited } = this.data
    const recipeId = Number(recipe.id || this.data.currentRecipeId || 0)

    if (!isLoggedIn()) {
      wx.navigateTo({
        url: '/pages/auth/auth'
      })
      return
    }

    if (!recipeId) {
      wx.showToast({
        title: '菜谱不存在',
        icon: 'none'
      })
      return
    }

    const request = isFavorited
      ? userApi.removeFavorite(recipeId)
      : userApi.addFavorite({ recipe_id: recipeId })

    request.then(() => {
      this.setData({ isFavorited: !isFavorited })
      wx.showToast({
        title: isFavorited ? '已取消收藏' : '已加入收藏',
        icon: 'success'
      })
    }).catch(() => {})
  },

  onShareTap() {
    this.setData({ showShare: true })
  },

  onShareToWechat() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  onCopyLink() {
    wx.setClipboardData({
      data: `菜谱：${this.data.recipe.title} - 来自味食记菜谱`,
      success: () => {
        wx.showToast({
          title: '链接已复制',
          icon: 'success'
        })
      }
    })
    this.setData({ showShare: false })
  },

  onCloseShare() {
    this.setData({ showShare: false })
  },

  onNutritionTap() {
    const nutrition = this.data.recipe.nutrition || {}
    wx.showModal({
      title: '营养信息',
      content:
        `热量：${nutrition.calories || '暂无'}\n` +
        `蛋白质：${nutrition.protein || '暂无'}\n` +
        `脂肪：${nutrition.fat || '暂无'}\n` +
        `碳水化合物：${nutrition.carbs || '暂无'}`,
      showCancel: false
    })
  },

  onAuthorTap() {
    wx.showToast({
      title: '作者主页暂未开放',
      icon: 'none'
    })
  }
})
