import { MongoClient } from 'mongodb';
import type { AppConfig } from '../config/env.js';

export async function connectDatabase(config: AppConfig['mongo']) {
  const client = new MongoClient(
    `mongodb://${config.host}:${config.port}`,
    {
      auth: {
        username: config.username,
        password: config.password
      },
      authSource: config.database,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      maxPoolSize: 10
    }
  );

  try {
    await client.connect();
    const database = client.db(config.database);
    await database.command({ ping: 1 });

    return { client, database };
  } catch (error) {
    await client.close();
    throw error;
  }
}
