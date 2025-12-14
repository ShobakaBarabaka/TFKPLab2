import React, { useState, useMemo, useEffect } from 'react';
import ComplexPlot from './components/ComplexPlot';
import { 
  generateGrid, 
  transformStep1,
  transformStep2,
  transformStep3,
  transformStep4,
  Complex, 
  generateCircle, 
  generateUnitCircle,
  E 
} from './utils/mathUtils';

// A small component to render the math formula neatly
const MathFormula = () => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center mb-8">
    <div className="font-serif text-xl md:text-2xl text-gray-800">
      F(z) = <span className="italic">e</span> &middot; 
      <div className="inline-block align-middle text-center mx-1">
        <div className="border-b border-gray-800 mb-0.5 pb-0.5">
          &radic;<span className="italic">z</span> + 1
        </div>
        <div>
          &radic;<span className="italic">z</span> - 1
        </div>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [containerWidth, setContainerWidth] = useState<number>(350);

  const { grids, refCircles } = useMemo(() => {
    const g0 = generateGrid(); 
    const g1 = g0.map(line => line.map(transformStep1)); 
    const g2 = g1.map(line => line.map(transformStep2)); 
    const g3 = g2.map(line => line.map(transformStep3));
    const g4 = g3.map(line => line.map(transformStep4)); 

    return {
        grids: [g0, g1, g2, g3, g4],
        refCircles: {
            unit: generateUnitCircle(),
            e: generateCircle(E)
        }
    };
  }, []);


  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const isMd = w >= 768;
      const isXl = w >= 1280;
      
      const padding = isMd ? 64 : 32; // p-8 (32px*2) vs p-4 (16px*2)
      const maxW = 1280; // max-w-7xl
      const effectiveWidth = Math.min(w, maxW) - padding;
      
      let cols = 1;
      let gap = 32; // gap-8
      
      if (isXl) {
        cols = 3;
        gap = 48; // gap-12
      } else if (isMd) {
        cols = 2;
        gap = 48; // gap-12
      }
      
      const totalGapWidth = (cols - 1) * gap;
      const availablePerCol = (effectiveWidth - totalGapWidth) / cols;
      
      // Cap at 400, but ensure it fits in the column to prevent sticking
      setContainerWidth(Math.min(Math.floor(availablePerCol), 400));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const stages = [
      {
          title: "1. Первоначальное множество",
          math: "z",
          domain: [-5, 5],
          color: "#10b981", 
          ref: null,
          showCut: true
      },
      {
          title: "2. Плоскость с разрезом → правая полуплоскость",
          math: "w₁ = √z",
          domain: [-4, 4],
          color: "#10b981",
          ref: null
      },
      {
          title: "3. Правая полуплоскость → внутренняя область единичной окружности",
          math: "w₂ = (w₁ - 1) / (w₁ + 1)",
          domain: [-2, 2],
          color: "#10b981",
          ref: refCircles.unit
      },
      {
          title: "4. Внутренность окружности → внешность окружности",
          math: "w₃ = 1 / w₂",
          domain: [-5, 5],
          color: "#10b981", 
          ref: refCircles.unit
      },
      {
          title: "5. Окружность радиуса 1 → окружность радиуса e",
          math: "w₄ = e · w₃",
          domain: [-15, 15],
          color: "#10b981", 
          ref: refCircles.e
      }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">

        <MathFormula />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12 justify-items-center">
            {stages.map((stage, i) => (
                <div key={i} className="flex flex-col items-center w-full">
                    <div className="mb-2 text-center h-28 flex flex-col justify-end items-center w-full px-2 gap-2">
                        <h3 className="font-bold text-slate-700 leading-snug">{stage.title}</h3>
                        <p className="font-mono text-sm text-slate-500 bg-slate-100 px-2 py-0.5 rounded inline-block">
                            {stage.math}
                        </p>
                    </div>
                    
                    <ComplexPlot 
                        title=""
                        data={grids[i]}
                        width={containerWidth}
                        height={containerWidth}
                        domain={stage.domain as [number, number]}
                        color={stage.color}
                        referenceShapes={stage.ref}
                        showBranchCut={stage.showCut}
                    />
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default App;