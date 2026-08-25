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
  ProductDetailPage 
} from "./components/ProductDetailPage";
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
  OrderLookupModal 
} from "./components/OrderLookupModal";
import { 
  AdminPanel 
} from "./components/AdminPanel";
import { 
  AdminLoginModal 
} from "./components/AdminLoginModal";
import { 
  AboutModal 
} from "./components/AboutModal";
import { 
  LatestArticlesSection 
} from "./components/LatestArticlesSection";
import { 
  ArticlesPage 
} from "./components/ArticlesPage";
import { 
  ArticleDetailPage 
} from "./components/ArticleDetailPage";
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
  ProductColor, 
  LensOption, 
  EyePrescription,
  Article,
  ArticleCategory,
  BannerSlide
} from "./types";
import { MOCK_PRODUCTS } from "./data/mockProducts";
import { INITIAL_ARTICLES, INITIAL_ARTICLE_CATEGORIES } from "./data/mockArticles";
import { INITIAL_BANNER_SLIDES } from "./data/mockBanners";
import { 
  getProductsFromFirebase, 
  addProductToFirebase, 
  deleteProductFromFirebase, 
  updateProductInFirebase,
  subscribeToProductsFromFirebase,
  getArticlesFromFirebase,
  getArticleCategoriesFromFirebase,
  getBannersFromFirebase
} from "./firebase";
import { 
  parseCurrentRoute, 
  navigateTo, 
  replaceRoute, 
  updateSEOMeta, 
  CATEGORY_TO_PATH,
  getArticleSlug,
  getArticleUrl,
  getProductSlug,
  getProductUrl,
  createSlug
} from "./utils/routes";
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
  // Products state loaded directly from Firebase
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);

  // Sync products directly from Firebase (Firestore / Realtime Database)
  useEffect(() => {
    let unsubscribe = () => {};
    const loadFirebaseProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const data = await getProductsFromFirebase();
        if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Error loading products from Firebase:", err);
      } finally {
        setIsLoadingProducts(false);
      }

      // Realtime listener for live updates
      unsubscribe = subscribeToProductsFromFirebase((updatedList) => {
        if (updatedList && updatedList.length > 0) {
          setProducts(updatedList);
        }
      });
    };

    loadFirebaseProducts();
    return () => unsubscribe();
  }, []);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("all");
  const [selectedGender, setSelectedGender] = useState<GenderTarget | "all">("all");
  const [selectedFrameShape, setSelectedFrameShape] = useState<FrameShape | "all">("all");
  const [selectedMaterial, setSelectedMaterial] = useState<FrameMaterial | "all">("all");
  const [selectedFaceShapeFilter, setSelectedFaceShapeFilter] = useState<FaceShape | null>(null);
  const [sortBy, setSortBy] = useState<"featured" | "price_asc" | "price_desc" | "newest" | "rating">("featured");

  // Favorites / Wishlist state (persisted)
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("saigonone_favorites");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Modals visibility
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<{ product: Product; color?: ProductColor } | null>(null);
  const [tryOnProduct, setTryOnProduct] = useState<Product | null>(null);
  const [isTryOnModalOpen, setIsTryOnModalOpen] = useState<boolean>(false);
  const [isFaceAdvisorOpen, setIsFaceAdvisorOpen] = useState<boolean>(false);
  const [isLensGuideOpen, setIsLensGuideOpen] = useState<boolean>(false);
  const [isStoresOpen, setIsStoresOpen] = useState<boolean>(false);
  const [isOrderLookupOpen, setIsOrderLookupOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isArticlesPage, setIsArticlesPage] = useState<boolean>(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);

  // Articles & News state loaded from Firebase
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [articleCategories, setArticleCategories] = useState<ArticleCategory[]>(INITIAL_ARTICLE_CATEGORIES);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Hero Banners state loaded from Firebase
  const [banners, setBanners] = useState<BannerSlide[]>(INITIAL_BANNER_SLIDES);

  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem("saigonone_admin_authenticated") === "true";
    } catch (e) {
      return false;
    }
  });

  // Sync articles, categories and banners from Firebase
  useEffect(() => {
    const loadContentData = async () => {
      try {
        const [arts, cats, fetchedBanners] = await Promise.all([
          getArticlesFromFirebase(),
          getArticleCategoriesFromFirebase(),
          getBannersFromFirebase()
        ]);
        if (arts && arts.length > 0) setArticles(arts);
        if (cats && cats.length > 0) setArticleCategories(cats);
        if (fetchedBanners && fetchedBanners.length > 0) setBanners(fetchedBanners);
      } catch (e) {
        console.error("Error loading articles and banners:", e);
      }
    };
    loadContentData();
  }, []);

  // Sync route on initial load and on popstate (Back/Forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const route = parseCurrentRoute(products, articles);
      updateSEOMeta(route.title, route.description);

      if (route.category) {
        setSelectedCategory(route.category);
      }
      setIsAboutOpen(!!route.isAbout);
      setIsStoresOpen(!!route.isStores);
      setIsTryOnModalOpen(!!route.isTryOn);
      setIsOrderLookupOpen(!!route.isOrderLookup);
      setIsArticlesPage(!!route.isArticlesPage);

      if (route.isAdmin) {
        if (isAdminAuthenticated) {
          setIsAdminOpen(true);
        } else {
          setIsAdminLoginOpen(true);
        }
      } else {
        setIsAdminOpen(false);
        setIsAdminLoginOpen(false);
      }

      if (route.productId) {
        const decodedProdId = decodeURIComponent(route.productId).toLowerCase().trim();
        const cleanKey = createSlug(decodedProdId);
        const found = products.find((p) => {
          const pSlug = getProductSlug(p).toLowerCase();
          const pNameSlug = createSlug(p.name).toLowerCase();
          const pSkuSlug = createSlug(p.sku || "").toLowerCase();
          const pId = (p.id || "").toLowerCase();
          const pCustomSlug = (p.slug || "").toLowerCase();
          return (
            pId === decodedProdId ||
            pCustomSlug === decodedProdId ||
            pSlug === decodedProdId ||
            pSkuSlug === decodedProdId ||
            pNameSlug === decodedProdId ||
            pId === cleanKey ||
            pCustomSlug === cleanKey ||
            pSlug === cleanKey ||
            pSkuSlug === cleanKey ||
            pNameSlug === cleanKey ||
            (pSkuSlug && cleanKey.startsWith(`${pSkuSlug}-`))
          );
        });
        if (found) {
          setSelectedDetailProduct({ product: found });
          setIsArticlesPage(false);
          setSelectedArticle(null);
          updateSEOMeta(
            `${found.name} - ${found.brand} | Saigon One Eyewear`,
            `${found.name} chính hãng ${found.brand}. Chất liệu ${found.material}. Giá: ${found.price.toLocaleString("vi-VN")}đ.`
          );
        } else {
          setSelectedDetailProduct(null);
        }
      } else {
        setSelectedDetailProduct(null);
      }

      if (route.articleId) {
        const decodedArticleId = decodeURIComponent(route.articleId).toLowerCase().trim();
        const foundArt = articles.find((a) => {
          const artSlug = getArticleSlug(a).toLowerCase();
          const titleSlug = createSlug(a.title).toLowerCase();
          const aId = (a.id || "").toLowerCase();
          const aCustomSlug = (a.slug || "").toLowerCase();
          return (
            aId === decodedArticleId ||
            aCustomSlug === decodedArticleId ||
            artSlug === decodedArticleId ||
            titleSlug === decodedArticleId
          );
        });
        if (foundArt) {
          setSelectedArticle(foundArt);
          setIsArticlesPage(false);
          updateSEOMeta(
            `${foundArt.title} | Saigon One Eyewear`,
            foundArt.summary
          );
        } else {
          setSelectedArticle(null);
        }
      } else {
        setSelectedArticle(null);
      }
    };

    // Run once on load
    handlePopState();

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [products, articles, isAdminAuthenticated]);

  // Navigation handlers with HTML5 History API & SEO Title/Meta updates
  const handleSelectCategory = (cat: ProductCategory) => {
    setIsArticlesPage(false);
    setSelectedCategory(cat);
    const targetPath = cat === "all" ? "/san-pham" : CATEGORY_TO_PATH[cat] || "/san-pham";
    navigateTo(targetPath);
    const route = parseCurrentRoute(products, articles);
    updateSEOMeta(route.title, route.description);

    // Close open modals
    setIsAboutOpen(false);
    setIsStoresOpen(false);
    setIsTryOnModalOpen(false);
    setIsOrderLookupOpen(false);
    setSelectedDetailProduct(null);
    setSelectedArticle(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenAbout = () => {
    navigateTo("/gioi-thieu");
    setIsAboutOpen(true);
    updateSEOMeta(
      "Giới Thiệu Saigon One Eyewear - 178 Phan Đăng Lưu, Phú Nhuận",
      "Tìm hiểu về Saigon One Eyewear - Hệ thống mắt kính thời trang cao cấp & phòng khám đo khúc xạ y khoa uy tín tại TP.HCM."
    );
  };

  const handleOpenStores = () => {
    navigateTo("/lien-he");
    setIsStoresOpen(true);
    updateSEOMeta(
      "Liên Hệ & Hệ Thống Cửa Hàng - Saigon One Eyewear",
      "Địa chỉ trụ sở Flagship Saigon One Eyewear: 178 Phan Đăng Lưu, Phường 3, Phú Nhuận, TP.HCM. Hotline/Zalo: 0973.819.928."
    );
  };

  const handleOpenArticles = () => {
    navigateTo("/cam-nang");
    setIsArticlesPage(true);
    setIsAboutOpen(false);
    setIsStoresOpen(false);
    setIsTryOnModalOpen(false);
    setIsOrderLookupOpen(false);
    setIsAdminOpen(false);
    setIsAdminLoginOpen(false);
    setSelectedDetailProduct(null);
    setSelectedArticle(null);
    updateSEOMeta(
      "Cẩm Nang Thị Lực & Tin Tức Kính Mắt - Saigon One Eyewear",
      "Chia sẻ kinh nghiệm chọn gọng kính hợp khuôn mặt, chăm sóc mắt và công nghệ tròng kính chống ánh sáng xanh mới nhất tại Saigon One Eyewear 178 Phan Đăng Lưu."
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenProductDetail = (product: Product, color?: ProductColor) => {
    const productUrl = getProductUrl(product);
    navigateTo(productUrl);
    setSelectedDetailProduct({ product, color });
    setSelectedArticle(null);
    setIsArticlesPage(false);
    updateSEOMeta(
      `${product.name} - ${product.brand} | Saigon One Eyewear`,
      `${product.name} chính hãng ${product.brand}. Chất liệu ${product.material}. Giá: ${product.price.toLocaleString("vi-VN")}đ.`
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenArticleDetail = (art: Article) => {
    const articleUrl = getArticleUrl(art);
    navigateTo(articleUrl);
    setSelectedArticle(art);
    setIsArticlesPage(false);
    updateSEOMeta(
      `${art.title} | Saigon One Eyewear`,
      art.summary
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenOrderLookup = () => {
    navigateTo("/tra-cuu-don-hang");
    setIsOrderLookupOpen(true);
    updateSEOMeta(
      "Tra Cứu Đơn Hàng - Saigon One Eyewear",
      "Kiểm tra tiến độ đơn hàng và bảo hành kính mắt Saigon One."
    );
  };

  const handleOpenTryOn = (p?: Product) => {
    navigateTo("/thu-kinh-ar");
    if (p) {
      setTryOnProduct(p);
    } else {
      setTryOnProduct(products[0]);
    }
    setIsTryOnModalOpen(true);
    updateSEOMeta(
      "Thử Kính AR 3D Trực Tuyến - Saigon One Eyewear",
      "Trải nghiệm tính năng thử gọng kính AR 3D bằng camera trực tiếp siêu chân thực tại Saigon One Eyewear."
    );
  };

  const handleOpenAdminTrigger = () => {
    navigateTo("/admin");
    if (isAdminAuthenticated) {
      setIsAdminOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
    updateSEOMeta(
      "Quản Trị Hệ Thống - Saigon One Eyewear",
      "Hệ thống quản trị kính mắt Saigon One Eyewear."
    );
  };

  const handleCloseModals = () => {
    setIsAboutOpen(false);
    setIsStoresOpen(false);
    setIsTryOnModalOpen(false);
    setIsOrderLookupOpen(false);
    setIsAdminOpen(false);
    setIsAdminLoginOpen(false);
    setSelectedDetailProduct(null);
    setSelectedArticle(null);

    if (isArticlesPage) {
      replaceRoute("/cam-nang");
      updateSEOMeta(
        "Cẩm Nang Thị Lực & Tin Tức Kính Mắt - Saigon One Eyewear",
        "Chia sẻ kinh nghiệm chọn gọng kính hợp khuôn mặt, chăm sóc mắt và công nghệ tròng kính chống ánh sáng xanh mới nhất."
      );
      return;
    }

    const fallbackPath = selectedCategory === "all" ? "/" : CATEGORY_TO_PATH[selectedCategory] || "/san-pham";
    replaceRoute(fallbackPath);
    const route = parseCurrentRoute(products, articles);
    updateSEOMeta(route.title, route.description);
  };

  const handleLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsAdminLoginOpen(false);
    setIsAdminOpen(true);
  };

  const handleAdminLogout = () => {
    try {
      sessionStorage.removeItem("saigonone_admin_authenticated");
      sessionStorage.removeItem("saigonone_admin_user");
    } catch (e) {}
    setIsAdminAuthenticated(false);
    setIsAdminOpen(false);
    handleCloseModals();
  };

  // Sync favorites to local storage
  useEffect(() => {
    try {
      localStorage.setItem("saigonone_favorites", JSON.stringify(favoriteIds));
    } catch (e) {}
  }, [favoriteIds]);

  // Favorite handler
  const handleToggleFavorite = (product: Product) => {
    setFavoriteIds((prev) => 
      prev.includes(product.id) ? prev.filter((id) => id !== product.id) : [...prev, product.id]
    );
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

  // Admin product modification handlers with direct Firebase synchronization
  const handleAddProduct = async (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    await addProductToFirebase(newProd);
  };

  const handleDeleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    await deleteProductFromFirebase(id);
  };

  const handleUpdateProduct = async (updatedProd: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProd.id ? updatedProd : p)));
    await updateProductInFirebase(updatedProd);
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
        favoritesCount={favoriteIds.length}
        onOpenFavorites={() => {
          setIsArticlesPage(false);
          setShowOnlyFavorites(!showOnlyFavorites);
        }}
        onOpenTryOn={() => handleOpenTryOn()}
        onOpenFaceAdvisor={() => setIsFaceAdvisorOpen(true)}
        onOpenLensGuide={() => setIsLensGuideOpen(true)}
        onOpenStores={handleOpenStores}
        onOpenOrderLookup={handleOpenOrderLookup}
        onOpenAdmin={handleOpenAdminTrigger}
        onOpenAbout={handleOpenAbout}
        onOpenArticles={handleOpenArticles}
        isArticlesActive={isArticlesPage}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setIsArticlesPage(false);
          setSearchQuery(q);
        }}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        selectedGender={selectedGender}
        onSelectGender={setSelectedGender}
      />

      {/* Standalone Product Detail Page vs Standalone Article Detail Page vs Articles Index Page vs Home Catalog Page */}
      {selectedDetailProduct ? (
        <ProductDetailPage
          product={selectedDetailProduct.product}
          initialColor={selectedDetailProduct.color}
          allProducts={products}
          onGoBack={() => {
            setSelectedDetailProduct(null);
            handleSelectCategory(selectedCategory || "all");
          }}
          onGoHome={() => handleSelectCategory("all")}
          onSelectCategory={handleSelectCategory}
          onSelectProduct={handleOpenProductDetail}
          onOpenTryOn={handleOpenTryOn}
          onOpenStores={handleOpenStores}
        />
      ) : selectedArticle ? (
        <ArticleDetailPage
          article={selectedArticle}
          allArticles={articles}
          categories={articleCategories}
          onGoBack={() => {
            setSelectedArticle(null);
            handleOpenArticles();
          }}
          onGoHome={() => handleSelectCategory("all")}
          onSelectArticle={handleOpenArticleDetail}
          onOpenStores={handleOpenStores}
          onOpenTryOn={() => handleOpenTryOn()}
          onOpenCategory={(_catName) => {
            setSelectedArticle(null);
            handleOpenArticles();
          }}
        />
      ) : isArticlesPage ? (
        <ArticlesPage
          articles={articles}
          categories={articleCategories}
          onSelectArticle={handleOpenArticleDetail}
          onGoHome={() => handleSelectCategory("all")}
          onOpenStores={handleOpenStores}
          onOpenTryOn={() => handleOpenTryOn()}
        />
      ) : (
        <>
          {/* Hero Banner (Only if not in search or favorites mode) */}
          {!searchQuery && !showOnlyFavorites && (
            <HeroBanner
              slides={banners}
              onOpenTryOn={() => handleOpenTryOn()}
              onOpenFaceAdvisor={() => setIsFaceAdvisorOpen(true)}
              onOpenLensGuide={() => setIsLensGuideOpen(true)}
              onSelectCategory={handleSelectCategory}
            />
          )}

      {/* Main Catalog Content */}
      <main id="products-catalog-section" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 w-full">
        
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
                onOpenDetail={(product, color) => handleOpenProductDetail(product, color)}
                onQuickTryOn={handleOpenTryOn}
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

          {/* Latest Articles & Vision Guide Section */}
          {!searchQuery && !showOnlyFavorites && (
            <LatestArticlesSection
              articles={articles}
              categories={articleCategories}
              onSelectArticle={(art) => handleOpenArticleDetail(art)}
              onOpenAllArticles={handleOpenArticles}
            />
          )}
        </>
      )}

      {/* Modals */}
      {isAdminLoginOpen && (
        <AdminLoginModal
          isOpen={isAdminLoginOpen}
          onClose={handleCloseModals}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {isTryOnModalOpen && (
        <VirtualTryOnModal
          product={tryOnProduct}
          allProducts={products}
          onClose={handleCloseModals}
          onSelectProduct={(p) => setTryOnProduct(p)}
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
        <StoreLocationsModal onClose={handleCloseModals} />
      )}

      {isAboutOpen && (
        <AboutModal 
          onClose={handleCloseModals} 
          onOpenStores={() => {
            handleOpenStores();
          }}
          onOpenTryOn={() => {
            handleOpenTryOn();
          }}
        />
      )}

      {isOrderLookupOpen && (
        <OrderLookupModal onClose={handleCloseModals} />
      )}

      {isAdminOpen && (
        <AdminPanel
          onClose={handleCloseModals}
          products={products}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          articles={articles}
          onUpdateArticles={(updated) => setArticles(updated)}
          banners={banners}
          onUpdateBanners={(updated) => setBanners(updated)}
          onLogout={handleAdminLogout}
        />
      )}

      {/* Floating AI Consultant */}
      <EyewearAiChat
        onOpenTryOn={() => handleOpenTryOn()}
        onOpenFaceAdvisor={() => setIsFaceAdvisorOpen(true)}
        onOpenLensGuide={() => setIsLensGuideOpen(true)}
        onOpenStores={handleOpenStores}
      />

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setIsArticlesPage(false);
          handleSelectCategory(cat);
          const el = document.getElementById("products-catalog-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        onOpenStores={handleOpenStores}
        onOpenAbout={handleOpenAbout}
        onOpenArticles={handleOpenArticles}
        onOpenLensGuide={() => setIsLensGuideOpen(true)}
        onOpenFaceAdvisor={() => setIsFaceAdvisorOpen(true)}
        onOpenTryOn={() => handleOpenTryOn()}
        onOpenOrderLookup={handleOpenOrderLookup}
      />

    </div>
  );
}
