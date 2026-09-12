import React, { useState, useMemo } from "react";
import { 
  Glasses, 
  Search, 
  ChevronRight, 
  Home, 
  Sparkles, 
  SlidersHorizontal, 
  ArrowUpDown, 
  RotateCcw, 
  Heart, 
  Camera, 
  X, 
  Shield, 
  Phone, 
  MapPin, 
  CheckCircle2,
  Eye
} from "lucide-react";
import { 
  Product, 
  ProductCategory, 
  GenderTarget, 
  FrameShape, 
  FrameMaterial, 
  FaceShape, 
  ProductColor 
} from "../types";
import { ProductCard } from "./ProductCard";
import { CATEGORY_TO_PATH, navigateTo } from "../utils/routes";

interface ProductsPageProps {
  products: Product[];
  selectedCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  onGoHome: () => void;
  onOpenProductDetail: (product: Product, color?: ProductColor) => void;
  onOpenTryOn: (product?: Product) => void;
  onOpenFaceAdvisor: () => void;
  onOpenLensGuide: () => void;
  onOpenStores: () => void;
  favoriteIds: string[];
  onToggleFavorite: (product: Product) => void;
  initialSearchQuery?: string;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products = [],
  selectedCategory = "all",
  onSelectCategory,
  onGoHome,
  onOpenProductDetail,
  onOpenTryOn,
  onOpenFaceAdvisor,
  onOpenLensGuide,
  onOpenStores,
  favoriteIds = [],
  onToggleFavorite,
  initialSearchQuery = "",
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
  const [selectedGender, setSelectedGender] = useState<GenderTarget | "all">("all");
  const [selectedFrameShape, setSelectedFrameShape] = useState<FrameShape | "all">("all");
  const [selectedMaterial, setSelectedMaterial] = useState<FrameMaterial | "all">("all");
  const [selectedFaceShapeFilter, setSelectedFaceShapeFilter] = useState<FaceShape | null>(null);
  const [sortBy, setSortBy] = useState<"featured" | "newest" | "price_asc" | "price_desc" | "rating">("featured");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);

  // Danh sách các danh mục sản phẩm chính thức
  const categoriesList: { id: ProductCategory; label: string; desc: string }[] = [
    { id: "all", label: "Tất Cả Sản Phẩm", desc: "Bộ sưu tập gọng kính & tròng kính 2026" },
    { id: "gong-kinh-can", label: "Gọng Kính Cận", desc: "Titanium, Acetate, TR90 siêu nhẹ" },
    { id: "kinh-ram-mat", label: "Kính Thời Trang", desc: "Kính râm mát chống chói UV400" },
    { id: "kinh-doi-mau", label: "Kính Áp Tròng", desc: "Kính áp tròng êm ái & kính đổi màu" },
    { id: "trong-kinh", label: "Tròng Kính", desc: "Chống ánh sáng xanh & siêu mỏng" },
    { id: "kinh-tre-em", label: "Kính Trẻ Em", desc: "Nhựa dẻo bền bỉ, an toàn cho bé" },
    { id: "phu-kien", label: "Phụ Kiện Kính", desc: "Hộp kính, khăn nano, nước lau kính" },
  ];

  // Helper tính số lượng sản phẩm theo từng danh mục
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    categoriesList.forEach((c) => {
      if (c.id !== "all") {
        counts[c.id] = products.filter((p) => p.category === c.id || (Array.isArray(p.categories) && p.categories.includes(c.id as ProductCategory))).length;
      }
    });
    return counts;
  }, [products]);

  // Bộ lọc sản phẩm
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Lọc theo Danh mục
      if (selectedCategory !== "all") {
        const inCat = p.category === selectedCategory || (Array.isArray(p.categories) && p.categories.includes(selectedCategory as ProductCategory));
        if (!inCat) {
          return false;
        }
      }

      // 2. Lọc theo Giới tính
      if (selectedGender !== "all" && p.gender !== "unisex" && p.gender !== selectedGender) {
        return false;
      }

      // 3. Lọc theo Dáng gọng
      if (selectedFrameShape !== "all" && p.shape !== selectedFrameShape) {
        return false;
      }

      // 4. Lọc theo Chất liệu
      if (selectedMaterial !== "all" && p.material !== selectedMaterial) {
        return false;
      }

      // 5. Lọc theo Dáng khuôn mặt
      if (selectedFaceShapeFilter && !p.suitableFaceShapes.includes(selectedFaceShapeFilter)) {
        return false;
      }

      // 6. Lọc sản phẩm yêu thích
      if (showOnlyFavorites && !favoriteIds.includes(p.id)) {
        return false;
      }

      // 7. Lọc theo Tìm kiếm
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchName = (p.name || "").toLowerCase().includes(q);
        const matchBrand = (p.brand || "").toLowerCase().includes(q);
        const matchSku = (p.sku || "").toLowerCase().includes(q);
        const matchDesc = (p.description || "").toLowerCase().includes(q);
        const matchMaterial = (p.material || "").toLowerCase().includes(q);
        const matchShape = (p.shape || "").toLowerCase().includes(q);
        return matchName || matchBrand || matchSku || matchDesc || matchMaterial || matchShape;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "newest") return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [
    products, 
    selectedCategory, 
    selectedGender, 
    selectedFrameShape, 
    selectedMaterial, 
    selectedFaceShapeFilter, 
    showOnlyFavorites, 
    favoriteIds, 
    searchQuery, 
    sortBy
  ]);

  const hasActiveFilters = 
    selectedCategory !== "all" ||
    selectedGender !== "all" ||
    selectedFrameShape !== "all" ||
    selectedMaterial !== "all" ||
    selectedFaceShapeFilter !== null ||
    showOnlyFavorites ||
    searchQuery.trim() !== "";

  const resetAllFilters = () => {
    onSelectCategory("all");
    setSelectedGender("all");
    setSelectedFrameShape("all");
    setSelectedMaterial("all");
    setSelectedFaceShapeFilter(null);
    setShowOnlyFavorites(false);
    setSearchQuery("");
    setSortBy("featured");
    navigateTo(CATEGORY_TO_PATH["all"]);
  };

  const handleTabClick = (catId: ProductCategory) => {
    onSelectCategory(catId);
    const path = CATEGORY_TO_PATH[catId] || "/san-pham";
    navigateTo(path);
  };

  const currentCategoryObj = categoriesList.find(c => c.id === selectedCategory) || categoriesList[0];

  return (
    <div id="products-page" className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* 1. Breadcrumbs Bar */}
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
            <button
              onClick={() => handleTabClick("all")}
              className={`hover:text-blue-600 transition-colors cursor-pointer ${
                selectedCategory === "all" ? "text-slate-900 font-bold" : "text-slate-500"
              }`}
            >
              Danh Mục Sản Phẩm
            </button>
            {selectedCategory !== "all" && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-slate-900 font-bold">{currentCategoryObj.label}</span>
              </>
            )}
          </nav>
          
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Chính hãng 100% • Bảo hành nắn chỉnh & thay ve ốc trọn đời</span>
          </div>
        </div>
      </div>

      {/* 2. Hero Header Banner (Đồng bộ font 30px, padding 20px) */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-[20px] relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 -bottom-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentCategoryObj.label} - Saigon One Eyewear 2026</span>
            </div>
            
            <h1 id="heading-products-page-title" className="text-[30px] font-black tracking-tight text-white leading-tight">
              Danh Mục <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-amber-300">Sản Phẩm</span>
            </h1>
            
            <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Đo khám khúc xạ chuẩn y khoa miễn phí & cắt kính lấy ngay trong 15 phút tại 178 Phan Đăng Lưu, Phú Nhuận. 
              Trải nghiệm các bộ sưu tập gọng kính Titanium siêu nhẹ, Acetate cao cấp và kính thời trang phân cực Polarized.
            </p>

            {/* Live Search Box inside Hero */}
            <div className="mt-5 max-w-xl">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Tìm kiếm mẫu kính (ví dụ: titan, rayban, mắt mèo, vuông, đổi màu...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-20 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 px-2.5 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-md font-medium cursor-pointer"
                  >
                    Xóa
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Category Filter Navigation Bar (Sticky tabs) */}
      <div className="sticky top-14 sm:top-16 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 shrink-0">
              {categoriesList.map((cat) => {
                const isActive = selectedCategory === cat.id;
                const count = categoryCounts[cat.id] || 0;
                return (
                  <button
                    key={cat.id}
                    id={`btn-product-category-${cat.id}`}
                    onClick={() => handleTabClick(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? "bg-slate-900 text-white shadow-sm"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? "bg-slate-700 text-white" : "bg-slate-200 text-slate-600"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick AR Try on CTA Button in Tabs */}
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              <button
                onClick={() => onOpenTryOn()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold rounded-xl border border-blue-200/80 transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-blue-600" />
                <span>Thử Kính AR 3D</span>
              </button>
              <button
                onClick={onOpenFaceAdvisor}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 text-amber-800 hover:bg-amber-100 text-xs font-bold rounded-xl border border-amber-200/80 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Tư Vấn Khuôn Mặt</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Main Products Content Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Secondary Filter & Sort Controls Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-gray-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span>{currentCategoryObj.label}</span>
              <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {filteredProducts.length} mẫu kính
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentCategoryObj.desc} • Miễn phí vận chuyển toàn quốc cho đơn từ 500K
            </p>
          </div>

          {/* Filter Dropdowns and Actions */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Gender Filter */}
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value as any)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-slate-700 shadow-xs focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option value="all">Tất Cả Giới Tính</option>
              <option value="nam">Dành Cho Nam</option>
              <option value="nu">Dành Cho Nữ</option>
              <option value="unisex">Unisex (Nam/Nữ)</option>
              <option value="tre-em">Trẻ Em</option>
            </select>

            {/* Shape Filter */}
            <select
              value={selectedFrameShape}
              onChange={(e) => setSelectedFrameShape(e.target.value as any)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-slate-700 shadow-xs focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option value="all">Tất Cả Dáng Gọng</option>
              <option value="da-giac">Dáng Đa Giác (Polygon)</option>
              <option value="vuong">Dáng Vuông (Square)</option>
              <option value="tron">Dáng Tròn (Round)</option>
              <option value="mat-meo">Dáng Mắt Mèo (Cat Eye)</option>
              <option value="browline">Dáng Browline (Clubmaster)</option>
              <option value="aviator">Dáng Phi Công (Aviator)</option>
              <option value="oval">Dáng Oval</option>
              <option value="chu-nhat">Dáng Chữ Nhật</option>
            </select>

            {/* Material Filter */}
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value as any)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-slate-700 shadow-xs focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option value="all">Tất Cả Chất Liệu</option>
              <option value="titanium">Titanium Siêu Nhẹ</option>
              <option value="acetate">Acetate Cao Cấp</option>
              <option value="kim-loai">Hợp Kim Cao Cấp</option>
              <option value="nhua-tr90">Nhựa TR90 Siêu Dẻo</option>
              <option value="go-cao-cap">Gỗ Tự Nhiên</option>
              <option value="khong-vien">Gọng Khoan (Không viền)</option>
            </select>

            {/* Favorites Toggle Button */}
            <button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`flex items-center gap-1 px-3 py-2 border rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                showOnlyFavorites
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-white text-slate-700 border-gray-200 hover:bg-slate-50"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${showOnlyFavorites ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
              <span>Yêu Thích ({favoriteIds.length})</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-xs text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-slate-900 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="featured">Nổi Bật Nhất</option>
                <option value="newest">Mới Ra Mắt</option>
                <option value="price_asc">Giá: Thấp đến Cao</option>
                <option value="price_desc">Giá: Cao đến Thấp</option>
                <option value="rating">Đánh Giá Cao Nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Tags Strip */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 py-3">
            <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Đang lọc:</span>
            
            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                Danh mục: {currentCategoryObj.label}
                <button onClick={() => handleTabClick("all")} className="cursor-pointer hover:text-blue-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {selectedGender !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                Giới tính: {selectedGender}
                <button onClick={() => setSelectedGender("all")} className="cursor-pointer hover:text-blue-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {selectedFrameShape !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                Dáng: {selectedFrameShape}
                <button onClick={() => setSelectedFrameShape("all")} className="cursor-pointer hover:text-blue-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {selectedMaterial !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                Chất liệu: {selectedMaterial}
                <button onClick={() => setSelectedMaterial("all")} className="cursor-pointer hover:text-blue-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {selectedFaceShapeFilter && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#0f172a] text-white text-xs font-bold shadow-xs">
                Khuôn mặt: {selectedFaceShapeFilter}
                <button onClick={() => setSelectedFaceShapeFilter(null)} className="cursor-pointer hover:text-amber-300">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {showOnlyFavorites && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-50 text-red-600 text-xs font-semibold border border-red-200">
                Đã thích
                <button onClick={() => setShowOnlyFavorites(false)} className="cursor-pointer hover:text-red-800">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200">
                Tìm kiếm: "{searchQuery}"
                <button onClick={() => setSearchQuery("")} className="cursor-pointer hover:text-amber-950">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={resetAllFilters}
              className="text-xs text-gray-500 hover:text-slate-900 underline font-medium ml-2 cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Xóa toàn bộ bộ lọc</span>
            </button>
          </div>
        )}

        {/* 5. Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-white rounded-2xl border border-gray-200 mt-4 shadow-xs">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Glasses className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Không tìm thấy mẫu kính phù hợp với bộ lọc</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Thử xóa bớt các điều kiện lọc hoặc gõ từ khóa tìm kiếm chung như "titan", "kính râm", "mắt mèo"...
            </p>
            <button
              onClick={resetAllFilters}
              className="px-6 py-2.5 bg-[#0f172a] hover:bg-blue-900 text-white font-bold uppercase tracking-widest rounded-lg text-xs transition-colors cursor-pointer"
            >
              Xem tất cả kính mắt ({products.length})
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 pt-4">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                isFavorite={favoriteIds.includes(p.id)}
                onToggleFavorite={onToggleFavorite}
                onOpenDetail={(product, color) => onOpenProductDetail(product, color)}
                onQuickTryOn={onOpenTryOn}
              />
            ))}
          </div>
        )}

        {/* 6. Virtual Try-On AR Banner */}
        <div className="mt-16 p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-blue-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] border border-blue-500/30">
              <Camera className="w-3.5 h-3.5" />
              <span>Công Nghệ AR 3D Trực Tuyến</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Thử Kính Trực Tiếp Ngay Tại Nhà
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Bật camera trực tiếp để ướm thử hàng trăm mẫu gọng kính lên khuôn mặt bạn siêu thực tế, chuẩn tỉ lệ 1:1 trước khi ghé showroom.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenTryOn()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest px-6 py-3.5 rounded-xl text-xs shadow-lg transition-all duration-200 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Thử Kính AR Ngay</span>
            </button>
            <button
              onClick={onOpenFaceAdvisor}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold uppercase tracking-wider px-5 py-3.5 rounded-xl text-xs border border-slate-700 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Tư Vấn Khuôn Mặt</span>
            </button>
          </div>
        </div>

        {/* 7. Store Contact Callout */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                Showroom Flagship Mắt Kính Sài Gòn One
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                178 Phan Đăng Lưu, Phường 3, Phú Nhuận, TP.HCM • Mở cửa 8:30 - 21:30 hàng ngày
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:0973819928"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span>0973.819.928</span>
            </a>
            <button
              onClick={onOpenStores}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Chỉ Đường & Đặt Lịch
            </button>
          </div>
        </div>

      </main>
    </div>
  );
};
