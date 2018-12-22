var app = getApp();
var UTIL = require('../../utils/util.js');
const appkey = require('../../config').appkey
const appsecret = require('../../config').appsecret

Page({
  data: {
            array: ["个", "瓶","双","套","对","块","根","台","本","把","袋","捆","提","杯","听","箱","条","千克","斤","两","盒","包","袋","只","件"],
            index:0,
            path:"",
            yuyin: false,
            isRecord:false,
            pic: '/pages/Image/plus.png',
            youSay:"",
            comm:{"commName":'', "inprice": 0 ,"outprice": 0,"stock":0 },
            code:0,//条形码
            classify: {},//分类信息
  },

  onShow :function(){
                
            var that =this

            that.setData({ classify: app.globalData.classify})

            console.log(app.globalData.classify)
            console.log(that.data.classify)
  },

            saoma: function(){//扫码获取商品名称

              var that = this;
              var show;
              wx.scanCode({
                success: (res) => {//扫码成功
                  console.log(res)
                  var scancode = res.result
                  //---------------------------------------上传
                  wx.request({
                    url: 'https://api.it120.cc/f1f2582a9830a449cfaf4006d7b5ac69/barcode/info', 
                    data: {
                      barcode: res.result
                    },
                    header: {
                      'content-type': 'application/json' // 默认值
                    },
                    success: function (res) {
                      console.log(res)
                      console.log(res.data)
                      var data = res.data.data
                      var key = "comm.commName"
                      that.setData({
                       
                        [key]: data.description,//商品名称
                        code: scancode,
                      })
                      console.log(res.data)
                    },
             
              })

                  wx.showToast({
                    title: '成功',
                    icon: 'success',
                    duration: 2000
                  })

                   //新增进货信息       



                },
                fail: (res) => {
                  wx.showToast({
                    title: '失败',
                    icon: 'success',
                    duration: 2000
                  })
                },
              
              })

},
  //---------------------------------按钮
  inputchange: function () {
                        var that = this;
                        that.setData({
                          yuyin: !that.data.yuyin
                        })

  },
  recordchange: function () {
                      var that = this;

                      this.setData({
                      
                        isRecord: !that.data.isRecord, 
                      
                      })

  },

  /*
     --------------------------------------------------------------------提交
  */
  formSubmit: function (e) {
    
                      var that =this
                      var classifyId=that.data.classify.id
                      console.log('form发生了submit事件，携带数据为：', e.detail.value)
                      if (e.detail.value.commName == "" || e.detail.value.inprice < 0 || e.detail.value.outprice <= 0 || e.detail.value.stock <= 0) {
                        wx.showModal({
                          title: '提示',
                          content: '商品信息不完整或有误，请检查后重试！',
                        })}
                    else if (classifyId <= 0) {
                        wx.showModal({
                          title: '提示',
                          content: '请选择商品分类',})
                    }

                else {
                      wx.request({
                        url: 'https://worthytom.top:8443/MiniBuy/servlet/AServlet2',
                        data:{
                                method: "addComm",
                                data: e.detail.value,
                                commName: e.detail.value.commName,
                                inprice: e.detail.value.inprice,
                                outprice: e.detail.value.outprice,
                                stock: e.detail.value.stock,
                                classifier: e.detail.value.classifier,
                                userId: app.globalData.userId ,
                                pictureUrl: that.data.path,
                                code: that.data.code ,
                                classifyId: classifyId
                        },

                        success: function (res) {//

                                  if(res.statusCode==200){//上传成功
                                    wx.showToast({
                                              title: '保存成功',
                                              icon: 'success',
                                              duration: 2000
                                    })
                                    wx.redirectTo({
                                              url: '/pages/jh/jh',
                                    })  
                                  }
                                  else{   //上传失败
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
   * 滑动选择器
   */
  bindPickerChange:function(e){
     
              this.setData({
                    index: e.detail.value
              })
  },

  //**上传图片至QSS返回URL */
choosePicture :function(){

          var that = this
          wx.chooseImage({

            sourceType: ['album', 'camera'],
            sizeType: ['original', 'compressed'],
            count: 1,

            success: function (res) {
              var tempFilePaths = res.tempFilePaths

                      that.setData({
                              pic: tempFilePaths[0]
                      })

              wx.uploadFile({     //---------上传
                            url: 'https://worthytom.top:8443/MiniBuy/servlet/uploadServlet',//urls,
                            filePath: tempFilePaths[0],///s.data.audiosrc,
                            name: 'file',
                            header: {
                              'content-type': 'multipart/form-data'
                            },
                            success: function (res) {
                                console.log("选择成功")
                                console.log(res)

                                      that.setData({
                                                  path: res.data,
                                                  pic:res.data
                                                  })

                            },
                            fail: function (res) {
                              console.log(res);
                              wx.showModal({
                                title: '提示',
                                content: "网络请求失败，请确保网络是否正常",
                                showCancel: false,
                              });
                              wx.hideToast();
                            }
              });

            }, 
            fail: function (res) { console.log('图片文件选取失败') }
          
       })
}
 ,

/**
 * 开始按钮
 */
startRecord: function () {

                    var that = this;
                    var isRecord = that.data.isRecord;

                        this.setData({
                                mystyle: "myrecord2",
                                isRecord: !that.data.isRecord, ishide: true,
                        })

                    //播放开始提示音
                        playLuYin("智能语音输入已开启，请问您要新增的商品是", that)  //播放提示音1

                    
                 setTimeout(  function () {         //第一定时器 
                      var key = "comm.commName"
                      luYin(that, false,key)//第一次录音4s


                  setTimeout(function () { //播放提示音2
                    playLuYin("进价是多少", that) 
                    }, (4 * 1000))    //播放2s

                    
                      setTimeout(function () {      //第二定时器
                        var key = "comm.inprice"
                        luYin(that, true, key)//第二次录音4s
                        
                      
                        setTimeout(function () { playLuYin("售价是多少", that) }, (4 * 1000))  //录音3500
                      
                        setTimeout(function () {      //第三定时器
                          var key = "comm.outprice"
                          luYin(that, true, key)//第三次录音4s
                          
                      
                          setTimeout(function () { playLuYin("初始库存有多少", that) }, (4 * 1000))  //录音3500
                        
                          setTimeout(function () {      //第四定时器
                            var key = "comm.stock"
                            luYin(that, true, key)//第四次录音4s
                          
                            setTimeout(function () {   playLuYin("输入已结束，请确认信息后提交", that) }, (4 * 1000))  //录音3500
                          that.setData({//录音结束
                                    mystyle: "myrecord1",
                                    isRecord: false
                          })
                             }, (6* 1000))
                           }, (6 * 1000))
                        }, (6 * 1000))   
                      }, (5* 1000))



}

  ,
/**
 *停止按钮
 */
stopRecord: function () {

  var that = this;

  ///////---------------------------------------------关闭定时器和录音！！
  wx.stopRecord();
  wx.stopVoice();
  that.innerAudioContext.stop();
  this.setData({
    mystyle: "myrecord1",
    isRecord: !that.data.isRecord
  })



},
onPullDownRefresh: function () {
  wx.stopPullDownRefresh()
},


})



//*********************************************************************   
//上传录音文件到 api.happycxz.com 接口，处理语音识别和语义，结果输出到界面   **********
//*********************************************************************
function processFileUploadForAsr(urls, filePath, _this,isnum,key) {

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
      _this.setData({ [key]: stt, youSay: stt, })

      if (isnum == true) {  //处理识别结果  只识别整数-------------------
        console.log("//处理识别结果  只识别整数-------------------")
        wx.request({   //上传服务器返回识别结果！
          url: "https://worthytom.top:8443/MiniBuy/servlet/handleServlet2",
          data: {
            userId: app.globalData.userId,
            firstString: stt,  //！！！！！！！！！！！！！！！！！！！
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res);

            var data = res.data

           
            if ((isNaN(res.data.value)) || res.data < 0 || res.data == "抱歉！我什么都没听到！" )
              _this.setData({ [key]:'0' })
            _this.setData({ [key]: res.data })


          }
        })


}
    
     


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




function luYin(that, isnum,key){

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

  setTimeout(function () {  //停止录音定时器

    console.log("开始上传...")
    wx.stopRecord()

    setTimeout(function () {
      var urls = "https://api.happycxz.com/wxapp/silk2asr/";
      processFileUploadForAsr(urls, that.data.recordPath, that, isnum,key);
    }, 500)  //保存录音文件时间


  }   //处理录音文件时间
    , (3 * 1000))   //循环时间


}

function playLuYin(name,that){
  that.innerAudioContext = wx.createInnerAudioContext();
  that.innerAudioContext.src = "pages/luyin/"+name+".mp3"; // 
  that.innerAudioContext.play()
}