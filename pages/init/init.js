const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
                                    openId:"",
                                    mess:"欢迎使用Mini零售",
                                    speedArray:[2,3,4],
                                    src:"",
                                    temp: "几",
                                    check:true,
  },
  /**
   * 是否选中已阅读
   */
  checkboxChange: function (e) {
                                var that = this

                              if(that.data.check==true){
                                                          that.setData({
                                                                        check:false
                                                          })
                              }
                            else{ 
                                                          that.setData({
                                                            check:true
                                                          })
                              }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
                                var that=this

                                setTimeout(function () { that.setData({ mess: "初次见面，我需要对您有些了解" }); }, 2000)
                                setTimeout(function () { that.setData({ mess: "请完成以下表格" }); }, 4000)

                                that.setData({ openId: app.globalData.openId})
                                console.log("!!"+that.data.openId)

  },

  /**
   * 上传注册信息
   */
  formSubmit: function(e) {
                    var that=this
                    var openId = app.globalData.openId

                    console.log("temp="+this.data.temp),
                    console.log('form发生了submit事件，携带数据为：', e.detail.value)
                    if(this.data.temp=="几"){

                                    wx.showModal({
                                      title: '提示',
                                      content: '请输入语音信息',
                                    })
                         return
                    }
                    console.log("return 1")
                    if (e.detail.value.shopName == "" || e.detail.value.tel == "" || e.detail.value.address == "" ){
                            wx.showModal({
                              title: '提示',
                              content: '商品信息不完整或有误，请检查后重试！',
                            })
                            return 
                    }
                    console.log("return 2")


                    wx.request({//保存注册信息
                      data: {
                          wxId: openId,
                          data: e.detail.value,
                          shopName: e.detail.value.shopName,
                          tel: e.detail.value.tel,
                          address: e.detail.value.address,
                          speakSpeed: that.data.temp
                      },
                      url: 'https://worthytom.top:8443/MiniBuy/servlet/registerServlet',
                      success: function (res) {//保存成功后：：

                        var state = res.state;
                        console.log(res)

                        if(res.statusCode==200){   

                                      wx.request({  // 发送 openId 到后台换取 openId, isOld, userId,speakSpeed,shopName
                                        url: 'https://worthytom.top:8443/MiniBuy/servlet/isOldServlet',
                                        data: {
                                          openId: openId
                                        },
                                        header: {
                                          'content-type': 'application/json' // 默认值
                                        },
                                        success: function (res) {
                                            app.globalData.isOld = res.data.isOld,  //获取到了isOld!
                                            app.globalData.shopName = res.data.shopName,  //获取到了shopName!
                                            app.globalData.userId = res.data.userId,  //获取到了userId!
                                            app.globalData.speakSpeed = res.data.speakSpeed,  //获取到了speakSpeed!
                                            console.log(res)
                                        }
                                      })
                                    

                                      wx.switchTab({
                                        url: "../work/work"
                                      });

                                      wx.showToast({
                                              title: '注册成功',
                                              icon: 'success',
                                              duration: 2000
                                      })

                        }
                        else {
                                    wx.showModal({
                                      title: '提示',
                                      content: '注册异常，请稍后重试！',      
                                    })
                                    console.log("注册失败！！")
                              }
                        
                      }
                    })

  },
/**
 * 语速测试
 */
  bindPickerChange :function(e){

    this.setData({ src: "pages/luyin/" + this.data.speedArray[e.detail.value]+"秒钟.mp3"
                     ,  temp: this.data.speedArray[e.detail.value]})
    console.log(this.data.src)
    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.src = this.data.src; // 这里可以是录音的临时路径
    this.innerAudioContext.play()

  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

})