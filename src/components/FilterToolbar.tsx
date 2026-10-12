import React, { useMemo } from 'react';
import { FilterState, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { SWISS_CANTONS, getCitiesForCanton } from '../data/swissGeography';
import { CantonFlag } from './CantonFlag';
import { Search, RotateCcw, Train, X } from 'lucide-react';

interface FilterToolbarProps {
  lang: Language;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalListingsCount: number;
  filteredCount: number;
  onReset: () => void;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  lang,
  filters,
  setFilters,
  totalListingsCount,
  filteredCount,
  onReset,
}) => {
  const t = TRANSLATIONS[lang];

  // Dynamically filter cities based on the selected canton
  const availableCities = useMemo(() => {
    return getCitiesForCanton(filters.selectedCanton);
  }, [filters.selectedCanton]);

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
    </div>
  );
};
