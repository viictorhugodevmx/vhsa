import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { appendFileSync, chmodSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { parseEnv } from 'node:util';

const env = parseEnv(readFileSync('.env', 'utf8'));

assert.equal(env.MONGO_DB_NAME, 'vhsa_dev');
assert.equal(env.MONGO_TEST_DB_NAME, 'vhsa_test');

const additions = [];

for (const key of ['MONGO_APP_PASSWORD', 'MONGO_TEST_PASSWORD']) {
  if (!(key in env)) {
    env[key] = randomBytes(32).toString('hex');
    additions.push(`${key}=${env[key]}`);
  }
  assert.ok(env[key], `La variable ${key} está vacía.`);
}

chmodSync('.env', 0o600);

if (additions.length > 0) {
  appendFileSync('.env', `\n${additions.join('\n')}\n`);
}

const users = [
  {
    user: 'vhsa_app',
    database: env.MONGO_DB_NAME,
    password: env.MONGO_APP_PASSWORD,
    forbidden: env.MONGO_TEST_DB_NAME
  },
  {
    user: 'vhsa_test',
    database: env.MONGO_TEST_DB_NAME,
    password: env.MONGO_TEST_PASSWORD,
    forbidden: env.MONGO_DB_NAME
  }
];

const mongoScript = `
const users = JSON.parse(require('fs').readFileSync(0, 'utf8'));
const admin = db.getSiblingDB('admin');
admin.auth(
  process.env.MONGO_INITDB_ROOT_USERNAME,
  process.env.MONGO_INITDB_ROOT_PASSWORD
);

for (const item of users) {
  const target = db.getSiblingDB(item.database);
  const existing = target.getUser(item.user);

  if (!existing) {
    target.createUser({
      user: item.user,
      pwd: item.password,
      roles: [{ role: 'readWrite', db: item.database }]
    });
  } else {
    const roles = existing.roles;
    if (roles.length !== 1 ||
        roles[0].role !== 'readWrite' ||
        roles[0].db !== item.database) {
      throw new Error('Roles inesperados para ' + item.user);
    }
  }

  // Conexión independiente: no hereda la sesión del administrador.
  const connection = new Mongo('mongodb://127.0.0.1:27017');
  const own = connection.getDB(item.database);
  own.auth(item.user, item.password);

  const collection = own.getCollection('_vhsa_access_check');
  const marker = new ObjectId();
  try {
    collection.insertOne({ _id: marker, purpose: 'access-check' });
    if (!collection.findOne({ _id: marker })) {
      throw new Error('No se confirmó lectura para ' + item.user);
    }
  } finally {
    collection.deleteOne({ _id: marker });
  }

  let denied = false;
  try {
    connection.getDB(item.forbidden)
      .getCollection('_vhsa_access_check')
      .findOne({});
  } catch (error) {
    if (error.code !== 13) throw error;
    denied = true;
  }

  if (!denied) {
    throw new Error('Acceso cruzado permitido para ' + item.user);
  }

  print(item.user + ': lectura/escritura OK; acceso a ' +
    item.forbidden + ' bloqueado.');
}
`;

const result = spawnSync(
  'docker',
  ['compose', 'exec', '-T', 'mongo', 'mongosh', '--quiet', '--eval', mongoScript],
  {
    input: JSON.stringify(users),
    encoding: 'utf8',
    maxBuffer: 1024 * 1024
  }
);

if (result.error || result.status !== 0) {
  // Evita mostrar contraseñas si alguna herramienta las incluye en un error.
  let details = [
    result.error?.message,
    result.stdout,
    result.stderr
  ].filter(Boolean).join('\n');

  for (const item of users) {
    details = details.replaceAll(item.password, '[REDACTED]');
  }

  console.error(details);
  process.exit(1);
}

process.stdout.write(result.stdout);
console.log('Usuarios de desarrollo y pruebas preparados.');
