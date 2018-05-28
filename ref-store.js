const {
  curryN, flow, get, invoke, join, map, set,
} = require('lodash/fp')
const { invokeArg } = require('cape-lodash')
// Getter Helpers
function storeHelpers(getState) {
  return {
    get: path => get(path, getState()),
    selector: select => () => select(getState()),
  }
}

function createRefStore(initState = {}) {
  let state = initState
  const getState = () => state
  return {
    ...storeHelpers(getState),
    getState,
    clear: () => { state = initState },
    invoke: path => invoke(path, getState()),
    set: (path, value) => { state = set(path, value, getState()) },
    // onStop is an object with each value is a func. stop calls all those functions.
    stop: () => flow(get('onStop'), map(invokeArg))(getState())
  }
}
// handleStop

module.exports = {
  storeHelpers,
  createRefStore,
}
