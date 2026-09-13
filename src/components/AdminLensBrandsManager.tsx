import React, { useState } from "react";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Eye, 
  Globe, 
  ShieldCheck, 
  Layers, 
  RefreshCw,
  ExternalLink,
  Sparkles,
  Award,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { LensBrandCategory } from "../types";
import { createSlug } from "../utils/slug";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

interface AdminLensBrandsManagerProps {
  brands: LensBrandCategory[];
  onAddBrand: (brand: LensBrandCategory) => Promise<void>;
  onUpdateBrand: (brand: LensBrandCategory) => Promise<void>;
  onDeleteBrand: (id: string) => Promise<void>;
}

export const AdminLensBrandsManager: React.FC<AdminLensBrandsManagerProps> = ({
  brands,
  onAddBrand,
  onUpdateBrand,
  onDeleteBrand,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<LensBrandCategory | null>(null);
  const [brandToDelete, setBrandToDelete] = useState<LensBrandCategory | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [brandKey, setBrandKey] = useState("");
  const [country, setCountry] = useState("Nhật Bản");
  const [slug, setSlug] = useState("");
  const [isCustomSlug, setIsCustomSlug] = useState(false);
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenAdd = () => {
    setEditingBrand(null);
    setName("");
    setBrandKey("");
    setCountry("Nhật Bản");
    setSlug("");
    setIsCustomSlug(false);
    setDescription("");
    setIsActive(true);
    setDisplayOrder(brands.length + 1);
    setShowModal(true);
  };

  const handleOpenEdit = (b: LensBrandCategory) => {
    setEditingBrand(b);
    setName(b.name);
    setBrandKey(b.brandKey || b.id);
    setCountry(b.country);
    setSlug(b.slug);
    setIsCustomSlug(true);
    setDescription(b.description);
    setIsActive(b.isActive !== false);
    setDisplayOrder(b.displayOrder || 1);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      const effectiveSlug = slug.trim() || createSlug(name);
      const effectiveBrandKey = brandKey.trim() || effectiveSlug.replace("trong-kinh-", "");

      if (editingBrand) {
        const updated: LensBrandCategory = {
          ...editingBrand,
          name: name.trim(),
          brandKey: effectiveBrandKey,
          country: country.trim(),
          slug: effectiveSlug,
          description: description.trim(),
          isActive,
          displayOrder,
        };
        await onUpdateBrand(updated);
      } else {
        const newBrand: LensBrandCategory = {
          id: `lens-brand-${Date.now()}`,
          name: name.trim(),
          brandKey: effectiveBrandKey,
          country: country.trim(),
          slug: effectiveSlug,
          description: description.trim(),
          isActive,
          displayOrder,
        };
        await onAddBrand(newBrand);
      }
      setShowModal(false);
    } catch (err) {
      console.error("Error saving lens brand:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (b: LensBrandCategory) => {
    const updated: LensBrandCategory = {
      ...b,
      isActive: b.isActive === false ? true : false,
    };
    await onUpdateBrand(updated);
  };

  const getCountryBadge = (countryName: string) => {
    if (countryName.includes("Nhật")) return "🇯🇵 Nhật Bản";
    if (countryName.includes("Mỹ") || countryName.includes("Hoa Kỳ")) return "🇺🇸 Mỹ";
    if (countryName.includes("Pháp")) return "🇫🇷 Pháp";
    if (countryName.includes("Hàn")) return "🇰🇷 Hàn Quốc";
    if (countryName.includes("Đức")) return "🇩🇪 Đức";
    return `🌐 ${countryName}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">
              Quản Lý Danh Mục Thương Hiệu Tròng Kính
            </h3>
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200">
              {brands.length} Thương hiệu
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý các thương hiệu xổ ra trên thanh Menu (Hoya Nhật Bản, Kodak Mỹ, Essilor Pháp, Chemi Hàn Quốc...) và phân loại bài viết cho từng thương hiệu.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Thương Hiệu Mới</span>
          </button>
        </div>
      </div>

      {/* Brand Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {brands.map((b, idx) => (
          <div 
            key={b.id} 
            className={`bg-white rounded-2xl border transition-all duration-200 shadow-xs flex flex-col justify-between overflow-hidden p-5 ${
              b.isActive !== false ? "border-gray-200 hover:border-blue-300 hover:shadow-md" : "border-dashed border-gray-300 opacity-60 bg-slate-50"
            }`}
          >
            <div className="space-y-3">
              {/* Header / Country / Status */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 bg-slate-100 text-slate-800 text-xs font-bold rounded-lg flex items-center gap-1.5">
                  {getCountryBadge(b.country)}
                </span>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleActive(b)}
                    className={`px-2 py-0.5 rounded text-[10.5px] font-bold transition-colors cursor-pointer ${
                      b.isActive !== false 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                        : "bg-slate-200 text-slate-600"
                    }`}
                    title={b.isActive !== false ? "Đang hiển thị trên menu (Bấm để ẩn)" : "Đang ẩn khỏi menu (Bấm để hiện)"}
                  >
                    {b.isActive !== false ? "● Hiển thị menu" : "○ Đang ẩn"}
                  </button>
                </div>
              </div>

              {/* Title & Key */}
              <div>
                <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                  {b.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-semibold">
                    key: {b.brandKey || b.id}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono truncate">
                    /trong-kinh/{b.slug}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {b.description || "Chưa có mô tả công nghệ cho thương hiệu này."}
              </p>
            </div>

            {/* Card Footer Actions */}
            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">
                Thứ tự: #{b.displayOrder || idx + 1}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(b)}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  title="Sửa thông tin thương hiệu"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Sửa</span>
                </button>

                <button
                  onClick={() => setBrandToDelete(b)}
                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer"
                  title="Xóa thương hiệu này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {brands.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 text-slate-400">
          <Layers className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="font-bold text-slate-700">Chưa có thương hiệu tròng kính nào</p>
          <p className="text-xs text-slate-400 mt-1">
            Bấm "Thêm Thương Hiệu Mới" hoặc "Khôi Phục Mặc Định" để khởi tạo danh mục Hoya, Kodak, Essilor, Chemi...
          </p>
        </div>
      )}

      {/* MODAL: THÊM / SỬA THƯƠNG HIỆU TRÒNG KÍNH */}
      {showModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-lg w-full p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {editingBrand ? "Chỉnh Sửa Thương Hiệu Tròng Kính" : "Thêm Thương Hiệu Tròng Kính Mới"}
                  </h3>
                  <p className="text-[11px] text-slate-500">Hiển thị trong dropdown "Tròng Kính" trên Header & trang bài viết</p>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              
              {/* Tên thương hiệu */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tên Thương Hiệu Tròng Kính *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setName(val);
                    if (!isCustomSlug) {
                      setSlug(createSlug(val));
                    }
                  }}
                  placeholder="VD: Tròng Kính Hoya Nhật Bản"
                  className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Quốc gia & Mã định danh */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Quốc Gia Xuất Xứ *
                  </label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="VD: Nhật Bản, Mỹ, Pháp, Hàn Quốc..."
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Mã Định Danh (Brand Key) *
                  </label>
                  <input
                    type="text"
                    required
                    value={brandKey}
                    onChange={(e) => setBrandKey(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""))}
                    placeholder="VD: hoya, kodak, essilor, chemi..."
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-mono text-blue-700 font-bold"
                  />
                </div>
              </div>

              {/* URL Slug */}
              <div className="p-3 bg-blue-50/60 border border-blue-200/80 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    <span>Đường Dẫn URL Trang Thương Hiệu (Slug)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomSlug(false);
                      setSlug(createSlug(name));
                    }}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold underline cursor-pointer"
                  >
                    Tạo lại
                  </button>
                </div>
                <div className="flex items-center gap-1 font-mono text-xs">
                  <span className="text-slate-500">/trong-kinh/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      setIsCustomSlug(true);
                      setSlug(createSlug(e.target.value));
                    }}
                    placeholder="trong-kinh-hoya"
                    className="flex-1 px-2.5 py-1.5 bg-white border border-blue-200 rounded-lg text-xs font-mono text-blue-900 font-bold focus:outline-none"
                  />
                </div>
              </div>

              {/* Mô tả ngắn */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mô Tả Công Nghệ & Điểm Nổi Bật
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="VD: Công nghệ lọc ánh sáng xanh BlueControl, phủ chống trầy Super Hi-Vision hàng đầu Nhật Bản..."
                  className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                />
              </div>

              {/* Thứ tự & Trạng thái */}
              <div className="grid grid-cols-2 gap-3 items-center pt-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Thứ Tự Hiển Thị</label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>

                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-xs font-bold text-slate-800">Hiển thị trên Menu</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5"
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{editingBrand ? "Lưu Cập Nhật" : "Tạo Thương Hiệu Mới"}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: XÁC THỰC KÉP XÓA THƯƠNG HIỆU TRÒNG KÍNH */}
      {brandToDelete && (
        <ConfirmDeleteModal
          isOpen={!!brandToDelete}
          itemType="lens_brand"
          itemTitle={brandToDelete.name}
          itemId={brandToDelete.id}
          itemImage={brandToDelete.logo}
          itemSubtitle={`Xuất xứ: ${brandToDelete.origin || "Chính hãng"} • Slug: ${brandToDelete.slug || "N/A"}`}
          onConfirm={async () => {
            if (brandToDelete) {
              await onDeleteBrand(brandToDelete.id);
              setBrandToDelete(null);
            }
          }}
          onClose={() => setBrandToDelete(null)}
        />
      )}

    </div>
  );
};
