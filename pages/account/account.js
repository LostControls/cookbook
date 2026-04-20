const { DEFAULT_USER_INFO, clearAuthStorage, getStoredUserInfo, isLoggedIn } = require('../../utils/auth.js')

Page({
  data: {
    userInfo: {
      ...DEFAULT_USER_INFO,
      level: 'Guest',
      recipes: 0,
      favorites: 0,
      followers: 0
    },
    isLoggedIn: false,
    menuList: [
      {
        icon: 'H',
        title: 'History',
        desc: 'View browsing history',
        url: '/pages/browse-history/browse-history'
      },
      {
        icon: 'F',
        title: 'Feedback',
        desc: 'Tell us what you think',
        url: '/pages/feedback/feedback'
      }
    ]
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: 'Account'
    })
    this.loadUserInfo()
  },

  onShow() {
    wx.setNavigationBarTitle({
      title: 'Account'
    })
    this.loadUserInfo()
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
          level: 'Signed in',
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
        level: 'Guest',
        recipes: 0,
        favorites: favoriteCount,
        followers: 0
      }
    })
  },

  onMenuTap(e) {
    const url = e.currentTarget.dataset.url
    if (!url) {
      return
    }

    wx.navigateTo({
      url
    })
  },

  onLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },

  onLogout() {
    wx.showModal({
      title: 'Sign out',
      content: 'Do you want to sign out now?',
      success: (res) => {
        if (!res.confirm) {
          return
        }

        clearAuthStorage()
        this.loadUserInfo()
        wx.showToast({
          title: 'Signed out',
          icon: 'success'
        })
      }
    })
  }
})
