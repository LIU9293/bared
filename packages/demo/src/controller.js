module.exports = {
  async addTimer (ctx) {
    const { config, title, cover, is_public = false } = ctx.request.body
    const { user } = ctx.state

    if (!title) {
      return ctx.badRequest('timer must has a title')
    }

    if (config.length < 1) {
      return ctx.badRequest('timer must has at least a section')
    }

    const created = await ctx.queries.create('timer', {
      user_id: user.id,
      title,
      cover,
      config: JSON.stringify(config),
      is_public
    })

    ctx.created(created)
  },

  async deleteTimer (ctx) {
    const { timerId } = ctx.request.body
    const { user } = ctx.state

    const timer = await ctx.queries.get('timer', { id: timerId })
    ctx.assert(timer, 400, 'timer not found')
    ctx.assert(timer.user_id === user.id, 400, 'Cannot delete timer owned by others')

    const res = await ctx.queries.delete('timer', { id: timerId })
    ctx.ok(res)
  },

  async getMyTimers (ctx) {
    const { start = 0, limit = 20 } = ctx.request.body
    const { user } = ctx.state

    const data = await ctx.queries.getList('timer', {
      _start: start,
      _limit: limit,
      user_id: user.id
    })

    const count = await ctx.queries.count('timer', {
      _start: start,
      _limit: limit,
      user_id: user.id
    })

    ctx.ok({ data, count })
  },

  async updateTimer (ctx) {
    ctx.body = 'wip'
  },

  async getTimerDetail (ctx) {
    ctx.body = 'wip'
  },

  async getTopTimers (ctx) {
    ctx.body = 'wip'
  }
}
