import React from "react";
import { 
  Phone, 
  CalendarClock, 
  MapPin 
} from "lucide-react";
import { ZaloAppIcon, MessengerAppIcon } from "./BrandIcons";

interface MobileBottomNavProps {
  onOpenAppointment: () => void;
  onOpenMap: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenAppointment,
  onOpenMap,
}) => {
  return (
    <nav
      id="mobile-bottom-navigation"
      aria-label="Menu điều hướng liên hệ nhanh"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] sm:hidden pb-[max(env(safe-area-inset-bottom),6px)] pt-1.5 px-3"
    >
      <div className="flex items-center justify-between max-w-sm mx-auto relative px-1">
        
        {/* 1. Gọi điện */}
        <a
          id="btn-mobile-nav-phone"
          href="tel:0973819928"
          className="flex items-center justify-center w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs transition-transform active:scale-90 cursor-pointer no-underline relative"
          title="Gọi Hotline tư vấn 0973.819.928"
          aria-label="Gọi điện 0973.819.928"
        >
          <Phone className="w-5 h-5 fill-white/20" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white animate-pulse" />
        </a>

        {/* 2. Zalo (Icon chuẩn chính thức của app Zalo) */}
        <a
          id="btn-mobile-nav-zalo"
          href="https://zalo.me/0973819928"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center w-11 h-11 transition-transform active:scale-90 cursor-pointer no-underline"
          title="Chat Zalo 0973.819.928"
          aria-label="Chat Zalo"
        >
          <ZaloAppIcon className="w-10 h-10 drop-shadow-xs rounded-xl overflow-hidden" />
        </a>

        {/* 3. Messenger (ở GIỮA, NỔI BẬT VỚI ICON CHUẨN APP GRADIENT) */}
        <a
          id="btn-mobile-nav-messenger"
          href="https://m.me/SaigonOneEyewear"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center w-12 h-12 -mt-3 transition-transform active:scale-90 cursor-pointer no-underline"
          title="Chat Facebook Messenger Fanpage"
          aria-label="Chat Messenger"
        >
          <MessengerAppIcon className="w-12 h-12 drop-shadow-md" />
        </a>

        {/* 4. Gửi lịch hẹn đo mắt */}
        <button
          type="button"
          id="btn-mobile-nav-appointment"
          onClick={onOpenAppointment}
          className="flex items-center justify-center w-11 h-11 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200/80 shadow-xs transition-transform active:scale-90 cursor-pointer"
          title="Gửi lịch hẹn đo mắt miễn phí"
          aria-label="Hẹn đo mắt"
        >
          <CalendarClock className="w-5 h-5" />
        </button>

        {/* 5. Biểu tượng vị trí liên kết Google Map / mở popup vị trí */}
        <button
          type="button"
          id="btn-mobile-nav-map"
          onClick={onOpenMap}
          className="flex items-center justify-center w-11 h-11 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/80 shadow-xs transition-transform active:scale-90 cursor-pointer"
          title="Xem vị trí Showroom trên Google Maps"
          aria-label="Vị trí Showroom"
        >
          <MapPin className="w-5 h-5" />
        </button>

      </div>
    </nav>
  );
};

