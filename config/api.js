// config/api.js - 接口配置文件

// 开发环境配置
const devConfig = {
  baseUrl: 'http://127.0.0.1:8080',
  timeout: 10000,
  // 开发环境接口
  apis: {
    home: {
      index: '/api/home'
    },
    // 用户相关接口
    user: {
      login: '/api/user/login',
      logout: '/api/user/logout',
      getUserInfo: '/api/user/profile',
      updateUserInfo: '/api/user/profile',
      favoriteList: '/api/user/favorites',
      addFavorite: '/api/user/favorites',
      removeFavorite: '/api/user/favorites',
      favoriteCount: '/api/user/favorites/count',
      browseHistoryList: '/api/user/browse-histories',
      recordBrowseHistory: '/api/user/browse-histories',
      removeBrowseHistory: '/api/user/browse-histories',
      clearBrowseHistory: '/api/user/browse-histories',
      feedback: '/api/user/feedback'
    },
    // 菜谱相关接口
    recipe: {
      list: '/api/recipes',
      detail: '/api/recipes',
      create: '/api/recipes',
      update: '/api/recipes',
      delete: '/api/recipes'
    },
    // 分类相关接口
    category: {
      list: '/api/categories',
      create: '/api/categories'
    }
  }
}

// 生产环境配置
const prodConfig = {
  baseUrl: 'http://106.53.112.100',
  timeout: 10000,
  // 生产环境接口
  apis: {
    home: {
      index: '/api/home'
    },
    user: {
      login: '/api/user/login',
      logout: '/api/user/logout',
      getUserInfo: '/api/user/profile',
      updateUserInfo: '/api/user/profile',
      favoriteList: '/api/user/favorites',
      addFavorite: '/api/user/favorites',
      removeFavorite: '/api/user/favorites',
      favoriteCount: '/api/user/favorites/count',
      browseHistoryList: '/api/user/browse-histories',
      recordBrowseHistory: '/api/user/browse-histories',
      removeBrowseHistory: '/api/user/browse-histories',
      clearBrowseHistory: '/api/user/browse-histories',
      feedback: '/api/user/feedback'
    },
    recipe: {
      list: '/api/recipes',
      detail: '/api/recipes',
      create: '/api/recipes',
      update: '/api/recipes',
      delete: '/api/recipes'
    },
    category: {
      list: '/api/categories',
      create: '/api/categories'
    }
  }
}

// 测试环境配置
const testConfig = {
  baseUrl: 'http://106.53.112.100',
  timeout: 10000,
  apis: {
    home: {
      index: '/api/home'
    },
    user: {
      login: '/api/user/login',
      logout: '/api/user/logout',
      getUserInfo: '/api/user/profile',
      updateUserInfo: '/api/user/profile',
      favoriteList: '/api/user/favorites',
      addFavorite: '/api/user/favorites',
      removeFavorite: '/api/user/favorites',
      favoriteCount: '/api/user/favorites/count',
      browseHistoryList: '/api/user/browse-histories',
      recordBrowseHistory: '/api/user/browse-histories',
      removeBrowseHistory: '/api/user/browse-histories',
      clearBrowseHistory: '/api/user/browse-histories',
      feedback: '/api/user/feedback'
    },
    recipe: {
      list: '/api/recipes',
      detail: '/api/recipes',
      create: '/api/recipes',
      update: '/api/recipes',
      delete: '/api/recipes'
    },
    category: {
      list: '/api/categories',
      create: '/api/categories'
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
