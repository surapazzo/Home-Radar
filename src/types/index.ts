export type Language = 'it' | 'fr' | 'de' | 'en';

export type ListingSource = 'immoscout24' | 'homegate' | 'anibis' | 'flatfox' | 'comparis' | 'facebook_group';

export type SwissCanton =
  | 'Zürich'
  | 'Genève'
  | 'Vaud'
  | 'Bern'
  | 'Basel-Stadt'
  | 'Ticino'
  | 'Luzern'
  | 'Zug'
  | 'Neuchâtel'
  | 'Fribourg'
  | 'Valais'
  | 'St. Gallen';

export interface Listing {
  id: string;
  title: string;
  source: ListingSource;
  sourceName: string;
  sourceUrl: string;
  facebookGroupInfo?: {
    groupName: string;
    postDate: string;
    authorName: string;
  };
  canton: SwissCanton;
  district: string;
  city: string;
  postalCode: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
    xPercent: number; // for interactive SVG map of Switzerland (0-100%)
    yPercent: number;
  };
  rentNetCHF: number;
  chargesCHF: number;
  rentTotalCHF: number;
  depositMonths: number;
  rooms: number; // e.g. 1.5, 2.5, 3.5, 4.5
  surfaceM2: number;
  floor: string;
  availableDate: string;
  isRepriseDeBail: boolean;
  features: string[];
  description: string;
  contactInfo: string;
  regieName?: string;
  commuteHubName: string; // e.g. "Zürich HB", "Lausanne Gare", "Genève Cornavin", "Basel SBB", "Lugano FFS"
  commuteHubMin: number;
  commuteLausanneGareMin?: number;
  accentGradient: string;
  createdAt: string;
  isSaved?: boolean;
}

export interface FilterState {
  searchQuery: string;
  selectedCanton: string;
  selectedCity: string;
  minRooms: number;
  maxRooms: number;
  maxRentTotalCHF: number;
  repriseOnly: boolean;
  petsAllowed: boolean;
  balconyOnly: boolean;
  parkingOnly: boolean;
  maxCommuteMin: number;
  sourceFilter: 'all' | 'portals' | 'facebook';
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'rooms_desc' | 'commute_asc';
}

export interface DossierState {
  applicantName: string;
  email: string;
  phone: string;
  currentProfession: string;
  employer: string;
  monthlyNetSalaryCHF: number;
  permitType: 'B' | 'C' | 'L' | 'G' | 'CH';
  targetCanton: string;
  hasPoursuitesExtract: boolean;
  hasSalarySlips: boolean;
  hasIdentityDoc: boolean;
  hasRCAssurance: boolean;
  hasGuarantor: boolean;
  guarantorMonthlySalaryCHF: number;
  familyMembersCount: number;
  petsInfo: string;
  customLetterNotes: string;
}

export interface AgentLog {
  id: string;
  timestamp: string;
  agentName: 'Portal Crawler' | 'Facebook Scout' | 'Dossier Matcher';
  type: 'info' | 'success' | 'alert' | 'scrape';
  message: string;
  listingId?: string;
}
