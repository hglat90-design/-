import React from 'react';
import { 
  Globe, 
  Volume2, 
  Calculator, 
  Sliders, 
  Check, 
  Play,
  Square,
  ShieldCheck,
  BellRing
} from 'lucide-react';
import { AppSettings, CalculationMethodId, Language, AdhanVoiceId } from '../types';
import { getTranslation } from '../translations';
import { CALCULATION_METHODS } from '../utils/prayerCalculator';
import { playAdhan, stopAdhan } from '../utils/soundEffects';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (updater: (prev: AppSettings) => AppSettings) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const t = getTranslation(settings.language);

  const calcMethodList: CalculationMethodId[] = ['diyanet', 'mwl', 'makkah', 'egypt', 'karachi', 'isna'];

  const adhanVoices: { id: AdhanVoiceId; labelKey: 'makkahAdhan' | 'abdulbasitAdhan' | 'abdulghaffarAdhan' | 'abdulhakamAdhan' | 'egyptAdhan' }[] = [
    { id: 'makkah', labelKey: 'makkahAdhan' },
    { id: 'abdulbasit', labelKey: 'abdulbasitAdhan' },
    { id: 'abdulghaffar', labelKey: 'abdulghaffarAdhan' },
    { id: 'abdulhakam', labelKey: 'abdulhakamAdhan' },
    { id: 'egypt', labelKey: 'egyptAdhan' },
  ];

  const handleTestAdhanVoice = (voice: AdhanVoiceId) => {
    playAdhan(voice);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Language Section (Primary in-app dynamic language switcher) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
          <Globe className="w-4 h-4 text-emerald-400" />
          <span>{t.languageSetting}</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => onUpdateSettings((s) => ({ ...s, language: 'ar' }))}
            className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
              settings.language === 'ar'
                ? 'bg-emerald-950 border-amber-400 text-amber-300 font-bold shadow-md shadow-emerald-950 ring-1 ring-amber-400/30'
                : 'bg-slate-950/40 border-slate-800 hover:bg-slate-800/60 text-slate-300'
            }`}
          >
            <span className="text-2xl block mb-1">🇸🇦</span>
            <span className="text-sm font-cairo font-bold">العربية (الأصلية)</span>
          </button>

          <button
            onClick={() => onUpdateSettings((s) => ({ ...s, language: 'tr' }))}
            className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
              settings.language === 'tr'
                ? 'bg-emerald-950 border-amber-400 text-amber-300 font-bold shadow-md shadow-emerald-950 ring-1 ring-amber-400/30'
                : 'bg-slate-950/40 border-slate-800 hover:bg-slate-800/60 text-slate-300'
            }`}
          >
            <span className="text-2xl block mb-1">🇹🇷</span>
            <span className="text-sm font-sans font-bold">Türkçe (Diyanet)</span>
          </button>
        </div>
      </div>

      {/* Real Authentic Adhan Voices Selector */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between text-xs font-bold text-slate-200">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <span>{t.adhanVoiceSetting}</span>
          </div>
          <button
            onClick={() => stopAdhan()}
            className="text-[11px] text-rose-400 hover:underline cursor-pointer font-cairo flex items-center gap-1"
          >
            <Square className="w-3 h-3 fill-rose-400" />
            <span>{t.stopAdhan}</span>
          </button>
        </div>

        <div className="space-y-2">
          {adhanVoices.map((v) => {
            const isSelected = settings.adhanVoice === v.id;

            return (
              <div
                key={v.id}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-emerald-950/90 border-amber-400/80 text-amber-300 shadow-sm'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-300'
                }`}
              >
                <button
                  onClick={() => onUpdateSettings((s) => ({ ...s, adhanVoice: v.id }))}
                  className="flex-1 text-start cursor-pointer text-xs font-bold font-cairo"
                >
                  {t[v.labelKey]}
                </button>

                <button
                  onClick={() => handleTestAdhanVoice(v.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-emerald-300 flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-transform"
                >
                  <Play className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="font-cairo font-semibold">{t.testAdhan}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prayer Calculation Method */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
          <Calculator className="w-4 h-4 text-emerald-400" />
          <span>{t.calcMethodSetting}</span>
        </div>

        <div className="space-y-1.5">
          {calcMethodList.map((mId) => {
            const method = CALCULATION_METHODS[mId];
            const isSelected = settings.calcMethod === mId;

            return (
              <button
                key={mId}
                onClick={() => onUpdateSettings((s) => ({ ...s, calcMethod: mId }))}
                className={`w-full p-3 rounded-2xl border text-start flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-950/80 border-amber-400 text-amber-300 font-medium'
                    : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/50 text-slate-300'
                }`}
              >
                <div>
                  <div className="text-xs font-bold font-cairo">
                    {settings.language === 'ar' ? method.nameAr : method.nameTr}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                    Fajr: {method.fajrAngle}° · Isha: {method.ishaAngle || (method.ishaInterval ? `${method.ishaInterval}m` : '17°')}
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Asr Juristic Method */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span>{t.juristicSetting}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onUpdateSettings((s) => ({ ...s, juristicMethod: 'shafii' }))}
            className={`p-3 rounded-2xl border text-center text-xs transition-all cursor-pointer ${
              settings.juristicMethod === 'shafii'
                ? 'bg-emerald-950 border-amber-400 text-amber-300 font-bold'
                : 'bg-slate-950/40 border-slate-800 hover:bg-slate-800 text-slate-300'
            }`}
          >
            {t.shafiiStandard}
          </button>
          <button
            onClick={() => onUpdateSettings((s) => ({ ...s, juristicMethod: 'hanafi' }))}
            className={`p-3 rounded-2xl border text-center text-xs transition-all cursor-pointer ${
              settings.juristicMethod === 'hanafi'
                ? 'bg-emerald-950 border-amber-400 text-amber-300 font-bold'
                : 'bg-slate-950/40 border-slate-800 hover:bg-slate-800 text-slate-300'
            }`}
          >
            {t.hanafi}
          </button>
        </div>
      </div>

      {/* Islamic Production Notice Card */}
      <div className="p-4 rounded-3xl bg-slate-900/40 border border-emerald-900/40 flex items-start gap-3">
        <div className="p-2.5 rounded-2xl bg-emerald-950 border border-emerald-700/40 text-amber-300 shrink-0">
          <BellRing className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <h4 className="font-bold text-xs text-emerald-300 font-cairo">
            {t.notificationsTitle}
          </h4>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            {t.backgroundServiceNotice}
          </p>
        </div>
      </div>
    </div>
  );
};
