import { 
  CalculationMethod, 
  CalculationMethodId, 
  CityLocation, 
  JuristicMethod, 
  PrayerName, 
  PrayerTimes 
} from '../types';

export const CALCULATION_METHODS: Record<CalculationMethodId, CalculationMethod> = {
  diyanet: {
    id: 'diyanet',
    nameAr: 'رئاسة الشؤون الدينية التركية (Diyanet)',
    nameTr: 'T.C. Diyanet İşleri Başkanlığı',
    fajrAngle: 18.0,
    ishaAngle: 17.0,
  },
  mwl: {
    id: 'mwl',
    nameAr: 'رابطة العالم الإسلامي (MWL)',
    nameTr: 'Müslüman Dünya Birliği (MWL)',
    fajrAngle: 18.0,
    ishaAngle: 17.0,
  },
  makkah: {
    id: 'makkah',
    nameAr: 'جامعة أم القرى - مكة المكرمة',
    nameTr: 'Ümmü\'l-Kura Üniversitesi (Mekke)',
    fajrAngle: 18.5,
    ishaAngle: 0,
    ishaInterval: 90, // 90 min after Maghrib (120 min during Ramadan)
  },
  egypt: {
    id: 'egypt',
    nameAr: 'الهيئة المصرية العامة للمساحة',
    nameTr: 'Mısır Genel Araştırma Kurumu',
    fajrAngle: 19.5,
    ishaAngle: 17.5,
  },
  karachi: {
    id: 'karachi',
    nameAr: 'جامعة العلوم الإسلامية بكراتشي',
    nameTr: 'Karaçi İslami İlimler Üniversitesi',
    fajrAngle: 18.0,
    ishaAngle: 18.0,
  },
  isna: {
    id: 'isna',
    nameAr: 'الجمعية الإسلامية لأمريكا الشمالية (ISNA)',
    nameTr: 'Kuzey Amerika İslam Topluluğu (ISNA)',
    fajrAngle: 15.0,
    ishaAngle: 15.0,
  },
};

export const POPULAR_CITIES: CityLocation[] = [
  {
    nameAr: 'إسطنبول',
    nameTr: 'İstanbul',
    countryAr: 'تركيا',
    countryTr: 'Türkiye',
    latitude: 41.0082,
    longitude: 28.9784,
    timezone: 'Europe/Istanbul',
  },
  {
    nameAr: 'أنقرة',
    nameTr: 'Ankara',
    countryAr: 'تركيا',
    countryTr: 'Türkiye',
    latitude: 39.9334,
    longitude: 32.8597,
    timezone: 'Europe/Istanbul',
  },
  {
    nameAr: 'مكة المكرمة',
    nameTr: 'Mekke-i Mükerreme',
    countryAr: 'المملكة العربية السعودية',
    countryTr: 'Suudi Arabistan',
    latitude: 21.4225,
    longitude: 39.8262,
    timezone: 'Asia/Riyadh',
  },
  {
    nameAr: 'المدينة المنورة',
    nameTr: 'Medine-i Münevvere',
    countryAr: 'المملكة العربية السعودية',
    countryTr: 'Suudi Arabistan',
    latitude: 24.5247,
    longitude: 39.5692,
    timezone: 'Asia/Riyadh',
  },
  {
    nameAr: 'الرياض',
    nameTr: 'Riyad',
    countryAr: 'المملكة العربية السعودية',
    countryTr: 'Suudi Arabistan',
    latitude: 24.7136,
    longitude: 46.6753,
    timezone: 'Asia/Riyadh',
  },
  {
    nameAr: 'القاهرة',
    nameTr: 'Kahire',
    countryAr: 'مصر',
    countryTr: 'Mısır',
    latitude: 30.0444,
    longitude: 31.2357,
    timezone: 'Africa/Cairo',
  },
  {
    nameAr: 'القدس الشريف',
    nameTr: 'Kudüs',
    countryAr: 'فلسطين',
    countryTr: 'Filistin',
    latitude: 31.7683,
    longitude: 35.2137,
    timezone: 'Asia/Jerusalem',
  },
  {
    nameAr: 'دبي',
    nameTr: 'Dubai',
    countryAr: 'الإمارات',
    countryTr: 'Birleşik Arap Emirlikleri',
    latitude: 25.2048,
    longitude: 55.2708,
    timezone: 'Asia/Dubai',
  },
  {
    nameAr: 'الدوحة',
    nameTr: 'Doha',
    countryAr: 'قطر',
    countryTr: 'Katar',
    latitude: 25.2854,
    longitude: 51.5310,
    timezone: 'Asia/Qatar',
  },
  {
    nameAr: 'الكويت',
    nameTr: 'Kuveyt',
    countryAr: 'الكويت',
    countryTr: 'Kuveyt',
    latitude: 29.3759,
    longitude: 47.9774,
    timezone: 'Asia/Kuwait',
  },
  {
    nameAr: 'عَمّان',
    nameTr: 'Amman',
    countryAr: 'الأردن',
    countryTr: 'Ürdün',
    latitude: 31.9454,
    longitude: 35.9284,
    timezone: 'Asia/Amman',
  },
  {
    nameAr: 'لندن',
    nameTr: 'Londra',
    countryAr: 'المملكة المتحدة',
    countryTr: 'İngiltere',
    latitude: 51.5074,
    longitude: -0.1278,
    timezone: 'Europe/London',
  },
  {
    nameAr: 'باريس',
    nameTr: 'Paris',
    countryAr: 'فرنسا',
    countryTr: 'Fransa',
    latitude: 48.8566,
    longitude: 2.3522,
    timezone: 'Europe/Paris',
  },
  {
    nameAr: 'برلين',
    nameTr: 'Berlin',
    countryAr: 'ألمانيا',
    countryTr: 'Almanya',
    latitude: 52.5200,
    longitude: 13.4050,
    timezone: 'Europe/Berlin',
  },
];

