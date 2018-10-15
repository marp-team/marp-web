export function createWorkerMock() {
  return () => ({
    addEventListener: jest.fn(),
    postMessage: jest.fn(),
  })
}

export default jest.fn(createWorkerMock())
