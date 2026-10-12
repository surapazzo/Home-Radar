import React, { useState } from 'react';
import { DossierState, Language, SwissCanton } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { CantonFlag } from './CantonFlag';
import {
  FileText,
  Copy,
  Check,
  User,
  Landmark,
  Download,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Briefcase,
  MapPin,
  Sparkles,
  Gauge,
  Award,
  TrendingUp,
  AlertTriangle,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { generateSwissDossierPdf } from '../utils/generateSwissDossierPdf';

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
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

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

  // -------------------------------------------------------------------------
  // SWISS DOSSIER STRENGTH INDEX (USPI / SVIT ALGORITHMIC RATING)
  // -------------------------------------------------------------------------
  const simRent =
    dossier.targetRentCHF && dossier.targetRentCHF > 0
      ? dossier.targetRentCHF
      : maxRentRecommended > 0
      ? maxRentRecommended
      : 2200;

  const salaryRatioPercent =
    dossier.monthlyNetSalaryCHF > 0
      ? Math.round((simRent / dossier.monthlyNetSalaryCHF) * 1000) / 10
      : 100;

  const salaryMultiplier =
    simRent > 0 ? Math.round((dossier.monthlyNetSalaryCHF / simRent) * 10) / 10 : 0;

  // 1. Solvency & Rent-to-Income Pillar (max 25 pts)
  let solvencyScore = 0;
  if (salaryRatioPercent <= 28) {
    solvencyScore = 25;
  } else if (salaryRatioPercent <= 33) {
    solvencyScore = 22;
  } else if (salaryRatioPercent <= 38) {
    solvencyScore = dossier.hasGuarantor ? 20 : 12;
  } else {
    solvencyScore = dossier.hasGuarantor ? 15 : 5;
  }

  // 2. Financial Guarantor Pillar (max 15 pts)
  let guarantorScore = 0;
  if (dossier.hasGuarantor) {
    guarantorScore = (dossier.guarantorMonthlySalaryCHF || 0) >= 4000 ? 15 : 12;
  } else {
    guarantorScore = salaryMultiplier >= 3.4 ? 12 : 0;
  }

  // 3. Employment Contract Stability & Probation Pillar (max 20 pts)
  let contractScore = 0;
  const emp = dossier.employmentType || '';
  if (emp.includes('CDI (Tempo Indeterminato 100%)') || emp.includes('Funzionario')) {
    contractScore += 12;
  } else if (emp.includes('CDI') || emp.includes('80%')) {
    contractScore += 10;
  } else if (emp.includes('Indipendente')) {
    contractScore += 7;
  } else {
    contractScore += 5;
  }
  if (dossier.probationPassed) {
    contractScore += 5;
  }
  const dur = dossier.employmentDuration || '';
  if (dur.includes('> 2') || dur.includes('> 3')) {
    contractScore += 3;
  } else if (dur.includes('1-2') || dur.includes('6-12')) {
    contractScore += 2;
  }

  // 4. Official 4-Pack Legal Documents Pillar (max 30 pts)
  let docsScore = 0;
  if (dossier.hasPoursuitesExtract) docsScore += 8;
  if (dossier.hasSalarySlips) docsScore += 8;
  if (dossier.hasIdentityDoc) docsScore += 7;
  if (dossier.hasRCAssurance) docsScore += 7;

  // 5. Complete Profile & Cover Letter Details (max 10 pts)
  let profileScore = 0;
  if (dossier.currentAddress && dossier.dateOfBirth && dossier.maritalStatus) profileScore += 5;
  if (dossier.customLetterNotes && dossier.customLetterNotes.trim().length > 10) profileScore += 5;

  const totalStrengthScore = Math.min(
    100,
    Math.max(0, solvencyScore + guarantorScore + contractScore + docsScore + profileScore)
  );

  let strengthTier: 'top' | 'solid' | 'moderate' | 'weak' = 'weak';
  let tierColor = 'text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:border-rose-900/60 dark:text-rose-400';
  let tierBadge: string = t.dossier.strengthTierWeak;
  if (totalStrengthScore >= 90) {
    strengthTier = 'top';
    tierColor = 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-300';
    tierBadge = t.dossier.strengthTierTop;
  } else if (totalStrengthScore >= 75) {
    strengthTier = 'solid';
    tierColor = 'text-teal-700 bg-teal-50 border-teal-200 dark:bg-teal-950/50 dark:border-teal-800 dark:text-teal-300';
    tierBadge = t.dossier.strengthTierSolid;
  } else if (totalStrengthScore >= 50) {
    strengthTier = 'moderate';
    tierColor = 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-300';
    tierBadge = t.dossier.strengthTierModerate;
  }

  // Actionable tips based on gaps
  const recommendations: string[] = [];
  if (!dossier.hasPoursuitesExtract) {
    recommendations.push(
      lang === 'de'
        ? 'Amtlichen Betreibungsauszug ohne Einträge beilegen (+8 Punkte, für alle Verwaltungen zwingend).'
        : lang === 'fr'
        ? 'Joindre un extrait de l\'Office des poursuites vierge de moins de 3 mois (+8 points, obligatoire pour toutes les régies).'
        : lang === 'it'
        ? 'Allega l\'estratto esecuzioni vergine datato meno di 3 mesi (+8 punti, requisito tassativo).'
        : 'Attach an official clean debt enforcement extract (< 3 months, +8 points, required by all agencies).'
    );
  }
  if (!dossier.hasRCAssurance) {
    recommendations.push(
      lang === 'de'
        ? 'Nachweis der Privathaftpflichtversicherung (RC ménage) ergänzen (+7 Punkte).'
        : lang === 'fr'
        ? 'Ajouter l\'attestation d\'assurance RC ménage privée avec couverture locative (+7 points).'
        : lang === 'it'
        ? 'Includi la polizza Responsabilità Civile (RC Privata / Mobilia domestica) (+7 punti).'
        : 'Provide personal liability insurance certificate covering tenant damages (+7 points).'
    );
  }
  if (!dossier.hasSalarySlips) {
    recommendations.push(
      lang === 'de'
        ? 'Die letzten 3 Lohnabrechnungen als Einkommensnachweis beifügen (+8 Punkte).'
        : lang === 'fr'
        ? 'Fournir les 3 dernières fiches de salaire consécutives (+8 points).'
        : lang === 'it'
        ? 'Allega le ultime 3 buste paga mensili consecutive (+8 punti).'
        : 'Add the last 3 consecutive monthly salary slips as income proof (+8 points).'
    );
  }
  if (salaryRatioPercent > 33 && !dossier.hasGuarantor) {
    recommendations.push(
      lang === 'de'
        ? 'Da die Zielmiete 33% übersteigt, empfiehlt sich ein solventer Bürge in der Schweiz (+15 Punkte).'
        : lang === 'fr'
        ? 'Le loyer cible dépasse 33% de votre salaire net. Désignez un garant solvable en Suisse (+15 points).'
        : lang === 'it'
        ? 'Il canone supera il 33% del tuo stipendio. Indica un garante residente in Svizzera (+15 punti).'
        : 'Target rent exceeds 33% of net salary. Add a solvent Swiss resident guarantor (+15 points).'
    );
  }
  if (!dossier.probationPassed) {
    recommendations.push(
      lang === 'de'
        ? 'Bestätigen Sie das Ende der Probezeit (Art. 335b OR), um Stabilität zu belegen (+5 Punkte).'
        : lang === 'fr'
        ? 'Validez la fin de période d\'essai (Art. 335b CO) pour garantir la stabilité de votre emploi (+5 points).'
        : lang === 'it'
        ? 'Conferma il superamento del periodo di prova (Art. 335b CO) per rassicurare la fiduciaria (+5 punti).'
        : 'Confirm completion of probationary period (Art. 335b CO) to assure employment stability (+5 points).'
    );
  }
  if (recommendations.length === 0) {
    recommendations.push(
      lang === 'de'
        ? 'Hervorragend! Ihr Bewerbungsdossier erfüllt die höchsten SVIT-Kriterien und wird prioritär behandelt.'
        : lang === 'fr'
        ? 'Excellent ! Votre dossier respecte les standards USPI les plus stricts et maximise vos chances.'
        : lang === 'it'
        ? 'Eccellente! Il tuo dossier è al massimo livello qualitativo USPI/SVIT per l\'assegnazione al primo turno.'
        : 'Outstanding! Your file satisfies all top Swiss USPI/SVIT standards and qualifies for fast-track review.'
    );
  }

  // Letter language state: auto follows canton or UI language, or user can override
  const [letterLanguage, setLetterLanguage] = useState<'auto' | 'de' | 'fr' | 'it' | 'en'>('auto');

  // Determine official regional language for the target Canton
  const isGermanCanton = ['Zürich', 'Bern', 'Basel-Stadt', 'Luzern', 'Zug', 'St. Gallen'].includes(
    dossier.targetCanton || 'Zürich'
  );
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

  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    try {
      generateSwissDossierPdf(dossier, lang);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4500);
    } catch (err) {
      console.error('Failed to generate PDF', err);
    } finally {
      setIsGeneratingPdf(false);
    }
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

      {/* Hero PDF Export Card (Swiss Real Estate Standards USPI / SVIT) */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-xl p-5 sm:p-6 shadow-md transition-all">
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <svg className="w-64 h-64 text-white" viewBox="0 0 100 100" fill="currentColor">
            <rect x="38" y="10" width="24" height="80" rx="4" />
            <rect x="10" y="38" width="80" height="24" rx="4" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-semibold backdrop-blur-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Standard Svizzero USPI / SVIT (Art. 253 CO)</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Download className="w-5 h-5 text-white/90" />
              {t.dossier.downloadPdf}
            </h2>
            <p className="text-xs sm:text-sm text-red-100 leading-relaxed">
              Esporta il tuo dossier completo in formato <strong>PDF A4 a 2 pagine</strong>:
              Fiche anagrafica ufficiale, calcolo di solvibilità certificato (&lt; 33%), checklist delle 4 attestazioni obbligatorie e lettera di candidatura indirizzata alla gérance nel rispetto degli standard svizzeri.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-red-100/90">
              <span className="inline-flex items-center gap-1 bg-black/15 px-2 py-0.5 rounded">
                ✓ 2 Pagine A4
              </span>
              <span className="inline-flex items-center gap-1 bg-black/15 px-2 py-0.5 rounded">
                ✓ Canton {dossier.targetCanton || 'Zürich'}
              </span>
              <span className="inline-flex items-center gap-1 bg-black/15 px-2 py-0.5 rounded">
                ✓ Lingua: {effectiveLetterLang.toUpperCase()}
              </span>
              <span className="inline-flex items-center gap-1 bg-black/15 px-2 py-0.5 rounded">
                ✓ Protezione Dati (LPD/DSG)
              </span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-start sm:items-end gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-2.5 px-5 py-3 rounded-lg bg-white hover:bg-slate-50 active:bg-slate-100 text-red-700 font-bold text-xs sm:text-sm shadow-md transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {isGeneratingPdf ? (
                <>
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                  <span>{t.dossier.downloadingPdf}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-red-600" />
                  <span>{t.dossier.downloadPdf}</span>
                </>
              )}
            </button>

            {downloadSuccess && (
              <div className="inline-flex items-center gap-1.5 text-xs text-white font-medium bg-emerald-600/90 px-3 py-1 rounded-md shadow-xs animate-fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t.dossier.pdfSuccess}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dossier Strength Indicator (Rating Algoritmico Régies USPI / SVIT) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 mb-1.5">
              <Gauge className="w-3.5 h-3.5" />
              <span>{t.dossier.dossierStrengthTitle}</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>{t.dossier.dossierStrengthScore}:</span>
              <span className="font-mono text-xl">{totalStrengthScore}/100</span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${tierColor}`}>
                {tierBadge}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.dossier.dossierStrengthSubtitle}
            </p>
          </div>

          {/* Radial score gauge */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-16 h-16 relative flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r="26" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="6" fill="none" />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke={totalStrengthScore >= 90 ? '#10b981' : totalStrengthScore >= 75 ? '#0d9488' : totalStrengthScore >= 50 ? '#f59e0b' : '#f43f5e'}
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray="163"
                  strokeDashoffset={163 - (163 * totalStrengthScore) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100">
                  {totalStrengthScore}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
          {/* Pillar 1: Solvency Ratio */}
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-between">
              <span>{t.dossier.solvencyPillar}</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">{solvencyScore}/25 pts</span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">
              {salaryRatioPercent}% <span className="text-[11px] font-normal text-slate-400">({salaryMultiplier}×)</span>
            </div>
            <div className="mt-1.5 w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full ${salaryRatioPercent <= 33 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                style={{ width: `${Math.min(100, (solvencyScore / 25) * 100)}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
              {salaryRatioPercent <= 33 ? '✓ Sotto la soglia del 33%' : '⚠ Supera il 33% (consigliato garante)'}
            </div>
          </div>

          {/* Pillar 2: Guarantor */}
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-between">
              <span>{t.dossier.guarantorPillar}</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">{guarantorScore}/15 pts</span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
              {dossier.hasGuarantor ? `Garante: CHF ${formatCHF(dossier.guarantorMonthlySalaryCHF || 0)}.-` : salaryMultiplier >= 3.4 ? 'Autosufficiente (>3.3×)' : 'Nessun Garante'}
            </div>
            <div className="mt-1.5 w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${Math.min(100, (guarantorScore / 15) * 100)}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
              {dossier.hasGuarantor ? '✓ Solvibilità rinforzata' : salaryMultiplier >= 3.4 ? '✓ Reddito primario eccellente' : 'Possibile richiesta di garanzia'}
            </div>
          </div>

          {/* Pillar 3: Contract Stability */}
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-between">
              <span>{t.dossier.contractPillar}</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">{contractScore}/20 pts</span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
              {dossier.employmentType || 'CDI 100%'}
            </div>
            <div className="mt-1.5 w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${Math.min(100, (contractScore / 20) * 100)}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              {dossier.probationPassed ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ Periodo di prova superato</span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400">Probezeit in corso</span>
              )}
            </div>
          </div>

          {/* Pillar 4: Documents */}
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-between">
              <span>{t.dossier.docsPillar}</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">{docsScore}/30 pts</span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">
              {completedCount}/4 {t.dossier.ready}
            </div>
            <div className="mt-1.5 w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full ${completedCount === 4 ? 'bg-emerald-500' : 'bg-red-500'}`}
                style={{ width: `${(completedCount / 4) * 100}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
              {completedCount === 4 ? '✓ Pacchetto legale 100%' : `Mancano ${4 - completedCount} documenti`}
            </div>
          </div>
        </div>

        {/* Actionable Recommendations */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.dossier.recommendationsTitle}</span>
          </div>
          <div className="space-y-1">
            {recommendations.map((tip, idx) => (
              <div key={idx} className="text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                <span className="text-red-500 font-bold shrink-0">•</span>
                <span>{tip}</span>
              </div>
            ))}
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

              {/* Target Rent Simulator for Solvency Ratio */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                  <span>{t.dossier.targetRentSimLabel}</span>
                  <span className={`text-[11px] font-mono font-bold ${salaryRatioPercent <= 33 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {salaryRatioPercent}% del reddito ({salaryMultiplier}×)
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                    CHF
                  </span>
                  <input
                    type="number"
                    step="50"
                    value={dossier.targetRentCHF || 2200}
                    onChange={(e) =>
                      setDossier((p) => ({
                        ...p,
                        targetRentCHF: Math.max(0, Number(e.target.value)),
                      }))
                    }
                    className="w-full pl-12 pr-4 py-2 text-sm font-mono font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Swiss Guarantor (Caution Solidaire) Section */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={dossier.hasGuarantor}
                    onChange={(e) =>
                      setDossier((p) => ({ ...p, hasGuarantor: e.target.checked }))
                    }
                    className="mt-0.5 w-4 h-4 text-red-600 rounded border-slate-300 dark:border-slate-600 focus:ring-red-500"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {t.dossier.guarantorLabel}
                    </span>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                      Risolve le situazioni con rapporto canone/stipendio &gt; 33% o per giovani lavoratori / espatriati.
                    </p>
                  </div>
                </label>

                {dossier.hasGuarantor && (
                  <div className="pl-6 pt-1">
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      {t.dossier.guarantorSalaryLabel}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                        CHF
                      </span>
                      <input
                        type="number"
                        step="100"
                        value={dossier.guarantorMonthlySalaryCHF || 5000}
                        onChange={(e) =>
                          setDossier((p) => ({
                            ...p,
                            guarantorMonthlySalaryCHF: Math.max(0, Number(e.target.value)),
                          }))
                        }
                        className="w-full pl-12 pr-4 py-1.5 text-xs font-mono font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                )}
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

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">{t.dossier.email}</label>
                <input
                  type="email"
                  value={dossier.email}
                  onChange={(e) => setDossier((p) => ({ ...p, email: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* Swiss Real Estate Specific: Date of Birth */}
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{t.dossier.dateOfBirth}</span>
                </label>
                <input
                  type="date"
                  value={dossier.dateOfBirth || '1992-08-14'}
                  onChange={(e) => setDossier((p) => ({ ...p, dateOfBirth: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* Swiss Real Estate Specific: Marital Status */}
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  {t.dossier.maritalStatus}
                </label>
                <select
                  value={dossier.maritalStatus || 'Celibe / Nubile'}
                  onChange={(e) => setDossier((p) => ({ ...p, maritalStatus: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                >
                  <option value="Celibe / Nubile">Celibe / Nubile (Single / Ledig)</option>
                  <option value="Coniugato/a">Coniugato/a (Marié/e / Verheiratet)</option>
                  <option value="Divorziato/a">Divorziato/a (Divorcé/e / Geschieden)</option>
                  <option value="Separato/a">Separato/a (Séparé/e / Getrennt)</option>
                  <option value="Partenariato registrato">Partenariato registrato (Partenariat)</option>
                </select>
              </div>

              {/* Swiss Real Estate Specific: Employment Contract */}
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1 flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-slate-400" />
                  <span>{t.dossier.employmentType}</span>
                </label>
                <select
                  value={dossier.employmentType || 'CDI (Tempo Indeterminato 100%)'}
                  onChange={(e) => setDossier((p) => ({ ...p, employmentType: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                >
                  <option value="CDI (Tempo Indeterminato 100%)">CDI (Tempo Indeterminato 100%)</option>
                  <option value="CDI (Tempo Indeterminato 80%)">CDI (Tempo Indeterminato 80%)</option>
                  <option value="CDD (Tempo Determinato)">CDD (Tempo Determinato)</option>
                  <option value="Indipendente / Freelance">Indipendente / Freelance</option>
                  <option value="Funzionario Internazionale / Accademico">Funzionario Internazionale / Accademico</option>
                </select>
              </div>

              {/* Swiss Real Estate Specific: Contract Duration / Tenure */}
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1 flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-slate-400" />
                  <span>{t.dossier.employmentDurationLabel}</span>
                </label>
                <select
                  value={dossier.employmentDuration || '> 2 anni'}
                  onChange={(e) => setDossier((p) => ({ ...p, employmentDuration: e.target.value }))}
                  className="w-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                >
                  <option value="> 3 anni">&gt; 3 anni (Massima anzianità)</option>
                  <option value="> 2 anni">&gt; 2 anni (Elevata stabilità)</option>
                  <option value="1-2 anni">1 - 2 anni (Stabile)</option>
                  <option value="6-12 mesi">6 - 12 mesi</option>
                  <option value="< 6 mesi">&lt; 6 mesi (Nuovo impiego)</option>
                </select>
              </div>

              {/* Swiss Real Estate Specific: Probation Period Passed */}
              <div className="sm:col-span-2 pt-1">
                <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800/40 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={dossier.probationPassed ?? true}
                    onChange={(e) =>
                      setDossier((p) => ({ ...p, probationPassed: e.target.checked }))
                    }
                    className="w-4 h-4 text-red-600 rounded border-slate-300 dark:border-slate-600 focus:ring-red-500"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {t.dossier.probationPassedLabel}
                    </span>
                    <span className="ml-1 text-[11px] text-slate-500 dark:text-slate-400">
                      — Rimuove il rischio di recesso con 7 giorni di preavviso per la régie.
                    </span>
                  </div>
                </label>
              </div>

              {/* Swiss Real Estate Specific: Current Residence Address */}
              <div className="sm:col-span-2">
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{t.dossier.currentAddress}</span>
                </label>
                <input
                  type="text"
                  value={dossier.currentAddress || 'Avenue de la Gare 14, 1003 Lausanne'}
                  onChange={(e) => setDossier((p) => ({ ...p, currentAddress: e.target.value }))}
                  placeholder="Via, civico, NPA e città attuale (es. Avenue de la Gare 14, 1003 Lausanne)"
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
