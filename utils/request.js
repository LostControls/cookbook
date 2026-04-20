// utils/request.js - 网络请求工具类
const { config } = require('../config/api.js')

/**
 * 网络请求封装
 * @param {Object} options 请求参数
 * @param {string} options.url 请求地址
 * @param {string} options.method 请求方法 GET/POST/PUT/DELETE
 * @param {Object} options.data 请求数据
 * @param {Object} options.header 请求头
 * @param {number} options.timeout 超时时间
 */
const request = (options) => {
  return new Promise((resolve, reject) => {
    // 显示加载提示
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    // 获取token
    const token = wx.getStorageSync('token')
    
    // 设置默认请求头
    const header = {
      'Content-Type': 'application/json',
      ...options.header
    }
    
    // 如果有token，添加到请求头
    if (token) {
      header['Authorization'] = `Bearer ${token}`
    }

    wx.request({
      url: config.baseUrl + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: header,
      timeout: options.timeout || config.timeout,
      success: (res) => {
        wx.hideLoading()
        
        // 根据业务需求处理响应
        if (res.statusCode === 200) {
          // 假设后端返回格式为 { code: 0, data: {}, message: '' }
          if (res.data.code === 0) {
            resolve(res.data)
          } else {
            // 业务错误
            wx.showToast({
              title: res.data.message || '请求失败',
              icon: 'none'
            })
            reject(res.data)
          }
        } else if (res.statusCode === 401) {
          // token过期，跳转到登录页
          wx.removeStorageSync('token')
          wx.navigateTo({
            url: '/pages/login/login'
          })
          reject(res)
        } else {
          // 其他HTTP错误
          wx.showToast({
            title: '网络错误',
            icon: 'none'
          })
          reject(res)
        }
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

/**
 * GET请求
 * @param {string} url 请求地址
 * @param {Object} data 请求参数
 * @param {Object} options 其他选项
 */
const get = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'GET',
    data,
    ...options
  })
}

/**
 * POST请求
 * @param {string} url 请求地址
 * @param {Object} data 请求数据
 * @param {Object} options 其他选项
 */
const post = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'POST',
    data,
    ...options
  })
}

/**
 * PUT请求
 * @param {string} url 请求地址
 * @param {Object} data 请求数据
 * @param {Object} options 其他选项
 */
const put = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'PUT',
    data,
    ...options
  })
}

/**
 * DELETE请求
 * @param {string} url 请求地址
 * @param {Object} data 请求参数
 * @param {Object} options 其他选项
 */
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
