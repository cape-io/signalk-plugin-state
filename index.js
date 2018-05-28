const { createRefStore } = require('./ref-store')

function fillApp(oldApp) {
  return {
    ...oldApp,
    ref: createRefStore(),
  }
}

function pluginStop(filledApp, stop) {
  return () => Promise.resolve(stop()).then((res) => {
    filledApp.ref.clear()
    return res
  })
}

function wrapPlugin(initPlugin) {
  return (app) => {
    const filledApp = fillApp(app)
    const plugin = initPlugin(filledApp)
    plugin.stop = pluginStop(filledApp, plugin.stop)
    return plugin
  }
}

module.exports = wrapPlugin
