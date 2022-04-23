module.exports = {
  tableName: 'error',
  displayName: 'Error',
  hideInAdmin: true,
  attributes: {
    user_id: {
      type: 'integer',
      join: {
        table: 'user',
        via: 'id'
      }
    },
    code: {
      type: 'integer',
      required: true,
      tableConfig: {
        defaultShow: true
      }
    },
    url: {
      type: 'string',
      default: '',
      required: false
    },
    method: {
      type: 'enum',
      enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      required: false
    },
    message: {
      type: 'string',
      default: '',
      required: true,
      tableConfig: {
        defaultShow: true
      }
    },
    error_trace: { type: 'text', default: '' },
    raw_request: { type: 'json', required: false }
  }
}
