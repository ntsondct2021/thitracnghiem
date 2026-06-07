import React, { useState, useMemo } from "react";
import { 
  GraduationCap, 
  ArrowRight, 
  Clock, 
  Users, 
  BookOpen, 
  Award, 
  Shield, 
  Zap, 
  Search, 
  ExternalLink,
  ChevronRight,
  HelpCircle,
  FileCheck,
  CheckCircle,
  Info,
  Calendar,
  Sparkles,
  ArrowRightCircle,
  BookMarked,
  UserCheck,
  Check,
  Lock,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ExamRoom, Question } from "../types";

// Simple utility for merging tailwind classes
function cn(...classes: (string | undefined | null | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

interface HomeViewProps {
  examRooms: ExamRoom[];
  questions: Question[];
  onStartExam: (examCode: string) => Promise<void> | void;
  onStudentLogin: (name: string, sbd: string, isFree?: boolean) => void;
  onNavigateToLogin: () => void;
  onNavigateToAdmin: () => void;
  onStartFreeExamDirectly: (name: string, sbd: string, examCode: string) => void;
  setExamRooms: React.Dispatch<React.SetStateAction<ExamRoom[]>>;
}

export default function HomeView({
  examRooms,
  questions,
  onStartExam,
  onStudentLogin,
  onNavigateToLogin,
  onNavigateToAdmin,
  onStartFreeExamDirectly,
  setExamRooms
}: HomeViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExam, setSelectedExam] = useState<ExamRoom | null>(null);

  // Registration modal for free candidates
  const [regName, setRegName] = useState("");
  const [regClass, setRegClass] = useState("");
  const [regSchool, setRegSchool] = useState("");
  const [regError, setRegError] = useState("");

  // Filter exam rooms that are active
  const activeRooms = useMemo(() => {
    return examRooms.filter(room => room.isActive);
  }, [examRooms]);

  // Filter active exam rooms that are created by the admin/teacher and specifically marked for free practice
  const activeFreeRooms = useMemo(() => {
    return examRooms.filter(room => room.isActive && room.isFree);
  }, [examRooms]);

  // Only display active custom free exam rooms created by teachers or admins.
  // Since we pre-seed the demo exams in the database, admins can delete them as they wish.
  const displayedExams = useMemo(() => {
    return activeFreeRooms;
  }, [activeFreeRooms]);

  // Search filter
  const filteredExams = useMemo(() => {
    return displayedExams.filter(exam => 
      exam.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      exam.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [displayedExams, searchTerm]);

  // Register and participate directly
  const handleRegisterAndStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExam) return;
    
    if (!regName.trim() || !regClass.trim() || !regSchool.trim()) {
      setRegError("Vui lòng điền đầy đủ và chính xác tất cả thông tin!");
      return;
    }

    // Ensure the exam exists in the parent state list so startExam works
    const exists = examRooms.some(r => r.code.toUpperCase() === selectedExam.code.toUpperCase());
    if (!exists) {
      // Programmatically add this demo exam room so that backend / App engine recognizes it
      setExamRooms(prev => [...prev.filter(r => r.id !== selectedExam.id), selectedExam]);
      
      // Also register this exam room with the mock backend
      fetch("/api/exam-rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedExam)
      }).catch(err => console.error("Error writing demo free exam room:", err));
    }

    const formattedSbd = `TS-Tự do [Lớp ${regClass.trim()} - Trường ${regSchool.trim()}]`;
    onStartFreeExamDirectly(regName.trim(), formattedSbd, selectedExam.code);
    
    // Reset modal state
    setSelectedExam(null);
    setRegName("");
    setRegClass("");
    setRegSchool("");
    setRegError("");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased">
      {/* GLOWING AMBIENT ACCENTS */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-650 text-white rounded-xl shadow-lg shadow-indigo-650/20">
              <GraduationCap size={24} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <svg className="w-5.5 h-5.5 text-indigo-600 flex-shrink-0 animate-pulse" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" fill="url(#brand-shield-grad)" />
                  <path d="M8.5 12.2L10.8 14.5L15.8 9.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <defs>
                    <linearGradient id="brand-shield-grad" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#4F46E5" />
                      <stop offset="1" stopColor="#2563EB" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-indigo-750 to-blue-650 bg-clip-text text-indigo-700">
                  TINHOC DCT
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider mt-0.5">HỆ THỐNG THI TRỰC TUYẾN</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#bài-thi" className="text-sm font-semibold text-slate-500 hover:text-indigo-650 transition-colors">Bài Thi Tự Do</a>
            <a href="#tính-năng" className="text-sm font-semibold text-slate-500 hover:text-indigo-650 transition-colors">Tính Năng</a>
            <button 
              onClick={onNavigateToAdmin} 
              className="text-sm font-semibold text-slate-500 hover:text-indigo-650 transition-colors cursor-pointer bg-transparent border-none p-0 focus:outline-none"
            >
              Dành Cho Giáo Viên
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button 
              onClick={onNavigateToLogin}
              className="px-4.5 py-2 hover:bg-slate-100 text-indigo-650 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5"
            >
              Vào thi (SBD)
            </button>
            <button 
              onClick={onNavigateToAdmin}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 active:scale-[0.98] cursor-pointer"
            >
              Cổng Giáo Viên 🔐
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative px-6 py-16 md:py-24 max-w-4xl mx-auto w-full flex flex-col items-center text-center gap-8 z-10">
        <div className="space-y-6 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-750 border border-indigo-100 rounded-full px-3.5 py-1.5">
            <Sparkles size={14} className="text-indigo-600 animate-spin" />
            <span className="text-[11px] font-extrabold tracking-wide uppercase">Cập nhật cấu trúc thi mới 2026</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Nền Tảng Thi <br></br><span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Trắc Nghiệm Trực Tuyến</span> 
          </h1>

          <p className="text-slate-600 max-w-2xl text-sm sm:text-base leading-relaxed font-semibold">
            Thiết kế trực quan, chấm điểm chính xác 3 phần chuẩn năng lực mới. Học sinh tự do có thể tham gia thi thử không giới hạn, xem kết quả giải chi tiết ngay lập tức.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => {
                const element = document.getElementById("bài-thi");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-8 py-4.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 text-white rounded-2xl font-black text-sm shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 transition-all flex items-center gap-2 group active:scale-95 cursor-pointer"
            >
              Bắt đầu làm bài thi ngay 🚀
              <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
            <button
              onClick={onNavigateToLogin}
              className="px-8 py-4.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl font-black text-sm transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              Vào phòng thi chính thức
            </button>
          </div>

          {/* REAL STATS COUNTER */}
          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-200/80 w-full max-w-xl mx-auto">
            <div>
              <span className="block text-2xl sm:text-3xl font-mono font-black text-indigo-600">20+</span>
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Đề thi sẵn sàng</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-mono font-black text-purple-600">{questions.length}+</span>
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Ngân hàng câu hỏi</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-mono font-black text-green-500">100%</span>
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Bảo mật & Miễn phí</span>
            </div>
          </div>
        </div>
      </section>

      {/* FREE PRACTICE EXAM GRID */}
      <section id="bài-thi" className="bg-slate-100/60 border-y border-slate-200/30 py-16 px-6 scroll-mt-20">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Danh Sách Phòng Thi Cho Thí Sinh Tự Do
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-xs sm:text-sm font-medium">
              Tìm kiếm và chọn một đề thi thích hợp để bắt đầu quá trình ôn luyện đánh giá năng học lực của bạn ngay hôm nay. Xem giải chi tiết sau khi nộp bài.
            </p>
          </div>

          {/* SEARCH CONTROL BAR */}
          <div className="max-w-md mx-auto flex items-center bg-white border border-slate-200 rounded-2xl px-3.5 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500/80 transition-all shadow-sm">
            <Search className="text-slate-400 shrink-0" size={18} />
            <input 
              type="text"
              placeholder="Nhập tên đề thi hoặc mã bài thi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent px-3 text-sm focus:outline-none placeholder-slate-400 font-medium"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")} 
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer text-xs font-bold"
              >
                Xóa
              </button>
            )}
          </div>

          {/* EXAM LIST GRID */}
          {filteredExams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6.5">
              {filteredExams.map((exam) => (
                <div 
                  key={exam.id}
                  className="bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 shadow-sm hover:shadow-xl hover:shadow-indigo-900/5 transition-all p-5 flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Floating subtle background badge for aesthetic craft */}
                  <div className="absolute -top-3 -right-3 w-16 h-16 bg-slate-50 group-hover:bg-indigo-50 rounded-full transition-colors -z-0 pointer-events-none" />

                  <div className="space-y-4 z-10">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-750 rounded-lg text-[10px] font-black font-mono">
                        MÃ ĐỀ: {exam.code}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-green-600 bg-green-50 border border-green-100 font-extrabold px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                        SẴN SÀNG
                      </span>
                    </div>

                    <div>
                      <h3 className="text-slate-900 font-extrabold text-sm sm:text-base leading-snug group-hover:text-indigo-750 transition-colors">
                        {exam.name}
                      </h3>
                      {exam.teacherId && (
                        <p className="text-[11px] text-slate-405 font-bold text-slate-500 mt-1 uppercase tracking-wider">
                          Giáo viên phụ trách: {exam.teacherId === "ADMIN" ? "Quản trị viên" : exam.teacherId}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-slate-600 text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-slate-400" />
                        <span>{exam.duration} Phút</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen size={14} className="text-slate-400" />
                        <span>{exam.questionIds.length} Câu hỏi</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3 z-10">
                    <span className="text-[11px] text-slate-400 font-black uppercase">Thi Thử Miễn Phí</span>
                    <button 
                      onClick={() => setSelectedExam(exam)}
                      className="px-4 py-2 bg-slate-100 group-hover:bg-indigo-650 group-hover:text-white text-indigo-750 rounded-xl text-xs font-black transition-all flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                    >
                      Bắt đầu thi
                      <ArrowRightCircle size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
              <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <Info size={24} />
              </div>
              <div>
                <h3 className="text-slate-800 font-extrabold text-base">Không tìm thấy bài thi</h3>
                <p className="text-slate-405 text-slate-500 text-xs mt-1">Các từ khóa tìm kiếm có thể không trùng khớp. Hãy thử nhập mã hoặc tên bài thi khác!</p>
              </div>
              <button 
                onClick={() => setSearchTerm("")}
                className="text-xs bg-indigo-50 text-indigo-650 px-3.5 py-1.5 rounded-xl font-bold hover:bg-indigo-100 transition-colors cursor-pointer"
              >
                Xem tất cả bài thi
              </button>
            </div>
          )}
        </div>
      </section>

      {/* PLATFORM ADVANTAGES / FEATURES */}
      <section id="tính-năng" className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold text-indigo-650 uppercase tracking-widest block font-mono">TÍNH NĂNG VƯỢT TRỘI</span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Giải Pháp Đánh Giá Chuẩn Mực Và Bảo Mật</h2>
          <p className="text-slate-505 max-w-xl mx-auto text-xs sm:text-sm font-medium text-slate-500">
            Nền tảng trang bị các công cụ kiểm tra tự động tiên tiến, phù hợp với mọi khối thi độc lập và kiểm tra tập trung.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Shield className="text-emerald-500" size={24} />,
              title: "Tổ Chức Khoa Học & Bảo Mật",
              desc: "Hệ thống bảo vệ đề thi, quản lý bài làm thí sinh chặt chẽ. Cơ sở dữ liệu SQLite tích hợp lưu trữ bài làm chống rủi ro rớt mạng."
            },
            {
              icon: <Zap className="text-amber-500" size={24} />,
              title: "Tự Động Trộn Câu Hỏi Ngẫu Nhiên",
              desc: "Giáo viên biên soạn bộ đề từ folder ngân hàng. Đề thi tự động phân bố chuẩn 3 phần cấu trúc của Bộ GD&ĐT một cách đều đặn."
            },
            {
              icon: <Award className="text-indigo-600" size={24} />,
              title: "Xem Bảng Điểm & Lời Giải Thần Tốc",
              desc: "Hệ thống cung cấp kết quả chấm điểm tức thì. Thống kê chi tiết điểm cộng, điểm trừ và giải thích chi tiết cho từng phương án lựa chọn."
            }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-6.5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="p-3 bg-slate-50 inline-flex rounded-xl">
                {feature.icon}
              </div>
              <h3 className="text-slate-900 font-extrabold text-base">{feature.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed font-semibold">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto bg-slate-900 border-t border-slate-800 text-slate-400 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-650 text-white rounded-lg">
              <GraduationCap size={20} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4.5 h-4.5 text-indigo-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" fill="url(#footer-shield-grad)" />
                  <path d="M8.5 12.2L10.8 14.5L15.8 9.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <defs>
                    <linearGradient id="footer-shield-grad" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#6366F1" />
                      <stop offset="1" stopColor="#3B82F6" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="font-extrabold text-base tracking-tight text-white">TINHOC DCT MULTI-PORTAL</span>
              </div>
              <span className="text-[10px] text-slate-500 font-bold tracking-wider mt-0.5 block">HỆ THỐNG THI TRẮC NGHIỆM CHUYÊN NGHIỆP</span>
              <span className="text-[10px] text-slate-500 font-bold tracking-wider mt-0.5 block">Tác giả: Nguyễn Thanh Sơn</span>
            </div>
          </div>

          <p className="text-center md:text-left text-xs font-semibold leading-relaxed max-w-sm">
            Hệ thống cung cấp các bài thi thử, ngân hàng câu hỏi định hướng phát triển năng lực chất lượng cao cho thí sinh tự do và các trung tâm giáo dục chất lượng.
          </p>

          <div className="flex justify-center md:justify-end gap-4.5 text-xs font-bold text-slate-300">
            <a href="#bài-thi" className="hover:text-indigo-400 transition-colors">Toán Học</a>
            <span>•</span>
            <a href="#bài-thi" className="hover:text-indigo-400 transition-colors">Vật Lý</a>
            <span>•</span>
            <a href="#bài-thi" className="hover:text-indigo-400 transition-colors">Anh Văn</a>
          </div>
        </div>


      </footer>

      {/* REGISTRATION MODAL FOR FREE CANDIDATES */}
      <AnimatePresence>
        {selectedExam && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            {/* Modal Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedExam(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-6.5 sm:p-8 shadow-2xl border border-slate-100 max-w-md w-full relative z-10 space-y-6"
            >
              <button 
                onClick={() => setSelectedExam(null)}
                className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="text-center space-y-1.5">
                <div className="inline-flex p-3 bg-indigo-50 text-indigo-650 rounded-2xl mb-1">
                  <UserCheck size={28} />
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Khai Báo Thí Sinh Tự Do</h3>
                <p className="text-xs text-slate-505 text-slate-500 font-medium">
                  Để làm đề: <strong className="text-indigo-650">{selectedExam.name}</strong>, vui lòng nhập thông tin cơ bản dưới đây để lưu trữ điểm số.
                </p>
              </div>

              <form onSubmit={handleRegisterAndStart} className="space-y-4">
                {regError && (
                  <p className="text-xs font-bold text-rose-500 bg-rose-50 border border-rose-100 p-2.5 rounded-xl">{regError}</p>
                )}

                <div>
                  <label className="block text-[10px] font-black text-slate-405 text-slate-500 uppercase tracking-widest mb-1.5">Họ và tên thí sinh *</label>
                  <input 
                    type="text"
                    required
                    placeholder="Ví dụ: Nguyễn Văn A"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/80 rounded-xl text-sm font-semibold text-slate-800 transition-all focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-405 text-slate-500 uppercase tracking-widest mb-1.5">Lớp hiện tại *</label>
                    <input 
                      type="text"
                      required
                      placeholder="Ví dụ: Lớp 12A1"
                      value={regClass}
                      onChange={(e) => setRegClass(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/80 rounded-xl text-sm font-semibold text-slate-800 transition-all focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-405 text-slate-500 uppercase tracking-widest mb-1.5">Trường THPT *</label>
                    <input 
                      type="text"
                      required
                      placeholder="Ví dụ: Đỗ Công Tường"
                      value={regSchool}
                      onChange={(e) => setRegSchool(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/80 rounded-xl text-sm font-semibold text-slate-800 transition-all focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setSelectedExam(null)}
                    className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-2xl text-xs font-black tracking-wide uppercase transition-colors cursor-pointer text-center"
                  >
                    Hủy Bỏ
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-indigo-650 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black tracking-wide uppercase transition-all shadow-md shadow-indigo-650/15 cursor-pointer text-center"
                  >
                    Bắt đầu thi 🚀
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
