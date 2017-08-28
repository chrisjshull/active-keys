/**
 * React helper module for active-keys.
 * Adds `.activeKeys` to `state`. Can also be used as a decorator.
 * @module react
 * @example
 * import keyWatcher from 'active-keys/dist/react';
 * class MyComponent extends Component {
 *   componentWillUpdate(nextProps, nextState) {
 *     console.log(nextState.activeKeys);
 *   }
 * }
 * keyWatcher(MyComponent);
 */

import keyWatcher from './';

export default (Target) => {
  // While React is usually about composition and HOCs, inheritance is pretty simple here
  // (and keeps the dependency size low for non-React users).
  return class extends Target {
    constructor() {
      super(...arguments);

      this.state = this.state || {};
      this.state.activeKeys = {...keyWatcher.activeKeys};

      this._handleKeyWatcherChange = () => {
        this.setState({activeKeys: {...keyWatcher.activeKeys}});
      };
    }

    componentWillMount() {
      keyWatcher.addEventListener('change', this._handleKeyWatcherChange);

      const superFcn = super.componentWillUnmount;
      return !superFcn ? undefined : superFcn.apply(this, arguments);
    }

    componentWillUnmount() {
      keyWatcher.removeEventListener('change', this._handleKeyWatcherChange);

      const superFcn = super.componentWillUnmount;
      return !superFcn ? undefined : superFcn.apply(this, arguments);
    }

  };
};
