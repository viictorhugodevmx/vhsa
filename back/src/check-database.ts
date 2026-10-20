import { readConfig } from './config/env.js';
import { connectDatabase } from './database/mongo.js';

async function main() {
  const config = readConfig(process.env);
  const { client, database } = await connectDatabase(config.mongo);

  try {
    // Además del ping, esta lectura requiere permisos sobre la base.
    await database.collection('_vhsa_access_check').findOne({});

    console.log(JSON.stringify({
      status: 'ok',
      database: database.databaseName,
      username: config.mongo.username,
      authenticatedRead: true
    }, null, 2));
  } finally {
    await client.close();
  }
}

main().catch(() => {
  console.error(
    'Falló la comprobación de MongoDB. Revisa el entorno, las credenciales y el servicio Compose.'
  );
  process.exitCode = 1;
});
