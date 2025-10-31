// cli.js
const fs = require('fs');
const path = require('path');

// Función para leer un archivo de texto en UTF-8
function readTextFile(filePath) {
  try {
    // 1️ Leemos el archivo como Buffer (bytes crudos)
    const buffer = fs.readFileSync(filePath);

    // 2️ Lo convertimos a texto UTF-8 para verlo
    const text = buffer.toString('utf-8');

    // 3️ Mostramos información básica
    console.log('--- Información del archivo ---');
    console.log('Ruta:', path.resolve(filePath));
    console.log('Tamaño:', buffer.length, 'bytes');
    console.log('Primeros 100 caracteres:\n', text.slice(0, 100));

    // 4️ Devolvemos ambos (texto y buffer) por si los necesitamos luego
    return { buffer, text };
  } catch (err) {
    console.error('Error al leer el archivo:', err.message);
  }
}

// --- Ejecución simple ---
// node cli.js input.txt
const inputFile = process.argv[2];

if (!inputFile) {
  console.log('Uso: node cli.js <archivo.txt>');
  process.exit(1);
}

readTextFile(inputFile);
