# Arquitectura de VHSA

## Organización

Un repositorio con npm workspaces para dos aplicaciones:

- Frontend: Next.js y TypeScript.
- Backend: Express y TypeScript.

El navegador no accede directamente a MongoDB.
La API concentra las reglas de negocio, la autorización y la persistencia.

## Persistencia

MongoDB 8.0 se ejecutará en Docker con volumen propio.

El proyecto no modificará ni reutilizará los archivos de datos
de una instalación de MongoDB existente en el equipo.

Las pruebas utilizarán una base separada y controles que impidan
ejecutarlas contra los datos de desarrollo.

## Puertos de referencia

| Servicio | Puerto |
| --- | --- |
| Frontend | 3000 |
| API | 3001 |
| MongoDB dentro del contenedor | 27017 |
| MongoDB del proyecto expuesto al host, si se necesita | 27018 |

La exposición de MongoDB al host se limitará a 127.0.0.1.

## Contenido

Los artículos se almacenarán en MongoDB.

Las portadas se almacenarán inicialmente en una carpeta o volumen local,
fuera de Git. Los metadatos de los archivos se conservarán en la base.

## Comunicación

Se prevé acceso del navegador a la API mediante el mismo origen.
La configuración distinguirá las direcciones del navegador
de las direcciones internas entre servicios.

## Estado

Estructura inicial. Contratos, autenticación, almacenamiento y configuración
de contenedores se detallarán antes de su implementación.
