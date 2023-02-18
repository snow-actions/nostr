const core = require('@actions/core');
const nostr = require('./nostr');

async function run() {
  try {
    const relay = core.getInput('relay');
    const privateKey = core.getInput('private-key');
    const content = core.getInput('content');
    core.setSecret(privateKey);
    await nostr(relay, privateKey, content);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
