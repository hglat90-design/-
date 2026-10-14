import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  BatteryMedium, 
  Globe2, 
  Compass, 
  BellRing
} from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../translations';

interface AndroidHeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isAdhanActive: boolean;
}

export const AndroidHeader: React.FC<AndroidHeaderProps> = ({
  language,
  onLanguageChange,
  isAdhanActive,
}) => {
  const t = getTranslation(language);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const toggleLanguage = () => {
    onLanguageChange(language === 'ar' ? 'tr' : 'ar');
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-emerald-900/40 select-none shadow-sm">
      {/* Android System Status Bar */}
      <div className="flex items-center justify-between px-4 py-1 text-xs text-slate-400 font-mono tracking-tight border-b border-slate-900/80">
        <div className="flex items-center gap-2 font-semibold text-slate-300">
          <span>{currentTime || '12:00'}</span>
          {isAdhanActive && (
            <span className="flex items-center gap-1 text-amber-400 animate-pulse text-[10px]">
              <BellRing className="w-3 h-3" />
              <span>الأذان يُرفع</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2.5 text-slate-400">
          <span className="text-[10px] text-emerald-400 font-bold">5G</span>
          <Wifi className="w-3.5 h-3.5 text-slate-300" />
          <div className="flex items-center gap-0.5">
            <span className="text-[10px] font-bold text-slate-300">100%</span>
            <BatteryMedium className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Main App Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center shadow-lg shadow-emerald-950/40 border border-emerald-500/30">
            <Compass className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-100 tracking-wide font-cairo leading-none">
              {t.appName}
            </h1>
            <p className="text-[11px] text-emerald-400/90 mt-0.5 font-medium">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Action Controls: Pristine & Clean (Only Language Switcher) */}
        <div className="flex items-center gap-2">
          {/* Dynamic Language Switcher */}
          <button
            onClick={toggleLanguage}
            title={t.changeLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs border border-slate-700/80 shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold text-amber-300 font-cairo">
              {language === 'ar' ? 'العربية' : 'Türkçe'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
