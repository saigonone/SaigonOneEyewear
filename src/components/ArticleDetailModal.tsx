import React from "react";
import { X, Calendar, Clock, Eye, User, Share2, Tag, ArrowLeft, Bookmark, CheckCircle2 } from "lucide-react";
import { Article } from "../types";

interface ArticleDetailModalProps {
  article: Article | null;
  onClose: () => void;
  onSelectCategory?: (cat: string) => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  onClose,
  onSelectCategory,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!article) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-blue-600/30 text-blue-300 border border-blue-400/30 rounded-full text-xs font-semibold">
              {article.category}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Đã chép link</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Chia sẻ</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-800">
          
          {/* Article Header */}
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold font-sans text-slate-950 leading-tight tracking-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                <User className="w-4 h-4 text-blue-600" />
                {article.author}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{article.readTime}</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {article.thumbnail && (
            <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <img
                src={article.thumbnail}
                alt={article.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {/* Summary Quote */}
          {article.summary && (
            <div className="p-4 sm:p-5 bg-blue-50/80 border-l-4 border-blue-600 rounded-r-xl text-slate-700 font-medium text-sm sm:text-base italic leading-relaxed">
              "{article.summary}"
            </div>
          )}

          {/* Article Content */}
          {article.content && /<[a-z][\s\S]*>/i.test(article.content) ? (
            <div 
              className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed text-slate-800 space-y-4"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            <div className="prose prose-slate max-w-none space-y-4 text-sm sm:text-base leading-relaxed text-slate-700">
              {(article.content || "").split("\n\n").map((paragraph, index) => {
                if (paragraph.startsWith("### ")) {
                  return (
                    <h3 key={index} className="text-lg sm:text-xl font-bold text-slate-900 mt-6 mb-2">
                      {paragraph.replace("### ", "")}
                    </h3>
                  );
                }
                if (paragraph.startsWith("- ")) {
                  return (
                    <ul key={index} className="list-disc pl-5 space-y-1.5 text-slate-700">
                      {paragraph.split("\n").map((line, liIdx) => (
                        <li key={liIdx}>{line.replace("- ", "")}</li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={index} className="text-slate-700">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          )}

          {/* Tags & Footer Advice */}
          <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500 font-medium">Chuyên mục:</span>
              <button
                onClick={() => {
                  onSelectCategory?.(article.category);
                  onClose();
                }}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold transition-colors"
              >
                {article.category}
              </button>
            </div>

            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại danh sách
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
