import React, { useState } from "react";
import { 
  Eye, 
  Sparkles, 
  Pin, 
  BookOpen, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Phone, 
  MessageSquare, 
  Layers, 
  Search,
  ExternalLink,
  ChevronRight,
  Award,
  Globe
} from "lucide-react";
import { LensBrandCategory, Article } from "../types";

interface LensBrandDetailProps {
  brand: LensBrandCategory;
  articles: Article[];
  allBrands: LensBrandCategory[];
  onSelectBrand: (brand: LensBrandCategory) => void;
  onReadArticle?: (article: Article) => void;
  onSelectArticle?: (article: Article) => void;
  onOpenConsultation?: () => void;
  onBackToHome?: () => void;
  onGoHome?: () => void;
  onOpenStores?: () => void;
  onOpenTryOn?: () => void;
  onOpenLensGuide?: () => void;
  onOpenLensArticles?: () => void;
}

export const LensBrandDetail: React.FC<LensBrandDetailProps> = ({
  brand,
  articles = [],
  allBrands = [],
  onSelectBrand,
  onReadArticle,
  onSelectArticle,
  onOpenConsultation,
  onBackToHome,
  onGoHome,
  onOpenStores,
  onOpenTryOn,
  onOpenLensGuide,
  onOpenLensArticles,
}) => {
  if (!brand) {
    return null;
  }

  const handleArticleClick = (art: Article) => {

    if (onSelectArticle) {
      onSelectArticle(art);
    } else if (onReadArticle) {
      onReadArticle(art);
    }
  };

  const handleHomeClick = () => {
    if (onGoHome) {
      onGoHome();
    } else if (onBackToHome) {
      onBackToHome();
    }
  };

  const [searchFilter, setSearchFilter] = useState("");

  // Filter articles for this brand
  const brandArticles = articles.filter((art) => {
    if (!art) return false;
    const bKey = (brand.brandKey || "").toLowerCase();
    const bId = (brand.id || "").toLowerCase();
    const bSlug = (brand.slug || "").toLowerCase();
    const bName = (brand.name || "").toLowerCase();
    
    const artBrand = (art.lensBrandId || "").toLowerCase();
    const artTags = Array.isArray(art.tags) ? art.tags.map(t => (t || "").toLowerCase()) : [];
    const artTitle = (art.title || "").toLowerCase();
    const artCat = (art.category || "").toLowerCase();

    return (
      artBrand === bId ||
      artBrand === bKey ||
      artBrand === bSlug ||
      artCat.includes(bName) ||
      (bKey && artCat.includes(bKey)) ||
      artTags.includes(bId) ||
      (bKey && artTags.includes(bKey)) ||
      artTags.some(t => t.includes(bName) || (bKey && t.includes(bKey))) ||
      artTitle.includes(bName) ||
      (bKey && artTitle.includes(bKey))
    );
  });

  // Search filtered
  const displayedArticles = brandArticles.filter((art) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      art.title.toLowerCase().includes(q) ||
      art.summary.toLowerCase().includes(q) ||
      (art.tags && art.tags.some((t) => t.toLowerCase().includes(q)))
    );
  });

  // Separate pinned articles
  const pinnedArticles = displayedArticles.filter((art) => art.isPinned);
  const regularArticles = displayedArticles.filter((art) => !art.isPinned);

  const getCountryFlag = (country: string) => {
    if (country.includes("Nhật")) return "🇯🇵";
    if (country.includes("Mỹ") || country.includes("Hoa Kỳ")) return "🇺🇸";
    if (country.includes("Pháp")) return "🇫🇷";
    if (country.includes("Hàn")) return "🇰🇷";
    if (country.includes("Đức")) return "🇩🇪";
    return "🌐";
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-neutral-500 font-medium overflow-x-auto pb-1">
          <button 
            onClick={handleHomeClick}
            className="hover:text-blue-600 transition-colors cursor-pointer shrink-0"
          >
            Trang Chủ
          </button>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 text-neutral-400" />
          <button
            onClick={() => {
              if (onOpenLensArticles) {
                onOpenLensArticles();
              } else {
                handleHomeClick();
              }
            }}
            className="text-neutral-600 hover:text-blue-600 transition-colors cursor-pointer shrink-0"
          >
            Tròng Kính
          </button>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 text-neutral-400" />
          <span className="text-neutral-900 font-bold shrink-0">{brand.name}</span>
        </nav>

        {/* Brand Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-indigo-950 text-white shadow-xl p-6 sm:p-10 border border-slate-700/50">
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute right-1/4 -bottom-16 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              
              {/* Badge & Country */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-xs text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-white/15">
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  <span>{getCountryFlag(brand.country)} {brand.country}</span>
                </span>
                <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Chính Hãng Phân Phối 100%</span>
                </span>
                <span className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full border border-blue-500/30">
                  <Award className="w-3.5 h-3.5" />
                  <span>Bảo Hành 12 Tháng</span>
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                {brand.name}
              </h1>

              {/* Tagline / Description */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                {brand.description || "Khám phá danh mục bảng giá và kiến thức toàn diện về các dòng tròng kính cao cấp, chuẩn y khoa tại Saigon One."}
              </p>

              {/* Quick Tech Highlights */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-xs bg-slate-800/80 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  Lọc ánh sáng xanh UV420
                </span>
                <span className="text-xs bg-slate-800/80 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  Chiết suất siêu mỏng 1.60 / 1.67 / 1.74
                </span>
                <span className="text-xs bg-slate-800/80 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  Phủ chống xước Nano cao cấp
                </span>
              </div>
            </div>

            {/* Quick Consultation Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shrink-0 lg:w-72 flex flex-col justify-between space-y-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-300">Tư vấn đo lắp tròng</p>
                <p className="text-xs text-slate-200 mt-1">Cắt kính lấy ngay trong 15 phút tại 178 Phan Đăng Lưu, Phú Nhuận</p>
              </div>
              <div className="space-y-2">
                <a
                  href="https://zalo.me/0973819928"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-[#0068FF] hover:bg-[#0052cc] text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat Zalo Báo Giá</span>
                </a>
                <a
                  href="tel:0973819928"
                  className="w-full bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span>Hotline: 0973.819.928</span>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Other Brands Quick Tabs */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-neutral-200">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Khám Phá Các Thương Hiệu Tròng Kính Khác:</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {allBrands.map((b) => {
              const isCurrent = b.id === brand.id;
              return (
                <button
                  key={b.id}
                  onClick={() => onSelectBrand(b)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isCurrent
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                  }`}
                >
                  <span>{getCountryFlag(b.country)}</span>
                  <span>{b.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Filter within this Brand Articles */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>Bài Viết & Bảng Giá Về {brand.name}</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Tổng hợp {brandArticles.length} bài viết hướng dẫn chuyên sâu, so sánh chiết suất và bảng giá mới nhất
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={`Tìm bài viết về ${brand.name}...`}
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        {/* PINNED / FEATURED ARTICLES SECTION (Ghép bài viết nổi bật lên trên cùng) */}
        {pinnedArticles.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-900 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-500/20">
                <Pin className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>BÀI VIẾT NỔI BẬT ĐƯỢC GHIM LÊN ĐẦU</span>
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pinnedArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => handleArticleClick(article)}
                  className="group bg-white rounded-3xl overflow-hidden border-2 border-amber-300 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
                >
                  {/* Article Thumbnail */}
                  <div className="relative aspect-16/9 overflow-hidden bg-neutral-100">
                    <img
                      src={article.thumbnail || (article as any).image || (article as any).imageUrl || "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=900&q=80"}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="bg-amber-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                        <Pin className="w-3 h-3 fill-white" />
                        Ghim Nổi Bật
                      </span>
                      <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="p-6 flex flex-col justify-between flex-1 space-y-4 bg-linear-to-b from-amber-50/30 to-white">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3 text-xs text-neutral-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{article.readTime || "4 phút đọc"}</span>
                        </span>
                        <span>•</span>
                        <span className="text-amber-800 font-semibold">{article.author || "Saigon One"}</span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-neutral-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                        {article.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed line-clamp-3">
                        {article.summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {article.tags?.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="text-[10px] font-medium bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Đọc Chi Tiết</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REGULAR ARTICLES LIST */}
        <div className="space-y-4">
          {pinnedArticles.length > 0 && regularArticles.length > 0 && (
            <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider pt-4 border-t border-neutral-200">
              Các Bài Viết Khác Về {brand.name}
            </h3>
          )}

          {displayedArticles.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200 space-y-4">
              <BookOpen className="w-12 h-12 text-neutral-300 mx-auto" />
              <div className="space-y-1">
                <p className="text-base font-bold text-neutral-800">Chưa có bài viết nào về danh mục này</p>
                <p className="text-xs text-neutral-500 max-w-md mx-auto">
                  Bạn có thể thêm bài viết mới cho thương hiệu {brand.name} trong trang Quản Trị (Admin Panel).
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => handleArticleClick(article)}
                  className="group bg-white rounded-2xl overflow-hidden border border-neutral-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-16/10 overflow-hidden bg-neutral-100">
                    <img
                      src={article.thumbnail || (article as any).image || (article as any).imageUrl || "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=900&q=80"}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                      {article.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col justify-between flex-1 space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{article.readTime || "4 phút đọc"}</span>
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-neutral-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h4>

                      <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                        {article.summary}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-medium text-neutral-500 truncate max-w-[140px]">
                        Tác giả: {article.author}
                      </span>
                      <span className="font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Đọc tiếp</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Commitment Box */}
        <div className="bg-linear-to-r from-blue-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-amber-300">
              Cam Kết Phân Phối Tròng Kính Chính Hãng Tại Saigon One
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Mọi sản phẩm tròng {brand.name} đều có đầy đủ bao bì, tem niêm phong chống hàng giả, thẻ bảo hành chính hãng và được mài lắp tự động bằng máy CNC độ chính xác 0.01mm.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:0973819928"
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold px-4 py-3 rounded-xl transition-colors flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>0973.819.928</span>
            </a>
            <a
              href="https://zalo.me/0973819928"
              target="_blank"
              rel="noreferrer"
              className="bg-[#0068FF] hover:bg-[#0052cc] text-white text-xs font-bold px-4 py-3 rounded-xl transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Zalo Tư Vấn</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
