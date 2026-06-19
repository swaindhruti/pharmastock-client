import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri);
    globalWithMongo._mongoClientPromise = client.connect().then(client => {
      console.log('✅ Successfully connected to MongoDB Atlas!');
      return client;
    }).catch(err => {
      console.error('❌ Failed to connect to MongoDB Atlas:', err);
      throw err;
    });
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, {
    maxPoolSize: 10, // Restrict pool size for serverless efficiency
    minPoolSize: 1,
  });
  clientPromise = client.connect().then(client => {
    console.log('✅ Successfully connected to MongoDB Atlas! (Production Pool)');
    return client;
  }).catch(err => {
    console.error('❌ Failed to connect to MongoDB Atlas:', err);
    throw err;
  });
}

export default clientPromise;
