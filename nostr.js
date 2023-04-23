const { nip19, getPublicKey, getEventHash, signEvent } = require('nostr-tools');
const { setTimeout } = require('node:timers/promises');
const WebSocket = require('ws');

/**
 * @param {string} privateKey
 * @param {string} content
 */
module.exports.createMessage = async (privateKey, content) => {
  if (privateKey.startsWith('nsec')) {
    privateKey = nip19.decode(privateKey).data;
  }

  const kind = 1;
  const tags = [];
  const createdAt = Math.round(Date.now() / 1000);
  let event = {
    created_at: createdAt,
    kind,
    tags,
    content,
    pubkey: getPublicKey(privateKey),
  };
  console.log(event);
  event.id = getEventHash(event);
  event.sig = signEvent(event, privateKey);

  const message = JSON.stringify([
    'EVENT',
    event,
  ]);
  console.info(message);

  return message;
};

/**
 * @param {string} relay
 * @param {object} message
 */
module.exports.postMessage = (relay, message) => {
  console.info(`Connect to ${relay}`);

  return new Promise((resolve, reject) => {
    // Timeout in 3 seconds
    setTimeout(() => {
        reject('Timed out');
    }, 3000);

    const ws = new WebSocket(relay);
    ws.on('error', data => {
      console.error('Error');
      reject(data);
    });
    ws.on('open', () => {
      console.info('Opened');
      ws.send(message);
    });
    ws.on('message', json => {
      console.info('Message');
      const data = JSON.parse(json);
      console.info(data);
      const [ messageType ] = data;
      if (messageType !== 'OK') {
        reject(json);
      }
      ws.close();
      resolve();
    });
  });
};
