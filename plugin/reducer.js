const {
  curry, flow, get, getOr, isString, mapValues, partial, set, startsWith,
} = require('lodash/fp')
const { bindActionCreators } = require('redux')
const {
  createAction, createReducer, createSimpleAction, noopAction,
} = require('cape-redux')
const { mergeWith, setKey } = require('cape-lodash')
const { createActionType } = require('./store-utils')

// PLUGIN REDUCER
const setValue = (state, { path, value }) => set(path, value, state)
const setMsg = setKey('statusMessage')
const reducers = {
  [PLUGIN_DEBUG]: setKey('debug'),
  [PLUGIN_LISTENING]: set('listening', true),
  [PLUGIN_SET]: setValue,
  [PLUGIN_STARTED]: set('started', true),
  [PLUGIN_STOPPED]: mergeWith({ started: false, listening: false }),
  [PLUGIN_MSG]: setMsg,
}
const initState = {
  data: null,
  debug: null,
  errorMsg: null,
  hasError: null,
  listening: null,
  started: null,
  stopped: null,
}
const pluginReducer = createReducer(reducers, initState)

function pluginsReducer(state = {}, action) {
  if (!isPluginType(action.type)) return state
  if (!isString(get('meta.pluginId', action))) {
    throw new Error('Action must contain meta.pluginId. Please use plugin dispatcher.')
  }
  // Get the state slice we need for this action.
  const path = [action.meta.pluginId, action.meta.instanceId || 'base']
  const oldState = get(path, state)
  const newState = pluginReducer(oldState, action)
  // Do not create a new object if there is not change.
  if (oldState === newState) return state
  return set(path, newState, state)
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
