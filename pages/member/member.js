const { DEFAULT_USER_INFO, getStoredUserInfo, isLoggedIn } = require('../../utils/auth.js')

Page({
  data: {
    userInfo: {
      ...DEFAULT_USER_INFO,
      level: '点击登录',
      recipes: 0,
      favorites: 0,
      followers: 0
    },
    isLoggedIn: false,
    menuList: [
      {
        icon: '记',
        title: '浏览记录',
        desc: '查看最近浏览过的菜谱',
        url: '/pages/browse-history/browse-history'
      },
      {
        icon: '反',
        title: '意见反馈',
        desc: '告诉我们你的想法和建议',
        url: '/pages/feedback/feedback'
      }
    ]
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
    this.loadUserInfo()
    wx.stopPullDownRefresh()
  },

  loadUserInfo() {
    const storedUserInfo = getStoredUserInfo()
    const favoriteCount = (wx.getStorageSync('favoriteRecipes') || []).length

    if (storedUserInfo && isLoggedIn()) {
      this.setData({
        isLoggedIn: true,
        userInfo: {
          nickname: storedUserInfo.nickName || storedUserInfo.nickname || DEFAULT_USER_INFO.nickname,
          avatar: storedUserInfo.avatarUrl || storedUserInfo.avatar || DEFAULT_USER_INFO.avatar,
          province: storedUserInfo.province || '',
          city: storedUserInfo.city || '',
          country: storedUserInfo.country || '',
          level: '点击查看个人信息',
          recipes: 0,
          favorites: favoriteCount,
          followers: 0
        }
      })
      return
    }

    this.setData({
      isLoggedIn: false,
      userInfo: {
        ...DEFAULT_USER_INFO,
        level: '点击登录',
        recipes: 0,
        favorites: favoriteCount,
        followers: 0
      }
    })
  },

  onMenuTap(e) {
    const { url } = e.currentTarget.dataset
    if (!url) return

    wx.navigateTo({ url })
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
    wx.navigateTo({
      url: '/pages/profile/profile'
    })
  }
})
