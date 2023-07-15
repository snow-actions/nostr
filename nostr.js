require('websocket-polyfill');
const { nip19, getPublicKey, getEventHash, signEvent, SimplePool } = require('nostr-tools');
const { setTimeout } = require('node:timers/promises');

/**
 * @param {string} privateKey
 * @param {number} kind
 * @param {string} content
 * @param {string[][]} tags
 */
module.exports.createEvent = (privateKey, kind, content, tags) => {
  if (privateKey.startsWith('nsec')) {
    privateKey = nip19.decode(privateKey).data;
  }

  const createdAt = Math.round(Date.now() / 1000);
  let event = {
    created_at: createdAt,
    kind,
    tags,
    content,
    pubkey: getPublicKey(privateKey),
  };
  event.id = getEventHash(event);
  event.sig = signEvent(event, privateKey);

  console.log('[event]', event);

  return event;
};

/**
 * @param {string[]} relays
 * @param {Event} event
 */
module.exports.publishEvent = (relays, event) => {
  console.log('[publish]', relays, event);

  return new Promise((resolve, reject) => {
    const pool = new SimplePool();
    const publishedRelays = [];
    const failedRelays = [];
    const close = () => {
      console.log('[close]');
      pool.close(relays);
      if (publishedRelays.length > 0) {
        resolve();
      } else {
        reject();
      }
    }
    const closeIfCompleted = () => {
      console.log('[ok | failed]', relays.length, publishedRelays.length, failedRelays.length);
      if (relays.length === publishedRelays.length + failedRelays.length) {
        close()
      }
    };
    setTimeout(() => {
      console.warn('[timeout]', relays, publishedRelays, failedRelays);
      close();
    }, 5000);

    const start = Date.now();
    const pub = pool.publish(relays, event);
    pub.on('ok', relay => {
      console.info('[ok]', relay, `${Date.now() - start}ms`);
      publishedRelays.push(relay);
      closeIfCompleted();
    });
    pub.on('failed', relay => {
      console.warn('[failed]', relay, `${Date.now() - start}ms`);
      failedRelays.push(relay);
      closeIfCompleted();
    });
  });
};
