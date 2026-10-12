import React, { useState } from 'react';
import { SAMPLE_FACEBOOK_POSTS, SampleFacebookPost } from '../data/sampleFacebookPosts';
import { Listing, SwissCanton, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { Sparkles, X, ArrowRight, Check, AlertCircle, Loader2 } from 'lucide-react';

interface FacebookIngestionModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  onAddListing: (newListing: Listing) => void;
}

const SWISS_FB_GROUPS = [
  'Wohnung mieten & Nachmieter Zürich (FB)',
  'Genève à louer & Reprises de bail (FB)',
  'Lausanne à louer & Reprises Canton de Vaud (FB)',
  'Affitti & Subentri Ticino - Lugano & Bellinzona (FB)',
  'Wohnungsmarkt Basel & Nachmieter (FB)',
  'Wohnungen Bern & Nachmieter (FB)',
  'Geneva & Basel Expats · Housing & Lease Takeover (FB)',
  'Wohnungsbörse Luzern & Zug (FB)',
];

export const FacebookIngestionModal: React.FC<FacebookIngestionModalProps> = ({
  lang,
  isOpen,
  onClose,
  onAddListing,
}) => {
  const t = TRANSLATIONS[lang];
  const [selectedGroup, setSelectedGroup] = useState(SWISS_FB_GROUPS[0]);
  const [postUrl, setPostUrl] = useState('https://facebook.com/groups/nachmieter.zuerich/posts/842109');
  const [postText, setPostText] = useState(SAMPLE_FACEBOOK_POSTS[0].text);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedResult, setParsedResult] = useState<any | null>(null);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLoadSample = (sample: SampleFacebookPost) => {
    setSelectedGroup(sample.groupName);
    setPostText(sample.text);
    setParsedResult(null);
    setError(null);
    setAddedSuccess(false);
  };

  const handleParsePost = async () => {
    if (!postText.trim()) {
      setError(t.facebookModal.postTextPlaceholder);
      return;
    }

    setIsLoading(true);
    setError(null);
    setParsedResult(null);
    setAddedSuccess(false);

    try {
      const response = await fetch('/api/parse-facebook-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText: postText,
          groupName: selectedGroup,
          postUrl,
          targetLang: lang,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error parsing Facebook post');
      }

      setParsedResult(data.listing);
    } catch (err: any) {
      console.error('Parsing error:', err);
      setError(err.message || 'An error occurred during parsing');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmAndAdd = () => {
    if (!parsedResult) return;

    const cityCoordMap: Record<
      string,
      {
        lat: number;
        lng: number;
        x: number;
        y: number;
        canton: SwissCanton;
        hub: string;
        min: number;
        postal: string;
      }
    > = {
      Zürich: { lat: 47.3769, lng: 8.5417, x: 64, y: 28, canton: 'Zürich', hub: 'Zürich HB', min: 4, postal: '8001' },
      Winterthur: { lat: 47.4999, lng: 8.7241, x: 72, y: 23, canton: 'Zürich', hub: 'Zürich HB', min: 18, postal: '8400' },
      Genève: { lat: 46.2044, lng: 6.1432, x: 12, y: 78, canton: 'Genève', hub: 'Genève Cornavin', min: 5, postal: '1201' },
      Carouge: { lat: 46.1845, lng: 6.1394, x: 13, y: 81, canton: 'Genève', hub: 'Genève Cornavin', min: 12, postal: '1227' },
      Lausanne: { lat: 46.5197, lng: 6.6323, x: 26, y: 64, canton: 'Vaud', hub: 'Lausanne Gare', min: 4, postal: '1003' },
      Renens: { lat: 46.5342, lng: 6.5891, x: 24, y: 63, canton: 'Vaud', hub: 'Lausanne Gare', min: 6, postal: '1020' },
      Pully: { lat: 46.5098, lng: 6.6622, x: 27, y: 64, canton: 'Vaud', hub: 'Lausanne Gare', min: 8, postal: '1009' },
      Morges: { lat: 46.5105, lng: 6.4984, x: 23, y: 67, canton: 'Vaud', hub: 'Lausanne Gare', min: 11, postal: '1110' },
      Nyon: { lat: 46.3833, lng: 6.2394, x: 16, y: 74, canton: 'Vaud', hub: 'Genève Cornavin', min: 14, postal: '1260' },
      Vevey: { lat: 46.4594, lng: 6.8441, x: 33, y: 68, canton: 'Vaud', hub: 'Lausanne Gare', min: 15, postal: '1800' },
      Montreux: { lat: 46.4312, lng: 6.9107, x: 36, y: 71, canton: 'Vaud', hub: 'Lausanne Gare', min: 21, postal: '1820' },
      'Yverdon-les-Bains': { lat: 46.7785, lng: 6.6411, x: 27, y: 49, canton: 'Vaud', hub: 'Lausanne Gare', min: 22, postal: '1400' },
      Basel: { lat: 47.5596, lng: 7.5886, x: 44, y: 16, canton: 'Basel-Stadt', hub: 'Basel SBB', min: 5, postal: '4051' },
      Bern: { lat: 46.9480, lng: 7.4474, x: 42, y: 48, canton: 'Bern', hub: 'Bern Bahnhof', min: 5, postal: '3011' },
      Lugano: { lat: 46.0037, lng: 8.9511, x: 69, y: 84, canton: 'Ticino', hub: 'Lugano FFS', min: 5, postal: '6900' },
      Bellinzona: { lat: 46.1928, lng: 9.0170, x: 70, y: 72, canton: 'Ticino', hub: 'Bellinzona FFS', min: 5, postal: '6500' },
      Luzern: { lat: 47.0502, lng: 8.3093, x: 57, y: 45, canton: 'Luzern', hub: 'Luzern Bahnhof', min: 5, postal: '6003' },
      Zug: { lat: 47.1662, lng: 8.5155, x: 62, y: 39, canton: 'Zug', hub: 'Zug Bahnhof', min: 4, postal: '6300' },
      Neuchâtel: { lat: 46.9928, lng: 6.9319, x: 30, y: 43, canton: 'Neuchâtel', hub: 'Neuchâtel Gare', min: 4, postal: '2000' },
      Fribourg: { lat: 46.8065, lng: 7.1619, x: 36, y: 54, canton: 'Fribourg', hub: 'Fribourg Gare', min: 5, postal: '1700' },
      Sion: { lat: 46.2331, lng: 7.3606, x: 45, y: 75, canton: 'Valais', hub: 'Sion Gare', min: 5, postal: '1950' },
      'St. Gallen': { lat: 47.4245, lng: 9.3767, x: 86, y: 24, canton: 'St. Gallen', hub: 'St. Gallen Bahnhof', min: 6, postal: '9000' },
    };

    const detectedCityName = parsedResult.city || 'Zürich';
    const matchedCoord = cityCoordMap[detectedCityName] || {
      lat: 47.38,
      lng: 8.54,
      x: 64,
      y: 28,
      canton: (parsedResult.canton as SwissCanton) || 'Zürich',
      hub: parsedResult.commuteHubName || 'SBB Hub',
      min: parsedResult.commuteHubMin || 10,
      postal: '8000',
    };

    const targetCanton: SwissCanton =
      (parsedResult.canton as SwissCanton) || matchedCoord.canton || 'Zürich';

    const newListing: Listing = {
      id: `fb-post-${Date.now()}`,
      title: parsedResult.title || `${parsedResult.rooms} locali / Zimmer a ${detectedCityName}`,
      source: 'facebook_group',
      sourceName: `${selectedGroup}`,
      sourceUrl: postUrl || 'https://facebook.com/groups',
      facebookGroupInfo: {
        groupName: selectedGroup,
        postDate: 'Just imported via Gemini AI',
        authorName: 'Facebook Group Member',
      },
      canton: targetCanton,
      district: parsedResult.district || `Zentrum / ${detectedCityName}`,
      city: detectedCityName,
      postalCode: matchedCoord.postal || '8000',
      address: parsedResult.address || `Quartier ${detectedCityName}`,
      coordinates: {
        lat: matchedCoord.lat,
        lng: matchedCoord.lng,
        xPercent: matchedCoord.x,
        yPercent: matchedCoord.y,
      },
      rentNetCHF: parsedResult.rentNetCHF || Math.round((parsedResult.rentTotalCHF || 1900) * 0.88),
      chargesCHF: parsedResult.chargesCHF || Math.round((parsedResult.rentTotalCHF || 1900) * 0.12),
      rentTotalCHF: parsedResult.rentTotalCHF || 1900,
      depositMonths: parsedResult.depositMonths || 3,
      rooms: parsedResult.rooms || 2.5,
      surfaceM2: parsedResult.surfaceM2 || 65,
      floor: parsedResult.floor || '2. OG / 2ème étage',
      availableDate: parsedResult.availableDate || 'Immediato / 01.05.2026',
      isRepriseDeBail: parsedResult.isRepriseDeBail ?? true,
      features: parsedResult.features || ['Nachmieter / Reprise', 'Balkon', 'Küche eingerichtet'],
      description: parsedResult.summary || postText.slice(0, 200),
      contactInfo: parsedResult.contactInfo || 'Contact in private on Facebook',
      commuteHubName: matchedCoord.hub,
      commuteHubMin: matchedCoord.min,
      accentGradient: 'from-blue-600 to-indigo-900',
      createdAt: new Date().toISOString(),
    };

    onAddListing(newListing);
    setAddedSuccess(true);
    setTimeout(() => {
      onClose();
      setAddedSuccess(false);
      setParsedResult(null);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 transition-colors">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {t.facebookModal.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.facebookModal.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Quick-Load Sample Posts */}
          <div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <span>{t.facebookModal.quickLoadHint}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {SAMPLE_FACEBOOK_POSTS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleLoadSample(sample)}
                  className="text-left p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/40 dark:hover:bg-blue-950/30 transition-colors text-xs"
                >
                  <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">{sample.titleSnippet}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{sample.groupName}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.facebookModal.groupOriginLabel}
              </label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                {SWISS_FB_GROUPS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.facebookModal.postUrlLabel}
              </label>
              <input
                type="text"
                value={postUrl}
                onChange={(e) => setPostUrl(e.target.value)}
                placeholder="https://facebook.com/groups/..."
                className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Textarea for post text */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.facebookModal.postTextLabel}
            </label>
            <textarea
              rows={6}
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder={t.facebookModal.postTextPlaceholder}
              className="w-full p-3 text-xs border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 font-mono"
            />
          </div>

          {/* Action Parse Button */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {t.facebookModal.parsingFeaturesHint}
            </span>

            <button
              onClick={handleParsePost}
              disabled={isLoading || !postText.trim()}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {t.facebookModal.parsingStatus}
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  {t.facebookModal.parseBtn}
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Parsed Result Preview */}
          {parsedResult && (
            <div className="mt-4 p-4.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  {t.facebookModal.extractedTitle}
                </span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  {parsedResult.city} · {parsedResult.district}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
                <div>
                  <div className="text-slate-400 dark:text-slate-500 text-[10px]">{t.facebookModal.roomsField}</div>
                  <div className="font-bold text-slate-900 dark:text-white font-mono">{parsedResult.rooms} pces</div>
                </div>
                <div>
                  <div className="text-slate-400 dark:text-slate-500 text-[10px]">{t.facebookModal.rentField}</div>
                  <div className="font-bold text-slate-900 dark:text-white font-mono">CHF {parsedResult.rentTotalCHF}.-</div>
                </div>
                <div>
                  <div className="text-slate-400 dark:text-slate-500 text-[10px]">{t.facebookModal.availField}</div>
                  <div className="font-bold text-slate-900 dark:text-white">{parsedResult.availableDate}</div>
                </div>
                <div>
                  <div className="text-slate-400 dark:text-slate-500 text-[10px]">{t.facebookModal.contractField}</div>
                  <div className="font-bold text-amber-700 dark:text-amber-400">
                    {parsedResult.isRepriseDeBail ? 'Reprise de bail' : 'Nouvelle location'}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="font-semibold text-slate-900 dark:text-white">{t.facebookModal.summaryField} </span>
                {parsedResult.summary}
              </p>

              {parsedResult.features && parsedResult.features.length > 0 && (
                <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                  {parsedResult.features.map((f: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-200/70 dark:bg-slate-700 rounded">
                      {f}
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end">
                <button
                  onClick={handleConfirmAndAdd}
                  disabled={addedSuccess}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      {t.facebookModal.addedSuccess}
                    </>
                  ) : (
                    <>
                      <span>{t.facebookModal.confirmBtn}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
