import React from 'react';

interface SouthIndianChartProps {
  chartData: Array<{
    rashiId: number;
    rashiEnglish: string;
    rashiKannada: string;
    isLagna: boolean;
    planets: string[];
  }>;
  language?: 'bilingual' | 'en' | 'kn';
  title?: string;
}

const PLANET_KN_MAP: Record<string, string> = {
  Su: 'ಸೂರ್ಯ',
  Mo: 'ಚಂದ್ರ',
  Ma: 'ಕುಜ',
  Me: 'ಬುಧ',
  Ju: 'ಗುರು',
  Ve: 'ಶುಕ್ರ',
  Sa: 'ಶನಿ',
  Ra: 'ರಾಹು',
  Ke: 'ಕೇತು',
};

/**
 * South Indian Fixed-Sign Kundali Layout:
 * 4x4 Grid representation:
 * [12: Meena]      [ 1: Mesha]       [ 2: Vrishabha]   [ 3: Mithuna]
 * [11: Kumbha]     ( CENTER / SACRED SPACE )           [ 4: Karka]
 * [10: Makara]     ( CENTER / SACRED SPACE )           [ 5: Simha]
 * [ 9: Dhanu]      [ 8: Vrishchika]  [ 7: Tula]        [ 6: Kanya]
 */
export const SouthIndianChart: React.FC<SouthIndianChartProps> = ({
  chartData,
  language = 'bilingual',
  title,
}) => {
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
            {language === 'bilingual'
              ? `${box.rashiEnglish} (${box.rashiKannada})`
              : language === 'kn'
              ? box.rashiKannada
              : box.rashiEnglish}
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
            box.planets.map((p, idx) => {
              const cleanSym = p.replace(/\(R\)/g, '');
              const isRetro = p.includes('(R)');
              const knName = PLANET_KN_MAP[cleanSym] || cleanSym;

              return (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-black shadow-xs border ${
                    isRetro
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-spiritual-saffron-100 text-spiritual-maroon-dark border border-spiritual-saffron/30'
                  }`}
                  title={`${cleanSym}: ${knName}${isRetro ? ' (ವಕ್ರಿ / Retrograde)' : ''}`}
                >
                  <span>{language === 'kn' ? knName : cleanSym}</span>
                  {language === 'bilingual' && (
                    <span className="text-[8px] text-neutral-500 font-normal">({knName.slice(0, 2)})</span>
                  )}
                  {isRetro && <span className="text-[8px] text-amber-700 font-extrabold">(R)</span>}
                </span>
              );
            })
          ) : (
            <span className="text-[11px] text-neutral-300 italic select-none">--</span>
          )}
        </div>

        {/* Sign Number */}
        <div className="text-right text-[10px] text-neutral-400 font-semibold select-none">
          #{rashiId}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto border-2 border-spiritual-maroon rounded-2xl overflow-hidden shadow-md bg-spiritual-cream-50">
      <div className="bg-gradient-to-r from-spiritual-maroon via-spiritual-maroon-dark to-spiritual-maroon text-white text-center py-1.5 text-xs font-bold tracking-wider uppercase">
        {title ||
          (language === 'bilingual'
            ? 'South Indian Kundali (ದಕ್ಷಿಣ ಭಾರತೀಯ ಕುಂಡಲಿ)'
            : language === 'kn'
            ? 'ದಕ್ಷಿಣ ಭಾರತೀಯ ಕುಂಡಲಿ (ಚತುರಸ್ರ ಚಕ್ರ)'
            : 'South Indian Kundali (Square Chart)')}
      </div>

      <div className="grid grid-cols-4 grid-rows-4 bg-spiritual-gold/20 p-1 gap-0.5">
        {/* Row 1 */}
        {renderCell(12)}
        {renderCell(1)}
        {renderCell(2)}
        {renderCell(3)}

        {/* Row 2 */}
        {renderCell(11)}
        <div className="col-span-2 row-span-2 bg-gradient-to-br from-spiritual-cream-100 via-white to-spiritual-cream-200 flex flex-col items-center justify-center p-3 text-center border border-spiritual-gold/40 shadow-inner">
          <div className="w-10 h-10 rounded-full bg-spiritual-maroon/10 border border-spiritual-gold flex items-center justify-center mb-1">
            <span className="font-serif font-black text-spiritual-maroon text-lg">ॐ</span>
          </div>
          <span className="text-[11px] font-black text-spiritual-maroon font-serif leading-tight">
            || ಶ್ರೀ ||
          </span>
          <span className="font-serif font-black text-xs text-spiritual-maroon tracking-wider">
            {language === 'bilingual'
              ? 'JANMA KUNDALI (ಜನ್ಮ ಕುಂಡಲಿ)'
              : language === 'kn'
              ? 'ಜನ್ಮ ಕುಂಡಲಿ ಚಕ್ರ'
              : 'JANMA KUNDALI'}
          </span>
          <span className="text-[10px] text-spiritual-saffron-700 font-bold leading-tight mt-0.5">
            {language === 'kn' ? 'ರಾಶಿ ಚಕ್ರ' : 'Rashi Chakra'}
          </span>
          <span className="text-[9px] text-neutral-500 font-serif italic mt-0.5">
            Lahiri Sidereal Zodiac
          </span>
        </div>
        {renderCell(4)}

        {/* Row 3 */}
        {renderCell(10)}
        {renderCell(5)}

        {/* Row 4 */}
        {renderCell(9)}
        {renderCell(8)}
        {renderCell(7)}
        {renderCell(6)}
      </div>
    </div>
  );
};
