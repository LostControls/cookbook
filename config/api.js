// config/api.js - 接口配置文件

// 开发环境配置
const devConfig = {
  baseUrl: 'http://cookbook.com',
  timeout: 10000,
  // 开发环境接口
  apis: {
    // 用户相关接口
    user: {
      login: '/user/login',
      getUserInfo: '/user/info',
      updateUserInfo: '/user/update'
    },
    // 菜谱相关接口
    recipe: {
      list: '/recipe/list',
      detail: '/recipe/detail',
      create: '/recipe/create',
      update: '/recipe/update',
      delete: '/recipe/delete'
    },
    // 分类相关接口
    category: {
      list: '/category/list',
      create: '/category/create'
    }
  }
}

// 生产环境配置
const prodConfig = {
  baseUrl: 'https://api.example.com',
  timeout: 10000,
  // 生产环境接口
  apis: {
    user: {
      login: '/user/login',
      getUserInfo: '/user/info',
      updateUserInfo: '/user/update'
    },
    recipe: {
      list: '/recipe/list',
      detail: '/recipe/detail',
      create: '/recipe/create',
      update: '/recipe/update',
      delete: '/recipe/delete'
    },
    category: {
      list: '/category/list',
      create: '/category/create'
    }
  }
}

// 测试环境配置
const testConfig = {
  baseUrl: 'https://test-api.example.com',
  timeout: 10000,
  apis: {
    user: {
      login: '/user/login',
      getUserInfo: '/user/info',
      updateUserInfo: '/user/update'
    },
    recipe: {
      list: '/recipe/list',
      detail: '/recipe/detail',
      create: '/recipe/create',
      update: '/recipe/update',
      delete: '/recipe/delete'
    },
    category: {
      list: '/category/list',
      create: '/category/create'
    }
  }
}

// 根据环境选择配置
const getConfig = () => {
  // 可以通过多种方式判断环境
  // 1. 通过编译条件判断
  // #ifdef MP-WEIXIN
  //   return prodConfig
  // #endif
  
  // 2. 通过全局变量判断
  if (typeof __wxConfig !== 'undefined' && __wxConfig.debug) {
    return devConfig
  }
  
  // 3. 通过自定义环境变量判断
  const env = wx.getStorageSync('env') || 'dev'
  switch (env) {
    case 'dev':
      return devConfig
    case 'test':
      return testConfig
    case 'prod':
    default:
      return prodConfig
  }
}

// 导出当前环境的配置
const config = getConfig()

module.exports = {
  config,
  // 也可以导出所有配置供调试使用
  devConfig,
  testConfig,
  prodConfig
}
