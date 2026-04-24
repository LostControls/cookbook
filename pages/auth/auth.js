const { getUserProfile, loginWithWechatProfile, getStoredUserInfo, isLoggedIn } = require('../../utils/auth.js')

Page({
  data: {
    loading: false,
    agreed: false,
    userInfo: getStoredUserInfo(),
    isLoggedIn: isLoggedIn()
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: '微信登录'
    })
  },

  onShow() {
    this.setData({
      userInfo: getStoredUserInfo(),
      isLoggedIn: isLoggedIn()
    })
  },

  onToggleAgreement() {
    this.setData({
      agreed: !this.data.agreed
    })
  },

  onViewAgreement() {
    wx.showToast({
      title: '协议内容稍后补充',
      icon: 'none'
    })
  },

  onSkip() {
    wx.switchTab({
      url: '/pages/home/home'
    })
  },

  async onWechatLogin() {
    if (this.data.loading) return

    if (!this.data.agreed) {
      wx.showToast({
        title: '请先勾选协议',
        icon: 'none'
      })
      return
    }

    try {
      const profile = await getUserProfile()
      this.setData({ loading: true })

      const { userInfo } = await loginWithWechatProfile(profile)
      this.setData({
        userInfo,
        isLoggedIn: true
      })

      wx.showToast({
        title: '登录成功',
        icon: 'success'
      })

      setTimeout(() => {
        wx.switchTab({
          url: '/pages/member/member'
        })
      }, 300)
    } catch (error) {
      const message = error && error.errMsg && error.errMsg.includes('getUserProfile:fail auth deny')
        ? '你已取消授权'
        : '登录失败，请稍后重试'

      wx.showToast({
        title: message,
        icon: 'none'
      })
    } finally {
      this.setData({ loading: false })
    }
  }
})
