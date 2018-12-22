var app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    classifyArray:[],
    hideInput:true,
    Button:'新建类别'
  },


back :function(e){

  var that = this
  console.log(e.currentTarget)
  var index = e.currentTarget.id
 


  //--------------------------保存到本地内存{
  app.globalData.classify = { 'id': that.data.classifyArray[index].id, 'name': that.data.classifyArray[index].classify }
  //--------------------------保存到本地内存}

  wx.navigateBack({
    delta: 1
  })



},
  /**新建类别 */
  newClassify: function(){
              var that =this

              that.setData({ hideInput: !that.data.hideInput
                          })

              console.log(classify.value)

            },
  formSubmit: function (e) {

    var that = this
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    if (e.detail.value.classify == "" || e.detail.value.classify == "请输入新建分类名") {
              wx.showModal({
                title: '提示',
                content: '请输入正确的分类名称！',
              })
    }

    else {
                wx.request({
                  url: 'https://worthytom.top:8443/MiniBuy/servlet/classifyServlet',
                  data: {
                    method: "addClassify",
                  
                    classify: e.detail.value.classify,
                    userId: app.globalData.userId,
                  
                  },

                  success: function (res) {//

                    if (res.statusCode == 200) {//上传成功
                      wx.showToast({
                        title: '保存成功',
                        icon: 'success',
                        duration: 2000
                      })
                      wx.redirectTo({
                        url: '/pages/classify/classify'
                      })
                    }
                    else {   //上传失败
                      wx.showModal({
                        title: '提示',
                        content: '商品信息输入有误，请检查后重试！',
                      })

                    }
                    var state = res.state;
                    console.log("进货结果：：")
                    console.log(res)
                  }
                })
    }
  },
  /**
   * delete
   */
  delete: function (e) {

    var that = this
    console.log(e.currentTarget.id)
    var id = e.currentTarget.id

    wx.showModal({
      title: '提示',
      content: '确定删除？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: "https://worthytom.top:8443/MiniBuy/servlet/classifyServlet",
            data: {
              method: "deleteById",
              id: id,
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
                url: '/pages/classify/classify'
              })

            }
          })



        } else if (res.cancel) {
          console.log('取消删除')
        }
      }
    })

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
          var that = this
          wx.request({
            url: 'https://worthytom.top:8443/MiniBuy/servlet/classifyServlet', //仅为示例，并非真实的接口地址
            data: {
              method: 'findByUserId',
              userId: app.globalData.userId
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              console.log(res.data)
              that.setData({
                classifyArray: res.data.classifyArray
              })
            }
          })
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
})