# VHSA — API v1

Estado: contrato aprobado; implementación pendiente.
Prefijo de todas las rutas: /api/v1.
Reglas de negocio y límites: docs/DOMAIN.md.

## Convenciones
- JSON para solicitudes y respuestas, salvo subida y entrega de imágenes.
- Identificadores serializados como strings.
- Fechas serializadas como ISO 8601 en UTC.
- No exponer rutas del sistema, credenciales, hashes ni detalles internos.
- Campos desconocidos en cuerpos de creación o edición: 400.

## Rutas públicas
| Método | Ruta | Resultado |
|---|---|---|
| GET | /posts | Resúmenes paginados de publicaciones |
| GET | /posts/:slug | Artículo publicado completo |
| GET | /categories | Categorías disponibles |
| GET | /media/:id | Imagen pública o imagen privada autorizada |

Las consultas públicas de entradas nunca devuelven borradores.
Un slug inexistente o no publicado devuelve 404.

Categorías:
- vida: Vida.
- ideas: Ideas.
- tecnologia: Tecnología.

## Listado público
Parámetros:
- page: entero desde 1; predeterminado 1.
- limit: entero entre 1 y 50; predeterminado 10.
- category: opcional; categoría válida.
- q: opcional; máximo 100 caracteres; busca en título y extracto.

Orden: publishedAt descendente, id descendente como desempate.
Parámetros inválidos: 400.
Sin resultados: 200 con data vacío.

Respuesta:
```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

## Sesión
| Método | Ruta | Resultado |
|---|---|---|
| POST | /auth/login | Iniciar sesión |
| GET | /auth/session | Consultar sesión vigente |
| POST | /auth/logout | Cerrar sesión |

Login recibe:
```json
{
  "email": "administrador@example.com",
  "password": "contraseña-de-ejemplo"
}
```

Login correcto y consulta de sesión: 200 con esta estructura:
```json
{
  "data": {
    "user": {
      "id": "identificador-del-administrador",
      "name": "Víctor Hugo Segundo Aguilar",
      "role": "admin"
    },
    "expiresAt": "2026-10-20T06:00:00.000Z"
  }
}
```

Los valores de identificador y fecha son ilustrativos.
La respuesta no incluye un token para almacenar en localStorage.

- Credenciales incorrectas: 401 con mensaje genérico.
- Consulta sin sesión válida: 401.
- Logout: 204 sin cuerpo, incluso si la sesión ya expiró.
- Límite de intentos excedido: 429 con Retry-After.
- Protección CSRF en operaciones que modifican datos.

## Administración
Todas estas rutas requieren sesión de administrador.

| Método | Ruta | Resultado |
|---|---|---|
| GET | /admin/posts | Listado administrativo paginado |
| GET | /admin/posts/:id | Detalle para edición |
| POST | /admin/posts | Crear borrador; 201 |
| PATCH | /admin/posts/:id | Guardar cambios; 200 |
| POST | /admin/posts/:id/publish | Publicar; 200 |
| POST | /admin/posts/:id/unpublish | Retirar publicación; 200 |
| POST | /admin/uploads | Subir portada; 201 |

El listado administrativo admite page, limit, category y q
con los mismos límites del listado público.
Añade status opcional: draft o published.
Omitir status incluye ambos estados.
Orden administrativo: updatedAt descendente, id descendente.

Crear, editar, publicar y retirar devuelven el detalle administrativo
actualizado dentro de data.

La administración usa id; la lectura pública de artículos usa slug.
El cliente no cambia status mediante PATCH.

## Cuerpos de creación y edición
Crear un borrador requiere únicamente:
```json
{
  "title": "Aprender también es volver a empezar"
}
```

Puede incluir los demás campos editables definidos en DOMAIN.md.

Ejemplo de edición:
```json
{
  "excerpt": "Ideas sobre los cambios y seguir construyendo.",
  "contentMarkdown": "## Dar espacio a la curiosidad\n\nVolver a empezar...",
  "category": "ideas",
  "cover": {
    "uploadId": "identificador-del-archivo",
    "alt": "Edificios iluminados por el sol de la tarde"
  }
}
```

PATCH modifica únicamente los campos proporcionados.
cover se reemplaza como objeto completo.
Publicar y retirar no requieren cuerpo.

## Campos de respuesta
Resumen público:
- id, title, slug, excerpt, category.
- cover, author.
- publishedAt, updatedAt.

Artículo público:
- Todos los campos del resumen.
- contentMarkdown.

Detalle administrativo:
- Todos los campos del artículo.
- status, createdAt.
- Admite valores incompletos propios del borrador.

Listado administrativo:
- Campos del detalle administrativo excepto contentMarkdown.

author:
```json
{
  "name": "Víctor Hugo Segundo Aguilar"
}
```

cover, cuando existe:
```json
{
  "uploadId": "identificador-del-archivo",
  "url": "/api/v1/media/identificador-del-archivo",
  "alt": "Edificios iluminados por el sol de la tarde"
}
```

El correo del administrador no forma parte de las respuestas públicas.

Recurso individual:
```json
{
  "data": {
    "id": "identificador",
    "title": "Título de ejemplo",
    "slug": "titulo-de-ejemplo"
  }
}
```

Este último ejemplo ilustra la envoltura; no enumera todos los campos.

## Subida y entrega de imágenes
POST /admin/uploads:
- multipart/form-data.
- Un archivo en el campo file.
- Límites y procesamiento definidos en DOMAIN.md.

Respuesta 201:
```json
{
  "data": {
    "id": "identificador-del-archivo",
    "url": "/api/v1/media/identificador-del-archivo",
    "mimeType": "image/webp",
    "width": 1600,
    "height": 1067,
    "sizeBytes": 245000
  }
}
```

El editor usa data.id como cover.uploadId.
Los valores anteriores son ilustrativos.

GET /media/:id:
- Entrega bytes de imagen con Content-Type: image/webp.
- No usa la envoltura JSON data en respuestas correctas.
- Requiere vínculo con una publicación o sesión de administrador.
- Archivo inexistente o no autorizado públicamente: 404.
- Cache-Control: no-store.

## Errores
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Revisa los campos indicados.",
    "fields": {
      "title": "El título es obligatorio."
    }
  }
}
```

fields es opcional y se utiliza para errores asociados a campos.

| HTTP | Uso |
|---|---|
| 200 | Consulta o actualización correcta |
| 201 | Borrador o archivo creado |
| 204 | Sesión cerrada; sin cuerpo |
| 400 | Datos o parámetros inválidos |
| 401 | Credenciales incorrectas o sesión ausente/inválida |
| 403 | Operación no permitida, incluida protección CSRF |
| 404 | Recurso inexistente o no disponible públicamente |
| 409 | Conflicto, por ejemplo slug duplicado |
| 413 | Archivo o cuerpo demasiado grande |
| 415 | Formato de archivo no admitido |
| 429 | Límite de solicitudes excedido |
| 500 | Error interno sin detalles técnicos |

Los errores de validación de contenido o dimensiones de una imagen
admitida por formato utilizan 400.
