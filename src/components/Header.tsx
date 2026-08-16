import React from 'react';
import { BookOpen, Sparkles, Volume2, VolumeX, History, GraduationCap } from 'lucide-react';

interface HeaderProps {
  onOpenHandbook: () => void;
  onOpenAITutor: () => void;
  onOpenHistory: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetToHome?: () => void;
  studentName?: string;
  studentClass?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHandbook,
  onOpenAITutor,
  onOpenHistory,
  soundEnabled,
  onToggleSound,
  onResetToHome,
  studentName,
  studentClass,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand & Title */}
        <div 
          onClick={onResetToHome}
          className="flex items-center gap-3 cursor-pointer group select-none"
          title="Trở về màn hình chính"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-orange-500 p-0.5 shadow-md group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-sky-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-sky-700 via-blue-700 to-orange-600 bg-clip-text text-transparent">
                GIA SƯ TIẾNG VIỆT LỚP 4
              </span>
              <span className="hidden md:inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                Tập 2 • KNTT
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <span>Tác giả:</span>
              <strong className="text-sky-900 font-semibold">Trần Thị Phượng - AI</strong>
              {studentName && (
                <span className="hidden sm:inline-block text-slate-400">
                  • Học sinh: <span className="text-orange-600 font-semibold">{studentName}</span> {studentClass ? `(${studentClass})` : ''}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="px-2.5 sm:px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Xem lịch sử làm bài và xuất file Excel"
          >
            <History className="w-4 h-4 text-sky-600" />
            <span className="hidden md:inline">Lịch sử & Excel</span>
          </button>

          {/* Sound toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 sm:p-2.5 rounded-xl border transition-all text-sm flex items-center gap-1.5 ${
              soundEnabled
                ? 'bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100'
                : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
            }`}
            title={soundEnabled ? 'Tắt giọng đọc & âm thanh' : 'Bật giọng đọc & âm thanh'}
            aria-label="Toggle sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-600" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden xl:inline text-xs font-medium">
              {soundEnabled ? 'Âm: BẬT' : 'Âm: TẮT'}
            </span>
          </button>

          {/* Handbook button */}
          <button
            onClick={onOpenHandbook}
            className="px-2.5 sm:px-3 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-800 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <BookOpen className="w-4 h-4 text-orange-600" />
            <span className="hidden sm:inline">Sổ tay SGK</span>
          </button>

          {/* AI Tutor Assistant Button */}
          <button
            onClick={onOpenAITutor}
            className="px-3 sm:px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-orange-500 hover:from-sky-700 hover:to-orange-600 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all active:scale-98"
          >
            <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
            <span className="font-bold">Gia sư AI</span>
          </button>
        </div>
      </div>
    </header>
  );
};

