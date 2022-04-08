
module.exports = {
  tableName: 'timer',
  displayName: '计时器',
  attributes: {
    user_id: { type: 'integer', required: true },
    title: { type: 'string', required: true },
    cover: { type: 'string', default: '' },
    config: { type: 'json', required: true },
    is_public: { type: 'boolean', default: false },
    timer_list_id: { type: 'integer' }
  }
}
