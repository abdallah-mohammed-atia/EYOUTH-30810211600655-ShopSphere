import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
const { ReadableStream, WritableStream, TransformStream } = require('web-streams-polyfill/ponyfill');

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

if (typeof global.TransformStream === 'undefined') {
  global.TransformStream = TransformStream;
}

if (typeof global.ReadableStream === 'undefined') {
  global.ReadableStream = ReadableStream;
}

if (typeof global.WritableStream === 'undefined') {
  global.WritableStream = WritableStream;
}

const { server } = require('./mocks/server');

// Establish API mocking before all tests, reset handlers between tests so
// one test's overrides don't leak into another, and clean up after all
// tests are done.
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
});
afterAll(() => server.close());
