const { config } = require('../config/api.js')
const { get, post, put, delete: del } = require('../utils/request.js')

const homeApi = {
  getHomeData() {
    return get(config.apis.home.index)
  }
}

const userApi = {
  login(data) {
    return post(config.apis.user.login, data)
  },

  logout(data = {}) {
    return post(config.apis.user.logout, data)
  },

  getUserInfo() {
    return get(config.apis.user.getUserInfo)
  },

  updateUserInfo(data) {
    return put(config.apis.user.updateUserInfo, data)
  },

  getFavoriteList(params) {
    return get(config.apis.user.favoriteList, params)
  },

  addFavorite(data) {
    return post(config.apis.user.addFavorite, data)
  },

  removeFavorite(recipeId) {
    return del(`${config.apis.user.removeFavorite}/${recipeId}`)
  },

  getFavoriteCount() {
    return get(config.apis.user.favoriteCount)
  },

  getBrowseHistoryList(params) {
    return get(config.apis.user.browseHistoryList, params)
  },

  recordBrowseHistory(data) {
    return post(config.apis.user.recordBrowseHistory, data)
  },

  removeBrowseHistory(historyId) {
    return del(`${config.apis.user.removeBrowseHistory}/${historyId}`)
  },

  clearBrowseHistory() {
    return del(config.apis.user.clearBrowseHistory)
  },

  submitFeedback(data) {
    return post(config.apis.user.feedback, data)
  }
}

const recipeApi = {
  getRecipeList(params) {
    return get(config.apis.recipe.list, params)
  },

  getRecipeDetail(id) {
    return get(`${config.apis.recipe.detail}/${id}`)
  },

  createRecipe(data) {
    return post(config.apis.recipe.create, data)
  },

  updateRecipe(id, data) {
    return put(`${config.apis.recipe.update}/${id}`, data)
  },

  deleteRecipe(id) {
    return del(`${config.apis.recipe.delete}/${id}`)
  }
}

const categoryApi = {
  getCategoryList() {
    return get(config.apis.category.list)
  },

  createCategory(data) {
    return post(config.apis.category.create, data)
  }
}

module.exports = {
  homeApi,
  userApi,
  recipeApi,
  categoryApi
}
