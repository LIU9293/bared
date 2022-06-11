
module.exports = () => {
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
