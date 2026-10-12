import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  CheckCircle2, 
  Bed, 
  BookOpen, 
  RotateCcw, 
  Sparkles,
  Award,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language } from '../types';
import { getTranslation } from '../translations';
import { AZKAR_CATEGORIES } from '../utils/azkarData';
import { playTasbeehClick, playCompletionChime, triggerHaptic } from '../utils/soundEffects';

interface AzkarScreenProps {
  language: Language;
}

export const AzkarScreen: React.FC<AzkarScreenProps> = ({ language }) => {
  const t = getTranslation(language);

  const [activeCategoryId, setActiveCategoryId] = useState<string>('morning');
  // Store user's remaining counts per dhikr item: { [itemId]: remainingCount }
  const [counts, setCounts] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    AZKAR_CATEGORIES.forEach((cat) => {
      cat.items.forEach((item) => {
        initial[item.id] = item.count;
      });
    });
    return initial;
  });

  const activeCategory = AZKAR_CATEGORIES.find((c) => c.id === activeCategoryId) || AZKAR_CATEGORIES[0];

  const handleItemClick = (itemId: string, initialCount: number) => {
    const current = counts[itemId] ?? initialCount;
    if (current <= 0) return;

    playTasbeehClick();
    triggerHaptic(20);

    const next = current - 1;
    setCounts((prev) => ({ ...prev, [itemId]: next }));

    if (next === 0) {
      playCompletionChime();
      triggerHaptic(80);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#f59e0b', '#3b82f6'],
      });
    }
  };

  const handleResetCategory = () => {
    setCounts((prev) => {
      const updated = { ...prev };
      activeCategory.items.forEach((item) => {
        updated[item.id] = item.count;
      });
      return updated;
    });
    triggerHaptic(40);
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun': return Sun;
      case 'Moon': return Moon;
      case 'CheckCircle2': return CheckCircle2;
      case 'Bed': return Bed;
      case 'BookOpen': return BookOpen;
      default: return Sparkles;
    }
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {AZKAR_CATEGORIES.map((cat) => {
          const Icon = getCategoryIcon(cat.icon);
          const isActive = activeCategoryId === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-800 to-emerald-900 border border-amber-400/60 text-amber-300 shadow-md shadow-emerald-950'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'ar' ? cat.titleAr : cat.titleTr}</span>
            </button>
          );
        })}
      </div>

      {/* Category Header Banner with Reset Button */}
      <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 rounded-2xl p-3">
        <div>
          <h2 className="font-bold text-base text-slate-100 font-cairo">
            {language === 'ar' ? activeCategory.titleAr : activeCategory.titleTr}
          </h2>
          <span className="text-[11px] text-slate-400">
            {activeCategory.items.length} {t.dhikrPresets}
          </span>
        </div>

        <button
          onClick={handleResetCategory}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t.resetAzkar}</span>
        </button>
      </div>

      {/* Azkar Items List */}
      <div className="space-y-3">
        {activeCategory.items.map((item) => {
          const remaining = counts[item.id] ?? item.count;
          const isDone = remaining === 0;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-3xl border transition-all ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-800/40 opacity-90'
                  : 'bg-slate-900/70 border-slate-800/90 shadow-sm'
              }`}
            >
              {/* Arabic Text */}
              <div
                dir="rtl"
                className="font-quran text-lg sm:text-xl leading-[2] text-slate-100 text-end py-1 font-medium select-none"
              >
                {item.arabic}
              </div>

              {/* Turkish Translation */}
              <div className="pt-2 text-xs text-emerald-300/90 leading-relaxed border-t border-slate-800/60 font-sans">
                <span className="font-semibold text-amber-400/90 mr-1 text-[11px]">
                  [Türkçe Meâli]:
                </span>
                {item.turkish}
              </div>

              {/* Reward & Reference Badge */}
              <div className="mt-2.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800/60 text-[11px] text-slate-400 flex items-start gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-300">{t.benefit}: </span>
                  {language === 'ar' ? item.rewardAr : item.rewardTr}
                  <span className="text-slate-500 block text-[10px] mt-0.5">
                    ({language === 'ar' ? item.referenceAr : item.referenceTr})
                  </span>
                </div>
              </div>

              {/* Counter Button */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  <span>{t.target}: </span>
                  <span className="font-bold text-slate-200">{item.count} {t.times}</span>
                </div>

                <button
                  onClick={() => handleItemClick(item.id, item.count)}
                  disabled={isDone}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs transition-all shadow-md cursor-pointer ${
                    isDone
                      ? 'bg-emerald-900/40 border border-emerald-600/40 text-emerald-300'
                      : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white active:scale-95'
                  }`}
                >
                  {isDone ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>{t.completed}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span className="font-mono text-sm">{remaining}</span>
                      <span>{t.remaining}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
