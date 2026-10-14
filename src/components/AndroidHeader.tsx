import React from 'react';
import { 
  Globe2, 
  Compass, 
  BellRing,
  Bell,
  Volume2,
  Square
} from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../translations';

interface AndroidHeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenReminders: () => void;
  isAdhanActive: boolean;
  onStopAdhan?: () => void;
  isAutoAdhanEnabled: boolean;
}

export const AndroidHeader: React.FC<AndroidHeaderProps> = ({
  language,
  onLanguageChange,
  onOpenReminders,
  isAdhanActive,
  onStopAdhan,
  isAutoAdhanEnabled,
}) => {
  const t = getTranslation(language);

  const toggleLanguage = () => {
    onLanguageChange(language === 'ar' ? 'tr' : 'ar');
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-emerald-900/40 select-none shadow-md">
      {/* Active Adhan Live Audio Indicator Banner */}
      {isAdhanActive && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-emerald-600 text-slate-950 px-4 py-2 flex items-center justify-between shadow-inner animate-fade-in">
          <div className="flex items-center gap-2 font-bold text-xs font-cairo">
            <BellRing className="w-4 h-4 animate-bounce" />
            <span className="tracking-wide">
              {language === 'ar' ? 'الأذان يُرفع الآن • حي على الصلاة' : 'Ezan Okunuyor • Haydi Namaza'}
            </span>
            <div className="flex items-center gap-0.5 ml-2">
              <span className="w-1 h-3 bg-slate-950 rounded-full animate-pulse" />
              <span className="w-1 h-4 bg-slate-950 rounded-full animate-pulse delay-75" />
              <span className="w-1 h-2 bg-slate-950 rounded-full animate-pulse delay-150" />
            </div>
          </div>
          {onStopAdhan && (
            <button
              onClick={onStopAdhan}
              className="px-2.5 py-1 rounded-lg bg-slate-950 text-amber-300 text-[11px] font-extrabold flex items-center gap-1 hover:bg-slate-900 transition-all cursor-pointer active:scale-95 shadow-sm"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>{language === 'ar' ? 'إيقاف' : 'Durdur'}</span>
            </button>
          )}
        </div>
      )}

      {/* Main Production App Navigation Bar */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* App Title & Islamic Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 flex items-center justify-center shadow-lg shadow-emerald-950/50 border border-emerald-400/30">
            <Compass className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-100 tracking-wide font-cairo leading-none">
                {t.appName}
              </h1>
              {isAutoAdhanEnabled && (
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{language === 'ar' ? 'الأذان التلقائي' : 'Otomatik Ezan'}</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-emerald-400/90 mt-1 font-medium">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Action Controls: Reminders & Notifications Center + Language Switcher */}
        <div className="flex items-center gap-2">
          {/* Quick Reminders & Adhan Bell Button */}
          <button
            onClick={onOpenReminders}
            title={language === 'ar' ? 'مركز التذكيرات والأذان التلقائي' : 'Hatırlatıcılar ve Ezan Merkezi'}
            className="relative p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Bell className={`w-4 h-4 ${isAutoAdhanEnabled ? 'text-amber-400' : 'text-slate-400'}`} />
            {isAutoAdhanEnabled && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950 shadow-sm" />
            )}
          </button>

          {/* Dynamic Language Switcher */}
          <button
            onClick={toggleLanguage}
            title={t.changeLang}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs border border-slate-700/80 shadow-sm transition-all cursor-pointer active:scale-95 font-cairo"
          >
            <Globe2 className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-amber-300">
              {language === 'ar' ? 'العربية' : 'Türkçe'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
