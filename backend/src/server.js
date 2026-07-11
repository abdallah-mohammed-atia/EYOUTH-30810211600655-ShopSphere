require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    // In production, prefer migrations over sync(). alter:true is convenient
    // for a capstone project but should be replaced with proper migrations
    // for a real production deployment.
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Unable to start server:', err);
    process.exit(1);
  }
}

start();
