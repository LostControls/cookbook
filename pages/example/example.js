// pages/example/example.js - 接口使用示例
const { userApi, recipeApi, categoryApi } = require('../../services/api.js')

Page({
  data: {
    userInfo: null,
    recipeList: [],
    categoryList: [],
    lastRequest: '未发起请求',
    requestStatus: '等待调试',
    userInfoText: '暂无数据',
    recipeListText: '暂无数据',
    categoryListText: '暂无数据'
  },

  onLoad() {
    // 页面加载时获取数据
    wx.setNavigationBarTitle({
      title: '接口调试'
    })
  },

  updateRequestState(name, status) {
    this.setData({
      lastRequest: name,
      requestStatus: status
    })
  },

  formatResult(data) {
    if (data === null || data === undefined) {
      return '暂无数据'
    }

    try {
      return JSON.stringify(data, null, 2)
    } catch (error) {
      return String(data)
    }
  },

  // 获取用户信息
  async getUserInfo() {
    try {
      const result = await userApi.getUserInfo()
      this.setData({
        userInfo: result.data
      })
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  },

  // 获取菜谱列表
  async getRecipeList() {
    try {
      const result = await recipeApi.getRecipeList({
        page: 1,
        limit: 10
      })
      this.setData({
        recipeList: result.data.list
      })
    } catch (error) {
      console.error('获取菜谱列表失败:', error)
    }
  },

  // 获取分类列表
  async getCategoryList() {
    try {
      const result = await categoryApi.getCategoryList()
      this.setData({
        categoryList: result.data
      })
    } catch (error) {
      console.error('获取分类列表失败:', error)
    }
  },

  // 创建菜谱
  async createRecipe() {
    try {
      const data = {
        title: '测试菜谱',
        description: '这是一个测试菜谱',
        ingredients: ['食材1', '食材2'],
        steps: ['步骤1', '步骤2']
      }
      const result = await recipeApi.createRecipe(data)
      wx.showToast({
        title: '创建成功',
        icon: 'success'
      })
    } catch (error) {
      console.error('创建菜谱失败:', error)
    }
  }
})
