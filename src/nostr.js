import { finalizeEvent, getPublicKey } from 'nostr-tools/pure';
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
    pubkey: getPublicKey(seckey),
  };
  return finalizeEvent(event, seckey);
};

/**
 * @param {string[]} relays
 * @param {Event} event
 */
export const publishEvent = (relays, event, WebSocketImplementation = globalThis.WebSocket) => {
  console.log('[publish]', relays, event);

  return new Promise((resolve, reject) => {
    const wss = relays.map(relay => {
      try {
        const ws = new WebSocketImplementation(relay);
        return ws;
      } catch (error) {
        console.warn('[connection error]', relay, error);
      }
    }).filter(ws => ws !== undefined);
    if (wss.length === 0) {
      reject(new Error('Failed to create any WebSocket connections'));
      return;
    }
    const responses = new Map();
    const close = () => {
      clearTimeout(timeoutId);
      for (const ws of wss) {
        if (ws.readyState === WebSocketImplementation.CLOSED) {
          continue;
        }
        ws.close();
      }
    };
    const finish = () => {
      close();
      if ([...responses.values()].some(({ accepted }) => accepted)) {
        resolve();
        return;
      }
      const rejectionMessages = [...responses.values()]
        .map(({ message }) => message)
        .filter(message => typeof message === 'string' && message.length > 0);
      const details = rejectionMessages.length > 0 ? `: ${rejectionMessages.join('; ')}` : '';
      reject(new Error(`All relays rejected the event${details}`));
    };
    const timeoutId = setTimeout(() => {
      console.log('[timeout]');
      close();
      if ([...responses.values()].some(({ accepted }) => accepted)) {
        resolve();
        return;
      }
      reject(new Error('Timed out waiting for relay responses'));
    }, 3000);
    for (const ws of wss) {
      ws.onerror = (error) => {
        console.warn('[error]', ws.url, error);
      };
      ws.onopen = () => {
        console.log('[open]', ws.url);
        ws.send(JSON.stringify(['EVENT', event]));
      };
      ws.onmessage = ({data}) => {
        console.log('[message]', ws.url, data);
        if (responses.has(ws)) {
          return;
        }
        let response;
        try {
          response = JSON.parse(data);
        } catch {
          return;
        }
        if (!Array.isArray(response)
          || response[0] !== 'OK'
          || response[1] !== event.id
          || typeof response[2] !== 'boolean') {
          return;
        }
        responses.set(ws, { accepted: response[2], message: response[3] });
        if (responses.size === wss.length) {
          finish();
        }
      };
    }
  });
};
