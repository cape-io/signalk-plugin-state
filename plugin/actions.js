const {
  curry, flow, get, getOr, isString, mapValues, partial, set, startsWith,
} = require('lodash/fp')
const { bindActionCreators } = require('redux')
const {
  createAction, createReducer, createSimpleAction, noopAction,
} = require('cape-redux')
const { mergeWith, setKey } = require('cape-lodash')
const { createActionType } = require('./store-utils')

// PLUGIN ACTIONS
// @TODO Need to accept instance specific state.

const PLUGIN_PREFIX = 'plugin'
const pluginType = createActionType(PLUGIN_PREFIX)
const isPluginType = startsWith(PLUGIN_PREFIX)

const PLUGIN_DATA = pluginType('DATA')
const pluginStop = createSimpleAction(PLUGIN_DATA)

const PLUGIN_DEBUG = pluginType('DEBUG')
const serialDebug = createSimpleAction(PLUGIN_DEBUG)

const PLUGIN_ERROR = pluginType('ERROR')
const pluginError = createAction(PLUGIN_ERROR)

const PLUGIN_LISTENING = pluginType('LISTENING')
const pluginListening = createAction(PLUGIN_LISTENING)

const PLUGIN_MSG = pluginType('MSG')
const pluginSetMsg = createSimpleAction(PLUGIN_MSG)

const PLUGIN_SET = pluginType('SET')
const pluginSetPayload = curry((path, value) => ({ path, value }))
const pluginSet = createSimpleAction(PLUGIN_SET, pluginSetPayload)

const PLUGIN_STARTED = pluginType('STARTED')
const pluginStarted = noopAction(PLUGIN_STARTED)

const PLUGIN_STOPPED = pluginType('STOPPED')
const serialData = createSimpleAction(PLUGIN_STOPPED)

const pluginActions = {
  data: serialData,
  debug: serialDebug,
  error: pluginError,
  listening: pluginListening,
  setMsg: pluginSetMsg,
  set: pluginSet,
  started: pluginStarted,
  stopped: pluginStop,
}

// Attach dispatch to the actions.
const bindPluginActions = partial(bindActionCreators, [pluginActions])

const selectors = {
  getStatusMessage: get('statusMessage'),
}
const getSelectors = getState =>
  mapValues(item => flow(getState, item), selectors)

// CREATE PLUGIN STORE
const addPluginId = set('meta.pluginId')
const createPluginDispatch = curry((dispatch, pluginId) =>
  flow(addPluginId(pluginId), dispatch))
const addPluginInstanceId = set('meta.instanceId')
const pluginInstanceDispatch = curry((dispatch, instanceId) =>
  flow(addPluginInstanceId(instanceId), dispatch))

const createInstanceStore = curry((getState, dispatch, instanceId) => {
  const instanceDispatch = pluginInstanceDispatch(dispatch, instanceId)
  return {
    ...bindPluginActions(instanceDispatch),
    dispatch: instanceDispatch,
    getState: flow(getState, getOr({}, instanceId, {})),
  }
})

function createPluginStore({ getState, dispatch }, pluginId) {
  // Plugin scope dispatch function. Simply adds meta.pluginId prop.
  const pluginDispatch = createPluginDispatch(dispatch, pluginId)
  // Plugin scope getState. Gets plugin[pluginId].
  const pluginGetState = flow(getState, getOr({}, ['plugin', pluginId]))
  return {
    ...bindPluginActions(pluginDispatch),
    dispatch: pluginDispatch,
    getState: pluginGetState,
    createInstanceStore: createInstanceStore(pluginGetState, pluginDispatch),
  }
}

module.exports = {
  bindPluginActions,
  createPluginStore,
  getSelectors,
  pluginActions,
  createPluginDispatch,
  pluginInstanceDispatch,
  pluginsReducer,
}
