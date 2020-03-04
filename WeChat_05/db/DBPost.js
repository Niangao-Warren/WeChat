class DBPost {
  constructor(postId) {
    this.storageKeyName = 'postList'
    this.postId = postId
  }
  // 得到全部文章信息
  getAllPostData() {
    let res = wx.getStorageSync(this.storageKeyName)
    if(!res) {
      res = require('./data/data.js').postList
      this.initPostList(res)
    }
    return res
  }
  // 保存或者更新缓存数据
  execSetStorageSync(data) {
    wx.setStorageSync(this.storageKeyName, data)
  }
  // 获取指定id的文章数据
  getPostItemById() {
    let postsData = this.getAllPostData()
    const len = postsData.length
    for(let i = 0; i < len; i++) {
      if(postsData[i].postId == this.postId) {
        return {
          // 当前文章在缓存数据库数组中的序号
          index: i,
          data: postsData[i]
        }
      }
    }
  }
}

export {DBPost}