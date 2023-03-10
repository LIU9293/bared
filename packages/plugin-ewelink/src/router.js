module.exports = [
  {
    url: '/ewelink_auth',
    method: 'GET',
    controller: async (ctx) => {
      const { code, state } = ctx.request.query
      const res = await ctx.services.ewelinkAccountAuth(ctx, { code, state })
      ctx.send(`
        <div style="margin-top: 50px; text-align: center;">
          <h1>MOGHUB授权成功</h1>
          <h3>请关闭页面</h3>
        </div>
      `)
    },
    public: true,
    description: 'ewelink callback'
  }
]