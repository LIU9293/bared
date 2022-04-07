module.exports = {
  async addTimer (ctx) {
    const { config, title, cover, is_public = false } = ctx.request.body
    const { user } = ctx.state

    if (!title) {
      ctx.throw(400, 'timer must has a title')
    }

    if (config.length < 1) {
      ctx.throw(400, 'timer must has at least a section')
    }

    const created = await bared.services.create('timer', {
      user_id: user.id,
      title,
      cover,
      config: JSON.stringify(config),
      is_public
    })

    ctx.body = created
  },

  async deleteTimer (ctx) {
    const { timerId } = ctx.request.body
    const res = await bared.services.delete('timer', { id: timerId })
    ctx.body = res
  },

  async getMyTimers (ctx) {
    const { start = 0, limit = 20 } = ctx.request.body
    const { user } = ctx.state

    const data = await bared.services.getList('timer', {
      _start: start,
      _limit: limit,
      user_id: user.id
    })

    const count = await bared.services.count('timer', {
      _start: start,
      _limit: limit,
      user_id: user.id
    })

    ctx.body = { data, count }
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
