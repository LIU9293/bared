
module.exports = {
  tableName: 'timer',
  attributes: {
    user_id: { type: 'integer', required: true },
    title: { type: 'string', required: true },
    cover: { type: 'string', default: '' },
    config: { type: 'json', required: true },
    is_public: { type: 'boolean', default: false }
  }
}
