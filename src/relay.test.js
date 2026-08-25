import { isAllowedRelay } from './relay.js';

test('allows secure remote relays', () => {
  expect(isAllowedRelay('wss://relay.example.com')).toBe(true);
});

test('allows an IPv4 loopback relay without an explicit port', () => {
  expect(isAllowedRelay('ws://127.0.0.1')).toBe(true);
});

test('allows an IPv4 loopback relay with any valid port', () => {
  expect(isAllowedRelay('ws://127.0.0.1:8080')).toBe(true);
  expect(isAllowedRelay('ws://127.0.0.1:7777')).toBe(true);
});

test.each([
  'ws://relay.example.com:8080',
  'ws://localhost:8080',
  'ws://127.0.0.1.example.com:8080',
  'not-wss://relay.example.com',
])('rejects disallowed relay %s', (relay) => {
  expect(isAllowedRelay(relay)).toBe(false);
});
