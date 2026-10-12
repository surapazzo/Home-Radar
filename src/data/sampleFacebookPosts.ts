export interface SampleFacebookPost {
  id: string;
  groupName: string;
  canton: string;
  author: string;
  date: string;
  titleSnippet: string;
  text: string;
}

export const SAMPLE_FACEBOOK_POSTS: SampleFacebookPost[] = [
  {
    id: 'post-zh',
    groupName: 'Wohnung mieten & Nachmieter Zürich',
    canton: 'Zürich',
    author: 'Stefan Brand',
    date: 'Heute um 10:15 Uhr gepostet',
    titleSnippet: 'Nachmieter 3.5 Zimmer Zürich Wiedikon - 2\'450 CHF inkl.',
    text: `🚨 NACHMIETER GESUCHT PER 1. MAI 2026 🚨
Hallo zusammen,
Wegen Umzug ins Ausland suche ich per 1. Mai 2026 einen solventen Nachmieter für meine wunderschöne 3.5-Zimmer-Wohnung in Zürich Wiedikon (Kreis 3).
- Wohnfläche: ca. 76 m²
- Grosser sonniger Balkon mit Blick ins Grüne
- Moderne Küche mit Geschirrspüler und Glaskeramik
- Eigenes Kellerabteil & Estrich
- Gemeinschaftliche Waschküche ohne festen Waschplan
Miete: CHF 2'230.- netto + CHF 220.- Nebenkosten = CHF 2'450.- brutto warm.
Haltestelle Schmiede Wiedikon in 3 Gehminuten (S-Bahn & Tram zum Zürich HB in 8 Min).
⚠️ Wichtig: Verwaltung verlangt vollständiges Dossier (Betreibungsauszug nicht älter als 3 Monate, die letzten 3 Lohnabrechnungen mit Nettoeinkommen mind. 3x die Miete, Ausweiskopie/Aufenthaltsbewilligung).
Besichtigung: Diesen Donnerstag 18:30-20:00 Uhr. Bitte PN mit kurzer Vorstellung!`,
  },
  {
    id: 'post-vd',
    groupName: 'Lausanne à louer & Reprises de bail',
    canton: 'Vaud',
    author: 'Julien Perret',
    date: 'Publié aujourd\'hui à 11:24',
    titleSnippet: 'Reprise urgente 3 pièces Lausanne Chailly - 1\'890 CHF cc',
    text: `⚠️ REPRISE DE BAIL URGENTE POUR LE 1ER MAI 2026 ⚠️
Bonjour à tous,
Suite à un départ professionnel, je remets le bail de mon appartement 3 pièces (environ 70m2) situé à Lausanne, quartier Chailly.
- Grand séjour lumineux avec balcon sans vis-à-vis
- Cuisine agencée avec lave-vaisselle
- 2 chambres au calme, salle de bain rénovée
- Cave et buanderie dans l'immeuble
Loyer : 1'680 CHF net + 210 CHF de charges = 1'890 CHF charges comprises.
Bus ligne 7 à 2 minutes (Gare de Lausanne en 10 min).
Conditions régie : dossier complet et solvable (3 fiches de salaire > 3x loyer, extrait office des poursuites vierge < 3 mois, permis B/C/CH).
Visites samedi 14h-17h. Premier contact en MP !`,
  },
  {
    id: 'post-ti',
    groupName: 'Affitti & Subentri Ticino (Lugano)',
    canton: 'Ticino',
    author: 'Matteo Riva',
    date: 'Pubblicato 2 ore fa',
    titleSnippet: 'Subentro 2.5 locali Lugano Cassarate - 1\'550 CHF cc',
    text: `Cercasi subentrante per il 1° maggio 2026 a Lugano Cassarate 🌴🏠
Splendido appartamento 2.5 locali di 60 mq al 3° piano con ascensore, a due passi dal lago e dall'Ospedale Civico.
- Ampio soggiorno con terrazzino soleggiato
- Camera matrimoniale spaziosa
- Cucina separata abitabile con lavastoviglie
- Bagno con vasca e attacco per lavatrice
- Posto auto in autorimessa disponibile su richiesta
Affitto: CHF 1'380.- + CHF 170.- spese = CHF 1'550.- mensili.
Fermata bus TPL sotto casa (Stazione FFS di Lugano in 8 minuti).
Condizioni fiduciaria: solvibilità garantita (estratto esecuzioni pulito e 3 buste paga).
Scrivetemi in privato per concordare una visita!`,
  },
  {
    id: 'post-en',
    groupName: 'Geneva & Basel Expats · Housing & Lease Takeover',
    canton: 'Genève',
    author: 'Michael Evans',
    date: 'Posted 45 mins ago',
    titleSnippet: 'Urgent 2.5 rooms lease transfer in Geneva Nations - 2\'150 CHF incl.',
    text: `🚨 URGENT LEASE TAKEOVER / REPRISE DE BAIL (May 1st, 2026) 🚨
Hello everyone! Relocating to London for work, looking for a solvent tenant to take over my modern 2.5 room apartment (approx 58 sqm) in Geneva (Nations / Pâquis area).
- Sunny south-facing balcony
- Fully equipped open-plan kitchen with dishwasher & oven
- High-speed fiber internet ready
- Washing machine & dryer in the building
- 5 mins walk to UN / international organizations and Lake Geneva. 8 mins to Geneva Cornavin Train Station.
Rent: CHF 1'930.- net + CHF 220.- utilities = CHF 2'150.- gross per month.
Requirements from régie: standard Swiss application dossier (3 latest payslips with income > 3x rent, clean debt enforcement extract / extrait de poursuites < 3 months, copy of ID / Swiss permit B/C/L/CH).
PM me directly to schedule a viewing this week!`,
  },
];
