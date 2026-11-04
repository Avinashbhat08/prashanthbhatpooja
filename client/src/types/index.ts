export type Role = 'ADMIN' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive?: boolean;
}

export interface PoojaCategory {
  id: string;
  nameEnglish: string;
  nameKannada: string;
  isActive: boolean;
  _count?: {
    items: number;
  };
}

export interface PoojaItem {
  id: string;
  nameEnglish: string;
  nameKannada: string;
  categoryId: string;
  category?: {
    id: string;
    nameEnglish: string;
    nameKannada: string;
  };
  defaultQuantity?: string | null;
  isActive: boolean;
  isCustom?: boolean;
}

export interface SelectedItem {
  item: PoojaItem;
  quantity: string;
}

export interface GalleryImage {
  id: string;
  imageUrl: string;
  images?: string[];
  captionEnglish: string;
  captionKannada: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
}

export interface PoojaDetailsFormData {
  poojaName: string;
  poojaDate: string;
  poojaTime: string;
  personName: string;
  gothra?: string;
  nakshatra?: string;
  contactNumber?: string;
  location?: string;
  notes?: string;
}

export interface PoojaRequestItem {
  id?: string;
  poojaItemId?: string | null;
  nameEnglish: string;
  nameKannada: string;
  quantity?: string | null;
}

export interface PoojaRequestRecord {
  id: string;
  userId?: string | null;
  poojaName: string;
  poojaDate: string;
  poojaTime: string;
  personName: string;
  gothra?: string | null;
  nakshatra?: string | null;
  contactNumber?: string | null;
  location?: string | null;
  notes?: string | null;
  createdAt: string;
  items: PoojaRequestItem[];
}

export interface WebsiteSettings {
  purohit_name?: string;
  purohit_name_kannada?: string;
  purohit_phone?: string;
  purohit_address?: string;
  purohit_address_kannada?: string;
  google_maps_url?: string;
  [key: string]: string | undefined;
}

export type HoroscopeStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'CALCULATION_COMPLETED'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED';

export interface HoroscopeFormData {
  personName: string;
  dateOfBirth: string; // YYYY-MM-DD
  timeOfBirth: string; // HH:MM
  birthPlace: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  contactNumber: string;
  preferredLanguage?: 'en' | 'kn';
  notes?: string;
}

export interface PlanetPosition {
  name: string;
  nameKannada: string;
  symbol: string;
  longitude: number;
  rashiId: number;
  rashiEnglish: string;
  rashiKannada: string;
  degreeInSign: number;
  formattedDeg: string;
  nakshatraId: number;
  nakshatraEnglish: string;
  nakshatraKannada: string;
  pada: number;
  isRetrograde: boolean;
  house: number;
}

export interface DashaPeriod {
  lord: string;
  lordKannada: string;
  startDate: string;
  endDate: string;
  durationYears: number;
  isBirthDasha: boolean;
}

export interface PratyantardashaItem {
  id: string;
  lord: string;
  lordKannada: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  status: 'COMPLETED' | 'RUNNING' | 'UPCOMING';
  sequenceNumber: number;
}

export interface AntardashaItem {
  id: string;
  lord: string;
  lordKannada: string;
  startDate: string;
  endDate: string;
  durationYears: number;
  durationMonths: number;
  durationDays: number;
  status: 'COMPLETED' | 'RUNNING' | 'UPCOMING';
  sequenceNumber: number;
  pratyantardashas: PratyantardashaItem[];
}

export interface MahadashaItem {
  id: string;
  lord: string;
  lordKannada: string;
  fullYears: number;
  startDate: string;
  endDate: string;
  effectiveDurationYears: number;
  isBirthDasha: boolean;
  status: 'COMPLETED' | 'RUNNING' | 'UPCOMING';
  sequenceNumber: number;
  antardashas: AntardashaItem[];
}

export interface CurrentDashaPeriod {
  lord: string;
  lordKannada: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  elapsedDays: number;
  remainingDays: number;
  progressPercent: number;
  formattedRemaining: string;
  formattedRemainingKannada: string;
}

export interface CurrentDashaHierarchy {
  asOfDate: string;
  mahadasha: CurrentDashaPeriod;
  antardasha: CurrentDashaPeriod;
  pratyantardasha: CurrentDashaPeriod;
  nextTransition: {
    level: 'PRATYANTARDASHA' | 'ANTARDASHA' | 'MAHADASHA';
    nextLord: string;
    nextLordKannada: string;
    transitionDate: string;
  };
}

