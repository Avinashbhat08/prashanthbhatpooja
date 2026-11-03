import React from 'react';

interface NorthIndianChartProps {
  chartData: Array<{
    houseNumber: number;
    rashiId: number;
    rashiEnglish: string;
    rashiKannada: string;
    planets: string[];
  }>;
  language?: 'en' | 'kn';
}

export const NorthIndianChart: React.FC<NorthIndianChartProps> = ({ chartData, language = 'en' }) => {
  const getHouse = (num: number) => {
    return (
      chartData.find((h) => h.houseNumber === num) || {
        houseNumber: num,
        rashiId: 1,
        rashiEnglish: '',
        rashiKannada: '',
        planets: [],
      }
    );
  };

  // Center positions for labels in 400x400 viewBox
  const housePositions: Record<number, { cx: number; cy: number }> = {
    1: { cx: 200, cy: 110 },
    2: { cx: 100, cy: 45 },
    3: { cx: 45, cy: 100 },
    4: { cx: 110, cy: 200 },
    5: { cx: 45, cy: 300 },
    6: { cx: 100, cy: 355 },
    7: { cx: 200, cy: 290 },
    8: { cx: 300, cy: 355 },
    9: { cx: 355, cy: 300 },
    10: { cx: 290, cy: 200 },
    11: { cx: 355, cy: 100 },
    12: { cx: 300, cy: 45 },
  };

  return (
    <div className="w-full max-w-md mx-auto border-2 border-spiritual-maroon rounded-2xl overflow-hidden shadow-md bg-spiritual-cream-50">
      <div className="bg-gradient-to-r from-spiritual-maroon via-spiritual-maroon-dark to-spiritual-maroon text-white text-center py-1.5 text-xs font-bold tracking-wider uppercase">
        {language === 'kn' ? 'ಉತ್ತರ ಭಾರತೀಯ ಕುಂಡಲಿ (ಹೀರಕ ಚಕ್ರ)' : 'North Indian Kundali (Diamond Chart)'}
      </div>

      <div className="p-2 flex items-center justify-center">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-auto max-w-[380px] aspect-square drop-shadow-xs"
        >
          {/* Background */}
          <rect width="400" height="400" fill="#FFFDF8" stroke="#800000" strokeWidth="3" />

          {/* Diagonals */}
          <line x1="0" y1="0" x2="400" y2="400" stroke="#800000" strokeWidth="2" />
          <line x1="400" y1="0" x2="0" y2="400" stroke="#800000" strokeWidth="2" />

          {/* Inner Diamond */}
          <polygon
            points="200,0 400,200 200,400 0,200"
            fill="none"
            stroke="#800000"
            strokeWidth="2.5"
          />

          {/* House Labels & Planets */}
          {Array.from({ length: 12 }, (_, i) => {
            const hNum = i + 1;
            const h = getHouse(hNum);
            const pos = housePositions[hNum];

            return (
              <g key={hNum}>
                {/* Rashi Number in small corner */}
                <text
                  x={pos.cx}
                  y={pos.cy - 14}
                  textAnchor="middle"
                  fill="#996515"
                  fontSize="11"
                  fontWeight="bold"
                >
                  {h.rashiId}
                </text>

                {/* Planets occupying this house */}
                <text
                  x={pos.cx}
                  y={pos.cy + 3}
                  textAnchor="middle"
                  fill="#660000"
                  fontSize="12"
                  fontWeight="900"
                >
                  {h.planets && h.planets.length > 0 ? h.planets.join(' ') : '—'}
                </text>

                {/* House Indicator for House 1 (Lagna) */}
                {hNum === 1 && (
                  <text
                    x={pos.cx}
                    y={pos.cy + 22}
                    textAnchor="middle"
                    fill="#D97706"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    LAGNA (ಲಗ್ನ)
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
