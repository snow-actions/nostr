const core = require('@actions/core');
const { createEvent, publishEvent } = require('./nostr');

async function run() {
  try {
    const relaysInput = core.getInput('relays');
    const relays = relaysInput.split("\n").map(x => x.trim()).filter(x => x.startsWith('wss://'));
    const privateKey = core.getInput('private-key');
    const content = core.getInput('content');
    const kindString = core.getInput('kind', { trimWhitespace: true });
    console.log('[kind]', kindString);
    const kind = Number(kindString);
    core.setSecret(privateKey);
    const event = createEvent(privateKey, kind, content);
    await publishEvent(relays, event);
    core.setOutput('event', JSON.stringify(event));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
