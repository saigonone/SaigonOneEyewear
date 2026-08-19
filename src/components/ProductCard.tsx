import React, { useState } from "react";
import { Camera, Heart, ShoppingBag, Star, Sparkles, Check, Eye } from "lucide-react";
import { Product, ProductColor } from "../types";

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (p: Product) => void;
  onOpenDetail: (p: Product, selectedColor?: ProductColor) => void;
  onQuickTryOn: (p: Product) => void;
  onQuickAddToCart: (p: Product, selectedColor: ProductColor) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isFavorite,
  onToggleFavorite,
  onOpenDetail,
  onQuickTryOn,
  onQuickAddToCart,
}) => {
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  const getShapeLabel = (shape: string) => {
    const map: Record<string, string> = {
      "da-giac": "Đa giác",
      "vuong": "Vuông",
      "tron": "Tròn",
      "mat-meo": "Mắt mèo",
      "browline": "Browline",
      "aviator": "Phi công",
      "oval": "Oval",
      "chu-nhat": "Chữ nhật",
    };
    return map[shape] || shape;
  };

  const getMaterialLabel = (mat: string) => {
    const map: Record<string, string> = {
      "titanium": "Titanium",
      "acetate": "Acetate",
      "kim-loai": "Kim loại",
      "nhua-tr90": "TR90",
      "go-cao-cap": "Gỗ cao cấp",
      "khong-vien": "Không viền",
    };
    return map[mat] || mat;
  };

  return (
    <div 
      className="group relative bg-white rounded-xl border border-gray-100 shadow-xs hover:shadow-xl hover:border-slate-200 transition-all duration-300 flex flex-col overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 pointer-events-none">
        {product.isNewArrival && (
          <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest bg-[#0f172a] text-white rounded shadow-xs">
            Mới 2026
          </span>
        )}
        {product.discountPercent && product.discountPercent > 0 && (
          <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider bg-blue-600 text-white rounded shadow-xs">
            -{product.discountPercent}%
          </span>
        )}
        {product.isBestSeller && !product.isNewArrival && (
          <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200 rounded shadow-xs">
            Best Seller
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        id={`btn-fav-${product.id}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(product);
        }}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer ${
          isFavorite
            ? "bg-red-50 text-red-600 shadow-sm"
            : "bg-white/80 text-slate-400 hover:text-red-500 hover:bg-white shadow-xs"
        }`}
        aria-label="Yêu thích"
      >
        <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
      </button>

      {/* Image Showcase Container */}
      <div 
        className="relative aspect-[4/3] bg-slate-50/50 overflow-hidden cursor-pointer flex items-center justify-center p-6 border-b border-gray-50"
        onClick={() => onOpenDetail(product, selectedColor)}
      >
        <img
          src={selectedColor.image || product.images[0]}
          alt={product.name}
          className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-108"
          loading="lazy"
        />

        {/* Hover Action Overlay */}
        <div className={`absolute inset-x-3 bottom-3 flex items-center gap-2 transition-all duration-300 ${
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}>
          <button
            id={`btn-tryon-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onQuickTryOn(product);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#0f172a] hover:bg-blue-900 text-white text-xs font-bold uppercase tracking-wider py-2.5 px-3 rounded-lg shadow-md backdrop-blur-xs transition-colors cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-blue-400" />
            <span>Thử Kính AR</span>
          </button>
          
          <button
            id={`btn-quick-view-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail(product, selectedColor);
            }}
            className="p-2.5 bg-white hover:bg-slate-100 text-slate-800 rounded-lg shadow-md border border-slate-200 transition-colors cursor-pointer"
            title="Xem chi tiết"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Content Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Shape tags */}
          <div className="flex items-center justify-between text-[10px] text-gray-400 uppercase tracking-widest mb-1.5 font-bold">
            <span className="text-blue-600">{product.brand}</span>
            <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
              {getShapeLabel(product.frameShape)} • {getMaterialLabel(product.material)}
            </span>
          </div>

          {/* Product Name */}
          <h3 
            onClick={() => onOpenDetail(product, selectedColor)}
            className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer mb-2"
          >
            {product.name}
          </h3>

          {/* Rating & reviews */}
          <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-900 ml-1 text-xs">{product.rating}</span>
            </div>
            <span className="text-slate-300">•</span>
            <span className="text-[11px]">({product.reviewsCount})</span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-600 text-[11px] font-medium">Sẵn hàng</span>
          </div>

          {/* Color swatches */}
          <div className="flex items-center gap-1.5 mb-4">
            {product.colors.map((color, idx) => (
              <button
                key={idx}
                id={`btn-color-${product.id}-${idx}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColor(color);
                }}
                className={`w-4 h-4 rounded-full border transition-all cursor-pointer relative ${
                  selectedColor.name === color.name
                    ? "ring-2 ring-blue-600 ring-offset-1 scale-110 border-transparent"
                    : "border-slate-300 hover:scale-105"
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
            <span className="text-[10px] text-gray-400 uppercase tracking-wider ml-1 truncate">
              {selectedColor.name.split("(")[0]}
            </span>
          </div>
        </div>

        {/* Price & Add to Cart button */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-base font-bold text-slate-900">
              {formatPrice(product.price)}
            </div>
            {product.originalPrice > product.price && (
              <div className="text-[11px] text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </div>
            )}
          </div>

          <button
            id={`btn-add-cart-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onQuickAddToCart(product, selectedColor);
            }}
            className="flex items-center gap-1.5 bg-[#0f172a] hover:bg-blue-900 text-white font-bold text-xs uppercase tracking-wider px-3.5 py-2 rounded-lg transition-all duration-200 cursor-pointer shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
            <span>Thêm</span>
          </button>
        </div>
      </div>
    </div>
  );
};
