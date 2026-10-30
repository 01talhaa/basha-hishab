import sharp from 'sharp';
import {mkdir,writeFile} from 'node:fs/promises';
await mkdir('public/splash',{recursive:true});
const devices=[[320,568,2],[375,667,2],[414,736,3],[375,812,3],[390,844,3],[393,852,3],[402,874,3],[414,896,2],[414,896,3],[428,926,3],[430,932,3],[440,956,3],[768,1024,2],[820,1180,2],[834,1194,2],[1024,1366,2]];
const entries=[];
for(const [w,h,r] of devices)for(const orientation of ['portrait','landscape']){const width=(orientation==='portrait'?w:h)*r,height=(orientation==='portrait'?h:w)*r;const logo=await sharp('public/icons/icon-512.png').resize(120*r,120*r).toBuffer();const title=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${80*r}"><text x="50%" y="${40*r}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${25*r}" font-weight="bold" fill="#3730a3">BashaHisab</text></svg>`);const url=`/splash/${w}-${h}-${r}-${orientation}.png`;await sharp({create:{width,height,channels:4,background:'#f5f6fc'}}).composite([{input:logo,left:Math.round((width-120*r)/2),top:Math.round(height*.4-60*r)},{input:title,left:0,top:Math.round(height*.4+85*r)}]).png().toFile('public'+url);entries.push({url,media:`(device-width: ${w}px) and (device-height: ${h}px) and (-webkit-device-pixel-ratio: ${r}) and (orientation: ${orientation})`})}
await writeFile('src/lib/splash.json',JSON.stringify(entries,null,2));
