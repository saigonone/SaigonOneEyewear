import React, { useState } from "react";
import { X, MapPin, Phone, Clock, Award, CheckCircle, Navigation, Calendar } from "lucide-react";
import { StoreLocation } from "../types";
import { STORE_LOCATIONS } from "../data/mockProducts";

interface StoreLocationsModalProps {
  onClose: () => void;
}

export const StoreLocationsModal: React.FC<StoreLocationsModalProps> = ({ onClose }) => {
  const [selectedStore, setSelectedStore] = useState<StoreLocation>(STORE_LOCATIONS[0]);
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSubmitted(true);
    setTimeout(() => {
      setBookingSubmitted(false);
      setBookingName("");
      setBookingPhone("");
      setBookingDate("");
      alert(`Đã đặt lịch hẹn đo mắt miễn phí tại ${selectedStore.name} thành công! Kỹ thuật viên sẽ gọi xác nhận trong 10 phút.`);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-display text-lg font-bold text-stone-900">
                Hệ Thống Cửa Hàng Sài Gòn One Eyewear
              </h2>
              <p className="text-xs text-stone-500">
                4 chi nhánh trung tâm TP.HCM trang bị máy đo khúc xạ tự động Topcon Nhật Bản
              </p>
            </div>
          </div>

          <button
            id="btn-close-stores-modal"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          
          {/* Left: Stores list */}
          <div className="lg:col-span-5 p-4 border-b lg:border-b-0 lg:border-r border-stone-200 space-y-3 bg-stone-50/50">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block px-1">
              Chọn chi nhánh gần bạn:
            </span>
            {STORE_LOCATIONS.map((st) => {
              const active = selectedStore.id === st.id;
              return (
                <div
                  key={st.id}
                  id={`btn-store-item-${st.id}`}
                  onClick={() => setSelectedStore(st)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    active
                      ? "border-amber-600 bg-white ring-2 ring-amber-500/20 shadow-md"
                      : "border-stone-200 bg-white hover:border-stone-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-xs text-stone-900 leading-snug">{st.name}</h3>
                    {st.isMainFlagship && (
                      <span className="text-[9px] font-extrabold uppercase bg-amber-500 text-stone-950 px-1.5 py-0.2 rounded shrink-0">
                        Flagship
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-600 mt-1 flex items-start gap-1">
                    <MapPin className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                    <span>{st.address}</span>
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 mt-2 pt-2 border-t border-stone-100 font-medium">
                    <span className="text-amber-800 font-bold">{st.phone}</span>
                    <span>{st.openHours.split("(")[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Store Details & Book Exam */}
          <div className="lg:col-span-7 p-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-xs">
                <img
                  src={selectedStore.image}
                  alt={selectedStore.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="font-bold text-sm">{selectedStore.name}</h3>
                  <p className="text-[11px] text-stone-300">{selectedStore.district}, {selectedStore.city}</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
                  Dịch vụ chuyên nghiệp tại chi nhánh:
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
                  {selectedStore.services.map((svc, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 p-2 bg-stone-50 rounded-xl border border-stone-200/60">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{svc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Free Exam Booking Form */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2 text-amber-950 font-bold text-xs">
                  <Calendar className="w-4 h-4 text-amber-700" />
                  <span>Đặt Hẹn Đo Khám Khúc Xạ Mắt Miễn Phí Tại {selectedStore.district}</span>
                </div>
                <form onSubmit={handleBooking} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Họ tên của bạn"
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    required
                    className="px-3 py-2 bg-white rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-amber-500"
                  />
                  <input
                    type="tel"
                    placeholder="Số điện thoại"
                    value={bookingPhone}
                    onChange={(e) => setBookingPhone(e.target.value)}
                    required
                    className="px-3 py-2 bg-white rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    className="bg-stone-900 hover:bg-stone-800 text-white font-bold px-3 py-2 rounded-xl text-xs transition-all cursor-pointer"
                  >
                    {bookingSubmitted ? "Đang gửi..." : "Đặt Lịch Ngay"}
                  </button>
                </form>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs">
              <span className="text-stone-500">Hotline tổng đài tư vấn: <strong>{selectedStore.hotline}</strong></span>
              <a 
                href={`https://maps.google.com/?q=${encodeURIComponent(selectedStore.address)}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1 text-amber-700 hover:underline font-bold"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Chỉ đường trên Google Maps</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
