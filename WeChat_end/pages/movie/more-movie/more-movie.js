let app = getApp()
let util = require('../../../util/util.js')
Page({
  data: {
    movies: []
  },
  onLoad: function (options) {
    let category = options.category;
    this.data.navigateTitle = category;
    let dataUrl = "";
    switch (category) {
      case "正在热映":
        dataUrl = `${app.globalData.doubanBase}/v2/movie/in_theaters`;
        break;
      case "即将上映":
        dataUrl = `${app.globalData.doubanBase}/v2/movie/coming_soon`;
        break;
      case "豆瓣Top250":
        dataUrl = `${app.globalData.doubanBase}/v2/movie/top250`;
        break;
    }
    this.data.requestUrl = dataUrl
    util.http(dataUrl, this.processDoubanData)
  },

  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })
    wx.showNavigationBarLoading()
  },

  processDoubanData: function (moviesDouban) {
    let movies = [];
    for (let idx in moviesDouban.subjects) {
      let subject = moviesDouban.subjects[idx];
      let title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      let temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }
    let totalMovies = []
    totalMovies = this.data.movies.concat(movies)
    this.setData({
      movies: totalMovies
    })
    wx.stopPullDownRefresh()
    //隐藏loading状态
    wx.hideNavigationBarLoading()
  },

  onPullDownRefresh: function (event) {
    let refreshUrl = `${this.data.requestUrl}?star=0&count=20`;
    //刷新页面后将页面所有初始化参数恢复到初始值
    this.data.movies = [];
    util.http(refreshUrl, this.processDoubanData)
    //显示loading状态
    wx.showNavigationBarLoading()
  },

  onReachBottom: function (event) {
    let totalCount = this.data.movies.length;
    //拼接下一组数据的URL
    let nextUrl = `${this.data.requestUrl}?start=${totalCount}&count=20`;
    util.http(nextUrl, this.processDoubanData)
    //显示loading状态
    wx.showNavigationBarLoading()
  },

  onMovieTap: function (event) {
    let movieId = event.currentTarget.dataset.movieId;
    wx.navigateTo({
      url: `../movie-detail/movie-detail?id=${movieId}`
    })
  }
})