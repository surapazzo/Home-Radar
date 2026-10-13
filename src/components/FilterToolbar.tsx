import React, { useMemo, useState } from 'react';
import { FilterState, Language, SwissCanton, Listing } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import {
  SWISS_CANTONS,
  getCitiesForCanton,
  SWISS_MARKET_TOTALS,
  SWISS_CANTON_MARKET_STATS,
} from '../data/swissGeography';
import { CantonFlag } from './CantonFlag';
import {
  Search,
  RotateCcw,
  Train,
  X,
  Globe2,
  Sparkles,
  Layers,
  HelpCircle,
  Info,
  Building2,
  CheckCircle2,
} from 'lucide-react';

interface FilterToolbarProps {
  lang: Language;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalListingsCount: number;
  filteredCount: number;
  listings?: Listing[];
  onReset: () => void;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  lang,
  filters,
  setFilters,
  totalListingsCount,
  filteredCount,
  listings,
  onReset,
}) => {
  const t = TRANSLATIONS[lang];
  const [showExplainModal, setShowExplainModal] = useState(false);

  // Dynamically filter cities based on the selected canton
  const availableCities = useMemo(() => {
    return getCitiesForCanton(filters.selectedCanton);
  }, [filters.selectedCanton]);

  // Count of listings per canton
  const listingsPerCanton = useMemo(() => {
    const map: Record<string, number> = {};
    if (listings) {
      listings.forEach((item) => {
        map[item.canton] = (map[item.canton] || 0) + 1;
      });
    }
    return map;
  }, [listings]);

  const handleCantonChange = (canton: string) => {
    setFilters((prev) => {
      // If the currently selected city is not in the new canton, reset it
      const newCities = getCitiesForCanton(canton);
      const shouldResetCity = prev.selectedCity && !newCities.includes(prev.selectedCity);

      return {
        ...prev,
        selectedCanton: canton,
        selectedCity: shouldResetCity ? '' : prev.selectedCity,
      };
    });
  };

  return (
    <div
      role="search"
      aria-label="Filter Swiss Listings"
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs mb-5 transition-colors"
    >
      {/* Search Input, Canton, City, Price and Sort Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-3.5">
        {/* Text Search */}
        <div className="sm:col-span-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            aria-label={t.filters.searchPlaceholder}
            placeholder={t.filters.searchPlaceholder}
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>

        {/* Canton Selector with Canton Flag visual */}
        <div className="sm:col-span-2 relative flex items-center">
          <select
            value={filters.selectedCanton}
            onChange={(e) => handleCantonChange(e.target.value)}
            aria-label={t.filters.allCantons}
            className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
          >
            <option value="">{t.filters.allCantons}</option>
            {SWISS_CANTONS.map((canton) => (
              <option key={canton} value={canton}>
                {canton}
              </option>
            ))}
          </select>
        </div>

        {/* City Selector: Dynamically filtered by Canton */}
        <div className="sm:col-span-2">
          <select
            value={filters.selectedCity}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                selectedCity: e.target.value,
              }))
            }
            aria-label={t.filters.allCommunes}
            className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
          >
            <option value="">
              {filters.selectedCanton
                ? `${t.filters.allCommunes} (${filters.selectedCanton})`
                : t.filters.allCommunes}
            </option>
            {availableCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Max Rent CHF */}
        <div className="sm:col-span-2">
          <select
            value={filters.maxRentTotalCHF}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, maxRentTotalCHF: Number(e.target.value) }))
            }
            aria-label="Max Rent CHF"
            className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
          >
            <option value={1500}>Max CHF 1'500</option>
            <option value={2000}>Max CHF 2'000</option>
            <option value={2500}>Max CHF 2'500</option>
            <option value={3000}>Max CHF 3'000</option>
            <option value={4000}>Max CHF 4'000</option>
            <option value={99999}>{t.filters.anyPrice}</option>
          </select>
        </div>

        {/* Sort Selector */}
        <div className="sm:col-span-2">
          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                sortBy: e.target.value as FilterState['sortBy'],
              }))
            }
            aria-label="Sort listings"
            className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
          >
            <option value="newest">{t.filters.sortNewest}</option>
            <option value="price_asc">{t.filters.sortPriceAsc}</option>
            <option value="price_desc">{t.filters.sortPriceDesc}</option>
            <option value="rooms_desc">{t.filters.sortRoomsDesc}</option>
            <option value="commute_asc">{t.filters.sortCommuteAsc}</option>
          </select>
        </div>
      </div>

      {/* 26 Cantons Quick Bar & No-Prefilter Status */}
      <div className="mb-3.5 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-1.5 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
            <Layers className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            <span>Cantoni della Svizzera (26)</span>
          </div>
          <span className="text-slate-400 dark:text-slate-500 font-mono text-[10px]">
            {filters.selectedCanton ? `Filtro: ${filters.selectedCanton}` : 'Nessun pre-filtro attivo (26 Cantoni caricati)'}
          </span>
        </div>

        {/* Status Banner */}
        {!filters.selectedCanton ? (
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1.5 rounded-lg border border-emerald-200/60 dark:border-emerald-900/40 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              <strong>Tutti gli annunci caricati ({totalListingsCount} annunci pronti):</strong> Nessun pre-filtro attivo. Tutti i 26 cantoni elvetici sono disponibili. Clicca su un cantone o cerca liberamente.
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-1.5 text-[11px] text-red-800 dark:text-red-300 bg-red-50 dark:bg-red-950/40 px-2.5 py-1.5 rounded-lg border border-red-200/60 dark:border-red-900/40 mb-2">
            <div className="flex items-center gap-1.5">
              <CantonFlag canton={filters.selectedCanton} size="sm" />
              <span>
                Filtro applicato su <strong>Canton {filters.selectedCanton}</strong>: {filteredCount} alloggi disponibili.
              </span>
            </div>
            <button
              onClick={() => handleCantonChange('')}
              className="text-xs font-semibold underline text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-200 cursor-pointer"
            >
              Mostra tutti i 26 cantoni ({totalListingsCount})
            </button>
          </div>
        )}

        {/* Scrollable Cantons Strip */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => handleCantonChange('')}
            className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              !filters.selectedCanton
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <span>🇨🇭 Tutti (26)</span>
            <span className="font-mono text-[10px] opacity-80">({totalListingsCount})</span>
          </button>

          {SWISS_CANTONS.map((canton) => {
            const count = listingsPerCanton[canton] || 0;
            const isSelected = filters.selectedCanton === canton;
            return (
              <button
                key={canton}
                onClick={() => handleCantonChange(isSelected ? '' : canton)}
                className={`shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-red-600 text-white font-bold shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                title={`Kanton ${canton}: ${count} annunci caricati`}
              >
                <CantonFlag canton={canton} size="sm" />
                <span>{canton}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] font-mono px-1 rounded-full ${
                      isSelected ? 'bg-black/30 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Canton Flag Chip (if selected) */}
      {filters.selectedCanton && (
        <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-100 dark:border-slate-800">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <CantonFlag canton={filters.selectedCanton} size="sm" />
            <span>Kanton {filters.selectedCanton}</span>
            <button
              onClick={() => handleCantonChange('')}
              className="ml-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              aria-label={`Remove filter for ${filters.selectedCanton}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {filters.selectedCity && (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
              <span>{filters.selectedCity}</span>
              <button
                onClick={() => setFilters((p) => ({ ...p, selectedCity: '' }))}
                className="ml-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                aria-label={`Remove filter for ${filters.selectedCity}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Second Row: Segmented Filters, Rooms, Reprise / Nachmieter, Source */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Source Filter Segmented Control */}
          <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setFilters((p) => ({ ...p, sourceFilter: 'all' }))}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filters.sourceFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.filters.allSources}
            </button>
            <button
              onClick={() => setFilters((p) => ({ ...p, sourceFilter: 'portals' }))}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filters.sourceFilter === 'portals'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.filters.portalsOnly}
            </button>
            <button
              onClick={() => setFilters((p) => ({ ...p, sourceFilter: 'facebook' }))}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filters.sourceFilter === 'facebook'
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-400 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.filters.facebookOnly}
            </button>
          </div>

          {/* Rooms filter buttons */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 dark:text-slate-500 mr-1 text-[11px]">{t.filters.roomsLabel}</span>
            {[1.5, 2.5, 3.5, 4.5].map((r) => {
              const isSelected = filters.minRooms === r;
              return (
                <button
                  key={r}
                  onClick={() =>
                    setFilters((p) => ({
                      ...p,
                      minRooms: isSelected ? 0 : r,
                    }))
                  }
                  className={`px-2 py-1 rounded-md text-xs font-mono font-medium border transition-colors ${
                    isSelected
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {r}+
                </button>
              );
            })}
          </div>

          {/* Reprise / Nachmieter Toggle Button */}
          <button
            onClick={() => setFilters((p) => ({ ...p, repriseOnly: !p.repriseOnly }))}
            className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
              filters.repriseOnly
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-700 font-semibold'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {t.filters.repriseOnly}
          </button>

          {/* Commute to closest SBB hub */}
          <button
            onClick={() =>
              setFilters((p) => ({
                ...p,
                maxCommuteMin: p.maxCommuteMin === 10 ? 999 : 10,
              }))
            }
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
              filters.maxCommuteMin === 10
                ? 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-300 dark:border-red-800 font-semibold'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <Train className="w-3 h-3 text-red-600 dark:text-red-400" />
            {t.filters.commuteHub}
          </button>
        </div>

        {/* Counter & Reset */}
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-mono tabular-nums">
            {t.filters.foundCount
              .replace('{count}', String(filteredCount))
              .replace('{total}', String(totalListingsCount))}
          </span>

          <button
            onClick={onReset}
            className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t.filters.reset}</span>
          </button>
        </div>
      </div>

      {/* Realistic Market Intelligence Strip */}
      <div className="pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <Globe2 className="w-3.5 h-3.5 text-blue-500" />
            <span>Indice Macro Svizzero:</span>
          </span>
          <span className="font-mono text-slate-600 dark:text-slate-300">
            <strong>{SWISS_MARKET_TOTALS.nationalActiveAnnounces.toLocaleString()}</strong> offerte stimate a livello nazionale ({SWISS_MARKET_TOTALS.homegateTotal.toLocaleString()} Homegate · {SWISS_MARKET_TOTALS.immoscoutTotal.toLocaleString()} ImmoScout24)
          </span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Database Locale: <strong>{totalListingsCount} alloggi pronti</strong> (26 Cantoni)</span>
          </span>
          <button
            type="button"
            onClick={() => setShowExplainModal(true)}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200/60 dark:border-blue-800 text-[10px] font-bold cursor-pointer transition-colors shadow-2xs"
            title="Spiegazione: Differenza tra i 48'389 annunci dell'indice federale e i 61 alloggi verificati in app"
          >
            <HelpCircle className="w-3 h-3" />
            <span>Perché 61 su 48K?</span>
          </button>
        </div>

        {filters.selectedCanton && SWISS_CANTON_MARKET_STATS[filters.selectedCanton as SwissCanton] && (
          <div className="inline-flex items-center gap-1.5 font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded">
            <CantonFlag canton={filters.selectedCanton} size="sm" />
            <span>
              {filters.selectedCanton}: {SWISS_CANTON_MARKET_STATS[filters.selectedCanton as SwissCanton].activeAnnounces.toLocaleString()} annunci nel bacino cantonale · Media CHF {SWISS_CANTON_MARKET_STATS[filters.selectedCanton as SwissCanton].avgRentCHF}.-
            </span>
          </div>
        )}
      </div>

      {/* Explanatory Modal: Perché 61 annunci su 48K */}
      {showExplainModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative space-y-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="explain-modal-title"
          >
            <button
              onClick={() => setShowExplainModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Chiudi finestra"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 id="explain-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                  Perché vedi 61 annunci se il mercato svizzero ne conta 48'389?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Chiarimento sulla struttura dati tra Indice Macro e Dataset Applicativo
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Globe2 className="w-4 h-4 text-blue-500" />
                    1. Indice Macro-Economico Svizzero (~48'389 annunci)
                  </span>
                  <span className="font-mono text-[10px] bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded">
                    Benchmark Web
                  </span>
                </div>
                <p className="leading-relaxed">
                  È il <strong>volume statistico reale aggregato</strong> dai portali federali Homegate (~23'284) e ImmoScout24 (~25'105). Serve per calcolare con precisione i benchmark di mercato: tasso di sfitti (1.08%), pigioni medie per cantone e disponibilità nei singoli distretti svizzeri.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    2. Dataset Locale Verificato (61 alloggi interattivi)
                  </span>
                  <span className="font-mono text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                    26 Cantoni Pronti
                  </span>
                </div>
                <p className="leading-relaxed text-emerald-800 dark:text-emerald-200/90">
                  È il <strong>catalogo ad altissima fedeltà caricato nel browser</strong>: ogni annuncio include foto in alta risoluzione, coordinate GPS precise, calcolo dei tempi SBB/CFF verso i nodi ferroviari, contatti per subentro immediato (Nachmieter) e calcolo automatico del rapporto solvibilità (limite 33%).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60">
                <span className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  3. Come aggiungere ulteriori annunci al catalogo
                </span>
                <p className="leading-relaxed text-amber-800 dark:text-amber-200/90">
                  Puoi importare qualunque annuncio reale trovato su Facebook, Anibis, Homegate o gruppi Telegram cliccando su <strong>"Importa Annuncio"</strong> o scansionando una scheda immobile con la fotocamera.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowExplainModal(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Ho capito, grazie
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
