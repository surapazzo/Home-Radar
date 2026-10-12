import React, { useState } from 'react';
import { AgentLog, Listing, DossierState, Language, FilterState } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import {
  Bot,
  Play,
  RefreshCw,
  Terminal,
  Zap,
  ShieldCheck,
  User,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Activity,
  Search,
  Train,
  Award,
  Sparkles,
} from 'lucide-react';
import { CantonFlag } from './CantonFlag';

interface AgentWorkbenchProps {
  lang: Language;
  logs: AgentLog[];
  onAddLog: (log: AgentLog) => void;
  onClearLogs: () => void;
  onInjectListing: (listing: Listing) => void;
  dossier: DossierState;
  listingsCount: number;
  onApplyFilters?: (filters: Partial<FilterState>) => void;
  onSelectView?: (view: 'feed' | 'dossier' | 'agents') => void;
}

export const AgentWorkbench: React.FC<AgentWorkbenchProps> = ({
  lang,
  logs,
  onAddLog,
  onClearLogs,
  onInjectListing,
  dossier,
  listingsCount,
  onApplyFilters,
  onSelectView,
}) => {
  const t = TRANSLATIONS[lang];
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'Portal Crawler' | 'Facebook Scout' | 'Dossier Matcher' | 'UX Agent Gland' | 'UX Agent Zürich'
  >('all');

  const [isRunningGland, setIsRunningGland] = useState(false);
  const [isRunningZurich, setIsRunningZurich] = useState(false);
  const [isRunningDual, setIsRunningDual] = useState(false);

  const [glandUxResults, setGlandUxResults] = useState<{
    matches: number;
    sampleListingTitle: string;
    commuteHub: string;
    commuteMin: number;
    solvencyPercent: number;
    latencyMs: number;
    status: 'optimal';
  } | null>(null);

  const [zurichUxResults, setZurichUxResults] = useState<{
    matches: number;
    sampleListingTitle: string;
    commuteHub: string;
    commuteMin: number;
    solvencyPercent: number;
    latencyMs: number;
    status: 'optimal';
  } | null>(null);

  const triggerGlandUxTest = () => {
    setIsRunningGland(true);
    const now = () => new Date().toLocaleTimeString('fr-CH');

    // Step 1: Initialize User Persona Sophie
    onAddLog({
      id: `ux-gland-${Date.now()}-1`,
      timestamp: now(),
      agentName: 'UX Agent Gland',
      type: 'info',
      message:
        lang === 'it'
          ? '🧑‍💼 Inizializzazione Persona "Sophie" (Senior Regulatory Specialist, stipendio CHF 7\'200.-/mese, ricerca alloggio a Gland VD / La Côte)...'
          : lang === 'fr'
          ? '🧑‍💼 Initialisation Persona "Sophie" (Spécialiste Réglementaire, revenu net CHF 7\'200.-/mois, recherche à Gland VD / La Côte)...'
          : lang === 'de'
          ? '🧑‍💼 Initialisierung Persona "Sophie" (Regulatorische Expertin, Nettoeinkommen CHF 7\'200.-/Mt., Wohnungssuche in Gland VD / La Côte)...'
          : '🧑‍💼 Initializing Persona "Sophie" (Senior Specialist, net salary CHF 7\'200.-/mo, apartment search in Gland VD / La Côte)...',
    });

    // Step 2: Apply Filters
    setTimeout(() => {
      onAddLog({
        id: `ux-gland-${Date.now()}-2`,
        timestamp: now(),
        agentName: 'UX Agent Gland',
        type: 'scrape',
        message:
          lang === 'it'
            ? '🔍 Applicazione parametri di ricerca: Cantone = Vaud, Città = Gland (NPA 1196), Budget max = CHF 2\'400.-, Locali = 2.5 - 3.5, Prossimità stazione CFF...'
            : lang === 'fr'
            ? '🔍 Application des critères de recherche : Canton = Vaud, Ville = Gland (NPA 1196), Budget max = CHF 2\'400.-, Pièces = 2.5 - 3.5, Proche Gare CFF...'
            : lang === 'de'
            ? '🔍 Suchfilter angewendet: Kanton = Waadt, Stadt = Gland (PLZ 1196), Max-Miete = CHF 2\'400.-, Zimmer = 2.5 - 3.5, SBB-Nähe...'
            : '🔍 Applied search criteria: Canton = Vaud, City = Gland (Postal 1196), Max Rent = CHF 2\'400.-, Rooms = 2.5 - 3.5, SBB proximity...',
      });
    }, 450);

    // Step 3: Database & Portal Querying
    setTimeout(() => {
      onAddLog({
        id: `ux-gland-${Date.now()}-3`,
        timestamp: now(),
        agentName: 'UX Agent Gland',
        type: 'info',
        message:
          lang === 'it'
            ? '📊 Scansione inventario attivo svizzero: individuati 2 alloggi a Gland (Chemin de Riant-Coteau 7, 3.5p CHF 2\'360.- & Rue Mauverney 14, 2.5p CHF 1\'850.-). Latenza ricerca: 46ms.'
            : lang === 'fr'
            ? '📊 Requête inventaire suisse : 2 logements identifiés à Gland (Chemin de Riant-Coteau 7, 3.5p CHF 2\'360.- & Rue Mauverney 14, 2.5p CHF 1\'850.-). Latence : 46ms.'
            : lang === 'de'
            ? '📊 Schweizer Bestandsabfrage: 2 passende Wohnungen in Gland identifiziert (Chemin de Riant-Coteau 7, 3.5 Zi. CHF 2\'360.- & Rue Mauverney 14, 2.5 Zi. CHF 1\'850.-). Latenz: 46ms.'
            : '📊 Scanned Swiss inventory: matched 2 properties in Gland (Chemin de Riant-Coteau 7, 3.5 rms CHF 2\'360.- & Rue Mauverney 14, 2.5 rms CHF 1\'850.-). Latency: 46ms.',
      });
    }, 900);

    // Step 4: SBB/CFF Transit Connection
    setTimeout(() => {
      onAddLog({
        id: `ux-gland-${Date.now()}-4`,
        timestamp: now(),
        agentName: 'UX Agent Gland',
        type: 'scrape',
        message:
          lang === 'it'
            ? '🚆 Validazione mobilità CFF / Taktfahrplan: Stazione Gland CFF a 4 min a piedi -> Ginevra Cornavin in 22 min, Losanna Gare in 28 min. Indice accessibilità pendolare: 98/100.'
            : lang === 'fr'
            ? '🚆 Validation cadence CFF : Gare de Gland CFF à 4 min à pied -> Genève Cornavin en 22 min, Lausanne Gare en 28 min. Score de mobilité : 98/100.'
            : lang === 'de'
            ? '🚆 SBB-Taktfahrplan-Validierung: Bahnhof Gland in 4 Gehminuten -> Genève Cornavin in 22 Min., Lausanne Gare in 28 Min. Mobilitätsindex: 98/100.'
            : '🚆 SBB/CFF schedule validated: Gland station 4 min walk -> Genève Cornavin in 22 min, Lausanne Gare in 28 min. Mobility score: 98/100.',
      });
    }, 1400);

    // Step 5: Solvency Audit & Dossier Readiness
    setTimeout(() => {
      const msgDone =
        lang === 'it'
          ? '✅ Audit solvibilità superato con successo: Pigione media CHF 2\'105.- su stipendio CHF 7\'200.- = 29.2% (< 33% USPI). CDI 100%, 4/4 attestazioni conformi. Esperienza utente: 100% SUCCESSO.'
          : lang === 'fr'
          ? '✅ Audit de solvabilité validé : Loyer moyen CHF 2\'105.- sur revenu CHF 7\'200.- = 29.2% (< 33% USPI). CDI 100%, 4/4 justificatifs conformes. Expérience utilisateur : 100% SUCCÈS.'
          : lang === 'de'
          ? '✅ Bonitätsprüfung bestanden: Durchschnittsmiete CHF 2\'105.- bei Gehalt CHF 7\'200.- = 29.2% (< 33% SVIT). CDI 100%, 4/4 Dokumente beiliegend. UX-Ergebnis: 100% ERFOLGREICH.'
          : '✅ Solvency audit passed: Average rent CHF 2\'105.- vs CHF 7\'200.- income = 29.2% (< 33% USPI rule). CDI 100%, 4/4 verified documents. UX Result: 100% SUCCESS.';

      onAddLog({
        id: `ux-gland-${Date.now()}-5`,
        timestamp: now(),
        agentName: 'UX Agent Gland',
        type: 'success',
        message: msgDone,
        listingId: 'ch-vd-08',
      });

      setGlandUxResults({
        matches: 2,
        sampleListingTitle: '3.5 pièces moderne à Gland (Chemin de Riant-Coteau)',
        commuteHub: 'Genève Cornavin / Lausanne',
        commuteMin: 22,
        solvencyPercent: 32.7,
        latencyMs: 46,
        status: 'optimal',
      });

      setIsRunningGland(false);
    }, 1900);
  };

  const triggerZurichUxTest = () => {
    setIsRunningZurich(true);
    const now = () => new Date().toLocaleTimeString('fr-CH');

    // Step 1: Initialize User Persona Florian
    onAddLog({
      id: `ux-zh-${Date.now()}-1`,
      timestamp: now(),
      agentName: 'UX Agent Zürich',
      type: 'info',
      message:
        lang === 'it'
          ? '🧑‍💻 Inizializzazione Persona "Florian" (Senior Software Engineer a Zurigo centro, stipendio CHF 9\'200.-/mese, target Canton Zurigo)...'
          : lang === 'fr'
          ? '🧑‍💻 Initialisation Persona "Florian" (Ingénieur Logiciel à Zurich centre, revenu net CHF 9\'200.-/mois, recherche Canton de Zurich)...'
          : lang === 'de'
          ? '🧑‍💻 Initialisierung Persona "Florian" (Software Engineer im Zentrum Zürich, Nettoeinkommen CHF 9\'200.-/Mt., Suche im Kanton Zürich)...'
          : '🧑‍💻 Initializing Persona "Florian" (Senior Software Engineer in Central Zurich, net income CHF 9\'200.-/mo, Canton Zürich target)...',
    });

    // Step 2: Apply Filters
    setTimeout(() => {
      onAddLog({
        id: `ux-zh-${Date.now()}-2`,
        timestamp: now(),
        agentName: 'UX Agent Zürich',
        type: 'scrape',
        message:
          lang === 'it'
            ? '🔍 Applicazione parametri di ricerca: Cantone = Zürich, Hub ferroviario = Zürich HB, Pendolarismo < 15 min, Minimo locali = 2.5, Budget max = CHF 3\'200.-...'
            : lang === 'fr'
            ? '🔍 Application des critères de recherche : Canton = Zurich, Hub = Zurich HB, Trajet < 15 min, Pièces min = 2.5, Budget max = CHF 3\'200.-...'
            : lang === 'de'
            ? '🔍 Filter angewendet: Kanton = Zürich, Hub = Zürich HB, SBB-Fahrzeit < 15 Min., Mindestzimmer = 2.5, Budget max = CHF 3\'200.-...'
            : '🔍 Applied search criteria: Canton = Zürich, Hub = Zürich HB, Transit < 15 min, Min rooms = 2.5, Max rent = CHF 3\'200.-...',
      });
    }, 450);

    // Step 3: Multi-district inventory matching
    setTimeout(() => {
      onAddLog({
        id: `ux-zh-${Date.now()}-3`,
        timestamp: now(),
        agentName: 'UX Agent Zürich',
        type: 'info',
        message:
          lang === 'it'
            ? '📊 Scansione inventario Canton Zurigo: trovati 7 alloggi idonei (Kreis 4 Hohlstrasse, Kreis 2 Enge, Kreis 11 Oerlikon, Dübendorf Stettbach, Wiedikon). Priorità su subentro Nachmieter Hohlstrasse (CHF 2\'620.- cc).'
            : lang === 'fr'
            ? '📊 Analyse du parc immobilier zurichois : 7 logements identifiés (Kreis 4, Enge, Oerlikon, Dübendorf, Wiedikon). Priorité reprise Nachmieter Hohlstrasse (CHF 2\'620.- cc).'
            : lang === 'de'
            ? '📊 Bestandsabfrage Kanton Zürich: 7 passende Wohnungen gefunden (Kreis 4, Enge, Oerlikon, Dübendorf, Wiedikon). Top-Treffer: Nachmieter Hohlstrasse (CHF 2\'620.- inkl.).'
            : '📊 Canton Zurich inventory scan: 7 properties matched (Kreis 4, Enge, Oerlikon, Dübendorf, Wiedikon). Highlight: Nachmieter takeover in Hohlstrasse (CHF 2\'620.- cc).',
      });
    }, 900);

    // Step 4: SBB Hub & Commute Intensity Heatmap
    setTimeout(() => {
      onAddLog({
        id: `ux-zh-${Date.now()}-4`,
        timestamp: now(),
        agentName: 'UX Agent Zürich',
        type: 'scrape',
        message:
          lang === 'it'
            ? '🚆 Verifica Commute Heatmap Zürich HB: Frequenza S-Bahn 2-4 min. Tutti gli alloggi filtrati distano tra 6 e 11 min dalla stazione centrale (fascia verde ottimale < 15 min).'
            : lang === 'fr'
            ? '🚆 Contrôle Heatmap Commute Zurich HB : Fréquence S-Bahn 2-4 min. Tous les logements sont situés entre 6 et 11 min de la gare centrale (zone verte isochrone < 15 min).'
            : lang === 'de'
            ? '🚆 Commute-Heatmap Zürich HB geprüft: S-Bahn-Takt 2-4 Min. Alle gefilterten Wohnungen liegen innerhalb von 6 bis 11 Min. zum HB (optimale grüne Isochronen-Zone).'
            : '🚆 Checked Zürich HB Commute Heatmap: S-Bahn frequency 2-4 min. All matched flats are within 6 to 11 min from main station (optimal green zone < 15 min).',
      });
    }, 1400);

    // Step 5: Solvency Audit & Result
    setTimeout(() => {
      const msgDone =
        lang === 'it'
          ? '✅ Audit solvibilità completato: Affitto CHF 2\'620.- su stipendio CHF 9\'200.- = 28.5% (Tasso di sforzo eccellente, < 33%). Betreibungsauszug vergine, 3 buste paga conformi. Esperienza utente: 100% SUCCESSO.'
          : lang === 'fr'
          ? '✅ Audit de solvabilité validé : Loyer CHF 2\'620.- sur revenu CHF 9\'200.- = 28.5% (Taux d\'effort excellent, < 33%). Extrait poursuites vierge, 3 fiches de salaire. Expérience utilisateur : 100% SUCCÈS.'
          : lang === 'de'
          ? '✅ Bonitätsprüfung bestanden: Miete CHF 2\'620.- bei Gehalt CHF 9\'200.- = 28.5% (Idealer Belastungsgrad, < 33%). Betreibungsauszug sauber, 3 Lohnabrechnungen. UX-Ergebnis: 100% ERFOLGREICH.'
          : '✅ Solvency audit passed: Rent CHF 2\'620.- vs CHF 9\'200.- income = 28.5% (Optimal ratio, < 33%). Clean debt extract, 3 salary slips. UX Result: 100% SUCCESS.';

      onAddLog({
        id: `ux-zh-${Date.now()}-5`,
        timestamp: now(),
        agentName: 'UX Agent Zürich',
        type: 'success',
        message: msgDone,
        listingId: 'ch-zh-01',
      });

      setZurichUxResults({
        matches: 7,
        sampleListingTitle: '3.5 Zimmer mit Balkon in Zürich Kreis 4 (Hohlstrasse)',
        commuteHub: 'Zürich HB',
        commuteMin: 6,
        solvencyPercent: 28.5,
        latencyMs: 52,
        status: 'optimal',
      });

      setIsRunningZurich(false);
    }, 1900);
  };

  const triggerDualUxTest = () => {
    setIsRunningDual(true);
    triggerGlandUxTest();
    setTimeout(() => {
      triggerZurichUxTest();
      setTimeout(() => {
        setIsRunningDual(false);
      }, 2100);
    }, 400);
  };

  const triggerPortalCrawler = () => {
    const timestamp = new Date().toLocaleTimeString('fr-CH');
    const msgStart =
      lang === 'it'
        ? 'Avvio scansione nazionale portali: ImmoScout24.ch, Homegate.ch & Flatfox.ch (Zurigo, Ginevra, Vaud, Basilea, Berna, Ticino)...'
        : lang === 'fr'
        ? 'Lancement du crawling national des portails : ImmoScout24.ch, Homegate.ch & Flatfox.ch (Zurich, Genève, Vaud, Bâle, Berne, Tessin)...'
        : lang === 'de'
        ? 'Nationales Portal-Crawling gestartet: ImmoScout24.ch, Homegate.ch & Flatfox.ch (Zürich, Genf, Waadt, Basel, Bern, Tessin)...'
        : 'Nationwide crawling started: ImmoScout24.ch, Homegate.ch & Flatfox.ch (Zurich, Geneva, Vaud, Basel, Bern, Ticino)...';

    onAddLog({
      id: `log-${Date.now()}-1`,
      timestamp,
      agentName: 'Portal Crawler',
      type: 'info',
      message: msgStart,
    });

    setTimeout(() => {
      const msgScraped =
        lang === 'it'
          ? 'Acquisiti 88 feed immobiliari svizzeri. Validazione stazioni SBB/CFF/FFS e normalizzazione affitti lordi...'
          : lang === 'fr'
          ? '88 flux immobiliers suisses analysés. Validation des hubs CFF et normalisation des loyers cc...'
          : lang === 'de'
          ? '88 Schweizer Inserate analysiert. Validierung der SBB-Knotenpunkte und Bruttomieten-Normalisierung...'
          : 'Scraped 88 raw Swiss property feeds. Validating SBB hubs and normalising rent figures...';

      onAddLog({
        id: `log-${Date.now()}-2`,
        timestamp: new Date().toLocaleTimeString('fr-CH'),
        agentName: 'Portal Crawler',
        type: 'scrape',
        message: msgScraped,
      });
    }, 600);

    setTimeout(() => {
      const crawledListing: Listing = {
        id: `crawled-zh-${Date.now()}`,
        title: '3.5 Zimmer Wohnung mit Seeblick in Zürich Wollishofen',
        source: 'immoscout24',
        sourceName: 'ImmoScout24.ch (Crawler Agent)',
        sourceUrl: 'https://immoscout24.ch/de/wohnung-zuerich-wollishofen',
        canton: 'Zürich',
        district: 'Kreis 2 / Wollishofen',
        city: 'Zürich',
        postalCode: '8038',
        address: 'Seestrasse 280',
        coordinates: { lat: 47.3452, lng: 8.5342, xPercent: 65, yPercent: 32 },
        rentNetCHF: 2450,
        chargesCHF: 230,
        rentTotalCHF: 2680,
        depositMonths: 3,
        rooms: 3.5,
        surfaceM2: 82,
        floor: '2. OG mit Lift',
        availableDate: '01.06.2026',
        isRepriseDeBail: false,
        features: ['Zürichsee 100m', 'Balkon', 'Eigener Waschturm', 'Keller', 'Parkett'],
        description: 'Frisch renovierte Wohnung direkt am Zürichsee. Schnelle S-Bahn-Anbindung an Zürich HB in 8 Minuten.',
        contactInfo: 'Wincasa AG Zürich (Ref: ZH-8038-CRAWL)',
        regieName: 'Wincasa AG',
        commuteHubName: 'Zürich HB',
        commuteHubMin: 8,
        accentGradient: 'from-blue-700 to-indigo-950',
        createdAt: new Date().toISOString(),
      };

      onInjectListing(crawledListing);

      const msgSuccess =
        lang === 'it'
          ? 'Identificato alloggio ad alta priorità a Zurigo (CHF 2\'680.- cc)! Iniettato nel feed attivo svizzero.'
          : lang === 'fr'
          ? 'Logement haute priorité identifié à Zurich (CHF 2\'680.- cc) ! Injecté dans le flux actif suisse.'
          : lang === 'de'
          ? 'Hochprioritäre Wohnung in Zürich entdeckt (CHF 2\'680.- inkl.)! In den aktiven Schweizer Feed integriert.'
          : 'Discovered high-priority apartment in Zurich (CHF 2\'680.- cc)! Injected into active Swiss feed.';

      onAddLog({
        id: `log-${Date.now()}-3`,
        timestamp: new Date().toLocaleTimeString('fr-CH'),
        agentName: 'Portal Crawler',
        type: 'success',
        message: msgSuccess,
        listingId: crawledListing.id,
      });
    }, 1400);
  };

  const triggerFacebookScout = () => {
    const timestamp = new Date().toLocaleTimeString('fr-CH');
    const msgListen =
      lang === 'it'
        ? 'Ascolto gruppi Facebook svizzeri: "Wohnung mieten Zürich", "Genève à louer", "Affitti Ticino"...'
        : lang === 'fr'
        ? 'Écoute des groupes Facebook suisses : "Wohnung mieten Zürich", "Genève à louer", "Affitti Ticino"...'
        : lang === 'de'
        ? 'Überwachung Schweizer Facebook-Gruppen: "Wohnung mieten Zürich", "Genève à louer", "Affitti Ticino"...'
        : 'Scanning Swiss Facebook groups: "Wohnung mieten Zürich", "Genève à louer", "Affitti Ticino"...';

    onAddLog({
      id: `log-${Date.now()}-1`,
      timestamp,
      agentName: 'Facebook Scout',
      type: 'info',
      message: msgListen,
    });

    setTimeout(() => {
      const msgAlert =
        lang === 'it'
          ? 'Intercettato subentro urgente: "Subentro 3 locali moderno a Lugano Centro" (postato 3 min fa). Parsing con Gemini AI...'
          : lang === 'fr'
          ? 'Reprise urgente interceptée : "Reprise 3 pièces moderne à Lugano Centre" (publié il y a 3 min). Analyse Gemini AI...'
          : lang === 'de'
          ? 'Dringender Nachmieter abgefangen: "3-Zimmer-Wohnung in Lugano Centro" (vor 3 Min. gepostet). Gemini AI-Analyse...'
          : 'Intercepted urgent takeover: "Urgent 3 rooms flat in Lugano Centre" (posted 3 mins ago). Parsing with Gemini AI...';

      onAddLog({
        id: `log-${Date.now()}-2`,
        timestamp: new Date().toLocaleTimeString('fr-CH'),
        agentName: 'Facebook Scout',
        type: 'alert',
        message: msgAlert,
      });
    }, 800);

    setTimeout(() => {
      const fbListing: Listing = {
        id: `fb-agent-ti-${Date.now()}`,
        title: 'SUBENTRO FLASH: 3 locali moderno a Lugano Centro (Trasferimento estero)',
        source: 'facebook_group',
        sourceName: 'Affitti & Subentri Ticino (Scout Agent)',
        sourceUrl: 'https://facebook.com/groups/affitti.ticino',
        facebookGroupInfo: {
          groupName: 'Affitti & Subentri Ticino',
          postDate: 'Intercettato dall Agente Scout 3 min fa',
          authorName: 'Marco Bernasconi',
        },
        canton: 'Ticino',
        district: 'Lugano Centro',
        city: 'Lugano',
        postalCode: '6900',
        address: 'Corso Elvezia 14',
        coordinates: { lat: 46.0037, lng: 8.9511, xPercent: 69, yPercent: 84 },
        rentNetCHF: 1680,
        chargesCHF: 170,
        rentTotalCHF: 1850,
        depositMonths: 3,
        rooms: 3,
        surfaceM2: 75,
        floor: '3° piano con ascensore',
        availableDate: '01.05.2026',
        isRepriseDeBail: true,
        features: ['Subentro anticipato', 'Balcone soleggiato', 'Parquet', 'A 5 min dal Lago', 'Autorimessa'],
        description: 'Cessione urgente per trasferimento lavorativo a Zurigo. Appartamento moderno nel cuore di Lugano.',
        contactInfo: 'Contatto WhatsApp: 079 443 21 00',
        regieName: 'Fiduciaria Lugano',
        commuteHubName: 'Lugano FFS',
        commuteHubMin: 5,
        accentGradient: 'from-emerald-700 to-teal-950',
        createdAt: new Date().toISOString(),
      };

      onInjectListing(fbListing);

      const msgDone =
        lang === 'it'
          ? 'Post Facebook analizzato e integrato! Subentro pronto per candidatura a Lugano (CHF 1\'850.- cc).'
          : lang === 'fr'
          ? 'Post Facebook extrait et intégré ! Reprise prête pour candidature à Lugano (CHF 1\'850.- cc).'
          : lang === 'de'
          ? 'Facebook-Post analysiert und integriert! Nachmiete in Lugano sofort bewerbbar (CHF 1\'850.- inkl.).'
          : 'Facebook takeover post parsed & integrated! Available for instant application in Lugano (CHF 1\'850.- cc).';

      onAddLog({
        id: `log-${Date.now()}-3`,
        timestamp: new Date().toLocaleTimeString('fr-CH'),
        agentName: 'Facebook Scout',
        type: 'success',
        message: msgDone,
        listingId: fbListing.id,
      });
    }, 1600);
  };

  const triggerDossierMatcher = () => {
    const timestamp = new Date().toLocaleTimeString('fr-CH');

    const msgAuditing =
      lang === 'it'
        ? `Audit di solvibilità su tutti i ${listingsCount} alloggi svizzeri (Reddito netto: CHF ${dossier.monthlyNetSalaryCHF}.-, Cantone: ${dossier.targetCanton || 'Tutti'})...`
        : lang === 'fr'
        ? `Audit de solvabilité sur les ${listingsCount} logements suisses (Revenu net : CHF ${dossier.monthlyNetSalaryCHF}.-, Canton : ${dossier.targetCanton || 'Tous'})...`
        : lang === 'de'
        ? `Bonitätsprüfung aller ${listingsCount} Schweizer Wohnungen (Nettoeinkommen: CHF ${dossier.monthlyNetSalaryCHF}.-, Kanton: ${dossier.targetCanton || 'Alle'})...`
        : `Auditing solvency across all ${listingsCount} Swiss properties (Household net income: CHF ${dossier.monthlyNetSalaryCHF}.-, Target Canton: ${dossier.targetCanton || 'All'})...`;

    onAddLog({
      id: `log-${Date.now()}-1`,
      timestamp,
      agentName: 'Dossier Matcher',
      type: 'info',
      message: msgAuditing,
    });

    setTimeout(() => {
      const msgResult =
        lang === 'it'
          ? 'Audit solvibilità completato: l\'85% degli alloggi tracciati rispetta la regola svizzera del 33%. Lettera di candidatura pronta.'
          : lang === 'fr'
          ? 'Audit de solvabilité terminé : 85% des logements respectent la règle suisse des 33%. Lettre de candidature générée.'
          : lang === 'de'
          ? 'Bonitätsprüfung abgeschlossen: 85% der Wohnungen erfüllen die Schweizer 33%-Regel. Bewerbungsschreiben bereit.'
          : 'Swiss solvency audit complete: 85% of tracked listings match your profile safely under the 33% régie rule. Application letter generated.';

      onAddLog({
        id: `log-${Date.now()}-2`,
        timestamp: new Date().toLocaleTimeString('fr-CH'),
        agentName: 'Dossier Matcher',
        type: 'success',
        message: msgResult,
      });
    }, 1000);
  };

  const filteredLogs = activeFilter === 'all'
    ? logs
    : logs.filter((l) => l.agentName === activeFilter);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
              <Bot className="w-5 h-5 text-red-600 dark:text-red-400" />
              {t.agents.pageTitle}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t.agents.pageSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClearLogs}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {t.agents.clearLogs}
            </button>
          </div>
        </div>
      </div>

      {/* User Experience Autonomous Agent Simulation Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 mb-1">
              <Activity className="w-3.5 h-3.5" />
              <span>{t.agents.uxSimTitle}</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-500" />
              <span>Simulazione Esperienza Utente (UX Personas)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.agents.uxSimSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={triggerDualUxTest}
              disabled={isRunningDual || isRunningGland || isRunningZurich}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 rounded-lg shadow-xs transition-all disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isRunningDual ? 'Esecuzione Dual Test...' : t.agents.runDualUxBtn}</span>
            </button>
          </div>
        </div>

        {/* 2 Persona Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Persona 1: Sophie - Gland (Vaud) */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <CantonFlag canton="Vaud" size="md" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <span>Persona "Sophie"</span>
                    <span className="text-[11px] font-normal text-slate-500">· Gland (VD)</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Senior Regulatory Specialist (IUCN / Swissquote Gland)
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
                La Côte · NPA 1196
              </span>
            </div>

            {/* Profile requirements tags */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="bg-white dark:bg-slate-700/80 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                💰 Stipendio: CHF 7'200.-/m
              </span>
              <span className="bg-white dark:bg-slate-700/80 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                🏠 2.5 - 3.5 locali
              </span>
              <span className="bg-white dark:bg-slate-700/80 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                🏷 Max CHF 2'400.-
              </span>
              <span className="bg-white dark:bg-slate-700/80 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                🚆 Treno: Gland CFF &lt; 30m GE/LS
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={triggerGlandUxTest}
                disabled={isRunningGland || isRunningDual}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors shadow-2xs disabled:opacity-60"
              >
                {isRunningGland ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Scansione Gland...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t.agents.runGlandUxBtn}</span>
                  </>
                )}
              </button>

              {onApplyFilters && (
                <button
                  onClick={() =>
                    onApplyFilters({
                      selectedCanton: 'Vaud',
                      selectedCity: 'Gland',
                      maxRentTotalCHF: 2400,
                      minRooms: 2,
                    })
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                >
                  <Search className="w-3 h-3 text-red-500" />
                  <span>{t.agents.applyFiltersCta} (Gland)</span>
                </button>
              )}
            </div>

            {/* Telemetry results if executed */}
            {glandUxResults && (
              <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-lg border border-emerald-200/70 dark:border-emerald-800/60 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-emerald-900 dark:text-emerald-200 font-bold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Test UX Gland: 100% Superato</span>
                  </span>
                  <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-300">
                    Latenza: {glandUxResults.latencyMs}ms
                  </span>
                </div>
                <div className="text-[11px] text-emerald-800 dark:text-emerald-300 space-y-0.5">
                  <div>• Trovati <strong>{glandUxResults.matches} alloggi</strong> a Gland (NPA 1196).</div>
                  <div>• Sforzo pigione su stipendio: <strong>{glandUxResults.solvencyPercent}%</strong> (&lt; 33% standard USPI).</div>
                  <div>• Hub SBB/CFF: <strong>Gland CFF in 22 min</strong> a Ginevra Cornavin e 28 min a Losanna.</div>
                  <div>• Top match: <em>{glandUxResults.sampleListingTitle}</em></div>
                </div>
              </div>
            )}
          </div>

          {/* Persona 2: Florian - Canton Zürich */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <CantonFlag canton="Zürich" size="md" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <span>Persona "Florian"</span>
                    <span className="text-[11px] font-normal text-slate-500">· Canton Zürich</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Senior Software Engineer (Zürich City HB Tech)
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40">
                S-Bahn Pendler · Zürich HB
              </span>
            </div>

            {/* Profile requirements tags */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="bg-white dark:bg-slate-700/80 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                💰 Stipendio: CHF 9'200.-/m
              </span>
              <span className="bg-white dark:bg-slate-700/80 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                🏠 2.5 - 4.5 Zimmer
              </span>
              <span className="bg-white dark:bg-slate-700/80 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                🏷 Max CHF 3'200.-
              </span>
              <span className="bg-white dark:bg-slate-700/80 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                🚆 S-Bahn: &lt; 15 min Zürich HB
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={triggerZurichUxTest}
                disabled={isRunningZurich || isRunningDual}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors shadow-2xs disabled:opacity-60"
              >
                {isRunningZurich ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Scansione Zürich...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-blue-400" />
                    <span>{t.agents.runZurichUxBtn}</span>
                  </>
                )}
              </button>

              {onApplyFilters && (
                <button
                  onClick={() =>
                    onApplyFilters({
                      selectedCanton: 'Zürich',
                      selectedCity: '',
                      maxCommuteMin: 15,
                      maxRentTotalCHF: 3200,
                    })
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                >
                  <Search className="w-3 h-3 text-red-500" />
                  <span>{t.agents.applyFiltersCta} (Zürich)</span>
                </button>
              )}
            </div>

            {/* Telemetry results if executed */}
            {zurichUxResults && (
              <div className="p-3 bg-blue-50/70 dark:bg-blue-950/30 rounded-lg border border-blue-200/70 dark:border-blue-800/60 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-blue-900 dark:text-blue-200 font-bold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>Test UX Zürich: 100% Superato</span>
                  </span>
                  <span className="font-mono text-[11px] text-blue-700 dark:text-blue-300">
                    Latenza: {zurichUxResults.latencyMs}ms
                  </span>
                </div>
                <div className="text-[11px] text-blue-800 dark:text-blue-300 space-y-0.5">
                  <div>• Trovati <strong>{zurichUxResults.matches} alloggi</strong> nel Canton Zurigo.</div>
                  <div>• Sforzo pigione su stipendio: <strong>{zurichUxResults.solvencyPercent}%</strong> (A+ Top Tier, &lt; 33%).</div>
                  <div>• Hub SBB: <strong>Media {zurichUxResults.commuteMin} min</strong> a Zürich HB (Kreis 4, Enge, Oerlikon).</div>
                  <div>• Top match: <em>{zurichUxResults.sampleListingTitle}</em></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Agents Control Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Agent 1: Portal Crawler */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4.5 shadow-xs flex flex-col justify-between space-y-4 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                {t.agents.crawlerTitle}
              </span>
              <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded font-medium">
                {t.agents.crawlerStatus}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {t.agents.crawlerDesc}
            </p>
          </div>

          <button
            onClick={triggerPortalCrawler}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 hover:bg-slate-800 rounded-lg transition-colors shadow-2xs"
          >
            <Play className="w-3.5 h-3.5" />
            {t.agents.crawlerBtn}
          </button>
        </div>

        {/* Agent 2: Facebook Scout */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4.5 shadow-xs flex flex-col justify-between space-y-4 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                {t.agents.scoutTitle}
              </span>
              <span className="text-[10px] font-mono text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded font-medium">
                {t.agents.scoutStatus}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {t.agents.scoutDesc}
            </p>
          </div>

          <button
            onClick={triggerFacebookScout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
          >
            <Play className="w-3.5 h-3.5" />
            {t.agents.scoutBtn}
          </button>
        </div>

        {/* Agent 3: Tenant Matcher */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4.5 shadow-xs flex flex-col justify-between space-y-4 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                {t.agents.matcherTitle}
              </span>
              <span className="text-[10px] font-mono text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded font-medium">
                {t.agents.matcherStatus}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {t.agents.matcherDesc}
            </p>
          </div>

          <button
            onClick={triggerDossierMatcher}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors shadow-2xs"
          >
            <Play className="w-3.5 h-3.5" />
            {t.agents.matcherBtn}
          </button>
        </div>
      </div>

      {/* Terminal / Log Viewer */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        {/* Terminal Header */}
        <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-red-500" />
            <span className="text-xs font-mono font-semibold text-slate-300">
              {t.agents.terminalFile}
            </span>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap items-center gap-1 text-[11px] font-mono">
            {(
              [
                'all',
                'UX Agent Gland',
                'UX Agent Zürich',
                'Portal Crawler',
                'Facebook Scout',
                'Dossier Matcher',
              ] as const
            ).map((agent) => (
              <button
                key={agent}
                onClick={() => setActiveFilter(agent)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  activeFilter === agent
                    ? 'bg-slate-800 text-white font-semibold shadow-2xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {agent === 'all' ? t.agents.allLogs : agent}
              </button>
            ))}
          </div>
        </div>

        {/* Console Log Content */}
        <div className="p-4 font-mono text-xs max-h-96 overflow-y-auto space-y-2 select-text">
          {filteredLogs.length === 0 ? (
            <div className="text-slate-500 py-6 text-center">
              {t.agents.noLogs}
            </div>
          ) : (
            filteredLogs.map((log) => {
              const color =
                log.type === 'success'
                  ? 'text-emerald-400'
                  : log.type === 'alert'
                  ? 'text-amber-400'
                  : log.type === 'scrape'
                  ? 'text-cyan-400'
                  : 'text-slate-300';

              return (
                <div key={log.id} className="flex items-start gap-2.5 leading-relaxed">
                  <span className="text-slate-500 shrink-0 text-[11px]">{log.timestamp}</span>
                  <span className="text-red-400 shrink-0 font-semibold">[{log.agentName}]</span>
                  <span className={color}>{log.message}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
