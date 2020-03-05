// db/DBPost.js
class DBPost {
  constructor(postId) {
    this.storageKeyName = "postList"
    this.postId = postId
  }

  // 得到全部文章信息
  getAllPostData() {
    let res = wx.getStorageSync(this.storageKeyName)
    if (!res) {
      res = require("./data/data.js").postList
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
    for (let i = 0; i < len; i++) {
      if (postsData[i].postId == this.postId) {
        return {
          // 当前文章在缓存数据库数组中的序号
          index: i,
          data: postsData[i]
        }
      }
    }
  }

  //收藏
  collect() {
    return this.updatePostData("collect")
  }

  //点赞
  up() {
    let data = this.updatePostData("up")
    return data
  }

  //更新本地的点赞、评论信息、收藏、阅读量
  updatePostData(category, newComment) {
    let itemData = this.getPostItemById(),
      postData = itemData.data,
      allPostData = this.getAllPostData()
    switch (category) {
      case "collect":
        //处理收藏
        if (!postData.collectionStatus) {
          //如果当前状态是未收藏
          postData.collectionNum++
          postData.collectionStatus = true
        } else {
          // 如果当前状态是收藏
          postData.collectionNum--
          postData.collectionStatus = false
        }
        break
      case "up":
        if (!postData.upStatus) {
          postData.upNum++
          postData.upStatus = true
        } else {
          postData.upNum--
          postData.upStatus = false
        }
        break
      case "comment":
        postData.comments.push(newComment)
        postData.commentNum++
        break
      case "reading":
        postData.readingNum++
        break
      default:
        break
    }
    // 更新缓存数据库
    allPostData[itemData.index] = postData
    this.execSetStorageSync(allPostData)
    return postData
  }
}

export { DBPost }
