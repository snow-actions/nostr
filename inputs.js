const yaml = require('js-yaml');

/**
 * Parse the `relays` input into a list of `wss://` relay URLs.
 * @param {string} input
 * @returns {string[]}
 */
module.exports.parseRelays = (input) => {
  return input
    .split('\n')
    .map((x) => x.trim())
    .filter((x) => x.startsWith('wss://'));
};

/**
 * Parse the `tags` input (YAML/JSON) into an array of tag arrays.
 * @param {string} input
 * @returns {string[][]}
 */
module.exports.parseTags = (input) => {
  return yaml.load(input);
};
