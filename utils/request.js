const { config } = require('../config/api.js')

const request = (options) => {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    const token = wx.getStorageSync('token')
    const header = {
      'Content-Type': 'application/json',
      ...options.header
    }

    if (token) {
      header.Authorization = `Bearer ${token}`
    }

    wx.request({
      url: config.baseUrl + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header,
      timeout: options.timeout || config.timeout,
      success: (res) => {
        wx.hideLoading()

        if (res.statusCode === 200) {
          if (res.data.code === 0) {
            resolve(res.data)
            return
          }

          wx.showToast({
            title: res.data.msg || res.data.message || '请求失败',
            icon: 'none'
          })
          reject(res.data)
          return
        }

        if (res.statusCode === 401) {
          wx.removeStorageSync('token')
          wx.removeStorageSync('refreshToken')
          wx.removeStorageSync('userInfo')
          wx.navigateTo({
            url: '/pages/auth/auth'
          })
          reject(res)
          return
        }

        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
        reject(res)
      },
      fail: (err) => {
        wx.hideLoading()
        wx.showToast({
          title: '网络连接失败',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

const get = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'GET',
    data,
    ...options
  })
}

const post = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'POST',
    data,
    ...options
  })
}

const put = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'PUT',
    data,
    ...options
  })
}

const del = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'DELETE',
    data,
    ...options
  })
}

module.exports = {
  request,
  get,
  post,
  put,
  delete: del
}
