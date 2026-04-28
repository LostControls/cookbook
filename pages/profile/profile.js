const { DEFAULT_USER_INFO, getStoredUserInfo, isLoggedIn, logout } = require('../../utils/auth.js')
const { userApi } = require('../../services/api.js')

Page({
  data: {
    isLoggedIn: false,
    submitting: false,
    userInfo: {
      ...DEFAULT_USER_INFO,
      nickname: '点击登录'
    },
    nickname: ''
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: '个人信息'
    })

    if (!isLoggedIn()) {
      wx.redirectTo({
        url: '/pages/auth/auth'
      })
      return
    }

    this.loadUserInfo()
  },

  onShow() {
    wx.setNavigationBarTitle({
      title: '个人信息'
    })

    if (!isLoggedIn()) {
      wx.redirectTo({
        url: '/pages/auth/auth'
      })
      return
    }

    this.loadUserInfo()
  },

  loadUserInfo() {
    const storedUserInfo = getStoredUserInfo()
    const loggedIn = isLoggedIn()

    if (storedUserInfo && loggedIn) {
      const nickname = storedUserInfo.nickName || storedUserInfo.nickname || '微信用户'
      this.setData({
        isLoggedIn: true,
        nickname,
        userInfo: {
          nickname,
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
      nickname: '',
      userInfo: {
        ...DEFAULT_USER_INFO,
        nickname: '点击登录'
      }
    })
  },

  onNicknameInput(e) {
    this.setData({
      nickname: (e.detail.value || '').trimStart()
    })
  },

  async onSubmit() {
    if (!this.data.isLoggedIn) {
      wx.navigateTo({
        url: '/pages/auth/auth'
      })
      return
    }

    if (this.data.submitting) {
      return
    }

    const nickname = (this.data.nickname || '').trim()
    if (!nickname) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none'
      })
      return
    }

    this.setData({ submitting: true })

    try {
      const result = await userApi.updateUserInfo({ nickname })
      const updatedNickname = (result.data && result.data.nickname) || nickname
      const userInfo = {
        ...(getStoredUserInfo() || {}),
        ...(result.data || {}),
        nickname: updatedNickname,
        nickName: updatedNickname
      }

      wx.setStorageSync('userInfo', userInfo)
      this.setData({
        nickname: updatedNickname,
        userInfo: {
          ...this.data.userInfo,
          nickname: updatedNickname
        }
      })

      wx.showToast({
        title: '修改成功',
        icon: 'success'
      })
    } catch (error) {
      wx.showToast({
        title: '修改失败',
        icon: 'none'
      })
    } finally {
      this.setData({ submitting: false })
    }
  },

  onLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出当前账号吗？',
      success: async (res) => {
        if (!res.confirm) {
          return
        }

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
