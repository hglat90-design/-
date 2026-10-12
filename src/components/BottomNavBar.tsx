import React from 'react';
import { 
  Clock, 
  BookOpen, 
  Compass, 
  HeartHandshake, 
  Sparkles, 
  CalendarDays, 
  Settings
} from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../translations';

export type NavTab = 'prayer' | 'quran' | 'qibla' | 'azkar' | 'tasbeeh' | 'calendar' | 'settings';

interface BottomNavBarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  language: Language;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onTabChange,
  language,
}) => {
  const t = getTranslation(language);

  const tabs: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'prayer', label: t.tabPrayer, icon: Clock },
    { id: 'quran', label: t.tabQuran, icon: BookOpen },
    { id: 'qibla', label: t.tabQibla, icon: Compass },
    { id: 'azkar', label: t.tabAzkar, icon: HeartHandshake },
    { id: 'tasbeeh', label: t.tabTasbeeh, icon: Sparkles },
    { id: 'calendar', label: t.tabCalendar, icon: CalendarDays },
    { id: 'settings', label: t.tabSettings, icon: Settings },
  ];

  return (
    <nav className="sticky bottom-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-emerald-900/40 select-none pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around px-1 py-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all cursor-pointer relative ${
                isActive
                  ? 'text-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Active Indicator Pill */}
              <div
                className={`w-10 h-7 rounded-full flex items-center justify-center transition-colors ${
                  isActive
                    ? 'bg-emerald-800/60 border border-emerald-500/30 text-amber-300 shadow-sm shadow-emerald-950'
                    : 'bg-transparent text-slate-400'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[48px]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
      {/* Android Gesture Bar */}
      <div className="flex justify-center pb-1.5">
        <div className="w-24 h-1 bg-slate-600/50 rounded-full" />
      </div>
    </nav>
  );
};
