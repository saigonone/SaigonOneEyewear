import React from "react";
import { 
  Glasses, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Award, 
  ArrowRight,
  Heart
} from "lucide-react";
import { ProductCategory } from "../types";

interface FooterProps {
  onSelectCategory: (cat: ProductCategory) => void;
  onOpenStores: () => void;
  onOpenAbout?: () => void;
  onOpenArticles?: () => void;
  onOpenLensGuide: () => void;
  onOpenFaceAdvisor: () => void;
  onOpenTryOn: () => void;
  onOpenOrderLookup: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenStores,
  onOpenAbout,
  onOpenArticles,
  onOpenLensGuide,
  onOpenFaceAdvisor,
  onOpenTryOn,
  onOpenOrderLookup,
}) => {
  return (
    <footer className="bg-white text-slate-600 pt-16 pb-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-100">
          
          {/* Col 1: Brand & Bio (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0f172a] rounded-lg flex items-center justify-center shadow-md">
                <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight uppercase text-slate-900 leading-none">
                  SAIGON ONE<span className="text-blue-600">.</span>
                </span>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                  Premium Optical Solutions
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Khám phá sự kết hợp tinh tế giữa công nghệ đo mắt chuẩn quốc tế và phong cách thời trang đương đại tại Saigon One Eyewear.
            </p>

            <div className="space-y-2 text-xs text-slate-600 pt-2">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Hotline & Zalo: <a href="https://zalo.me/0973819928" target="_blank" rel="noreferrer" className="font-bold text-blue-600 hover:underline">0973.819.928</a></span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Email: <strong>matkinhsaigonone@gmail.com</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Giờ mở cửa: <strong>08:30 - 21:30 (Cả tuần)</strong></span>
              </p>
            </div>
          </div>

          {/* Col 2: Danh Mục Sản Phẩm */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">
              Bộ Sưu Tập
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>
                <button onClick={() => onSelectCategory("gong-kinh-can")} className="hover:text-blue-600 transition-colors">
                  Gọng Kính Cận Titan
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory("kinh-ram-mat")} className="hover:text-blue-600 transition-colors">
                  Kính Râm Polarized
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory("trong-kinh")} className="hover:text-blue-600 transition-colors">
                  Tròng Kính Chemi & Essilor
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory("kinh-doi-mau")} className="hover:text-blue-600 transition-colors">
                  Kính Đổi Màu Đi Nắng
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory("kinh-tre-em")} className="hover:text-blue-600 transition-colors">
                  Kính Trẻ Em Dẻo Cao Cấp
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Dịch Vụ & Trải Nghiệm */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">
              Công Nghệ & Dịch Vụ
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              {onOpenAbout && (
                <li>
                  <button onClick={onOpenAbout} className="hover:text-blue-600 transition-colors font-medium">
                    Giới Thiệu Saigon One
                  </button>
                </li>
              )}
              <li>
                <button onClick={onOpenTryOn} className="hover:text-blue-600 transition-colors flex items-center gap-1.5 text-blue-600 font-semibold">
                  <span>📸 Thử Kính AR 3D</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenFaceAdvisor} className="hover:text-blue-600 transition-colors">
                  Tư Vấn Kính Theo Dáng Mặt
                </button>
              </li>
              <li>
                <button onClick={onOpenLensGuide} className="hover:text-blue-600 transition-colors">
                  Cẩm Nang Chiết Suất Tròng
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    if (onOpenArticles) {
                      onOpenArticles();
                    } else {
                      const el = document.getElementById("articles-blog-section");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }
                  }} 
                  className="hover:text-blue-600 transition-colors"
                >
                  Góc Tin Tức & Cẩm Nang
                </button>
              </li>
              <li>
                <button onClick={onOpenOrderLookup} className="hover:text-blue-600 transition-colors">
                  Tra Cứu Tiến Độ Đơn Hàng
                </button>
              </li>
              <li>
                <button onClick={onOpenStores} className="hover:text-blue-600 transition-colors">
                  Đo Khám Khúc Xạ Miễn Phí
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Hệ Thống Cửa Hàng TP.HCM */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">
              Chi Nhánh Saigon One
            </h4>
            <ul className="space-y-2.5 text-[11px] text-slate-500">
              <li className="leading-snug">
                <strong className="text-slate-900 block font-semibold text-blue-600">Trụ Sở Phú Nhuận (Flagship):</strong>
                178 Phan Đăng Lưu, Phường 3, Q. Phú Nhuận, TP.HCM
              </li>
              <li className="leading-snug">
                <strong className="text-slate-900 block font-semibold">Chi nhánh Quận 1:</strong>
                92 Nguyễn Trãi, P. Bến Thành, Q.1
              </li>
              <li className="leading-snug">
                <strong className="text-slate-900 block font-semibold">Chi nhánh Quận 10:</strong>
                526 Ba Tháng Hai, P.14, Q.10
              </li>
              <li className="leading-snug">
                <strong className="text-slate-900 block font-semibold">Chi nhánh Gò Vấp:</strong>
                688 Quang Trung, P.11, Gò Vấp
              </li>
            </ul>
          </div>

        </div>

        {/* Sleek Technical Status Bar & Socials (As in Sleek Interface Design) */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          
          {/* Live Cloud DB Indicators */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-mono text-gray-500">DB: saigononeeyewear-default-rtdb</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-[10px] font-mono text-gray-500">PROJECT: saigononeeyewear</span>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-[10px] text-gray-400 uppercase tracking-widest">
            &copy; 2026 Saigon One Eyewear - Premium Optical Solutions
          </div>

          {/* Sleek Social Media Circular Badges */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-[10px] font-bold text-slate-700 hover:border-slate-900 transition-colors cursor-pointer">
              FB
            </div>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-[10px] font-bold text-slate-700 hover:border-slate-900 transition-colors cursor-pointer">
              IG
            </div>
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-[10px] font-bold text-slate-700 hover:border-slate-900 transition-colors cursor-pointer">
              YT
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
};
