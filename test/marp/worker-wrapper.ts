import WorkerWrapper from '../../src/marp/worker-wrapper'

describe('Worker wrapper', () => {
  it('does nothing and return passed value', () =>
    expect(WorkerWrapper('test')).toBe('test'))
})
