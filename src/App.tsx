import React, { useState } from 'react';
import { QuizConfig, QuizResult, Question } from './types';
import { QUESTIONS_BANK } from './data/questions';
import { LESSONS } from './data/lessons';
import { Header } from './components/Header';
import { QuizSetup } from './components/QuizSetup';
import { QuizEngine } from './components/QuizEngine';
import { QuizSummary } from './components/QuizSummary';
import { AITutorChatModal } from './components/AITutorChatModal';
import { HandbookModal } from './components/HandbookModal';
import { HistoryModal } from './components/HistoryModal';
import { saveQuizToHistory } from './utils/historyStorage';

export default function App() {
  const [appState, setAppState] = useState<'setup' | 'quiz' | 'summary'>('setup');
  const [activeConfig, setActiveConfig] = useState<QuizConfig | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [lastResult, setLastResult] = useState<QuizResult | null>(null);

  // Modals & UI States
  const [isHandbookOpen, setIsHandbookOpen] = useState<boolean>(false);
  const [isAITutorOpen, setIsAITutorOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [focusedQuestion, setFocusedQuestion] = useState<Question | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Generate question set based on user configuration
  const handleStartQuiz = (config: QuizConfig) => {
    setActiveConfig(config);

    // 1. Primary filter: Exact match for lesson & difficulty
    let exactMatches = QUESTIONS_BANK.filter((q) => {
      // Lesson filter
      if (config.selectedLessonId !== 'all') {
        if (typeof config.selectedLessonId === 'number') {
          if (q.lessonId !== config.selectedLessonId) return false;
        } else if (config.selectedLessonId === 'theme1') {
          if (q.themeId !== 'theme1') return false;
        } else if (config.selectedLessonId === 'theme2') {
          if (q.themeId !== 'theme2') return false;
        } else if (config.selectedLessonId === 'theme3') {
          if (q.themeId !== 'theme3') return false;
        } else if (config.selectedLessonId === 'theme4') {
          if (q.themeId !== 'theme4') return false;
        } else if (config.selectedLessonId === 'midterm') {
          if (q.lessonId !== 99 && q.lessonId > 16) return false;
        } else if (config.selectedLessonId === 'final') {
          if (q.lessonId !== 100) return false;
        }
      }

      // Difficulty filter
      if (config.difficulty !== 'all') {
        if (q.difficulty !== config.difficulty) return false;
      }

      return true;
    });

    let selectedSet: Question[] = [...exactMatches];

    // 2. If not enough questions, relax difficulty for the same lesson
    if (selectedSet.length < config.questionCount && typeof config.selectedLessonId === 'number') {
      const sameLessonOtherDiff = QUESTIONS_BANK.filter(
        (q) => q.lessonId === config.selectedLessonId && !selectedSet.some((s) => s.id === q.id)
      );
      selectedSet = [...selectedSet, ...sameLessonOtherDiff];
    }

    // 3. If still not enough, take questions from the same theme
    if (selectedSet.length < config.questionCount) {
      let targetTheme = '';
      if (typeof config.selectedLessonId === 'number') {
        const matchingQ = QUESTIONS_BANK.find((q) => q.lessonId === config.selectedLessonId);
        targetTheme = matchingQ?.themeId || '';
      } else if (typeof config.selectedLessonId === 'string' && config.selectedLessonId.startsWith('theme')) {
        targetTheme = config.selectedLessonId;
      }

      if (targetTheme) {
        const sameThemeQs = QUESTIONS_BANK.filter(
          (q) => q.themeId === targetTheme && !selectedSet.some((s) => s.id === q.id)
        );
        selectedSet = [...selectedSet, ...sameThemeQs];
      }
    }

    // 4. If still not enough, supplement from entire bank
    if (selectedSet.length < config.questionCount) {
      const remainingNeeded = config.questionCount - selectedSet.length;
      const additional = QUESTIONS_BANK.filter(
        (q) => !selectedSet.some((s) => s.id === q.id)
      ).slice(0, remainingNeeded);
      selectedSet = [...selectedSet, ...additional];
    }

    // 5. If bank itself has fewer unique items than requested (e.g. edge case), duplicate to fulfill
    while (selectedSet.length < config.questionCount && QUESTIONS_BANK.length > 0) {
      const clone = { ...QUESTIONS_BANK[selectedSet.length % QUESTIONS_BANK.length], id: `q_extra_${Date.now()}_${selectedSet.length}` };
      selectedSet.push(clone);
    }

    // Shuffle and cap at questionCount
    const shuffled = [...selectedSet].sort(() => 0.5 - Math.random());
    const finalSet = shuffled.slice(0, config.questionCount);

    setActiveQuestions(finalSet);
    setAppState('quiz');
  };

  const handleFinishQuiz = (result: QuizResult) => {
    // Determine lesson title description
    let lessonTitleDesc = 'Ôn tập tổng hợp Tiếng Việt 4';
    if (activeConfig?.selectedLessonId === 'theme1') lessonTitleDesc = 'Chủ điểm 1: Sống để yêu thương (Tuần 19-23)';
    else if (activeConfig?.selectedLessonId === 'theme2') lessonTitleDesc = 'Chủ điểm 2: Uống nước nhớ nguồn (Tuần 24-27)';
    else if (activeConfig?.selectedLessonId === 'theme3') lessonTitleDesc = 'Chủ điểm 3: Quê hương trong tôi (Tuần 29-31)';
    else if (activeConfig?.selectedLessonId === 'theme4') lessonTitleDesc = 'Chủ điểm 4: Vì một thế giới bình yên (Tuần 32-35)';
    else if (activeConfig?.selectedLessonId === 'midterm') lessonTitleDesc = 'Đề thi Ôn tập Giữa học kì 2';
    else if (activeConfig?.selectedLessonId === 'final') lessonTitleDesc = 'Đề thi Ôn tập Cuối học kì 2';
    else if (typeof activeConfig?.selectedLessonId === 'number') {
      const matchedLesson = LESSONS.find(l => l.id === activeConfig.selectedLessonId);
      if (matchedLesson) lessonTitleDesc = `Bài ${matchedLesson.id}: ${matchedLesson.title}`;
    }

    // Automatically save attempt to local storage history
    saveQuizToHistory(result, lessonTitleDesc);

    setLastResult(result);
    setAppState('summary');
  };

  const handleRetrySameQuiz = () => {
    if (activeQuestions.length > 0) {
      setAppState('quiz');
    }
  };

  const handleNewQuiz = () => {
    setAppState('setup');
  };

  const handleOpenAITutorWithQuestion = (q: Question) => {
    setFocusedQuestion(q);
    setIsAITutorOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Global App Header */}
      <Header
        onOpenHandbook={() => setIsHandbookOpen(true)}
        onOpenAITutor={() => {
          setFocusedQuestion(null);
          setIsAITutorOpen(true);
        }}
        onOpenHistory={() => setIsHistoryOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onResetToHome={() => setAppState('setup')}
        studentName={activeConfig?.studentName}
        studentClass={activeConfig?.studentClass}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-start">
        {appState === 'setup' && (
          <QuizSetup
            onStartQuiz={handleStartQuiz}
            availableTotalQuestions={QUESTIONS_BANK.length}
            onOpenHistory={() => setIsHistoryOpen(true)}
          />
        )}

        {appState === 'quiz' && activeConfig && (
          <QuizEngine
            questions={activeQuestions}
            config={activeConfig}
            onFinishQuiz={handleFinishQuiz}
            onExit={() => setAppState('setup')}
            onOpenAITutorWithQuestion={handleOpenAITutorWithQuestion}
            soundEnabled={soundEnabled}
          />
        )}

        {appState === 'summary' && lastResult && (
          <QuizSummary
            result={lastResult}
            onRetrySameQuiz={handleRetrySameQuiz}
            onNewQuiz={handleNewQuiz}
            onOpenAITutor={() => {
              setFocusedQuestion(null);
              setIsAITutorOpen(true);
            }}
            onOpenHistory={() => setIsHistoryOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-sky-100 bg-white/80 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            <strong>GIA SƯ TIẾNG VIỆT LỚP 4</strong> • Sách Kết nối tri thức với cuộc sống (Tập 2)
          </p>
          <p>
            Biên soạn & Phát triển: <span className="font-bold text-sky-800">Trần Thị Phượng - AI</span>
          </p>
        </div>
      </footer>

      {/* Modals */}
      <AITutorChatModal
        isOpen={isAITutorOpen}
        onClose={() => setIsAITutorOpen(false)}
        studentName={activeConfig?.studentName}
        studentClass={activeConfig?.studentClass}
        focusedQuestion={focusedQuestion}
      />

      <HandbookModal
        isOpen={isHandbookOpen}
        onClose={() => setIsHandbookOpen(false)}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
}

