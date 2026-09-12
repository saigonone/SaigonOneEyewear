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
  ProductsPage 
} from "./components/ProductsPage";
import { 
  ArticleDetailPage 
} from "./components/ArticleDetailPage";
import { 
  LensBrandDetail 
} from "./components/LensBrandDetail";
import { 
  LensArticlesPage 
} from "./components/LensArticlesPage";
import { 
  EyewearAiChat 
} from "./components/EyewearAiChat";
import { 
  MobileBottomNav 
} from "./components/MobileBottomNav";
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
  BannerSlide,
  LensBrandCategory
} from "./types";
import { MOCK_PRODUCTS } from "./data/mockProducts";
import { INITIAL_ARTICLES, INITIAL_ARTICLE_CATEGORIES } from "./data/mockArticles";
import { INITIAL_BANNER_SLIDES } from "./data/mockBanners";
import { INITIAL_LENS_BRANDS, INITIAL_LENS_ARTICLES } from "./data/mockLensBrands";
import { normalizeProduct } from "./utils/productUtils";
import { sortArticlesByNewest } from "./utils/articleUtils";
import { 
  addProductToFirebase, 
  deleteProductFromFirebase, 
  updateProductInFirebase,
  subscribeToProductsFromFirebase,
  subscribeToArticlesFromFirebase,
  subscribeToLensArticlesFromFirebase,
  subscribeToBannersFromFirebase,
  subscribeToLensBrandsFromFirebase,
  getArticleCategoriesFromFirebase,
  realtimeBroadcast
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
  Glasses,
  ChevronRight,
  ArrowRight,
  Sun,
  ShieldCheck,
  Layers,
  Eye
} from "lucide-react";

