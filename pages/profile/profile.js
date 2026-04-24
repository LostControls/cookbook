const { DEFAULT_USER_INFO, getStoredUserInfo, isLoggedIn, logout } = require('../../utils/auth.js')

Page({
  data: {
    isLoggedIn: false,
    userInfo: {
      ...DEFAULT_USER_INFO,
      nickname: '点击登录'
    }
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: '个人信息'
    })
    this.loadUserInfo()
  },

  onShow() {
    wx.setNavigationBarTitle({
      title: '个人信息'
    })
    this.loadUserInfo()
  },

  loadUserInfo() {
    const storedUserInfo = getStoredUserInfo()
    const loggedIn = isLoggedIn()

    if (storedUserInfo && loggedIn) {
      this.setData({
        isLoggedIn: true,
        userInfo: {
          nickname: storedUserInfo.nickName || storedUserInfo.nickname || '微信用户',
          avatar: storedUserInfo.avatarUrl || storedUserInfo.avatar || DEFAULT_USER_INFO.avatar,
          avatarUrl: storedUserInfo.avatarUrl || storedUserInfo.avatar || DEFAULT_USER_INFO.avatar,
          city: storedUserInfo.city || '',
          province: storedUserInfo.province || '',
          country: storedUserInfo.country || ''
        }
      })
      return
    }

    this.setData({
      isLoggedIn: false,
      userInfo: {
        ...DEFAULT_USER_INFO,
        nickname: '点击登录'
      }
    })
  },

  onSubmit() {
    if (!this.data.isLoggedIn) {
      wx.navigateTo({
        url: '/pages/auth/auth'
      })
      return
    }

    wx.showToast({
      title: '资料修改功能待接入',
      icon: 'none'
    })
  },

  onLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出当前账号吗？',
      success: async (res) => {
        if (!res.confirm) return

        try {
          await logout()
          this.loadUserInfo()
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          })

          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 300)
        } catch (error) {
          wx.showToast({
            title: '退出失败，请重试',
            icon: 'none'
          })
        }
      }
    })
  }
})
