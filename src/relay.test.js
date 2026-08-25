import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isAllowedRelay } from './relay.js';

test('allows secure remote relays', () => {
  assert.strictEqual(isAllowedRelay('wss://relay.example.com'), true);
});

test('allows an IPv4 loopback relay without an explicit port', () => {
  assert.strictEqual(isAllowedRelay('ws://127.0.0.1'), true);
});

test('allows an IPv4 loopback relay with any valid port', () => {
  assert.strictEqual(isAllowedRelay('ws://127.0.0.1:8080'), true);
  assert.strictEqual(isAllowedRelay('ws://127.0.0.1:7777'), true);
});

const disallowedRelays = [
  'ws://relay.example.com:8080',
  'ws://localhost:8080',
  'ws://127.0.0.1.example.com:8080',
  'not-wss://relay.example.com',
];

for (const relay of disallowedRelays) {
  test(`rejects disallowed relay ${relay}`, () => {
    assert.strictEqual(isAllowedRelay(relay), false);
  });
}
