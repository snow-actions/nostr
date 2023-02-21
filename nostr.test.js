const { createMessage, postMessage } = require('./nostr');
require('dotenv').config();

test('test createMessage', async () => {
  const privateKey = process.env.NOSTR_PRIVATE_KEY;
  const content = 'test';
  const message = await createMessage(privateKey, content);
  const [ type, event ] = JSON.parse(message);
  expect(type).toBe('EVENT');
  expect(event).toHaveProperty('id');
  expect(event).toHaveProperty('pubkey');
  expect(event).toHaveProperty('created_at');
  expect(event).toHaveProperty('kind');
  expect(event).toHaveProperty('tags');
  expect(event).toHaveProperty('content');
  expect(event).toHaveProperty('sig');
  expect(event.content).toBe(content);
});

test('test', async () => {
  const relays = process.env.NOSTR_RELAYS.split("\n").map(x => x.trim()).filter(x => x.startsWith('wss://'));
  const privateKey = process.env.NOSTR_PRIVATE_KEY;
  const content = 'test';
  const message = await createMessage(privateKey, content);
  for (const relay of relays) {
    await postMessage(relay, message);
  }
});
