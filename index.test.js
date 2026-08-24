import { jest } from '@jest/globals';

jest.unstable_mockModule('@actions/core', () => ({
  getInput: jest.fn((name) => ({
    relays: 'wss://relay.example.com',
    'private-key': '1'.padStart(64, '0'),
    content: 'test',
    kind: '1',
    tags: '[]',
  })[name]),
  setFailed: jest.fn(),
  setOutput: jest.fn(),
  setSecret: jest.fn(),
}));

jest.unstable_mockModule('./nostr.js', () => ({
  createEvent: jest.fn(() => ({})),
  publishEvent: jest.fn(() => Promise.resolve()),
}));

const { isAllowedRelay } = await import('./index.js');

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
