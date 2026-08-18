const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const PUBLIC = path.join(__dirname, "..", "public");

async function createBlueFavicon() {
  const svg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#0060E0;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#004BB0;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="512" height="512" rx="96" ry="96" fill="url(#bg)"/>
    <text x="256" y="340" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="280" fill="white" text-anchor="middle" letter-spacing="-10">TV</text>
  </svg>`;

  const outputPath = path.join(PUBLIC, "favicon-original.png");
  await sharp(Buffer.from(svg)).png({ quality: 100 }).toFile(outputPath);
  console.log("Created blue favicon-original.png (512x512, #0060E0)");
}

async function generateICO(png32Buffer, size) {
  const { data, info } = await sharp(png32Buffer)
    .resize(size, size)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  const rowBytes = w * 4;
  const bmpData = Buffer.alloc(h * rowBytes);
  for (let y = 0; y < h; y++) {
    data.copy(bmpData, (h - 1 - y) * rowBytes, y * rowBytes, y * rowBytes + rowBytes);
  }

  const andRowBits = w;
  const andRowBytes = Math.ceil(andRowBits / 32) * 4;
  const andMask = Buffer.alloc(h * andRowBytes, 0);

  const header = Buffer.alloc(40);
  header.writeUInt32LE(40, 0);
  header.writeInt32LE(w, 4);
  header.writeInt32LE(h * 2, 8);
  header.writeUInt16LE(1, 12);
  header.writeUInt16LE(32, 14);
  header.writeUInt32LE(0, 16);
  header.writeUInt32LE(w * h * 4 + andMask.length, 20);

  return Buffer.concat([header, bmpData, andMask]);
}

async function optimize() {
  const origFav = path.join(PUBLIC, "favicon-original.png");

  const fav32Png = path.join(PUBLIC, "favicon-32x32.png");
  await sharp(origFav)
    .resize(32, 32, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(fav32Png);
  console.log("favicon-32x32.png:", (fs.statSync(fav32Png).size / 1024).toFixed(0) + "KB");

  const fav16Png = path.join(PUBLIC, "favicon-16x16.png");
  await sharp(origFav)
    .resize(16, 16, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(fav16Png);
  console.log("favicon-16x16.png:", (fs.statSync(fav16Png).size / 1024).toFixed(0) + "KB");

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

  const appleIcon = path.join(PUBLIC, "apple-touch-icon.png");
  await sharp(origFav)
    .resize(180, 180, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 90, compressionLevel: 9 })
    .toFile(appleIcon);
  console.log("apple-touch-icon.png:", (fs.statSync(appleIcon).size / 1024).toFixed(0) + "KB");

  for (const sz of [192, 512]) {
    const iconPath = path.join(PUBLIC, "icon-" + sz + ".png");
    await sharp(origFav)
      .resize(sz, sz, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(iconPath);
    console.log("icon-" + sz + ".png:", (fs.statSync(iconPath).size / 1024).toFixed(0) + "KB");
  }

  console.log("\nAll favicon assets regenerated (blue #0060E0)!");
}

createBlueFavicon()
  .then(() => optimize())
  .catch((err) => { console.error(err); process.exit(1); });
