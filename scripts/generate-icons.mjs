/**
 * Generate PWA icons and favicon as simple green circles with "FN" text.
 * Uses raw PNG encoding (no external dependencies).
 * Run: node scripts/generate-icons.mjs
 */
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "..", "public");

// Create a minimal uncompressed PNG with RGBA pixel data
function createPNG(width, height, pixels) {
  // PNG signature
  const signature = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = new Uint8Array(25);
  const ihdrView = new DataView(ihdr.buffer);
  ihdrView.setUint32(0, 13); // length
  ihdr.set([73, 72, 68, 82], 4); // "IHDR"
  ihdrView.setUint32(8, width);
  ihdrView.setUint32(12, height);
  ihdr[16] = 8; // bit depth
  ihdr[17] = 6; // color type: RGBA
  ihdr[18] = 0; // compression
  ihdr[19] = 0; // filter
  ihdr[20] = 0; // interlace
  const ihdrCrc = crc32(ihdr.subarray(4, 21));
  ihdrView.setUint32(21, ihdrCrc);

  // IDAT chunk - raw deflate with no compression (stored blocks)
  // Each row: filter byte (0) + RGBA data
  const rowSize = 1 + width * 4;
  const rawSize = height * rowSize;

  // Build raw data with filter bytes
  const raw = new Uint8Array(rawSize);
  for (let y = 0; y < height; y++) {
    raw[y * rowSize] = 0; // no filter
    for (let x = 0; x < width; x++) {
      const pi = (y * width + x) * 4;
      const ri = y * rowSize + 1 + x * 4;
      raw[ri] = pixels[pi];
      raw[ri + 1] = pixels[pi + 1];
      raw[ri + 2] = pixels[pi + 2];
      raw[ri + 3] = pixels[pi + 3];
    }
  }

  // Wrap in zlib: 2-byte header + stored deflate blocks + 4-byte Adler-32
  const deflated = deflateStored(raw);
  const adler = adler32(raw);
  const zlibData = new Uint8Array(2 + deflated.length + 4);
  zlibData[0] = 0x78; // CMF
  zlibData[1] = 0x01; // FLG
  zlibData.set(deflated, 2);
  const adlerView = new DataView(zlibData.buffer, zlibData.byteOffset);
  adlerView.setUint32(2 + deflated.length, adler);

  const idatPayload = new Uint8Array(4 + zlibData.length);
  idatPayload.set([73, 68, 65, 84], 0); // "IDAT"
  idatPayload.set(zlibData, 4);

  const idat = new Uint8Array(12 + zlibData.length);
  const idatView = new DataView(idat.buffer);
  idatView.setUint32(0, zlibData.length);
  idat.set(idatPayload, 4);
  const idatCrc = crc32(idatPayload);
  idatView.setUint32(4 + idatPayload.length, idatCrc);

  // IEND chunk
  const iend = new Uint8Array(12);
  const iendView = new DataView(iend.buffer);
  iendView.setUint32(0, 0); // length
  iend.set([73, 69, 78, 68], 4); // "IEND"
  const iendCrc = crc32(iend.subarray(4, 8));
  iendView.setUint32(8, iendCrc);

  // Combine
  const png = new Uint8Array(
    signature.length + ihdr.length + idat.length + iend.length
  );
  let offset = 0;
  png.set(signature, offset);
  offset += signature.length;
  png.set(ihdr, offset);
  offset += ihdr.length;
  png.set(idat, offset);
  offset += idat.length;
  png.set(iend, offset);

  return png;
}

// Deflate stored blocks (no compression, max 65535 bytes per block)
function deflateStored(data) {
  const MAX_BLOCK = 65535;
  const numBlocks = Math.ceil(data.length / MAX_BLOCK) || 1;
  const result = new Uint8Array(data.length + numBlocks * 5);
  let rOffset = 0;

  for (let i = 0; i < numBlocks; i++) {
    const start = i * MAX_BLOCK;
    const end = Math.min(start + MAX_BLOCK, data.length);
    const len = end - start;
    const isLast = i === numBlocks - 1;

    result[rOffset] = isLast ? 0x01 : 0x00; // BFINAL + BTYPE=00
    result[rOffset + 1] = len & 0xff;
    result[rOffset + 2] = (len >> 8) & 0xff;
    result[rOffset + 3] = ~len & 0xff;
    result[rOffset + 4] = (~len >> 8) & 0xff;
    result.set(data.subarray(start, end), rOffset + 5);
    rOffset += 5 + len;
  }

  return result.subarray(0, rOffset);
}

