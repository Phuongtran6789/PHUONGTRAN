import React, { useState } from 'react';
import { QuizConfig, Difficulty } from '../types';
import { LESSONS, THEMES } from '../data/lessons';
import { 
  User, 
  School, 
  Layers, 
  BookMarked, 
  Play, 
  Sparkles, 
  Sliders, 
  CheckCircle2, 
  Award, 
  Flame, 
  Clock, 
  BrainCircuit,
  Filter,
  History,
  FileSpreadsheet
} from 'lucide-react';

interface QuizSetupProps {
  onStartQuiz: (config: QuizConfig) => void;
  availableTotalQuestions: number;
  onOpenHistory?: () => void;
}

export const QuizSetup: React.FC<QuizSetupProps> = ({ 
  onStartQuiz, 
  availableTotalQuestions,
  onOpenHistory 
}) => {
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('4A1');
  const [selectedLessonId, setSelectedLessonId] = useState<QuizConfig['selectedLessonId']>('all');
  const [difficulty, setDifficulty] = useState<Difficulty>('all');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [mode, setMode] = useState<'practice' | 'test'>('practice');
  const [activeThemeTab, setActiveThemeTab] = useState<string>('all');
  const [nameError, setNameError] = useState<string>('');


  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      setNameError('Vui lòng nhập họ và tên của em để nhận kết quả và giấy khen nhé!');
      return;
    }
    setNameError('');
    onStartQuiz({
      studentName: studentName.trim(),
      studentClass: studentClass.trim() || 'Lớp 4',
      selectedLessonId,
      difficulty,
      questionCount: Math.min(30, Math.max(1, questionCount)),
      mode,
    });
  };

  const filteredLessons = LESSONS.filter((lesson) => {
    if (activeThemeTab === 'all') return true;
    if (activeThemeTab === 'theme1') return lesson.themeId === 'theme1';
    if (activeThemeTab === 'theme2') return lesson.themeId === 'theme2';
    if (activeThemeTab === 'theme3') return lesson.themeId === 'theme3';
    if (activeThemeTab === 'theme4') return lesson.themeId === 'theme4';
    if (activeThemeTab === 'review') return lesson.type === 'review';
    return true;
  });

  const selectedLessonObj = typeof selectedLessonId === 'number' 
    ? LESSONS.find(l => l.id === selectedLessonId) 
    : null;

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4 sm:px-6">
      {/* Hero Banner with Author and Subject Info */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 via-blue-700 to-orange-500 text-white p-6 sm:p-8 shadow-xl mb-8">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-10 bottom-0 opacity-10 sm:opacity-20 pointer-events-none">
          <BookMarked className="w-56 h-56 text-white" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-yellow-200 text-xs sm:text-sm font-semibold mb-3 backdrop-blur-xs">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>Hệ Thống Ôn Tập & Gia Sư Thông Minh</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2 leading-tight">
            GIA SƯ TIẾNG VIỆT LỚP 4
          </h1>
          <p className="text-sky-100 text-sm sm:text-base font-normal mb-4">
            Bám sát chương trình <strong>Sách giáo khoa Tiếng Việt 4 – Tập hai</strong> (Bộ sách <em>Kết nối tri thức với cuộc sống</em>).
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-medium text-white/90 pt-3 border-t border-white/20">
            <div className="flex items-center gap-1.5">
              <span className="text-orange-200 font-medium">Tác giả:</span>
              <span className="font-extrabold text-white bg-white/20 px-3 py-1 rounded-xl border border-white/30 shadow-2xs">
                TRẦN THỊ PHƯỢNG - AI
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping" />
              <span>Sẵn sàng: 30 bài học • 4 chủ điểm • Đầy đủ 3 mức độ</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleStart} className="space-y-8">
        {/* Step 1: Student Information */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-sky-100 shadow-xs">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 font-bold text-lg">
              1
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Thông tin học sinh</h2>
              <p className="text-xs sm:text-sm text-slate-500">Nhập tên và lớp để in trên phiếu báo điểm & giấy khen</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Student Name */}
            <div>
              <label htmlFor="student-name-input" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                Họ và tên học sinh <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="student-name-input"
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Minh Khôi"
                  value={studentName}
                  onChange={(e) => {
                    setStudentName(e.target.value);
                    if (nameError) setNameError('');
                  }}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-slate-800 text-sm font-medium focus:outline-hidden focus:bg-white focus:ring-2 transition-all ${
                    nameError 
                      ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/40' 
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
              </div>
              {nameError && <p className="text-rose-600 text-xs font-medium mt-1.5">{nameError}</p>}
            </div>

            {/* Student Class */}
            <div>
              <label htmlFor="student-class-input" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                Lớp học <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <School className="w-4 h-4" />
                </div>
                <input
                  id="student-class-input"
                  type="text"
                  required
                  placeholder="Ví dụ: 4A1, 4B, 4C..."
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm font-medium focus:outline-hidden focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Select Lesson (Chọn bài) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg">
                2
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Chọn bài học cần ôn tập</h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  {selectedLessonId === 'all' 
                    ? 'Đang chọn: Toàn bộ 4 chủ điểm (Bài 1 đến Bài 30)' 
                    : selectedLessonObj 
                      ? `Đang chọn: ${selectedLessonObj.title} (${selectedLessonObj.pages})`
                      : 'Đang chọn theo nhóm chủ điểm'}
                </p>
              </div>
            </div>

            {/* Quick preset selector */}
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSelectedLessonId('all')}
                className={`px-3 py-1.5 rounded-lg border transition-all ${
                  selectedLessonId === 'all'
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Tất cả các bài
              </button>
            </div>
          </div>

          {/* Theme Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveThemeTab('all')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                activeThemeTab === 'all'
                  ? 'bg-sky-700 text-white border-sky-700 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              Tất cả chủ điểm
            </button>
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => setActiveThemeTab(theme.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  activeThemeTab === theme.id
                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {theme.title}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setActiveThemeTab('review')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                activeThemeTab === 'review'
                  ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Ôn tập & Đánh giá
            </button>
          </div>

          {/* Grid of lessons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
            <button
              type="button"
              onClick={() => setSelectedLessonId('all')}
              className={`p-3 rounded-2xl border text-left transition-all relative ${
                selectedLessonId === 'all'
                  ? 'bg-sky-50/90 border-sky-500 ring-2 ring-sky-200'
                  : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-700">Toàn bộ</span>
                {selectedLessonId === 'all' && <CheckCircle2 className="w-4 h-4 text-sky-600" />}
              </div>
              <p className="text-sm font-bold text-slate-800 mt-1">Ôn tập Tổng hợp (30 bài)</p>
              <p className="text-xs text-slate-500 mt-0.5">Tất cả các chủ điểm trong học kì 2</p>
            </button>

            {filteredLessons.map((lesson) => {
              const isSelected = selectedLessonId === lesson.id;
              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => setSelectedLessonId(lesson.id)}
                  className={`p-3 rounded-2xl border text-left transition-all relative ${
                    isSelected
                      ? 'bg-sky-50/90 border-sky-500 ring-2 ring-sky-200'
                      : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] font-semibold text-slate-500">
                      Tuần {lesson.week} • {lesson.pages}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />}
                  </div>
                  <p className="text-sm font-bold text-slate-800 mt-0.5 line-clamp-1">
                    {lesson.title}
                  </p>
                  {lesson.grammarFocus && (
                    <p className="text-[11px] text-orange-600 font-medium mt-0.5 line-clamp-1">
                      Ngữ pháp: {lesson.grammarFocus}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Difficulty & Question Count */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mức độ (Difficulty) */}
          <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 font-bold text-lg">
                  3
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Chọn mức độ câu hỏi</h2>
                  <p className="text-xs text-slate-500">Phân hóa theo chuẩn kiểm tra đánh giá của Bộ GD&ĐT</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  {
                    id: 'nhan_biet',
                    title: 'Nhận biết',
                    desc: 'Nhận diện khái niệm, tác giả, tác phẩm, chi tiết bài đọc',
                    icon: CheckCircle2,
                    color: 'text-emerald-600',
                    activeBg: 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-100',
                  },
                  {
                    id: 'thong_hieu',
                    title: 'Thông hiểu',
                    desc: 'Hiểu ý nghĩa câu chuyện, phân loại ngữ pháp, dấu câu',
                    icon: BrainCircuit,
                    color: 'text-sky-600',
                    activeBg: 'bg-sky-50 border-sky-400 ring-2 ring-sky-100',
                  },
                  {
                    id: 'van_dung',
                    title: 'Vận dụng',
                    desc: 'Đặt câu, tìm từ đắt giá, biện pháp tu từ, làm văn',
                    icon: Flame,
                    color: 'text-orange-600',
                    activeBg: 'bg-orange-50 border-orange-400 ring-2 ring-orange-100',
                  },
                  {
                    id: 'all',
                    title: 'Tổng hợp 3 mức độ',
                    desc: 'Phân bổ chuẩn đề thi: 40% NB - 35% TH - 25% VD',
                    icon: Award,
                    color: 'text-sky-700',
                    activeBg: 'bg-gradient-to-br from-sky-50 to-orange-50 border-orange-400 ring-2 ring-orange-100',
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = difficulty === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setDifficulty(item.id as Difficulty)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? item.activeBg
                          : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-4 h-4 ${item.color}`} />
                        <span className="text-xs sm:text-sm font-bold text-slate-800">{item.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{item.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Question Count (Số lượng câu hỏi - Tối đa 30 câu) & Mode */}
          <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 font-bold text-lg">
                  4
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Số lượng câu hỏi & Chế độ</h2>
                  <p className="text-xs text-slate-500">Tối đa 30 câu hỏi theo yêu cầu</p>
                </div>
              </div>

              {/* Slider & Presets */}
              <div className="mb-5 bg-sky-50/50 p-4 rounded-2xl border border-sky-200/70">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700">Số câu muốn làm:</span>
                  <span className="text-lg font-extrabold text-sky-800 bg-white px-3 py-0.5 rounded-xl border border-sky-200 shadow-2xs">
                    {questionCount} <span className="text-xs font-medium text-slate-500">/ 30 câu</span>
                  </span>
                </div>

                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500 mb-3"
                />

                {/* Quick Presets */}
                <div className="flex items-center justify-between gap-1.5">
                  {[5, 10, 15, 20, 25, 30].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setQuestionCount(num)}
                      className={`flex-1 py-1 text-xs font-bold rounded-lg border transition-all ${
                        questionCount === num
                          ? 'bg-orange-500 text-white border-orange-500 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Practice Mode vs Test Mode */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setMode('practice')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    mode === 'practice'
                      ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-100'
                      : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs sm:text-sm font-bold text-slate-800">Luyện tập</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Xem ngay lời giải và ghi nhớ SGK sau từng câu</p>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('test')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    mode === 'test'
                      ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-100'
                      : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span className="text-xs sm:text-sm font-bold text-slate-800">Thi thử tính giờ</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Tính giờ làm bài và nhận Giấy khen, Bảng điểm</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Start Button & Quick Actions */}
        <div className="pt-2 text-center space-y-3">
          <button
            type="submit"
            id="start-quiz-btn"
            className="w-full sm:w-auto min-w-[280px] px-8 py-4 bg-gradient-to-r from-sky-600 via-blue-600 to-orange-500 hover:from-sky-700 hover:to-orange-600 text-white font-extrabold text-lg rounded-2xl shadow-lg hover:shadow-orange-500/20 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-3 mx-auto"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>BẮT ĐẦU LÀM BÀI</span>
          </button>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {onOpenHistory && (
              <button
                type="button"
                onClick={onOpenHistory}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-sky-50 border border-sky-200 text-sky-800 text-xs sm:text-sm font-bold shadow-2xs transition-all"
              >
                <History className="w-4 h-4 text-sky-600" />
                <span>Xem lịch sử làm bài & Bảng điểm Excel</span>
              </button>
            )}
          </div>

          <p className="text-xs text-slate-500 font-medium">
            Gia sư AI Tiếng Việt Lớp 4 (Trần Thị Phượng) luôn sẵn sàng hỗ trợ em mọi lúc!
          </p>
        </div>
      </form>
    </div>
  );
};
