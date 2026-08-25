import { hashes, schnorr } from '@noble/secp256k1';
import { bech32 } from '@scure/base';
import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils.js';

hashes.sha256 = sha256;

/**
 * @param {string} privateKey
 * @param {number} kind
 * @param {string} content
 * @param {string[][]} tags
 */
export const createEvent = (privateKey, kind, content, tags) => {
  let seckey;
  if (privateKey.startsWith('nsec')) {
    const { prefix, words } = bech32.decode(privateKey, 5000);
    seckey = bech32.fromWords(words);
    if (prefix !== 'nsec' || seckey.length !== 32) {
      throw new Error('Invalid nsec private key');
    }
  } else {
    seckey = hexToBytes(privateKey);
  }

  const createdAt = Math.round(Date.now() / 1000);
  const event = {
    created_at: createdAt,
    kind,
    tags,
    content,
    pubkey: bytesToHex(schnorr.getPublicKey(seckey)),
  };
  const serializedEvent = JSON.stringify([0, event.pubkey, event.created_at, event.kind, event.tags, event.content]);
  const id = sha256(new TextEncoder().encode(serializedEvent));
  return {
    ...event,
    id: bytesToHex(id),
    sig: bytesToHex(schnorr.sign(id, seckey)),
  };
};
