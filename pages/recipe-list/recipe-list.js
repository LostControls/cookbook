const { recipeApi, userApi } = require('../../services/api.js')
const { isLoggedIn } = require('../../utils/auth.js')

const normalizeRecipe = (item = {}, favoriteIds = []) => {
  const id = Number(item.id || item.recipe_id || item.recipeId || 0)
  return {
    id,
    title: item.title || item.name || item.recipe_name || '未命名菜谱',
    desc: item.description || item.summary || item.intro || item.content || '先把简单、好做、好吃的菜整理出来。',
    image: item.image || item.cover || item.cover_url || item.thumb || item.thumbnail || '/images/recipes/gongbao-hero.jpg',
    difficulty: item.difficulty || item.level || '简单',
    time: item.time || item.cook_time || item.duration || '15 分钟',
    author: item.author || item.nickname || item.user_name || '味食记',
    favoriteCount: Number(item.favorite_count || item.favorites_count || 0),
    isFavorite: favoriteIds.includes(id)
  }
}

const getRecipeListFromPayload = (payload = {}) => {
  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload.list)) {
    return payload.list
  }

  if (Array.isArray(payload.data)) {
    return payload.data
  }

  if (Array.isArray(payload.items)) {
    return payload.items
  }

  return []
}

const getPaginationFromPayload = (payload = {}, listLength = 0, page = 1, pageSize = 10) => {
  const pagination = payload.pagination || payload.meta || {}
  const total = Number(
    pagination.total ||
    payload.total ||
    payload.count ||
    0
  )
  const currentPage = Number(
    pagination.page ||
    pagination.current_page ||
    payload.page ||
    payload.current_page ||
    page
  )
  const resolvedPageSize = Number(
    pagination.page_size ||
    pagination.per_page ||
    payload.page_size ||
    payload.per_page ||
    pageSize
  )
  const hasMoreFromApi = pagination.has_more
  const lastPage = Number(
    pagination.last_page ||
    payload.last_page ||
    0
  )

  let hasMore = false
  if (typeof hasMoreFromApi === 'boolean') {
    hasMore = hasMoreFromApi
  } else if (lastPage > 0) {
    hasMore = currentPage < lastPage
  } else if (total > 0) {
    hasMore = currentPage * resolvedPageSize < total
  } else {
    hasMore = listLength >= resolvedPageSize
  }

  return {
    total,
    page: currentPage,
    pageSize: resolvedPageSize,
    hasMore
  }
}

Page({
  data: {
    categoryId: null,
    categoryName: '',
    searchValue: '',
    recipes: [],
    page: 1,
    pageSize: 10,
    total: 0,
    hasMore: true,
    loading: false,
    loadingText: '加载中...',
    initialized: false
  },

  onLoad(options) {
    const { categoryId = '', categoryName = '', keyword = '' } = options || {}
    const decodedName = decodeURIComponent(categoryName || '')
    const decodedKeyword = decodeURIComponent(keyword || '')

    this.setData({
      categoryId: categoryId ? Number(categoryId) : null,
      categoryName: decodedName,
      searchValue: decodedKeyword
    })

    wx.setNavigationBarTitle({
      title: decodedName || (decodedKeyword ? '搜索结果' : '菜谱列表')
    })

    this.loadRecipes(true)
  },

  onShow() {
    wx.setNavigationBarTitle({
      title: this.data.categoryName || (this.data.searchValue ? '搜索结果' : '菜谱列表')
    })
  },

  onPullDownRefresh() {
    this.loadRecipes(true).finally(() => {
      wx.stopPullDownRefresh()
    })
  },

  onReachBottom() {
    if (!this.data.loading && this.data.hasMore) {
      this.loadRecipes(false)
    }
  },

  async loadRecipes(reset = false) {
    if (this.data.loading) {
      return
    }

    const nextPage = reset ? 1 : this.data.page + 1
    this.setData({
      loading: true,
      loadingText: reset ? '正在刷新...' : '正在加载更多...'
    })

    try {
      const result = await recipeApi.getRecipeList({
        category_id: this.data.categoryId || '',
        keyword: (this.data.searchValue || '').trim(),
        page: nextPage,
        page_size: this.data.pageSize
      })

      const payload = result.data || {}
      const rawList = getRecipeListFromPayload(payload)
      const favoriteIds = await this.getVisibleFavoriteIds(rawList)
      const list = rawList.map((item) => normalizeRecipe(item, favoriteIds))
      const pagination = getPaginationFromPayload(payload, list.length, nextPage, this.data.pageSize)

      this.setData({
        recipes: reset ? list : this.data.recipes.concat(list),
        page: pagination.page,
        pageSize: pagination.pageSize,
        total: pagination.total,
        hasMore: pagination.hasMore,
        loading: false,
        loadingText: pagination.hasMore ? '上拉加载更多' : '没有更多了',
        initialized: true
      })
    } catch (error) {
      this.setData({
        loading: false,
        loadingText: '加载失败，请稍后重试',
        initialized: true
      })
      wx.showToast({
        title: '菜谱加载失败',
        icon: 'none'
      })
    }
  },

  async getVisibleFavoriteIds(rawList = []) {
    if (!isLoggedIn()) {
      return []
    }

    const recipeIds = rawList.map((item) => Number(item.id || item.recipe_id || item.recipeId || 0)).filter(Boolean)
    if (recipeIds.length === 0) {
      return []
    }

    try {
      const result = await userApi.getFavoriteList({
        page: 1,
        page_size: 10
      })
      const payload = result.data || {}
      const list = Array.isArray(payload.list) ? payload.list : []
      return list
        .map((item) => Number(item.recipe_id || item.id || 0))
        .filter((id) => recipeIds.includes(id))
    } catch (error) {
      return []
    }
  },

  onSearchInput(e) {
    this.setData({
      searchValue: e.detail.value || ''
    })
  },

  onSearch() {
    this.loadRecipes(true)
  },

  onRecipeTap(e) {
    const recipeId = Number(e.currentTarget.dataset.id || 0)
    if (!recipeId) {
      return
    }

    wx.navigateTo({
      url: `/pages/recipe-detail/recipe-detail?id=${recipeId}`
    })
  },

  onFavoriteTap(e) {
    const recipeId = Number(e.currentTarget.dataset.id || 0)
    const index = Number(e.currentTarget.dataset.index || 0)
    const recipe = this.data.recipes[index]

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
      const recipes = this.data.recipes.slice()
      recipes[index] = {
        ...recipe,
        isFavorite: !recipe.isFavorite,
        favoriteCount: Math.max(0, Number(recipe.favoriteCount || 0) + (recipe.isFavorite ? -1 : 1))
      }

      this.setData({ recipes })

      wx.showToast({
        title: recipe.isFavorite ? '已取消收藏' : '已加入收藏',
        icon: 'none'
      })
    }).catch(() => {})
  }
})