function adler32(data) {
  let a = 1,
    b = 0;
  for (let i = 0; i < data.length; i++) {
    a = (a + data[i]) % 65521;
    b = (b + a) % 65521;
  }
  return ((b << 16) | a) >>> 0;
}

// CRC-32 lookup table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(data) {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc = crcTable[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Draw a filled circle
function drawCircle(pixels, width, cx, cy, r, rgba) {
  const r2 = r * r;
  for (let y = Math.max(0, Math.floor(cy - r)); y <= Math.min(width - 1, Math.ceil(cy + r)); y++) {
    for (let x = Math.max(0, Math.floor(cx - r)); x <= Math.min(width - 1, Math.ceil(cx + r)); x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= r2) {
        const i = (y * width + x) * 4;
        pixels[i] = rgba[0];
        pixels[i + 1] = rgba[1];
        pixels[i + 2] = rgba[2];
        pixels[i + 3] = rgba[3];
      }
    }
  }
}

// Simple bitmap font for "FN" - each char is a 5x7 grid
const FONT = {
  F: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
  ],
  N: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
};

function drawChar(pixels, width, char, startX, startY, scale, rgba) {
  const glyph = FONT[char];
  if (!glyph) return;
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 5; col++) {
      if (glyph[row][col]) {
        for (let sy = 0; sy < scale; sy++) {
          for (let sx = 0; sx < scale; sx++) {
            const x = startX + col * scale + sx;
            const y = startY + row * scale + sy;
            if (x >= 0 && x < width && y >= 0 && y < width) {
              const i = (y * width + x) * 4;
              pixels[i] = rgba[0];
              pixels[i + 1] = rgba[1];
              pixels[i + 2] = rgba[2];
              pixels[i + 3] = rgba[3];
            }
          }
        }
      }
    }
  }
}

function generateIcon(size) {
  const pixels = new Uint8Array(size * size * 4);

  // Transparent background (already zeroed)

  // Purple circle (#7C3AED = 124, 58, 237) - Beneath the Surface AU brand
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.45;
  drawCircle(pixels, size, cx, cy, r, [124, 58, 237, 255]);

  // White "FN" text
  const charScale = Math.round(size / 28);
  const charW = 5 * charScale;
  const charH = 7 * charScale;
  const gap = Math.round(charScale * 1.2);
  const totalW = charW * 2 + gap;
  const startX = Math.round(cx - totalW / 2);
  const startY = Math.round(cy - charH / 2);

  drawChar(pixels, size, "F", startX, startY, charScale, [255, 255, 255, 255]);
  drawChar(pixels, size, "N", startX + charW + gap, startY, charScale, [
    255, 255, 255, 255,
  ]);

  return createPNG(size, size, pixels);
}

// Generate icons
mkdirSync(join(PUBLIC, "icons"), { recursive: true });

const icon192 = generateIcon(192);
writeFileSync(join(PUBLIC, "icons", "icon-192.png"), icon192);
console.log(`Created icon-192.png (${icon192.length} bytes)`);

const icon512 = generateIcon(512);
writeFileSync(join(PUBLIC, "icons", "icon-512.png"), icon512);
console.log(`Created icon-512.png (${icon512.length} bytes)`);

// Generate apple-touch-icon (180x180)
const icon180 = generateIcon(180);
writeFileSync(join(PUBLIC, "apple-touch-icon.png"), icon180);
console.log(`Created apple-touch-icon.png (${icon180.length} bytes)`);

// Generate favicon (32x32)
const icon32 = generateIcon(32);
writeFileSync(join(PUBLIC, "favicon.png"), icon32);
console.log(`Created favicon.png (${icon32.length} bytes)`);

console.log("Done!");
