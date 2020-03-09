// pages/post/post-detail/post-detail.js
import { DBPost } from "../../../db/DBPost"
Page({
  data: {},
  onLoad: function(options) {
    let postId = options.id
    this.dbPost = new DBPost(postId)
    this.postData = this.dbPost.getPostItemById().data
    this.setData({
      post: this.postData
    })
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
  onCommentTap: function (event) {
    const id = event.currentTarget.dataset.postId;
    wx.navigateTo({
      url: `../post-comment/post-comment?id=${id}`
    })
  },
  //阅读量+1
  addReadingTimes: function () {
    this.dbPost.addReadingTimes();
  },
})
