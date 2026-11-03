import React from 'react';

interface SouthIndianChartProps {
  chartData: Array<{
    rashiId: number;
    rashiEnglish: string;
    rashiKannada: string;
    isLagna: boolean;
    planets: string[];
  }>;
  language?: 'en' | 'kn';
}

/**
 * South Indian Fixed-Sign Kundali Layout:
 * 4x4 Grid representation:
 * [12: Meena]      [ 1: Mesha]       [ 2: Vrishabha]   [ 3: Mithuna]
 * [11: Kumbha]     ( CENTER / SACRED SPACE )           [ 4: Karka]
 * [10: Makara]     ( CENTER / SACRED SPACE )           [ 5: Simha]
 * [ 9: Dhanu]      [ 8: Vrishchika]  [ 7: Tula]        [ 6: Kanya]
 */
export const SouthIndianChart: React.FC<SouthIndianChartProps> = ({ chartData, language = 'en' }) => {
  const getBox = (rashiId: number) => {
    return (
      chartData.find((b) => b.rashiId === rashiId) || {
        rashiId,
        rashiEnglish: '',
        rashiKannada: '',
        isLagna: false,
        planets: [],
      }
    );
  };

  const renderCell = (rashiId: number) => {
    const box = getBox(rashiId);
    return (
      <div
        key={rashiId}
        className={`relative p-2 flex flex-col justify-between border border-spiritual-maroon/30 transition-colors ${
          box.isLagna
            ? 'bg-gradient-to-br from-spiritual-saffron-50 to-spiritual-gold/15'
            : 'bg-white/80 hover:bg-spiritual-cream-50'
        }`}
        style={{ minHeight: '92px' }}
      >
        {/* Cell Header: Sign Name & Lagna Indicator */}
        <div className="flex items-center justify-between text-[11px] leading-tight font-bold text-spiritual-maroon border-b border-spiritual-gold/25 pb-0.5">
          <span className="truncate">
            {language === 'kn' ? box.rashiKannada : box.rashiEnglish}
          </span>
          {box.isLagna && (
            <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-spiritual-maroon text-white tracking-wider animate-pulse">
              {language === 'kn' ? 'ಲಗ್ನ' : 'LAGNA'}
            </span>
          )}
        </div>

        {/* Occupying Planets */}
        <div className="flex-1 flex flex-wrap gap-1 content-center py-1">
          {box.planets && box.planets.length > 0 ? (
            box.planets.map((p, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-black shadow-xs ${
                  p.includes('(R)')
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-spiritual-saffron-100 text-spiritual-maroon-dark border border-spiritual-saffron/30'
                }`}
                title={p.includes('(R)') ? 'Retrograde (Vakri)' : 'Direct'}
              >
                {p}
              </span>
            ))
          ) : (
            <span className="text-[11px] text-neutral-300 italic select-none">--</span>
          )}
        </div>

        {/* Sign Number */}
        <div className="text-right text-[10px] text-neutral-400 font-semibold select-none">
          {rashiId}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto border-2 border-spiritual-maroon rounded-2xl overflow-hidden shadow-md bg-spiritual-cream-50">
      <div className="bg-gradient-to-r from-spiritual-maroon via-spiritual-maroon-dark to-spiritual-maroon text-white text-center py-1.5 text-xs font-bold tracking-wider uppercase">
        {language === 'kn' ? 'ದಕ್ಷಿಣ ಭಾರತೀಯ ಕುಂಡಲಿ (ಚೌಕ ಚಕ್ರ)' : 'South Indian Kundali (Fixed Signs)'}
      </div>

      <div className="grid grid-cols-4 grid-rows-4 aspect-square">
        {/* Row 1: Pisces (12), Aries (1), Taurus (2), Gemini (3) */}
        {renderCell(12)}
        {renderCell(1)}
        {renderCell(2)}
        {renderCell(3)}

        {/* Row 2: Aquarius (11), CENTER (2 cols), Cancer (4) */}
        {renderCell(11)}
        <div className="col-span-2 row-span-2 border border-spiritual-maroon/30 bg-gradient-to-br from-spiritual-cream-100 via-white to-spiritual-cream-50 flex flex-col items-center justify-center p-3 text-center">
          <div className="w-10 h-10 rounded-full p-1 bg-gradient-to-tr from-spiritual-maroon to-spiritual-saffron mb-1 flex items-center justify-center shadow-xs">
            <img src="/logo.svg" alt="Ganesha" className="w-full h-full object-contain filter drop-shadow-xs" />
          </div>
          <span className="text-[11px] font-black text-spiritual-maroon font-serif leading-tight">
            || ಶ್ರೀ ||
          </span>
          <span className="text-[10px] text-spiritual-saffron-700 font-bold leading-tight mt-0.5">
            {language === 'kn' ? 'ರಾಶಿ ಚಕ್ರ' : 'Rashi Chakra'}
          </span>
        </div>
        {renderCell(4)}

        {/* Row 3: Capricorn (10), (CENTER continued), Leo (5) */}
        {renderCell(10)}
        {renderCell(5)}

        {/* Row 4: Sagittarius (9), Scorpio (8), Libra (7), Virgo (6) */}
        {renderCell(9)}
        {renderCell(8)}
        {renderCell(7)}
        {renderCell(6)}
      </div>
    </div>
  );
};
