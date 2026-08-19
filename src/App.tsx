import React, { useState, useEffect, useMemo } from "react";
import { 
  Header 
} from "./components/Header";
import { 
  HeroBanner 
} from "./components/HeroBanner";
import { 
  ProductCard 
} from "./components/ProductCard";
import { 
  ProductDetailModal 
} from "./components/ProductDetailModal";
import { 
  VirtualTryOnModal 
} from "./components/VirtualTryOnModal";
import { 
  FaceShapeAdvisor 
} from "./components/FaceShapeAdvisor";
import { 
  LensGuideModal 
} from "./components/LensGuideModal";
import { 
  StoreLocationsModal 
} from "./components/StoreLocationsModal";
import { 
  CartDrawer 
} from "./components/CartDrawer";
import { 
  CheckoutModal 
} from "./components/CheckoutModal";
import { 
  OrderLookupModal 
} from "./components/OrderLookupModal";
import { 
  AdminPanel 
} from "./components/AdminPanel";
import { 
  EyewearAiChat 
} from "./components/EyewearAiChat";
import { 
  Footer 
} from "./components/Footer";

import { 
  Product, 
  ProductCategory, 
  GenderTarget, 
  FrameShape, 
  FrameMaterial, 
  FaceShape, 
  CartItem, 
  Order, 
  ProductColor, 
  LensOption, 
  EyePrescription 
} from "./types";
import { MOCK_PRODUCTS } from "./data/mockProducts";
import { 
  Filter, 
  SlidersHorizontal, 
  Camera, 
  Sparkles, 
  BookOpen, 
  ArrowUpDown, 
  Heart, 
  Check, 
  X, 
  RotateCcw,
  Glasses
} from "lucide-react";

