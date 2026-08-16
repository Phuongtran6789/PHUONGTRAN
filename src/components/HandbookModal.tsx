import React, { useState } from 'react';
import { GRAMMAR_HANDBOOK, FOREIGN_NAMES } from '../data/grammarHandbook';
import { 
  BookOpen, 
  X, 
  Search, 
  Globe, 
  PenTool, 
  Bookmark, 
  FileText,
  Sparkles,
  Layers
} from 'lucide-react';

interface HandbookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HandbookModal: React.FC<HandbookModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'grammar' | 'foreign_names' | 'writing'>('grammar');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredForeignNames = FOREIGN_NAMES.filter((item) =>
    item.vietnamese.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.original.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl h-[85vh] max-h-[750px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-orange-500 p-4 sm:p-5 text-white flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 p-1 flex items-center justify-center backdrop-blur-xs">
              <BookOpen className="w-6 h-6 text-yellow-200" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                SỔ TAY TRA CỨU TIẾNG VIỆT 4
              </h3>
              <p className="text-xs text-sky-100 font-medium">
                Kiến thức chuẩn SGK Tiếng Việt 4 Tập 2 (Bộ Kết nối tri thức)
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 p-3 bg-slate-100 border-b border-slate-200 overflow-x-auto scrollbar-none shrink-0">
          <button
            onClick={() => setActiveTab('grammar')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'grammar'
                ? 'bg-white text-sky-700 shadow-xs border border-sky-200'
                : 'text-slate-600 hover:bg-white/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Ngữ pháp & Dấu câu</span>
          </button>

          <button
            onClick={() => setActiveTab('foreign_names')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'foreign_names'
                ? 'bg-white text-orange-700 shadow-xs border border-orange-200'
                : 'text-slate-600 hover:bg-white/60'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Bảng tra cứu Tên riêng nước ngoài (Trang 143)</span>
          </button>

          <button
            onClick={() => setActiveTab('writing')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'writing'
                ? 'bg-white text-sky-800 shadow-xs border border-sky-200'
                : 'text-slate-600 hover:bg-white/60'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>Cẩm nang Tập làm văn</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          {/* Tab 1: Grammar */}
          {activeTab === 'grammar' && (
            <div className="space-y-5">
              {GRAMMAR_HANDBOOK.slice(0, 4).map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="font-extrabold text-base text-indigo-900 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">
                        {idx + 1}
                      </span>
                      {item.title}
                    </h4>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      SGK Trang {item.page}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-slate-700 mb-3 leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs sm:text-sm text-slate-800">
                    {item.points.map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Foreign Names */}
          {activeTab === 'foreign_names' && (
            <div>
              {/* Search bar */}
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm tên riêng (Ví dụ: Pa-ri, Eiffel, Magellan, Tan-da-ni-a...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredForeignNames.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 shadow-2xs transition-all"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-extrabold text-sm text-amber-900">
                        {item.vietnamese}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {item.original}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-snug">{item.description}</p>
                    <span className="text-[10px] text-slate-400 font-medium mt-1 inline-block">
                      Xuất hiện: Trang {item.page}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Writing guides */}
          {activeTab === 'writing' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
                <h4 className="font-bold text-base text-rose-900 mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center text-xs">
                    1
                  </span>
                  Bài văn Miêu tả Cây cối (Trọng tâm học kì II)
                </h4>
                <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                  <p><strong>• Mở bài:</strong> Có 2 cách: <em>Mở bài trực tiếp</em> (giới thiệu ngay cây định tả) hoặc <em>Mở bài gián tiếp</em> (dẫn dắt từ mảnh vườn, cảm xúc rồi mới giới thiệu cây).</p>
                  <p><strong>• Thân bài:</strong> Có 2 trình tự tả: <em>Tả từng bộ phận</em> (gốc, thân, cành, lá, hoa, quả) hoặc <em>Tả theo thời kì phát triển</em> (từ lúc đâm chồi, ra hoa đến lúc thu hoạch quả chín).</p>
                  <p><strong>• Kết bài:</strong> Có 2 cách: <em>Kết bài không mở rộng</em> (nêu cảm nghĩ trực tiếp) hoặc <em>Kết bài mở rộng</em> (liên hệ công chăm sóc, ý thức bảo vệ cây).</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
                <h4 className="font-bold text-base text-rose-900 mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center text-xs">
                    2
                  </span>
                  Viết Thư điện tử (Email) & Giấy mời
                </h4>
                <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                  <p><strong>• Thư điện tử (Email):</strong> Gồm 3 bước: 1. Đặt dòng Chủ đề ngắn gọn, rõ nghĩa; 2. Viết nội dung thư ngắn gọn, đính kèm tệp (ảnh, video); 3. Soát lỗi và bấm Gửi.</p>
                  <p><strong>• Giấy mời:</strong> Gồm 7 mục: Tiêu đề, Người mời, Người được mời, Sự kiện mời, Thời gian, Địa điểm, Chữ kí đại diện.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
