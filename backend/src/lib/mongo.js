const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://mongo:27017/ecommerce';
const client = new MongoClient(uri);

let db = null;

async function connectMongo() {
  if (!db) {
    await client.connect();
    db = client.db();
  }
  return db;
}

async function getMongoDb() {
  return connectMongo();
}

module.exports = { connectMongo, getMongoDb };
