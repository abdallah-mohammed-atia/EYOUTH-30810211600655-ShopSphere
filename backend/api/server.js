const serverless = require('serverless-http');
const app = require('../src/app');
const { connectMongo } = require('../src/lib/mongo');
const prisma = require('../src/lib/prisma');

// Ensure DB connections are ready for serverless invocations
async function prepare() {
  try {
    await connectMongo();
  } catch (err) {
    // ignore: health endpoint will reflect DB state
  }

  try {
    await prisma.$connect();
  } catch (err) {
    // ignore: Prisma will attempt connection on demand
  }
}

prepare();

module.exports = serverless(app);
