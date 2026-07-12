const { sequelize } = require('../../src/models');
const { closeMongo } = require('../../src/lib/mongo');
const prisma = require('../../src/lib/prisma');

// Runs once before each integration test file against the PostgreSQL-backed
// test database configured for the project.
beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterEach(async () => {
  // Clean all tables between individual tests so one test's data can't
  // leak into another, without paying the cost of re-syncing every time.
  const models = sequelize.models;
  await Promise.all(
    Object.values(models)
      .filter((model) => typeof model.destroy === 'function')
      .map((model) => model.destroy({ where: {}, truncate: true, cascade: true }))
  );
});

afterAll(async () => {
  await sequelize.close();
  await closeMongo();
  await prisma.$disconnect();
});
