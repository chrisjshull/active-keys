/*!
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

import EventTargetShim from 'event-target-shim';

// not sure if this is complete. Likely need to add more over time:
// (KeyboardEvents skipped because keyup/keydown already handled and should suffice)
const EVENTS_WITH_MODIFIER_KEYS = new Set(`
touchstart
touchend
touchmove
touchcancel

click
dblclick
mousedown
mouseenter
mouseleave
mousemove
mouseout
mouseover
mouseup
contextmenu

dragstart
drag
dragenter
dragexit
dragleave
dragover
drop
dragend

wheel
`.split('\n').filter(Boolean));

const PASSIVE_SUPPORTED = (() => {
  let passiveSupported = false;

  try {
    const options = Object.defineProperty({}, 'passive', {
      get() {
        passiveSupported = true;
      }
    });

    window.addEventListener('passive-support-test', null, options);
  } catch (error) {
    // ignore
  }
  return passiveSupported;
})();

/**
 * Tracks which keys are currently held down.
 */
export class KeyWatcher extends EventTargetShim {

  /**
   * Object of which keyboard keys are currently held down.
   * Object keys are {@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values|KeyboardEvent#key}.
   * Object values should be treated as truthy/falsy only.
   * @fires {@link module:index.KeyWatcher#change|change} when updated.
   */
  activeKeys = {};

  _isListeningForEventsWithModifierKeys = false;

  /**
   * @method module:index.KeyWatcher#addEventListener
   * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
   */
  /**
   * @method module:index.KeyWatcher#removeEventListener
   * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
   */

  constructor() {
    super();

    window.addEventListener('keydown', this);
    window.addEventListener('keyup', this);
    window.addEventListener('blur', this);
  }

  _destroy() {
    window.removeEventListener('keydown', this);
    window.removeEventListener('keyup', this);
    window.removeEventListener('blur', this);
    for (const eventType of EVENTS_WITH_MODIFIER_KEYS) {
      window.removeEventListener(eventType, this);
    }
  }

  /**
   * @private
   */
  handleEvent(evt) {
    const typeHandler = '_handle' + evt.type[0].toUpperCase() + evt.type.slice(1);
    let ret;
    if (this[typeHandler]) {
      ret = this[typeHandler](evt);
    } else if (EVENTS_WITH_MODIFIER_KEYS.has(evt.type)) {
      ret = this._handleEventWithModifierKey(evt);
    } else {
      console.warn(`No event handler for "${evt.type}" on KeyWatcher.`);
    }

    if (this._isListeningForEventsWithModifierKeys !== this._eventModifierKeyIsActive) {
      const opts = PASSIVE_SUPPORTED ? {passive: true, capture: true} : true;

      if (this._isListeningForEventsWithModifierKeys) {
        this._isListeningForEventsWithModifierKeys = false;
        for (const eventType of EVENTS_WITH_MODIFIER_KEYS) {
          window.removeEventListener(eventType, this, opts);
        }
      } else {
        this._isListeningForEventsWithModifierKeys = true;
        for (const eventType of EVENTS_WITH_MODIFIER_KEYS) {
          window.addEventListener(eventType, this, opts);
        }
      }
    }

    return ret;
  }

  _handleEventWithModifierKey(evt) {
    const changed = this._removeStuckModifiers(evt);
    changed && this._dispatch();
  }

  _handleKeydown(evt) {
    let {key, location} = evt;

    let [newKey, changed] = this._handleModifiers(key);
    key = newKey;

    changed = this._removeStuckModifiers(evt) || changed; // always do _removeStuckModifiers()

    if (key) {
      const wasActive = this.activeKeys[key] = this.activeKeys[key] || 0;
      const bitwise = 1 << location;

      if (!(this.activeKeys[key] & bitwise)) {
        this.activeKeys[key] |= bitwise;
        if (!wasActive) changed = true;
      }
    }

    changed && this._dispatch();
  }

  _handleKeyup(evt) {
    let {key, location} = evt;

    let [newKey, changed] = this._handleModifiers(key);
    key = newKey;

    changed = this._removeStuckModifiers(evt) || changed; // always do _removeStuckModifiers()

    if (key) {
      if (this.activeKeys[key]) {

        const bitwiseInverse = ~(1 << location);

        this.activeKeys[key] &= bitwiseInverse;
        if (!this.activeKeys[key]) {
          delete this.activeKeys[key];
          changed = true;
        }
      }
    }

    changed && this._dispatch();
  }

  _handleBlur() {
    // once the window/tab/frame loses focus we won't get keyup events
    // so err on the side of a full reset.
    // e.g. new tab, app switching, print dialog
    this._removeAll();
  }

  _removeAll() {
    // maintain the object reference
    for (const activeKey of Object.keys(this.activeKeys)) {
      delete this.activeKeys[activeKey];
    }

    this._dispatch();
  }

  _isNamedKey(key) {
    return key.match(/^[A-Z][a-zA-Z0-9]+$/); // named keys match this pattern, while unnamed keys cannot (https://www.w3.org/TR/2017/CR-uievents-key-20170601/)
  }

  _removeUnnamedKeys() {
    let removed = false;
    for (const activeKey of Object.keys(this.activeKeys)) {
      if (this._isNamedKey(activeKey)) continue;
      delete this.activeKeys[activeKey];
      removed = true;
    }
    return removed;
  }

  _removeStuckModifiers({altKey, ctrlKey, metaKey, shiftKey}) {
    let changed = false;
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

  get _eventModifierKeyIsActive() {
    return !!(this.activeKeys.Alt || this.activeKeys.Control || this.activeKeys.Meta || this.activeKeys.Shift);
  }

  _handleModifiers(key) {
    let changed = false;

    // Safety for browser/OS shortcuts
    // While Chrome might be detected with missing keypress, FF cannot be.
    // So lacking a better idea for now, being a bit aggressive...
    // Also handles respected modifier safety.
    if (this._isNamedKey(key)) {
      changed = this._removeUnnamedKeys() || changed; // always do _removeUnnamedKeys()
    }

    // currently redundant:
    //     // these glyph modifier keys *are* respected, and can cause previously pressed unnamed keys to get "stuck" active
    //     // so will err on the side of resetting all unnamed keys
    //     // https://www.w3.org/TR/2017/CR-uievents-key-20170601/#selecting-key-attribute-values
    //     if (key !== 'Shift' && key !== 'CapsLock' && key !== 'AltGraph') {
    //       // a similar situation can happen when a Dead key is hit.
    //       // e.g. on a US Mac keyboard;
    //       // - down:e, down:Alt [down:Dead], up:e (no event), up:alt [up:Dead] -> e
    //       // - down:e, down:Alt [down:Dead], up:alt, up:e -> Dead
    //       if (key !== 'Dead') {
    //         return [key, changed];
    //       }
    //     }
    //
    //     changed = this._removeUnnamedKeys() || changed; // always do _removeUnnamedKeys()

    // The Dead key can also get stuck, and it's not a real key, so just ignore it.
    // e.g. on a US Mac keyboard;
    // - down:e, down:Alt [down:Dead], up:alt, up:e -> Dead
    return [key === 'Dead' ? null : key, changed];
  }

  _dispatch() {
    /**
     * Event fired when {@link module:index.KeyWatcher#activeKeys|activeKeys} changes.
     * @event module:index.KeyWatcher#change
     */
    const event = new Event('change', {
      bubbles: false,
      cancelable: false
    });
    this.dispatchEvent(event);
  }

}

export default new KeyWatcher();
