const core = require('@actions/core');
const { createMessage, postMessage } = require('./nostr');

async function run() {
  try {
    const relay = core.getInput('relay');
    const privateKey = core.getInput('private-key');
    const content = core.getInput('content');
    core.setSecret(privateKey);
    const message = await createMessage(privatekey, content);
    await postMessage(relay, message);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
