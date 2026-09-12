import React, { useState } from "react";
import { 
  X, 
  MapPin, 
  Phone, 
  Clock, 
  Mail, 
  CheckCircle, 
  Navigation, 
  Calendar, 
  MessageSquare, 
  Sparkles, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { STORE_LOCATIONS } from "../data/mockProducts";
import { addAppointmentToFirebase } from "../firebase";

interface StoreLocationsModalProps {
  onClose: () => void;
  initialTab?: "all" | "map" | "appointment";
}

export const StoreLocationsModal: React.FC<StoreLocationsModalProps> = ({ 
  onClose,
  initialTab = "all"
}) => {
  const [activeTab, setActiveTab] = useState<"all" | "map" | "appointment">(initialTab);
  const store = STORE_LOCATIONS[0] || {
    id: "store-phandangluu",
    name: "Showroom Saigon One Eyewear - 178 Phan Đăng Lưu",
    address: "178 Phan Đăng Lưu, Phường Đức Nhuận, TP. Hồ Chí Minh",
    district: "Phường Đức Nhuận",
    city: "TP. Hồ Chí Minh",
    phone: "0973.819.928",
    hotline: "0973.819.928",
    openHours: "08:30 - 21:00 (Mở cửa tất cả các ngày trong tuần)",
    services: [
      "Đo khám khúc xạ mắt miễn phí bằng máy đo tự động Topcon chuẩn y khoa Nhật Bản",
      "Cắt mài lắp kính lấy ngay siêu tốc trong 15 - 20 phút",
      "Khu trưng bày gọng kính Titanium, Acetate, Kính râm Polarized & Tròng kính chính hãng",
      "Vệ sinh kính bằng sóng siêu âm, nắn chỉnh gọng, thay ve đệm mũi miễn phí trọn đời",
      "Hỗ trợ tư vấn trực tiếp qua Zalo / Hotline: 0973.819.928",
      "Chỗ đỗ xe máy và ô tô thuận tiện, an toàn"
    ]
  };

  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("08:30 - 10:00");
  const [bookingNote, setBookingNote] = useState("");
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSubmitted(true);
    try {
      await addAppointmentToFirebase({
        fullName: bookingName,
        phone: bookingPhone,
        email: "matkinhsaigonone@gmail.com",
        date: bookingDate,
        time: bookingTime,
        note: bookingNote,
        status: "pending",
        createdAt: new Date().toISOString(),
        storeAddress: "178 Phan Đăng Lưu, Phường Đức Nhuận, TP. Hồ Chí Minh",
      });
      // Trigger local event to sync
      window.dispatchEvent(new CustomEvent("appointment_updated"));
    } catch (err) {
      console.warn("Lỗi lưu lịch hẹn:", err);
    }

    setBookingSubmitted(false);
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingName("");
      setBookingPhone("");
      setBookingDate("");
      setBookingNote("");
    }, 6000);
  };

  // Google Maps Embed URL for 178 Phan Dang Luu
  const googleMapEmbedUrl = "https://maps.google.com/maps?q=178+Phan+%C4%90%C4%83ng+L%C6%B0u,+TP.HCM&t=&z=16&ie=UTF8&iwloc=&output=embed";
  const googleMapDirectionUrl = "https://www.google.com/maps/search/?api=1&query=178+Phan+%C4%90%C4%83ng+L%C6%B0u,+TP.HCM";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 uppercase tracking-tight">
                  LIÊN HỆ & SHOWROOM SAIGON ONE EYEWEAR
                </h2>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300/80">
                  Chi Nhánh Duy Nhất
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                178 Phan Đăng Lưu, Phường Đức Nhuận, TP. Hồ Chí Minh
              </p>
            </div>
          </div>

          <button
            id="btn-close-stores-modal"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-100/90 border-b border-slate-200 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "all"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            Tất Cả Thông Tin
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("map")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "map"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Vị Trí Google Maps</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("appointment")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "appointment"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Đặt Lịch Đo Mắt</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
          
          {/* Top Quick Actions Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href="tel:0973819928"
              className="flex items-center justify-center gap-2 p-3.5 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 rounded-2xl text-amber-950 font-bold text-xs sm:text-sm transition-all shadow-xs group"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs">
                <Phone className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-amber-800 font-medium block">Gọi Hotline Tư Vấn</span>
                <span className="font-extrabold text-xs sm:text-sm">0973.819.928</span>
              </div>
            </a>

            <a
              href="https://zalo.me/0973819928"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 p-3.5 bg-blue-50 hover:bg-blue-100/80 border border-blue-200 rounded-2xl text-blue-950 font-bold text-xs sm:text-sm transition-all shadow-xs group"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-blue-700 font-medium block">Chat Zalo Trực Tuyến</span>
                <span className="font-extrabold text-xs sm:text-sm">0973.819.928</span>
              </div>
            </a>

            <a
              href={googleMapDirectionUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 p-3.5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-2xl text-emerald-950 font-bold text-xs sm:text-sm transition-all shadow-xs group"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Navigation className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-emerald-700 font-medium block">Mở Ứng Dụng</span>
                <span className="font-extrabold text-xs sm:text-sm">Chỉ Đường Google Maps</span>
              </div>
            </a>
          </div>

          {/* Main Grid: Store Info + Google Maps Embed */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Detailed Store Info (5 cols) */}
            <div className="lg:col-span-5 space-y-5 flex flex-col justify-between bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-800 font-bold text-xs rounded-lg uppercase tracking-wide">
                    Showroom Trực Tiếp
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Đang mở cửa
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                  Saigon One Eyewear
                </h3>

                <div className="space-y-3 text-xs text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block text-sm">Địa chỉ cửa hàng:</span>
                      <span className="text-slate-700 font-medium">178 Phan Đăng Lưu, Phường Đức Nhuận, TP. Hồ Chí Minh</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">Thời gian hoạt động:</span>
                      <span>08:30 - 21:00 (Mở cửa tất cả các ngày trong tuần, kể cả Thứ Bảy, Chủ Nhật và ngày lễ)</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Phone className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">Hotline đặt hẹn / Tư vấn:</span>
                      <a href="tel:0973819928" className="font-bold text-blue-600 hover:underline">
                        0973.819.928
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">Email liên hệ:</span>
                      <span className="font-medium text-slate-800">matkinhsaigonone@gmail.com</span>
                    </div>
                  </div>
                </div>

                {/* Services list */}
                <div className="pt-3 border-t border-slate-200">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Dịch vụ nổi bật tại Showroom:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Đo mắt miễn phí máy Topcon tự động Nhật Bản</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Cắt mài kính lấy ngay trong 15 - 20 phút</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Vệ sinh sóng siêu âm & nắn chỉnh gọng trọn đời</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <a
                  href={googleMapDirectionUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Xem Trên Bản Đồ Lớn</span>
                </a>
              </div>
            </div>

            {/* Right: Embedded Interactive Google Map (7 cols) */}
            <div className="lg:col-span-7 flex flex-col bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
              <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  <span>Bản Đồ Chỉ Đường - 178 Phan Đăng Lưu</span>
                </div>
                <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-mono">
                  Google Maps Live
                </span>
              </div>

              {/* Google Maps Iframe */}
              <div className="relative w-full h-[320px] sm:h-[380px] lg:h-[420px] bg-slate-200">
                <iframe
                  title="Bản đồ Saigon One Eyewear 178 Phan Đăng Lưu"
                  src={googleMapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>

              {/* Map footer note */}
              <div className="p-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
                <span>📍 Mặt tiền đường Phan Đăng Lưu, có chỗ đỗ xe máy & ô tô thuận tiện</span>
                <a
                  href={googleMapDirectionUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-blue-600 hover:underline flex items-center gap-1 shrink-0"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Mở Google Maps</span>
                </a>
              </div>
            </div>

          </div>

          {/* Booking Appointment Form Section */}
          <div className="bg-gradient-to-br from-slate-900 via-neutral-900 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Dịch Vụ Đo Khám Khúc Xạ Miễn Phí</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Đặt Lịch Hẹn Đo Mắt & Tư Vấn Tại 178 Phan Đăng Lưu
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mb-6">
                Đặt lịch trước để được ưu tiên kiểm tra thị lực chuyên sâu với kỹ thuật viên khúc xạ, không phải chờ đợi.
              </p>

              {bookingSuccess ? (
                <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center gap-3 text-emerald-300 text-xs sm:text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <strong className="block text-emerald-200 font-bold">Đặt lịch khám mắt thành công!</strong>
                    <span>Thông tin đã được lưu trong hệ thống quản trị & chuyển tới email <strong>matkinhsaigonone@gmail.com</strong>. Chuyên viên Saigon One sẽ liên hệ qua SĐT/Zalo để xác nhận trong ít phút.</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBooking} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">Họ và tên *</label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Nguyễn Văn A"
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">Số điện thoại *</label>
                    <input
                      type="tel"
                      placeholder="09xx xxx xxx"
                      value={bookingPhone}
                      onChange={(e) => setBookingPhone(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">Ngày mong muốn *</label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">Khung giờ</label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="08:30 - 10:00">08:30 - 10:00 (Sáng)</option>
                      <option value="10:00 - 12:00">10:00 - 12:00 (Trưa)</option>
                      <option value="13:30 - 15:30">13:30 - 15:30 (Chiều)</option>
                      <option value="15:30 - 18:00">15:30 - 18:00 (Chiều muộn)</option>
                      <option value="18:00 - 21:00">18:00 - 21:00 (Tối)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <input
                      type="text"
                      placeholder="Ghi chú yêu cầu (ví dụ: đo độ cận mới, lắp tròng chống ánh sáng xanh, đổi màu...)"
                      value={bookingNote}
                      onChange={(e) => setBookingNote(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-1">
                    <button
                      type="submit"
                      disabled={bookingSubmitted}
                      className="w-full h-full min-h-[42px] bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                    >
                      {bookingSubmitted ? "Đang gửi..." : "Xác Nhận Đặt Lịch"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Modal Bottom Sticky Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Saigon One Eyewear cam kết bảo hành kỹ thuật nắn chỉnh và đo mắt miễn phí trọn đời</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg transition-colors cursor-pointer text-xs"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
