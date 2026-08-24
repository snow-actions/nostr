jest.mock('@actions/core', () => ({
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

jest.mock('./nostr', () => ({
  createEvent: jest.fn(() => ({})),
  publishEvent: jest.fn(() => Promise.resolve()),
}));

const { isAllowedRelay } = require('./index');

test('allows secure remote relays', () => {
  expect(isAllowedRelay('wss://relay.example.com')).toBe(true);
});

test('allows an IPv4 loopback relay with an explicit port', () => {
  expect(isAllowedRelay('ws://127.0.0.1:8080')).toBe(true);
});

test.each([
  'ws://relay.example.com:8080',
  'ws://localhost:8080',
  'ws://127.0.0.1.example.com:8080',
  'ws://127.0.0.1',
  'not-wss://relay.example.com',
])('rejects disallowed relay %s', (relay) => {
  expect(isAllowedRelay(relay)).toBe(false);
});
