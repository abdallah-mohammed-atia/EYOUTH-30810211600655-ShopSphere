const { requireRole } = require('../../src/middleware/role');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('requireRole middleware', () => {
  it('calls next() when the user has an allowed role', () => {
    const req = { user: { role: 'admin' } };
    const res = mockRes();
    const next = jest.fn();

    requireRole('admin')(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns 403 when the user role is not allowed', () => {
    const req = { user: { role: 'customer' } };
    const res = mockRes();
    const next = jest.fn();

    requireRole('admin')(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when there is no authenticated user on the request', () => {
    const req = {};
    const res = mockRes();
    const next = jest.fn();

    requireRole('admin')(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('allows access when multiple roles are permitted', () => {
    const req = { user: { role: 'customer' } };
    const res = mockRes();
    const next = jest.fn();

    requireRole('admin', 'customer')(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
