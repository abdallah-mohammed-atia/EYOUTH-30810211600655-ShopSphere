require('dotenv').config();

const path = require('path');
const app = require('./app');
const { connectMongo } = require('./lib/mongo');
const prisma = require('./lib/prisma');
const { execSync } = require('child_process');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectMongo();
    console.log('MongoDB connection established.');

    try {
      // Avoid blocking startup indefinitely if the database is unreachable in serverless environments.
      await Promise.race([
        prisma.$connect(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Prisma connect timeout')), 5000)),
      ]);
      console.log('Prisma client connected.');
    } catch (prismaErr) {
      console.warn('Prisma client connection failed or timed out (continuing):', prismaErr.message);
    }

    if (process.env.PRISMA_MIGRATE !== 'false') {
      try {
        console.log('Running Prisma migrations (deploy)...');
        execSync('npx prisma migrate deploy', { stdio: 'inherit' });
        console.log('Prisma migrations applied.');
      } catch (migErr) {
        console.warn('Prisma migrate failed (continuing):', migErr.message);
      }
    }

    try {
      const productCount = await prisma.product.count();
      if (productCount === 0) {
        console.log('No products found. Seeding sample catalog...');
        execSync('node scripts/seed.js', {
          stdio: 'inherit',
          cwd: path.resolve(__dirname, '..'),
        });
      }
    } catch (seedErr) {
      console.warn('Catalog seeding skipped:', seedErr.message);
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