/**
 * Decompressor module for Run-Length Encoding reversal
 */

/**
 * Decompresses text compressed with basic RLE (without delimiter)
 * @param {string} compressed - Compressed text
 * @returns {string} Decompressed text
 */
function decompressRLE(compressed) {
  if (!compressed || compressed.length === 0) {
    return '';
  }

  let decompressed = '';
  let i = 0;

  while (i < compressed.length) {
    let number = '';

    // Read all consecutive digits
    while (i < compressed.length && /\d/.test(compressed[i])) {
      number += compressed[i];
      i++;
    }

    // If we found digits, they represent the count
    if (number) {
      const count = parseInt(number, 10);
      if (i < compressed.length) {
        const char = compressed[i];
        decompressed += char.repeat(count);
        i++;
      }
    } else if (i < compressed.length) {
      // No prefix number means single character
      decompressed += compressed[i];
      i++;
    }
  }

  return decompressed;
}

/**
 * Decompresses text compressed with advanced RLE (with delimiter)
 * @param {string} compressed - Compressed text
 * @param {string} delimiter - Separator used in compression
 * @returns {string} Decompressed text
 */
function decompressRLEAdvanced(compressed, delimiter = '|') {
  if (!compressed || compressed.length === 0) {
    return '';
  }

  let decompressed = '';
  const pairs = compressed.split(delimiter);

  for (const pair of pairs) {
    if (!pair) continue;

    // Extract number prefix and character
    let number = '';
    let char = '';

    for (let i = 0; i < pair.length; i++) {
      if (/\d/.test(pair[i])) {
        number += pair[i];
      } else {
        char = pair.slice(i);
        break;
      }
    }

    if (char) {
      const count = number ? parseInt(number, 10) : 1;
      decompressed += char.repeat(count);
    }
  }

  return decompressed;
}

/**
 * Smart decompression with automatic method detection
 * @param {string} compressed - Compressed text
 * @returns {string} Decompressed text
 */
function decompressSmart(compressed) {
  if (!compressed || compressed.length === 0) {
    return '';
  }

  // Check if it uses delimiter (advanced method)
  if (compressed.includes('|')) {
    return decompressRLEAdvanced(compressed, '|');
  }

  // Otherwise use basic RLE
  return decompressRLE(compressed);
}

module.exports = {
  decompressRLE,
  decompressRLEAdvanced,
  decompressSmart
};