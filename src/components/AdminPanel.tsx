import React, { useState, useEffect } from "react";
import { 
  X, 
  Database, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Plus, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Eye, 
  RefreshCw,
  Search,
  Filter,
  Check
} from "lucide-react";
import { Product, Order, ProductCategory, FrameShape, FrameMaterial } from "../types";
import { fetchOrdersFromFirebase, updateOrderStatusInFirebase, db, rtdb } from "../firebase";

interface AdminPanelProps {
  onClose: () => void;
  products: Product[];
  onAddProduct: (p: Product) => void;
  onUpdateProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onClose,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  const [activeTab, setActiveTab] = useState<"orders" | "products" | "stats">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderFilter, setOrderFilter] = useState<string>("all");
  
  // New Product Modal Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductBrand, setNewProductBrand] = useState("Sài Gòn One PureTitan");
  const [newProductCategory, setNewProductCategory] = useState<ProductCategory>("gong-kinh-can");
  const [newProductPrice, setNewProductPrice] = useState("750000");
  const [newProductOriginalPrice, setNewProductOriginalPrice] = useState("990000");
  const [newProductShape, setNewProductShape] = useState<FrameShape>("da-giac");
  const [newProductMaterial, setNewProductMaterial] = useState<FrameMaterial>("titanium");
  const [newProductImage, setNewProductImage] = useState("https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=900&q=80");
  const [newProductDesc, setNewProductDesc] = useState("Gọng kính chính hãng Sài Gòn One bền nhẹ thời trang.");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await fetchOrdersFromFirebase();
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderCode: string, newStatus: any) => {
    const updated = orders.map((o) => {
      if (o.orderCode === orderCode) {
        return { ...o, status: newStatus, updatedAt: new Date().toISOString() };
      }
      return o;
    });
    setOrders(updated);
    await updateOrderStatusInFirebase(orderCode, newStatus);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    const id = `sgo-custom-${Date.now()}`;
    const priceNum = parseInt(newProductPrice) || 500000;
    const origPriceNum = parseInt(newProductOriginalPrice) || priceNum;

    const prod: Product = {
      id,
      sku: `SGO-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newProductName,
      brand: newProductBrand,
      category: newProductCategory,
      gender: "unisex",
      price: priceNum,
      originalPrice: origPriceNum,
      discountPercent: origPriceNum > priceNum ? Math.round(((origPriceNum - priceNum) / origPriceNum) * 100) : 0,
      images: [newProductImage],
      colors: [
        { name: "Đen Cơ Bản", hex: "#1e2022", image: newProductImage },
        { name: "Vàng Gold", hex: "#d4af37", image: newProductImage }
      ],
      frameShape: newProductShape,
      faceShapes: ["tron", "trai-xoan", "vuong"],
      material: newProductMaterial,
      weight: 10,
      dimensions: {
        lensWidth: 51,
        bridgeWidth: 19,
        templeLength: 145,
        frameHeight: 44
      },
      description: newProductDesc,
      highlights: ["Gọng kính chính hãng Sài Gòn One", "Bảo hành nắn chỉnh trọn đời"],
      stock: 25,
      rating: 5.0,
      reviewsCount: 1,
      tryOnOverlayType: "polygon",
      isNewArrival: true,
    };

    onAddProduct(prod);
    setShowAddForm(false);
    setNewProductName("");
    alert("Đã thêm sản phẩm kính mới thành công vào hệ thống!");
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const filteredOrders = orderFilter === "all" ? orders : orders.filter(o => o.status === orderFilter);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-display text-lg font-bold text-white">
                  Hệ Thống Quản Trị Sài Gòn One Eyewear
                </h2>
                <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Firebase: saigononeeyewear (Connected)
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Quản lý kho kính mắt, tiến độ gia công cắt tròng & đơn hàng khách đặt
              </p>
            </div>
          </div>

          <button
            id="btn-close-admin-panel"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-6 text-xs sm:text-sm font-bold">
            <button
              onClick={() => setActiveTab("orders")}
              className={`py-3.5 flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === "orders" ? "text-amber-800 border-b-2 border-amber-600" : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Quản Lý Đơn Hàng ({orders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`py-3.5 flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === "products" ? "text-amber-800 border-b-2 border-amber-600" : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Quản Lý Sản Phẩm ({products.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`py-3.5 flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === "stats" ? "text-amber-800 border-b-2 border-amber-600" : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Thống Kê Doanh Thu</span>
            </button>
          </div>

          <button
            onClick={loadOrders}
            className="flex items-center gap-1 text-xs text-stone-600 hover:text-amber-800 font-semibold p-1.5 rounded-lg hover:bg-stone-200/60 cursor-pointer"
            title="Đồng bộ lại dữ liệu"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Làm Mới</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* TAB 1: ORDERS LIST */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-stone-500 mr-1 font-medium">Lọc theo trạng thái:</span>
                  {[
                    { id: "all", label: "Tất cả" },
                    { id: "pending", label: "Chờ xử lý" },
                    { id: "confirmed", label: "Đã xác nhận" },
                    { id: "lens_crafting", label: "Đang mài tròng" },
                    { id: "shipping", label: "Đang giao" },
                    { id: "completed", label: "Hoàn tất" },
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setOrderFilter(st.id)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                        orderFilter === st.id ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>

                <span className="text-xs text-stone-500">
                  Hiển thị: <strong>{filteredOrders.length}</strong> đơn
                </span>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="py-16 text-center text-stone-400 text-xs">
                  Không có đơn hàng nào trong mục này.
                </div>
              ) : (
                <div className="border border-stone-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-100 font-bold text-stone-700 border-b border-stone-200">
                      <tr>
                        <th className="p-3">Mã Đơn</th>
                        <th className="p-3">Khách Hàng</th>
                        <th className="p-3">Sản Phẩm & Tròng</th>
                        <th className="p-3">Tổng Tiền</th>
                        <th className="p-3">Trạng Thái Xử Lý</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredOrders.map((o) => (
                        <tr key={o.orderCode} className="hover:bg-stone-50/80">
                          <td className="p-3 font-mono font-bold text-stone-900">
                            {o.orderCode}
                            <div className="text-[10px] text-stone-400 font-normal">
                              {new Date(o.createdAt).toLocaleDateString("vi-VN")}
                            </div>
                          </td>
                          <td className="p-3">
                            <p className="font-bold text-stone-900">{o.customer?.fullName || "Khách lẻ"}</p>
                            <p className="text-stone-500">{o.customer?.phone}</p>
                            <p className="text-[10px] text-stone-400 max-w-[180px] truncate">{o.customer?.address}</p>
                          </td>
                          <td className="p-3">
                            <div className="space-y-1">
                              {o.items?.map((it, idx) => (
                                <div key={idx} className="text-stone-800">
                                  <span>{it.product?.name} (x{it.quantity})</span>
                                  {it.selectedLens && it.selectedLens.id !== "lens-none" && (
                                    <span className="block text-[10px] text-amber-800 font-medium">
                                      + {it.selectedLens.name}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="p-3 font-bold text-amber-800">
                            {formatPrice(o.total)}
                            <div className="text-[10px] uppercase font-normal text-stone-500">
                              {o.customer?.paymentMethod}
                            </div>
                          </td>
                          <td className="p-3">
                            <select
                              value={o.status}
                              onChange={(e) => handleStatusChange(o.orderCode, e.target.value)}
                              className={`p-1.5 rounded-lg font-bold text-xs border cursor-pointer ${
                                o.status === "completed"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                  : o.status === "lens_crafting"
                                  ? "bg-blue-50 text-blue-800 border-blue-300"
                                  : o.status === "shipping"
                                  ? "bg-amber-50 text-amber-800 border-amber-300"
                                  : "bg-stone-100 text-stone-800 border-stone-300"
                              }`}
                            >
                              <option value="pending">1. Chờ xử lý</option>
                              <option value="confirmed">2. Đã xác nhận</option>
                              <option value="lens_crafting">3. Đang mài tròng</option>
                              <option value="shipping">4. Đang giao hàng</option>
                              <option value="completed">5. Hoàn tất</option>
                              <option value="cancelled">Hủy đơn</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PRODUCTS MANAGEMENT */}
          {activeTab === "products" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Danh sách gọng kính & tròng kính đang bày bán:
                </span>
                <button
                  id="btn-admin-add-product"
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm Kính Mới</span>
                </button>
              </div>

              {/* Add Product Modal Form Inline */}
              {showAddForm && (
                <form onSubmit={handleCreateProduct} className="p-4 bg-stone-100 rounded-2xl border border-stone-300 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-stone-900 text-sm">Thêm Mẫu Gọng Kính Mới</h4>
                    <button type="button" onClick={() => setShowAddForm(false)} className="text-stone-500">Đóng</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">Tên sản phẩm</label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Gọng Kính Cận Titan Aviator..."
                        value={newProductName}
                        onChange={(e) => setNewProductName(e.target.value)}
                        required
                        className="w-full p-2 bg-white rounded-lg border border-stone-300 font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Giá bán (VNĐ)</label>
                      <input
                        type="number"
                        value={newProductPrice}
                        onChange={(e) => setNewProductPrice(e.target.value)}
                        className="w-full p-2 bg-white rounded-lg border border-stone-300"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Giá gốc niêm yết (VNĐ)</label>
                      <input
                        type="number"
                        value={newProductOriginalPrice}
                        onChange={(e) => setNewProductOriginalPrice(e.target.value)}
                        className="w-full p-2 bg-white rounded-lg border border-stone-300"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Dáng kính</label>
                      <select
                        value={newProductShape}
                        onChange={(e) => setNewProductShape(e.target.value as any)}
                        className="w-full p-2 bg-white rounded-lg border border-stone-300"
                      >
                        <option value="da-giac">Đa giác</option>
                        <option value="vuong">Vuông</option>
                        <option value="tron">Tròn</option>
                        <option value="mat-meo">Mắt mèo</option>
                        <option value="browline">Browline</option>
                        <option value="aviator">Aviator (Phi công)</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Chất liệu</label>
                      <select
                        value={newProductMaterial}
                        onChange={(e) => setNewProductMaterial(e.target.value as any)}
                        className="w-full p-2 bg-white rounded-lg border border-stone-300"
                      >
                        <option value="titanium">Titanium Siêu Nhẹ</option>
                        <option value="acetate">Acetate Cellulose</option>
                        <option value="kim-loai">Hợp kim cao cấp</option>
                        <option value="nhua-tr90">Nhựa TR90 Siêu Dẻo</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Link Ảnh Sản Phẩm</label>
                      <input
                        type="text"
                        value={newProductImage}
                        onChange={(e) => setNewProductImage(e.target.value)}
                        className="w-full p-2 bg-white rounded-lg border border-stone-300"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl"
                  >
                    Lưu & Đưa Vào Bán Ngay
                  </button>
                </form>
              )}

              {/* Products Table */}
              <div className="border border-stone-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 font-bold text-stone-700 border-b border-stone-200">
                    <tr>
                      <th className="p-3">Hình Ảnh & Tên</th>
                      <th className="p-3">Dáng & Chất Liệu</th>
                      <th className="p-3">Giá Bán</th>
                      <th className="p-3">Kho</th>
                      <th className="p-3 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50/80">
                        <td className="p-3 flex items-center gap-3">
                          <img src={p.images[0]} alt={p.name} className="w-12 h-10 object-contain bg-stone-50 rounded border p-0.5" />
                          <div>
                            <p className="font-bold text-stone-900">{p.name}</p>
                            <p className="text-[10px] text-stone-500">{p.sku} • {p.brand}</p>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="font-medium text-stone-700 capitalize">{p.frameShape}</span>
                          <span className="text-stone-400 block text-[10px]">{p.material}</span>
                        </td>
                        <td className="p-3 font-bold text-stone-900">
                          {formatPrice(p.price)}
                        </td>
                        <td className="p-3 text-emerald-700 font-bold">
                          {p.stock} cái
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => onDeleteProduct(p.id)}
                            className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                            title="Xóa sản phẩm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: STATS */}
          {activeTab === "stats" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-xs text-amber-800 font-semibold">Tổng Doanh Số Đơn Hàng</span>
                  <h3 className="text-2xl font-extrabold text-stone-950 mt-1">
                    {formatPrice(totalRevenue)}
                  </h3>
                  <p className="text-[11px] text-amber-700 mt-1">Dữ liệu thời gian thực</p>
                </div>
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-xs text-stone-500 font-semibold">Tổng Số Đơn Hàng</span>
                  <h3 className="text-2xl font-extrabold text-stone-950 mt-1">
                    {orders.length} đơn
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-1">Bao gồm cả COD & VietQR</p>
                </div>
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-xs text-stone-500 font-semibold">Sản Phẩm Trong Kho</span>
                  <h3 className="text-2xl font-extrabold text-stone-950 mt-1">
                    {products.reduce((acc, p) => acc + p.stock, 0)} chiếc
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-1">Trên 4 chi nhánh TP.HCM</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-stone-900 text-white border border-stone-800 space-y-2 text-xs">
                <h4 className="font-bold text-amber-400 text-sm">Cấu Hình Kết Nối Firebase Cloud:</h4>
                <p><strong>Dự án:</strong> saigononeeyewear</p>
                <p><strong>Cơ sở dữ liệu:</strong> https://saigononeeyewear-default-rtdb.asia-southeast1.firebasedatabase.app</p>
                <p><strong>Cloud Firestore:</strong> Enabled & Syncing</p>
                <p className="text-stone-400 text-[11px] pt-1">
                  Mọi đơn hàng mới đặt từ khách hàng được tự động lưu đồng thời vào cả Firestore và Realtime Database.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
