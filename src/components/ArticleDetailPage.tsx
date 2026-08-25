import React, { useState, useMemo, useEffect } from "react";
import { 
  Home, 
  ChevronRight, 
  Calendar, 
  Clock, 
  Eye, 
  User, 
  Share2, 
  Tag, 
  ArrowLeft, 
  ArrowRight,
  CheckCircle2, 
  Sparkles, 
  Phone, 
  MapPin, 
  Glasses, 
  BookOpen, 
  Bookmark,
  MessageCircle,
  Copy,
  Check
} from "lucide-react";
import { Article, ArticleCategory } from "../types";
import { getArticleUrl, getArticleSlug } from "../utils/routes";

interface ArticleDetailPageProps {
  article: Article;
  allArticles?: Article[];
  categories?: ArticleCategory[];
  onGoBack: () => void;
  onGoHome: () => void;
  onSelectArticle: (article: Article) => void;
  onOpenStores: () => void;
  onOpenTryOn: () => void;
  onOpenCategory?: (catName: string) => void;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({
  article,
  allArticles = [],
  categories = [],
  onGoBack,
  onGoHome,
  onSelectArticle,
  onOpenStores,
  onOpenTryOn,
  onOpenCategory,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  // Scroll to top whenever article changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [article.id]);

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Related articles in the same category or general
  const relatedArticles = useMemo(() => {
    const published = allArticles.filter(a => a.id !== article.id && a.isPublished !== false);
    const sameCategory = published.filter(a => (a.category || "").toLowerCase() === (article.category || "").toLowerCase());
    if (sameCategory.length >= 3) {
      return sameCategory.slice(0, 3);
    }
    return [...sameCategory, ...published.filter(a => (a.category || "").toLowerCase() !== (article.category || "").toLowerCase())].slice(0, 3);
  }, [allArticles, article]);

  // Most viewed articles
  const mostViewedArticles = useMemo(() => {
    return allArticles
      .filter(a => a.id !== article.id && a.isPublished !== false)
      .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
      .slice(0, 4);
  }, [allArticles, article]);

  // Previous and Next article navigation
  const { prevArticle, nextArticle } = useMemo(() => {
    const published = allArticles.filter(a => a.isPublished !== false);
    const currentIndex = published.findIndex(a => a.id === article.id);
    if (currentIndex === -1) return { prevArticle: null, nextArticle: null };
    return {
      prevArticle: currentIndex > 0 ? published[currentIndex - 1] : null,
      nextArticle: currentIndex < published.length - 1 ? published[currentIndex + 1] : null,
    };
  }, [allArticles, article]);

  return (
    <div id="article-detail-page" className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* 1. Breadcrumb Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <nav className="flex items-center space-x-2 text-xs text-slate-500 font-medium overflow-x-auto no-scrollbar">
            <button 
              onClick={onGoHome}
              className="flex items-center gap-1 hover:text-blue-600 transition-colors shrink-0"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Trang Chủ</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <button 
              onClick={onGoBack}
              className="hover:text-blue-600 transition-colors shrink-0"
            >
              <span>Cẩm Nang Thị Lực</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="text-blue-600 font-semibold shrink-0">{article.category}</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0 hidden md:inline" />
            <span className="text-slate-900 font-bold truncate max-w-xs hidden md:inline">
              {article.title}
            </span>
          </nav>

          <button
            onClick={onGoBack}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors shrink-0 ml-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Tất Cả Bài Viết</span>
          </button>
        </div>
      </div>

      {/* 2. Main Article Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Main Article Column (8 cols) */}
          <main className="lg:col-span-8 bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 md:p-10 shadow-xs">
            
            {/* Category Badge & Read Time */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold rounded-full">
                  {article.category}
                </span>
                {article.isFeatured && (
                  <span className="px-3 py-1 bg-amber-100 border border-amber-300 text-amber-900 text-xs font-extrabold rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>Bài Viết Nổi Bật</span>
                  </span>
                )}
              </div>

              {/* Share & Copy URL Action */}
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                title="Sao chép đường dẫn bài viết"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-bold">Đã chép link SEO!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Chia sẻ bài viết</span>
                  </>
                )}
              </button>
            </div>

            {/* Article Headline - Modern Sans-Serif font */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-sans text-slate-950 leading-tight mb-6 tracking-tight">
              {article.title}
            </h1>

            {/* Author Meta Strip (No publish date) */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-500 pb-6 mb-8 border-b border-gray-100">
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  SO
                </div>
                <div>
                  <div className="leading-tight font-bold">{article.author || "Chuyên Gia Saigon One"}</div>
                  <div className="text-[11px] text-slate-400 font-normal">Cố vấn thị lực y khoa</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 font-medium">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{article.readTime}</span>
              </div>
            </div>

            {/* Featured Image */}
            {article.thumbnail && (
              <div className="relative w-full h-72 sm:h-96 md:h-[420px] rounded-2xl overflow-hidden shadow-sm border border-gray-200/80 mb-8 bg-slate-900">
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Summary Highlight Quote Callout */}
            {article.summary && (
              <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50/50 border-l-4 border-blue-600 rounded-r-2xl mb-8 text-slate-800 font-medium text-sm sm:text-base italic leading-relaxed shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-700 not-italic mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Tóm tắt nội dung cẩm nang</span>
                </div>
                "{article.summary}"
              </div>
            )}

            {/* Article Main Body Content */}
            <div className="article-body-content">
              {article.content && /<[a-z][\s\S]*>/i.test(article.content) ? (
                <div 
                  className="prose prose-slate max-w-none text-base leading-relaxed text-slate-800 space-y-5"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              ) : (
                <div className="prose prose-slate max-w-none space-y-5 text-base leading-relaxed text-slate-700">
                  {(article.content || "").split("\n\n").map((paragraph, index) => {
                    if (paragraph.startsWith("### ")) {
                      return (
                        <h3 key={index} className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 mb-3">
                          {paragraph.replace("### ", "")}
                        </h3>
                      );
                    }
                    if (paragraph.startsWith("## ")) {
                      return (
                        <h2 key={index} className="text-2xl sm:text-3xl font-bold text-slate-900 mt-10 mb-4 pb-2 border-b border-gray-100">
                          {paragraph.replace("## ", "")}
                        </h2>
                      );
                    }
                    if (paragraph.startsWith("- ")) {
                      return (
                        <ul key={index} className="list-disc pl-6 space-y-2 text-slate-700 my-4">
                          {paragraph.split("\n").map((line, liIdx) => (
                            <li key={liIdx}>{line.replace("- ", "")}</li>
                          ))}
                        </ul>
                      );
                    }
                    return (
                      <p key={index} className="text-slate-700 leading-relaxed">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Tags Strip */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-2">
                <Tag className="w-4 h-4 text-slate-400 mr-1" />
                <span className="text-xs text-slate-500 font-bold">Thẻ từ khóa:</span>
                {article.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Author Credential Bio Box */}
            <div className="mt-10 p-6 bg-slate-50 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
                SO
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-base">{article.author || "Đội ngũ chuyên gia Saigon One"}</h4>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[11px] font-bold rounded-md">Y Khoa Khúc Xạ</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Được kiểm duyệt và biên soạn bởi phòng khám khúc xạ y khoa <strong>Mắt Kính Sài Gòn One (178 Phan Đăng Lưu, Phú Nhuận)</strong>. Cam kết cung cấp thông tin thị lực chuẩn xác và hữu ích cho cộng đồng.
                </p>
              </div>
              <button
                onClick={onOpenStores}
                className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors whitespace-nowrap shadow-xs"
              >
                Đặt Lịch Khám
              </button>
            </div>

            {/* Prev & Next Article Navigation */}
            <div className="mt-10 pt-8 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevArticle ? (
                <a
                  href={getArticleUrl(prevArticle)}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey) {
                      e.preventDefault();
                      onSelectArticle(prevArticle);
                    }
                  }}
                  className="group p-4 bg-slate-50 hover:bg-blue-50/60 border border-gray-200 hover:border-blue-200 rounded-2xl transition-all flex flex-col justify-between"
                >
                  <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    <span>Bài trước</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-600 line-clamp-2 transition-colors">
                    {prevArticle.title}
                  </div>
                </a>
              ) : <div />}

              {nextArticle ? (
                <a
                  href={getArticleUrl(nextArticle)}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey) {
                      e.preventDefault();
                      onSelectArticle(nextArticle);
                    }
                  }}
                  className="group p-4 bg-slate-50 hover:bg-blue-50/60 border border-gray-200 hover:border-blue-200 rounded-2xl transition-all flex flex-col justify-between text-right"
                >
                  <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center justify-end gap-1">
                    <span>Bài tiếp theo</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-600 line-clamp-2 transition-colors">
                    {nextArticle.title}
                  </div>
                </a>
              ) : <div />}
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gray-100">
              <button
                onClick={onGoBack}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại trang Cẩm Nang</span>
              </button>

              <button
                onClick={handleShare}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 shadow-xs"
              >
                <Share2 className="w-4 h-4" />
                <span>{copied ? "Đã sao chép link!" : "Chia sẻ bài viết này"}</span>
              </button>
            </div>

          </main>

          {/* Right Sticky Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Widget 1: Free Eye Exam CTA Banner */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-slate-800 relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-slate-950 text-xs font-black rounded-lg mb-3">
                  <CheckCircle2 className="w-4 h-4" /> MIỄN PHÍ 100%
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                  Đo Khám Mắt & Cắt Kính Lấy Ngay
                </h3>
                
                <p className="text-slate-300 text-xs leading-relaxed mb-4">
                  Trực tiếp chuyên viên khúc xạ tại <strong>178 Phan Đăng Lưu, Phú Nhuận, TP.HCM</strong>. Máy đo tự động Nidek Nhật Bản.
                </p>

                <div className="space-y-2 mb-6 text-xs text-slate-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Đo độ cận, viễn, loạn thị giác chuẩn xác</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Tư vấn tròng kính lọc ánh sáng xanh & chống lóa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Cắt kính lấy ngay trong 15 - 20 phút</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={onOpenStores}
                    className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md text-center"
                  >
                    Xem Địa Chỉ & Đặt Hẹn
                  </button>
                  <a
                    href="https://zalo.me/0973819928"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/40 text-blue-200 hover:text-white font-semibold text-xs rounded-xl transition-colors text-center flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-amber-400" />
                    <span>Tư Vấn Zalo: 0973.819.928</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Widget 2: Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Bài Viết Cùng Chuyên Mục</span>
                </h4>

                <div className="space-y-4">
                  {relatedArticles.map((art) => (
                    <a
                      key={art.id}
                      href={getArticleUrl(art)}
                      onClick={(e) => {
                        if (!e.ctrlKey && !e.metaKey) {
                          e.preventDefault();
                          onSelectArticle(art);
                        }
                      }}
                      className="group flex items-start gap-3 pb-3.5 border-b border-gray-100 last:border-0 last:pb-0 block"
                    >
                      <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                        <img
                          src={art.thumbnail || "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=300&q=80"}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs sm:text-[13px] font-bold font-sans text-slate-800 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2 mb-1">
                          {art.title}
                        </h5>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span>{art.category}</span>
                          <span>•</span>
                          <span>{art.readTime}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Widget 3: Most Viewed Articles */}
            {mostViewedArticles.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-amber-500" />
                  <span>Đọc Nhiều Nhất</span>
                </h4>

                <div className="space-y-3.5">
                  {mostViewedArticles.map((art, idx) => (
                    <a
                      key={art.id}
                      href={getArticleUrl(art)}
                      onClick={(e) => {
                        if (!e.ctrlKey && !e.metaKey) {
                          e.preventDefault();
                          onSelectArticle(art);
                        }
                      }}
                      className="group flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0 block"
                    >
                      <span className="text-base font-black text-slate-300 group-hover:text-blue-600 transition-colors w-4 shrink-0">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs sm:text-[13px] font-bold font-sans text-slate-800 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2 mb-1">
                          {art.title}
                        </h5>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span>{art.category}</span>
                          <span>•</span>
                          <span>{(art.viewsCount || 0).toLocaleString("vi-VN")} đọc</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Widget 4: Try-On AR Banner */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/80 p-5 shadow-xs text-center">
              <div className="w-10 h-10 bg-amber-500 text-white rounded-full flex items-center justify-center mx-auto mb-2.5 shadow-sm">
                <Glasses className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-amber-950 mb-1">
                Thử Kính AR 3D Trực Tuyến
              </h4>
              <p className="text-xs text-amber-800/80 mb-3 leading-relaxed">
                Bật webcam để thử ngay các mẫu gọng kính cận titanium & kính mát thời trang hợp dáng mặt.
              </p>
              <button
                onClick={onOpenTryOn}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
              >
                Trải Nghiệm Thử Kính AR
              </button>
            </div>

          </aside>

        </div>
      </div>

    </div>
  );
};
