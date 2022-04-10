const bcrypt = require('bcrypt')
const passport = require('koa-passport')
const LocalStrategy = require('passport-local')

passport.use(new LocalStrategy(async function verify (username, password, cb) {
  const user = bared.services.get('user', { username })

  if (!user) {
    return cb(null, false, { message: 'Incorrect username or password.' })
  }

  const verified = bcrypt.compareSync(password, user.password)

  if (!verified) {
    return cb(null, false, { message: 'Incorrect username or password.' })
  }

  return cb(null, user)
}))

module.exports = passport
