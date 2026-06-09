const {
  generateSecretKey,
  getPublicKey,
  verifyEvent,
  nip19,
} = require('nostr-tools');
const { bytesToHex } = require('@noble/hashes/utils');
const { createEvent } = require('./nostr');

describe('createEvent', () => {
  test('produces a verifiable signed event from an nsec key', () => {
    const seckey = generateSecretKey();
    const nsec = nip19.nsecEncode(seckey);

    const event = createEvent(nsec, 1, 'hello', []);

    expect(event).toMatchObject({
      kind: 1,
      content: 'hello',
      tags: [],
      pubkey: getPublicKey(seckey),
    });
    expect(event).toHaveProperty('id');
    expect(event).toHaveProperty('sig');
    expect(typeof event.created_at).toBe('number');
    expect(verifyEvent(event)).toBe(true);
  });

  test('nsec and hex keys derive the same pubkey', () => {
    const seckey = generateSecretKey();
    const nsec = nip19.nsecEncode(seckey);
    const hex = bytesToHex(seckey);

    const fromNsec = createEvent(nsec, 1, 'a', []);
    const fromHex = createEvent(hex, 1, 'a', []);

    expect(fromNsec.pubkey).toBe(getPublicKey(seckey));
    expect(fromHex.pubkey).toBe(fromNsec.pubkey);
  });

  test('reflects kind, content and tags into the event', () => {
    const seckey = generateSecretKey();
    const hex = bytesToHex(seckey);
    const tags = [
      ['e', 'eventid', '', 'root'],
      ['p', 'pubkeyhex'],
    ];

    const event = createEvent(hex, 7, 'reaction', tags);

    expect(event.kind).toBe(7);
    expect(event.content).toBe('reaction');
    expect(event.tags).toEqual(tags);
  });

  test('throws on a malformed hex private key', () => {
    expect(() => createEvent('not-a-valid-key', 1, 'x', [])).toThrow();
  });

  test('throws on a malformed nsec private key', () => {
    expect(() => createEvent('nsec1invalid', 1, 'x', [])).toThrow();
  });
});
