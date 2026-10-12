import React, { useState } from 'react';
import { AgentLog, Listing, DossierState, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { Bot, Play, RefreshCw, Terminal, Zap, ShieldCheck } from 'lucide-react';

interface AgentWorkbenchProps {
  lang: Language;
  logs: AgentLog[];
  onAddLog: (log: AgentLog) => void;
  onClearLogs: () => void;
  onInjectListing: (listing: Listing) => void;
  dossier: DossierState;
  listingsCount: number;
}

export const AgentWorkbench: React.FC<AgentWorkbenchProps> = ({
  lang,
  logs,
  onAddLog,
  onClearLogs,
  onInjectListing,
  dossier,
  listingsCount,
}) => {
  const t = TRANSLATIONS[lang];
  const [activeFilter, setActiveFilter] = useState<'all' | 'Portal Crawler' | 'Facebook Scout' | 'Dossier Matcher'>('all');

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
          <div className="flex items-center gap-1 text-[11px] font-mono">
            {(['all', 'Portal Crawler', 'Facebook Scout', 'Dossier Matcher'] as const).map((agent) => (
              <button
                key={agent}
                onClick={() => setActiveFilter(agent)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  activeFilter === agent
                    ? 'bg-slate-800 text-white'
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
