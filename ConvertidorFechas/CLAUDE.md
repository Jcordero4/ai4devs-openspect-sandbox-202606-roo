# AGENTS.md — Convertidor de fechas ISO 8601

## Stack
- Node.js ≥18, JavaScript puro (no TypeScript).
- Sin dependencias externas. Sin frameworks. Sin DB.
- Tests con `node --test` (built-in desde Node 20).
- Ejecutar tests: `node --test`. Archivos de test: `*.test.js` junto al fuente.

## Convenciones del archivo
- `DateFormatConverter.js` contiene la fuente: funciones puras JavaScript.
- Naming de funciones: `verbNoun` en camelCase (`getDateToConvert`, `setDateFormat`).
- Exportar siempre vía `module.exports` al final del archivo, agrupando todo en un objeto.
- Las fechas en los items son strings ISO 8601.

## Reglas de respuesta
- Cuando añadas una función, mantén el estilo de las existentes (puras, sin clases, sin async si no es necesario).
- No introduzcas dependencias nuevas. Si necesitas comparar fechas, usa `Date` nativo.
- Mantén el archivo en un solo módulo. No crees archivos auxiliares salvo tests.

## Lo que NO hay que hacer
- No usar TypeScript ni `import`/`export` ES modules — el proyecto es CommonJS.
- No introducir librerías (lodash, dayjs, date-fns…).