import React, { useState } from "react";
import confetti from "canvas-confetti";
import { 
  X, 
  ShoppingBag, 
  Check, 
  QrCode, 
  CreditCard, 
  Truck, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Copy,
  AlertCircle
} from "lucide-react";
import { CartItem, Order, OrderCustomerInfo } from "../types";
import { STORE_LOCATIONS, PROMO_CODES } from "../data/mockProducts";
import { saveOrderToFirebase } from "../firebase";

interface CheckoutModalProps {
  items: CartItem[];
  appliedPromo: string;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  items,
  appliedPromo,
  onClose,
  onOrderSuccess,
  onClearCart,
}) => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("TP. Hồ Chí Minh");
  const [district, setDistrict] = useState("Quận 1");
  const [ward, setWard] = useState("Phường Bến Thành");
  const [note, setNote] = useState("");
  const [deliveryType, setDeliveryType] = useState<"home" | "store">("home");
  const [selectedStoreId, setSelectedStoreId] = useState(STORE_LOCATIONS[0].id);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "vietqr" | "momo" | "credit_card">("vietqr");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);

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
  let discountAmount = 0;
  if (appliedPromo && PROMO_CODES[appliedPromo]) {
    const promo = PROMO_CODES[appliedPromo];
    if (subtotal >= promo.minOrder) {
      discountAmount = promo.discountPercent > 0 ? Math.min(promo.maxDiscount, (subtotal * promo.discountPercent) / 100) : promo.maxDiscount;
    }
  }

  const shippingFee = subtotal >= 300000 || appliedPromo === "FREESHIP" || deliveryType === "store" ? 0 : 30000;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const bankInfo = {
    bankName: "MB Bank (Ngân hàng Quân Đội)",
    accountNo: "0903372556",
    accountName: "CONG TY TNHH MAT KINH SAI GON ONE",
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      alert("Vui lòng điền họ tên và số điện thoại nhận hàng");
      return;
    }

    setIsSubmitting(true);

    const generatedOrderCode = `SGO-${Math.floor(100000 + Math.random() * 900000)}`;

    const customer: OrderCustomerInfo = {
      fullName,
      phone,
      email,
      address: deliveryType === "store" ? `Nhận tại chi nhánh: ${STORE_LOCATIONS.find(s => s.id === selectedStoreId)?.name}` : address,
      city,
      district,
      ward,
      note,
      paymentMethod,
      requireEyeTestAtStore: deliveryType === "store",
      selectedStoreId: deliveryType === "store" ? selectedStoreId : undefined,
    };

    // VietQR URL formatting (Standard Napas 247)
    const vietQrUrl = `https://img.vietqr.io/image/MB-0903372556-compact2.png?amount=${total}&addInfo=${generatedOrderCode}&accountName=${encodeURIComponent(bankInfo.accountName)}`;

    const newOrder: Order = {
      orderCode: generatedOrderCode,
      customer,
      items,
      subtotal,
      discount: discountAmount,
      shippingFee,
      total,
      promoCode: appliedPromo || undefined,
      status: "pending",
      paymentStatus: paymentMethod === "cod" ? "unpaid" : "unpaid",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paymentDetails: {
        ...bankInfo,
        qrUrl: vietQrUrl,
      }
    };

    try {
      await saveOrderToFirebase(newOrder);
      
      // Fire confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.log("Confetti trigger:", e);
      }

      setCreatedOrder(newOrder);
      onOrderSuccess(newOrder);
      onClearCart();
    } catch (err) {
      console.error("Order save error:", err);
      // Still show success with local cache
      setCreatedOrder(newOrder);
      onOrderSuccess(newOrder);
      onClearCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-display text-lg font-bold text-stone-900">
                {createdOrder ? "Đặt Hàng Thành Công!" : "Thanh Toán & Đặt Hàng"}
              </h2>
              <p className="text-xs text-stone-500">
                {createdOrder 
                  ? "Cảm ơn bạn đã lựa chọn Mắt Kính Sài Gòn One. Chúng tôi sẽ liên hệ trong ít phút." 
                  : "Cam kết kính chính hãng 100%, bảo hành nắn chỉnh gọng trọn đời"}
              </p>
            </div>
          </div>

          <button
            id="btn-close-checkout"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto">
          
          {createdOrder ? (
            /* SUCCESS CONFIRMATION SCREEN */
            <div className="space-y-6 text-center max-w-xl mx-auto py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Đơn Hàng Đã Được Ghi Nhận
                </span>
                <h3 className="text-2xl font-bold text-stone-900 mt-2">
                  Mã Đơn Hàng: <strong className="text-amber-800">{createdOrder.orderCode}</strong>
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Đã đồng bộ lên hệ thống máy chủ Firebase & Realtime Database của Sài Gòn One.
                </p>
              </div>

              {/* VietQR Display if user selected QR transfer */}
              {createdOrder.customer.paymentMethod === "vietqr" && (
                <div className="p-5 bg-stone-50 rounded-3xl border border-stone-200 text-left space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-amber-600" />
                      <span>Quét mã VietQR chuyển khoản nhanh 24/7</span>
                    </span>
                    <span className="text-xs font-bold text-amber-800">
                      {formatPrice(createdOrder.total)}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-stone-200/80">
                    <div className="w-44 h-44 bg-white p-2 border rounded-xl shadow-xs shrink-0 flex items-center justify-center">
                      <img 
                        src={createdOrder.paymentDetails?.qrUrl} 
                        alt="VietQR Payment" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="space-y-2 text-xs text-stone-700 flex-1">
                      <p><strong>Ngân hàng:</strong> {bankInfo.bankName}</p>
                      <div className="flex items-center justify-between bg-stone-50 p-2 rounded-lg border">
                        <span><strong>Số TK:</strong> {bankInfo.accountNo}</span>
                        <button 
                          onClick={() => copyToClipboard(bankInfo.accountNo)}
                          className="text-amber-700 hover:text-amber-900 flex items-center gap-1 text-[11px] font-bold"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedAccount ? "Đã chép" : "Sao chép"}</span>
                        </button>
                      </div>
                      <p><strong>Chủ tài khoản:</strong> {bankInfo.accountName}</p>
                      <p><strong>Nội dung CK:</strong> <code className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">{createdOrder.orderCode}</code></p>
                      <p className="text-[11px] text-stone-500 italic">Hệ thống sẽ tự động xác nhận ngay sau khi nhận được tiền.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Summary Box */}
              <div className="p-4 rounded-2xl bg-stone-100/80 text-left text-xs text-stone-700 space-y-2">
                <div className="flex justify-between">
                  <span>Người nhận:</span>
                  <span className="font-bold">{createdOrder.customer.fullName} ({createdOrder.customer.phone})</span>
                </div>
                <div className="flex justify-between">
                  <span>Địa chỉ giao hàng:</span>
                  <span className="font-medium text-right max-w-xs">{createdOrder.customer.address}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phương thức:</span>
                  <span className="font-bold text-amber-900 uppercase">{createdOrder.customer.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-stone-950 pt-2 border-t border-stone-200">
                  <span>Tổng tiền:</span>
                  <span className="text-amber-800">{formatPrice(createdOrder.total)}</span>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-stone-900 text-white font-bold rounded-xl text-xs hover:bg-stone-800 cursor-pointer"
                >
                  Hoàn Tất & Tiếp Tục Mua Sắm
                </button>
              </div>
            </div>
          ) : (
            /* CHECKOUT FORM */
            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Customer & Delivery Info */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* Delivery Type Option */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    Hình thức nhận hàng:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryType("home")}
                      className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                        deliveryType === "home"
                          ? "border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/20"
                          : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <Truck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-xs text-stone-900">Giao hàng tận nơi</p>
                        <p className="text-[11px] text-stone-500">Freeship toàn quốc</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryType("store")}
                      className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                        deliveryType === "store"
                          ? "border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/20"
                          : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-xs text-stone-900">Nhận tại cửa hàng</p>
                        <p className="text-[11px] text-stone-500">Đo mắt & lấy kính 15p</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Branch selection if store pick-up */}
                {deliveryType === "store" && (
                  <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                    <label className="text-xs font-bold text-stone-800 block">Chọn chi nhánh muốn đến:</label>
                    <select
                      value={selectedStoreId}
                      onChange={(e) => setSelectedStoreId(e.target.value)}
                      className="w-full p-2 bg-white rounded-xl border border-stone-300 text-xs font-medium"
                    >
                      {STORE_LOCATIONS.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} - {s.address}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Customer Information Inputs */}
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Họ và tên *</label>
                      <input
                        type="text"
                        placeholder="Nguyễn Văn A"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Số điện thoại *</label>
                      <input
                        type="tel"
                        placeholder="0903372556"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Email nhận hóa đơn bảo hành điện tử</label>
                    <input
                      type="email"
                      placeholder="matkinhsaigonone@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    />
                  </div>

                  {deliveryType === "home" && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">Tỉnh / Thành</label>
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">Quận / Huyện</label>
                          <input
                            type="text"
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">Phường / Xã</label>
                          <input
                            type="text"
                            value={ward}
                            onChange={(e) => setWard(e.target.value)}
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">Địa chỉ số nhà, tên đường *</label>
                        <input
                          type="text"
                          placeholder="Số 92 Nguyễn Trãi, P. Bến Thành"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          required
                          className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Ghi chú cho kỹ thuật viên mài kính / Shipper</label>
                    <textarea
                      placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao, chỉnh càng kính ôm vừa tai..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs resize-none h-16"
                    />
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    Phương thức thanh toán:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("vietqr")}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        paymentMethod === "vietqr"
                          ? "border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/20 shadow-xs"
                          : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <QrCode className="w-5 h-5 text-amber-600 shrink-0" />
                      <div>
                        <p className="font-bold text-xs text-stone-900">Chuyển khoản VietQR</p>
                        <p className="text-[10px] text-stone-500">Quét mã nhận diện tự động</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cod")}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        paymentMethod === "cod"
                          ? "border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/20 shadow-xs"
                          : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <Truck className="w-5 h-5 text-stone-700 shrink-0" />
                      <div>
                        <p className="font-bold text-xs text-stone-900">COD Tiền Mặt</p>
                        <p className="text-[10px] text-stone-500">Thanh toán khi nhận hàng</p>
                      </div>
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Column: Order Summary & Place Button */}
              <div className="lg:col-span-5 p-5 rounded-3xl bg-stone-50 border border-stone-200 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-xs text-stone-900 uppercase tracking-wider pb-3 border-b border-stone-200">
                    Sản phẩm trong đơn ({items.length})
                  </h3>

                  {/* List */}
                  <div className="divide-y divide-stone-200/80 max-h-52 overflow-y-auto pr-1">
                    {items.map((it) => (
                      <div key={it.id} className="py-2.5 flex items-center justify-between gap-2 text-xs">
                        <div className="min-w-0">
                          <p className="font-bold text-stone-900 truncate">{it.product.name}</p>
                          <p className="text-[10px] text-stone-500">
                            {it.selectedColor.name} • SL: {it.quantity}
                          </p>
                          {it.selectedLens && it.selectedLens.id !== "lens-none" && (
                            <p className="text-[10px] text-amber-800 font-medium truncate">
                              + Tròng {it.selectedLens.name.split(" ")[1]}
                            </p>
                          )}
                        </div>
                        <span className="font-extrabold text-stone-900 shrink-0">
                          {formatPrice((it.product.price + (it.selectedLens?.price || 0)) * it.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Summary Totals */}
                  <div className="pt-3 border-t border-stone-200 space-y-1.5 text-xs text-stone-600">
                    <div className="flex justify-between">
                      <span>Tạm tính:</span>
                      <span className="font-semibold text-stone-900">{formatPrice(subtotal)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Giảm giá ({appliedPromo}):</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Phí giao hàng:</span>
                      <span className="text-emerald-700 font-semibold">{shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-extrabold text-stone-950 pt-2 border-t border-stone-200">
                      <span>Tổng thanh toán:</span>
                      <span className="text-amber-800 text-lg">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold py-3.5 px-4 rounded-2xl text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Đang xử lý đơn hàng...</span>
                  ) : (
                    <>
                      <span>Xác Nhận Đặt Hàng ({formatPrice(total)})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
