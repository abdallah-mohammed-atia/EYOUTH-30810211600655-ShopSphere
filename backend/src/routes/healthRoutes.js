const express = require('express');
const { getMongoDb } = require('../lib/mongo');
const prisma = require('../lib/prisma');

const router = express.Router();

router.get('/health', async (req, res) => {
  try {
    const mongoDb = await getMongoDb();
    const mongoStatus = mongoDb ? 'ok' : 'down';
    await prisma.$queryRaw`SELECT 1`;
    return res.status(200).json({ status: 'ok', postgres: 'ok', mongodb: mongoStatus });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
