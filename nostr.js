const secp = require('@noble/secp256k1');
const { setTimeout } = require('node:timers/promises');
const WebSocket = require('ws');

/**
 * @param {string} privateKey
 * @param {string} content
 */
module.exports.createMessage = async (privateKey, content) => {
  const kind = 1;
  const tags = [];
  const publicKey = secp.utils.bytesToHex(secp.schnorr.getPublicKey(privateKey));
  const createdAt = Math.round(Date.now() / 1000);
  const json = JSON.stringify([
    0,
    publicKey,
    createdAt,
    kind,
    tags,
    content,
  ]);
  console.debug('[json]', json);
  const id = secp.utils.bytesToHex(await secp.utils.sha256(new TextEncoder().encode(json)));
  console.debug('[id]', id);
  const sig = secp.utils.bytesToHex(await secp.schnorr.sign(id, privateKey));
  console.debug('[sig]', sig);

  const message = JSON.stringify([
    'EVENT',
    {
      id,
      pubkey: publicKey,
      created_at: createdAt,
      kind,
      tags,
      content,
      sig,
    },
  ]);
  console.info(message);

  return message;
};

/**
 * @param {string} relay
 * @param {object} message
 */
module.exports.postMessage = async (relay, message) => {
  console.info(`Connect to ${relay}`);

  return new Promise(async (resolve, reject) => {
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
