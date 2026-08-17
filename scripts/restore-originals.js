const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const GIT = "C:\\Program Files\\Git\\bin\\git.exe";
const CWD = path.join(__dirname, "..");

const logo = execSync(`"${GIT}" -C "${CWD}" show be81bd1:public/logo.png`, { maxBuffer: 10 * 1024 * 1024 });
const fav = execSync(`"${GIT}" -C "${CWD}" show be81bd1:public/favicon.png`, { maxBuffer: 10 * 1024 * 1024 });

console.log("logo:", logo.length, "bytes, PNG:", logo[0] === 0x89 && logo[1] === 0x50);
console.log("favicon:", fav.length, "bytes, PNG:", fav[0] === 0x89 && fav[1] === 0x50);

fs.writeFileSync(path.join(__dirname, "..", "public", "logo-original.png"), logo);
fs.writeFileSync(path.join(__dirname, "..", "public", "favicon-original.png"), fav);
console.log("Originals restored.");
