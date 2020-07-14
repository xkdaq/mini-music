// miniprogram/pages/playlove/playlove.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musiclist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    const love = wx.getStorageSync('islove')

    if (love.length == 0) {
      wx.showModal({
        title: '提示',
        content: '暂无收藏记录',
      })
    } else {
      this.setData({
        musiclist: love
      })
    }
  },

})