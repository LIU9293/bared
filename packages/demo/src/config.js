module.exports = {
  client: 'mysql2',
  connection: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS || '12345',
    database: process.env.DATABASE || 'moghub'
  }
}
