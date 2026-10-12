import React from 'react';
import { SwissCanton } from '../types';

interface CantonFlagProps {
  canton: SwissCanton | string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
}

export const CantonFlag: React.FC<CantonFlagProps> = ({
  canton,
  className = '',
  size = 'md',
  showLabel = false,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
    xl: 'w-10 h-10',
  }[size];

  const renderFlagSvg = () => {
    switch (canton) {
      case 'Zürich':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full rounded-sm overflow-hidden shadow-xs border border-slate-300/60">
            <rect width="32" height="32" fill="#0284c7" />
            <polygon points="0,0 32,0 0,32" fill="#ffffff" />
          </svg>
        );

      case 'Bern':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full rounded-sm overflow-hidden shadow-xs border border-slate-300/60">
            <rect width="32" height="32" fill="#dc2626" />
            <polygon points="0,32 32,0 32,7 7,32" fill="#eab308" />
            {/* Bear silhouette */}
            <circle cx="16" cy="16" r="3.5" fill="#0f172a" />
            <path d="M 14 15 Q 16 12 18 15 Q 20 18 16 19 Z" fill="#0f172a" />
          </svg>
        );

      case 'Luzern':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full rounded-sm overflow-hidden shadow-xs border border-slate-300/60">
            <rect width="32" height="16" fill="#ffffff" />
            <rect y="16" width="32" height="16" fill="#1d4ed8" />
          </svg>
        );

      case 'Zug':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full rounded-sm overflow-hidden shadow-xs border border-slate-300/60">
            <rect width="32" height="32" fill="#ffffff" />
            <rect y="10" width="32" height="12" fill="#1d4ed8" />
          </svg>
        );

      case 'Fribourg':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full rounded-sm overflow-hidden shadow-xs border border-slate-300/60">
            <rect width="32" height="16" fill="#0f172a" />
            <rect y="16" width="32" height="16" fill="#ffffff" />
          </svg>
        );

      case 'Basel-Stadt':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full rounded-sm overflow-hidden shadow-xs border border-slate-300/60">
            <rect width="32" height="32" fill="#ffffff" />
            {/* Baslerstab (Crosier) */}
            <path
              d="M 14 26 L 18 26 L 18 14 C 21 14 22 10 19 8 C 16 6 12 8 13 11 C 14 13 16 12 16 10 C 17 8 18 10 16 11 L 16 26 Z"
              fill="#0f172a"
            />
            <circle cx="16" cy="27" r="1.5" fill="#0f172a" />
          </svg>
        );

      case 'Ticino':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full rounded-sm overflow-hidden shadow-xs border border-slate-300/60">
            <rect width="16" height="32" fill="#dc2626" />
            <rect x="16" width="16" height="32" fill="#1d4ed8" />
          </svg>
        );

      case 'Vaud':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full rounded-sm overflow-hidden shadow-xs border border-slate-300/60">
            <rect width="32" height="16" fill="#ffffff" />
            <rect y="16" width="32" height="16" fill="#15803d" />
            <text x="16" y="12" fontSize="5.5" fontWeight="bold" fill="#ca8a04" textAnchor="middle" letterSpacing="0.3">
              LIBERTÉ
            </text>
          </svg>
        );

      case 'Valais':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full rounded-sm overflow-hidden shadow-xs border border-slate-300/60">
            <rect width="16" height="32" fill="#ffffff" />
            <rect x="16" width="16" height="32" fill="#dc2626" />
            {/* Stars */}
            <circle cx="8" cy="8" r="2" fill="#dc2626" />
            <circle cx="8" cy="16" r="2" fill="#dc2626" />
            <circle cx="8" cy="24" r="2" fill="#dc2626" />
            <circle cx="24" cy="8" r="2" fill="#ffffff" />
            <circle cx="24" cy="16" r="2" fill="#ffffff" />
            <circle cx="24" cy="24" r="2" fill="#ffffff" />
            <circle cx="16" cy="12" r="1.8" fill="#e11d48" />
            <circle cx="16" cy="20" r="1.8" fill="#e11d48" />
          </svg>
        );

      case 'Neuchâtel':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full rounded-sm overflow-hidden shadow-xs border border-slate-300/60">
            <rect width="10.6" height="32" fill="#15803d" />
            <rect x="10.6" width="10.6" height="32" fill="#ffffff" />
            <rect x="21.3" width="10.7" height="32" fill="#dc2626" />
            {/* White cross in top red */}
            <path d="M 26.6 4 L 26.6 10 M 23.6 7 L 29.6 7" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="square" />
          </svg>
        );

      case 'Genève':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full rounded-sm overflow-hidden shadow-xs border border-slate-300/60">
            <rect width="16" height="32" fill="#eab308" />
            <rect x="16" width="16" height="32" fill="#dc2626" />
            {/* Left eagle half */}
            <path d="M 16 6 C 11 6 8 10 9 16 C 10 22 14 26 16 26 Z" fill="#0f172a" />
            {/* Right golden key */}
            <circle cx="24" cy="10" r="3.5" fill="none" stroke="#eab308" strokeWidth="2" />
            <rect x="23" y="12" width="2" height="14" fill="#eab308" />
            <rect x="21" y="22" width="4" height="2" fill="#eab308" />
            <rect x="22" y="18" width="3" height="2" fill="#eab308" />
          </svg>
        );

      case 'St. Gallen':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full rounded-sm overflow-hidden shadow-xs border border-slate-300/60">
            <rect width="32" height="32" fill="#15803d" />
            {/* Fasces bundle */}
            <rect x="14" y="6" width="4" height="20" rx="1" fill="#ffffff" />
            <path d="M 18 10 L 22 13 L 18 16 Z" fill="#ffffff" />
          </svg>
        );

      default:
        // Swiss Confederation Flag
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full rounded-sm overflow-hidden shadow-xs border border-slate-300/60">
            <rect width="32" height="32" fill="#dc2626" />
            <rect x="13" y="7" width="6" height="18" fill="#ffffff" />
            <rect x="7" y="13" width="18" height="6" fill="#ffffff" />
          </svg>
        );
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className={`${sizeClasses} shrink-0`}>
        {renderFlagSvg()}
      </div>
      {showLabel && (
        <span className="text-xs font-semibold text-slate-800">{canton}</span>
      )}
    </div>
  );
};
