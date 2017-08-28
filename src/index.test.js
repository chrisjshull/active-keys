
import {KeyWatcher} from './';

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

  it('constructor', () => {
    expect(window.addEventListener.getCall(0).args).to.eql(['keydown', subject]);
    expect(window.addEventListener.getCall(1).args).to.eql(['keyup', subject]);
  });

  describe('key down', () => {
    it('basic', () => {
      subject.handleEvent({type: 'keydown', key: 'Alt'});
      expect(changeListener.calledOnce).to.be.true;
      expect(subject.activeKeys.Alt).to.be.ok;
    });
  });

  describe('key up', () => {
    it('basic', () => {
      subject.handleEvent({type: 'keydown', key: 'Alt'});
      changeListener.reset();
      subject.handleEvent({type: 'keyup', key: 'Alt'});
      expect(changeListener.calledOnce).to.be.true;
      expect(subject.activeKeys.Alt).to.not.be.ok;
    });

    it('missing keydown', () => {
      subject.handleEvent({type: 'keyup', key: 'Alt'});
      expect(changeListener.calledOnce).to.be.false;
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
});
