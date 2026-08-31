const express = require('express');
const { getMongoDb } = require('../lib/mongo');
const prisma = require('../lib/prisma');

const router = express.Router();

async function checkPostgres() {
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    if (err.message && err.message.includes('prepared statement')) {
      await prisma.$queryRaw`SELECT 1`;
    } else {
      throw err;
    }
  }
}

router.get('/health', async (req, res) => {
  const now = new Date().toISOString();

  // Quick response by default to avoid serverless cold-start timeouts.
  // Use `?full=1` to run synchronous DB checks and get detailed status.
  if (req.query.full !== '1') {
    (async () => {
      try {
        await checkPostgres();
        const mongoDb = await getMongoDb();
        console.info('[health-check] postgres=ok mongodb=', mongoDb ? 'ok' : 'down');
      } catch (err) {
        console.warn('[health-check] background check failed:', err && err.message ? err.message : err);
      }
    })();

    return res.status(200).json({ status: 'ok', timestamp: now });
  }

  // Detailed synchronous checks (for debugging / monitoring)
  try {
    await checkPostgres();
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

  return res.status(200).json({ status: 'ok', postgres: 'ok', mongodb: mongoStatus, timestamp: now });
});

module.exports = router;
