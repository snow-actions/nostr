const nostr = require('./nostr');

test('test', async () => {
  const relay = process.env.NOSTR_RELAY;
  const privatekey = process.env.NOSTR_PRIVATE_KEY;
  const content = 'test';
  await nostr(relay, privatekey, content);
});
