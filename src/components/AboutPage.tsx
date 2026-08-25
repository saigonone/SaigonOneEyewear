import React from "react";
import { 
  Glasses, 
  MapPin, 
  Phone, 
  Clock, 
  Mail, 
  ShieldCheck, 
  Sparkles, 
  Award, 
  Eye, 
  CheckCircle2, 
  MessageSquare,
  Navigation,
  HeartHandshake,
  ArrowRight,
  Home,
  ChevronRight,
  Shield,
  Zap,
  Users,
  Compass,
  Star,
  Check,
  Stethoscope,
  Maximize2
} from "lucide-react";
import { ProductCategory } from "../types";

interface AboutPageProps {
  onGoHome: () => void;
  onSelectCategory: (cat: ProductCategory) => void;
  onOpenStores: () => void;
  onOpenTryOn: () => void;
  onOpenFaceAdvisor: () => void;
  onOpenLensGuide: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onGoHome,
  onSelectCategory,
  onOpenStores,
  onOpenTryOn,
  onOpenFaceAdvisor,
  onOpenLensGuide,
}) => {
  return (
    <div className="bg-stone-50 min-h-screen pb-16 font-sans text-neutral-800">
      
      {/* 1. Breadcrumb & Navigation Bar */}
      <div className="bg-white border-b border-stone-200/80 sticky top-16 z-10 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs text-neutral-500">
            <button 
              id="about-breadcrumb-home"
              onClick={onGoHome}
              className="flex items-center gap-1 hover:text-amber-800 transition-colors font-medium cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Trang Chủ</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-neutral-900 font-semibold">Giới Thiệu Saigon One Eyewear</span>
          </nav>
        </div>
      </div>

      {/* 2. Hero Section */}
      <section className="relative bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white py-16 sm:py-24 overflow-hidden">
        {/* Background Subtle Accents */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute top-1/4 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Col: Hero Story */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hệ Thống Mắt Kính & Khúc Xạ Y Khoa Uy Tín</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight font-serif text-white">
                SAIGON ONE EYEWEAR
              </h1>
              
              <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-2xl">
                Tự hào là thương hiệu kính mắt hàng đầu tại <strong>178 Phan Đăng Lưu, Phú Nhuận, TP.HCM</strong>. Chúng tôi kết hợp giữa tay nghề khúc xạ y khoa chính xác tuyệt đối và các bộ sưu tập gọng kính thời trang cao cấp, bảo vệ trọn vẹn thị lực và nâng tầm phong cách cho bạn.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  id="btn-about-hero-tryon"
                  onClick={onOpenTryOn}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Thử Kính AR 3D Ngay</span>
                </button>

                <a
                  id="btn-about-hero-zalo"
                  href="https://zalo.me/0973819928"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  <span>Tư Vấn Zalo: 0973.819.928</span>
                </a>
              </div>
            </div>

            {/* Right Col: Showcase Box with Key Highlights */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-700">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Glasses className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white uppercase tracking-wider">Trụ Sở Flagship</h3>
                    <p className="text-xs text-slate-400">178 Phan Đăng Lưu, Phường 3, Phú Nhuận</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                    <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-serif mb-1">10+</div>
                    <div className="text-xs text-slate-300 font-medium">Năm kinh nghiệm đo khúc xạ</div>
                  </div>

                  <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                    <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-serif mb-1">100%</div>
                    <div className="text-xs text-slate-300 font-medium">Tròng chính hãng có tem thẻ</div>
                  </div>

                  <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                    <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-serif mb-1">15'</div>
                    <div className="text-xs text-slate-300 font-medium">Cắt kính lấy ngay trong ngày</div>
                  </div>

                  <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                    <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-serif mb-1">0 VNĐ</div>
                    <div className="text-xs text-slate-300 font-medium">Đo mắt khám thị lực chuẩn y khoa</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Mở cửa liên tục: <strong>08:30 - 21:00</strong> (Tất cả các ngày trong tuần)</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Main Detailed Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        
        {/* Story & Philosophy Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full">
              <Compass className="w-3.5 h-3.5" />
              <span>Câu Chuyện Của Chúng Tôi</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Kiến Tạo Chuẩn Mực Mới Cho Trải Nghiệm Mua Sắm Kính Mắt
            </h2>

            <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
              <p>
                Ra đời tại trung tâm quận Phú Nhuận, TP.HCM, <strong>Saigon One Eyewear</strong> được xây dựng với mục tiêu giải quyết triệt để nỗi băn khoăn của người đeo kính: <em>“Làm sao để tìm được cặp kính vừa vặn khuôn mặt, tròng kính chuẩn số độ, xuất xứ minh bạch và mức giá hợp lý nhất?”</em>.
              </p>
              <p>
                Tại Saigon One, mỗi chiếc kính không đơn thuần là một dụng cụ hỗ trợ thị lực, mà còn là một phụ kiện định hình phong cách cá nhân và sự tự tin. Chúng tôi chọn lọc kỹ lưỡng từng dòng gọng từ Titanium siêu nhẹ, Acetate cao cấp bóng bẩy đến nhựa TR90 đàn hồi cao, phục vụ từ học sinh, sinh viên, giới văn phòng đến các doanh nhân thành đạt.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 bg-white px-4 py-2.5 rounded-xl border border-stone-200 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Minh bạch xuất xứ</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 bg-white px-4 py-2.5 rounded-xl border border-stone-200 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Kỹ thuật viên lành nghề</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 bg-white px-4 py-2.5 rounded-xl border border-stone-200 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Bảo hành tận tâm</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-stone-200/80 bg-white p-2">
              <img
                src="https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=1000&q=85"
                alt="Không gian Showroom Saigon One Eyewear"
                className="w-full h-80 sm:h-96 object-cover rounded-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 backdrop-blur-md text-white p-4 rounded-xl border border-white/10">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-300">Không Gian Showroom Hiện Đại</p>
                <p className="text-xs text-slate-300">Trưng bày hơn 1,000+ mẫu gọng kính thời trang & thiết bị đo thị lực thế hệ mới.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Commitments Cards */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
            <span className="inline-block text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100/60 px-3 py-1 rounded-full">
              Cam Kết Vàng
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              5 Lý Do Khách Hàng Tuyệt Đối Tin Tưởng Saigon One
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              Quyền lợi tối đa và sự an tâm trọn vẹn dành cho mọi khách hàng khi đo khám và mua kính.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">1. Đo Mắt Khúc Xạ Miễn Phí Chuẩn Y Khoa</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Quy trình đo khúc xạ tự động với hệ thống máy Nidek Nhật Bản, kiểm tra độ cận, viễn, loạn thị và độ nhạy màu sắc hoàn toàn miễn phí.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 text-xs font-bold text-blue-600">
                Chuẩn xác từng độ trục
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">2. 100% Tròng Kính Chính Hãng Minh Bạch</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Đối tác trực tiếp của Essilor (Pháp), Hoya (Nhật), Chemi (Hàn). Khách hàng được trực tiếp kiểm tra bao bì, mã vạch và tem bảo hành trước khi mài lắp.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 text-xs font-bold text-amber-700">
                Đền gấp 10 lần nếu phát hiện hàng giả
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">3. Cắt Kính Lấy Ngay Trong 15 - 20 Phút</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Hệ thống máy mài kính kỹ thuật số tự động độ chính xác cao. Cắt kính trực tiếp tại chỗ, không để khách hàng phải chờ đợi qua ngày.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 text-xs font-bold text-emerald-600">
                Nhanh chóng & chuẩn tâm mắt
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">4. Bảo Hành & Vệ Sinh Kính Trọn Đời</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Miễn phí nắn chỉnh form gọng, thay đệm mũi silicone mềm, thay ốc vít và vệ sinh kính bằng máy sóng siêu âm trọn đời sản phẩm.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 text-xs font-bold text-purple-600">
                Chăm sóc hậu mãi chu đáo
              </div>
            </div>

            {/* Card 5 */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">5. Công Nghệ Thử Kính AR 3D & AI Dáng Mặt</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Ứng dụng camera thực tế ảo tăng cường AR giúp thử gọng trực tuyến chân thực và gợi ý kiểu dáng gọng tôn nét đẹp khuôn mặt.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 text-xs font-bold text-rose-600">
                Trải nghiệm hiện đại hàng đầu
              </div>
            </div>

            {/* Card 6 (Quà tặng & Phụ kiện) */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">6. Bộ Quà Tặng Chăm Sóc Kính Cao Cấp</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Mỗi đơn hàng đều được tặng kèm hộp cứng bảo vệ, khăn lau microfiber chống trầy và bình xịt rửa tròng nano chuyên dụng.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 text-xs font-bold text-amber-800">
                Tặng kèm Full Combo cao cấp
              </div>
            </div>

          </div>
        </div>

        {/* 5-Step Eye Examination Workflow */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/80 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
              Quy Trình Chuẩn Y Khoa
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              5 Bước Đo Khám Thị Lực Chuyên Nghiệp
            </h2>
            <p className="text-xs text-neutral-500">
              Đảm bảo số độ chính xác tuyệt đối, êm dịu cho mắt và không gây chóng mặt khi đeo kính mới.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60 relative flex flex-col justify-between">
              <div>
                <span className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center mb-3">
                  1
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">Khảo Sát Thói Quen</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Tìm hiểu nhu cầu làm việc (máy tính, lái xe, ngoài trời) và tiền sử thị lực của mắt.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60 relative flex flex-col justify-between">
              <div>
                <span className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center mb-3">
                  2
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">Đo Khúc Xạ Máy</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Đo khúc xạ khách quan bằng máy đo tự động kỹ thuật số tiên tiến nhất.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60 relative flex flex-col justify-between">
              <div>
                <span className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center mb-3">
                  3
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">Thử Kính Mẫu</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Đeo kính thử thực tế, đi lại và đọc bảng thị lực để tinh chỉnh độ cân bằng 2 mắt.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60 relative flex flex-col justify-between">
              <div>
                <span className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center mb-3">
                  4
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">Tư Vấn Tròng Kính</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Lựa chọn chiết suất tròng siêu mỏng và tính năng lọc ánh sáng xanh / đổi màu phù hợp.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60 relative flex flex-col justify-between">
              <div>
                <span className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center mb-3">
                  5
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">Mài Lắp & Bàn Giao</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Mài kính tự động 15 phút, cân chỉnh êm ái trên sống mũi và bàn giao bảo hành.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Product Categories Guide Showcase */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100/60 px-3 py-1 rounded-full">
              Danh Mục Sản Phẩm
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Khám Phá Các Bộ Sưu Tập Kính Mắt
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Category 1 */}
            <div 
              onClick={() => onSelectCategory("gong-kinh-can")}
              className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="h-36 rounded-xl overflow-hidden bg-slate-100 mb-4 relative">
                  <img
                    src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=600&q=80"
                    alt="Gọng kính cận"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-slate-900/80 text-white text-[10px] font-bold rounded-md uppercase">
                    Bán Chạy
                  </div>
                </div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-amber-800 transition-colors">
                  Gọng Kính Cận & Thời Trang
                </h3>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Titanium siêu nhẹ, Acetate bóng bẩy, TR90 dẻo dai phong cách Hàn Quốc và thanh lịch.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-amber-800">
                <span>Xem bộ sưu tập</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Category 2 */}
            <div 
              onClick={() => onSelectCategory("kinh-ram-mat")}
              className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="h-36 rounded-xl overflow-hidden bg-slate-100 mb-4 relative">
                  <img
                    src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"
                    alt="Kính râm thời trang"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-blue-900/80 text-white text-[10px] font-bold rounded-md uppercase">
                    Polarized
                  </div>
                </div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-amber-800 transition-colors">
                  Kính Râm Chống Chói UV400
                </h3>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Tròng phân cực chống lóa khi lái xe đi nắng, kiểu dáng Aviator, Mắt mèo, Vuông thời thượng.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-amber-800">
                <span>Xem bộ sưu tập</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Category 3 */}
            <div 
              onClick={() => onSelectCategory("trong-kinh")}
              className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="h-36 rounded-xl overflow-hidden bg-slate-100 mb-4 relative">
                  <img
                    src="https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=600&q=80"
                    alt="Tròng kính chính hãng"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-900/80 text-white text-[10px] font-bold rounded-md uppercase">
                    Chính Hãng
                  </div>
                </div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-amber-800 transition-colors">
                  Tròng Kính Kỹ Thuật Số
                </h3>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Lọc ánh sáng xanh máy tính, tròng chiết suất siêu mỏng 1.60, 1.67, 1.74 cho độ cận nặng.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-amber-800">
                <span>Xem bộ sưu tập</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Category 4 */}
            <div 
              onClick={() => onSelectCategory("kinh-doi-mau")}
              className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="h-36 rounded-xl overflow-hidden bg-slate-100 mb-4 relative">
                  <img
                    src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80"
                    alt="Kính đổi màu"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-purple-900/80 text-white text-[10px] font-bold rounded-md uppercase">
                    Transitions
                  </div>
                </div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-amber-800 transition-colors">
                  Kính Đổi Màu Đi Nắng
                </h3>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Trong suốt trong nhà, tự động chuyển màu râm đậm khi ra nắng, bảo vệ mắt 2 trong 1.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-amber-800">
                <span>Xem bộ sưu tập</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>
        </div>

        {/* Location & Contact Information Hub */}
        <div className="bg-gradient-to-br from-amber-50/80 via-white to-amber-50/50 rounded-3xl p-8 sm:p-10 border border-amber-200/80 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-900 border border-amber-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                <span>Showroom & Trung Tâm Khúc Xạ</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
                Trụ Sở Chính Saigon One Eyewear
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-neutral-800">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-sm sm:text-base text-slate-900">178 Phan Đăng Lưu</strong>
                    <span className="text-neutral-600">Phường 3 (Đức Nhuận), Quận Phú Nhuận, TP. Hồ Chí Minh</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-neutral-500">Hotline / Zalo tư vấn: </span>
                    <a href="tel:0973819928" className="font-bold text-amber-900 hover:underline text-sm sm:text-base">
                      0973.819.928
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-neutral-500">Thời gian phục vụ: </span>
                    <strong className="text-slate-900">08:30 - 21:00</strong> (Mở cửa tất cả các ngày trong tuần)
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-neutral-500">Email: </span>
                    <span className="text-slate-900 font-medium">matkinhsaigonone@gmail.com</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="https://zalo.me/0973819928"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Nhắn Zalo Tư Vấn</span>
                </a>

                <button
                  onClick={onOpenStores}
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Navigation className="w-4 h-4 text-amber-400" />
                  <span>Xem Bản Đồ & Chỉ Đường</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-amber-200 shadow-md h-72 sm:h-80 bg-white">
                <iframe
                  title="Google Maps Saigon One Eyewear"
                  src="https://maps.google.com/maps?q=178%20Phan%20%C4%90%C4%83ng%20L%C6%B0u,%20Ph%C6%B0%E1%BB%9Dng%203,%20Ph%C3%BA%20Nhu%E1%BA%ADn,%20TP.HCM&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Fast Action Banner */}
        <div className="bg-slate-950 rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px]" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Trải Nghiệm Ngay Hôm Nay</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-serif">
              Tìm Chiếc Kính Hoàn Hảo Cho Đôi Mắt Của Bạn
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-light">
              Đến trực tiếp showroom Saigon One Eyewear 178 Phan Đăng Lưu để được đo mắt miễn phí hoặc trải nghiệm thử kính công nghệ AR trực tuyến ngay tại nhà.
            </p>

            <div className="flex flex-wrap justify-center items-center gap-3 pt-4">
              <button
                onClick={onOpenTryOn}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-amber-500/20"
              >
                Thử Kính AR 3D Trực Tuyến
              </button>

              <button
                onClick={() => onSelectCategory("all")}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer border border-slate-700"
              >
                Xem Toàn Bộ Sản Phẩm
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
