import React, { useState, useEffect, useRef } from 'react';
import { AppSettings, Language, PrayerTimes, PrayerName, CustomReminderItem, PeriodicReminderConfig } from './types';
import { AndroidHeader } from './components/AndroidHeader';
import { BottomNavBar, NavTab } from './components/BottomNavBar';
import { PrayerScreen } from './components/PrayerScreen';
import { QuranScreen } from './components/QuranScreen';
import { QiblaScreen } from './components/QiblaScreen';
import { AzkarScreen } from './components/AzkarScreen';
import { TasbeehScreen } from './components/TasbeehScreen';
import { CalendarScreen } from './components/CalendarScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { 
  initServiceWorker, 
  startPrayerWatcher, 
  startPeriodicReminder, 
  startCustomRemindersWatcher,
} from './utils/notificationManager';
import { stopAdhan, unlockAudioContext } from './utils/soundEffects';
import { calculatePrayerTimes, POPULAR_CITIES } from './utils/prayerCalculator';
import { getTranslation } from './translations';
import { safeStorage } from './utils/safeStorage';

export default function App() {
  // App-wide Language state (Default Arabic as requested, with instant Turkish switcher)
  const [language, setLanguage] = useState<Language>(() => {
    const saved = safeStorage.getItem('almuslim_lang');
    return (saved === 'tr' ? 'tr' : 'ar') as Language;
  });

  // Active navigation tab
  const [currentTab, setCurrentTab] = useState<NavTab>('prayer');

  // Adhan active audio playback state
  const [isAdhanActive, setIsAdhanActive] = useState<boolean>(false);

  // Automatic Adhan state (persisted, default true)
  const [isAutoAdhanEnabled, setIsAutoAdhanEnabled] = useState<boolean>(() => {
    const saved = safeStorage.getItem('almuslim_auto_adhan');
    return saved !== null ? saved === 'true' : true;
  });

  // Periodic Dhikr Reminder Config (Defaults to enabled every 5 minutes!)
  const [periodicConfig, setPeriodicConfig] = useState<PeriodicReminderConfig>(() => {
    const saved = safeStorage.getItem('almuslim_periodic_dhikr');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      enabled: true,
      intervalMinutes: 5,
      dhikrTextAr: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
      dhikrTextTr: 'Sübhânallâhi ve bi-hamdihî, sübhânallâhi\'l-azîm',
      soundEnabled: true,
      vibrationEnabled: true,
    };
  });

  // Custom Scheduled Reminders
  const [customReminders, setCustomReminders] = useState<CustomReminderItem[]>(() => {
    const saved = safeStorage.getItem('almuslim_custom_reminders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'kahf',
        titleAr: 'قراءة سورة الكهف (كل يوم جمعة)',
        titleTr: 'Kehf Suresi Okuma (Her Cuma)',
        time: '09:00',
        enabled: true,
        days: [5],
        soundEnabled: true,
      },
      {
        id: 'qiyam',
        titleAr: 'صلاة قيام الليل وركعتي الوتر',
        titleTr: 'Teheccüd ve Vitir Namazı',
        time: '03:30',
        enabled: true,
        days: [0, 1, 2, 3, 4, 5, 6],
        soundEnabled: true,
      },
      {
        id: 'duha',
        titleAr: 'صلاة الضحى (ركعتان تجزئ عن 360 صدقة)',
        titleTr: 'Duha (Kuşluk) Namazı',
        time: '08:30',
        enabled: true,
        days: [0, 1, 2, 3, 4, 5, 6],
        soundEnabled: true,
      },
      {
        id: 'fasting',
        titleAr: 'تذكير بصيام يومي الإثنين والخميس',
        titleTr: 'Pazartesi ve Perşembe Orucu',
        time: '20:00',
        enabled: true,
        days: [0, 3],
        soundEnabled: true,
      },
    ];
  });

  // App Settings state
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = safeStorage.getItem('almuslim_settings');
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

  // References for live background watchers without stale closures
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const isAutoAdhanRef = useRef(isAutoAdhanEnabled);
  isAutoAdhanRef.current = isAutoAdhanEnabled;

  const periodicConfigRef = useRef(periodicConfig);
  periodicConfigRef.current = periodicConfig;

  const customRemindersRef = useRef(customReminders);
  customRemindersRef.current = customReminders;

  // Initialize Service Worker once on start and unlock audio context on first click
  useEffect(() => {
    initServiceWorker();
    const handleFirstInteraction = () => {
      unlockAudioContext();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

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
    safeStorage.setItem('almuslim_lang', language);
    setSettings((prev) => ({ ...prev, language }));
  }, [language]);

  // Persist settings
  useEffect(() => {
    safeStorage.setItem('almuslim_settings', JSON.stringify(settings));
  }, [settings]);

  // Persist auto adhan state
  useEffect(() => {
    safeStorage.setItem('almuslim_auto_adhan', String(isAutoAdhanEnabled));
  }, [isAutoAdhanEnabled]);

  // Persist periodic dhikr config
  useEffect(() => {
    safeStorage.setItem('almuslim_periodic_dhikr', JSON.stringify(periodicConfig));
  }, [periodicConfig]);

  // Persist custom reminders
  useEffect(() => {
    safeStorage.setItem('almuslim_custom_reminders', JSON.stringify(customReminders));
  }, [customReminders]);

  // Start live Prayer Adhan watcher, Periodic 5-minute Dhikr reminder, and Custom Reminders
  useEffect(() => {
    const t = getTranslation(language);
    const prayerNamesMap: Record<PrayerName, string> = {
      fajr: t.fajr,
      sunrise: t.sunrise,
      dhuhr: t.dhuhr,
      asr: t.asr,
      maghrib: t.maghrib,
      isha: t.isha,
    };

    // Calculate prayer times for current city
    const getTimes = () => {
      const defaultCity = language === 'tr' ? POPULAR_CITIES[0] : POPULAR_CITIES[2];
      return calculatePrayerTimes(
        defaultCity.latitude,
        defaultCity.longitude,
        new Date(),
        settingsRef.current.calcMethod,
        settingsRef.current.juristicMethod
      );
    };

    // 1. Automatic Adhan at exact prayer time
    startPrayerWatcher(
      getTimes,
      () => settingsRef.current.adhanVoice,
      () => isAutoAdhanRef.current,
      prayerNamesMap,
      language === 'ar' ? 'مكة المكرمة' : 'İstanbul',
      () => setIsAdhanActive(true)
    );

    // 2. Periodic Dhikr reminder (every 5 minutes or selected interval)
    startPeriodicReminder(
      () => periodicConfigRef.current,
      language
    );

    // 3. Custom Scheduled Reminders watcher
    startCustomRemindersWatcher(
      () => customRemindersRef.current,
      language
    );
  }, [language]);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
  };

  const handleStopAdhan = () => {
    stopAdhan();
    setIsAdhanActive(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center font-cairo antialiased">
      {/* Mobile Consumer Android Device Container (max-w-lg) */}
      <div className="w-full max-w-lg min-h-screen flex flex-col bg-slate-950 border-x border-slate-900/80 shadow-2xl relative">
        {/* Real App Header (Clean native style, no fake status bar) */}
        <AndroidHeader
          language={language}
          onLanguageChange={handleLanguageChange}
          onOpenReminders={() => setCurrentTab('settings')}
          isAdhanActive={isAdhanActive}
          onStopAdhan={handleStopAdhan}
          isAutoAdhanEnabled={isAutoAdhanEnabled}
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
              periodicConfig={periodicConfig}
              onUpdatePeriodicConfig={setPeriodicConfig}
              isAutoAdhanEnabled={isAutoAdhanEnabled}
              onToggleAutoAdhan={setIsAutoAdhanEnabled}
              customReminders={customReminders}
              onUpdateCustomReminders={setCustomReminders}
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
