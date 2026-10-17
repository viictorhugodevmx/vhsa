# VHSA

Bitácora personal de Víctor Hugo Segundo Aguilar: código, kilómetros,
libros y lo que pasa entre todo eso.

La identidad visual combina una composición editorial cálida con detalles
analógicos inspirados en el VHS.

## Estado

Proyecto en preparación. La aplicación todavía no está implementada.

La primera entrega será una versión completa y comprobada en local.
El despliegue se decidirá en una etapa posterior.

## Stack previsto

- Node.js 22.19.0.
- npm 10.9.3.
- Next.js con App Router y TypeScript.
- API separada con Express y TypeScript.
- MongoDB 8.0 en Docker.
- Pruebas unitarias, de integración y end-to-end.

Las versiones exactas pendientes se registrarán antes de instalar.

## Estructura

- `front/`: sitio público y administración.
- `back/`: API, reglas de negocio y acceso a datos.
- `e2e/`: pruebas del recorrido completo.
- `docs/`: documentación técnica del producto.
- `.github/workflows/`: automatización de comprobaciones.

El proyecto utiliza npm workspaces y tendrá un lockfile en la raíz.

## Entorno

```bash
nvm use
node --version
npm --version
```

Versiones esperadas:

- Node.js: v22.19.0.
- npm: 10.9.3.

Los comandos de instalación, ejecución y pruebas se incorporarán
cuando estén implementados.

## Configuración

`.env.example` contiene valores de referencia sin credenciales.

Los archivos `.env`, los datos locales, las portadas cargadas y los respaldos
no deben incorporarse al repositorio.

## Alcance inicial

Sitio público con temas claro y nocturno, artículos y categorías.
Administración privada para escribir Markdown, gestionar portadas,
guardar borradores, publicar y retirar publicaciones.

## Documentación

- [Arquitectura](docs/ARCHITECTURE.md)
- [Versiones](docs/VERSIONS.md)
