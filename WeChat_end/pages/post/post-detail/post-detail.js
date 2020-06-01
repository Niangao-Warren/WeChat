// pages/post/post-detail/post-detail.js
import { DBPost } from "../../../db/DBPost"

let app = getApp()

Page({
  data: {},
  onLoad: function(options) {
    let postId = options.id
    this.dbPost = new DBPost(postId)
    this.postData = this.dbPost.getPostItemById().data
    this.setData({
      post: this.postData
    })
    this.addReadingTimes()
    this.setMusicMonitor()
    this.initMusicStatus()
  },
  onReady: function() {
    wx.setNavigationBarTitle({
      title: this.postData.title
    })
  },
  onCollectionTap: function(event) {
    let newData = this.dbPost.collect()
    // 重新绑定数据。注意，不要将整个newData全部作为setData的参数，
    // 应当有选择的更新部分数据
    this.setData({
      "post.collectionStatus": newData.collectionStatus,
      "post.collectionNum": newData.collectionNum
    })
    // 交互反馈
    wx.showToast({
      title: newData.collectionStatus ? "收藏成功" : "取消成功",
      duration: 1000,
      icon: "success",
      mask: true
    })
  },
  onUpTap: function(event) {
    let newData = this.dbPost.up()
    this.setData({
      "post.upStatus": newData.upStatus,
      "post.upNum": newData.upNum
    })
  },
  onCommentTap: function(event) {
    const id = event.currentTarget.dataset.postId;
    wx.navigateTo({
      url: `../post-comment/post-comment?id=${id}`
    })
  },
  //阅读量+1
  addReadingTimes: function() {
    this.dbPost.addReadingTimes();
  },
  initMusicStatus: function() {
    let currentPostId = this.postData.postId
    if(app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === currentPostId) {
      // 如果全局播放的音乐是当前文章的音乐，就将图标状态设置为正在播放
      this.setData({
        isPlayingMusic: true
      })
    } else {
      this.setData({
        isPlayingMusic: false
      })
    }
  },
  onMusicTap: function(event) {
    // 音乐播放实例
    const music = wx.getBackgroundAudioManager()
    music.src = this.postData.music.url;
    music.title = this.postData.music.title;
    music.coverImgUrl = this.postData.music.coverImg;
    if(this.data.isPlayingMusic) {
      // 暂停音乐播放
      music.pause()
      this.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false
    }else {
      // 播放音乐
      music.play()
      this.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true
      app.globalData.g_currentMusicPostId = this.postData.postId
    }
  },
  setMusicMonitor: function() {
    let that = this
    const music = wx.getBackgroundAudioManager()
    music.onEnded(function(){
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false
    })
    music.onPlay(function(){
      // 只处理当前页面的音乐播放
      if(app.globalData.g_currentMusicPostId === that.postData.postId) {
        that.setData({
          isPlayingMusic: true
        })
      }
      app.globalData.g_isPlayingMusic = true
    })
    music.onPause(function(){
      // 只处理当前页面的音乐暂停
      that.setData({
        isPlayingMusic: false
      })
    })
    app.globalData.g_isPlayingMusic = false
  },
  // 定义页面分享函数
  onShareAppMessage: function(event) {
    return {
      title: this.postData.title,
      desc: this.postData.content,
      path: '/pages/posts/post-detail/post-detail'
    }
  }
})
