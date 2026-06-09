const core = require('@actions/core');
const { parseRelays, parseTags } = require('./inputs');
const { createEvent, publishEvent } = require('./nostr');

async function run() {
  try {
    const relays = parseRelays(core.getInput('relays'));
    const privateKey = core.getInput('private-key');
    const content = core.getInput('content');
    const kind = Number(core.getInput('kind', { trimWhitespace: true }));
    const tags = parseTags(core.getInput('tags'));
    core.setSecret(privateKey);
    const event = createEvent(privateKey, kind, content, tags);
    await publishEvent(relays, event);
    core.setOutput('event', JSON.stringify(event));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
