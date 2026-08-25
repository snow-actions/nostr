import * as core from '@actions/core';
import { load } from 'js-yaml';
import { createEvent } from './event.js';
import { publishEvent } from './publish.js';
import { isAllowedRelay } from './relay.js';

async function run() {
  try {
    const relaysInput = core.getInput('relays');
    const relays = relaysInput.split("\n").map(x => x.trim()).filter(isAllowedRelay);
    const privateKey = core.getInput('private-key');
    const content = core.getInput('content');
    const kind = Number(core.getInput('kind', { trimWhitespace: true }));
    const tags = load(core.getInput('tags'));
    core.setSecret(privateKey);
    const event = createEvent(privateKey, kind, content, tags);
    await publishEvent(relays, event);
    core.setOutput('event', JSON.stringify(event));
  } catch (error) {
    core.setFailed(error instanceof Error ? error.message : String(error));
  }
}

run();
