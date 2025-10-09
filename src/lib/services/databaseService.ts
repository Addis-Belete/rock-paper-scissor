import mongoose from "mongoose";
import { config } from "@/config";
import { ErrorHandler } from "@/lib/utils/errorHandler";

if (!config.mongoDBUri) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const cached: {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
} =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).mongoose || { conn: null, promise: null };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).mongoose = cached;

export class DatabaseService {
  /**
   * Connect to MongoDB using a singleton pattern.
   * Retries automatically on transient errors.
   */
  static async connect(): Promise<typeof mongoose> {
    if (cached.conn) return cached.conn;
       console.log('here in connect')

    if (!cached.promise) {
      cached.promise = ErrorHandler.withRetry(() =>
        mongoose.connect(config.mongoDBUri, { bufferCommands: false })
      );
    }

    try {
      cached.conn = await cached.promise;
    } catch (err) {
      cached.promise = null;
      ErrorHandler.logError(err);
      throw err;
    }

    return cached.conn;
  }

  /**
   * Disconnect MongoDB.
   */
  static async disconnect(): Promise<void> {
    if (cached.conn) {
      await mongoose.disconnect();
      cached.conn = null;
      cached.promise = null;
    }
  }
}
