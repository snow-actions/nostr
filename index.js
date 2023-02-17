import core from '@actions/core';
import { nostr } from './nostr.js';

async function run() {
  try {
    const relay = core.getInput('relay');
    const privateKey = core.getInput('private-key');
    const payload = core.getInput('payload');
    core.setSecret(privateKey);
    await nostr(relay, privateKey, payload);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
