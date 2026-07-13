const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://mongo:27017/ecommerce';
const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 1000,
  connectTimeoutMS: 1000,
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
        return db;
      } catch (err) {
        db = null;
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
