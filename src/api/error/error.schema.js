module.exports = {
  tableName: 'error',
  displayName: 'Error',
  hideInAdmin: true,
  attributes: {
    user_id: { type: 'integer' },
    code: { type: 'integer', required: true }, // 400, 500
    url: { type: 'string', default: '', required: false },
    method: { type: 'enum', enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], required: false },
    message: { type: 'string', default: '', required: true },
    error_trace: { type: 'text', default: '' },
    raw_request: { type: 'json', required: false }
  }
}
