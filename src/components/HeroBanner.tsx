import React, { useState, useEffect } from "react";
import { Camera, Sparkles, ChevronRight, Shield, Award, Clock, RefreshCw, Eye, ArrowRight, Check } from "lucide-react";
import { ProductCategory } from "../types";

interface HeroBannerProps {
  onOpenTryOn: () => void;
  onOpenFaceAdvisor: () => void;
  onOpenLensGuide: () => void;
  onSelectCategory: (cat: ProductCategory) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenTryOn,
  onOpenFaceAdvisor,
  onOpenLensGuide,
  onSelectCategory,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      collectionTag: "BỘ SƯU TẬP 2026",
      titleLine1: "Tầm Nhìn",
      titleLine2: "Hoàn Hảo",
      desc: "Khám phá sự kết hợp tinh tế giữa công nghệ đo mắt chuẩn quốc tế và phong cách thời trang đương đại tại Saigon One Eyewear.",
      buttonText: "Khám Phá Ngay",
      secondaryButtonText: "Thử Kính AR 3D",
      category: "gong-kinh-can" as ProductCategory,
      featureBadge: "Lọc ánh sáng xanh kỹ thuật số",
      featureDesc: "Bảo vệ đôi mắt tuyệt đối khi làm việc liên tục với máy tính và điện thoại.",
      image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=1200&q=85",
    },
    {
      collectionTag: "KÍNH MÁT POLARIZED MỚI",
      titleLine1: "Phong Cách",
      titleLine2: "Đương Đại",
      desc: "Tròng kính phân cực khử 100% tia UV400 và ánh sáng chói lóa. Kiểu dáng Aviator và gọng vuông kim loại sắc nét dành cho người sành điệu.",
      buttonText: "Xem Kính Râm",
      secondaryButtonText: "Thử Kính Trực Tuyến",
      category: "kinh-ram-mat" as ProductCategory,
      featureBadge: "Chống chói & Tia cực tím UV400",
      featureDesc: "Khử ánh sáng lóa mặt đường, bảo vệ võng mạc tối đa khi lái xe dưới nắng gắt.",
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=85",
    },
    {
      collectionTag: "CÔNG NGHỆ QUANG HỌC",
      titleLine1: "Tròng Cận",
      titleLine2: "Siêu Mỏng 1.74",
      desc: "Đổi màu tức thì theo tia UV, cắt mài đo tâm quang học tự động theo công nghệ Topcon Nhật Bản lấy liền chỉ trong 15 phút.",
      buttonText: "Bảng Giá Tròng",
      secondaryButtonText: "Tư Vấn Chọn Tròng",
      category: "trong-kinh" as ProductCategory,
      featureBadge: "Đo mắt miễn phí 100%",
      featureDesc: "Máy đo khúc xạ tự động và chuyên viên khúc xạ nhiều năm kinh nghiệm tư vấn.",
      image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1200&q=85",
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <div className="relative overflow-hidden bg-[#fdfdfd] border-b border-gray-100">
      
      {/* Main Sleek Split Stage */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-[580px] lg:min-h-[640px]">
        
        {/* Left Editorial Text Column */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          
          {/* Sleek Line Tag */}
          <div className="mb-4 flex items-center gap-3">
            <span className="w-12 h-[1px] bg-blue-600"></span>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em]">
              {slide.collectionTag}
            </span>
          </div>

          {/* High Impact Editorial Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light leading-none mb-6 tracking-tighter text-slate-900">
            {slide.titleLine1} <br />
            <span className="font-extrabold text-[#0f172a]">{slide.titleLine2}</span>
          </h1>

          {/* Refined Description */}
          <p className="text-slate-500 text-base sm:text-lg max-w-lg mb-8 leading-relaxed italic">
            {slide.desc}
          </p>

          {/* Sleek Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              id="btn-hero-explore-collection"
              onClick={() => onSelectCategory(slide.category)}
              className="px-8 py-4 bg-[#0f172a] text-white text-xs sm:text-sm font-bold uppercase tracking-widest rounded-lg hover:bg-blue-900 transition-all duration-200 cursor-pointer shadow-md flex items-center gap-2"
            >
              <span>{slide.buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="btn-hero-tryon-ar"
              onClick={onOpenTryOn}
              className="px-8 py-4 border border-gray-200 text-slate-800 text-xs sm:text-sm font-bold uppercase tracking-widest rounded-lg hover:bg-gray-50 hover:border-slate-400 transition-all duration-200 cursor-pointer flex items-center gap-2"
            >
              <Camera className="w-4 h-4 text-blue-600" />
              <span>{slide.secondaryButtonText}</span>
            </button>
          </div>

          {/* Metric Stats Strip */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex items-center gap-8 sm:gap-12">
            <div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">15k+</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Khách Hàng</div>
            </div>
            <div className="w-[1px] h-8 bg-gray-200" />
            <div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">100%</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Chính Hãng</div>
            </div>
            <div className="w-[1px] h-8 bg-gray-200" />
            <div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">15 Phút</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Lấy Kính Ngay</div>
            </div>
          </div>

        </div>

        {/* Right Architectural Graphic & Product Visual Column */}
        <div className="w-full lg:w-1/2 relative bg-slate-50/60 p-6 sm:p-12 flex items-center justify-center min-h-[380px] lg:min-h-auto overflow-hidden">
          
          {/* Subtle Ambient Light Glow */}
          <div className="w-96 h-96 bg-blue-500/10 rounded-full blur-3xl absolute"></div>
          
          {/* Main Visual Center Showcase */}
          <div className="relative z-10 w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden bg-white shadow-2xl border border-gray-100 p-2">
            <img
              src={slide.image}
              alt={slide.titleLine2}
              className="w-full h-full object-cover rounded-xl transition-all duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-xl" />
          </div>

          {/* Sleek Floating Feature Card */}
          <div className="absolute bottom-8 left-8 right-8 sm:right-auto sm:max-w-xs p-5 bg-white/95 backdrop-blur-md border border-gray-100 shadow-xl rounded-xl z-20">
            <div className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              <span>Tính năng nổi bật</span>
            </div>
            <div className="text-sm font-bold text-slate-900 mb-1">{slide.featureBadge}</div>
            <div className="text-xs text-gray-500 leading-relaxed">
              {slide.featureDesc}
            </div>
          </div>

          {/* Slide Indicator dots */}
          <div className="absolute top-6 right-6 z-20 flex items-center gap-1.5 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-100 shadow-xs">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === idx ? "w-6 bg-blue-600" : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>

      </div>

      {/* Sleek Bottom Guarantees Strip */}
      <div className="border-t border-gray-100 bg-white py-5 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900">100% Chính Hãng</p>
              <p className="text-[11px] text-gray-400">Tem chống giả & bảo hành đầy đủ</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Cắt Kính Lấy Liền</p>
              <p className="text-[11px] text-gray-400">Mài lắp tự động 15 - 20 phút</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Đổi Trả 7 Ngày</p>
              <p className="text-[11px] text-gray-400">Đổi mẫu miễn phí nếu chưa ưng</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Bảo Hành Trọn Đời</p>
              <p className="text-[11px] text-gray-400">Nắn chỉnh gọng, thay ve ốc 0đ</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
