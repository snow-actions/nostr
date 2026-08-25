import { finalizeEvent } from 'nostr-tools/pure';
import * as nip19 from 'nostr-tools/nip19';
import { hexToBytes } from '@noble/hashes/utils.js';

/**
 * @param {string} privateKey
 * @param {number} kind
 * @param {string} content
 * @param {string[][]} tags
 */
export const createEvent = (privateKey, kind, content, tags) => {
  const seckey = privateKey.startsWith('nsec') ? nip19.decode(privateKey).data : hexToBytes(privateKey);

  const createdAt = Math.round(Date.now() / 1000);
  let event = {
    created_at: createdAt,
    kind,
    tags,
    content,
  };
  return finalizeEvent(event, seckey);
};
