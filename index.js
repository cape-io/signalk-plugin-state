const { createRefStore } = require('./ref-store')

function fillApp(oldApp) {
  return {
    ...oldApp,
    ref: createRefStore(),
  }
}

function wrapPlugin(initPlugin) {
  return app => {
    const plugin = initPlugin(fillApp(app))
    plugin.stop = () => {
      app.ref.clear()
      plugin.stop()
    }
  }
}

module.exports = wrapPlugin
