import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Volume2, 
  VolumeX, 
  Compass, 
  ChevronDown, 
  Radio, 
  Sparkles,
  ShieldCheck,
  RotateCw,
  Search
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

  // Active City state (default to Istanbul for Turkey/Diyanet or Makkah)
  const [selectedCity, setSelectedCity] = useState<CityLocation>(
    language === 'tr' ? POPULAR_CITIES[0] : POPULAR_CITIES[2]
  );
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

  // Handle GPS detection
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setLocationStatus(t.locationError);
      return;
    }
    setIsLocatingGPS(true);
    setLocationStatus(t.locating);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const gpsCity: CityLocation = {
          nameAr: 'موقعي الحالي',
          nameTr: 'Mevcut Konumum',
          countryAr: 'إحداثيات GPS',
          countryTr: 'GPS Koordinatı',
          latitude,
          longitude,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        };
        setSelectedCity(gpsCity);
        setIsLocatingGPS(false);
        setLocationStatus(t.locationGranted);
        setTimeout(() => setLocationStatus(null), 3000);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsLocatingGPS(false);
        setLocationStatus(t.locationError);
        setTimeout(() => setLocationStatus(null), 3500);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Toggle Adhan playback
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

  return (
    <div className="space-y-4 pb-4">
      {/* City & GPS Selector Bar */}
      <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 shadow-sm">
        <button
          onClick={() => setIsCityModalOpen(true)}
          className="flex items-center gap-2 text-start group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-700/40 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-900/60 transition-colors">
            <MapPin className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm text-slate-100 font-cairo">
                {language === 'ar' ? selectedCity.nameAr : selectedCity.nameTr}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <span className="text-[11px] text-slate-400 block">
              {language === 'ar' ? selectedCity.countryAr : selectedCity.countryTr}
            </span>
          </div>
        </button>

        {/* GPS Button */}
        <button
          onClick={handleDetectGPS}
          disabled={isLocatingGPS}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-xs text-slate-300 border border-slate-700 transition-colors cursor-pointer"
        >
          <RotateCw className={`w-3.5 h-3.5 text-emerald-400 ${isLocatingGPS ? 'animate-spin' : ''}`} />
          <span className="text-[11px] font-medium">{t.autoLocation}</span>
        </button>
      </div>

      {locationStatus && (
        <div className="p-2 rounded-xl bg-emerald-950/70 border border-emerald-600/40 text-emerald-300 text-xs text-center animate-fade-in">
          {locationStatus}
        </div>
      )}

      {/* Date Banner */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span className="text-emerald-400/90 font-medium font-cairo">
          {language === 'ar' ? hijriDate.formattedAr : hijriDate.formattedTr}
        </span>
        <span>
          {currentTime.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'tr-TR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </span>
      </div>

      {/* Hero Next Prayer Card (Islamic Emerald & Gold) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 border border-emerald-500/30 p-5 shadow-xl shadow-emerald-950/40">
        {/* Subtle geometric background motif */}
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
              <Radio className="w-3.5 h-3.5 animate-pulse text-amber-400" />
              <span>{t.nextPrayer}</span>
            </div>

            {/* Quick Qibla Link */}
            <button
              onClick={onNavigateToQibla}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-900/60 hover:bg-emerald-800/60 border border-emerald-700/50 text-[11px] text-amber-300 transition-colors cursor-pointer"
            >
              <Compass className="w-3 h-3 text-amber-300" />
              <span>{qiblaInfo.directionDeg}° {t.qiblaDirection}</span>
            </button>
          </div>

          {/* Prayer Name & Countdown */}
          <div className="mt-3 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-cairo tracking-wide">
              {getPrayerDisplayName(nextPrayerInfo.nextPrayer)}
            </h2>
            <div className="text-xs text-emerald-300/80 mt-0.5">
              {nextPrayerInfo.nextPrayerTime}
            </div>

            {/* Large Countdown Display */}
            <div className="mt-3 py-2 px-4 inline-block rounded-2xl bg-slate-950/70 border border-emerald-500/20 shadow-inner">
              <span className="text-3xl sm:text-4xl font-black font-mono tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-300">
                {nextPrayerInfo.formattedRemaining}
              </span>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                {t.timeRemaining}
              </p>
            </div>
          </div>

          {/* Progress Bar of prayer time interval */}
          <div className="mt-4">
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all duration-1000"
                style={{ width: `${nextPrayerInfo.progressPercent}%` }}
              />
            </div>
          </div>

          {/* Adhan Audio Test & Control Button */}
          <div className="mt-4 pt-3 border-t border-emerald-900/40 flex items-center justify-between">
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{CALCULATION_METHODS[settings.calcMethod]?.nameTr || 'Diyanet / MWL'}</span>
            </div>

            <button
              onClick={handleToggleAdhan}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-md cursor-pointer ${
                isAdhanPlaying
                  ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950'
              }`}
            >
              {isAdhanPlaying ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>{t.stopAdhan}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{t.testAdhan}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Daily Prayer Times List */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-3.5 space-y-1.5 shadow-sm">
        <h3 className="text-xs font-bold text-slate-300 px-2 py-1 flex items-center justify-between">
          <span>{t.allPrayers}</span>
          <span className="text-[10px] text-slate-400 font-normal">
            {settings.juristicMethod === 'hanafi' ? t.hanafi : t.shafiiStandard}
          </span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {prayerNamesList.map((prayer) => {
            const isNext = nextPrayerInfo.nextPrayer === prayer.id;
            const timeValue = prayerTimes[prayer.id];

            return (
              <div
                key={prayer.id}
                className={`p-3 rounded-2xl border transition-all flex flex-col justify-between ${
                  isNext
                    ? 'bg-gradient-to-br from-emerald-950 to-slate-900 border-amber-500/50 shadow-md shadow-emerald-950'
                    : 'bg-slate-900/40 border-slate-800/60 hover:border-slate-700/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold font-cairo ${isNext ? 'text-amber-300' : 'text-slate-300'}`}>
                    {prayer.ar}
                  </span>
                  {isNext && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  )}
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-lg font-bold font-mono tracking-tight text-slate-100">
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

      {/* Background Adhan Foreground Service Guarantee Card */}
      <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-emerald-900/40 flex items-start gap-3 text-xs">
        <div className="p-2 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-700/30 shrink-0">
          <Sparkles className="w-4 h-4 text-amber-300" />
        </div>
        <div className="text-slate-300">
          <p className="font-semibold text-emerald-300 text-xs">
            {t.notificationsTitle}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
            {t.backgroundServiceNotice}
          </p>
        </div>
      </div>

      {/* City Selector Modal */}
      {isCityModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
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

            {/* Cities List */}
            <div className="mt-3 overflow-y-auto space-y-1.5 flex-1 pr-1">
              {filteredCities.map((city, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedCity(city);
                    setIsCityModalOpen(false);
                  }}
                  className={`w-full text-start p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                    selectedCity.nameAr === city.nameAr
                      ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
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
