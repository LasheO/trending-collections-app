module.exports = {
  moduleNameMapper: {
    '^react-router-dom$': '<rootDir>/src/tests/mocks/react-router-dom.js'
  },
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.js'],
  testEnvironment: 'jsdom'
};