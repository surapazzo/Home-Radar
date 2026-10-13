import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Healthcheck endpoints for container deployment / Cloud Run
app.get('/healthz', (_req, res) => {
  res.status(200).send('OK');
});

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Initialize Gemini SDK with telemetry header
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// API: Parse raw Facebook post or listing text across Switzerland
app.post('/api/parse-facebook-post', async (req, res) => {
  try {
    const { rawText, groupName, postUrl, targetLang = 'it' } = req.body;

    if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
      return res.status(400).json({ error: 'Il testo del post Facebook è obbligatorio' });
    }

    const langInstruction =
      targetLang === 'fr'
        ? 'Rédige le titre et le résumé en français.'
        : targetLang === 'de'
        ? 'Verfasse den Titel und die Zusammenfassung auf Deutsch.'
        : targetLang === 'en'
        ? 'Write the title and summary in English.'
        : 'Scrivi il titolo e la sintesi in italiano.';

    const prompt = `Sei un assistente specializzato nel mercato immobiliare svizzero (tutti i cantoni: Zurigo, Ginevra, Vaud, Basilea, Berna, Ticino, Lucerna, Zugo, ecc.).
Analizza il seguente post pubblicato in un gruppo Facebook di alloggi / reprise de bail / Nachmieter / subentro e restituisci SOLO un JSON valido con i dettagli strutturati dell'annuncio.
${langInstruction}

Testo del post Facebook:
"""
${rawText}
"""

Regole di estrazione per la Svizzera:
- rooms: numero di pezzi/locali/Zimmer (es. 1.5, 2.5, 3.5, 4.5). Se monolocale = 1 o 1.5.
- rentNetCHF: affitto netto (Nettomiete / loyer net). Se non specificato, calcola o metti null.
- chargesCHF: acconto spese (Nebenkosten / charges / acompte).
- rentTotalCHF: affitto lordo mensile in CHF (Bruttomiete cc / loyer charges comprises o cc). Se c'è solo un prezzo, è il totale.
- city: Comune svizzero (es. Zürich, Genève, Lausanne, Basel, Bern, Lugano, Luzern, Zug, Morges, Nyon, Winterthur, Bellinzona, Locarno, Vevey, Montreux, Yverdon-les-Bains).
- canton: Cantone svizzero (Zürich, Genève, Vaud, Basel-Stadt, Bern, Ticino, Luzern, Zug, Neuchâtel, Fribourg, Valais, St. Gallen, Aargau).
- district: Distretto o quartiere (es. Kreis 4, Sous-Gare, Eaux-Vives, Gundeli, Länggasse, Lugano Centro).
- isRepriseDeBail: vero se si tratta di subentro/reprise/Nachmieter prima della scadenza contrattuale.
- availableDate: data di disponibilità (es. "1. Mai 2026", "1er mai 2026", "Immediato").
- features: elenco caratteristiche individuate (es. "Balkon / Balcon", "Waschmaschine", "Parkplatz", "Haustiere erlaubt / Animaux acceptés", "Keller / Cave", "Lift").`;

    if (ai) {
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI_TIMEOUT')), 5000)
        );
        const aiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: 'Titolo riassuntivo pulito' },
                rooms: { type: Type.NUMBER, description: 'Numero di locali (es. 2.5)' },
                surfaceM2: { type: Type.NUMBER, description: 'Superficie in mq stimata o menzionata' },
                city: { type: Type.STRING, description: 'Comune' },
                canton: { type: Type.STRING, description: 'Cantone svizzero' },
                district: { type: Type.STRING, description: 'Quartiere o distretto' },
                address: { type: Type.STRING, description: 'Indirizzo o quartiere approssimativo' },
                rentNetCHF: { type: Type.NUMBER, description: 'Affitto netto mensile in CHF' },
                chargesCHF: { type: Type.NUMBER, description: 'Spese accessorie mensili in CHF' },
                rentTotalCHF: { type: Type.NUMBER, description: 'Affitto totale lordo mensile in CHF' },
                depositMonths: { type: Type.NUMBER, description: 'Mesi di cauzione (solitamente 3)' },
                floor: { type: Type.STRING, description: 'Piano dell alloggio' },
                availableDate: { type: Type.STRING, description: 'Data di disponibilità' },
                isRepriseDeBail: { type: Type.BOOLEAN, description: 'Se è un subentro / Nachmieter' },
                features: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Caratteristiche principali',
                },
                summary: { type: Type.STRING, description: 'Breve sintesi dei punti chiave' },
                contactInfo: { type: Type.STRING, description: 'Contatto o istruzioni per visita' },
                commuteHubMin: { type: Type.NUMBER, description: 'Minuti stimati di treno/auto per l hub SBB/CFF più vicino' },
                commuteHubName: { type: Type.STRING, description: 'Nome della stazione hub principale (Zurich HB, Lausanne, Genève, ecc.)' },
              },
              required: ['title', 'rooms', 'city', 'canton', 'rentTotalCHF', 'isRepriseDeBail', 'features', 'summary'],
            },
          },
        });

        const response = await Promise.race([aiPromise, timeoutPromise]);
        const parsedData = JSON.parse(response.text || '{}');
        return res.json({
          success: true,
          source: 'gemini-ai',
          listing: {
            ...parsedData,
            source: 'facebook_group',
            sourceName: groupName || 'Gruppo Facebook Svizzera',
            sourceUrl: postUrl || 'https://facebook.com/groups',
          },
        });
      } catch (aiErr) {
        console.warn('Fallback a parser euristico svizzero multilingua:', aiErr);
      }
    }

    // Comprehensive Heuristic Fallback across Switzerland
    const textLower = rawText.toLowerCase();
    const roomsMatch = textLower.match(/([1-6](?:\.5)?)\s*(?:pi[eè]ces?|pces?|locali|rooms?|zimmer|zi\b)/);
    const rentMatch = textLower.match(/(?:chf|frs?\.?|fr\b)?\s*([1-9][0-9]{2,3})\s*(?:chf|frs?\.?|cc\b|charges compris|warm|\/monat|\/mois|\.-)/i)
      || textLower.match(/([1-9][0-9]{2,3})\s*(?:chf|\.-)/i);
    const m2Match = textLower.match(/([1-9][0-9]{1,2})\s*(?:m2|m²|mq|qm)/i);

    // City & Canton Detection
    const swissCityMap: Record<string, { canton: string; hub: string; min: number }> = {
      Zürich: { canton: 'Zürich', hub: 'Zürich HB', min: 4 },
      Zurich: { canton: 'Zürich', hub: 'Zürich HB', min: 4 },
      Winterthur: { canton: 'Zürich', hub: 'Zürich HB', min: 20 },
      Genève: { canton: 'Genève', hub: 'Genève Cornavin', min: 5 },
      Geneva: { canton: 'Genève', hub: 'Genève Cornavin', min: 5 },
      Lausanne: { canton: 'Vaud', hub: 'Lausanne Gare', min: 4 },
      Morges: { canton: 'Vaud', hub: 'Lausanne Gare', min: 11 },
      Nyon: { canton: 'Vaud', hub: 'Genève Cornavin', min: 14 },
      Vevey: { canton: 'Vaud', hub: 'Lausanne Gare', min: 15 },
      Montreux: { canton: 'Vaud', hub: 'Lausanne Gare', min: 21 },
      Renens: { canton: 'Vaud', hub: 'Lausanne Gare', min: 6 },
      Pully: { canton: 'Vaud', hub: 'Lausanne Gare', min: 8 },
      Basel: { canton: 'Basel-Stadt', hub: 'Basel SBB', min: 6 },
      Bern: { canton: 'Bern', hub: 'Bern Bahnhof', min: 5 },
      Lugano: { canton: 'Ticino', hub: 'Lugano FFS', min: 5 },
      Bellinzona: { canton: 'Ticino', hub: 'Bellinzona FFS', min: 5 },
      Luzern: { canton: 'Luzern', hub: 'Luzern Bahnhof', min: 5 },
      Zug: { canton: 'Zug', hub: 'Zug Bahnhof', min: 4 },
      Neuchâtel: { canton: 'Neuchâtel', hub: 'Neuchâtel Gare', min: 5 },
      Fribourg: { canton: 'Fribourg', hub: 'Fribourg Gare', min: 5 },
      Sion: { canton: 'Valais', hub: 'Sion Gare', min: 5 },
    };

    let detectedCity = 'Lausanne';
    let detectedCanton = 'Vaud';
    let hubName = 'Lausanne Gare';
    let hubMin = 5;

    for (const [cityName, info] of Object.entries(swissCityMap)) {
      if (new RegExp(`\\b${cityName}\\b`, 'i').test(rawText)) {
        detectedCity = cityName;
        detectedCanton = info.canton;
        hubName = info.hub;
        hubMin = info.min;
        break;
      }
    }

    const rooms = roomsMatch ? parseFloat(roomsMatch[1]) : 2.5;
    const rentTotal = rentMatch ? parseInt(rentMatch[1], 10) : 1950;
    const m2 = m2Match ? parseInt(m2Match[1], 10) : 65;
    const isReprise = /reprise|bail|subentro|nachmieter|übernahme|takeover/i.test(textLower);

    const title =
      targetLang === 'fr'
        ? `${rooms} pièces à ${detectedCity} (${isReprise ? 'Reprise' : 'Location'})`
        : targetLang === 'de'
        ? `${rooms} Zimmer in ${detectedCity} (${isReprise ? 'Nachmieter' : 'Miete'})`
        : targetLang === 'en'
        ? `${rooms} rooms in ${detectedCity} (${isReprise ? 'Takeover' : 'Rent'})`
        : `${rooms} locali a ${detectedCity} (${isReprise ? 'Subentro' : 'Affitto'})`;

    const summary =
      targetLang === 'fr'
        ? `Logement à ${detectedCity} (${detectedCanton}) : ${rooms} pièces, CHF ${rentTotal} cc.`
        : targetLang === 'de'
        ? `Wohnung in ${detectedCity} (${detectedCanton}): ${rooms} Zimmer, CHF ${rentTotal} inkl.`
        : targetLang === 'en'
        ? `Property in ${detectedCity} (${detectedCanton}): ${rooms} rooms, CHF ${rentTotal} incl.`
        : `Alloggio a ${detectedCity} (${detectedCanton}): ${rooms} locali, CHF ${rentTotal} cc.`;

    const fallbackResult = {
      title,
      rooms,
      surfaceM2: m2,
      city: detectedCity,
      canton: detectedCanton,
      district: `${detectedCity} Centro`,
      address: `Zentralquartier, ${detectedCity}`,
      rentNetCHF: Math.round(rentTotal * 0.88),
      chargesCHF: Math.round(rentTotal * 0.12),
      rentTotalCHF: rentTotal,
      depositMonths: 3,
      floor: '2. Stock / 2ème étage',
      availableDate: '01.05.2026',
      isRepriseDeBail: isReprise,
      features: ['Balkon / Balcon', 'Keller / Cave', 'Einbauküche / Cuisine agencée', 'Lift'],
      summary,
      contactInfo: 'Contattare in privato / PM / PN',
      commuteHubMin: hubMin,
      commuteHubName: hubName,
      estimatedCommuteLausanneMin: detectedCanton === 'Vaud' ? hubMin : 45,
    };

    return res.json({
      success: true,
      source: 'heuristic-parser',
      listing: {
        ...fallbackResult,
        source: 'facebook_group',
        sourceName: groupName || 'Gruppo Facebook Svizzera',
        sourceUrl: postUrl || 'https://facebook.com/groups',
      },
    });
  } catch (error) {
    console.error('Errore nel parsing del post:', error);
    res.status(500).json({
      error: 'Impossibile elaborare il post Facebook',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// Mount Vite or serve static
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`SwissImmo Scout server attivo su http://localhost:${PORT}`);
  });

  const shutdown = (signal: string) => {
    console.log(`Received ${signal}, closing server gracefully...`);
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
    setTimeout(() => {
      console.error('Forced shutdown after timeout.');
      process.exit(1);
    }, 10000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer();
