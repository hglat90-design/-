import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Play, 
  Pause, 
  Volume2, 
  BookOpen, 
  ArrowLeft, 
  ArrowRight,
  BookMarked,
  Sliders,
  Sparkles,
  Loader2
} from 'lucide-react';
import { Language, QuranAyah, QuranSurah } from '../types';
import { getTranslation } from '../translations';
import { SURAHS_CATALOG, fetchSurahVerses } from '../utils/quranData';

interface QuranScreenProps {
  language: Language;
}

export const QuranScreen: React.FC<QuranScreenProps> = ({ language }) => {
  const t = getTranslation(language);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJuz, setSelectedJuz] = useState<number | 'all'>('all');
  const [activeSurah, setActiveSurah] = useState<QuranSurah | null>(null);
  const [surahAyahs, setSurahAyahs] = useState<QuranAyah[]>([]);
  const [isLoadingAyahs, setIsLoadingAyahs] = useState(false);

  // Audio recitation player state
  const [playingAyahIndex, setPlayingAyahIndex] = useState<number | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Tafsir & View settings
  const [showTafsir, setShowTafsir] = useState(true);
  const [fontSize, setFontSize] = useState<number>(26); // px

  // Filter surahs
  const filteredSurahs = SURAHS_CATALOG.filter((s) => {
    const matchesSearch =
      s.nameAr.includes(searchQuery) ||
      s.nameTr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.number.toString() === searchQuery;

    const matchesJuz = selectedJuz === 'all' || s.juzStart === selectedJuz;
    return matchesSearch && matchesJuz;
  });

  // Load verses when a Surah is clicked
  const handleOpenSurah = async (surah: QuranSurah) => {
    setActiveSurah(surah);
    setIsLoadingAyahs(true);
    stopAudio();

    try {
      const ayahs = await fetchSurahVerses(surah.number);
      setSurahAyahs(ayahs);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingAyahs(false);
    }
  };

  const stopAudio = () => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      setAudioElement(null);
    }
    setPlayingAyahIndex(null);
  };

  const handlePlayAyah = (index: number) => {
    const ayah = surahAyahs[index];
    if (!ayah || !ayah.audioUrl) return;

    if (playingAyahIndex === index && audioElement) {
      if (audioElement.paused) {
        audioElement.play();
      } else {
        audioElement.pause();
      }
      return;
    }

    stopAudio();

    const audio = new Audio(ayah.audioUrl);
    setAudioElement(audio);
    setPlayingAyahIndex(index);

    audio.play().catch((err) => {
      console.warn('Audio play blocked or offline:', err);
    });

    audio.onended = () => {
      // Auto-advance to next Ayah
      if (index + 1 < surahAyahs.length) {
        handlePlayAyah(index + 1);
      } else {
        stopAudio();
      }
    };
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  return (
    <div className="space-y-4 pb-4">
      {/* If reading a specific Surah */}
      {activeSurah ? (
        <div className="space-y-4">
          {/* Top Bar for Reader */}
          <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-2xl p-3 shadow-sm sticky top-14 z-30 backdrop-blur-md">
            <button
              onClick={() => {
                stopAudio();
                setActiveSurah(null);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            >
              {language === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>{t.surahList}</span>
            </button>

            <div className="text-center">
              <h2 className="font-bold text-base text-amber-300 font-cairo">
                {t.surah} {language === 'ar' ? activeSurah.nameAr : activeSurah.nameTr}
              </h2>
              <span className="text-[11px] text-slate-400">
                {activeSurah.versesCount} {t.verses} · {activeSurah.revelationType === 'Meccan' ? t.meccan : t.medinan}
              </span>
            </div>

            {/* Font & Tafsir Toggles */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowTafsir(!showTafsir)}
                className={`p-2 rounded-xl text-xs border transition-colors cursor-pointer ${
                  showTafsir
                    ? 'bg-emerald-950 border-emerald-600/50 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
                title={showTafsir ? t.hideTafsir : t.showTafsir}
              >
                <BookMarked className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Font Size Slider Drawer */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl px-4 py-2 flex items-center justify-between gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.fontSize}</span>
            </span>
            <input
              type="range"
              min="20"
              max="42"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-40 accent-emerald-500 cursor-pointer"
            />
            <span className="font-mono text-slate-300">{fontSize}px</span>
          </div>

          {/* Surah Banner Calligraphy */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 border border-emerald-500/30 p-6 text-center shadow-lg">
            <div className="text-amber-300/80 text-xs tracking-widest uppercase mb-1">
              {t.holyQuran}
            </div>
            <h1 className="text-3xl font-extrabold text-amber-300 font-cairo">
              {activeSurah.nameAr}
            </h1>
            <p className="text-sm text-emerald-300/80 mt-1">
              {activeSurah.nameTr} ({activeSurah.transliteration}) · {t.juz} {activeSurah.juzStart}
            </p>

            {/* Bismillah (except for Surah At-Tawbah 9) */}
            {activeSurah.number !== 9 && (
              <div className="mt-4 pt-4 border-t border-emerald-800/40">
                <p className="font-quran text-2xl text-slate-100 font-bold tracking-wide">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
                <p className="text-xs text-slate-400 mt-1 font-sans">
                  {language === 'ar' 
                    ? 'بسم الله الرحمن الرحيم'
                    : 'Rahmân ve Rahîm olan Allah\'ın adıyla.'}
                </p>
              </div>
            )}
          </div>

          {/* Loading Ayahs State */}
          {isLoadingAyahs ? (
            <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
              <span className="text-xs">جارٍ تحميل الآيات الكريمة...</span>
            </div>
          ) : (
            <div className="space-y-3">
              {surahAyahs.map((ayah, idx) => {
                const isPlaying = playingAyahIndex === idx;

                return (
                  <div
                    key={ayah.numberInSurah}
                    className={`p-4 rounded-3xl border transition-all ${
                      isPlaying
                        ? 'bg-emerald-950/40 border-amber-500/60 shadow-lg shadow-emerald-950'
                        : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    {/* Ayah Header & Player */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800/60 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-emerald-950 border border-emerald-700/60 text-amber-300 font-bold flex items-center justify-center text-xs font-mono">
                          {ayah.numberInSurah}
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          {t.ayah} {ayah.numberInSurah}
                        </span>
                      </div>

                      <button
                        onClick={() => handlePlayAyah(idx)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs transition-colors cursor-pointer ${
                          isPlaying
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="w-3.5 h-3.5" />
                            <span>{t.pauseRecitation}</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{t.playRecitation}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Arabic Uthmanic Text */}
                    <div
                      dir="rtl"
                      className="py-4 text-end font-quran leading-[2.2] text-slate-100 selection:bg-amber-400 selection:text-slate-950"
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      {ayah.textAr}
                      <span className="text-amber-400 font-mono text-lg mx-2 select-none">
                        ﴿{ayah.numberInSurah}﴾
                      </span>
                    </div>

                    {/* Turkish Meâl (Diyanet) */}
                    <div className="pt-2 text-xs text-emerald-300/90 leading-relaxed font-sans border-t border-slate-800/40">
                      <span className="font-semibold text-amber-400/90 mr-1 text-[11px]">
                        [{t.translationTr}]:
                      </span>
                      {ayah.translationTr}
                    </div>

                    {/* Arabic Tafsir (al-Muyassar) */}
                    {showTafsir && ayah.tafsirAr && (
                      <div className="mt-2 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 leading-relaxed font-cairo">
                        <span className="font-bold text-slate-300 block mb-0.5">
                          {t.tafsir}:
                        </span>
                        {ayah.tafsirAr}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Surah Catalog List View */
        <div className="space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchSurahPlaceholder}
              className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl py-2.5 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors shadow-sm"
            />
          </div>

          {/* Quick Juz' Segmented Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <button
              onClick={() => setSelectedJuz('all')}
              className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-colors cursor-pointer ${
                selectedJuz === 'all'
                  ? 'bg-emerald-800/80 text-amber-300 border border-emerald-600/50'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {language === 'ar' ? 'جميع السور (114)' : 'Tüm Sureler (114)'}
            </button>
            {[1, 2, 3, 4, 5, 10, 15, 20, 25, 28, 29, 30].map((juzNum) => (
              <button
                key={juzNum}
                onClick={() => setSelectedJuz(juzNum)}
                className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-colors cursor-pointer ${
                  selectedJuz === juzNum
                    ? 'bg-emerald-800/80 text-amber-300 border border-emerald-600/50'
                    : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {t.juz} {juzNum}
              </button>
            ))}
          </div>

          {/* Surahs Grid List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredSurahs.map((surah) => (
              <button
                key={surah.number}
                onClick={() => handleOpenSurah(surah)}
                className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-600/50 hover:bg-slate-800/60 transition-all flex items-center justify-between text-start group cursor-pointer shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-mono font-bold text-xs text-amber-400 group-hover:border-emerald-500/40 group-hover:text-amber-300 transition-colors">
                    {surah.number}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-100 font-cairo group-hover:text-amber-300 transition-colors">
                      {language === 'ar' ? surah.nameAr : surah.nameTr}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {surah.transliteration} · {surah.versesCount} {t.verses}
                    </div>
                  </div>
                </div>

                <div className="text-end">
                  <div className="font-quran text-lg text-emerald-400 font-bold group-hover:text-amber-400 transition-colors">
                    {surah.nameAr}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {surah.revelationType === 'Meccan' ? t.meccan : t.medinan} · {t.juz} {surah.juzStart}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
