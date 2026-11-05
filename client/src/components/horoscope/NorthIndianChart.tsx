import React from 'react';

interface NorthIndianChartProps {
  chartData: Array<{
    houseNumber: number;
    rashiId: number;
    rashiEnglish: string;
    rashiKannada: string;
    planets: string[];
  }>;
  language?: 'bilingual' | 'en' | 'kn';
  title?: string;
}

export const NorthIndianChart: React.FC<NorthIndianChartProps> = ({
  chartData,
  language = 'bilingual',
  title,
}) => {
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
        {title ||
          (language === 'bilingual'
            ? 'North Indian Kundali (ಉತ್ತರ ಭಾರತೀಯ ಕುಂಡಲಿ)'
            : language === 'kn'
            ? 'ಉತ್ತರ ಭಾರತೀಯ ಕುಂಡಲಿ (ಹೀರಕ ಚಕ್ರ)'
            : 'North Indian Kundali (Diamond Chart)')}
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

          {/* Diamond in the center connecting midpoints */}
          <polygon points="200,0 400,200 200,400 0,200" fill="none" stroke="#800000" strokeWidth="2" />

          {/* Inner Kendra diamond lines */}
          <line x1="0" y1="200" x2="200" y2="0" stroke="#800000" strokeWidth="2" />
          <line x1="200" y1="0" x2="400" y2="200" stroke="#800000" strokeWidth="2" />
          <line x1="400" y1="200" x2="200" y2="400" stroke="#800000" strokeWidth="2" />
          <line x1="200" y1="400" x2="0" y2="200" stroke="#800000" strokeWidth="2" />

          {/* Render 12 Houses */}
          {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => {
            const h = getHouse(num);
            const pos = housePositions[num];
            return (
              <g key={num}>
                {/* Rashi Number in small red/maroon */}
                <text
                  x={pos.cx}
                  y={pos.cy - 12}
                  fontSize="11"
                  fontWeight="bold"
                  fill="#800000"
                  textAnchor="middle"
                  fontFamily="serif"
                >
                  {h.rashiId}
                </text>

                {/* Occupying Planets */}
                {h.planets && h.planets.length > 0 && (
                  <text
                    x={pos.cx}
                    y={pos.cy + 4}
                    fontSize="11"
                    fontWeight="bold"
                    fill="#1F2937"
                    textAnchor="middle"
                    fontFamily="sans-serif"
                  >
                    {h.planets.slice(0, 3).join(' ')}
                  </text>
                )}
                {h.planets && h.planets.length > 3 && (
                  <text
                    x={pos.cx}
                    y={pos.cy + 16}
                    fontSize="9"
                    fontWeight="bold"
                    fill="#1F2937"
                    textAnchor="middle"
                    fontFamily="sans-serif"
                  >
                    {h.planets.slice(3, 6).join(' ')}
                  </text>
                )}

                {/* Lagna marker on House 1 */}
                {num === 1 && (
                  <text
                    x={pos.cx}
                    y={pos.cy + 22}
                    fontSize="9"
                    fontWeight="black"
                    fill="#D97706"
                    textAnchor="middle"
                    fontFamily="sans-serif"
                  >
                    {language === 'kn' ? 'ಲಗ್ನ' : 'ASC'}
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
