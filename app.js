//app.js
App({

  globalData: {
    userInfo: {},
   shopName:null,
    speakSpeed: 1,
    openId: null,
    isOld:false,
    userId:null,
    classify:{'id':0,'name':'未分类'}
  },
  onLaunch: function () {
   
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

//######################################################################### 登录
    wx.login({
      
      success: res => {
        console.log("login success!!!")
        var that = this
        var cod = res.code  
        console.log(res.code )
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: 'https://worthytom.top:8443/MiniBuy/servlet/userServlet', //
          data: {
            code: cod
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            that.globalData.openId = res.data.openid  //获取到了openid!
            
            //*********************************** */*
            // 发送 openId 到后台换取 openId, isOld, userId,speakSpeed,shopName
            wx.request({
              url: 'https://worthytom.top:8443/MiniBuy/servlet/BServlet',
              data: {
                method:"findUser",
                openId: that.globalData.openId
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
                that.globalData.isOld = res.data.isOld,  //获取到了isOld!
                that.globalData.shopName = res.data.shopName,  //获取到了shopName!
                that.globalData.userId = res.data.userId,  //获取到了userId!
                that.globalData.speakSpeed = res.data.speakSpeed,  //获取到了speakSpeed!
                console.log(res)

              }
            })
            //************************************** */
            console.log(res)
            //console.log("that.globalData.openIdopenId="+that.globalData.openId)
          } 
        })
  //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
       
      },
      fail: function (res){
        console.log("获取code失败")
        console.log(res)
      }


    })
    //#######################################################################
    

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
 
})