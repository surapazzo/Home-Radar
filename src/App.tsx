/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { INITIAL_LISTINGS } from './data/mockListings';
import { Listing, FilterState, DossierState, AgentLog, Language, UserProfile, SearchHistoryItem } from './types';
import { TRANSLATIONS } from './i18n/translations';
import { Navbar } from './components/Navbar';
import { FilterToolbar } from './components/FilterToolbar';
import { SearchHistory } from './components/SearchHistory';
import { ListingCard } from './components/ListingCard';
import { SwissMap } from './components/SwissMap';
import { DossierView } from './components/DossierView';
import { AgentWorkbench } from './components/AgentWorkbench';
import { ListingDetailModal } from './components/ListingDetailModal';
import { AccountModal } from './components/AccountModal';
import { generateSwissDossierPdf } from './utils/generateSwissDossierPdf';
import { Building, LayoutGrid, Map as MapIcon, CheckCircle2 } from 'lucide-react';

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  selectedCanton: '',
  selectedCity: '',
  minRooms: 0,
  maxRooms: 6,
  maxRentTotalCHF: 99999,
  repriseOnly: false,
  petsAllowed: false,
  balconyOnly: false,
  parkingOnly: false,
  maxCommuteMin: 999,
  sourceFilter: 'all',
  sortBy: 'newest',
};

const DEFAULT_DOSSIER: DossierState = {
  applicantName: 'Matteo Colombo',
  email: 'matteo.colombo@example.ch',
  phone: '+41 79 812 34 56',
  currentProfession: 'Ingénieur Informatique / Senior Software Engineer',
  employer: 'EPFL Innovation Park / Société Romande SA',
  monthlyNetSalaryCHF: 7500,
  permitType: 'B',
  targetCanton: 'Zürich',
  hasPoursuitesExtract: true,
  hasSalarySlips: true,
  hasIdentityDoc: true,
  hasRCAssurance: true,
  hasGuarantor: false,
  guarantorMonthlySalaryCHF: 0,
  familyMembersCount: 1,
  petsInfo: 'Aucun animal',
  customLetterNotes: 'Non-fumeur, solvabilité garantie et références bancaires à disposition.',
  dateOfBirth: '1992-08-14',
  maritalStatus: 'Celibe / Nubile',
  currentAddress: 'Avenue de la Gare 14, 1003 Lausanne',
  employmentType: 'CDI (Tempo Indeterminato 100%)',
  targetRentCHF: 2200,
  employmentDuration: '> 2 anni',
  probationPassed: true,
};

function areFiltersEqual(a: FilterState, b: FilterState): boolean {
  return (
    a.selectedCanton === b.selectedCanton &&
    a.selectedCity === b.selectedCity &&
    a.searchQuery.trim().toLowerCase() === b.searchQuery.trim().toLowerCase() &&
    a.maxRentTotalCHF === b.maxRentTotalCHF &&
    a.minRooms === b.minRooms &&
    a.maxRooms === b.maxRooms &&
    a.repriseOnly === b.repriseOnly &&
    a.petsAllowed === b.petsAllowed &&
    a.balconyOnly === b.balconyOnly &&
    a.parkingOnly === b.parkingOnly &&
    a.maxCommuteMin === b.maxCommuteMin &&
    a.sourceFilter === b.sourceFilter &&
    a.sortBy === b.sortBy
  );
}

function isDefaultFilter(f: FilterState): boolean {
  return (
    !f.selectedCanton &&
    !f.selectedCity &&
    !f.searchQuery.trim() &&
    f.maxRentTotalCHF === DEFAULT_FILTERS.maxRentTotalCHF &&
    f.minRooms === DEFAULT_FILTERS.minRooms &&
    f.maxRooms === DEFAULT_FILTERS.maxRooms &&
    !f.repriseOnly &&
    !f.petsAllowed &&
    !f.balconyOnly &&
    !f.parkingOnly &&
    f.maxCommuteMin === DEFAULT_FILTERS.maxCommuteMin &&
    f.sourceFilter === DEFAULT_FILTERS.sourceFilter
  );
}

