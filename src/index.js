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

  _handleKeydown(evt) {
    const wasActive = this.activeKeys[evt.key] = this.activeKeys[evt.key] || 0;
    const bitwise = 1 << evt.location;

    if (this.activeKeys[evt.key] & bitwise) return;

    this.activeKeys[evt.key] |= bitwise;

    if (!wasActive) {
      this._dispatch();
    }
    // console.log(evt.location, evt.key, bitwise, this.activeKeys);
  }

  _handleKeyup(evt) {
    if (!this.activeKeys[evt.key]) return;

    const bitwiseInverse = ~(1 << evt.location);

    this.activeKeys[evt.key] &= bitwiseInverse;
    if (!this.activeKeys[evt.key]) {
      delete this.activeKeys[evt.key];
      this._dispatch();
    }
    // console.log(evt.location, evt.key, bitwiseInverse, this.activeKeys);
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
