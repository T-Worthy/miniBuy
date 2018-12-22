
Page({

data:{
                                                id:0,
                                                comm:{},
                                                picIsNull:false
},
/**
 * 载入页面
 */
onLoad:function(params){

              var that =this
              var index =params.index
                that.setData({
                           id: params.id,
              })
                console.log("接收到的 id=" + that.data.id)

                          

                                      try {  //从本地内存获取
                                        var value = wx.getStorageSync('goods')
                                        var i
                                        for (i = 0; i < value.length;i++)
                                          if(value[i].id==that.data.id) break;


                                        if (value) {
                                          console.log("从本地内存获取到：")                                      
                                          var data = value[i]
                                          console.log(data)
                                          
                                          that.setData({   //保存到页面数据
                                                            comm: data,
                                          })

                                          //检验是否有图片
                                          if (data.pictureUrl == "" ||data.pictureUrl == "null") {
                                                  console.log("图片不存在")

                                                                   that.setData({    //是否显示图片
                                                                                  picIsNull: true,
                                                                      }); 
                                                  };
                                        }
                                      } catch (e) {
                                        console.log("从本地内存获取失败！")
                                        console.log(e)
                }



                          // wx.request({//通过id查询商品
                          //         url: "https://worthytom.top:8443/MiniBuy/servlet/AServlet2",
                          //         data: {
                          //           method: "findById",
                          //           id: that.data.id,
                          //         },
                          //         header: {
                          //           'content-type': 'application/json'
                          //         },
                          //         success: function (res) {
                          //                         console.log(res);
                          //                         console.log(res.data);
                          //                         var data = res.data;
                          //                         if (res.data.pictureUrl == "" || res.data.pictureUrl=="null") { 
                          //                           console.log("图片不存在")

                          //                                           that.setData({    //是否显示图片
                          //                                                     picIsNull: true,
                          //                                               }); 
                          //                          };
                          //                                           that.setData({
                          //                                                         comm: data,
                          //                                           });
                          //         }
                          // })
},
/**
 * delete
 */
delete :function(){

    var that =this
    wx.showModal({
      title: '提示',
      content: '确定要删除' + that.data.comm.commName+"的所有信息吗？",
      success: function (res) {
        if (res.confirm) {
                                  wx.request({
                                    url: "https://worthytom.top:8443/MiniBuy/servlet/AServlet2",
                                    data: {
                                          method: "deleteById",
                                          id: that.data.id,
                                    },
                                    header: {
                                      'content-type': 'application/json'
                                    },
                                    success: function (res) {
                                      console.log(res);

                                      wx.showToast({
                                              title: '删除成功',
                                              icon: 'success',
                                              duration: 1000, 
                                      })

                                      wx.redirectTo({
                                        url: '../stock/stock'
                                      })

                                    }
                                  })



        } else if (res.cancel) {
          console.log('取消删除')
        }
      }
    })

  },

onPullDownRefresh: function () {
  wx.stopPullDownRefresh()
},

})