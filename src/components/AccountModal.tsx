import React, { useState } from 'react';
import { UserProfile, AuthProvider, Language, Listing, SwissCanton } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { CantonFlag } from './CantonFlag';
import {
  X,
  User,
  ShieldCheck,
  Heart,
  CloudCheck,
  LogOut,
  Mail,
  Phone,
  CheckCircle,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
  onUpdateUser: (updated: UserProfile) => void;
  onSyncWithDossier: (user: UserProfile) => void;
  lang: Language;
  savedListings: Listing[];
  onSelectListing?: (listing: Listing) => void;
  onRemoveSaved?: (id: string) => void;
}

// Google SVG Logo with official 4-color branding
export const GoogleLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

// Apple SVG Logo
export const AppleLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 170 170" fill="currentColor" aria-hidden="true">
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-6.85-10.4-12.06-22.1-15.63-35.1-3.57-13-5.36-25.26-5.36-36.78 0-16.74 4.35-30.82 13.05-42.23 8.7-11.41 19.64-17.27 32.83-17.58 4.8 0 10.15 1.34 16.06 4.02 5.91 2.68 9.9 4.07 11.96 4.18 1.83 0 6.07-1.46 12.74-4.39 6.67-2.92 12.4-4.25 17.18-3.99 12.92.74 23.36 5.48 31.33 14.21-11.38 6.9-16.94 16.42-16.7 28.56.24 9.69 3.99 17.84 11.25 24.45 7.26 6.61 15.93 10.38 26.01 11.31-2.22 6.84-4.99 13.78-8.3 20.82zM119.22 31.84c0-7.39 2.66-14.41 7.98-21.06 5.32-6.65 11.88-10.78 19.68-12.39.24 1.25.36 2.45.36 3.6 0 7.4-2.8 14.53-8.41 21.39-5.61 6.86-12.21 11.08-19.8 12.67-.23-1.49-.35-2.89-.35-4.21z" />
  </svg>
);

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  onUpdateUser,
  onSyncWithDossier,
  lang,
  savedListings,
  onSelectListing,
  onRemoveSaved,
}) => {
  const t = TRANSLATIONS[lang];
  const tAcc = t.account;

  // Sign in view states
  const [authStep, setAuthStep] = useState<'options' | 'google_chooser' | 'apple_prompt' | 'email_form'>('options');
  const [activeTab, setActiveTab] = useState<'profile' | 'saved' | 'sync' | 'security'>('profile');

  // Input states for custom sign-in
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [appleHideEmail, setAppleHideEmail] = useState(true);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Profile edit states
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '+41 79 345 67 89');
  const [editCanton, setEditCanton] = useState<string>(currentUser?.preferredCanton || 'Zürich');

  if (!isOpen) return null;

  // Standard Demo Profiles for 1-click Google and Apple sign in
  const handleQuickGoogleSignIn = (
    name = 'Marco Bernardini',
    email = 'marco.bernardini.ch@gmail.com',
    canton: SwissCanton = 'Zürich'
  ) => {
    const user: UserProfile = {
      id: `usr-goog-${Date.now().toString().slice(-6)}`,
      name,
      email,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      provider: 'google',
      providerAccountId: `goog-sub-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      phone: '+41 79 821 44 20',
      verifiedEmail: true,
      preferredCanton: canton,
      syncDossierWithCloud: true,
      savedListingIds: ['ch-zh-01', 'ch-ti-09'],
    };
    onLogin(user);
    setAuthStep('options');
  };

  const handleQuickAppleSignIn = (hideEmail = true) => {
    const email = hideEmail
      ? 'sophie.laurent.relay@privaterelay.appleid.com'
      : 'sophie.laurent.vd@icloud.com';
    const user: UserProfile = {
      id: `usr-appl-${Date.now().toString().slice(-6)}`,
      name: 'Sophie Laurent',
      email,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      provider: 'apple',
      providerAccountId: `apple-sub-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      phone: '+41 78 612 88 55',
      verifiedEmail: true,
      preferredCanton: 'Vaud',
      syncDossierWithCloud: true,
      savedListingIds: ['ch-vd-03', 'ch-ge-02'],
      hideEmailWithApple: hideEmail,
    };
    onLogin(user);
    setAuthStep('options');
  };

  const handleCustomSubmit = (e: React.FormEvent, provider: AuthProvider) => {
    e.preventDefault();
    if (!customName.trim() || !customEmail.trim()) return;

    const user: UserProfile = {
      id: `usr-${provider}-${Date.now().toString().slice(-6)}`,
      name: customName.trim(),
      email: customEmail.trim(),
      provider,
      providerAccountId: `${provider}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      phone: '+41 79 123 45 67',
      verifiedEmail: true,
      preferredCanton: 'Zürich',
      syncDossierWithCloud: true,
      savedListingIds: [],
    };
    onLogin(user);
    setCustomName('');
    setCustomEmail('');
    setAuthStep('options');
  };

  const handleSaveProfile = () => {
    if (!currentUser) return;
    const updated: UserProfile = {
      ...currentUser,
      name: editName.trim() || currentUser.name,
      phone: editPhone.trim() || currentUser.phone,
      preferredCanton: editCanton,
    };
    onUpdateUser(updated);
    setSyncFeedback(tAcc.syncSuccess);
    setTimeout(() => setSyncFeedback(null), 3000);
  };

  const handleSyncDossierClick = () => {
    if (!currentUser) return;
    onSyncWithDossier(currentUser);
    setSyncFeedback(tAcc.syncSuccess);
    setTimeout(() => setSyncFeedback(null), 3000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 id="account-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                {currentUser ? currentUser.name : tAcc.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentUser ? (
                  currentUser.provider === 'google' ? (
                    <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400">
                      <GoogleLogo className="w-3 h-3" /> {tAcc.googleSignedInAs}
                    </span>
                  ) : currentUser.provider === 'apple' ? (
                    <span className="inline-flex items-center gap-1 text-slate-800 dark:text-slate-300">
                      <AppleLogo className="w-3 h-3" /> {tAcc.appleSignedInAs}
                    </span>
                  ) : (
                    tAcc.emailSignedInAs
                  )
                ) : (
                  'Home Radar · Account Svizzero'
                )}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Chiudi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* ============================================================ */}
          {/* UNREGISTERED / NOT LOGGED IN STATE */}
          {/* ============================================================ */}
          {!currentUser ? (
            <div className="space-y-6">
              {/* Introduction Card */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-slate-50 dark:from-red-950/20 dark:to-slate-800/40 border border-red-100 dark:border-red-900/30 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-red-600 text-white flex items-center justify-center shadow-md mb-3">
                  <User className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  {tAcc.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm mx-auto">
                  {tAcc.subtitle}
                </p>
              </div>

              {/* Main OAuth Buttons */}
              {authStep === 'options' && (
                <div className="space-y-3">
                  {/* Google Sign In Button */}
                  <button
                    onClick={() => setAuthStep('google_chooser')}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 transition-all shadow-xs hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
                  >
                    <GoogleLogo className="w-5 h-5 shrink-0" />
                    <span>{tAcc.signInWithGoogle}</span>
                  </button>

                  {/* Apple Sign In Button */}
                  <button
                    onClick={() => setAuthStep('apple_prompt')}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-semibold text-white dark:text-slate-900 bg-black dark:bg-white border border-black dark:border-white rounded-xl hover:bg-slate-850 dark:hover:bg-slate-100 transition-all shadow-xs hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 cursor-pointer"
                  >
                    <AppleLogo className="w-5 h-5 shrink-0" />
                    <span>{tAcc.signInWithApple}</span>
                  </button>

                  <div className="relative my-4 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                    </div>
                    <span className="relative px-3 bg-white dark:bg-slate-900 text-xs text-slate-400 uppercase tracking-wider">
                      {tAcc.orDivider}
                    </span>
                  </div>

                  {/* Direct 1-Click Demo Profiles */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      {tAcc.demoAccountsPrompt}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        onClick={() => handleQuickGoogleSignIn()}
                        className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-750 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 text-left transition-colors cursor-pointer group"
                      >
                        <GoogleLogo className="w-4 h-4 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            Marco Bernardini
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">Google (Zürich)</p>
                        </div>
                      </button>

                      <button
                        onClick={() => handleQuickAppleSignIn()}
                        className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-750 border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 text-left transition-colors cursor-pointer group"
                      >
                        <AppleLogo className="w-4 h-4 shrink-0 text-black dark:text-white" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-slate-900 dark:group-hover:text-white">
                            Sophie Laurent
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">Apple ID (Vaud)</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Email option link */}
                  <div className="text-center pt-1">
                    <button
                      onClick={() => setAuthStep('email_form')}
                      className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline underline-offset-4"
                    >
                      {tAcc.signInWithEmail}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2A: Google Interactive Chooser */}
              {authStep === 'google_chooser' && (
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <GoogleLogo className="w-5 h-5" />
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        Accedi con Google
                      </span>
                    </div>
                    <button
                      onClick={() => setAuthStep('options')}
                      className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    >
                      Indietro
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Scegli un account Google per continuare con <strong>Home Radar Svizzera</strong>:
                  </p>

                  <div className="space-y-2">
                    <button
                      onClick={() => handleQuickGoogleSignIn('Marco Bernardini', 'marco.bernardini.ch@gmail.com', 'Zürich')}
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                          MB
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            Marco Bernardini
                          </p>
                          <p className="text-xs text-slate-500">marco.bernardini.ch@gmail.com</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>

                    <button
                      onClick={() => handleQuickGoogleSignIn('Lucas Meyer', 'lucas.meyer.basel@gmail.com', 'Basel-Stadt')}
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                          LM
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            Lucas Meyer
                          </p>
                          <p className="text-xs text-slate-500">lucas.meyer.basel@gmail.com</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>

                  {/* Custom Google Email entry */}
                  <form
                    onSubmit={(e) => handleCustomSubmit(e, 'google')}
                    className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2"
                  >
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Oppure inserisci la tua email Google:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Nome e Cognome"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        required
                      />
                      <input
                        type="email"
                        placeholder="nome@gmail.com"
                        value={customEmail}
                        onChange={(e) => setCustomEmail(e.target.value)}
                        className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      Accedi con questo account Google
                    </button>
                  </form>
                </div>
              )}

              {/* Step 2B: Apple Interactive Prompt */}
              {authStep === 'apple_prompt' && (
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <AppleLogo className="w-5 h-5 text-black dark:text-white" />
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        Accedi con Apple ID
                      </span>
                    </div>
                    <button
                      onClick={() => setAuthStep('options')}
                      className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    >
                      Indietro
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        Sophie Laurent (Apple ID)
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {appleHideEmail
                          ? 'sophie.laurent.relay@privaterelay.appleid.com'
                          : 'sophie.laurent.vd@icloud.com'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                      <input
                        type="checkbox"
                        checked={appleHideEmail}
                        onChange={(e) => setAppleHideEmail(e.target.checked)}
                        className="rounded text-red-600 focus:ring-red-500"
                      />
                      <span>{tAcc.appleHideMyEmail}</span>
                    </label>
                  </div>

                  <button
                    onClick={() => handleQuickAppleSignIn(appleHideEmail)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-white bg-black dark:bg-slate-100 dark:text-slate-900 rounded-xl hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                  >
                    <AppleLogo className="w-4 h-4" />
                    <span>Conferma con Touch ID / Face ID</span>
                  </button>
                </div>
              )}

              {/* Step 2C: Email Direct Sign-In */}
              {authStep === 'email_form' && (
                <form
                  onSubmit={(e) => handleCustomSubmit(e, 'email')}
                  className="space-y-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 animate-in fade-in"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {tAcc.signInWithEmail}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAuthStep('options')}
                      className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    >
                      Indietro
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      {tAcc.fullNameLabel}
                    </label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="Es. Elena Bernasconi"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      {tAcc.emailLabel}
                    </label>
                    <input
                      type="email"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="es. elena.bernasconi@bluewin.ch"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    Accedi o Registrati
                  </button>
                </form>
              )}

              {/* Swiss Data Privacy Notice */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {tAcc.swissLPDNotice}
                </p>
              </div>
            </div>
          ) : (
            /* ============================================================ */
            /* AUTHENTICATED USER PROFILE & MANAGEMENT STATE */
            /* ============================================================ */
            <div className="space-y-5">
              {/* Profile Card Header */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/80 dark:to-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {currentUser.avatarUrl ? (
                      <img
                        src={currentUser.avatarUrl}
                        alt={currentUser.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-xs"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-red-600 text-white font-bold text-base flex items-center justify-center">
                        {currentUser.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 p-0.5 bg-white dark:bg-slate-900 rounded-full shadow-xs">
                      {currentUser.provider === 'google' ? (
                        <GoogleLogo className="w-3.5 h-3.5" />
                      ) : currentUser.provider === 'apple' ? (
                        <AppleLogo className="w-3.5 h-3.5 text-black dark:text-white" />
                      ) : (
                        <Mail className="w-3.5 h-3.5 text-red-600" />
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {currentUser.name}
                      </h3>
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                        <CheckCircle className="w-3 h-3" />
                        {tAcc.verifiedIdentity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {currentUser.email}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                  title={tAcc.signOut}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{tAcc.signOut}</span>
                </button>
              </div>

              {/* Feedback toast banner if synced */}
              {syncFeedback && (
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2 animate-in fade-in">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{syncFeedback}</span>
                </div>
              )}

              {/* Tab navigation */}
              <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 gap-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`pb-2.5 px-1 border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'profile'
                      ? 'border-red-600 text-red-600 dark:text-red-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {tAcc.profileTab}
                </button>
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`pb-2.5 px-1 border-b-2 transition-colors cursor-pointer flex items-center gap-1 ${
                    activeTab === 'saved'
                      ? 'border-red-600 text-red-600 dark:text-red-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5" />
                  {tAcc.savedTab} ({savedListings.length})
                </button>
                <button
                  onClick={() => setActiveTab('sync')}
                  className={`pb-2.5 px-1 border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'sync'
                      ? 'border-red-600 text-red-600 dark:text-red-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {tAcc.syncTab}
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`pb-2.5 px-1 border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'security'
                      ? 'border-red-600 text-red-600 dark:text-red-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {tAcc.securityTab}
                </button>
              </div>

              {/* TAB 1: Profile info */}
              {activeTab === 'profile' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {tAcc.fullNameLabel}
                      </label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {tAcc.phoneLabel}
                      </label>
                      <input
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {tAcc.preferredCantonLabel}
                    </label>
                    <div className="flex items-center gap-2">
                      <CantonFlag canton={editCanton as SwissCanton} className="w-5 h-5 rounded shadow-xs" />
                      <select
                        value={editCanton}
                        onChange={(e) => setEditCanton(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="Zürich">Zürich (ZH)</option>
                        <option value="Genève">Genève (GE)</option>
                        <option value="Vaud">Vaud (VD)</option>
                        <option value="Bern">Bern (BE)</option>
                        <option value="Basel-Stadt">Basel-Stadt (BS)</option>
                        <option value="Ticino">Ticino (TI)</option>
                        <option value="Luzern">Luzern (LU)</option>
                        <option value="Zug">Zug (ZG)</option>
                        <option value="Neuchâtel">Neuchâtel (NE)</option>
                        <option value="Fribourg">Fribourg (FR)</option>
                        <option value="Valais">Valais (VS)</option>
                        <option value="St. Gallen">St. Gallen (SG)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Salva Modifiche Profilo
                    </button>
                    <button
                      onClick={handleSyncDossierClick}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      {tAcc.syncedWithDossier}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: Saved listings */}
              {activeTab === 'saved' && (
                <div className="space-y-3">
                  {savedListings.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      <Heart className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                      {tAcc.noSavedListings}
                    </div>
                  ) : (
                    savedListings.map((listing) => (
                      <div
                        key={listing.id}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 flex items-center justify-between gap-3 bg-white dark:bg-slate-800/60 transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <CantonFlag canton={listing.canton} className="w-4 h-4 rounded" />
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {listing.title}
                            </h4>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {listing.city} ({listing.canton}) · {listing.rooms} locali · CHF {listing.rentTotalCHF}.- cc
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {onSelectListing && (
                            <button
                              onClick={() => {
                                onSelectListing(listing);
                                onClose();
                              }}
                              className="px-2 py-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded transition-colors"
                            >
                              Apri
                            </button>
                          )}
                          {onRemoveSaved && (
                            <button
                              onClick={() => onRemoveSaved(listing.id)}
                              className="px-2 py-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors"
                            >
                              Rimuovi
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 3: Dossier & Cloud Sync */}
              {activeTab === 'sync' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-3">
                    <div className="flex items-center gap-2">
                      <CloudCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                        {tAcc.cloudBackupActive}
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
                      Il tuo dossier di candidatura e i documenti allegati (Estratto esecuzioni, fiches di salario, certificato RC) sono protetti e sincronizzati con il tuo account svizzero.
                    </p>
                    <div className="text-[10px] text-emerald-700/80 dark:text-emerald-400">
                      {tAcc.lastSync}: {new Date().toLocaleDateString('fr-CH')} alle {new Date().toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <button
                    onClick={handleSyncDossierClick}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Aggiorna Dati Dossier dall'Account</span>
                  </button>
                </div>
              )}

              {/* TAB 4: Providers & Security */}
              {activeTab === 'security' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GoogleLogo className="w-5 h-5" />
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Google Account
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {currentUser.provider === 'google' ? 'Collegato e Attivo' : 'Non collegato'}
                        </p>
                      </div>
                    </div>
                    {currentUser.provider === 'google' ? (
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        Connesso
                      </span>
                    ) : (
                      <button
                        onClick={() => handleQuickGoogleSignIn()}
                        className="text-xs font-semibold text-blue-600 hover:underline"
                      >
                        Collega
                      </button>
                    )}
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AppleLogo className="w-5 h-5 text-black dark:text-white" />
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Apple ID
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {currentUser.provider === 'apple' ? 'Collegato e Attivo' : 'Non collegato'}
                        </p>
                      </div>
                    </div>
                    {currentUser.provider === 'apple' ? (
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        Connesso
                      </span>
                    ) : (
                      <button
                        onClick={() => handleQuickAppleSignIn()}
                        className="text-xs font-semibold text-slate-800 dark:text-slate-200 hover:underline"
                      >
                        Collega
                      </button>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        onLogout();
                        setAuthStep('options');
                      }}
                      className="w-full py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors"
                    >
                      {tAcc.switchAccount}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
