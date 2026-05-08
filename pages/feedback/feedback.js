// pages/feedback/feedback.js
const { userApi } = require('../../services/api.js')
const { isLoggedIn } = require('../../utils/auth.js')

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

  async onSubmit() {
    if (!isLoggedIn()) {
      wx.navigateTo({
        url: '/pages/auth/auth'
      })
      return
    }

    const { subject, content, contact } = this.data
    if (!subject || !content) {
      wx.showToast({ title: '请填写标题和内容', icon: 'none' })
      return
    }

    try {
      await userApi.submitFeedback({
        title: subject,
        content,
        contact
      })

      wx.removeStorageSync('feedback_draft')
      this.setData({ subject: '', content: '', contact: '', showSuccess: true })
      wx.showToast({ title: '提交成功', icon: 'success' })

      setTimeout(() => {
        this.setData({ showSuccess: false })
      }, 3000)
    } catch (error) {
      wx.showToast({ title: '提交失败', icon: 'none' })
    }
  }
})
