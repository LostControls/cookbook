// pages/category/category.js
Page({
  data: {
    categories: [
      {
        id: 1,
        name: '川菜',
        icon: '🌶️',
        count: 128,
        color: '#ff6b6b'
      },
      {
        id: 2,
        name: '粤菜',
        icon: '🦐',
        count: 95,
        color: '#4ecdc4'
      },
      {
        id: 3,
        name: '湘菜',
        icon: '🌶️',
        count: 87,
        color: '#45b7d1'
      },
      {
        id: 4,
        name: '鲁菜',
        icon: '🥟',
        count: 76,
        color: '#f9ca24'
      },
      {
        id: 5,
        name: '苏菜',
        icon: '🦀',
        count: 65,
        color: '#6c5ce7'
      },
      {
        id: 6,
        name: '浙菜',
        icon: '🐟',
        count: 58,
        color: '#a29bfe'
      },
      {
        id: 7,
        name: '闽菜',
        icon: '🍲',
        count: 42,
        color: '#fd79a8'
      },
      {
        id: 8,
        name: '徽菜',
        icon: '🥘',
        count: 38,
        color: '#fdcb6e'
      }
    ],
    searchValue: ''
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: '分类'
    })
    console.log('分类页面加载')
  },

  onShow() {
    wx.setNavigationBarTitle({
      title: '分类'
    })
  },

  // 搜索分类
  onSearchInput(e) {
    this.setData({
      searchValue: e.detail.value
    })
  },

  // 点击分类
  onCategoryTap(e) {
    const categoryId = e.currentTarget.dataset.id
    const categoryName = e.currentTarget.dataset.name
    
    wx.navigateTo({
      url: `/pages/recipe-list/recipe-list?categoryId=${categoryId}&categoryName=${categoryName}`
    })
  },

  // 搜索
  onSearch() {
    if (!this.data.searchValue.trim()) {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none'
      })
      return
    }
    
    wx.navigateTo({
      url: `/pages/search/search?keyword=${this.data.searchValue}`
    })
  }
})
