// pages/post/post.js
import { DBPost } from '../../db/DBPost.js'

Page({
  data: {},
  onLoad: function(){
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
  },
  onSwiperTap: function (event) {
    // target 和 currentTarget
    // target指的是当前点击的组件，而 currentTarget 指的是事件捕获的组件
    // target这里指的是image，而currentTarget指的是swiper
    let postId = event.target.dataset.postid
    wx.navigateTo({
      url: "post-detail/post-detail?id=" + postId
    })
  }
})