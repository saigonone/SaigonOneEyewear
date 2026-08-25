import React, { useState } from "react";
import { 
  BookOpen, 
  Clock, 
  Eye, 
  Calendar, 
  ArrowRight, 
  ChevronRight, 
  Sparkles, 
  User,
  Flame,
  TrendingUp,
  BookmarkCheck
} from "lucide-react";
import { Article, ArticleCategory } from "../types";
import { getArticleUrl } from "../utils/routes";

interface LatestArticlesSectionProps {
  articles: Article[];
  categories: ArticleCategory[];
  onSelectArticle: (article: Article) => void;
  onOpenAllArticles?: () => void;
}

export const LatestArticlesSection: React.FC<LatestArticlesSectionProps> = ({
  articles,
  categories,
  onSelectArticle,
  onOpenAllArticles,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const isLensArticle = (art: Article): boolean => {
    if (!art) return false;
    if (art.lensBrandId) return true;
    const cat = (art.category || "").toLowerCase();
    if (cat.includes("tròng kính") || cat.startsWith("tròng") || cat === "trong-kinh") return true;
    const tags = Array.isArray(art.tags) ? art.tags : [];
    if (tags.some(t => t && ["hoya", "kodak", "essilor", "chemi", "zeiss"].includes(t.toLowerCase()))) return true;
    return false;
  };

  const generalCategories = categories.filter(c => {
    const name = (c.name || "").toLowerCase();
    const slug = (c.slug || "").toLowerCase();
    return !name.includes("tròng") && !slug.includes("trong-kinh");
  });

  const publishedArticles = articles.filter(a => a && a.isPublished !== false && !isLensArticle(a));

  const filteredArticles = selectedCategory === "all" 
    ? publishedArticles 
    : publishedArticles.filter(a => a.category === selectedCategory);

  // Pick the featured article (either explicitly marked featured or the first one in list)
  const featuredArticle = filteredArticles.find(a => a.isFeatured) || filteredArticles[0] || publishedArticles[0];
  
  // Secondary 3 articles (excluding the active featured one)
  const secondaryArticles = filteredArticles
    .filter(a => a.id !== featuredArticle?.id)
    .slice(0, 3);

  // If there are less than 3 secondary articles in the filtered category, fallback to other published articles
  const filledSecondaryArticles = secondaryArticles.length >= 3
    ? secondaryArticles
    : [
        ...secondaryArticles,
        ...publishedArticles
          .filter(a => a.id !== featuredArticle?.id && !secondaryArticles.some(s => s.id === a.id))
          .slice(0, 3 - secondaryArticles.length)
      ];

  // Exclude featured and secondary 3 articles to get next 6 bottom articles
  const topIds = new Set([featuredArticle?.id, ...filledSecondaryArticles.map(a => a.id)]);
  const bottomCategoryArticles = filteredArticles.filter(a => !topIds.has(a.id));
  const bottomArticles = bottomCategoryArticles.length >= 6
    ? bottomCategoryArticles.slice(0, 6)
    : [
        ...bottomCategoryArticles,
        ...publishedArticles.filter(a => !topIds.has(a.id) && !bottomCategoryArticles.some(b => b.id === a.id))
      ].slice(0, 6);

  const handleArticleClick = (e: React.MouseEvent<HTMLAnchorElement>, art: Article) => {
    if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      onSelectArticle(art);
    }
  };

  return (
    <section id="articles-blog-section" className="py-4 sm:py-5 bg-[#fbfaf8] border-t border-stone-200/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 sm:mb-10 pb-6 border-b border-stone-200 gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-100/80 border border-amber-300/70 text-amber-900 text-xs font-bold rounded-full mb-3 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Cẩm Nang & Xu Hướng Thị Lực</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-sans text-stone-950 tracking-tight">
              Góc Tư Vấn & Cẩm Nang Mắt Kính
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Kiến thức y khoa khúc xạ, mẹo chọn dáng kính chuẩn tỉ lệ khuôn mặt và xu hướng thời trang mắt kính chính hãng.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-stone-900 text-white shadow-sm ring-1 ring-stone-900"
                  : "bg-white text-stone-600 border border-stone-200/90 hover:bg-stone-100 hover:text-stone-900"
              }`}
            >
              Tất Cả
            </button>
            {generalCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.name
                    ? "bg-stone-900 text-white shadow-sm ring-1 ring-stone-900"
                    : "bg-white text-stone-600 border border-stone-200/90 hover:bg-stone-100 hover:text-stone-900"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Top Magazine 2-Column Grid (Left 55% Featured / Right 45% Secondary 3 articles) */}
        <div className="grid grid-cols-1 lg:grid-cols-20 gap-6 lg:gap-8 items-stretch mb-10 sm:mb-12">
          
          {/* LEFT 55% (11 cols of 20 = 55%): Featured Article */}
          {featuredArticle && (
            <div className="lg:col-span-11 flex">
              <a
                href={getArticleUrl(featuredArticle)}
                onClick={(e) => handleArticleClick(e, featuredArticle)}
                className="group relative bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between w-full cursor-pointer no-underline block"
              >
                {/* Top Image Box */}
                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-stone-900 shrink-0">
                  <img
                    src={featuredArticle.thumbnail || "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=1200&q=80"}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-70 group-hover:opacity-50 transition-opacity" />
                  
                  {/* Badges on Image */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 bg-amber-600 text-white text-[11px] font-extrabold uppercase tracking-wider rounded-lg shadow-sm flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      <span>Bài Viết Tiêu Điểm</span>
                    </span>
                    <span className="px-3 py-1 bg-stone-900/85 backdrop-blur-xs text-stone-100 text-[11px] font-bold rounded-lg border border-white/20">
                      {featuredArticle.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-4 px-2.5 py-1 bg-black/65 backdrop-blur-xs text-stone-200 text-xs font-semibold rounded-md flex items-center gap-1.5 border border-white/10">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{featuredArticle.readTime}</span>
                  </div>
                </div>

                {/* Bottom Content Excerpt Box */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    {/* Meta Row: Reading time (No published date or views) */}
                    <div className="flex items-center gap-2.5 text-xs text-stone-500 font-medium mb-3">
                      <span className="px-2.5 py-0.5 bg-amber-50 text-amber-900 border border-amber-200/80 font-bold rounded text-[11px]">
                        {featuredArticle.category}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-stone-500">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        {featuredArticle.readTime}
                      </span>
                    </div>

                    {/* Main Headline - Znews Style: Bold, Crisp Sans-Serif, Larger Size */}
                    <h3 className="text-xl sm:text-2xl lg:text-[28px] font-bold font-sans text-stone-950 group-hover:text-amber-800 transition-colors leading-snug sm:leading-tight mb-3 line-clamp-2 tracking-tight">
                      {featuredArticle.title}
                    </h3>

                    {/* Short Summary Excerpt - Larger, Clearer */}
                    <p className="text-stone-600 text-sm sm:text-[15px] leading-relaxed line-clamp-3 sm:line-clamp-4 mb-5">
                      {featuredArticle.summary}
                    </p>
                  </div>

                  {/* Author & Action Footer */}
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-bold text-stone-900 block leading-tight">{featuredArticle.author}</span>
                        <span className="text-[10px] text-stone-400">Cố Vấn Thị Lực Sài Gòn One</span>
                      </div>
                    </div>
                    
                    <span className="inline-flex items-center gap-1.5 font-extrabold text-amber-800 group-hover:text-amber-950 group-hover:translate-x-1 transition-all bg-amber-50 group-hover:bg-amber-100/80 px-3.5 py-1.5 rounded-xl border border-amber-200/70">
                      <span>Đọc bài viết</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </a>
            </div>
          )}

          {/* RIGHT 45% (9 cols of 20 = 45%): 3 Secondary Articles with Short Summary */}
          <div className="lg:col-span-9 flex flex-col justify-between gap-4">
            {filledSecondaryArticles.map((art, idx) => (
              <a
                key={art.id || idx}
                href={getArticleUrl(art)}
                onClick={(e) => handleArticleClick(e, art)}
                className="group relative bg-white rounded-2xl border border-stone-200/90 hover:border-stone-300 p-4 sm:p-4.5 shadow-2xs hover:shadow-lg transition-all duration-300 flex items-start gap-4 flex-1 cursor-pointer no-underline block"
              >
                {/* Thumbnail on Left */}
                <div className="relative w-28 sm:w-36 md:w-40 aspect-[4/3] rounded-xl overflow-hidden bg-stone-900 shrink-0 mt-0.5">
                  <img
                    src={art.thumbnail || "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=400&q=80"}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-1.5 left-1.5">
                    <span className="px-1.5 py-0.5 bg-stone-950/80 backdrop-blur-xs text-white text-[9px] font-bold rounded">
                      #{idx + 1}
                    </span>
                  </div>
                </div>

                {/* Right Details in Item (Title + Excerpt + Meta) */}
                <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                  <div>
                    {/* Category */}
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-semibold mb-1.5">
                      <span className="text-amber-800 font-bold truncate max-w-[140px]">{art.category}</span>
                      <span>•</span>
                      <span className="text-stone-400">Cẩm nang</span>
                    </div>

                    {/* Article Title - Znews Style: Bold Sans-Serif, Larger size */}
                    <h4 className="text-sm sm:text-base font-bold font-sans text-stone-900 group-hover:text-amber-800 transition-colors leading-snug line-clamp-2 mb-2 tracking-tight">
                      {art.title}
                    </h4>

                    {/* Short Summary Description - Larger, High Legibility */}
                    <p className="text-stone-600 text-xs sm:text-[13px] leading-relaxed line-clamp-2 mb-2.5">
                      {art.summary}
                    </p>
                  </div>

                  {/* Footer Info: Read Time & Arrow */}
                  <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1.5 border-t border-stone-100 mt-auto">
                    <span className="flex items-center gap-1 text-[11px] text-stone-500">
                      <Clock className="w-3 h-3 text-stone-400" />
                      {art.readTime}
                    </span>
                    <span className="text-amber-800 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5 text-xs">
                      <span>Chi tiết</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>

        </div>

        {/* BOTTOM SECTION: 6 Additional Articles in 3-Columns Grid (2 rows x 3 cols) */}
        {bottomArticles.length > 0 && (
          <div className="mt-8 pt-8 sm:pt-10 border-t border-stone-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[11px] font-extrabold text-amber-800 uppercase tracking-widest block mb-0.5">
                  CHUYÊN MỤC CHỌN LỌC
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-sans text-stone-950">
                  Bài Viết Khác Cùng Chủ Đề
                </h3>
              </div>
              <span className="text-xs text-stone-500 font-medium hidden sm:inline">
                Cập nhật liên tục những kiến thức thị lực hữu ích
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bottomArticles.map((art) => (
                <a
                  key={art.id}
                  href={getArticleUrl(art)}
                  onClick={(e) => handleArticleClick(e, art)}
                  className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer no-underline block"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-900">
                      <img
                        src={art.thumbnail || "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=600&q=80"}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-0.5 bg-stone-950/85 backdrop-blur-xs text-stone-100 text-[10px] font-bold rounded-md">
                          {art.category}
                        </span>
                      </div>
                      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-black/70 backdrop-blur-xs text-stone-200 text-[10px] font-medium rounded flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{art.readTime}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5">
                      <div className="flex items-center gap-2 text-[11px] text-stone-500 mb-2">
                        <span className="text-amber-800 font-semibold">{art.category}</span>
                        <span>•</span>
                        <span className="text-stone-400">Cẩm nang thị lực</span>
                      </div>

                      {/* Znews Style: Bold Sans-Serif Title, Larger size */}
                      <h4 className="text-base sm:text-[17px] font-bold font-sans text-stone-900 group-hover:text-amber-800 transition-colors leading-snug line-clamp-2 mb-2 tracking-tight">
                        {art.title}
                      </h4>

                      {/* Larger Summary text */}
                      <p className="text-stone-600 text-xs sm:text-sm leading-relaxed line-clamp-2 mb-3">
                        {art.summary}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom */}
                  <div className="p-4 sm:p-5 pt-0 mt-auto">
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                      <span className="text-stone-600 text-[11px] font-medium truncate max-w-[150px]">
                        {art.author}
                      </span>
                      <span className="text-amber-800 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5 text-xs">
                        <span>Đọc tiếp</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA: Link to full standalone Articles Page */}
        {onOpenAllArticles && (
          <div className="mt-10 sm:mt-12 text-center">
            <a
              href="/cam-nang"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
                  e.preventDefault();
                  onOpenAllArticles();
                }
              }}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-stone-900 hover:bg-black text-amber-400 hover:text-amber-300 text-xs sm:text-sm font-bold rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group no-underline border border-stone-800"
            >
              <BookOpen className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Xem Tất Cả Bài Viết Trong Cẩm Nang Thị Lực</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-400" />
            </a>
          </div>
        )}

      </div>
    </section>
  );
};

