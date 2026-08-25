export function isAllowedRelay(relay) {
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
