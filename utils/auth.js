const { userApi } = require('../services/api.js')

const DEFAULT_USER_INFO = {
  nickname: '点击登录',
  avatar: '/images/default-avatar.png',
  avatarUrl: '/images/default-avatar.png',
  city: '',
  province: '',
  country: ''
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

const setAuthStorage = ({ token = '', refreshToken = '', userInfo = null } = {}) => {
  if (token) {
    wx.setStorageSync('token', token)
  }

  if (refreshToken) {
    wx.setStorageSync('refreshToken', refreshToken)
  }

  if (userInfo) {
    wx.setStorageSync('userInfo', userInfo)
  }
}

const clearAuthStorage = () => {
  wx.removeStorageSync('token')
  wx.removeStorageSync('refreshToken')
  wx.removeStorageSync('userInfo')
}

const buildLoginPayload = (profile) => {
  const userInfo = profile.userInfo || {}

  return {
    code: '',
    nickname: userInfo.nickName || '',
    avatarUrl: userInfo.avatarUrl || '',
    gender: userInfo.gender || 0,
    country: userInfo.country || '',
    province: userInfo.province || '',
    city: userInfo.city || '',
    language: userInfo.language || '',
    encryptedData: profile.encryptedData || '',
    iv: profile.iv || '',
    rawData: profile.rawData || '',
    signature: profile.signature || ''
  }
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
      desc: '用于登录',
      success: resolve,
      fail: reject
    })
  })
}

const normalizeLoginData = (result = {}, profile = {}) => {
  const data = result.data || {}
  const token = data.access_token || data.token || result.access_token || result.token || ''
  const refreshToken = data.refresh_token || result.refresh_token || ''
  const userInfo = data.userInfo || data.user || {
    ...(profile.userInfo || {}),
    nickname: profile.userInfo && profile.userInfo.nickName ? profile.userInfo.nickName : '',
    avatar: profile.userInfo && profile.userInfo.avatarUrl ? profile.userInfo.avatarUrl : '',
    avatarUrl: profile.userInfo && profile.userInfo.avatarUrl ? profile.userInfo.avatarUrl : '',
    city: profile.userInfo && profile.userInfo.city ? profile.userInfo.city : '',
    province: profile.userInfo && profile.userInfo.province ? profile.userInfo.province : '',
    country: profile.userInfo && profile.userInfo.country ? profile.userInfo.country : ''
  }

  return {
    token,
    refreshToken,
    userInfo
  }
}

const loginWithWechatProfile = async (profile) => {
  const userProfile = profile || await getUserProfile()
  const code = await getLoginCode()
  const payload = buildLoginPayload(userProfile)
  payload.code = code
  const result = await userApi.login(payload)

  const authData = normalizeLoginData(result, userProfile)
  setAuthStorage(authData)

  return {
    ...authData,
    profile: userProfile,
    result
  }
}

const logout = async () => {
  try {
    await userApi.logout()
  } finally {
    clearAuthStorage()
  }
}

module.exports = {
  buildLoginPayload,
  DEFAULT_USER_INFO,
  clearAuthStorage,
  getUserProfile,
  getStoredToken,
  getStoredUserInfo,
  isLoggedIn,
  loginWithWechatProfile,
  logout,
  setAuthStorage
}
