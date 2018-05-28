/* globals describe test jest expect */
const _ = require('lodash/fp')
const { createRefStore, ON_STOP, storeHelpers } = require('./ref-store')

describe('createRefStore', () => {
  const func = jest.fn()
  const ref = createRefStore()
  ref.set('foo.bar', func)
  test('set and get work', () => {
    const foo = ref.get('foo')
    expect(foo.bar).toBe(func)
    const state = ref.getState()
    expect(state.foo.bar).toBe(func)
  })
  test('invoke will call func', () => {
    ref.invoke('foo.bar')
    expect(func.mock.calls.length).toBe(1)
    expect(func.mock.calls[0[0]]).toBe(undefined)
  })
})
describe('storeHelpers', () => {
  const getState = _.constant({ foo: { bar: 1, baz: 2 } })
  const store = storeHelpers(getState)
  test('shape', () => {
    expect(typeof store.get).toBe('function')
    expect(typeof store.selector).toBe('function')
  })
  test('get', () => {
    expect(store.get('foo.bar')).toBe(1)
    expect(store.get('foo.baz')).toBe(2)
  })
})
describe('clear', () => {
  test('clear reset state', () => {
    const func = jest.fn()
    const ref = createRefStore()
    const initState = ref.getState()
    ref.set('foo.bar', func)
    const state = ref.getState()
    expect(state).not.toBe(initState)
    ref.clear()
    expect(ref.getState()).toBe(initState)
  })
})

describe('stop', () => {
  const func = jest.fn()
  const ref = createRefStore()
  const initState = ref.getState()
  ref.set(['foo', 'bar'], func)
  ref.set([ON_STOP, 'bar'], func)
  const res = ref.stop()
  test('Calls clear internally.', () => {
    expect(ref.getState()).toBe(initState)
  })
  test('Called function within onStop', () => {
    expect(func.mock.calls.length).toBe(1)
    expect(func.mock.calls[0[0]]).toBe(undefined)
    expect(res).toEqual({ bar: undefined })
  })
})
function delay(func, wait) {
  return new Promise(resolve => _.delay(wait, _.flow(func, resolve)))
}

describe('addInterval', () => {
  const ref = createRefStore()
  const func = jest.fn()
  ref.addInterval('foo', func, 0.1)
  test('shape', async () => {
    expect.assertions(2)
    await delay(_.noop, 110)
    expect(func.mock.calls.length).toBe(1)
    ref.stop()
    await delay(_.noop, 110)
    expect(func.mock.calls.length).toBe(1)
  })
})
