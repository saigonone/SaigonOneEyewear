import React from "react";
import { 
  X, 
  MapPin, 
  Phone, 
  Clock, 
  Mail, 
  ShieldCheck, 
  Sparkles, 
  Award, 
  Glasses, 
  Eye, 
  CheckCircle2, 
  MessageSquare,
  Navigation,
  HeartHandshake
} from "lucide-react";

interface AboutModalProps {
  onClose: () => void;
  onOpenStores: () => void;
  onOpenTryOn: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  onClose,
  onOpenStores,
  onOpenTryOn,
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-neutral-200">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-white sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0f172a] rounded-xl flex items-center justify-center shadow-md shrink-0">
              <Glasses className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 uppercase tracking-tight">
                VỀ CHÚNG TÔI - SAIGON ONE EYEWEAR
              </h2>
              <p className="text-[11px] text-neutral-500 font-medium">
                Hệ Thống Kính Mắt & Đo Khám Thị Lực Uy Tín Tại TP. Hồ Chí Minh
              </p>
            </div>
          </div>

          <button
            id="btn-close-about-modal"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8 text-neutral-700">
          
          {/* Banner Hero Intro */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-neutral-900 via-slate-900 to-neutral-950 text-white p-6 sm:p-8 border border-neutral-800 shadow-lg">
            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Thương Hiệu Kính Mắt Phong Cách & Chính Xác
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3 font-serif">
                SAIGON ONE EYEWEAR
              </h1>
              <p className="text-sm text-neutral-300 leading-relaxed font-light">
                Ra đời với sứ mệnh mang đến cho khách hàng những trải nghiệm thị lực hoàn hảo nhất, <strong>Saigon One Eyewear</strong> là điểm đến tin cậy của hàng chục nghìn khách hàng tại TP.HCM khi tìm kiếm các mẫu gọng kính thời trang cao cấp, kính râm và dịch vụ đo khám mắt chuẩn y khoa.
              </p>
            </div>
          </div>

          {/* Core Info & Address Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Address & Store Info */}
            <div className="bg-amber-50/60 rounded-2xl p-5 sm:p-6 border border-amber-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm uppercase tracking-wider mb-4">
                  <MapPin className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>SHOWROOM & TRUNG TÂM KHÚC XẠ</span>
                </div>

                <div className="space-y-3.5 text-xs text-neutral-800">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-sm text-neutral-900">178 Phan Đăng Lưu</strong>
                      <span>Phường Đức Nhuận, TP. Hồ Chí Minh</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <span className="text-neutral-500">Hotline / Zalo: </span>
                      <a href="tel:0973819928" className="font-bold text-amber-900 hover:underline">
                        0973.819.928
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <span className="text-neutral-500">Giờ mở cửa: </span>
                      <strong className="text-neutral-900">08:30 - 21:00</strong> (Tất cả các ngày trong tuần)
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <span className="text-neutral-500">Email: </span>
                      <span className="text-neutral-900 font-medium">matkinhsaigonone@gmail.com</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-amber-200/60 flex flex-wrap items-center gap-2">
                <a
                  href="https://zalo.me/0973819928"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-xs transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat Zalo</span>
                </a>
                <button
                  onClick={() => {
                    onClose();
                    onOpenStores();
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 text-amber-400" />
                  <span>Xem Bản Đồ</span>
                </button>
              </div>
            </div>

            {/* Why Choose Saigon One */}
            <div className="bg-neutral-50 rounded-2xl p-5 sm:p-6 border border-neutral-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-neutral-900 font-bold text-sm uppercase tracking-wider mb-4">
                  <Award className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>CAM KẾT CHẤT LƯỢNG & DỊCH VỤ</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>100% Sản phẩm chính hãng:</strong> Xuất xứ rõ ràng, tem nhãn đầy đủ, bảo vệ đôi mắt tối đa.</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Đo mắt khúc xạ miễn phí:</strong> Sử dụng hệ thống máy đo tự động chuẩn y tế tiên tiến nhất.</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Cắt kính lấy ngay trong 15-20 phút:</strong> Kỹ thuật viên tay nghề cao thực hiện lắp ráp chuẩn tâm mắt.</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Bảo hành & bảo dưỡng trọn đời:</strong> Nắn chỉnh gọng, thay đệm mũi, vệ sinh sóng siêu âm miễn phí.</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-neutral-200">
                <p className="text-[11px] text-neutral-500 italic">
                  * Tặng kèm hộp đựng kính cao cấp, khăn lau microfiber và nước rửa kính nano chuyên dụng cho mỗi sản phẩm.
                </p>
              </div>
            </div>

          </div>

          {/* Product Categories Overview */}
          <div>
            <h3 className="text-base font-bold text-neutral-900 uppercase tracking-tight mb-4 flex items-center gap-2">
              <Glasses className="w-4 h-4 text-amber-600" />
              <span>CÁC DÒNG SẢN PHẨM NỔI BẬT TẠI SAIGON ONE</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
              <div className="p-4 rounded-xl border border-neutral-200 bg-white shadow-2xs">
                <strong className="text-neutral-900 block text-sm mb-1">Gọng Kính Cận & Thời Trang</strong>
                <p className="text-neutral-500 leading-relaxed">
                  Titanium nguyên khối siêu nhẹ, nhựa Acetate cao cấp bóng bẩy, TR90 dẻo dai chống gãy và gọng kim loại mạ vàng sang trọng.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 bg-white shadow-2xs">
                <strong className="text-neutral-900 block text-sm mb-1">Kính Râm & Tròng Đổi Màu</strong>
                <p className="text-neutral-500 leading-relaxed">
                  Tròng phân cực Polarized chống chói lóa lái xe, kính đổi màu thông minh theo cường độ UV, chống 100% tia tử ngoại hại mắt.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 bg-white shadow-2xs">
                <strong className="text-neutral-900 block text-sm mb-1">Tròng Kính Kỹ Thuật Số</strong>
                <p className="text-neutral-500 leading-relaxed">
                  Tròng lọc ánh sáng xanh BlueCut bảo vệ mắt khi dùng máy tính, tròng siêu mỏng chiết suất 1.60, 1.67, 1.74 cho độ cận nặng.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-neutral-500">
              Quý khách cần tư vấn chọn gọng kính hợp mặt hoặc kiểm tra bảng giá tròng kính?
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  onClose();
                  onOpenTryOn();
                }}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Thử Kính AR 3D
              </button>
              <a
                href="https://zalo.me/0973819928"
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-extrabold uppercase tracking-wider transition-colors text-center"
              >
                Nhắn Zalo 0973.819.928
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
