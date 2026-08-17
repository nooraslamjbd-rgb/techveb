const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const PUBLIC = path.join(__dirname, "..", "public");

async function optimize() {
  // --- Logo: resize to 400px wide, optimize ---
  const logoSrc = path.join(PUBLIC, "logo.png");
  if (fs.existsSync(logoSrc)) {
    await sharp(logoSrc)
      .resize({ width: 400, withoutEnlargement: true })
      .png({ quality: 90, compressionLevel: 9, adaptiveFiltering: true })
      .toFile(path.join(PUBLIC, "logo-optimized.png"));

    // Replace original
    fs.unlinkSync(logoSrc);
    fs.renameSync(path.join(PUBLIC, "logo-optimized.png"), logoSrc);
    const stat = fs.statSync(logoSrc);
    console.log(`logo.png optimized: ${(stat.size / 1024).toFixed(0)}KB`);
  }

  // --- Favicon: resize to 64x64, optimize ---
  const favSrc = path.join(PUBLIC, "favicon.png");
  if (fs.existsSync(favSrc)) {
    const favicon64 = path.join(PUBLIC, "favicon-64.png");
    await sharp(favSrc)
      .resize(64, 64, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ quality: 95, compressionLevel: 9 })
      .toFile(favicon64);

    // Replace original
    fs.unlinkSync(favSrc);
    fs.renameSync(favicon64, favSrc);
    const stat = fs.statSync(favSrc);
    console.log(`favicon.png optimized: ${(stat.size / 1024).toFixed(0)}KB`);
  }

  // --- Generate favicon.ico from 64x64 favicon ---
  const favIco = path.join(PUBLIC, "favicon.ico");
  const fav64Png = path.join(PUBLIC, "favicon.png");

  if (fs.existsSync(fav64Png)) {
    // Create 32x32 and 16x16 versions for ICO
    const buf32 = await sharp(fav64Png).resize(32, 32).png().toBuffer();
    const buf16 = await sharp(fav64Png).resize(16, 16).png().toBuffer();
    const buf48 = await sharp(fav64Png).resize(48, 48).png().toBuffer();

    // Build ICO manually (PNG-based ICO format)
    const images = [
      { size: 16, data: buf16 },
      { size: 32, data: buf32 },
      { size: 48, data: buf48 },
    ];

    const numImages = images.length;
    // ICO header: 6 bytes
    // Each entry: 16 bytes
    // Image data follows
    const headerSize = 6 + numImages * 16;
    const totalSize = headerSize + images.reduce((s, i) => s + i.data.length, 0);
    const ico = Buffer.alloc(totalSize);

    // ICO header
    ico.writeUInt16LE(0, 0);       // reserved
    ico.writeUInt16LE(1, 2);       // type: ICO
    ico.writeUInt16LE(numImages, 4); // count

    let dataOffset = headerSize;
    for (let i = 0; i < numImages; i++) {
      const img = images[i];
      const entryOffset = 6 + i * 16;
      ico.writeUInt8(img.size, entryOffset);     // width
      ico.writeUInt8(img.size, entryOffset + 1); // height
      ico.writeUInt8(0, entryOffset + 2);        // color palette
      ico.writeUInt8(0, entryOffset + 3);        // reserved
      ico.writeUInt16LE(1, entryOffset + 4);     // color planes
      ico.writeUInt16LE(32, entryOffset + 6);    // bits per pixel
      ico.writeUInt32LE(img.data.length, entryOffset + 8);  // data size
      ico.writeUInt32LE(dataOffset, entryOffset + 12);      // data offset
      img.data.copy(ico, dataOffset);
      dataOffset += img.data.length;
    }

    fs.writeFileSync(favIco, ico);
    const stat = fs.statSync(favIco);
    console.log(`favicon.ico generated: ${(stat.size / 1024).toFixed(0)}KB`);
  }

  console.log("Asset optimization complete.");
}

optimize().catch((err) => {
  console.error("Asset optimization failed:", err);
  process.exit(1);
});
