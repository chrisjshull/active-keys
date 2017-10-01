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
      expect(subject.activeKeys.Alt).to.be.ok;
      expect(changeListener.callCount).to.be.equal(1);
    });
  });

  describe('key up', () => {
    it('basic', () => {
      subject.handleEvent({type: 'keydown', key: 'Alt'});
      changeListener.reset();
      subject.handleEvent({type: 'keyup', key: 'Alt'});
      expect(subject.activeKeys.Alt).to.not.be.ok;
      expect(changeListener.callCount).to.be.equal(1);
    });

    it('missing keydown', () => {
      subject.handleEvent({type: 'keyup', key: 'Alt'});
      expect(subject.activeKeys.Alt).to.not.be.ok;
      expect(changeListener.callCount).to.be.equal(0);
    });
  });

  it('same key, various locations', () => {
    subject.handleEvent({type: 'keydown', key: 'Alt', location: 0});
    expect(subject.activeKeys.Alt).to.be.ok;
    expect(changeListener.callCount).to.be.equal(1);

    subject.handleEvent({type: 'keydown', key: 'Alt', location: 0}); // same again
    expect(subject.activeKeys.Alt).to.be.ok;
    expect(changeListener.callCount).to.be.equal(1);

    subject.handleEvent({type: 'keydown', key: 'Alt', location: 1});
    expect(subject.activeKeys.Alt).to.be.ok;
    expect(changeListener.callCount).to.be.equal(1); // only events on truthy/falsy change

    subject.handleEvent({type: 'keyup', key: 'Alt', location: 1});
    expect(subject.activeKeys.Alt).to.be.ok;
    expect(changeListener.callCount).to.be.equal(1); // only events on truthy/falsy change

    // use third location to prove not count based
    subject.handleEvent({type: 'keyup', key: 'Alt', location: 3});
    expect(subject.activeKeys.Alt).to.be.ok;
    expect(changeListener.callCount).to.be.equal(1);

    subject.handleEvent({type: 'keyup', key: 'Alt', location: 0});
    expect(subject.activeKeys.Alt).to.not.be.ok;
    expect(changeListener.callCount).to.be.equal(2);
  });

  it('unknown event', () => {
    subject.handleEvent({type: 'foo'});
  });

  describe('safety resets', () => {
    //... blur, mod sequences

    it('blur', () => {
      subject.handleEvent({type: 'keydown', key: 'Alt'});
      subject.handleEvent({type: 'blur'});
      expect(subject.activeKeys).to.be.eql({});
      expect(changeListener.callCount).to.be.equal(2);
    });

    it('respected modifiers', () => {
      subject.handleEvent({type: 'keydown', key: 'ArrowDown'});
      subject.handleEvent({type: 'keydown', key: 'e'});
      changeListener.reset();
      subject.handleEvent({type: 'keydown', key: 'Shift'});
      subject.handleEvent({type: 'keydown', key: 'E'}); // auto-done (in Chrome/Mac)
      expect(subject.activeKeys).to.be.eql({ArrowDown: 1, Shift: 1, E: 1});
      expect(changeListener.callCount).to.be.equal(2);
      subject.handleEvent({type: 'keyup', key: 'Shift'});
      subject.handleEvent({type: 'keydown', key: 'e'}); // auto-done (in Chrome/Mac)
      expect(subject.activeKeys).to.be.eql({ArrowDown: 1, e: 1});
      expect(changeListener.callCount).to.be.equal(4);

      subject.activeKeys = {};
      changeListener.reset();
      subject.handleEvent({type: 'keydown', key: 'f'});
      subject.handleEvent({type: 'keydown', key: 'Alt'});
      subject.handleEvent({type: 'keydown', key: 'ƒ'}); // auto-done (in Chrome/Mac)
      expect(subject.activeKeys).to.be.eql({Alt: 1, ƒ: 1});
      expect(changeListener.callCount).to.be.equal(3);
      subject.handleEvent({type: 'keyup', key: 'ƒ'});
      subject.handleEvent({type: 'keyup', key: 'Alt'});
      expect(subject.activeKeys).to.be.eql({});
      expect(changeListener.callCount).to.be.equal(5);

      subject.activeKeys = {};
      changeListener.reset();
      subject.handleEvent({type: 'keydown', key: 'f'});
      subject.handleEvent({type: 'keydown', key: 'Alt'});
      subject.handleEvent({type: 'keydown', key: 'ƒ'}); // auto-done (in Chrome/Mac)
      expect(subject.activeKeys).to.be.eql({Alt: 1, ƒ: 1});
      expect(changeListener.callCount).to.be.equal(3);
      subject.handleEvent({type: 'keyup', key: 'Alt'});
      subject.handleEvent({type: 'keydown', key: 'f'}); // auto-done (in Chrome/Mac)
      expect(subject.activeKeys).to.be.eql({f: 1});
      expect(changeListener.callCount).to.be.equal(5);
    });

    it('Dead', () => {
      subject.handleEvent({type: 'keydown', key: 'e'});
      changeListener.reset();
      subject.handleEvent({type: 'keydown', key: 'Alt'});
      subject.handleEvent({type: 'keydown', key: 'Dead'}); // auto-done (in Chrome/Mac)
      expect(subject.activeKeys).to.be.eql({Alt: 1});
      expect(changeListener.callCount).to.be.equal(1);
      // up e: no keyup e fired upon release
      subject.handleEvent({type: 'keyup', key: 'Alt'});
      subject.handleEvent({type: 'keyup', key: 'Dead'}); // auto-done (in Chrome/Mac)
      expect(subject.activeKeys).to.be.eql({});
      expect(changeListener.callCount).to.be.equal(2);

      subject.handleEvent({type: 'keydown', key: 'e'});
      changeListener.reset();
      subject.handleEvent({type: 'keydown', key: 'Alt'});
      subject.handleEvent({type: 'keydown', key: 'Dead'}); // auto-done (in Chrome/Mac)
      expect(subject.activeKeys).to.be.eql({Alt: 1});
      expect(changeListener.callCount).to.be.equal(1);
      subject.handleEvent({type: 'keyup', key: 'Alt'});
      subject.handleEvent({type: 'keyup', key: 'e'});
      expect(subject.activeKeys).to.be.eql({});
      expect(changeListener.callCount).to.be.equal(2);
    });

    it('browser/OS keyboard shortcuts', () => {
      subject.handleEvent({type: 'keydown', key: 'e'});
      subject.handleEvent({type: 'keydown', key: 'Meta'});
      // up e: no keyup e fired upon release
      subject.handleEvent({type: 'keyup', key: 'Meta'});
      expect(subject.activeKeys).to.be.eql({});

      subject.handleEvent({type: 'keydown', key: 'Meta'});
      subject.handleEvent({type: 'keydown', key: 'e'});
      // up e: no keyup e fired upon release
      subject.handleEvent({type: 'keyup', key: 'Meta'});
      expect(subject.activeKeys).to.be.eql({});
    });

    it('Meta-Tab back around', () => {
      subject.handleEvent({type: 'keydown', key: 'Meta'});
      // down Tab * N: OS eats
      // up Tab: OS eats
      // up Meta: OS eats

    });

    it('cmd-Enter', () => {

    });

    it('tabb out, shift tab out ???', () => {

    });

  });
});
