import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getPublicKey, nip19, verifyEvent } from 'nostr-tools';
import { schnorr } from '@noble/secp256k1';
import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils.js';
import { createEvent } from './event.js';

const privateKey = '67dea2ed018072d675f5415ecfaed7d2597555e202d85b3d65ea4e58d2d92ffa';
const seckey = hexToBytes(privateKey);

test('createEvent with nsec', (t) => {
  const nsec = nip19.nsecEncode(seckey);
  const expectedPubkey = getPublicKey(seckey);
  const content = 'test content';
  const kind = 42;
  const tags = [['t', 'test']];
  t.mock.method(Date, 'now', () => 1234567890000);
  const createdEvent = createEvent(nsec, kind, content, tags);
  const eventToVerify = JSON.parse(JSON.stringify(createdEvent));
  const serializedEvent = JSON.stringify([0, expectedPubkey, 1234567890, kind, tags, content]);
  const expectedId = bytesToHex(sha256(new TextEncoder().encode(serializedEvent)));

  assert.ok(Object.hasOwn(createdEvent, 'id'));
  assert.ok(Object.hasOwn(createdEvent, 'sig'));
  assert.strictEqual(createdEvent.pubkey, expectedPubkey);
  assert.strictEqual(createdEvent.id, expectedId);
  assert.strictEqual(createdEvent.kind, kind);
  assert.strictEqual(createdEvent.content, content);
  assert.deepStrictEqual(createdEvent.tags, tags);
  assert.strictEqual(schnorr.verify(hexToBytes(createdEvent.sig), hexToBytes(createdEvent.id), hexToBytes(createdEvent.pubkey)), true);
  assert.strictEqual(verifyEvent(eventToVerify), true);
});

test('createEvent with seckey', () => {
  const expectedPubkey = getPublicKey(seckey);
  const createdEvent = createEvent(privateKey, 1, 'test', []);
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

test('createEvent rejects an nsec with a non-32-byte payload', () => {
  assert.throws(() => createEvent(nip19.nsecEncode(new Uint8Array(31)), 1, 'test', []));
});

test('createEvent decodes the NIP-19 nsec test vector', (t) => {
  t.mock.method(Date, 'now', () => 1234567890000);
  const nsecEvent = createEvent('nsec1vl029mgpspedva04g90vltkh6fvh240zqtv9k0t9af8935ke9laqsnlfe5', 1, 'test', []);
  const hexEvent = createEvent(privateKey, 1, 'test', []);

  assert.strictEqual(nsecEvent.pubkey, hexEvent.pubkey);
  assert.strictEqual(nsecEvent.id, hexEvent.id);
});
