const { homeApi, userApi } = require('../../services/api.js')
const { isLoggedIn } = require('../../utils/auth.js')

const fallbackData = {
  brandName: '味食记菜谱',
  brandSlogan: '用心做菜，记录美味',
  greeting: '今天想做什么菜？',
  heroPanel: {
    title: '今日下厨灵感',
    desc: '把想做的菜、想记的味道，都留在味食记菜谱里。',
    logo: '/images/brand-logo.png'
  },
  quickActionText: '去看收藏',
  categoryList: [],
  topicList: [],
  recommendRecipes: [],
  recentMenu: []
}

const normalizeHomeData = (payload = {}) => ({
  brandName: payload.brand_name || fallbackData.brandName,
  brandSlogan: payload.brand_slogan || fallbackData.brandSlogan,
  greeting: payload.greeting || fallbackData.greeting,
  heroPanel: {
    title: (payload.hero_panel && payload.hero_panel.title) || fallbackData.heroPanel.title,
    desc: (payload.hero_panel && payload.hero_panel.desc) || fallbackData.heroPanel.desc,
    logo: (payload.hero_panel && payload.hero_panel.logo) || fallbackData.heroPanel.logo
  },
  quickActionText: (payload.quick_action && payload.quick_action.text) || fallbackData.quickActionText,
  categoryList: Array.isArray(payload.category_list) ? payload.category_list : [],
  topicList: Array.isArray(payload.topic_list) ? payload.topic_list : [],
  recommendRecipes: Array.isArray(payload.recommend_recipes)
    ? payload.recommend_recipes.map((item) => ({
        id: Number(item.id || 0),
        title: item.title || '未命名菜谱',
        desc: item.desc || item.description || '',
        time: item.time || '',
        difficulty: item.difficulty || '',
        image: item.image || '/images/recipes/gongbao-hero.jpg',
        isFavorite: Boolean(item.is_favorite)
      }))
    : [],
  recentMenu: Array.isArray(payload.recent_menu) ? payload.recent_menu : []
})

Page({
  data: {
    ...fallbackData,
    searchValue: ''
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: '味食记菜谱'
    })
    this.loadHomeData()
  },

  onShow() {
    this.syncFavoriteState()
  },

  onPullDownRefresh() {
    this.loadHomeData().finally(() => {
      wx.stopPullDownRefresh()
    })
  },

  async loadHomeData() {
    try {
      const result = await homeApi.getHomeData()
      const homeData = normalizeHomeData(result.data || {})
      this.setData(homeData)
      await this.syncFavoriteState(homeData.recommendRecipes)
    } catch (error) {
      wx.showToast({
        title: '首页加载失败',
        icon: 'none'
      })
    }
  },

  async syncFavoriteState(recipeList = this.data.recommendRecipes) {
    const list = Array.isArray(recipeList) ? recipeList : []
    if (list.length === 0) {
      return
    }

    if (!isLoggedIn()) {
      this.setData({
        recommendRecipes: list.map((item) => ({
          ...item,
          isFavorite: false
        }))
      })
      return
    }

    try {
      const result = await userApi.getFavoriteList({
        page: 1,
        page_size: 10
      })
      const payload = result.data || {}
      const favoriteList = Array.isArray(payload.list) ? payload.list : []
      const favoriteIds = favoriteList.map((item) => Number(item.recipe_id || item.id || 0))

      this.setData({
        recommendRecipes: list.map((item) => ({
          ...item,
          isFavorite: favoriteIds.includes(Number(item.id || 0))
        }))
      })
    } catch (error) {
      this.setData({
        recommendRecipes: list.map((item) => ({
          ...item,
          isFavorite: false
        }))
      })
    }
  },

  onSearchInput(e) {
    this.setData({
      searchValue: e.detail.value || ''
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

    wx.navigateTo({
      url: `/pages/recipe-list/recipe-list?categoryName=${encodeURIComponent('搜索结果')}&keyword=${encodeURIComponent(keyword)}`
    })
  },

  onCategoryTap(e) {
    const { id, name } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/recipe-list/recipe-list?categoryId=${id}&categoryName=${encodeURIComponent(name || '')}`
    })
  },

  onRecipeTap(e) {
    const { id } = e.currentTarget.dataset
    if (!id) {
      return
    }

    wx.navigateTo({
      url: `/pages/recipe-detail/recipe-detail?id=${id}`
    })
  },

  onFavoriteTap(e) {
    const { id, index } = e.currentTarget.dataset
    const recipeId = Number(id || 0)
    const recipeIndex = Number(index || 0)
    const recipe = this.data.recommendRecipes[recipeIndex]

    if (!isLoggedIn()) {
      wx.navigateTo({
        url: '/pages/auth/auth'
      })
      return
    }

    if (!recipeId || !recipe) {
      return
    }

    const request = recipe.isFavorite
      ? userApi.removeFavorite(recipeId)
      : userApi.addFavorite({ recipe_id: recipeId })

    request.then(() => {
      const recommendRecipes = this.data.recommendRecipes.slice()
      recommendRecipes[recipeIndex] = {
        ...recipe,
        isFavorite: !recipe.isFavorite
      }
      this.setData({ recommendRecipes })

      wx.showToast({
        title: recipe.isFavorite ? '已取消收藏' : '已加入收藏',
        icon: 'none'
      })
    }).catch(() => {})
  },

  onTopicTap(e) {
    const { title } = e.currentTarget.dataset
    wx.showToast({
      title: title || '敬请期待',
      icon: 'none'
    })
  },

  onQuickActionTap() {
    wx.switchTab({
      url: '/pages/favorite/favorite'
    })
  }
})
