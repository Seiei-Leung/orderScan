//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    openid: "",
    code: "",
    name: "",
    src: "https://www.etscn.com.cn:40443/oa/KQ/img/tab-profile-active.png",
    company: ""
  },
  onLoad: function (e) {
    console.log(e)
    var that = this;
    console.log(app.globalData.openid);
    if (app.globalData.openid) {
      console.log("不回调")
      this.setData({
        openid: app.globalData.openid
      });
      wx.request({
        url: app.globalData.twUrl + "/estapi/api/SampleReceive/IsBind",
        data: {
          openid: app.globalData.openid
        },
        success: function (res) {
          if (res.data.cnt == 0) {
            wx.reLaunch({
              url: '../signin/signin'
            })
          } else {
            wx.request({
              url: app.globalData.twUrl + "/estapi/api/SampleReceive/UserAndImage",
              data: {
                openid: app.globalData.openid
              },
              method: "GET",
              success: function (res) {
                that.setData({
                  code: res.data.code,
                  name: res.data.name,
                  src: res.data.imageurl,
                  company: res.data.company
                });
                app.globalData.company = res.data.company;
                /*
                if (e.orderno) {
                  wx.request({
                    url: app.globalData.twUrl + "/estapi/api/SampleReceive/GetColorAndType",
                    data: {
                      orderno: e.orderno,
                      dsn: e.dsn,
                      type: e.type
                    },
                    method: "GET",
                    success: function (res1) {
                      wx.request({
                        url: app.globalData.twUrl + "/estapi/api/SampleReceive/Insert",
                        data: {
                          orderno: res1.data.orderno,
                          color: res1.data.color,
                          sampletype: res1.data.type,
                          openid: app.globalData.openid
                        },
                        method: "GET",
                        success: function (res) {
                          if (res.data.result == "SUCCESS") {
                            wx.showModal({
                              title: '扫码成功',
                              content: '制单号:' + res1.data.orderno + ",颜色：" + res1.data.color + ",样板类型：" + res1.data.type,
                              showCancel: false
                            });
                          } else {
                            wx.showModal({
                              title: '提示',
                              content: '扫码失败',
                              showCancel: false
                            });
                          }
                        }
                      });
                    }
                  })
                }
                */
              }
            });
          }
        }
      })
    } else {
      var that = this;
      app.openidReadyCallback = res => {
        console.log("通过 openidReadyCallback 回调");
        // 这里的 this 是指向当前页面的this
        this.setData({
          openid: res.data.openid
        })
        wx.request({
          url: app.globalData.twUrl + "/estapi/api/SampleReceive/IsBind",
          data: {
            openid: app.globalData.openid
          },
          method: "GET",
          success: function (res) {
            if (res.data.cnt == 0) {
              wx.reLaunch({
                url: '../signin/signin'
              })
            } else {
              wx.request({
                url: app.globalData.twUrl + "/estapi/api/SampleReceive/UserAndImage",
                data: {
                  openid: app.globalData.openid
                },
                method: "GET",
                success: function (res) {
                  that.setData({
                    code: res.data.code,
                    name: res.data.name,
                    src: res.data.imageurl,
                    company: res.data.company
                  });
                  app.globalData.company = res.data.company;
                  /*
                  if (e.orderno) {
                    wx.request({
                      url: app.globalData.twUrl + "/estapi/api/SampleReceive/GetColorAndType",
                      data: {
                        orderno: e.orderno,
                        dsn: e.dsn,
                        type: e.type
                      },
                      method: "GET",
                      success: function (res1) {
                        wx.request({
                          url: app.globalData.twUrl + "/estapi/api/SampleReceive/Insert",
                          data: {
                            orderno: res1.data.orderno,
                            color: res1.data.color,
                            sampletype: res1.data.type,
                            openid: app.globalData.openid
                          },
                          method: "GET",
                          success: function (res) {
                            if (res.data.result == "SUCCESS") {
                              wx.showModal({
                                title: '扫码成功',
                                content: '制单号:' + res1.data.orderno + ",颜色：" + res1.data.color + ",样板类型：" + res1.data.type,
                                showCancel: false
                              });
                            } else {
                              wx.showModal({
                                title: '提示',
                                content: '扫码失败',
                                showCancel: false
                              });
                            }
                          }
                        });
                      }
                    })
                  }
                  */
                }
              });
            }
          }
        });
      }
    }
  },
  scan: function () {
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        var result = res.result.split(";");
        console.log(result.length);
        if (!((result.length == 3 && that.data.company == '通伟') || (result.length == 6 && that.data.company == '鱼跃'))) {
          wx.showModal({
            title: '提示',
            content: '二维码格式错误',
            showCancel: false
          });
          return;
        } else {
          wx.request({
            url: app.globalData.twUrl + "/estapi/api/SampleReceive/Insert",
            data: {
              orderno: result[0],
              color: result[1],
              sampletype: result[2],
              custname: result[3] ? result[3] : "",
              season: result[4] ? result[4] : "",
              styleno: result[5] ? result[5] : "",
              openid: app.globalData.openid,
              company: that.data.company
            },
            method: "GET",
            complete: function (res) {
              if (res.data.result == "SUCCESS") {
                var content = '制单号:' + result[0] + ",颜色：" + result[1] + ",样板类型：" + result[2];
                if (result[3]) {
                  content += ',客户:' + result[3] + ',季度' + result[4] + ',款号' + result[5]
                }
                wx.showModal({
                  title: '扫码成功',
                  content: content,
                  showCancel: false
                });
              } else {
                wx.showModal({
                  title: '提示',
                  content: '扫码失败',
                  showCancel: false
                });
              }
            }
          });
        }
      }
    })
  },
  goSearch: function () {
    wx.navigateTo({
      url: '../search/search'
    });
  },
  signout: function() {
    var that = this;
    wx.request({
      url: app.globalData.twUrl + "/estapi/api/SampleReceive/signOut",
      data: {
        code: that.data.code
      },
      method: "GET",
      complete: function (res) {
        wx.reLaunch({
          url: '../signin/signin'
        })
      }
    })
  }
})