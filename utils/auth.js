const { userApi } = require('../services/api.js')

const DEFAULT_USER_INFO = {
  nickname: 'Tap to sign in',
  avatar: '/images/recipes/gongbao-hero.jpg'
}

const getStoredUserInfo = () => {
  return wx.getStorageSync('userInfo') || null
}

const getStoredToken = () => {
  return wx.getStorageSync('token') || ''
}

const isLoggedIn = () => {
  return !!getStoredToken()
}

const setAuthStorage = ({ token = '', userInfo = null } = {}) => {
  if (token) {
    wx.setStorageSync('token', token)
  }

  if (userInfo) {
    wx.setStorageSync('userInfo', userInfo)
  }
}

const clearAuthStorage = () => {
  wx.removeStorageSync('token')
  wx.removeStorageSync('userInfo')
}

const getLoginCode = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: (res) => {
        if (res.code) {
          resolve(res.code)
          return
        }

        reject(new Error('Missing login code'))
      },
      fail: reject
    })
  })
}

const getUserProfile = () => {
  return new Promise((resolve, reject) => {
    wx.getUserProfile({
      desc: 'Used to complete sign in and sync your profile',
      success: resolve,
      fail: reject
    })
  })
}

const normalizeLoginData = (result = {}, profile = {}) => {
  const data = result.data || {}
  const token = data.token || result.token || ''
  const userInfo = data.userInfo || data.user || profile.userInfo || null

  return {
    token,
    userInfo
  }
}

const loginWithWechatProfile = async () => {
  const code = await getLoginCode()
  const profile = await getUserProfile()
  const result = await userApi.login({
    code,
    userInfo: profile.userInfo,
    rawData: profile.rawData,
    signature: profile.signature,
    encryptedData: profile.encryptedData,
    iv: profile.iv
  })

  const authData = normalizeLoginData(result, profile)
  setAuthStorage(authData)

  return {
    ...authData,
    profile,
    result
  }
}

module.exports = {
  DEFAULT_USER_INFO,
  clearAuthStorage,
  getStoredToken,
  getStoredUserInfo,
  isLoggedIn,
  loginWithWechatProfile,
  setAuthStorage
}
