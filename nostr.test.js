const { createEvent, publishEvent } = require('./nostr');
require('dotenv').config();

test('createEvent', async () => {
  const privateKey = process.env.NOSTR_PRIVATE_KEY;
  const content = 'test';
  const event = createEvent(privateKey, content);
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
  const content = 'test';
  const event = createEvent(privateKey, content);
  await publishEvent(relays, event);
});
