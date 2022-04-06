const { getHotPost, createPost, deletePost } = require('./controller')

module.exports = [
  {
    url: '/create-post',
    method: 'post',
    controller: createPost,
    public: false
  },
  {
    url: '/delete-post',
    method: 'post',
    controller: deletePost,
    public: false
  },
  {
    url: '/get-hot-post',
    method: 'get',
    controller: getHotPost,
    public: true
  }
]
