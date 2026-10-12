import React from 'react';
import { FilterState, Language, SearchHistoryItem, SwissCanton } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { CantonFlag } from './CantonFlag';
import {
  Clock,
  Trash2,
  X,
  Search,
  ArrowRight,
  Sparkles,
  MapPin,
  Check,
  Building,
} from 'lucide-react';

interface SearchHistoryProps {
  lang: Language;
  history: SearchHistoryItem[];
  activeFilters: FilterState;
  onSelectHistory: (item: SearchHistoryItem) => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onQuickPreset?: (filters: Partial<FilterState>) => void;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({
  lang,
  history,
  activeFilters,
  onSelectHistory,
  onRemoveItem,
  onClearAll,
  onQuickPreset,
}) => {
  const t = TRANSLATIONS[lang];

  const formatCHF = (val: number) => {
    return new Intl.NumberFormat('fr-CH').format(val);
  };

  const isItemActive = (itemFilters: FilterState): boolean => {
    return (
      itemFilters.selectedCanton === activeFilters.selectedCanton &&
      itemFilters.selectedCity === activeFilters.selectedCity &&
      itemFilters.maxRentTotalCHF === activeFilters.maxRentTotalCHF &&
      itemFilters.minRooms === activeFilters.minRooms &&
      itemFilters.maxRooms === activeFilters.maxRooms &&
      itemFilters.repriseOnly === activeFilters.repriseOnly &&
      itemFilters.maxCommuteMin === activeFilters.maxCommuteMin &&
      itemFilters.searchQuery === activeFilters.searchQuery
    );
  };

  // Quick preset suggestions if history is low or empty
  const presets: {
    label: string;
    canton: SwissCanton;
    city?: string;
    filters: Partial<FilterState>;
  }[] = [
    {
      label: 'Gland (VD) · La Côte CFF',
      canton: 'Vaud',
      city: 'Gland',
      filters: { selectedCanton: 'Vaud', selectedCity: 'Gland', maxRentTotalCHF: 2400 },
    },
    {
      label: 'Zürich · SBB < 15 min',
      canton: 'Zürich',
      filters: { selectedCanton: 'Zürich', selectedCity: '', maxCommuteMin: 15, maxRentTotalCHF: 3200 },
    },
    {
      label: 'Lausanne · Reprises de bail',
      canton: 'Vaud',
      city: 'Lausanne',
      filters: { selectedCanton: 'Vaud', selectedCity: 'Lausanne', repriseOnly: true },
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs transition-colors mb-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span>{t.searchHistory.title}</span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {history.length}/5
                </span>
              </h2>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none mt-0.5">
              {t.searchHistory.subtitle}
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 px-2 py-0.5 rounded transition-colors"
            title={t.searchHistory.clearAll}
          >
            <Trash2 className="w-3 h-3" />
            <span className="hidden sm:inline">{t.searchHistory.clearAll}</span>
          </button>
        )}
      </div>

      {/* History Items or Empty State */}
      {history.length === 0 ? (
        <div className="py-2.5 px-3 bg-slate-50/70 dark:bg-slate-800/40 rounded-lg border border-dashed border-slate-200 dark:border-slate-700/80">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
            {t.searchHistory.noHistory}
          </p>
          {onQuickPreset && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Preset:
              </span>
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => onQuickPreset(p.filters)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-300 transition-colors shadow-2xs"
                >
                  <CantonFlag canton={p.canton} size="sm" />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
          {history.map((item) => {
            const active = isItemActive(item.filters);
            const { filters } = item;

            // Parameter summary tags
            const tags: string[] = [];
            if (filters.maxRentTotalCHF && filters.maxRentTotalCHF < 90000) {
              tags.push(`≤ CHF ${formatCHF(filters.maxRentTotalCHF)}`);
            }
            if (filters.minRooms > 0 || (filters.maxRooms && filters.maxRooms < 6)) {
              tags.push(`${filters.minRooms || 1}-${filters.maxRooms} loc.`);
            }
            if (filters.repriseOnly) {
              tags.push('Subentro');
            }
            if (filters.maxCommuteMin && filters.maxCommuteMin < 100) {
              tags.push(`< ${filters.maxCommuteMin}m SBB`);
            }
            if (filters.petsAllowed) {
              tags.push('Animali');
            }
            if (filters.balconyOnly) {
              tags.push('Balcone');
            }

            return (
              <div
                key={item.id}
                className={`group relative shrink-0 flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg border transition-all cursor-pointer select-none text-left min-w-[200px] max-w-[260px] ${
                  active
                    ? 'bg-red-50/70 dark:bg-red-950/40 border-red-300 dark:border-red-800/80 shadow-xs ring-1 ring-red-400/40'
                    : 'bg-slate-50/80 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
                onClick={() => onSelectHistory(item)}
                title={t.searchHistory.restoreTooltip}
              >
                <div className="min-w-0 flex-1 space-y-1">
                  {/* Top line: Flag & Location */}
                  <div className="flex items-center gap-1.5">
                    {filters.selectedCanton ? (
                      <CantonFlag canton={filters.selectedCanton as SwissCanton} size="sm" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {filters.selectedCity
                        ? `${filters.selectedCity} (${filters.selectedCanton || 'CH'})`
                        : filters.selectedCanton
                        ? `Canton ${filters.selectedCanton}`
                        : filters.searchQuery
                        ? `"${filters.searchQuery}"`
                        : t.searchHistory.allSwitzerland}
                    </span>
                    {active && (
                      <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.2 rounded bg-red-600 text-white leading-tight">
                        {t.searchHistory.activeSearch}
                      </span>
                    )}
                  </div>

                  {/* Parameter chips */}
                  <div className="flex flex-wrap items-center gap-1">
                    {tags.length > 0 ? (
                      tags.slice(0, 3).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] px-1.5 py-0.2 rounded bg-white dark:bg-slate-700/80 border border-slate-200/60 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-mono"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {t.searchHistory.applied}
                      </span>
                    )}
                    {typeof item.resultCount === 'number' && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({item.resultCount})
                      </span>
                    )}
                  </div>
                </div>

                {/* Remove item button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveItem(item.id);
                  }}
                  className="opacity-60 hover:opacity-100 p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors"
                  title={t.searchHistory.removeItem}
                  aria-label={t.searchHistory.removeItem}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
