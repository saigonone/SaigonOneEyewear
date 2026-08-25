import React, { useState, useRef, useEffect } from "react";
import { 
  Glasses, 
  Search, 
  Heart, 
  MapPin, 
  Phone, 
  Camera, 
  Sparkles, 
  BookOpen, 
  Clock, 
  Menu, 
  X, 
  ChevronDown,
  Info,
  Layers,
  MessageSquare,
  Eye,
  CheckCircle2
} from "lucide-react";
import { ProductCategory, GenderTarget, LensBrandCategory } from "../types";
import { INITIAL_LENS_BRANDS } from "../data/mockLensBrands";

interface HeaderProps {
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenTryOn: () => void;
  onOpenFaceAdvisor: () => void;
  onOpenLensGuide: () => void;
  onOpenStores: () => void;
  onOpenOrderLookup: () => void;
  onOpenAdmin: () => void;
  onOpenAbout: () => void;
  isAboutActive?: boolean;
  onOpenArticles?: () => void;
  isArticlesActive?: boolean;
  onOpenLensArticles?: () => void;
  isLensArticlesActive?: boolean;
  lensBrands?: LensBrandCategory[];
  onSelectLensBrand?: (brand: LensBrandCategory) => void;
  selectedLensBrandSlug?: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  selectedGender: GenderTarget | "all";
  onSelectGender: (g: GenderTarget | "all") => void;
}

