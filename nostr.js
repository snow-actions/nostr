import * as secp from '@noble/secp256k1';
import { setTimeout } from 'timers/promises';
import WebSocket from 'ws';

const nostr = async (relay, privateKey, content) => {
  console.info(`Connect to ${relay}`);

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

  let done = false;

  const ws = new WebSocket(relay);
  ws.on('error', data => {
    console.error('Error');
    throw new Error(data);
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
      done = true;
      throw new Error(data);
    }
    ws.close();
    done = true;
  });

  while (!done) {
    console.info('waiting...');
    await setTimeout(100);
  }
};

export { nostr };
