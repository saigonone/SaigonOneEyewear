import React, { useState } from "react";
import { 
  X, 
  Camera, 
  Heart, 
  ShoppingBag, 
  Star, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  FileText, 
  Upload, 
  Check, 
  Sparkles, 
  Info,
  ChevronRight,
  MapPin,
  Clock,
  Ruler,
  Share2
} from "lucide-react";
import { Product, ProductColor, LensOption, EyePrescription, Review } from "../types";
import { LENS_OPTIONS, MOCK_REVIEWS } from "../data/mockProducts";

interface ProductDetailModalProps {
  product: Product;
  initialColor?: ProductColor;
  isFavorite: boolean;
  onToggleFavorite: (p: Product) => void;
  onClose: () => void;
  onOpenTryOn: (p: Product) => void;
  onAddToCart: (
    product: Product, 
    selectedColor: ProductColor, 
    selectedLens?: LensOption, 
    prescription?: EyePrescription
  ) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  initialColor,
  isFavorite,
  onToggleFavorite,
  onClose,
  onOpenTryOn,
  onAddToCart,
}) => {
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    initialColor || product.colors[0]
  );
  const [selectedImage, setSelectedImage] = useState<string>(
    initialColor?.image || product.images[0]
  );
  const [selectedLens, setSelectedLens] = useState<LensOption>(LENS_OPTIONS[0]);
  const [activeTab, setActiveTab] = useState<"specs" | "lens" | "reviews">("lens");

  // Prescription Form State
  const [hasPrescription, setHasPrescription] = useState(false);
  const [prescriptionType, setPrescriptionType] = useState<"manual" | "image" | "store">("manual");
  const [leftEyeSph, setLeftEyeSph] = useState("-1.50");
  const [leftEyeCyl, setLeftEyeCyl] = useState("0.00");
  const [leftEyeAxis, setLeftEyeAxis] = useState("180");
  const [rightEyeSph, setRightEyeSph] = useState("-1.75");
  const [rightEyeCyl, setRightEyeCyl] = useState("0.00");
  const [rightEyeAxis, setRightEyeAxis] = useState("180");
  const [pd, setPd] = useState("62");
  const [prescriptionNote, setPrescriptionNote] = useState("");
  const [uploadedPrescriptionName, setUploadedPrescriptionName] = useState<string | null>(null);

  // Review submission
  const [reviews, setReviews] = useState<Review[]>(
    MOCK_REVIEWS.filter(r => r.productId === product.id)
  );
  const [newReviewAuthor, setNewReviewAuthor] = useState("");
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  const totalPrice = product.price + selectedLens.price;

  const handleColorChange = (color: ProductColor) => {
    setSelectedColor(color);
    if (color.image) {
      setSelectedImage(color.image);
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      userName: newReviewAuthor,
      rating: newReviewRating,
      date: "Vừa xong",
      comment: newReviewComment,
      productColorPurchased: selectedColor.name,
      verifiedPurchase: true,
    };

    setReviews([newRev, ...reviews]);
    setNewReviewAuthor("");
    setNewReviewComment("");
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  const handleAddToCartClick = () => {
    const prescription: EyePrescription = {
      hasPrescription: hasPrescription || selectedLens.id !== "lens-none",
      leftEye: {
        sph: parseFloat(leftEyeSph) || 0,
        cyl: parseFloat(leftEyeCyl) || 0,
        axis: parseInt(leftEyeAxis) || 0,
      },
      rightEye: {
        sph: parseFloat(rightEyeSph) || 0,
        cyl: parseFloat(rightEyeCyl) || 0,
        axis: parseInt(rightEyeAxis) || 0,
      },
      pd: parseFloat(pd) || 62,
      note: prescriptionType === "store" 
        ? "Khách yêu cầu đo mắt trực tiếp tại cửa hàng Sài Gòn One" 
        : prescriptionNote,
      prescriptionImage: uploadedPrescriptionName || undefined,
    };

    onAddToCart(product, selectedColor, selectedLens, prescription);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Floating Close Button */}
        <button
          id="btn-close-detail-modal"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-stone-500 hover:text-stone-900 bg-white/90 hover:bg-white rounded-full shadow-md transition-all cursor-pointer"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          
          {/* Left Column: Gallery & Try-On Action */}
          <div className="lg:col-span-6 p-6 sm:p-8 bg-stone-50/70 border-b lg:border-b-0 lg:border-r border-stone-200/80 flex flex-col justify-between">
            <div>
              {/* Main Product Showcase Image */}
              <div className="relative aspect-[4/3] rounded-2xl bg-white border border-stone-200/60 p-6 flex items-center justify-center shadow-xs overflow-hidden">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-contain object-center transition-transform duration-300 hover:scale-108"
                />

                {/* Wishlist Button */}
                <button
                  id="btn-detail-fav-toggle"
                  onClick={() => onToggleFavorite(product)}
                  className="absolute top-3 left-3 p-2.5 rounded-full bg-white/90 hover:bg-white shadow-xs text-stone-600 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                </button>

                {/* AR Try-On Banner overlay button */}
                <button
                  id="btn-detail-open-tryon"
                  onClick={() => onOpenTryOn(product)}
                  className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-stone-900/90 hover:bg-stone-950 text-amber-400 font-bold text-xs px-3 py-1.5 rounded-full shadow-md backdrop-blur-xs transition-all cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Thử Kính AR 3D</span>
                </button>
              </div>

              {/* Thumbnail strip */}
              <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-14 rounded-xl bg-white border p-1 shrink-0 transition-all cursor-pointer ${
                      selectedImage === img ? "border-amber-500 ring-2 ring-amber-500/20" : "border-stone-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>

              {/* Dimension specs visualizer badge */}
              <div className="mt-6 p-4 rounded-2xl bg-white border border-stone-200/90 shadow-xs">
                <div className="flex items-center justify-between text-xs text-stone-700 font-bold mb-2">
                  <span className="flex items-center gap-1.5">
                    <Ruler className="w-4 h-4 text-amber-600" />
                    <span>Thông Số Kích Thước Gọng (mm)</span>
                  </span>
                  <span className="text-stone-400 font-normal">Trọng lượng: {product.weight}g</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 bg-stone-50 rounded-xl">
                    <p className="text-[10px] text-stone-400">Rộng tròng</p>
                    <p className="font-bold text-stone-900">{product.dimensions.lensWidth} mm</p>
                  </div>
                  <div className="p-2 bg-stone-50 rounded-xl">
                    <p className="text-[10px] text-stone-400">Cầu mũi</p>
                    <p className="font-bold text-stone-900">{product.dimensions.bridgeWidth} mm</p>
                  </div>
                  <div className="p-2 bg-stone-50 rounded-xl">
                    <p className="text-[10px] text-stone-400">Càng kính</p>
                    <p className="font-bold text-stone-900">{product.dimensions.templeLength} mm</p>
                  </div>
                  <div className="p-2 bg-stone-50 rounded-xl">
                    <p className="text-[10px] text-stone-400">Cao gọng</p>
                    <p className="font-bold text-stone-900">{product.dimensions.frameHeight} mm</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Guarantees */}
            <div className="mt-6 pt-4 border-t border-stone-200/80 grid grid-cols-3 gap-2 text-[11px] text-stone-600">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Bảo hành trọn đời</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Freeship toàn quốc</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Đổi mẫu 7 ngày</span>
              </div>
            </div>
          </div>

          {/* Right Column: Configuration, Lenses & Order */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Basic Info */}
              <div>
                <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                  <span className="font-bold text-amber-800 uppercase tracking-wider">{product.brand}</span>
                  <span>Mã SKU: <strong>{product.sku}</strong></span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
                  {product.name}
                </h1>
                
                {/* Rating & Reviews counter */}
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="font-bold text-stone-800 ml-1.5">{product.rating}</span>
                  </div>
                  <span className="text-stone-300">•</span>
                  <button 
                    onClick={() => setActiveTab("reviews")}
                    className="text-stone-600 hover:text-amber-700 underline font-medium cursor-pointer"
                  >
                    {reviews.length} đánh giá từ người dùng
                  </button>
                </div>
              </div>

              {/* Price display */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                <div>
                  <div className="text-xs text-amber-900 font-medium">Giá sản phẩm (chưa bao gồm tròng):</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-stone-950">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-stone-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
                {product.discountPercent && (
                  <span className="bg-red-600 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-xs">
                    Tiết kiệm {product.discountPercent}%
                  </span>
                )}
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-2">
                  1. Chọn Màu Sắc Gọng: <span className="text-amber-800 font-semibold">{selectedColor.name}</span>
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((c, i) => (
                    <button
                      key={i}
                      id={`btn-modal-color-${i}`}
                      onClick={() => handleColorChange(c)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        selectedColor.name === c.name
                          ? "border-amber-600 bg-amber-50 text-stone-950 ring-2 ring-amber-500/20 shadow-xs"
                          : "border-stone-200 bg-white hover:border-stone-300 text-stone-700"
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-stone-300" style={{ backgroundColor: c.hex }} />
                      <span>{c.name.split("(")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Navigation (Lắp Tròng vs Thông Số vs Đánh Giá) */}
              <div className="border-b border-stone-200 flex items-center gap-6 text-sm">
                <button
                  onClick={() => setActiveTab("lens")}
                  className={`pb-2.5 font-bold transition-colors relative cursor-pointer ${
                    activeTab === "lens"
                      ? "text-amber-800 border-b-2 border-amber-600"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  2. Chọn Lắp Tròng Kính
                </button>
                <button
                  onClick={() => setActiveTab("specs")}
                  className={`pb-2.5 font-bold transition-colors relative cursor-pointer ${
                    activeTab === "specs"
                      ? "text-amber-800 border-b-2 border-amber-600"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  Đặc Điểm & Thông Số
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`pb-2.5 font-bold transition-colors relative cursor-pointer ${
                    activeTab === "reviews"
                      ? "text-amber-800 border-b-2 border-amber-600"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  Đánh Giá ({reviews.length})
                </button>
              </div>

              {/* Tab Content 1: LENS SELECTOR */}
              {activeTab === "lens" && (
                <div className="space-y-4">
                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {LENS_OPTIONS.map((lens) => {
                      const isSelected = selectedLens.id === lens.id;
                      return (
                        <div
                          key={lens.id}
                          onClick={() => setSelectedLens(lens)}
                          className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? "border-amber-600 bg-amber-50/70 ring-1 ring-amber-600"
                              : "border-stone-200 hover:border-stone-300 bg-white"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="lens_selection"
                                checked={isSelected}
                                onChange={() => setSelectedLens(lens)}
                                className="text-amber-600 focus:ring-amber-500"
                              />
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <h4 className="font-bold text-xs text-stone-900">{lens.name}</h4>
                                  {lens.isPopular && (
                                    <span className="text-[9px] font-extrabold uppercase bg-amber-500 text-stone-950 px-1.5 py-0.2 rounded">
                                      Khuyên Dùng
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                                  {lens.description}
                                </p>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="text-xs font-extrabold text-stone-950">
                                {lens.price === 0 ? "Miễn Phí" : `+${formatPrice(lens.price)}`}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Prescription Section if Lens is Selected */}
                  {selectedLens.id !== "lens-none" && (
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900 flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-amber-600" />
                          <span>Thông số độ cận / Độ mắt của bạn</span>
                        </span>
                      </div>

                      {/* Prescription Mode Selector */}
                      <div className="grid grid-cols-3 gap-1.5 text-xs">
                        <button
                          type="button"
                          onClick={() => setPrescriptionType("manual")}
                          className={`p-1.5 rounded-lg font-semibold text-center border transition-all cursor-pointer ${
                            prescriptionType === "manual" ? "bg-white border-amber-600 text-stone-900 shadow-xs" : "bg-stone-100 text-stone-600 border-transparent"
                          }`}
                        >
                          Nhập Độ Cận
                        </button>
                        <button
                          type="button"
                          onClick={() => setPrescriptionType("image")}
                          className={`p-1.5 rounded-lg font-semibold text-center border transition-all cursor-pointer ${
                            prescriptionType === "image" ? "bg-white border-amber-600 text-stone-900 shadow-xs" : "bg-stone-100 text-stone-600 border-transparent"
                          }`}
                        >
                          Gửi Ảnh Đơn Kính
                        </button>
                        <button
                          type="button"
                          onClick={() => setPrescriptionType("store")}
                          className={`p-1.5 rounded-lg font-semibold text-center border transition-all cursor-pointer ${
                            prescriptionType === "store" ? "bg-white border-amber-600 text-stone-900 shadow-xs" : "bg-stone-100 text-stone-600 border-transparent"
                          }`}
                        >
                          Đo Khám Tại Shop
                        </button>
                      </div>

                      {/* Manual Prescription Inputs */}
                      {prescriptionType === "manual" && (
                        <div className="space-y-2 pt-2 border-t border-stone-200/80">
                          <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-semibold text-stone-500">
                            <span>Mắt</span>
                            <span>Độ Cầu (SPH)</span>
                            <span>Độ Loạn (CYL)</span>
                            <span>Trục (AXIS)</span>
                          </div>

                          {/* Right Eye (OD) */}
                          <div className="grid grid-cols-4 gap-2 items-center text-xs">
                            <span className="font-bold text-stone-800">Mắt Phải (R)</span>
                            <input
                              type="text"
                              value={rightEyeSph}
                              onChange={(e) => setRightEyeSph(e.target.value)}
                              placeholder="-2.00"
                              className="px-2 py-1 bg-white border border-stone-300 rounded text-center font-bold"
                            />
                            <input
                              type="text"
                              value={rightEyeCyl}
                              onChange={(e) => setRightEyeCyl(e.target.value)}
                              placeholder="-0.50"
                              className="px-2 py-1 bg-white border border-stone-300 rounded text-center font-bold"
                            />
                            <input
                              type="text"
                              value={rightEyeAxis}
                              onChange={(e) => setRightEyeAxis(e.target.value)}
                              placeholder="180"
                              className="px-2 py-1 bg-white border border-stone-300 rounded text-center font-bold"
                            />
                          </div>

                          {/* Left Eye (OS) */}
                          <div className="grid grid-cols-4 gap-2 items-center text-xs">
                            <span className="font-bold text-stone-800">Mắt Trái (L)</span>
                            <input
                              type="text"
                              value={leftEyeSph}
                              onChange={(e) => setLeftEyeSph(e.target.value)}
                              placeholder="-2.25"
                              className="px-2 py-1 bg-white border border-stone-300 rounded text-center font-bold"
                            />
                            <input
                              type="text"
                              value={leftEyeCyl}
                              onChange={(e) => setLeftEyeCyl(e.target.value)}
                              placeholder="0.00"
                              className="px-2 py-1 bg-white border border-stone-300 rounded text-center font-bold"
                            />
                            <input
                              type="text"
                              value={leftEyeAxis}
                              onChange={(e) => setLeftEyeAxis(e.target.value)}
                              placeholder="180"
                              className="px-2 py-1 bg-white border border-stone-300 rounded text-center font-bold"
                            />
                          </div>

                          <div className="flex items-center justify-between gap-4 pt-1">
                            <label className="text-[11px] text-stone-600 font-medium">Khoảng cách đồng tử (PD mm):</label>
                            <input
                              type="text"
                              value={pd}
                              onChange={(e) => setPd(e.target.value)}
                              placeholder="62"
                              className="w-20 px-2 py-1 bg-white border border-stone-300 rounded text-center font-bold text-xs"
                            />
                          </div>
                        </div>
                      )}

                      {/* Image Upload Mode */}
                      {prescriptionType === "image" && (
                        <div className="p-3 bg-white border border-dashed border-stone-300 rounded-xl text-center">
                          <Upload className="w-5 h-5 text-stone-400 mx-auto mb-1" />
                          <p className="text-xs text-stone-700 font-medium">
                            {uploadedPrescriptionName || "Nhấn để tải lên ảnh phiếu đo mắt hoặc đơn của bác sĩ"}
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                setUploadedPrescriptionName(e.target.files[0].name);
                              }
                            }}
                            className="mt-2 text-xs"
                          />
                        </div>
                      )}

                      {/* Store Visit Mode */}
                      {prescriptionType === "store" && (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                          <p className="font-bold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-700" />
                            <span>Đo mắt miễn phí tại hệ thống 4 chi nhánh Sài Gòn One</span>
                          </p>
                          <p className="text-[11px] text-amber-800">
                            Bạn cứ đặt gọng trước, kỹ thuật viên sẽ liên hệ giữ hàng và đo mắt trực tiếp cho bạn khi bạn ghé cửa hàng.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Tab Content 2: SPECS */}
              {activeTab === "specs" && (
                <div className="space-y-4 text-xs">
                  <p className="text-stone-600 leading-relaxed">
                    {product.description}
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-bold text-stone-900">Điểm nổi bật:</h4>
                    <ul className="space-y-1.5">
                      {product.highlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-2 text-stone-700">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Tab Content 3: REVIEWS */}
              {activeTab === "reviews" && (
                <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                  {/* Reviews List */}
                  <div className="space-y-3">
                    {reviews.length === 0 ? (
                      <p className="text-xs text-stone-400 py-4 text-center">Chưa có đánh giá nào cho mẫu kính này. Hãy là người đầu tiên!</p>
                    ) : (
                      reviews.map((r) => (
                        <div key={r.id} className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-stone-900">{r.userName}</span>
                            <span className="text-[11px] text-stone-400">{r.date}</span>
                          </div>
                          <div className="flex items-center gap-1 text-amber-500">
                            {[...Array(r.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                            ))}
                            {r.productColorPurchased && (
                              <span className="text-[10px] text-stone-500 ml-2">Đã mua: {r.productColorPurchased}</span>
                            )}
                          </div>
                          <p className="text-xs text-stone-700 leading-relaxed">{r.comment}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Review Form */}
                  <form onSubmit={handleAddReview} className="p-3 bg-stone-100 rounded-xl space-y-2 text-xs">
                    <span className="font-bold text-stone-900 block">Viết đánh giá của bạn:</span>
                    {reviewSubmitted && (
                      <p className="text-emerald-600 font-bold">Cảm ơn bạn đã gửi đánh giá!</p>
                    )}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Họ tên của bạn"
                        value={newReviewAuthor}
                        onChange={(e) => setNewReviewAuthor(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-stone-300 rounded-lg"
                        required
                      />
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((st) => (
                          <button
                            type="button"
                            key={st}
                            onClick={() => setNewReviewRating(st)}
                            className="cursor-pointer"
                          >
                            <Star className={`w-4 h-4 ${st <= newReviewRating ? "fill-amber-400 text-amber-400" : "text-stone-300"}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      placeholder="Cảm nhận về chất lượng gọng kính, độ nhẹ, tính thẩm mỹ..."
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg resize-none h-16"
                      required
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-stone-900 text-white font-bold rounded-lg text-xs hover:bg-stone-800 cursor-pointer"
                    >
                      Gửi Đánh Giá
                    </button>
                  </form>
                </div>
              )}

            </div>

            {/* Sticky Bottom Order Bar */}
            <div className="pt-5 mt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-xs text-stone-500 block">Tổng thanh toán dự kiến:</span>
                <span className="text-xl sm:text-2xl font-extrabold text-stone-950">
                  {formatPrice(totalPrice)}
                </span>
                {selectedLens.price > 0 && (
                  <span className="text-[11px] text-amber-800 ml-2 font-medium">
                    (Gọng + Tròng {selectedLens.name.split(" ")[1]})
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  id="btn-detail-add-to-cart"
                  onClick={handleAddToCartClick}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold px-6 py-3 rounded-xl text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Thêm Vào Giỏ Hàng</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
