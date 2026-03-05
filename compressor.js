/**
 * Compressor module using Run-Length Encoding (RLE) with optimizations
 */

/**
 * Compresses text using Run-Length Encoding
 * @param {string} text - Text to compress
 * @returns {Object} Compressed data with metadata
 */
function compressRLE(text) {
  if (!text || text.length === 0) {
    return {
      original: text,
      compressed: '',
      originalSize: 0,
      compressedSize: 0,
      ratio: 0,
      method: 'RLE'
    };
  }

  let compressed = '';
  let count = 1;

  // Process each character and apply RLE
  for (let i = 0; i < text.length; i++) {
    // Check if next character is different or we reached the end
    if (i + 1 >= text.length || text[i] !== text[i + 1]) {
      // Use special encoding: count + character
      // For single occurrences, just use the character
      if (count === 1) {
        compressed += text[i];
      } else {
        // Encode as: count + character
        compressed += count + text[i];
      }
      count = 1;
    } else {
      count++;
    }
  }

  // Calculate compression metrics
  const originalSize = Buffer.byteLength(text, 'utf8');
  const compressedSize = Buffer.byteLength(compressed, 'utf8');
  const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(2);

  return {
    original: text,
    compressed: compressed,
    originalSize: originalSize,
    compressedSize: compressedSize,
    ratio: ratio,
    method: 'RLE',
    efficiency: compressedSize < originalSize ? 'efficient' : 'inefficient'
  };
}

/**
 * Advanced compression with delimiter to improve efficiency
 * @param {string} text - Text to compress
 * @returns {Object} Enhanced compression result
 */
function compressRLEAdvanced(text) {
  if (!text || text.length === 0) {
    return compressRLE('');
  }

  const delimiter = '|'; // Separator between count-char pairs
  let compressed = '';
  let count = 1;

  for (let i = 0; i < text.length; i++) {
    if (i + 1 >= text.length || text[i] !== text[i + 1]) {
      if (count > 1) {
        compressed += count + text[i] + delimiter;
      } else {
        compressed += text[i] + delimiter;
      }
      count = 1;
    } else {
      count++;
    }
  }

  // Remove trailing delimiter
  compressed = compressed.slice(0, -1);

  const originalSize = Buffer.byteLength(text, 'utf8');
  const compressedSize = Buffer.byteLength(compressed, 'utf8');
  const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(2);

  return {
    original: text,
    compressed: compressed,
    originalSize: originalSize,
    compressedSize: compressedSize,
    ratio: ratio,
    method: 'RLE-Advanced',
    efficiency: compressedSize < originalSize ? 'efficient' : 'inefficient'
  };
}

/**
 * Hybrid compression - chooses best method automatically
 * @param {string} text - Text to compress
 * @returns {Object} Best compression result
 */
function compressHybrid(text) {
  const basic = compressRLE(text);
  const advanced = compressRLEAdvanced(text);

  // Return the more efficient compression
  if (basic.compressedSize <= advanced.compressedSize) {
    return { ...basic, method: 'RLE' };
  } else {
    return { ...advanced, method: 'RLE-Advanced' };
  }
}

module.exports = {
  compressRLE,
  compressRLEAdvanced,
  compressHybrid
};