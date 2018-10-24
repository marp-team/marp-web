const { jestPreset } = require('ts-jest')

module.exports = {
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.tsx'],
  coveragePathIgnorePatterns: ['/node_modules/', '.*\\.d\\.ts'],
  coverageThreshold: { global: { lines: 95 } },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: ['jest-plugin-context/setup'],
  transform: jestPreset.transform,
  testEnvironment: 'jsdom',
  testRegex: '(/(test|__tests__)/(?!_).*|(\\.|/)(test|spec))\\.[jt]sx?$',
}
