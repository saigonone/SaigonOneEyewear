import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Eye, 
  Pin, 
  Layers, 
  ExternalLink,
  Copy,
  Sparkles,
  BookOpen,
  Filter,
  CheckCircle2
} from "lucide-react";
import { Article, LensBrandCategory } from "../types";
import { createSlug, getArticleSlug, getArticleUrl } from "../utils/slug";
import { RichTextEditor } from "./RichTextEditor";

interface AdminLensArticlesManagerProps {
  articles: Article[];
  lensBrands: LensBrandCategory[];
  onAddArticle: (article: Article) => Promise<void>;
  onUpdateArticle: (article: Article) => Promise<void>;
  onDeleteArticle: (id: string) => Promise<void>;
  onTogglePinArticle: (article: Article) => Promise<void>;
}

export const AdminLensArticlesManager: React.FC<AdminLensArticlesManagerProps> = ({
  articles,
  lensBrands,
  onAddArticle,
  onUpdateArticle,
  onDeleteArticle,
  onTogglePinArticle,
}) => {
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isCustomSlug, setIsCustomSlug] = useState(false);
  const [lensBrandId, setLensBrandId] = useState("");
  const [category, setCategory] = useState("Tròng Kính Chính Hãng");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=900&q=80");
  const [author, setAuthor] = useState("Chuyên Gia Kính Thuốc Saigon One");
  const [isPinned, setIsPinned] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Filter articles that belong to lens brands
  const lensArticles = articles.filter((art) => {
    // Article explicitly has lensBrandId OR tags include lens brands
    if (art.lensBrandId) return true;
    if (art.category && art.category.toLowerCase().includes("tròng")) return true;
    if (art.tags && art.tags.some(t => lensBrands.some(b => b.brandKey === t || b.id === t || b.slug === t))) return true;
    return false;
  });

  const filteredArticles = lensArticles.filter((art) => {
    const matchSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase());

    let matchBrand = true;
    if (selectedBrandFilter !== "all") {
      const foundBrand = lensBrands.find(b => b.id === selectedBrandFilter);
      const brandSlug = foundBrand?.slug || "";
      const brandKey = foundBrand?.brandKey || "";
      matchBrand =
        art.lensBrandId === selectedBrandFilter ||
        art.lensBrandId === brandSlug ||
        (art.tags && (art.tags.includes(selectedBrandFilter) || art.tags.includes(brandKey)));
    }

    return matchSearch && matchBrand;
  });

  const handleOpenAdd = () => {
    setEditingArticle(null);
    setTitle("");
    setSlug("");
    setIsCustomSlug(false);
    setLensBrandId(lensBrands[0]?.id || "");
    setCategory("Tròng Kính Chính Hãng");
    setSummary("");
    setContent("");
    setThumbnail("https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=900&q=80");
    setAuthor("Chuyên Gia Kính Thuốc Saigon One");
    setIsPinned(false);
    setShowModal(true);
  };

  const handleOpenEdit = (art: Article) => {
    setEditingArticle(art);
    setTitle(art.title);
    setSlug(art.slug || getArticleSlug(art));
    setIsCustomSlug(!!art.slug);
    // Find matching brand ID
    const matchingBrand = lensBrands.find(
      b => b.id === art.lensBrandId || b.slug === art.lensBrandId || (art.tags && art.tags.includes(b.brandKey))
    );
    setLensBrandId(matchingBrand ? matchingBrand.id : (art.lensBrandId || lensBrands[0]?.id || ""));
    setCategory(art.category || "Tròng Kính Chính Hãng");
    setSummary(art.summary || "");
    setContent(art.content || "");
    setThumbnail(art.thumbnail || "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=900&q=80");
    setAuthor(art.author || "Chuyên Gia Kính Thuốc Saigon One");
    setIsPinned(!!art.isPinned);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !lensBrandId) {
      alert("Vui lòng nhập tiêu đề bài viết và chọn thương hiệu tròng kính!");
      return;
    }

    setIsSaving(true);
    try {
      const effectiveSlug = slug.trim() || createSlug(title);
      const selectedBrand = lensBrands.find(b => b.id === lensBrandId);
      const brandKeyTag = selectedBrand ? selectedBrand.brandKey : "trong-kinh";

      if (editingArticle) {
        const updated: Article = {
          ...editingArticle,
          title,
          slug: effectiveSlug,
          category: category || "Tròng Kính Chính Hãng",
          lensBrandId,
          summary,
          content,
          thumbnail,
          author,
          isPinned,
          tags: Array.from(new Set([...(editingArticle.tags || []), brandKeyTag, "TrongKinh", "SaigonOne"])),
        };
        await onUpdateArticle(updated);
      } else {
        const newArt: Article = {
          id: `art-lens-${Date.now()}`,
          title,
          slug: effectiveSlug,
          category: category || "Tròng Kính Chính Hãng",
          lensBrandId,
          summary,
          content,
          thumbnail,
          author,
          readTime: "4 phút đọc",
          publishedAt: new Date().toLocaleDateString("vi-VN"),
          viewsCount: 1,
          tags: ["TrongKinh", brandKeyTag, "SaigonOne"],
          isFeatured: false,
          isPinned,
          isPublished: true,
        };
        await onAddArticle(newArt);
      }
      setShowModal(false);
    } catch (err) {
      console.error("Error saving lens article:", err);
      alert("Lỗi khi lưu bài viết tròng kính. Vui lòng thử lại!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyLink = (art: Article) => {
    const url = `${window.location.origin}${getArticleUrl(art)}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(art.id);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-black text-slate-900">Quản Lý Bài Viết Tròng Kính</h2>
              <p className="text-xs text-slate-500">
                Tạo bài viết hướng dẫn, giới thiệu công nghệ, bảng giá riêng cho từng thương hiệu tròng ({lensArticles.length} bài)
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết tròng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white outline-hidden font-medium"
            />
          </div>

          {/* Lens Brand Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedBrandFilter}
              onChange={(e) => setSelectedBrandFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 outline-hidden cursor-pointer"
            >
              <option value="all">Tất Cả Thương Hiệu ({lensArticles.length})</option>
              {lensBrands.map((b) => {
                const count = lensArticles.filter(a => a.lensBrandId === b.id || a.lensBrandId === b.slug || (a.tags && a.tags.includes(b.brandKey))).length;
                return (
                  <option key={b.id} value={b.id}>
                    {b.name} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Add Lens Article Button */}
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Bài Viết Tròng Kính</span>
          </button>
        </div>
      </div>

      {/* Brand Tabs Quick Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedBrandFilter("all")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            selectedBrandFilter === "all"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <span>Tất cả</span>
          <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${selectedBrandFilter === "all" ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-500"}`}>
            {lensArticles.length}
          </span>
        </button>

        {lensBrands.map((b) => {
          const isSelected = selectedBrandFilter === b.id;
          const count = lensArticles.filter(a => a.lensBrandId === b.id || a.lensBrandId === b.slug || (a.tags && a.tags.includes(b.brandKey))).length;
          return (
            <button
              key={b.id}
              onClick={() => setSelectedBrandFilter(b.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span>{b.name}</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${isSelected ? "bg-blue-700 text-white" : "bg-blue-50 text-blue-600"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-gray-200">
              <tr>
                <th className="p-4">Bài Viết Tròng Kính</th>
                <th className="p-4">Thương Hiệu Tròng</th>
                <th className="p-4">Đường Dẫn URL (Slug SEO)</th>
                <th className="p-4 text-center">Ghim Đầu Trang</th>
                <th className="p-4 text-center">Lượt Xem</th>
                <th className="p-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-slate-700">
              {filteredArticles.map((art) => {
                const assignedBrand = lensBrands.find(
                  b => b.id === art.lensBrandId || b.slug === art.lensBrandId || (art.tags && art.tags.includes(b.brandKey))
                );
                const slugVal = art.slug || getArticleSlug(art);

                return (
                  <tr key={art.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Article Info */}
                    <td className="p-4 max-w-sm">
                      <div className="flex items-center gap-3">
                        <img
                          src={art.thumbnail || "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=900&q=80"}
                          alt=""
                          className="w-12 h-12 object-cover rounded-xl border border-gray-200 shrink-0 bg-slate-100"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 line-clamp-1 flex items-center gap-1.5">
                            {art.isPinned && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase shrink-0">
                                <Pin className="w-2.5 h-2.5" /> Ghim đầu
                              </span>
                            )}
                            <span className="truncate">{art.title}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {art.summary}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                            <span>Tác giả: {art.author || "Saigon One"}</span>
                            <span>•</span>
                            <span>{art.publishedAt || "Mới"}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Lens Brand */}
                    <td className="p-4">
                      {assignedBrand ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl font-bold text-xs">
                          <Layers className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{assignedBrand.name}</span>
                          <span className="text-[10px] text-blue-500 font-normal">({assignedBrand.origin || assignedBrand.country})</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Chưa xác định</span>
                      )}
                    </td>

                    {/* Slug & Copy */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <code className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-[11px] font-mono border border-slate-200 max-w-[200px] truncate">
                          /{slugVal}
                        </code>
                        <button
                          type="button"
                          onClick={() => handleCopyLink(art)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Sao chép liên kết bài viết"
                        >
                          {copiedSlug === art.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Pin Toggle */}
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => onTogglePinArticle(art)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          art.isPinned
                            ? "bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 shadow-xs"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 border border-slate-200"
                        }`}
                        title={art.isPinned ? "Bấm để bỏ ghim" : "Bấm để ghim bài viết này lên trên cùng trang thương hiệu tròng"}
                      >
                        <Pin className={`w-3.5 h-3.5 ${art.isPinned ? "fill-amber-600 text-amber-600" : "text-slate-400"}`} />
                        <span>{art.isPinned ? "Đã Ghim" : "Ghim Lên Đầu"}</span>
                      </button>
                    </td>

                    {/* Views Count */}
                    <td className="p-4 text-center">
                      <span className="font-semibold text-slate-600">
                        {(art.viewsCount || 1).toLocaleString("vi-VN")}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={getArticleUrl(art)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                          title="Xem bài viết trực tiếp trên web"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleOpenEdit(art)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                          title="Chỉnh sửa bài viết tròng"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Bạn có chắc muốn xóa bài viết "${art.title}"?`)) {
                              onDeleteArticle(art.id);
                            }
                          }}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          title="Xóa bài viết"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredArticles.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <Layers className="w-10 h-10 text-slate-300 mb-2" />
                      <p className="font-semibold text-slate-600">Chưa có bài viết tròng kính nào cho mục này</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Bấm nút "Thêm Bài Viết Tròng Kính" bên trên để tạo bài viết đầu tiên!
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit Lens Article */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                  <Layers className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    {editingArticle ? "Chỉnh Sửa Bài Viết Tròng Kính" : "Thêm Bài Viết Tròng Kính Mới"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Nội dung chuyên sâu về bảng giá, công nghệ tròng kính chính hãng
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Chọn Thương Hiệu Tròng Kính */}
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span>Thuộc Thương Hiệu Tròng Kính:</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-blue-700 font-semibold">Tự động gắn vào trang thương hiệu tương ứng</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {lensBrands.map((b) => {
                    const isSelected = lensBrandId === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setLensBrandId(b.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "bg-white border-blue-600 ring-2 ring-blue-600/20 shadow-xs"
                            : "bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-black text-slate-900 text-xs">{b.name}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                        </div>
                        <span className="text-[10px] text-slate-500">{b.origin || b.country}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tiêu Đề Bài Viết Tròng Kính <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Bảng Giá & Chi Tiết Các Dòng Tròng Kính Hoya Nulux Nhật Bản Mới Nhất"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!isCustomSlug) {
                      setSlug(createSlug(e.target.value));
                    }
                  }}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              {/* Slug SEO */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Đường Dẫn URL SEO (Slug)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomSlug(!isCustomSlug);
                      if (isCustomSlug) {
                        setSlug(createSlug(title));
                      }
                    }}
                    className="text-[11px] text-blue-600 hover:underline font-semibold cursor-pointer"
                  >
                    {isCustomSlug ? "Tự động tạo từ tiêu đề" : "Chỉnh sửa thủ công"}
                  </button>
                </div>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
                  <span className="text-slate-400 font-mono select-none">/</span>
                  <input
                    type="text"
                    disabled={!isCustomSlug}
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="bang-gia-trong-kinh-hoya-nhat-ban"
                    className="flex-1 bg-transparent border-0 font-mono text-slate-800 outline-hidden px-1 disabled:opacity-80"
                  />
                </div>
              </div>

              {/* Author & Thumbnail */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Tác Giả / Chuyên Gia
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Ảnh Đại Diện Bài Viết (Thumbnail URL)
                  </label>
                  <input
                    type="url"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                  />
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tóm Tắt Ngắn (Mô Tả SEO)
                </label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Mô tả tóm tắt 1-2 câu về nội dung bài viết..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              {/* Ghim Toggle */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isPinned ? "bg-amber-500 text-white" : "bg-amber-100 text-amber-700"}`}>
                    <Pin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Ghim Lên Đầu Trang Thương Hiệu</h4>
                    <p className="text-[11px] text-slate-500">
                      Bài viết sẽ hiển thị ở khung banner tiêu điểm lớn trên cùng của trang thương hiệu tròng đã chọn.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-3">
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nội Dung Chi Tiết Bài Viết (Rich Text)
                </label>
                <RichTextEditor
                  value={content}
                  onChange={(val) => setContent(val)}
                  placeholder="Nhập nội dung bài viết về công nghệ tròng kính, bảng giá, hướng dẫn sử dụng..."
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingArticle ? "Cập Nhật Bài Viết" : "Xuất Bản Bài Viết"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
