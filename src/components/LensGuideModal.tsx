import React, { useState } from "react";
import { X, BookOpen, Check, Sparkles, Shield, Eye, Sun, Laptop } from "lucide-react";
import { LENS_OPTIONS } from "../constants/storeConfig";

interface LensGuideModalProps {
  onClose: () => void;
}

export const LensGuideModal: React.FC<LensGuideModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<"index" | "types" | "brands">("index");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-display text-lg font-bold text-stone-900">
                Cẩm Nang Chọn Tròng Kính Chuyên Sâu
              </h2>
              <p className="text-xs text-stone-500">
                Hướng dẫn lựa chọn chiết suất và công nghệ tròng kính phù hợp với độ cận thị của bạn
              </p>
            </div>
          </div>

          <button
            id="btn-close-lens-guide"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-stone-200 flex items-center gap-6 text-xs sm:text-sm bg-white">
          <button
            onClick={() => setActiveTab("index")}
            className={`py-3 font-bold transition-colors cursor-pointer ${
              activeTab === "index"
                ? "text-amber-800 border-b-2 border-amber-600"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            1. Bảng Chiết Suất Độ Mỏng (1.56 - 1.74)
          </button>
          <button
            onClick={() => setActiveTab("types")}
            className={`py-3 font-bold transition-colors cursor-pointer ${
              activeTab === "types"
                ? "text-amber-800 border-b-2 border-amber-600"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            2. Công Nghệ: Ánh Sáng Xanh & Đổi Màu
          </button>
          <button
            onClick={() => setActiveTab("brands")}
            className={`py-3 font-bold transition-colors cursor-pointer ${
              activeTab === "brands"
                ? "text-amber-800 border-b-2 border-amber-600"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            3. Bảng Giá & Thương Hiệu Quốc Tế
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* TAB 1: THICKNESS INDEX COMPARISON */}
          {activeTab === "index" && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
                <p className="font-bold text-sm mb-1">💡 Chiết suất tròng kính (Refractive Index) là gì?</p>
                <p className="leading-relaxed">
                  Chiết suất càng cao thì tròng kính càng <strong>mỏng, nhẹ và thẩm mỹ hơn</strong>. Giúp mắt người đeo không bị "thu nhỏ" hoặc "phóng đại" khi người đối diện nhìn vào, đặc biệt rất quan trọng với những ai có độ cận trên 3 Diop.
                </p>
              </div>

              {/* Index Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* 1.56 */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Độ Cận Dưới 2.50D</span>
                    <h3 className="text-lg font-bold text-stone-900 mt-0.5">Chiết Suất 1.56</h3>
                    <p className="text-xs text-stone-600">Độ dày tiêu chuẩn cơ bản, kinh tế, phù hợp cho người cận nhẹ hoặc làm kính 0 độ đi đường.</p>
                  </div>
                  <div className="pt-2 border-t border-stone-200">
                    <div className="h-6 w-full bg-stone-300 rounded flex items-center justify-center text-[10px] font-bold text-stone-700">
                      Độ dày: Chuẩn (100%)
                    </div>
                  </div>
                </div>

                {/* 1.60 */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Độ Cận 2.50D - 4.50D</span>
                    <h3 className="text-lg font-bold text-stone-900 mt-0.5">Chiết Suất 1.60</h3>
                    <p className="text-xs text-stone-600">Mỏng hơn 20%, dai chống vỡ, hoàn hảo cho gọng xẻ cước và gọng khoan không viền.</p>
                  </div>
                  <div className="pt-2 border-t border-stone-200">
                    <div className="h-4.5 w-full bg-amber-200 rounded flex items-center justify-center text-[10px] font-bold text-amber-900">
                      Mỏng hơn 20%
                    </div>
                  </div>
                </div>

                {/* 1.67 */}
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300 space-y-2 flex flex-col justify-between ring-1 ring-amber-400">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-stone-950 px-1.5 py-0.5 rounded">
                      Phổ Biến Nhất (3.50D - 8.00D)
                    </span>
                    <h3 className="text-lg font-bold text-stone-900 mt-1">Chiết Suất 1.67 ASP</h3>
                    <p className="text-xs text-stone-700">Siêu mỏng nhẹ 35%, mặt phẳng phi cầu triệt tiêu hiện tượng mắt bị biến dạng méo viền.</p>
                  </div>
                  <div className="pt-2 border-t border-amber-200">
                    <div className="h-3.5 w-full bg-amber-400 rounded flex items-center justify-center text-[10px] font-bold text-stone-950">
                      Siêu mỏng 35%
                    </div>
                  </div>
                </div>

                {/* 1.74 */}
                <div className="p-4 rounded-2xl bg-stone-900 text-white border border-stone-800 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Độ Cận Nặng {">"} 6.00D</span>
                    <h3 className="text-lg font-bold text-white mt-0.5">Chiết Suất 1.74</h3>
                    <p className="text-xs text-stone-300">Đỉnh cao quang học, mỏng nhẹ tối đa 50%, viền kính trong suốt thẩm mỹ tuyệt đối.</p>
                  </div>
                  <div className="pt-2 border-t border-stone-800">
                    <div className="h-2.5 w-full bg-emerald-400 rounded flex items-center justify-center text-[9px] font-bold text-stone-950">
                      Cực mỏng 50%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TECH */}
          {activeTab === "types" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bluecut */}
              <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                  <Laptop className="w-5 h-5 text-blue-700" />
                  <span>Tròng Chống Ánh Sáng Xanh (BlueCut / BlueControl)</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Khuyên dùng cho người làm việc máy tính, điện thoại trên 4 tiếng/ngày. Lọc bỏ dải ánh sáng xanh tím có hại gây mỏi mắt, khô mắt và thoái hóa hoàng điểm.
                </p>
                <ul className="space-y-1.5 text-xs text-stone-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600" />
                    <span>Giảm nhức mỏi mắt, cải thiện giấc ngủ ban đêm</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600" />
                    <span>Lớp phủ chống bám bụi và chống vân tay dễ lau chùi</span>
                  </li>
                </ul>
              </div>

              {/* Transitions */}
              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
                  <Sun className="w-5 h-5 text-amber-600" />
                  <span>Tròng Đổi Màu Thông Minh (Photochromic)</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Giải pháp 2-trong-1 tiện lợi: Ở trong nhà kính trong suốt như bình thường, khi bước ra ngoài trời nắng kính tự động sẫm màu như kính râm mát.
                </p>
                <ul className="space-y-1.5 text-xs text-stone-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-600" />
                    <span>Tự động điều chỉnh độ đậm theo cường độ tia UV</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-600" />
                    <span>Không cần phải mang theo 2 chiếc kính cận và kính râm</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: PRICE LIST */}
          {activeTab === "brands" && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Bảng giá tròng kính chính hãng niêm yết tại Sài Gòn One:
              </span>
              <div className="border border-stone-200 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                    <tr>
                      <th className="p-3">Thương Hiệu & Tên Tròng</th>
                      <th className="p-3">Chiết Suất</th>
                      <th className="p-3">Công Nghệ</th>
                      <th className="p-3 text-right">Giá Niêm Yết</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {LENS_OPTIONS.filter(l => l.price > 0).map((l) => (
                      <tr key={l.id} className="hover:bg-stone-50/80">
                        <td className="p-3 font-bold text-stone-900">{l.name}</td>
                        <td className="p-3 text-stone-600">{l.index}</td>
                        <td className="p-3 text-stone-600">{l.description.slice(0, 45)}...</td>
                        <td className="p-3 text-right font-extrabold text-amber-800">
                          {formatPrice(l.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
