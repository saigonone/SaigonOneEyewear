import React, { useState, useEffect } from "react";
import { 
  X, 
  Camera, 
  MessageSquare, 
  Phone,
  Sparkles, 
  Ruler, 
  Check, 
  Tag
} from "lucide-react";
import { ZaloAppIcon, MessengerAppIcon } from "./BrandIcons";
import { Product, ProductColor } from "../types";
import { getProductRepresentativeImage, DEFAULT_PRODUCT_FALLBACK_IMAGE } from "../utils/productUtils";

interface ProductDetailModalProps {
  product: Product;
  initialColor?: ProductColor;
  isFavorite: boolean;
  onToggleFavorite: (p: Product) => void;
  onClose: () => void;
  onOpenTryOn: (p: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  initialColor,
  onClose,
  onOpenTryOn,
}) => {
  const representativeImg = product ? (getProductRepresentativeImage(product) || DEFAULT_PRODUCT_FALLBACK_IMAGE) : DEFAULT_PRODUCT_FALLBACK_IMAGE;
  const [selectedColor, setSelectedColor] = useState<ProductColor>(() => {
    return initialColor || product?.colors?.[0] || { name: "Màu Tiêu Chuẩn", hex: "#1e2022", image: representativeImg };
  });
  const [selectedImage, setSelectedImage] = useState<string>(() => {
    return initialColor?.image || representativeImg;
  });

  // Đồng bộ ảnh và màu sắc đại diện khi product hoặc initialColor thay đổi
  useEffect(() => {
    if (!product) return;
    const freshThumb = getProductRepresentativeImage(product) || DEFAULT_PRODUCT_FALLBACK_IMAGE;
    const activeCol = initialColor || product?.colors?.[0] || { name: "Màu Tiêu Chuẩn", hex: "#1e2022", image: freshThumb };
    setSelectedColor(activeCol);
    setSelectedImage(initialColor?.image || activeCol?.image || freshThumb);
  }, [product, initialColor]);

  if (!product) {
    return null;
  }

  const getCategoryLabel = (cat?: string) => {

    switch (cat) {
      case "gong-kinh-can":
        return "GỌNG KÍNH";
      case "kinh-ram-mat":
        return "KÍNH THỜI TRANG";
      case "kinh-doi-mau":
        return "KÍNH ÁP TRÒNG";
      case "trong-kinh":
        return "TRÒNG KÍNH";
      case "kinh-tre-em":
        return "KÍNH TRẺ EM";
      default:
        return "GỌNG KÍNH";
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
    return map[mat] || "Nhựa Acetate cao cấp nguyên khối";
  };

  const getShapeLabel = (shape: string) => {
    const map: Record<string, string> = {
      "da-giac": "Đa giác cá tính",
      "vuong": "Vuông cổ điển",
      "tron": "Tròn vintage",
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

  const handleColorSelect = (c: ProductColor) => {
    setSelectedColor(c);
    if (c.image) {
      setSelectedImage(c.image);
    }
  };

  const handleContactZalo = () => {
    window.open("https://zalo.me/0973819928", "_blank", "noopener,noreferrer");
  };

  const handleContactMessenger = () => {
    window.open("https://www.facebook.com/SaigonOneEyewear/", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-neutral-200">
        
        {/* Modal Top Header Bar */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2 flex-wrap">
            {(product.categories && product.categories.length > 0 ? product.categories : [product.category]).map((cat) => (
              <span key={cat} className="bg-amber-100 text-amber-900 text-xs font-extrabold px-3 py-1 rounded uppercase tracking-wider">
                {getCategoryLabel(cat)}
              </span>
            ))}
            <span className="bg-neutral-100 text-neutral-600 text-xs font-mono px-2.5 py-1 rounded">
              SKU: {product.sku}
            </span>
          </div>

          <button
            id="btn-close-detail-modal"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 overflow-y-auto p-6 gap-6 sm:gap-8">
          
          {/* Left Column: Big Product Image & Thumbnails */}
          <div className="flex flex-col">
            <div className="relative aspect-square w-full bg-[#f8f8f8] rounded-2xl border border-neutral-200/80 flex items-center justify-center overflow-hidden">
              <img
                src={selectedImage || representativeImg}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== DEFAULT_PRODUCT_FALLBACK_IMAGE) {
                    target.src = DEFAULT_PRODUCT_FALLBACK_IMAGE;
                  }
                }}
              />

              {/* Quick Try-On AR Button */}
              <button
                id="btn-modal-open-tryon"
                onClick={() => onOpenTryOn(product)}
                className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-neutral-900/90 hover:bg-black text-amber-400 text-xs font-bold px-3.5 py-2 rounded-full shadow-md backdrop-blur-xs transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Thử Kính AR</span>
              </button>
            </div>

            {/* Thumbnail / Color Variant Pickers */}
            {product.colors.length > 1 && (
              <div className="mt-4">
                <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2">
                  Màu sắc: <span className="text-neutral-900 font-semibold">{selectedColor.name}</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.colors.map((col, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleColorSelect(col)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                        selectedColor.name === col.name
                          ? "border-amber-600 bg-amber-50 text-amber-950 ring-1 ring-amber-600"
                          : "border-neutral-200 hover:border-neutral-300 bg-white text-neutral-700"
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-neutral-300 shrink-0" style={{ backgroundColor: col.hex }} />
                      <span>{col.name.split("(")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Title, Specs, Features, Guarantees & Zalo Action */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Product Title - Modern Sans-Serif font matching menu */}
              <h2 className="text-xl sm:text-2xl lg:text-[26px] font-bold font-sans text-neutral-950 leading-tight mb-2.5 tracking-tight">
                {product.name}
              </h2>

              {/* Attributes line */}
              <div className="text-xs text-neutral-600 space-y-1 mb-4">
                <div>
                  <span className="text-neutral-400">Chất liệu: </span>
                  <strong className="text-neutral-900">{getMaterialLabel(product.material)}</strong>
                </div>
                <div className="flex items-center gap-3">
                  <div>
                    <span className="text-neutral-400">Kiểu dáng: </span>
                    <strong className="text-neutral-900">{getShapeLabel(product.frameShape)}</strong>
                  </div>
                  <span className="text-neutral-300">|</span>
                  <div>
                    <span className="text-neutral-400">Dành cho: </span>
                    <strong className="text-neutral-900">{getGenderLabel(product.gender)}</strong>
                  </div>
                </div>
              </div>

              {/* Box 1: ĐẶC ĐIỂM NỔI BẬT */}
              <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200/90 mb-3.5">
                <div className="text-xs font-extrabold text-amber-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>ĐẶC ĐIỂM NỔI BẬT</span>
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed">
                  {product.description || "Bản lề kim loại 5 chấu siêu chắc chắn, bề mặt bóng bẩy tự nhiên không bay màu theo thời gian. Form kính ôm trọn gương mặt tôn vẻ thanh lịch quý phái."}
                </p>
              </div>

              {/* Box 2: THÔNG SỐ KÍCH THƯỚC */}
              <div className="bg-white rounded-xl border border-neutral-200 p-4 mb-4 shadow-2xs">
                <div className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5 mb-2.5 pb-2 border-b border-neutral-100">
                  <Ruler className="w-3.5 h-3.5 text-amber-600" />
                  <span>THÔNG SỐ KÍCH THƯỚC</span>
                </div>
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs">
                  <div>
                    <span className="text-neutral-400 text-[11px] block">Độ rộng tròng:</span>
                    <span className="font-bold text-neutral-900">{product.dimensions.lensWidth || 53}mm</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 text-[11px] block">Cầu mũi:</span>
                    <span className="font-bold text-neutral-900">{product.dimensions.bridgeWidth || 17}mm</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 text-[11px] block">Càng kính:</span>
                    <span className="font-bold text-neutral-900">{product.dimensions.templeLength || 142}mm</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 text-[11px] block">Ngang khung / Cao:</span>
                    <span className="font-bold text-neutral-900">{product.dimensions.frameHeight ? `${product.dimensions.frameHeight}mm` : "140mm"}</span>
                  </div>
                </div>
              </div>

              {/* 3 Green Checkmark Guarantees */}
              <div className="space-y-1.5 text-xs text-neutral-700 mb-6">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Miễn phí đo khám thị lực khúc xạ tại cửa hàng</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Cắt kính lấy ngay trong 15-20 phút</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tặng kèm hộp da cao cấp, khăn lau nano & nước lau kính chuyên dụng</span>
                </div>
              </div>
            </div>

            {/* Bottom CTA Buttons: Zalo & Messenger Fanpage - Always 1 row on mobile & desktop */}
            <div className="pt-2 space-y-2">
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                <button
                  id="btn-modal-zalo-cta"
                  onClick={handleContactZalo}
                  className="py-3 sm:py-3.5 px-2 sm:px-4 bg-[#0068ff] hover:bg-[#0054d1] active:bg-[#0047b3] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 shadow-md transition-all cursor-pointer"
                >
                  <ZaloAppIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 rounded-xs overflow-hidden" />
                  <span className="truncate">
                    <span className="hidden sm:inline">Zalo: 0973.819.928</span>
                    <span className="sm:hidden">Chat Zalo</span>
                  </span>
                </button>

                <button
                  id="btn-modal-messenger-cta"
                  onClick={handleContactMessenger}
                  className="py-3 sm:py-3.5 px-2 sm:px-4 bg-[#0084ff] hover:bg-[#0070db] active:bg-[#005cb8] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 shadow-md transition-all cursor-pointer"
                >
                  <MessengerAppIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" />
                  <span className="truncate">
                    <span className="hidden sm:inline">Messenger Fanpage</span>
                    <span className="sm:hidden">Messenger</span>
                  </span>
                </button>
              </div>
              <p className="text-center text-[10.5px] sm:text-[11px] text-neutral-500">
                Tư vấn trực tiếp qua Zalo / Messenger có hỗ trợ gửi ảnh và video cận cảnh
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
