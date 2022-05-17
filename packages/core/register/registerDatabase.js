const Knex = require('knex')

function registerDatabase (config) {
  const defaultConfig = {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '',
      database: 'bared'
    },
    acquireConnectionTimeout: 10000
  }

  const knex = Knex({
    ...defaultConfig,
    ...config
  })

  return knex
}

module.exports = registerDatabase
