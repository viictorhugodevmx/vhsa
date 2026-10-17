# Versiones del proyecto

## Estado de la selección

Versiones principales seleccionadas a partir de consultas al registro npm
y revisión de sus requisitos declarados.

Esta revisión confirma compatibilidad declarada entre los paquetes
consultados. La instalación, las dependencias transitivas, los builds
y las pruebas se verificarán al implementar cada workspace.

## Runtime

| Herramienta | Versión |
| --- | --- |
| Node.js | 22.19.0 |
| npm | 10.9.3 |

## Frontend

| Paquete | Versión seleccionada |
| --- | --- |
| next | 16.4.2 |
| create-next-app | 16.4.2 |
| react | 19.3.1 |
| react-dom | 19.3.1 |
| typescript | 5.9.3 |
| eslint-config-next | 16.4.2 |
| typescript-eslint | 8.71.2 |

React y React DOM se mantienen en la misma versión.
React 19.3.1 está dentro del rango admitido por Next 16.4.2.

TypeScript 5.9.3 está dentro del rango >=4.8.4 <6.1.0
de typescript-eslint 8.71.2.

## Backend

| Paquete | Versión seleccionada |
| --- | --- |
| express | 5.3.0 |
| mongodb | 7.7.0 |
| typescript | 5.9.3 |

El paquete mongodb es el driver de Node.js, no el servidor.

Su requisito de Node es compatible con 22.19.0.
La compatibilidad oficial del driver con MongoDB Server 8.0 se comprobará
antes de instalar el acceso a datos y se validará mediante integración.

## Pruebas

| Paquete | Versión seleccionada |
| --- | --- |
| vitest | 5.0.5 |
| vite | 8.3.4 |
| @testing-library/react | 16.3.3 |
| @testing-library/dom | 10.4.2 |
| jsdom | 26.1.0 |
| supertest | 7.3.1 |
| @playwright/test | 1.64.1 |

Vite 8.3.4 cumple los requisitos de Node y el rango ^8.0.0 admitido
por Vitest 5.0.5.

Vite se utiliza como parte de las herramientas de pruebas.
El frontend continúa siendo una aplicación Next.js.

Testing Library DOM 10.4.2 satisface el peer ^10.0.0 requerido
por React Testing Library.

JSDOM se utilizará para pruebas de componentes que necesiten un DOM.
No será necesario para los tests de backend ejecutados en entorno Node.

Los peers opcionales de Vitest no se instalarán automáticamente
como una lista de funcionalidades obligatorias.

Si se incorpora @vitest/coverage-v8, se utilizará la versión 5.0.5,
alineada con Vitest.

## Versiones descartadas

### JSDOM 30.1.3

Requiere:

```text
^22.22.2 || ^24.15.0 || >=26.0.0
```

Node.js 22.19.0 no satisface ese rango.
Se selecciona JSDOM 26.1.0, que declara Node >=18.

### TypeScript 7.0.2

Cumple el requisito del runtime, pero queda fuera del rango
>=4.8.4 <6.1.0 de typescript-eslint 8.71.2.

Se selecciona TypeScript 5.9.3.

## MongoDB en Docker

- Familia acordada: MongoDB 8.0.
- Arquitectura del equipo: x86_64.
- Plataforma de la imagen: linux/amd64.
- Digest observado para esa plataforma:

```text
sha256:4c7d0fb8fde0681e2ae443b0b09371ec9c31a81caab05af9579458bfcb30d656
```

Referencia reproducible candidata:

```text
mongo@sha256:4c7d0fb8fde0681e2ae443b0b09371ec9c31a81caab05af9579458bfcb30d656
```

El parche exacto del servidor se registrará al preparar la imagen.
La inspección del manifiesto no descargó las capas ni inició contenedores.

La instalación MongoDB 6.0.20 de Ubuntu permanece intacta.
El proyecto utilizará un volumen propio y, si se expone al host,
127.0.0.1:27018.

## Selecciones complementarias pendientes

Se resolverán antes de instalar las herramientas correspondientes:

- Versión exacta de ESLint y compatibilidad con sus plugins.
- Paquetes @types/node de la línea 22 y tipos de React de la línea 19.
- Tipos y utilidades adicionales del backend.
- Herramientas de formato, validación, sesiones y archivos.
- Parche exacto de MongoDB Server y comprobación del driver.

No son dependencias instaladas ni comprobaciones ya realizadas.

## Instalación reproducible

- Instalar las versiones seleccionadas de forma explícita.
- Generar un único package-lock.json en la raíz al preparar los workspaces.
- Versionar el lockfile.
- Utilizar npm ci para reproducir una instalación ya registrada.
- Ejecutar las comprobaciones del workspace después de instalar.
- Revisar requisitos de dependencias transitivas y conflictos de peers.
- No usar force ni legacy-peer-deps para ocultar incompatibilidades.
- Documentar cualquier ajuste antes de cambiar la selección.
