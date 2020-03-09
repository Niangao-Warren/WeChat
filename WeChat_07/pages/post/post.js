// pages/post/post.js
import { DBPost } from '../../db/DBPost.js'

Page({
  data: {},
  onLoad:function(){
    const dbPost = new DBPost()
    this.setData({
      postList: dbPost.getAllPostData()
    })
  },
  onTapToDetail(event) {
    const postId = event.currentTarget.dataset.postId
    console.log(postId)
    wx.navigateTo({
      url: `post-detail/post-detail?id=${postId}`
    })
  }
})