import React from 'react';
import { 
  Globe, 
  Volume2, 
  Calculator, 
  Moon, 
  Code2, 
  ShieldCheck, 
  Check, 
  Play,
  Sliders,
  BellRing
} from 'lucide-react';
import { AppSettings, CalculationMethodId, JuristicMethod, Language } from '../types';
import { getTranslation } from '../translations';
import { CALCULATION_METHODS } from '../utils/prayerCalculator';
import { playAdhan, stopAdhan } from '../utils/soundEffects';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (updater: (prev: AppSettings) => AppSettings) => void;
  onOpenCodeExplorer: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onOpenCodeExplorer,
}) => {
  const t = getTranslation(settings.language);

  const calcMethodList: CalculationMethodId[] = ['diyanet', 'mwl', 'makkah', 'egypt', 'karachi', 'isna'];

  const adhanVoices: { id: AppSettings['adhanVoice']; labelAr: string; labelTr: string }[] = [
    { id: 'makkah', labelAr: t.makkahAdhan, labelTr: t.makkahAdhan },
    { id: 'istanbul', labelAr: t.istanbulAdhan, labelTr: t.istanbulAdhan },
    { id: 'madinah', labelAr: t.madinahAdhan, labelTr: t.madinahAdhan },
    { id: 'alaqsa', labelAr: t.alaqsaAdhan, labelTr: t.alaqsaAdhan },
    { id: 'takbeer', labelAr: t.takbeerAdhan, labelTr: t.takbeerAdhan },
  ];

  const handleTestAdhanVoice = (voice: AppSettings['adhanVoice']) => {
    playAdhan(voice);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Language Section (Primary Requirement: In-app language switcher) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
          <Globe className="w-4 h-4 text-emerald-400" />
          <span>{t.languageSetting}</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => onUpdateSettings((s) => ({ ...s, language: 'ar' }))}
            className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
              settings.language === 'ar'
                ? 'bg-emerald-950 border-amber-400 text-amber-300 font-bold shadow-md shadow-emerald-950'
                : 'bg-slate-950/40 border-slate-800 hover:bg-slate-800/60 text-slate-300'
            }`}
          >
            <span className="text-xl block mb-1">🇸🇦</span>
            <span className="text-sm font-cairo">العربية (الأصلية)</span>
          </button>

          <button
            onClick={() => onUpdateSettings((s) => ({ ...s, language: 'tr' }))}
            className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
              settings.language === 'tr'
                ? 'bg-emerald-950 border-amber-400 text-amber-300 font-bold shadow-md shadow-emerald-950'
                : 'bg-slate-950/40 border-slate-800 hover:bg-slate-800/60 text-slate-300'
            }`}
          >
            <span className="text-xl block mb-1">🇹🇷</span>
            <span className="text-sm font-sans">Türkçe (Diyanet)</span>
          </button>
        </div>
      </div>

      {/* Prayer Calculation Method */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-4 space-y-3">
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
                    ? 'bg-emerald-950/80 border-amber-400/80 text-amber-300 font-medium'
                    : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/50 text-slate-300'
                }`}
              >
                <div>
                  <div className="text-xs font-bold font-cairo">
                    {settings.language === 'ar' ? method.nameAr : method.nameTr}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
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
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span>{t.juristicSetting}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onUpdateSettings((s) => ({ ...s, juristicMethod: 'shafii' }))}
            className={`p-2.5 rounded-xl border text-center text-xs transition-all cursor-pointer ${
              settings.juristicMethod === 'shafii'
                ? 'bg-emerald-950 border-amber-400 text-amber-300 font-bold'
                : 'bg-slate-950/40 border-slate-800 hover:bg-slate-800 text-slate-300'
            }`}
          >
            {t.shafiiStandard}
          </button>
          <button
            onClick={() => onUpdateSettings((s) => ({ ...s, juristicMethod: 'hanafi' }))}
            className={`p-2.5 rounded-xl border text-center text-xs transition-all cursor-pointer ${
              settings.juristicMethod === 'hanafi'
                ? 'bg-emerald-950 border-amber-400 text-amber-300 font-bold'
                : 'bg-slate-950/40 border-slate-800 hover:bg-slate-800 text-slate-300'
            }`}
          >
            {t.hanafi}
          </button>
        </div>
      </div>

      {/* Adhan Voice Picker */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-4 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-200">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <span>{t.adhanVoiceSetting}</span>
          </div>
          <button
            onClick={() => stopAdhan()}
            className="text-[11px] text-rose-400 hover:underline cursor-pointer"
          >
            {t.stopAdhan}
          </button>
        </div>

        <div className="space-y-1.5">
          {adhanVoices.map((v) => {
            const isSelected = settings.adhanVoice === v.id;

            return (
              <div
                key={v.id}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-emerald-950/80 border-amber-400/80 text-amber-300'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-300'
                }`}
              >
                <button
                  onClick={() => onUpdateSettings((s) => ({ ...s, adhanVoice: v.id }))}
                  className="flex-1 text-start cursor-pointer text-xs font-semibold"
                >
                  {settings.language === 'ar' ? v.labelAr : v.labelTr}
                </button>

                <button
                  onClick={() => handleTestAdhanVoice(v.id)}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 flex items-center gap-1 cursor-pointer"
                >
                  <Play className="w-3 h-3 text-emerald-400" />
                  <span>{t.testAdhan}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Android Kotlin Architecture CTA Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 border border-emerald-500/40 p-5 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 font-cairo">
              {t.androidSourceCode}
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {t.androidSourceSubtitle}
            </p>
            <button
              onClick={onOpenCodeExplorer}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <span>{settings.language === 'ar' ? 'عرض الكود وتحميل المشروع' : 'Kodu Görüntüle & Projeyi İndir'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
