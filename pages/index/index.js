//index.js
//获取应用实例
const app = getApp()

Page({
  data: { 
                                 userInfo: {},
  },

/**
 * 载入获取用户信息
 */
  onLoad: function () {
              wx.getUserInfo({
                success: res => {
                          app.globalData.userInfo = res.userInfo
                          console.log("!!!")
                          console.log(res)

                          this.setData({
                                        userInfo: res.userInfo,
                                        hasUserInfo: true
                          })
                },
            fail: res => { console.log(res)}

              })
        
          console.log(app.globalData.userInfo)





          
  },

  /**
   * 获取用户信息
   */
  getUserInfo: function (e) {
    
                console.log("获取用户信息")
                console.log(e)

                app.globalData.userInfo = e.detail.userInfo

                this.setData({
                              userInfo: e.detail.userInfo,
                              hasUserInfo: true
                })
  },
 
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
})
