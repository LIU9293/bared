
module.exports = {
  tableName: 'post',
  attributes: {
    user_id: { type: 'integer' },
    title: { type: 'string' },
    cover: { type: 'string' },
    rank: { type: 'integer' },
    category: { type: 'enum', enum: ['business', 'tech'] }
  }
}
