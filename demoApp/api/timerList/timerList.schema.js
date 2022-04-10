
module.exports = {
  tableName: 'timer_list',
  displayName: 'Timer List',
  attributes: {
    cover: { type: 'string', default: '' },
    user_id: { type: 'integer', required: true },
    is_public: { type: 'boolean', default: true }
  }
}
