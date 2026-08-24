import React, { useState, useRef, useEffect } from "react";
import { 
  X, 
  Camera, 
  Upload, 
  RefreshCw, 
  Download, 
  Maximize2, 
  Sliders, 
  Sparkles, 
  MessageSquare, 
  Check, 
  Layers,
  HelpCircle,
  FlipHorizontal,
  ChevronLeft,
  ChevronRight,
  Phone
} from "lucide-react";
import { Product, ProductColor } from "../types";

interface VirtualTryOnModalProps {
  product: Product | null;
  allProducts: Product[];
  onClose: () => void;
  onSelectProduct: (p: Product) => void;
}

const SAMPLE_AVATARS = [
  { id: "model-1", name: "Mẫu Nữ (Mặt Tròn)", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80" },
  { id: "model-2", name: "Mẫu Nam (Mặt Vuông)", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80" },
  { id: "model-3", name: "Mẫu Nữ (Mặt Trái Xoan)", url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80" },
  { id: "model-4", name: "Mẫu Nam (Mặt Dài)", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80" }
];

export const VirtualTryOnModal: React.FC<VirtualTryOnModalProps> = ({
  product,
  allProducts,
  onClose,
  onSelectProduct,
  onAddToCart,
}) => {
  const [currentProduct, setCurrentProduct] = useState<Product>(product || allProducts[0]);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    (product || allProducts[0]).colors[0]
  );
  
  // Camera & Image Mode
  const [useLiveCamera, setUseLiveCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string>(SAMPLE_AVATARS[0].url);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  
  // Glasses Adjustment
  const [scale, setScale] = useState(1.0);
  const [posY, setPosY] = useState(0); // Offset in px
  const [posX, setPosX] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [lensTint, setLensTint] = useState<"clear" | "dark" | "blue" | "brown">("clear");
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (product) {
      setCurrentProduct(product);
      setSelectedColor(product.colors[0]);
    }
  }, [product]);

  // Handle live camera stream
  useEffect(() => {
    if (useLiveCamera) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [useLiveCamera]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error("Camera error:", err);
      setCameraError("Không thể truy cập camera. Bạn có thể tải ảnh chân dung hoặc chọn người mẫu sẵn có để thử kính.");
      setUseLiveCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImageUrl(event.target?.result as string);
        setUseLiveCamera(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetAdjustments = () => {
    setScale(1.0);
    setPosY(0);
    setPosX(0);
    setRotation(0);
  };

  const takeSnapshot = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      alert("Đã chụp hình thử kính thành công! Bạn có thể lưu ảnh hoặc so sánh với mẫu khác.");
    }, 400);
  };

  // Render Eyewear SVG Overlay depending on product shape
  const renderEyewearSvg = () => {
    const colorHex = selectedColor.hex || "#1e2022";
    const shape = currentProduct.frameShape;

    // Tint opacity
    let tintFill = "rgba(255, 255, 255, 0.15)";
    if (lensTint === "dark" || currentProduct.category === "kinh-ram-mat") {
      tintFill = "rgba(20, 25, 20, 0.82)";
    } else if (lensTint === "blue") {
      tintFill = "rgba(70, 130, 240, 0.35)";
    } else if (lensTint === "brown") {
      tintFill = "rgba(110, 65, 30, 0.65)";
    }

    return (
      <svg 
        viewBox="0 0 400 160" 
        className="w-full h-full drop-shadow-2xl filter"
        style={{
          filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.35))",
        }}
      >
        <defs>
          <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorHex} stopOpacity="1" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="100%" stopColor={colorHex} stopOpacity="1" />
          </linearGradient>
          <linearGradient id="lensShine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="35%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Bridge (Cầu kính giữa) */}
        <path 
          d="M 175 75 Q 200 62 225 75" 
          stroke={colorHex} 
          strokeWidth="6" 
          fill="none" 
          strokeLinecap="round" 
        />
        {/* Top bar for aviator / browline */}
        {(shape === "aviator" || shape === "browline") && (
          <path 
            d="M 160 55 Q 200 52 240 55" 
            stroke={colorHex} 
            strokeWidth="4" 
            fill="none" 
            strokeLinecap="round" 
          />
        )}

        {/* Left Temple (Càng kính trái) */}
        <path d="M 50 75 Q 20 65 5 70" stroke={colorHex} strokeWidth="5" fill="none" strokeLinecap="round" />
        {/* Right Temple (Càng kính phải) */}
        <path d="M 350 75 Q 380 65 395 70" stroke={colorHex} strokeWidth="5" fill="none" strokeLinecap="round" />

        {/* Left Lens & Frame */}
        {shape === "tron" || shape === "oval" ? (
          <g>
            <circle cx="115" cy="85" r="55" fill={tintFill} stroke={colorHex} strokeWidth="7" />
            <circle cx="115" cy="85" r="53" fill="url(#lensShine)" />
          </g>
        ) : shape === "mat-meo" ? (
          <g>
            <path 
              d="M 55 60 Q 115 45 170 70 Q 165 130 115 130 Q 55 125 55 60 Z" 
              fill={tintFill} 
              stroke={colorHex} 
              strokeWidth="7" 
              strokeLinejoin="round" 
            />
            <path d="M 55 60 Q 115 45 170 70 Q 165 130 115 130 Q 55 125 55 60 Z" fill="url(#lensShine)" />
          </g>
        ) : shape === "aviator" ? (
          <g>
            <path 
              d="M 60 65 Q 115 60 170 68 Q 165 135 120 135 Q 65 130 60 65 Z" 
              fill={tintFill} 
              stroke={colorHex} 
              strokeWidth="5" 
              strokeLinejoin="round" 
            />
            <path d="M 60 65 Q 115 60 170 68 Q 165 135 120 135 Q 65 130 60 65 Z" fill="url(#lensShine)" />
          </g>
        ) : shape === "da-giac" ? (
          <g>
            <polygon 
              points="60,65 110,52 165,65 172,110 120,132 60,112" 
              fill={tintFill} 
              stroke={colorHex} 
              strokeWidth="6" 
              strokeLinejoin="round" 
            />
            <polygon points="60,65 110,52 165,65 172,110 120,132 60,112" fill="url(#lensShine)" />
          </g>
        ) : (
          /* Modern Square / Default */
          <g>
            <rect 
              x="60" 
              y="50" 
              width="110" 
              height="80" 
              rx="18" 
              fill={tintFill} 
              stroke={colorHex} 
              strokeWidth="7" 
            />
            <rect x="60" y="50" width="110" height="80" rx="18" fill="url(#lensShine)" />
          </g>
        )}

        {/* Right Lens & Frame */}
        {shape === "tron" || shape === "oval" ? (
          <g>
            <circle cx="285" cy="85" r="55" fill={tintFill} stroke={colorHex} strokeWidth="7" />
            <circle cx="285" cy="85" r="53" fill="url(#lensShine)" />
          </g>
        ) : shape === "mat-meo" ? (
          <g>
            <path 
              d="M 230 70 Q 285 45 345 60 Q 345 125 285 130 Q 235 130 230 70 Z" 
              fill={tintFill} 
              stroke={colorHex} 
              strokeWidth="7" 
              strokeLinejoin="round" 
            />
            <path d="M 230 70 Q 285 45 345 60 Q 345 125 285 130 Q 235 130 230 70 Z" fill="url(#lensShine)" />
          </g>
        ) : shape === "aviator" ? (
          <g>
            <path 
              d="M 230 68 Q 285 60 340 65 Q 335 130 280 135 Q 235 135 230 68 Z" 
              fill={tintFill} 
              stroke={colorHex} 
              strokeWidth="5" 
              strokeLinejoin="round" 
            />
            <path d="M 230 68 Q 285 60 340 65 Q 335 130 280 135 Q 235 135 230 68 Z" fill="url(#lensShine)" />
          </g>
        ) : shape === "da-giac" ? (
          <g>
            <polygon 
              points="235,65 290,52 340,65 340,112 280,132 228,110" 
              fill={tintFill} 
              stroke={colorHex} 
              strokeWidth="6" 
              strokeLinejoin="round" 
            />
            <polygon points="235,65 290,52 340,65 340,112 280,132 228,110" fill="url(#lensShine)" />
          </g>
        ) : (
          /* Modern Square / Default */
          <g>
            <rect 
              x="230" 
              y="50" 
              width="110" 
              height="80" 
              rx="18" 
              fill={tintFill} 
              stroke={colorHex} 
              strokeWidth="7" 
            />
            <rect x="230" y="50" width="110" height="80" rx="18" fill="url(#lensShine)" />
          </g>
        )}

        {/* Nose pads (Đệm mũi) */}
        <ellipse cx="165" cy="95" rx="3.5" ry="8" fill="#f8fafc" opacity="0.8" />
        <ellipse cx="235" cy="95" rx="3.5" ry="8" fill="#f8fafc" opacity="0.8" />
      </svg>
    );
  };

  const activeImage = uploadedImageUrl || selectedAvatarUrl || SAMPLE_AVATARS[0].url;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-5xl bg-stone-900 text-white rounded-3xl border border-stone-800 shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-display text-lg font-bold text-white">
                  Phòng Thử Kính AR 3D Sài Gòn One
                </h2>
                <span className="text-[10px] uppercase font-bold bg-amber-500 text-stone-950 px-2 py-0.5 rounded-full">
                  Realtime
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Thử gọng kính trực tiếp qua camera hoặc trên hình mẫu người thật
              </p>
            </div>
          </div>

          <button
            id="btn-close-tryon"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          
          {/* Main Visual Stage (Webcam / Avatar + Glasses Overlay) */}
          <div className="lg:col-span-8 p-4 sm:p-6 flex flex-col items-center justify-center bg-black/40 relative min-h-[380px] sm:min-h-[480px]">
            
            {/* Camera Error Message */}
            {cameraError && (
              <div className="absolute top-4 inset-x-4 z-30 bg-red-950/90 border border-red-500/40 text-red-200 text-xs p-3 rounded-xl flex items-center justify-between">
                <span>{cameraError}</span>
                <button onClick={() => setCameraError(null)} className="text-red-400 hover:text-white ml-2">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Video or Image Canvas */}
            <div className="relative w-full max-w-lg aspect-[3/4] sm:aspect-[4/3] rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 shadow-inner flex items-center justify-center">
              
              {useLiveCamera ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              ) : (
                <img
                  src={activeImage}
                  alt="Model face"
                  className="w-full h-full object-cover"
                />
              )}

              {/* Eyewear Dynamic SVG Overlay with Matrix Translation */}
              <div 
                className="absolute pointer-events-none transition-transform duration-75 flex items-center justify-center"
                style={{
                  width: "56%",
                  height: "28%",
                  top: `calc(40% + ${posY}px)`,
                  left: `calc(22% + ${posX}px)`,
                  transform: `scale(${scale}) rotate(${rotation}deg)`,
                }}
              >
                {renderEyewearSvg()}
              </div>

              {/* Live Overlay Guide Box */}
              <div className="absolute top-3 left-3 bg-stone-900/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-stone-700/60 text-[11px] text-stone-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{currentProduct.name.split(" ")[0]} {currentProduct.sku}</span>
              </div>

              {/* Snapshot Button */}
              <button
                id="btn-take-tryon-snapshot"
                onClick={takeSnapshot}
                className="absolute bottom-4 right-4 p-3 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-full shadow-lg transition-transform active:scale-90 cursor-pointer"
                title="Chụp ảnh lưu kết quả"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>

            {/* Camera Source Switcher & Model Avatars */}
            <div className="mt-4 w-full max-w-lg flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  id="btn-toggle-webcam"
                  onClick={() => setUseLiveCamera(!useLiveCamera)}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                    useLiveCamera
                      ? "bg-emerald-500 text-stone-950 shadow-md"
                      : "bg-stone-800 hover:bg-stone-700 text-stone-200"
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{useLiveCamera ? "Đang Bật Camera" : "Bật Live Camera"}</span>
                </button>

                <button
                  id="btn-upload-photo"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition-all cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Tải Ảnh Của Bạn</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Sample Model Avatars */}
              {!useLiveCamera && (
                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  <span className="text-[11px] text-stone-400 mr-1">Mẫu mặt:</span>
                  {SAMPLE_AVATARS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelectedAvatarUrl(m.url);
                        setUploadedImageUrl(null);
                      }}
                      className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                        selectedAvatarUrl === m.url && !uploadedImageUrl
                          ? "border-amber-400 scale-110 shadow-xs"
                          : "border-stone-700 opacity-60 hover:opacity-100"
                      }`}
                      title={m.name}
                    >
                      <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Adjustments & Glasses Selection */}
          <div className="lg:col-span-4 p-5 border-t lg:border-t-0 lg:border-l border-stone-800 flex flex-col justify-between bg-stone-950/40">
            <div className="space-y-5">
              {/* Active Product Details */}
              <div className="bg-stone-900/80 p-4 rounded-2xl border border-stone-800">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                      {currentProduct.brand}
                    </span>
                    <h3 className="font-bold text-sm text-white leading-tight">
                      {currentProduct.name}
                    </h3>
                  </div>
                  <span className="text-amber-400 font-extrabold text-sm whitespace-nowrap">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(currentProduct.price)}
                  </span>
                </div>

                {/* Color Swatches */}
                <div className="mt-3">
                  <span className="text-[11px] text-stone-400 block mb-1.5 font-medium">
                    Màu sắc gọng: <strong>{selectedColor.name}</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    {currentProduct.colors.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedColor(c)}
                        className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                          selectedColor.name === c.name
                            ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-stone-900 scale-110 border-transparent"
                            : "border-stone-600 hover:scale-105"
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Lens Tint Simulation for Try-On */}
                <div className="mt-3 pt-3 border-t border-stone-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">Màu tròng mô phỏng:</span>
                  <div className="flex items-center gap-1">
                    {[
                      { id: "clear", label: "Trong", bg: "bg-white/30" },
                      { id: "dark", label: "Râm", bg: "bg-stone-900" },
                      { id: "blue", label: "Blue", bg: "bg-blue-600" },
                      { id: "brown", label: "Trà", bg: "bg-amber-800" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setLensTint(t.id as any)}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                          lensTint === t.id
                            ? "bg-amber-400 text-stone-950 font-bold"
                            : "bg-stone-800 text-stone-300 hover:bg-stone-700"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sliders for Fitting Adjustments */}
              <div className="bg-stone-900/60 p-4 rounded-2xl border border-stone-800/80 space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-300 font-semibold mb-1">
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    <span>Căn chỉnh kích thước & vị trí</span>
                  </span>
                  <button
                    onClick={resetAdjustments}
                    className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Đặt lại</span>
                  </button>
                </div>

                {/* Size / Scale */}
                <div>
                  <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                    <span>Độ to/nhỏ gọng:</span>
                    <span className="text-white">{Math.round(scale * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.7"
                    max="1.4"
                    step="0.02"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                </div>

                {/* Pos Y */}
                <div>
                  <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                    <span>Vị trí sống mũi (Lên / Xuống):</span>
                    <span className="text-white">{posY}px</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="60"
                    step="1"
                    value={posY}
                    onChange={(e) => setPosY(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                </div>

                {/* Pos X */}
                <div>
                  <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                    <span>Căn lề (Trái / Phải):</span>
                    <span className="text-white">{posX}px</span>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    step="1"
                    value={posX}
                    onChange={(e) => setPosX(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                </div>
              </div>

              {/* Quick Frame Switcher Strip */}
              <div>
                <span className="text-xs text-stone-400 font-semibold block mb-2">
                  Đổi mẫu kính khác để so sánh:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {allProducts.slice(0, 6).map((p) => {
                    const isSelected = p.id === currentProduct.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          setCurrentProduct(p);
                          setSelectedColor(p.colors[0]);
                          onSelectProduct(p);
                        }}
                        className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "bg-amber-500/20 border-amber-400 ring-1 ring-amber-400"
                            : "bg-stone-900 border-stone-800 hover:border-stone-700"
                        }`}
                      >
                        <img 
                          src={p.images?.[0] || (p.colors && p.colors[0]?.image) || "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80"} 
                          alt={p.name} 
                          className="w-full h-10 object-contain mb-1" 
                        />
                        <p className="text-[10px] font-bold text-stone-200 truncate">{p.name}</p>
                        <p className="text-[9px] text-amber-400 font-medium">
                          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p.price)}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 mt-4 border-t border-stone-800 flex items-center gap-3">
              <a
                id="btn-tryon-contact-zalo"
                href="https://zalo.me/0973819928"
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Tư Vấn Zalo: 0973.819.928</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
