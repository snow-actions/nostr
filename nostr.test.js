const mockWebSockets = [];
const mockConnectionErrors = new Set();

jest.mock("ws", () => {
  class WebSocket {
    constructor(url) {
      if (mockConnectionErrors.has(url)) {
        throw new Error("connection error");
      }
      this.url = url;
      this.readyState = 1;
      this.send = jest.fn();
      this.close = jest.fn(() => {
        this.readyState = WebSocket.CLOSED;
      });
      mockWebSockets.push(this);
    }
  }
  WebSocket.CLOSED = 3;
  return WebSocket;
});

const { createEvent, publishEvent } = require("./nostr");
require("dotenv").config();

const event = { id: "event-id" };

const open = (ws) => ws.onopen();
const respond = (ws, accepted) => {
  ws.onmessage({ data: JSON.stringify(["OK", event.id, accepted]) });
};

beforeEach(() => {
  mockWebSockets.length = 0;
  mockConnectionErrors.clear();
  jest.spyOn(console, "log").mockImplementation();
  jest.spyOn(console, "warn").mockImplementation();
  jest.spyOn(console, "time").mockImplementation();
  jest.spyOn(console, "timeEnd").mockImplementation();
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

test("createEvent with nsec", async () => {
  const privateKey = process.env.NOSTR_PRIVATE_KEY;
  if (privateKey === undefined || privateKey === "") {
    throw new Error("NOSTR_PRIVATE_KEY is not defined");
  }
  const content = "test";
  const kind = 1;
  const tags = [];
  const event = createEvent(privateKey, kind, content, tags);
  expect(event).toHaveProperty("id");
  expect(event).toHaveProperty("pubkey");
  expect(event).toHaveProperty("created_at");
  expect(event).toHaveProperty("kind");
  expect(event).toHaveProperty("tags");
  expect(event).toHaveProperty("content");
  expect(event).toHaveProperty("sig");
  expect(event.content).toBe(content);
});

test("createEvent with seckey", async () => {
  const privateKey = process.env.NOSTR_SECKEY;
  if (privateKey === undefined || privateKey === "") {
    throw new Error("NOSTR_SECKEY is not defined");
  }
  const content = "test";
  const kind = 1;
  const tags = [];
  const event = createEvent(privateKey, kind, content, tags);
  expect(event).toHaveProperty("id");
  expect(event).toHaveProperty("pubkey");
  expect(event).toHaveProperty("created_at");
  expect(event).toHaveProperty("kind");
  expect(event).toHaveProperty("tags");
  expect(event).toHaveProperty("content");
  expect(event).toHaveProperty("sig");
  expect(event.content).toBe(content);
});

test("publishEvent resolves when all relays accept the event", async () => {
  const result = publishEvent(["wss://relay-1", "wss://relay-2"], event);

  mockWebSockets.forEach(open);
  mockWebSockets.forEach((ws) => respond(ws, true));

  await expect(result).resolves.toBeUndefined();
  expect(mockWebSockets[0].send).toHaveBeenCalledWith(
    JSON.stringify(["EVENT", event]),
  );
  expect(mockWebSockets[1].send).toHaveBeenCalledWith(
    JSON.stringify(["EVENT", event]),
  );
});

test("publishEvent resolves when at least one relay accepts the event", async () => {
  const result = publishEvent(["wss://relay-1", "wss://relay-2"], event);

  respond(mockWebSockets[0], false);
  respond(mockWebSockets[1], true);

  await expect(result).resolves.toBeUndefined();
});

test("publishEvent rejects when all relays reject the event", async () => {
  const result = publishEvent(["wss://relay-1", "wss://relay-2"], event);

  mockWebSockets.forEach((ws) => respond(ws, false));

  await expect(result).rejects.toBeUndefined();
});

test("publishEvent rejects when WebSocket construction fails", async () => {
  jest.useFakeTimers();
  mockConnectionErrors.add("wss://relay-1");

  await expect(publishEvent(["wss://relay-1"], event)).rejects.toBeUndefined();
  jest.runOnlyPendingTimers();
  expect(mockWebSockets).toHaveLength(0);
});

test("publishEvent rejects when relays time out", async () => {
  jest.useFakeTimers();
  const result = publishEvent(["wss://relay-1"], event);

  const expectation = expect(result).rejects.toBeUndefined();
  jest.advanceTimersByTime(3000);

  await expectation;
  expect(mockWebSockets[0].close).toHaveBeenCalled();
});

test("publishEvent handles a WebSocket error and rejects on timeout", async () => {
  jest.useFakeTimers();
  const result = publishEvent(["wss://relay-1"], event);
  const error = new Error("socket error");

  mockWebSockets[0].onerror(error);
  const expectation = expect(result).rejects.toBeUndefined();
  jest.advanceTimersByTime(3000);

  await expectation;
  expect(console.warn).toHaveBeenCalledWith(
    "[error]",
    "wss://relay-1",
    error,
  );
});
