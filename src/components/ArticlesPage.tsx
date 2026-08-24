import React, { useState, useMemo } from "react";
import { 
  BookOpen, 
  Clock, 
  Eye, 
  Calendar, 
  ArrowRight, 
  ChevronRight, 
  Sparkles, 
  User, 
  Filter,
  Search,
  Tag,
  Share2,
  Phone,
  Glasses,
  CheckCircle2,
  Home,
  Bookmark,
  TrendingUp,
  HelpCircle
} from "lucide-react";
import { Article, ArticleCategory } from "../types";
import { getArticleUrl } from "../utils/routes";

interface ArticlesPageProps {
  articles: Article[];
  categories: ArticleCategory[];
  onSelectArticle: (article: Article) => void;
  onGoHome: () => void;
  onOpenStores: () => void;
  onOpenTryOn: () => void;
}

export const ArticlesPage: React.FC<ArticlesPageProps> = ({
  articles = [],
  categories = [],
  onSelectArticle,
  onGoHome,
  onOpenStores,
  onOpenTryOn,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const publishedArticles = useMemo(() => {
    return (articles || []).filter(a => a && a.isPublished !== false);
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return publishedArticles.filter(a => {
      const aCat = (a.category || "").toLowerCase();
      const sCat = (selectedCategory || "").toLowerCase();
      const matchCat = selectedCategory === "all" || aCat === sCat;
      const q = searchQuery.toLowerCase().trim();
      const aTitle = (a.title || "").toLowerCase();
      const aSummary = (a.summary || "").toLowerCase();
      const aTags = Array.isArray(a.tags) ? a.tags : [];
      const matchSearch = q === "" || 
        aTitle.includes(q) ||
        aSummary.includes(q) ||
        aTags.some(t => (t || "").toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [publishedArticles, selectedCategory, searchQuery]);

  const featuredArticle = useMemo(() => {
    return publishedArticles.find(a => a.isFeatured) || publishedArticles[0] || null;
  }, [publishedArticles]);

  const mostViewedArticles = useMemo(() => {
    return [...publishedArticles]
      .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
      .slice(0, 4);
  }, [publishedArticles]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    publishedArticles.forEach(a => {
      if (Array.isArray(a.tags)) {
        a.tags.forEach(t => {
          if (t && typeof t === "string") set.add(t.trim());
        });
      }
    });
    return Array.from(set);
  }, [publishedArticles]);

  return (
    <div id="articles-page" className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* 1. Breadcrumb Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <button 
              onClick={onGoHome}
              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Trang Chủ</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-slate-900 font-bold">Cẩm Nang & Tin Tức Thị Lực</span>
          </nav>
          
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Cập nhật hàng tuần bởi chuyên viên khúc xạ Saigon One</span>
          </div>
        </div>
      </div>

      {/* 2. Hero Header Banner */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Chuyên Mục Cẩm Nang Kính Mắt Y Khoa</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Cẩm Nang & Tin Tức <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-amber-300">
                Thị Lực Saigon One
              </span>
            </h1>
            
            <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Tổng hợp kiến thức chăm sóc mắt, hướng dẫn chọn gọng kính hợp từng dáng khuôn mặt, 
              bảng so sánh chiết suất tròng kính và xu hướng mắt kính thời trang cao cấp 2026.
            </p>

            {/* Search Box in Hero */}
            <div className="mt-6 sm:mt-8 max-w-xl">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết (ví dụ: gọng titan, mặt tròn, ánh sáng xanh...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-24 py-3.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 px-2.5 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-md font-medium"
                  >
                    Xóa
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Category Filter Navigation Bar */}
      <div className="sticky top-14 sm:top-16 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === "all"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Tất Cả Bài Viết ({publishedArticles.length})
              </button>
              
              {(categories || []).map((cat) => {
                const count = publishedArticles.filter(a => (a.category || "").toLowerCase() === (cat.name || "").toLowerCase()).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      (selectedCategory || "").toLowerCase() === (cat.name || "").toLowerCase()
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {cat.name} {count > 0 && `(${count})`}
                  </button>
                );
              })}
            </div>

            {searchQuery && (
              <span className="text-xs text-blue-600 font-semibold shrink-0">
                Tìm thấy {filteredArticles.length} bài viết
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 4. Main Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        
        {/* Featured Big Article when viewing "all" with no search */}
        {selectedCategory === "all" && !searchQuery && featuredArticle && (
          <div className="mb-12">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              <span>Bài Viết Nổi Bật Tuần Này</span>
            </div>

            <a 
              href={getArticleUrl(featuredArticle)}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  onSelectArticle(featuredArticle);
                }
              }}
              className="group bg-white rounded-3xl border border-gray-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 block"
            >
              {/* Featured Image: ~35% width on desktop */}
              <div className="lg:col-span-4 relative h-64 sm:h-80 lg:h-full overflow-hidden bg-slate-900">
                <img
                  src={featuredArticle.thumbnail || "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80"}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-amber-500 text-slate-950 text-xs font-extrabold rounded-lg shadow-md flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 fill-slate-950" /> Tiêu Điểm
                  </span>
                  <span className="px-3 py-1 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-semibold rounded-lg">
                    {featuredArticle.category}
                  </span>
                </div>
              </div>

              {/* Featured Content: ~65% width on desktop */}
              <div className="lg:col-span-8 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-3 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {featuredArticle.publishedAt}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {featuredArticle.readTime}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight mb-4">
                    {featuredArticle.title}
                  </h2>

                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-4 mb-6">
                    {featuredArticle.summary}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {(featuredArticle.tags || []).slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      SO
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{featuredArticle.author}</div>
                      <div className="text-[11px] text-slate-400">Chuyên viên khúc xạ</div>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 group-hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors shadow-xs">
                    <span>Đọc toàn bộ</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </a>
          </div>
        )}

        {/* 2-Column Grid: Articles List + Sticky Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Left Column: Articles Grid (8 cols) */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span>
                  {selectedCategory === "all" ? "Danh Sách Bài Viết" : `Chuyên Mục: ${selectedCategory}`}
                </span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Hiển thị {filteredArticles.length} bài
              </span>
            </div>

            {filteredArticles.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-800">Không tìm thấy bài viết phù hợp</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Hãy thử tìm kiếm với từ khóa khác hoặc chọn xem lại tất cả danh mục bài viết.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                  }}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Xem Tất Cả Bài Viết
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredArticles.map((art) => (
                  <a
                    key={art.id}
                    href={getArticleUrl(art)}
                    onClick={(e) => {
                      if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                        e.preventDefault();
                        onSelectArticle(art);
                      }
                    }}
                    className="group bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between block"
                  >
                    <div>
                      {/* Thumbnail */}
                      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                        <img
                          src={art.thumbnail || "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80"}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-semibold rounded-md">
                            {art.category}
                          </span>
                        </div>
                        <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-slate-950/70 text-slate-200 text-[11px] font-medium rounded flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {art.readTime}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                          <Calendar className="w-3 h-3" />
                          <span>{art.publishedAt}</span>
                          <span>•</span>
                          <Eye className="w-3 h-3" />
                          <span>{(art.viewsCount || 0).toLocaleString("vi-VN")} lượt xem</span>
                        </div>

                        <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2 mb-2.5">
                          {art.title}
                        </h4>

                        <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-4">
                          {art.summary}
                        </p>

                        <div className="flex flex-wrap gap-1">
                          {(art.tags || []).slice(0, 2).map((tag, i) => (
                            <span key={i} className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="px-5 py-3.5 bg-slate-50/70 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium text-[11px]">{art.author}</span>
                      <span className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Chi tiết <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Sticky Sidebar Widgets (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Widget 1: Free Eye Exam CTA */}
            <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md border border-blue-800/40 relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-400 text-slate-950 text-[11px] font-black rounded-md mb-3">
                  <CheckCircle2 className="w-3.5 h-3.5" /> MIỄN PHÍ 100%
                </div>
                
                <h4 className="text-xl font-bold text-white mb-2 leading-tight">
                  Đo Khám Khúc Xạ Chuẩn Y Khoa
                </h4>
                
                <p className="text-slate-300 text-xs leading-relaxed mb-4">
                  Trực tiếp chuyên viên khúc xạ tại <strong>178 Phan Đăng Lưu, Phường Đức Nhuận, TP.HCM</strong>. Cắt kính lấy ngay trong 15-20 phút.
                </p>

                <div className="space-y-2 mb-5 text-xs text-slate-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Máy đo khúc xạ tự động Nidek Nhật Bản</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Kiểm tra thị lực song nhãn 3D</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={onOpenStores}
                    className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-colors text-center shadow-xs"
                  >
                    Xem Địa Chỉ & Đặt Hẹn
                  </button>
                  <a
                    href="tel:0973819928"
                    className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl transition-colors text-center flex items-center justify-center gap-2"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Hotline: 0973.819.928</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Widget 2: Most Viewed Articles */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-blue-600" />
                <span>Xem Nhiều Nhất</span>
              </h4>

              <div className="space-y-3.5">
                {mostViewedArticles.map((art, idx) => (
                  <a
                    key={art.id}
                    href={getArticleUrl(art)}
                    onClick={(e) => {
                      if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                        e.preventDefault();
                        onSelectArticle(art);
                      }
                    }}
                    className="group flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0 block"
                  >
                    <span className="text-lg font-black text-slate-300 group-hover:text-blue-600 transition-colors w-4 shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2 mb-1">
                        {art.title}
                      </h5>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span>{art.publishedAt}</span>
                        <span>•</span>
                        <span>{(art.viewsCount || 0).toLocaleString("vi-VN")} đọc</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Widget 3: Try On AR Banner */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/80 p-5 shadow-xs text-center">
              <div className="w-10 h-10 bg-amber-500 text-white rounded-full flex items-center justify-center mx-auto mb-2.5 shadow-sm">
                <Glasses className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-amber-950 mb-1">
                Thử Gọng Kính AR 3D
              </h4>
              <p className="text-xs text-amber-800/80 mb-3 leading-relaxed">
                Bật camera để thử ngay hàng trăm gọng kính cận & kính mát phù hợp với khuôn mặt bạn.
              </p>
              <button
                onClick={onOpenTryOn}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
              >
                Trải Nghiệm Thử Kính AR
              </button>
            </div>

            {/* Widget 4: Popular Tags Cloud */}
            {allTags.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blue-600" />
                  <span>Từ Khóa Phổ Biến</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {allTags.map((tag, i) => (
                    <button
                      key={i}
                      onClick={() => setSearchQuery(tag)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 text-xs rounded-lg font-medium transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
