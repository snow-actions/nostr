const core = require('@actions/core');
const { createEvent, publishEvent } = require('./nostr');

async function run() {
  try {
    const relaysInput = core.getInput('relays');
    const relays = relaysInput.split("\n").map(x => x.trim()).filter(x => x.startsWith('wss://'));
    const privateKey = core.getInput('private-key');
    const content = core.getInput('content');
    const kind = Number(core.getInput('kind', { trimWhitespace: true }))
    core.setSecret(privateKey);
    const event = createEvent(privateKey, kind, content);
    await publishEvent(relays, event);
    core.setOutput('event', JSON.stringify(event));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
