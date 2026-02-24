const fs = require('fs');
const path = require('path');
const { CLIENT_RENEG_LIMIT } = require('tls');

function readTextFile(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);

    const text = buffer.toString('utf-8');

    console.log('--- Información del archivo ---');
    console.log('Ruta:', path.resolve(filePath));
    console.log('Tamaño:', buffer.length, 'bytes');
    console.log('Primeros 100 caracteres:\n', text.slice(0, 100));
    console.log('\n--- Vista de los bytes ---');
    console.log(buffer);

    return { buffer, text };
  } catch (err) {
    console.error('Error al leer el archivo:', err.message);
  }
}

const inputFile = process.argv[2];

if (!inputFile) {
  console.log('Uso: node cli.js <archivo.txt>');
  process.exit(1);
}

readTextFile(inputFile);
