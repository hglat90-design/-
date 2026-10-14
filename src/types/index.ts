export type Language = 'ar' | 'tr';

export type PrayerName = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export type CalculationMethodId = 
  | 'diyanet' 
  | 'mwl' 
  | 'makkah' 
  | 'egypt' 
  | 'karachi' 
  | 'isna';

export interface CalculationMethod {
  id: CalculationMethodId;
  nameAr: string;
  nameTr: string;
  fajrAngle: number;
  ishaAngle: number;
  ishaInterval?: number; // minutes after maghrib (e.g. Makkah)
}

export type JuristicMethod = 'shafii' | 'hanafi'; // Shadow factor for Asr (1x vs 2x)

export interface CityLocation {
  nameAr: string;
  nameTr: string;
  districtAr?: string;
  districtTr?: string;
  countryAr: string;
  countryTr: string;
  latitude: number;
  longitude: number;
  timezone: string;
  accuracyMeters?: number;
}

export interface QuranSurah {
  number: number;
  nameAr: string;
  nameTr: string;
  transliteration: string;
  englishName: string;
  versesCount: number;
  revelationType: 'Meccan' | 'Medinan';
  juzStart: number;
}

export interface QuranAyah {
  numberInSurah: number;
  numberInQuran: number;
  textAr: string;
  translationTr: string;
  tafsirAr: string;
  juz: number;
  page: number;
  audioUrl?: string;
}

export interface AzkarItem {
  id: string;
  arabic: string;
  turkish: string;
  transliterationTr?: string;
  count: number;
  rewardAr: string;
  rewardTr: string;
  referenceAr: string;
  referenceTr: string;
}

export interface AzkarCategory {
  id: 'morning' | 'evening' | 'after_prayer' | 'sleep' | 'wake_up' | 'quranic_duas';
  titleAr: string;
  titleTr: string;
  icon: string;
  items: AzkarItem[];
}

export interface IslamicEvent {
  titleAr: string;
  titleTr: string;
  hijriDay: number;
  hijriMonth: number;
  descriptionAr: string;
  descriptionTr: string;
}

export type AdhanVoiceId = 'makkah' | 'abdulbasit' | 'abdulghaffar' | 'abdulhakam' | 'egypt';

export interface AppSettings {
  language: Language;
  calcMethod: CalculationMethodId;
  juristicMethod: JuristicMethod;
  adhanVoice: AdhanVoiceId;
  adhanEnabled: Record<PrayerName, boolean>;
  quranFontSize: number;
  isDarkMode: boolean;
  vibrationEnabled: boolean;
}
