import { createWorkerMock } from './worker-wrapper'

const worker = require.requireActual('../marp.worker')
worker.default = jest.fn(createWorkerMock())

module.exports = worker
