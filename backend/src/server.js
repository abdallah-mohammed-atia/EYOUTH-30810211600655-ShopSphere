require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    // In development only: sync models for convenience. In staging/production
    // use explicit migrations (see backend/NON_DESTRUCTIVE_MIGRATION.md) and
    // do NOT run schema-altering sync on app startup.
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Development sync completed.');
    } else {
      // Ensure DB is reachable but avoid altering schema in non-dev environments.
      await sequelize.authenticate();
      console.log('Production mode: skipping schema sync (use migrations).');
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Unable to start server:', err);
    process.exit(1);
  }
}

start();
