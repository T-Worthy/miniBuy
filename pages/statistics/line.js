var wxCharts = require('../../utils/wxcharts.js');
var app = getApp();
var lineChart = null;
//图表数据样本
var chartData = { aMonthWithDay: [{ date: '2018-2-8', getMoney: 188 }, { date: '2018-2-8', getMoney: 288 }, 
  { date: '2018-2-8', getMoney: 388 }], theMonth_getMoney: 1398};

Page({
  data: {
                              weekss: "button-week",
                              monthss: "button-month",
                              yearss: "year",
  },
/**
 * 回到按月查询
 */
  changemonth: function () {
                  wx.redirectTo({
                         url: '/pages/statistics/statistics',
                  })
                  var that = this
                  that.setData({
                          weekss: "week",
                          monthss: "button-month",
                          yearss: "button-year"
                  })
    },
//点击显示详情
  touchHandler2: function (e) {
    lineChart.scrollStart(e);
  },
  //滑动处理
  moveHandler: function (e) {
    lineChart.scroll(e);
  },
  //点击结束
  touchEndHandler: function (e) {
    lineChart.scrollEnd(e);
    lineChart.showToolTip(e, {
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },
  /**
   * 生成图表数据
   */
  createSimulationData: function () {
                              var categories = [];
                              var data = [];
                              for (var i = 0; i < chartData.aMonthWithDay.length; i++) {
                                categories.push(chartData.aMonthWithDay[i].date);
                                data.push(chartData.aMonthWithDay[i].getMoney);
                              }
                              // data[4] = null;
                              return {
                                categories: categories,
                                data: data
                              }
  },
  //更新
  updateData: function () {
                      console.log(chartData)

                      var simulationData = this.createSimulationData();
                      var series = [{
                        name: '营业额',
                        data: simulationData.data,
                        format: function (val, name) {
                          return val.toFixed(2);
                        }
                      }];
                      lineChart.updateData({
                        categories: simulationData.categories,
                        series: series
                      });
  },
  /**
   * 初始化信息
   */
  onLoad: function (e) {
  
                var that = this

                wx.request({
                        url: 'https://worthytom.top:8443/MiniBuy/servlet/shoppingServlet',
                        data: {
                          method: 'salesRecord2',
                          userId: app.globalData.userId
                        },
                        header: {
                          'content-type': 'application/json' // 默认值
                        },
                        success: function (res) {

                          if (res.data == "" || res.data == 'null' || res.data == ' ' || res.data == 0) {
                            wx.showModal({
                              title: '提示',
                              content: '抱歉，暂无相关记录。',
                            })
                            return;
                          }
                          
                          console.log(res.data)
                          chartData = res.data
                          console.log(chartData)
                        //  onLoad2(that)
                         onLoad3(that)
                        }
                })

  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

})
//--------------------------------------
function onLoad2(that){
  
                    var windowWidth = 320;
                    try {
                      var res = wx.getSystemInfoSync();
                      windowWidth = res.windowWidth;
                    } catch (e) {
                      console.error('getSystemInfoSync failed!');
                    }

                    var simulationData = that.createSimulationData();
                    lineChart = new wxCharts({
                      canvasId: 'lineCanvas',
                      type: 'line',
                      categories: simulationData.categories,
                      animation: true,
                      // background: '#f5f5f5',
                      series: [{
                        name: '营业额',
                        data: simulationData.data,
                        format: function (val, name) {
                          return val.toFixed(2);
                        }
                      }
                      ],
                      xAxis: {
                        disableGrid: true
                      },
                      yAxis: {
                        title: '日营业额 (元)',
                        format: function (val) {
                          return val.toFixed(2);
                        },
                        min: 0
                      },
                      width: windowWidth,
                      height: 200,
                      dataLabel: false,
                      dataPointShape: true,
                      extra: {
                        lineStyle: 'curve'
                      }
                    });


}

//------------------------------
function onLoad3 (that) {
  var windowWidth = 320;
  try {
    var res = wx.getSystemInfoSync();
    windowWidth = res.windowWidth;
  } catch (e) {
    console.error('getSystemInfoSync failed!');
  }

  var simulationData = that.createSimulationData();
  lineChart = new wxCharts({
    canvasId: 'lineCanvas2',
    type: 'line',
    categories: simulationData.categories,
    animation: false,
    series: [{
      name: '营业额',
      data: simulationData.data,
      format: function (val, name) {
        return val.toFixed(2) ;
      }
    }],
    xAxis: {
      disableGrid: false
    },
    yAxis: {
      title: '成交金额 (元)',
      format: function (val) {
        return val.toFixed(2);
      },
      min: 0
    },
    width: windowWidth,
    height: 200,
    dataLabel: true,
    dataPointShape: true,
    enableScroll: true,
    extra: {
      lineStyle: 'curve'
    }
  });
}