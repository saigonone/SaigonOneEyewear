import React, { useState } from "react";
import { Eye, Tag } from "lucide-react";
import { Product, ProductColor } from "../types";
import { getProductUrl } from "../utils/routes";
import { getProductRepresentativeImage, DEFAULT_PRODUCT_FALLBACK_IMAGE } from "../utils/productUtils";
import { ZaloAppIcon, MessengerAppIcon } from "./BrandIcons";

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (p: Product) => void;
  onOpenDetail: (p: Product, selectedColor?: ProductColor) => void;
  onQuickTryOn: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetail,
  onQuickTryOn: _onQuickTryOn,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const productUrl = getProductUrl(product);

  // Lấy trực tiếp ảnh đại diện mới nhất từ trường thumbnail/image của Firestore
  const displayImage = getProductRepresentativeImage(product);

  const getCategoryBadgeLabel = (cat: string) => {
    switch (cat) {
      case "gong-kinh-can":
        return "Gọng Kính";
      case "kinh-ram-mat":
        return "Kính Thời Trang";
      case "kinh-doi-mau":
        return "Kính Áp Tròng";
      case "trong-kinh":
        return "Tròng Kính";
      case "kinh-tre-em":
        return "Kính Trẻ Em";
      default:
        return "Gọng Kính";
    }
  };

  const getShapeLabel = (shape: string) => {
    const map: Record<string, string> = {
      "da-giac": "Đa giác",
      "vuong": "Vuông",
      "tron": "Tròn",
      "mat-meo": "Mắt mèo",
      "browline": "Browline",
      "aviator": "Phi công (Aviator)",
      "oval": "Oval",
      "chu-nhat": "Chữ nhật",
    };
    return map[shape] || shape;
  };

  const getMaterialLabel = (mat: string) => {
    const map: Record<string, string> = {
      "titanium": "Titanium",
      "acetate": "Acetate",
      "kim-loai": "Hợp kim cao cấp",
      "nhua-tr90": "Nhựa TR90",
      "go-cao-cap": "Gỗ cao cấp",
      "khong-vien": "Không viền",
    };
    return map[mat] || mat;
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) {
      // Let browser open new tab / window natively
      return;
    }
    e.preventDefault();
    const activeColor = (product.colors && product.colors.length > 0)
      ? product.colors[0]
      : { name: "Màu Tiêu Chuẩn", hex: "#1e2022", image: displayImage };
    onOpenDetail(product, activeColor);
  };

  const handleOpenZalo = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open("https://zalo.me/0973819928", "_blank", "noopener,noreferrer");
  };

  const handleOpenMessenger = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open("https://www.facebook.com/SaigonOneEyewear/", "_blank", "noopener,noreferrer");
  };

  return (
    <a 
      id={`product-card-${product.id}`}
      href={productUrl}
      onClick={handleClick}
      className="group relative bg-white rounded-xl sm:rounded-2xl border border-neutral-200 shadow-xs hover:shadow-xl hover:border-neutral-300 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer no-underline block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Showcase Box - Full Frame */}
      <div className="relative aspect-[4/3] w-full bg-[#fafafa] overflow-hidden flex items-center justify-center border-b border-neutral-100">
        
        {/* Top-Left Badges */}
        <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 z-10 flex flex-col gap-1 pointer-events-none">
          {product.isNewArrival && (
            <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider bg-black text-white rounded-sm shadow-xs">
              MẪU MỚI
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider bg-amber-600 text-white rounded-sm shadow-xs">
              BÁN CHẠY
            </span>
          )}
        </div>

        {/* Top-Right Category Badge */}
        <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 z-10 pointer-events-none">
          <span className="px-1.5 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-semibold bg-white/90 backdrop-blur-xs text-neutral-700 rounded-md shadow-xs border border-neutral-200">
            {getCategoryBadgeLabel(product.category)}
          </span>
        </div>

        {/* Product Image - Full Frame */}
        <img
          key={displayImage}
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-106"
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src !== DEFAULT_PRODUCT_FALLBACK_IMAGE) {
              target.src = DEFAULT_PRODUCT_FALLBACK_IMAGE;
            }
          }}
        />

        {/* Center "Xem Chi Tiết" Button on Hover */}
        <div className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-200 pointer-events-none ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}>
          <div className="bg-white/95 text-neutral-900 text-xs font-bold px-4 py-2 rounded-full shadow-lg border border-neutral-200 flex items-center gap-1.5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-neutral-700" />
            <span>Xem Chi Tiết</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* SKU Tag */}
          <div className="mb-1.5 sm:mb-2">
            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded border border-amber-200/70">
              <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-600 shrink-0" />
              <span className="truncate max-w-[100px] sm:max-w-none">Mã: {product.sku}</span>
            </span>
          </div>

          {/* Product Name - Crisp Sans-Serif font matching menu */}
          <h3 className="font-bold font-sans text-neutral-950 text-[13px] sm:text-[17px] leading-snug line-clamp-2 group-hover:text-amber-800 transition-colors mb-1 sm:mb-1.5 tracking-tight min-h-[36px] sm:min-h-0">
            {product.name}
          </h3>

          {/* Material & Shape Subtitle */}
          <p className="text-[11px] sm:text-[13px] text-neutral-500 line-clamp-1 mb-1 sm:mb-4 leading-normal">
            {getMaterialLabel(product.material)} • {getShapeLabel(product.frameShape)}
          </p>
        </div>

        {/* 2 Nút liên hệ tư vấn: Zalo & Messenger (Ẩn trên mobile vì đã có MobileBottomNav cố định) */}
        <div className="hidden sm:grid sm:grid-cols-2 gap-1.5 sm:gap-2 pt-1 mt-auto">
          <button
            type="button"
            id={`btn-card-zalo-${product.id}`}
            onClick={handleOpenZalo}
            title="Chat Zalo: 0973819928"
            aria-label="Chat Zalo 0973819928"
            className="w-full flex items-center justify-center gap-1 sm:gap-1.5 bg-[#0068ff] hover:bg-[#0054d1] active:bg-[#0047b3] text-white font-bold text-[11px] sm:text-xs py-2 sm:py-2.5 px-1 sm:px-2 rounded-lg sm:rounded-xl shadow-xs transition-all duration-200 cursor-pointer"
          >
            <ZaloAppIcon className="w-4 h-4 shrink-0 rounded-xs overflow-hidden" />
            <span className="whitespace-nowrap">Zalo</span>
          </button>

          <button
            type="button"
            id={`btn-card-messenger-${product.id}`}
            onClick={handleOpenMessenger}
            title="Chat Messenger Fanpage Saigon One"
            aria-label="Chat Messenger Fanpage"
            className="w-full flex items-center justify-center gap-1 sm:gap-1.5 bg-[#0084ff] hover:bg-[#0070db] active:bg-[#005cb8] text-white font-bold text-[11px] sm:text-xs py-2 sm:py-2.5 px-1 sm:px-2 rounded-lg sm:rounded-xl shadow-xs transition-all duration-200 cursor-pointer"
          >
            <MessengerAppIcon className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Messenger</span>
          </button>
        </div>
      </div>
    </a>
  );
};