export default function App() {
  // Products state loaded directly from Firebase with realtime onSnapshot
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const cached = localStorage.getItem("saigonone_products");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p, idx) => normalizeProduct(p, p.id || `sgo-cached-${idx}`));
        }
      }
    } catch (e) {}
    return MOCK_PRODUCTS.map((p) => normalizeProduct(p, p.id));
  });
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);

  // Sync products in real-time from Firestore onSnapshot (with smooth auto-refresh)
  useEffect(() => {
    // 1. Lắng nghe trực tiếp Firestore qua onSnapshot
    const unsubscribeProducts = subscribeToProductsFromFirebase(
      (liveProducts) => {
        setProducts(liveProducts);
        setIsLoadingProducts(false);
      },
      (err) => {
        console.warn("[App] Lỗi lắng nghe realtime sản phẩm:", err);
        setIsLoadingProducts(false);
      }
    );

    return () => {
      unsubscribeProducts();
    };
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
  const [storesInitialTab, setStoresInitialTab] = useState<"all" | "map" | "appointment">("all");
  const [isOrderLookupOpen, setIsOrderLookupOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isArticlesPage, setIsArticlesPage] = useState<boolean>(false);
  const [isLensArticlesPage, setIsLensArticlesPage] = useState<boolean>(false);
  const [isProductsPage, setIsProductsPage] = useState<boolean>(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);

  // Articles & News state loaded from Firebase with realtime onSnapshot
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const cached = localStorage.getItem("saigonone_articles");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return sortArticlesByNewest(parsed);
      }
    } catch (e) {}
    return sortArticlesByNewest(INITIAL_ARTICLES);
  });

  const [lensArticles, setLensArticles] = useState<Article[]>(() => {
    try {
      const cached = localStorage.getItem("saigonone_lens_articles");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_LENS_ARTICLES;
  });

  const [articleCategories, setArticleCategories] = useState<ArticleCategory[]>(INITIAL_ARTICLE_CATEGORIES);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Lens Brands state loaded from Firebase with realtime onSnapshot
  const [lensBrands, setLensBrands] = useState<LensBrandCategory[]>(() => {
    try {
      const cached = localStorage.getItem("saigonone_lens_brands");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_LENS_BRANDS;
  });
  const [selectedLensBrand, setSelectedLensBrand] = useState<LensBrandCategory | null>(null);

  // Hero Banners state loaded from Firebase with realtime onSnapshot
  const [banners, setBanners] = useState<BannerSlide[]>(() => {
    try {
      const cached = localStorage.getItem("saigonone_banners");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_BANNER_SLIDES;
  });

  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem("saigonone_admin_authenticated") === "true";
    } catch (e) {
      return false;
    }
  });

  // Lắng nghe realtime toàn bộ: Banners, Bài Viết Cẩm Nang, Bài Viết Tròng Kính & Thương Hiệu Tròng
  useEffect(() => {
    // 1. Realtime listener cho Banners (onSnapshot)
    const unsubBanners = subscribeToBannersFromFirebase((liveBanners) => {
      setBanners(liveBanners);
    });

    // 2. Realtime listener cho Bài viết Cẩm Nang (onSnapshot)
    const unsubArticles = subscribeToArticlesFromFirebase((liveArticles) => {
      const sorted = sortArticlesByNewest(liveArticles);
      setArticles(sorted);
      setSelectedArticle((curr) => {
        if (!curr) return null;
        const fresh = sorted.find(a => a.id === curr.id);
        return fresh || curr;
      });
    });

    // 3. Realtime listener cho Bài viết Tròng Kính (onSnapshot)
    const unsubLensArticles = subscribeToLensArticlesFromFirebase((liveLensArts) => {
      setLensArticles(liveLensArts);
      setSelectedArticle((curr) => {
        if (!curr) return null;
        const fresh = liveLensArts.find(a => a.id === curr.id);
        return fresh || curr;
      });
    });

    // 4. Realtime listener cho Thương hiệu tròng kính (onSnapshot)
    const unsubLensBrands = subscribeToLensBrandsFromFirebase((liveBrands) => {
      setLensBrands(liveBrands);
      setSelectedLensBrand((curr) => {
        if (!curr) return null;
        const fresh = liveBrands.find(b => b.id === curr.id);
        return fresh || curr;
      });
    });

    // 5. Tải danh mục bài viết
    getArticleCategoriesFromFirebase().then((cats) => {
      if (cats && cats.length > 0) setArticleCategories(cats);
    }).catch(() => {});

    // 6. Cơ chế tự động làm mới / chống dữ liệu cũ (Anti-Stale Cache & Cross-Tab Broadcast)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Trình duyệt vừa quay lại tab, kiểm tra cập nhật mới nhất từ local cache hoặc trigger làm mới mượt mà
        try {
          const freshBanners = localStorage.getItem("saigonone_banners");
          if (freshBanners) {
            const parsed = JSON.parse(freshBanners);
            if (Array.isArray(parsed) && parsed.length > 0) setBanners(parsed);
          }
          const freshArticles = localStorage.getItem("saigonone_articles");
          if (freshArticles) {
            const parsed = JSON.parse(freshArticles);
            if (Array.isArray(parsed) && parsed.length > 0) setArticles(sortArticlesByNewest(parsed));
          }
          const freshProducts = localStorage.getItem("saigonone_products");
          if (freshProducts) {
            const parsed = JSON.parse(freshProducts);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setProducts(parsed.map((p, idx) => normalizeProduct(p, p.id || `sgo-vis-${idx}`)));
            }
          }
        } catch (e) {}
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Lắng nghe BroadcastChannel thông báo từ các tab khác (ví dụ: tab Quản Trị vừa sửa)
    let handleBroadcast: ((ev: MessageEvent) => void) | null = null;
    if (realtimeBroadcast) {
      handleBroadcast = (ev: MessageEvent) => {
        const entity = ev.data?.entity || ev.data?.type;
        try {
          if (entity === "banners" || entity === "all") {
            const raw = localStorage.getItem("saigonone_banners");
            if (raw) setBanners(JSON.parse(raw));
          }
          if (entity === "articles" || entity === "all") {
            const raw = localStorage.getItem("saigonone_articles");
            if (raw) setArticles(sortArticlesByNewest(JSON.parse(raw)));
          }
          if (entity === "lens_articles" || entity === "all") {
            const raw = localStorage.getItem("saigonone_lens_articles");
            if (raw) setLensArticles(JSON.parse(raw));
          }
          if (entity === "products" || entity === "all") {
            const raw = localStorage.getItem("saigonone_products");
            if (raw) {
              const parsed = JSON.parse(raw);
              if (Array.isArray(parsed)) {
                setProducts(parsed.map((p, idx) => normalizeProduct(p, p.id || `sgo-bcast-${idx}`)));
              }
            }
          }
        } catch (e) {}
      };
      realtimeBroadcast.addEventListener("message", handleBroadcast);
    }

    return () => {
      unsubBanners();
      unsubArticles();
      unsubLensArticles();
      unsubLensBrands();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (realtimeBroadcast && handleBroadcast) {
        realtimeBroadcast.removeEventListener("message", handleBroadcast);
      }
    };
  }, []);

  // Sync route on initial load and on popstate (Back/Forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const route = parseCurrentRoute(products, [...articles, ...lensArticles], lensBrands);
      updateSEOMeta(route.title, route.description);

      if (route.category) {
        setSelectedCategory(route.category);
      }
      setIsAboutOpen(!!route.isAbout);
      setIsStoresOpen(!!route.isStores);
      setIsTryOnModalOpen(!!route.isTryOn);
      setIsOrderLookupOpen(!!route.isOrderLookup);
      setIsArticlesPage(!!route.isArticlesPage);
      setIsLensArticlesPage(!!route.isLensArticlesPage);
      setIsProductsPage(!!route.isProductsPage);

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
          setIsLensArticlesPage(false);
          setIsProductsPage(false);
          setSelectedArticle(null);
          setSelectedLensBrand(null);
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
        const allAvailableArticles = [...articles, ...lensArticles];
        const foundArt = allAvailableArticles.find((a) => {
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
          setIsLensArticlesPage(false);
          setIsProductsPage(false);
          setSelectedDetailProduct(null);
          setSelectedLensBrand(null);
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

      if (route.isLensBrandPage && route.lensBrandSlug) {
        const decodedBrandSlug = decodeURIComponent(route.lensBrandSlug).toLowerCase().trim();
        const foundBrand = lensBrands.find((b) => {
          const bSlug = (b.slug || "").toLowerCase();
          const bId = (b.id || "").toLowerCase();
          const bKey = (b.brandKey || "").toLowerCase();
          const bNameSlug = createSlug(b.name).toLowerCase();
          return (
            bSlug === decodedBrandSlug ||
            bId === decodedBrandSlug ||
            bKey === decodedBrandSlug ||
            bNameSlug === decodedBrandSlug
          );
        });
        if (foundBrand) {
          setSelectedLensBrand(foundBrand);
          setSelectedDetailProduct(null);
          setSelectedArticle(null);
          setIsArticlesPage(false);
          setIsLensArticlesPage(false);
          setIsProductsPage(false);
          updateSEOMeta(
            `${foundBrand.name} (${foundBrand.origin}) Chính Hãng | Saigon One Eyewear`,
            foundBrand.description
          );
        } else {
          setSelectedLensBrand(null);
        }
      } else {
        setSelectedLensBrand(null);
      }
    };

    // Run once on load
    handlePopState();

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [products, articles, lensArticles, lensBrands, isAdminAuthenticated]);

  // Navigation handlers with HTML5 History API & SEO Title/Meta updates
  const handleGoHome = () => {
    setIsArticlesPage(false);
    setIsLensArticlesPage(false);
    setIsProductsPage(false);
    setSelectedLensBrand(null);
    setSelectedCategory("all");
    setShowOnlyFavorites(false);
    setSearchQuery("");
    setIsAboutOpen(false);
    setIsStoresOpen(false);
    setIsTryOnModalOpen(false);
    setIsOrderLookupOpen(false);
    setIsAdminOpen(false);
    setIsAdminLoginOpen(false);
    setSelectedDetailProduct(null);
    setSelectedArticle(null);
    navigateTo("/");
    updateSEOMeta(
      "Saigon One Eyewear - Kính Mắt & Tròng Kính Chính Hãng Phú Nhuận",
      "Hệ thống kính mắt Sài Gòn One - Đo khám khúc xạ chuẩn y khoa miễn phí, cắt kính lấy ngay 15 phút tại 178 Phan Đăng Lưu, Phú Nhuận, TP.HCM."
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenProducts = (category: ProductCategory = "all") => {
    setIsArticlesPage(false);
    setIsLensArticlesPage(false);
    setIsProductsPage(true);
    setSelectedLensBrand(null);
    setSelectedCategory(category);
    const targetPath = category === "all" ? "/san-pham" : CATEGORY_TO_PATH[category] || "/san-pham";
    navigateTo(targetPath);
    const route = parseCurrentRoute(products, articles, lensBrands);
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

  const handleSelectCategory = (cat: ProductCategory) => {
    handleOpenProducts(cat);
  };

  const handleSelectLensBrand = (brand: LensBrandCategory) => {
    navigateTo(`/trong-kinh/${brand.slug}`);
    setSelectedLensBrand(brand);
    setIsArticlesPage(false);
    setIsLensArticlesPage(false);
    setIsProductsPage(false);
    setIsAboutOpen(false);
    setIsStoresOpen(false);
    setIsTryOnModalOpen(false);
    setIsOrderLookupOpen(false);
    setIsAdminOpen(false);
    setIsAdminLoginOpen(false);
    setSelectedDetailProduct(null);
    setSelectedArticle(null);
    updateSEOMeta(
      `${brand.name} (${brand.origin}) Chính Hãng | Saigon One Eyewear`,
      brand.description
    );
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

  const handleOpenStores = (initialTab: "all" | "map" | "appointment" = "all") => {
    setStoresInitialTab(initialTab);
    navigateTo("/lien-he");
    setIsStoresOpen(true);
    updateSEOMeta(
      "Liên Hệ & Hệ Thống Cửa Hàng - Saigon One Eyewear",
      "Địa chỉ trụ sở Flagship Saigon One Eyewear: 178 Phan Đăng Lưu, Phường Đức Nhuận, TP.HCM. Hotline/Zalo: 0973.819.928."
    );
  };

  const handleOpenMap = () => {
    handleOpenStores("map");
  };

  const handleOpenAppointment = () => {
    handleOpenStores("appointment");
  };

  const handleOpenArticles = () => {
    navigateTo("/cam-nang");
    setIsArticlesPage(true);
    setIsLensArticlesPage(false);
    setIsProductsPage(false);
    setSelectedLensBrand(null);
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

  const handleOpenLensArticles = () => {
    navigateTo("/trong-kinh");
    setIsLensArticlesPage(true);
    setIsArticlesPage(false);
    setIsProductsPage(false);
    setSelectedLensBrand(null);
    setIsAboutOpen(false);
    setIsStoresOpen(false);
    setIsTryOnModalOpen(false);
    setIsOrderLookupOpen(false);
    setIsAdminOpen(false);
    setIsAdminLoginOpen(false);
    setSelectedDetailProduct(null);
    setSelectedArticle(null);
    updateSEOMeta(
      "Bảng Giá & Các Loại Tròng Kính Chính Hãng - Saigon One Eyewear",
      "Tổng hợp thông tin, bảng giá và cẩm nang các dòng tròng kính Essilor, Chemi, Hoya, Kodak, Zeiss chính hãng tại Sài Gòn One."
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenProductDetail = (product: Product, color?: ProductColor) => {
    const productUrl = getProductUrl(product);
    navigateTo(productUrl);
    setSelectedDetailProduct({ product, color });
    setSelectedArticle(null);
    setSelectedLensBrand(null);
    setIsArticlesPage(false);
    setIsLensArticlesPage(false);
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
    setSelectedLensBrand(null);
    setIsArticlesPage(false);
    setIsLensArticlesPage(false);
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
        } else {
          const inCategory = p.category === selectedCategory || (Array.isArray(p.categories) && p.categories.includes(selectedCategory as ProductCategory));
          if (!inCategory) {
            return false;
          }
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

  // 8 sản phẩm mới nhất hiển thị trên trang chủ
  const newestHomeProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => {
        // 1. So sánh ngày tạo (createdAt) nếu có
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (timeA && timeB && timeA !== timeB) return timeB - timeA;

        // 2. Kiểm tra nếu id có timestamp (vd: sgo-prod-174...)
        const matchA = a.id.match(/\d{10,}/);
        const matchB = b.id.match(/\d{10,}/);
        if (matchA && matchB) {
          const diff = Number(matchB[0]) - Number(matchA[0]);
          if (diff !== 0) return diff;
        } else if (matchB && !matchA) {
          return 1;
        } else if (matchA && !matchB) {
          return -1;
        }

        // 3. Ưu tiên hàng mới về (isNewArrival)
        if (a.isNewArrival && !b.isNewArrival) return -1;
        if (!a.isNewArrival && b.isNewArrival) return 1;

        return 0;
      })
      .slice(0, 8);
  }, [products]);

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
    <div className="min-h-screen flex flex-col bg-[#fdfdfd] text-[#1a1a1a] selection:bg-blue-600 selection:text-white pb-16 sm:pb-0">
      
      {/* Header */}
      <Header
        favoritesCount={favoriteIds.length}
        onOpenFavorites={() => {
          setIsArticlesPage(false);
          setIsLensArticlesPage(false);
          setSelectedLensBrand(null);
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
        onOpenLensArticles={handleOpenLensArticles}
        isLensArticlesActive={isLensArticlesPage}
        onOpenProducts={handleOpenProducts}
        isProductsActive={isProductsPage}
        lensBrands={lensBrands}
        onSelectLensBrand={handleSelectLensBrand}
        selectedLensBrandSlug={selectedLensBrand?.slug}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setIsArticlesPage(false);
          setIsLensArticlesPage(false);
          setSelectedLensBrand(null);
          setSearchQuery(q);
        }}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onGoHome={handleGoHome}
        selectedGender={selectedGender}
        onSelectGender={setSelectedGender}
      />

      {/* Standalone Product Detail Page vs Standalone Article Detail Page vs Standalone Lens Brand Page vs Lens Articles Page vs Articles Index Page vs Home Catalog Page */}
      {selectedDetailProduct ? (
        <ProductDetailPage
          product={selectedDetailProduct.product}
          initialColor={selectedDetailProduct.color}
          allProducts={products}
          onGoBack={() => {
            setSelectedDetailProduct(null);
            handleSelectCategory(selectedCategory || "all");
          }}
          onGoHome={handleGoHome}
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
            if (selectedArticle.lensBrandId || selectedArticle.category === "Tròng Kính") {
              handleOpenLensArticles();
            } else {
              handleOpenArticles();
            }
          }}
          onGoHome={handleGoHome}
          onSelectArticle={handleOpenArticleDetail}
          onOpenStores={handleOpenStores}
          onOpenTryOn={() => handleOpenTryOn()}
          onOpenCategory={(_catName) => {
            setSelectedArticle(null);
            handleOpenArticles();
          }}
        />
      ) : selectedLensBrand ? (
        <LensBrandDetail
          brand={selectedLensBrand}
          articles={lensArticles}
          allBrands={lensBrands}
          onSelectArticle={handleOpenArticleDetail}
          onSelectBrand={handleSelectLensBrand}
          onGoHome={handleGoHome}
          onOpenStores={handleOpenStores}
          onOpenTryOn={() => handleOpenTryOn()}
          onOpenLensGuide={() => setIsLensGuideOpen(true)}
        />
      ) : isLensArticlesPage ? (
        <LensArticlesPage
          articles={lensArticles}
          lensBrands={lensBrands}
          onSelectArticle={handleOpenArticleDetail}
          onSelectBrand={handleSelectLensBrand}
          onGoHome={handleGoHome}
          onOpenStores={handleOpenStores}
          onOpenTryOn={() => handleOpenTryOn()}
          onOpenLensGuide={() => setIsLensGuideOpen(true)}
        />
      ) : isArticlesPage ? (
        <ArticlesPage
          articles={articles}
          categories={articleCategories}
          onSelectArticle={handleOpenArticleDetail}
          onGoHome={handleGoHome}
          onOpenStores={handleOpenStores}
          onOpenTryOn={() => handleOpenTryOn()}
        />
      ) : isProductsPage ? (
        <ProductsPage
          products={products}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            const path = CATEGORY_TO_PATH[cat] || "/san-pham";
            navigateTo(path);
          }}
          onGoHome={handleGoHome}
          onOpenProductDetail={handleOpenProductDetail}
          onOpenTryOn={handleOpenTryOn}
          onOpenFaceAdvisor={() => setIsFaceAdvisorOpen(true)}
          onOpenLensGuide={() => setIsLensGuideOpen(true)}
          onOpenStores={handleOpenStores}
          favoriteIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
          initialSearchQuery={searchQuery}
        />
      ) : (
        <>
          {/* Hero Banner on Home */}
          <HeroBanner
            slides={banners}
            onOpenTryOn={() => handleOpenTryOn()}
            onOpenFaceAdvisor={() => setIsFaceAdvisorOpen(true)}
            onOpenLensGuide={() => setIsLensGuideOpen(true)}
            onSelectCategory={(cat) => handleOpenProducts(cat)}
            onOpenStores={handleOpenStores}
          />

          {/* Danh Mục Kính Mắt Saigon One - To, Nổi Bật & Rộng Hết Chiều Ngang */}
          <section className="w-full bg-gradient-to-b from-stone-50/80 via-white to-stone-50/60 border-y border-stone-200/80 py-10 sm:py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full mb-2.5 border border-blue-100">
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span>Hệ Thống Phân Loại Sản Phẩm</span>
                  </div>
                  <h2 id="heading-category-collection" className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                    Danh Mục Mắt Kính
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                    Khám phá trọn bộ sưu tập kính mắt và tròng kính khúc xạ chính hãng với chính sách bảo hành nắn chỉnh & thay ve ốc trọn đời miễn phí.
                  </p>
                </div>
                <button
                  onClick={() => handleOpenProducts("all")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-blue-700 hover:text-blue-800 font-bold text-xs uppercase tracking-wider rounded-xl border border-blue-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer self-start sm:self-auto shrink-0"
                >
                  <span>Xem Tất Cả Sản Phẩm ({products.length})</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 lg:gap-6">
                {[
                  { 
                    id: "gong-kinh-can", 
                    name: "Gọng Kính Cận", 
                    count: products.filter(p => p.category === "gong-kinh-can" || (p.categories && p.categories.includes("gong-kinh-can"))).length, 
                    desc: "Gọng cận siêu nhẹ, êm ái chống hằn sống mũi, độ bền cao",
                    tag: "Titanium & Acetate",
                    icon: <Glasses className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />,
                    iconBg: "bg-blue-50 group-hover:bg-blue-600 border border-blue-100/80",
                    badgeBg: "bg-blue-50/90 text-blue-700 border border-blue-200/60"
                  },
                  { 
                    id: "kinh-ram-mat", 
                    name: "Kính Thời Trang", 
                    count: products.filter(p => p.category === "kinh-ram-mat" || (p.categories && p.categories.includes("kinh-ram-mat"))).length, 
                    desc: "Tròng phân cực chống chói lóa, cản 100% tia cực tím",
                    tag: "Polarized UV400",
                    icon: <Sun className="w-7 h-7 text-amber-500 group-hover:text-white transition-colors" />,
                    iconBg: "bg-amber-50 group-hover:bg-amber-500 border border-amber-100/80",
                    badgeBg: "bg-amber-50/90 text-amber-800 border border-amber-200/60"
                  },
                  { 
                    id: "kinh-doi-mau", 
                    name: "Kính Áp Tròng", 
                    count: products.filter(p => p.category === "kinh-doi-mau" || (p.categories && p.categories.includes("kinh-doi-mau"))).length, 
                    desc: "Đổi màu thông minh khi ra nắng và kính áp tròng tiện lợi",
                    tag: "Đổi Màu Nắng 2-in-1",
                    icon: <Sparkles className="w-7 h-7 text-indigo-600 group-hover:text-white transition-colors" />,
                    iconBg: "bg-indigo-50 group-hover:bg-indigo-600 border border-indigo-100/80",
                    badgeBg: "bg-indigo-50/90 text-indigo-700 border border-indigo-200/60"
                  },
                  { 
                    id: "trong-kinh", 
                    name: "Bảng Giá Tròng", 
                    count: lensBrands.length > 0 ? `${lensBrands.length} thương hiệu` : "Chính hãng", 
                    desc: "Essilor, Chemi, Hoya lọc ánh sáng xanh & siêu mỏng",
                    tag: "Chuẩn Y Khoa",
                    icon: <Eye className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors" />,
                    iconBg: "bg-emerald-50 group-hover:bg-emerald-600 border border-emerald-100/80",
                    badgeBg: "bg-emerald-50/90 text-emerald-700 border border-emerald-200/60"
                  },
                  { 
                    id: "kinh-tre-em", 
                    name: "Kính Mắt Trẻ Em", 
                    count: products.filter(p => p.category === "kinh-tre-em" || (p.categories && p.categories.includes("kinh-tre-em"))).length, 
                    desc: "Chất liệu an toàn, chống gãy vỡ, bảo vệ thị lực học đường",
                    tag: "Nhựa Dẻo TR90",
                    icon: <ShieldCheck className="w-7 h-7 text-rose-600 group-hover:text-white transition-colors" />,
                    iconBg: "bg-rose-50 group-hover:bg-rose-600 border border-rose-100/80",
                    badgeBg: "bg-rose-50/90 text-rose-700 border border-rose-200/60"
                  },
                  { 
                    id: "phu-kien", 
                    name: "Phụ Kiện Kính", 
                    count: products.filter(p => p.category === "phu-kien" || (p.categories && p.categories.includes("phu-kien"))).length, 
                    desc: "Hộp da, khăn lau nano chống sương & dung dịch vệ sinh",
                    tag: "Chăm Sóc Kính",
                    icon: <Layers className="w-7 h-7 text-slate-700 group-hover:text-white transition-colors" />,
                    iconBg: "bg-slate-100 group-hover:bg-slate-800 border border-slate-200/80",
                    badgeBg: "bg-slate-100 text-slate-700 border border-slate-200/60"
                  },
                ].map((catItem) => (
                  <button
                    key={catItem.id}
                    onClick={() => catItem.id === "trong-kinh" ? handleOpenLensArticles() : handleOpenProducts(catItem.id as ProductCategory)}
                    className="bg-white rounded-2xl border border-stone-200/90 hover:border-blue-500 hover:shadow-xl transition-all duration-300 p-4 sm:p-5 flex flex-col justify-between text-left group cursor-pointer transform hover:-translate-y-1.5"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${catItem.iconBg} flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:scale-105`}>
                          {catItem.icon}
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${catItem.badgeBg} text-right shrink-0`}>
                          {catItem.tag}
                        </span>
                      </div>
                      <div className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                        {catItem.name}
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                        {catItem.desc}
                      </p>
                    </div>

                    <div className="pt-3 mt-3.5 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        {typeof catItem.count === "number" ? `${catItem.count} mẫu` : catItem.count}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 group-hover:text-blue-600 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-all">
                        Khám phá
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* 8 Sản Phẩm Kính Mắt Mới Nhất Trên Trang Chủ */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full mb-2 border border-blue-100">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Bộ Sưu Tập Mới Nhất 2026</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                  Khám phá các mẫu kính mắt vừa cập nhật tại Saigon One - Đo mắt khúc xạ chuẩn y khoa miễn phí & cắt kính lấy ngay trong 15 phút tại 178 Phan Đăng Lưu, Phú Nhuận.
                </p>
              </div>

              <button
                onClick={() => handleOpenProducts("all")}
                className="px-5 py-2.5 bg-slate-900 hover:bg-blue-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-2 self-start sm:self-auto shrink-0"
              >
                <span>Xem Tất Cả Sản Phẩm ({products.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {newestHomeProducts.map((p) => (
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

            <div className="mt-10 text-center">
              <button
                onClick={() => handleOpenProducts("all")}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs uppercase tracking-wider rounded-xl border border-gray-200 shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                <span>Mở Toàn Bộ Danh Mục Sản Phẩm & Bộ Lọc Chi Tiết</span>
                <ChevronRight className="w-4 h-4 text-blue-600" />
              </button>
            </div>
          </section>

          {/* Virtual Try-On AR Banner */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-blue-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
              <div className="space-y-2 max-w-xl text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] border border-blue-500/30">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Công Nghệ AR 3D Trực Tuyến</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Thử Kính Trực Tiếp Ngay Tại Nhà
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Bật camera trực tiếp để ướm thử hàng trăm mẫu gọng kính lên khuôn mặt bạn chuẩn tỉ lệ 1:1 trước khi ghé showroom 178 Phan Đăng Lưu.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={() => handleOpenTryOn()}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest px-6 py-3.5 rounded-xl text-xs shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Thử Kính AR Ngay</span>
                </button>
                <button
                  onClick={() => setIsFaceAdvisorOpen(true)}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold uppercase tracking-wider px-5 py-3.5 rounded-xl text-xs border border-slate-700 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>Tư Vấn Khuôn Mặt</span>
                </button>
              </div>
            </div>
          </section>

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
        <StoreLocationsModal 
          onClose={handleCloseModals} 
          initialTab={storesInitialTab}
        />
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
          lensArticles={lensArticles}
          onUpdateLensArticles={(updated) => setLensArticles(updated)}
          banners={banners}
          onUpdateBanners={(updated) => setBanners(updated)}
          lensBrands={lensBrands}
          onUpdateLensBrands={(updated) => setLensBrands(updated)}
          onLogout={handleAdminLogout}
        />
      )}

      {/* Floating AI Consultant (Desktop Actions & Back to Top) */}
      <EyewearAiChat
        onOpenTryOn={() => handleOpenTryOn()}
        onOpenFaceAdvisor={() => setIsFaceAdvisorOpen(true)}
        onOpenLensGuide={() => setIsLensGuideOpen(true)}
        onOpenStores={handleOpenStores}
      />

      {/* Mobile Horizontal Bottom Navigation Bar */}
      <MobileBottomNav
        onOpenAppointment={handleOpenAppointment}
        onOpenMap={handleOpenMap}
      />

      {/* Footer */}
      <Footer
        onGoHome={handleGoHome}
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
