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
class KeyWatcher extends EventTargetShim {

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

    const activeKeys = this.activeKeys;

    window.addEventListener('keyup', evt => {
      if (!activeKeys[evt.key]) return;

      const bitwiseInverse = ~(1 << evt.location);

      activeKeys[evt.key] &= bitwiseInverse;
      if (!activeKeys[evt.key]) {
        delete activeKeys[evt.key];
      }

      // console.log(evt.location, evt.key, bitwiseInverse, activeKeys);
      this._dispatch();
    });

    window.addEventListener('keydown', evt => {
      activeKeys[evt.key] = activeKeys[evt.key] || 0;
      const bitwise = 1 << evt.location;

      if (activeKeys[evt.key] & bitwise) return;

      activeKeys[evt.key] |= bitwise;

      // console.log(evt.location, evt.key, bitwise, activeKeys);
      this._dispatch();
    });
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
