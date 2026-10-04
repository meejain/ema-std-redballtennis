import { PNG } from 'pngjs'; import fs from 'node:fs';
const [,, file, out, yA, hA, xA, wA] = process.argv; const png = PNG.sync.read(fs.readFileSync(file));
const y = +yA, h = Math.min(+hA, png.height - y), x = +(xA||0), w = Math.min(+(wA||png.width), png.width - x);
const o = new PNG({ width: w, height: h }); for (let r = 0; r < h; r++) png.data.copy(o.data, r*w*4, ((y+r)*png.width + x)*4, ((y+r)*png.width + x + w)*4);
fs.writeFileSync(out, PNG.sync.write(o)); console.log(out, w, h);
