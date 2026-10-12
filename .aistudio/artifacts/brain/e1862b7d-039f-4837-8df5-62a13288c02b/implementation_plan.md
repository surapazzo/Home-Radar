# VaudImmo Scout — Piattaforma di Scouting & Aggregazione Alloggi (Canton Vaud, Svizzera)

Piattaforma unificata per la ricerca, aggregazione e gestione del cambio alloggio nel Canton Vaud (Svizzera), che combina annunci dai principali portali svizzeri (ImmoScout24, Homegate, Anibis, Flatfox) e dai gruppi Facebook di alloggi locali, con mappa interattiva, calcolo tempi di tragitto (CFF/TL), tracker del dossier di candidatura svizzero e un banco di collaudo con agenti autonomi di scouting.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Decisioni confermate nella fase di chiarimento**:
> - **Fonti & Aggregazione Vaud**: Architettura a doppio livello con feed aggregato realistico multi-portale svizzero (Lausanne, Nyon, Morges, Vevey, Montreux, Yverdon, ecc.) e motore di ingestion configurabile con simulatore di scraper per testare la sincronizzazione in tempo reale.
> - **Integrazione Gruppi Facebook**: Assistente d'importazione rapido con estrazione assistita tramite Gemini AI (estrazione automatica di: pièces/locali, affitto netto/lordo in CHF, acconto spese, data di subentro/reprise de bail, indirizzo, permessi per animali) e collegamento diretto al post originale.
> - **Priorità MVP**: Esperienza integrata stile ImmoScout24 con vista divisa (Lista + Mappa Canton Vaud), calcolo dei tempi di pendolarismo verso poli chiave (es. Lausanne Gare, EPFL, Ginevra), filtri svizzeri nativi (pièces, CHF, balcon, lavatrice) e modulo di preparazione/monitoraggio del Dossier di Candidatura (estratto esecuzioni/non-poursuites, 3 buste paga, solvibilità 3x affitto).
> - **Agent Testing Sandbox**: Ambiente integrato di test con agenti autonomi (Agente Scraper Portal, Agente Scanner Social, Agente Valutatore Dossier) per simulare l'afflusso di nuovi annunci e la corrispondenza col profilo utente.

---

## 1. Overview & Core Concept

