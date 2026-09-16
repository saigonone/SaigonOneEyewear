import React, { useState } from "react";
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Check, 
  Sparkles, 
  Truck, 
  ShieldCheck,
  FileText
} from "lucide-react";
import { CartItem } from "../types";
import { PROMO_CODES } from "../constants/storeConfig";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  appliedPromo: string;
  onApplyPromo: (code: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  appliedPromo,
  onApplyPromo,
  onProceedToCheckout,
}) => {
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");

  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => {
      const itemPrice = item.product.price + (item.selectedLens ? item.selectedLens.price : 0);
      return sum + itemPrice * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const freeShipThreshold = 300000;
  const progressToFreeShip = Math.min(100, (subtotal / freeShipThreshold) * 100);

  let discountAmount = 0;
  if (appliedPromo && PROMO_CODES[appliedPromo]) {
    const promo = PROMO_CODES[appliedPromo];
    if (subtotal >= promo.minOrder) {
      if (promo.discountPercent > 0) {
        discountAmount = Math.min(promo.maxDiscount, (subtotal * promo.discountPercent) / 100);
      } else {
        discountAmount = promo.maxDiscount; // Freeship
      }
    }
  }

  const shippingFee = subtotal >= freeShipThreshold || appliedPromo === "FREESHIP" ? 0 : 30000;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    if (PROMO_CODES[code]) {
      const rule = PROMO_CODES[code];
      if (subtotal < rule.minOrder) {
        setPromoError(`Mã áp dụng cho đơn từ ${formatPrice(rule.minOrder)} trở lên`);
      } else {
        onApplyPromo(code);
        setPromoError("");
        setPromoInput("");
      }
    } else {
      setPromoError("Mã giảm giá không hợp lệ. Thử mã CHAOHANG2026 hoặc SAIGONONE");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 border-l border-gray-100">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              Giỏ Hàng ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </h2>
          </div>
          <button
            id="btn-close-cart-drawer"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free shipping banner progress */}
        <div className="bg-blue-50/50 px-5 py-2.5 border-b border-blue-100 text-xs">
          {subtotal >= freeShipThreshold ? (
            <div className="flex items-center gap-1.5 text-blue-800 font-bold">
              <Check className="w-4 h-4 text-blue-600" />
              <span>Đơn hàng của bạn đã đủ điều kiện FREESHIP toàn quốc!</span>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Mua thêm <strong>{formatPrice(freeShipThreshold - subtotal)}</strong> để được Freeship:</span>
                </span>
                <span className="font-bold text-blue-600">{Math.round(progressToFreeShip)}%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressToFreeShip}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-gray-500 text-sm">Giỏ hàng của bạn đang trống</p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-[#0f172a] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-blue-900 transition-colors cursor-pointer"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            items.map((item) => {
              const singleItemPrice = item.product.price + (item.selectedLens ? item.selectedLens.price : 0);
              return (
                <div 
                  key={item.id}
                  className="p-3.5 rounded-xl border border-gray-100 bg-white hover:border-slate-300 transition-all flex gap-3.5"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 bg-slate-50 rounded-lg border border-gray-100 p-1 shrink-0 flex items-center justify-center">
                    <img 
                      src={item.selectedColor?.image || item.product?.images?.[0] || "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80"} 
                      alt={item.product.name} 
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-xs text-slate-900 leading-snug line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                          title="Xóa khỏi giỏ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Color Tag */}
                      <p className="text-[11px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.selectedColor.hex }} />
                        <span>Màu: {item.selectedColor.name.split("(")[0]}</span>
                      </p>

                      {/* Lens Tag */}
                      {item.selectedLens && item.selectedLens.id !== "lens-none" ? (
                        <p className="text-[10px] text-blue-700 font-semibold mt-1 bg-blue-50 px-2 py-0.5 rounded-md inline-block">
                          Tròng: {item.selectedLens.name} (+{formatPrice(item.selectedLens.price)})
                        </p>
                      ) : (
                        <p className="text-[10px] text-gray-400 mt-1">
                          Chỉ lấy gọng không độ
                        </p>
                      )}

                      {/* Prescription badge */}
                      {item.prescription?.hasPrescription && (
                        <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-1">
                          <FileText className="w-3 h-3 text-gray-400" />
                          <span>
                            {item.prescription.note ? item.prescription.note.slice(0, 30) : `L: ${item.prescription.leftEye.sph} / R: ${item.prescription.rightEye.sph}`}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Price & Quantity counter */}
                    <div className="flex items-center justify-between pt-2 mt-1 border-t border-gray-100">
                      <span className="font-bold text-xs text-slate-900">
                        {formatPrice(singleItemPrice * item.quantity)}
                      </span>

                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-slate-50">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-200 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-900">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-200 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Summary & Coupon */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-gray-100 bg-slate-50/50 space-y-3">
            
            {/* Coupon input */}
            <div>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Nhập mã CHAOHANG2026..."
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-xs uppercase font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0f172a] text-white font-bold rounded-lg text-xs hover:bg-blue-900 cursor-pointer"
                >
                  Áp Dụng
                </button>
              </form>
              {appliedPromo && (
                <p className="text-[11px] text-blue-700 font-bold mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3 text-blue-600" />
                  <span>Đã áp dụng mã {appliedPromo}</span>
                </p>
              )}
              {promoError && (
                <p className="text-[11px] text-red-600 font-medium mt-1">{promoError}</p>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-gray-200">
              <div className="flex justify-between">
                <span>Tạm tính gọng & tròng:</span>
                <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-blue-600 font-semibold">
                  <span>Mã giảm giá ({appliedPromo}):</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span>{shippingFee === 0 ? <strong className="text-blue-600">Miễn phí</strong> : formatPrice(shippingFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-950 pt-2 border-t border-gray-200">
                <span>Tổng thanh toán:</span>
                <span className="text-blue-600 text-base font-extrabold">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              id="btn-cart-checkout"
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#0f172a] hover:bg-blue-900 text-white font-bold uppercase tracking-widest py-3.5 px-4 rounded-lg text-xs shadow-md transition-all cursor-pointer"
            >
              <span>Tiến Hành Đặt Hàng</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
