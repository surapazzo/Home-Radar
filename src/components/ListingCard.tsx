import React from 'react';
import { Listing, DossierState, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { CantonFlag } from './CantonFlag';
import { Train, ExternalLink, Bookmark, CheckCircle2, AlertTriangle, ArrowUpRight, Home } from 'lucide-react';

interface ListingCardProps {
  lang: Language;
  listing: Listing;
  isSelected: boolean;
  onSelect: (listing: Listing) => void;
  dossier: DossierState;
  onToggleSave: (id: string) => void;
  isSaved?: boolean;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  lang,
  listing,
  isSelected,
  onSelect,
  dossier,
  onToggleSave,
  isSaved,
}) => {
  const t = TRANSLATIONS[lang];

  // Calculate Swiss solvency ratio (Rule of 33% / 3x)
  const monthlySalary = dossier.monthlyNetSalaryCHF || 6800;
  const maxRentRecommended = Math.round(monthlySalary * 0.33);
  const isSolvent = listing.rentTotalCHF <= maxRentRecommended;
  const rentRatioPercent = Math.round((listing.rentTotalCHF / monthlySalary) * 100);

  const formatCHF = (val: number) => {
    return new Intl.NumberFormat('fr-CH').format(val);
  };

  const getSourceLabel = () => {
    switch (listing.source) {
      case 'facebook_group':
        return listing.facebookGroupInfo?.groupName || 'Facebook Group';
      case 'immoscout24':
        return 'ImmoScout24.ch';
      case 'homegate':
        return 'Homegate.ch';
      case 'flatfox':
        return 'Flatfox.ch';
      case 'anibis':
        return 'Anibis.ch';
      case 'comparis':
        return 'Comparis.ch';
      default:
        return 'Swiss Portal';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(listing);
    }
  };

  return (
    <article
      tabIndex={0}
      role="button"
      aria-label={`${listing.title}, ${listing.city}, CHF ${listing.rentTotalCHF}`}
      onKeyDown={handleKeyDown}
      onClick={() => onSelect(listing)}
      className={`group relative bg-white dark:bg-slate-900 border rounded-xl p-4 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
        isSelected
          ? 'border-red-500 shadow-md ring-1 ring-red-500'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs'
      }`}
    >
      {/* Top Source, Canton Flag, and Actions */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2 text-xs flex-wrap">
          {/* Canton Flag & Name Badge */}
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-[11px] font-semibold text-slate-800 dark:text-slate-200">
            <CantonFlag canton={listing.canton} size="sm" />
            <span>{listing.canton}</span>
          </div>

          {/* Source Badge */}
          {listing.source === 'facebook_group' ? (
            <span className="font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded text-[11px]">
              Facebook Reprise
            </span>
          ) : (
            <span className="font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px]">
              {getSourceLabel()}
            </span>
          )}

          {listing.isRepriseDeBail && (
            <span className="font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded text-[11px]">
              {t.card.repriseBadge}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onToggleSave(listing.id)}
            className={`p-1.5 rounded-md transition-colors ${
              isSaved
                ? 'text-red-600 bg-red-50 dark:bg-red-950/50'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            aria-label={isSaved ? t.card.removeSave : t.card.saveListing}
            title={isSaved ? t.card.removeSave : t.card.saveListing}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-red-600' : ''}`} />
          </button>

          <a
            href={listing.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            aria-label={`${t.card.openOriginal} for ${listing.title}`}
            title={t.card.openOriginal}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
        {/* Visual Canton Heraldic Thumbnail */}
        <div className="sm:col-span-4 h-32 rounded-lg overflow-hidden bg-slate-900 relative flex flex-col justify-between p-3 select-none text-white border border-slate-200/40 dark:border-slate-800 shadow-2xs">
          {/* Background pattern & Canton coat of arms highlight */}
          <div className="absolute inset-0 bg-slate-900 opacity-95" />
          <div className="absolute right-2 top-2 opacity-25 scale-150 pointer-events-none">
            <CantonFlag canton={listing.canton} size="xl" />
          </div>

          <div className="relative z-10 flex items-center justify-between text-xs font-semibold">
            <span className="bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded font-mono tabular-nums">
              {listing.rooms} pces
            </span>
            <span className="bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded font-mono tabular-nums">
              {listing.surfaceM2} m²
            </span>
          </div>

          <div className="relative z-10 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-200">
                <CantonFlag canton={listing.canton} size="sm" />
                <span>{listing.city} ({listing.canton})</span>
              </div>
              <div className="text-[10px] text-slate-400">{listing.district}</div>
            </div>
            <Home className="w-5 h-5 text-slate-500 opacity-60" />
          </div>
        </div>

        {/* Details & Price Breakdown */}
        <div className="sm:col-span-8 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2 leading-snug mb-1">
              {listing.title}
            </h3>

            {/* Unboxed Metadata with Typographic Separators */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span className="font-semibold text-slate-800 dark:text-slate-200">{listing.city}</span>
              <span aria-hidden="true">·</span>
              <span>{listing.address}</span>
              <span aria-hidden="true">·</span>
              <span>Disp. {listing.availableDate}</span>
            </div>

            {/* Commute and Solvency Indicators */}
            <div className="flex flex-wrap items-center gap-3 text-xs mb-2">
              <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-mono tabular-nums">
                <Train className="w-3.5 h-3.5 text-red-600 dark:text-red-400 shrink-0" />
                <span>
                  {t.card.cffCommute
                    .replace('{min}', String(listing.commuteHubMin))
                    .replace('{hub}', listing.commuteHubName)}
                </span>
              </div>

              <div
                className={`flex items-center gap-1 font-medium ${
                  isSolvent
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-amber-700 dark:text-amber-400'
                }`}
                title={t.card.solvencyTooltip.replace('{ratio}', String(rentRatioPercent))}
              >
                {isSolvent ? (
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                )}
                <span className="tabular-nums font-mono">
                  {rentRatioPercent}% ({isSolvent ? t.card.solvencyGood : t.card.solvencyLimit})
                </span>
              </div>
            </div>
          </div>

          {/* Price Footnote */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums tracking-tight">
                CHF {formatCHF(listing.rentTotalCHF)}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.card.monthCc}</span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono tabular-nums hidden md:inline">
                {t.card.netAndCharges
                  .replace('{net}', formatCHF(listing.rentNetCHF))
                  .replace('{charges}', formatCHF(listing.chargesCHF))}
              </span>
            </div>

            <div className="flex items-center text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
              <span>{t.card.details}</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
