import { PNG } from 'pngjs'; import fs from 'node:fs';
const [,, file, yArg] = process.argv; const y = +yArg;
const png = PNG.sync.read(fs.readFileSync(file));
let prev = null, runs = [];
for (let x = 0; x < png.width; x++) { const i = (y*png.width + x)*4; const c = [png.data[i],png.data[i+1],png.data[i+2]];
  const cls = c[0]>200&&c[1]>200&&c[2]>200 ? 'white' : (c[0]>150&&c[1]<80&&c[2]<90 ? 'red' : (c[2]>100&&c[0]<60 ? 'blue' : 'other'));
  if (cls !== prev) { runs.push([x, cls, c.join(',')]); prev = cls; } }
console.log(png.width, png.height, JSON.stringify(runs.slice(0,40)));
