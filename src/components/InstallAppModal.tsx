import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Download, 
  CheckCircle2, 
  Share2, 
  PlusSquare, 
  ArrowDownCircle, 
  Cpu, 
  ExternalLink,
  ShieldCheck,
  Terminal,
  Copy,
  Check
} from 'lucide-react';
import JSZip from 'jszip';
import { Language } from '../types';
import { getTranslation } from '../translations';
import { ANDROID_PROJECT_FILES } from '../data/androidProjectFiles';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const t = getTranslation(language);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isExportingZip, setIsExportingZip] = useState<boolean>(false);
  const [copiedCommand, setCopiedCommand] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else {
      // Fallback instruction
      alert(
        language === 'ar'
          ? 'لتثبيت التطبيق على هاتفك:\n1. اضغط على قائمة المتصفح (⋮) في الأعلى أو في الأسفل.\n2. اختر "تثبيت التطبيق" (Install App) أو "الإضافة إلى الشاشة الرئيسية" (Add to Home screen).\nوسيظهر التطبيق مباشرة في قائمة تطبيقات هاتفك!'
          : 'Uygulamayı telefonunuza yüklemek için:\n1. Tarayıcı menüsünü (⋮) açın.\n2. "Uygulamayı Yükle" veya "Ana Ekrana Ekle" seçeneğine dokunun.'
      );
    }
  };

  const handleDownloadZip = async () => {
    setIsExportingZip(true);
    try {
      const zip = new JSZip();
      zip.file(
        'README.md',
        `# المسلم - Al-Muslim Android Project (Kotlin & Jetpack Compose + Capacitor)
- Clean Architecture
- Room Database for Offline Quran
- Exact AlarmManager & Foreground Service for Adhan playback
- Hardware SensorManager for Qibla Compass
- Ready to open in Android Studio`
      );

      ANDROID_PROJECT_FILES.forEach((file) => {
        zip.file(file.path, file.content);
      });

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'AlMuslim_Android_Project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExportingZip(false);
    }
  };

  const handleCopyCommand = () => {
    navigator.clipboard.writeText('npm run cap:build && npm run cap:open');
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-amber-300 shadow-md">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-100 font-cairo">
                {language === 'ar' ? 'تحويل وتثبيت التطبيق على الهاتف' : 'Uygulamayı Telefona Yükle'}
              </h2>
              <p className="text-[11px] text-emerald-400">
                {language === 'ar' ? 'تطبيق مستقل بصيغة APK / WebAPK لهواتف أندرويد' : 'Android Bağımsız Uygulama Paketi'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 flex items-center justify-center cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Method 1: Instant Direct Phone Install (PWA / WebAPK) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 border border-emerald-500/40 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm font-cairo">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{language === 'ar' ? '1. التثبيت الفوري على الهاتف (مباشرة)' : '1. Telefona Doğrudan Yükle (Anında)'}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-300 text-[10px] border border-emerald-600/40">
                {language === 'ar' ? 'موصى به' : 'Önerilen'}
              </span>
            </div>

            <p className="text-slate-300 text-[11px] leading-relaxed">
              {language === 'ar'
                ? 'يمكنك تثبيت تطبيق «المسلم» فوراً على هاتفك الذكي ليعمل كـ تطبيق أندرويد مستقل بشاشته الكاملة، مع حفظ البيانات والمواقيت وقراءة القرآن دون الحاجة لأي أدوات خارجية.'
                : 'Uygulamayı herhangi bir harici araca ihtiyaç duymadan telefonunuza doğrudan tam ekran bağımsız bir uygulama olarak yükleyebilirsiniz.'}
            </p>

            <button
              onClick={handleInstallClick}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <ArrowDownCircle className="w-5 h-5 text-slate-950" />
              <span>{language === 'ar' ? 'تثبيت التطبيق على هذا الهاتف الآن' : 'Uygulamayı Şimdi Bu Telefona Yükle'}</span>
            </button>
          </div>

          {/* Method 2: Download Ready Android Studio Source ZIP */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-200 font-bold text-xs font-cairo">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>{language === 'ar' ? '2. تنزيل حزمة مشروع Android Studio (Kotlin .zip)' : '2. Android Studio Projesini İndir (.zip)'}</span>
              </div>
            </div>

            <p className="text-slate-400 text-[11px] leading-relaxed">
              {language === 'ar'
                ? 'قم بتحميل الكود المصدري الكامل للمشروع (Jetpack Compose, Room Database, Exact AlarmManager, Foreground Service) واستخرج ملف APK بضغطة زر داخل Android Studio.'
                : 'Projenin tüm Kotlin ve Jetpack Compose kaynak kodlarını indirip Android Studio üzerinden APK çıktısı alabilirsiniz.'}
            </p>

            <button
              onClick={handleDownloadZip}
              disabled={isExportingZip}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-600/50 text-emerald-300 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>{isExportingZip ? 'جارٍ إعداد الحزمة...' : (language === 'ar' ? 'تحميل مشروع أندرويد ستوديو (.zip)' : 'Android Projesini İndir (.zip)')}</span>
            </button>
          </div>

          {/* Method 3: 1-Click Capacitor Build Command */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2 text-slate-200 font-bold text-xs font-cairo">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span>{language === 'ar' ? '3. أمر البناء الفوري عبر Capacitor' : '3. Capacitor ile Tek Komutla APK'}</span>
            </div>

            <p className="text-slate-400 text-[11px] leading-relaxed">
              {language === 'ar'
                ? 'تم تجهيز ملف capacitor.config.json في المشروع. لتوليد مجلد أندرويد وفتح المشروع في ثوانٍ، نفذ الأمر التالي:'
                : 'Capacitor yapılandırması projeye eklenmiştir. Aşağıdaki komutu çalıştırarak projeyi derleyebilirsiniz:'}
            </p>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between font-mono text-[11px] text-emerald-300">
              <span className="truncate">npm run cap:build && npm run cap:open</span>
              <button
                onClick={handleCopyCommand}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0 ml-2 cursor-pointer flex items-center gap-1"
              >
                {copiedCommand ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCommand ? 'تم النسخ' : 'نسخ'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>{language === 'ar' ? 'جاهز للاستخدام والتثبيت' : 'Kullanıma Hazır'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium cursor-pointer"
          >
            {language === 'ar' ? 'إغلاق' : 'Kapat'}
          </button>
        </div>
      </div>
    </div>
  );
};
