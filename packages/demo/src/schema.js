
module.exports = {
  tableName: 'timer',
  displayName: 'Timer',
  attributes: {
    user_id: {
      type: 'integer',
      required: true,
      join: {
        table: 'user',
        via: 'id'
      }
    },
    title: {
      type: 'string',
      required: true,
      tableConfig: {
        defaultShow: true
      }
    },
    cover: {
      type: 'string',
      required: false
    },
    config: {
      type: 'json',
      required: true
    },
    is_public: { type: 'boolean', default: false },
    timer_list_id: {
      type: 'integer',
      join: {
        table: 'timer_list',
        via: 'id'
      }
    }
  }
}
