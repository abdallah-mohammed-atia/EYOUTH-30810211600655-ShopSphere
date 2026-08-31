const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://mongo:27017/ecommerce';
console.log('MONGODB_URI present:', !!process.env.MONGODB_URI);
const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  family: 4,
});

let db = null;
let connectPromise = null;

async function connectMongo() {
  if (db) {
    return db;
  }

  if (!connectPromise) {
    connectPromise = (async () => {
      try {
        await client.connect();
        db = client.db();
        console.log('MongoDB connected successfully');
        return db;
      } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        db = null;
        connectPromise = null;
        return null;
      }
    })();
  }

  return connectPromise;
}

async function getMongoDb() {
  return connectMongo();
}

async function closeMongo() {
  try {
    await client.close();
  } catch (err) {
    // If the client is already closed or unavailable, ignore the error.
  } finally {
    db = null;
    connectPromise = null;
  }
}

module.exports = {
  connectMongo,
  getMongoDb,
  closeMongo,
};