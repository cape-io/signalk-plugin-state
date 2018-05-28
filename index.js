const { createRefStore } = require('./ref-store')

function fillApp(oldApp, store, pluginName) {
  return {
    ...oldApp,
    ref: createRefStore(),
  }
}

module.exports = fillApp
