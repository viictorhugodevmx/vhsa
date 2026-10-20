# VHSA — Backend

## Estado actual
Base implementada con Express, TypeScript y MongoDB.

Disponible:
- GET /api/v1/health.
- Respuesta JSON para rutas inexistentes.
- Manejo de JSON inválido y cuerpos JSON mayores a 1 MiB.
- Validación de variables de entorno.
- Conexión autenticada mediante el usuario de aplicación.
- Conexión a MongoDB antes de abrir el puerto HTTP.
- Cierre del servidor HTTP y del cliente MongoDB.
- Pruebas HTTP y de configuración.

Las rutas de artículos, archivos y autenticación documentadas en API.md
todavía no están implementadas.

## Estructura
- back/src/app.ts: configuración de Express.
- back/src/server.ts: arranque y cierre.
- back/src/config/env.ts: validación del entorno.
- back/src/database/mongo.ts: conexión a MongoDB.
- back/src/check-database.ts: comprobación de conexión y lectura.
- back/tests/app.test.ts: comportamiento HTTP.
- back/tests/env.test.ts: validación de configuración.

## Entorno local
- Node 22.19.0 y npm 10.9.3.
- API: http://127.0.0.1:3001.
- MongoDB Docker: 127.0.0.1:27018.
- Base de desarrollo: vhsa_dev.
- Usuario de aplicación: vhsa_app.

back/.env contiene exclusivamente la configuración del backend.
No copiar las credenciales del administrador a ese archivo.
La plantilla pública es back/.env.example.

El .env raíz corresponde a la infraestructura.
Los archivos .env reales están excluidos de Git.

Los scripts npm del workspace se ejecutan desde back.
Por eso --env-file=.env carga back/.env.

## Instalación
Desde la raíz del repositorio:

```bash
nvm use
npm ci
```

Antes de iniciar, preparar MongoDB y usuarios según DATABASE.md.
Crear back/.env a partir de su plantilla y completar MONGO_PASSWORD
con la contraseña existente de vhsa_app.
No generar una contraseña diferente sin actualizar antes el usuario.

## Desarrollo
Desde la raíz:

```bash
docker compose up -d --wait --wait-timeout 120 mongo
npm run dev --workspace @vhsa/back
```

## Compilación y ejecución
```bash
npm run build --workspace @vhsa/back
npm start --workspace @vhsa/back
```

El build genera back/dist.
El directorio dist no se versiona.

## Calidad
```bash
npm run typecheck --workspace @vhsa/back
npm run lint --workspace @vhsa/back
npm test --workspace @vhsa/back
npm run build --workspace @vhsa/back
```

Verificación realizada:
- Typecheck: correcto.
- Lint: correcto.
- Build: correcto.
- 10 pruebas aprobadas en 2 archivos.

Las pruebas actuales cubren HTTP y configuración.
No conectan una base real ni sustituyen futuras pruebas de integración.

## Comprobación de MongoDB
```bash
npm run db:check --workspace @vhsa/back
```

Conecta, ejecuta ping y realiza una lectura autenticada.
No escribe ni elimina documentos.
Cierra el cliente al terminar.
La salida JSON no incluye credenciales.

## Comprobación HTTP
Con el servidor iniciado, desde otra terminal:

```bash
curl --fail-with-body --silent --show-error \
  http://127.0.0.1:3001/api/v1/health \
  | python3 -m json.tool
```

Respuesta:
```json
{
  "data": {
    "status": "ok",
    "service": "vhsa-api"
  }
}
```

Esta ruta indica que el proceso HTTP responde.
No comprueba continuamente la disponibilidad de MongoDB.

## Arranque y cierre
- Primero se valida la configuración.
- Después se establece la conexión con MongoDB.
- Solo entonces se abre el puerto HTTP.
- Un fallo de arranque termina con código 1.
- SIGINT y SIGTERM inician el cierre.
- Se cierra HTTP antes que el cliente MongoDB.
- Existe un límite de 10 segundos para el cierre.

## Evidencia manual
- Servidor compilado iniciado con MongoDB disponible.
- Ruta de salud respondió correctamente.
- Ctrl+C cerró HTTP y MongoDB.
- Puerto inválido rechazado con código 1.
- Con MongoDB detenido, el arranque falló con código 1.
- En ese fallo no quedó ningún proceso escuchando en 3001.
- Tras recuperar MongoDB, la lectura con vhsa_app volvió a funcionar.

## Pendientes
- Sesiones y administrador.
- Funcionalidades de entradas y archivos.
- Pruebas de integración automatizadas con vhsa_test.
- Frontend y recorridos E2E.
- CI y configuración de despliegue.
