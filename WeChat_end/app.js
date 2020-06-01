//app.js
App({
  onLaunch: () => {
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
    g_currentMusicPostId: null,
    // 豆瓣代理API
    // doubanBase: "https://douban.uieee.com/",
    doubanBase: "https://douban-api.uieee.com"    
  }
})