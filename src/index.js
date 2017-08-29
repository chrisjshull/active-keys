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

/**
 * Tracks which keys are currently held down.
 * @fires 'change'
 */
export class KeyWatcher extends EventTargetShim {

  /**
   * Which keys are currently held down.
   * Uses [values from KeyboardEvent#key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values).
   */
  activeKeys = {};

  /**
   * @method addEventListener
   * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
   */
  /**
   * @method removeEventListener
   * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
   */

  constructor() {
    super();

    window.addEventListener('keydown', this);
    window.addEventListener('keyup', this);
  }

  _destroy() {
    window.removeEventListener('keydown', this);
    window.removeEventListener('keyup', this);
  }

  handleEvent(evt) {
    const typeHandler = '_handle' + evt.type[0].toUpperCase() + evt.type.slice(1);
    if (this[typeHandler]) this[typeHandler](evt);
  }

  _handleKeydown({key, location}) {
    const wasActive = this.activeKeys[key] = this.activeKeys[key] || 0;
    const bitwise = 1 << location;

    if (this.activeKeys[key] & bitwise) return;

    this.activeKeys[key] |= bitwise;

    if (!wasActive) {
      this._dispatch();
    }
    // console.log(location, key, bitwise, this.activeKeys);
  }

  _handleKeyup({key, location}) {
    if (!this.activeKeys[key]) return;

    const bitwiseInverse = ~(1 << location);

    this.activeKeys[key] &= bitwiseInverse;
    if (!this.activeKeys[key]) {
      delete this.activeKeys[key];
      this._dispatch();
    }
    // console.log(location, evt.key, bitwiseInverse, this.activeKeys);
  }

  _dispatch() {
    /**
     * Event fired when #activeKeys changes.
     * @event change
     */
    const event = new Event('change', {
      bubbles: false,
      cancelable: false
    });
    this.dispatchEvent(event);
  }

}

export default new KeyWatcher();
