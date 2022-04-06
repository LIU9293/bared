module.exports = {
  async createPost (ctx) {
    const { title, cover, category } = ctx.request.body
    const { id } = ctx.state.user

    const postCreated = await bared.services.create('post', {
      title,
      cover,
      category,
      user_id: id
    })

    ctx.body = postCreated
  },

  async deletePost (ctx) {
    const { id } = ctx.request.body
    const post = await bared.services.get('post', { id })

    if (post.user_id !== ctx.state.user.id) {
      ctx.throw(403, 'not allowed')
    }

    const deleted = await bared.services.delete('post', { id })
    ctx.body = deleted
  },

  async getHotPost (ctx) {
    const data = await bared.services.getList('post')
    ctx.body = data
  }
}
