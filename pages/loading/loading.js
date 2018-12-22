const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
                                isOld:false,
                                userId: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {

                  wx.showLoading({
                    title: '加载中',
                  })
 
                  var that=this
                  setTimeout(function () {  
                                  that.setData({
                                          isOld: app.globalData.isOld,
                                          userId: app.globalData.userId,
                                  })
                    console.log("OLD?" + that.data.isOld)  
                    wx.hideLoading()

                  }, 2000)                  //!!!!等待app.js加载完成*******

  },



  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
                                  wx.showLoading({
                                    title: '刷新中',
                                  })

                                  var that = this
                                  setTimeout(function () {
                                                  that.setData({
                                                          isOld: app.globalData.isOld,
                                                          userId: app.globalData.userId,
                                                  })
                                    console.log("OLD?" + that.data.isOld)
                                    wx.hideLoading()

                                  }, 300)                  //!!!!等待app.js加载完成*******

                                  setTimeout(function () {
                                    wx.stopPullDownRefresh()
                                    }, 500)
  },


  /**
   * 进入主界面
   */
  goShopping :function(){
                            
                                wx.switchTab({
                                  url: "../work/work"
                                });
                             
  },
  /**
   * 进入注册界面
   */
  goInit: function () {
                                  wx.navigateTo({
                                    url: '/pages/init/init',
                                  })
  },
})