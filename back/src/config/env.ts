type Environment = Record<string, string | undefined>;

function required(env: Environment, key: string): string {
  const value = env[key];
  if (value === undefined || value.trim() === '') {
    throw new Error(`Falta la variable ${key}.`);
  }
  return value;
}

function port(env: Environment, key: string): number {
  const raw = required(env, key);
  const value = Number(raw);

  if (!/^\d+$/.test(raw) ||
      !Number.isInteger(value) ||
      value < 1 ||
      value > 65535) {
    throw new Error(`${key} debe ser un puerto válido.`);
  }

  return value;
}

export function readConfig(env: Environment) {
  const mode = required(env, 'NODE_ENV');

  if (!['development', 'test', 'production'].includes(mode)) {
    throw new Error('NODE_ENV no es válido.');
  }

  const host = required(env, 'MONGO_HOST');
  if (!/^[a-zA-Z0-9.-]+$/.test(host)) {
    throw new Error('MONGO_HOST debe ser un hostname o una dirección IPv4.');
  }

  const database = required(env, 'MONGO_DATABASE');
  const username = required(env, 'MONGO_USERNAME');

  if (mode === 'test') {
    if (database !== 'vhsa_test' || username !== 'vhsa_test') {
      throw new Error('Las pruebas requieren vhsa_test como base y usuario.');
    }
  } else {
    if (database === 'vhsa_test' || username !== 'vhsa_app') {
      throw new Error('La aplicación requiere vhsa_app y una base distinta de pruebas.');
    }
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(database)) {
    throw new Error('MONGO_DATABASE no es válido.');
  }

  return {
    mode,
    apiPort: port(env, 'API_PORT'),
    mongo: {
      host,
      port: port(env, 'MONGO_PORT'),
      database,
      username,
      password: required(env, 'MONGO_PASSWORD')
    }
  };
}

export type AppConfig = ReturnType<typeof readConfig>;
