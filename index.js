const core = require('@actions/core');
const yaml = require('js-yaml');
const { createEvent, publishEvent } = require('./nostr');

function isAllowedRelay(relay) {
  if (relay.startsWith('wss://')) {
    return true;
  }

  if (!URL.canParse(relay)) {
    return false;
  }

  const url = new URL(relay);
  // Permit unencrypted connections only for the disposable relay used by local E2E tests.
  return url.protocol === 'ws:' && url.hostname === '127.0.0.1';
}

async function run() {
  try {
    const relaysInput = core.getInput('relays');
    const relays = relaysInput.split("\n").map(x => x.trim()).filter(isAllowedRelay);
    const privateKey = core.getInput('private-key');
    const content = core.getInput('content');
    const kind = Number(core.getInput('kind', { trimWhitespace: true }));
    const tags = yaml.load(core.getInput('tags'));
    core.setSecret(privateKey);
    const event = createEvent(privateKey, kind, content, tags);
    await publishEvent(relays, event);
    core.setOutput('event', JSON.stringify(event));
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports.isAllowedRelay = isAllowedRelay;

run();
