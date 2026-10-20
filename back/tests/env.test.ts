import { describe, expect, it } from 'vitest';
import { readConfig } from '../src/config/env.js';

function validEnvironment() {
  return {
    NODE_ENV: 'development',
    API_PORT: '3001',
    MONGO_HOST: '127.0.0.1',
    MONGO_PORT: '27018',
    MONGO_DATABASE: 'vhsa_dev',
    MONGO_USERNAME: 'vhsa_app',
    MONGO_PASSWORD: 'example-only'
  };
}

describe('Configuración del backend', () => {
  it('interpreta los puertos y la base de desarrollo', () => {
    const config = readConfig(validEnvironment());

    expect(config.apiPort).toBe(3001);
    expect(config.mongo.port).toBe(27018);
    expect(config.mongo.database).toBe('vhsa_dev');
  });

  it('rechaza una contraseña ausente', () => {
    expect(() => readConfig({
      ...validEnvironment(),
      MONGO_PASSWORD: ''
    })).toThrow('Falta la variable MONGO_PASSWORD.');
  });

  it('rechaza puertos inválidos', () => {
    expect(() => readConfig({
      ...validEnvironment(),
      API_PORT: '70000'
    })).toThrow('API_PORT debe ser un puerto válido.');
  });

  it('rechaza el usuario administrador para la aplicación', () => {
    expect(() => readConfig({
      ...validEnvironment(),
      MONGO_USERNAME: 'vhsa_root'
    })).toThrow('La aplicación requiere vhsa_app');
  });

  it('impide usar la base de desarrollo en modo test', () => {
    expect(() => readConfig({
      ...validEnvironment(),
      NODE_ENV: 'test'
    })).toThrow('Las pruebas requieren vhsa_test');
  });

  it('acepta la base y el usuario exclusivos de pruebas', () => {
    const config = readConfig({
      ...validEnvironment(),
      NODE_ENV: 'test',
      MONGO_DATABASE: 'vhsa_test',
      MONGO_USERNAME: 'vhsa_test'
    });

    expect(config.mongo.database).toBe('vhsa_test');
  });
});
