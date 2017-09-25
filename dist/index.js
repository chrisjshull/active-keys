'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KeyWatcher = undefined;

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
 *   console.log(keyWatcher.activeKeys);
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

  function KeyWatcher() {
    _classCallCheck(this, KeyWatcher);

    var _this = _possibleConstructorReturn(this, (KeyWatcher.__proto__ || Object.getPrototypeOf(KeyWatcher)).call(this));

    _this.activeKeys = {};


    window.addEventListener('keydown', _this);
    window.addEventListener('keyup', _this);
    window.addEventListener('blur', _this);
    return _this;
  }

  /**
   * Object of which keyboard keys are currently held down.
   * Object keys are {@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values|KeyboardEvent#key}.
   * Object values should be treated as truthy/falsy only.
   * @fires {@link module:index.KeyWatcher#change|change} when updated.
   */


  _createClass(KeyWatcher, [{
    key: '_destroy',
    value: function _destroy() {
      window.removeEventListener('keydown', this);
      window.removeEventListener('keyup', this);
      window.removeEventListener('blur', this);
    }

    /**
     * @private
     */

  }, {
    key: 'handleEvent',
    value: function handleEvent(evt) {
      var typeHandler = '_handle' + evt.type[0].toUpperCase() + evt.type.slice(1);
      if (this[typeHandler]) this[typeHandler](evt);
    }
  }, {
    key: '_handleKeydown',
    value: function _handleKeydown(_ref) {
      var key = _ref.key,
          location = _ref.location;

      key = this._handleModifiers(key);
      if (!key) return;

      var wasActive = this.activeKeys[key] = this.activeKeys[key] || 0;
      var bitwise = 1 << location;

      if (this.activeKeys[key] & bitwise) return;

      this.activeKeys[key] |= bitwise;

      if (!wasActive) {
        this._dispatch();
      }
      // console.log(location, key, bitwise, this.activeKeys);
    }
  }, {
    key: '_handleKeyup',
    value: function _handleKeyup(_ref2) {
      var key = _ref2.key,
          location = _ref2.location;

      key = this._handleModifiers(key);
      if (!key) return;

      if (!this.activeKeys[key]) return;

      var bitwiseInverse = ~(1 << location);

      this.activeKeys[key] &= bitwiseInverse;
      if (!this.activeKeys[key]) {
        delete this.activeKeys[key];
        this._dispatch();
      }
      // console.log(location, evt.key, bitwiseInverse, this.activeKeys);
    }
  }, {
    key: '_handleBlur',
    value: function _handleBlur() {
      // once the window/tab/frame loses focus we won't get keyup events
      // so err on the side of a full reset
      this._removeAll();
    }
  }, {
    key: '_removeAll',
    value: function _removeAll() {
      // maintain the object reference
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.keys(this.activeKeys)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var activeKey = _step.value;

          delete this.activeKeys[activeKey];
        }

        //this._dispatch();
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
  }, {
    key: '_handleModifiers',
    value: function _handleModifiers(key) {
      // these glyph modifier keys *are* respected, and can cause previously pressed unnamed keys to get "stuck" active
      // so will err on the side of resetting all unnamed keys
      // https://www.w3.org/TR/2017/CR-uievents-key-20170601/#selecting-key-attribute-values
      if (key !== 'Shift' && key !== 'CapsLock' && key !== 'AltGraph') {
        // a similar situation can happen when a Dead key is hit.
        // e.g. on a US Mac keyboard;
        // - down:e, down:Alt [down:Dead], up:e (no event), up:alt [up:Dead] -> e
        // - down:e, down:Alt [down:Dead], up:alt, up:e -> Dead
        if (key !== 'Dead') {
          return key;
        }
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = Object.keys(this.activeKeys)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var activeKey = _step2.value;

          if (activeKey.match(/^[A-Z][a-zA-Z0-9]+$/)) continue; // named keys match this pattern, while unnamed keys cannot (https://www.w3.org/TR/2017/CR-uievents-key-20170601/)
          delete this.activeKeys[activeKey];
        }

        // The Dead key can also get stuck, and it's not a real key, so just ignore it.
        // e.g. on a US Mac keyboard;
        // - down:e, down:Alt [down:Dead], up:alt, up:e -> Dead
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

      if (key === 'Dead') return null;

      return key;
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
  }]);

  return KeyWatcher;
}(_eventTargetShim2.default);

exports.default = new KeyWatcher();