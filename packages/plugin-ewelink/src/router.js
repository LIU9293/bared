module.exports = [
  {
    url: '/ewelink_auth',
    method: 'GET',
    controller: async (ctx) => {
      const { code, state } = ctx.request.query
      const res = await ctx.services.ewelinkAccountAuth(ctx, { code, state })

      ctx.send(res)
    },
    public: true,
    description: 'ewelink callback'
  }
]