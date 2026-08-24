import React, { useState } from "react";
import { Eye, MessageSquare, Tag } from "lucide-react";
import { Product, ProductColor } from "../types";
import { getProductUrl } from "../utils/routes";

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
  const [selectedColor] = useState<ProductColor>(product.colors[0]);
  const [isHovered, setIsHovered] = useState(false);
  const productUrl = getProductUrl(product);

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
    onOpenDetail(product, selectedColor);
  };

  return (
    <a 
      id={`product-card-${product.id}`}
      href={productUrl}
      onClick={handleClick}
      className="group relative bg-white rounded-2xl border border-neutral-200 shadow-xs hover:shadow-xl hover:border-neutral-300 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer no-underline block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Showcase Box - Full Frame */}
      <div className="relative aspect-[4/3] w-full bg-[#fafafa] overflow-hidden flex items-center justify-center border-b border-neutral-100">
        
        {/* Top-Left Badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 pointer-events-none">
          {product.isNewArrival && (
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-black text-white rounded-sm shadow-xs">
              MẪU MỚI
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-amber-600 text-white rounded-sm shadow-xs">
              BÁN CHẠY
            </span>
          )}
        </div>

        {/* Top-Right Category Badge */}
        <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
          <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-white/90 backdrop-blur-xs text-neutral-700 rounded-md shadow-xs border border-neutral-200">
            {getCategoryBadgeLabel(product.category)}
          </span>
        </div>

        {/* Product Image - Full Frame */}
        <img
          src={selectedColor?.image || product.images?.[0] || "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80"}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-106"
          loading="lazy"
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
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* SKU Tag */}
          <div className="mb-2">
            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 text-[11px] font-bold px-2 py-0.5 rounded border border-amber-200/70">
              <Tag className="w-3 h-3 text-amber-600" />
              <span>Mã SP: {product.sku}</span>
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-neutral-900 text-sm sm:text-base leading-snug line-clamp-2 hover:text-amber-700 transition-colors mb-1.5 font-serif">
            {product.name}
          </h3>

          {/* Material & Shape Subtitle */}
          <p className="text-xs text-neutral-500 line-clamp-1 mb-4">
            {getMaterialLabel(product.material)} • {getShapeLabel(product.frameShape)}
          </p>
        </div>

        {/* Full-width Action Button: LIÊN HỆ ĐẶT HÀNG */}
        <div className="w-full flex items-center justify-center gap-2 bg-[#18181b] group-hover:bg-black active:bg-neutral-900 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-xs transition-all duration-200">
          <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
          <span>LIÊN HỆ ĐẶT HÀNG</span>
        </div>
      </div>
    </a>
  );
};

