import React, { useState, useMemo } from 'react';
import { Listing, SwissCanton, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { CantonFlag } from './CantonFlag';
import { Train, Navigation, Flame, Eye, Clock, Sparkles, SlidersHorizontal, MapPin, Check } from 'lucide-react';

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

export interface MapHub {
  id: string;
  name: string;
  canton: SwissCanton;
  xPercent: number; // 0-100%
  yPercent: number; // 0-100%
  sbbHub: string;
  sbbMinutes: number;
  tier: 1 | 2;
  frequency: string;
  proximityScore: number;
  connections: { dest: string; min: number; train: string }[];
}

export const SWISS_HUBS: MapHub[] = [
  {
    id: 'zurich',
    name: 'Zürich',
    canton: 'Zürich',
    xPercent: 64,
    yPercent: 28,
    sbbHub: 'Zürich HB',
    sbbMinutes: 0,
    tier: 1,
    frequency: '2-4 min',
    proximityScore: 99,
    connections: [
      { dest: 'Bern', min: 56, train: 'IC1 / IC8' },
      { dest: 'Basel SBB', min: 53, train: 'IC3' },
      { dest: 'Luzern', min: 41, train: 'IR75' },
      { dest: 'Lugano', min: 113, train: 'IC2 (Gotthard)' },
    ],
  },
  {
    id: 'geneve',
    name: 'Genève',
    canton: 'Genève',
    xPercent: 12,
    yPercent: 78,
    sbbHub: 'Genève Cornavin',
    sbbMinutes: 0,
    tier: 1,
    frequency: '5 min',
    proximityScore: 98,
    connections: [
      { dest: 'Lausanne', min: 35, train: 'IC1 / IR90' },
      { dest: 'Bern', min: 104, train: 'IC1' },
      { dest: 'Nyon', min: 14, train: 'Léman Express' },
    ],
  },
  {
    id: 'lausanne',
    name: 'Lausanne',
    canton: 'Vaud',
    xPercent: 26,
    yPercent: 64,
    sbbHub: 'Lausanne Gare',
    sbbMinutes: 0,
    tier: 1,
    frequency: '3-5 min',
    proximityScore: 98,
    connections: [
      { dest: 'Genève', min: 35, train: 'IC1' },
      { dest: 'Bern', min: 66, train: 'IC1' },
      { dest: 'Vevey', min: 15, train: 'IR90 / RER' },
      { dest: 'Morges', min: 11, train: 'RER Vaud' },
    ],
  },
  {
    id: 'basel',
    name: 'Basel',
    canton: 'Basel-Stadt',
    xPercent: 44,
    yPercent: 16,
    sbbHub: 'Basel SBB',
    sbbMinutes: 0,
    tier: 1,
    frequency: '3-5 min',
    proximityScore: 97,
    connections: [
      { dest: 'Zürich HB', min: 53, train: 'IC3' },
      { dest: 'Bern', min: 55, train: 'ICE / IC6' },
      { dest: 'Olten', min: 28, train: 'IR27' },
    ],
  },
  {
    id: 'bern',
    name: 'Bern',
    canton: 'Bern',
    xPercent: 42,
    yPercent: 48,
    sbbHub: 'Bern Bahnhof',
    sbbMinutes: 0,
    tier: 1,
    frequency: '3-5 min',
    proximityScore: 98,
    connections: [
      { dest: 'Zürich HB', min: 56, train: 'IC1' },
      { dest: 'Lausanne', min: 66, train: 'IC1' },
      { dest: 'Basel SBB', min: 55, train: 'IC6' },
      { dest: 'Thun', min: 19, train: 'IC61 / S-Bahn' },
    ],
  },
  {
    id: 'luzern',
    name: 'Luzern',
    canton: 'Luzern',
    xPercent: 57,
    yPercent: 45,
    sbbHub: 'Luzern Bahnhof',
    sbbMinutes: 0,
    tier: 1,
    frequency: '5-10 min',
    proximityScore: 94,
    connections: [
      { dest: 'Zürich HB', min: 41, train: 'IR75' },
      { dest: 'Zug', min: 21, train: 'IR75 / S1' },
      { dest: 'Bern', min: 60, train: 'IR15' },
    ],
  },
  {
    id: 'zug',
    name: 'Zug',
    canton: 'Zug',
    xPercent: 62,
    yPercent: 39,
    sbbHub: 'Zug Bahnhof',
    sbbMinutes: 0,
    tier: 1,
    frequency: '5-10 min',
    proximityScore: 95,
    connections: [
      { dest: 'Zürich HB', min: 21, train: 'IR75 / IC2' },
      { dest: 'Luzern', min: 21, train: 'IR75' },
      { dest: 'Lugano', min: 92, train: 'IC2 (Gotthard)' },
    ],
  },
  {
    id: 'lugano',
    name: 'Lugano',
    canton: 'Ticino',
    xPercent: 69,
    yPercent: 84,
    sbbHub: 'Lugano FFS',
    sbbMinutes: 0,
    tier: 1,
    frequency: '10-15 min',
    proximityScore: 92,
    connections: [
      { dest: 'Bellinzona', min: 14, train: 'RE80 / Ceneri' },
      { dest: 'Zürich HB', min: 113, train: 'IC2 (Gotthard Base)' },
      { dest: 'Milano Centrale', min: 68, train: 'EC' },
    ],
  },
  {
    id: 'stgallen',
    name: 'St. Gallen',
    canton: 'St. Gallen',
    xPercent: 86,
    yPercent: 24,
    sbbHub: 'St. Gallen Bahnhof',
    sbbMinutes: 0,
    tier: 1,
    frequency: '10-15 min',
    proximityScore: 91,
    connections: [
      { dest: 'Winterthur', min: 41, train: 'IC1' },
      { dest: 'Zürich HB', min: 60, train: 'IC1 / IC5' },
    ],
  },
  {
    id: 'olten',
    name: 'Olten',
    canton: 'Bern',
    xPercent: 48,
    yPercent: 30,
    sbbHub: 'Olten Bahnhof (Kreuzung)',
    sbbMinutes: 0,
    tier: 1,
    frequency: '2-4 min',
    proximityScore: 97,
    connections: [
      { dest: 'Zürich HB', min: 31, train: 'IC5' },
      { dest: 'Bern', min: 26, train: 'IC' },
      { dest: 'Basel SBB', min: 28, train: 'IR27' },
      { dest: 'Luzern', min: 34, train: 'IR26' },
    ],
  },
  {
    id: 'winterthur',
    name: 'Winterthur',
    canton: 'Zürich',
    xPercent: 72,
    yPercent: 23,
    sbbHub: 'Winterthur HB',
    sbbMinutes: 18,
    tier: 2,
    frequency: '5 min',
    proximityScore: 93,
    connections: [
      { dest: 'Zürich HB', min: 18, train: 'IC1 / S-Bahn' },
      { dest: 'St. Gallen', min: 41, train: 'IC1' },
    ],
  },
  {
    id: 'morges',
    name: 'Morges',
    canton: 'Vaud',
    xPercent: 23,
    yPercent: 67,
    sbbHub: 'Lausanne Gare',
    sbbMinutes: 11,
    tier: 2,
    frequency: '10 min',
    proximityScore: 89,
    connections: [
      { dest: 'Lausanne', min: 11, train: 'RER Vaud' },
      { dest: 'Genève', min: 28, train: 'IR90' },
    ],
  },
  {
    id: 'nyon',
    name: 'Nyon',
    canton: 'Vaud',
    xPercent: 16,
    yPercent: 74,
    sbbHub: 'Genève Cornavin',
    sbbMinutes: 14,
    tier: 2,
    frequency: '10 min',
    proximityScore: 90,
    connections: [
      { dest: 'Genève', min: 14, train: 'Léman Express' },
      { dest: 'Lausanne', min: 24, train: 'IR90' },
    ],
  },
  {
    id: 'vevey',
    name: 'Vevey',
    canton: 'Vaud',
    xPercent: 33,
    yPercent: 68,
    sbbHub: 'Lausanne Gare',
    sbbMinutes: 15,
    tier: 2,
    frequency: '10 min',
    proximityScore: 88,
    connections: [
      { dest: 'Lausanne', min: 15, train: 'IR90 / RER' },
      { dest: 'Montreux', min: 6, train: 'IR90 / S-Bahn' },
    ],
  },
  {
    id: 'bellinzona',
    name: 'Bellinzona',
    canton: 'Ticino',
    xPercent: 70,
    yPercent: 72,
    sbbHub: 'Bellinzona FFS',
    sbbMinutes: 0,
    tier: 2,
    frequency: '15 min',
    proximityScore: 88,
    connections: [
      { dest: 'Lugano', min: 14, train: 'RE80' },
      { dest: 'Zürich HB', min: 98, train: 'IC2 (Gotthard)' },
    ],
  },
  {
    id: 'neuchatel',
    name: 'Neuchâtel',
    canton: 'Neuchâtel',
    xPercent: 30,
    yPercent: 43,
    sbbHub: 'Neuchâtel Gare',
    sbbMinutes: 0,
    tier: 2,
    frequency: '15 min',
    proximityScore: 87,
    connections: [
      { dest: 'Biel/Bienne', min: 17, train: 'IC5' },
      { dest: 'Lausanne', min: 42, train: 'IC5' },
    ],
  },
  {
    id: 'fribourg',
    name: 'Fribourg',
    canton: 'Fribourg',
    xPercent: 36,
    yPercent: 54,
    sbbHub: 'Fribourg Gare',
    sbbMinutes: 0,
    tier: 2,
    frequency: '10-15 min',
    proximityScore: 88,
    connections: [
      { dest: 'Bern', min: 21, train: 'IC1' },
      { dest: 'Lausanne', min: 44, train: 'IC1' },
    ],
  },
  {
    id: 'sion',
    name: 'Sion',
    canton: 'Valais',
    xPercent: 45,
    yPercent: 75,
    sbbHub: 'Sion Gare',
    sbbMinutes: 0,
    tier: 2,
    frequency: '15-30 min',
    proximityScore: 84,
    connections: [
      { dest: 'Lausanne', min: 65, train: 'IR90' },
      { dest: 'Brig', min: 28, train: 'IR90' },
    ],
  },
  {
    id: 'aarau',
    name: 'Aarau',
    canton: 'Aargau',
    xPercent: 52,
    yPercent: 27,
    sbbHub: 'Aarau Bahnhof',
    sbbMinutes: 0,
    tier: 2,
    frequency: '5-10 min',
    proximityScore: 92,
    connections: [
      { dest: 'Zürich HB', min: 25, train: 'IC5' },
      { dest: 'Bern', min: 38, train: 'IR35' },
    ],
  },
  {
    id: 'chur',
    name: 'Chur',
    canton: 'Graubünden',
    xPercent: 84,
    yPercent: 52,
    sbbHub: 'Chur Bahnhof',
    sbbMinutes: 0,
    tier: 2,
    frequency: '15-30 min',
    proximityScore: 86,
    connections: [
      { dest: 'Zürich HB', min: 74, train: 'IC3' },
      { dest: 'St. Gallen', min: 80, train: 'SOB' },
    ],
  },
  {
    id: 'frauenfeld',
    name: 'Frauenfeld',
    canton: 'Thurgau',
    xPercent: 75,
    yPercent: 19,
    sbbHub: 'Frauenfeld Bahnhof',
    sbbMinutes: 0,
    tier: 2,
    frequency: '10-15 min',
    proximityScore: 90,
    connections: [
      { dest: 'Winterthur', min: 9, train: 'IC1' },
      { dest: 'Zürich HB', min: 29, train: 'IC1' },
    ],
  },
  {
    id: 'schwyz',
    name: 'Schwyz',
    canton: 'Schwyz',
    xPercent: 65,
    yPercent: 44,
    sbbHub: 'Schwyz Bahnhof',
    sbbMinutes: 0,
    tier: 2,
    frequency: '15-30 min',
    proximityScore: 88,
    connections: [
      { dest: 'Zug', min: 24, train: 'S2 / IR' },
      { dest: 'Zürich HB', min: 46, train: 'IR' },
    ],
  },
  {
    id: 'solothurn',
    name: 'Solothurn',
    canton: 'Solothurn',
    xPercent: 42,
    yPercent: 35,
    sbbHub: 'Solothurn Bahnhof',
    sbbMinutes: 0,
    tier: 2,
    frequency: '10-15 min',
    proximityScore: 89,
    connections: [
      { dest: 'Bern', min: 35, train: 'RE' },
      { dest: 'Biel/Bienne', min: 14, train: 'IC5' },
    ],
  },
  {
    id: 'liestal',
    name: 'Liestal',
    canton: 'Basel-Landschaft',
    xPercent: 46,
    yPercent: 22,
    sbbHub: 'Liestal Bahnhof',
    sbbMinutes: 0,
    tier: 2,
    frequency: '5-10 min',
    proximityScore: 91,
    connections: [
      { dest: 'Basel SBB', min: 10, train: 'IC / S3' },
      { dest: 'Olten', min: 17, train: 'IR' },
    ],
  },
  {
    id: 'schaffhausen',
    name: 'Schaffhausen',
    canton: 'Schaffhausen',
    xPercent: 65,
    yPercent: 14,
    sbbHub: 'Schaffhausen Bahnhof',
    sbbMinutes: 0,
    tier: 2,
    frequency: '10-15 min',
    proximityScore: 88,
    connections: [
      { dest: 'Zürich HB', min: 38, train: 'IC4 / S9' },
      { dest: 'Winterthur', min: 32, train: 'S33' },
    ],
  },
  {
    id: 'delemont',
    name: 'Delémont',
    canton: 'Jura',
    xPercent: 36,
    yPercent: 23,
    sbbHub: 'Delémont Gare',
    sbbMinutes: 0,
    tier: 2,
    frequency: '15-30 min',
    proximityScore: 84,
    connections: [
      { dest: 'Basel SBB', min: 37, train: 'IC51' },
      { dest: 'Biel/Bienne', min: 31, train: 'IC51' },
    ],
  },
  {
    id: 'altdorf',
    name: 'Altdorf',
    canton: 'Uri',
    xPercent: 63,
    yPercent: 52,
    sbbHub: 'Altdorf UR Bahnhof',
    sbbMinutes: 0,
    tier: 2,
    frequency: '15-30 min',
    proximityScore: 85,
    connections: [
      { dest: 'Luzern', min: 34, train: 'IR26' },
      { dest: 'Bellinzona', min: 61, train: 'IR26' },
    ],
  },
  {
    id: 'glarus',
    name: 'Glarus',
    canton: 'Glarus',
    xPercent: 74,
    yPercent: 44,
    sbbHub: 'Glarus Bahnhof',
    sbbMinutes: 0,
    tier: 2,
    frequency: '30 min',
    proximityScore: 83,
    connections: [
      { dest: 'Ziegelbrücke', min: 14, train: 'S25' },
      { dest: 'Zürich HB', min: 58, train: 'S25 Direkt' },
    ],
  },
  {
    id: 'sarnen',
    name: 'Sarnen',
    canton: 'Obwalden',
    xPercent: 55,
    yPercent: 50,
    sbbHub: 'Sarnen Bahnhof',
    sbbMinutes: 0,
    tier: 2,
    frequency: '15-30 min',
    proximityScore: 85,
    connections: [
      { dest: 'Luzern', min: 21, train: 'Zentralbahn' },
      { dest: 'Interlaken', min: 82, train: 'Zentralbahn' },
    ],
  },
  {
    id: 'stans',
    name: 'Stans',
    canton: 'Nidwalden',
    xPercent: 59,
    yPercent: 48,
    sbbHub: 'Stans Bahnhof',
    sbbMinutes: 0,
    tier: 2,
    frequency: '15-30 min',
    proximityScore: 86,
    connections: [
      { dest: 'Luzern', min: 14, train: 'Zentralbahn' },
      { dest: 'Engelberg', min: 28, train: 'Zentralbahn' },
    ],
  },
  {
    id: 'herisau',
    name: 'Herisau',
    canton: 'Appenzell Ausserrhoden',
    xPercent: 83,
    yPercent: 26,
    sbbHub: 'Herisau Bahnhof',
    sbbMinutes: 0,
    tier: 2,
    frequency: '15 min',
    proximityScore: 88,
    connections: [
      { dest: 'St. Gallen', min: 10, train: 'SOB / Appenzeller Bahnen' },
      { dest: 'Wattwil', min: 20, train: 'SOB' },
    ],
  },
  {
    id: 'appenzell',
    name: 'Appenzell',
    canton: 'Appenzell Innerrhoden',
    xPercent: 85,
    yPercent: 30,
    sbbHub: 'Appenzell Bahnhof',
    sbbMinutes: 0,
    tier: 2,
    frequency: '30 min',
    proximityScore: 85,
    connections: [
      { dest: 'Gossau SG', min: 38, train: 'Appenzeller Bahnen' },
      { dest: 'St. Gallen', min: 42, train: 'Appenzeller Bahnen' },
    ],
  },
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
  const [showCommuteHeatmap, setShowCommuteHeatmap] = useState(true);
  const [heatmapMode, setHeatmapMode] = useState<'combined' | 'heat' | 'isochrones'>('combined');
  const [focusedHubId, setFocusedHubId] = useState<string>('all');
  const [heatmapOpacity, setHeatmapOpacity] = useState<number>(0.75);
  const [hoveredHub, setHoveredHub] = useState<MapHub | null>(null);

  // Group listings count by city
  const cityCounts = useMemo(() => {
    return listings.reduce<Record<string, number>>((acc, l) => {
      acc[l.city] = (acc[l.city] || 0) + 1;
      return acc;
    }, {});
  }, [listings]);

  // Calculate percentage of listings within 30 min of a rail hub
  const percentWithin30Min = useMemo(() => {
    if (listings.length === 0) return 0;
    const count = listings.filter((l) => l.commuteHubMin <= 30).length;
    return Math.round((count / listings.length) * 100);
  }, [listings]);

  // Focused hub object if single hub selected
  const activeFocusedHub = useMemo(() => {
    if (focusedHubId === 'all') return null;
    return SWISS_HUBS.find((h) => h.id === focusedHubId) || null;
  }, [focusedHubId]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col h-full shadow-xs transition-colors">
      {/* Map Header with controls */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 bg-slate-50/80 dark:bg-slate-800/60">
        <div className="flex items-center gap-2 min-w-0">
          <Navigation className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
            {t.map.title}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">·</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums whitespace-nowrap">
            {t.map.listingsTracked.replace('{count}', String(listings.length))}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Commute Intensity Heatmap Toggle Button */}
          <button
            onClick={() => setShowCommuteHeatmap(!showCommuteHeatmap)}
            className={`text-xs px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5 transition-all shadow-2xs ${
              showCommuteHeatmap
                ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white ring-2 ring-red-400/40 shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
            title={t.map.heatmapSubtitle}
          >
            <Flame className={`w-3.5 h-3.5 ${showCommuteHeatmap ? 'text-amber-200 animate-pulse' : 'text-red-500'}`} />
            <span>{t.map.heatmapToggle}</span>
            {showCommuteHeatmap && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-0.5" />
            )}
          </button>

          {/* SBB Rail Network Toggle Button */}
          <button
            onClick={() => setShowRailNetwork(!showRailNetwork)}
            className={`text-xs px-2.5 py-1 rounded-md font-medium flex items-center gap-1 transition-colors ${
              showRailNetwork
                ? 'bg-slate-900 dark:bg-slate-700 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
            title="SBB / CFF / FFS"
          >
            <Train className="w-3 h-3 text-red-400" />
            <span className="hidden sm:inline">SBB/CFF/FFS</span>
          </button>

          {/* Reset Active Filter */}
          {(selectedCanton || selectedCity) && (
            <button
              onClick={() => {
                onSelectCanton('');
                onSelectCity('');
              }}
              className="text-xs px-2 py-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md font-medium"
            >
              {t.map.allVaud}
            </button>
          )}
        </div>
      </div>

      {/* Commute Heatmap Sub-Toolbar (Active when Heatmap is toggled) */}
      {showCommuteHeatmap && (
        <div className="px-3 py-2 bg-gradient-to-r from-amber-500/10 via-red-500/10 to-transparent dark:from-amber-950/30 dark:via-red-950/20 dark:to-transparent border-b border-amber-200/50 dark:border-amber-900/40 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Selector: Combined / Heatmap / Isochrones */}
            <div className="inline-flex rounded-lg p-0.5 bg-slate-200/80 dark:bg-slate-800 border border-slate-300/60 dark:border-slate-700 text-[11px] font-medium">
              <button
                onClick={() => setHeatmapMode('combined')}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  heatmapMode === 'combined'
                    ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 font-semibold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {t.map.heatmapModeCombined}
              </button>
              <button
                onClick={() => setHeatmapMode('heat')}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  heatmapMode === 'heat'
                    ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 font-semibold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {t.map.heatmapModeHeat}
              </button>
              <button
                onClick={() => setHeatmapMode('isochrones')}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  heatmapMode === 'isochrones'
                    ? 'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 font-semibold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {t.map.heatmapModeIsochrones}
              </button>
            </div>

            {/* Hub Focus Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {t.map.heatmapFocus}:
              </span>
              <select
                value={focusedHubId}
                onChange={(e) => setFocusedHubId(e.target.value)}
                className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-md text-[11px] px-2 py-0.5 font-medium focus:ring-1 focus:ring-red-500"
              >
                <option value="all">{t.map.heatmapAllHubs}</option>
                {SWISS_HUBS.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.sbbHub})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Opacity quick selector */}
          <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            <span>{t.map.heatmapOpacity}:</span>
            {[0.45, 0.75, 1.0].map((op) => (
              <button
                key={op}
                onClick={() => setHeatmapOpacity(op)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono tabular-nums ${
                  heatmapOpacity === op
                    ? 'bg-red-600 text-white font-bold'
                    : 'bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {Math.round(op * 100)}%
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SVG Canvas Container */}
      <div className="relative flex-1 bg-slate-100 dark:bg-slate-950 min-h-[390px] overflow-hidden select-none transition-colors">
        <svg
          viewBox="0 0 1000 620"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Water Linear Gradient */}
            <linearGradient id="swissLakeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.7" />
            </linearGradient>

            {/* Subtle Cartography Grid */}
            <pattern id="swissGrid" width="35" height="35" patternUnits="userSpaceOnUse">
              <path d="M 35 0 L 0 0 0 35" fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-900" strokeWidth="0.7" />
            </pattern>

            {/* Switzerland Border Clip Path so heat stays strictly within Swiss soil */}
            <clipPath id="swissBoundaryClip">
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
              />
            </clipPath>

            {/* Commute Heat Soft Blur Filter */}
            <filter id="commuteHeatGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
            </filter>

            {/* SBB High Frequency Corridor Glowing Linear Gradient */}
            <linearGradient id="corridorGlowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="30%" stopColor="#f97316" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
            </linearGradient>

            {/* Tier 1 Radial Heat Gradient (Direct SBB Hubs: Zurich, Geneva, Lausanne, Basel, Bern, etc.) */}
            <radialGradient id="hubHeatTier1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.95" />
              <stop offset="25%" stopColor="#f97316" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.5" />
              <stop offset="75%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>

            {/* Tier 2 Radial Heat Gradient (Regional SBB nodes) */}
            <radialGradient id="hubHeatTier2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.85" />
              <stop offset="30%" stopColor="#f59e0b" stopOpacity="0.6" />
              <stop offset="65%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>

            {/* Spotlight Single Hub Radial Gradient (When a specific hub is chosen) */}
            <radialGradient id="singleHubFocusGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="1" />
              <stop offset="18%" stopColor="#ef4444" stopOpacity="0.85" />
              <stop offset="42%" stopColor="#f59e0b" stopOpacity="0.65" />
              <stop offset="70%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="90%" stopColor="#0284c7" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Grid background */}
          <rect width="1000" height="620" fill="url(#swissGrid)" />

          {/* Switzerland Country Boundary Base Fill */}
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
            filter="drop-shadow(0px 3px 6px rgba(0,0,0,0.08))"
          />

          {/* Canton Regions - Stylized Geometries */}
          <g opacity="0.6">
            {/* Romandie / Vaud / Genève */}
            <path
              d="M 120 480 C 100 470, 90 510, 120 520 C 180 500, 230 460, 270 420 C 290 370, 280 320, 330 280 L 370 340 C 330 380, 300 430, 270 450 C 230 470, 180 480, 120 480 Z"
              className="fill-emerald-500/10 dark:fill-emerald-400/10 stroke-slate-300/40 dark:stroke-slate-700/40"
              strokeWidth="1"
            />
            {/* Central Switzerland & Zürich */}
            <path
              d="M 430 160 C 470 140, 520 150, 580 180 C 640 180, 700 170, 750 200 L 730 320 C 680 320, 640 330, 590 350 L 520 300 C 470 250, 440 210, 430 160 Z"
              className="fill-blue-500/10 dark:fill-blue-400/10 stroke-slate-300/40 dark:stroke-slate-700/40"
              strokeWidth="1"
            />
            {/* Bern & Mittelland */}
            <path
              d="M 330 280 L 370 340 C 390 380, 420 420, 450 450 L 520 420 C 510 370, 490 320, 450 250 C 400 240, 350 260, 330 280 Z"
              className="fill-amber-500/10 dark:fill-amber-400/10 stroke-slate-300/40 dark:stroke-slate-700/40"
              strokeWidth="1"
            />
            {/* Eastern Switzerland */}
            <path
              d="M 750 200 C 800 180, 860 210, 900 260 C 920 310, 910 360, 870 410 L 780 410 C 760 360, 740 280, 750 200 Z"
              className="fill-teal-500/10 dark:fill-teal-400/10 stroke-slate-300/40 dark:stroke-slate-700/40"
              strokeWidth="1"
            />
            {/* Valais */}
            <path
              d="M 270 450 C 330 460, 400 480, 470 470 C 510 460, 550 450, 580 460 L 560 530 C 500 540, 440 560, 380 540 C 320 520, 280 480, 270 450 Z"
              className="fill-red-500/10 dark:fill-red-400/10 stroke-slate-300/40 dark:stroke-slate-700/40"
              strokeWidth="1"
            />
            {/* Ticino */}
            <path
              d="M 640 490 C 670 510, 680 550, 710 600 C 680 590, 660 540, 630 520 L 640 490 Z"
              className="fill-indigo-500/15 dark:fill-indigo-400/15 stroke-slate-300/40 dark:stroke-slate-700/40"
              strokeWidth="1"
            />
          </g>

          {/* Subtle Alps Mountain Ridge */}
          <path
            d="M 250 460 Q 420 485 580 455 Q 730 465 870 395"
            fill="none"
            stroke="currentColor"
            className="text-slate-300/70 dark:text-slate-700/70"
            strokeWidth="3.5"
            strokeDasharray="6,4"
          />
          <text x="500" y="495" fontSize="10" className="fill-slate-400 dark:fill-slate-500 font-semibold" letterSpacing="3">
            SCHWEIZER ALPEN · ALPES SUISSES · ALPI
          </text>

          {/* ========================================================= */}
          {/* COMMUTE INTENSITY HEATMAP OVERLAY LAYER                  */}
          {/* ========================================================= */}
          {showCommuteHeatmap && (
            <g clipPath="url(#swissBoundaryClip)" opacity={heatmapOpacity} className="transition-opacity duration-300">
              {/* 1. CONTINUOUS THERMAL GRADIENT SURFACE */}
              {(heatmapMode === 'combined' || heatmapMode === 'heat') && (
                <g filter="url(#commuteHeatGlow)">
                  {/* High Frequency SBB Corridors Heat Ribbon */}
                  {/* West-East Backbone: Geneva - Lausanne - Fribourg - Bern - Olten - Zurich - Winterthur - St. Gallen */}
                  <path
                    d="M 120 484 Q 190 440 260 397 Q 310 365 360 335 Q 390 315 420 298 Q 450 240 480 186 Q 560 180 640 174 Q 680 158 720 143 Q 790 145 860 149"
                    fill="none"
                    stroke="url(#corridorGlowGrad)"
                    strokeWidth="38"
                    strokeLinecap="round"
                    opacity="0.55"
                  />
                  {/* North-South Spine 1: Basel SBB - Olten - Lucerne */}
                  <path
                    d="M 440 99 Q 460 142 480 186 Q 525 232 570 279"
                    fill="none"
                    stroke="url(#corridorGlowGrad)"
                    strokeWidth="32"
                    strokeLinecap="round"
                    opacity="0.5"
                  />
                  {/* North-South Spine 2: Zurich - Zug - Gotthard Base Tunnel - Bellinzona - Lugano */}
                  <path
                    d="M 640 174 Q 630 208 620 242 Q 660 344 700 446 Q 695 483 690 521"
                    fill="none"
                    stroke="url(#corridorGlowGrad)"
                    strokeWidth="30"
                    strokeLinecap="round"
                    opacity="0.45"
                  />
                  {/* Arc Lémanique / Lake Geneva Commuter Belt */}
                  <path
                    d="M 120 484 Q 160 459 260 397 Q 295 410 330 422"
                    fill="none"
                    stroke="url(#corridorGlowGrad)"
                    strokeWidth="28"
                    strokeLinecap="round"
                    opacity="0.5"
                  />

                  {/* Radial Heat Disks for Hubs */}
                  {focusedHubId === 'all' ? (
                    SWISS_HUBS.map((hub) => {
                      const cx = hub.xPercent * 10;
                      const cy = hub.yPercent * 6.2;
                      const r = hub.tier === 1 ? 130 : 90;
                      return (
                        <circle
                          key={`heat-${hub.id}`}
                          cx={cx}
                          cy={cy}
                          r={r}
                          fill={hub.tier === 1 ? 'url(#hubHeatTier1)' : 'url(#hubHeatTier2)'}
                        />
                      );
                    })
                  ) : activeFocusedHub ? (
                    /* Focused Single Hub Intense Halo */
                    <circle
                      cx={activeFocusedHub.xPercent * 10}
                      cy={activeFocusedHub.yPercent * 6.2}
                      r={240}
                      fill="url(#singleHubFocusGrad)"
                    />
                  ) : null}
                </g>
              )}

              {/* 2. ISOCHRONE CONTOUR RINGS (15 min, 30 min, 45 min) */}
              {(heatmapMode === 'combined' || heatmapMode === 'isochrones') && (
                <g className="select-none">
                  {(focusedHubId === 'all'
                    ? SWISS_HUBS.filter((h) => h.tier === 1)
                    : activeFocusedHub
                    ? [activeFocusedHub]
                    : []
                  ).map((hub) => {
                    const cx = hub.xPercent * 10;
                    const cy = hub.yPercent * 6.2;
                    const isFocus = focusedHubId !== 'all';

                    return (
                      <g key={`iso-${hub.id}`}>
                        {/* 15 min Isochrone (Direct Walking / S-Bahn Core) */}
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isFocus ? 50 : 38}
                          fill="rgba(239, 68, 68, 0.08)"
                          stroke="#ef4444"
                          strokeWidth="1.6"
                          strokeDasharray="4,3"
                        />
                        <text
                          x={cx + (isFocus ? 52 : 40)}
                          y={cy - 2}
                          fontSize="8"
                          fill="#ef4444"
                          className="font-bold font-mono"
                        >
                          15m
                        </text>

                        {/* 30 min Isochrone (Fast RegioExpress / Suburban Belt) */}
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isFocus ? 110 : 85}
                          fill="rgba(245, 158, 11, 0.05)"
                          stroke="#f59e0b"
                          strokeWidth="1.3"
                          strokeDasharray="5,4"
                        />
                        <text
                          x={cx + (isFocus ? 112 : 87)}
                          y={cy - 2}
                          fontSize="8"
                          fill="#d97706"
                          className="font-bold font-mono"
                        >
                          30m
                        </text>

                        {/* 45 min Isochrone (InterRegio / Regional Catchment) */}
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isFocus ? 175 : 135}
                          fill="rgba(16, 185, 129, 0.03)"
                          stroke="#10b981"
                          strokeWidth="1.0"
                          strokeDasharray="6,5"
                        />
                        <text
                          x={cx + (isFocus ? 177 : 137)}
                          y={cy - 2}
                          fontSize="8"
                          fill="#059669"
                          className="font-bold font-mono"
                        >
                          45m
                        </text>
                      </g>
                    );
                  })}
                </g>
              )}
            </g>
          )}

          {/* Major Swiss Lakes */}
          {/* 1. Lac Léman */}
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

          {/* 4. Vierwaldstättersee */}
          <path
            d="M 545 315 C 570 320, 595 335, 590 350 C 565 355, 550 330, 545 315 Z"
            fill="url(#swissLakeGrad)"
            stroke="#0284c7"
            strokeWidth="1.3"
          />
          <text x="535" y="352" fontSize="8" fill="#0369a1" className="font-medium select-none">Vierwaldstättersee</text>

          {/* 5. Bodensee */}
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

          {/* SBB Railway Arteries (Taktfahrplan Lines) */}
          {showRailNetwork && (
            <g opacity="0.9">
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

        {/* Interactive Railway Hub Markers */}
        {SWISS_HUBS.map((hub) => {
          const count = cityCounts[hub.name] || 0;
          const isSelected = selectedCity === hub.name || selectedCanton === hub.canton;
          const isFocusedInHeatmap = focusedHubId === hub.id;

          return (
            <div
              key={hub.id}
              style={{
                left: `${hub.xPercent}%`,
                top: `${hub.yPercent}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-10 group"
              onMouseEnter={() => setHoveredHub(hub)}
              onMouseLeave={() => setHoveredHub(null)}
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
                    ? 'bg-red-600 text-white scale-110 ring-2 ring-red-400 z-20'
                    : isFocusedInHeatmap
                    ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white ring-2 ring-amber-400 scale-105 z-20'
                    : count > 0
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 hover:border-red-500 hover:shadow-lg'
                    : 'bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 opacity-90'
                }`}
              >
                {/* Canton Flag */}
                <CantonFlag canton={hub.canton} size="sm" />
                <span className="truncate max-w-[85px]">{hub.name}</span>

                {/* Listing Count Pill */}
                {count > 0 && (
                  <span
                    className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono tabular-nums ${
                      isSelected || isFocusedInHeatmap
                        ? 'bg-black/30 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {count}
                  </span>
                )}

                {/* Commute Intensity Flame Badge if Heatmap is on */}
                {showCommuteHeatmap && hub.tier === 1 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" title="SBB Tier-1 Transit Hub" />
                )}
              </button>

              {/* Rich Commute Tooltip on Hover */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:flex flex-col items-center z-30 pointer-events-none">
                <div className="bg-slate-900/95 dark:bg-slate-950/95 text-white text-[11px] rounded-xl p-2.5 shadow-2xl whitespace-nowrap border border-slate-700 backdrop-blur-xs min-w-[210px]">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-1.5">
                    <div className="font-bold flex items-center gap-1.5">
                      <CantonFlag canton={hub.canton} size="sm" />
                      <span>{hub.name}</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold flex items-center gap-1">
                      <Flame className="w-2.5 h-2.5 text-amber-400" />
                      {hub.proximityScore}/100
                    </span>
                  </div>

                  <div className="space-y-1 text-slate-300 text-[10px]">
                    <div className="flex items-center gap-1 text-slate-200 font-medium">
                      <Train className="w-3 h-3 text-red-400 shrink-0" />
                      <span className="truncate">{hub.sbbHub}</span>
                      <span className="text-slate-400">· {hub.frequency}</span>
                    </div>

                    {/* Direct Connections / Travel Times */}
                    <div className="pt-1 border-t border-slate-800/80 space-y-0.5 text-slate-400">
                      <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                        {t.map.cffTimes}:
                      </div>
                      {hub.connections.slice(0, 3).map((conn) => (
                        <div key={conn.dest} className="flex items-center justify-between text-[10px]">
                          <span>→ {conn.dest}</span>
                          <span className="font-mono text-amber-300">{conn.min} min</span>
                        </div>
                      ))}
                    </div>

                    {count > 0 && (
                      <div className="pt-1 text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>{count} alloggi in questa zona</span>
                      </div>
                    )}
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
            <div className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl flex items-center gap-1.5 border border-white whitespace-nowrap animate-bounce">
              <CantonFlag canton={selectedListing.canton} size="sm" />
              <span>CHF {selectedListing.rentTotalCHF} cc</span>
            </div>
            <div className="w-3 h-3 bg-red-600 rotate-45 mx-auto -mt-1.5 border-r border-b border-white" />
          </div>
        )}
      </div>

      {/* Map Footer: Commute Heatmap & Mobility Legend */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400 transition-colors">
        {/* Commute Heatmap Gradient Legend Ramp */}
        {showCommuteHeatmap ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 w-full sm:w-auto">
            <div className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
              <Flame className="w-3.5 h-3.5 text-red-500" />
              <span>{t.map.heatmapToggle}:</span>
            </div>

            {/* Isochrone / Proximity Color Ramp */}
            <div className="flex items-center gap-3 text-[11px] flex-wrap">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-red-300/40" />
                <span>{t.map.isochroneUnder15}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>{t.map.isochrone15to30}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>{t.map.isochrone30to45}</span>
              </div>
            </div>
          </div>
        ) : (
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
        )}

        {/* Real-time High Frequency Commute Coverage Stat */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          {showCommuteHeatmap && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 font-mono font-semibold">
              {t.map.listingsInHeatZone.replace('{percent}', String(percentWithin30Min))}
            </span>
          )}
          <span className="hidden md:inline text-slate-400 dark:text-slate-500">
            {t.map.footerHint}
          </span>
        </div>
      </div>
    </div>
  );
};
