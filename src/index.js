
import EventTargetShim from 'event-target-shim';

class KeyWatcher extends EventTargetShim {

    activeKeys = {};

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
        const event = new Event('change', {
            bubbles: false,
            cancelable: false
        });
        this.dispatchEvent(event);
    }
}

export default new KeyWatcher();
