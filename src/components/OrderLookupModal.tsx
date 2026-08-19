import React, { useState } from "react";
import { 
  X, 
  SearchCode, 
  Search, 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  CheckCheck, 
  AlertCircle,
  FileText,
  MapPin,
  Phone
} from "lucide-react";
import { Order } from "../types";
import { fetchOrdersFromFirebase } from "../firebase";

interface OrderLookupModalProps {
  onClose: () => void;
}

export const OrderLookupModal: React.FC<OrderLookupModalProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    setLoading(true);
    setSearched(true);
    try {
      const orders = await fetchOrdersFromFirebase();
      const match = orders.find(
        (o: Order) => 
          o.orderCode.toLowerCase().includes(query) || 
          o.customer.phone.includes(query)
      );
      setFoundOrder(match || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case "pending": return 1;
      case "confirmed": return 2;
      case "lens_crafting": return 3;
      case "shipping": return 4;
      case "completed": return 5;
      default: return 1;
    }
  };

  const currentStep = foundOrder ? getStatusStep(foundOrder.status) : 1;

  const steps = [
    { num: 1, title: "Tiếp Nhận Đơn", desc: "Hệ thống đã nhận thông tin" },
    { num: 2, title: "Đã Xác Nhận", desc: "Kỹ thuật viên đã kiểm tra đơn" },
    { num: 3, title: "Mài Lắp Tròng Kính", desc: "Cắt mài đo tâm quang học" },
    { num: 4, title: "Đang Giao Hàng", desc: "Đang chuyển phát nhanh tận nơi" },
    { num: 5, title: "Đã Giao Thành Công", desc: "Hoàn tất đơn hàng" },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center">
              <SearchCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-display text-lg font-bold text-stone-900">
                Tra Cứu Tiến Độ Đơn Hàng
              </h2>
              <p className="text-xs text-stone-500">
                Nhập mã đơn hàng (ví dụ SGO-123456) hoặc số điện thoại của bạn
              </p>
            </div>
          </div>

          <button
            id="btn-close-order-lookup"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Nhập mã đơn SGO-xxxxxx hoặc số điện thoại..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-2xl text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:bg-white"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-2xl text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? "Đang tra..." : "Tra Cứu"}
            </button>
          </form>

          {/* Results Display */}
          {loading ? (
            <div className="py-12 text-center text-xs text-stone-500">
              Đang kết nối cơ sở dữ liệu Firebase...
            </div>
          ) : foundOrder ? (
            <div className="p-5 rounded-3xl bg-stone-50 border border-stone-200 space-y-6">
              
              {/* Order Basic Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-4">
                <div>
                  <span className="text-xs text-stone-500">Mã đơn hàng:</span>
                  <h3 className="text-xl font-bold text-stone-950 font-mono">
                    {foundOrder.orderCode}
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    Đặt ngày: {new Date(foundOrder.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-stone-500">Tổng thanh toán:</span>
                  <p className="text-lg font-extrabold text-amber-800">
                    {formatPrice(foundOrder.total)}
                  </p>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-stone-200 text-stone-800 inline-block mt-0.5">
                    {foundOrder.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán (COD / Chờ CK)"}
                  </span>
                </div>
              </div>

              {/* Status Timeline */}
              <div>
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-4">
                  Tiến độ xử lý & hoàn thiện:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {steps.map((st) => {
                    const isDone = st.num <= currentStep;
                    const isCurrent = st.num === currentStep;
                    return (
                      <div
                        key={st.num}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          isCurrent
                            ? "bg-amber-500 text-stone-950 border-amber-400 shadow-md font-bold"
                            : isDone
                            ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                            : "bg-white text-stone-400 border-stone-200 opacity-60"
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full mx-auto mb-1.5 flex items-center justify-center text-xs font-bold bg-white/80">
                          {isDone && !isCurrent ? "✓" : st.num}
                        </div>
                        <p className="text-xs font-bold leading-tight">{st.title}</p>
                        <p className="text-[10px] mt-0.5 line-clamp-1">{st.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items & Prescription details */}
              <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-3">
                <h4 className="font-bold text-xs text-stone-900 uppercase tracking-wider">
                  Chi tiết sản phẩm đã chọn:
                </h4>
                <div className="divide-y divide-stone-100">
                  {foundOrder.items.map((it) => (
                    <div key={it.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <p className="font-bold text-stone-900">{it.product.name}</p>
                        <p className="text-stone-500">Màu: {it.selectedColor.name} • SL: {it.quantity}</p>
                        {it.selectedLens && it.selectedLens.id !== "lens-none" && (
                          <p className="text-amber-800 font-semibold mt-0.5">
                            Tròng: {it.selectedLens.name}
                          </p>
                        )}
                        {it.prescription?.hasPrescription && (
                          <p className="text-stone-500 text-[11px] mt-0.5">
                            Độ mắt: Mắt phải SPH {it.prescription.leftEye.sph} / Mắt trái SPH {it.prescription.rightEye.sph}
                          </p>
                        )}
                      </div>
                      <span className="font-bold text-stone-950 shrink-0">
                        {formatPrice((it.product.price + (it.selectedLens?.price || 0)) * it.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recipient details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700">
                <div className="p-3 bg-white rounded-xl border border-stone-200">
                  <p className="font-bold text-stone-900 mb-1">Thông tin người nhận:</p>
                  <p>{foundOrder.customer.fullName}</p>
                  <p>{foundOrder.customer.phone}</p>
                  <p>{foundOrder.customer.address}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-stone-200">
                  <p className="font-bold text-stone-900 mb-1">Hỗ trợ nhanh:</p>
                  <p>Hotline CSKH: <strong>1900 886 699</strong></p>
                  <p>Zalo / Kỹ thuật: <strong>0903.372.556</strong></p>
                  <p className="text-[11px] text-stone-500 mt-1">Hỗ trợ đổi trả miễn phí trong 7 ngày</p>
                </div>
              </div>

            </div>
          ) : searched ? (
            <div className="p-8 text-center bg-stone-50 rounded-3xl border border-stone-200 space-y-2">
              <AlertCircle className="w-10 h-10 text-stone-400 mx-auto" />
              <p className="font-bold text-stone-800 text-sm">Không tìm thấy đơn hàng phù hợp</p>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Vui lòng kiểm tra lại chính xác mã đơn (ví dụ SGO-123456) hoặc số điện thoại bạn đã dùng khi đặt hàng.
              </p>
            </div>
          ) : (
            <div className="p-8 text-center bg-stone-50/60 rounded-3xl border border-stone-200/80 text-xs text-stone-500 space-y-1">
              <Package className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              <p className="font-medium text-stone-700">Tra cứu nhanh trạng thái đơn hàng thời gian thực</p>
              <p>Hệ thống tự động cập nhật từng bước từ lúc tiếp nhận đến khi mài lắp tròng và giao hàng tận tay.</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
