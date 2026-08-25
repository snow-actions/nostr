import { jest } from '@jest/globals';
import {
  generateSecretKey,
  getPublicKey,
  nip19,
  verifyEvent,
} from "nostr-tools";
import { bytesToHex } from "@noble/hashes/utils.js";
import { createEvent, publishEvent } from "./nostr.js";

const mockWebSockets = [];
const mockConnectionErrors = new Set();

class FakeWebSocket {
  constructor(url) {
    if (mockConnectionErrors.has(url)) {
      throw new Error("connection error");
    }
    this.url = url;
    this.readyState = 1;
    this.send = jest.fn();
    this.close = jest.fn(() => {
      this.readyState = FakeWebSocket.CLOSED;
    });
    mockWebSockets.push(this);
  }
}
FakeWebSocket.CLOSED = 3;

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

test("createEvent with nsec", () => {
  const seckey = generateSecretKey();
  const nsec = nip19.nsecEncode(seckey);
  const expectedPubkey = getPublicKey(seckey);
  const content = "test content";
  const kind = 42;
  const tags = [["t", "test"]];
  const createdEvent = createEvent(nsec, kind, content, tags);
  const eventToVerify = JSON.parse(JSON.stringify(createdEvent));

  expect(createdEvent).toHaveProperty("id");
  expect(createdEvent).toHaveProperty("sig");
  expect(createdEvent.pubkey).toBe(expectedPubkey);
  expect(createdEvent.kind).toBe(kind);
  expect(createdEvent.content).toBe(content);
  expect(createdEvent.tags).toEqual(tags);
  expect(verifyEvent(eventToVerify)).toBe(true);
});

test("createEvent with seckey", () => {
  const seckey = generateSecretKey();
  const hexSeckey = bytesToHex(seckey);
  const expectedPubkey = getPublicKey(seckey);
  const createdEvent = createEvent(hexSeckey, 1, "test", []);
  const eventToVerify = JSON.parse(JSON.stringify(createdEvent));

  expect(createdEvent.pubkey).toBe(expectedPubkey);
  expect(verifyEvent(eventToVerify)).toBe(true);
});

test("createEvent rejects a malformed seckey", () => {
  expect(() => createEvent("not-hex", 1, "test", [])).toThrow();
});

test("createEvent rejects a malformed nsec", () => {
  expect(() => createEvent("nsec-invalid", 1, "test", [])).toThrow();
});

test("publishEvent resolves when all relays accept the event", async () => {
  const result = publishEvent(["wss://relay-1", "wss://relay-2"], event, FakeWebSocket);

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
  const result = publishEvent(["wss://relay-1", "wss://relay-2"], event, FakeWebSocket);

  respond(mockWebSockets[0], false);
  respond(mockWebSockets[1], true);

  await expect(result).resolves.toBeUndefined();
});

test("publishEvent rejects when all relays reject the event", async () => {
  const result = publishEvent(["wss://relay-1", "wss://relay-2"], event, FakeWebSocket);

  mockWebSockets.forEach((ws) => respond(ws, false));

  await expect(result).rejects.toBeUndefined();
});

test("publishEvent rejects when WebSocket construction fails", async () => {
  jest.useFakeTimers();
  mockConnectionErrors.add("wss://relay-1");

  await expect(publishEvent(["wss://relay-1"], event, FakeWebSocket)).rejects.toBeUndefined();
  expect(mockWebSockets).toHaveLength(0);
  expect(jest.getTimerCount()).toBe(0);
});

test("publishEvent rejects when relays time out", async () => {
  jest.useFakeTimers();
  const result = publishEvent(["wss://relay-1"], event, FakeWebSocket);

  const expectation = expect(result).rejects.toBeUndefined();
  jest.advanceTimersByTime(3000);

  await expectation;
  expect(mockWebSockets[0].close).toHaveBeenCalled();
});

test("publishEvent handles a WebSocket error and rejects on timeout", async () => {
  jest.useFakeTimers();
  const result = publishEvent(["wss://relay-1"], event, FakeWebSocket);
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
