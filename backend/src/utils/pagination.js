/**
 * Converts page/limit query params into Sequelize offset/limit.
 * Defaults: page 1, limit 8. Caps limit at 100 to prevent abuse.
 */
function paginate({ page, limit } = {}) {
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 8, 1), 100);
  const offset = (parsedPage - 1) * parsedLimit;

  return { page: parsedPage, limit: parsedLimit, offset };
}

function buildPaginationMeta({ page, limit, total }) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

module.exports = { paginate, buildPaginationMeta };
