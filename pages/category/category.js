// pages/category/category.js
const { categoryApi } = require('../../services/api.js')

Page({
  data: {
    categories: [],
    allCategories: [],
    searchValue: ''
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: '分类'
    })
    this.loadCategories()
  },

  onShow() {
    wx.setNavigationBarTitle({
      title: '分类'
    })
  },

  async loadCategories() {
    try {
      const result = await categoryApi.getCategoryList()
      const categories = Array.isArray(result.data) ? result.data : []
      this.setData({
        categories,
        allCategories: categories
      })
    } catch (error) {
      wx.showToast({
        title: '分类加载失败',
        icon: 'none'
      })
    }
  },

  // 搜索分类
  onSearchInput(e) {
    const searchValue = e.detail.value
    const keyword = searchValue.trim().toLowerCase()
    const categories = keyword
      ? this.data.allCategories.filter(item => String(item.name).toLowerCase().includes(keyword))
      : this.data.allCategories

    this.setData({
      searchValue,
      categories
    })
  },

  // 点击分类
  onCategoryTap(e) {
    const categoryId = e.currentTarget.dataset.id
    const categoryName = e.currentTarget.dataset.name

    wx.navigateTo({
      url: `/pages/recipe-list/recipe-list?categoryId=${categoryId}&categoryName=${categoryName}`
    })
  },

  // 搜索
  onSearch() {
    if (!this.data.searchValue.trim()) {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none'
      })
      return
    }

    wx.navigateTo({
      url: `/pages/search/search?keyword=${this.data.searchValue}`
    })
  }
})
