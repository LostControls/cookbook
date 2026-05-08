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

  onSearchInput(e) {
    const searchValue = e.detail.value || ''
    const keyword = searchValue.trim().toLowerCase()
    const categories = keyword
      ? this.data.allCategories.filter((item) => String(item.name || '').toLowerCase().includes(keyword))
      : this.data.allCategories

    this.setData({
      searchValue,
      categories
    })
  },

  onCategoryTap(e) {
    const categoryId = e.currentTarget.dataset.id
    const categoryName = e.currentTarget.dataset.name || ''

    wx.navigateTo({
      url: `/pages/recipe-list/recipe-list?categoryId=${categoryId}&categoryName=${encodeURIComponent(categoryName)}`
    })
  },

  onSearch() {
    const keyword = (this.data.searchValue || '').trim()
    if (!keyword) {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none'
      })
      return
    }

    wx.navigateTo({
      url: `/pages/recipe-list/recipe-list?categoryName=${encodeURIComponent('搜索结果')}&keyword=${encodeURIComponent(keyword)}`
    })
  }
})
