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

      case 'Uri':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full rounded-sm overflow-hidden shadow-xs border border-slate-300/60">
            <rect width="32" height="32" fill="#eab308" />
            {/* Stierkopf / Bull */}
            <circle cx="16" cy="17" r="7" fill="#0f172a" />
            <path d="M 10 12 Q 16 8 22 12" stroke="#dc2626" strokeWidth="2" fill="none" />
            <circle cx="16" cy="22" r="2.5" fill="none" stroke="#dc2626" strokeWidth="1.5" />
          </svg>
        );

      case 'Schwyz':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full rounded-sm overflow-hidden shadow-xs border border-slate-300/60">
            <rect width="32" height="32" fill="#dc2626" />
            {/* Small cross top right */}
            <rect x="23" y="4" width="2" height="7" fill="#ffffff" />
            <rect x="20.5" y="6.5" width="7" height="2" fill="#ffffff" />
          </svg>
        );

      case 'Obwalden':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full rounded-sm overflow-hidden shadow-xs border border-slate-300/60">
            <rect width="32" height="16" fill="#dc2626" />
            <rect y="16" width="32" height="16" fill="#ffffff" />
            {/* Key */}
            <line x1="16" y1="6" x2="16" y2="26" stroke="#eab308" strokeWidth="2.5" />
            <circle cx="16" cy="8" r="3" fill="none" stroke="#eab308" strokeWidth="2" />
          </svg>
        );

      case 'Nidwalden':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full rounded-sm overflow-hidden shadow-xs border border-slate-300/60">
            <rect width="32" height="32" fill="#dc2626" />
            {/* Double Key */}
            <line x1="16" y1="4" x2="16" y2="28" stroke="#ffffff" strokeWidth="2.5" />
            <circle cx="16" cy="7" r="3.5" fill="none" stroke="#ffffff" strokeWidth="2" />
            <circle cx="16" cy="25" r="3.5" fill="none" stroke="#ffffff" strokeWidth="2" />
          </svg>
        );

      case 'Glarus':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full rounded-sm overflow-hidden shadow-xs border border-slate-300/60">
            <rect width="32" height="32" fill="#dc2626" />
            {/* St. Fridolin pilgrim */}
            <circle cx="16" cy="11" r="3" fill="#0f172a" />
            <path d="M 13 14 L 19 14 L 17 26 L 15 26 Z" fill="#0f172a" />
            <line x1="19" y1="12" x2="21" y2="26" stroke="#eab308" strokeWidth="1.5" />
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

      case 'Solothurn':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full rounded-sm overflow-hidden shadow-xs border border-slate-300/60">
            <rect width="32" height="16" fill="#dc2626" />
            <rect y="16" width="32" height="16" fill="#ffffff" />
          </svg>
        );

      case 'Basel-Stadt':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full rounded-sm overflow-hidden shadow-xs border border-slate-300/60">
            <rect width="32" height="32" fill="#ffffff" />
            <path
              d="M 14 26 L 18 26 L 18 14 C 21 14 22 10 19 8 C 16 6 12 8 13 11 C 14 13 16 12 16 10 C 17 8 18 10 16 11 L 16 26 Z"
              fill="#0f172a"
            />
            <circle cx="16" cy="27" r="1.5" fill="#0f172a" />
          </svg>
        );

      case 'Basel-Landschaft':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full rounded-sm overflow-hidden shadow-xs border border-slate-300/60">
            <rect width="32" height="32" fill="#ffffff" />
            {/* Red crosier facing right with balls */}
            <path
              d="M 14 26 L 18 26 L 18 14 C 15 14 14 10 17 8 C 20 6 24 8 23 11 C 22 13 20 12 20 10 C 19 8 18 10 20 11 L 20 26 Z"
              fill="#dc2626"
            />
            <circle cx="13" cy="9" r="1.2" fill="#dc2626" />
            <circle cx="16" cy="6" r="1.2" fill="#dc2626" />
            <circle cx="20" cy="5" r="1.2" fill="#dc2626" />
          </svg>
        );

      case 'Schaffhausen':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full rounded-sm overflow-hidden shadow-xs border border-slate-300/60">
            <rect width="32" height="32" fill="#eab308" />
            {/* Ram / Widder */}
            <circle cx="16" cy="14" r="5" fill="#0f172a" />
            <path d="M 12 16 L 14 25 L 18 25 L 20 16 Z" fill="#0f172a" />
            <path d="M 14 11 Q 12 7 10 10" stroke="#0f172a" strokeWidth="2" fill="none" />
          </svg>
        );

      case 'Appenzell Ausserrhoden':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full rounded-sm overflow-hidden shadow-xs border border-slate-300/60">
            <rect width="32" height="32" fill="#ffffff" />
            <circle cx="16" cy="16" r="4.5" fill="#0f172a" />
            <text x="6" y="20" fontSize="9" fontWeight="bold" fill="#0f172a">V</text>
            <text x="22" y="20" fontSize="9" fontWeight="bold" fill="#0f172a">R</text>
          </svg>
        );

      case 'Appenzell Innerrhoden':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full rounded-sm overflow-hidden shadow-xs border border-slate-300/60">
            <rect width="32" height="32" fill="#ffffff" />
            {/* Upright black bear */}
            <ellipse cx="16" cy="16" rx="4.5" ry="7" fill="#0f172a" />
            <circle cx="16" cy="8" r="3" fill="#0f172a" />
            <path d="M 12 10 L 9 14 M 20 10 L 23 14" stroke="#0f172a" strokeWidth="2" />
          </svg>
        );

      case 'St. Gallen':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full rounded-sm overflow-hidden shadow-xs border border-slate-300/60">
            <rect width="32" height="32" fill="#15803d" />
            <rect x="14" y="6" width="4" height="20" rx="1" fill="#ffffff" />
            <path d="M 18 10 L 22 13 L 18 16 Z" fill="#ffffff" />
          </svg>
        );

      case 'Graubünden':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full rounded-sm overflow-hidden shadow-xs border border-slate-300/60">
            {/* Top half split grey/blue, bottom black ibex on white */}
            <rect x="0" y="0" width="16" height="16" fill="#0f172a" />
            <rect x="16" y="0" width="16" height="16" fill="#1d4ed8" />
            <rect x="0" y="16" width="32" height="16" fill="#ffffff" />
            {/* Ibex Steinbock horns */}
            <circle cx="16" cy="22" r="3" fill="#0f172a" />
            <path d="M 14 20 Q 11 16 13 13 M 18 20 Q 21 16 19 13" stroke="#0f172a" strokeWidth="1.8" fill="none" />
          </svg>
        );

      case 'Aargau':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full rounded-sm overflow-hidden shadow-xs border border-slate-300/60">
            <rect x="0" y="0" width="16" height="32" fill="#0f172a" />
            <rect x="16" y="0" width="16" height="32" fill="#0284c7" />
            {/* Waves left */}
            <line x1="2" y1="10" x2="14" y2="10" stroke="#0284c7" strokeWidth="1.5" />
            <line x1="2" y1="16" x2="14" y2="16" stroke="#0284c7" strokeWidth="1.5" />
            <line x1="2" y1="22" x2="14" y2="22" stroke="#0284c7" strokeWidth="1.5" />
            {/* Three white stars right */}
            <circle cx="24" cy="8" r="1.8" fill="#ffffff" />
            <circle cx="20" cy="18" r="1.8" fill="#ffffff" />
            <circle cx="26" cy="24" r="1.8" fill="#ffffff" />
          </svg>
        );

      case 'Thurgau':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full rounded-sm overflow-hidden shadow-xs border border-slate-300/60">
            <polygon points="0,0 32,0 0,32" fill="#ffffff" />
            <polygon points="32,0 32,32 0,32" fill="#15803d" />
            {/* Two golden lions */}
            <circle cx="10" cy="10" r="2.8" fill="#eab308" />
            <circle cx="22" cy="22" r="2.8" fill="#eab308" />
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
            <path d="M 26.6 4 L 26.6 10 M 23.6 7 L 29.6 7" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="square" />
          </svg>
        );

      case 'Genève':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full rounded-sm overflow-hidden shadow-xs border border-slate-300/60">
            <rect width="16" height="32" fill="#eab308" />
            <rect x="16" width="16" height="32" fill="#dc2626" />
            <path d="M 16 6 C 11 6 8 10 9 16 C 10 22 14 26 16 26 Z" fill="#0f172a" />
            <circle cx="24" cy="10" r="3.5" fill="none" stroke="#eab308" strokeWidth="2" />
            <rect x="23" y="12" width="2" height="14" fill="#eab308" />
            <rect x="21" y="22" width="4" height="2" fill="#eab308" />
            <rect x="22" y="18" width="3" height="2" fill="#eab308" />
          </svg>
        );

      case 'Jura':
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full rounded-sm overflow-hidden shadow-xs border border-slate-300/60">
            <rect x="0" y="0" width="16" height="32" fill="#ffffff" />
            <rect x="16" y="0" width="16" height="32" fill="#dc2626" />
            {/* Red Crosier left */}
            <path
              d="M 6 26 L 10 26 L 10 14 C 13 14 14 10 11 8 C 8 6 4 8 5 11 C 6 13 8 12 8 10 C 9 8 10 10 8 11 L 8 26 Z"
              fill="#dc2626"
            />
            {/* Three white stripes right */}
            <rect x="16" y="5" width="16" height="4" fill="#ffffff" />
            <rect x="16" y="14" width="16" height="4" fill="#ffffff" />
            <rect x="16" y="23" width="16" height="4" fill="#ffffff" />
          </svg>
        );

      default:
        // Swiss Confederation Cross
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
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{canton}</span>
      )}
    </div>
  );
};
