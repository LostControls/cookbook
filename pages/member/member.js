const { DEFAULT_USER_INFO, getStoredUserInfo, isLoggedIn } = require('../../utils/auth.js')
const { userApi } = require('../../services/api.js')

const DEMO_FAVORITE_IDS = [101, 102, 103, 104]

const isDemoFavoriteList = (favorites = []) => {
  if (!Array.isArray(favorites) || favorites.length !== DEMO_FAVORITE_IDS.length) {
    return false
  }

  const ids = favorites.map((item) => item.id).sort((a, b) => a - b)
  return ids.every((id, index) => id === DEMO_FAVORITE_IDS[index])
}

Page({
  data: {
    userInfo: {
      ...DEFAULT_USER_INFO,
      level: '点击登录',
      favorites: 0
    },
    isLoggedIn: false,
    serviceList: []
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: '个人中心'
    })
    this.loadUserInfo()
  },

  onShow() {
    wx.setNavigationBarTitle({
      title: '个人中心'
    })
    this.loadUserInfo()
  },

  onPullDownRefresh() {
    this.loadUserInfo().finally(() => {
      wx.stopPullDownRefresh()
    })
  },

  buildServiceList(favoriteCount) {
    return [
      {
        key: 'favorite',
        icon: '藏',
        title: '我的收藏',
        value: favoriteCount > 0 ? String(favoriteCount) : '',
        mode: 'switchTab',
        url: '/pages/favorite/favorite'
      },
      {
        key: 'history',
        icon: '记',
        title: '浏览记录',
        value: '',
        mode: 'navigate',
        url: '/pages/browse-history/browse-history'
      },
      {
        key: 'feedback',
        icon: '反',
        title: '意见反馈',
        value: '',
        mode: 'navigate',
        url: '/pages/feedback/feedback'
      }
    ]
  },

  async loadUserInfo() {
    const storedUserInfo = getStoredUserInfo()
    const storedFavorites = wx.getStorageSync('favoriteRecipes') || []
    const localFavoriteCount = isDemoFavoriteList(storedFavorites) ? 0 : storedFavorites.length
    let favoriteCount = localFavoriteCount

    if (storedUserInfo && isLoggedIn()) {
      try {
        const result = await userApi.getFavoriteCount()
        favoriteCount = (result.data && result.data.favorite_count) || 0
      } catch (error) {
        favoriteCount = localFavoriteCount
      }

      this.setData({
        isLoggedIn: true,
        serviceList: this.buildServiceList(favoriteCount),
        userInfo: {
          nickname: storedUserInfo.nickName || storedUserInfo.nickname || DEFAULT_USER_INFO.nickname,
          avatar: storedUserInfo.avatarUrl || storedUserInfo.avatar || DEFAULT_USER_INFO.avatar,
          province: storedUserInfo.province || '',
          city: storedUserInfo.city || '',
          country: storedUserInfo.country || '',
          level: '点击查看个人信息',
          favorites: favoriteCount
        }
      })
      return
    }

    this.setData({
      isLoggedIn: false,
      serviceList: this.buildServiceList(favoriteCount),
      userInfo: {
        ...DEFAULT_USER_INFO,
        level: '点击登录',
        favorites: favoriteCount
      }
    })
  },

  onProfileTap() {
    if (!this.data.isLoggedIn) {
      wx.navigateTo({
        url: '/pages/auth/auth'
      })
      return
    }

    wx.navigateTo({
      url: '/pages/profile/profile'
    })
  },

  onAvatarTap() {
    if (!this.data.isLoggedIn) {
      wx.navigateTo({
        url: '/pages/auth/auth'
      })
      return
    }

    wx.navigateTo({
      url: '/pages/profile/profile'
    })
  },

  onServiceTap(e) {
    const { url, mode } = e.currentTarget.dataset
    if (!url) {
      return
    }

    if (mode === 'switchTab') {
      wx.switchTab({ url })
      return
    }

    wx.navigateTo({ url })
  }
})
