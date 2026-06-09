const MockWebSocket = require('./test/mock-web-socket');

jest.mock('ws', () => require('./test/mock-web-socket'));

const { publishEvent } = require('./nostr');

const sampleEvent = {
  id: 'abc123',
  kind: 1,
  content: 'hi',
  tags: [],
  pubkey: 'pubkey',
  sig: 'sig',
  created_at: 0,
};

const okMessage = (id) => JSON.stringify(['OK', id, true, '']);
const failMessage = (id) => JSON.stringify(['OK', id, false, 'blocked']);

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'time').mockImplementation(() => {});
  jest.spyOn(console, 'timeEnd').mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

beforeEach(() => {
  MockWebSocket.reset();
});

describe('publishEvent', () => {
  test('resolves and sends EVENT when all relays accept', async () => {
    const promise = publishEvent(['wss://relay1', 'wss://relay2'], sampleEvent);

    expect(MockWebSocket.instances).toHaveLength(2);
    const [a, b] = MockWebSocket.instances;

    a.emitOpen();
    b.emitOpen();
    expect(JSON.parse(a.sent[0])).toEqual(['EVENT', sampleEvent]);
    expect(JSON.parse(b.sent[0])).toEqual(['EVENT', sampleEvent]);

    a.emitMessage(okMessage(sampleEvent.id));
    b.emitMessage(okMessage(sampleEvent.id));

    await expect(promise).resolves.toBeUndefined();
  });

  test('resolves when at least one relay accepts', async () => {
    const promise = publishEvent(['wss://ok', 'wss://bad'], sampleEvent);
    const [a, b] = MockWebSocket.instances;

    a.emitOpen();
    b.emitOpen();
    a.emitMessage(okMessage(sampleEvent.id));
    b.emitMessage(failMessage(sampleEvent.id));

    await expect(promise).resolves.toBeUndefined();
  });

  test('rejects when all relays reject the event', async () => {
    const promise = publishEvent(['wss://a', 'wss://b'], sampleEvent);
    const [a, b] = MockWebSocket.instances;

    a.emitOpen();
    b.emitOpen();
    a.emitMessage(failMessage(sampleEvent.id));
    b.emitMessage(failMessage(sampleEvent.id));

    await expect(promise).rejects.toBeUndefined();
  });

  test('tolerates a relay error and still resolves on acceptance', async () => {
    const promise = publishEvent(['wss://flaky'], sampleEvent);
    const [a] = MockWebSocket.instances;

    a.emitError(new Error('boom'));
    a.emitOpen();
    a.emitMessage(okMessage(sampleEvent.id));

    await expect(promise).resolves.toBeUndefined();
  });

  test('rejects when no relays can be opened', async () => {
    jest.useFakeTimers();
    const promise = publishEvent(['wss://throw-on-connect'], sampleEvent);

    await expect(promise).rejects.toBeUndefined();

    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('rejects on timeout when no relay responds', async () => {
    jest.useFakeTimers();
    const promise = publishEvent(['wss://slow'], sampleEvent);

    MockWebSocket.instances[0].emitOpen();
    jest.advanceTimersByTime(3000);

    await expect(promise).rejects.toBeUndefined();
    jest.useRealTimers();
  });
});
