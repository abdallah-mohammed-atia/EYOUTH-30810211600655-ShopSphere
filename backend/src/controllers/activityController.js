const { getMongoDb } = require('../lib/mongo');

async function listActivity(req, res, next) {
  try {
    const db = await getMongoDb();
    const logs = await db.collection('activity').find({}).sort({ createdAt: -1 }).limit(20).toArray();
    return res.status(200).json({ items: logs });
  } catch (err) {
    next(err);
  }
}

module.exports = { listActivity };
