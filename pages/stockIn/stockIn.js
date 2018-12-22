var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
                                id:0,
                                comm:{},
                                goods:[],
                                commArray:[],
                                today: "",
                                cost:0.0,
                                ischoose: false,index:0,
  },

  /**
   * 滑动选择器
   */
  bindPickerChange: function (e) {
var that =this
that.setData({
      index: e.detail.value,
      comm: that.data.goods[e.detail.value],
      ischoose: true,
      id:0,
   
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    
    var today =""+ new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate()     
    console.log(today)
             var id = options.id
             if(id==null)  id=0
    that.setData({ id: id,
      today: today  })
                     

    try {  //从本地内存获取
      var value = wx.getStorageSync('goods')

                 if (value.length == 0) {
                                  wx.showModal({
                                    title: '提示',
                                    content: '抱歉，库存为空无法使用进货功能，请先新增商品!',
                                  })

                                  setTimeout(function () {
                                    wx.navigateTo({
                                      url: '/pages/jh/jh'
                                    })
                                  }, 2000)


                                  return;
                                }
                                

      var i
      for (i = 0; i < value.length; i++)
        if (value[i].id == that.data.id) break;

      if (i == value.length){
        var array=[]
        for (var j = 0; j < value.length; j++) {
          array[j] = value[j].commName
        }
            that.setData({   //保存到页面数据
              ischoose: false,
              goods: value,
              commArray:array,
            })

         

      }
      else {
        console.log("从本地内存获取到：")
        var data = value[i]
        console.log(data)

        that.setData({   //保存到页面数据
          comm: data,
          ischoose: true,
        })

        //检验是否有图片
        if (data.pictureUrl == "" || data.pictureUrl == "null") {
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

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },


cost: function(e){

  console.log("cost触发！" + e.detail.value)

var that =this
  that.setData({ cost: e.detail.value *that.data.comm.inprice  })

},

/**
 * -----------------------------------------------------------------------提交表单
 * 
 */
 formSubmit: function (e) {
                var that =this

                if (that.data.cost == 0 || e.detail.value.number == 0 || e.detail.value.number =='输入数量'){
                  wx.showModal({
                    title: '提示',
                    content: '请输入进货数量',
                  })
                  return;
                }


                wx.showModal({
                  title: '提示',
                  content: '确定要花费' + that.data.cost + "购进" + e.detail.value.number + that.data.comm.classifier + that.data.comm.commName,
                  success: function (res) {
                    if (res.confirm) {

                    console.log('form发生了submit事件，携带数据为：', e.detail.value)
var time = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate();
                    console.log(time)
                
                wx.request({
                  url: 'https://worthytom.top:8443/MiniBuy/servlet/inStockServlet',
                  data: {
                      method: "addinStock",
                      'number': e.detail.value.number,
                      inprice: that.data.comm.inprice,
                      commName: that.data.comm.commName,
                      classifier: that.data.comm.classifier,
                      commId: that.data.comm.id,
                      cost: that.data.cost,
                      date: time,   
                      userId: app.globalData.userId
                  },

                  success: function (res) {

                
                        if (res.statusCode == 200) {
                          
                          wx.showToast({
                            title: '进货成功',
                            icon: 'success',
                            duration: 2000
                          })
                          setTimeout( function () {
                          wx.navigateBack({
                            delta: 2//回跳2层
                          })
                          },1500)

                        }
                    else {
                        wx.showModal({
                          title: '提示',
                          content: '商品信息输入有误，请检查后重试！',
                        })
                    }
                    var state = res.state;
                    console.log(res)
                  }
                })

            }}
     })

},
 onPullDownRefresh: function () {
   wx.stopPullDownRefresh()
 },


})