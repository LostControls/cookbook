const { loginWithWechatProfile, getStoredUserInfo, isLoggedIn } = require('../../utils/auth.js')

Page({
  data: {
    loading: false,
    userInfo: getStoredUserInfo(),
    isLoggedIn: isLoggedIn()
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: 'Sign In'
    })
  },

  onShow() {
    this.setData({
      userInfo: getStoredUserInfo(),
      isLoggedIn: isLoggedIn()
    })
  },

  async onWechatLogin() {
    if (this.data.loading) {
      return
    }

    this.setData({ loading: true })

    try {
      const { userInfo } = await loginWithWechatProfile()
      this.setData({
        userInfo,
        isLoggedIn: true
      })

      wx.showToast({
        title: 'Success',
        icon: 'success'
      })

      setTimeout(() => {
        const pages = getCurrentPages()
        if (pages.length > 1) {
          wx.navigateBack()
          return
        }

        wx.switchTab({
          url: '/pages/account/account'
        })
      }, 300)
    } catch (error) {
      const message = error && error.errMsg && error.errMsg.includes('getUserProfile:fail auth deny')
        ? 'Auth canceled'
        : 'Sign in failed'

      wx.showToast({
        title: message,
        icon: 'none'
      })
      console.error('微信登录失败:', error)
    } finally {
      this.setData({ loading: false })
    }
  }
})
