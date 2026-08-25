import React, { useState, useEffect } from "react";
import { Camera, Sparkles, ChevronRight, Shield, Award, Clock, RefreshCw, Eye, ArrowRight, Check } from "lucide-react";
import { ProductCategory, BannerSlide } from "../types";
import { INITIAL_BANNER_SLIDES } from "../data/mockBanners";

interface HeroBannerProps {
  slides?: BannerSlide[];
  onOpenTryOn: () => void;
  onOpenFaceAdvisor: () => void;
  onOpenLensGuide: () => void;
  onSelectCategory: (cat: ProductCategory) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  slides = INITIAL_BANNER_SLIDES,
  onOpenTryOn,
  onOpenFaceAdvisor,
  onOpenLensGuide,
  onSelectCategory,
}) => {
  const activeSlides = (slides && slides.length > 0) 
    ? slides.filter(s => s.isActive !== false)
    : INITIAL_BANNER_SLIDES;

  const validSlides = activeSlides.length > 0 ? activeSlides : INITIAL_BANNER_SLIDES;

  const [currentSlide, setCurrentSlide] = useState(0);

  // Keep index within bounds if slide count changes
  useEffect(() => {
    if (currentSlide >= validSlides.length) {
      setCurrentSlide(0);
    }
  }, [validSlides.length, currentSlide]);

  useEffect(() => {
    if (validSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % validSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [validSlides.length]);

  const slide = validSlides[currentSlide] || validSlides[0];

  return (
    <div className="relative overflow-hidden bg-[#fdfdfd] border-b border-gray-100">
      
      {/* Main Sleek Split Stage */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-[500px] lg:min-h-[560px]">
        
        {/* Left Editorial Text Column (45%) */}
        <div className="w-full lg:w-[45%] px-6 sm:px-10 lg:px-12 py-5 sm:py-7 lg:py-8 flex flex-col justify-center">
          
          {/* Sleek Line Tag */}
          <div className="mb-3 flex items-center gap-3">
            <span className="w-10 h-[1.5px] bg-blue-600"></span>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em]">
              {slide.collectionTag}
            </span>
          </div>

          {/* High Impact Editorial Headline - Refined Size */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light leading-[1.15] mb-4 tracking-tight text-slate-900">
            {slide.titleLine1} <br />
            <span className="font-extrabold text-[#0f172a]">{slide.titleLine2}</span>
          </h1>

          {/* Refined Description */}
          <p className="text-slate-500 text-sm sm:text-base max-w-md mb-6 leading-relaxed">
            {slide.desc}
          </p>

          {/* Sleek Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5">
            <button
              id="btn-hero-explore-collection"
              onClick={() => onSelectCategory(slide.category)}
              className="px-7 py-3.5 bg-[#0f172a] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-blue-900 transition-all duration-200 cursor-pointer shadow-md flex items-center gap-2"
            >
              <span>{slide.buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="btn-hero-tryon-ar"
              onClick={onOpenTryOn}
              className="px-7 py-3.5 border border-gray-200 text-slate-800 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-gray-50 hover:border-slate-400 transition-all duration-200 cursor-pointer flex items-center gap-2 bg-white"
            >
              <Camera className="w-4 h-4 text-blue-600" />
              <span>{slide.secondaryButtonText}</span>
            </button>
          </div>

          {/* Metric Stats Strip */}
          <div className="mt-8 pt-5 border-t border-gray-100 flex items-center gap-6 sm:gap-10">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">15k+</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">Khách Hàng</div>
            </div>
            <div className="w-[1px] h-8 bg-gray-200" />
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">100%</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">Chính Hãng</div>
            </div>
            <div className="w-[1px] h-8 bg-gray-200" />
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">15 Phút</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">Lấy Kính Ngay</div>
            </div>
          </div>

        </div>

        {/* Right Architectural Graphic & Product Visual Column (55%) */}
        <div className="w-full lg:w-[55%] relative bg-slate-50/60 px-6 sm:px-10 lg:px-12 py-5 sm:py-7 lg:py-8 flex items-center justify-center min-h-[350px] lg:min-h-auto overflow-hidden">
          
          {/* Subtle Ambient Light Glow */}
          <div className="w-96 h-96 bg-blue-500/10 rounded-full blur-3xl absolute"></div>
          
          {/* Main Visual Center Showcase */}
          <div className="relative z-10 w-full max-w-xl aspect-[16/10] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-white shadow-2xl border border-gray-100 p-2 group">
            <img
              src={slide.image || "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=1200&q=85"}
              alt={slide.titleLine2}
              className="w-full h-full object-cover rounded-xl transition-all duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 rounded-xl" />
            
            {/* Top Optical Brand Campaign Badge */}
            {slide.brandNote && (
              <div className="absolute top-4 left-4 right-4 z-10 flex items-center gap-1.5 bg-slate-950/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-white shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-[11px] font-medium tracking-wide truncate">{slide.brandNote}</span>
              </div>
            )}
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
            {validSlides.map((_, idx) => (
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
