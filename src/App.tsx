import React, { useState, useEffect } from 'react';
import { AppSettings, Language } from './types';
import { AndroidHeader } from './components/AndroidHeader';
import { BottomNavBar, NavTab } from './components/BottomNavBar';
import { PrayerScreen } from './components/PrayerScreen';
import { QuranScreen } from './components/QuranScreen';
import { QiblaScreen } from './components/QiblaScreen';
import { AzkarScreen } from './components/AzkarScreen';
import { TasbeehScreen } from './components/TasbeehScreen';
import { CalendarScreen } from './components/CalendarScreen';
import { SettingsScreen } from './components/SettingsScreen';

export default function App() {
  // App-wide Language state (Default Arabic as requested, with instant Turkish switcher)
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('almuslim_lang');
    return (saved === 'tr' ? 'tr' : 'ar') as Language;
  });

  // Active navigation tab
  const [currentTab, setCurrentTab] = useState<NavTab>('prayer');

  // Adhan active audio playback state
  const [isAdhanActive, setIsAdhanActive] = useState<boolean>(false);

  // App Settings state
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('almuslim_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      language: 'ar',
      calcMethod: 'diyanet',
      juristicMethod: 'shafii',
      adhanVoice: 'makkah',
      adhanEnabled: {
        fajr: true,
        sunrise: false,
        dhuhr: true,
        asr: true,
        maghrib: true,
        isha: true,
      },
      quranFontSize: 26,
      isDarkMode: true,
      vibrationEnabled: true,
    };
  });

  // Sync RTL / LTR document direction whenever language changes
  useEffect(() => {
    const html = document.documentElement;
    if (language === 'ar') {
      html.setAttribute('dir', 'rtl');
      html.setAttribute('lang', 'ar');
    } else {
      html.setAttribute('dir', 'ltr');
      html.setAttribute('lang', 'tr');
    }
    localStorage.setItem('almuslim_lang', language);
    setSettings((prev) => ({ ...prev, language }));
  }, [language]);

  // Persist settings
  useEffect(() => {
    localStorage.setItem('almuslim_settings', JSON.stringify(settings));
  }, [settings]);

  // Handle language switch
  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center font-cairo antialiased">
      {/* Mobile Consumer Android Device Container (max-w-lg) */}
      <div className="w-full max-w-lg min-h-screen flex flex-col bg-slate-950 border-x border-slate-900/80 shadow-2xl relative">
        {/* Clean Android Top App Bar */}
        <AndroidHeader
          language={language}
          onLanguageChange={handleLanguageChange}
          isAdhanActive={isAdhanActive}
        />

        {/* Main Screen Content */}
        <main className="flex-1 px-3.5 py-4 overflow-y-auto">
          {currentTab === 'prayer' && (
            <PrayerScreen
              language={language}
              settings={settings}
              onNavigateToQibla={() => setCurrentTab('qibla')}
              onAdhanStateChange={(playing) => setIsAdhanActive(playing)}
            />
          )}

          {currentTab === 'quran' && (
            <QuranScreen language={language} />
          )}

          {currentTab === 'qibla' && (
            <QiblaScreen language={language} />
          )}

          {currentTab === 'azkar' && (
            <AzkarScreen language={language} />
          )}

          {currentTab === 'tasbeeh' && (
            <TasbeehScreen language={language} />
          )}

          {currentTab === 'calendar' && (
            <CalendarScreen language={language} />
          )}

          {currentTab === 'settings' && (
            <SettingsScreen
              settings={settings}
              onUpdateSettings={setSettings}
            />
          )}
        </main>

        {/* Jetpack Compose Material 3 Navigation Bar */}
        <BottomNavBar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          language={language}
        />
      </div>
    </div>
  );
}
