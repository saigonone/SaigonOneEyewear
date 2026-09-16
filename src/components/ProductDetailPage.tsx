import React, { useState, useEffect } from "react";
import { 
  ChevronRight, 
  Camera, 
  MessageSquare, 
  Sparkles, 
  Ruler, 
  Check, 
  Tag, 
  Share2, 
  Copy, 
  ArrowLeft, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Award, 
  Star, 
  CheckCircle2,
  ExternalLink,
  Layers
} from "lucide-react";
import { ZaloAppIcon, MessengerAppIcon } from "./BrandIcons";
import { Product, ProductColor, ProductCategory, LensOption } from "../types";
import { 
  getProductUrl, 
  getProductSlug, 
  CATEGORY_TO_PATH, 
  navigateTo 
} from "../utils/routes";
import { LENS_OPTIONS } from "../constants/storeConfig";
import { ProductCard } from "./ProductCard";
import { getProductRepresentativeImage, DEFAULT_PRODUCT_FALLBACK_IMAGE } from "../utils/productUtils";

interface ProductDetailPageProps {
  product: Product;
  initialColor?: ProductColor;
  allProducts: Product[];
  onGoBack: () => void;
  onGoHome: () => void;
  onSelectCategory: (cat: ProductCategory) => void;
  onSelectProduct: (p: Product, color?: ProductColor) => void;
  onOpenTryOn: (p: Product) => void;
  onOpenStores: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  initialColor,
  allProducts = [],
  onGoBack,
  onGoHome,
  onSelectCategory,
  onSelectProduct,
  onOpenTryOn,
  onOpenStores,
}) => {
  const representativeImg = product ? (getProductRepresentativeImage(product) || DEFAULT_PRODUCT_FALLBACK_IMAGE) : DEFAULT_PRODUCT_FALLBACK_IMAGE;
  const [selectedColor, setSelectedColor] = useState<ProductColor>(() => {
    return initialColor || product?.colors?.[0] || { name: "Màu Tiêu Chuẩn", hex: "#1e2022", image: representativeImg };
  });
  const [selectedImage, setSelectedImage] = useState<string>(() => {
    return initialColor?.image || representativeImg;
  });
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedLens, setSelectedLens] = useState<LensOption | null>(null);

  // Sync color/image when product prop changes
  useEffect(() => {
    if (!product) return;
    const freshThumb = getProductRepresentativeImage(product) || DEFAULT_PRODUCT_FALLBACK_IMAGE;
    const firstCol = initialColor || product?.colors?.[0] || { name: "Màu Tiêu Chuẩn", hex: "#1e2022", image: freshThumb };
    setSelectedColor(firstCol);
    setSelectedImage(initialColor?.image || firstCol?.image || freshThumb);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [product, initialColor]);


  const getCategoryLabel = (cat: ProductCategory) => {
    switch (cat) {
      case "gong-kinh-can":
        return "Gọng Kính Cận";
      case "kinh-ram-mat":
        return "Kính Thời Trang";
      case "kinh-doi-mau":
        return "Kính Đổi Màu";
      case "trong-kinh":
        return "Tròng Kính";
      case "kinh-tre-em":
        return "Kính Trẻ Em";
      case "phu-kien":
        return "Phụ Kiện Kính";
      default:
        return "Gọng Kính";
    }
  };

  const getMaterialLabel = (mat: string) => {
    const map: Record<string, string> = {
      "titanium": "Titanium siêu nhẹ nguyên khối",
      "acetate": "Nhựa Acetate cao cấp nguyên khối",
      "kim-loai": "Hợp kim mạ vàng 18K PVD không gỉ",
      "nhua-tr90": "Nhựa dẻo Thụy Sĩ TR90 siêu bền",
      "go-cao-cap": "Gỗ tự nhiên cao cấp",
      "khong-vien": "Titanium không viền khoan ốc",
    };
    return map[mat] || "Titanium / Acetate cao cấp";
  };

  const getShapeLabel = (shape: string) => {
    const map: Record<string, string> = {
      "da-giac": "Đa giác cá tính",
      "vuong": "Vuông cổ điển",
      "tron": "Tròn vintage Hàn Quốc",
      "mat-meo": "Mắt mèo sang trọng",
      "browline": "Browline thanh lịch",
      "aviator": "Phi công (Aviator) thời thượng",
      "oval": "Oval mềm mại",
      "chu-nhat": "Chữ nhật hiện đại",
    };
    return map[shape] || "Dáng thời trang";
  };

  const getGenderLabel = (g: string) => {
    const map: Record<string, string> = {
      "nam": "Nam",
      "nu": "Nữ",
      "unisex": "Unisex (Nam & Nữ)",
      "tre-em": "Trẻ em",
    };
    return map[g] || "Unisex";
  };

  const handleColorSelect = (col: ProductColor) => {
    setSelectedColor(col);
    if (col.image) {
      setSelectedImage(col.image);
    }
  };

  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleContactZalo = () => {
    const msg = `Xin chào Sài Gòn One Eyewear, tôi đang quan tâm mẫu kính ${product.name} (Mã SKU: ${product.sku}, Màu: ${selectedColor.name}). Nhờ shop tư vấn và báo giá chi tiết giúp tôi.`;
    const encoded = encodeURIComponent(msg);
    window.open(`https://zalo.me/0973819928?text=${encoded}`, "_blank", "noopener,noreferrer");
  };

  const handleContactMessenger = () => {
    window.open("https://www.facebook.com/SaigonOneEyewear/", "_blank", "noopener,noreferrer");
  };

  if (!product) {
    return null;
  }

  // Related products from same category or brand
  const relatedProducts = (allProducts || [])
    .filter((p) => {
      if (!p || p.id === product.id) return false;
      const isBrandMatch = p.brand === product.brand;
      const productCategories = product.categories && product.categories.length > 0 ? product.categories : [product.category];
      const pCategories = p.categories && p.categories.length > 0 ? p.categories : [p.category];
      const isCategoryMatch = productCategories.some((c) => pCategories.includes(c));
      return isBrandMatch || isCategoryMatch;
    })
    .slice(0, 4);

  const fallbackRelated = relatedProducts.length > 0 
    ? relatedProducts 
    : (allProducts || []).filter((p) => p && p.id !== product.id).slice(0, 4);

  const currentSlug = getProductSlug(product);
  const categoryPath = (product.category && CATEGORY_TO_PATH[product.category]) || "/san-pham";


  return (
    <div className="bg-[#fcfbf9] min-h-screen text-slate-800 pb-20 animate-in fade-in duration-300">
      
      {/* Top Breadcrumbs & Back Bar */}
      <div className="bg-white border-b border-stone-200/80 sticky top-16 sm:top-20 z-30 shadow-2xs backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <nav className="flex items-center gap-1.5 sm:gap-2 text-xs text-stone-500 overflow-x-auto whitespace-nowrap scrollbar-none">
            <button
              onClick={onGoHome}
              className="hover:text-amber-800 transition-colors font-medium flex items-center gap-1 cursor-pointer"
            >
              Trang Chủ
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            {product.categories && product.categories.length > 1 ? (
              <span className="flex items-center gap-1">
                {product.categories.map((c, idx) => (
                  <React.Fragment key={c}>
                    <button
                      onClick={() => onSelectCategory(c)}
                      className="hover:text-amber-800 transition-colors font-medium cursor-pointer"
                    >
                      {getCategoryLabel(c)}
                    </button>
                    {idx < product.categories!.length - 1 && <span className="text-stone-300">/</span>}
                  </React.Fragment>
                ))}
              </span>
            ) : (
              <button
                onClick={() => onSelectCategory(product.category)}
                className="hover:text-amber-800 transition-colors font-medium cursor-pointer"
              >
                {getCategoryLabel(product.category)}
              </button>
            )}
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="font-semibold text-stone-900 truncate max-w-[200px] sm:max-w-md">
              {product.name}
            </span>
          </nav>

          <button
            onClick={onGoBack}
            className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-amber-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg transition-colors shrink-0 cursor-pointer ml-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Quay Lại Danh Sách</span>
            <span className="sm:hidden">Quay lại</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        
        {/* Main Product Showcase Box (2 Columns) */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden p-5 sm:p-8 lg:p-10 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Column: Gallery, Try-On & Badges (5 cols on lg) */}
            <div className="lg:col-span-6 flex flex-col space-y-4">
              
              {/* Main Image Showcase */}
              <div className="relative aspect-square w-full bg-[#f8f7f5] rounded-2xl border border-stone-200 flex items-center justify-center overflow-hidden group">
                
                {/* Top Badges */}
                <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5 pointer-events-none">
                  {product.isNewArrival && (
                    <span className="px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider bg-stone-900 text-white rounded-md shadow-sm">
                      MẪU MỚI 2026
                    </span>
                  )}
                  {product.isBestSeller && (
                    <span className="px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider bg-amber-600 text-white rounded-md shadow-sm">
                      BÁN CHẠY NHẤT
                    </span>
                  )}
                  {product.originalPrice > product.price && (
                    <span className="px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider bg-rose-600 text-white rounded-md shadow-sm">
                      TIẾT KIỆM {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>

                <img
                  src={selectedImage || representativeImg}
                  alt={product.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-106"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== DEFAULT_PRODUCT_FALLBACK_IMAGE) {
                      target.src = DEFAULT_PRODUCT_FALLBACK_IMAGE;
                    }
                  }}
                />

                {/* Quick AR Try-On Overlay Button */}
                <button
                  id="btn-page-open-tryon"
                  onClick={() => onOpenTryOn(product)}
                  className="absolute bottom-4 right-4 flex items-center gap-2 bg-stone-900/95 hover:bg-black text-amber-400 text-xs font-bold px-4 py-2.5 rounded-full shadow-lg backdrop-blur-xs transition-all duration-200 transform hover:scale-105 cursor-pointer border border-amber-400/30"
                >
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>Thử Kính AR 3D Ngay</span>
                </button>
              </div>

              {/* Color Swatch & Thumbnail Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="bg-stone-50/80 rounded-2xl p-4 border border-stone-200/80">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                      Màu sắc lựa chọn: <strong className="text-amber-900 font-extrabold">{selectedColor.name}</strong>
                    </span>
                    <span className="text-[11px] text-stone-500 font-medium">({product.colors.length} phiên bản màu)</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {product.colors.map((col, idx) => {
                      const isSelected = selectedColor.name === col.name;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleColorSelect(col)}
                          className={`flex items-center gap-2 p-2 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                            isSelected
                              ? "border-amber-600 bg-amber-50/90 text-amber-950 ring-2 ring-amber-600/30 shadow-xs font-bold"
                              : "border-stone-200 hover:border-stone-300 bg-white text-stone-700 hover:bg-stone-100/60"
                          }`}
                        >
                          <span 
                            className="w-4 h-4 rounded-full border border-stone-300 shrink-0 shadow-2xs" 
                            style={{ backgroundColor: col.hex }} 
                          />
                          <span className="truncate">{col.name.split("(")[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Multi-Image Thumbnails if provided */}
              {product.images && product.images.length > 1 && (
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {product.images.map((imgUrl, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`relative w-16 h-16 rounded-xl border overflow-hidden shrink-0 transition-all cursor-pointer ${
                        selectedImage === imgUrl
                          ? "border-amber-600 ring-2 ring-amber-600/40 shadow-xs"
                          : "border-stone-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={imgUrl} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

            </div>

            {/* Right Column: Title, Specs, Guarantees & Primary Action (6 cols on lg) */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              
              <div>
                {/* Brand & SKU Header */}
                <div className="flex items-center gap-2 flex-wrap mb-2.5">
                  <span className="px-3 py-1 bg-amber-100/80 text-amber-900 text-xs font-bold rounded-lg uppercase tracking-wider">
                    {product.brand}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-700 text-xs font-mono font-bold px-2.5 py-1 rounded-lg border border-stone-200">
                    <Tag className="w-3 h-3 text-amber-600" />
                    <span>Mã SKU: {product.sku}</span>
                  </span>
                  <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Còn hàng tại 178 Phan Đăng Lưu</span>
                  </span>
                </div>

                {/* Product Title - Modern Sans Font matching menu */}
                <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-stone-950 font-sans leading-tight mb-3 tracking-tight">
                  {product.name}
                </h1>

                {/* Star Rating & Review count */}
                <div className="flex items-center gap-2 text-xs text-stone-600 mb-4 pb-4 border-b border-stone-100">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-stone-900">5.0</span>
                  <span className="text-stone-400">•</span>
                  <span>100% Khách hàng đánh giá hài lòng</span>
                  <span className="text-stone-400">•</span>
                  <span className="text-stone-500">Đã bán {product.stock ? 50 - product.stock + 20 : 38} chiếc</span>
                </div>

                {/* Price Display */}
                <div className="bg-stone-50/90 rounded-2xl p-4 sm:p-5 border border-stone-200/90 mb-5">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-amber-800 font-sans tracking-tight">
                      {product.price.toLocaleString("vi-VN")}đ
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-base text-stone-400 line-through font-medium">
                        {product.originalPrice.toLocaleString("vi-VN")}đ
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Giá trọn bộ gọng chính hãng • Miễn phí đo khám mắt khúc xạ & lắp ráp tròng kính lấy liền 15 phút.
                  </p>
                </div>

                {/* Detailed Attributes */}
                <div className="grid grid-cols-2 gap-3 text-xs mb-5">
                  <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs">
                    <span className="text-stone-400 block text-[11px] mb-0.5">Chất liệu gọng</span>
                    <strong className="text-stone-900 font-semibold">{getMaterialLabel(product.material)}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs">
                    <span className="text-stone-400 block text-[11px] mb-0.5">Kiểu dáng mắt</span>
                    <strong className="text-stone-900 font-semibold">{getShapeLabel(product.frameShape)}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs">
                    <span className="text-stone-400 block text-[11px] mb-0.5">Đối tượng</span>
                    <strong className="text-stone-900 font-semibold">{getGenderLabel(product.gender)}</strong>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs">
                    <span className="text-stone-400 block text-[11px] mb-0.5">Trọng lượng</span>
                    <strong className="text-stone-900 font-semibold">{product.weight ? `${product.weight}g (Siêu nhẹ)` : "12.5g (Siêu nhẹ)"}</strong>
                  </div>
                </div>

                {/* Frame Dimensions Specification Box */}
                <div className="bg-white rounded-2xl border border-stone-200 p-4 mb-5 shadow-2xs">
                  <div className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5 mb-3 pb-2 border-b border-stone-100">
                    <Ruler className="w-4 h-4 text-amber-600" />
                    <span>THÔNG SỐ KÍCH THƯỚC CHI TIẾT GỌNG</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2 bg-stone-50 rounded-lg">
                      <span className="text-stone-400 text-[10px] block">Mắt kính</span>
                      <span className="font-extrabold text-stone-900">{product.dimensions?.lensWidth || 51} mm</span>
                    </div>
                    <div className="p-2 bg-stone-50 rounded-lg">
                      <span className="text-stone-400 text-[10px] block">Cầu mũi</span>
                      <span className="font-extrabold text-stone-900">{product.dimensions?.bridgeWidth || 19} mm</span>
                    </div>
                    <div className="p-2 bg-stone-50 rounded-lg">
                      <span className="text-stone-400 text-[10px] block">Càng kính</span>
                      <span className="font-extrabold text-stone-900">{product.dimensions?.templeLength || 145} mm</span>
                    </div>
                    <div className="p-2 bg-stone-50 rounded-lg">
                      <span className="text-stone-400 text-[10px] block">Chiều cao</span>
                      <span className="font-extrabold text-stone-900">{product.dimensions?.frameHeight || 44} mm</span>
                    </div>
                  </div>
                </div>

                {/* Highlights description */}
                <div className="bg-stone-50/70 rounded-2xl p-4 border border-stone-200/80 mb-5">
                  <div className="text-xs font-extrabold text-amber-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Đặc Điểm Thiết Kế Nổi Bật</span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed mb-3">
                    {product.description || "Gọng kính chính hãng Sài Gòn One với thiết kế thanh lịch, góc cạnh chuẩn tỉ lệ vàng gương mặt châu Á. Bản lề gia cố đàn hồi cao, ôm trọn gương mặt mà không gây đau cấn vành tai."}
                  </p>
                  {product.highlights && product.highlights.length > 0 && (
                    <ul className="space-y-1.5 text-xs text-stone-700">
                      {product.highlights.map((hl, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* 4 Optical Guarantees */}
                <div className="space-y-2 text-xs text-stone-700 mb-6 bg-amber-50/40 p-4 rounded-2xl border border-amber-200/60">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-700 shrink-0" />
                    <span><strong>Miễn phí đo khám mắt khúc xạ</strong> chuẩn y khoa máy đo tự động Nhật Bản.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                    <span><strong>Cắt kính lấy ngay trong 15-20 phút</strong> bằng máy mài tự động công nghệ cao.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                    <span><strong>Bảo hành nắn chỉnh gọng trọn đời</strong>, thay ve đệm mũi miễn phí.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-700 shrink-0" />
                    <span><strong>Tặng kèm</strong> hộp da cao cấp dập chìm, khăn nano & nước xịt kính chuyên dụng.</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                
                {/* Main Action CTAs: Zalo & Messenger Fanpage - Always 1 row on mobile & desktop */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <button
                    id="btn-pdp-zalo-order"
                    onClick={handleContactZalo}
                    className="w-full py-3 sm:py-4 px-2 sm:px-4 bg-[#0068ff] hover:bg-[#0054d1] active:bg-[#0047b3] text-white font-extrabold text-xs sm:text-base rounded-xl sm:rounded-2xl flex items-center justify-center gap-1.5 sm:gap-2 shadow-md uppercase tracking-wide transition-all duration-200 cursor-pointer"
                  >
                    <ZaloAppIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 rounded-xs overflow-hidden" />
                    <span className="truncate">
                      <span className="hidden sm:inline">Zalo: 0973.819.928</span>
                      <span className="sm:hidden">Chat Zalo</span>
                    </span>
                  </button>

                  <button
                    id="btn-pdp-messenger-order"
                    onClick={handleContactMessenger}
                    className="w-full py-3 sm:py-4 px-2 sm:px-4 bg-[#0084ff] hover:bg-[#0070db] active:bg-[#005cb8] text-white font-extrabold text-xs sm:text-base rounded-xl sm:rounded-2xl flex items-center justify-center gap-1.5 sm:gap-2 shadow-md uppercase tracking-wide transition-all duration-200 cursor-pointer"
                  >
                    <MessengerAppIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    <span className="truncate">
                      <span className="hidden sm:inline">Messenger Fanpage</span>
                      <span className="sm:hidden">Messenger</span>
                    </span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                  {/* Hotline CTA */}
                  <a
                    href="tel:0973819928"
                    className="py-2.5 sm:py-3 px-2 sm:px-4 bg-stone-900 hover:bg-black text-white font-bold text-[11px] sm:text-xs rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 transition-colors cursor-pointer text-center no-underline"
                  >
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                    <span className="truncate">
                      <span className="hidden sm:inline">Hotline: 0973.819.928</span>
                      <span className="sm:hidden">Hotline</span>
                    </span>
                  </a>

                  {/* Copy Link / Share */}
                  <button
                    onClick={handleCopyLink}
                    className="py-2.5 sm:py-3 px-2 sm:px-4 bg-white hover:bg-stone-100 text-stone-800 font-bold text-[11px] sm:text-xs rounded-xl border border-stone-200 flex items-center justify-center gap-1.5 sm:gap-2 transition-colors cursor-pointer"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                        <span className="text-emerald-700 truncate">Đã sao chép!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-500 shrink-0" />
                        <span className="truncate">
                          <span className="hidden sm:inline">Sao chép Link</span>
                          <span className="sm:hidden">Chia sẻ link</span>
                        </span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-center text-[11px] text-stone-500 pt-1">
                  📍 Trực tiếp thử kính & đo mắt tại Flagship: <strong>178 Phan Đăng Lưu, P.3, Q. Phú Nhuận, TP.HCM</strong>
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* Section 2: GỢI Ý CÁC DÒNG TRÒNG KÍNH PHÙ HỢP */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
            <div>
              <span className="text-xs font-extrabold text-amber-800 uppercase tracking-widest">
                ĐỒNG HÀNH BẢO VỆ MẮT
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-sans tracking-tight">
                Lựa Chọn Tròng Kính Cắt Theo Độ Cận Của Bạn
              </h2>
            </div>
            <button
              onClick={handleContactZalo}
              className="text-xs font-bold text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 px-4 py-2.5 rounded-xl transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer border border-amber-200"
            >
              <span>Nhắn Zalo tư vấn độ cận</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
            {LENS_OPTIONS.slice(1, 7).map((lens) => (
              <div
                key={lens.id}
                className="p-5 rounded-2xl border border-stone-200 hover:border-amber-500/80 bg-stone-50/50 hover:bg-amber-50/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-200/80 text-stone-800 px-2 py-0.5 rounded">
                      {lens.brand}
                    </span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                      Chiết suất {lens.index}
                    </span>
                  </div>

                  <h3 className="font-bold text-stone-900 text-sm mb-1.5 leading-snug">
                    {lens.name}
                  </h3>

                  <p className="text-xs text-stone-500 line-clamp-2 mb-3 leading-relaxed">
                    {lens.description}
                  </p>

                  <div className="space-y-1 text-xs text-stone-600 mb-4">
                    {lens.features.slice(0, 3).map((feat, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="text-[11px] truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-extrabold text-amber-800">
                      +{lens.price.toLocaleString("vi-VN")}đ
                    </span>
                    {lens.originalPrice && lens.originalPrice > lens.price && (
                      <span className="text-[10px] text-stone-400 line-through ml-1.5">
                        {lens.originalPrice.toLocaleString("vi-VN")}đ
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleContactZalo}
                    className="text-xs font-bold text-stone-800 hover:text-amber-900 underline cursor-pointer"
                  >
                    Chọn tròng này
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: SẢN PHẨM CÙNG BỘ SƯU TẬP / TƯƠNG TỰ */}
        {fallbackRelated.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="text-xs font-extrabold text-amber-800 uppercase tracking-widest">
                  GỢI Ý DÀNH CHO BẠN
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-sans tracking-tight">
                  Sản Phẩm Cùng Bộ Sưu Tập
                </h2>
              </div>

              <button
                onClick={() => onSelectCategory(product.category)}
                className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
              >
                <span>Xem tất cả {getCategoryLabel(product.category)}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {fallbackRelated.map((relProd) => (
                <ProductCard
                  key={relProd.id}
                  product={relProd}
                  isFavorite={false}
                  onToggleFavorite={() => {}}
                  onOpenDetail={(p, col) => onSelectProduct(p, col)}
                  onQuickTryOn={onOpenTryOn}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
