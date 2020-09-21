import events from '../../../../iso-events/events.js'

export var stream

if (typeof(process) !== 'undefined' && process.release && process.release.name === 'node' && typeof (require) !== 'undefined') {
  stream = require('stream')
} else {
  stream = events.EventEmitter
}

export default stream
