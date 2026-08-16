import React, { useEffect, useState } from 'react';
import { QuizResult } from '../types';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/audio';
import { Certificate16x9 } from './Certificate16x9';
import { 
  Trophy, 
  Award, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  Sparkles, 
  Printer, 
  BookOpen, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Share2,
  Bookmark,
  History,
  FileSpreadsheet
} from 'lucide-react';
import { exportHistoryToExcel, getQuizHistory } from '../utils/historyStorage';

interface QuizSummaryProps {
  result: QuizResult;
  onRetrySameQuiz: () => void;
  onNewQuiz: () => void;
  onOpenAITutor: () => void;
  onOpenHistory?: () => void;
}

export const QuizSummary: React.FC<QuizSummaryProps> = ({
  result,
  onRetrySameQuiz,
  onNewQuiz,
  onOpenAITutor,
  onOpenHistory,
}) => {
  const [activeTab, setActiveTab] = useState<'certificate' | 'review'>('certificate');
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  useEffect(() => {
    if (result.scoreTenScale >= 7) {
      soundFx.playMajesticSuccess();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#0284c7', '#ea580c', '#38bdf8', '#fb923c', '#facc15', '#22c55e'],
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 70,
          origin: { x: 0.1, y: 0.6 },
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 70,
          origin: { x: 0.9, y: 0.6 },
        });
      }, 300);
    } else {
      soundFx.playEncouragingGentle();
    }
  }, [result.scoreTenScale]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} phút ${secs} giây`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4 sm:px-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm mb-6 text-center">
        <div className="inline-flex p-3 rounded-2xl bg-orange-50 border border-orange-200 text-orange-600 mb-3 shadow-xs">
          <Trophy className="w-10 h-10" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
          KẾT QUẢ ÔN TẬP TIẾNG VIỆT 4
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Học sinh: <strong className="text-sky-700">{result.studentName}</strong> • Lớp: <strong className="text-sky-700">{result.studentClass}</strong> • Ngày làm: {result.timestamp}
        </p>

        {/* Score metrics grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 my-6 max-w-3xl mx-auto">
          {/* Điểm 10 & Xếp loại */}
          <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200 text-center flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700">Điểm & Xếp loại</span>
            <div className="text-2xl sm:text-3xl font-black text-sky-900 my-1">
              {result.scoreTenScale} <span className="text-sm font-normal text-slate-400">/ 10</span>
            </div>
            <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-lg inline-block border ${
              result.percentage >= 90
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : result.percentage >= 70
                ? 'bg-sky-100 text-sky-900 border-sky-300'
                : result.percentage >= 50
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-orange-100 text-orange-900 border-orange-300'
            }`}>
              {result.gradeEvaluation}
            </span>
          </div>

          {/* Đúng */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Số câu đúng</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">
              {result.correctCount} <span className="text-sm font-normal text-slate-400">/ {result.totalQuestions}</span>
            </div>
            <span className="text-xs font-semibold text-emerald-800 mt-0.5 inline-block">
              Đạt {result.percentage}%
            </span>
          </div>

          {/* Chưa đúng */}
          <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Sai / Chưa làm</span>
            <div className="text-2xl sm:text-3xl font-black text-rose-700 mt-1">
              {result.incorrectCount + result.unansweredCount}
            </div>
            <span className="text-xs font-semibold text-rose-800 mt-0.5 inline-block">
              {result.incorrectCount} sai, {result.unansweredCount} bỏ qua
            </span>
          </div>

          {/* Thời gian */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Thời gian</span>
            <div className="text-lg sm:text-xl font-bold text-slate-800 mt-2">
              {formatTimer(result.timeElapsedSeconds)}
            </div>
            <span className="text-xs text-slate-500 mt-0.5 inline-block">Hoàn thành</span>
          </div>
        </div>

        {/* AI Tutor Note */}
        <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-orange-50/60 border border-sky-200 text-left flex items-start gap-3">
          <div className="p-2 rounded-xl bg-orange-500 text-white shrink-0">
            <Sparkles className="w-5 h-5 text-yellow-200" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-950 mb-0.5">
              Lời nhận xét từ Gia sư Tiếng Việt (Trần Thị Phượng - AI)
            </h4>
            <p className="text-sm text-slate-700 font-medium leading-relaxed">
              {result.tutorComment}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs: Giấy khen danh dự vs Xem lại bài */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('certificate')}
          className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'certificate'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Giấy khen vinh danh</span>
        </button>

        <button
          onClick={() => setActiveTab('review')}
          className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'review'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Xem lại toàn bộ câu hỏi & Lời giải ({result.totalQuestions})</span>
        </button>

        {onOpenHistory && (
          <button
            onClick={onOpenHistory}
            className="px-4 py-2.5 rounded-2xl text-sm font-bold bg-white hover:bg-sky-50 text-sky-800 border border-sky-200 flex items-center gap-1.5 transition-all shadow-2xs"
          >
            <History className="w-4 h-4 text-sky-600" />
            <span>Lịch sử & Bảng điểm</span>
          </button>
        )}

        <button
          onClick={() => {
            const history = getQuizHistory();
            exportHistoryToExcel(history);
          }}
          className="px-4 py-2.5 rounded-2xl text-sm font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 transition-all shadow-2xs"
          title="Tải toàn bộ kết quả ra file Excel"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span className="hidden sm:inline">Xuất Excel (.xlsx)</span>
        </button>

        <button
          onClick={handlePrint}
          className="ml-auto px-4 py-2 rounded-2xl text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>In giấy khen</span>
        </button>
      </div>

      {/* Tab 1: Certificate (16:9 Aspect Ratio) */}
      {activeTab === 'certificate' && (
        <div className="mb-8">
          <Certificate16x9 result={result} />
        </div>
      )}

      {/* Tab 2: Detailed Review of All Questions */}
      {activeTab === 'review' && (
        <div className="space-y-4 mb-8">
          {result.questions.map((q, idx) => {
            const userAnswer = result.answers[idx];
            const isCorrect = userAnswer?.isCorrect;
            const isUnanswered = userAnswer?.selectedIndex === null;
            const isExpanded = expandedQuestion === q.id || !isCorrect; // Auto expand mistakes

            return (
              <div
                key={q.id}
                className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all ${
                  isCorrect
                    ? 'border-emerald-200 shadow-2xs'
                    : 'border-rose-200 bg-rose-50/20 shadow-xs'
                }`}
              >
                <div 
                  onClick={() => setExpandedQuestion(isExpanded ? null : q.id)}
                  className="flex items-start justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-extrabold text-sm ${
                      isCorrect
                        ? 'bg-emerald-600 text-white'
                        : isUnanswered
                        ? 'bg-slate-300 text-slate-700'
                        : 'bg-rose-600 text-white'
                    }`}>
                      {idx + 1}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                          isCorrect
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isCorrect ? '✓ Trả lời đúng' : isUnanswered ? 'Chưa trả lời' : '✗ Trả lời sai'}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {q.lessonTitle} • {q.difficultyLabel}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {q.question}
                      </h4>
                    </div>
                  </div>

                  <div className="text-slate-400 p-1">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                    {/* Passage if any */}
                    {q.passage && (
                      <div className="p-3 bg-slate-50 rounded-xl text-xs sm:text-sm text-slate-700 italic border-l-2 border-slate-300">
                        "{q.passage}"
                      </div>
                    )}

                    {/* Options list */}
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = userAnswer?.selectedIndex === optIdx;
                        const isRight = optIdx === q.correctIndex;

                        let optClass = 'bg-slate-50 border-slate-200 text-slate-700';
                        if (isRight) {
                          optClass = 'bg-emerald-100/70 border-emerald-400 text-emerald-950 font-bold';
                        } else if (isChosen && !isRight) {
                          optClass = 'bg-rose-100/70 border-rose-400 text-rose-950 line-through';
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between gap-2 ${optClass}`}
                          >
                            <span>
                              <strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt}
                            </span>
                            {isRight && (
                              <span className="text-xs font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-300">
                                Đáp án đúng
                              </span>
                            )}
                            {isChosen && !isRight && (
                              <span className="text-xs font-bold text-rose-800 bg-white px-2 py-0.5 rounded-md border border-rose-300">
                                Lựa chọn của em
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs sm:text-sm text-slate-800">
                      <p className="font-bold text-indigo-900 mb-1">💡 Lời giải của Gia sư AI:</p>
                      <p>{q.explanation}</p>
                      {q.textbookQuote && (
                        <p className="mt-1 text-xs text-indigo-900 font-medium">
                          <strong>Ghi nhớ SGK: </strong>{q.textbookQuote}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={onRetrySameQuiz}
          className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm flex items-center gap-2 shadow-xs transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Làm lại đề này</span>
        </button>

        <button
          onClick={onNewQuiz}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-extrabold text-sm flex items-center gap-2 shadow-md transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>TẠO ĐỀ ÔN TẬP MỚI</span>
        </button>

        <button
          onClick={onOpenAITutor}
          className="px-6 py-3.5 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 font-bold text-sm flex items-center gap-2 transition-all"
        >
          <span>Hỏi đáp cùng Gia sư AI</span>
        </button>
      </div>
    </div>
  );
};
