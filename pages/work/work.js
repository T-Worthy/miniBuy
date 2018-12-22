var app = getApp();

Page({

  data: {
    dailyDaily:[],
    goods:[],
  },
/**
 * 跳到销售界面
 */
  changeshopping:function() {

    if(this.data.goods.length==0){
                wx.showModal({
                  title: '提示',
                  content: '抱歉，库存为空无法使用销售功能，请先新增商品!',
                })

                setTimeout(function () {
                  wx.navigateTo({
                    url: '/pages/jh/jh'
                  })
                }, 2000)


                return;
    }
    wx.switchTab({
      url: "../shopping/shopping"
    });
  },
  onShow: function () {
    var that = this;
                          wx.request({
                            url: "https://worthytom.top:8443/MiniBuy/servlet/AServlet2",
                            data: {
                              method: "findByUserId",
                              userId: app.globalData.userId,
                            },
                            header: {
                              'content-type': 'application/json'
                            },
                            success: function (res) {
                              console.log(res);
                              console.log(res.data);
                              var data = res.data;
                              var allmoney = 0;
                              that.setData({
                                goods: data.dataArray,
                              })

                              //--------------------------保存到本地内存{
                              try {
                                //将 data 存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个同步接口。
                                wx.setStorageSync('goods', that.data.goods)
                                console.log("已保存到本地内存！")
                              } catch (e) {
                                console.log("保存到本地内存失败！")
                                console.log(e)
                              }
                              //--------------------------保存到本地内存}

                        
                            }
                          })
//--------------------------------------------------------请求2
 var time = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate();
                          console.log(time)
                          wx.request({
                            url: "https://worthytom.top:8443/MiniBuy/servlet/shoppingServlet",
                            data: {
                              method: "getDailyData",
                              userId: app.globalData.userId,
                              date:time,
                            },
                            header: {
                              'content-type': 'application/json'
                            },
                            success: function (res) {
                              console.log(res);
                              console.log(res.data);
                              var data = res.data;
                              var allmoney = 0;
                              that.setData({
                                dailyDaily:data
                              })

                         

                     

                            }
                          })         

    wx.hideLoading()
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

})