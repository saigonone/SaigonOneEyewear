import React, { useState, useMemo } from "react";
import { 
  Eye, 
  Sparkles, 
  Pin, 
  BookOpen, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Phone, 
  MessageSquare, 
  Layers, 
  Search,
  ChevronRight,
  Award,
  Globe,
  Home,
  Tag,
  Clock,
  Filter,
  Check,
  TrendingUp,
  Share2
} from "lucide-react";
import { LensBrandCategory, Article } from "../types";
import { getArticleUrl } from "../utils/routes";
import { sortArticlesByNewest } from "../utils/articleUtils";

interface LensArticlesPageProps {
  articles: Article[];
  lensBrands: LensBrandCategory[];
  onSelectArticle: (article: Article) => void;
  onSelectBrand: (brand: LensBrandCategory) => void;
  onGoHome: () => void;
  onOpenStores: () => void;
  onOpenTryOn: () => void;
  onOpenLensGuide?: () => void;
}

export const LensArticlesPage: React.FC<LensArticlesPageProps> = ({
  articles = [],
  lensBrands = [],
  onSelectArticle,
  onSelectBrand,
  onGoHome,
  onOpenStores,
  onOpenTryOn,
  onOpenLensGuide,
}) => {
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>("all");
  const [selectedFeatureFilter, setSelectedFeatureFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Use lens articles data source directly from Firestore 'lens_articles' collection, sorted newest first
  const allLensArticles = useMemo(() => {
    const raw = (articles || []).filter((art) => Boolean(art && (art.title || (art as any).name || art.id)));
    return sortArticlesByNewest(raw);
  }, [articles]);

  // Filtering based on active brand tab, feature tag, and search query
  const filteredArticles = useMemo(() => {
    return allLensArticles.filter((art) => {
      // 1. Brand Filter
      let matchBrand = true;
      if (selectedBrandFilter !== "all") {
        const foundBrand = lensBrands.find(b => b.id === selectedBrandFilter || b.slug === selectedBrandFilter || b.brandKey === selectedBrandFilter);
        const brandId = foundBrand?.id || selectedBrandFilter;
        const brandSlug = foundBrand?.slug || selectedBrandFilter;
        const brandKey = foundBrand?.brandKey || "";
        const brandName = foundBrand?.name || "";

        const artBrand = art.lensBrandId || "";
        const artTags = Array.isArray(art.tags) ? art.tags : [];
        const artTitle = art.title || "";

        matchBrand = 
          artBrand === brandId ||
          artBrand === brandSlug ||
          (brandKey !== "" && artBrand === brandKey) ||
          artTags.some(t => t.toLowerCase() === brandId.toLowerCase() || (brandKey !== "" && t.toLowerCase() === brandKey.toLowerCase()) || (brandName !== "" && t.toLowerCase().includes(brandName.toLowerCase()))) ||
          artTitle.toLowerCase().includes(brandName.toLowerCase());
      }

      // 2. Feature Filter
      let matchFeature = true;
      if (selectedFeatureFilter !== "all") {
        const qFeat = selectedFeatureFilter.toLowerCase();
        const artTitle = (art.title || "").toLowerCase();
        const artSummary = (art.summary || "").toLowerCase();
        const artTags = Array.isArray(art.tags) ? art.tags.map(t => (t || "").toLowerCase()) : [];
        matchFeature = 
          artTitle.includes(qFeat) || 
          artSummary.includes(qFeat) || 
          artTags.some(t => t.includes(qFeat));
      }

      // 3. Search query
      let matchSearch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const artTitle = (art.title || "").toLowerCase();
        const artSummary = (art.summary || "").toLowerCase();
        const artTags = Array.isArray(art.tags) ? art.tags.map(t => (t || "").toLowerCase()) : [];
        matchSearch = 
          artTitle.includes(q) || 
          artSummary.includes(q) || 
          artTags.some(t => t.includes(q));
      }

      return matchBrand && matchFeature && matchSearch;
    });
  }, [allLensArticles, selectedBrandFilter, selectedFeatureFilter, searchQuery, lensBrands]);

  // Separate pinned vs regular
  const pinnedArticles = useMemo(() => {
    return filteredArticles.filter(a => a.isPinned);
  }, [filteredArticles]);

  const regularArticles = useMemo(() => {
    return filteredArticles.filter(a => !a.isPinned);
  }, [filteredArticles]);

  const getCountryFlag = (country: string = "") => {
    if (country.includes("Nhật")) return "🇯🇵";
    if (country.includes("Mỹ") || country.includes("Hoa Kỳ")) return "🇺🇸";
    if (country.includes("Pháp")) return "🇫🇷";
    if (country.includes("Hàn")) return "🇰🇷";
    if (country.includes("Đức")) return "🇩🇪";
    return "🌐";
  };

  const getAssignedBrandInfo = (art: Article) => {
    if (!art.lensBrandId) {
      // Try to find by title or tags
      const found = lensBrands.find(b => 
        (art.title && art.title.toLowerCase().includes(b.name.toLowerCase())) ||
        (Array.isArray(art.tags) && art.tags.some(t => t.toLowerCase().includes(b.name.toLowerCase()) || (b.brandKey && t.toLowerCase() === b.brandKey.toLowerCase())))
      );
      return found || null;
    }
    return lensBrands.find(b => b.id === art.lensBrandId || b.slug === art.lensBrandId || b.brandKey === art.lensBrandId) || null;
  };

  const featureOptions = [
    { id: "all", label: "Tất Cả Tính Năng" },
    { id: "ánh sáng xanh", label: "Lọc Ánh Sáng Xanh" },
    { id: "đổi màu", label: "Tròng Đổi Màu (Transitions)" },
    { id: "siêu mỏng", label: "Chiết Suất Siêu Mỏng (1.67 / 1.74)" },
    { id: "đa tròng", label: "Đa Tròng Kỹ Thuật Số" },
    { id: "chống trầy", label: "Phủ Nano Chống Trầy & Chống Bám Nước" },
  ];

  return (
    <div id="lens-articles-page" className="min-h-screen bg-[#fafaf9] pb-20">
      
      {/* 1. Breadcrumb Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <button 
              onClick={onGoHome}
              className="flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Trang Chủ</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-slate-900 font-bold">Danh Mục Tròng Kính Chính Hãng</span>
          </nav>
          
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Phân Phối Chính Hãng 100% • Đo Khám Khúc Xạ Chuẩn Y Khoa</span>
          </div>
        </div>
      </div>

      {/* 2. Hero Header Banner */}
      <div className="bg-linear-to-br from-slate-900 via-slate-850 to-blue-950 text-white py-[20px] relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 -bottom-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-400/30 text-cyan-300 text-xs font-bold rounded-full mb-3">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tất Cả Danh Mục Tròng Kính Cao Cấp</span>
            </div>

            <h1 className="text-[38px] font-extrabold tracking-tight text-white mb-3 leading-tight">
              Bảng Giá & Cẩm Nang <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-sky-300 to-amber-300">Tròng Kính Chính Hãng</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 font-normal">
              Tổng hợp đầy đủ các bài viết tư vấn chuyên sâu, phân tích công nghệ phủ Nano, bảng giá cập nhật mới nhất từ các thương hiệu tròng kính hàng đầu thế giới: Hoya (Nhật Bản), Essilor (Pháp), Chemi (Hàn Quốc), Kodak (Mỹ), Zeiss (Đức).
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-xl text-xs text-slate-200 border border-white/10 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Bao bì nguyên tem niêm phong</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-xl text-xs text-slate-200 border border-white/10 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Bóc bao bì trực tiếp trước mặt khách</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-xl text-xs text-slate-200 border border-white/10 font-semibold">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Cắt kính tự động lấy ngay 15 phút</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Brand Selector Cards / Tabs */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Chọn Thương Hiệu Tròng Kính</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Hiển thị {filteredArticles.length} / {allLensArticles.length} bài viết
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {/* Tab: Tất cả */}
            <button
              onClick={() => setSelectedBrandFilter("all")}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedBrandFilter === "all"
                  ? "bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-400/30"
                  : "bg-white hover:bg-slate-50 text-slate-800 border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold">Tất Cả</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-extrabold ${
                  selectedBrandFilter === "all" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                }`}>
                  {allLensArticles.length}
                </span>
              </div>
              <span className={`text-[11px] line-clamp-1 ${selectedBrandFilter === "all" ? "text-blue-100" : "text-slate-500"}`}>
                Mọi thương hiệu
              </span>
            </button>

            {/* Individual Brands */}
            {lensBrands.map((brand) => {
              const isSelected = selectedBrandFilter === brand.id || selectedBrandFilter === brand.slug;
              const count = allLensArticles.filter(a => {
                const bId = brand.id;
                const bSlug = brand.slug;
                const bKey = brand.brandKey || "";
                return a.lensBrandId === bId || a.lensBrandId === bSlug || (bKey && a.lensBrandId === bKey) ||
                  (a.tags && a.tags.some(t => t.toLowerCase().includes(brand.name.toLowerCase()))) ||
                  (a.title && a.title.toLowerCase().includes(brand.name.toLowerCase()));
              }).length;

              return (
                <button
                  key={brand.id}
                  onClick={() => setSelectedBrandFilter(isSelected ? "all" : brand.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-400/30"
                      : "bg-white hover:bg-slate-50 text-slate-800 border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold line-clamp-1">{brand.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-extrabold shrink-0 ${
                      isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                    }`}>
                      {count}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs">{getCountryFlag(brand.country)}</span>
                    <span className={`text-[11px] truncate ${isSelected ? "text-blue-100" : "text-slate-500"}`}>
                      {brand.origin || brand.country}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Feature Quick Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-blue-600" /> Lọc:
            </span>
            {featureOptions.map((feat) => (
              <button
                key={feat.id}
                onClick={() => setSelectedFeatureFilter(feat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedFeatureFilter === feat.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {feat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm bài viết, chiết suất, giá..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 5. Pinned / Featured Articles Section (If any) */}
        {pinnedArticles.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-amber-100 text-amber-800">
                <Pin className="w-3.5 h-3.5 fill-amber-600" />
              </span>
              <h3 className="text-base font-bold text-slate-900">Bài Viết Nổi Bật & Bảng Giá Khuyên Đọc</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pinnedArticles.map((art) => {
                const brandInfo = getAssignedBrandInfo(art);
                return (
                  <div
                    key={art.id}
                    onClick={() => onSelectArticle(art)}
                    className="bg-white rounded-2xl border-2 border-amber-200/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer group hover:-translate-y-1"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-16/9 overflow-hidden bg-slate-100">
                      <img
                        src={art.thumbnail || (art as any).image || (art as any).imageUrl || "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=800"}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xs uppercase tracking-wider">
                          <Pin className="w-2.5 h-2.5 fill-white" /> Ghim Nổi Bật
                        </span>
                      </div>
                      {brandInfo && (
                        <div className="absolute top-3 right-3">
                          <span className="inline-flex items-center gap-1 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                            {getCountryFlag(brandInfo.country)} {brandInfo.name}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1">
                          {art.category || "Tròng Kính Chính Hãng"}
                        </div>
                        <h4 className="font-bold text-slate-900 text-base line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                          {art.title}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed font-normal">
                          {art.summary}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{art.readTime || "4 phút đọc"}</span>
                        </span>
                        <span className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1 text-xs">
                          <span>Xem Chi Tiết</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. All Regular Articles Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Danh Sách Bài Viết Tròng Kính ({regularArticles.length})</span>
            </h3>
          </div>

          {regularArticles.length === 0 && pinnedArticles.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <BookOpen className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Không tìm thấy bài viết tròng kính phù hợp</h4>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Vui lòng thử đổi bộ lọc thương hiệu, tính năng hoặc xóa từ khóa tìm kiếm.
              </p>
              <button
                onClick={() => {
                  setSelectedBrandFilter("all");
                  setSelectedFeatureFilter("all");
                  setSearchQuery("");
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularArticles.map((art) => {
                const brandInfo = getAssignedBrandInfo(art);
                return (
                  <div
                    key={art.id}
                    onClick={() => onSelectArticle(art)}
                    className="bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer group hover:-translate-y-1"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-16/9 overflow-hidden bg-slate-100">
                      <img
                        src={art.thumbnail || (art as any).image || (art as any).imageUrl || "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80&w=800"}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      {brandInfo && (
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center gap-1 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                            {getCountryFlag(brandInfo.country)} {brandInfo.name}
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-3 right-3">
                        <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-xs text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-xs">
                          <Eye className="w-3 h-3 text-slate-400" />
                          <span>{art.viewsCount || 350} lượt xem</span>
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="text-[11px] font-bold text-cyan-700 uppercase tracking-wider mb-1">
                          {art.category || "Tròng Kính"}
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                          {art.title}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed font-normal">
                          {art.summary}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{art.readTime || "4 phút đọc"}</span>
                        </span>
                        <span className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1 text-xs">
                          <span>Xem bài viết</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 7. Consultation Callout Box */}
        <div className="rounded-3xl bg-linear-to-r from-blue-900 via-slate-900 to-indigo-950 text-white p-6 sm:p-10 shadow-xl border border-blue-800/40 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <span className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tư Vấn Chọn Chiết Suất Chuẩn Độ Cận</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold">Bạn chưa biết chọn loại tròng kính nào phù hợp?</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Chuyên viên khúc xạ Saigon One sẽ hỗ trợ tư vấn chiết suất (1.56, 1.60, 1.67, 1.74) và tính năng phù hợp nhất với độ cận, loạn và thói quen sử dụng của bạn.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href="https://zalo.me/0973819928"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg hover:shadow-blue-500/25 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat Zalo Bác Sĩ / Kỹ Thuật Viên</span>
            </a>
            <button
              onClick={onOpenStores}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-2 border border-white/20 transition-all cursor-pointer"
            >
              <Home className="w-4 h-4 text-amber-400" />
              <span>Ghé Cửa Hàng 178 Phan Đăng Lưu</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
