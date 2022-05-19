const Knex = require('knex')

function registerDatabase (config) {
  const knex = Knex(config)
  return knex
}

module.exports = registerDatabase
