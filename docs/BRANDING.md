# VHSA — Identidad y experiencia v0.1

## Concepto
VHSA corresponde a Víctor Hugo Segundo Aguilar.
La dirección visual es "Archivo urbano": editorial, personal,
con un toque underground y referencias discretas al VHS.

El sitio reúne vida, experiencias, ideas y tecnología.
No se limita a un portafolio profesional.

## Identidad verbal
- Marca: VHSA.
- Firma: Víctor Hugo Segundo Aguilar.
- Descriptor: Archivo personal.
- Frase principal: Lo que vivo. Lo que pienso. Lo que queda.
- Texto de apoyo: Vida, ideas y tecnología. Un archivo en movimiento.
- Voz: cercana, directa y personal, en primera persona.
- No inventar fechas, ubicaciones ni datos biográficos.

## Colores
| Función | Claro | Oscuro |
|---|---|---|
| Fondo | #F3EFE6 | #171918 |
| Superficie | #FFFCF5 | #222522 |
| Texto principal | #20231F | #F3EFE6 |
| Texto secundario | #5D6258 | #B9BDB2 |
| Acento principal | #A8412B | #F08B70 |
| Acento secundario | #536044 | #B0BD91 |

Verificar el contraste de las combinaciones reales al implementar.
No comunicar estados únicamente mediante color.

## Tipografía y composición
- Títulos: tipografía condensada y fuerte.
- Cuerpo e interfaz: sans serif cómoda para lectura.
- Familias y pesos exactos: pendientes de selección antes de implementar.
- Fuentes alojadas localmente.
- Fotografía protagonista, divisores finos y espacio para respirar.
- Textura sutil, sin afectar la legibilidad.
- Logotipo con referencia a etiqueta VHS.
- Mantener la variante aprobada en la portada; las variaciones
  del logotipo generadas en otras maquetas no sustituyen esa referencia.
- Preparar el logotipo definitivo como recurso vectorial.

## Temas
- Opciones: claro, oscuro y sistema.
- Preferencia persistente.
- Evitar destellos del tema incorrecto al cargar.
- Aplicar ambos temas al sitio público y a la administración.

## Portada móvil aprobada
1. Cabecera con marca, selector de tema y menú.
2. Descriptor, frase principal y presentación.
3. Acción para explorar el archivo.
4. Entrada destacada con fotografía y enlace.
5. Últimas entradas y filtros por categoría.
6. Pie de página.

Las categorías Vida, Ideas y Tecnología son la propuesta inicial.
Los títulos y fotografías de las maquetas son ilustrativos.

## Artículo aprobado
1. Enlace para volver al archivo.
2. Categoría, título, introducción y autor.
3. Imagen de portada.
4. Cuerpo con párrafos, subtítulos y citas.
5. Navegación para continuar explorando.

Contemplar listas, enlaces y bloques de código en Markdown.
La lectura debe mantenerse cómoda en móvil y escritorio.
Usar fechas reales cuando corresponda.

## Administración aprobada
- Listado con búsqueda y filtros: todas, borradores y publicadas.
- Acciones para crear y editar entradas.
- Estado identificado mediante texto, además del color.
- Paginación.
- En móvil, transformar el listado en tarjetas.

## Editor aprobado
Campos:
- Título.
- Slug.
- Categoría.
- Extracto.
- Portada.
- Texto alternativo.
- Contenido Markdown.

Escritorio: edición y vista previa en paralelo.
Móvil: pestañas Escribir y Vista previa.

Acciones:
- Guardar borrador: guardar sin publicar.
- Publicar: validar los campos requeridos y solicitar confirmación.
- Guardar cambios: actualizar una entrada publicada.
- Retirar publicación: devolver una entrada publicada a borrador.

Avisar antes de abandonar el editor cuando existan cambios sin guardar.
La vista previa debe representar el formato del artículo público.

## Alcance de las maquetas
Las maquetas son referencias visuales, no pantallas funcionales.
Sus textos y fotografías de ejemplo no constituyen contenido final.
Las pantallas no representadas conservarán estas reglas de diseño.

## Verificación durante la implementación
- Contraste, foco visible y navegación por teclado.
- Etiquetas accesibles para campos y botones.
- Lectura sin desbordamientos en móvil.
- Estados de carga, vacío, error y éxito.
- Cambio y persistencia del tema.
- Renderizado seguro de Markdown.
- Separación entre borradores y contenido público.
