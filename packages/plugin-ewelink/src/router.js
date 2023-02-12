module.exports = [
  {
    url: '/ewelink_auth',
    method: 'GET',
    controller: async (ctx) => {
      const { code, state } = ctx.request.query
      return await ctx.services.ewelinkAccountAuth(ctx, { code, state })
    },
    public: true,
    description: 'ewelink callback'
  }
]