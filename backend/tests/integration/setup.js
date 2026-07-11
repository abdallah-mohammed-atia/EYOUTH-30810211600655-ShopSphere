const { sequelize } = require('../../src/models');

// Runs once before each integration test file. Because NODE_ENV=test points
// Sequelize at an in-memory SQLite DB (see src/config/db.js), this is fast
// and fully isolated from any real Postgres instance.
beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterEach(async () => {
  // Clean all tables between individual tests so one test's data can't
  // leak into another, without paying the cost of re-syncing every time.
  const models = sequelize.models;
  await Promise.all(
    Object.values(models).map((model) => model.destroy({ where: {}, truncate: true, cascade: true }))
  );
});

afterAll(async () => {
  await sequelize.close();
});
