import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../types';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  BookOpen, 
  Lightbulb, 
  HelpCircle, 
  GraduationCap 
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

interface AITutorChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
  studentClass?: string;
  focusedQuestion?: Question | null;
}

const PRESET_TOPICS = [
  'Làm sao phân biệt 5 loại Trạng ngữ?',
  'Cách xác định Chủ ngữ và Vị ngữ?',
  'Khi nào dùng dấu ngoặc kép, ngoặc đơn, gạch ngang?',
  'Hướng dẫn cách viết mở bài gián tiếp tả cây cối',
  'Quy tắc viết hoa tên cơ quan, tổ chức',
];

export const AITutorChatModal: React.FC<AITutorChatModalProps> = ({
  isOpen,
  onClose,
  studentName,
  studentClass,
  focusedQuestion,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize conversation
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = focusedQuestion
        ? `Chào em ${studentName || 'học sinh thân yêu'}! Cô là Gia sư Tiếng Việt Lớp 4 (Trần Thị Phượng - AI). Cô thấy em đang quan tâm đến bài học "${focusedQuestion.lessonTitle}". Em muốn cô giảng giải thêm phần nào của câu hỏi này?`
        : `Chào em ${studentName || 'học sinh thân mến'}! Cô là Gia sư Tiếng Việt Lớp 4 (Trần Thị Phượng - AI). Em có câu hỏi hay phần kiến thức ngữ pháp, tập làm văn nào trong sách Tiếng Việt 4 Tập 2 cần cô hỗ trợ không?`;

      setMessages([
        {
          id: '1',
          sender: 'ai',
          text: greeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [isOpen, studentName, focusedQuestion, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSendMessage = async (customText?: string) => {
    const text = (customText || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/ask-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          studentName,
          studentClass,
          currentQuestion: focusedQuestion,
          context: 'Sách giáo khoa Tiếng Việt 4 Tập 2 - Bộ Kết nối tri thức với cuộc sống',
        }),
      });

      const data = await response.json();
      const reply = data.reply || 'Em hãy đọc kĩ lại bài đọc và phần Ghi nhớ trong sách giáo khoa nhé!';

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error(err);
      // Smart offline fallback
      let fallbackReply = `Chào em ${studentName || ''}! Cô hướng dẫn em: Hãy nhớ nắm chắc quy tắc trong phần Ghi nhớ SGK. Ví dụ với Trạng ngữ: Trả lời 'Khi nào?' là thời gian, 'Ở đâu?' là nơi chốn, 'Vì sao?' là nguyên nhân, 'Để làm gì?' là mục đích, 'Bằng gì?' là phương tiện!`;
      
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl h-[85vh] max-h-[700px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-orange-500 p-4 sm:p-5 text-white flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 p-1 flex items-center justify-center backdrop-blur-xs">
              <GraduationCap className="w-6 h-6 text-yellow-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                  GIA SƯ TIẾNG VIỆT 4 (AI)
                </h3>
                <span className="bg-yellow-400/20 text-yellow-100 text-[10px] font-bold px-2 py-0.5 rounded-full border border-yellow-300/30">
                  Online
                </span>
              </div>
              <p className="text-xs text-sky-100 font-medium">
                Tác giả: Trần Thị Phượng - AI • Hỗ trợ học sinh 24/7
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Focused Question Banner (if any) */}
        {focusedQuestion && (
          <div className="bg-sky-50/90 border-b border-sky-100 p-3 px-4 text-xs flex items-center justify-between gap-2 text-sky-950 shrink-0">
            <div className="flex items-center gap-2 truncate">
              <BookOpen className="w-4 h-4 text-sky-600 shrink-0" />
              <span className="font-bold truncate">{focusedQuestion.lessonTitle}:</span>
              <span className="truncate text-slate-600">{focusedQuestion.question}</span>
            </div>
          </div>
        )}

        {/* Chat Message List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isAI = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${isAI ? 'justify-start' : 'justify-end'}`}
              >
                {isAI && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                    isAI
                      ? 'bg-white border border-slate-200 text-slate-800 shadow-2xs rounded-tl-sm'
                      : 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-xs rounded-tr-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span
                    className={`text-[10px] mt-1.5 block text-right font-medium ${
                      isAI ? 'text-slate-400' : 'text-sky-200'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {!isAI && (
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-sky-700 font-bold bg-white p-3 rounded-2xl border border-sky-100 w-max shadow-2xs">
              <Sparkles className="w-4 h-4 animate-spin text-orange-500" />
              <span>Gia sư AI đang soạn câu trả lời cho em...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-white border-t border-slate-100 overflow-x-auto flex items-center gap-1.5 scrollbar-none shrink-0">
          <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap pl-1">
            Gợi ý hỏi:
          </span>
          {PRESET_TOPICS.map((topic, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(topic)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-600 text-xs font-semibold whitespace-nowrap border border-slate-200 transition-all"
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
          <input
            type="text"
            placeholder="Hỏi Gia sư Tiếng Việt bất kì câu hỏi nào..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="flex-1 px-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-sm text-slate-800 focus:outline-hidden focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all font-medium"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className={`p-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold transition-all ${
              !inputText.trim() || isLoading
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:from-orange-600 hover:to-amber-600 active:scale-95 shadow-md'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
