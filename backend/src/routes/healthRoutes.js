const express = require('express');
const { getMongoDb } = require('../lib/mongo');
const prisma = require('../lib/prisma');

const router = express.Router();

router.get('/health', async (req, res) => {
  try {
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (err) {
      if (err.message && err.message.includes('prepared statement')) {
        await prisma.$queryRaw`SELECT 1`;
      } else {
        throw err;
      }
    }
  } catch (err) {
    return res.status(500).json({ status: 'error', postgres: 'down', message: err.message });
  }

  let mongoStatus = 'down';
  try {
    const mongoDb = await getMongoDb();
    mongoStatus = mongoDb ? 'ok' : 'down';
  } catch (err) {
    mongoStatus = 'down';
  }

  return res.status(200).json({
    status: 'ok',
    postgres: 'ok',
    mongodb: mongoStatus,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