export default function App() {
  // Products state
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const local = localStorage.getItem("saigonone_custom_products");
      if (local) {
        const parsed = JSON.parse(local);
        return [...MOCK_PRODUCTS, ...parsed];
      }
    } catch (e) {}
    return MOCK_PRODUCTS;
  });

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("all");
  const [selectedGender, setSelectedGender] = useState<GenderTarget | "all">("all");
  const [selectedFrameShape, setSelectedFrameShape] = useState<FrameShape | "all">("all");
  const [selectedMaterial, setSelectedMaterial] = useState<FrameMaterial | "all">("all");
  const [selectedFaceShapeFilter, setSelectedFaceShapeFilter] = useState<FaceShape | null>(null);
  const [sortBy, setSortBy] = useState<"featured" | "price_asc" | "price_desc" | "newest" | "rating">("featured");

  // Cart state (persisted)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("saigonone_cart");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Favorites / Wishlist state (persisted)
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("saigonone_favorites");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [appliedPromo, setAppliedPromo] = useState<string>("CHAOHANG2026");

  // Modals visibility
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<{ product: Product; color?: ProductColor } | null>(null);
  const [tryOnProduct, setTryOnProduct] = useState<Product | null>(null);
  const [isTryOnModalOpen, setIsTryOnModalOpen] = useState<boolean>(false);
  const [isFaceAdvisorOpen, setIsFaceAdvisorOpen] = useState<boolean>(false);
  const [isLensGuideOpen, setIsLensGuideOpen] = useState<boolean>(false);
  const [isStoresOpen, setIsStoresOpen] = useState<boolean>(false);
  const [isOrderLookupOpen, setIsOrderLookupOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);

  // Sync cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem("saigonone_cart", JSON.stringify(cartItems));
    } catch (e) {}
  }, [cartItems]);

  // Sync favorites to local storage
  useEffect(() => {
    try {
      localStorage.setItem("saigonone_favorites", JSON.stringify(favoriteIds));
    } catch (e) {}
  }, [favoriteIds]);

  // Cart Handlers
  const handleAddToCart = (
    product: Product, 
    selectedColor: ProductColor, 
    selectedLens?: LensOption, 
    prescription?: EyePrescription
  ) => {
    const lensId = selectedLens?.id || "none";
    const cartItemId = `${product.id}-${selectedColor.name}-${lensId}`;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) => 
          item.id === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          product,
          selectedColor,
          selectedLens,
          prescription,
          quantity: 1,
        };
        return [...prev, newItem];
      }
    });

    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveCartItem(id);
      return;
    }
    setCartItems((prev) => 
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Favorite handler
  const handleToggleFavorite = (product: Product) => {
    setFavoriteIds((prev) => 
      prev.includes(product.id) ? prev.filter((id) => id !== product.id) : [...prev, product.id]
    );
  };

  // Quick Try-On
  const handleOpenTryOn = (p?: Product) => {
    if (p) {
      setTryOnProduct(p);
    } else {
      setTryOnProduct(products[0]);
    }
    setIsTryOnModalOpen(true);
  };

  // Face Shape Recommendation handler
  const handleSelectRecommendedShapes = (faceShape: FaceShape, recommendedFrames: FrameShape[]) => {
    setSelectedFaceShapeFilter(faceShape);
    if (recommendedFrames.length > 0) {
      setSelectedFrameShape(recommendedFrames[0]);
    }
    // Scroll to products section
    const el = document.getElementById("products-catalog-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Admin product modification handlers
  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    try {
      const local = JSON.parse(localStorage.getItem("saigonone_custom_products") || "[]");
      local.unshift(newProd);
      localStorage.setItem("saigonone_custom_products", JSON.stringify(local));
    } catch (e) {}
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      const local = JSON.parse(localStorage.getItem("saigonone_custom_products") || "[]");
      const filtered = local.filter((p: any) => p.id !== id);
      localStorage.setItem("saigonone_custom_products", JSON.stringify(filtered));
    } catch (e) {}
  };

  // Filtered and Sorted Products memo
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Favorites filter
      if (showOnlyFavorites && !favoriteIds.includes(p.id)) return false;

      // Category filter
      if (selectedCategory !== "all") {
        if (selectedCategory === "trong-kinh") {
          // All products support lenses or are categorized
        } else if (p.category !== selectedCategory) {
          return false;
        }
      }

      // Gender filter
      if (selectedGender !== "all" && p.gender !== "unisex" && p.gender !== selectedGender) {
        return false;
      }

      // Frame shape filter
      if (selectedFrameShape !== "all" && p.frameShape !== selectedFrameShape) {
        return false;
      }

      // Material filter
      if (selectedMaterial !== "all" && p.material !== selectedMaterial) {
        return false;
      }

      // Face shape filter
      if (selectedFaceShapeFilter && !p.faceShapes.includes(selectedFaceShapeFilter)) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(q);
        const matchBrand = p.brand.toLowerCase().includes(q);
        const matchSku = p.sku.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchMat = p.material.toLowerCase().includes(q);
        if (!matchName && !matchBrand && !matchSku && !matchDesc && !matchMat) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "newest") return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      if (sortBy === "rating") return b.rating - a.rating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [
    products, 
    showOnlyFavorites, 
    favoriteIds, 
    selectedCategory, 
    selectedGender, 
    selectedFrameShape, 
    selectedMaterial, 
    selectedFaceShapeFilter, 
    searchQuery, 
    sortBy
  ]);

  const resetAllFilters = () => {
    setSelectedCategory("all");
    setSelectedGender("all");
    setSelectedFrameShape("all");
    setSelectedMaterial("all");
    setSelectedFaceShapeFilter(null);
    setSearchQuery("");
    setShowOnlyFavorites(false);
  };

  const hasActiveFilters = 
    selectedCategory !== "all" || 
    selectedGender !== "all" || 
    selectedFrameShape !== "all" || 
    selectedMaterial !== "all" || 
    selectedFaceShapeFilter !== null || 
    searchQuery !== "" || 
    showOnlyFavorites;

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd] text-[#1a1a1a] selection:bg-blue-600 selection:text-white">
      
      {/* Header */}
      <Header
        cartCount={cartItems.reduce((acc, it) => acc + it.quantity, 0)}
        favoritesCount={favoriteIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenFavorites={() => setShowOnlyFavorites(!showOnlyFavorites)}
        onOpenTryOn={() => handleOpenTryOn()}
        onOpenFaceAdvisor={() => setIsFaceAdvisorOpen(true)}
        onOpenLensGuide={() => setIsLensGuideOpen(true)}
        onOpenStores={() => setIsStoresOpen(true)}
        onOpenOrderLookup={() => setIsOrderLookupOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedGender={selectedGender}
        onSelectGender={setSelectedGender}
      />

      {/* Hero Banner (Only if not in search or favorites mode) */}
      {!searchQuery && !showOnlyFavorites && (
        <HeroBanner
          onOpenTryOn={() => handleOpenTryOn()}
          onOpenFaceAdvisor={() => setIsFaceAdvisorOpen(true)}
          onOpenLensGuide={() => setIsLensGuideOpen(true)}
          onSelectCategory={setSelectedCategory}
        />
      )}

      {/* Main Catalog Content */}
      <main id="products-catalog-section" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {/* Section Title & Filter Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                {showOnlyFavorites 
                  ? `Kính Yêu Thích (${filteredProducts.length})`
                  : searchQuery 
                  ? `Kết quả cho: "${searchQuery}"`
                  : selectedCategory === "gong-kinh-can" 
                  ? "Bộ Sưu Tập Gọng Kính Cận"
                  : selectedCategory === "kinh-ram-mat"
                  ? "Kính Râm Polarized Thời Trang"
                  : selectedCategory === "trong-kinh"
                  ? "Tròng Kính Khúc Xạ Chính Hãng"
                  : selectedCategory === "kinh-doi-mau"
                  ? "Kính Đổi Màu Đi Nắng"
                  : selectedCategory === "kinh-tre-em"
                  ? "Kính Mắt Trẻ Em Dẻo"
                  : "Bộ Sưu Tập Mắt Kính Saigon One"}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Hiển thị {filteredProducts.length} mẫu kính chính hãng • Bảo hành nắn chỉnh & thay ve ốc trọn đời
            </p>
          </div>

          {/* Quick Shape Pills & Sort Selector */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Shape Filter Dropdown */}
            <select
              value={selectedFrameShape}
              onChange={(e) => setSelectedFrameShape(e.target.value as any)}
              className="px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-slate-700 shadow-xs focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option value="all">Tất Cả Dáng Gọng</option>
              <option value="da-giac">Dáng Đa Giác (Polygon)</option>
              <option value="vuong">Dáng Vuông (Square)</option>
              <option value="tron">Dáng Tròn (Round)</option>
              <option value="mat-meo">Dáng Mắt Mèo (Cat Eye)</option>
              <option value="browline">Dáng Browline (Clubmaster)</option>
              <option value="aviator">Dáng Phi Công (Aviator)</option>
            </select>

            {/* Material Filter Dropdown */}
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value as any)}
              className="px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-slate-700 shadow-xs focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option value="all">Tất Cả Chất Liệu</option>
              <option value="titanium">Titanium Siêu Nhẹ</option>
              <option value="acetate">Acetate Cellulose</option>
              <option value="kim-loai">Hợp Kim Cao Cấp</option>
              <option value="nhua-tr90">Nhựa TR90 Siêu Dẻo</option>
            </select>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-xs text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-slate-900 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="featured">Nổi Bật Nhất</option>
                <option value="newest">Mới Ra Mắt</option>
                <option value="price_asc">Giá: Thấp đến Cao</option>
                <option value="price_desc">Giá: Cao đến Thấp</option>
                <option value="rating">Đánh Giá Cao Nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Tags Strip */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 py-3">
            <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Đang lọc:</span>
            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                Danh mục: {selectedCategory}
                <button onClick={() => setSelectedCategory("all")}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedGender !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                Giới tính: {selectedGender}
                <button onClick={() => setSelectedGender("all")}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedFrameShape !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                Dáng: {selectedFrameShape}
                <button onClick={() => setSelectedFrameShape("all")}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedMaterial !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                Chất liệu: {selectedMaterial}
                <button onClick={() => setSelectedMaterial("all")}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedFaceShapeFilter && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#0f172a] text-white text-xs font-bold shadow-xs">
                Mặt: {selectedFaceShapeFilter}
                <button onClick={() => setSelectedFaceShapeFilter(null)}><X className="w-3 h-3" /></button>
              </span>
            )}
            {showOnlyFavorites && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-50 text-red-600 text-xs font-semibold border border-red-200">
                Đã thích
                <button onClick={() => setShowOnlyFavorites(false)}><X className="w-3 h-3" /></button>
              </span>
            )}
            <button
              onClick={resetAllFilters}
              className="text-xs text-gray-500 hover:text-slate-900 underline font-medium ml-2 cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Xóa bộ lọc</span>
            </button>
          </div>
        )}

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Glasses className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Không tìm thấy mẫu kính phù hợp</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Thử xóa bớt bộ lọc hoặc gõ từ khóa tìm kiếm chung như "gọng titan", "kính râm", "mắt mèo"...
            </p>
            <button
              onClick={resetAllFilters}
              className="px-6 py-2.5 bg-[#0f172a] hover:bg-blue-900 text-white font-bold uppercase tracking-widest rounded-lg text-xs transition-colors cursor-pointer"
            >
              Xem tất cả kính mắt
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-4">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                isFavorite={favoriteIds.includes(p.id)}
                onToggleFavorite={handleToggleFavorite}
                onOpenDetail={(product, color) => setSelectedDetailProduct({ product, color })}
                onQuickTryOn={handleOpenTryOn}
                onQuickAddToCart={(product, color) => handleAddToCart(product, color)}
              />
            ))}
          </div>
        )}

        {/* Sleek Banner: Virtual Try-On Prompt */}
        <div className="mt-16 p-8 sm:p-12 rounded-2xl bg-[#0f172a] text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] border border-blue-500/30">
              <Camera className="w-3.5 h-3.5" />
              <span>Công Nghệ AR 3D Trực Tuyến</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Thử Kính Trực Tiếp Ngay Tại Nhà
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Bật webcam hoặc chọn ảnh khuôn mặt để ngắm nhìn chiếc kính yêu thích của bạn ở mọi góc độ trước khi đặt mua.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => handleOpenTryOn()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest px-6 py-3.5 rounded-lg text-xs shadow-lg transition-all duration-200 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Thử Kính AR Ngay</span>
            </button>
            <button
              onClick={() => setIsFaceAdvisorOpen(true)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold uppercase tracking-wider px-5 py-3.5 rounded-lg text-xs border border-slate-700 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Tư Vấn Khuôn Mặt</span>
            </button>
          </div>
        </div>

      </main>

      {/* Modals */}
      {selectedDetailProduct && (
        <ProductDetailModal
          product={selectedDetailProduct.product}
          initialColor={selectedDetailProduct.color}
          isFavorite={favoriteIds.includes(selectedDetailProduct.product.id)}
          onToggleFavorite={handleToggleFavorite}
          onClose={() => setSelectedDetailProduct(null)}
          onOpenTryOn={handleOpenTryOn}
          onAddToCart={handleAddToCart}
        />
      )}

      {isTryOnModalOpen && (
        <VirtualTryOnModal
          product={tryOnProduct}
          allProducts={products}
          onClose={() => setIsTryOnModalOpen(false)}
          onSelectProduct={(p) => setTryOnProduct(p)}
          onAddToCart={(p, c) => handleAddToCart(p, c)}
        />
      )}

      {isFaceAdvisorOpen && (
        <FaceShapeAdvisor
          onClose={() => setIsFaceAdvisorOpen(false)}
          onSelectRecommendedShapes={handleSelectRecommendedShapes}
        />
      )}

      {isLensGuideOpen && (
        <LensGuideModal onClose={() => setIsLensGuideOpen(false)} />
      )}

      {isStoresOpen && (
        <StoreLocationsModal onClose={() => setIsStoresOpen(false)} />
      )}

      {isOrderLookupOpen && (
        <OrderLookupModal onClose={() => setIsOrderLookupOpen(false)} />
      )}

      {isCartOpen && (
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveCartItem}
          appliedPromo={appliedPromo}
          onApplyPromo={setAppliedPromo}
          onProceedToCheckout={() => setIsCheckoutOpen(true)}
        />
      )}

      {isCheckoutOpen && (
        <CheckoutModal
          items={cartItems}
          appliedPromo={appliedPromo}
          onClose={() => setIsCheckoutOpen(false)}
          onOrderSuccess={(order) => {
            // Success handler
          }}
          onClearCart={handleClearCart}
        />
      )}

      {isAdminOpen && (
        <AdminPanel
          onClose={() => setIsAdminOpen(false)}
          products={products}
          onAddProduct={handleAddProduct}
          onUpdateProduct={() => {}}
          onDeleteProduct={handleDeleteProduct}
        />
      )}

      {/* Floating AI Consultant */}
      <EyewearAiChat
        onOpenTryOn={() => handleOpenTryOn()}
        onOpenFaceAdvisor={() => setIsFaceAdvisorOpen(true)}
        onOpenLensGuide={() => setIsLensGuideOpen(true)}
        onOpenStores={() => setIsStoresOpen(true)}
      />

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          const el = document.getElementById("products-catalog-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        onOpenStores={() => setIsStoresOpen(true)}
        onOpenLensGuide={() => setIsLensGuideOpen(true)}
        onOpenFaceAdvisor={() => setIsFaceAdvisorOpen(true)}
        onOpenTryOn={() => handleOpenTryOn()}
        onOpenOrderLookup={() => setIsOrderLookupOpen(true)}
      />

    </div>
  );
}
