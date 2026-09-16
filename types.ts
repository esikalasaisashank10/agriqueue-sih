export type LanguageCode = 'en' | 'hi' | 'te' | 'pa' | 'mr' | 'kn';

export interface LanguageInfo {
  code: LanguageCode;
  nativeName: string;
  englishName: string;
  flag: string;
  speechCode: string;
  scriptClass: string;
}

export interface Booking {
  id: string;
  name: string;
  slot: string;
  status: string;
  type: 'confirmed' | 'no-show' | 'promoted';
  gateClass: 'g' | 'y' | 'r';
  crop: string;
  mobile: string;
  staggeredWindow: string;
}

export interface WaitlistItem {
  wlId: string;
  name: string;
  mobile: string;
  slot: string;
  crop: string;
  priority: number;
  timestamp: string;
}

export interface ProcurementCentre {
  id: string;
  name: string;
  category: string;
  distance: string;
  hours: string;
  loadPercent: number;
  trolleysInYard: number;
  avgWaitMins: number;
  crowdLevel: 'low' | 'med' | 'full';
  waitlistCount: number;
  gatePassWindow: string;
  isOpen: boolean;
  openDate?: string;
}

export interface AgriState {
  activePersona: 'ravi' | 'suresh';
  slot1030Capacity: number;
  bookings: Booking[];
  waitlist: WaitlistItem[];
  gateTraffic: 'normal' | 'congested' | 'cleared';
  raviBooked: boolean;
  sureshWaitlisted: boolean;
  sureshPromoted: boolean;
  heroPos: number;
  lang: LanguageCode;
  autoDetectEnabled: boolean;
  voiceAssistEnabled: boolean;
  syncPortalWithApp: boolean;
}

export interface SmsMessage {
  id: string;
  sender: string;
  time: string;
  text: string;
  type: 'normal' | 'waitlist' | 'promoted';
}
