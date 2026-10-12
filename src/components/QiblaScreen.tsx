import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  MapPin, 
  Navigation2, 
  CheckCircle2, 
  RotateCw,
  Sparkles,
  Sliders
} from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../translations';
import { calculateQibla, POPULAR_CITIES } from '../utils/prayerCalculator';
import { triggerHaptic } from '../utils/soundEffects';

interface QiblaScreenProps {
  language: Language;
}

export const QiblaScreen: React.FC<QiblaScreenProps> = ({ language }) => {
  const t = getTranslation(language);

  // User location (default to Istanbul or Makkah, or GPS)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; cityName: string }>({
    lat: language === 'tr' ? 41.0082 : 21.4225,
    lng: language === 'tr' ? 28.9784 : 39.8262,
    cityName: language === 'tr' ? 'İstanbul' : 'مكة المكرمة',
  });

  // Device heading (0 - 360 degrees)
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [hasCompassSensor, setHasCompassSensor] = useState<boolean>(false);
  const [manualHeading, setManualHeading] = useState<number>(0);
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);

  // Compute Qibla angle & distance
  const qiblaData = calculateQibla(userLocation.lat, userLocation.lng);

  // Current effective heading
  const currentHeading = hasCompassSensor ? deviceHeading : manualHeading;

  // Relative angle to Kaaba (0 means pointing directly at Kaaba)
  const relativeAngle = ((qiblaData.directionDeg - currentHeading) + 360) % 360;
  const isFacingQibla = relativeAngle <= 4 || relativeAngle >= 356;

  // Sensor listener
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      let heading: number | null = null;

      // WebKit compass heading (iOS)
      if ((e as any).webkitCompassHeading !== undefined) {
        heading = (e as any).webkitCompassHeading;
      } else if (e.alpha !== null) {
        // Android standard heading
        heading = (360 - e.alpha) % 360;
      }

      if (heading !== null) {
        setHasCompassSensor(true);
        setDeviceHeading(Math.round(heading));
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  // Vibration when aligning with Qibla
  useEffect(() => {
    if (isFacingQibla) {
      triggerHaptic(40);
    }
  }, [isFacingQibla]);

  const handleRequestGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            cityName: language === 'ar' ? 'موقعي الدقيق (GPS)' : 'Hassas Konumum (GPS)',
          });
        },
        (err) => {
          console.warn('Geolocation error:', err);
        }
      );
    }
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Top Info Banner */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <div>
            <span className="font-semibold text-slate-100 font-cairo">
              {userLocation.cityName}
            </span>
            <span className="text-[10px] text-slate-400 block font-mono">
              {userLocation.lat.toFixed(2)}°, {userLocation.lng.toFixed(2)}°
            </span>
          </div>
        </div>

        <button
          onClick={handleRequestGPS}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t.autoLocation}</span>
        </button>
      </div>

      {/* Main Qibla Compass Card */}
      <div className={`relative overflow-hidden rounded-3xl border transition-all p-6 text-center shadow-xl ${
        isFacingQibla
          ? 'bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 border-amber-400 shadow-emerald-500/20 ring-2 ring-amber-400/30'
          : 'bg-slate-900/80 border-slate-800 shadow-slate-950'
      }`}>
        {/* Status Callout */}
        <div className="flex items-center justify-center gap-1.5 mb-4">
          {isFacingQibla ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-500 text-emerald-200 text-xs font-bold animate-pulse">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>{t.facingQibla}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs">
              <Compass className="w-4 h-4 text-emerald-400 animate-spin-slow" />
              <span>{t.turnToQibla}</span>
            </div>
          )}
        </div>

        {/* Circular Compass Dial */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto my-4 flex items-center justify-center">
          {/* Compass Outer Ring with degree markings */}
          <div
            className="absolute inset-0 rounded-full border-4 border-slate-800 shadow-inner flex items-center justify-center transition-transform duration-300 ease-out"
            style={{ transform: `rotate(${-currentHeading}deg)` }}
          >
            {/* North, East, South, West labels */}
            <span className="absolute top-2 text-xs font-bold text-rose-500 font-mono">N</span>
            <span className="absolute right-2 text-xs font-bold text-slate-400 font-mono">E</span>
            <span className="absolute bottom-2 text-xs font-bold text-slate-400 font-mono">S</span>
            <span className="absolute left-2 text-xs font-bold text-slate-400 font-mono">W</span>

            {/* Minor degree ticks */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <div
                key={deg}
                className="absolute w-full h-full pointer-events-none"
                style={{ transform: `rotate(${deg}deg)` }}
              >
                <div className={`mx-auto w-0.5 ${deg % 90 === 0 ? 'h-3 bg-slate-500' : 'h-1.5 bg-slate-700'}`} />
              </div>
            ))}

            {/* Golden Kaaba Needle Target on the compass circle */}
            <div
              className="absolute w-full h-full pointer-events-none"
              style={{ transform: `rotate(${qiblaData.directionDeg}deg)` }}
            >
              <div className="mx-auto flex flex-col items-center -mt-3.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500 border border-amber-300 text-slate-950 flex items-center justify-center font-bold text-xs shadow-lg shadow-amber-500/50 animate-bounce">
                  🕋
                </div>
              </div>
            </div>
          </div>

          {/* Center Stationary Phone Indicator Needle */}
          <div className="relative z-10 w-24 h-24 rounded-full bg-slate-950/90 border-2 border-emerald-500/40 flex flex-col items-center justify-center shadow-lg">
            <Navigation2 className={`w-8 h-8 transition-colors ${
              isFacingQibla ? 'text-amber-400 scale-110' : 'text-emerald-400'
            }`} />
            <span className="text-[11px] font-mono font-bold text-slate-200 mt-0.5">
              {currentHeading}°
            </span>
          </div>

          {/* Glowing pulse ring if aligned */}
          {isFacingQibla && (
            <div className="absolute inset-2 rounded-full border-2 border-amber-400/60 animate-ping pointer-events-none" />
          )}
        </div>

        {/* Degrees & Distance Info Badges */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800/60 text-center">
          <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">
              {t.qiblaDirection}
            </span>
            <span className="text-xl font-bold font-mono text-amber-400">
              {qiblaData.directionDeg}°
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">
              {t.distanceToMakkah}
            </span>
            <span className="text-xl font-bold font-mono text-emerald-400">
              {qiblaData.distanceKm.toLocaleString()} {t.kilometers}
            </span>
          </div>
        </div>

        {/* Manual Compass Heading Slider (For testing or devices without gyroscope) */}
        {!hasCompassSensor && (
          <div className="mt-5 p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="flex items-center gap-1">
                <Sliders className="w-3 h-3 text-emerald-400" />
                <span>{language === 'ar' ? 'محاكاة تدوير الهاتف يدوياً:' : 'Pusulayı Elle Döndür (Simülasyon):'}</span>
              </span>
              <span className="font-mono text-amber-300 font-bold">{manualHeading}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="359"
              value={manualHeading}
              onChange={(e) => setManualHeading(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              {language === 'ar' 
                ? 'عند فتح التطبيق على هاتف أندرويد حقيقي، يتم استشعار البوصلة تلقائياً عبر SensorManager.'
                : 'Gerçek bir Android cihazında SensorManager donanım pusulasını otomatik algılar.'}
            </p>
          </div>
        )}
      </div>

      {/* Sensor Calibration Tip */}
      <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-400">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
        <span>{t.calibrateCompass}</span>
      </div>
    </div>
  );
};
