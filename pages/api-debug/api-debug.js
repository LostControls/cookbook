const { userApi, recipeApi, categoryApi } = require('../../services/api.js')

Page({
  data: {
    lastRequest: '未发起请求',
    requestStatus: '等待调试',
    userInfoText: '暂无数据',
    recipeListText: '暂无数据',
    categoryListText: '暂无数据'
  },

  onLoad() {
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

  async getUserInfo() {
    this.updateRequestState('GET /user/info', '请求中...')
    try {
      const result = await userApi.getUserInfo()
      this.setData({
        userInfoText: this.formatResult(result.data)
      })
      this.updateRequestState('GET /user/info', '成功')
      wx.showToast({
        title: '用户信息获取成功',
        icon: 'success'
      })
    } catch (error) {
      console.error('获取用户信息失败:', error)
      this.updateRequestState('GET /user/info', '失败')
    }
  },

  async getRecipeList() {
    this.updateRequestState('GET /recipe/list', '请求中...')
    try {
      const result = await recipeApi.getRecipeList({
        page: 1,
        limit: 10
      })
      this.setData({
        recipeListText: this.formatResult(result.data)
      })
      this.updateRequestState('GET /recipe/list', '成功')
      wx.showToast({
        title: '菜谱列表获取成功',
        icon: 'success'
      })
    } catch (error) {
      console.error('获取菜谱列表失败:', error)
      this.updateRequestState('GET /recipe/list', '失败')
    }
  },

  async getCategoryList() {
    this.updateRequestState('GET /category/list', '请求中...')
    try {
      const result = await categoryApi.getCategoryList()
      this.setData({
        categoryListText: this.formatResult(result.data)
      })
      this.updateRequestState('GET /category/list', '成功')
      wx.showToast({
        title: '分类列表获取成功',
        icon: 'success'
      })
    } catch (error) {
      console.error('获取分类列表失败:', error)
      this.updateRequestState('GET /category/list', '失败')
    }
  },

  async createRecipe() {
    this.updateRequestState('POST /recipe/create', '请求中...')
    try {
      const data = {
        title: '测试菜谱',
        description: '这是一个用于联调的测试菜谱',
        ingredients: ['食材1', '食材2'],
        steps: ['步骤1', '步骤2']
      }
      const result = await recipeApi.createRecipe(data)
      this.setData({
        recipeListText: this.formatResult(result.data || result)
      })
      this.updateRequestState('POST /recipe/create', '成功')
      wx.showToast({
        title: '创建成功',
        icon: 'success'
      })
    } catch (error) {
      console.error('创建菜谱失败:', error)
      this.updateRequestState('POST /recipe/create', '失败')
    }
  }
})
