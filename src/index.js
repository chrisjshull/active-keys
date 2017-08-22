
import EventTargetShim from 'event-target-shim';

class KeyWatcher extends EventTargetShim {

    activeKeys = {};

    constructor() {
        super();

        window.addEventListener('keyup', evt => {
            this.activeKeys[evt.key] = this.activeKeys[evt.key] || 0;
            const bitwiseInverse = ~(1 << evt.location);
            this.activeKeys[evt.key] &= bitwiseInverse;
            if (!this.activeKeys[evt.key]) {
                delete this.activeKeys[evt.key];
            }
            // console.log(evt.location, evt.key, bitwiseInverse, this.activeKeys);

            this._dispatch();
        });

        window.addEventListener('keydown', evt => {
            this.activeKeys[evt.key] = this.activeKeys[evt.key] || 0;
            const bitwise = 1 << evt.location;
            if (this.activeKeys[evt.key] & bitwise) return;
            this.activeKeys[evt.key] |= bitwise;
            // console.log(evt.location, evt.key, bitwise, this.activeKeys);

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
