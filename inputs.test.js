const { parseRelays, parseTags } = require('./inputs');

describe('parseRelays', () => {
  test('keeps only wss:// urls and trims whitespace', () => {
    const input = [
      'wss://relay1',
      '  wss://relay2  ',
      'ws://insecure',
      'https://example.com',
      '',
    ].join('\n');

    expect(parseRelays(input)).toEqual(['wss://relay1', 'wss://relay2']);
  });

  test('returns an empty array when there are no wss urls', () => {
    expect(parseRelays('')).toEqual([]);
    expect(parseRelays('ws://a\nhttp://b')).toEqual([]);
  });
});

describe('parseTags', () => {
  test('parses a YAML list of tag arrays', () => {
    const input = '- ["e", "id", "", "root"]\n- ["p", "pubkey"]';

    expect(parseTags(input)).toEqual([
      ['e', 'id', '', 'root'],
      ['p', 'pubkey'],
    ]);
  });

  test('parses an empty array literal', () => {
    expect(parseTags('[]')).toEqual([]);
  });
});
