import { createApp } from './app.js';
import { readConfig } from './config/env.js';
import { connectDatabase } from './database/mongo.js';

async function main() {
  const config = readConfig(process.env);
  const { client } = await connectDatabase(config.mongo);
  const app = createApp();
  const host = '127.0.0.1';

  let server: ReturnType<typeof app.listen>;

  try {
    server = app.listen(config.apiPort, host);

    await new Promise<void>((resolve, reject) => {
      server.once('listening', resolve);
      server.once('error', reject);
    });
  } catch (error) {
    await client.close();
    throw error;
  }

  console.log(`VHSA API disponible en http://${host}:${config.apiPort}`);
  console.log('Conexión con MongoDB establecida.');

  let shuttingDown = false;

  async function shutdown() {
    if (shuttingDown) return;
    shuttingDown = true;

    console.log('Cerrando VHSA API...');

    const timeout = setTimeout(() => {
      console.error('Se agotó el tiempo para cerrar la API.');
      process.exit(1);
    }, 10000);

    timeout.unref();

    try {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      });
    } finally {
      await client.close();
      clearTimeout(timeout);
    }

    console.log('Servidor HTTP y conexión MongoDB cerrados.');
  }

  function requestShutdown() {
    void shutdown().catch(() => {
      console.error('No se pudo completar el cierre correctamente.');
      process.exitCode = 1;
    });
  }

  process.once('SIGINT', requestShutdown);
  process.once('SIGTERM', requestShutdown);
}

main().catch(() => {
  console.error(
    'No se pudo iniciar VHSA API. Revisa configuración, MongoDB y disponibilidad del puerto.'
  );
  process.exitCode = 1;
});
