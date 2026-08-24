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
  Filter
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

  const filteredArticles = selectedCategory === "all" 
    ? articles.filter(a => a.isPublished !== false) 
    : articles.filter(a => a.isPublished !== false && a.category === selectedCategory);

  const featuredArticle = articles.find(a => a.isFeatured && a.isPublished !== false) || articles[0];
  const regularArticles = filteredArticles.filter(a => a.id !== featuredArticle?.id);

  return (
    <section id="articles-blog-section" className="py-16 sm:py-20 bg-slate-50 border-t border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-gray-200 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cẩm Nang & Xu Hướng Thị Lực 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Bài Viết Mới Nhất
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-1">
              Kiến thức chọn kính, bảo vệ mắt và xu hướng thời trang mắt kính chính hãng
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              Tất Cả
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.name
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Featured + Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Featured Large Article (5 Cols) */}
          {featuredArticle && selectedCategory === "all" && (
            <a 
              href={getArticleUrl(featuredArticle)}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  onSelectArticle(featuredArticle);
                }
              }}
              className="lg:col-span-5 group bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col block"
            >
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-900">
                <img
                  src={featuredArticle.thumbnail || "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80"}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-md shadow-sm">
                    Nổi Bật
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-slate-950/70 backdrop-blur-xs text-slate-200 text-xs font-medium rounded-md flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {featuredArticle.readTime}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-blue-600 font-semibold mb-2">
                    <span>{featuredArticle.category}</span>
                    <span>•</span>
                    <span className="text-slate-400 font-normal">{featuredArticle.publishedAt}</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-3 line-clamp-2">
                    {featuredArticle.title}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-4">
                    {featuredArticle.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium text-slate-700">{featuredArticle.author}</span>
                  </div>
                  <span className="text-blue-600 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Đọc tiếp <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </a>
          )}

          {/* Grid of Other Articles */}
          <div className={`${featuredArticle && selectedCategory === "all" ? "lg:col-span-7" : "lg:col-span-12"} grid grid-cols-1 sm:grid-cols-2 gap-6`}>
            {(selectedCategory === "all" ? regularArticles : filteredArticles).map((art) => (
              <a
                key={art.id}
                href={getArticleUrl(art)}
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                    e.preventDefault();
                    onSelectArticle(art);
                  }
                }}
                className="group bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col block"
              >
                <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                  <img
                    src={art.thumbnail || "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80"}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 bg-slate-900/80 backdrop-blur-xs text-slate-200 text-xs font-semibold rounded-md">
                      {art.category}
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-slate-950/70 text-slate-200 text-[11px] font-medium rounded flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {art.readTime}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1.5">
                      <Calendar className="w-3 h-3" />
                      <span>{art.publishedAt}</span>
                      <span>•</span>
                      <Eye className="w-3 h-3" />
                      <span>{(art.viewsCount || 0).toLocaleString("vi-VN")}</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2 mb-2">
                      {art.title}
                    </h4>

                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                      {art.summary}
                    </p>
                  </div>

                  <div className="pt-3.5 mt-3.5 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">{art.author}</span>
                    <span className="text-blue-600 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Đọc chi tiết <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>

        </div>

        {/* Bottom CTA: Link to full standalone Articles Page */}
        {onOpenAllArticles && (
          <div className="mt-12 text-center">
            <a
              href="/cam-nang"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  onOpenAllArticles();
                }
              }}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-slate-900 hover:bg-blue-600 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <BookOpen className="w-4 h-4 text-blue-400 group-hover:text-white" />
              <span>Xem Tất Cả Bài Viết Trong Trang Cẩm Nang</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        )}

      </div>
    </section>
  );
};
