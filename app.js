//app.js
App({
  onLaunch: function () {
    var that = this;
    // 登录
    wx.login({
      success: res => {
        wx.request({
          url: that.globalData.twUrl + "/estapi/api/SampleReceive/WechatOpenid",
          data: {
            jscode: res.code
          },
          success: res1 => {
            that.globalData.session_key = res1.data.session_key;
            that.globalData.openid = res1.data.openid;
            if (this.openidReadyCallback) {
              this.openidReadyCallback(res1)
            }
          }
        })
      }
    })
  },
  globalData: {
    twUrl: "https://www.etscn.com.cn:40443",
    userInfo: null,
    openid: null,
    session_key: null,
    company: null
  }
})