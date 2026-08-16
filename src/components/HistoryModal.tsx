import React, { useState, useEffect } from 'react';
import { 
  History, 
  X, 
  FileSpreadsheet, 
  Trash2, 
  Trophy, 
  Calendar, 
  User, 
  Award, 
  Clock, 
  CheckCircle2, 
  Search,
  Filter,
  BarChart3,
  Download
} from 'lucide-react';
import { 
  QuizHistoryItem, 
  getQuizHistory, 
  deleteHistoryItem, 
  clearQuizHistory, 
  exportHistoryToExcel 
} from '../utils/historyStorage';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState<QuizHistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRank, setFilterRank] = useState<string>('all');

  useEffect(() => {
    if (isOpen) {
      setHistory(getQuizHistory());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Em/Thầy cô có chắc chắn muốn xóa bản ghi bài làm này không?')) {
      const updated = deleteHistoryItem(id);
      setHistory(updated);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Cảnh báo: Thao tác này sẽ xóa toàn bộ lịch sử làm bài. Bạn có chắc chắn muốn tiếp tục?')) {
      clearQuizHistory();
      setHistory([]);
    }
  };

  const handleExportExcel = () => {
    exportHistoryToExcel(history);
  };

  // Filtering
  const filteredHistory = history.filter(item => {
    const matchesSearch = 
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.studentClass.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lessonTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.certificateId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRank = filterRank === 'all' || item.gradeEvaluation.toLowerCase().includes(filterRank.toLowerCase());

    return matchesSearch && matchesRank;
  });

  // Calculate quick stats
  const totalAttempts = history.length;
  const avgScore = totalAttempts > 0 
    ? (history.reduce((sum, item) => sum + item.scoreTenScale, 0) / totalAttempts).toFixed(1)
    : '0';
  const xuatSacCount = history.filter(i => i.percentage >= 90).length;
  const hoanThanhTotCount = history.filter(i => i.percentage >= 70 && i.percentage < 90).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl h-[90vh] max-h-[800px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-orange-500 p-4 sm:p-5 text-white flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 p-1 flex items-center justify-center backdrop-blur-xs">
              <History className="w-6 h-6 text-yellow-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                  LỊCH SỬ LÀM BÀI & BẢNG ĐIỂM
                </h3>
                <span className="bg-white/20 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  {history.length} lượt thi
                </span>
              </div>
              <p className="text-xs text-sky-100 font-medium">
                Theo dõi tiến độ ôn tập Tiếng Việt 4 • Xuất dữ liệu báo cáo Excel
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Strip & Action Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 shrink-0 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500">Tổng số lượt làm</span>
              <div className="text-lg font-black text-sky-700">{totalAttempts} lượt</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500">Điểm trung bình</span>
              <div className="text-lg font-black text-orange-600">{avgScore} / 10</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500">Đạt Xuất Sắc (≥90%)</span>
              <div className="text-lg font-black text-amber-600">{xuatSacCount} lượt</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500">Hoàn Thành Tốt (70-89%)</span>
              <div className="text-lg font-black text-emerald-600">{hoanThanhTotCount} lượt</div>
            </div>
          </div>

          {/* Search, Filter & Export Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm tên học sinh, lớp, bài học, mã chứng nhận..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-sky-200"
                />
              </div>

              <select
                value={filterRank}
                onChange={e => setFilterRank(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
              >
                <option value="all">Tất cả xếp loại</option>
                <option value="xuất sắc">Xuất sắc</option>
                <option value="hoàn thành tốt">Hoàn thành tốt</option>
                <option value="hoàn thành">Hoàn thành</option>
                <option value="chưa hoàn thành">Chưa hoàn thành</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportExcel}
                disabled={history.length === 0}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
                title="Tải bảng điểm và lịch sử ra file Excel .xlsx"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-100" />
                <span>Xuất file Excel (.xlsx)</span>
              </button>

              {history.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-xl border border-slate-200 transition-all text-xs font-semibold"
                  title="Xóa toàn bộ lịch sử"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Table / List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-3">
                <History className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-800">Chưa có lịch sử làm bài</h4>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                Khi học sinh hoàn thành các bài trắc nghiệm ôn tập Tiếng Việt 4, kết quả điểm số và xếp loại sẽ tự động lưu lại tại đây.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredHistory.map((item, index) => {
                const isXuatSac = item.percentage >= 90;
                const isHoanThanhTot = item.percentage >= 70 && item.percentage < 90;
                const isHoanThanh = item.percentage >= 50 && item.percentage < 70;

                const badgeBg = isXuatSac 
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : isHoanThanhTot
                  ? 'bg-sky-100 text-sky-900 border-sky-300'
                  : isHoanThanh
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-orange-100 text-orange-900 border-orange-300';

                return (
                  <div
                    key={item.id || index}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          <User className="w-4 h-4 text-sky-600" />
                          {item.studentName}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          Lớp {item.studentClass}
                        </span>
                        <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${badgeBg}`}>
                          {item.gradeEvaluation}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 font-medium">
                        <strong>Nội dung:</strong> {item.lessonTitle}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {item.timestamp}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {Math.floor(item.timeElapsedSeconds / 60)}p {item.timeElapsedSeconds % 60}s
                        </span>
                        <span className="font-mono text-slate-400 text-[10px]">
                          ID: {item.certificateId}
                        </span>
                      </div>
                    </div>

                    {/* Scores and Actions */}
                    <div className="flex items-center gap-4 self-end sm:self-center">
                      <div className="text-right">
                        <div className="text-xl font-black text-sky-900">
                          {item.scoreTenScale} <span className="text-xs font-normal text-slate-400">/ 10</span>
                        </div>
                        <div className="text-xs font-bold text-emerald-600">
                          Đúng {item.correctCount}/{item.totalQuestions} ({item.percentage}%)
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                        title="Xóa mục này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0 text-xs text-slate-500">
          <span>Hệ thống tự động lưu trữ tối đa 100 bài làm gần nhất trên trình duyệt.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 font-bold text-slate-800 rounded-xl transition-all"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
