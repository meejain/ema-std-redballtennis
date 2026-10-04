// regiondiff: differing-pixel count for a region on two stitched PNGs, and the best vertical/horizontal sub-shift
import { PNG } from 'pngjs'; import fs from 'node:fs';
const [,, A, B, xA, yA, wA, hA] = process.argv; const a = PNG.sync.read(fs.readFileSync(A)), b = PNG.sync.read(fs.readFileSync(B));
const x0=+xA, y0=+yA, w=+wA, h=+hA;
const lum = (img,x,y) => { const i=(y*img.width+x)*4; return (img.data[i]+img.data[i+1]+img.data[i+2])/3; };
function diff(dx,dy){ let n=0; for(let y=y0;y<y0+h;y++) for(let x=x0;x<x0+w;x++){ const la=lum(a,x,y), lb=lum(b,x+dx,y+dy); if(Math.abs(la-lb)>25) n++; } return n; }
const base=diff(0,0); let best={dx:0,dy:0,n:base};
for(const dy of [-2,-1,0,1,2]) for(const dx of [-2,-1,0,1,2]) { const n=diff(dx,dy); if(n<best.n) best={dx,dy,n}; }
console.log(`region x${x0} y${y0} ${w}x${h}: diff ${base} (${(100*base/(w*h)).toFixed(2)}%) best shift dx=${best.dx} dy=${best.dy} → ${best.n} (${(100*best.n/(w*h)).toFixed(2)}%)`);
