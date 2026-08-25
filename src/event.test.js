import assert from 'node:assert/strict';
import { test } from 'node:test';
import { generateSecretKey, getPublicKey, nip19, verifyEvent } from 'nostr-tools';
import { bytesToHex } from '@noble/hashes/utils.js';
import { createEvent } from './event.js';

test('createEvent with nsec', () => {
  const seckey = generateSecretKey();
  const nsec = nip19.nsecEncode(seckey);
  const expectedPubkey = getPublicKey(seckey);
  const content = 'test content';
  const kind = 42;
  const tags = [['t', 'test']];
  const createdEvent = createEvent(nsec, kind, content, tags);
  const eventToVerify = JSON.parse(JSON.stringify(createdEvent));

  assert.ok(Object.hasOwn(createdEvent, 'id'));
  assert.ok(Object.hasOwn(createdEvent, 'sig'));
  assert.strictEqual(createdEvent.pubkey, expectedPubkey);
  assert.strictEqual(createdEvent.kind, kind);
  assert.strictEqual(createdEvent.content, content);
  assert.deepStrictEqual(createdEvent.tags, tags);
  assert.strictEqual(verifyEvent(eventToVerify), true);
});

test('createEvent with seckey', () => {
  const seckey = generateSecretKey();
  const hexSeckey = bytesToHex(seckey);
  const expectedPubkey = getPublicKey(seckey);
  const createdEvent = createEvent(hexSeckey, 1, 'test', []);
  const eventToVerify = JSON.parse(JSON.stringify(createdEvent));

  assert.strictEqual(createdEvent.pubkey, expectedPubkey);
  assert.strictEqual(verifyEvent(eventToVerify), true);
});

test('createEvent rejects a malformed seckey', () => {
  assert.throws(() => createEvent('not-hex', 1, 'test', []));
});

test('createEvent rejects a malformed nsec', () => {
  assert.throws(() => createEvent('nsec-invalid', 1, 'test', []));
});
