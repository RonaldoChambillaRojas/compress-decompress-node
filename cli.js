const fs = require('fs');
const path = require('path');
const { compressRLE, compressRLEAdvanced, compressHybrid } = require('./compressor');
const { decompressRLE, decompressRLEAdvanced, decompressSmart } = require('./decompressor');

/**
 * Reads a text file and returns its content
 */
function readTextFile(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    const text = buffer.toString('utf-8');
    return { buffer, text };
  } catch (err) {
    console.error('Error al leer el archivo:', err.message);
    process.exit(1);
  }
}

/**
 * Displays file information
 */
function displayFileInfo(filePath, buffer, text) {
  console.log('\n📄 --- Información del archivo ---');
  console.log('Ruta:', path.resolve(filePath));
  console.log('Tamaño original:', buffer.length, 'bytes');
  console.log('Contenido:', text.slice(0, 50) + (text.length > 50 ? '...' : ''));
}

/**
 * Displays compression results
 */
function displayCompressionResults(method, result) {
  console.log(`\n📦 --- Compresión (${result.method}) ---`);
  console.log('Original:', result.original);
  console.log('Comprimido:', result.compressed);
  console.log(`Tamaño original: ${result.originalSize} bytes`);
  console.log(`Tamaño comprimido: ${result.compressedSize} bytes`);
  console.log(`Ratio de compresión: ${result.ratio}%`);
  console.log(`Eficiencia: ${result.efficiency}`);
}

/**
 * Displays decompression results
 */
function displayDecompressionResults(original, decompressed) {
  console.log('\n✅ --- Verificación de descompresión ---');
  console.log('Original:', original);
  console.log('Descomprimido:', decompressed);
  console.log('¿Coinciden?', original === decompressed ? '✓ Sí' : '✗ No');
}

/**
 * Main CLI function
 */
function main() {
  const args = process.argv.slice(2);
  const inputFile = args[0];
  const method = args[1] || 'hybrid';

  if (!inputFile) {
    console.log('\nUso: node cli.js <archivo.txt> [metodo]');
    console.log('\nMétodos disponibles:');
    console.log('  - basic    : RLE básico');
    console.log('  - advanced : RLE con delimitadores');
    console.log('  - hybrid   : Elige automáticamente el mejor método (por defecto)');
    process.exit(1);
  }

  // Read file
  const { buffer, text } = readTextFile(inputFile);
  displayFileInfo(inputFile, buffer, text);

  // Compress based on selected method
  let result;
  switch (method.toLowerCase()) {
    case 'basic':
      result = compressRLE(text);
      break;
    case 'advanced':
      result = compressRLEAdvanced(text);
      break;
    case 'hybrid':
    default:
      result = compressHybrid(text);
  }

  displayCompressionResults(method, result);

  // Decompress to verify
  let decompressed;
  if (result.method === 'RLE-Advanced') {
    decompressed = decompressRLEAdvanced(result.compressed, '|');
  } else {
    decompressed = decompressRLE(result.compressed);
  }

  displayDecompressionResults(result.original, decompressed);

  // Save compressed file
  const outputPath = path.join(
    path.dirname(inputFile),
    path.basename(inputFile, path.extname(inputFile)) + '.compressed'
  );
  
  fs.writeFileSync(outputPath, result.compressed, 'utf8');
  console.log(`\n💾 Archivo comprimido guardado en: ${outputPath}`);
}

main();
