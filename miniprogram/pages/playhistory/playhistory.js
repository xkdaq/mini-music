// miniprogram/pages/playhistory/playhistory.js
const app = getApp()
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

    //获取用户openid
    const openid = app.globalData.openid
    //获取历史播放 判断当前歌曲是否在历史列表数据里
    const history = wx.getStorageSync(openid)

    if (history.length == 0) {
      wx.showModal({
        title: '提示',
        content: '暂无历史记录',
      })
    } else {
      this.setData({
        musiclist: history
      })
    }
  }
  
})