// pages/movies/movies.js
let util = require('../../util/util.js')
let app = getApp();
Page({
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    containerShow: true,
    searchPanelShow: false,
    searchResult: {},
  },
  onLoad: function(event) {
    let inTheatersUrl = `${app.globalData.doubanBase}/v2/movie/in_theaters?start=0&count=3`;
    let comingSoonUrl = `${app.globalData.doubanBase}/v2/movie/coming_soon?start=0&count=3`;
    let top250Url = `${app.globalData.doubanBase}/v2/movie/top250?start=0&count=3`;

    wx.showNavigationBarLoading();

    this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
    this.getMovieListData(top250Url, "top250", "豆瓣Top250");
  },
  getMovieListData: function(url, settedKey, categoryTitle) {
    let that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "content-type": "json"
      },
      success: res => {
        that.processDoubanData(res.data, settedKey, categoryTitle)
      },
      fail: error => {
        console.log(error)
      }
    })
  },
  processDoubanData: function(moviesDouban, settedKey, categoryTitle) {
    let movies = [];
    for (let idx in moviesDouban.subjects) {
      let subject = moviesDouban.subjects[idx];
      let title = subject.title;
      if (title.length >= 6) {
        // 电影标题只取前6个字符
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
    let readyData = {};
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    }
    this.setData(readyData)
    wx.hideNavigationBarLoading()
  },
  onMoreTap: function(event) {
    let category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: `more-movie/more-movie?category=${category}`
    })
  },
  onMovieTap: function(event) {
    let movieId = event.currentTarget.dataset.movieId
    wx.navigateTo({
      url: `movie-detail/movie-detail?id=${movieId}`
    })
  },
  onBindFocus: function(event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },
  onCancelImgTap: function(event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {},
      inputValue: ''
    }
    )
  },
  onBindConfirm: function(event) {
    let keyWord = event.detail.value;
    let searchUrl = `${app.globalData.doubanBase}/v2/movie/search?q=${keyWord}`;
    this.getMovieListData(searchUrl, "searchResult", "");
  }
})