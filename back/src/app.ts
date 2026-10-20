import express from 'express';
import type { ErrorRequestHandler } from 'express';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/v1/health', (_req, res) => {
    res.set('Cache-Control', 'no-store');
    res.status(200).json({
      data: {
        status: 'ok',
        service: 'vhsa-api'
      }
    });
  });

  app.use((_req, res) => {
    res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'Recurso no encontrado.'
      }
    });
  });

  const errorHandler: ErrorRequestHandler = (
    error: unknown,
    _req,
    res,
    next
  ) => {
    if (res.headersSent) {
      next(error);
      return;
    }

    const errorType =
      typeof error === 'object' && error !== null && 'type' in error
        ? error.type
        : undefined;

    if (errorType === 'entity.parse.failed') {
      res.status(400).json({
        error: {
          code: 'INVALID_JSON',
          message: 'El cuerpo de la solicitud no contiene JSON válido.'
        }
      });
      return;
    }

    if (errorType === 'entity.too.large') {
      res.status(413).json({
        error: {
          code: 'PAYLOAD_TOO_LARGE',
          message: 'El cuerpo de la solicitud excede el tamaño permitido.'
        }
      });
      return;
    }

    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Ocurrió un error interno.'
      }
    });
  };

  app.use(errorHandler);

  return app;
}
