import React, { useRef, useState } from 'react';
import { QuizResult } from '../types';
import html2canvas from 'html2canvas';
import { 
  Award, 
  Sparkles, 
  Download, 
  Printer, 
  Star, 
  ShieldCheck,
  GraduationCap,
  Calendar,
  FileSpreadsheet
} from 'lucide-react';
import { exportHistoryToExcel, getQuizHistory } from '../utils/historyStorage';

interface Certificate16x9Props {
  result: QuizResult;
}

export const Certificate16x9: React.FC<Certificate16x9Props> = ({ result }) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Determine achievement tier based on percentage
  const percentage = result.percentage;
  const isXuatSac = percentage >= 90;
  const isHoanThanhTot = percentage >= 70 && percentage < 90;
  const isHoanThanh = percentage >= 50 && percentage < 70;
  const isChuaHoanThanh = percentage < 50;

  let rankTitle = 'XUẤT SẮC';
  let rankSub = 'Đạt thành tích học tập xuất sắc toàn diện môn Tiếng Việt 4';
  let badgeColor = 'bg-amber-600 text-white';
  let starCount = 5;
  let motivationalMessage = 'Em có tư duy ngôn ngữ tuyệt vời, nắm vững chắc kiến thức ngữ pháp, đọc hiểu và kỹ năng làm văn Tiếng Việt 4!';

  if (isHoanThanhTot) {
    rankTitle = 'HOÀN THÀNH TỐT';
    rankSub = 'Đạt kết quả học tập tốt và nắm vững các bài học trọng tâm';
    badgeColor = 'bg-sky-700 text-white';
    starCount = 4;
    motivationalMessage = 'Thành tích rất đáng khen! Em đã hoàn thành tốt các dạng bài tập, hãy tiếp tục rèn luyện để vươn tới mức Xuất sắc nhé!';
  } else if (isHoanThanh) {
    rankTitle = 'HOÀN THÀNH';
    rankSub = 'Đã hoàn thành các yêu cầu cần đạt của bài học ôn tập';
    badgeColor = 'bg-emerald-700 text-white';
    starCount = 3;
    motivationalMessage = 'Chúc mừng em đã hoàn thành bài ôn tập! Em hãy mở Sổ tay tra cứu SGK để củng cố thêm các phần ghi nhớ quan trọng nhé!';
  } else if (isChuaHoanThanh) {
    rankTitle = 'CHƯA HOÀN THÀNH';
    rankSub = 'Chứng nhận tinh thần nỗ lực rèn luyện & quyết tâm bứt phá';
    badgeColor = 'bg-orange-700 text-white';
    starCount = 2;
    motivationalMessage = 'Mỗi lần thử sức là một bước tiến! Em hãy mở Sổ tay SGK đọc lại bài và nhờ Gia sư AI cô Phượng hướng dẫn để tiến bộ vượt bậc nhé!';
  }

  const handleDownloadPNG = async () => {
    if (!certificateRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2.5, // High resolution crisp print quality
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      const safeName = (result.studentName || 'HocSinh').replace(/\s+/g, '_');
      link.download = `GiayKhen_TiengViet4_${safeName}_16x9.png`;
      link.click();
    } catch (err) {
      console.error('Lỗi khi xuất ảnh chứng nhận:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportAllExcel = () => {
    const history = getQuizHistory();
    exportHistoryToExcel(history);
  };

  return (
    <div className="space-y-4">
      {/* Control Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-sky-100 shadow-xs">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-orange-500" />
          <span className="text-sm font-bold text-slate-800">
            Giấy chứng nhận chuẩn tỉ lệ 16:9 • Phông chữ chuẩn quy định GD&ĐT
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadPNG}
            disabled={isExporting}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
            title="Lưu ảnh giấy khen sắc nét về máy"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Đang lưu ảnh...' : 'Tải ảnh Giấy khen (PNG 16:9)'}</span>
          </button>

          <button
            onClick={handleExportAllExcel}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            title="Tải bảng điểm và kết quả ra file Excel"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Tải file Excel (.xlsx)</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl border border-slate-200 transition-all flex items-center gap-1.5"
            title="In giấy khen"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">In giấy khen</span>
          </button>
        </div>
      </div>

      {/* 16:9 Certificate Frame Container */}
      <div className="w-full overflow-hidden rounded-3xl shadow-2xl border-4 border-amber-300/80 bg-gradient-to-b from-amber-50/40 via-white to-orange-50/30">
        <div 
          ref={certificateRef}
          id="certificate-16-9"
          className="w-full aspect-[16/9] min-h-[480px] relative p-6 sm:p-10 flex flex-col justify-between select-none overflow-hidden bg-white text-slate-900 font-edu-serif"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(254, 243, 199, 0.35) 0%, rgba(255, 255, 255, 1) 75%), 
              repeating-linear-gradient(45deg, rgba(217, 119, 6, 0.015) 0px, rgba(217, 119, 6, 0.015) 2px, transparent 2px, transparent 10px)`,
          }}
        >
          {/* Double Ornate Gold Outer Border */}
          <div className="absolute inset-2.5 sm:inset-3.5 border-[3px] border-amber-600 rounded-2xl pointer-events-none" />
          <div className="absolute inset-4 sm:inset-5 border border-dashed border-amber-500 rounded-xl pointer-events-none" />
          
          {/* Corner Rosettes */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 w-8 h-8 flex items-center justify-center text-amber-600 font-edu-serif text-xl sm:text-2xl select-none">
            ✦
          </div>
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 flex items-center justify-center text-amber-600 font-edu-serif text-xl sm:text-2xl select-none">
            ✦
          </div>
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 w-8 h-8 flex items-center justify-center text-amber-600 font-edu-serif text-xl sm:text-2xl select-none">
            ✦
          </div>
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-8 h-8 flex items-center justify-center text-amber-600 font-edu-serif text-xl sm:text-2xl select-none">
            ✦
          </div>

          {/* Top National & Academic Header (Ministry Format) */}
          <div className="relative z-10 text-center">
            {/* Quốc hiệu và Tiêu ngữ theo Nghị định 30/2020/NĐ-CP */}
            <div className="space-y-0.5 mb-1.5">
              <h4 className="text-[11px] sm:text-sm font-bold text-slate-800 uppercase tracking-wider font-edu-serif">
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </h4>
              <div className="inline-block">
                <p className="text-[10px] sm:text-xs font-semibold text-slate-700 font-edu-serif italic">
                  Độc lập - Tự do - Hạnh phúc
                </p>
                <div className="w-24 sm:w-32 h-[1px] bg-slate-500 mx-auto mt-0.5" />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 font-bold text-[9px] sm:text-[11px] uppercase tracking-wider font-edu-sans shadow-2xs">
              <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
              <span>BỘ SÁCH KẾT NỐI TRI THỨC VỚI CUỘC SỐNG • TIẾNG VIỆT 4 (TẬP HAI)</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-red-700 tracking-tight uppercase font-edu-serif mt-1 sm:mt-2">
              GIẤY CHỨNG NHẬN VINH DANH
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-600 font-medium italic font-edu-serif">
              Hệ thống Gia sư Thông minh môn Tiếng Việt Lớp 4 (Biên soạn: Trần Thị Phượng - AI)
            </p>
          </div>

          {/* Student Honor Body Section */}
          <div className="relative z-10 text-center my-auto py-1 sm:py-2">
            <p className="text-xs sm:text-sm text-slate-700 font-medium italic font-edu-serif">
              Trân trọng tuyên dương và khen tặng em:
            </p>
            
            <div className="my-1 sm:my-2 inline-block">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-sky-950 uppercase tracking-wide font-edu-serif px-6 py-1 bg-gradient-to-r from-transparent via-amber-100/70 to-transparent rounded-xl border-b-2 border-amber-500">
                {result.studentName || 'HỌC SINH TIỂU HỌC'}
              </h2>
              <p className="text-xs sm:text-base font-bold text-sky-800 mt-1 font-edu-serif">
                Học sinh Lớp: <span className="text-orange-700">{result.studentClass || '4'}</span> • Trường Tiểu học
              </p>
            </div>

            {/* Achievement Badge & Motivation text */}
            <div className="max-w-2xl mx-auto space-y-1.5 sm:space-y-2">
              <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-white text-xs sm:text-sm font-bold font-edu-sans shadow-xs">
                <div className={`flex items-center gap-1.5 px-4 py-1 rounded-full ${badgeColor} shadow-xs`}>
                  <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                  <span>XẾP LOẠI: {rankTitle}</span>
                  <div className="flex ml-1">
                    {Array.from({ length: starCount }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-300 text-yellow-300" />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-800 font-medium px-4 leading-relaxed max-w-xl mx-auto font-edu-serif italic">
                "{motivationalMessage}"
              </p>

              {/* Metrics Pill Grid */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-1 font-edu-sans">
                <div className="px-3 py-1 rounded-xl bg-sky-50 border border-sky-200 text-[11px] sm:text-xs font-bold text-sky-950">
                  Điểm số: <strong className="text-sky-700 text-sm sm:text-base font-black">{result.scoreTenScale}</strong>/10
                </div>
                <div className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] sm:text-xs font-bold text-emerald-950">
                  Tỉ lệ đúng: <strong className="text-emerald-700 text-sm sm:text-base font-black">{result.percentage}%</strong> ({result.correctCount}/{result.totalQuestions} câu)
                </div>
                <div className="px-3 py-1 rounded-xl bg-orange-50 border border-orange-200 text-[11px] sm:text-xs font-bold text-orange-950">
                  Thời gian: <strong className="text-orange-700">{Math.floor(result.timeElapsedSeconds / 60)}p {result.timeElapsedSeconds % 60}s</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer: Seal, ID, Date & Signature */}
          <div className="relative z-10 pt-2 sm:pt-3 border-t border-amber-300/90 grid grid-cols-3 gap-2 items-end">
            {/* Left: Certificate Metadata */}
            <div className="text-left text-[9px] sm:text-xs text-slate-600 space-y-0.5 font-edu-sans">
              <p className="flex items-center gap-1 font-semibold text-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                <span>Mã số: <strong>{result.certificateId}</strong></span>
              </p>
              <p className="flex items-center gap-1 text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Ngày cấp: {result.timestamp}</span>
              </p>
            </div>

            {/* Center: Official Golden Seal Stamp */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-600 p-0.5 shadow-md flex items-center justify-center border-2 border-amber-300">
                <div className="w-full h-full rounded-full border border-dashed border-white/90 flex flex-col items-center justify-center text-center text-white p-1">
                  <Award className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-100" />
                  <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-tighter leading-none mt-0.5">
                    CHỨNG NHẬN
                  </span>
                  <span className="text-[6px] sm:text-[7px] text-yellow-100 font-bold leading-none">
                    XUẤT SẮC
                  </span>
                </div>
                {/* Ribbon tails */}
                <div className="absolute -bottom-2 w-4 h-4 bg-amber-700 rotate-45 -z-10" />
                <div className="absolute -bottom-2 w-4 h-4 bg-yellow-600 rotate-12 -z-10" />
              </div>
            </div>

            {/* Right: Signature of Author & AI Tutor */}
            <div className="text-right font-edu-serif">
              <p className="text-[9px] sm:text-xs text-slate-600 italic">
                TM. Ban Biên soạn & Gia sư AI
              </p>
              <div className="font-bold text-sm sm:text-lg text-sky-950 mt-0.5">
                Trần Thị Phượng - AI
              </div>
              <span className="inline-block text-[8px] sm:text-[10px] text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-md border border-amber-300 font-bold mt-0.5 font-edu-sans">
                Tác giả biên soạn chương trình
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
