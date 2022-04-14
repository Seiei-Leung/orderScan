var app = getApp();

Page({
  data: {
    resultList: []
  },
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.globalData.twUrl + "/estapi/api/SampleReceive/SampleOrderTrace2?orderno=" + encodeURIComponent(options.orderno) + "&type=" + encodeURIComponent(options.kind) + '&color=' + encodeURIComponent(options.color) + "&company=" + encodeURIComponent(app.globalData.company),
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        for (var i=0; i<res.data.length; i++) {
          var list = res.data[i].receivetime.split("T");
          if (list.length == 2) {
            res.data[i].receivetime = list[0] + " " + list[1].split(".")[0];
          } 
        }
        that.setData({
          "resultList": res.data
        });
      }
    });
  }
})