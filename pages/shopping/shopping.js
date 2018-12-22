var app = getApp();
var UTIL = require('../../utils/util.js');
const appkey = require('../../config').appkey
const appsecret = require('../../config').appsecret

Page({
  data: {
                                            
                                            buynumber: 0,
                                            money: 0,
                                            isRecord: false,
                                            ishide: false,
                                            errId:-1,
                                            dec_class:"button-decrease",
                                            recordPath: "", 
                                            shoppingList: [],                shoppingListLength:0,
                                            userId: 0,
                                            speakSpeed: 0,
  },
  /*
  *初始化载入
  */
  onLoad: function (options) {

    var value = wx.getStorageSync('goods')  //例行验证，库存是否为空

                            if (value.length == 0) {
                              wx.showModal({
                                title: '提示',
                                content: '抱歉，库存为空无法使用进货功能，请先新增商品！',
                              })

                              setTimeout(function () {
                                wx.switchTab({
                                  url: "../work/work"
                                })
                              }, 2000)

                              setTimeout(function () {
                                wx.redirectTo({
                                  url: '/pages/jh/jh'
                                })
                              },3000)

                              return;
                            }

              var that = this

              wx.showModal({
                            title: '使用说明',
                            content: '点击录音图标，会听到提示音，根据提示说出要录入的内容，内容格式为（“数字”+“量词”+“商品名称”）或为（“商品名称”+“数字”+“量词”）并在听到“请继续”提示音后开始下一条输入，再次点击则停止输入。输入内容必须存在于库存当中,否则将提至无法识别，长按识别出的内容进行删除',
              })

                that.setData({
                                userId: app.globalData.userId,
                                speakSpeed: app.globalData.speakSpeed,
                })
  },

/**
 * 加
 * 
 */

add :function(e){
              var that =this
              console.log(e.currentTarget.id)
              var id = e.currentTarget.id
              var key ="shoppingList["+id+"].number";
              var num = that.data.shoppingList[id].number;
              var money = that.data.shoppingList[id].outprice;
              that.setData({[key]:num+1,
                            buynumber: that.data.buynumber + 1,
                            money: that.data.money + money,})
},
/**
 * 减
 */
dec: function (e) {
            var that = this
            
            console.log(e.currentTarget.id)
            var id = e.currentTarget.id
            var key = "shoppingList[" + id + "].number";
            var num = that.data.shoppingList[id].number;
            var money = that.data.shoppingList[id].outprice;
          
            if (num == 1) {
                        that.setData({
                        [key]: num - 1,
                        dec_class: "button-decrease",
                        buynumber : that.data.buynumber-1,
                        money: that.data.money-money,
                        })
                  }
            else    if (num!=0) {
                        that.setData({
                        [key]: num - 1,
                          dec_class: "button-add",
                          buynumber: that.data.buynumber - 1,
                          money: that.data.money - money,
              })
            }
},

/**
 * 购买
 */
buy : function(){
              var that =this
              wx.showModal({
                title: '提示',
                content: '确认已收款' +that.data.money+'元？',
                success: function (res) {
                  if (res.confirm) {  //已结清
                  
                        wx.request({

                                url: 'https://worthytom.top:8443/MiniBuy/servlet/shoppingServlet',
                                data: {
                                  method: "addshopping",
                                  shoppingList: that.data.shoppingList,
                                  userId: app.globalData.userId 
                                },

                                success: function (res) {//结算成功
                                        if (res.statusCode == 200) {
                                          wx.showToast({
                                            title: '结算成功',
                                            icon: 'success',
                                            duration: 2000
                                          })
                                          that.setData({  
                                            shoppingList: [],  //清空
                                            shoppingListLength: 0,
                                            buynumber:0,
                                            money:0,
                                          })
                                        }
                                        else {
                                          wx.showModal({
                                            title: '提示',
                                            content: '结算功能异常，请检查后重试或联系管理员！',
                                          })

                                        }
                                        var state = res.state;
                                        console.log(res)
                                }
                        })


                  } else if (res.cancel) { }
            }
       })

},


/**
 * 清空
*/
clear:function(){
  var that=this
                that.setData({
                        shoppingList:[],  //清空
                        shoppingListLength:0,
                        money:0,
                        buynumber:0,
              })
},

  /**
   * 清空某条记录
  */
  clearOne:function (e) {

            var that = this
            console.log(e.currentTarget.id)
            var clearId = e.currentTarget.id

            if(that.data.errId==clearId) //正要删除的记录为错误记录
            that.setData({errId:-1})
          
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
   * 开始按钮
   */
  startRecord: function () {

                  var that = this;
                  var isRecord = that.data.isRecord;

                        this.setData({
                          text1: "正在录音",
                          mystyle: "myrecord2",
                          isRecord: !that.data.isRecord, ishide: true,
                          src: "pages/luyin/请在听到提示音后开始.mp3"
                        })

                    //播放开始提示音
                    that.innerAudioContext = wx.createInnerAudioContext();
                    that.innerAudioContext.src = that.data.src; // 这里可以是录音的临时路径
                    that.innerAudioContext.play()

                        setTimeout(    
                          function () {
                            that.innerAudioContext = wx.createInnerAudioContext();
                            that.innerAudioContext.src = "pages/luyin/请开始.mp3"; // 
                            that.innerAudioContext.play()
                          }, (app.globalData.speakSpeed * 1000))

                    var interval = setInterval(function () {  //开始循环！！！
                          
                    //循环体
                      if (that.data.errId != -1) clear_this(that.data.errId,that)   //清除错误项
                        //开始录音 
                      wx.startRecord({
                                      success: function (res) {
                                                  var tempFilePath = res.tempFilePath;
                                                  console.log('record SUCCESS file path:' + tempFilePath)
                                                  that.setData({
                                                    recordPath: tempFilePath
                                                  });
                                      },
                                      fail: function (res) {
                                                  //录音失败 
                                                  wx.showModal({
                                                    title: '提示',
                                                    content: '录音的姿势不对!',
                                                    showCancel: false,
                                                    success: function (res) {
                                                      if (res.confirm) {
                                                        return
                                                      }
                                                    }
                                                  })
                                      }
                      })
                      
                      setTimeout(function () {  //停止录音的定时器

                              console.log("开始上传...")
                              wx.stopRecord()//停止录音

                                  setTimeout(function () {
                                        var urls = "https://api.happycxz.com/wxapp/silk2asr/";
                                        processFileUploadForAsr(urls, that.data.recordPath, that);
                                  }, app.globalData.speakSpeed *150)  //系统保存录音文件时间

                              that.innerAudioContext = wx.createInnerAudioContext();
                              that.innerAudioContext.src = "pages/luyin/请继续.mp3"; // 
                              that.innerAudioContext.play()

                      }, (app.globalData.speakSpeed * 1000))   //停止录音的定时器时间--说话时间
     
                      //循环结束
                    }, (app.globalData.speakSpeed * 1400)) //循环时间  说话加

                    that.setData({
                      interval: interval,
                    })

 

  },
  /**
   *停止按钮
   */
  stopRecord: function () {

                    var that = this;

                    if (that.data.errId != -1) clear_this(that.data.errId, that)   //清除错误项

                    wx.stopRecord();
                    wx.stopVoice();
                    that.innerAudioContext.stop();

                    this.setData({
                      text1: "按住说话",
                      mystyle: "myrecord",
                      isRecord: !that.data.isRecord
                    })

                    var interval = that.data.interval;
                    console.log("倒计时暂停"), console.log(interval)
                    clearInterval(interval)

},
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

})


//外部功能函数
//*********************************************************************   
//上传录音文件到 api.happycxz.com 接口，处理语音识别和语义，结果输出到界面   **********
//*********************************************************************
function processFileUploadForAsr(urls, filePath, _this) {

                  console.log("filePath！！：：" + filePath)

                wx.uploadFile({  //上传识别
                    url: urls,
                    filePath: filePath,
                    name: 'file',
                    formData: { "appKey": appkey, "appSecret": appsecret, "userId": UTIL.getUserUnique() },
                    header: { 'content-type': 'multipart/form-data' },
                    success: function (res) {

                          var stt = getSttFromResult(res.data);       //** 返回识别结果*/
                          console.log(stt)

                                    wx.request({   //上传服务器返回识别结果！
                                            url: "https://worthytom.top:8443/MiniBuy/servlet/handleServlet",
                                            data: {
                                                      userId: _this.data.userId,
                                                      firstString: stt,  //！！！！！！！！！！！！！！！！！！！
                                            },
                                            header: {
                                                      'content-type': 'application/json'
                                            },
                                            success: function (res) {
                                              console.log(res);

                                              var data = res.data

                                              if (res.data == "抱歉！我什么都没听到！") 
                data = { commName:'抱歉我没听到' ,classifier:'个',outprice:0.0,inprice:0.0,number :0    }
                                              if (res.data == "抱歉！我什么都没听到！" || res.data.commName == "无法识别" || res.data.number<=0) 
               _this.setData({ errId: _this.data.shoppingListLength,})      

                                              var key = 'shoppingList[' + _this.data.shoppingListLength+']'

                                              _this.setData({
                                                            shoppingListLength:    _this.data.shoppingListLength+1,
                                                            [key] :  data,
                                                            buynumber: _this.data.buynumber + data.number,
                                                            money:_this.data.money + data.number * data.outprice,
                                                        
                                              })
                                         }
                                    }) //请求结束获取到匹配结果

              },
                          fail: function (res) {
                                  UTIL.log(res);
                                  wx.showModal({
                                          title: '提示',
                                          content: "网络请求失败，请确保网络是否正常",
                                          showCancel: false,
                                          success: function (res) {
                                    }
                                  });
                          }
                  });
}


function getSttFromResult(res_data) {

          var res_data_json = JSON.parse(res_data);
          var res_data_result_json = JSON.parse(res_data_json.result);
          return res_data_result_json.asr.result;
}
/**删除某一项 */
function clear_this(clearId,that){
                    var clearone = that.data.shoppingList[clearId]
                    var shoppingList = that.data.shoppingList
                    var array = new Array([that.data.shoppingListLength - 1]);
                   
                    var thisMoney; //试图获取删除项的售价信息
                    try { thisMoney = clearone.outprice * clearone.number}
                    catch (err) { console.log(err)
                                  thisMoney=0  }

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
                      errId:-1,
                    })


}