export default function App() {
  const [lang, setLang] = useState<Language>('it');
  const t = TRANSLATIONS[lang];

  const [listings, setListings] = useState<Listing[]>(INITIAL_LISTINGS);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [detailModalListing, setDetailModalListing] = useState<Listing | null>(null);
  const [savedListingIds, setSavedListingIds] = useState<Set<string>>(new Set(['ch-zh-01', 'ch-ti-09']));
  const [activeView, setActiveView] = useState<'feed' | 'dossier' | 'agents'>('feed');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [dossier, setDossier] = useState<DossierState>(DEFAULT_DOSSIER);
  const [mobilePane, setMobilePane] = useState<'list' | 'map'>('list');

  // User Account State with localStorage persistence
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('home_radar_current_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved user profile', e);
    }
    return null;
  });

  const [isAccountModalOpen, setIsAccountModalOpen] = useState<boolean>(false);
  const [accountToast, setAccountToast] = useState<string | null>(null);

  // Search History State (Last 5 filter combinations for quick access)
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('home_radar_search_history');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse search history', e);
    }
    return [
      {
        id: 'hist-1',
        timestamp: '14:20',
        label: 'Gland (VD) · La Côte CFF',
        resultCount: 2,
        filters: {
          ...DEFAULT_FILTERS,
          selectedCanton: 'Vaud',
          selectedCity: 'Gland',
          maxRentTotalCHF: 2400,
        },
      },
      {
        id: 'hist-2',
        timestamp: '11:05',
        label: 'Zürich · SBB < 15 min',
        resultCount: 5,
        filters: {
          ...DEFAULT_FILTERS,
          selectedCanton: 'Zürich',
          selectedCity: '',
          maxCommuteMin: 15,
          maxRentTotalCHF: 3200,
        },
      },
    ];
  });

  // Sync search history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('home_radar_search_history', JSON.stringify(searchHistory));
    } catch {}
  }, [searchHistory]);

  // Sync user profile to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('home_radar_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('home_radar_current_user');
      }
    } catch (e) {
      console.error('Failed to save user profile', e);
    }
  }, [currentUser]);

  // Dark Mode state with localStorage and system preference detection
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('home_radar_dark_mode');
      if (saved !== null) {
        return saved === 'true';
      }
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Apply 'dark' class to html root
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      try {
        localStorage.setItem('home_radar_dark_mode', 'true');
      } catch {}
    } else {
      root.classList.remove('dark');
      try {
        localStorage.setItem('home_radar_dark_mode', 'false');
      } catch {}
    }
  }, [darkMode]);

  // Nationwide Agent Logs State
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([
    {
      id: 'init-1',
      timestamp: '08:00:12',
      agentName: 'Portal Crawler',
      type: 'info',
      message: 'Swiss nationwide feed initialized: Properties tracked across Zürich, Genève, Vaud, Basel, Bern, Ticino, Luzern, Zug.',
    },
    {
      id: 'init-2',
      timestamp: '08:01:45',
      agentName: 'Facebook Scout',
      type: 'info',
      message: 'Active regional groups monitored: Zürich Nachmieter, Genève à louer, Lausanne Logements, Affitti Ticino.',
    },
  ]);

  const handleToggleSave = (id: string) => {
    setSavedListingIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleAddListing = (newListing: Listing) => {
    setListings((prev) => [newListing, ...prev]);
    setSelectedListing(newListing);
    setAgentLogs((prev) => [
      {
        id: `log-add-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('fr-CH'),
        agentName: 'Facebook Scout',
        type: 'success',
        message: `New listing imported: "${newListing.title}" in ${newListing.city} (${newListing.canton}) - CHF ${newListing.rentTotalCHF}.-`,
        listingId: newListing.id,
      },
      ...prev,
    ]);
  };

  const handleInjectListingFromAgent = (crawledListing: Listing) => {
    setListings((prev) => [crawledListing, ...prev]);
    setSelectedListing(crawledListing);
  };

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.savedListingIds && user.savedListingIds.length > 0) {
      setSavedListingIds((prev) => {
        const next = new Set(prev);
        user.savedListingIds.forEach((id) => next.add(id));
        return next;
      });
    }
    const providerLabel = user.provider === 'google' ? 'Google' : user.provider === 'apple' ? 'Apple' : 'Email';
    setAccountToast(`${t.account.loginSuccess} (${providerLabel})`);
    setTimeout(() => setAccountToast(null), 3500);

    setAgentLogs((prev) => [
      {
        id: `log-auth-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('fr-CH'),
        agentName: 'Dossier Matcher',
        type: 'success',
        message: `Sessione utente autenticata con successo tramite ${providerLabel}: "${user.name}" (${user.email}).`,
      },
      ...prev,
    ]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAccountToast(t.account.logoutSuccess);
    setTimeout(() => setAccountToast(null), 3000);
  };

  const handleUpdateUser = (updated: UserProfile) => {
    setCurrentUser(updated);
  };

  const handleSyncWithDossier = (user: UserProfile) => {
    setDossier((prev) => ({
      ...prev,
      applicantName: user.name,
      email: user.email,
      phone: user.phone || prev.phone,
      targetCanton: user.preferredCanton || prev.targetCanton,
    }));
    setAccountToast(t.account.syncSuccess);
    setTimeout(() => setAccountToast(null), 3000);
  };

  // Filtered and Sorted Listings across Switzerland
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesText =
          item.title.toLowerCase().includes(q) ||
          item.city.toLowerCase().includes(q) ||
          item.canton.toLowerCase().includes(q) ||
          item.address.toLowerCase().includes(q) ||
          item.district.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q);
        if (!matchesText) return false;
      }

      if (filters.selectedCanton && item.canton !== filters.selectedCanton) {
        return false;
      }

      if (filters.selectedCity && item.city !== filters.selectedCity) {
        return false;
      }

      if (filters.minRooms > 0 && item.rooms < filters.minRooms) {
        return false;
      }

      if (item.rentTotalCHF > filters.maxRentTotalCHF) {
        return false;
      }

      if (filters.repriseOnly && !item.isRepriseDeBail) {
        return false;
      }

      if (filters.maxCommuteMin < 900 && item.commuteHubMin > filters.maxCommuteMin) {
        return false;
      }

      if (filters.sourceFilter === 'portals' && item.source === 'facebook_group') {
        return false;
      }
      if (filters.sourceFilter === 'facebook' && item.source !== 'facebook_group') {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_asc':
          return a.rentTotalCHF - b.rentTotalCHF;
        case 'price_desc':
          return b.rentTotalCHF - a.rentTotalCHF;
        case 'rooms_desc':
          return b.rooms - a.rooms;
        case 'commute_asc':
          return a.commuteHubMin - b.commuteHubMin;
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [listings, filters]);

  // Record non-default filter combinations to searchHistory (capped at 5)
  useEffect(() => {
    if (isDefaultFilter(filters)) return;

    const timer = setTimeout(() => {
      setSearchHistory((prev) => {
        if (prev.length > 0 && areFiltersEqual(prev[0].filters, filters)) {
          return prev;
        }

        const filtered = prev.filter((item) => !areFiltersEqual(item.filters, filters));

        let label = 'Tutta la Svizzera';
        if (filters.selectedCity) {
          label = `${filters.selectedCity} (${filters.selectedCanton || 'CH'})`;
        } else if (filters.selectedCanton) {
          label = `Canton ${filters.selectedCanton}`;
        } else if (filters.searchQuery) {
          label = `"${filters.searchQuery}"`;
        } else if (filters.repriseOnly) {
          label = 'Subentri / Nachmieter';
        }

        const newItem: SearchHistoryItem = {
          id: `hist-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' }),
          label,
          filters,
          resultCount: filteredListings.length,
        };

        return [newItem, ...filtered].slice(0, 5);
      });
    }, 600);

    return () => clearTimeout(timer);
  }, [filters, filteredListings.length]);

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Navbar with 4-Language Selector and Top Bar Contract */}
      <Navbar
        lang={lang}
        setLang={setLang}
        activeView={activeView}
        setActiveView={setActiveView}
        onDownloadPdf={() => generateSwissDossierPdf(dossier, lang)}
        listingsCount={listings.length}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        currentUser={currentUser}
        onOpenAccountModal={() => setIsAccountModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeView === 'feed' && (
          <div>
            {/* Filter Toolbar */}
            <FilterToolbar
              lang={lang}
              filters={filters}
              setFilters={setFilters}
              totalListingsCount={listings.length}
              filteredCount={filteredListings.length}
              onReset={handleResetFilters}
            />

            {/* Mobile View Toggle (List vs Map) */}
            <div className="lg:hidden flex items-center justify-center p-1 bg-slate-200/70 dark:bg-slate-800 rounded-lg mb-4 text-xs font-semibold">
              <button
                onClick={() => setMobilePane('list')}
                className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                  mobilePane === 'list'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                {t.filters.toggleList.replace('{count}', String(filteredListings.length))}
              </button>
              <button
                onClick={() => setMobilePane('map')}
                className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                  mobilePane === 'map'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                {t.filters.toggleMap}
              </button>
            </div>

            {/* Dual Pane Layout: 7 cols Listings List + 5 cols Interactive Map */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Listings Grid */}
              <div
                className={`lg:col-span-7 space-y-3.5 ${
                  mobilePane === 'map' ? 'hidden lg:block' : 'block'
                }`}
              >
                {/* Search History (Last 5 filter combinations for quick access) */}
                <SearchHistory
                  lang={lang}
                  history={searchHistory}
                  activeFilters={filters}
                  onSelectHistory={(item) => setFilters(item.filters)}
                  onRemoveItem={(id) => setSearchHistory((p) => p.filter((x) => x.id !== id))}
                  onClearAll={() => setSearchHistory([])}
                  onQuickPreset={(presetFilters) => setFilters((p) => ({ ...p, ...presetFilters }))}
                />

                {filteredListings.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center space-y-3 transition-colors">
                    <Building className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {t.filters.noResultsTitle}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                      {t.filters.noResultsDesc}
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="px-3.5 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                    >
                      {t.filters.resetAll}
                    </button>
                  </div>
                ) : (
                  filteredListings.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      lang={lang}
                      listing={listing}
                      isSelected={selectedListing?.id === listing.id}
                      onSelect={(item) => {
                        setSelectedListing(item);
                        setDetailModalListing(item);
                      }}
                      dossier={dossier}
                      isSaved={savedListingIds.has(listing.id)}
                      onToggleSave={handleToggleSave}
                    />
                  ))
                )}
              </div>

              {/* Right Column: Sticky Interactive Switzerland Map */}
              <div
                className={`lg:col-span-5 sticky top-24 ${
                  mobilePane === 'list' ? 'hidden lg:block' : 'block'
                }`}
              >
                <div className="h-[calc(100vh-130px)] min-h-[500px]">
                  <SwissMap
                    lang={lang}
                    listings={filteredListings}
                    selectedListing={selectedListing}
                    onSelectListing={(l) => {
                      setSelectedListing(l);
                      setDetailModalListing(l);
                    }}
                    selectedCanton={filters.selectedCanton}
                    onSelectCanton={(canton) =>
                      setFilters((p) => ({ ...p, selectedCanton: canton, selectedCity: '' }))
                    }
                    selectedCity={filters.selectedCity}
                    onSelectCity={(city) =>
                      setFilters((p) => ({ ...p, selectedCity: city }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dossier Manager View */}
        {activeView === 'dossier' && (
          <DossierView lang={lang} dossier={dossier} setDossier={setDossier} />
        )}

        {/* Agent Workbench View */}
        {activeView === 'agents' && (
          <AgentWorkbench
            lang={lang}
            logs={agentLogs}
            onAddLog={(newLog) => setAgentLogs((p) => [newLog, ...p])}
            onClearLogs={() => setAgentLogs([])}
            onInjectListing={handleInjectListingFromAgent}
            dossier={dossier}
            listingsCount={listings.length}
            onApplyFilters={(newFilters) => {
              setFilters((p) => ({ ...p, ...newFilters }));
              setActiveView('feed');
            }}
            onSelectView={setActiveView}
          />
        )}
      </main>

      {/* Listing Detail Modal */}
      <ListingDetailModal
        lang={lang}
        listing={detailModalListing}
        onClose={() => setDetailModalListing(null)}
        dossier={dossier}
        onOpenDossier={() => {
          setDetailModalListing(null);
          setActiveView('dossier');
        }}
        isSaved={detailModalListing ? savedListingIds.has(detailModalListing.id) : false}
        onToggleSave={handleToggleSave}
      />

      {/* Account Modal (Sign in with Google & Apple, Profile, Sync) */}
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onUpdateUser={handleUpdateUser}
        onSyncWithDossier={handleSyncWithDossier}
        lang={lang}
        savedListings={listings.filter((l) => savedListingIds.has(l.id))}
        onSelectListing={(listing) => {
          setSelectedListing(listing);
          setDetailModalListing(listing);
        }}
        onRemoveSaved={handleToggleSave}
      />

      {/* Account Notification Toast */}
      {accountToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl shadow-xl text-xs font-semibold animate-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{accountToast}</span>
        </div>
      )}
    </div>
  );
}
