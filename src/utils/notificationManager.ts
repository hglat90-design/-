import { PrayerName, PrayerTimes, AdhanVoiceId, CustomReminderItem, PeriodicReminderConfig } from '../types';
import { playAdhan, playCompletionChime, triggerHaptic, unlockAudioContext } from './soundEffects';

let serviceWorkerRegistration: ServiceWorkerRegistration | null = null;
let periodicIntervalId: any = null;
let prayerWatcherId: any = null;
let customRemindersWatcherId: any = null;
let lastFiredPrayer: string | null = null;
let lastFiredPeriodicMinute: number | null = null;
let lastFiredCustomMinute: string | null = null;

/**
 * Register Service Worker for background notifications & PWA
 */
export async function initServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('./sw.js');
      serviceWorkerRegistration = reg;
      return reg;
    } catch (err) {
      console.warn('Service worker registration notice:', err);
    }
  }
  return null;
}

/**
 * Request real device notification permission and unlock audio context
 */
export async function requestNotificationPermission(): Promise<boolean> {
  unlockAudioContext();
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  try {
    const perm = await Notification.requestPermission();
    return perm === 'granted';
  } catch {
    return false;
  }
}

export function hasNotificationPermission(): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  return Notification.permission === 'granted';
}

/**
 * Show system notification on lock screen and device status bar
 */
export async function sendDeviceNotification(
  title: string, 
  body: string, 
  tag = 'almuslim',
  vibratePattern = [200, 100, 200, 100, 400]
) {
  triggerHaptic(60);

  if (!hasNotificationPermission()) return;

  try {
    if (serviceWorkerRegistration && 'showNotification' in serviceWorkerRegistration) {
      await serviceWorkerRegistration.showNotification(title, {
        body,
        icon: './icon-192.png',
        badge: './icon-192.png',
        tag,
        renotify: true,
        vibrate: vibratePattern,
        requireInteraction: true,
      } as any);
    } else if ('Notification' in window) {
      new Notification(title, {
        body,
        icon: './icon-192.png',
        tag,
      });
    }
  } catch (err) {
    console.debug('Notification delivery notice:', err);
  }
}

/**
 * Starts automatic prayer time watcher that triggers real Adhan when prayer arrives
 */
export function startPrayerWatcher(
  getPrayerTimes: () => PrayerTimes,
  getAdhanVoice: () => AdhanVoiceId,
  isAutoAdhanEnabled: () => boolean,
  prayerNamesMap: Record<PrayerName, string>,
  cityName: string,
  onAdhanTriggered?: (prayer: PrayerName) => void
) {
  if (prayerWatcherId) {
    clearInterval(prayerWatcherId);
  }

  const checkPrayer = () => {
    if (!isAutoAdhanEnabled()) return;

    const now = new Date();
    const hh = now.getHours().toString().padStart(2, '0');
    const mm = now.getMinutes().toString().padStart(2, '0');
    const currentTimeStr = `${hh}:${mm}`;

    const prayerTimes = getPrayerTimes();
    const prayerKeys: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

    for (const prayer of prayerKeys) {
      if (prayerTimes[prayer] === currentTimeStr) {
        const fireKey = `${prayer}-${currentTimeStr}`;
        if (lastFiredPrayer !== fireKey) {
          lastFiredPrayer = fireKey;
          const prayerName = prayerNamesMap[prayer] || prayer;

          // 1. Play real Adhan audio
          playAdhan(getAdhanVoice());

          // 2. Fire lock screen notification
          sendDeviceNotification(
            `الله أكبر - حان الآن موعد صلاة ${prayerName}`,
            `حي على الصلاة، حي على الفلاح (${cityName})`,
            `prayer-${prayer}`,
            [400, 200, 400, 200, 800]
          );

          if (onAdhanTriggered) {
            onAdhanTriggered(prayer);
          }
        }
        break;
      }
    }
  };

  // Run initial check and then interval every 8 seconds
  checkPrayer();
  prayerWatcherId = setInterval(checkPrayer, 8000);
}

/**
 * Starts periodic Dhikr reminder (every 5 minutes or custom interval)
 */
export function startPeriodicReminder(
  getConfig: () => PeriodicReminderConfig,
  language: 'ar' | 'tr'
) {
  if (periodicIntervalId) {
    clearInterval(periodicIntervalId);
  }

  const checkPeriodic = () => {
    const config = getConfig();
    if (!config.enabled || config.intervalMinutes <= 0) return;

    const now = new Date();
    const totalMinutes = now.getHours() * 60 + now.getMinutes();

    if (totalMinutes % config.intervalMinutes === 0) {
      if (lastFiredPeriodicMinute !== totalMinutes) {
        lastFiredPeriodicMinute = totalMinutes;

        // Play gentle chime & vibration if enabled
        if (config.soundEnabled !== false) {
          playCompletionChime();
        }
        if (config.vibrationEnabled !== false) {
          triggerHaptic(80);
        }

        const text = language === 'ar' ? config.dhikrTextAr : config.dhikrTextTr;
        sendDeviceNotification(
          language === 'ar' ? 'تذكير بذكر الله تعالى 🌿' : 'Zikir Hatırlatıcısı 🌿',
          text,
          'periodic-dhikr'
        );
      }
    }
  };

  // Check every 15 seconds
  periodicIntervalId = setInterval(checkPeriodic, 15000);
}

/**
 * Starts watcher for custom scheduled reminders
 */
export function startCustomRemindersWatcher(
  getCustomReminders: () => CustomReminderItem[],
  language: 'ar' | 'tr'
) {
  if (customRemindersWatcherId) {
    clearInterval(customRemindersWatcherId);
  }

  const checkCustom = () => {
    const reminders = getCustomReminders();
    if (!reminders || reminders.length === 0) return;

    const now = new Date();
    const hh = now.getHours().toString().padStart(2, '0');
    const mm = now.getMinutes().toString().padStart(2, '0');
    const currentTimeStr = `${hh}:${mm}`;
    const currentDay = now.getDay(); // 0 is Sunday, 5 is Friday

    for (const rem of reminders) {
      if (!rem.enabled) continue;
      if (rem.days.includes(currentDay) && rem.time === currentTimeStr) {
        const fireKey = `${rem.id}-${currentTimeStr}-${currentDay}`;
        if (lastFiredCustomMinute !== fireKey) {
          lastFiredCustomMinute = fireKey;

          if (rem.soundEnabled !== false) {
            playCompletionChime();
          }
          triggerHaptic(100);

          const title = language === 'ar' ? rem.titleAr : rem.titleTr;
          sendDeviceNotification(
            language === 'ar' ? `تذكير إسلامي: ${title}` : `İslami Hatırlatıcı: ${title}`,
            language === 'ar' ? '«ألا بذكر الله تطمئن القلوب»' : 'Kalpler ancak Allah\'ı anmakla huzur bulur',
            `custom-${rem.id}`
          );
        }
      }
    }
  };

  customRemindersWatcherId = setInterval(checkCustom, 15000);
}

export type { CustomReminderItem, PeriodicReminderConfig };
