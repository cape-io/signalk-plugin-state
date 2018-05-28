const _ = require('lodash/fp')
const { invokeArg } = require('cape-lodash')

const ON_STOP = 'onStop'

// Getter Helpers
function storeHelpers(getState) {
  return {
    get: path => _.get(path, getState()),
    selector: select => () => select(getState()),
  }
}

const createAddInterval = refSet => (id, func, seconds) => {
  const intervalId = setInterval(func, seconds * 1000)
  const rmInterval = _.partial(clearInterval, [intervalId])
  refSet([ON_STOP, id], rmInterval)
}
const createStop = (clear, get) => () => {
  const res = _.mapValues(invokeArg, get(ON_STOP))
  clear()
  return res
}

function createRefStore(initState = {}) {
  let state = initState
  const getState = () => state
  const set = _.curry((path, value) => { state = _.set(path, value, getState()) })
  const clear = () => { state = initState }
  const { get, selector } = storeHelpers(getState)
  return {
    addInterval: createAddInterval(set),
    clear,
    get,
    selector,
    getState,
    invoke: path => _.invoke(path, getState()),
    set,
    // onStop is an object with each value is a func. stop calls all those functions.
    stop: createStop(clear, get),
  }
}
// handleStop

module.exports = {
  ON_STOP,
  storeHelpers,
  createRefStore,
}
