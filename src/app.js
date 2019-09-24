//app.js
// require('./app.json');
require('./app.wxss');
require('./pages/index/index.js');
// require('./pages/index/index.json');
require('./pages/index/index.wxml');
require('./pages/index/index.wxss');
require('./pages/editor/editor.js');
// require('./pages/editor/editor.json');
require('./pages/editor/editor.wxml');
require('./pages/editor/editor.wxss')

App({
  onLaunch: function () {
    
  },
  call: function () {
    wx.makePhoneCall({
      phoneNumber: 15101115472
    })
  },
  globalData: {
    userInfo: null
  }
})