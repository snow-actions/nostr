const core = require('@actions/core');
const { createMessage, postMessage } = require('./nostr');

async function run() {
  try {
    const relaysInput = core.getInput('relays');
    const relays = relaysInput.split("\n").map(x => x.trim()).filter(x => x.startsWith('wss://'));
    const privateKey = core.getInput('private-key');
    const content = core.getInput('content');
    core.setSecret(privateKey);
    const message = await createMessage(privatekey, content);
    for (const relay of relays) {
      await postMessage(relay, message);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
