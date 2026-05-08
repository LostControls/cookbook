// pages/browse-history/browse-history.js
const { userApi } = require('../../services/api.js')
const { isLoggedIn } = require('../../utils/auth.js')

const pad = (value) => String(value).padStart(2, '0')

const formatBrowseTime = (timestamp) => {
  const time = Number(timestamp || 0)
  if (!time) {
    return ''
  }

  const date = new Date(time * 1000)
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hour = pad(date.getHours())
  const minute = pad(date.getMinutes())

  return `${year}-${month}-${day} ${hour}:${minute}`
}

const normalizeHistoryItem = (item = {}) => ({
  id: Number(item.id || 0),
  recipe_id: Number(item.recipe_id || item.recipeId || 0),
  title: item.title || item.name || '未命名菜谱',
  image: item.image || item.cover || item.cover_url || '/images/recipes/gongbao-hero.jpg',
  description: item.description || '',
  last_browse_time: Number(item.last_browse_time || 0),
  browseTimeText: formatBrowseTime(item.last_browse_time)
})

Page({
  data: {
    historyList: [],
    isEmpty: true,
    page: 1,
    pageSize: 10,
    total: 0,
    hasMore: true,
    loading: false
  },

  onLoad() {
    wx.setNavigationBarTitle({ title: '浏览记录' })
    this.loadHistory(true)
  },

  onShow() {
    wx.setNavigationBarTitle({ title: '浏览记录' })
    this.loadHistory(true)
  },

  onPullDownRefresh() {
    this.loadHistory(true).finally(() => {
      wx.stopPullDownRefresh()
    })
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadHistory(false)
    }
  },

  async loadHistory(reset = false) {
    if (!isLoggedIn()) {
      this.setData({
        historyList: [],
        isEmpty: true,
        page: 1,
        total: 0,
        hasMore: false,
        loading: false
      })
      return
    }

    if (this.data.loading) {
      return
    }

    const nextPage = reset ? 1 : this.data.page + 1
    this.setData({ loading: true })

    try {
      const result = await userApi.getBrowseHistoryList({
        page: nextPage,
        page_size: this.data.pageSize
      })

      const payload = result.data || {}
      const list = Array.isArray(payload.list) ? payload.list.map(normalizeHistoryItem) : []
      const pagination = payload.pagination || {}
      const historyList = reset ? list : this.data.historyList.concat(list)

      this.setData({
        historyList,
        isEmpty: historyList.length === 0,
        page: Number(pagination.page || nextPage),
        pageSize: Number(pagination.page_size || this.data.pageSize),
        total: Number(pagination.total || historyList.length),
        hasMore: Boolean(pagination.has_more),
        loading: false
      })
    } catch (error) {
      this.setData({ loading: false })
      wx.showToast({
        title: '浏览记录加载失败',
        icon: 'none'
      })
    }
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

  onRemoveItem(e) {
    const historyId = Number(e.currentTarget.dataset.id || 0)
    const index = Number(e.currentTarget.dataset.index || 0)
    if (!historyId) {
      return
    }

    wx.showModal({
      title: '删除浏览记录',
      content: '确定要删除这条浏览记录吗？',
      success: async (res) => {
        if (!res.confirm) {
          return
        }

        try {
          await userApi.removeBrowseHistory(historyId)

          const historyList = this.data.historyList.slice()
          historyList.splice(index, 1)

          this.setData({
            historyList,
            isEmpty: historyList.length === 0,
            total: Math.max(0, this.data.total - 1)
          })

          wx.showToast({
            title: '已删除',
            icon: 'success'
          })
        } catch (error) {
          wx.showToast({
            title: '删除失败',
            icon: 'none'
          })
        }
      }
    })
  },

  onClearAll() {
    if (this.data.historyList.length === 0) {
      wx.showToast({
        title: '列表为空',
        icon: 'none'
      })
      return
    }

    wx.showModal({
      title: '清空浏览记录',
      content: '确定要清空所有浏览记录吗？',
      success: async (res) => {
        if (!res.confirm) {
          return
        }

        try {
          await userApi.clearBrowseHistory()
          this.setData({
            historyList: [],
            isEmpty: true,
            page: 1,
            total: 0,
            hasMore: false
          })

          wx.showToast({
            title: '已清空',
            icon: 'success'
          })
        } catch (error) {
          wx.showToast({
            title: '清空失败',
            icon: 'none'
          })
        }
      }
    })
  },

  goToHome() {
    wx.switchTab({ url: '/pages/home/home' })
  }
})
