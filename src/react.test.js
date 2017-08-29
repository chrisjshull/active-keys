
import keyWatcher from './';
import keyWatcherDecorator from './react';

class FakeComponent {
  _constructorArgs = null;
  constructor(state) {
    this._constructorArgs = Array.from(arguments);
    this.state = state;
  }
  setState(state) {
    this.state = state;
  }
}

class FakeComponentMount extends FakeComponent {
  _componentWillMountArgs = null;
  componentWillMount() {
    this._componentWillMountArgs = Array.from(arguments);
    return true;
  }
}

class FakeComponentUnmount extends FakeComponent {
  _componentWillUnmountArgs = null;
  componentWillUnmount() {
    this._componentWillUnmountArgs = Array.from(arguments);
    return true;
  }
}

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

describe('react decorator', () => {

  beforeEach(() => {
    keyWatcher.activeKeys = {Alt: 1};
  });
  afterEach(() => {
    keyWatcher.activeKeys = {};
  });

  describe('constructor', () => {

    it('no args', () => {
      new (keyWatcherDecorator(FakeComponent))(); // eslint-disable-line no-new
    });
    it('args get passed thru', () => {
      const subject = new (keyWatcherDecorator(FakeComponent))(null, 2, 3);
      expect(subject._constructorArgs).to.be.eql([null, 2, 3]);
    });

    it('copies activeKeys into state (additive)', () => {
      const subject = new (keyWatcherDecorator(FakeComponent))({foo: 1});
      expect(subject.state).to.eql({foo: 1, activeKeys: {...keyWatcher.activeKeys}});
      expect(subject.state.activeKeys).to.eql(keyWatcher.activeKeys);
      expect(subject.state.activeKeys).to.not.equal(keyWatcher.activeKeys);
    });
  });

  describe('componentWillMount', () => {
    it('no super', () => {
      const subject = new (keyWatcherDecorator(FakeComponent))();
      subject.componentWillMount();
    });
    it('with super', () => {
      const subject = new (keyWatcherDecorator(FakeComponentMount))();
      expect(subject.componentWillMount(1, 2, 3)).to.be.true;
      expect(subject._componentWillMountArgs).to.be.eql([1, 2, 3]);
    });

    it('change event registered', () => {
      const subject = new (keyWatcherDecorator(FakeComponentMount))();
      subject.componentWillMount();
      keyWatcher.activeKeys = {Meta: 1};
      keyWatcher._dispatch();
      expect(subject.state.activeKeys).to.eql(keyWatcher.activeKeys);
      expect(subject.state.activeKeys).to.not.equal(keyWatcher.activeKeys);
    });
  });

  describe('componentWillUnmount', () => {
    it('no super', () => {
      const subject = new (keyWatcherDecorator(FakeComponent))();
      subject.componentWillUnmount();
    });
    it('with super', () => {
      const subject = new (keyWatcherDecorator(FakeComponentUnmount))();
      expect(subject.componentWillUnmount(1, 2, 3)).to.be.true;
      expect(subject._componentWillUnmountArgs).to.be.eql([1, 2, 3]);
    });

    it('change event registered', () => {
      const subject = new (keyWatcherDecorator(FakeComponentUnmount))();
      subject.componentWillUnmount();
      keyWatcher.activeKeys = {Meta: 1};
      keyWatcher._dispatch();
      expect(subject.state.activeKeys).to.not.eql(keyWatcher.activeKeys);
    });
  });

});
