/* globals describe test jest expect */
// const _ = require('lodash/fp')
const wrapPlugin = require('./index')

describe('wrapPlugin', () => {
  test('basic', async () => {
    expect(typeof wrapPlugin).toBe('function')
    const stop = jest.fn()
    const start = jest.fn()
    function initPlugin(app) {
      expect(typeof app.ref.clear).toBe('function')
      app.ref.set('foo', 'bar')
      return {
        start,
        stop,
        ref: app.ref,
        schema: { type: 'object' },
      }
    }
    const app = {
      error: jest.fn(),
    }
    const getPlugin = wrapPlugin(initPlugin)
    const plugin = getPlugin(app)
    expect(typeof plugin.stop).toBe('function')
    expect(plugin.ref.get('foo')).toBe('bar')
    await plugin.start({})
    await plugin.stop()
    expect(plugin.ref.get('foo')).toBe(undefined)
    expect(stop.mock.calls.length).toBe(1)
  })
})
