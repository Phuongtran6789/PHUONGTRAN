import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Question, QuizConfig, UserAnswer, QuizResult } from '../types';
import { soundFx } from '../utils/audio';
import { 
  Volume2, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  BookOpen, 
  Clock, 
  Layers, 
  Check, 
  Send, 
  RotateCcw,
  Lightbulb,
  Flag,
  HeartHandshake,
  Award
} from 'lucide-react';

interface QuizEngineProps {
  questions: Question[];
  config: QuizConfig;
  onFinishQuiz: (result: QuizResult) => void;
  onExit: () => void;
  onOpenAITutorWithQuestion: (question: Question) => void;
  soundEnabled: boolean;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({
  questions,
  config,
  onFinishQuiz,
  onExit,
  onOpenAITutorWithQuestion,
  soundEnabled,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Map<string, number>>(new Map());
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [showFinishConfirm, setShowFinishConfirm] = useState<boolean>(false);
  const [isReadingAloud, setIsReadingAloud] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Timer loop
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const currentQ = questions[currentIndex];
  const currentAnswer = userAnswers.get(currentQ?.id);
  const hasAnsweredCurrent = currentAnswer !== undefined;

  // Speech synthesis for primary school students
  const readQuestionAloud = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (isReadingAloud) {
      setIsReadingAloud(false);
      return;
    }

    const textToRead = `${currentQ.passage ? `Đoạn trích: ${currentQ.passage}. ` : ''} Câu hỏi: ${currentQ.question}. Các phương án trả lời: ${currentQ.options.map((opt, i) => `Phương án ${String.fromCharCode(65 + i)}: ${opt}`).join('. ')}`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.95;

    utterance.onend = () => setIsReadingAloud(false);
    utterance.onerror = () => setIsReadingAloud(false);

    setIsReadingAloud(true);
    window.speechSynthesis.speak(utterance);
  };

  // Stop audio on question change
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsReadingAloud(false);
    }
    setShowExplanation(config.mode === 'practice' && userAnswers.has(currentQ?.id));
  }, [currentIndex, currentQ, config.mode, userAnswers]);

  const handleSelectOption = (optionIndex: number) => {
    const isFirstTime = !userAnswers.has(currentQ.id);
    const newAnswers = new Map(userAnswers);
    newAnswers.set(currentQ.id, optionIndex);
    setUserAnswers(newAnswers);

    const isCorrect = optionIndex === currentQ.correctIndex;

    // Trigger sound effect
    if (soundEnabled) {
      if (isCorrect) {
        soundFx.playMajesticSuccess();
      } else {
        soundFx.playEncouragingGentle();
      }
    }

    // Trigger celebratory confetti fireworks on correct answer
    if (isCorrect) {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#0284c7', '#ea580c', '#38bdf8', '#fb923c', '#facc15', '#ec4899', '#22c55e'],
      });
      setTimeout(() => {
        confetti({
          particleCount: 45,
          angle: 60,
          spread: 60,
          origin: { x: 0.1, y: 0.7 },
          colors: ['#0284c7', '#f97316', '#38bdf8', '#facc15'],
        });
        confetti({
          particleCount: 45,
          angle: 120,
          spread: 60,
          origin: { x: 0.9, y: 0.7 },
          colors: ['#0284c7', '#f97316', '#38bdf8', '#facc15'],
        });
      }, 150);
    }

    if (config.mode === 'practice') {
      setShowExplanation(true);
    }
  };

  const toggleFlag = (qId: string) => {
    const newFlags = new Set(flaggedQuestions);
    if (newFlags.has(qId)) {
      newFlags.delete(qId);
    } else {
      newFlags.add(qId);
    }
    setFlaggedQuestions(newFlags);
  };

  const handleFinalSubmit = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    const answersList: UserAnswer[] = questions.map((q) => {
      const selected = userAnswers.get(q.id) ?? null;
      return {
        questionId: q.id,
        selectedIndex: selected,
        isCorrect: selected === q.correctIndex,
        timeSpentSeconds: 0,
      };
    });

    const correctCount = answersList.filter((a) => a.isCorrect).length;
    const unansweredCount = answersList.filter((a) => a.selectedIndex === null).length;
    const incorrectCount = questions.length - correctCount - unansweredCount;
    const scoreTenScale = Number(((correctCount / questions.length) * 10).toFixed(1));
    const percentage = Math.round((correctCount / questions.length) * 100);

    let gradeEvaluation = 'HOÀN THÀNH';
    let tutorComment = 'Em đã hoàn thành bài ôn tập Tiếng Việt 4!';
    if (percentage >= 90) {
      gradeEvaluation = 'XUẤT SẮC';
      tutorComment = 'Khen ngợi đặc biệt: Em đạt danh hiệu XUẤT SẮC! Kiến thức Tiếng Việt 4 của em rất vững vàng, vốn từ phong phú và tư duy ngôn ngữ vô cùng nhạy bén!';
    } else if (percentage >= 70) {
      gradeEvaluation = 'HOÀN THÀNH TỐT';
      tutorComment = 'Chúc mừng em đạt danh hiệu HOÀN THÀNH TỐT! Em đã nắm rất chắc các bài học trọng tâm, hãy tiếp tục phát huy để chạm mốc Xuất Sắc nhé!';
    } else if (percentage >= 50) {
      gradeEvaluation = 'HOÀN THÀNH';
      tutorComment = 'Chúc mừng em đã HOÀN THÀNH bài ôn tập! Hãy đọc kĩ thêm phần Sổ tay SGK và nhờ Gia sư AI giải thích các câu còn sai để tiến bộ vượt bậc nhé!';
    } else {
      gradeEvaluation = 'CHƯA HOÀN THÀNH';
      tutorComment = 'Em đừng nản lòng nhé! Hãy mở Sổ tay SGK đọc lại phần Ghi nhớ, sau đó luyện tập thêm cùng Gia sư AI cô Phượng để bứt phá ở lần thi tới!';
    }

    const result: QuizResult = {
      studentName: config.studentName,
      studentClass: config.studentClass,
      totalQuestions: questions.length,
      correctCount,
      incorrectCount,
      unansweredCount,
      scoreTenScale,
      percentage,
      gradeEvaluation,
      tutorComment,
      timeElapsedSeconds: timeElapsed,
      answers: answersList,
      questions,
      timestamp: new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      certificateId: `TV4-${Date.now().toString().slice(-6)}`,
    };

    onFinishQuiz(result);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = userAnswers.size;
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="w-full max-w-5xl mx-auto py-4 px-4 sm:px-6">
      {/* Top Meta Bar */}
      <div className="bg-white rounded-2xl p-4 border border-sky-100 shadow-xs mb-5 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Student & Lesson Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-sky-50 transition-colors"
            title="Thoát về trang chủ"
          >
            <ArrowLeft className="w-5 h-5 text-sky-700" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 text-sm sm:text-base">
                {config.studentName}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 text-xs font-semibold border border-sky-200">
                {config.studentClass}
              </span>
              <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                config.mode === 'practice' 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-orange-50 text-orange-700 border border-orange-200'
              }`}>
                {config.mode === 'practice' ? 'Chế độ: Luyện tập' : 'Chế độ: Thi thử'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
              {currentQ.lessonTitle} • {currentQ.themeTitle}
            </p>
          </div>
        </div>

        {/* Right: Progress & Timer */}
        <div className="flex items-center gap-4 ml-auto">
          <div className="flex items-center gap-2 bg-sky-50/70 px-3 py-1.5 rounded-xl border border-sky-200 text-sky-900 font-bold text-sm">
            <Clock className="w-4 h-4 text-sky-600" />
            <span>{formatTimer(timeElapsed)}</span>
          </div>

          <button
            onClick={() => setShowFinishConfirm(true)}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Nộp bài</span>
          </button>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-slate-100 h-2.5 rounded-full mb-5 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-sky-500 via-blue-600 to-orange-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm mb-5">
        {/* Question Header Tags */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-sky-600 text-white font-extrabold text-xs shadow-xs">
              Câu {currentIndex + 1} / {questions.length}
            </span>

            {/* Difficulty badge */}
            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${
              currentQ.difficulty === 'nhan_biet'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : currentQ.difficulty === 'thong_hieu'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              {currentQ.difficultyLabel}
            </span>

            {/* Category badge */}
            <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
              {currentQ.categoryLabel}
            </span>

            {currentQ.pageReference && (
              <span className="text-xs text-slate-400 font-medium">
                (SGK Trang {currentQ.pageReference})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Reader Button */}
            <button
              onClick={readQuestionAloud}
              className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
                isReadingAloud
                  ? 'bg-indigo-600 text-white border-indigo-600 animate-pulse'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
              title="Đọc to câu hỏi bằng giọng đọc tiếng Việt"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isReadingAloud ? 'Đang đọc...' : 'Đọc câu hỏi'}
              </span>
            </button>

            {/* Flag button */}
            <button
              onClick={() => toggleFlag(currentQ.id)}
              className={`p-2 rounded-xl border transition-all ${
                flaggedQuestions.has(currentQ.id)
                  ? 'bg-amber-50 border-amber-300 text-amber-600'
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
              }`}
              title="Đánh dấu câu hỏi cần xem lại"
            >
              <Flag className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>

        {/* Passage (if any) */}
        {currentQ.passage && (
          <div className="bg-amber-50/60 border-l-4 border-amber-400 p-4 rounded-r-2xl mb-5 text-slate-800 text-sm sm:text-base leading-relaxed italic">
            <p className="whitespace-pre-line font-medium">"{currentQ.passage}"</p>
            {currentQ.passageAuthor && (
              <p className="text-right text-xs font-bold text-amber-900 mt-2">
                — {currentQ.passageAuthor}
              </p>
            )}
          </div>
        )}

        {/* Question Text */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-6">
          {currentQ.question}
        </h3>

        {/* Options List */}
        <div className="space-y-3 mb-6">
          {currentQ.options.map((option, idx) => {
            const isSelected = currentAnswer === idx;
            const isCorrectOption = idx === currentQ.correctIndex;
            const isPractice = config.mode === 'practice';

            let optionStyle = 'bg-slate-50/80 border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-800';

            if (isSelected) {
              optionStyle = 'bg-indigo-50 border-indigo-500 text-indigo-900 ring-2 ring-indigo-200 font-semibold';
            }

            // If in practice mode and answered, reveal color
            if (isPractice && hasAnsweredCurrent) {
              if (isCorrectOption) {
                optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-200 font-semibold';
              } else if (isSelected && !isCorrectOption) {
                optionStyle = 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-200 font-semibold';
              }
            }

            const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 group relative ${optionStyle}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-extrabold text-sm border transition-all ${
                  isPractice && hasAnsweredCurrent && isCorrectOption
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : isPractice && hasAnsweredCurrent && isSelected && !isCorrectOption
                    ? 'bg-rose-600 text-white border-rose-600'
                    : isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-slate-700 border-slate-300 group-hover:border-indigo-300'
                }`}>
                  {isPractice && hasAnsweredCurrent && isCorrectOption ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : isPractice && hasAnsweredCurrent && isSelected && !isCorrectOption ? (
                    <XCircle className="w-5 h-5" />
                  ) : (
                    optionLetter
                  )}
                </div>

                <div className="flex-1 pt-1 text-sm sm:text-base leading-relaxed">
                  {option}
                </div>
              </button>
            );
          })}
        </div>

        {/* Practice Mode Feedback Banner (Correct / Incorrect Encouragement) */}
        {config.mode === 'practice' && showExplanation && hasAnsweredCurrent && (
          <div className="mt-6 space-y-4">
            {/* Encouragement / Celebration Banner */}
            {currentAnswer === currentQ.correctIndex ? (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 text-white shadow-md flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-yellow-300 animate-spin" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base">Tuyệt vời! Em đã trả lời chính xác! 🎉</h4>
                  <p className="text-xs text-emerald-100 font-medium">
                    Xuất sắc lắm! Hãy đọc thêm lời giải bên dưới để khắc sâu kiến thức nhé.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-6 h-6 text-yellow-200" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base">Cố lên nhé em ơi! Đừng nản lòng nhé! 🌟</h4>
                  <p className="text-xs text-amber-100 font-medium">
                    Không sao cả, cùng cô Phượng đọc lại phần Ghi nhớ SGK bên dưới để chọn đúng ở các câu sau nhé!
                  </p>
                </div>
              </div>
            )}

            {/* Explanation Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-50 to-orange-50/50 border border-sky-200 text-slate-800 space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-orange-500" />
                  <h4 className="font-bold text-sm sm:text-base text-sky-950">
                    Lời giải chi tiết của Gia sư Tiếng Việt (Trần Thị Phượng - AI)
                  </h4>
                </div>
                <button
                  onClick={() => onOpenAITutorWithQuestion(currentQ)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-orange-200 text-orange-700 hover:bg-orange-50 text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                  <span>Hỏi thêm Gia sư AI</span>
                </button>
              </div>

              <p className="text-sm leading-relaxed text-slate-700 font-medium">
                {currentQ.explanation}
              </p>

              {currentQ.textbookQuote && (
                <div className="p-3 bg-white/90 rounded-xl border border-sky-100 text-xs text-sky-950 font-medium">
                  <span className="font-bold text-orange-700">📖 Trích dẫn SGK: </span>
                  {currentQ.textbookQuote}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <button
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 border transition-all ${
            currentIndex === 0
              ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200'
              : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200 shadow-2xs'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Câu trước</span>
        </button>

        {/* Quick Navigator Drawer Button */}
        <span className="text-xs sm:text-sm font-semibold text-slate-500">
          Đã làm: <strong className="text-sky-600">{answeredCount}</strong> / {questions.length} câu
        </span>

        {currentIndex < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold text-sm flex items-center gap-2 shadow-xs transition-all"
          >
            <span>Câu tiếp</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setShowFinishConfirm(true)}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-600 hover:from-orange-600 hover:to-emerald-700 text-white font-bold text-sm flex items-center gap-2 shadow-md transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Hoàn thành & Nộp bài</span>
          </button>
        )}
      </div>

      {/* Question Number Quick Jump Grid */}
      <div className="bg-white rounded-3xl p-5 border border-sky-100 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Danh sách câu hỏi
          </span>
          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-md bg-sky-600 inline-block" /> Đã làm
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-md bg-orange-400 inline-block" /> Đánh dấu
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-md bg-slate-100 border border-slate-300 inline-block" /> Chưa làm
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {questions.map((q, idx) => {
            const isAnswered = userAnswers.has(q.id);
            const isCurrent = idx === currentIndex;
            const isFlagged = flaggedQuestions.has(q.id);

            let btnStyle = 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200';

            if (isAnswered) {
              btnStyle = 'bg-sky-600 text-white border-sky-600 font-bold shadow-2xs';
            }
            if (isCurrent) {
              btnStyle += ' ring-2 ring-orange-500 ring-offset-2';
            }
            if (isFlagged) {
              btnStyle += ' ring-2 ring-orange-400';
            }

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-9 h-9 rounded-xl text-xs font-bold border transition-all flex items-center justify-center relative ${btnStyle}`}
              >
                {idx + 1}
                {isFlagged && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Finish Confirmation Modal */}
      {showFinishConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Xác nhận nộp bài?
            </h3>

            <p className="text-sm text-slate-600 mb-6">
              Em đã hoàn thành <strong className="text-indigo-600">{answeredCount}</strong> / {questions.length} câu hỏi.
              {questions.length - answeredCount > 0 && (
                <span className="block text-amber-600 font-semibold mt-1">
                  (Còn {questions.length - answeredCount} câu em chưa chọn đáp án)
                </span>
              )}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowFinishConfirm(false)}
                className="py-3 rounded-2xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all"
              >
                Tiếp tục làm bài
              </button>
              <button
                onClick={handleFinalSubmit}
                className="py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm shadow-md transition-all"
              >
                Nộp bài ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
