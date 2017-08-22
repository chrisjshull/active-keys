
import keyWatcher from './';

export default (Target) => {
    return class extends Target {
        constructor() {
            super(...arguments);

            this.state = this.state || {};
            this.state.activeKeys = {...keyWatcher.activeKeys};

            this._handleKeyWatcherChange = () => {
                console.log(keyWatcher.activeKeys);
                this.setState({activeKeys: {...keyWatcher.activeKeys}});
            };
        }

        componentWillMount() {
            keyWatcher.removeEventListener('change', this._handleKeyWatcherChange);

            const superFcn = super.componentWillMount;
            return !superFcn ? undefined : superFcn.apply(this, arguments);
        }

        componentWillMount() {
            keyWatcher.addEventListener('change', this._handleKeyWatcherChange);

            const superFcn = super.componentWillUnmount;
            return !superFcn ? undefined : superFcn.apply(this, arguments);
        }
    };
};