export const Header: React.FC<HeaderProps> = ({
  favoritesCount,
  onOpenFavorites,
  onOpenTryOn,
  onOpenFaceAdvisor,
  onOpenLensGuide,
  onOpenStores,
  onOpenOrderLookup,
  onOpenAdmin,
  onOpenAbout,
  isAboutActive = false,
  onOpenArticles,
  isArticlesActive = false,
  onOpenLensArticles,
  isLensArticlesActive = false,
  lensBrands = INITIAL_LENS_BRANDS,
  onSelectLensBrand,
  selectedLensBrandSlug,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  selectedGender,
  onSelectGender,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileLensOpen, setMobileLensOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isLensDropdownOpen, setIsLensDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const lensDropdownRef = useRef<HTMLDivElement>(null);

  const activeLensBrands = lensBrands.filter(b => b.isActive !== false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProductsDropdownOpen(false);
      }
      if (lensDropdownRef.current && !lensDropdownRef.current.contains(event.target as Node)) {
        setIsLensDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const subCategories: { id: ProductCategory; label: string; desc: string }[] = [
    { id: "all", label: "Tất Cả Sản Phẩm", desc: "Xem toàn bộ bộ sưu tập kính mắt 2026" },
    { id: "gong-kinh-can", label: "Gọng Kính Cận", desc: "Titanium, Acetate, TR90 dẻo dai siêu nhẹ" },
    { id: "kinh-ram-mat", label: "Kính Thời Trang", desc: "Kính mát phân cực Polarized chống tia UV400" },
    { id: "kinh-doi-mau", label: "Kính Áp Tròng", desc: "Kính áp tròng êm ái & kính đổi màu tiện lợi" },
    { id: "trong-kinh", label: "Bảng Giá Tròng Kính", desc: "Tròng lọc ánh sáng xanh & siêu mỏng 1.67/1.74" },
  ];

  const handleSelectSubCategory = (cat: ProductCategory) => {
    onSelectCategory(cat);
    setIsProductsDropdownOpen(false);
    setMobileMenuOpen(false);
    const el = document.getElementById("products-catalog-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleChooseBrand = (brand: LensBrandCategory) => {
    setIsLensDropdownOpen(false);
    setMobileMenuOpen(false);
    if (onSelectLensBrand) {
      onSelectLensBrand(brand);
    }
  };

  // Helper flags for countries
  const getCountryBadge = (country: string) => {
    if (country.includes("Nhật")) return "🇯🇵 Nhật Bản";
    if (country.includes("Mỹ") || country.includes("Hoa Kỳ")) return "🇺🇸 Mỹ";
    if (country.includes("Pháp")) return "🇫🇷 Pháp";
    if (country.includes("Hàn")) return "🇰🇷 Hàn Quốc";
    if (country.includes("Đức")) return "🇩🇪 Đức";
    return country;
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs border-b border-neutral-200">
      
      {/* Top Black VIP Bar */}
      <div className="bg-[#18181b] text-neutral-300 text-xs py-2 px-4 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 text-xs truncate">
            <span className="font-extrabold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
              DỊCH VỤ VIP
            </span>
            <span className="text-neutral-200 font-medium hidden sm:inline">
              Khám đo khúc xạ chuẩn y khoa miễn phí & Cắt kính lấy ngay trong 15 phút tại 178 Phan Đăng Lưu!
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs font-semibold shrink-0">
            <a 
              href="tel:0973819928"
              className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Hotline: 0973.819.928</span>
            </a>
            <span className="text-neutral-700">|</span>
            <button
              id="btn-header-admin-toggle"
              onClick={onOpenAdmin}
              className="hover:text-white transition-colors flex items-center gap-1.5 text-neutral-400 hover:text-white cursor-pointer"
              title="Khu vực quản trị"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Quản Trị</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Header Nav Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Mobile menu button */}
        <button 
          id="btn-mobile-menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-neutral-700 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 cursor-pointer shrink-0"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo - Saigon One */}
        <div 
          className="flex items-center gap-2 cursor-pointer select-none shrink-0" 
          onClick={() => onSelectCategory("all")}
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#0f172a] rounded-lg flex items-center justify-center shadow-md shrink-0">
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            </div>
          </div>
          <div className="whitespace-nowrap shrink-0">
            <div className="text-base sm:text-lg xl:text-xl font-bold tracking-tight uppercase text-slate-900 leading-none whitespace-nowrap">
              SAIGON ONE<span className="text-blue-600">.</span>
            </div>
            <p className="text-[8.5px] sm:text-[9.5px] font-bold text-slate-400 uppercase tracking-[0.16em] sm:tracking-[0.18em] mt-0.5 whitespace-nowrap">
              PREMIUM OPTICAL SOLUTIONS
            </p>
          </div>
        </div>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-3.5 xl:space-x-5 text-[13.5px] xl:text-[14.5px] font-bold text-neutral-800 whitespace-nowrap">
          
          {/* 1. Trang Chủ */}
          <button
            id="nav-link-home"
            onClick={() => onSelectCategory("all")}
            className={`transition-colors py-1 cursor-pointer whitespace-nowrap ${
              selectedCategory === "all" && !isAboutActive && !isArticlesActive && !selectedLensBrandSlug
                ? "text-amber-800 font-extrabold"
                : "text-neutral-700 hover:text-amber-800"
            }`}
          >
            Trang Chủ
          </button>

          {/* 2. Giới Thiệu Saigon One */}
          <button
            id="nav-link-about"
            onClick={onOpenAbout}
            className={`transition-colors py-1 cursor-pointer whitespace-nowrap ${
              isAboutActive
                ? "text-amber-800 font-extrabold"
                : "text-neutral-700 hover:text-amber-800"
            }`}
          >
            Giới Thiệu
          </button>

          {/* 3. Tất Cả Sản Phẩm with Dropdown Submenu */}
          <div 
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setIsProductsDropdownOpen(true)}
            onMouseLeave={() => setIsProductsDropdownOpen(false)}
          >
            <button
              id="nav-link-products-dropdown"
              onClick={() => {
                setIsProductsDropdownOpen(!isProductsDropdownOpen);
                onSelectCategory("all");
              }}
              className={`flex items-center gap-1 py-1 transition-colors cursor-pointer whitespace-nowrap ${
                !isAboutActive && !isArticlesActive && !selectedLensBrandSlug && (selectedCategory !== "all" || isProductsDropdownOpen)
                  ? "text-amber-800 font-extrabold"
                  : "text-neutral-700 hover:text-amber-800"
              }`}
            >
              <span>Sản Phẩm</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isProductsDropdownOpen ? "rotate-180 text-amber-600" : "text-neutral-400"}`} />
            </button>

            {/* Submenu Dropdown */}
            {isProductsDropdownOpen && (
              <div className="absolute top-full left-0 w-72 bg-white rounded-2xl shadow-xl border border-neutral-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-3 py-1.5 border-b border-neutral-100">
                  Danh Mục Sản Phẩm
                </div>
                <div className="py-1 space-y-1">
                  {subCategories.map((sub) => {
                    const isSubActive = selectedCategory === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => handleSelectSubCategory(sub.id)}
                        className={`w-full text-left px-3 py-2 rounded-xl transition-all flex flex-col cursor-pointer ${
                          isSubActive
                            ? "bg-amber-50 text-amber-950 font-bold border border-amber-200/80"
                            : "hover:bg-neutral-50 text-neutral-800"
                        }`}
                      >
                        <span className="text-xs font-bold">{sub.label}</span>
                        <span className="text-[10px] text-neutral-500 font-normal mt-0.5">{sub.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 4. Tròng Kính Dropdown Menu (Hoya, Kodak, Essilor, Chemi, Zeiss...) */}
          <div 
            ref={lensDropdownRef}
            className="relative"
            onMouseEnter={() => setIsLensDropdownOpen(true)}
            onMouseLeave={() => setIsLensDropdownOpen(false)}
          >
            <button
              id="nav-link-lens-dropdown"
              onClick={() => {
                if (onOpenLensArticles) {
                  onOpenLensArticles();
                } else {
                  onSelectCategory("trong-kinh");
                }
                setIsLensDropdownOpen(false);
              }}
              className={`flex items-center gap-1 py-1 transition-colors cursor-pointer whitespace-nowrap ${
                isLensArticlesActive || Boolean(selectedLensBrandSlug) || isLensDropdownOpen
                  ? "text-amber-800 font-extrabold"
                  : "text-neutral-700 hover:text-amber-800"
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              <span>Tròng Kính</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isLensDropdownOpen ? "rotate-180 text-amber-600" : "text-neutral-400"}`} />
            </button>

            {/* Lens Brands Submenu */}
            {isLensDropdownOpen && (
              <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-neutral-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-neutral-100">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Thương Hiệu Tròng Kính
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    Chính Hãng
                  </span>
                </div>

                <div className="py-1.5 space-y-0.5">
                  {activeLensBrands.map((brand) => {
                    const isSelected = selectedLensBrandSlug === brand.slug;
                    return (
                      <button
                        key={brand.id}
                        id={`nav-lens-brand-${brand.brandKey || brand.id}`}
                        onClick={() => handleChooseBrand(brand)}
                        className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between gap-2 cursor-pointer group ${
                          isSelected
                            ? "bg-amber-50 text-amber-950 font-bold border border-amber-200/80"
                            : "hover:bg-neutral-50 text-neutral-800"
                        }`}
                      >
                        <span className="text-xs font-bold group-hover:text-blue-600 transition-colors">
                          {brand.name}
                        </span>
                        <span className="text-[10px] font-semibold bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full shrink-0 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                          {getCountryBadge(brand.country)}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-neutral-100">
                  <button
                    onClick={() => {
                      if (onOpenLensArticles) {
                        onOpenLensArticles();
                      } else {
                        onSelectCategory("trong-kinh");
                      }
                      setIsLensDropdownOpen(false);
                    }}
                    className="w-full text-center py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span>Xem Tất Cả Bài Viết Tròng Kính</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 5. Cẩm Nang (Đã rút gọn bỏ "Tin tức") */}
          <button
            id="nav-link-articles"
            onClick={() => {
              if (onOpenArticles) {
                onOpenArticles();
              } else {
                const el = document.getElementById("articles-blog-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className={`transition-colors py-1 cursor-pointer whitespace-nowrap ${
              isArticlesActive && !selectedLensBrandSlug
                ? "text-amber-800 font-extrabold"
                : "text-neutral-700 hover:text-amber-800"
            }`}
          >
            Cẩm Nang
          </button>

          {/* 6. Liên Hệ (Ở cuối menu) */}
          <button
            id="nav-link-contact"
            onClick={onOpenStores}
            className="transition-colors py-1 cursor-pointer whitespace-nowrap text-neutral-700 hover:text-amber-800 flex items-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            <span>Liên Hệ</span>
          </button>
        </nav>

        {/* Right Actions: Search, TryOn & Zalo Button */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          
          {/* Search Toggle or Search Box */}
          <div className="relative">
            {showSearchInput ? (
              <div className="flex items-center bg-neutral-100 rounded-full px-3 py-1.5 border border-neutral-300 w-40 sm:w-52 animate-in fade-in">
                <Search className="w-4 h-4 text-neutral-500 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Tìm gọng kính, tròng..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  autoFocus
                  className="w-full bg-transparent text-xs text-neutral-900 focus:outline-none"
                />
                <button 
                  onClick={() => {
                    setShowSearchInput(false);
                    onSearchChange("");
                  }}
                  className="text-neutral-400 hover:text-neutral-700 ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                id="btn-header-search-toggle"
                onClick={() => setShowSearchInput(true)}
                className="p-2 text-neutral-700 hover:text-amber-800 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
                aria-label="Tìm kiếm"
                title="Tìm kiếm sản phẩm"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>

          {/* AR Try-On quick icon */}
          <button
            id="btn-header-tryon-modal"
            onClick={onOpenTryOn}
            className="hidden md:flex items-center gap-1.5 text-neutral-700 hover:text-amber-800 px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-neutral-100 transition-all cursor-pointer border border-neutral-200"
            title="Thử Kính AR 3D"
          >
            <Camera className="w-3.5 h-3.5 text-amber-600" />
            <span>Thử Kính AR</span>
          </button>

          {/* Zalo Button (Gọn gàng) */}
          <a
            id="btn-header-chat-zalo"
            href="https://zalo.me/0973819928"
            target="_blank"
            rel="noreferrer"
            className="bg-[#0068FF] hover:bg-[#0052cc] text-white font-bold text-xs uppercase px-3 py-1.5 sm:py-2 rounded-full shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            title="Nhắn Zalo tư vấn 0973.819.928"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-white text-[#0068FF] shrink-0" />
            <span className="text-[11px] font-extrabold tracking-wider">ZALO</span>
          </a>

        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-white p-4 space-y-4 shadow-xl animate-in slide-from-top-2">
          {/* Mobile Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Tìm kiếm mẫu kính, mã SP..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-full text-xs"
            />
          </div>

          <div className="space-y-1">
            {/* 1. Trang Chủ */}
            <button
              id="mobile-nav-home"
              onClick={() => {
                onSelectCategory("all");
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold tracking-tight transition-colors ${
                selectedCategory === "all" && !isAboutActive && !isArticlesActive && !selectedLensBrandSlug
                  ? "bg-amber-100 text-amber-900 font-extrabold"
                  : "text-neutral-800 hover:bg-neutral-50"
              }`}
            >
              Trang Chủ
            </button>

            {/* 2. Giới Thiệu Saigon One */}
            <button
              id="mobile-nav-about"
              onClick={() => {
                onOpenAbout();
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold tracking-tight transition-colors ${
                isAboutActive
                  ? "bg-amber-100 text-amber-900 font-extrabold"
                  : "text-neutral-800 hover:bg-neutral-50"
              }`}
            >
              Giới Thiệu Saigon One
            </button>

            {/* 3. Sản Phẩm with Collapsible Submenu */}
            <div className="border border-neutral-100 rounded-xl overflow-hidden">
              <button
                id="mobile-nav-products-toggle"
                onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-neutral-50 text-sm font-bold tracking-tight text-neutral-800"
              >
                <span>Sản Phẩm</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileProductsOpen ? "rotate-180" : ""}`} />
              </button>

              {mobileProductsOpen && (
                <div className="p-2 space-y-1 bg-white">
                  {subCategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleSelectSubCategory(sub.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                        selectedCategory === sub.id
                          ? "bg-amber-50 text-amber-900 font-bold"
                          : "text-neutral-600 hover:bg-neutral-50"
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Tròng Kính with Collapsible Submenu */}
            <div className="border border-blue-100/60 rounded-xl overflow-hidden">
              <button
                id="mobile-nav-lens-toggle"
                onClick={() => setMobileLensOpen(!mobileLensOpen)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-blue-50/50 text-sm font-bold tracking-tight text-blue-950"
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span>Tròng Kính</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileLensOpen ? "rotate-180" : ""}`} />
              </button>

              {mobileLensOpen && (
                <div className="p-2 space-y-1 bg-white">
                  <button
                    onClick={() => {
                      if (onOpenLensArticles) {
                        onOpenLensArticles();
                      } else {
                        handleSelectSubCategory("trong-kinh");
                      }
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-blue-800 bg-blue-50/80 mb-1 flex items-center gap-1.5"
                  >
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span>Xem Tất Cả Bài Viết Tròng Kính</span>
                  </button>
                  {activeLensBrands.map((brand) => (
                    <button
                      key={brand.id}
                      onClick={() => handleChooseBrand(brand)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                        selectedLensBrandSlug === brand.slug
                          ? "bg-blue-50 text-blue-900 font-bold"
                          : "text-neutral-700 hover:bg-neutral-50"
                      }`}
                    >
                      <span>{brand.name}</span>
                      <span className="text-[10px] text-neutral-500 font-semibold">{getCountryBadge(brand.country)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 5. Cẩm Nang (Đã rút gọn bỏ tin tức) */}
            <button
              id="mobile-nav-articles"
              onClick={() => {
                if (onOpenArticles) {
                  onOpenArticles();
                } else {
                  const el = document.getElementById("articles-blog-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold tracking-tight ${
                isArticlesActive && !selectedLensBrandSlug ? "bg-amber-50 text-amber-900 font-black" : "text-neutral-800 hover:bg-neutral-50"
              }`}
            >
              Cẩm Nang
            </button>

            {/* 6. Liên Hệ (Ở cuối menu) */}
            <button
              id="mobile-nav-contact"
              onClick={() => {
                onOpenStores();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold tracking-tight text-neutral-800 hover:bg-neutral-50 flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>Liên Hệ</span>
            </button>
          </div>

          <div className="pt-3 border-t border-neutral-100 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onOpenTryOn();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 p-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>Thử Kính AR</span>
            </button>
            <a
              href="https://zalo.me/0973819928"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 p-2.5 bg-[#0068FF] text-white rounded-xl text-xs font-bold"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-white" />
              <span>Zalo Tư Vấn</span>
            </a>
          </div>
        </div>
      )}

    </header>
  );
};



