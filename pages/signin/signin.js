const app = getApp();

Page({
  data: {
    userName: "",
    pw: ""
  },
  bindUserName(e) {
    this.setData({
      userName: e.detail.value
    })
  },
  bindPW(e) {
    this.setData({
      pw: e.detail.value
    })
  },
  signin: function() {
    console.log(this.data)
    if (this.data.pw.trim() == "" || this.data.userName.trim() == "") {
      wx.showToast({
        title: '请输入用户名及密码',
        icon: 'none',
        duration: 2000
      });
      return;
    } else {
      wx.showLoading({
        title: '加载中',
      });
      var that = this;
      wx.request({
        url: app.globalData.twUrl + "/estapi/api/User/GetLogin",
        data: {
          username: this.data.userName,
          password: this.data.pw
        },
        success: function (res) {
          if (res.data.length == 0) {
            wx.hideLoading();
            wx.showModal({
              title: '提示',
              content: '密码错误'
            });
            return;
          } else {
            console.log(res.data);
            wx.request({
              url: app.globalData.twUrl + "/estapi/api/SampleReceive/Binding",
              data: {
                openid: app.globalData.openid,
                code: res.data[0].Code
              },
              success: function (res1) {
                wx.hideLoading();
                if (res1.data.result == "SUCCESS") {
                  wx.reLaunch({
                    url: '../index/index'
                  })
                } else {
                  wx.showModal({
                    title: '提示',
                    content: '登录失败'
                  });
                }
              }
            })
          }
        }
      })
    }
  }
})