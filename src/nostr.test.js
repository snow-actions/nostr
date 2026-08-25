import assert from 'node:assert/strict';
import { test } from 'node:test';
import { generateSecretKey, getPublicKey, nip19, verifyEvent } from 'nostr-tools';
import { bytesToHex } from '@noble/hashes/utils.js';
import { createEvent, publishEvent } from './nostr.js';

const event = { id: 'event-id' };

const createWebSocketFixture = (t) => {
  const webSockets = [];
  const connectionErrors = new Set();

  class FakeWebSocket {
    static CLOSED = 3;

    constructor(url) {
      if (connectionErrors.has(url)) throw new Error('connection error');
      this.url = url;
      this.readyState = 1;
      this.send = t.mock.fn();
      this.close = t.mock.fn(() => {
        this.readyState = FakeWebSocket.CLOSED;
      });
      webSockets.push(this);
    }
  }

  return { FakeWebSocket, webSockets, connectionErrors };
};

const mockConsole = (t) => {
  t.mock.method(console, 'log', () => {});
  t.mock.method(console, 'warn', () => {});
  t.mock.method(console, 'time', () => {});
  t.mock.method(console, 'timeEnd', () => {});
};

const open = (ws) => ws.onopen();
const respond = (ws, accepted, message = '') => {
  ws.onmessage({ data: JSON.stringify(['OK', event.id, accepted, message]) });
};

test('createEvent with nsec', () => {
  const seckey = generateSecretKey();
  const nsec = nip19.nsecEncode(seckey);
  const expectedPubkey = getPublicKey(seckey);
  const content = 'test content';
  const kind = 42;
  const tags = [['t', 'test']];
  const createdEvent = createEvent(nsec, kind, content, tags);
  const eventToVerify = JSON.parse(JSON.stringify(createdEvent));

  assert.ok(Object.hasOwn(createdEvent, 'id'));
  assert.ok(Object.hasOwn(createdEvent, 'sig'));
  assert.strictEqual(createdEvent.pubkey, expectedPubkey);
  assert.strictEqual(createdEvent.kind, kind);
  assert.strictEqual(createdEvent.content, content);
  assert.deepStrictEqual(createdEvent.tags, tags);
  assert.strictEqual(verifyEvent(eventToVerify), true);
});

test('createEvent with seckey', () => {
  const seckey = generateSecretKey();
  const hexSeckey = bytesToHex(seckey);
  const expectedPubkey = getPublicKey(seckey);
  const createdEvent = createEvent(hexSeckey, 1, 'test', []);
  const eventToVerify = JSON.parse(JSON.stringify(createdEvent));

  assert.strictEqual(createdEvent.pubkey, expectedPubkey);
  assert.strictEqual(verifyEvent(eventToVerify), true);
});

test('createEvent rejects a malformed seckey', () => {
  assert.throws(() => createEvent('not-hex', 1, 'test', []));
});

test('createEvent rejects a malformed nsec', () => {
  assert.throws(() => createEvent('nsec-invalid', 1, 'test', []));
});

test('publishEvent resolves when all relays accept the event', async (t) => {
  mockConsole(t);
  const { FakeWebSocket, webSockets } = createWebSocketFixture(t);
  const result = publishEvent(['wss://relay-1', 'wss://relay-2'], event, FakeWebSocket);
  webSockets.forEach(open);
  webSockets.forEach((ws) => respond(ws, true));

  await assert.doesNotReject(result);
  assert.deepStrictEqual(webSockets[0].send.mock.calls[0].arguments, [JSON.stringify(['EVENT', event])]);
  assert.deepStrictEqual(webSockets[1].send.mock.calls[0].arguments, [JSON.stringify(['EVENT', event])]);
});

test('publishEvent resolves when at least one relay accepts the event', async (t) => {
  mockConsole(t);
  const { FakeWebSocket, webSockets } = createWebSocketFixture(t);
  const result = publishEvent(['wss://relay-1', 'wss://relay-2'], event, FakeWebSocket);
  respond(webSockets[0], false);
  respond(webSockets[1], true);

  await assert.doesNotReject(result);
});

