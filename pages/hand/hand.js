var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
                                          buynumber: 0,
                                          money: 0,
                                          goods: [],
                                          shoppingList: [], shoppingListLength: 0,
                                          dec_class: "button-decrease",
  },
/**
 * 回到语音界面
*/
  changeback: function (){
                              wx.switchTab({
                                url: "../shopping/shopping"
                              });
  },
/**
 * 每次显示载入刷新
 * */
  onShow: function () {
                          var that = this;

                          try {  //从本地内存获取
                            var value = wx.getStorageSync('goods')
                                    if (value) {
                                            console.log("从本地内存获取到：")
                                            console.log(value)
                                            that.setData({   //保存到页面数据
                                            goods: value
                                      })
                                    }
                          } catch (e) {
                            console.log("从本地内存获取失败！")
                            console.log(e)
                          }
  },

/**
 * 选择
 */
select : function(e){//选择了某件商品
                                var that = this
                                console.log(e.currentTarget.id)
                                var selectId = e.currentTarget.id
                                var comm = that.data.goods[selectId];
                                var time = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate(); //当前时间   
                                  
                            var shop={ commName:comm.commName,inprice : comm.inprice,outprice: comm.outprice,pictureUrl:comm.pictureUrl,classifier:comm.classifier ,number:1 ,commId:comm.id,date:time,profit:comm.profit }

                                console.log(comm)
                                var length = that.data.shoppingListLength+1;
                                var key = "shoppingList[" +(length-1)+"]";

                                that.setData({
                                                [key]: shop,
                                                shoppingListLength: length,
                                                money: that.data.money+comm.outprice,
                                                buynumber: that.data.buynumber+1,
                                  })

  },


  /**
   * 加按钮
   */
  add: function (e) {
                      var that = this
                      console.log(e.currentTarget.id)
                      var id = e.currentTarget.id
                      var key = "shoppingList[" + id + "].number";
                      var num = that.data.shoppingList[id].number;
                      var money = that.data.shoppingList[id].outprice;

                      that.setData({
                                     [key]: num + 1,
                                      buynumber: that.data.buynumber + 1,
                                      money: that.data.money + money,
                      })
  },
  /**
   * 减按钮
   */
  dec: function (e) {
                        var that = this

                        console.log(e.currentTarget.id)
                        var id = e.currentTarget.id
                        var key = "shoppingList[" + id + "].number";
                        var num = that.data.shoppingList[id].number;
                        var money = that.data.shoppingList[id].outprice;

                        if (num == 1) {//数量只剩1，减后变0，改变样式
                                  that.setData({
                                                  [key]: num - 1,
                                                  dec_class: "button-decrease",
                                                  buynumber: that.data.buynumber - 1,
                                                  money: that.data.money - money,
                                  })
                        }
                        else if (num != 0) {//非0，数量减一，改变数量与合计
                                  that.setData({
                                                  [key]: num - 1,
                                                  dec_class: "button-add",
                                                  buynumber: that.data.buynumber - 1,
                                                  money: that.data.money - money,
                                  })
                        }
  } ,

  /**
  * s长安删除
 */
  clearOne: function (e) {
                              var that = this
                              console.log(e.currentTarget.id)
                              var clearId = e.currentTarget.id

                              wx.showModal({
                                              title: '提示',
                                              content: '确定删除该条记录？',
                                              success: function (res) {
                                                      if (res.confirm) {  //确认删除
                                                        //准备数据
                                                        var clearone = that.data.shoppingList[clearId]
                                                        var shoppingList = that.data.shoppingList
                                                        var array = new Array([that.data.shoppingListLength - 1]);
                                                        var thisMoney = clearone.outprice * clearone.number

                                                        //重新构建数组
                                                        for (var i = 0; i + 1 < that.data.shoppingListLength; i++)
                                                          if (i < clearId) array[i] = shoppingList[i]
                                                          else array[i] = shoppingList[i + 1]

                                                        //保存数据
                                                        that.setData({
                                                                  shoppingList: array,
                                                                  shoppingListLength: that.data.shoppingListLength - 1,
                                                                  buynumber: that.data.buynumber - clearone.number,
                                                                  money: that.data.money - thisMoney,
                                                        })

                                                        //消息提示
                                                        wx.showToast({
                                                                        title: '删除成功',
                                                                        icon: 'success',
                                                                        duration: 2000
                                                        })



                                                      } else if (res.cancel) {

                                                      }
                                          }
                              })

  },

  /**
   * 购买 结算
   */
  buy: function () {
                    var that = this
                    wx.showModal({
                                  title: '提示',
                                  content: '确认已收款' + that.data.money + '元？',
                                  success: function (res) {
                                    if (res.confirm) {  //已结清

                                         wx.request({

                                                  url: 'https://worthytom.top:8443/MiniBuy/servlet/shoppingServlet',
                                                  data: {
                                                          method: "addshopping",
                                                          shoppingList: that.data.shoppingList,
                                                          userId: app.globalData.userId
                                                  },

                                                  success: function (res) {
                                                              if (res.statusCode == 200) {

                                                                                    wx.showToast({
                                                                                            title: '结算成功',
                                                                                            icon: 'success',
                                                                                            duration: 2000
                                                                                    })

                                                                                    that.setData({
                                                                                            shoppingList: [],  //清空
                                                                                            shoppingListLength: 0,
                                                                                            buynumber: 0,
                                                                                            money: 0,
                                                                                    })
                                                              }
                                                              else {
                                                                      wx.showModal({
                                                                                title: '提示',
                                                                                content: '功能异常，请检查后重试！',
                                                                      })

                                                              }
                                                              var state = res.state;
                                                              console.log(res)
                                                  }
                                         })
                                    } else if (res.cancel) {

                                    }
                                  }
                    })

  },


  /**
    * 清空
   */
  clear: function () {
                var that = this

                that.setData({
                        shoppingList: [],  //清空
                        shoppingListLength: 0,
                        money:0,
                        buynumber:0
                })
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
 
})

/**
 * 外部函数
 * 删除一项
 */
function clear_this(clearId, that) {
                  var clearone = that.data.shoppingList[clearId]
                  var shoppingList = that.data.shoppingList
                  var array = new Array([that.data.shoppingListLength - 1]);
                  var thisMoney= clearone.outprice * clearone.number;
                 
                  //重新构建数组
                  for (var i = 0; i + 1 < that.data.shoppingListLength; i++)
                    if (i < clearId) array[i] = shoppingList[i]
                    else array[i] = shoppingList[i + 1]

                  //保存数据
                  that.setData({
                            shoppingList: array,
                            shoppingListLength: that.data.shoppingListLength - 1,
                            buynumber: that.data.buynumber - clearone.number,
                            money: that.data.money - thisMoney,
                            errId: -1,
                  })


}
