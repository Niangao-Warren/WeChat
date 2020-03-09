// pages/post/post-comment/post-comment.js
import { DBPost } from '../../../db/DBPost.js'

Page({
  data: {
    // 控制使用键盘还是发送语音
    useKeyboardFlag: true,
    // 控制input组件的初始值
    keyboardInputValue: '',
    // 控制是否显示图片选择面板
    sendMoreMsgFlag: false,
    // 保存已选择图片
    chooseFiles: [],
    // 被删除的图片序号
    deleteIndex: -1
  },
  onLoad: function(options) {
    let postId = options.id
    this.dbPost = new DBPost(postId)
    let comments = this.dbPost.getCommentData()
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
  },
  //切换语音和键盘输入
  switchInputType: function (event) {
    this.setData({
      useKeyboardFlag: !this.data.useKeyboardFlag
    })
  },
  // 获取用户输入
  bindCommentInput: function (event) {
    let val = event.detail.value;
    this.data.keyboardInputValue = val;
  },
  // 提交用户评论
  submitComment: function (event) {
    let imgs = this.data.chooseFiles;
    let newData = {
        username: "青石",
        avatar: "/images/avatar/avatar-3.png",
        create_time: new Date().getTime() / 1000,
        content: {
            txt: this.data.keyboardInputValue,
            img: imgs
        },
    }
    if(!newData.content.txt && imgs.length === 0) {
      return;
    }
    //保存新评论到缓存数据库中
    this.dbPost.newComment(newData)
    //显示操作结果
    this.showCommitSuccessToast()
    //重新渲染并绑定所有评论
    this.bindCommentData()
    //恢复初始状态
    this.resetAllDefaultStatus()
  },
  //评论成功
  showCommitSuccessToast: function () {
    //显示操作结果
    wx.showToast({
      title: "评论成功",
      duration: 1000,
      icon: "success"
    })
  },
  bindCommentData: function () {
    let comments = this.dbPost.getCommentData()
    // 绑定评论数据
    this.setData({
      comments: comments
    })
  },
  //将所有相关的按钮状态，输入状态都回到初始化状态
  resetAllDefaultStatus: function () {
    //清空评论框
    this.setData({
      keyboardInputValue: '',
      chooseFiles: [],
      sendMoreMsgFlag: false
    })
  },
  //显示 选择照片、拍照等按钮
  sendMoreMsg: function () {
    this.setData({
      sendMoreMsgFlag: !this.data.sendMoreMsgFlag
    })
  },
  //选择本地照片与拍照
  chooseImage: function (event) {
    // 已选择图片数组
    let imgArr = this.data.chooseFiles;
    //只能上传3张照片，包括拍照
    let leftCount = 3 - imgArr.length;
    if (leftCount <= 0) {
      return
    }
    let sourceType = [event.currentTarget.dataset.category],
        that = this;
    wx.chooseImage({
      count: leftCount,
      sourceType: sourceType,
      success: function (res) {
        // 可以分次选择图片，但总数不能超过3张
        that.setData({
          chooseFiles: imgArr.concat(res.tempFilePaths)
        })
      }
    })
  },
  //删除已经选择的图片
  deleteImage: function (event) {
    let index = event.currentTarget.dataset.idx,
        that = this;
    that.setData({
        deleteIndex: index
    })
    that.data.chooseFiles.splice(index, 1)
    setTimeout(function () {
      that.setData({
        deleteIndex: -1,
        chooseFiles: that.data.chooseFiles
      })
    }, 500)
  }
})
