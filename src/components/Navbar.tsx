import React from 'react';
import { Language, UserProfile } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { Download, FileText, Bot, Radio, Moon, Sun, User } from 'lucide-react';

interface NavbarProps {
  lang: Language;
  setLang: (lang: Language) => void;
  activeView: 'feed' | 'dossier' | 'agents';
  setActiveView: (view: 'feed' | 'dossier' | 'agents') => void;
  onDownloadPdf?: () => void;
  listingsCount: number;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  currentUser?: UserProfile | null;
  onOpenAccountModal?: () => void;
}

const LANGUAGES: { code: Language; label: string; full: string }[] = [
  { code: 'it', label: 'IT', full: 'Italiano' },
  { code: 'fr', label: 'FR', full: 'Français' },
  { code: 'de', label: 'DE', full: 'Deutsch' },
  { code: 'en', label: 'EN', full: 'English' },
];

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  setLang,
  activeView,
  setActiveView,
  onDownloadPdf,
  listingsCount,
  darkMode,
  setDarkMode,
  currentUser,
  onOpenAccountModal,
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Brand Title Wordmark "Home Radar" */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveView('feed')}
              className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-lg p-1"
              aria-label="Home Radar - Torna alla ricerca principale"
            >
              <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-sm shadow-sm relative overflow-hidden">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap leading-tight">
                  {t.appTitle}
                </span>
                <span className="text-[10px] text-red-600 dark:text-red-400 font-semibold tracking-wider uppercase">
                  Swiss Housing Radar
                </span>
              </div>
            </button>
            <span className="hidden lg:inline-block text-xs text-slate-400 dark:text-slate-500 font-medium border-l border-slate-200 dark:border-slate-800 pl-3">
              {t.appSubtitle}
            </span>
          </div>

          {/* Zone 2: Navigation links */}
          <nav
            role="navigation"
            aria-label="Navigazione Principale"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400"
          >
            <button
              onClick={() => setActiveView('feed')}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded px-1 ${
                activeView === 'feed'
                  ? 'text-red-600 dark:text-red-500 font-semibold border-b-2 border-red-600 dark:border-red-500 py-4 -mb-[1px]'
                  : 'py-4'
              }`}
            >
              {t.nav.searchMap}
              <span className="ml-1.5 text-xs text-slate-400 dark:text-slate-500 font-mono tabular-nums">
                ({listingsCount})
              </span>
            </button>

            <button
              onClick={() => setActiveView('dossier')}
              className={`flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded px-1 ${
                activeView === 'dossier'
                  ? 'text-red-600 dark:text-red-500 font-semibold border-b-2 border-red-600 dark:border-red-500 py-4 -mb-[1px]'
                  : 'py-4'
              }`}
            >
              <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              {t.nav.dossier}
            </button>

            <button
              onClick={() => setActiveView('agents')}
              className={`flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded px-1 ${
                activeView === 'agents'
                  ? 'text-red-600 dark:text-red-500 font-semibold border-b-2 border-red-600 dark:border-red-500 py-4 -mb-[1px]'
                  : 'py-4'
              }`}
            >
              <Bot className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              {t.nav.agents}
            </button>
          </nav>

          {/* Zone 3: Dark Mode Toggle, Language Switcher & Primary Action CTA */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              aria-label={darkMode ? 'Passa alla modalità chiara' : 'Passa alla modalità scura'}
              title={darkMode ? 'Passa alla modalità chiara' : 'Passa alla modalità scura'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* 4-Language Segmented Switcher */}
            <div
              role="radiogroup"
              aria-label="Selettore Lingua"
              className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold"
            >
              {LANGUAGES.map((item) => (
                <button
                  key={item.code}
                  role="radio"
                  aria-checked={lang === item.code}
                  onClick={() => setLang(item.code)}
                  className={`px-2 py-1 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                    lang === item.code
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                  title={item.full}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Account / Sign In with Google & Apple CTA */}
            {onOpenAccountModal && (
              <button
                onClick={onOpenAccountModal}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 cursor-pointer ${
                  currentUser
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-750'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-750'
                }`}
                title={currentUser ? currentUser.name : t.account.title}
                aria-label={currentUser ? currentUser.name : t.account.title}
              >
                {currentUser ? (
                  <>
                    {currentUser.avatarUrl ? (
                      <img
                        src={currentUser.avatarUrl}
                        alt={currentUser.name}
                        className="w-4 h-4 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-red-600 text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                        {currentUser.name.charAt(0)}
                      </div>
                    )}
                    <span className="hidden md:inline max-w-[75px] truncate">
                      {currentUser.name.split(' ')[0]}
                    </span>
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                    <span className="hidden sm:inline">{t.nav.account || 'Account'}</span>
                  </>
                )}
              </button>
            )}

            {/* Primary Action: Download Official Dossier PDF */}
            <button
              onClick={onDownloadPdf ? onDownloadPdf : () => setActiveView('dossier')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap shrink-0 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              aria-label={t.dossier.downloadPdf}
              title={t.dossier.downloadPdf}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dossier PDF</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
