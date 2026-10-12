import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Moon,
  Clock
} from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../translations';
import { 
  getHijriDate, 
  ISLAMIC_EVENTS, 
  HIJRI_MONTHS_AR, 
  HIJRI_MONTHS_TR 
} from '../utils/hijriCalendar';

interface CalendarScreenProps {
  language: Language;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({ language }) => {
  const t = getTranslation(language);

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const hijriToday = getHijriDate(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-11

  // First day of month and total days
  const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const dayNamesAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const dayNamesTr = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  const dayNames = language === 'ar' ? dayNamesAr : dayNamesTr;

  return (
    <div className="space-y-4 pb-6">
      {/* Hijri Today Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 border border-emerald-500/30 p-5 shadow-lg text-center">
        <span className="text-[11px] text-emerald-400 uppercase tracking-widest font-semibold block mb-1">
          {t.todayIs}
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-cairo">
          {language === 'ar' ? hijriToday.formattedAr : hijriToday.formattedTr}
        </h2>
        <p className="text-xs text-slate-300 mt-1 font-sans">
          {new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'tr-TR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </div>

      {/* Calendar Grid Container */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-4 shadow-sm">
        {/* Month Navigation */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <button
            onClick={language === 'ar' ? nextMonth : prevMonth}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
          >
            {language === 'ar' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>

          <h3 className="font-bold text-sm text-slate-100 font-cairo">
            {currentDate.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'tr-TR', {
              month: 'long',
              year: 'numeric',
            })}
          </h3>

          <button
            onClick={language === 'ar' ? prevMonth : nextMonth}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
          >
            {language === 'ar' ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center py-2 text-xs font-semibold text-slate-400">
          {dayNames.map((d, i) => (
            <div key={i} className={i === 5 ? 'text-amber-400 font-bold' : ''}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Days Matrix */}
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {/* Empty cells before first day */}
          {Array.from({ length: firstDay }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-11" />
          ))}

          {/* Active days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dayDate = new Date(year, month, dayNum);
            const isToday =
              dayDate.getDate() === new Date().getDate() &&
              dayDate.getMonth() === new Date().getMonth() &&
              dayDate.getFullYear() === new Date().getFullYear();

            const hijri = getHijriDate(dayDate);

            return (
              <div
                key={dayNum}
                className={`h-11 rounded-xl flex flex-col items-center justify-center p-1 border transition-all text-xs ${
                  isToday
                    ? 'bg-emerald-950 border-amber-400 text-amber-300 font-bold shadow-md shadow-emerald-950'
                    : 'bg-slate-950/40 border-slate-800/60 hover:bg-slate-800/50 text-slate-200'
                }`}
              >
                <span className="font-mono text-sm leading-none">{dayNum}</span>
                <span className="text-[9px] text-emerald-400/90 font-mono mt-0.5">
                  {hijri.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Islamic Occasions & Holidays */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-4 space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 px-1">
          <Moon className="w-4 h-4 text-amber-400" />
          <span>{t.upcomingEvents}</span>
        </div>

        <div className="space-y-2">
          {ISLAMIC_EVENTS.map((event, idx) => {
            const monthName = language === 'ar' 
              ? HIJRI_MONTHS_AR[event.hijriMonth - 1] 
              : HIJRI_MONTHS_TR[event.hijriMonth - 1];

            return (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-colors flex items-start justify-between gap-3"
              >
                <div>
                  <h4 className="font-bold text-xs text-slate-100 font-cairo">
                    {language === 'ar' ? event.titleAr : event.titleTr}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    {language === 'ar' ? event.descriptionAr : event.descriptionTr}
                  </p>
                </div>

                <div className="shrink-0 px-2.5 py-1 rounded-xl bg-emerald-950/80 border border-emerald-700/40 text-[10px] text-amber-300 font-mono text-center">
                  {event.hijriDay} {monthName}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
