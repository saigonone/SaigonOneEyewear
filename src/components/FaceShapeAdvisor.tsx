import React, { useState } from "react";
import { X, Sparkles, Check, ArrowRight, Camera, HelpCircle, Eye } from "lucide-react";
import { FaceShape, FrameShape } from "../types";

interface FaceShapeAdvisorProps {
  onClose: () => void;
  onSelectRecommendedShapes: (faceShape: FaceShape, recommendedFrames: FrameShape[]) => void;
}

interface FaceShapeInfo {
  id: FaceShape;
  name: string;
  subtitle: string;
  description: string;
  recommendedFrameShapes: FrameShape[];
  recommendedNames: string[];
  avoidFrameShapes: string[];
  illustrationSvg: React.ReactNode;
}

export const FaceShapeAdvisor: React.FC<FaceShapeAdvisorProps> = ({
  onClose,
  onSelectRecommendedShapes,
}) => {
  const [selectedShape, setSelectedShape] = useState<FaceShape>("tron");

  const faceShapesData: FaceShapeInfo[] = [
    {
      id: "tron",
      name: "Mặt Tròn (Round Face)",
      subtitle: "Chiều dài & chiều rộng gương mặt tương đương, gò má đầy đặn",
      description: "Gương mặt tròn có đường nét mềm mại, cằm bo tròn. Mục tiêu là chọn dáng kính có góc cạnh để tạo cảm giác mặt dài và thon gọn hơn.",
      recommendedFrameShapes: ["vuong", "da-giac", "mat-meo", "chu-nhat"],
      recommendedNames: ["Gọng Vuông Cổ Điển", "Gọng Đa Giác Thời Thượng", "Gọng Mắt Mèo Cá Tính", "Gọng Chữ Nhật"],
      avoidFrameShapes: ["Gọng kính tròn xoe", "Gọng kính oval quá nhỏ"],
      illustrationSvg: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 mx-auto text-amber-600">
          <circle cx="50" cy="50" r="38" fill="#fef3c7" stroke="#d97706" strokeWidth="3" />
          {/* Glasses outline */}
          <rect x="24" y="42" width="22" height="15" rx="3" fill="none" stroke="#1c1917" strokeWidth="2.5" />
          <rect x="54" y="42" width="22" height="15" rx="3" fill="none" stroke="#1c1917" strokeWidth="2.5" />
          <path d="M 46 48 L 54 48" stroke="#1c1917" strokeWidth="2.5" />
        </svg>
      )
    },
    {
      id: "vuong",
      name: "Mặt Vuông / Chữ Điền (Square Face)",
      subtitle: "Quai hàm góc cạnh, trán rộng, tỉ lệ gương mặt cân đối",
      description: "Gương mặt vuông mang vẻ nam tính, mạnh mẽ. Nên chọn gọng kính tròn, oval hoặc gọng phi công aviator để làm mềm các góc cạnh quai hàm.",
      recommendedFrameShapes: ["tron", "oval", "aviator", "browline"],
      recommendedNames: ["Gọng Tròn Hàn Quốc", "Gọng Oval Thanh Mảnh", "Gọng Phi Công Aviator", "Gọng Nửa Viền Browline"],
      avoidFrameShapes: ["Gọng kính vuông bản dày góc cạnh", "Gọng chữ nhật sắc nhọn"],
      illustrationSvg: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 mx-auto text-amber-600">
          <rect x="18" y="16" width="64" height="68" rx="8" fill="#fef3c7" stroke="#d97706" strokeWidth="3" />
          {/* Round glasses outline */}
          <circle cx="36" cy="50" r="11" fill="none" stroke="#1c1917" strokeWidth="2.5" />
          <circle cx="64" cy="50" r="11" fill="none" stroke="#1c1917" strokeWidth="2.5" />
          <path d="M 47 50 L 53 50" stroke="#1c1917" strokeWidth="2.5" />
        </svg>
      )
    },
    {
      id: "trai-xoan",
      name: "Mặt Trái Xoan (Oval Face)",
      subtitle: "Tỉ lệ hoàn hảo chuẩn vàng, cằm hơi thon nhẹ, trán cân đối",
      description: "Mặt trái xoan là gương mặt lý tưởng nhất, có thể phù hợp với hầu hết mọi kiểu dáng gọng từ tròn, vuông, mắt mèo đến đa giác.",
      recommendedFrameShapes: ["da-giac", "vuong", "mat-meo", "aviator", "browline", "tron"],
      recommendedNames: ["Gọng Đa Giác Titan", "Gọng Mắt Mèo Quyến Rũ", "Gọng Browline Doanh Nhân", "Gọng Vuông Sang Trọng"],
      avoidFrameShapes: ["Gọng kính quá to che khuất toàn bộ lông mày"],
      illustrationSvg: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 mx-auto text-amber-600">
          <ellipse cx="50" cy="50" rx="34" ry="42" fill="#fef3c7" stroke="#d97706" strokeWidth="3" />
          <polygon points="26,45 36,38 46,45 44,58 28,58" fill="none" stroke="#1c1917" strokeWidth="2.5" />
          <polygon points="54,45 64,38 74,45 72,58 56,58" fill="none" stroke="#1c1917" strokeWidth="2.5" />
          <path d="M 46 48 L 54 48" stroke="#1c1917" strokeWidth="2.5" />
        </svg>
      )
    },
    {
      id: "kim-cuong",
      name: "Mặt Kim Cương (Diamond Face)",
      subtitle: "Gò má cao nổi bật, trán hẹp và cằm nhọn",
      description: "Gò má là điểm rộng nhất trên khuôn mặt. Gọng mắt mèo, gọng nửa viền Browline hoặc gọng oval không viền sẽ tạo sự cân xứng tuyệt đẹp.",
      recommendedFrameShapes: ["mat-meo", "browline", "oval", "tron"],
      recommendedNames: ["Gọng Mắt Mèo Nhấn Đuôi", "Gọng Browline Executive", "Gọng Oval Nhẹ Nhàng"],
      avoidFrameShapes: ["Gọng kính quá hẹp khiến gò má trông to hơn"],
      illustrationSvg: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 mx-auto text-amber-600">
          <polygon points="50,12 84,48 50,88 16,48" fill="#fef3c7" stroke="#d97706" strokeWidth="3" />
          <circle cx="38" cy="48" r="10" fill="none" stroke="#1c1917" strokeWidth="2.5" />
          <circle cx="62" cy="48" r="10" fill="none" stroke="#1c1917" strokeWidth="2.5" />
          <path d="M 48 48 L 52 48" stroke="#1c1917" strokeWidth="2.5" />
        </svg>
      )
    },
    {
      id: "trai-tim",
      name: "Mặt Trái Tim (Heart Face)",
      subtitle: "Trán rộng, gò má thanh tú, cằm nhọn V-line",
      description: "Nên chọn gọng kính có phần đáy rộng hơn hoặc gọng thanh mảnh để cân đối phần trán và làm nổi bật cằm V-line quyến rũ.",
      recommendedFrameShapes: ["aviator", "tron", "da-giac", "browline"],
      recommendedNames: ["Gọng Aviator Giọt Nước", "Gọng Tròn Thanh Mảnh", "Gọng Đa Giác Titan"],
      avoidFrameShapes: ["Gọng kính có phần trên trang trí quá nặng nề"],
      illustrationSvg: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 mx-auto text-amber-600">
          <path d="M 20 28 Q 50 15 80 28 Q 78 60 50 88 Q 22 60 20 28 Z" fill="#fef3c7" stroke="#d97706" strokeWidth="3" />
          <circle cx="36" cy="46" r="10" fill="none" stroke="#1c1917" strokeWidth="2.5" />
          <circle cx="64" cy="46" r="10" fill="none" stroke="#1c1917" strokeWidth="2.5" />
          <path d="M 46 46 L 54 46" stroke="#1c1917" strokeWidth="2.5" />
        </svg>
      )
    },
    {
      id: "dai",
      name: "Mặt Dài / Chữ Nhật (Oblong Face)",
      subtitle: "Chiều dài khuôn mặt lớn hơn chiều rộng, đường quai hàm thẳng",
      description: "Nên chọn gọng kính có bản to (Oversized), gọng vuông hoặc đa giác có viền dày để giúp gương mặt trông cân bằng và đầy đặn hơn.",
      recommendedFrameShapes: ["vuong", "da-giac", "browline", "mat-meo"],
      recommendedNames: ["Gọng Vuông To Bản Oversized", "Gọng Đa Giác Dày", "Gọng Browline Nhấn Viền"],
      avoidFrameShapes: ["Gọng kính hẹp, chữ nhật nhỏ làm mặt dài hơn"],
      illustrationSvg: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 mx-auto text-amber-600">
          <rect x="22" y="10" width="56" height="80" rx="14" fill="#fef3c7" stroke="#d97706" strokeWidth="3" />
          <rect x="28" y="44" width="18" height="16" rx="4" fill="none" stroke="#1c1917" strokeWidth="2.5" />
          <rect x="54" y="44" width="18" height="16" rx="4" fill="none" stroke="#1c1917" strokeWidth="2.5" />
          <path d="M 46 50 L 54 50" stroke="#1c1917" strokeWidth="2.5" />
        </svg>
      )
    }
  ];

  const currentInfo = faceShapesData.find(f => f.id === selectedShape) || faceShapesData[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-display text-lg font-bold text-stone-900">
                Chuyên Gia Tư Vấn Kính Theo Khuôn Mặt
              </h2>
              <p className="text-xs text-stone-500">
                Chọn dáng mặt của bạn để khám phá những mẫu gọng kính tôn đường nét nhất
              </p>
            </div>
          </div>

          <button
            id="btn-close-face-advisor"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Face Shapes Grid Selector */}
          <div>
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-3">
              Bước 1: Chọn dáng khuôn mặt của bạn
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {faceShapesData.map((f) => {
                const active = selectedShape === f.id;
                return (
                  <button
                    key={f.id}
                    id={`btn-face-shape-${f.id}`}
                    onClick={() => setSelectedShape(f.id)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between ${
                      active
                        ? "border-amber-600 bg-amber-50 ring-2 ring-amber-500/20 shadow-sm"
                        : "border-stone-200 bg-stone-50 hover:bg-white hover:border-stone-300"
                    }`}
                  >
                    <div className="mb-2">
                      {f.illustrationSvg}
                    </div>
                    <span className={`text-xs font-bold ${active ? "text-amber-900" : "text-stone-800"}`}>
                      {f.name.split("(")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Diagnosis & Recommendation */}
          <div className="p-5 rounded-3xl bg-stone-900 text-white border border-stone-800 shadow-lg space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-4">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Kết quả phân tích dáng mặt:
                </span>
                <h3 className="font-serif-display text-xl font-bold text-white mt-0.5">
                  {currentInfo.name}
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  {currentInfo.subtitle}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {currentInfo.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Should wear */}
              <div className="p-4 rounded-2xl bg-stone-800/80 border border-emerald-500/30 space-y-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>Dáng kính nên chọn (Tôn nét mặt):</span>
                </span>
                <ul className="space-y-1 text-xs text-stone-200">
                  {currentInfo.recommendedNames.map((rec, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Avoid */}
              <div className="p-4 rounded-2xl bg-stone-800/80 border border-red-500/30 space-y-2">
                <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                  <X className="w-4 h-4" />
                  <span>Dáng kính nên tránh:</span>
                </span>
                <ul className="space-y-1 text-xs text-stone-200">
                  {currentInfo.avoidFrameShapes.map((av, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      <span>{av}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Direct Action Button */}
            <div className="pt-2 flex justify-end">
              <button
                id="btn-apply-face-filter"
                onClick={() => {
                  onSelectRecommendedShapes(currentInfo.id, currentInfo.recommendedFrameShapes);
                  onClose();
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold px-6 py-3 rounded-full text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <span>Xem Ngay Các Mẫu Kính Hợp Mặt Của Bạn</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
