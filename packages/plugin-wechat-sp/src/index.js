
module.exports = config => {
  return {
    extendUserSchema: schema => {
      return {
        ...schema
      }
    },
    schemas: [],
    routers: [],
    middlewares: []
  }
}
