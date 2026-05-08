const { DEFAULT_USER_INFO, getStoredUserInfo, isLoggedIn } = require('../../utils/auth.js')
const { userApi } = require('../../services/api.js')

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
    if (!isLoggedIn()) {
      this.setData({
        isLoggedIn: false,
        serviceList: this.buildServiceList(0),
        userInfo: {
          ...DEFAULT_USER_INFO,
          level: '点击登录',
          favorites: 0
        }
      })
      return
    }

    const storedUserInfo = getStoredUserInfo() || {}
    let remoteProfile = {}
    let favoriteCount = 0

    try {
      const [profileResult, favoriteCountResult] = await Promise.all([
        userApi.getUserInfo(),
        userApi.getFavoriteCount()
      ])

      remoteProfile = (profileResult && profileResult.data) || {}
      favoriteCount = (favoriteCountResult && favoriteCountResult.data && favoriteCountResult.data.favorite_count) || 0
    } catch (error) {
      remoteProfile = storedUserInfo
      favoriteCount = 0
    }

    const mergedUserInfo = {
      ...storedUserInfo,
      ...remoteProfile
    }
    wx.setStorageSync('userInfo', mergedUserInfo)

    const nickname =
      mergedUserInfo.nickName ||
      mergedUserInfo.nickname ||
      DEFAULT_USER_INFO.nickname

    this.setData({
      isLoggedIn: true,
      serviceList: this.buildServiceList(favoriteCount),
      userInfo: {
        nickname,
        avatar: mergedUserInfo.avatarUrl || mergedUserInfo.avatar || DEFAULT_USER_INFO.avatar,
        province: mergedUserInfo.province || '',
        city: mergedUserInfo.city || '',
        country: mergedUserInfo.country || '',
        level: '点击查看个人信息',
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
    this.onProfileTap()
  },

  onServiceTap(e) {
    const { url, mode } = e.currentTarget.dataset
    if (!url) {
      return
    }

    if (!this.data.isLoggedIn && mode !== 'switchTab') {
      wx.navigateTo({
        url: '/pages/auth/auth'
      })
      return
    }

    if (mode === 'switchTab') {
      wx.switchTab({ url })
      return
    }

    wx.navigateTo({ url })
  }
})
