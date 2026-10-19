# VHSA — Dominio v0.1

Estado: contrato aprobado; implementación pendiente.

## Entrada
| Campo | Regla |
|---|---|
| id | Identificador generado por el backend |
| title | Obligatorio; entre 1 y 160 caracteres |
| slug | Único; entre 1 y 180 caracteres |
| excerpt | Máximo 300 caracteres; obligatorio al publicar |
| contentMarkdown | Máximo 100 000 caracteres; obligatorio al publicar |
| category | vida, ideas, tecnologia; puede ser null en borrador |
| cover | Referencia a imagen y texto alternativo; puede ser null en borrador |
| status | draft o published |
| createdAt | Fecha de creación asignada por el backend |
| updatedAt | Fecha de última modificación asignada por el backend |
| publishedAt | Primera publicación; null hasta publicar por primera vez |

Título, extracto y texto alternativo se validan sin espacios exteriores.
El contenido Markdown conserva su formato; al publicar no puede estar
vacío ni contener únicamente espacios.

La autoría la asigna el backend:
Víctor Hugo Segundo Aguilar.
El cliente no puede asignar un autor arbitrario.

## Creación
El título es el único campo obligatorio para guardar un borrador.

Valores iniciales:
- excerpt: cadena vacía.
- contentMarkdown: cadena vacía.
- category: null.
- cover: null.
- status: draft.
- publishedAt: null.

El backend genera el slug inicial a partir del título.

## Slug
- Minúsculas ASCII, números y guiones entre palabras.
- Sin guiones iniciales, finales o consecutivos.
- Normalizar acentos y separadores al generarlo.
- Si el generado está ocupado, buscar un sufijo disponible.
- Un slug introducido manualmente que ya exista produce conflicto.
- Cambiar el título no cambia automáticamente el slug existente.
- Es editable antes de la primera publicación.
- Queda fijo desde la primera publicación, aunque después se retire.
- La unicidad incluye borradores y publicaciones.

## Edición
Campos editables:
title, slug, excerpt, contentMarkdown, category y cover.

- Omitir un campo conserva su valor.
- category: null y cover: null permiten quitarlos de un borrador.
- Enviar cover reemplaza juntos uploadId y alt.
- No aceptar campos desconocidos.
- No aceptar id, autor, estado o fechas enviados por el cliente.
- Los campos opcionales proporcionados deben respetar formato y límites.
- Guardar cambios en una publicación actualiza el artículo público.
- Una publicación editada debe seguir cumpliendo los requisitos de publicación.

## Publicación
Requiere:
- Título válido.
- Slug válido y único.
- Extracto no vacío.
- Contenido Markdown no vacío.
- Categoría válida.
- Portada existente y válida.
- Texto alternativo no vacío, máximo 300 caracteres.

Retirar publicación:
- Cambia el estado a draft.
- Excluye la entrada de listados y consultas públicas por slug.
- Conserva publishedAt y el slug.

Republicar conserva la fecha de primera publicación.
updatedAt refleja los cambios.

No hay borrado definitivo de entradas en esta versión.

## Portada del sitio
La entrada destacada es la publicación más reciente.
Orden público: publishedAt descendente, con id descendente como desempate.

## Imágenes
Entrada:
- JPEG, PNG y WebP estáticos.
- Máximo 5 MiB: 5 242 880 bytes.
- Máximo 20 000 000 de píxeles.
- Rechazar SVG, GIF y contenido animado.
- Validar el contenido real, no solo extensión o MIME declarado.

Procesamiento:
- Corregir orientación.
- Quitar metadatos.
- Convertir a WebP.
- Limitar el lado mayor a 1920 píxeles.
- No ampliar imágenes pequeñas.

Almacenamiento:
- Archivos locales fuera de Git.
- Nombres generados por el backend.
- Referencias mediante identificadores; no aceptar rutas arbitrarias.

Visibilidad:
- Subir un archivo no lo hace público.
- El administrador autenticado puede consultar imágenes privadas.
- El visitante puede consultar imágenes vinculadas a alguna entrada publicada.
- Si ninguna publicación utiliza la imagen, una solicitud pública recibe 404.
- Servir inicialmente las imágenes con Cache-Control: no-store.
- Esto no revoca copias descargadas previamente.

## Administrador y sesión
- Un administrador creado mediante un comando local.
- Sin registro público.
- Acceso con correo y contraseña.
- Contraseña almacenada mediante hash.
- Sesiones almacenadas en MongoDB.
- Navegador recibe un identificador opaco mediante cookie.
- Duración absoluta: 8 horas desde el inicio, sin renovación automática.
- La expiración se comprueba en cada solicitud.
- Cerrar sesión la invalida en servidor y retira la cookie.

Cookie:
- HttpOnly.
- SameSite=Lax.
- Sin atributo Domain.
- Secure con HTTPS.
- Excepción explícita para desarrollo local por HTTP.

El navegador consume la API mediante el mismo origen del sitio.
Las operaciones que modifican datos requieren protección CSRF.
HttpOnly no sustituye esa protección.

## Límites de acceso
Configurables:
- 5 intentos fallidos por combinación de IP y correo en 15 minutos.
- 30 intentos totales por IP en 15 minutos.
- Al superar el límite, responder 429 con Retry-After.
- Correo inexistente y contraseña incorrecta comparten mensaje de error.

## Casos de aceptación para las pruebas
- Crear borrador solo con título.
- Rechazar límites excedidos y campos desconocidos.
- Detectar slugs duplicados.
- Rechazar publicación incompleta.
- Conservar campos omitidos en PATCH.
- Impedir que una publicación quede incompleta al editar.
- Conservar slug tras primera publicación.
- Ocultar borradores y sus portadas privadas.
- Rechazar archivos inválidos, excesivos o animados.
- Mantener vista previa privada de imágenes.
- Rechazar sesiones expiradas o cerradas.
- Rechazar operaciones administrativas sin sesión y solicitudes CSRF.
- Verificar activación y vencimiento de límites de acceso.

Estos casos están definidos; todavía no se han implementado ni ejecutado.