export interface DashaInterpretation {
  category: 'CAREER' | 'FINANCE' | 'EDUCATION' | 'MARRIAGE' | 'FAMILY' | 'SPIRITUAL' | 'HEALTH';
  categoryEnglish: string;
  categoryKannada: string;
  headlineEnglish: string;
  headlineKannada: string;
  analysisEnglish: string;
  analysisKannada: string;
  recommendedRemedyEnglish?: string;
  recommendedRemedyKannada?: string;
}

export interface VimshottariDashaResult {
  engineVersion: string;
  ayanamsa: string;
  yearConvention: string;
  birthTimestamp: string;
  birthNakshatra: {
    id: number;
    nameEnglish: string;
    nameKannada: string;
    pada: number;
    lord: string;
    lordKannada: string;
    degreeInNakshatra: number;
    formattedDegree: string;
  };
  birthDashaBalance: {
    startingLord: string;
    startingLordKannada: string;
    fullDurationYears: number;
    balanceFraction: number;
    balanceYears: number;
    balanceMonths: number;
    balanceDays: number;
    formattedBalanceEnglish: string;
    formattedBalanceKannada: string;
    elapsedFraction: number;
    elapsedYears: number;
  };
  mahadashas: MahadashaItem[];
  currentDasha: CurrentDashaHierarchy;
  interpretations: DashaInterpretation[];
}

export interface DoshaItem {
  id: string;
  nameEnglish: string;
  nameKannada: string;
  detected: boolean;
  confirmed: boolean;
  severity: 'None' | 'Low' | 'Medium' | 'High';
  reasoningEnglish: string;
  reasoningKannada: string;
  reviewerNotes: string;
  cancellationInfo?: string;
}

export interface RemedyItem {
  id: string;
  titleEnglish: string;
  titleKannada: string;
  descriptionEnglish: string;
  descriptionKannada: string;
  traditionalReasonEnglish: string;
  traditionalReasonKannada: string;
  recommended: boolean;
  approved: boolean;
}

export interface HoroscopeCalculationResult {
  personName: string;
  dateOfBirth: string;
  timeOfBirth: string;
  birthPlace: string;
  latitude: number;
  longitude: number;
  julianDay: number;
  ayanamsha: number;
  formattedAyanamsha: string;

  janmaRashi: {
    id: number;
    nameEnglish: string;
    nameKannada: string;
    lord: string;
    lordKannada: string;
  };

  suryaRashi: {
    id: number;
    nameEnglish: string;
    nameKannada: string;
  };

  lagna: {
    id: number;
    nameEnglish: string;
    nameKannada: string;
    longitude: number;
    degreeInSign: number;
    formattedDeg: string;
    nakshatraEnglish: string;
    nakshatraKannada: string;
    pada: number;
  };

  nakshatra: {
    id: number;
    nameEnglish: string;
    nameKannada: string;
    pada: number;
    lord: string;
  };

  panchanga?: {
    tithi: { id: number; nameEnglish: string; nameKannada: string; paksha: string; pakshaKannada: string };
    yoga: { id: number; nameEnglish: string; nameKannada: string };
    karana: { id: number; nameEnglish: string; nameKannada: string };
  };

  planets: PlanetPosition[];
  houses: { houseNumber: number; rashiId: number; rashiEnglish: string; rashiKannada: string; planets: string[] }[];
  dashas: DashaPeriod[];
  vimshottari?: VimshottariDashaResult;
  southIndianChart: { rashiId: number; rashiEnglish: string; rashiKannada: string; isLagna: boolean; planets: string[] }[];
  northIndianChart: { houseNumber: number; rashiId: number; rashiEnglish: string; rashiKannada: string; planets: string[] }[];
  doshas: DoshaItem[];
  remedies: RemedyItem[];
}

export interface HoroscopeRequestRecord {
  id: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  personName: string;
  dateOfBirth: string;
  timeOfBirth: string;
  birthPlace: string;
  gender?: string | null;
  contactNumber: string;
  preferredLanguage: string;
  notes?: string | null;
  status: HoroscopeStatus;
  assignedReviewer?: string | null;
  calculationData?: HoroscopeCalculationResult | null;
  doshaAnalysis?: DoshaItem[] | null;
  remedies?: RemedyItem[] | null;
  purohitComments?: string | null;
  approvedBy?: string | null;
  approvedAt?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationRecord {
  id: string;
  userId: string;
  horoscopeRequestId?: string | null;
  titleEnglish: string;
  titleKannada: string;
  messageEnglish: string;
  messageKannada: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}


