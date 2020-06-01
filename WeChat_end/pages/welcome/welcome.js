// welcome.js
Page({
  onTapJump: event => {
    wx.switchTab({
      url:"../post/post",
      success: () => {
        console.log("jump success")
      },
      fail: () => {
        console.log("jump failed")
      },
      complete: () => {
        console.log("jump complete")
      }
    })
  },
  onUnload: event => {
      console.log("page is unload")
  },
  onHide: event => {
      console.log("page is hide")
  },
})