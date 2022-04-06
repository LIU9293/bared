module.exports = {
  tableName: 'comment',
  attributes: {
    user_id: { type: 'integer' },
    post_id: { type: 'integer' },
    content: { type: 'string' }
  }
}