### Cos'è VaudImmo Scout
Nel Canton Vaud il mercato degli affitti è notoriamente teso (tasso di sfitto inferiore all'1% a Losanna e dintorni), con molte delle migliori opportunità che passano tramite "reprise de bail" anticipata su gruppi Facebook e piattaforme secondarie prima ancora di raggiungere i grandi portali immobiliari.

**VaudImmo Scout** centralizza questo flusso in un unico cruscotto:
1. **Aggregatore Multi-Canale**: Normalizza annunci provenienti da ImmoScout24, Homegate, Anibis, Flatfox e gruppi Facebook svizzeri romandi.
2. **Facebook Group Fast-Scout & Parser**: Permette di importare con 1 click o incollare il testo/link di un post da gruppi Facebook (es. *Lausanne à louer*, *Appartements Vaud*, *Colocations & Sous-locations Lausanne*), estraendo istantaneamente tutti i metadati svizzeri rilevanti con Gemini.
3. **Mappa & Distretti del Vaud**: Visualizzazione per distretto (Lausanne, Lavaux-Oron, Riviera-Pays-d'Enhaut, Morges, Nyon, Jura-Nord vaudois, Aigle) con calcolo tempi di percorrenza CFF/auto.
4. **Dossier de Candidature Svizzero**: Gestione della documentazione necessaria per vincere la selezione presso le "Régies" immobiliari (calcolo automatico del rapporto stipendio/affitto 3x, checklist documenti svizzeri, generazione lettera di motivazione bilingue FR/IT).
5. **Agent Workbench**: Modulo per eseguire e monitorare agenti di test sintetici che verificano la tempestività di cattura degli annunci e la corretta classificazione.

---

## 2. Roadmap: Divisione per MVP ed Evolutive

```
┌───────────────────────────────────────────────────────────────────────────┐
│ FASE 1: MVP CORE (Oggetto della presente implementazione)                 │
├───────────────────────────────────────────────────────────────────────────┤
│ • Aggregatore unificato con catalogo annunci Canton Vaud                  │
│ • Vista Dual-Pane stile ImmoScout: Griglia filtrabile + Mappa Vaud        │
│ • Assistente Facebook Groups con Smart AI Parser (Gemini)                 │
│ • Calcolatore Commute & Distretti CFF/TL                                  │
│ • Tracker & Generatore Dossier Régie (3x ratio, non-poursuites)          │
│ • Agent Sandbox con 3 Agenti di Test per verifica flusso dati             │
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      │
                                      ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ FASE 2: INTEGRAZIONI AVANZATE & AUTOMAZIONE                               │
├───────────────────────────────────────────────────────────────────────────┤
│ • Facebook Graph API / Session Bridge per monitoraggio background         │
│ • Notifiche istantanee Push / Webhook per nuovi subentri (< 5 minuti)     │
│ • Sincronizzazione automatica con calendario visite (iCal / Google)       │
│ • Invio automatico dossier via email alle Régie accreditate               │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 3. User Experience & Visual Design

### Direzione Estetica & Stile
- **Ispirazione**: Portali immobiliari svizzeri di alta precisione (ImmoScout24, Homegate) arricchiti con l'eleganza tipografica elvetica.
- **Palette cromatica (Regola 60-30-10)**:
  - *Neutro dominante (60%)*: Sfondo pulito off-white (`#F8FAFC` / `#FFFFFF`) e superfici di lettura rilassanti.
  - *Struttura e contrasto (30%)*: Slate profondo (`#0F172A`), bordi sottili e precisi in grigio neutro (`#E2E8F0`).
  - *Accento svizzero d'impatto (10%)*: Rosso alpino svizzero sobrio (`#DC2626` / `#E11D48`) per CTA primarie, badge di novità e marker attivi sulla mappa.
- **Tipografia**:
  - Display & Navigazione: *Plus Jakarta Sans* o *Outfit* (geometrico, rigoroso, chiaro).
  - Valori numerici e metriche: *JetBrains Mono / tabular-nums* per importi in CHF, superfici in m² e tempi di percorrenza.
  - Testo corrente: Leggibilità ottimale con gerarchia ad alta densità per scorrere dozzine di annunci senza affaticamento.
- **Top Bar Contract**:
  - Brand a sinistra: `VaudImmo Scout` con indicatore `Canton Vaud · CH`.
  - Link centrali: `Ricerca & Mappa`, `Importa da Facebook`, `Dossier Candidatura`, `Agent Sandbox`.
  - Azione primaria a destra: Pulsante `+ Aggiungi Annuncio / Test Agente`.

### Viste Principali dell'Interfaccia
1. **Vista Esplorazione (Search & Split View)**:
   - Barra superiore con filtri svizzeri: Comune/Distretto, Prezzo max (CHF), Numero di locali (1.5, 2.5, 3.5, 4.5+ pièces), Tipo (Affitto, Subentro/Reprise, Coloc), Animali ammessi, Balcone/Terrazza, Lavatrice in casa.
   - Colonna sinistra: Elenco schede immobiliari con foto ad alta risoluzione, prezzo netto/spese, data di disponibilità, badge della sorgente (ImmoScout, Homegate, Anibis, Gruppo FB specificato).
   - Colonna destra: Mappa vettoriale interattiva del Canton Vaud (Lago Lemano, Losanna, Nyon, Vevey, Morges, Yverdon, ecc.) con evidenziazione dei tempi di tragitto verso il luogo di lavoro.
2. **Modulo Assistente Facebook Groups**:
   - Area di import rapido con scelta del gruppo (es. *Logements Lausanne & Environs*, *Reprise de bail Vaud*).
   - Inserimento testo libero o link del post: il parser AI estrae automaticamente indirizzo stimato, numero locali, canone in CHF, cauzione richiesta e data di ingresso.
   - Anteprima strutturata prima dell'inserimento nell'aggregatore.
3. **Gestore Dossier di Candidatura Svizzero**:
   - Calcolatore di solvibilità: Inserimento del reddito netto mensile con barra di compatibilità rispetto all'affitto (norma svizzera: affitto lordo non superiore a 1/3 del reddito lordo).
   - Checklist interattiva documenti: Copia CI/Permesso di soggiorno (B, C, L, G), Estratto dell'Ufficio Esecuzioni e Fallimenti (*Extrait du registre des poursuites* con meno di 3 mesi), Ultime 3 buste paga, Attestazione assicurazione RC privata.
   - Generatore lettera di motivazione in francese con modello personalizzabile.
4. **Agent Testing Workbench**:
   - Pannello per lanciare agenti sintetici:
     - *Agent Scraper Portal*: simula la scansione periodica e inserisce annunci freschi nel Vaud.
     - *Agent Facebook Scraper*: simula l'arrivo di offerte urgenti "reprise de bail" tipiche dei social.
     - *Agent Matcher & Dossier Evaluator*: valuta ogni annuncio rispetto al profilo utente e assegna un punteggio di compatibilità (distanza, budget, requisiti).
   - Log visuale in tempo reale e statistiche di acquisizione dati.

---

## 4. Architettura Tecnica & Flusso dei Dati

### Diagramma di Sistema

```
┌────────────────────────────────────────────────────────────────────────┐
│                          FRONTEND INTERFACE                            │
│  ┌──────────────────────┬──────────────────────┬────────────────────┐  │
│  │ Catalog & Split Map  │ Facebook AI Ingester │ Dossier Manager    │  │
│  └──────────┬───────────┴──────────┬───────────┴──────────┬─────────┘  │
│             │                      │                      │            │
│             ▼                      ▼                      ▼            │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ State Store (Annunci Aggregati, Filtri, Preferenze, Dossier)     │  │
│  └─────────────────────────────────┬────────────────────────────────┘  │
└────────────────────────────────────┼───────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        DATA ENGINE & AGENT LAB                         │
│  ┌────────────────────────┐  ┌────────────────┐  ┌──────────────────┐  │
│  │ Vaud Real Estate Data  │  │ Gemini 3.8     │  │ Agent Test Suite │  │
│  │ - ImmoScout24 CH       │  │ Fast Parser    │  │ - Scraper Agent  │  │
│  │ - Homegate / Anibis    │  │ - FB text to   │  │ - Social Agent   │  │
│  │ - Flatfox / Vaud feeds │  │   clean JSON   │  │ - Dossier Match  │  │
│  └────────────────────────┘  └────────────────┘  └──────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Modello Dati Principale (`Listing`)
- `id`: identificativo univoco
- `source`: `'immoscout24' | 'homegate' | 'anibis' | 'flatfox' | 'facebook_group'`
- `sourceUrl`: link originale per contattare o visualizzare
- `facebookGroupInfo?`: nome del gruppo, data post, autore (se social)
- `title`: titolo dell'annuncio
- `district`: distretto del Vaud (Lausanne, Nyon, Morges, Riviera, Jura-Nord, ecc.)
- `city`: comune (es. Lausanne, Renens, Pully, Vevey, Nyon, Lutry)
- `address`: indirizzo o quartiere approssimato
- `coordinates`: `{ lat: number, lng: number }` per proiezione su mappa
- `rentNetCHF`: affitto netto
- `chargesCHF`: spese accessorie
- `rentTotalCHF`: affitto lordo mensile
- `rooms`: numero di locali (es. 1.5, 2.5, 3.5, 4.5)
- `surfaceM2`: superficie in metri quadrati
- `floor`: piano ed ascensore
- `availableDate`: data di disponibilità immediata o concordata
- `isRepriseDeBail`: booleano per subentri rapidi
- `features`: balcone, parcheggio, lavatrice privata, ammessi animali, vista lago
- `commuteTimes`: tempi stimati verso Lausanne Gare e Ginevra (treno / auto)
- `images`: galleria fotografica dell'alloggio

---

## 5. Decisioni di Prodotto e Trade-Off

1. **Simulatore Scraper & Feed Vaud realistico per il primo MVP**:
   - *Scelta*: Fornire un dataset pre-caricato fedele con annunci dettagliati nei vari distretti del Canton Vaud, associato a un motore di simulazione agenti e importatore manuale con Gemini AI per i post Facebook.
   - *Motivazione*: I portali commerciali e Facebook bloccano il web scraping non autenticato da sandbox cloud tramite Cloudflare/reCAPTCHA; questo approccio garantisce un'applicazione immediatamente utilizzabile, solida e collaudabile, predisponendo già l'infrastruttura per le API future.
2. **Parsing Intelligente Gemini per Facebook**:
   - *Scelta*: Utilizzare `gemini-3.8-flash` per trasformare post informali e gergali scritti in francese/inglese/italiano in campi strutturati e standard svizzeri.
   - *Motivazione*: I post su Facebook sono privi di struttura uniforme (spesso contengono abbreviazioni come "3.5 pces", "1800cc", "reprise 1er mai"); l'AI normalizza il dato all'istante rendendolo filtrabile.
3. **Integrazione del Dossier di Candidatura all'interno dello Scouting**:
   - *Scelta*: Non limitarsi alla visualizzazione delle case, ma accompagnare l'utente fino alla candidatura.
   - *Motivazione*: In Svizzera trovare la casa è solo il 20% del lavoro; vincere l'assegnazione della Régie richiede dossier impeccabili e velocità nell'invio.

---

## 6. Prossimi Passi di Esecuzione (Post-Approvazione)
1. Aggiornare `metadata.json` e `<title>` / `<meta>` con il branding del progetto.
2. Generare immagini fotorealistiche di annunci residenziali nel Canton Vaud tramite `generate_image`.
3. Sviluppare il server Express con l'endpoint `/api/parse-facebook-post` integrato con `@google/genai` (`gemini-3.8-flash`).
4. Implementare la UI responsive ad alta densità con vista mappa interattiva, catalogo filtrabile, importatore social, gestore dossier e test suite agenti.
5. Verificare la compilazione con `compile_applet`.
