// pages/browse-history/browse-history.js
Page({
  data: {
    historyList: [],
    isEmpty: true
  },

  onLoad() {
    wx.setNavigationBarTitle({ title: '浏览记录' })
    this.loadHistory()
  },

  onShow() {
    wx.setNavigationBarTitle({ title: '浏览记录' })
    this.loadHistory()
  },

  // 静态数据（先写死，后期根据接口返回）
  getStaticHistory() {
    return [
      { id: 301, title: '剁椒鱼头', image: '/images/recipes/gongbao-hero.jpg' },
      { id: 302, title: '辣椒炒肉', image: '/images/recipes/gongbao-hero.jpg' },
      { id: 303, title: '白切鸡', image: '/images/recipes/gongbao-hero.jpg' },
      { id: 304, title: '回锅肉', image: '/images/recipes/gongbao-hero.jpg' }
    ]
  },

  // 加载浏览记录（使用静态数据，不读写本地存储）
  loadHistory() {
    const list = this.getStaticHistory()
    this.setData({
      historyList: list,
      isEmpty: list.length === 0
    })
  },

  // 点击进入详情
  onRecipeTap(e) {
    const recipeId = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/recipe-detail/recipe-detail?id=${recipeId}` })
  },

  // 删除单项（仅前端展示修改，不落存储）
  onRemoveItem(e) {
    const index = e.currentTarget.dataset.index
    let list = this.data.historyList.slice()
    list.splice(index, 1)
    this.setData({ historyList: list, isEmpty: list.length === 0 })
    wx.showToast({ title: '已删除', icon: 'success' })
  },

  // 清空记录（仅前端展示修改，不落存储）
  onClearAll() {
    if (this.data.historyList.length === 0) {
      wx.showToast({ title: '列表为空', icon: 'none' })
      return
    }
    wx.showModal({
      title: '清空浏览记录',
      content: '确定要清空所有记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ historyList: [], isEmpty: true })
          wx.showToast({ title: '已清空', icon: 'success' })
        }
      }
    })
  },

  // 跳转首页
  goToHome() {
    wx.switchTab({ url: '/pages/index/index' })
  }
})