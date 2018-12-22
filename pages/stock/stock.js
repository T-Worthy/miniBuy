var app = getApp();
Page({
        data:{
          classifyArray:[],
          allmoney:0,
          goods:[],
          navclass:"nav-classify",
          curNav: 1,
          curIndex: 0,
          commList:[],
        },

        switchRightTab: function (e) {
          
          var that = this
          var id = e.currentTarget.id
          
    

          // 把点击到的某一项，设为当前index  
          this.setData({
            curIndex: id,
            commList: that.data.classifyArray[id].commList
          })

        
        },

        onLoad: function () {
                            var that = this;
                            wx.request({
                              url: "https://worthytom.top:8443/MiniBuy/servlet/classifyServlet",
                              data: {
                                method:"getJson",
                                userId: app.globalData.userId,
                              },
                              header: {
                                'content-type': 'application/json'
                              },
                              success: function (res) {

                                console.log(res)

                                if (res.data == "" || res.data == 'null' || res.data == ' ' || res.data.classifyArray.length == 0) {
                                  wx.showModal({
                                    title: '提示',
                                    content: '抱歉，暂无库存信息，请先新增商品!',
                                  })


                                  setTimeout(function () {
                                    wx.redirectTo({
                                      url: '/pages/jh/jh'
                                    })
                                  }, 2000)
                                  return;
                                }    
                                            console.log(res);
                                            console.log(res.data);
                                            console.log(res.data.classifyArray);
                                            var data = res.data;
                                            
                                            that.setData({
                                              classifyArray: data.classifyArray,
                                                commList:   data.classifyArray[0].commList
                                            })

                                            

                                          
                                              
                                                  
                                          }
                            })
        },
      /**
       * 跳到进货列表
       */
        changepage1:function(){     
                                wx.navigateTo({
                                  url: '/pages/bill/bill',
                                })
        },
        /**
       * 跳到进货页面
       */
        changepage2: function () {
                              wx.navigateTo({
                                url: '/pages/jh/jh',
                              })
        },

        /**
        * 下拉刷新
        */
        onPullDownRefresh: function () {
                        wx.showNavigationBarLoading() //在标题栏中显示加载
                      
                        setTimeout(function () { //模拟加载
                          wx.hideNavigationBarLoading() //完成停止加载
                          wx.stopPullDownRefresh() //停止下拉刷新
                        }, 1500);
        },
        onPullDownRefresh: function () {
          wx.stopPullDownRefresh()
        },

});

