import sharp from 'sharp';
import {mkdir,writeFile} from 'node:fs/promises';
await mkdir('public/icons',{recursive:true});
// Original vector identity, kept inside the maskable icon safe zone.
const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="110" fill="#3730a3"/><circle cx="380" cy="110" r="160" fill="#ffffff" opacity=".04"/><path d="M143 364V183l113-60 113 60v181H143Z" fill="#f5f3ff"/><path d="M256 123v241h113V183Z" fill="#ddd6fe"/><rect x="230" y="294" width="52" height="70" rx="8" fill="#3730a3"/><g fill="#8171ce"><rect x="179" y="200" width="34" height="32" rx="5"/><rect x="238" y="200" width="34" height="32" rx="5"/><rect x="299" y="200" width="34" height="32" rx="5"/><rect x="179" y="252" width="34" height="32" rx="5"/><rect x="299" y="252" width="34" height="32" rx="5"/></g><path d="M130 367h252" stroke="#b6a7f0" stroke-width="13" stroke-linecap="round"/></svg>`;
await writeFile('public/icons/logo.svg',svg);
for(const size of [48,72,96,128,144,152,180,192,256,384,512])await sharp(Buffer.from(svg)).resize(size,size).png().toFile(`public/icons/icon-${size}.png`);
await sharp(Buffer.from(svg)).resize(180,180).png().toFile('public/icons/apple-touch-icon.png');
await sharp(Buffer.from(svg.replace('rx="110"','rx="0"'))).resize(512,512).png().toFile('public/icons/maskable-512.png');
