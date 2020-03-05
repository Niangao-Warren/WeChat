// pages/post/post-comment/post-comment.js
import { DBPost } from '../../../db/DBPost.js'

Page({
  data: {},
  onLoad: function(options) {
    let postId = options.id
    this.dbPost = new DBPost(postId)
    let comments = this.dbPost.getCommentData()
    console.log(comments)
    // 绑定评论数据
    this.setData({
      comments: comments
    })
  },
  //预览图片
  previewImg: function (event) {
    //获取评论序号
    let commentIdx = event.currentTarget.dataset.commentIdx,
        //获取图片在图片数组中的序号
        imgIdx     = event.currentTarget.dataset.imgIdx,
        //获取评论的全部图片
        imgs       = this.data.comments[commentIdx].content.img;
    wx.previewImage({
      current: imgs[imgIdx], // 当前显示图片的http链接
      urls: imgs // 需要预览的图片http链接列表
    })
  }
})
