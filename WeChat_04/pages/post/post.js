// pages/post/post.js
import { DBPost } from '../../db/DBPost.js'

Page({
  data: {

  },
  onLoad:function(){
    let dbPost = new DBPost()
    this.setData({
      postList: dbPost.getAllPostData()
    })
  }
})