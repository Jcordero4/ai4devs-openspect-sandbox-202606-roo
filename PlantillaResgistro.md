## Micro-tarea:* [Programa para transformar una fecha a formato ISO-8610]

**Pilar 1 — Herramienta:**

- ¿Cuál eliges? Elegí Claude Code.
- ¿Por qué esta y no otra? Escogí esta por facilidad de configuración porque otros elementos se integran naturalmente o son propios de Claude, esto a diferencia de OpenCode que puede funcionar igual que claude, sin embargo se deben realizar configuraciones o instalaciones de terceros para que funciones como en el caso de los hooks y de crear el Git Actions.

**Pilar 2 — Contexto:**

¿Qué información estás aportando? (lenguaje, framework, restricciones, ejemplos…)
- Lenguaje: JavaScript puro.
- Entono de ejecución: Node js >= 18
- Test: node --test
- Reglas:
  - Archivo madre: DateFormarConverter.
  - Nomenclatura: Camelcase.
  - Utilizar Date Nativo
  - Export: Al final del archivo, como un solo objeto.
- Restricciones:
  - No utilizar import/export.
  - No introducir librerias.
¿Hay algo del contexto que has decidido omitir conscientemente?

**Pilar 3 — Prompt:**
¿Cómo lo estructuras? (estilo, formato de salida, ejemplos…)

Crear una funcion que capture una fecha desde consola, debe tener un formato de fecha válido donde el año siempre debe ser de 4 dígitos,
el día de 2 dígitos y el mes puede ser de 2 dígitos o puede ser el nombre del mes. 
La función debe evaluar que la fecha introducida sea válida si no informar al usuario el error e indicarle los formatos válidos en un listado.
Si la fecha es correcta se debe llamar a una funcion que convierta a formato ISO 8601 e imprima el resultado en pantalla con el formato ISO 8601.

**Resultado:** ¿Funcionó a la primera o tuviste que iterar?
┌─────────────────────┬───────┬─────────────────────────────────┐
│             Función                                   │ Tipo            │               Qué hace                                                                 │
├─────────────────────┼───────┼─────────────────────────────────┤
│ captureDateFromConsole                 │ I/O             │ Lee fecha de consola (readline), valida, convierte o muestra error │
├─────────────────────┼───────┼─────────────────────────────────┤
│ validateDate                                       │ pura            │ Valida formato + fecha real de calendario                         │
├─────────────────────┼───────┼─────────────────────────────────┤
│ resolveMonth                                    │ pura            │ Mes 2 dígitos o nombre → 1..12                                         │
├─────────────────────┼───────┼─────────────────────────────────┤
│ convertAndPrintISO                          │ I/O             │ Llama toISODate + imprime                                                │
├─────────────────────┼───────┼─────────────────────────────────┤
│ toISODate                                          │ pura            │ YYYY-MM-DD                                                                      │
├─────────────────────┼───────┼─────────────────────────────────┤
│ getValidFormats / getMonthNames│ puras          │ Datos                                                                                     │
└─────────────────────┴───────┴─────────────────────────────────┘
```
'use strict';
const  readline  =  require('readline');

// Nombres de mes en español, índice 0 = enero.
function  getMonthNames() {
	return [
		'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
		'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
	];
}

// Listado de formatos válidos para mostrar al usuario.
function  getValidFormats() {
	return [
		'DD/MM/YYYY (ej. 09/06/2026)',
		'DD-MM-YYYY (ej. 09-06-2026)',
		'DD/NombreMes/YYYY (ej. 09/junio/2026)',
		'DD NombreMes YYYY (ej. 09 junio 2026)',
	];
}

// Convierte un token de mes (2 dígitos o nombre) a número 1..12, o null si no es válido.
function  resolveMonth(token) {
	if (typeof  token  !==  'string') return  null;

	const  value  =  token.trim().toLowerCase();

	if (/^\d{2}$/.test(value)) {
		const  num  =  Number(value);
		return  num  >=  1  &&  num  <=  12  ?  num  :  null;
	}

	const  index  =  getMonthNames().indexOf(value);
	return  index  ===  -1  ?  null  :  index  +  1;
}

// Valida la fecha introducida. Devuelve { valid, day, month, year, error }.
function  validateDate(input) {

	if (typeof  input  !==  'string'  ||  input.trim() ===  '') {
		return { valid:  false, error:  'No se introdujo ninguna fecha.' };
	}
	
	const  parts  =  input.trim().split(/[\/\-\s]+/);
	if (parts.length  !==  3) {
		return { valid:  false, error:  'La fecha debe tener tres partes: día, mes y año.' };
	}
	
	const [dayToken, monthToken, yearToken] =  parts;
	if (!/^\d{2}$/.test(dayToken)) {
		return { valid:  false, error:  'El día debe tener 2 dígitos.' };
	}
	if (!/^\d{4}$/.test(yearToken)) {
		return { valid:  false, error:  'El año debe tener 4 dígitos.' };
	}
	
	const  month  =  resolveMonth(monthToken);
	if (month  ===  null) {
		return { valid:  false, error:  'El mes debe ser 2 dígitos (01-12) o un nombre de mes válido.' };
	}
	
	const  day  =  Number(dayToken);
	const  year  =  Number(yearToken);
	// Verifica que sea una fecha real del calendario (rechaza 31/02, etc.).
	const  date  =  new  Date(year, month  -  1, day);
	if (date.getFullYear() !==  year  ||
		date.getMonth() !==  month  -  1  ||
		date.getDate() !==  day) {
		return { valid:  false, error:  'La fecha no existe en el calendario.' };
	}
	return { valid:  true, day, month, year };
}

// Convierte componentes de fecha a string ISO 8601 (YYYY-MM-DD). Función pura.
function  toISODate(day, month, year) {
	const  pad  = (n) =>  String(n).padStart(2, '0');
	return  `${year}-${pad(month)}-${pad(day)}`;
}

// Convierte a ISO 8601 e imprime el resultado en pantalla.
function  convertAndPrintISO(day, month, year) {
	const  iso  =  toISODate(day, month, year);
	console.log(`Fecha en formato ISO 8601: ${iso}`);
	return  iso;
}

// Imprime el error y el listado de formatos válidos.
function  printError(error) {
	console.log(`Error: ${error}`);
	console.log('Formatos válidos:');
	getValidFormats().forEach((format) =>  console.log(` - ${format}`));
}

// Captura una fecha desde consola, la valida y la convierte si es correcta.
function  captureDateFromConsole() {
	
	const  rl  =  readline.createInterface({ input:  process.stdin, output:  process.stdout });

	rl.question('Introduce una fecha: ', (answer) => {
		const  result  =  validateDate(answer);
		if (result.valid) {
			convertAndPrintISO(result.day, result.month, result.year);
		} else {
			printError(result.error);
		}
		rl.close();
	});
}

if (require.main  ===  module) {
	captureDateFromConsole();
}

module.exports  = {
	getMonthNames,
	getValidFormats,
	resolveMonth,
	validateDate,
	toISODate,
	convertAndPrintISO,
	printError,
	captureDateFromConsole,
};
```
**Una mejora que harías si volvieras a hacerlo.**
- Le indicaría que en el module.exports solo ponga la función principal que es la que inicia el desencadenamiento del resto.
- Cuando lance un error al usuario no cerrar el programa, si no que vuelva a lanzar el mensaje de solicitud de fecha.