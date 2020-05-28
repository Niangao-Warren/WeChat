//app.js
App({
  onLaunch:function(){
    let storageData = wx.getStorageSync('postList');
    if(!storageData){
      //如果postList缓存不存在
      let dataObj = require("data/data.js")
      wx.clearStorageSync();
      wx.setStorageSync('postList', dataObj.postList);
    }
  },
  globalData: {
    g_isPlayingMusic: false,
    g_currentMusicPostId: null
  }
})