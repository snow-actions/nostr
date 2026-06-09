// Lightweight stand-in for the `ws` module used by nostr.js.
// Tests drive the socket lifecycle via emitOpen/emitMessage/emitError.
class MockWebSocket {
  constructor(url) {
    if (typeof url === 'string' && url.includes('throw-on-connect')) {
      throw new Error('connection error');
    }
    this.url = url;
    this.readyState = MockWebSocket.CONNECTING;
    this.sent = [];
    this.onopen = null;
    this.onmessage = null;
    this.onerror = null;
    this.onclose = null;
    MockWebSocket.instances.push(this);
  }

  send(data) {
    this.sent.push(data);
  }

  close() {
    this.readyState = MockWebSocket.CLOSED;
    if (typeof this.onclose === 'function') {
      this.onclose();
    }
  }

  // --- test helpers ---
  emitOpen() {
    this.readyState = MockWebSocket.OPEN;
    if (typeof this.onopen === 'function') {
      this.onopen();
    }
  }

  emitMessage(data) {
    if (typeof this.onmessage === 'function') {
      this.onmessage({ data });
    }
  }

  emitError(error) {
    if (typeof this.onerror === 'function') {
      this.onerror(error);
    }
  }
}

MockWebSocket.CONNECTING = 0;
MockWebSocket.OPEN = 1;
MockWebSocket.CLOSING = 2;
MockWebSocket.CLOSED = 3;
MockWebSocket.instances = [];
MockWebSocket.reset = () => {
  MockWebSocket.instances = [];
};

module.exports = MockWebSocket;
