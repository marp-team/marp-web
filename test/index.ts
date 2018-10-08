import index from '../src/index'

afterAll(() => jest.restoreAllMocks())

describe('index', () => {
  it('logs to console', () => {
    const log = jest.spyOn(console, 'log').mockImplementation()

    index()
    expect(log).toBeCalledTimes(1)
  })
})
