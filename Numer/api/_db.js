import mongoose from 'mongoose';

if (!mongoose.models.Solution) {
  mongoose.model('Solution', new mongoose.Schema({
    userId: String,
    method: String,
    input: Object,
    result: mongoose.Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now }
  }));
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}