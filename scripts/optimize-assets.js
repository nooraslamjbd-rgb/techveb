const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const PUBLIC = path.join(__dirname, "..", "public");

async function generateICO(png32Buffer, size) {
  // Get raw RGBA pixel data
  const { data, info } = await sharp(png32Buffer)
    .resize(size, size)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;

  // BMP rows are stored bottom-up
  const rowBytes = w * 4;
  const bmpData = Buffer.alloc(h * rowBytes);
  for (let y = 0; y < h; y++) {
    data.copy(bmpData, (h - 1 - y) * rowBytes, y * rowBytes, y * rowBytes + rowBytes);
  }

  // AND mask: 1 bit per pixel, rows padded to 4-byte boundary
  const andRowBits = w;
  const andRowBytes = Math.ceil(andRowBits / 32) * 4;
  const andMask = Buffer.alloc(h * andRowBytes, 0);

  // BITMAPINFOHEADER (40 bytes)
  const header = Buffer.alloc(40);
  header.writeUInt32LE(40, 0);       // biSize
  header.writeInt32LE(w, 4);         // biWidth
  header.writeInt32LE(h * 2, 8);     // biHeight (doubled for ICO: XOR + AND)
  header.writeUInt16LE(1, 12);       // biPlanes
  header.writeUInt16LE(32, 14);      // biBitCount
  header.writeUInt32LE(0, 16);       // biCompression (BI_RGB)
  header.writeUInt32LE(w * h * 4 + andMask.length, 20); // biSizeImage

  return Buffer.concat([header, bmpData, andMask]);
}

async function optimize() {
  const origLogo = path.join(PUBLIC, "logo-original.png");
  const origFav = path.join(PUBLIC, "favicon-original.png");

  if (!fs.existsSync(origLogo) || !fs.existsSync(origFav)) {
    console.warn("Original files not found. Skipping asset optimization.");
    return;
  }

  // === LOGO ===
  // 1. Logo for web (400px wide, optimized)
  const logo400 = path.join(PUBLIC, "logo.png");
  await sharp(origLogo)
    .resize({ width: 400, withoutEnlargement: true })
    .png({ quality: 90, compressionLevel: 9, adaptiveFiltering: true })
    .toFile(logo400);
  console.log("logo.png:", (fs.statSync(logo400).size / 1024).toFixed(0) + "KB");

  // 2. Square logo for navbar/footer (128x128, fitted)
  const logoSquare = path.join(PUBLIC, "logo-square.png");
  await sharp(origLogo)
    .resize(128, 128, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 95, compressionLevel: 9 })
    .toFile(logoSquare);
  console.log("logo-square.png:", (fs.statSync(logoSquare).size / 1024).toFixed(0) + "KB");

  // === FAVICON ===
  // 3. favicon-32x32.png
  const fav32Png = path.join(PUBLIC, "favicon-32x32.png");
  await sharp(origFav)
    .resize(32, 32, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(fav32Png);
  console.log("favicon-32x32.png:", (fs.statSync(fav32Png).size / 1024).toFixed(0) + "KB");

  // 4. favicon-16x16.png
  const fav16Png = path.join(PUBLIC, "favicon-16x16.png");
  await sharp(origFav)
    .resize(16, 16, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(fav16Png);
  console.log("favicon-16x16.png:", (fs.statSync(fav16Png).size / 1024).toFixed(0) + "KB");

  // 5. favicon.ico (proper BMP-based, multi-size: 16, 32, 48)
  const icoPath = path.join(PUBLIC, "favicon.ico");
  const sizes = [16, 32, 48];
  const icoImages = [];

  for (const sz of sizes) {
    const pngBuf = await sharp(origFav)
      .resize(sz, sz, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    const bmpData = await generateICO(pngBuf, sz);
    icoImages.push({ size: sz, data: bmpData });
  }

  const headerSize = 6 + icoImages.length * 16;
  const totalSize = headerSize + icoImages.reduce((s, i) => s + i.data.length, 0);
  const ico = Buffer.alloc(totalSize);

  ico.writeUInt16LE(0, 0);
  ico.writeUInt16LE(1, 2);
  ico.writeUInt16LE(icoImages.length, 4);

  let dataOffset = headerSize;
  for (let i = 0; i < icoImages.length; i++) {
    const img = icoImages[i];
    const off = 6 + i * 16;
    ico.writeUInt8(img.size, off);
    ico.writeUInt8(img.size, off + 1);
    ico.writeUInt8(0, off + 2);
    ico.writeUInt8(0, off + 3);
    ico.writeUInt16LE(1, off + 4);
    ico.writeUInt16LE(32, off + 6);
    ico.writeUInt32LE(img.data.length, off + 8);
    ico.writeUInt32LE(dataOffset, off + 12);
    img.data.copy(ico, dataOffset);
    dataOffset += img.data.length;
  }

  fs.writeFileSync(icoPath, ico);
  console.log("favicon.ico:", (fs.statSync(icoPath).size / 1024).toFixed(0) + "KB");

  // 6. apple-touch-icon.png (180x180 - required for iOS)
  const appleIcon = path.join(PUBLIC, "apple-touch-icon.png");
  await sharp(origFav)
    .resize(180, 180, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 90, compressionLevel: 9 })
    .toFile(appleIcon);
  console.log("apple-touch-icon.png:", (fs.statSync(appleIcon).size / 1024).toFixed(0) + "KB");

  // 7. PWA icons (192x192, 512x512)
  for (const sz of [192, 512]) {
    const iconPath = path.join(PUBLIC, `icon-${sz}.png`);
    await sharp(origFav)
      .resize(sz, sz, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(iconPath);
    console.log(`icon-${sz}.png:`, (fs.statSync(iconPath).size / 1024).toFixed(0) + "KB");
  }

  console.log("\nAll assets generated.");
}

optimize().catch((err) => {
  console.error("Asset optimization failed:", err);
  process.exit(1);
});
