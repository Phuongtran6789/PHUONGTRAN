import { QuizResult } from '../types';
import * as XLSX from 'xlsx';

export interface QuizHistoryItem {
  id: string;
  certificateId: string;
  timestamp: string;
  studentName: string;
  studentClass: string;
  lessonTitle: string;
  scoreTenScale: number;
  percentage: number;
  gradeEvaluation: string;
  correctCount: number;
  incorrectCount: number;
  totalQuestions: number;
  timeElapsedSeconds: number;
  tutorComment: string;
}

const STORAGE_KEY = 'tiengviet4_kntt_quiz_history_v2';

export const getQuizHistory = (): QuizHistoryItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Lỗi khi đọc lịch sử học tập:', err);
    return [];
  }
};

export const saveQuizToHistory = (result: QuizResult, lessonTitle?: string): QuizHistoryItem[] => {
  try {
    const current = getQuizHistory();
    const newItem: QuizHistoryItem = {
      id: result.certificateId || `TV4-${Date.now()}`,
      certificateId: result.certificateId,
      timestamp: result.timestamp,
      studentName: result.studentName || 'Học sinh',
      studentClass: result.studentClass || '4',
      lessonTitle: lessonTitle || (result.questions[0]?.themeTitle ? `Chủ đề: ${result.questions[0].themeTitle}` : 'Ôn tập tổng hợp Tiếng Việt 4'),
      scoreTenScale: result.scoreTenScale,
      percentage: result.percentage,
      gradeEvaluation: result.gradeEvaluation,
      correctCount: result.correctCount,
      incorrectCount: result.incorrectCount,
      totalQuestions: result.totalQuestions,
      timeElapsedSeconds: result.timeElapsedSeconds,
      tutorComment: result.tutorComment,
    };

    // Avoid duplicate if same certificateId
    const filtered = current.filter(item => item.certificateId !== newItem.certificateId);
    const updated = [newItem, ...filtered];
    
    // Keep last 100 entries
    const trimmed = updated.slice(0, 100);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    return trimmed;
  } catch (err) {
    console.error('Lỗi khi lưu lịch sử:', err);
    return getQuizHistory();
  }
};

export const deleteHistoryItem = (id: string): QuizHistoryItem[] => {
  try {
    const current = getQuizHistory();
    const updated = current.filter(item => item.id !== id && item.certificateId !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Lỗi khi xóa mục lịch sử:', err);
    return getQuizHistory();
  }
};

export const clearQuizHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Lỗi khi xóa toàn bộ lịch sử:', err);
  }
};

export const exportHistoryToExcel = (history: QuizHistoryItem[]): void => {
  if (!history || history.length === 0) {
    alert('Chưa có dữ liệu bài làm nào để xuất file Excel!');
    return;
  }

  // Map to Excel rows with Vietnamese headers matching educational record sheets
  const excelData = history.map((item, index) => {
    const minutes = Math.floor(item.timeElapsedSeconds / 60);
    const seconds = item.timeElapsedSeconds % 60;
    const timeFormatted = `${minutes} phút ${seconds.toString().padStart(2, '0')} giây`;

    return {
      'STT': index + 1,
      'Mã Chứng Nhận': item.certificateId,
      'Thời Gian Nộp Bài': item.timestamp,
      'Họ Và Tên Học Sinh': item.studentName,
      'Lớp': item.studentClass,
      'Nội Dung / Bài Ôn Tập': item.lessonTitle,
      'Số Câu Đúng': `${item.correctCount}/${item.totalQuestions}`,
      'Tỉ Lệ Đạt (%)': `${item.percentage}%`,
      'Điểm Số (Thang 10)': item.scoreTenScale,
      'Xếp Loại Thành Tích': item.gradeEvaluation,
      'Thời Gian Làm Bài': timeFormatted,
      'Lời Nhận Xét Của Gia Sư AI': item.tutorComment,
    };
  });

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Set column widths for optimal reading
  worksheet['!cols'] = [
    { wch: 6 },  // STT
    { wch: 18 }, // Mã Chứng Nhận
    { wch: 22 }, // Thời Gian
    { wch: 24 }, // Họ Và Tên
    { wch: 10 }, // Lớp
    { wch: 32 }, // Bài Ôn Tập
    { wch: 14 }, // Số Câu Đúng
    { wch: 14 }, // Tỉ Lệ Đạt
    { wch: 18 }, // Điểm Số
    { wch: 20 }, // Xếp Loại
    { wch: 22 }, // Thời Gian Làm Bài
    { wch: 50 }, // Nhận Xét
  ];

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Lịch Sử Làm Bài Tiếng Việt 4');

  // Export file
  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `KetQua_OnTap_TiengViet4_${dateStr}.xlsx`);
};
