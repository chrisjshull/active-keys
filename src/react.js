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
 * MyComponent = keyWatcher(MyComponent);
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

      const superFcn = super.componentWillMount;
      return !superFcn ? undefined : superFcn.apply(this, arguments);
    }

    componentWillUnmount() {
      keyWatcher.removeEventListener('change', this._handleKeyWatcherChange);

      const superFcn = super.componentWillUnmount;
      return !superFcn ? undefined : superFcn.apply(this, arguments);
    }

  };
};
