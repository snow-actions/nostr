const { createEvent, publishEvent } = require('./nostr');
require('dotenv').config();

test('createEvent', async () => {
  const privateKey = process.env.NOSTR_PRIVATE_KEY;
  const content = 'test';
  const kind = 1;
  const tags = [];
  const event = createEvent(privateKey, kind, content, tags);
  expect(event).toHaveProperty('id');
  expect(event).toHaveProperty('pubkey');
  expect(event).toHaveProperty('created_at');
  expect(event).toHaveProperty('kind');
  expect(event).toHaveProperty('tags');
  expect(event).toHaveProperty('content');
  expect(event).toHaveProperty('sig');
  expect(event.content).toBe(content);
});

test('publishEvent', async () => {
  const relays = process.env.NOSTR_RELAYS.split("\n").map(x => x.trim()).filter(x => x.startsWith('wss://'));
  const privateKey = process.env.NOSTR_PRIVATE_KEY;
  const kind = 1;
  expect(privateKey).toBeDefined();
  expect(privateKey).not.toBe('');
  const content = 'test';
  const tags = [];
  const event = createEvent(privateKey, kind, content, tags);
  await publishEvent(relays, event);
});
