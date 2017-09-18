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

import singletonInstance, {KeyWatcher} from './';

describe('KeyWatcher', () => {
  let subject;
  let changeListener;
  beforeEach(() => {
    sinon.spy(window, 'addEventListener');
    sinon.spy(window, 'removeEventListener');
    subject = new KeyWatcher();
    subject.addEventListener('change', changeListener = sinon.spy());
  });
  afterEach(() => {
    subject._destroy();
    window.addEventListener.restore();
    window.removeEventListener.restore();
  });

  it('singleton', () => {
    expect(singletonInstance).to.be.an.instanceof(KeyWatcher);
  });

  it('constructor', () => {
    expect(window.addEventListener.getCall(0).args).to.eql(['keydown', subject]);
    expect(window.addEventListener.getCall(1).args).to.eql(['keyup', subject]);
  });

  describe('key down', () => {
    it('basic', () => {
      subject.handleEvent({type: 'keydown', key: 'Alt'});
      expect(changeListener.callCount).to.be.equal(1);
      expect(subject.activeKeys.Alt).to.be.ok;
    });
  });

  describe('key up', () => {
    it('basic', () => {
      subject.handleEvent({type: 'keydown', key: 'Alt'});
      changeListener.reset();
      subject.handleEvent({type: 'keyup', key: 'Alt'});
      expect(changeListener.callCount).to.be.equal(1);
      expect(subject.activeKeys.Alt).to.not.be.ok;
    });

    it('missing keydown', () => {
      subject.handleEvent({type: 'keyup', key: 'Alt'});
      expect(changeListener.callCount).to.be.equal(0);
      expect(subject.activeKeys.Alt).to.not.be.ok;
    });
  });

  it('same key, various locations', () => {
    subject.handleEvent({type: 'keydown', key: 'Alt', location: 0});
    expect(changeListener.callCount).to.be.equal(1);
    expect(subject.activeKeys.Alt).to.be.ok;

    subject.handleEvent({type: 'keydown', key: 'Alt', location: 0}); // same again
    expect(changeListener.callCount).to.be.equal(1);
    expect(subject.activeKeys.Alt).to.be.ok;

    subject.handleEvent({type: 'keydown', key: 'Alt', location: 1});
    expect(changeListener.callCount).to.be.equal(1); // only events on truthy/falsy change
    expect(subject.activeKeys.Alt).to.be.ok;

    subject.handleEvent({type: 'keyup', key: 'Alt', location: 1});
    expect(changeListener.callCount).to.be.equal(1); // only events on truthy/falsy change
    expect(subject.activeKeys.Alt).to.be.ok;

    // use third location to prove not count based
    subject.handleEvent({type: 'keyup', key: 'Alt', location: 3});
    expect(changeListener.callCount).to.be.equal(1);
    expect(subject.activeKeys.Alt).to.be.ok;

    subject.handleEvent({type: 'keyup', key: 'Alt', location: 0});
    expect(changeListener.callCount).to.be.equal(2);
    expect(subject.activeKeys.Alt).to.not.be.ok;
  });

  it('unknown event', () => {
    subject.handleEvent({type: 'foo'});
  });

  describe('safety resets', () => {
    //... blur, mod sequences

    it('blur', () => {
      subject.handleEvent({type: 'keydown', key: 'Alt'});
      subject.handleEvent({type: 'blur'});
      expect(changeListener.callCount).to.be.equal(2);
      expect(subject.activeKeys).to.be.eql({});
    });

    it('respected modifiers', () => {
      subject.handleEvent({type: 'keydown', key: 'ArrowDown'});
      subject.handleEvent({type: 'keydown', key: 'e'});
      changeListener.reset();
      subject.handleEvent({type: 'keydown', key: 'Shift'});
      subject.handleEvent({type: 'keydown', key: 'E'}); // auto-done (in Chrome/Mac)
      expect(changeListener.callCount).to.be.equal(2);
      expect(subject.activeKeys).to.be.eql({ArrowDown: 1, Shift: 1, E: 1});

      changeListener.reset();
      subject.handleEvent({type: 'keyup', key: 'Shift'});
      subject.handleEvent({type: 'keydown', key: 'e'}); // auto-done (in Chrome/Mac)
      expect(changeListener.callCount).to.be.equal(2);
      expect(subject.activeKeys).to.be.eql({ArrowDown: 1, e: 1});
    });

    it('Dead', () => {
      subject.handleEvent({type: 'keydown', key: 'e'});
      changeListener.reset();
      subject.handleEvent({type: 'keydown', key: 'Alt'});
      subject.handleEvent({type: 'keydown', key: 'Dead'}); // auto-done (in Chrome/Mac)
      expect(changeListener.callCount).to.be.equal(2);
      expect(subject.activeKeys).to.be.eql({Alt: 1});
      // up e: no keyup e fired upon release
      changeListener.reset();
      subject.handleEvent({type: 'keyup', key: 'Alt'});
      subject.handleEvent({type: 'keyup', key: 'Dead'}); // auto-done (in Chrome/Mac)
      expect(changeListener.callCount).to.be.equal(1);
      expect(subject.activeKeys).to.be.eql({});

      subject.handleEvent({type: 'keydown', key: 'e'});
      changeListener.reset();
      subject.handleEvent({type: 'keydown', key: 'Alt'});
      subject.handleEvent({type: 'keydown', key: 'Dead'}); // auto-done (in Chrome/Mac)
      expect(changeListener.callCount).to.be.equal(2);
      expect(subject.activeKeys).to.be.eql({Alt: 1});
      changeListener.reset();
      subject.handleEvent({type: 'keyup', key: 'Alt'});
      subject.handleEvent({type: 'keyup', key: 'e'});
      expect(changeListener.callCount).to.be.equal(1);
      expect(subject.activeKeys).to.be.eql({});
    });
  });
});

