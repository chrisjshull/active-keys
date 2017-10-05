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