import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  BatteryMedium, 
  Code2, 
  Globe2, 
  Compass, 
  BellRing,
  Smartphone
} from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../translations';

interface AndroidHeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenCodeExplorer: () => void;
  onOpenInstallModal: () => void;
  isAdhanActive: boolean;
}

export const AndroidHeader: React.FC<AndroidHeaderProps> = ({
  language,
  onLanguageChange,
  onOpenCodeExplorer,
  onOpenInstallModal,
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
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-emerald-900/30 select-none">
      {/* Android Status Bar */}
      <div className="flex items-center justify-between px-4 py-1.5 text-xs text-slate-400 font-mono tracking-tight">
        <div className="flex items-center gap-1.5 font-semibold text-slate-300">
          <span>{currentTime || '12:00'}</span>
          {isAdhanActive && (
            <span className="flex items-center gap-1 text-amber-400 animate-pulse text-[10px]">
              <BellRing className="w-3 h-3" />
              <span>Adhan</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-[10px] text-emerald-400 font-bold">5G</span>
          <Wifi className="w-3.5 h-3.5" />
          <div className="flex items-center gap-0.5">
            <span className="text-[10px]">98%</span>
            <BatteryMedium className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* App Action Bar */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center shadow-lg shadow-emerald-900/30 border border-emerald-500/20">
            <Compass className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100 tracking-wide font-cairo leading-none">
              {t.appName}
            </h1>
            <p className="text-[11px] text-emerald-400/90 mt-0.5">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Install App Button */}
          <button
            onClick={onOpenInstallModal}
            title={language === 'ar' ? 'تثبيت التطبيق على الهاتف (APK)' : 'Uygulamayı Yükle'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5 text-slate-950" />
            <span className="font-cairo">{language === 'ar' ? 'تثبيت التطبيق' : 'Yükle'}</span>
          </button>

          {/* Kotlin Code Explorer Button */}
          <button
            onClick={onOpenCodeExplorer}
            title={language === 'ar' ? 'استعراض كود Kotlin' : 'Kotlin Kodunu İncele'}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/50 text-emerald-300 text-xs border border-emerald-800/40 transition-colors shadow-sm cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono font-medium">Kotlin</span>
          </button>

          {/* Dynamic Language Switcher */}
          <button
            onClick={toggleLanguage}
            title={t.changeLang}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-slate-200 text-xs border border-slate-700 transition-colors cursor-pointer"
          >
            <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-amber-300">
              {language === 'ar' ? 'العربية 🇸🇦' : 'Türkçe 🇹🇷'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
