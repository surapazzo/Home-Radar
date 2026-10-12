import React, { useState } from 'react';
import { Listing, SwissCanton, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { CantonFlag } from './CantonFlag';
import { Train, MapPin, Navigation } from 'lucide-react';

interface SwissMapProps {
  lang: Language;
  listings: Listing[];
  selectedListing: Listing | null;
  onSelectListing: (listing: Listing) => void;
  selectedCanton: string;
  onSelectCanton: (canton: string) => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
}

interface MapHub {
  name: string;
  canton: SwissCanton;
  xPercent: number;
  yPercent: number;
  sbbHub: string;
  sbbMinutes: number;
}

const SWISS_HUBS: MapHub[] = [
  { name: 'Zürich', canton: 'Zürich', xPercent: 64, yPercent: 28, sbbHub: 'Zürich HB', sbbMinutes: 0 },
  { name: 'Genève', canton: 'Genève', xPercent: 12, yPercent: 78, sbbHub: 'Genève Cornavin', sbbMinutes: 0 },
  { name: 'Lausanne', canton: 'Vaud', xPercent: 26, yPercent: 64, sbbHub: 'Lausanne Gare', sbbMinutes: 0 },
  { name: 'Basel', canton: 'Basel-Stadt', xPercent: 44, yPercent: 16, sbbHub: 'Basel SBB', sbbMinutes: 0 },
  { name: 'Bern', canton: 'Bern', xPercent: 42, yPercent: 48, sbbHub: 'Bern Bahnhof', sbbMinutes: 0 },
  { name: 'Lugano', canton: 'Ticino', xPercent: 69, yPercent: 84, sbbHub: 'Lugano FFS', sbbMinutes: 0 },
  { name: 'Luzern', canton: 'Luzern', xPercent: 57, yPercent: 45, sbbHub: 'Luzern Bahnhof', sbbMinutes: 0 },
  { name: 'Zug', canton: 'Zug', xPercent: 62, yPercent: 39, sbbHub: 'Zug Bahnhof', sbbMinutes: 0 },
  { name: 'Morges', canton: 'Vaud', xPercent: 23, yPercent: 67, sbbHub: 'Lausanne Gare', sbbMinutes: 11 },
  { name: 'Nyon', canton: 'Vaud', xPercent: 16, yPercent: 74, sbbHub: 'Genève Cornavin', sbbMinutes: 14 },
  { name: 'Vevey', canton: 'Vaud', xPercent: 33, yPercent: 68, sbbHub: 'Lausanne Gare', sbbMinutes: 15 },
  { name: 'Bellinzona', canton: 'Ticino', xPercent: 70, yPercent: 72, sbbHub: 'Bellinzona FFS', sbbMinutes: 0 },
  { name: 'Carouge', canton: 'Genève', xPercent: 13, yPercent: 81, sbbHub: 'Genève Cornavin', sbbMinutes: 12 },
  { name: 'Neuchâtel', canton: 'Neuchâtel', xPercent: 30, yPercent: 43, sbbHub: 'Neuchâtel Gare', sbbMinutes: 0 },
  { name: 'Fribourg', canton: 'Fribourg', xPercent: 36, yPercent: 54, sbbHub: 'Fribourg Gare', sbbMinutes: 0 },
  { name: 'Sion', canton: 'Valais', xPercent: 45, yPercent: 75, sbbHub: 'Sion Gare', sbbMinutes: 0 },
  { name: 'St. Gallen', canton: 'St. Gallen', xPercent: 86, yPercent: 24, sbbHub: 'St. Gallen Bahnhof', sbbMinutes: 0 },
];

export const SwissMap: React.FC<SwissMapProps> = ({
  lang,
  listings,
  selectedListing,
  onSelectListing,
  selectedCanton,
  onSelectCanton,
  selectedCity,
  onSelectCity,
}) => {
  const t = TRANSLATIONS[lang];
  const [showRailNetwork, setShowRailNetwork] = useState(true);

  // Group listings count by city
  const cityCounts = listings.reduce<Record<string, number>>((acc, l) => {
    acc[l.city] = (acc[l.city] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col h-full shadow-xs transition-colors">
      {/* Map Header with controls */}
      <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/50">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-red-600 dark:text-red-400" />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {t.map.title}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">·</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
            {t.map.listingsTracked.replace('{count}', String(listings.length))}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRailNetwork(!showRailNetwork)}
            className={`text-xs px-2.5 py-1 rounded font-medium flex items-center gap-1 transition-colors ${
              showRailNetwork
                ? 'bg-slate-900 dark:bg-slate-700 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
            title="SBB / CFF / FFS"
          >
            <Train className="w-3 h-3 text-red-400" />
            <span>SBB/CFF/FFS</span>
          </button>

          {(selectedCanton || selectedCity) && (
            <button
              onClick={() => {
                onSelectCanton('');
                onSelectCity('');
              }}
              className="text-xs px-2 py-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-medium"
            >
              {t.map.allVaud}
            </button>
          )}
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative flex-1 bg-slate-100 dark:bg-slate-950 min-h-[380px] overflow-hidden select-none transition-colors">
        <svg
          viewBox="0 0 1000 620"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="swissLakeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.6" />
            </linearGradient>

            <pattern id="swissGrid" width="35" height="35" patternUnits="userSpaceOnUse">
              <path d="M 35 0 L 0 0 0 35" fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-900" strokeWidth="0.7" />
            </pattern>
          </defs>

          {/* Grid background */}
          <rect width="1000" height="620" fill="url(#swissGrid)" />

          {/* Switzerland Country Boundary and Stylized Canton Regions */}
          {/* Jura & Nord-West (Basel, Jura, Neuchâtel) */}
          <path
            d="M 120 480
               C 90 460, 60 500, 110 520
               C 160 500, 210 460, 250 430
               C 280 400, 270 330, 310 290
               C 340 260, 390 230, 420 160
               C 440 120, 480 130, 520 150
               C 560 160, 620 140, 680 160
               C 740 170, 800 160, 860 210
               C 920 250, 940 330, 900 390
               C 870 430, 850 460, 820 500
               C 790 540, 750 570, 710 600
               C 670 590, 680 520, 640 490
               C 600 480, 560 510, 520 530
               C 470 540, 430 580, 380 560
               C 330 530, 260 540, 200 510
               C 150 500, 130 490, 120 480 Z"
            className="fill-slate-50 dark:fill-slate-900 stroke-slate-300 dark:stroke-slate-700"
            strokeWidth="3"
            filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.06))"
          />

          {/* Canton Regions - Stylized Color-tinted Geometries for Readability */}
          {/* Romandie / Vaud / Genève / Neuchâtel */}
          <path
            d="M 120 480 C 100 470, 90 510, 120 520 C 180 500, 230 460, 270 420 C 290 370, 280 320, 330 280 L 370 340 C 330 380, 300 430, 270 450 C 230 470, 180 480, 120 480 Z"
            className="fill-emerald-500/10 dark:fill-emerald-400/10 stroke-slate-300/60 dark:stroke-slate-700/60"
            strokeWidth="1.2"
          />

          {/* Central Switzerland & Zürich (ZH, ZG, LU) */}
          <path
            d="M 430 160 C 470 140, 520 150, 580 180 C 640 180, 700 170, 750 200 L 730 320 C 680 320, 640 330, 590 350 L 520 300 C 470 250, 440 210, 430 160 Z"
            className="fill-blue-500/10 dark:fill-blue-400/10 stroke-slate-300/60 dark:stroke-slate-700/60"
            strokeWidth="1.2"
          />

          {/* Bern & Mittelland (BE, FR, SO) */}
          <path
            d="M 330 280 L 370 340 C 390 380, 420 420, 450 450 L 520 420 C 510 370, 490 320, 450 250 C 400 240, 350 260, 330 280 Z"
            className="fill-amber-500/10 dark:fill-amber-400/10 stroke-slate-300/60 dark:stroke-slate-700/60"
            strokeWidth="1.2"
          />

          {/* Eastern Switzerland (SG, TG, GR) */}
          <path
            d="M 750 200 C 800 180, 860 210, 900 260 C 920 310, 910 360, 870 410 L 780 410 C 760 360, 740 280, 750 200 Z"
            className="fill-teal-500/10 dark:fill-teal-400/10 stroke-slate-300/60 dark:stroke-slate-700/60"
            strokeWidth="1.2"
          />

          {/* Valais / Wallis (VS) */}
          <path
            d="M 270 450 C 330 460, 400 480, 470 470 C 510 460, 550 450, 580 460 L 560 530 C 500 540, 440 560, 380 540 C 320 520, 280 480, 270 450 Z"
            className="fill-red-500/10 dark:fill-red-400/10 stroke-slate-300/60 dark:stroke-slate-700/60"
            strokeWidth="1.2"
          />

          {/* Ticino / Tessin (TI) */}
          <path
            d="M 640 490 C 670 510, 680 550, 710 600 C 680 590, 660 540, 630 520 L 640 490 Z"
            className="fill-indigo-500/15 dark:fill-indigo-400/15 stroke-slate-300/60 dark:stroke-slate-700/60"
            strokeWidth="1.2"
          />

          {/* Subtle Alps mountain relief shading */}
          <path
            d="M 250 460 Q 420 485 580 455 Q 730 465 870 395"
            fill="none"
            stroke="currentColor"
            className="text-slate-300/80 dark:text-slate-700"
            strokeWidth="3.5"
            strokeDasharray="6,4"
          />
          <text x="500" y="495" fontSize="10" className="fill-slate-400 dark:fill-slate-500 font-semibold" letterSpacing="3">
            SCHWEIZER ALPEN · ALPES SUISSES · ALPI
          </text>

          {/* Major Swiss Lakes - Stylized Crystal Clear Water */}
          {/* 1. Lac Léman (Lake Geneva) */}
          <path
            d="M 100 515 C 150 485, 230 460, 285 450 C 330 455, 345 475, 325 485 C 265 480, 185 495, 100 515 Z"
            fill="url(#swissLakeGrad)"
            stroke="#0284c7"
            strokeWidth="1.5"
            filter="drop-shadow(0 1px 2px rgba(2,132,199,0.3))"
          />
          <text x="175" y="488" fontSize="10" fill="#0369a1" className="font-semibold select-none">Lac Léman</text>

          {/* 2. Lac de Neuchâtel */}
          <path
            d="M 245 335 C 275 305, 315 315, 325 325 C 305 345, 275 350, 245 335 Z"
            fill="url(#swissLakeGrad)"
            stroke="#0284c7"
            strokeWidth="1.2"
          />
          <text x="252" y="325" fontSize="8" fill="#0369a1" className="font-medium select-none">L. Neuchâtel</text>

          {/* 3. Zürichsee */}
          <path
            d="M 640 225 C 670 240, 715 270, 710 275 C 685 275, 655 245, 640 225 Z"
            fill="url(#swissLakeGrad)"
            stroke="#0284c7"
            strokeWidth="1.3"
          />
          <text x="665" y="258" fontSize="9" fill="#0369a1" className="font-semibold select-none">Zürichsee</text>

          {/* 4. Vierwaldstättersee (Lake Lucerne) */}
          <path
            d="M 545 315 C 570 320, 595 335, 590 350 C 565 355, 550 330, 545 315 Z"
            fill="url(#swissLakeGrad)"
            stroke="#0284c7"
            strokeWidth="1.3"
          />
          <text x="535" y="352" fontSize="8" fill="#0369a1" className="font-medium select-none">Vierwaldstättersee</text>

          {/* 5. Bodensee (Lake Constance) */}
          <path
            d="M 740 145 C 810 160, 875 175, 870 190 C 810 175, 755 155, 740 145 Z"
            fill="url(#swissLakeGrad)"
            stroke="#0284c7"
            strokeWidth="1.3"
          />
          <text x="795" y="168" fontSize="9" fill="#0369a1" className="font-semibold select-none">Bodensee</text>

          {/* 6. Lago di Lugano */}
          <path
            d="M 665 540 C 690 565, 700 585, 690 588 C 675 580, 665 555, 665 540 Z"
            fill="url(#swissLakeGrad)"
            stroke="#0284c7"
            strokeWidth="1.3"
          />
          <text x="672" y="572" fontSize="8" fill="#0369a1" className="font-semibold select-none">L. Lugano</text>

          {/* SBB / CFF / FFS Main Railway Arteries */}
          {showRailNetwork && (
            <g opacity="0.85">
              {/* West-East Main line: Geneva - Lausanne - Bern - Zurich - St. Gallen */}
              <path
                d="M 120 500 L 260 435 L 420 335 L 640 220 L 860 195"
                fill="none"
                stroke="#dc2626"
                strokeWidth="2.5"
                strokeDasharray="6,4"
              />

              {/* North-South line 1: Basel - Bern - Valais */}
              <path
                d="M 440 155 L 420 335 L 450 495"
                fill="none"
                stroke="#dc2626"
                strokeWidth="2"
                strokeDasharray="5,3"
              />

              {/* North-South line 2: Basel/Zurich - Gotthard Base Tunnel - Lugano */}
              <path
                d="M 640 220 L 620 280 L 680 480 L 690 560"
                fill="none"
                stroke="#dc2626"
                strokeWidth="2"
                strokeDasharray="5,3"
              />
            </g>
          )}

          {/* Swiss Regional Canton Labels */}
          <text x="690" y="195" fontSize="12" className="fill-slate-400 dark:fill-slate-500 font-bold tracking-wider select-none">ZÜRICH</text>
          <text x="180" y="425" fontSize="12" className="fill-slate-400 dark:fill-slate-500 font-bold tracking-wider select-none">VAUD</text>
          <text x="440" y="295" fontSize="12" className="fill-slate-400 dark:fill-slate-500 font-bold tracking-wider select-none">BERN</text>
          <text x="670" y="515" fontSize="12" className="fill-slate-400 dark:fill-slate-500 font-bold tracking-wider select-none">TICINO</text>
          <text x="440" y="135" fontSize="12" className="fill-slate-400 dark:fill-slate-500 font-bold tracking-wider select-none">BASEL</text>
          <text x="100" y="460" fontSize="11" className="fill-slate-400 dark:fill-slate-500 font-bold tracking-wider select-none">GENÈVE</text>
          <text x="560" y="280" fontSize="11" className="fill-slate-400 dark:fill-slate-500 font-bold tracking-wider select-none">LUZERN / ZUG</text>
          <text x="820" y="225" fontSize="11" className="fill-slate-400 dark:fill-slate-500 font-bold tracking-wider select-none">ST. GALLEN</text>
        </svg>

        {/* Interactive Hub Markers with Canton Flags */}
        {SWISS_HUBS.map((hub) => {
          const count = cityCounts[hub.name] || 0;
          const isSelected = selectedCity === hub.name || selectedCanton === hub.canton;

          return (
            <div
              key={hub.name}
              style={{
                left: `${hub.xPercent}%`,
                top: `${hub.yPercent}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-10 group"
            >
              <button
                onClick={() => {
                  if (selectedCity === hub.name) {
                    onSelectCity('');
                    onSelectCanton('');
                  } else {
                    onSelectCity(hub.name);
                    onSelectCanton(hub.canton);
                  }
                }}
                className={`relative flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold shadow-md transition-all ${
                  isSelected
                    ? 'bg-red-600 text-white scale-110 ring-2 ring-red-400'
                    : count > 0
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 hover:border-red-500 hover:shadow-lg'
                    : 'bg-white/85 dark:bg-slate-800/85 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 opacity-80'
                }`}
              >
                {/* Canton Flag instead of dot */}
                <CantonFlag canton={hub.canton} size="sm" />
                <span className="truncate max-w-[85px]">{hub.name}</span>
                {count > 0 && (
                  <span
                    className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono tabular-nums ${
                      isSelected ? 'bg-red-800 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>

              {/* Hover Tooltip with SBB Hub info */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:flex flex-col items-center z-30 pointer-events-none">
                <div className="bg-slate-900 text-white text-[11px] rounded-lg px-2.5 py-1.5 shadow-xl whitespace-nowrap border border-slate-700">
                  <div className="font-semibold flex items-center gap-1.5">
                    <CantonFlag canton={hub.canton} size="sm" />
                    <span>{hub.name} (Kanton {hub.canton})</span>
                  </div>
                  <div className="text-slate-300 flex items-center gap-1 mt-0.5">
                    <Train className="w-3 h-3 text-red-400" />
                    <span>
                      {hub.sbbMinutes === 0
                        ? `${t.map.hubCentral} ${hub.sbbHub}`
                        : t.map.minFromLausanne.replace('{min}', String(hub.sbbMinutes)).replace('{hub}', hub.sbbHub)}
                    </span>
                  </div>
                </div>
                <div className="w-2 h-2 bg-slate-900 rotate-45 -mt-1" />
              </div>
            </div>
          );
        })}

        {/* Selected Listing Pin Highlight */}
        {selectedListing && (
          <div
            style={{
              left: `${selectedListing.coordinates.xPercent}%`,
              top: `${selectedListing.coordinates.yPercent - 6}%`,
              transform: 'translate(-50%, -100%)',
            }}
            className="absolute z-20 pointer-events-none transition-all duration-300"
          >
            <div className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl flex items-center gap-1.5 border border-white whitespace-nowrap">
              <CantonFlag canton={selectedListing.canton} size="sm" />
              <span>CHF {selectedListing.rentTotalCHF} cc</span>
            </div>
            <div className="w-3 h-3 bg-red-600 rotate-45 mx-auto -mt-1.5 border-r border-b border-white" />
          </div>
        )}
      </div>

      {/* Map Footer legend */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{t.map.availableListings}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-red-500 border-t border-red-500 border-dashed" />
            <span>{t.map.cffRailAxis}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span>{t.map.lakeGenevaShore}</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 dark:text-slate-500">
          {t.map.footerHint}
        </div>
      </div>
    </div>
  );
};
