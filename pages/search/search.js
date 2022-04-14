var T;
var app = getApp();

Page({
  data: {
    resultList: [],
    orderno: "",
    accountNum: "",
    kind: "封样板",
    bdate: "开始日期",
    edate: "结束日期"
  },
  onLoad: function (options) {

  },
  bindOrderNumInput: function(e) {
    var bdate = this.data.bdate == "开始日期" ? "" : this.data.bdate;
    var edate = this.data.edate == "结束日期" ? "" : this.data.edate;
    var that = this;
    clearTimeout(T);
    T = setTimeout(() => {
      wx.request({
        url: app.globalData.twUrl + "/estapi/api/SampleReceive/MutilSearch?orderno=" + encodeURIComponent(e.detail.value) + "&receiver=" + encodeURIComponent(this.data.accountNum) + "&type=" + encodeURIComponent(this.data.kind) + "&begindate=" + bdate + "&enddate=" + edate + "&company=" + encodeURIComponent(app.globalData.company),
        method: "GET",
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          that.setData({
            "resultList": res.data,
            "orderno": e.detail.value
          });
        }
      });
    }, 1500);
  },
  bindAccountNumInput: function(e) {
    this.setData({
      accountNum: e.detail.value
    });
  },
  radioChange: function(e) {
    this.setData({
      kind: e.detail.value
    });
  },
  changeBdate: function(e) {
    this.setData({
      bdate: e.detail.value
    });
  },
  changeEdate: function(e) {
    this.setData({
      edate: e.detail.value
    });
  },
  search: function() {
    var that= this;
    var bdate = this.data.bdate == "开始日期" ? "" : this.data.bdate;
    var edate = this.data.edate == "结束日期" ? "" : this.data.edate;
    wx.request({
      url: app.globalData.twUrl + "/estapi/api/SampleReceive/MutilSearch?orderno=" + encodeURIComponent(this.data.orderno) + "&receiver=" + encodeURIComponent(this.data.accountNum) + "&type=" + encodeURIComponent(this.data.kind) + "&begindate=" + bdate + "&enddate=" + edate + "&company=" + encodeURIComponent(app.globalData.company),
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          "resultList": res.data
        });
      }
    });


  },
  clear: function() {
    this.setData({
      resultList: [],
      orderno: "",
      accountNum: "",
      bdate: "开始日期",
      edate: "结束日期"
    })
  },
  goResult: function(e) {
    console.log(this.data.kind);
    wx.navigateTo({
      url: '../result/result?orderno=' + e.currentTarget.dataset.orderno + "&kind=" + e.currentTarget.dataset.kind + "&color=" + e.currentTarget.dataset.color,
    })
  }
})