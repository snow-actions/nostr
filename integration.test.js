require('dotenv').config();
const { createEvent, publishEvent } = require('./nostr');

// These tests talk to real relays / use real keys from the environment.
// They are skipped automatically when the corresponding variables are absent
// (e.g. local runs or forked CI without secrets).
const hasKeys = Boolean(process.env.NOSTR_PRIVATE_KEY) && Boolean(process.env.NOSTR_SECKEY);
const hasRelays = Boolean(process.env.NOSTR_RELAYS);

const describeKeys = hasKeys ? describe : describe.skip;
const describePublish = hasKeys && hasRelays ? describe : describe.skip;

describeKeys('createEvent (integration)', () => {
  test('creates a signed event from nsec', () => {
    const event = createEvent(process.env.NOSTR_PRIVATE_KEY, 1, 'test', []);
    expect(event).toHaveProperty('id');
    expect(event).toHaveProperty('sig');
    expect(event.content).toBe('test');
  });

  test('creates a signed event from hex seckey', () => {
    const event = createEvent(process.env.NOSTR_SECKEY, 1, 'test', []);
    expect(event).toHaveProperty('id');
    expect(event).toHaveProperty('sig');
    expect(event.content).toBe('test');
  });
});

describePublish('publishEvent (integration)', () => {
  test('publishes an event to the configured relays', async () => {
    const relays = process.env.NOSTR_RELAYS.split('\n')
      .map((x) => x.trim())
      .filter((x) => x.startsWith('wss://'));
    const event = createEvent(process.env.NOSTR_PRIVATE_KEY, 1, 'test', []);
    await publishEvent(relays, event);
  });
});
