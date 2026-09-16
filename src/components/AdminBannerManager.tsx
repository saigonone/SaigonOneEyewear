import React, { useState } from "react";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Upload, 
  Check, 
  X, 
  RotateCcw, 
  SlidersHorizontal, 
  Layers, 
  ExternalLink,
  Image as ImageIcon,
  CheckCircle2,
  Tag,
  ArrowRight,
  Camera
} from "lucide-react";
import { BannerSlide, ProductCategory } from "../types";
import { saveBannerToFirebase, deleteBannerFromFirebase, saveAllBannersToFirebase } from "../firebase";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

interface AdminBannerManagerProps {
  banners: BannerSlide[];
  onUpdateBanners: (banners: BannerSlide[]) => void;
}

export const AdminBannerManager: React.FC<AdminBannerManagerProps> = ({
  banners = [],
  onUpdateBanners
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const [editingBanner, setEditingBanner] = useState<BannerSlide | null>(null);
  const [bannerToDelete, setBannerToDelete] = useState<BannerSlide | null>(null);

  // Form states
  const [tag, setTag] = useState("TRÒNG KÍNH CÔNG NGHỆ CHÍNH HÃNG");
  const [title1, setTitle1] = useState("Tầm Nhìn");
  const [title2, setTitle2] = useState("Sắc Nét & Bảo Vệ");
  const [desc, setDesc] = useState("Tròng kính lọc ánh sáng xanh Essilor Crizal & Hoya BlueControl cao cấp. Tối ưu thị lực sắc nét, chống mỏi mắt kỹ thuật số.");
  const [buttonText, setButtonText] = useState("Bảng Giá Tròng Kính");
  const [secButtonText, setSecButtonText] = useState("Hướng Dẫn Chọn Tròng");
  const [category, setCategory] = useState<ProductCategory>("trong-kinh");
  const [featureBadge, setFeatureBadge] = useState("Essilor Crizal & Hoya BlueControl");
  const [featureDesc, setFeatureDesc] = useState("Lọc 99% ánh sáng xanh tím có hại, chống chói lóa, hạn chế trầy xước và bám bụi bẩn.");
  const [image, setImage] = useState("https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=1200&q=85");
  const [brandNote, setBrandNote] = useState("Chính Hãng: Essilor (Pháp) • Hoya (Nhật Bản) • Chemi (Hàn Quốc)");
  const [isActive, setIsActive] = useState(true);

  // Sample curated optical & eyewear images presets for quick selection
  const SAMPLE_IMAGES = [
    {
      name: "Người đeo tròng Essilor / Hoya trong suốt",
      url: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=1200&q=85",
      type: "Tròng kính quang học"
    },
    {
      name: "Người đeo kính đổi màu Transitions ngoài trời",
      url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1200&q=85",
      type: "Kính đổi màu"
    },
    {
      name: "Chân dung tròng siêu mỏng & đo khúc xạ y khoa",
      url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85",
      type: "Đo mắt y khoa"
    },
    {
      name: "Người mẫu đeo gọng cận Titanium thời trang",
      url: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1200&q=85",
      type: "Gọng kính cận"
    },
    {
      name: "Người mẫu đeo kính râm Polarized chống chói",
      url: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=1200&q=85",
      type: "Kính râm mát"
    },
    {
      name: "Chuyên gia khúc xạ đo khám mắt chính xác",
      url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85",
      type: "Khám mắt"
    }
  ];

  const handleOpenAdd = () => {
    setEditingBanner(null);
    setTag("BỘ SƯU TẬP MỚI 2026");
    setTitle1("Tầm Nhìn");
    setTitle2("Thời Thượng & Sắc Nét");
    setDesc("Khám phá các dòng tròng kính công nghệ cao và gọng kính chính hãng tại Saigon One Eyewear.");
    setButtonText("Khám Phá Ngay");
    setSecButtonText("Thử Kính AR 3D");
    setCategory("gong-kinh-can");
    setFeatureBadge("Cắt mài tự động 15 phút");
    setFeatureDesc("Máy đo tâm quang học Topcon Nhật Bản chuẩn xác từng milimet.");
    setImage("https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1200&q=85");
    setBrandNote("Showroom & Đo Khúc Xạ: 178 Phan Đăng Lưu, Phường Đức Nhuận, TP.HCM");
    setIsActive(true);
    setShowModal(true);
  };

  const handleOpenEdit = (b: BannerSlide) => {
    setEditingBanner(b);
    setTag(b.collectionTag || "");
    setTitle1(b.titleLine1 || "");
    setTitle2(b.titleLine2 || "");
    setDesc(b.desc || "");
    setButtonText(b.buttonText || "Xem Ngay");
    setSecButtonText(b.secondaryButtonText || "Thử Kính AR");
    setCategory(b.category || "all");
    setFeatureBadge(b.featureBadge || "");
    setFeatureDesc(b.featureDesc || "");
    setImage(b.image || "");
    setBrandNote(b.brandNote || "");
    setIsActive(b.isActive !== false);
    setShowModal(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingBanner ? editingBanner.id : `banner-${Date.now()}`;
    const order = editingBanner ? (editingBanner.order || 1) : banners.length + 1;

    const newSlide: BannerSlide = {
      id,
      collectionTag: tag.trim() || "BỘ SƯU TẬP 2026",
      titleLine1: title1.trim() || "Tầm Nhìn",
      titleLine2: title2.trim() || "Sắc Nét",
      desc: desc.trim(),
      buttonText: buttonText.trim() || "Xem Ngay",
      secondaryButtonText: secButtonText.trim() || "Thử Kính",
      category,
      featureBadge: featureBadge.trim(),
      featureDesc: featureDesc.trim(),
      image: image.trim() || "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=1200&q=85",
      brandNote: brandNote.trim(),
      isActive,
      order
    };

    let updated: BannerSlide[];
    if (editingBanner) {
      updated = banners.map(s => s.id === editingBanner.id ? newSlide : s);
    } else {
      updated = [...banners, newSlide];
    }

    onUpdateBanners(updated);
    await saveBannerToFirebase(newSlide);
    setShowModal(false);
  };

  const handleRequestDeleteBanner = (slide: BannerSlide) => {
    if (banners.length <= 1) {
      alert("Hệ thống cần giữ lại ít nhất 1 banner để hiển thị trên trang chủ!");
      return;
    }
    setBannerToDelete(slide);
  };

  const handleConfirmDeleteBanner = async () => {
    if (!bannerToDelete) return;
    const id = bannerToDelete.id;
    const updated = banners.filter(b => b.id !== id);
    onUpdateBanners(updated);
    await deleteBannerFromFirebase(id);
    setBannerToDelete(null);
  };

  const handleToggleActive = async (slide: BannerSlide) => {
    const updatedSlide = { ...slide, isActive: !slide.isActive };
    const updated = banners.map(s => s.id === slide.id ? updatedSlide : s);
    onUpdateBanners(updated);
    await saveBannerToFirebase(updatedSlide);
  };

  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === banners.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const copy = [...banners];
    const item = copy[index];
    copy[index] = copy[newIndex];
    copy[newIndex] = item;

    // Re-assign order numbers
    const updated = copy.map((item, idx) => ({ ...item, order: idx + 1 }));
    onUpdateBanners(updated);
    await saveAllBannersToFirebase(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Quản Lý Banner & Slider Trang Chủ</h3>
              <p className="text-xs text-slate-500">
                Thay đổi hình ảnh người mẫu, logo thương hiệu (Essilor, Hoya), tiêu đề và nút chuyển hướng trực tiếp
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Thêm Banner Mới</span>
          </button>
        </div>
      </div>

      {/* Banner Slides List */}
      <div className="grid grid-cols-1 gap-4">
        {(!banners || banners.length === 0) ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-center text-slate-500">
            <p className="text-sm font-medium">Chưa có banner nào được thiết lập.</p>
            <p className="text-xs text-slate-400 mt-1">Bấm "+ Thêm Banner Mới" ở góc trên bên phải để tạo banner hiển thị trên trang chủ.</p>
          </div>
        ) : (
          banners.map((slide, idx) => {
            if (!slide) return null;
            return (
              <div
                key={slide.id || idx}
                className={`bg-white rounded-2xl border transition-all p-5 shadow-2xs flex flex-col lg:flex-row gap-5 items-start lg:items-center justify-between ${
                  slide.isActive !== false ? "border-gray-200" : "border-amber-200/80 bg-amber-50/20 opacity-75"
                }`}
              >
                {/* Left: Thumbnail & Order */}
                <div className="flex items-center gap-4 w-full lg:w-auto">
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMoveOrder(idx, "up")}
                      className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      title="Di chuyển lên đầu"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono text-[11px] font-bold flex items-center justify-center shadow-xs">
                      #{idx + 1}
                    </span>
                    <button
                      disabled={idx === banners.length - 1}
                      onClick={() => handleMoveOrder(idx, "down")}
                      className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      title="Di chuyển xuống dưới"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Image Preview */}
                  <div className="relative w-28 sm:w-36 h-20 sm:h-24 rounded-xl overflow-hidden bg-slate-100 border border-gray-200 shrink-0 shadow-2xs group">
                    <img
                      src={slide.image || "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=1200&q=85"}
                      alt={slide.titleLine2 || "Banner"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {slide.brandNote && (
                      <span className="absolute bottom-1 left-1 right-1 text-[9px] text-white truncate px-1 font-medium">
                        {slide.brandNote}
                      </span>
                    )}
                  </div>

                  {/* Title & Info */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-[10px] uppercase tracking-wider border border-blue-200/60">
                        {slide.collectionTag || "BỘ SƯU TẬP"}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px]">
                        Danh mục: {slide.category || "all"}
                      </span>
                      {slide.isActive !== false ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <Check className="w-3 h-3" /> Đang hiển thị
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          <EyeOff className="w-3 h-3" /> Đang ẩn
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-extrabold text-slate-900 tracking-tight line-clamp-1">
                      {slide.titleLine1 || ""} <span className="text-blue-600">{slide.titleLine2 || ""}</span>
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-2 max-w-xl">
                      {slide.desc || ""}
                    </p>

                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-600 flex-wrap">
                      <span className="font-semibold text-slate-900">
                        Nút: <span className="text-blue-600 underline font-bold">{slide.buttonText || "Chi tiết"}</span>
                      </span>
                      {slide.featureBadge && (
                        <>
                          <span>•</span>
                          <span>Tính năng: <strong className="text-slate-800">{slide.featureBadge}</strong></span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end lg:self-center pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-100 w-full lg:w-auto justify-end">
                  <button
                    onClick={() => handleToggleActive(slide)}
                    className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      slide.isActive !== false
                        ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs"
                    }`}
                    title={slide.isActive !== false ? "Tắt hiển thị slide này" : "Bật hiển thị slide này"}
                  >
                    {slide.isActive !== false ? (
                      <>
                        <EyeOff className="w-4 h-4 text-slate-500" />
                        <span className="hidden sm:inline">Ẩn</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Hiển Thị</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleOpenEdit(slide)}
                    className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Sửa Banner</span>
                  </button>

                  <button
                    onClick={() => handleRequestDeleteBanner(slide)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    title="Xóa banner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL: THÊM / CHỈNH SỬA BANNER VỚI LIVE PREVIEW */}
      {/* ======================================================== */}
      {showModal && (
        <div className="fixed inset-0 z-70 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-4xl w-full p-6 my-6 overflow-hidden max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {editingBanner ? "Chỉnh Sửa Banner Trang Chủ" : "Thêm Banner Mới Vào Trang Chủ"}
                  </h3>
                  <p className="text-xs text-slate-500">Tùy biến hình ảnh người mẫu, tròng kính công nghệ và nội dung quảng bá</p>
                </div>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="flex-1 overflow-y-auto py-5 pr-1 space-y-6 text-xs">
              
              {/* LIVE PREVIEW SECTION */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Xem Trước Trực Quan (Live Preview)</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Hình ảnh & nội dung cập nhật tự động</span>
                </div>

                <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 overflow-hidden relative shadow-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-2 text-blue-400 text-[10px] font-bold uppercase tracking-widest bg-blue-500/20 px-2.5 py-1 rounded-full border border-blue-500/30">
                        <span>{tag || "BỘ SƯU TẬP 2026"}</span>
                      </div>
                      
                      <div className="text-2xl sm:text-3xl font-light text-slate-100 leading-tight">
                        {title1 || "Tầm Nhìn"} <br />
                        <span className="font-extrabold text-white">{title2 || "Sắc Nét"}</span>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed italic">
                        {desc || "Mô tả banner..."}
                      </p>

                      <div className="flex items-center gap-2 pt-2">
                        <span className="px-4 py-2 bg-blue-600 text-white text-[11px] font-bold rounded-lg uppercase tracking-wider flex items-center gap-1 shadow-xs">
                          <span>{buttonText || "Xem Ngay"}</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                        {secButtonText && (
                          <span className="px-4 py-2 border border-slate-600 text-slate-200 text-[11px] font-bold rounded-lg uppercase tracking-wider flex items-center gap-1">
                            <Camera className="w-3 h-3 text-blue-400" />
                            <span>{secButtonText}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Image Preview Box with Brand Note */}
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
                      <img
                        src={image || "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=1200&q=85"}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
                      {brandNote && (
                        <div className="absolute top-2 left-2 right-2 bg-slate-950/80 backdrop-blur-xs px-2 py-1 rounded-md text-[10px] text-amber-300 font-medium truncate flex items-center gap-1 border border-white/10">
                          <Sparkles className="w-2.5 h-2.5 shrink-0" />
                          <span className="truncate">{brandNote}</span>
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-xs text-slate-900 p-2.5 rounded-lg text-[10px] shadow-sm">
                        <div className="font-bold text-blue-600">{featureBadge || "Tính năng nổi bật"}</div>
                        <div className="text-slate-600 truncate">{featureDesc || "Mô tả tính năng..."}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FORM FIELDS */}
              <form id="banner-form" onSubmit={handleSaveBanner} className="space-y-5">
                
                {/* 1. Hình ảnh minh họa */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                      <ImageIcon className="w-4 h-4 text-blue-600" />
                      <span>1. Hình Ảnh Minh Họa Banner (Có Người Mẫu / Tròng Kính) *</span>
                    </label>

                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-blue-600" />
                      <span>Tải Ảnh Từ Máy Tính</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <input
                    type="url"
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-slate-900 font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />

                  {/* Sample presets */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-600 block mb-1.5">
                      Chọn nhanh hình ảnh mẫu tròng kính & người mẫu quang học:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {SAMPLE_IMAGES.map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => setImage(preset.url)}
                          className={`p-2 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                            image === preset.url
                              ? "bg-blue-50 border-blue-500 ring-2 ring-blue-500/20"
                              : "bg-white border-gray-200 hover:bg-slate-50"
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-10 h-10 rounded-lg object-cover shrink-0 border border-gray-200"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 text-[11px] line-clamp-1">{preset.name}</div>
                            <div className="text-[10px] text-blue-600 font-medium">{preset.type}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Tiêu đề & Nội dung */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                  <label className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                    <Tag className="w-4 h-4 text-indigo-600" />
                    <span>2. Tiêu Đề, Tag Bộ Sưu Tập & Mô Tả</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Tag Bộ Sưu Tập / Tag Nhãn
                      </label>
                      <input
                        type="text"
                        required
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        placeholder="TRÒNG KÍNH CÔNG NGHỆ CHÍNH HÃNG"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Tiêu Đề Dòng 1
                      </label>
                      <input
                        type="text"
                        required
                        value={title1}
                        onChange={(e) => setTitle1(e.target.value)}
                        placeholder="Tầm Nhìn"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Tiêu Đề Dòng 2 (In Đậm)
                      </label>
                      <input
                        type="text"
                        required
                        value={title2}
                        onChange={(e) => setTitle2(e.target.value)}
                        placeholder="Sắc Nét & Bảo Vệ"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-extrabold text-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Mô Tả Chi Tiết Banner
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      placeholder="Tròng kính lọc ánh sáng xanh Essilor Crizal & Hoya BlueControl cao cấp..."
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-slate-900 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nhãn Thương Hiệu Góc Ảnh (Sticker)
                    </label>
                    <input
                      type="text"
                      value={brandNote}
                      onChange={(e) => setBrandNote(e.target.value)}
                      placeholder="Chính Hãng: Essilor (Pháp) • Hoya (Nhật Bản) • Chemi (Hàn Quốc)"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-slate-900"
                    />
                  </div>
                </div>

                {/* 3. Nút hành động & Danh mục chuyển hướng */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                  <label className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                    <ArrowRight className="w-4 h-4 text-emerald-600" />
                    <span>3. Nút Bấm Kêu Gọi Hành Động (CTA) & Danh Mục Chuyển Hướng</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Tên Nút Chính
                      </label>
                      <input
                        type="text"
                        required
                        value={buttonText}
                        onChange={(e) => setButtonText(e.target.value)}
                        placeholder="Bảng Giá Tròng Kính"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Chuyển Đến Danh Mục Khi Bấm
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as ProductCategory)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-slate-900"
                      >
                        <option value="trong-kinh">Tròng Kính Khúc Xạ (trong-kinh)</option>
                        <option value="gong-kinh-can">Gọng Kính Cận (gong-kinh-can)</option>
                        <option value="kinh-ram-mat">Kính Râm Polarized (kinh-ram-mat)</option>
                        <option value="kinh-doi-mau">Kính Đổi Màu (kinh-doi-mau)</option>
                        <option value="kinh-tre-em">Kính Mắt Trẻ Em (kinh-tre-em)</option>
                        <option value="phu-kien">Phụ Kiện Kính (phu-kien)</option>
                        <option value="all">Tất Cả Sản Phẩm (all)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Tên Nút Phụ (Mở Thử Kính AR / Hướng Dẫn)
                      </label>
                      <input
                        type="text"
                        value={secButtonText}
                        onChange={(e) => setSecButtonText(e.target.value)}
                        placeholder="Thử Kính Trực Tuyến"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Thẻ tính năng lơ lửng */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                  <label className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>4. Khung Tính Năng Nổi Bật (Thẻ Bo Góc Góc Ảnh)</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Tiêu Đề Tính Năng
                      </label>
                      <input
                        type="text"
                        required
                        value={featureBadge}
                        onChange={(e) => setFeatureBadge(e.target.value)}
                        placeholder="Essilor Crizal & Hoya BlueControl"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Nội Dung Mô Tả Ngắn Tính Năng
                      </label>
                      <input
                        type="text"
                        required
                        value={featureDesc}
                        onChange={(e) => setFeatureDesc(e.target.value)}
                        placeholder="Lọc 99% ánh sáng xanh tím có hại, chống chói lóa..."
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="font-bold text-slate-800 text-xs">Hiển thị slide này trên trang chủ ngay sau khi lưu</span>
                    </label>
                  </div>
                </div>

              </form>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 shrink-0">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Hủy Bỏ
              </button>

              <button
                type="submit"
                form="banner-form"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{editingBanner ? "Cập Nhật Banner" : "Lưu Banner Mới"}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: XÁC THỰC KÉP XÓA BANNER */}
      {bannerToDelete && (
        <ConfirmDeleteModal
          isOpen={!!bannerToDelete}
          itemType="banner"
          itemTitle={`${bannerToDelete.title1} ${bannerToDelete.title2}`}
          itemId={bannerToDelete.id}
          itemImage={bannerToDelete.image}
          itemSubtitle={`Thẻ: ${bannerToDelete.tag} • Vị trí thứ: ${(bannerToDelete.order || 0) + 1}`}
          onConfirm={handleConfirmDeleteBanner}
          onClose={() => setBannerToDelete(null)}
        />
      )}

    </div>
  );
};
