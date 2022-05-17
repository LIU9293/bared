const getAuthType = require('./getAuthType')
const allowPublic = require('./allowPublic')
const allowBasic = require('./allowBasic')
const allowDeveloper = require('./allowDeveloper')

module.exports = {
  getAuthType,
  allowBasic,
  allowPublic,
  allowDeveloper
}
