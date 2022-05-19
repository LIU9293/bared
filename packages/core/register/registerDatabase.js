const Knex = require('knex')

function registerDatabase (config) {
  console.log('---knex config---')
  console.log(config)

  const knex = Knex(config)
  return knex
}

module.exports = registerDatabase
