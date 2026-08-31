const { signToken, verifyToken } = require('../../src/utils/jwt');

describe('JWT utils', () => {
  it('signs a payload and can verify it back to the original values', () => {
    const token = signToken({ id: 42, role: 'admin' });
    const decoded = verifyToken(token);

    expect(decoded.id).toBe(42);
    expect(decoded.role).toBe('admin');
  });

  it('throws when verifying a malformed token', () => {
    expect(() => verifyToken('not-a-real-token')).toThrow();
  });

  it('throws when verifying a token signed with a different secret', () => {
    const jwt = require('jsonwebtoken');
    const badToken = jwt.sign({ id: 1 }, 'wrong_secret');
    expect(() => verifyToken(badToken)).toThrow();
  });
});
