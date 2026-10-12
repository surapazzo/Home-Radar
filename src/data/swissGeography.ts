import { SwissCanton } from '../types';

export const SWISS_CANTONS: SwissCanton[] = [
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

export const SWISS_CANTON_CITIES: Record<SwissCanton, string[]> = {
  Zürich: ['Zürich', 'Winterthur', 'Dübendorf', 'Uster', 'Dietikon', 'Wetzikon'],
  Genève: ['Genève', 'Carouge', 'Lancy', 'Meyrin', 'Vernier', 'Thônex'],
  Vaud: [
    'Lausanne',
    'Renens',
    'Pully',
    'Morges',
    'Nyon',
    'Vevey',
    'Montreux',
    'Yverdon-les-Bains',
    'Lutry',
    'Rolle',
  ],
  'Basel-Stadt': ['Basel', 'Riehen', 'Bettingen'],
  Bern: ['Bern', 'Thun', 'Biel/Bienne', 'Köniz', 'Burgdorf'],
  Ticino: ['Lugano', 'Bellinzona', 'Locarno', 'Mendrisio', 'Chiasso'],
  Luzern: ['Luzern', 'Kriens', 'Emmen', 'Horw'],
  Zug: ['Zug', 'Baar', 'Cham', 'Rotkreuz'],
  Neuchâtel: ['Neuchâtel', 'La Chaux-de-Fonds', 'Le Locle'],
  Fribourg: ['Fribourg', 'Bulle', 'Villars-sur-Glâne'],
  Valais: ['Sion', 'Monthey', 'Martigny', 'Sierre', 'Brig'],
  'St. Gallen': ['St. Gallen', 'Rapperswil-Jona', 'Wil', 'Gossau'],
};

export interface CityGeoInfo {
  lat: number;
  lng: number;
  xPercent: number;
  yPercent: number;
  canton: SwissCanton;
  hub: string;
  min: number;
  postal: string;
}

export const SWISS_CITY_GEO: Record<string, CityGeoInfo> = {
  // Zürich
  Zürich: { lat: 47.3769, lng: 8.5417, xPercent: 64, yPercent: 28, canton: 'Zürich', hub: 'Zürich HB', min: 4, postal: '8001' },
  Winterthur: { lat: 47.4999, lng: 8.7241, xPercent: 72, yPercent: 23, canton: 'Zürich', hub: 'Zürich HB', min: 18, postal: '8400' },
  Dübendorf: { lat: 47.3978, lng: 8.6212, xPercent: 67, yPercent: 27, canton: 'Zürich', hub: 'Zürich HB', min: 11, postal: '8600' },
  Uster: { lat: 47.3497, lng: 8.7188, xPercent: 69, yPercent: 30, canton: 'Zürich', hub: 'Zürich HB', min: 14, postal: '8610' },
  Dietikon: { lat: 47.4061, lng: 8.4036, xPercent: 62, yPercent: 26, canton: 'Zürich', hub: 'Zürich HB', min: 12, postal: '8953' },
  Wetzikon: { lat: 47.3228, lng: 8.7981, xPercent: 70, yPercent: 32, canton: 'Zürich', hub: 'Zürich HB', min: 20, postal: '8620' },

  // Genève
  Genève: { lat: 46.2044, lng: 6.1432, xPercent: 12, yPercent: 78, canton: 'Genève', hub: 'Genève Cornavin', min: 5, postal: '1201' },
  Carouge: { lat: 46.1845, lng: 6.1394, xPercent: 13, yPercent: 81, canton: 'Genève', hub: 'Genève Cornavin', min: 12, postal: '1227' },
  Lancy: { lat: 46.1895, lng: 6.1189, xPercent: 11, yPercent: 80, canton: 'Genève', hub: 'Genève Cornavin', min: 9, postal: '1212' },
  Meyrin: { lat: 46.2333, lng: 6.0833, xPercent: 10, yPercent: 76, canton: 'Genève', hub: 'Genève Cornavin', min: 10, postal: '1217' },
  Vernier: { lat: 46.2167, lng: 6.0833, xPercent: 10, yPercent: 78, canton: 'Genève', hub: 'Genève Cornavin', min: 11, postal: '1214' },
  Thônex: { lat: 46.1911, lng: 6.1953, xPercent: 14, yPercent: 80, canton: 'Genève', hub: 'Genève Cornavin', min: 15, postal: '1226' },

  // Vaud
  Lausanne: { lat: 46.5197, lng: 6.6323, xPercent: 26, yPercent: 64, canton: 'Vaud', hub: 'Lausanne Gare', min: 4, postal: '1003' },
  Renens: { lat: 46.5342, lng: 6.5891, xPercent: 24, yPercent: 63, canton: 'Vaud', hub: 'Lausanne Gare', min: 6, postal: '1020' },
  Pully: { lat: 46.5098, lng: 6.6622, xPercent: 27, yPercent: 64, canton: 'Vaud', hub: 'Lausanne Gare', min: 8, postal: '1009' },
  Morges: { lat: 46.5105, lng: 6.4984, xPercent: 23, yPercent: 67, canton: 'Vaud', hub: 'Lausanne Gare', min: 11, postal: '1110' },
  Nyon: { lat: 46.3833, lng: 6.2394, xPercent: 16, yPercent: 74, canton: 'Vaud', hub: 'Genève Cornavin', min: 14, postal: '1260' },
  Vevey: { lat: 46.4594, lng: 6.8441, xPercent: 33, yPercent: 68, canton: 'Vaud', hub: 'Lausanne Gare', min: 15, postal: '1800' },
  Montreux: { lat: 46.4312, lng: 6.9107, xPercent: 36, yPercent: 71, canton: 'Vaud', hub: 'Lausanne Gare', min: 21, postal: '1820' },
  'Yverdon-les-Bains': { lat: 46.7785, lng: 6.6411, xPercent: 27, yPercent: 49, canton: 'Vaud', hub: 'Lausanne Gare', min: 22, postal: '1400' },
  Lutry: { lat: 46.5034, lng: 6.6868, xPercent: 28, yPercent: 65, canton: 'Vaud', hub: 'Lausanne Gare', min: 7, postal: '1095' },
  Rolle: { lat: 46.4578, lng: 6.3389, xPercent: 20, yPercent: 70, canton: 'Vaud', hub: 'Lausanne Gare', min: 20, postal: '1180' },

  // Basel-Stadt
  Basel: { lat: 47.5596, lng: 7.5886, xPercent: 44, yPercent: 16, canton: 'Basel-Stadt', hub: 'Basel SBB', min: 5, postal: '4051' },
  Riehen: { lat: 47.5833, lng: 7.6500, xPercent: 46, yPercent: 15, canton: 'Basel-Stadt', hub: 'Basel SBB', min: 10, postal: '4125' },
  Bettingen: { lat: 47.5667, lng: 7.6667, xPercent: 47, yPercent: 16, canton: 'Basel-Stadt', hub: 'Basel SBB', min: 18, postal: '4126' },

  // Bern
  Bern: { lat: 46.9480, lng: 7.4474, xPercent: 42, yPercent: 48, canton: 'Bern', hub: 'Bern Bahnhof', min: 5, postal: '3011' },
  Thun: { lat: 46.7580, lng: 7.6280, xPercent: 46, yPercent: 54, canton: 'Bern', hub: 'Bern Bahnhof', min: 19, postal: '3600' },
  'Biel/Bienne': { lat: 47.1368, lng: 7.2468, xPercent: 37, yPercent: 41, canton: 'Bern', hub: 'Bern Bahnhof', min: 25, postal: '2501' },
  Köniz: { lat: 46.9242, lng: 7.4142, xPercent: 41, yPercent: 50, canton: 'Bern', hub: 'Bern Bahnhof', min: 10, postal: '3098' },
  Burgdorf: { lat: 47.0583, lng: 7.6250, xPercent: 45, yPercent: 44, canton: 'Bern', hub: 'Bern Bahnhof', min: 15, postal: '3400' },

  // Ticino
  Lugano: { lat: 46.0037, lng: 8.9511, xPercent: 69, yPercent: 84, canton: 'Ticino', hub: 'Lugano FFS', min: 5, postal: '6900' },
  Bellinzona: { lat: 46.1928, lng: 9.0170, xPercent: 70, yPercent: 72, canton: 'Ticino', hub: 'Bellinzona FFS', min: 5, postal: '6500' },
  Locarno: { lat: 46.1670, lng: 8.7984, xPercent: 66, yPercent: 76, canton: 'Ticino', hub: 'Bellinzona FFS', min: 20, postal: '6600' },
  Mendrisio: { lat: 45.8708, lng: 8.9867, xPercent: 70, yPercent: 91, canton: 'Ticino', hub: 'Lugano FFS', min: 17, postal: '6850' },
  Chiasso: { lat: 45.8358, lng: 9.0308, xPercent: 71, yPercent: 94, canton: 'Ticino', hub: 'Lugano FFS', min: 24, postal: '6830' },

  // Luzern
  Luzern: { lat: 47.0502, lng: 8.3093, xPercent: 57, yPercent: 45, canton: 'Luzern', hub: 'Luzern Bahnhof', min: 5, postal: '6003' },
  Kriens: { lat: 47.0344, lng: 8.2778, xPercent: 56, yPercent: 46, canton: 'Luzern', hub: 'Luzern Bahnhof', min: 8, postal: '6010' },
  Emmen: { lat: 47.0781, lng: 8.3025, xPercent: 57, yPercent: 43, canton: 'Luzern', hub: 'Luzern Bahnhof', min: 9, postal: '6020' },
  Horw: { lat: 47.0167, lng: 8.3167, xPercent: 57, yPercent: 47, canton: 'Luzern', hub: 'Luzern Bahnhof', min: 10, postal: '6048' },

  // Zug
  Zug: { lat: 47.1662, lng: 8.5155, xPercent: 62, yPercent: 39, canton: 'Zug', hub: 'Zug Bahnhof', min: 4, postal: '6300' },
  Baar: { lat: 47.1953, lng: 8.5278, xPercent: 63, yPercent: 37, canton: 'Zug', hub: 'Zug Bahnhof', min: 4, postal: '6340' },
  Cham: { lat: 47.1822, lng: 8.4633, xPercent: 60, yPercent: 39, canton: 'Zug', hub: 'Zug Bahnhof', min: 6, postal: '6330' },
  Rotkreuz: { lat: 47.1417, lng: 8.4319, xPercent: 59, yPercent: 41, canton: 'Zug', hub: 'Zug Bahnhof', min: 8, postal: '6343' },

  // Neuchâtel
  Neuchâtel: { lat: 46.9928, lng: 6.9319, xPercent: 30, yPercent: 43, canton: 'Neuchâtel', hub: 'Neuchâtel Gare', min: 4, postal: '2000' },
  'La Chaux-de-Fonds': { lat: 47.1008, lng: 6.8267, xPercent: 28, yPercent: 36, canton: 'Neuchâtel', hub: 'Neuchâtel Gare', min: 28, postal: '2300' },
  'Le Locle': { lat: 47.0583, lng: 6.7497, xPercent: 26, yPercent: 38, canton: 'Neuchâtel', hub: 'Neuchâtel Gare', min: 35, postal: '2400' },

  // Fribourg
  Fribourg: { lat: 46.8065, lng: 7.1619, xPercent: 36, yPercent: 54, canton: 'Fribourg', hub: 'Fribourg Gare', min: 5, postal: '1700' },
  Bulle: { lat: 46.6186, lng: 7.0567, xPercent: 35, yPercent: 60, canton: 'Fribourg', hub: 'Fribourg Gare', min: 25, postal: '1630' },
  'Villars-sur-Glâne': { lat: 46.7933, lng: 7.1264, xPercent: 35, yPercent: 55, canton: 'Fribourg', hub: 'Fribourg Gare', min: 8, postal: '1752' },

  // Valais
  Sion: { lat: 46.2331, lng: 7.3606, xPercent: 45, yPercent: 75, canton: 'Valais', hub: 'Sion Gare', min: 5, postal: '1950' },
  Monthey: { lat: 46.2547, lng: 6.9481, xPercent: 37, yPercent: 76, canton: 'Valais', hub: 'Lausanne Gare', min: 40, postal: '1870' },
  Martigny: { lat: 46.1039, lng: 7.0725, xPercent: 40, yPercent: 80, canton: 'Valais', hub: 'Sion Gare', min: 14, postal: '1920' },
  Sierre: { lat: 46.2917, lng: 7.5333, xPercent: 48, yPercent: 73, canton: 'Valais', hub: 'Sion Gare', min: 10, postal: '3960' },
  Brig: { lat: 46.3167, lng: 7.9833, xPercent: 54, yPercent: 70, canton: 'Valais', hub: 'Brig Bahnhof', min: 5, postal: '3900' },

  // St. Gallen
  'St. Gallen': { lat: 47.4245, lng: 9.3767, xPercent: 86, yPercent: 24, canton: 'St. Gallen', hub: 'St. Gallen Bahnhof', min: 6, postal: '9000' },
  'Rapperswil-Jona': { lat: 47.2267, lng: 8.8183, xPercent: 71, yPercent: 34, canton: 'St. Gallen', hub: 'Zürich HB', min: 36, postal: '8640' },
  Wil: { lat: 47.4667, lng: 9.0500, xPercent: 80, yPercent: 23, canton: 'St. Gallen', hub: 'St. Gallen Bahnhof', min: 20, postal: '9500' },
  Gossau: { lat: 47.4167, lng: 9.2500, xPercent: 84, yPercent: 24, canton: 'St. Gallen', hub: 'St. Gallen Bahnhof', min: 10, postal: '9200' },
};

/**
 * Returns available cities filtered by selected Canton.
 * If no canton is provided, returns all cities in alphabetical order.
 */
export function getCitiesForCanton(canton?: string): string[] {
  if (canton && canton in SWISS_CANTON_CITIES) {
    return [...SWISS_CANTON_CITIES[canton as SwissCanton]].sort();
  }
  // All cities flattened and deduplicated
  const allCities = Object.values(SWISS_CANTON_CITIES).flat();
  return Array.from(new Set(allCities)).sort();
}

/**
 * Returns the canton for a given city if known.
 */
export function getCantonForCity(city: string): SwissCanton | undefined {
  if (city in SWISS_CITY_GEO) {
    return SWISS_CITY_GEO[city].canton;
  }
  for (const [canton, cities] of Object.entries(SWISS_CANTON_CITIES)) {
    if (cities.includes(city)) {
      return canton as SwissCanton;
    }
  }
  return undefined;
}
