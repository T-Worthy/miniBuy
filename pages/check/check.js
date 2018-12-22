var app = getApp();


Page({
  data: {

                                        ProfitList: [],
                                        profit:0,
                                        getMoney:0,
                                        cost:0,
  },
  onLoad: function () {
                    var that = this;

                    wx.request({
                      url: "https://worthytom.top:8443/MiniBuy/servlet/shoppingServlet",
                      data: {
                        method: "getProfitList",
                        userId: app.globalData.userId,
                      },
                      success: function (res) {

                                console.log("res\n"), console.log(res)           
                                var data = res.data;
                              
                                that.setData({
                                              ProfitList: data.profitList,
                                  })

                                console.log(that.data.ProfitList)

                                var getMoney = 0.0;
                                var cost = 0.0
                                for (var i = 0; i < that.data.ProfitList.length;i++){
                                          getMoney = getMoney + that.data.ProfitList[i].getMoney
                                          cost = cost + that.data.ProfitList[i].cost
                                }

                                that.setData({
                                                getMoney: getMoney,
                                                cost: cost,
                                                profit: getMoney - cost
                                });

                        


                      }
                    })
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
})
