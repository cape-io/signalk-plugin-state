// const _ = require('lodash/fp')
const Ajv = require('ajv')

const ajv = new Ajv()

function buildValidate(schema) {
  return ajv.compile(schema)
}
module.exports = buildValidate
