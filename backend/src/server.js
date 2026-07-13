require('dotenv').config();

const app = require('./app');
const { sequelize } = require('./models');
const { connectMongo } = require('./lib/mongo');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    // PostgreSQL
    await sequelize.authenticate();
    console.log('PostgreSQL connection established.');

    // MongoDB
    await connectMongo();
    console.log('MongoDB connection established.');

    // Sync database only in development
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Development sync completed.');
    } else {
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