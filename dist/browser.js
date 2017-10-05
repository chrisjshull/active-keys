// Module: active-keys@0.2.0
// License: Apache-2.0
//
// Module: event-target-shim@2.0.0
// License: MIT
//
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.KeyWatcher = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KeyWatcher = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _eventTargetShim = require('event-target-shim');

var _eventTargetShim2 = _interopRequireDefault(_eventTargetShim);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*!
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright (C) 2017 Dremio Corporation
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under the Apache License, Version 2.0 (the "License");
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/* eslint no-bitwise: 0 */

/**
 * Base module for active-keys.
 * Default export is singleton instance of KeyWatcher.
 * @module index
 * @example
 * import keyWatcher from 'active-keys';
 * keyWatcher.addEventListener('change', () => {
 *   console.log(Object.keys(keyWatcher.activeKeys));
 * });
 */

/**
 * Tracks which keys are currently held down.
 */
var KeyWatcher = exports.KeyWatcher = function (_EventTargetShim) {
  _inherits(KeyWatcher, _EventTargetShim);

  /**
   * @method module:index.KeyWatcher#addEventListener
   * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
   */
  /**
   * @method module:index.KeyWatcher#removeEventListener
   * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
   */

  /**
   * Object of which keyboard keys are currently held down.
   * Object keys are {@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values|KeyboardEvent#key}.
   * Object values should be treated as truthy/falsy only.
   * @fires {@link module:index.KeyWatcher#change|change} when updated.
   */
  function KeyWatcher() {
    _classCallCheck(this, KeyWatcher);

    var _this = _possibleConstructorReturn(this, (KeyWatcher.__proto__ || Object.getPrototypeOf(KeyWatcher)).call(this));

    _this.activeKeys = {};
    _this._isListeningForEventsWithModifierKeys = false;


    window.addEventListener('keydown', _this);
    window.addEventListener('keyup', _this);
    window.addEventListener('blur', _this);
    return _this;
  }

  _createClass(KeyWatcher, [{
    key: '_destroy',
    value: function _destroy() {
      window.removeEventListener('keydown', this);
      window.removeEventListener('keyup', this);
      window.removeEventListener('blur', this);
      this._forEachEventWithModifierKeys('removeEventListener');
    }
  }, {
    key: '_forEachEventWithModifierKeys',
    value: function _forEachEventWithModifierKeys(method) {
      var opts = PASSIVE_SUPPORTED ? { passive: true, capture: true } : true;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = EVENTS_WITH_MODIFIER_KEYS[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var eventType = _step.value;

          window[method](eventType, this, opts);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    /**
     * @private
     */

  }, {
    key: 'handleEvent',
    value: function handleEvent(evt) {
      var typeHandler = '_handle' + evt.type[0].toUpperCase() + evt.type.slice(1);
      var ret = void 0;
      if (this[typeHandler]) {
        ret = this[typeHandler](evt);
      } else if (EVENTS_WITH_MODIFIER_KEYS.has(evt.type)) {
        ret = this._handleEventWithModifierKey(evt);
      } else {
        console.warn('No event handler for "' + evt.type + '" on KeyWatcher.');
      }

      if (this._isListeningForEventsWithModifierKeys !== this._eventModifierKeyIsActive) {
        if (this._isListeningForEventsWithModifierKeys) {
          this._isListeningForEventsWithModifierKeys = false;
          this._forEachEventWithModifierKeys('removeEventListener');
        } else {
          this._isListeningForEventsWithModifierKeys = true;
          this._forEachEventWithModifierKeys('addEventListener');
        }
      }

      return ret;
    }
  }, {
    key: '_handleEventWithModifierKey',
    value: function _handleEventWithModifierKey(evt) {
      var changed = this._removeStuckModifiers(evt);
      changed && this._dispatch();
    }
  }, {
    key: '_handleKeydown',
    value: function _handleKeydown(evt) {
      var key = evt.key,
          location = evt.location;

      var _handleModifiers2 = this._handleModifiers(key),
          _handleModifiers3 = _slicedToArray(_handleModifiers2, 2),
          newKey = _handleModifiers3[0],
          changed = _handleModifiers3[1];

      key = newKey;

      changed = this._removeStuckModifiers(evt) || changed; // always do _removeStuckModifiers()

      if (key) {
        var wasActive = this.activeKeys[key] = this.activeKeys[key] || 0;
        var bitwise = 1 << location;

        if (!(this.activeKeys[key] & bitwise)) {
          this.activeKeys[key] |= bitwise;
          if (!wasActive) changed = true;
        }
      }

      changed && this._dispatch();
    }
  }, {
    key: '_handleKeyup',
    value: function _handleKeyup(evt) {
      var key = evt.key,
          location = evt.location;

      var _handleModifiers4 = this._handleModifiers(key),
          _handleModifiers5 = _slicedToArray(_handleModifiers4, 2),
          newKey = _handleModifiers5[0],
          changed = _handleModifiers5[1];

      key = newKey;

      changed = this._removeStuckModifiers(evt) || changed; // always do _removeStuckModifiers()

      if (key) {
        if (this.activeKeys[key]) {

          var bitwiseInverse = ~(1 << location);

          this.activeKeys[key] &= bitwiseInverse;
          if (!this.activeKeys[key]) {
            delete this.activeKeys[key];
            changed = true;
          }
        }
      }

      changed && this._dispatch();
    }
  }, {
    key: '_handleBlur',
    value: function _handleBlur() {
      // once the window/tab/frame loses focus we won't get keyup events
      // so err on the side of a full reset.
      // e.g. new tab, app switching, print dialog
      this._removeAll();
    }
  }, {
    key: '_removeAll',
    value: function _removeAll() {
      // maintain the object reference
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = Object.keys(this.activeKeys)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var activeKey = _step2.value;

          delete this.activeKeys[activeKey];
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      this._dispatch();
    }
  }, {
    key: '_isNamedKey',
    value: function _isNamedKey(key) {
      return key.match(/^[A-Z][a-zA-Z0-9]+$/); // named keys match this pattern, while unnamed keys cannot (https://www.w3.org/TR/2017/CR-uievents-key-20170601/)
    }
  }, {
    key: '_isModifierKey',
    value: function _isModifierKey(key) {
      // these are the keys the spec specifies: https://www.w3.org/TR/2017/CR-uievents-key-20170601/#selecting-key-attribute-values
      if (key === 'Shift' || key === 'CapsLock' || key === 'AltGraph') {
        return true;
      }

      // These also have impact though.
      if (key === 'Meta' || key === 'Alt' || key === 'Control') {
        return true;
      }

      return false;
    }
  }, {
    key: '_removeNonModifierKeys',
    value: function _removeNonModifierKeys() {
      var removed = false;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = Object.keys(this.activeKeys)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var activeKey = _step3.value;

          if (this._isModifierKey(activeKey)) continue;
          delete this.activeKeys[activeKey];
          removed = true;
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return removed;
    }
  }, {
    key: '_removeStuckModifiers',
    value: function _removeStuckModifiers(_ref) {
      var altKey = _ref.altKey,
          ctrlKey = _ref.ctrlKey,
          metaKey = _ref.metaKey,
          shiftKey = _ref.shiftKey;

      var changed = false;
      if (this.activeKeys.Alt && !altKey) {
        delete this.activeKeys.Alt;
        changed = true;
      }
      if (this.activeKeys.Control && !ctrlKey) {
        delete this.activeKeys.Control;
        changed = true;
      }
      if (this.activeKeys.Meta && !metaKey) {
        delete this.activeKeys.Meta;
        changed = true;
      }
      if (this.activeKeys.Shift && !shiftKey) {
        delete this.activeKeys.Shift;
        changed = true;
      }
      return changed;
    }
  }, {
    key: '_handleModifiers',
    value: function _handleModifiers(key) {
      var changed = false;

      // Safety for browser/OS shortcuts
      // While Chrome might be detected with missing keypress, FF cannot be.
      // So lacking a better idea for now, being a bit aggressive...
      // Also handles respected modifier safety.
      if (this._isNamedKey(key)) {
        changed = this._removeNonModifierKeys() || changed; // always do _removeNonModifierKeys()
      }

      // The Dead key can also get stuck, and it's not a real key, so just ignore it.
      // e.g. on a US Mac keyboard;
      // - down:e, down:Alt [down:Dead], up:alt, up:e -> Dead
      return [key === 'Dead' ? null : key, changed];
    }
  }, {
    key: '_dispatch',
    value: function _dispatch() {
      /**
       * Event fired when {@link module:index.KeyWatcher#activeKeys|activeKeys} changes.
       * @event module:index.KeyWatcher#change
       */
      var event = new Event('change', {
        bubbles: false,
        cancelable: false
      });
      this.dispatchEvent(event);
    }
  }, {
    key: '_eventModifierKeyIsActive',
    get: function get() {
      return !!(this.activeKeys.Alt || this.activeKeys.Control || this.activeKeys.Meta || this.activeKeys.Shift);
    }
  }]);

  return KeyWatcher;
}(_eventTargetShim2.default);

exports.default = new KeyWatcher();

// not sure if this is complete. Likely need to add more over time:
// (KeyboardEvents skipped because keyup/keydown already handled and should suffice)

var EVENTS_WITH_MODIFIER_KEYS = new Set('\ntouchstart\ntouchend\ntouchmove\ntouchcancel\n\nclick\ndblclick\nmousedown\nmouseenter\nmouseleave\nmousemove\nmouseout\nmouseover\nmouseup\ncontextmenu\n\ndragstart\ndrag\ndragenter\ndragexit\ndragleave\ndragover\ndrop\ndragend\n\nwheel\n'.split('\n').filter(Boolean));

var PASSIVE_SUPPORTED = function () {
  var passiveSupported = false;

  try {
    var options = Object.defineProperty({}, 'passive', {
      get: function get() {
        passiveSupported = true;
      }
    });

    window.addEventListener('passive-support-test', null, options);
  } catch (error) {
    // ignore
  }
  return passiveSupported;
}();
},{"event-target-shim":4}],2:[function(require,module,exports){
/**
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

/**
 * Creates a unique key.
 *
 * @param {string} name - A name to create.
 * @returns {symbol|string} Generated unique key.
 * @private
 */
var createUniqueKey = module.exports.createUniqueKey = (
    typeof Symbol !== "undefined" ? Symbol : //eslint-disable-line no-undef
    /* otherwise */ function createUniqueKey(name) {
        return "[[" + name + "_" + Math.random().toFixed(8).slice(2) + "]]"
    }
)

/**
 * Checks whether the given value is a non-null object or not.
 *
 * @param {any} x - The value to be check.
 * @returns {boolean} `true` if the value is a non-null object.
 * @private
 */
var isObject = module.exports.isObject = function isObject(x) {
    return typeof x === "object" && x !== null
}

/**
 * The key of listeners.
 *
 * @type {symbol|string}
 * @private
 */
module.exports.LISTENERS = createUniqueKey("listeners")

/**
 * A value of kind for listeners which are registered in the capturing phase.
 *
 * @type {number}
 * @private
 */
module.exports.CAPTURE = 1

/**
 * A value of kind for listeners which are registered in the bubbling phase.
 *
 * @type {number}
 * @private
 */
module.exports.BUBBLE = 2

/**
 * A value of kind for listeners which are registered as an attribute.
 *
 * @type {number}
 * @private
 */
module.exports.ATTRIBUTE = 3

/**
 * @typedef object ListenerNode
 * @property {function} listener - A listener function.
 * @property {number} kind - The kind of the listener.
 * @property {ListenerNode|null} next - The next node.
 *      If this node is the last, this is `null`.
 */

/**
 * Creates a node of singly linked list for a list of listeners.
 *
 * @param {function} listener - A listener function.
 * @param {number} kind - The kind of the listener.
 * @param {object} [options] - The option object.
 * @param {boolean} [options.once] - The flag to remove the listener at the first call.
 * @param {boolean} [options.passive] - The flag to ignore `event.preventDefault` method.
 * @returns {ListenerNode} The created listener node.
 */
module.exports.newNode = function newNode(listener, kind, options) {
    var obj = isObject(options)

    return {
        listener: listener,
        kind: kind,
        once: obj && Boolean(options.once),
        passive: obj && Boolean(options.passive),
        next: null,
    }
}

},{}],3:[function(require,module,exports){
/**
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

var Commons = require("./commons")
var LISTENERS = Commons.LISTENERS
var ATTRIBUTE = Commons.ATTRIBUTE
var newNode = Commons.newNode

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

/**
 * Gets a specified attribute listener from a given EventTarget object.
 *
 * @param {EventTarget} eventTarget - An EventTarget object to get.
 * @param {string} type - An event type to get.
 * @returns {function|null} The found attribute listener.
 */
function getAttributeListener(eventTarget, type) {
    var node = eventTarget[LISTENERS][type]
    while (node != null) {
        if (node.kind === ATTRIBUTE) {
            return node.listener
        }
        node = node.next
    }
    return null
}

/**
 * Sets a specified attribute listener to a given EventTarget object.
 *
 * @param {EventTarget} eventTarget - An EventTarget object to set.
 * @param {string} type - An event type to set.
 * @param {function|null} listener - A listener to be set.
 * @returns {void}
 */
function setAttributeListener(eventTarget, type, listener) {
    if (typeof listener !== "function" && typeof listener !== "object") {
        listener = null // eslint-disable-line no-param-reassign
    }

    var prev = null
    var node = eventTarget[LISTENERS][type]
    while (node != null) {
        if (node.kind === ATTRIBUTE) {
            // Remove old value.
            if (prev == null) {
                eventTarget[LISTENERS][type] = node.next
            }
            else {
                prev.next = node.next
            }
        }
        else {
            prev = node
        }

        node = node.next
    }

    // Add new value.
    if (listener != null) {
        if (prev == null) {
            eventTarget[LISTENERS][type] = newNode(listener, ATTRIBUTE)
        }
        else {
            prev.next = newNode(listener, ATTRIBUTE)
        }
    }
}

//-----------------------------------------------------------------------------
// Public Interface
//-----------------------------------------------------------------------------

/**
 * Defines an `EventTarget` implementation which has `onfoobar` attributes.
 *
 * @param {EventTarget} EventTargetBase - A base implementation of EventTarget.
 * @param {string[]} types - A list of event types which are defined as attribute listeners.
 * @returns {EventTarget} The defined `EventTarget` implementation which has attribute listeners.
 */
module.exports.defineCustomEventTarget = function(EventTargetBase, types) {
    /**
     * The constructor of custom event target.
     * @constructor
     */
    function EventTarget() {
        EventTargetBase.call(this)
    }

    var descripter = {
        constructor: {
            value: EventTarget,
            configurable: true,
            writable: true,
        },
    }

    types.forEach(function(type) {
        descripter["on" + type] = {
            get: function() {
                return getAttributeListener(this, type)
            },
            set: function(listener) {
                setAttributeListener(this, type, listener)
            },
            configurable: true,
            enumerable: true,
        }
    })

    EventTarget.prototype = Object.create(EventTargetBase.prototype, descripter)

    return EventTarget
}

},{"./commons":2}],4:[function(require,module,exports){
/**
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

/*globals window */

var Commons = require("./commons")
var CustomEventTarget = require("./custom-event-target")
var EventWrapper = require("./event-wrapper")
var isObject = Commons.isObject
var LISTENERS = Commons.LISTENERS
var CAPTURE = Commons.CAPTURE
var BUBBLE = Commons.BUBBLE
var ATTRIBUTE = Commons.ATTRIBUTE
var newNode = Commons.newNode
var defineCustomEventTarget = CustomEventTarget.defineCustomEventTarget
var createEventWrapper = EventWrapper.createEventWrapper
var STOP_IMMEDIATE_PROPAGATION_FLAG = EventWrapper.STOP_IMMEDIATE_PROPAGATION_FLAG
var PASSIVE_LISTENER_FLAG = EventWrapper.PASSIVE_LISTENER_FLAG

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

/**
 * A flag which shows there is the native `EventTarget` interface object.
 *
 * @type {boolean}
 * @private
 */
var HAS_EVENTTARGET_INTERFACE = (
    typeof window !== "undefined" &&
    typeof window.EventTarget !== "undefined"
)

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * An implementation for `EventTarget` interface.
 *
 * @constructor
 * @public
 */
var EventTarget = module.exports = function EventTarget() {
    if (this instanceof EventTarget) {
        // this[LISTENERS] is a Map.
        // Its key is event type.
        // Its value is ListenerNode object or null.
        //
        // interface ListenerNode {
        //     var listener: Function
        //     var kind: CAPTURE|BUBBLE|ATTRIBUTE
        //     var next: ListenerNode|null
        // }
        Object.defineProperty(this, LISTENERS, {value: Object.create(null)})
    }
    else if (arguments.length === 1 && Array.isArray(arguments[0])) {
        return defineCustomEventTarget(EventTarget, arguments[0])
    }
    else if (arguments.length > 0) {
        var types = Array(arguments.length)
        for (var i = 0; i < arguments.length; ++i) {
            types[i] = arguments[i]
        }

        // To use to extend with attribute listener properties.
        // e.g.
        //     class MyCustomObject extends EventTarget("message", "error") {
        //         //...
        //     }
        return defineCustomEventTarget(EventTarget, types)
    }
    else {
        throw new TypeError("Cannot call a class as a function")
    }
}

EventTarget.prototype = Object.create(
    (HAS_EVENTTARGET_INTERFACE ? window.EventTarget : Object).prototype,
    {
        constructor: {
            value: EventTarget,
            writable: true,
            configurable: true,
        },

        addEventListener: {
            value: function addEventListener(type, listener, options) {
                if (listener == null) {
                    return false
                }
                if (typeof listener !== "function" && typeof listener !== "object") {
                    throw new TypeError("\"listener\" is not an object.")
                }

                var capture = isObject(options) ? Boolean(options.capture) : Boolean(options)
                var kind = (capture ? CAPTURE : BUBBLE)
                var node = this[LISTENERS][type]
                if (node == null) {
                    this[LISTENERS][type] = newNode(listener, kind, options)
                    return true
                }

                var prev = null
                while (node != null) {
                    if (node.listener === listener && node.kind === kind) {
                        // Should ignore a duplicated listener.
                        return false
                    }
                    prev = node
                    node = node.next
                }

                prev.next = newNode(listener, kind, options)
                return true
            },
            configurable: true,
            writable: true,
        },

        removeEventListener: {
            value: function removeEventListener(type, listener, options) {
                if (listener == null) {
                    return false
                }

                var capture = isObject(options) ? Boolean(options.capture) : Boolean(options)
                var kind = (capture ? CAPTURE : BUBBLE)
                var prev = null
                var node = this[LISTENERS][type]
                while (node != null) {
                    if (node.listener === listener && node.kind === kind) {
                        if (prev == null) {
                            this[LISTENERS][type] = node.next
                        }
                        else {
                            prev.next = node.next
                        }
                        return true
                    }

                    prev = node
                    node = node.next
                }

                return false
            },
            configurable: true,
            writable: true,
        },

        dispatchEvent: {
            value: function dispatchEvent(event) {
                // If listeners aren't registered, terminate.
                var type = event.type
                var node = this[LISTENERS][type]
                if (node == null) {
                    return true
                }

                // Since we cannot rewrite several properties, so wrap object.
                var wrapped = createEventWrapper(event, this)

                // This doesn't process capturing phase and bubbling phase.
                // This isn't participating in a tree.
                var prev = null
                while (node != null) {
                    // Remove this listener if it's once
                    if (node.once) {
                        if (prev == null) {
                            this[LISTENERS][type] = node.next
                        }
                        else {
                            prev.next = node.next
                        }
                    }
                    else {
                        prev = node
                    }

                    // Call this listener
                    wrapped[PASSIVE_LISTENER_FLAG] = node.passive
                    if (typeof node.listener === "function") {
                        node.listener.call(this, wrapped)
                    }
                    else if (node.kind !== ATTRIBUTE && typeof node.listener.handleEvent === "function") {
                        node.listener.handleEvent(wrapped)
                    }

                    // Break if `event.stopImmediatePropagation` was called.
                    if (wrapped[STOP_IMMEDIATE_PROPAGATION_FLAG]) {
                        break
                    }

                    node = node.next
                }

                return !wrapped.defaultPrevented
            },
            configurable: true,
            writable: true,
        },
    }
)

},{"./commons":2,"./custom-event-target":3,"./event-wrapper":5}],5:[function(require,module,exports){
/**
 * @author Toru Nagashima
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

var createUniqueKey = require("./commons").createUniqueKey

//-----------------------------------------------------------------------------
// Constsnts
//-----------------------------------------------------------------------------

/**
 * The key of the flag which is turned on by `stopImmediatePropagation` method.
 *
 * @type {symbol|string}
 * @private
 */
var STOP_IMMEDIATE_PROPAGATION_FLAG =
    createUniqueKey("stop_immediate_propagation_flag")

/**
 * The key of the flag which is turned on by `preventDefault` method.
 *
 * @type {symbol|string}
 * @private
 */
var CANCELED_FLAG = createUniqueKey("canceled_flag")

/**
 * The key of the flag that it cannot use `preventDefault` method.
 *
 * @type {symbol|string}
 * @private
 */
var PASSIVE_LISTENER_FLAG = createUniqueKey("passive_listener_flag")

/**
 * The key of the original event object.
 *
 * @type {symbol|string}
 * @private
 */
var ORIGINAL_EVENT = createUniqueKey("original_event")

/**
 * Method definitions for the event wrapper.
 *
 * @type {object}
 * @private
 */
var wrapperPrototypeDefinition = Object.freeze({
    stopPropagation: Object.freeze({
        value: function stopPropagation() {
            var e = this[ORIGINAL_EVENT]
            if (typeof e.stopPropagation === "function") {
                e.stopPropagation()
            }
        },
        writable: true,
        configurable: true,
    }),

    stopImmediatePropagation: Object.freeze({
        value: function stopImmediatePropagation() {
            this[STOP_IMMEDIATE_PROPAGATION_FLAG] = true

            var e = this[ORIGINAL_EVENT]
            if (typeof e.stopImmediatePropagation === "function") {
                e.stopImmediatePropagation()
            }
        },
        writable: true,
        configurable: true,
    }),

    preventDefault: Object.freeze({
        value: function preventDefault() {
            if (this[PASSIVE_LISTENER_FLAG]) {
                return
            }
            if (this.cancelable === true) {
                this[CANCELED_FLAG] = true
            }

            var e = this[ORIGINAL_EVENT]
            if (typeof e.preventDefault === "function") {
                e.preventDefault()
            }
        },
        writable: true,
        configurable: true,
    }),

    defaultPrevented: Object.freeze({
        get: function defaultPrevented() {
            return this[CANCELED_FLAG]
        },
        enumerable: true,
        configurable: true,
    }),
})

//-----------------------------------------------------------------------------
// Public Interface
//-----------------------------------------------------------------------------

module.exports.STOP_IMMEDIATE_PROPAGATION_FLAG = STOP_IMMEDIATE_PROPAGATION_FLAG
module.exports.PASSIVE_LISTENER_FLAG = PASSIVE_LISTENER_FLAG

/**
 * Creates an event wrapper.
 *
 * We cannot modify several properties of `Event` object, so we need to create the wrapper.
 * Plus, this wrapper supports non `Event` objects.
 *
 * @param {Event|{type: string}} event - An original event to create the wrapper.
 * @param {EventTarget} eventTarget - The event target of the event.
 * @returns {Event} The created wrapper. This object is implemented `Event` interface.
 * @private
 */
module.exports.createEventWrapper = function createEventWrapper(event, eventTarget) {
    var timeStamp = (
        typeof event.timeStamp === "number" ? event.timeStamp : Date.now()
    )
    var propertyDefinition = {
        type: {value: event.type, enumerable: true},
        target: {value: eventTarget, enumerable: true},
        currentTarget: {value: eventTarget, enumerable: true},
        eventPhase: {value: 2, enumerable: true},
        bubbles: {value: Boolean(event.bubbles), enumerable: true},
        cancelable: {value: Boolean(event.cancelable), enumerable: true},
        timeStamp: {value: timeStamp, enumerable: true},
        isTrusted: {value: false, enumerable: true},
    }
    propertyDefinition[STOP_IMMEDIATE_PROPAGATION_FLAG] = {value: false, writable: true}
    propertyDefinition[CANCELED_FLAG] = {value: false, writable: true}
    propertyDefinition[PASSIVE_LISTENER_FLAG] = {value: false, writable: true}
    propertyDefinition[ORIGINAL_EVENT] = {value: event}

    // For CustomEvent.
    if (typeof event.detail !== "undefined") {
        propertyDefinition.detail = {value: event.detail, enumerable: true}
    }

    return Object.create(
        Object.create(event, wrapperPrototypeDefinition),
        propertyDefinition
    )
}

},{"./commons":2}]},{},[1])(1)
});