var wxCharts = require('../../utils/wxcharts.js');
var app = getApp();
var columnChart = null;

var chartData = {
  "main": {
    "title": "近一月营业额",
    "data": [0.0, 0.0 ,0.0, 0.0],
    "categories": ["前三周", "前两周", "上周", "本周"]
  },

  "sub": [{
    "title": "前三周营业额",
    "data": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    "categories": ["0", "0", "0", "0", "0", "2018-04-28"]
  },
  {
    "title": "前两周营业额",
    "data": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    "categories": ["0", "0", "0", "0", "0", "0", "2018-05-05"]
  },
  {
    "title": "上周营业额",
    "data": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    "categories": ["0", "0", "0", "0", "0", "0", "2018-05-12"]
  },
  {
    "title": "本周营业额", "data": [0.0, 0.0, 0.0, 0.0, 0.0],
    "categories": ["0", "0", "0", "0", "2018-05-17"]
  }]
};


Page({

 
  data: {
    uaerId:0,
    allmoney:0.00,
    average:0.00,
    weekss:"week",
    monthss:"button-month",
    yearss:"button-year",
    title:"最近一月",

    chartTitle: '总营业额',
    isMainChartDisplay: true
  },
  /**
  *载入图表数据
   */
  onLoad: function (e) {
    var that=this
    that.setData({ userId: app.globalData.userId   })

    wx.request({
      url: 'https://worthytom.top:8443/MiniBuy/servlet/shoppingServlet', 
      data: {
        method: 'salesRecord',
        userId: app.globalData.userId  
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        chartData = res.data.chartData

        if (res.data.chartData == "" || res.data.chartData == 'null' || res.data.chartData == ' ' || res.data.theMonth_getMoney == 0) {
          wx.showModal({
            title: '提示',
            content: '抱歉，暂无相关记录。',
          })


          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
                   }, 2000)                  
          return;
        }


        that.setData({
          allmoney: res.data.theMonth_getMoney.toFixed(2),
          average: (res.data.theMonth_getMoney / 4).toFixed(2) })
      }

      
    })
    

  },


  /**
   * 
   * 回到主界面
   */
  changemonth:function(){
    var that=this
    that.setData({
      weekss: "week",
      monthss: "button-month",
      yearss: "button-year"
    })
    this.setData({
      chartTitle: chartData.main.title,
      isMainChartDisplay: true,
      title: "最近一月"
    });
    columnChart.updateData({
      categories: chartData.main.categories,
      series: [{
        name: '营业额',
        data: chartData.main.data,
        format: function (val, name) {
          return val.toFixed(2);
        }
      }]
    });
  },

  changeday: function () {
    wx.redirectTo({
      url: '/pages/statistics/line',
    })
  },
  backToMainChart: function () {
    this.setData({
      chartTitle: chartData.main.title,
      isMainChartDisplay: true,
      title:"最近一月"
    });
    columnChart.updateData({
      categories: chartData.main.categories,
      series: [{
        name: '营业额',
        data: chartData.main.data,
        format: function (val, name) {
          return val.toFixed(2) ;
        }
      }]
    });
  },
  touchHandler: function (e) {
    var index = columnChart.getCurrentDataIndex(e);


    if (index > -1 && index < chartData.sub.length && this.data.isMainChartDisplay) {
      this.setData({
        chartTitle: chartData.sub[index].title,
        isMainChartDisplay: false,
        allmoney: chartData.main.data[index].toFixed(2),
        average: (chartData.main.data[index] / chartData.sub[index].data.length).toFixed(2),
        title: chartData.sub[index].title,
        weekss: "button-week",
        monthss: "month",
        yearss: "button-year"
      });
      columnChart.updateData({
        categories: chartData.sub[index].categories,
        series: [{
          name: '营业额',
          data: chartData.sub[index].data,
          format: function (val, name) {
            return val.toFixed(2) ;
          }
        }]
      });

    }
  },
  onReady: function (e) {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    columnChart = new wxCharts({
      canvasId: 'columnCanvas',
      type: 'column',
      animation: true,
      categories: chartData.main.categories,
      series: [{
        name: '营业额',
        data: chartData.main.data,
        format: function (val, name) {
          return val.toFixed(2) ;
        }
      }],
      yAxis: {
        format: function (val) {
          return val ;
        },
        // title: 'hello',
        min: 0
      },
      xAxis: {
        disableGrid: false,
        type: 'calibration'
      },
      extra: {
        column: {
          width: 15
        }
      },
      width: windowWidth,
      height: 200,
    });
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },


});

