var app = getApp();


Page({
    data: {
                                            inStockList:  [] ,
                                            dateCost:[],
    },
    /**
     * 
     * 获取数据--inStockList
     */
    onLoad: function () {
                var that = this;

                wx.request({
                  url: "https://worthytom.top:8443/MiniBuy/servlet/inStockServlet",
                  data: {
                  method:"getJson", 
                  userId: app.globalData.userId,

                  },
                  success: function (res) {
                    console.log("res\n") 
                    console.log(res)

                    if (res.data == "" || res.data == 'null' || res.data == ' ' || res.data.inStockList.length==0)   {
                            wx.showModal({
                              title: '提示',
                              content: '抱歉，暂无进货信息。',
                            })

                            setTimeout(function () {
                              wx.navigateBack({
                                delta: 1
                              })
                            }, 2000)
                 

                          return;
                     }

                   var data = res.data;
                              that.setData({
                                             inStockList: data.inStockList
                              });


                    for (var i = 0; i < data.inStockList.length;i++){  
                                  var dateCost=0;
                                  var key ='dateCost['+i+ ']';  

                                  for (var j = 0; j < res.data.inStockList[i].array.length; j++)
                                                   dateCost = dateCost + res.data.inStockList[i].array[j].cost 
                                        
                                                        that.setData({
                                                          [key]:  dateCost,
                                                        });

                             }

                       }
             })
   },

    onPullDownRefresh: function () {
      wx.stopPullDownRefresh()
    }
})