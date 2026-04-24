// services/api.js - API服务类
const { config } = require('../config/api.js')
const { get, post, put, delete: del } = require('../utils/request.js')

/**
 * 用户相关API
 */
const userApi = {
  // 用户登录
  login(data) {
    return post(config.apis.user.login, data)
  },
  logout(data = {}) {
    return post(config.apis.user.logout, data)
  },
  
  // 获取用户信息
  getUserInfo() {
    return get(config.apis.user.getUserInfo)
  },
  
  // 更新用户信息
  updateUserInfo(data) {
    return put(config.apis.user.updateUserInfo, data)
  }
}

/**
 * 菜谱相关API
 */
const recipeApi = {
  // 获取菜谱列表
  getRecipeList(params) {
    return get(config.apis.recipe.list, params)
  },
  
  // 获取菜谱详情
  getRecipeDetail(id) {
    return get(`${config.apis.recipe.detail}/${id}`)
  },
  
  // 创建菜谱
  createRecipe(data) {
    return post(config.apis.recipe.create, data)
  },
  
  // 更新菜谱
  updateRecipe(id, data) {
    return put(`${config.apis.recipe.update}/${id}`, data)
  },
  
  // 删除菜谱
  deleteRecipe(id) {
    return del(`${config.apis.recipe.delete}/${id}`)
  }
}

/**
 * 分类相关API
 */
const categoryApi = {
  // 获取分类列表
  getCategoryList() {
    return get(config.apis.category.list)
  },
  
  // 创建分类
  createCategory(data) {
    return post(config.apis.category.create, data)
  }
}

// 导出所有API
module.exports = {
  userApi,
  recipeApi,
  categoryApi
}
