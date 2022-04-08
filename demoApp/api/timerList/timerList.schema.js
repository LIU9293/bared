
module.exports = {
  tableName: 'timer_list',
  displayName: '计时器收录单',
  attributes: {
    cover: { type: 'string', default: '' },
    user_id: { type: 'integer', required: true },
    is_public: { type: 'boolean', default: true }
  }
}
