Just playing around with different options that could be added to the app object to help developer manage plugin state. Hope to add to the server.

## Usage

```javascript
const wrapPlugin = require('signalk-plugin-state')

function initPlugin(app) {
  return {
    id: 'sk-example',
    name: 'SK Example Plugin',
    description: 'Something that does a think with SK.',
    schema,
    start: buildStart(app),
    stop: buildStop(app),
    // uiSchema,
  }
}

module.exports = wrapPlugin(initPlugin)

```

## API

### app.ref

Object with the following methods:

* `addInterval(id, func, seconds)` - Automatically cleared when `plugin.stop()` is called.
* `set(id, func)` - Set references to methods or values.
* `get(id)` - Returns method or value.
* `invoke(id)` - Calls reference method.
* `clear()` - Removes all references. Does not unsubscribe or similar. Just removes any saved refs.

## Helpers

* Any function added via `app.ref.set(['onClose', id])` will be called on `plugin.close()` automatically.
* Validation of plugin props against schema before sending to plugin.
* Calls `app.ref.clear()` on `plugin.close()`.
