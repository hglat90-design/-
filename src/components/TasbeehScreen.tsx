import React, { useState } from 'react';
import { 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Vibrate, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language } from '../types';
import { getTranslation } from '../translations';
import { playTasbeehClick, playCompletionChime, triggerHaptic } from '../utils/soundEffects';

interface TasbeehScreenProps {
  language: Language;
}

interface DhikrPreset {
  id: string;
  ar: string;
  tr: string;
  target: number;
}

export const TasbeehScreen: React.FC<TasbeehScreenProps> = ({ language }) => {
  const t = getTranslation(language);

  const presets: DhikrPreset[] = [
    { id: 'subhanallah', ar: 'سُبْحَانَ اللَّهِ', tr: 'Sübhânallâh', target: 33 },
    { id: 'alhamdulillah', ar: 'الْحَمْدُ لِلَّهِ', tr: 'Elhamdülillâh', target: 33 },
    { id: 'allahuakbar', ar: 'اللَّهُ أَكْبَرُ', tr: 'Allâhu Ekber', target: 33 },
    { id: 'lailahaillallah', ar: 'لَا إِلَٰهَ إِلَّا اللَّهُ', tr: 'Lâ ilâhe illallâh', target: 100 },
    { id: 'astaghfirullah', ar: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ', tr: 'Estağfirullâh ve etûbü ileyh', target: 100 },
    { id: 'salawat', ar: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ', tr: 'Allâhümme salli alâ seyyidinâ Muhammed', target: 100 },
    { id: 'lahawla', ar: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', tr: 'Lâ havle ve lâ kuvvete illâ billâh', target: 100 },
  ];

  const [activeDhikrIndex, setActiveDhikrIndex] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);
  const [totalLifetimeCount, setTotalLifetimeCount] = useState(0);
  const [completedCycles, setCompletedCycles] = useState(0);

  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isVibrationEnabled, setIsVibrationEnabled] = useState(true);

  const currentDhikr = presets[activeDhikrIndex];

  const handleTap = () => {
    if (isSoundEnabled) {
      playTasbeehClick();
    }
    if (isVibrationEnabled) {
      triggerHaptic(25);
    }

    const nextCount = currentCount + 1;
    setTotalLifetimeCount((prev) => prev + 1);

    if (nextCount >= currentDhikr.target) {
      // Completed target
      setCurrentCount(0);
      setCompletedCycles((prev) => prev + 1);
      playCompletionChime();
      triggerHaptic(90);

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#ffffff'],
      });
    } else {
      setCurrentCount(nextCount);
    }
  };

  const handleReset = () => {
    setCurrentCount(0);
    triggerHaptic(40);
  };

  const nextPreset = () => {
    setActiveDhikrIndex((prev) => (prev + 1) % presets.length);
    setCurrentCount(0);
  };

  const prevPreset = () => {
    setActiveDhikrIndex((prev) => (prev - 1 + presets.length) % presets.length);
    setCurrentCount(0);
  };

  const progressPercent = Math.min(100, (currentCount / currentDhikr.target) * 100);

  return (
    <div className="space-y-4 pb-6">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 rounded-2xl p-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className={`p-2 rounded-xl text-xs border transition-colors cursor-pointer ${
              isSoundEnabled
                ? 'bg-emerald-950 border-emerald-600/50 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
            title={t.sound}
          >
            {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsVibrationEnabled(!isVibrationEnabled)}
            className={`p-2 rounded-xl text-xs border transition-colors cursor-pointer ${
              isVibrationEnabled
                ? 'bg-emerald-950 border-emerald-600/50 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
            title={t.vibration}
          >
            <Vibrate className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <div>
            <span>{t.totalCycles}: </span>
            <span className="font-bold text-amber-400 font-mono">{completedCycles}</span>
          </div>
          <div>
            <span>{t.totalCount}: </span>
            <span className="font-bold text-emerald-400 font-mono">{totalLifetimeCount}</span>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          title={t.resetCounter}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Active Dhikr Selector Carousel */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 border border-emerald-500/30 p-5 text-center shadow-lg">
        <div className="flex items-center justify-between">
          <button
            onClick={language === 'ar' ? nextPreset : prevPreset}
            className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            {language === 'ar' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>

          <div className="flex-1 px-2">
            <span className="text-[11px] text-emerald-400/80 uppercase tracking-widest font-semibold block mb-1">
              {t.dhikrPresets} ({activeDhikrIndex + 1}/{presets.length})
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-quran text-amber-300">
              {currentDhikr.ar}
            </h2>
            <p className="text-xs text-slate-300 mt-1 font-sans">
              {currentDhikr.tr}
            </p>
          </div>

          <button
            onClick={language === 'ar' ? prevPreset : nextPreset}
            className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            {language === 'ar' ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>

        {/* Target indicator */}
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-400">
          <span>{t.target}:</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-900/80 border border-emerald-600/40 text-amber-300 font-mono font-bold">
            {currentDhikr.target}
          </span>
        </div>
      </div>

      {/* Big Tactile Digital Tasbeeh Clicker Button */}
      <div className="flex flex-col items-center justify-center py-4">
        <button
          onClick={handleTap}
          className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full p-2 group cursor-pointer focus:outline-none active:scale-95 transition-transform"
        >
          {/* Circular SVG Progress Ring */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-slate-800"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-amber-400 transition-all duration-300"
              strokeWidth="6"
              strokeDasharray={276.46}
              strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Central Button Body (Simulating luxurious marble & jade digital tasbeeh) */}
          <div className="absolute inset-5 rounded-full bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 border-4 border-emerald-600/30 group-hover:border-amber-400/50 flex flex-col items-center justify-center shadow-2xl shadow-emerald-950 transition-colors">
            {/* Digital Display Box */}
            <div className="px-5 py-2 rounded-xl bg-slate-950/80 border border-emerald-500/20 shadow-inner text-center mb-1">
              <span className="font-mono text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-300">
                {currentCount}
              </span>
            </div>

            <span className="text-xs text-emerald-400 font-medium font-cairo mt-1">
              {t.tapToCount}
            </span>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5">
              {currentCount} / {currentDhikr.target}
            </span>
          </div>
        </button>
      </div>

      {/* Fast Presets Grid */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-3.5 space-y-2">
        <h3 className="text-xs font-bold text-slate-300 px-1">
          {t.dhikrPresets}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => {
                setActiveDhikrIndex(idx);
                setCurrentCount(0);
              }}
              className={`p-2.5 rounded-xl border text-start transition-all cursor-pointer ${
                activeDhikrIndex === idx
                  ? 'bg-emerald-950/80 border-amber-500/50 text-amber-300'
                  : 'bg-slate-950/40 border-slate-800 hover:bg-slate-800/60 text-slate-300'
              }`}
            >
              <div className="font-quran text-sm font-bold truncate">
                {p.ar}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {p.tr} ({p.target})
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
