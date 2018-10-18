export function createWorkerMock() {
  return () => ({
    addEventListener: jest.fn(),
    postMessage: jest.fn(),
  })
}

const defaultWorkerMock = createWorkerMock()()
export default jest.fn(() => defaultWorkerMock)
