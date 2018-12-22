var app = getApp();


Page({//订单详情--销售记录
  data: {
          inStockList: [],
          dateCost: [],
  },
  onLoad: function () {
            var that = this;

            wx.request({
              url: "https://worthytom.top:8443/MiniBuy/servlet/shoppingServlet",
              data: {
                method: "getJson",
                userId: app.globalData.userId,

              },
              success: function (res) {

                console.log("res\n"), console.log(res)

                if (res.data == "" || res.data == 'null' || res.data == ' ' || res.data.inStockList.length == 0) {
                  wx.showModal({
                    title: '提示',
                    content: '抱歉，暂无销售信息。',
                  })

                  setTimeout(function () {
                    wx.navigateBack({
                      delta: 1
                    })
                  }, 2000)
              
                  return;
                }

                console.log("res.data.inStockList[0].array::\n"), console.log(res.data.inStockList[0].array)
          
                var data = res.data;

                    that.setData({
                            inStockList: data.inStockList
                    });

                      //计算每日营业额
                          for (var i = 0; i < data.inStockList.length; i++) {
                                  var dateCost = 0;
                                  var key = 'dateCost[' + i + ']';
                                  
                                  for (var j = 0; j < res.data.inStockList[i].array.length; j++)
                                                  dateCost = dateCost + res.data.inStockList[i].array[j].getMoney

                                      that.setData({
                                                  [key]: dateCost,//日营业额
                                      });
                            }

              }
            })
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
})