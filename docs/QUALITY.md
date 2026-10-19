# VHSA — Contrato de calidad

## Principio
Cada funcionalidad se entrega con evidencia acorde a su comportamiento.
Las pruebas automatizadas se incorporan durante su implementación.
La revisión manual comprueba experiencia, presentación y criterios de producto.

No posponer todas las pruebas hasta el final del proyecto.
No considerar lint, tipos o build como sustitutos de pruebas de comportamiento.

## Dependencias
- Node: 22.19.0.
- npm: 10.9.3.
- Versiones principales: docs/VERSIONS.md.
- Guardar nuevas dependencias con versión exacta.
- Respetar los requisitos engines.
- Mantener un único package-lock.json en la raíz del monorepo.
- Versionar el lockfile desde la primera instalación.
- Usar npm ci para instalaciones reproducibles con lockfile.
- No resolver incompatibilidades mediante --force o --legacy-peer-deps.
- Revisar y documentar las actualizaciones antes de incorporarlas.

## Backend
Herramientas previstas: Vitest y Supertest.

Comprobar según la funcionalidad:
- Reglas de negocio y validación de entradas.
- Respuestas HTTP, códigos de estado y errores.
- Autenticación y autorización.
- Persistencia e índices cuando intervenga MongoDB.
- Exclusión de borradores en consultas públicas.
- Publicación y retirada de publicaciones.

Separar la aplicación Express del arranque del servidor para permitir pruebas.

## Frontend
Herramientas previstas: Vitest, Testing Library y jsdom.

Comprobar según la funcionalidad:
- Comportamiento observable por la persona usuaria.
- Formularios, validaciones y acciones.
- Estados de carga, vacío, error y éxito.
- Interacciones por teclado y nombres accesibles.
- Preferencia de tema.

Priorizar consultas por rol y nombre accesible.
Evitar pruebas que solo repitan detalles internos de implementación.
Los comportamientos que requieran un navegador real se prueban con Playwright.

## Recorridos completos
Herramienta prevista: Playwright.

Recorridos críticos:
- Leer una entrada publicada desde el listado.
- Buscar y filtrar entradas.
- Iniciar y cerrar sesión como administrador.
- Crear, guardar y editar un borrador.
- Publicar y comprobar su aparición en el sitio.
- Retirar una publicación y comprobar su ausencia pública.
- Cambiar el tema y conservar la preferencia al recargar.

Añadir recorridos cuando estén disponibles sus componentes.
La etapa de integración completa y consolida esta cobertura.

## Aislamiento de datos
- Desarrollo: vhsa_dev, usuario vhsa_app.
- Pruebas: vhsa_test, usuario vhsa_test.
- La aplicación y las pruebas no utilizan vhsa_root.
- Las pruebas de integración y E2E deben apuntar al entorno de pruebas.
- Verificar explícitamente el nombre de la base antes de cualquier limpieza.
- Rechazar bases distintas de vhsa_test en las rutinas de limpieza de tests.
- Preparar datos controlados y evitar dependencia del orden de ejecución.
- No ejecutar suites que limpien la misma base simultáneamente sin aislamiento.

## Comprobaciones de cierre
Según el alcance del cambio:
1. Pruebas automatizadas del comportamiento modificado.
2. Lint y comprobación de tipos.
3. Build cuando corresponda al código o configuración afectados.
4. Verificación manual de los criterios de aceptación.
5. Revisión del diff y respaldo en Git.

Una comprobación no ejecutada se registra como pendiente.
No presentar una tarea como probada por existir un archivo de test.
No configurar comandos que aprueben silenciosamente por ausencia de pruebas.

## Criterios de las pruebas
- Deben detectar errores relevantes y ser reproducibles.
- Incluir casos correctos y fallos importantes.
- Evitar esperas arbitrarias y dependencias de servicios externos.
- Usar dobles de prueba en límites adecuados.
- No simular la base en una prueba cuyo objetivo sea verificar persistencia.
- La cobertura ayuda a detectar huecos; no sustituye evaluar los casos.

## Estado actual
- MongoDB: autenticación, permisos y persistencia verificados.
- Frontend y backend: todavía sin inicializar.
- Suites, lint, tipos, build y CI: pendientes de configuración.
- Este documento define los criterios; no acredita su ejecución.
