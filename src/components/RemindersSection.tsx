import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  BellRing, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Sliders, 
  Heart, 
  ShieldCheck, 
  Send,
  CalendarCheck,
  ChevronRight,
  Flame,
  Plus,
  Trash2,
  Volume2,
  Square,
  Play,
  Vibrate,
  X
} from 'lucide-react';
import { Language, CustomReminderItem, PeriodicReminderConfig } from '../types';
import { getTranslation } from '../translations';
import { 
  requestNotificationPermission, 
  hasNotificationPermission, 
  sendDeviceNotification,
} from '../utils/notificationManager';
import { playAdhan, stopAdhan, playCompletionChime, triggerHaptic } from '../utils/soundEffects';
import { safeStorage } from '../utils/safeStorage';

interface RemindersSectionProps {
  language: Language;
  periodicConfig: PeriodicReminderConfig;
  onUpdatePeriodicConfig: (updater: (prev: PeriodicReminderConfig) => PeriodicReminderConfig) => void;
  isAutoAdhanEnabled: boolean;
  onToggleAutoAdhan: (enabled: boolean) => void;
  customReminders?: CustomReminderItem[];
  onUpdateCustomReminders?: (reminders: CustomReminderItem[]) => void;
}

export const RemindersSection: React.FC<RemindersSectionProps> = ({
  language,
  periodicConfig,
  onUpdatePeriodicConfig,
  isAutoAdhanEnabled,
  onToggleAutoAdhan,
  customReminders: propReminders,
  onUpdateCustomReminders,
}) => {
  const t = getTranslation(language);
  const [hasPermission, setHasPermission] = useState<boolean>(hasNotificationPermission());
  const [notificationStatusMsg, setNotificationStatusMsg] = useState<string | null>(null);
  const [isTestAdhanPlaying, setIsTestAdhanPlaying] = useState<boolean>(false);
  const [showAddReminderModal, setShowAddReminderModal] = useState<boolean>(false);

  // New Reminder Form State
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('08:00');
  const [newDays, setNewDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);

  // Custom text for periodic Dhikr input
  const [isCustomDhikrOpen, setIsCustomDhikrOpen] = useState(false);
  const [customDhikrInput, setCustomDhikrInput] = useState('');

  // Default Custom Islamic Reminders
  const [customReminders, setCustomReminders] = useState<CustomReminderItem[]>(() => {
    if (propReminders && propReminders.length > 0) return propReminders;
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
        days: [5], // Friday
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
        days: [0, 3], // Sunday and Wednesday night
        soundEnabled: true,
      },
    ];
  });

  // Persist custom reminders
  useEffect(() => {
    safeStorage.setItem('almuslim_custom_reminders', JSON.stringify(customReminders));
    if (onUpdateCustomReminders) {
      onUpdateCustomReminders(customReminders);
    }
  }, [customReminders, onUpdateCustomReminders]);

  const dhikrPresets = [
    {
      ar: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
      tr: 'Sübhânallâhi ve bi-hamdihî, sübhânallâhi\'l-azîm',
    },
    {
      ar: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ',
      tr: 'Estağfirullâhe\'l-azîm ve etûbü ileyh',
    },
    {
      ar: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَىٰ نَبِيِّنَا مُحَمَّدٍ',
      tr: 'Allâhümme salli ve sellim alâ nebiyyinâ Muhammed',
    },
    {
      ar: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ',
      tr: 'Lâ havle ve lâ kuvvete illâ billâhi\'l-aliyyi\'l-azîm',
    },
    {
      ar: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
      tr: 'Lâ ilâhe illallâhu vahdehû lâ şerîke leh',
    },
  ];

  const intervals = [1, 5, 10, 15, 30, 60];

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setHasPermission(granted);
    if (granted) {
      setNotificationStatusMsg(language === 'ar' ? 'تم تفعيل إشعارات الهاتف والأذان بنجاح!' : 'Bildirimler başarıyla açıldı!');
      sendDeviceNotification(
        language === 'ar' ? 'تطبيق «المسلم» جاهز للخدمة' : '«El-Müslim» Uygulaması Hazır',
        language === 'ar' ? 'تم تفعيل الأذان التلقائي والتذكيرات الدورية حتى لو كان التطبيق مغلقاً.' : 'Otomatik ezan ve periyodik hatırlatıcılar aktif edildi.'
      );
    } else {
      setNotificationStatusMsg(language === 'ar' ? 'يرجى السماح بالإشعارات من إعدادات المتصفح أو الهاتف.' : 'Lütfen tarayıcı/cihaz ayarlarından bildirimlere izin verin.');
    }
    setTimeout(() => setNotificationStatusMsg(null), 4000);
  };

  const handleTestNotification = async () => {
    if (!hasPermission) {
      await handleEnableNotifications();
      return;
    }

    playCompletionChime();
    triggerHaptic(80);

    const title = language === 'ar' ? 'تذكير بذكر الله تعالى 🌿' : 'Zikir Hatırlatıcısı 🌿';
    const body = language === 'ar' ? periodicConfig.dhikrTextAr : periodicConfig.dhikrTextTr;

    sendDeviceNotification(title, body, 'test-reminder');

    setNotificationStatusMsg(language === 'ar' ? 'تم إرسال إشعار التذكير إلى شاشتك وقفل الهاتف الآن!' : 'Hatırlatıcı bildirimi ekranınıza gönderildi!');
    setTimeout(() => setNotificationStatusMsg(null), 3500);
  };

  const handleToggleTestAdhan = () => {
    if (isTestAdhanPlaying) {
      stopAdhan();
      setIsTestAdhanPlaying(false);
    } else {
      setIsTestAdhanPlaying(true);
      playAdhan('makkah', () => {
        setIsTestAdhanPlaying(false);
      });
    }
  };

  const handleToggleCustom = (id: string) => {
    setCustomReminders((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
    triggerHaptic(25);
  };

  const handleDeleteCustom = (id: string) => {
    setCustomReminders((prev) => prev.filter((item) => item.id !== id));
    triggerHaptic(30);
  };

  const handleAddNewReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newReminder: CustomReminderItem = {
      id: `custom_${Date.now()}`,
      titleAr: newTitle.trim(),
      titleTr: newTitle.trim(),
      time: newTime,
      enabled: true,
      days: newDays.length > 0 ? newDays : [0, 1, 2, 3, 4, 5, 6],
      soundEnabled: true,
    };

    setCustomReminders((prev) => [newReminder, ...prev]);
    setNewTitle('');
    setShowAddReminderModal(false);
    triggerHaptic(40);
  };

  const handleSaveCustomDhikr = () => {
    if (customDhikrInput.trim()) {
      onUpdatePeriodicConfig((prev) => ({
        ...prev,
        dhikrTextAr: customDhikrInput.trim(),
        dhikrTextTr: customDhikrInput.trim(),
      }));
      setIsCustomDhikrOpen(false);
      triggerHaptic(25);
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Device Notification & Permissions Banner */}
      {!hasPermission ? (
        <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-950 via-slate-900 to-amber-900 border border-amber-500/50 shadow-lg flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
              <BellRing className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-amber-300 font-cairo">
                {language === 'ar' ? 'تفعيل إشعارات الأذان والتذكيرات' : 'Ezan ve Hatırlatıcı Bildirimlerini Aç'}
              </h4>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                {language === 'ar'
                  ? 'اضغط هنا لمنح إذن الإشعارات ليرفع الأذان والتذكير على شاشتك حتى لو كان التطبيق مغلقاً.'
                  : 'Uygulama kapalıyken dahi ezan ve zikir bildirimlerinin gelmesi için izin verin.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleEnableNotifications}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shrink-0 shadow-md transition-transform active:scale-95 cursor-pointer font-cairo"
          >
            {language === 'ar' ? 'تفعيل الآن' : 'İzin Ver'}
          </button>
        </div>
      ) : (
        <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold font-cairo">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              {language === 'ar'
                ? 'إشعارات الهاتف مفعّلة • الأذان والتذكيرات تعمل في الخلفية'
                : 'Bildirimler etkin • Ezan ve hatırlatıcılar arka planda çalışıyor'}
            </span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>
      )}

      {notificationStatusMsg && (
        <div className="p-2.5 rounded-2xl bg-emerald-950 border border-emerald-500/40 text-emerald-200 text-xs text-center font-medium shadow-md animate-fade-in font-cairo">
          {notificationStatusMsg}
        </div>
      )}

      {/* 2. Automatic Adhan at Prayer Times Toggle */}
      <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950 border border-emerald-600/40 flex items-center justify-center text-amber-300 shrink-0 shadow-inner">
              <Bell className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-100 font-cairo">
                {language === 'ar' ? 'الأذان التلقائي عند دخول الوقت' : 'Vakit Girdiğinde Otomatik Ezan'}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isAutoAdhanEnabled
                  ? (language === 'ar' ? 'مفعل: يرفع الأذان الحقيقي تلقائياً مع إشعار بالصوت واهتزاز' : 'Aktif: Vakit girdiğinde gerçek sesli ezan okunur')
                  : (language === 'ar' ? 'معطل حالياً' : 'Şu anda kapalı')}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (!hasPermission) {
                handleEnableNotifications();
              }
              onToggleAutoAdhan(!isAutoAdhanEnabled);
              triggerHaptic(30);
            }}
            className={`w-13 h-7 rounded-full p-1 transition-colors cursor-pointer flex items-center ${
              isAutoAdhanEnabled ? 'bg-emerald-600 justify-end' : 'bg-slate-800 justify-start'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white shadow-md" />
          </button>
        </div>

        {/* Live Audio Test Button for Adhan */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">
            {language === 'ar' ? 'تجربة صوت الأذان الحقيقي عبر مكبر الصوت:' : 'Gerçek Ezan Sesini Test Et:'}
          </span>
          <button
            onClick={handleToggleTestAdhan}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isTestAdhanPlaying
                ? 'bg-rose-950 border border-rose-500 text-rose-300 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/30'
            }`}
          >
            {isTestAdhanPlaying ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>{language === 'ar' ? 'إيقاف الأذان' : 'Durdur'}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{language === 'ar' ? 'تشغيل الأذان' : 'Ezanı Çal'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Periodic Dhikr Reminder (Every 5 minutes, 15m, etc.) */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-emerald-900/30 border border-emerald-500/40 shadow-md space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-100 font-cairo flex items-center gap-1.5">
                <span>{language === 'ar' ? 'مُذكّر الاستغفار والتسبيح الدوري' : 'Periyodik Zikir Hatırlatıcısı'}</span>
                {periodicConfig.enabled && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                )}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {language === 'ar' ? 'يرسل إشعاراً عاطراً بذكر الله كل فترة زمنية محددة حتى لو كان التطبيق مغلقاً' : 'Belirlenen sürede ekrana zikir bildirimi gönderir'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (!hasPermission) {
                handleEnableNotifications();
              }
              onUpdatePeriodicConfig((prev) => ({ ...prev, enabled: !prev.enabled }));
              triggerHaptic(30);
            }}
            className={`w-13 h-7 rounded-full p-1 transition-colors cursor-pointer flex items-center ${
              periodicConfig.enabled ? 'bg-emerald-600 justify-end' : 'bg-slate-800 justify-start'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white shadow-md" />
          </button>
        </div>

        {/* Time Interval Selector Buttons (1 min, 5 mins, 10m, 15m, 30m, 60m) */}
        <div>
          <span className="text-[11px] text-slate-300 font-semibold block mb-1.5">
            {language === 'ar' ? 'اختر الفترة الزمنية بين كل تذكير:' : 'Hatırlatma Sıklığı:'}
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {intervals.map((mins) => {
              const isSelected = periodicConfig.intervalMinutes === mins;
              return (
                <button
                  key={mins}
                  onClick={() => {
                    onUpdatePeriodicConfig((prev) => ({ ...prev, intervalMinutes: mins }));
                    triggerHaptic(20);
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer text-center ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-md ring-1 ring-amber-300 font-extrabold scale-105'
                      : 'bg-slate-950/60 border border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  {mins === 5 ? (
                    <div>
                      <span>5 د</span>
                      <span className="text-[9px] block text-emerald-950 font-bold">موصى به ⭐</span>
                    </div>
                  ) : mins === 1 ? (
                    '1 د (تجربة)'
                  ) : (
                    `${mins} دقيقة`
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dhikr Selection & Custom Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] text-slate-300 font-semibold">
              {language === 'ar' ? 'نص الذكر الذي يظهر في الإشعار:' : 'Bildirimde Görünecek Zikir:'}
            </span>
            <button
              onClick={() => setIsCustomDhikrOpen(!isCustomDhikrOpen)}
              className="text-[11px] text-amber-300 hover:text-amber-200 underline font-cairo cursor-pointer"
            >
              {language === 'ar' ? '+ كتابة ذكر مخصص' : '+ Özel Zikir Yaz'}
            </button>
          </div>

          {/* Custom Dhikr Input Field */}
          {isCustomDhikrOpen && (
            <div className="p-3 mb-2.5 rounded-2xl bg-slate-950 border border-amber-400/50 space-y-2">
              <input
                type="text"
                value={customDhikrInput}
                onChange={(e) => setCustomDhikrInput(e.target.value)}
                placeholder={language === 'ar' ? 'اكتب الذكر أو الدعاء الذي تريده...' : 'Özel zikir veya dua yazın...'}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400 font-cairo"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setIsCustomDhikrOpen(false)}
                  className="px-3 py-1 rounded-lg text-slate-400 text-xs hover:text-slate-200 cursor-pointer"
                >
                  {language === 'ar' ? 'إلغاء' : 'İptal'}
                </button>
                <button
                  onClick={handleSaveCustomDhikr}
                  className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer font-cairo"
                >
                  {language === 'ar' ? 'حفظ الذكر المخصص' : 'Kaydet'}
                </button>
              </div>
            </div>
          )}

          {/* Dhikr Presets */}
          <div className="space-y-1.5">
            {dhikrPresets.map((item, idx) => {
              const isSelected = periodicConfig.dhikrTextAr === item.ar;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    onUpdatePeriodicConfig((prev) => ({
                      ...prev,
                      dhikrTextAr: item.ar,
                      dhikrTextTr: item.tr,
                    }));
                    triggerHaptic(20);
                  }}
                  className={`w-full p-2.5 rounded-xl border text-start transition-all cursor-pointer text-xs ${
                    isSelected
                      ? 'bg-emerald-950 border-amber-400 text-amber-300 font-bold shadow-sm'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="font-quran text-sm leading-relaxed">
                    {language === 'ar' ? item.ar : item.tr}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Audio & Vibration Controls + Instant Test Button */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={periodicConfig.soundEnabled !== false}
                onChange={(e) => onUpdatePeriodicConfig((prev) => ({ ...prev, soundEnabled: e.target.checked }))}
                className="accent-emerald-500 rounded"
              />
              <span>{language === 'ar' ? 'نغمة تنبيه هادئة' : 'Sesli Uyarı'}</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={periodicConfig.vibrationEnabled !== false}
                onChange={(e) => onUpdatePeriodicConfig((prev) => ({ ...prev, vibrationEnabled: e.target.checked }))}
                className="accent-emerald-500 rounded"
              />
              <span>{language === 'ar' ? 'اهتزاز الهاتف' : 'Titreşim'}</span>
            </label>
          </div>

          <button
            onClick={handleTestNotification}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-amber-400/30 transition-transform active:scale-95 cursor-pointer font-cairo shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'تجربة إشعار فوري على شاشتك' : 'Hemen Test Et'}</span>
          </button>
        </div>
      </div>

      {/* 4. Custom Scheduled Reminders (إضافة وتعديل أي تذكير مخصص) */}
      <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-emerald-400" />
            <h4 className="font-bold text-xs text-slate-200 font-cairo">
              {language === 'ar' ? 'التذكيرات والسنن الإسلامية المجدولة' : 'Planlanmış İslami Hatırlatıcılar'}
            </h4>
          </div>

          {/* Add New Reminder Button */}
          <button
            onClick={() => setShowAddReminderModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-600/30 border border-emerald-500/50 hover:bg-emerald-600/50 text-emerald-300 text-[11px] font-bold cursor-pointer font-cairo transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'إضافة تذكير جديد' : 'Yeni Ekle'}</span>
          </button>
        </div>

        {/* Reminders List */}
        <div className="space-y-2">
          {customReminders.map((reminder) => (
            <div
              key={reminder.id}
              className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                reminder.enabled
                  ? 'bg-slate-950/80 border-slate-700/80 text-slate-200 shadow-sm'
                  : 'bg-slate-950/30 border-slate-800/50 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex-1">
                <span className="text-xs font-bold font-cairo block">
                  {language === 'ar' ? reminder.titleAr : reminder.titleTr}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-amber-400 font-mono font-bold">
                    ⏰ {reminder.time}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {reminder.days.length === 7
                      ? (language === 'ar' ? 'يومياً' : 'Her gün')
                      : reminder.days.includes(5) && reminder.days.length === 1
                      ? (language === 'ar' ? 'كل جمعة' : 'Her Cuma')
                      : (language === 'ar' ? `${reminder.days.length} أيام أسبوعياً` : `${reminder.days.length} gün`)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleCustom(reminder.id)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                    reminder.enabled ? 'bg-emerald-600 justify-end' : 'bg-slate-800 justify-start'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                </button>

                <button
                  onClick={() => handleDeleteCustom(reminder.id)}
                  title={language === 'ar' ? 'حذف التذكير' : 'Sil'}
                  className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Custom Reminder Modal */}
      {showAddReminderModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl animate-fade-in font-cairo">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>{language === 'ar' ? 'إضافة تذكير مخصص جديد' : 'Yeni Özel Hatırlatıcı Ekle'}</span>
              </h3>
              <button
                onClick={() => setShowAddReminderModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewReminder} className="space-y-3.5">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">
                  {language === 'ar' ? 'عنوان التذكير:' : 'Hatırlatıcı Başlığı:'}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: صلاة الضحى، ورد القرآن، سورة الكهف...' : 'Örn: Kuşluk namazı, Kuran tilaveti...'}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">
                  {language === 'ar' ? 'وقت التنبيه (الساعة:الدقيقة):' : 'Hatırlatma Saati:'}
                </label>
                <input
                  type="time"
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">
                  {language === 'ar' ? 'التكرار:' : 'Tekrar:'}
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewDays([0, 1, 2, 3, 4, 5, 6])}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-semibold cursor-pointer border ${
                      newDays.length === 7
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {language === 'ar' ? 'كل يوم' : 'Her gün'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewDays([5])}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-semibold cursor-pointer border ${
                      newDays.length === 1 && newDays[0] === 5
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {language === 'ar' ? 'يوم الجمعة' : 'Sadece Cuma'}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddReminderModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 text-xs cursor-pointer"
                >
                  {language === 'ar' ? 'إلغاء' : 'İptal'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-xs cursor-pointer shadow-md hover:from-emerald-500 hover:to-emerald-400 transition-transform active:scale-95"
                >
                  {language === 'ar' ? 'حفظ التذكير' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
