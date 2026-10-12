import React, { useState } from 'react';
import { DossierState, Language, SwissCanton } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { CantonFlag } from './CantonFlag';
import { FileText, Copy, Check, User, Landmark } from 'lucide-react';

interface DossierViewProps {
  lang: Language;
  dossier: DossierState;
  setDossier: React.Dispatch<React.SetStateAction<DossierState>>;
}

const SWISS_CANTONS: SwissCanton[] = [
  'Zürich',
  'Genève',
  'Vaud',
  'Basel-Stadt',
  'Bern',
  'Ticino',
  'Luzern',
  'Zug',
  'Neuchâtel',
  'Fribourg',
  'Valais',
  'St. Gallen',
];

export const DossierView: React.FC<DossierViewProps> = ({ lang, dossier, setDossier }) => {
  const t = TRANSLATIONS[lang];
  const [copiedLetter, setCopiedLetter] = useState(false);

  const formatCHF = (val: number) => {
    return new Intl.NumberFormat('fr-CH').format(val);
  };

  // Rule of 1/3 calculation
  const maxRentRecommended = Math.round(dossier.monthlyNetSalaryCHF * 0.33);

  // Document checklist completion
  const checklistItems = [
    { key: 'hasIdentityDoc', label: t.dossier.docIdentity },
    { key: 'hasPoursuitesExtract', label: t.dossier.docPoursuites },
    { key: 'hasSalarySlips', label: t.dossier.docSalary },
    { key: 'hasRCAssurance', label: t.dossier.docRc },
  ];

  const completedCount = checklistItems.filter(
    (item) => dossier[item.key as keyof DossierState] === true
  ).length;

  const percentComplete = Math.round((completedCount / checklistItems.length) * 100);

  // Letter language state: auto follows canton or UI language, or user can override
  const [letterLanguage, setLetterLanguage] = useState<'auto' | 'de' | 'fr' | 'it' | 'en'>('auto');

  // Determine official regional language for the target Canton
  const isGermanCanton = ['Zürich', 'Bern', 'Basel-Stadt', 'Luzern', 'Zug', 'St. Gallen'].includes(dossier.targetCanton || 'Zürich');
  const isItalianCanton = dossier.targetCanton === 'Ticino';

  const effectiveLetterLang =
    letterLanguage === 'auto'
      ? lang === 'en'
        ? 'en'
        : isGermanCanton
        ? 'de'
        : isItalianCanton
        ? 'it'
        : 'fr'
      : letterLanguage;

  // Generate Official Canton-Tailored Cover Letter
  let generatedLetter = '';

  if (effectiveLetterLang === 'de') {
    generatedLetter = `Sehr geehrte Damen und Herren,

Hiermit bewerbe ich mich mit grossem Interesse um die Mietwohnung im Kanton ${dossier.targetCanton || 'Zürich'}.

Derzeit bin ich als ${dossier.currentProfession || 'Fachkraft'} bei der Firma ${dossier.employer || 'meinem Arbeitgeber'} angestellt. Mit einem regelmässigen monatlichen Nettoeinkommen von CHF ${formatCHF(dossier.monthlyNetSalaryCHF)}.- erfülle ich die übliche Schweizer Bonitätsregel (Bruttomiete unter einem Drittel des Nettoeinkommens).

Ich besitze eine Aufenthaltsbewilligung der Kategorie ${dossier.permitType}. In der Anlage finden Sie mein vollständiges und geprüftes Schweizer Bewerbungsdossier:
1. Kopie meines amtlichen Ausweises und Aufenthaltsbewilligung (Kategorie ${dossier.permitType}).
2. Originaler Betreibungsauszug ohne Einträge (nicht älter als 3 Monate).
3. Die letzten 3 Lohnabrechnungen als lückenloser Einkommensnachweis.
4. Nachweis der Privathaftpflicht- und Hausratversicherung (RC ménage).

${dossier.customLetterNotes ? `${dossier.customLetterNotes}\n\n` : ''}Als ruhige, solvente und zuverlässige Mietpartei schätze ich ein gepflegtes Wohnumfeld und stehe Ihnen für eine Besichtigung oder Rückfragen jederzeit gerne zur Verfügung.

Freundliche Grüsse

${dossier.applicantName}
Tel.: ${dossier.phone}
E-Mail: ${dossier.email}`;
  } else if (effectiveLetterLang === 'it') {
    generatedLetter = `Gentile Fiduciaria / Proprietà,

Con la presente desidero sottoporre la mia formale candidatura per la locazione dell'immobile situato nel Canton ${dossier.targetCanton || 'Ticino'}.

Attualmente impiegato/a come ${dossier.currentProfession || 'professionista'} presso la società ${dossier.employer || 'il mio datore di lavoro'}, dispongo di un reddito netto mensile certificato di CHF ${formatCHF(dossier.monthlyNetSalaryCHF)}.-, pienamente conforme alla regola di solvibilità svizzera (pigione lorda inferiore a un terzo dello stipendio netto).

Titolare di permesso di soggiorno categoria ${dossier.permitType}, allego la documentazione completa:
1. Copia documento di identità e permesso di soggiorno (cat. ${dossier.permitType}).
2. Estratto originale dell'Ufficio Esecuzioni e Fallimenti privo di precetti (< 3 mesi).
3. Ultime 3 buste paga mensili consecutive.
4. Attestazione polizza assicurativa Responsabilità Civile (RC) privata e mobilia domestica.

${dossier.customLetterNotes ? `${dossier.customLetterNotes}\n\n` : ''}Persona seria, tranquilla e rispettosa delle regole condominiali, rimango a disposizione per una visita dell'immobile o per ulteriori chiarimenti.

Cordiali saluti,

${dossier.applicantName}
Tel: ${dossier.phone}
Email: ${dossier.email}`;
  } else if (effectiveLetterLang === 'en') {
    generatedLetter = `Dear Property Management / Landlord,

I am writing to formally submit my rental application for the property in Canton ${dossier.targetCanton || 'Switzerland'}.

Currently employed as ${dossier.currentProfession || 'Senior Professional'} at ${dossier.employer || 'my employer'}, I enjoy stable and secure financial circumstances with a verified net monthly income of CHF ${formatCHF(dossier.monthlyNetSalaryCHF)}.-, strictly complying with the standard Swiss solvency ceiling (gross rent under 33% of household net income).

Holder of a Swiss residence permit category ${dossier.permitType}, please find attached my complete application file:
1. Copy of official identification passport and Swiss residence permit (${dossier.permitType}).
2. Original Debt Enforcement Register Extract (Office des poursuites / Betreibungsauszug) free of any entries (< 3 months).
3. Last 3 consecutive monthly salary slips proving stable income.
4. Proof of Swiss Household & Personal Liability Insurance (RC ménage / Privathaftpflicht).

${dossier.customLetterNotes ? `${dossier.customLetterNotes}\n\n` : ''}As a quiet, solvent, and respectful tenant who values a well-kept living environment, I remain at your complete disposal for a flat viewing or any further information.

Kind regards,

${dossier.applicantName}
Phone: ${dossier.phone}
Email: ${dossier.email}`;
  } else {
    generatedLetter = `Madame, Monsieur,

Par la présente, je vous soumets avec grand intérêt mon dossier de candidature pour la location de l'appartement situé dans le Canton de ${dossier.targetCanton || 'Vaud'}.

Actuellement en poste en tant que ${dossier.currentProfession || 'professionnel(le)'} auprès de la société ${dossier.employer || 'mon employeur'}, je bénéficie d'une situation financière stable et pérenne avec un revenu mensuel net de CHF ${formatCHF(dossier.monthlyNetSalaryCHF)}.-, respectant scrupuleusement la règle prudentielle de solvabilité (loyer inférieur au tiers du revenu net).

Titulaire d'un permis de séjour de catégorie ${dossier.permitType}, vous trouverez en pièce jointe mon dossier complet et certifié comprenant :
1. La copie de ma pièce d'identité officielle et permis de séjour (${dossier.permitType}).
2. L'attestation originale de l'Office des Poursuites et Faillites vierge de toute inscription datant de moins de 3 mois.
3. Mes trois dernières fiches de salaire attestant de mes revenus réguliers.
4. L'attestation d'assurance Responsabilité Civile (RC) ménage.

${dossier.customLetterNotes ? `${dossier.customLetterNotes}\n\n` : ''}De nature calme, respectueuse du voisinage et des règles de vie commune de l'immeuble, je me tiens à votre entière disposition pour tout renseignement complémentaire ou pour convenir d'une visite.

En vous remerciant par avance de l'attention que vous porterez à ma candidature, je vous prie d'agréer, Madame, Monsieur, mes salutations les plus distinguées.

${dossier.applicantName}
Tél : ${dossier.phone}
Email : ${dossier.email}`;
  }

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Title & Intro */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
              {t.dossier.pageTitle}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t.dossier.pageSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-400 dark:text-slate-500">{t.dossier.completeness}</div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                {percentComplete}% {t.dossier.ready}
              </div>
            </div>
            <div className="w-14 h-14 relative flex items-center justify-center">
              <svg className="w-14 h-14 transform -rotate-90">
                <circle cx="28" cy="28" r="22" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="5" fill="none" />
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  stroke={percentComplete === 100 ? '#10b981' : '#dc2626'}
                  strokeWidth="5"
                  fill="none"
                  strokeDasharray="138"
                  strokeDashoffset={138 - (138 * percentComplete) / 100}
                  className="transition-all duration-300"
                />
              </svg>
              <span className="absolute text-xs font-bold text-slate-700 dark:text-slate-300">
                {completedCount}/4
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Solvency & Checklist */}
        <div className="lg:col-span-6 space-y-6">
          {/* Solvency Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              {t.dossier.solvencyTitle}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.dossier.salaryLabel}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                    CHF
                  </span>
                  <input
                    type="number"
                    step="100"
                    value={dossier.monthlyNetSalaryCHF}
                    onChange={(e) =>
                      setDossier((p) => ({
                        ...p,
                        monthlyNetSalaryCHF: Math.max(0, Number(e.target.value)),
                      }))
                    }
                    className="w-full pl-12 pr-4 py-2 text-sm font-mono font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  {t.dossier.solvencyHint}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {t.dossier.budgetRecommended}
                  </div>
                  <div className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                    CHF {formatCHF(maxRentRecommended)}.- <span className="text-xs text-slate-400 font-normal">{t.dossier.perMonth}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded">
                    max 33%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Mandatory Documents Checklist */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              {t.dossier.fourDocumentsTitle}
            </h2>

            <div className="space-y-2.5">
              {checklistItems.map((item) => {
                const isChecked = dossier[item.key as keyof DossierState] === true;
                return (
                  <label
                    key={item.key}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer select-none ${
                      isChecked
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60'
                        : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) =>
                        setDossier((p) => ({ ...p, [item.key]: e.target.checked }))
                      }
                      className="mt-0.5 w-4 h-4 text-red-600 rounded border-slate-300 dark:border-slate-600 focus:ring-red-500"
                    />
                    <div className="text-xs">
                      <span className={`font-semibold ${isChecked ? 'text-emerald-900 dark:text-emerald-300' : 'text-slate-800 dark:text-slate-200'}`}>
                        {item.label}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Applicant Details & Motivation Letter */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              {t.dossier.applicantTitle}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">{t.dossier.fullName}</label>
                <input
                  type="text"
                  value={dossier.applicantName}
                  onChange={(e) => setDossier((p) => ({ ...p, applicantName: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1 flex items-center justify-between">
                  <span>{t.dossier.targetCanton}</span>
                  <CantonFlag canton={dossier.targetCanton || 'Zürich'} size="sm" />
                </label>
                <select
                  value={dossier.targetCanton || 'Zürich'}
                  onChange={(e) => setDossier((p) => ({ ...p, targetCanton: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                >
                  {SWISS_CANTONS.map((c) => (
                    <option key={c} value={c}>
                      Canton {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">{t.dossier.permitType}</label>
                <select
                  value={dossier.permitType}
                  onChange={(e) =>
                    setDossier((p) => ({ ...p, permitType: e.target.value as any }))
                  }
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                >
                  <option value="B">{t.dossier.permitB}</option>
                  <option value="C">{t.dossier.permitC}</option>
                  <option value="L">{t.dossier.permitL}</option>
                  <option value="G">{t.dossier.permitG}</option>
                  <option value="CH">{t.dossier.permitCH}</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">{t.dossier.profession}</label>
                <input
                  type="text"
                  value={dossier.currentProfession}
                  onChange={(e) =>
                    setDossier((p) => ({ ...p, currentProfession: e.target.value }))
                  }
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">{t.dossier.employer}</label>
                <input
                  type="text"
                  value={dossier.employer}
                  onChange={(e) => setDossier((p) => ({ ...p, employer: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">{t.dossier.phone}</label>
                <input
                  type="text"
                  value={dossier.phone}
                  onChange={(e) => setDossier((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">{t.dossier.email}</label>
                <input
                  type="email"
                  value={dossier.email}
                  onChange={(e) => setDossier((p) => ({ ...p, email: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Letter of Motivation */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-red-600 dark:text-red-400" />
                  {t.dossier.letterTitle}
                </h2>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                  <CantonFlag canton={dossier.targetCanton || 'Zürich'} size="sm" />
                  <span>Kanton {dossier.targetCanton || 'Zürich'}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Letter Language Switcher */}
                <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-[11px] font-medium">
                  {(
                    [
                      { id: 'auto', label: 'Auto' },
                      { id: 'fr', label: 'FR' },
                      { id: 'de', label: 'DE' },
                      { id: 'it', label: 'IT' },
                      { id: 'en', label: 'EN' },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setLetterLanguage(opt.id)}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        letterLanguage === opt.id
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-semibold'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCopyLetter}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
                >
                  {copiedLetter ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{t.dossier.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t.dossier.copyText}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <pre className="text-xs bg-slate-50 dark:bg-slate-950 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 whitespace-pre-wrap font-sans text-slate-700 dark:text-slate-300 max-h-72 overflow-y-auto leading-relaxed select-all">
              {generatedLetter}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
