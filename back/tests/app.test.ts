import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';

describe('Base HTTP de VHSA', () => {
  it('responde a la consulta de salud', async () => {
    const response = await request(createApp())
      .get('/api/v1/health')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual({
      data: {
        status: 'ok',
        service: 'vhsa-api'
      }
    });
    expect(response.headers['cache-control']).toBe('no-store');
    expect(response.headers['x-powered-by']).toBeUndefined();
  });

  it('devuelve un error JSON para una ruta inexistente', async () => {
    const response = await request(createApp())
      .get('/api/v1/no-existe')
      .expect('Content-Type', /json/)
      .expect(404);

    expect(response.body).toEqual({
      error: {
        code: 'NOT_FOUND',
        message: 'Recurso no encontrado.'
      }
    });
  });

  it('rechaza JSON mal formado antes de resolver la ruta', async () => {
    const response = await request(createApp())
      .post('/api/v1/no-existe')
      .set('Content-Type', 'application/json')
      .send('{"title":')
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: 'INVALID_JSON',
        message: 'El cuerpo de la solicitud no contiene JSON válido.'
      }
    });
  });

  it('rechaza cuerpos JSON mayores a 1 MiB', async () => {
    const response = await request(createApp())
      .post('/api/v1/no-existe')
      .send({ content: 'a'.repeat(1024 * 1024) })
      .expect(413);

    expect(response.body).toEqual({
      error: {
        code: 'PAYLOAD_TOO_LARGE',
        message: 'El cuerpo de la solicitud excede el tamaño permitido.'
      }
    });
  });
});
