require('dotenv').config();

const app = require('./app');
const { sequelize } = require('./models');
const { connectMongo } = require('./lib/mongo');
const prisma = require('./lib/prisma');
const { execSync } = require('child_process');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    // PostgreSQL
    await sequelize.authenticate();
    console.log('PostgreSQL connection established.');

    // MongoDB
    await connectMongo();
    console.log('MongoDB connection established.');

    // Ensure Prisma client can connect
    try {
      await prisma.$connect();
      console.log('Prisma client connected.');
    } catch (pErr) {
      console.warn('Prisma client connect failed:', pErr.message);
    }

    // Run Prisma migrations/deploy (best-effort) so Prisma tables exist in CI and runtime.
    if (process.env.PRISMA_MIGRATE !== 'false') {
      try {
        console.log('Running Prisma migrations (deploy)...');
        execSync('npx prisma migrate deploy', { stdio: 'inherit' });
        console.log('Prisma migrations applied.');
      } catch (migErr) {
        console.warn('Prisma migrate failed (continuing):', migErr.message);
      }
    }

    // Sync Sequelize models in development only
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Development sync completed.');
    } else {
      console.log('Production mode: skipping Sequelize schema sync (use migrations).');
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