'use strict';

const { test } = require('node:test');
const assert = require('node:assert');

const {
  getMonthNames,
  getValidFormats,
  resolveMonth,
  validateDate,
  toISODate,
  convertAndPrintISO,
} = require('./DateFormatConverter');

test('getMonthNames devuelve 12 meses en orden', () => {
  const names = getMonthNames();
  assert.strictEqual(names.length, 12);
  assert.strictEqual(names[0], 'enero');
  assert.strictEqual(names[11], 'diciembre');
});

test('getValidFormats devuelve un listado no vacío', () => {
  const formats = getValidFormats();
  assert.ok(Array.isArray(formats));
  assert.ok(formats.length > 0);
});

test('resolveMonth acepta 2 dígitos', () => {
  assert.strictEqual(resolveMonth('01'), 1);
  assert.strictEqual(resolveMonth('12'), 12);
});

test('resolveMonth acepta nombre de mes (case-insensitive)', () => {
  assert.strictEqual(resolveMonth('junio'), 6);
  assert.strictEqual(resolveMonth('JUNIO'), 6);
  assert.strictEqual(resolveMonth('  Diciembre '), 12);
});

test('resolveMonth rechaza valores inválidos', () => {
  assert.strictEqual(resolveMonth('00'), null);
  assert.strictEqual(resolveMonth('13'), null);
  assert.strictEqual(resolveMonth('6'), null);
  assert.strictEqual(resolveMonth('xyz'), null);
  assert.strictEqual(resolveMonth(null), null);
});

test('validateDate acepta DD/MM/YYYY', () => {
  assert.deepStrictEqual(validateDate('09/06/2026'), {
    valid: true, day: 9, month: 6, year: 2026,
  });
});

test('validateDate acepta DD-MM-YYYY', () => {
  assert.deepStrictEqual(validateDate('09-06-2026'), {
    valid: true, day: 9, month: 6, year: 2026,
  });
});

test('validateDate acepta nombre de mes con / y con espacio', () => {
  const esperado = { valid: true, day: 9, month: 6, year: 2026 };
  assert.deepStrictEqual(validateDate('09/junio/2026'), esperado);
  assert.deepStrictEqual(validateDate('09 junio 2026'), esperado);
});

test('validateDate acepta 29 de febrero en año bisiesto', () => {
  assert.deepStrictEqual(validateDate('29/02/2024'), {
    valid: true, day: 29, month: 2, year: 2024,
  });
});

test('validateDate rechaza día de 1 dígito', () => {
  const r = validateDate('9/06/2026');
  assert.strictEqual(r.valid, false);
  assert.match(r.error, /día.*2 dígitos/);
});

test('validateDate rechaza año que no sea de 4 dígitos', () => {
  const r = validateDate('09/06/26');
  assert.strictEqual(r.valid, false);
  assert.match(r.error, /año.*4 dígitos/);
});

test('validateDate rechaza mes fuera de rango', () => {
  const r = validateDate('09/13/2026');
  assert.strictEqual(r.valid, false);
  assert.match(r.error, /mes/);
});

test('validateDate rechaza fecha imposible (31/02)', () => {
  const r = validateDate('31/02/2026');
  assert.strictEqual(r.valid, false);
  assert.match(r.error, /no existe/);
});

test('validateDate rechaza 29/02 en año no bisiesto', () => {
  const r = validateDate('29/02/2025');
  assert.strictEqual(r.valid, false);
});

test('validateDate rechaza número incorrecto de partes', () => {
  assert.strictEqual(validateDate('09/06').valid, false);
  assert.strictEqual(validateDate('09/06/2026/extra').valid, false);
});

test('validateDate rechaza entrada vacía o no string', () => {
  assert.strictEqual(validateDate('').valid, false);
  assert.strictEqual(validateDate('   ').valid, false);
  assert.strictEqual(validateDate(null).valid, false);
});

test('toISODate formatea con cero a la izquierda', () => {
  assert.strictEqual(toISODate(9, 6, 2026), '2026-06-09');
  assert.strictEqual(toISODate(31, 12, 2026), '2026-12-31');
});

test('convertAndPrintISO devuelve el ISO e imprime', () => {
  const original = console.log;
  let salida = '';
  console.log = (msg) => { salida += msg; };
  try {
    const iso = convertAndPrintISO(9, 6, 2026);
    assert.strictEqual(iso, '2026-06-09');
    assert.match(salida, /2026-06-09/);
  } finally {
    console.log = original;
  }
});
