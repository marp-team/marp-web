const { jestPreset } = require('ts-jest')

module.exports = {
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '.*\\.d\\.ts'],
  coverageThreshold: { global: { lines: 95 } },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  setupFiles: ['jest-plugin-context/setup'],
  transform: jestPreset.transform,
  testEnvironment: 'jsdom',
  testRegex: '(/(test|__tests__)/(?!_).*|(\\.|/)(test|spec))\\.[jt]s$',
}