test('publishEvent rejects when all relays reject the event', async (t) => {
  mockConsole(t);
  const { FakeWebSocket, webSockets } = createWebSocketFixture(t);
  const result = publishEvent(['wss://relay-1', 'wss://relay-2'], event, FakeWebSocket);
  webSockets.forEach((ws) => respond(ws, false, 'blocked'));

  await assert.rejects(result, { name: 'Error', message: 'All relays rejected the event: blocked; blocked' });
});

test('publishEvent rejects when WebSocket construction fails', async (t) => {
  mockConsole(t);
  const setTimeout = t.mock.method(globalThis, 'setTimeout');
  const { FakeWebSocket, webSockets, connectionErrors } = createWebSocketFixture(t);
  connectionErrors.add('wss://relay-1');

  await assert.rejects(publishEvent(['wss://relay-1'], event, FakeWebSocket), {
    name: 'Error',
    message: 'Failed to create any WebSocket connections',
  });
  assert.strictEqual(webSockets.length, 0);
  assert.strictEqual(setTimeout.mock.callCount(), 0);
});

test('publishEvent rejects when relays time out', async (t) => {
  mockConsole(t);
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const { FakeWebSocket, webSockets } = createWebSocketFixture(t);
  const result = publishEvent(['wss://relay-1'], event, FakeWebSocket);
  t.mock.timers.tick(3000);

  await assert.rejects(result, { name: 'Error', message: 'Timed out waiting for relay responses' });
  assert.strictEqual(webSockets[0].close.mock.callCount(), 1);
});

test('publishEvent handles a WebSocket error and rejects on timeout', async (t) => {
  mockConsole(t);
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const { FakeWebSocket, webSockets } = createWebSocketFixture(t);
  const result = publishEvent(['wss://relay-1'], event, FakeWebSocket);
  const error = new Error('socket error');
  webSockets[0].onerror(error);
  t.mock.timers.tick(3000);

  await assert.rejects(result);
  assert.deepStrictEqual(console.warn.mock.calls[0].arguments, ['[error]', 'wss://relay-1', error]);
});

test('publishEvent ignores messages that are not an OK for the published event', async (t) => {
  mockConsole(t);
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const { FakeWebSocket, webSockets } = createWebSocketFixture(t);
  const result = publishEvent(['wss://relay-1'], event, FakeWebSocket);

  for (const message of [
    ['NOTICE', 'message'],
    ['AUTH', 'challenge'],
    ['EVENT', 'subscription-id', event],
    ['EOSE', 'subscription-id'],
    ['CLOSED', 'subscription-id', 'message'],
    ['OK', 'another-event-id', true, 'accepted'],
  ]) {
    webSockets[0].onmessage({ data: JSON.stringify(message) });
  }
  webSockets[0].onmessage({ data: 'not JSON' });

  t.mock.timers.tick(3000);
  await assert.rejects(result, { name: 'Error', message: 'Timed out waiting for relay responses' });
});

test('publishEvent tracks duplicate relay URLs as separate connections', async (t) => {
  mockConsole(t);
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const { FakeWebSocket, webSockets } = createWebSocketFixture(t);
  const result = publishEvent(['wss://relay', 'wss://relay'], event, FakeWebSocket);

  respond(webSockets[0], true);
  t.mock.timers.tick(2999);
  respond(webSockets[1], false);

  await assert.doesNotReject(result);
  assert.strictEqual(webSockets.length, 2);
});

test('publishEvent waits only for successfully constructed connections', async (t) => {
  mockConsole(t);
  const { FakeWebSocket, webSockets, connectionErrors } = createWebSocketFixture(t);
  connectionErrors.add('wss://broken-relay');
  const result = publishEvent(['wss://broken-relay', 'wss://working-relay'], event, FakeWebSocket);

  respond(webSockets[0], true);

  await assert.doesNotReject(result);
  assert.strictEqual(webSockets.length, 1);
  assert.strictEqual(webSockets[0].url, 'wss://working-relay');
});
