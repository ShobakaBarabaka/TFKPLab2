export const E = Math.E;

export interface Complex {
  re: number;
  im: number;
}

export const complexAdd = (a: Complex, b: Complex): Complex => ({
  re: a.re + b.re,
  im: a.im + b.im,
});

export const complexSub = (a: Complex, b: Complex): Complex => ({
  re: a.re - b.re,
  im: a.im - b.im,
});

export const complexMul = (a: Complex, b: Complex): Complex => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re,
});

export const complexDiv = (a: Complex, b: Complex): Complex => {
  const denom = b.re * b.re + b.im * b.im;
  if (denom === 0) return { re: Infinity, im: Infinity };
  return {
    re: (a.re * b.re + a.im * b.im) / denom,
    im: (a.im * b.re - a.re * b.im) / denom,
  };
};

export const complexSqrt = (z: Complex): Complex => {
  const r = Math.sqrt(z.re * z.re + z.im * z.im);
  const theta = Math.atan2(z.im, z.re);
  const rootR = Math.sqrt(r);
  return {
    re: rootR * Math.cos(theta / 2),
    im: rootR * Math.sin(theta / 2),
  };
};

export const complexMag = (z: Complex): number => Math.sqrt(z.re * z.re + z.im * z.im);


export const transformStep1 = (z: Complex): Complex => complexSqrt(z);

export const transformStep2 = (w: Complex): Complex => {
  const num = complexSub(w, { re: 1, im: 0 });
  const den = complexAdd(w, { re: 1, im: 0 });
  return complexDiv(num, den);
};

export const transformStep3 = (w: Complex): Complex => {
  if (complexMag(w) < 1e-6) return { re: NaN, im: NaN };
  return complexDiv({ re: 1, im: 0 }, w);
};

export const transformStep4 = (w: Complex): Complex => {
  return { re: w.re * E, im: w.im * E };
};

export const transform = (z: Complex): Complex => {
   const s1 = transformStep1(z);
   const s2 = transformStep2(s1);
   const s3 = transformStep3(s2);
   return transformStep4(s3);
};

export const generateGrid = () => {
  const lines: Complex[][] = [];
  const xMin = -5, xMax = 5, yMin = -5, yMax = 5;
  const step = 0.2;
  const pointsPerLine = 100;

  for (let x = xMin; x <= xMax; x += step) {
    if (x < -0.001) {

        const lineBot: Complex[] = [];
        for (let i = 0; i <= pointsPerLine / 2; i++) {
             const t = i / (pointsPerLine / 2);
             const y = yMin + t * (-0.02 - yMin); 
             lineBot.push({ re: x, im: y });
        }
        lines.push(lineBot);

        const lineTop: Complex[] = [];
        for (let i = 0; i <= pointsPerLine / 2; i++) {
             const t = i / (pointsPerLine / 2);
             const y = 0.02 + t * (yMax - 0.02); 
             lineTop.push({ re: x, im: y });
        }
        lines.push(lineTop);
    } else {
        const line: Complex[] = [];
        for (let i = 0; i <= pointsPerLine; i++) {
             const t = i / pointsPerLine;
             const y = yMin + t * (yMax - yMin); 
             line.push({ re: x, im: y });
        }
        lines.push(line);
    }
  }


  for (let y = yMin; y <= yMax; y += step) {
     const line: Complex[] = [];
     for (let i = 0; i <= pointsPerLine; i++) {
         const t = i / pointsPerLine;
         const x = xMin + t * (xMax - xMin); 
         line.push({ re: x, im: y });
     }
     lines.push(line);
  }

  return lines;
};

export const generateCircle = (radius: number) => {
    const line: Complex[] = [];
    for (let i = 0; i <= 100; i++) {
        const theta = (i / 100) * 2 * Math.PI;
        line.push({
            re: radius * Math.cos(theta),
            im: radius * Math.sin(theta)
        });
    }
    return [line];
}

export const generateUnitCircle = () => generateCircle(1);