const WebSocket = require('ws');
const { nip19, getPublicKey, finalizeEvent } = require('nostr-tools');
const { useWebSocketImplementation } = require('nostr-tools/pool');

useWebSocketImplementation(WebSocket);

/**
 * @param {string} privateKey
 * @param {number} kind
 * @param {string} content
 * @param {string[][]} tags
 */
module.exports.createEvent = (privateKey, kind, content, tags) => {
  const seckey = privateKey.startsWith('nsec') ? nip19.decode(privateKey).data : Uint8Array.from(Buffer.from(privateKey));

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
module.exports.publishEvent = (relays, event) => {
  console.log('[publish]', relays, event);

  let timeoutId;
  return new Promise((resolve, reject) => {
    const wss = relays.map(relay => {
      try {
        const ws = new WebSocket(relay);
        return ws;
      } catch (error) {
        console.warn('[connection error]', relay, error);
      }
    }).filter(ws => ws !== undefined);
    if (wss.length === 0) {
      reject();
    }
    const messages = new Map();
    const close = () => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
      for (const ws of wss) {
        if (ws.readyState === WebSocket.CLOSED) {
          continue;
        }
        ws.close();
      }
      for (const [url, json] of messages) {
        const [type, , result] = JSON.parse(json);
        if (type === 'OK' && result) {
          resolve();
        } else {
          console.warn('[fail]', url, json);
        }
      }
      reject();
    };
    timeoutId = setTimeout(() => {
      console.log('[timeout]');
      close();
    }, 3000);
    for (const ws of wss) {
      console.time(ws.url);
      ws.onerror = (error) => {
        console.warn('[error]', ws.url, error);
      };
      ws.onopen = () => {
        console.log('[open]', ws.url);
        ws.send(JSON.stringify(['EVENT', event]));
      };
      ws.onmessage = ({data}) => {
        console.log('[message]', ws.url, data);
        console.timeEnd(ws.url);
        messages.set(ws.url, data);
        if (messages.size === relays.length) {
          close();
        }
      };
    }
  });
};
