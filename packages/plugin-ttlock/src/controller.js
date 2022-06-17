module.exports = {
  async getLockById (ctx) {
    const { lockId } = ctx.request.params
    const lock = await ctx.queries.get('ttlock_lock', { lockId })

    if (!lock) {
      return ctx.badRequest(`lock not found for id ${lockId}`)
    }

    return ctx.ok(lock)
  }
}