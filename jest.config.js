const { jestPreset } = require('ts-jest')

module.exports = {
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.tsx'],
  coveragePathIgnorePatterns: ['/node_modules/', '.*\\.d\\.ts'],
  coverageThreshold: { global: { lines: 95 } },
  globals: {
    'ts-jest': {
      tsConfig: {
        jsx: 'react',
        jsxFactory: 'h',
      },
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: { '\\.module\\.(c|sc|sa)ss$': 'identity-obj-proxy' },
  setupFiles: ['jest-plugin-context/setup'],
  snapshotSerializers: ['preact-render-spy/snapshot'],
  transform: jestPreset.transform,
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', 'd.ts$'],
  testRegex: '(/(test|__tests__)/(?!_).*|(\\.|/)(test|spec))\\.[jt]sx?$',
}