// Helper astronomical functions (radians/degrees conversion)
const toRad = (deg: number) => (deg * Math.PI) / 180.0;
const toDeg = (rad: number) => (rad * 180.0) / Math.PI;

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Calculates high-precision prayer times based on Solar Position algorithms
 */
export function calculatePrayerTimes(
  lat: number,
  lng: number,
  date: Date = new Date(),
  methodId: CalculationMethodId = 'diyanet',
  juristic: JuristicMethod = 'shafii'
): PrayerTimes {
  const method = CALCULATION_METHODS[methodId] || CALCULATION_METHODS.diyanet;
  
  const d = dayOfYear(date);
  
  // Approximate solar coordinates
  // Solar declination (approximate formula by Spencer / Cooper)
  const b = (2 * Math.PI * (d - 81)) / 365;
  const declination = toRad(23.45 * Math.sin(b));
  
  // Equation of time in minutes
  const eot = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
  
  // Timezone offset in hours
  const timezoneOffset = -date.getTimezoneOffset() / 60;
  
  // Solar noon in hours (UTC+Offset)
  const solarNoon = 12 + timezoneOffset - lng / 15 - eot / 60;
  
  const phi = toRad(lat);
  
  // Helper for Sun Hour Angle given altitude angle alpha
  const hourAngle = (alphaDeg: number, isDepression = true): number | null => {
    const alpha = toRad(isDepression ? -alphaDeg : alphaDeg);
    const cosH = (Math.sin(alpha) - Math.sin(phi) * Math.sin(declination)) /
                 (Math.cos(phi) * Math.cos(declination));
    if (cosH < -1 || cosH > 1) return null; // Sun never reaches angle (polar night/day)
    return toDeg(Math.acos(cosH)) / 15; // in hours
  };
  
  // Sunrise & Sunset (accounting for atmospheric refraction 0.833 degrees)
  const sunriseHA = hourAngle(0.833, true) ?? 6;
  const sunriseHour = solarNoon - sunriseHA;
  const sunsetHour = solarNoon + sunriseHA;
  
  // Fajr
  const fajrHA = hourAngle(method.fajrAngle, true) ?? sunriseHA + 1.5;
  const fajrHour = solarNoon - fajrHA;
  
  // Dhuhr (solar noon + slight buffer, usually 1 to 2 minutes)
  const dhuhrHour = solarNoon + 0.033; // ~2 min
  
  // Asr (shadow calculation)
  // Standard Shafi'i shadow multiplier = 1, Hanafi = 2
  const shadowFactor = juristic === 'hanafi' ? 2 : 1;
  const noonZenithAngle = Math.abs(lat - toDeg(declination));
  const noonShadowLength = Math.tan(toRad(noonZenithAngle));
  const asrAltitude = toDeg(Math.atan(1 / (shadowFactor + noonShadowLength)));
  const asrHA = hourAngle(asrAltitude, false) ?? 3;
  const asrHour = solarNoon + asrHA;
  
  // Maghrib
  const maghribHour = sunsetHour + 0.033; // sunset + 2 mins buffer
  
  // Isha
  let ishaHour: number;
  if (method.ishaInterval) {
    ishaHour = maghribHour + method.ishaInterval / 60;
  } else {
    const ishaHA = hourAngle(method.ishaAngle, true) ?? 6;
    ishaHour = solarNoon + ishaHA;
  }
  
  // Format hours float to HH:mm string
  const formatTime = (h: number): string => {
    let normalized = h;
    while (normalized < 0) normalized += 24;
    while (normalized >= 24) normalized -= 24;
    
    const hours = Math.floor(normalized);
    const minutes = Math.floor((normalized - hours) * 60);
    const hh = hours.toString().padStart(2, '0');
    const mm = minutes.toString().padStart(2, '0');
    return `${hh}:${mm}`;
  };

  return {
    fajr: formatTime(fajrHour),
    sunrise: formatTime(sunriseHour),
    dhuhr: formatTime(dhuhrHour),
    asr: formatTime(asrHour),
    maghrib: formatTime(maghribHour),
    isha: formatTime(ishaHour),
  };
}

