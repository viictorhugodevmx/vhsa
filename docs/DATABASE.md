# VHSA — MongoDB local

## Configuración verificada
- MongoDB: 8.0.34.
- Plataforma de la imagen: linux/amd64.
- Imagen fijada por digest en compose.yaml.
- Proyecto Compose: vhsa.
- Servicio: mongo.
- Puerto del host: 127.0.0.1:27018.
- Puerto dentro del contenedor: 27017.
- Volúmenes: vhsa_mongo_data y vhsa_mongo_config.

MongoDB 6.0.20 del host utiliza 27017 y permanece independiente.
No montar sus directorios de datos en el contenedor de VHSA.

## Usuarios y bases
| Usuario | Base de autenticación | Permisos |
|---|---|---|
| vhsa_root | admin | Administración de infraestructura |
| vhsa_app | vhsa_dev | readWrite en vhsa_dev |
| vhsa_test | vhsa_test | readWrite en vhsa_test |

La API utilizará vhsa_app.
Las pruebas utilizarán vhsa_test.
No utilizar el administrador como usuario de la aplicación.

## Credenciales
Las credenciales se conservan en .env, ignorado por Git.
.env.example documenta las variables sin incluir contraseñas.
Mantener .env con permisos 600.

Compose recibe únicamente las credenciales de administración.
El script de preparación lee las contraseñas de aplicación y pruebas
desde .env y las envía por la entrada estándar al proceso de preparación.

No compartir .env ni la salida completa de docker compose config,
porque puede mostrar credenciales.

## Preparación desde un clon nuevo
1. Activar la versión de Node indicada por .nvmrc.
2. Copiar .env.example a .env y establecer permisos 600.
3. Completar MONGO_INITDB_ROOT_PASSWORD con una contraseña aleatoria.
4. Eliminar de .env las líneas vacías MONGO_APP_PASSWORD y
   MONGO_TEST_PASSWORD para que el script las genere, o asignarles
   contraseñas aleatorias propias.
5. Ejecutar los comandos siguientes desde la raíz:

```bash
docker compose config --quiet
docker compose up -d --wait --wait-timeout 120 mongo
node scripts/setup-mongo-users.mjs
```

La creación inicial del administrador requiere un volumen vacío.
Cambiar la contraseña en .env no cambia la de un usuario ya creado.

El script de preparación:
- Genera las contraseñas de aplicación y pruebas si las variables no existen.
- Reutiliza credenciales existentes.
- Crea usuarios faltantes.
- Comprueba los roles de usuarios existentes, sin modificarlos.
- Verifica lectura y escritura en cada base.
- Exige que el acceso a la base contraria sea rechazado.
- Elimina los documentos temporales utilizados para comprobar acceso.

## Operación habitual

Consultar estado:
```bash
docker compose ps mongo
```

Detener conservando contenedor y datos:
```bash
docker compose stop mongo
```

Volver a iniciar:
```bash
docker compose up -d --wait --wait-timeout 120 mongo
```

Recrear el contenedor conservando sus volúmenes:
```bash
docker compose up -d --force-recreate --wait --wait-timeout 120 mongo
```

No usar docker compose down -v para una parada normal:
elimina los volúmenes del proyecto y sus datos.

## Evidencia de verificación
- Configuración Compose válida.
- Servicio healthy y autenticación de administrador correcta.
- Usuarios de desarrollo y pruebas con acceso limitado a su base.
- Acceso cruzado rechazado en ambas direcciones.
- Documento, usuarios y roles conservados después de recrear el contenedor.
- Documento de persistencia eliminado tras la comprobación.

La persistencia en volúmenes no sustituye un respaldo.
El procedimiento de backup y restauración corresponde a una etapa posterior.

## Conexiones futuras
Desde procesos ejecutados en Ubuntu:
- Host: 127.0.0.1.
- Puerto: 27018.

Desde servicios dentro de la misma red Compose:
- Host: mongo.
- Puerto: 27017.

Usar la base de autenticación correspondiente a cada usuario.
