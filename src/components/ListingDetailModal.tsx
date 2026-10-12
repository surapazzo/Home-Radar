import React, { useState, useEffect } from 'react';
import { Listing, DossierState, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { CantonFlag } from './CantonFlag';
import { X, ExternalLink, Train, Bookmark, Share2, CheckCircle2, AlertTriangle, MapPin, FileCheck, Check } from 'lucide-react';

interface ListingDetailModalProps {
  lang: Language;
  listing: Listing | null;
  onClose: () => void;
  dossier: DossierState;
  onOpenDossier: () => void;
  isSaved?: boolean;
  onToggleSave: (id: string) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  lang,
  listing,
  onClose,
  dossier,
  onOpenDossier,
  isSaved,
  onToggleSave,
}) => {
  const t = TRANSLATIONS[lang];
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!listing) return null;

  const formatCHF = (val: number) => {
    return new Intl.NumberFormat('fr-CH').format(val);
  };

  const monthlySalary = dossier.monthlyNetSalaryCHF || 6800;
  const maxRentRecommended = Math.round(monthlySalary * 0.33);
  const isSolvent = listing.rentTotalCHF <= maxRentRecommended;
  const rentRatioPercent = Math.round((listing.rentTotalCHF / monthlySalary) * 100);

  const handleShare = () => {
    navigator.clipboard.writeText(`${listing.title} - CHF ${listing.rentTotalCHF} cc in ${listing.city} (${listing.canton}): ${listing.sourceUrl}`);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-listing-title"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero Visual Area with Canton Crest & Badges */}
        <div className="bg-slate-950 relative p-6 flex flex-col justify-between text-white select-none overflow-hidden border-b border-slate-800 min-h-[190px]">
          {/* Authentic Canton Flag Watermark */}
          <div className="absolute right-4 -bottom-6 opacity-20 pointer-events-none transform scale-150">
            <CantonFlag canton={listing.canton} size="xl" />
          </div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-slate-800/90 border border-slate-700 text-xs px-2.5 py-1 rounded font-medium text-slate-200">
                {listing.sourceName}
              </span>
              <div className="inline-flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 text-xs px-2.5 py-1 rounded font-bold text-white">
                <CantonFlag canton={listing.canton} size="sm" />
                <span>Kanton {listing.canton}</span>
              </div>
              {listing.isRepriseDeBail && (
                <span className="bg-amber-500 text-slate-950 text-xs px-2.5 py-1 rounded font-bold">
                  {t.detailModal.repriseTitle}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleSave(listing.id)}
                className="p-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors text-white"
                aria-label="Bookmark this property"
                title="Bookmark"
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors text-white"
                aria-label="Share property link"
                title="Share"
              >
                {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>

              <button
                onClick={onClose}
                className="p-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors text-white"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative z-10 mt-4">
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
              <span>{listing.city} ({listing.postalCode})</span>
              <span>·</span>
              <span>Kanton {listing.canton}</span>
              <span>·</span>
              <span>{listing.district}</span>
            </div>
            <h2 id="modal-listing-title" className="text-lg sm:text-xl font-bold tracking-tight mt-1 line-clamp-2 text-white">
              {listing.title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Rent & Solvency Key Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{t.detailModal.grossRent}</div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                CHF {formatCHF(listing.rentTotalCHF)}.-
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                {formatCHF(listing.rentNetCHF)} net + {formatCHF(listing.chargesCHF)} ch.
              </div>
            </div>

            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{t.detailModal.roomsAndSurface}</div>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                {listing.rooms} pces · {listing.surfaceM2} m²
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500">{listing.floor}</div>
            </div>

            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{t.detailModal.solvencyIndex}</div>
              <div
                className={`text-base font-bold flex items-center gap-1 font-mono tabular-nums ${
                  isSolvent ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
                }`}
              >
                {isSolvent ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                <span>{rentRatioPercent}%</span>
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500">
                {isSolvent ? t.detailModal.solvencyOk : t.detailModal.solvencyWarn}
              </div>
            </div>
          </div>

          {/* Location & Commute */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
              {t.detailModal.locationTitle}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                <MapPin className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{listing.address}</div>
                  <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <CantonFlag canton={listing.canton} size="sm" />
                    <span>{listing.postalCode} {listing.city} (Kanton {listing.canton})</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono">
                <Train className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {listing.commuteHubMin} min per {listing.commuteHubName}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Collegamento SBB/CFF/FFS Diretto
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
              {t.detailModal.featuresTitle}
            </h3>
            <div className="flex flex-wrap gap-2 text-xs">
              {listing.features.map((feat, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md font-medium border border-slate-200 dark:border-slate-700"
                >
                  {feat}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
              {t.detailModal.descTitle}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              {listing.description}
            </p>
          </div>

          {/* Contact & Régie */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{t.detailModal.contactTitle}</div>
              <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{listing.contactInfo}</div>
              {listing.regieName && (
                <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                  {t.detailModal.refRegie} {listing.regieName}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={onOpenDossier}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs"
              >
                <FileCheck className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                {t.detailModal.prepareLetterBtn}
              </button>

              <a
                href={listing.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-2xs"
              >
                <span>{t.detailModal.openOriginalBtn}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
