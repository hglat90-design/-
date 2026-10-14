import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Volume2, 
  VolumeX, 
  Compass, 
  ChevronDown, 
  Radio, 
  ShieldCheck,
  RotateCw,
  Search,
  Navigation,
  Waves
} from 'lucide-react';
import { 
  AppSettings, 
  CityLocation, 
  Language, 
  PrayerName, 
  PrayerTimes 
} from '../types';
import { getTranslation } from '../translations';
import { 
  calculatePrayerTimes, 
  getNextPrayerInfo, 
  POPULAR_CITIES,
  CALCULATION_METHODS,
  calculateQibla
} from '../utils/prayerCalculator';
import { getHijriDate } from '../utils/hijriCalendar';
import { playAdhan, stopAdhan } from '../utils/soundEffects';

interface PrayerScreenProps {
  language: Language;
  settings: AppSettings;
  onNavigateToQibla: () => void;
  onAdhanStateChange: (isPlaying: boolean) => void;
}

export const PrayerScreen: React.FC<PrayerScreenProps> = ({
  language,
  settings,
  onNavigateToQibla,
  onAdhanStateChange,
}) => {
  const t = getTranslation(language);

  // Active City and District state with localStorage persistence
  const [selectedCity, setSelectedCity] = useState<CityLocation>(() => {
    const saved = localStorage.getItem('almuslim_saved_city');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return language === 'tr' ? POPULAR_CITIES[0] : POPULAR_CITIES[2];
  });
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  // Computed Prayer Times & Countdown
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes>(() =>
    calculatePrayerTimes(
      selectedCity.latitude,
      selectedCity.longitude,
      new Date(),
      settings.calcMethod,
      settings.juristicMethod
    )
  );

  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isAdhanPlaying, setIsAdhanPlaying] = useState(false);

  // Recalculate prayer times whenever city or calculation settings change
  useEffect(() => {
    const times = calculatePrayerTimes(
      selectedCity.latitude,
      selectedCity.longitude,
      new Date(),
      settings.calcMethod,
      settings.juristicMethod
    );
    setPrayerTimes(times);
  }, [selectedCity, settings.calcMethod, settings.juristicMethod]);

  // Ticking timer for live countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const nextPrayerInfo = getNextPrayerInfo(prayerTimes, currentTime);
  const hijriDate = getHijriDate(currentTime);
  const qiblaInfo = calculateQibla(selectedCity.latitude, selectedCity.longitude);

  // High Precision GPS with Reverse Geocoding for Exact District (الحي) & City
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setLocationStatus(t.locationError);
      return;
    }
    setIsLocatingGPS(true);
    setLocationStatus(t.locating);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        let districtName = '';
        let cityName = language === 'ar' ? 'موقعي الحالي' : 'Mevcut Konumum';
        let countryName = '';

        try {
          // 1. Try OpenStreetMap Nominatim for exact neighborhood / suburb / quarter
          const nominatimRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&accept-language=${language}`
          );
          if (nominatimRes.ok) {
            const data = await nominatimRes.json();
            const addr = data.address || {};
            districtName = addr.neighbourhood || addr.suburb || addr.quarter || addr.residential || addr.city_district || addr.district || '';
            cityName = addr.city || addr.town || addr.village || addr.municipality || addr.state || cityName;
            countryName = addr.country || '';
          }
        } catch (e) {
          console.debug('Nominatim notice, trying secondary geocoder...', e);
        }

        // 2. If districtName still empty, try BigDataCloud
        if (!districtName) {
          try {
            const bdcRes = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=${language}`
            );
            if (bdcRes.ok) {
              const data = await bdcRes.json();
              districtName = data.locality || data.district || '';
              if (!cityName || cityName === 'موقعي الحالي' || cityName === 'Mevcut Konumum') {
                cityName = data.city || data.principalSubdivision || cityName;
              }
              if (!countryName) countryName = data.countryName || '';
            }
          } catch (e) {
            console.debug('BigDataCloud geocoder notice:', e);
          }
        }

        // Clean up district formatting (e.g. ensure 'حي ' prefix in Arabic)
        let formattedDistrictAr: string | undefined = undefined;
        let formattedDistrictTr: string | undefined = undefined;

        if (districtName) {
          formattedDistrictAr = districtName.startsWith('حي') ? districtName : `حي ${districtName}`;
          formattedDistrictTr = `${districtName} Mahallesi`;
        }

        const gpsCity: CityLocation = {
          nameAr: cityName,
          nameTr: cityName,
          districtAr: formattedDistrictAr,
          districtTr: formattedDistrictTr,
          countryAr: countryName || 'إحداثيات GPS',
          countryTr: countryName || 'GPS Koordinatı',
          latitude,
          longitude,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
          accuracyMeters: Math.round(accuracy || 10),
        };

        setSelectedCity(gpsCity);
        localStorage.setItem('almuslim_saved_city', JSON.stringify(gpsCity));
        setIsLocatingGPS(false);

        const accuracyLabel = `(±${Math.round(accuracy || 10)} ${t.meters})`;
        const districtLabel = formattedDistrictAr ? ` - ${formattedDistrictAr}` : '';
        setLocationStatus(`${t.locationGranted}${districtLabel} ${accuracyLabel}`);
        setTimeout(() => setLocationStatus(null), 4500);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsLocatingGPS(false);
        setLocationStatus(t.locationError);
        setTimeout(() => setLocationStatus(null), 3500);
      },
      { timeout: 15000, enableHighAccuracy: true, maximumAge: 0 }
    );
  };

  // Toggle authentic Adhan audio playback
  const handleToggleAdhan = () => {
    if (isAdhanPlaying) {
      stopAdhan();
      setIsAdhanPlaying(false);
      onAdhanStateChange(false);
    } else {
      setIsAdhanPlaying(true);
      onAdhanStateChange(true);
      playAdhan(settings.adhanVoice, () => {
        setIsAdhanPlaying(false);
        onAdhanStateChange(false);
      });
    }
  };

  const prayerNamesList: { id: PrayerName; ar: string; tr: string }[] = [
    { id: 'fajr', ar: t.fajr, tr: t.fajr },
    { id: 'sunrise', ar: t.sunrise, tr: t.sunrise },
    { id: 'dhuhr', ar: t.dhuhr, tr: t.dhuhr },
    { id: 'asr', ar: t.asr, tr: t.asr },
    { id: 'maghrib', ar: t.maghrib, tr: t.maghrib },
    { id: 'isha', ar: t.isha, tr: t.isha },
  ];

  const getPrayerDisplayName = (pName: PrayerName) => {
    return t[pName] || pName;
  };

  const filteredCities = POPULAR_CITIES.filter(c =>
    c.nameAr.includes(citySearchQuery) ||
    c.nameTr.toLowerCase().includes(citySearchQuery.toLowerCase()) ||
    c.countryTr.toLowerCase().includes(citySearchQuery.toLowerCase()) ||
    c.countryAr.includes(citySearchQuery)
  );

  const displayDistrict = language === 'ar' ? selectedCity.districtAr : selectedCity.districtTr;

  return (
    <div className="space-y-4 pb-4">
      {/* City & High-Precision District Bar */}
      <div className="flex items-center justify-between bg-slate-900/80 border border-emerald-900/40 rounded-2xl p-3 shadow-md">
        <button
          onClick={() => setIsCityModalOpen(true)}
          className="flex items-center gap-2.5 text-start group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-600/40 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-900/60 transition-colors shadow-inner">
            <MapPin className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-slate-100 font-cairo">
                {displayDistrict ? `${displayDistrict}، ` : ''}
                {language === 'ar' ? selectedCity.nameAr : selectedCity.nameTr}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition-colors" />
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
              <span>{language === 'ar' ? selectedCity.countryAr : selectedCity.countryTr}</span>
              {selectedCity.accuracyMeters && (
                <span className="text-[10px] text-emerald-400 font-mono font-semibold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/40">
                  GPS ±{selectedCity.accuracyMeters}{t.meters}
                </span>
              )}
            </div>
          </div>
        </button>

        {/* GPS Button */}
        <button
          onClick={handleDetectGPS}
          disabled={isLocatingGPS}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-900/80 to-slate-900 hover:from-emerald-800 hover:to-slate-800 text-xs text-emerald-300 border border-emerald-600/40 transition-all shadow-sm cursor-pointer active:scale-95"
        >
          <Navigation className={`w-3.5 h-3.5 text-amber-400 ${isLocatingGPS ? 'animate-spin' : ''}`} />
          <span className="text-[11px] font-bold font-cairo">{t.autoLocation}</span>
        </button>
      </div>

      {locationStatus && (
        <div className="p-2.5 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-200 text-xs text-center font-medium shadow-md">
          {locationStatus}
        </div>
      )}

      {/* Date Banner */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span className="text-amber-300/90 font-bold font-cairo">
          {language === 'ar' ? hijriDate.formattedAr : hijriDate.formattedTr}
        </span>
        <span className="text-slate-400 font-medium">
          {currentTime.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'tr-TR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </span>
      </div>

      {/* Hero Next Prayer Card (Islamic Emerald & Gold) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 border border-emerald-500/30 p-5 shadow-xl shadow-emerald-950/50">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-semibold">
              <Radio className="w-3.5 h-3.5 animate-pulse text-amber-400" />
              <span>{t.nextPrayer}</span>
            </div>

            {/* Quick Qibla Link */}
            <button
              onClick={onNavigateToQibla}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-600/50 text-xs text-amber-300 transition-colors cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-amber-300" />
              <span>{qiblaInfo.directionDeg}° {t.qiblaDirection}</span>
            </button>
          </div>

          {/* Prayer Name & Countdown */}
          <div className="mt-3 text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-100 font-cairo tracking-wide">
              {getPrayerDisplayName(nextPrayerInfo.nextPrayer)}
            </h2>
            <div className="text-xs text-emerald-300/90 mt-0.5 font-mono">
              {nextPrayerInfo.nextPrayerTime}
            </div>

            {/* Large Countdown Display */}
            <div className="mt-3.5 py-2.5 px-6 inline-block rounded-2xl bg-slate-950/80 border border-emerald-500/30 shadow-inner">
              <span className="text-3xl sm:text-5xl font-black font-mono tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-300">
                {nextPrayerInfo.formattedRemaining}
              </span>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-semibold">
                {t.timeRemaining}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all duration-1000"
                style={{ width: `${nextPrayerInfo.progressPercent}%` }}
              />
            </div>
          </div>

          {/* Authentic Real Adhan Playback Banner & Control */}
          <div className="mt-4 pt-3.5 border-t border-emerald-900/50 flex items-center justify-between">
            <div className="text-xs text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="truncate max-w-[170px] sm:max-w-xs">
                <span className="text-slate-400 text-[10px] block leading-none">
                  {t.adhanAlarm}:
                </span>
                <span className="font-semibold text-amber-300 text-[11px] truncate block font-cairo">
                  {t[`${settings.adhanVoice}Adhan` as keyof typeof t] || t.makkahAdhan}
                </span>
              </div>
            </div>

            <button
              onClick={handleToggleAdhan}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg cursor-pointer ${
                isAdhanPlaying
                  ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950'
              }`}
            >
              {isAdhanPlaying ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span className="font-cairo">{t.stopAdhan}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-slate-950" />
                  <span className="font-cairo">{t.testAdhan}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Daily Prayer Times Matrix */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 space-y-2 shadow-sm">
        <div className="flex items-center justify-between text-xs font-bold text-slate-200 px-1 pb-1">
          <span>{t.allPrayers}</span>
          <span className="text-[11px] text-emerald-400 font-medium">
            {CALCULATION_METHODS[settings.calcMethod]?.nameAr || 'رئاسة الشؤون الدينية'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {prayerNamesList.map((prayer) => {
            const isNext = nextPrayerInfo.nextPrayer === prayer.id;
            const timeValue = prayerTimes[prayer.id];

            return (
              <div
                key={prayer.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isNext
                    ? 'bg-gradient-to-br from-emerald-950 to-slate-900 border-amber-400 shadow-md shadow-emerald-950'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold font-cairo ${isNext ? 'text-amber-300' : 'text-slate-300'}`}>
                    {prayer.ar}
                  </span>
                  {isNext && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  )}
                </div>
                <div className="mt-2.5 flex items-baseline justify-between">
                  <span className="text-xl font-extrabold font-mono tracking-tight text-slate-100">
                    {timeValue}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {prayer.tr}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* City & District Selector Modal */}
      {isCityModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-5 max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-slate-100 font-cairo">
                {t.selectCity}
              </h3>
              <button
                onClick={() => setIsCityModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Search Input */}
            <div className="mt-3 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={citySearchQuery}
                onChange={(e) => setCitySearchQuery(e.target.value)}
                placeholder={language === 'ar' ? 'ابحث عن اسم المدينة...' : 'Şehir adı arayın...'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Popular Cities List */}
            <div className="mt-3 overflow-y-auto space-y-1.5 flex-1 pr-1">
              {filteredCities.map((city, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedCity(city);
                    localStorage.setItem('almuslim_saved_city', JSON.stringify(city));
                    setIsCityModalOpen(false);
                  }}
                  className={`w-full text-start p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                    selectedCity.nameAr === city.nameAr
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                      : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm text-slate-100 font-cairo">
                      {language === 'ar' ? city.nameAr : city.nameTr}
                    </div>
                    <div className="text-xs text-slate-400">
                      {language === 'ar' ? city.countryAr : city.countryTr}
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
