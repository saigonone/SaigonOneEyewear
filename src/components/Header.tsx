import React, { useState } from "react";
import { 
  Glasses, 
  Search, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  Phone, 
  Camera, 
  Sparkles, 
  BookOpen, 
  Clock, 
  Menu, 
  X, 
  Truck,
  UserCheck,
  SearchCode,
  ShieldCheck,
  ChevronDown
} from "lucide-react";
import { ProductCategory, GenderTarget } from "../types";

interface HeaderProps {
  cartCount: number;
  favoritesCount: number;
  onOpenCart: () => void;
  onOpenFavorites: () => void;
  onOpenTryOn: () => void;
  onOpenFaceAdvisor: () => void;
  onOpenLensGuide: () => void;
  onOpenStores: () => void;
  onOpenOrderLookup: () => void;
  onOpenAdmin: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  selectedGender: GenderTarget | "all";
  onSelectGender: (g: GenderTarget | "all") => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  favoritesCount,
  onOpenCart,
  onOpenFavorites,
  onOpenTryOn,
  onOpenFaceAdvisor,
  onOpenLensGuide,
  onOpenStores,
  onOpenOrderLookup,
  onOpenAdmin,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  selectedGender,
  onSelectGender,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const categories: { id: ProductCategory; label: string; badge?: string }[] = [
    { id: "all", label: "Tất Cả Kính" },
    { id: "gong-kinh-can", label: "Gọng Kính Cận", badge: "Hot" },
    { id: "kinh-ram-mat", label: "Kính Râm Polarized" },
    { id: "trong-kinh", label: "Tròng Kính Chính Hãng" },
    { id: "kinh-doi-mau", label: "Kính Đổi Màu" },
    { id: "kinh-tre-em", label: "Kính Trẻ Em" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      
      {/* Sleek Top Notification Announcement Bar */}
      <div className="bg-[#0f172a] text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          <div className="flex items-center space-x-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300">
                Ưu Đãi 15%: <strong className="text-white font-mono bg-blue-600/30 px-1.5 py-0.5 rounded border border-blue-500/40">CHAOHANG2026</strong>
              </span>
            </div>
            <span className="hidden md:flex items-center gap-1.5 text-slate-400">
              <Truck className="w-3.5 h-3.5 text-blue-400" />
              <span>Freeship toàn quốc từ 300K</span>
            </span>
            <span className="hidden lg:flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>Cắt kính lấy ngay 15 phút</span>
            </span>
          </div>

          <div className="flex items-center space-x-4 ml-auto text-xs font-medium">
            <button 
              id="btn-header-order-lookup"
              onClick={onOpenOrderLookup}
              className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <SearchCode className="w-3.5 h-3.5 text-blue-400" />
              <span>Tra Cứu Đơn Hàng</span>
            </button>
            <span className="text-slate-700">|</span>
            <button 
              id="btn-header-stores"
              onClick={onOpenStores}
              className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>4 Chi Nhánh TP.HCM</span>
            </button>
            <span className="text-slate-700">|</span>
            <a 
              href="tel:0903372556" 
              className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 font-semibold"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>0903.372.556</span>
            </a>
            <span className="text-slate-700">|</span>
            <button
              id="btn-header-admin-toggle"
              onClick={onOpenAdmin}
              className="hover:text-white transition-colors flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded text-slate-300 border border-slate-700 cursor-pointer"
              title="Khu vực quản trị"
            >
              <UserCheck className="w-3 h-3 text-blue-400" />
              <span>Admin</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Header Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        
        {/* Mobile menu button */}
        <button 
          id="btn-mobile-menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo - Sleek Interface style */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none" 
          onClick={() => onSelectCategory("all")}
        >
          <div className="w-10 h-10 bg-[#0f172a] rounded-lg flex items-center justify-center shadow-md">
            <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold tracking-tight uppercase text-slate-900 leading-none">
              SAIGON ONE<span className="text-blue-600">.</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
              Premium Optical Solutions
            </p>
          </div>
        </div>

        {/* Sleek Search Input */}
        <div className="hidden md:flex flex-1 max-w-md mx-6 relative">
          <div className={`w-full flex items-center bg-slate-50 rounded-full border transition-all duration-200 px-4 py-2 ${
            searchFocused ? "border-blue-600 bg-white ring-2 ring-blue-500/20 shadow-sm" : "border-slate-200 hover:border-slate-300"
          }`}>
            <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
            <input
              type="text"
              placeholder="Tìm kiếm gọng kính titan, kính râm, tròng đổi màu..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange("")}
                className="text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Quick Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Virtual Try-On CTA */}
          <button
            id="btn-header-tryon-modal"
            onClick={onOpenTryOn}
            className="hidden sm:flex items-center gap-2 bg-[#0f172a] hover:bg-blue-900 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition-all duration-200 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-blue-400" />
            <span>Thử Kính AR</span>
          </button>

          {/* Face Advisor CTA */}
          <button
            id="btn-header-face-advisor"
            onClick={onOpenFaceAdvisor}
            className="hidden lg:flex items-center gap-1.5 text-slate-700 hover:text-blue-600 px-3 py-2 rounded-lg text-xs font-semibold border border-slate-200 hover:border-blue-600 hover:bg-blue-50/50 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Tư Vấn Khuôn Mặt</span>
          </button>

          {/* Lens Guide */}
          <button
            id="btn-header-lens-guide"
            onClick={onOpenLensGuide}
            className="hidden xl:flex items-center gap-1.5 text-slate-700 hover:text-blue-600 px-3 py-2 rounded-lg text-xs font-semibold border border-slate-200 hover:border-blue-600 hover:bg-blue-50/50 transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Cẩm Nang Tròng</span>
          </button>

          {/* Favorites Wishlist */}
          <button
            id="btn-header-favorites"
            onClick={onOpenFavorites}
            className="relative p-2.5 text-slate-700 hover:text-red-500 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Kính yêu thích"
            title="Kính yêu thích"
          >
            <Heart className={`w-5 h-5 ${favoritesCount > 0 ? "fill-red-500 text-red-500" : ""}`} />
            {favoritesCount > 0 && (
              <span className="absolute 0 top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Cart Icon Button */}
          <button
            id="btn-header-cart"
            onClick={onOpenCart}
            className="relative p-2.5 bg-[#0f172a] text-white hover:bg-blue-900 rounded-lg shadow-sm transition-all duration-200 cursor-pointer flex items-center gap-2"
            aria-label="Giỏ hàng"
          >
            <ShoppingBag className="w-5 h-5 text-white" />
            <span className="hidden sm:inline text-xs font-bold font-mono">
              {cartCount > 0 ? `(${cartCount})` : "Giỏ"}
            </span>
            {cartCount > 0 && (
              <span className="sm:hidden absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

        </div>

      </div>

      {/* Sleek Category Navigation Tabs */}
      <nav className="border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto no-scrollbar">
          
          {/* Categories Links with Sleek tracking */}
          <div className="flex items-center space-x-6 sm:space-x-8 py-2.5 text-xs font-medium uppercase tracking-widest shrink-0">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`btn-nav-cat-${cat.id}`}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`relative py-1 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    active
                      ? "text-black font-bold border-b-2 border-black pb-0.5"
                      : "text-gray-500 hover:text-black"
                  }`}
                >
                  <span>{cat.label}</span>
                  {cat.badge && (
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-blue-600 text-white tracking-normal">
                      {cat.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <button
              id="btn-nav-articles"
              onClick={() => {
                const el = document.getElementById("articles-blog-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="relative py-1 flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-bold transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Tin Tức & Cẩm Nang</span>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-slate-900 text-white">Mới</span>
            </button>
          </div>

          {/* Gender Filter Buttons */}
          <div className="hidden lg:flex items-center gap-1 py-1 shrink-0 text-xs font-medium text-slate-500">
            <span className="text-slate-400 mr-2 text-[11px] uppercase tracking-wider">Đối tượng:</span>
            {[
              { id: "all", label: "Tất cả" },
              { id: "nam", label: "Nam" },
              { id: "nu", label: "Nữ" },
              { id: "unisex", label: "Unisex" },
            ].map((g) => (
              <button
                key={g.id}
                onClick={() => onSelectGender(g.id as any)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  selectedGender === g.id
                    ? "bg-[#0f172a] text-white"
                    : "hover:bg-slate-100 text-slate-600"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white p-4 space-y-4 shadow-xl animate-in slide-in-from-top-2">
          {/* Mobile Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Tìm kiếm mẫu kính..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs"
            />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2 block">Danh mục kính:</span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${
                  selectedCategory === cat.id ? "bg-[#0f172a] text-white" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>{cat.label}</span>
                {cat.badge && <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full">{cat.badge}</span>}
              </button>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                const el = document.getElementById("articles-blog-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-between"
            >
              <span>Tin Tức & Cẩm Nang</span>
              <span className="text-[9px] bg-slate-900 text-white px-1.5 py-0.5 rounded-full">Mới</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onOpenTryOn();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 p-2.5 bg-[#0f172a] text-white rounded-lg text-xs font-bold uppercase tracking-wider"
            >
              <Camera className="w-3.5 h-3.5 text-blue-400" />
              <span>Thử Kính AR</span>
            </button>
            <button
              onClick={() => {
                onOpenFaceAdvisor();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 p-2.5 bg-slate-100 text-slate-900 rounded-lg text-xs font-bold"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Tư Vấn Mặt</span>
            </button>
          </div>
        </div>
      )}

    </header>
  );
};