/**
 * Calculates Qibla direction angle from True North (0-360 degrees clockwise)
 * Kaaba Coordinates: Lat 21.422487, Lng 39.826206
 */
export function calculateQibla(lat: number, lng: number): {
  directionDeg: number;
  distanceKm: number;
} {
  const KAABA_LAT = 21.422487;
  const KAABA_LNG = 39.826206;

  const phi1 = toRad(lat);
  const phi2 = toRad(KAABA_LAT);
  const deltaLambda = toRad(KAABA_LNG - lng);

  // Great Circle Bearing
  const y = Math.sin(deltaLambda);
  const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLambda);
  let bearing = toDeg(Math.atan2(y, x));
  bearing = (bearing + 360) % 360;

  // Haversine Distance
  const R = 6371; // Earth radius in km
  const deltaPhi = toRad(KAABA_LAT - lat);
  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = Math.round(R * c);

  return {
    directionDeg: Math.round(bearing * 10) / 10,
    distanceKm: distance,
  };
}

export interface NextPrayerInfo {
  nextPrayer: PrayerName;
  nextPrayerTime: string;
  previousPrayer: PrayerName;
  timeRemainingSeconds: number;
  formattedRemaining: string;
  progressPercent: number;
}

export function getNextPrayerInfo(prayerTimes: PrayerTimes, now: Date = new Date()): NextPrayerInfo {
  const prayerOrder: PrayerName[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
  
  const currentMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  
  const timeToMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const timesInMinutes = prayerOrder.map(p => ({
    name: p,
    minutes: timeToMinutes(prayerTimes[p]),
    timeStr: prayerTimes[p],
  }));

  let nextIdx = -1;
  for (let i = 0; i < timesInMinutes.length; i++) {
    if (timesInMinutes[i].minutes > currentMinutes) {
      nextIdx = i;
      break;
    }
  }

  let nextPrayer: PrayerName;
  let previousPrayer: PrayerName;
  let nextPrayerMinutes: number;
  let prevPrayerMinutes: number;
  let nextPrayerTime: string;

  if (nextIdx === -1) {
    // Current time is after Isha, next is tomorrow's Fajr
    nextPrayer = 'fajr';
    previousPrayer = 'isha';
    nextPrayerMinutes = timesInMinutes[0].minutes + 24 * 60;
    prevPrayerMinutes = timesInMinutes[5].minutes;
    nextPrayerTime = timesInMinutes[0].timeStr;
  } else {
    nextPrayer = timesInMinutes[nextIdx].name;
    nextPrayerTime = timesInMinutes[nextIdx].timeStr;
    nextPrayerMinutes = timesInMinutes[nextIdx].minutes;
    
    if (nextIdx === 0) {
      previousPrayer = 'isha';
      prevPrayerMinutes = timesInMinutes[5].minutes - 24 * 60;
    } else {
      previousPrayer = timesInMinutes[nextIdx - 1].name;
      prevPrayerMinutes = timesInMinutes[nextIdx - 1].minutes;
    }
  }

  const remainingMinutes = nextPrayerMinutes - currentMinutes;
  const remainingSeconds = Math.max(0, Math.floor(remainingMinutes * 60));

  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  const formattedRemaining = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const totalInterval = nextPrayerMinutes - prevPrayerMinutes;
  const elapsed = currentMinutes - prevPrayerMinutes;
  const progressPercent = totalInterval > 0 ? Math.min(100, Math.max(0, (elapsed / totalInterval) * 100)) : 0;

  return {
    nextPrayer,
    nextPrayerTime,
    previousPrayer,
    timeRemainingSeconds: remainingSeconds,
    formattedRemaining,
    progressPercent,
  };
}
