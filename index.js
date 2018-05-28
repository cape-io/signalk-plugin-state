const { createRefStore } = require('./ref-store')
const buildValidate = require('./schema')

function fillApp(oldApp) {
  return {
    ...oldApp,
    ref: createRefStore(),
  }
}

function pluginStop(app, stop) {
  return () => Promise.resolve(stop()).then((res) => {
    app.ref.clear()
    return res
  })
}
function pluginStart(app, schema, start) {
  const validate = buildValidate(schema)
  return (props) => {
    if (!validate(props)) {
      app.error('statusMessage', validate.error)
      return Promise.reject(validate.error)
    }
    return start()
  }
}

function wrapPlugin(initPlugin) {
  return (app) => {
    const filledApp = fillApp(app)
    const plugin = initPlugin(filledApp)
    plugin.stop = pluginStop(filledApp, plugin.stop)
    plugin.start = pluginStart(filledApp, plugin.schema, plugin.start)
    return plugin
  }
}

module.exports = wrapPlugin
