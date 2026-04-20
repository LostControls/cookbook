// pages/profile/profile.js
Page({
  data: {
    userInfo: {
      nickname: '美食达人',
      avatar: '/images/recipes/gongbao-hero.jpg',
      level: '高级厨师',
      recipes: 156,
      favorites: 23,
      followers: 1280
    },
    menuList: [
      {
        icon: '🔍',
        title: '浏览记录',
        desc: '查看我的浏览记录',
        url: '/pages/browse-history/browse-history'
      },
      {
        icon: '💬',
        title: '意见反馈',
        desc: '告诉我们你的想法',
        url: '/pages/feedback/feedback'
      },
    ]
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: '我的'
    })
    this.loadUserInfo()
  },

  onShow() {
    wx.setNavigationBarTitle({
      title: '我的'
    })
    // 每次显示页面时刷新用户信息
    this.loadUserInfo()
  },

  // 加载用户信息
  loadUserInfo() {
    // 从本地存储获取用户信息
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      })
    }
  },

  // 点击菜单项
  onMenuTap(e) {
    const url = e.currentTarget.dataset.url
    if (url) {
      wx.navigateTo({
        url: url
      })
    }
  },

  // 编辑个人资料
  onEditProfile() {
    wx.navigateTo({
      url: '/pages/edit-profile/edit-profile'
    })
  },

  // 登录/注册
  onLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },

  // 退出登录
  onLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('userInfo')
          wx.removeStorageSync('token')
          this.setData({
            userInfo: {
              nickname: '美食达人',
              avatar: '/images/recipes/gongbao-hero.jpg',
              level: '高级厨师',
              recipes: 156,
              favorites: 23,
              followers: 1280
            }
          })
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          })
        }
      }
    })
  }
})
