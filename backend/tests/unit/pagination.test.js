const { paginate, buildPaginationMeta } = require('../../src/utils/pagination');

describe('paginate()', () => {
  it('defaults to page 1 and limit 10 when nothing is provided', () => {
    expect(paginate({})).toEqual({ page: 1, limit: 10, offset: 0 });
  });

  it('calculates the correct offset for a given page and limit', () => {
    expect(paginate({ page: 3, limit: 20 })).toEqual({ page: 3, limit: 20, offset: 40 });
  });

  it('falls back to defaults for invalid (non-numeric) input', () => {
    expect(paginate({ page: 'abc', limit: 'xyz' })).toEqual({ page: 1, limit: 10, offset: 0 });
  });

  it('never allows a page below 1', () => {
    expect(paginate({ page: -5, limit: 10 })).toEqual({ page: 1, limit: 10, offset: 0 });
  });

  it('caps limit at 100 to prevent abuse', () => {
    expect(paginate({ page: 1, limit: 5000 })).toEqual({ page: 1, limit: 100, offset: 0 });
  });
});

describe('buildPaginationMeta()', () => {
  it('computes total pages correctly', () => {
    expect(buildPaginationMeta({ page: 1, limit: 10, total: 25 })).toEqual({
      page: 1,
      limit: 10,
      total: 25,
      totalPages: 3,
    });
  });

  it('returns 0 total pages when there are no results', () => {
    expect(buildPaginationMeta({ page: 1, limit: 10, total: 0 }).totalPages).toBe(0);
  });
});
