module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: ['nostr.js', 'inputs.js'],
  coverageThreshold: {
    global: {
      statements: 95,
      branches: 80,
      functions: 95,
      lines: 95,
    },
  },
};
