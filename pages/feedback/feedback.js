// pages/feedback/feedback.js
Page({
  data: {
    subject: '',
    content: '',
    contact: '',
    showSuccess: false
  },

  onLoad() {
    wx.setNavigationBarTitle({ title: '意见反馈' })
    this.loadDraft()
  },

  // 输入
  onInputSubject(e) {
    this.setData({ subject: e.detail.value })
    this.saveDraft()
  },
  onInputContent(e) {
    this.setData({ content: e.detail.value })
    this.saveDraft()
  },
  onInputContact(e) {
    this.setData({ contact: e.detail.value })
    this.saveDraft()
  },

  // 草稿：防误触丢失
  saveDraft() {
    const draft = {
      subject: this.data.subject,
      content: this.data.content,
      contact: this.data.contact
    }
    wx.setStorageSync('feedback_draft', draft)
  },
  loadDraft() {
    const draft = wx.getStorageSync('feedback_draft')
    if (draft && typeof draft === 'object') {
      this.setData({
        subject: draft.subject || '',
        content: draft.content || '',
        contact: draft.contact || ''
      })
    }
  },

  // 提交
  onSubmit() {
    const { subject, content, contact } = this.data
    if (!subject || !content) {
      wx.showToast({ title: '请填写标题和内容', icon: 'none' })
      return
    }

    // 本地存储模拟提交
    const item = {
      id: Date.now(),
      subject,
      content,
      contact,
      createdAt: new Date().toISOString()
    }
    const list = wx.getStorageSync('feedback_list') || []
    list.unshift(item)
    wx.setStorageSync('feedback_list', list)

    // 清空草稿与表单
    wx.removeStorageSync('feedback_draft')
    this.setData({ subject: '', content: '', contact: '', showSuccess: true })
    wx.showToast({ title: '提交成功', icon: 'success' })

    // 3秒后隐藏成功提示
    setTimeout(() => {
      this.setData({ showSuccess: false })
    }, 3000)
  }
})