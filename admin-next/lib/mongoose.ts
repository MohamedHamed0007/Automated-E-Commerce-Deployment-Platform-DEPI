import mongoose from "mongoose";

function getMongoUri(): string {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("Missing MONGO_URI environment variable.");
  }

  return mongoUri;
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var __mongoose_cache__: MongooseCache | undefined;
}

const globalCache = global.__mongoose_cache__ ?? {
  conn: null,
  promise: null,
};

global.__mongoose_cache__ = globalCache;

export async function connectToDatabase() {
  if (globalCache.conn) {
    return globalCache.conn;
  }

  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(getMongoUri(), {
      bufferCommands: false,
      dbName: "shipSphereDB",
    });
  }

  globalCache.conn = await globalCache.promise;
  return globalCache.conn;
}
