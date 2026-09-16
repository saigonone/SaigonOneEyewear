import React, { useState, useEffect, useRef } from "react";
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
  Check, 
  BookOpen, 
  FolderTree, 
  Shield, 
  LogOut, 
  Layers, 
  FileText, 
  UserPlus, 
  Tag, 
  AlertCircle, 
  Upload, 
  Image as ImageIcon, 
  Palette, 
  Star, 
  PlusCircle, 
  ArrowUp, 
  Ruler, 
  Scale, 
  SlidersHorizontal, 
  Link2, 
  Globe, 
  ExternalLink, 
  Copy, 
  Calendar, 
  Mail, 
  Phone, 
  MessageCircle, 
  Pin,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Type,
  Wand2,
  Download,
  EyeOff,
  KeyRound
} from "lucide-react";
import { 
  Product, 
  ProductColor,
  Order, 
  ProductCategory, 
  GenderTarget, 
  FrameShape, 
  FrameMaterial, 
  Article, 
  ArticleCategory, 
  ProductCategoryItem, 
  AdminUser,
  BannerSlide,
  Appointment,
  LensBrandCategory
} from "../types";
import { 
  createSlug, 
  getProductSlug, 
  getArticleSlug, 
  getProductUrl, 
  getArticleUrl 
} from "../utils/slug";
import { 
  fetchOrdersFromFirebase, 
  updateOrderStatusInFirebase,
  getArticlesFromFirebase,
  addArticleToFirebase,
  updateArticleInFirebase,
  deleteArticleFromFirebase,
  getArticleCategoriesFromFirebase,
  addArticleCategoryToFirebase,
  deleteArticleCategoryFromFirebase,
  getProductCategoriesFromFirebase,
  addProductCategoryToFirebase,
  deleteProductCategoryFromFirebase,
  getAdminsFromFirebase,
  addAdminToFirebase,
  updateAdminInFirebase,
  deleteAdminFromFirebase,
  getBannersFromFirebase,
  getAppointmentsFromFirebase,
  updateAppointmentStatusInFirebase,
  deleteAppointmentFromFirebase,
  getLensBrandsFromFirebase,
  addLensBrandToFirebase,
  updateLensBrandInFirebase,
  deleteLensBrandFromFirebase,
  getLensArticlesFromFirebase,
  addLensArticleToFirebase,
  updateLensArticleInFirebase,
  deleteLensArticleFromFirebase,
  db, 
  rtdb 
} from "../firebase";
import { AdminBannerManager } from "./AdminBannerManager";
import { AdminLensBrandsManager } from "./AdminLensBrandsManager";
import { AdminLensArticlesManager } from "./AdminLensArticlesManager";
import { RichTextEditor } from "./RichTextEditor";
import { AdminBackupModal } from "./AdminBackupModal";
import { ConfirmDeleteModal, DeletableItemType } from "./ConfirmDeleteModal";
import { sortArticlesByNewest } from "../utils/articleUtils";

const PRODUCT_CATEGORY_OPTIONS: { id: ProductCategory; label: string; sub: string; icon: string }[] = [
  { id: "gong-kinh-can", label: "Gọng Kính Cận", sub: "Gọng cận siêu nhẹ, titan & acetate", icon: "👓" },
  { id: "kinh-ram-mat", label: "Kính Râm Thời Trang", sub: "Chống chói Polarized UV400", icon: "🕶️" },
  { id: "kinh-doi-mau", label: "Kính Đổi Màu", sub: "Đổi màu nắng 2-in-1 tiện lợi", icon: "✨" },
  { id: "trong-kinh", label: "Tròng Kính", sub: "Lọc ánh sáng xanh, siêu mỏng", icon: "👁️" },
  { id: "kinh-tre-em", label: "Kính Mắt Trẻ Em", sub: "Nhựa dẻo TR90, an toàn cho bé", icon: "🛡️" },
  { id: "phu-kien", label: "Phụ Kiện Kính", sub: "Hộp da, khăn nano, nước lau kính", icon: "🧰" },
];

const CATEGORY_LABEL_MAP: Record<string, string> = {
  "all": "Tất Cả",
  "gong-kinh-can": "Gọng Kính Cận",
  "kinh-ram-mat": "Kính Râm Thời Trang",
  "kinh-doi-mau": "Kính Đổi Màu",
  "trong-kinh": "Tròng Kính",
  "kinh-tre-em": "Kính Trẻ Em",
  "phu-kien": "Phụ Kiện Kính"
};

interface AdminPanelProps {
  onClose: () => void;
  products: Product[];
  onAddProduct: (p: Product) => void;
  onUpdateProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  articles?: Article[];
  onUpdateArticles?: (articles: Article[]) => void;
  lensArticles?: Article[];
  onUpdateLensArticles?: (articles: Article[]) => void;
  lensBrands?: LensBrandCategory[];
  onUpdateLensBrands?: (brands: LensBrandCategory[]) => void;
  banners?: BannerSlide[];
  onUpdateBanners?: (banners: BannerSlide[]) => void;
  onLogout?: () => void;
}

type AdminTab = 
  | "products" 
  | "product_categories" 
  | "lens_articles" 
  | "lens_brands" 
  | "articles" 
  | "article_categories" 
  | "banners" 
  | "admins" 
  | "orders" 
  | "appointments";

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onClose,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  articles: initialArticles = [],
  onUpdateArticles,
  lensArticles: initialLensArticles = [],
  onUpdateLensArticles,
  lensBrands: initialLensBrands = [],
  onUpdateLensBrands,
  banners: initialBanners = [],
  onUpdateBanners,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>("products");
  const [banners, setBanners] = useState<BannerSlide[]>(initialBanners);
  const [orders, setOrders] = useState<Order[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentFilter, setAppointmentFilter] = useState<string>("all");
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [lensArticles, setLensArticles] = useState<Article[]>(initialLensArticles);
  const [articleCategories, setArticleCategories] = useState<ArticleCategory[]>([]);
  const [productCategories, setProductCategories] = useState<ProductCategoryItem[]>([]);
  const [lensBrands, setLensBrands] = useState<LensBrandCategory[]>(initialLensBrands);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>("");

  // Safe Data Management States
  const [showBackupModal, setShowBackupModal] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    itemType: DeletableItemType;
    itemTitle: string;
    itemId?: string;
    itemImage?: string;
    itemSubtitle?: string;
    onConfirm: () => Promise<void> | void;
  } | null>(null);

  // Product Form State
  const [showAddProductModal, setShowAddProductModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodName, setProdName] = useState("");
  const [prodSku, setProdSku] = useState("");
  const [prodSlug, setProdSlug] = useState("");
  const [isCustomProdSlug, setIsCustomProdSlug] = useState(false);
  const [prodBrand, setProdBrand] = useState("Sài Gòn One");
  const [prodCategory, setProdCategory] = useState<ProductCategory>("gong-kinh-can");
  const [prodCategories, setProdCategories] = useState<ProductCategory[]>(["gong-kinh-can"]);

  const toggleProdCategory = (catId: ProductCategory) => {
    setProdCategories((prev) => {
      let next: ProductCategory[];
      if (prev.includes(catId)) {
        if (prev.length <= 1) {
          // Keep at least one category selected
          return prev;
        }
        next = prev.filter((c) => c !== catId);
      } else {
        next = [...prev, catId];
      }
      if (!next.includes(prodCategory)) {
        setProdCategory(next[0] || "gong-kinh-can");
      }
      return next;
    });
  };

  const handleSelectAllCategories = () => {
    const all = PRODUCT_CATEGORY_OPTIONS.map((c) => c.id);
    setProdCategories(all);
    setProdCategory(all[0]);
  };

  const handleSelectOnlyCategory = (catId: ProductCategory) => {
    setProdCategories([catId]);
    setProdCategory(catId);
  };
  const [prodGender, setProdGender] = useState<GenderTarget>("unisex");
  const [prodShape, setProdShape] = useState<FrameShape>("vuong");
  const [prodMaterial, setProdMaterial] = useState<FrameMaterial>("titanium");
  const [prodPrice, setProdPrice] = useState("650000");
  const [prodOrigPrice, setProdOrigPrice] = useState("850000");
  const [prodStock, setProdStock] = useState<number>(30);
  const [prodLensWidth, setProdLensWidth] = useState<number>(51);
  const [prodBridgeWidth, setProdBridgeWidth] = useState<number>(19);
  const [prodTempleLength, setProdTempleLength] = useState<number>(145);
  const [prodFrameHeight, setProdFrameHeight] = useState<number>(44);
  const [prodWeight, setProdWeight] = useState<number>(14);
  const [prodImages, setProdImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState<string>("");
  const [prodColors, setProdColors] = useState<ProductColor[]>([]);
  const [prodDesc, setProdDesc] = useState("Gọng kính chính hãng chất lượng cao, bảo hành nắn chỉnh trọn đời.");
  const [prodHighlights, setProdHighlights] = useState<string>("Gọng kính chính hãng Sài Gòn One\nBảo hành nắn chỉnh trọn đời\nTặng kèm hộp da & khăn lau nano");
  const descTextareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightsTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [descPreviewMode, setDescPreviewMode] = useState<"edit" | "preview">("edit");
  const [highlightsPreviewMode, setHighlightsPreviewMode] = useState<"edit" | "preview">("edit");

  // Helper formatting for textarea
  const insertFormatToTextarea = (
    ref: React.RefObject<HTMLTextAreaElement>,
    prefix: string,
    suffix: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    currentVal: string
  ) => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selectedText = currentVal.substring(start, end);
    const textToWrap = selectedText || "văn bản";
    const replacement = prefix + textToWrap + suffix;
    const nextVal = currentVal.substring(0, start) + replacement + currentVal.substring(end);
    setter(nextVal);
    setTimeout(() => {
      el.focus();
      const newStart = start + prefix.length;
      const newEnd = newStart + textToWrap.length;
      el.setSelectionRange(newStart, newEnd);
    }, 10);
  };

  const insertSnippetToTextarea = (
    ref: React.RefObject<HTMLTextAreaElement>,
    snippet: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    currentVal: string
  ) => {
    const el = ref.current;
    if (!el) {
      setter(prev => (prev ? prev + "\n" + snippet : snippet));
      return;
    }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const nextVal = currentVal.substring(0, start) + snippet + currentVal.substring(end);
    setter(nextVal);
    setTimeout(() => {
      el.focus();
      const newPos = start + snippet.length;
      el.setSelectionRange(newPos, newPos);
    }, 10);
  };

  // Article Form State
  const [showAddArticleModal, setShowAddArticleModal] = useState<boolean>(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [artTitle, setArtTitle] = useState("");
  const [artSlug, setArtSlug] = useState("");
  const [isCustomArtSlug, setIsCustomArtSlug] = useState(false);
  const [artCategory, setArtCategory] = useState("Cẩm Nang Chọn Kính");
  const [artLensBrandId, setArtLensBrandId] = useState<string>("");
  const [artSummary, setArtSummary] = useState("");
  const [artContent, setArtContent] = useState("");
  const [artThumbnail, setArtThumbnail] = useState("https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=900&q=80");
  const [artAuthor, setArtAuthor] = useState("Chuyên Gia Sài Gòn One");
  const [artIsFeatured, setArtIsFeatured] = useState<boolean>(false);
  const [artIsPinned, setArtIsPinned] = useState<boolean>(false);
  const [artSearchFilter, setArtSearchFilter] = useState("");
  const [artCategoryFilter, setArtCategoryFilter] = useState("all");
  const [artLensBrandFilter, setArtLensBrandFilter] = useState("all");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [isSavingArticle, setIsSavingArticle] = useState<boolean>(false);

  // Category Form State
  const [showAddArtCatModal, setShowAddArtCatModal] = useState(false);
  const [newArtCatName, setNewArtCatName] = useState("");
  const [newArtCatDesc, setNewArtCatDesc] = useState("");

  const [showAddProdCatModal, setShowAddProdCatModal] = useState(false);
  const [newProdCatName, setNewProdCatName] = useState("");
  const [newProdCatSlug, setNewProdCatSlug] = useState<ProductCategory>("gong-kinh-can");
  const [newProdCatDesc, setNewProdCatDesc] = useState("");

  // Admin Form State
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdminUser, setNewAdminUser] = useState("");
  const [newAdminFullName, setNewAdminFullName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [showNewAdminPassword, setShowNewAdminPassword] = useState(false);
  const [newAdminRole, setNewAdminRole] = useState<"super_admin" | "admin" | "editor" | "technician">("admin");

  // Admin Password Management State
  const [showPasswordId, setShowPasswordId] = useState<string | null>(null);
  const [changePassAdmin, setChangePassAdmin] = useState<AdminUser | null>(null);
  const [newPasswordVal, setNewPasswordVal] = useState("");
  const [showChangePasswordVal, setShowChangePasswordVal] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Load all initial data from Firebase
  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedOrders, fetchedArticles, fetchedLensArticles, fetchedArtCats, fetchedProdCats, fetchedAdmins, fetchedBanners, fetchedAppointments, fetchedLensBrands] = await Promise.all([
        fetchOrdersFromFirebase(),
        getArticlesFromFirebase(),
        getLensArticlesFromFirebase(),
        getArticleCategoriesFromFirebase(),
        getProductCategoriesFromFirebase(),
        getAdminsFromFirebase(),
        getBannersFromFirebase(),
        getAppointmentsFromFirebase(),
        getLensBrandsFromFirebase(),
      ]);
      setOrders(fetchedOrders);
      setArticles(fetchedArticles);
      setLensArticles(fetchedLensArticles);
      onUpdateLensArticles?.(fetchedLensArticles);
      setArticleCategories(fetchedArtCats);
      setProductCategories(fetchedProdCats);
      setAdmins(fetchedAdmins);
      setAppointments(fetchedAppointments);
      if (fetchedLensBrands && fetchedLensBrands.length > 0) {
        setLensBrands(fetchedLensBrands);
        onUpdateLensBrands?.(fetchedLensBrands);
      }
      if (fetchedBanners && fetchedBanners.length > 0) {
        setBanners(fetchedBanners);
      }
    } catch (e) {
      console.error("Error loading admin data:", e);
    } finally {
      setLoading(false);
    }
  };

  // Đồng bộ thời gian thực khi App.tsx nhận dữ liệu mới từ Firestore onSnapshot
  useEffect(() => {
    if (initialArticles && initialArticles.length >= 0) {
      setArticles(initialArticles);
    }
  }, [initialArticles]);

  useEffect(() => {
    if (initialLensArticles && initialLensArticles.length >= 0) {
      setLensArticles(initialLensArticles);
    }
  }, [initialLensArticles]);

  useEffect(() => {
    if (initialBanners && initialBanners.length >= 0) {
      setBanners(initialBanners);
    }
  }, [initialBanners]);

  useEffect(() => {
    if (initialLensBrands && initialLensBrands.length >= 0) {
      setLensBrands(initialLensBrands);
    }
  }, [initialLensBrands]);

  useEffect(() => {
    loadData();
    const handleAppointmentUpdate = () => {
      getAppointmentsFromFirebase().then(setAppointments);
    };
    window.addEventListener("appointment_updated", handleAppointmentUpdate);
    return () => {
      window.removeEventListener("appointment_updated", handleAppointmentUpdate);
    };
  }, []);

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);
  };

  // ==========================================
  // HANDLERS: PRODUCTS & IMAGES & COLORS
  // ==========================================
  const handleAddImage = (urlToAdd?: string) => {
    const url = (urlToAdd || newImageUrl).trim();
    if (!url) return;
    if (!prodImages.includes(url)) {
      setProdImages(prev => [...prev, url]);
    }
    setNewImageUrl("");
  };

  const handleFileUploadForImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setProdImages(prev => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setProdImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetPrimaryImage = (indexToPromote: number) => {
    setProdImages(prev => {
      const item = prev[indexToPromote];
      const rest = prev.filter((_, idx) => idx !== indexToPromote);
      return [item, ...rest];
    });
  };

  const handleAddColor = () => {
    const newColor: ProductColor = {
      name: "Màu Mới",
      hex: "#1e2022",
      image: prodImages[0] || "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=900&q=80"
    };
    setProdColors(prev => [...prev, newColor]);
  };

  const handleQuickAddColorPreset = (presetName: string, presetHex: string) => {
    const newColor: ProductColor = {
      name: presetName,
      hex: presetHex,
      image: prodImages[0] || "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=900&q=80"
    };
    setProdColors(prev => [...prev, newColor]);
  };

  const handleUpdateColor = (index: number, field: keyof ProductColor, value: string) => {
    setProdColors(prev => prev.map((col, idx) => {
      if (idx === index) {
        return { ...col, [field]: value };
      }
      return col;
    }));
  };

  const handleColorImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        handleUpdateColor(index, "image", result);
        if (!prodImages.includes(result)) {
          setProdImages(prev => [...prev, result]);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveColor = (indexToRemove: number) => {
    setProdColors(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    const newSku = `SGO-${Math.floor(1000 + Math.random() * 9000)}`;
    setProdSku(newSku);
    setProdName("");
    setProdSlug("");
    setIsCustomProdSlug(false);
    setProdBrand("Sài Gòn One");
    setProdCategory("gong-kinh-can");
    setProdCategories(["gong-kinh-can"]);
    setProdGender("unisex");
    setProdShape("vuong");
    setProdMaterial("titanium");
    setProdPrice("650000");
    setProdOrigPrice("850000");
    setProdStock(30);
    setProdLensWidth(51);
    setProdBridgeWidth(19);
    setProdTempleLength(145);
    setProdFrameHeight(44);
    setProdWeight(14);
    const defaultImg = "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=900&q=80";
    setProdImages([defaultImg]);
    setNewImageUrl("");
    setProdColors([
      { name: "Đen Nhám Cổ Điển", hex: "#1e2022", image: defaultImg },
      { name: "Vàng Gold Sang Trọng", hex: "#d4af37", image: defaultImg }
    ]);
    setProdDesc("Gọng kính chính hãng chất lượng cao, bảo hành nắn chỉnh trọn đời.");
    setProdHighlights("Gọng kính chính hãng Sài Gòn One\nBảo hành nắn chỉnh trọn đời\nTặng kèm hộp da & khăn lau nano");
    setShowAddProductModal(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProdSku(p.sku || `SGO-${Math.floor(1000 + Math.random() * 9000)}`);
    setProdName(p.name);
    setProdSlug(p.slug || getProductSlug(p));
    setIsCustomProdSlug(!!p.slug);
    setProdBrand(p.brand);
    const initialCats: ProductCategory[] = (p.categories && p.categories.length > 0)
      ? [...p.categories]
      : (p.category ? [p.category] : ["gong-kinh-can"]);
    setProdCategories(initialCats);
    setProdCategory(p.category || initialCats[0] || "gong-kinh-can");
    setProdGender(p.gender || "unisex");
    setProdShape(p.frameShape);
    setProdMaterial(p.material);
    setProdPrice(p.price.toString());
    setProdOrigPrice(p.originalPrice.toString());
    setProdStock(p.stock || 20);
    setProdLensWidth(p.dimensions?.lensWidth || 51);
    setProdBridgeWidth(p.dimensions?.bridgeWidth || 19);
    setProdTempleLength(p.dimensions?.templeLength || 145);
    setProdFrameHeight(p.dimensions?.frameHeight || 44);
    setProdWeight(p.weight || 14);
    const existingImgs = (Array.isArray(p.images) && p.images.length > 0)
      ? p.images.filter(Boolean)
      : [p.thumbnail, p.image, p.imageUrl, p.image_url].filter(Boolean) as string[];
    const initialImgs = existingImgs.length > 0
      ? existingImgs
      : ["https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=900&q=80"];

    setProdImages([...initialImgs]);
    setNewImageUrl("");
    setProdColors(p.colors && p.colors.length > 0 ? [...p.colors] : [
      { name: "Đen Cơ Bản", hex: "#1e2022", image: initialImgs[0] }
    ]);
    setProdDesc(p.description || "");
    setProdHighlights(p.highlights?.join("\n") || "Gọng kính chính hãng Sài Gòn One\nBảo hành nắn chỉnh trọn đời");
    setShowAddProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    const priceNum = parseInt(prodPrice) || 500000;
    const origPriceNum = parseInt(prodOrigPrice) || priceNum;

    // Determine final images list
    const finalImages = prodImages.length > 0 ? prodImages : (prodColors.length > 0 && prodColors[0].image ? [prodColors[0].image] : ["https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=900&q=80"]);
    
    // Determine final colors list
    const finalColors = prodColors.length > 0 ? prodColors : [
      { name: "Đen Cơ Bản", hex: "#1e2022", image: finalImages[0] }
    ];

    const highlightsArr = prodHighlights.split("\n").map(s => s.trim()).filter(Boolean);

    const frameDimensions = {
      lensWidth: Number(prodLensWidth) || 51,
      bridgeWidth: Number(prodBridgeWidth) || 19,
      templeLength: Number(prodTempleLength) || 145,
      frameHeight: Number(prodFrameHeight) || 44,
    };
    const frameWeight = Number(prodWeight) || 14;

    const effectiveSku = prodSku.trim() || `SGO-${Math.floor(1000 + Math.random() * 9000)}`;
    const effectiveSlug = prodSlug.trim() || getProductSlug({ sku: effectiveSku, name: prodName });

    const effectiveCats: ProductCategory[] = prodCategories.length > 0
      ? prodCategories
      : [prodCategory || "gong-kinh-can"];
    const primaryCat = effectiveCats.includes(prodCategory) ? prodCategory : effectiveCats[0];

    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        sku: effectiveSku,
        name: prodName,
        slug: effectiveSlug,
        brand: prodBrand,
        category: primaryCat,
        categories: effectiveCats,
        gender: prodGender,
        frameShape: prodShape,
        material: prodMaterial,
        price: priceNum,
        originalPrice: origPriceNum,
        discountPercent: origPriceNum > priceNum ? Math.round(((origPriceNum - priceNum) / origPriceNum) * 100) : 0,
        thumbnail: finalImages[0],
        image: finalImages[0],
        imageUrl: finalImages[0],
        image_url: finalImages[0],
        images: finalImages,
        colors: finalColors,
        stock: prodStock,
        dimensions: frameDimensions,
        weight: frameWeight,
        description: prodDesc,
        highlights: highlightsArr.length > 0 ? highlightsArr : editingProduct.highlights,
      };
      onUpdateProduct(updated);
    } else {
      const id = `sgo-prod-${Date.now()}`;
      const newProd: Product = {
        id,
        sku: effectiveSku,
        name: prodName,
        slug: effectiveSlug,
        brand: prodBrand,
        category: primaryCat,
        categories: effectiveCats,
        gender: prodGender,
        price: priceNum,
        originalPrice: origPriceNum,
        discountPercent: origPriceNum > priceNum ? Math.round(((origPriceNum - priceNum) / origPriceNum) * 100) : 0,
        thumbnail: finalImages[0],
        image: finalImages[0],
        imageUrl: finalImages[0],
        image_url: finalImages[0],
        images: finalImages,
        colors: finalColors,
        frameShape: prodShape,
        faceShapes: ["tron", "trai-xoan", "vuong"],
        material: prodMaterial,
        weight: frameWeight,
        dimensions: frameDimensions,
        description: prodDesc,
        highlights: highlightsArr.length > 0 ? highlightsArr : ["Gọng kính chính hãng Sài Gòn One", "Bảo hành nắn chỉnh trọn đời"],
        stock: prodStock,
        rating: 5.0,
        reviewsCount: 1,
        tryOnOverlayType: "polygon",
        isNewArrival: true,
        createdAt: new Date().toISOString(),
      };
      onAddProduct(newProd);
    }
    setShowAddProductModal(false);
  };

  // ==========================================
  // HANDLERS: ARTICLES
  // ==========================================
  const handleOpenAddArticle = () => {
    setEditingArticle(null);
    setArtTitle("");
    setArtSlug("");
    setIsCustomArtSlug(false);
    setArtCategory(articleCategories[0]?.name || "Cẩm Nang Chọn Kính");
    setArtLensBrandId("");
    setArtSummary("");
    setArtContent("");
    setArtThumbnail("https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=900&q=80");
    setArtAuthor("Chuyên Gia Sài Gòn One");
    setArtIsFeatured(false);
    setArtIsPinned(false);
    setShowAddArticleModal(true);
  };

  const handleOpenEditArticle = (art: Article) => {
    setEditingArticle(art);
    setArtTitle(art.title);
    setArtSlug(art.slug || getArticleSlug(art));
    setIsCustomArtSlug(!!art.slug);
    setArtCategory(art.category);
    setArtLensBrandId(art.lensBrandId || "");
    setArtSummary(art.summary);
    setArtContent(art.content);
    setArtThumbnail(art.thumbnail);
    setArtAuthor(art.author);
    setArtIsFeatured(!!art.isFeatured);
    setArtIsPinned(!!art.isPinned);
    setShowAddArticleModal(true);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Kiểm tra tiêu đề bài viết
    const trimmedTitle = artTitle.trim();
    if (!trimmedTitle) {
      alert("Vui lòng nhập tiêu đề bài viết!");
      return;
    }

    // 2. Gom đầy đủ dữ liệu Payload đúng kiểu dữ liệu
    const effectiveSlug = (artSlug || "").trim() || createSlug(trimmedTitle);
    const effectiveContent = (artContent || "").trim();
    const effectiveSummary = (artSummary || "").trim() || trimmedTitle;
    const effectiveThumbnail = (artThumbnail || "").trim() || "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=900&q=80";
    const effectiveAuthor = (artAuthor || "").trim() || "Ban Biên Tập Mắt Kính Sài Gòn One";
    const effectiveCategory = artCategory || "Cẩm Nang Chọn Kính";

    setIsSavingArticle(true);

    try {
      if (editingArticle) {
        // Cập nhật bài viết hiện có
        const updated: Article = {
          ...editingArticle,
          title: trimmedTitle,
          slug: effectiveSlug,
          category: effectiveCategory,
          summary: effectiveSummary,
          content: effectiveContent,
          thumbnail: effectiveThumbnail,
          author: effectiveAuthor,
          isFeatured: Boolean(artIsFeatured),
          isPinned: Boolean(artIsPinned),
          isPublished: true,
          publishedAt: editingArticle.publishedAt || new Date().toLocaleDateString("vi-VN"),
        };

        if (artLensBrandId && artLensBrandId.trim()) {
          updated.lensBrandId = artLensBrandId.trim();
        } else {
          delete (updated as any).lensBrandId;
        }

        console.log("[AdminPanel] Gửi yêu cầu cập nhật bài viết lên Firestore collection 'articles':", updated);
        await updateArticleInFirebase(updated);
        console.log("[AdminPanel] ✅ Cập nhật bài viết lên Firestore thành công! Document ID:", updated.id);

        setArticles(prev => {
          const next = sortArticlesByNewest(prev.map(a => a.id === updated.id ? updated : a));
          onUpdateArticles?.(next);
          return next;
        });

        alert("✅ Đã cập nhật bài viết thành công lên Firestore!");
      } else {
        // Thêm bài viết mới (ID tự sinh rõ ràng)
        const id = `art-${Date.now()}`;
        const newArt: Article = {
          id,
          title: trimmedTitle,
          slug: effectiveSlug,
          category: effectiveCategory,
          summary: effectiveSummary,
          content: effectiveContent,
          thumbnail: effectiveThumbnail,
          author: effectiveAuthor,
          readTime: "4 phút đọc",
          publishedAt: new Date().toLocaleDateString("vi-VN"),
          viewsCount: 1,
          views: 1,
          tags: ["CamNang", "KinhMat", "SaigonOne"],
          isFeatured: Boolean(artIsFeatured),
          isPinned: Boolean(artIsPinned),
          isPublished: true,
        };

        if (artLensBrandId && artLensBrandId.trim()) {
          newArt.lensBrandId = artLensBrandId.trim();
        }

        console.log("[AdminPanel] Gửi yêu cầu đăng bài viết mới lên Firestore collection 'articles':", newArt);
        await addArticleToFirebase(newArt);
        console.log("[AdminPanel] ✅ Đăng bài viết mới lên Firestore thành công! Document ID:", id);

        setArticles(prev => {
          const next = sortArticlesByNewest([newArt, ...prev]);
          onUpdateArticles?.(next);
          return next;
        });

        alert("✅ Đã đăng bài viết mới thành công lên Firestore!");
      }

      setShowAddArticleModal(false);
    } catch (error: any) {
      console.error("[AdminPanel ERROR] ❌ Lỗi khi lưu bài viết lên Firestore collection 'articles':", error);
      alert(`❌ Đã xảy ra lỗi khi lưu bài viết lên Firestore!\n\nChi tiết lỗi: ${error?.message || error}\n\nVui lòng mở F12 Console để xem chi tiết.`);
    } finally {
      setIsSavingArticle(false);
    }
  };

  const handleToggleFeaturedArticle = async (art: Article) => {
    try {
      const updated: Article = {
        ...art,
        isFeatured: !art.isFeatured,
      };
      await updateArticleInFirebase(updated);
      setArticles(prev => {
        const next = prev.map(a => a.id === updated.id ? updated : a);
        onUpdateArticles?.(next);
        return next;
      });
    } catch (err) {
      console.error("[AdminPanel ERROR] ❌ Lỗi cập nhật bài viết nổi bật:", err);
    }
  };

  const handleTogglePinnedArticle = async (art: Article) => {
    try {
      const updated: Article = {
        ...art,
        isPinned: !art.isPinned,
      };
      await updateArticleInFirebase(updated);
      setArticles(prev => {
        const next = prev.map(a => a.id === updated.id ? updated : a);
        onUpdateArticles?.(next);
        return next;
      });
    } catch (err) {
      console.error("[AdminPanel ERROR] ❌ Lỗi ghim bài viết:", err);
    }
  };

  const executeDeleteArticle = async (id: string) => {
    try {
      console.log(`[AdminPanel] Bắt đầu xóa bài viết '${id}' khỏi Firestore collection 'articles'...`);
      await deleteArticleFromFirebase(id);
      console.log(`[AdminPanel] ✅ Đã xóa bài viết '${id}' khỏi Firestore thành công!`);
      setArticles(prev => {
        const next = prev.filter(a => a.id !== id);
        onUpdateArticles?.(next);
        return next;
      });
    } catch (err: any) {
      console.error(`[AdminPanel ERROR] ❌ Lỗi khi xóa bài viết '${id}':`, err);
      throw err;
    }
  };

  const handleRequestDeleteArticle = (art: Article) => {
    setDeleteTarget({
      itemType: "article",
      itemTitle: art.title,
      itemId: art.id,
      itemImage: art.thumbnail,
      itemSubtitle: `Chuyên mục: ${art.category || "Cẩm nang"} • Slug: ${art.slug || "N/A"}`,
      onConfirm: async () => {
        await executeDeleteArticle(art.id);
      },
    });
  };

  // ==========================================
  // HANDLERS: LENS ARTICLES (DEDICATED)
  // ==========================================
  const handleAddLensArticle = async (newArt: Article) => {
    await addLensArticleToFirebase(newArt);
    setLensArticles(prev => {
      const next = [newArt, ...prev];
      onUpdateLensArticles?.(next);
      return next;
    });
  };

  const handleUpdateLensArticle = async (updated: Article) => {
    await updateLensArticleInFirebase(updated);
    setLensArticles(prev => {
      const next = prev.map(a => a.id === updated.id ? updated : a);
      onUpdateLensArticles?.(next);
      return next;
    });
  };

  const handleDeleteLensArticle = async (id: string) => {
    await deleteLensArticleFromFirebase(id);
    setLensArticles(prev => {
      const next = prev.filter(a => a.id !== id);
      onUpdateLensArticles?.(next);
      return next;
    });
  };

  const handleTogglePinLensArticle = async (art: Article) => {
    const updated: Article = {
      ...art,
      isPinned: !art.isPinned,
    };
    await updateLensArticleInFirebase(updated);
    setLensArticles(prev => {
      const next = prev.map(a => a.id === updated.id ? updated : a);
      onUpdateLensArticles?.(next);
      return next;
    });
  };

  // ==========================================
  // HANDLERS: LENS BRANDS
  // ==========================================
  const handleAddLensBrand = async (brand: LensBrandCategory) => {
    await addLensBrandToFirebase(brand);
    setLensBrands(prev => {
      const next = [...prev, brand];
      onUpdateLensBrands?.(next);
      return next;
    });
  };

  const handleUpdateLensBrand = async (brand: LensBrandCategory) => {
    await updateLensBrandInFirebase(brand);
    setLensBrands(prev => {
      const next = prev.map(b => b.id === brand.id ? brand : b);
      onUpdateLensBrands?.(next);
      return next;
    });
  };

  const handleDeleteLensBrand = async (id: string) => {
    await deleteLensBrandFromFirebase(id);
    setLensBrands(prev => {
      const next = prev.filter(b => b.id !== id);
      onUpdateLensBrands?.(next);
      return next;
    });
  };

  // ==========================================
  // HANDLERS: CATEGORIES & ADMINS
  // ==========================================
  const handleSaveArtCat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArtCatName.trim()) return;
    const cat: ArticleCategory = {
      id: `cat-${Date.now()}`,
      name: newArtCatName,
      slug: newArtCatName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      description: newArtCatDesc,
    };
    await addArticleCategoryToFirebase(cat);
    setArticleCategories(prev => [...prev, cat]);
    setShowAddArtCatModal(false);
    setNewArtCatName("");
    setNewArtCatDesc("");
  };

  const handleRequestDeleteArtCat = (cat: ArticleCategory) => {
    setDeleteTarget({
      itemType: "article_category",
      itemTitle: cat.name,
      itemId: cat.id,
      itemSubtitle: `Slug: ${cat.slug || "N/A"} • ${cat.description || ""}`,
      onConfirm: async () => {
        await deleteArticleCategoryFromFirebase(cat.id);
        setArticleCategories(prev => prev.filter(c => c.id !== cat.id));
      },
    });
  };

  const handleSaveProdCat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdCatName.trim()) return;
    const pcat: ProductCategoryItem = {
      id: `pcat-${Date.now()}`,
      name: newProdCatName,
      slug: newProdCatSlug,
      description: newProdCatDesc,
    };
    await addProductCategoryToFirebase(pcat);
    setProductCategories(prev => [...prev, pcat]);
    setShowAddProdCatModal(false);
    setNewProdCatName("");
    setNewProdCatDesc("");
  };

  const handleRequestDeleteProdCat = (pcat: ProductCategoryItem) => {
    setDeleteTarget({
      itemType: "product_category",
      itemTitle: pcat.name,
      itemId: pcat.id,
      itemSubtitle: `Slug: ${pcat.slug || "N/A"} • ${pcat.description || ""}`,
      onConfirm: async () => {
        await deleteProductCategoryFromFirebase(pcat.id);
        setProductCategories(prev => prev.filter(c => c.id !== pcat.id));
      },
    });
  };

  const handleSaveAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = newAdminUser.trim().toLowerCase();
    const cleanPass = newAdminPassword.trim();

    if (!cleanUser) {
      alert("Vui lòng nhập tên đăng nhập!");
      return;
    }

    if (!cleanPass || cleanPass.length < 6) {
      alert("Mật khẩu là bắt buộc và phải có ít nhất 6 ký tự!");
      return;
    }

    if (admins.some(a => (a.username || "").toLowerCase() === cleanUser)) {
      alert(`Tên đăng nhập "${cleanUser}" đã tồn tại trên hệ thống. Vui lòng chọn tên khác!`);
      return;
    }

    const adm: AdminUser = {
      id: `adm-${Date.now()}`,
      username: cleanUser,
      fullName: newAdminFullName.trim() || cleanUser,
      email: newAdminEmail.trim() || `${cleanUser}@saigonone.vn`,
      password: cleanPass,
      role: newAdminRole,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    const ok = await addAdminToFirebase(adm);
    if (ok) {
      setAdmins(prev => [...prev, adm]);
      setShowAddAdminModal(false);
      setNewAdminUser("");
      setNewAdminFullName("");
      setNewAdminEmail("");
      setNewAdminPassword("");
      setShowNewAdminPassword(false);
    } else {
      alert("Có lỗi khi lưu tài khoản vào Firestore. Vui lòng thử lại!");
    }
  };

  const handleOpenChangePassword = (adm: AdminUser) => {
    setChangePassAdmin(adm);
    setNewPasswordVal("");
    setShowChangePasswordVal(false);
  };

  const handleSaveChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changePassAdmin) return;
    const cleanPass = newPasswordVal.trim();
    if (!cleanPass || cleanPass.length < 6) {
      alert("Mật khẩu mới phải có tối thiểu 6 ký tự!");
      return;
    }

    setIsUpdatingPassword(true);
    const updatedAdmin: AdminUser = {
      ...changePassAdmin,
      password: cleanPass,
    };

    const ok = await updateAdminInFirebase(updatedAdmin);
    setIsUpdatingPassword(false);

    if (ok) {
      setAdmins(prev => prev.map(a => a.id === updatedAdmin.id ? updatedAdmin : a));
      setChangePassAdmin(null);
      setNewPasswordVal("");
    } else {
      alert("Có lỗi khi cập nhật mật khẩu trên Firestore. Vui lòng thử lại!");
    }
  };

  const handleRequestDeleteAdmin = (adm: AdminUser) => {
    if (admins.length <= 1) {
      alert("Hệ thống phải có ít nhất 1 tài khoản quản trị!");
      return;
    }
    setDeleteTarget({
      itemType: "admin",
      itemTitle: adm.fullName || adm.username,
      itemId: adm.id,
      itemSubtitle: `Tài khoản: @${adm.username} • Email: ${adm.email} • Phân quyền: ${adm.role}`,
      onConfirm: async () => {
        await deleteAdminFromFirebase(adm.id);
        setAdmins(prev => prev.filter(a => a.id !== adm.id));
      },
    });
  };

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

  const handleUpdateAppointmentStatus = async (id: string, newStatus: Appointment["status"]) => {
    const updated = appointments.map((a) => {
      if (a.id === id) {
        return { ...a, status: newStatus };
      }
      return a;
    });
    setAppointments(updated);
    await updateAppointmentStatusInFirebase(id, newStatus);
  };

  const handleRequestDeleteAppointment = (apt: Appointment) => {
    setDeleteTarget({
      itemType: "appointment",
      itemTitle: `Lịch hẹn: ${apt.fullName}`,
      itemId: apt.id,
      itemSubtitle: `SĐT: ${apt.phone} • Ngày: ${apt.date} lúc ${apt.time} • Ghi chú: ${apt.note || "Khám đo mắt"}`,
      onConfirm: async () => {
        if (apt.id) {
          await deleteAppointmentFromFirebase(apt.id);
          setAppointments(prev => prev.filter(a => a.id !== apt.id));
        }
      },
    });
  };

  const pendingAppointmentsCount = appointments.filter(a => a.status === "pending").length;

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="relative w-full max-w-7xl bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden flex flex-col h-[94vh]">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Hệ Thống Quản Trị Trung Tâm</h2>
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[11px] font-semibold rounded-full">
                  Firebase Connected
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Sài Gòn One Eyewear • Toàn quyền Quản lý Dữ liệu & Đơn hàng
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Nút Sao Lưu Dữ Liệu Toàn Bộ */}
            <button
              id="btn-open-backup-modal"
              onClick={() => setShowBackupModal(true)}
              className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Sao lưu toàn bộ dữ liệu trên Firestore về máy tính (Export JSON)"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Sao lưu dữ liệu (Export JSON)</span>
              <span className="sm:hidden">Sao lưu</span>
            </button>

            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Đồng bộ lại dữ liệu từ Firebase"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-blue-400" : ""}`} />
              <span className="hidden sm:inline">Làm mới</span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
                title="Đăng xuất quyền quản trị"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 bg-slate-900 border-b border-slate-800 overflow-x-auto shrink-0 text-slate-300">
          {/* Nhóm 1: Sản Phẩm */}
          <button
            onClick={() => setActiveTab("products")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeTab === "products" || activeTab === "product_categories"
                ? "bg-blue-600 text-white shadow-xs"
                : "hover:bg-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Sản Phẩm ({products.length})</span>
          </button>

          {/* Nhóm 2: Tròng Kính (Tách riêng biệt theo yêu cầu) */}
          <button
            onClick={() => setActiveTab("lens_articles")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeTab === "lens_articles" || activeTab === "lens_brands"
                ? "bg-blue-600 text-white shadow-xs ring-1 ring-blue-400/40"
                : "hover:bg-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Tròng Kính ({lensArticles.length})</span>
          </button>

          {/* Nhóm 3: Cẩm Nang & Tin Tức (Giữ nguyên) */}
          <button
            onClick={() => setActiveTab("articles")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeTab === "articles" || activeTab === "article_categories"
                ? "bg-blue-600 text-white shadow-xs"
                : "hover:bg-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Cẩm Nang & Tin Tức ({articles.length})</span>
          </button>

          {/* Nhóm 4: Banners */}
          <button
            onClick={() => setActiveTab("banners")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeTab === "banners" ? "bg-blue-600 text-white shadow-xs" : "hover:bg-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Banner Trang Chủ ({banners.length})</span>
          </button>

          {/* Nhóm 5: Đơn Hàng */}
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeTab === "orders" ? "bg-blue-600 text-white shadow-xs" : "hover:bg-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Đơn Hàng ({orders.length})</span>
          </button>

          {/* Nhóm 6: Lịch Hẹn */}
          <button
            onClick={() => setActiveTab("appointments")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 relative cursor-pointer ${
              activeTab === "appointments" ? "bg-amber-600 text-white shadow-xs" : "hover:bg-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            <Calendar className="w-4 h-4 text-amber-300" />
            <span>Lịch Hẹn Đo Mắt ({appointments.length})</span>
            {pendingAppointmentsCount > 0 && (
              <span className="px-1.5 py-0.2 bg-rose-500 text-white text-[10px] font-extrabold rounded-full animate-pulse">
                {pendingAppointmentsCount} mới
              </span>
            )}
          </button>

          {/* Nhóm 7: Quản Trị Viên */}
          <button
            onClick={() => setActiveTab("admins")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeTab === "admins" ? "bg-blue-600 text-white shadow-xs" : "hover:bg-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Quản Trị Viên ({admins.length})</span>
          </button>
        </div>

        {/* Dynamic Sub-Navigation Bar for Multi-Item Sections */}
        {(activeTab === "products" || activeTab === "product_categories") && (
          <div className="flex items-center gap-2 px-6 py-2 bg-slate-950 border-b border-slate-800 text-xs shrink-0">
            <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider mr-1 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-blue-400" /> Quản Lý Sản Phẩm:
            </span>
            <button
              onClick={() => setActiveTab("products")}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "products" ? "bg-blue-600 text-white shadow-xs" : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Danh Sách Sản Phẩm ({products.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("product_categories")}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "product_categories" ? "bg-blue-600 text-white shadow-xs" : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span>Danh Mục Kính ({productCategories.length})</span>
            </button>
          </div>
        )}

        {(activeTab === "lens_articles" || activeTab === "lens_brands") && (
          <div className="flex items-center gap-2 px-6 py-2 bg-slate-950 border-b border-slate-800 text-xs shrink-0">
            <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider mr-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" /> Quản Lý Tròng Kính:
            </span>
            <button
              onClick={() => setActiveTab("lens_articles")}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "lens_articles" ? "bg-blue-600 text-white shadow-xs" : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Bài Viết Tròng Kính ({lensArticles.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("lens_brands")}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "lens_brands" ? "bg-blue-600 text-white shadow-xs" : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Thương Hiệu Tròng Kính ({lensBrands.length})</span>
            </button>
          </div>
        )}

        {(activeTab === "articles" || activeTab === "article_categories") && (
          <div className="flex items-center gap-2 px-6 py-2 bg-slate-950 border-b border-slate-800 text-xs shrink-0">
            <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider mr-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-400" /> Cẩm Nang & Tin Tức:
            </span>
            <button
              onClick={() => setActiveTab("articles")}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "articles" ? "bg-blue-600 text-white shadow-xs" : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Danh Sách Bài Viết ({articles.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("article_categories")}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "article_categories" ? "bg-blue-600 text-white shadow-xs" : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Chuyên Mục Tin Tức ({articleCategories.length})</span>
            </button>
          </div>
        )}

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          
          {/* ======================================================== */}
          {/* TAB: QUẢN TRỊ BANNER & SLIDER TRANG CHỦ */}
          {/* ======================================================== */}
          {activeTab === "banners" && (
            <AdminBannerManager
              banners={banners}
              onUpdateBanners={(updated) => {
                setBanners(updated);
                if (onUpdateBanners) onUpdateBanners(updated);
              }}
            />
          )}

          {/* ======================================================== */}
          {/* TAB 1: QUẢN TRỊ SẢN PHẨM */}
          {/* ======================================================== */}
          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm theo tên kính, mã SKU, thương hiệu..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>

                <button
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Kính Mới Vào Firebase</span>
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-gray-200">
                      <tr>
                        <th className="p-3.5">Sản Phẩm</th>
                        <th className="p-3.5">SKU / Hãng</th>
                        <th className="p-3.5">Danh Mục</th>
                        <th className="p-3.5">Giá Bán</th>
                        <th className="p-3.5">Tồn Kho</th>
                        <th className="p-3.5 text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products
                        .filter(p => p.name.toLowerCase().includes(searchFilter.toLowerCase()) || p.sku.toLowerCase().includes(searchFilter.toLowerCase()))
                        .map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3.5">
                              <div className="flex items-center gap-3">
                                <div className="relative shrink-0">
                                  <img
                                    src={p.images[0] || (p.colors && p.colors[0]?.image) || "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80"}
                                    alt={p.name}
                                    className="w-13 h-13 object-cover rounded-lg border border-gray-200"
                                    referrerPolicy="no-referrer"
                                  />
                                  <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-slate-900/90 text-[9px] text-white font-mono rounded shadow-xs">
                                    {p.images?.length || 1} ảnh
                                  </span>
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900 line-clamp-1">{p.name}</div>
                                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 flex-wrap">
                                    <span className="capitalize">{p.material}</span>
                                    <span>•</span>
                                    <span>Dáng {p.frameShape}</span>
                                    {p.dimensions && (
                                      <>
                                        <span>•</span>
                                        <span className="font-mono text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.5 rounded text-[10px]">
                                          {p.dimensions.lensWidth}□{p.dimensions.bridgeWidth}-{p.dimensions.templeLength}mm ({p.weight || 14}g)
                                        </span>
                                      </>
                                    )}
                                  </div>
                                  {p.colors && p.colors.length > 0 && (
                                    <div className="flex items-center gap-1.5 mt-1.5">
                                      {p.colors.slice(0, 5).map((c, i) => (
                                        <div
                                          key={i}
                                          className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-2xs"
                                          style={{ backgroundColor: c.hex }}
                                          title={`${c.name} (${c.hex})`}
                                        />
                                      ))}
                                      {p.colors.length > 5 && (
                                        <span className="text-[10px] text-slate-400">+{p.colors.length - 5}</span>
                                      )}
                                      <span className="text-[10px] text-slate-500 font-medium">({p.colors.length} màu)</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-3.5">
                              <div className="font-mono font-bold text-slate-800 text-xs">{p.sku}</div>
                              <div className="text-[11px] text-slate-400 mb-1">{p.brand}</div>
                              <div className="flex items-center gap-1 font-mono text-[10px] text-blue-700 bg-blue-50/80 border border-blue-200/60 px-1.5 py-0.5 rounded max-w-[200px] truncate">
                                <Globe className="w-2.5 h-2.5 text-blue-600 shrink-0" />
                                <span className="truncate">/san-pham/{p.slug || getProductSlug(p)}</span>
                              </div>
                            </td>
                            <td className="p-3.5">
                              <div className="flex flex-wrap gap-1 max-w-[170px]">
                                {(p.categories && p.categories.length > 0 ? p.categories : [p.category]).map((cat) => (
                                  <span
                                    key={cat}
                                    className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200/60 rounded-md font-semibold text-[10px] whitespace-nowrap"
                                  >
                                    {CATEGORY_LABEL_MAP[cat] || cat}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="p-3.5">
                              <div className="font-bold text-blue-600">{formatPrice(p.price)}</div>
                              {p.originalPrice > p.price && (
                                <div className="text-[11px] text-slate-400 line-through">{formatPrice(p.originalPrice)}</div>
                              )}
                            </td>
                            <td className="p-3.5">
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded text-[11px]">
                                {p.stock} cây
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const slugStr = p.slug || getProductSlug(p);
                                    const fullUrl = `${window.location.origin}/san-pham/${slugStr}`;
                                    navigator.clipboard.writeText(fullUrl);
                                    setCopiedSlug(p.id);
                                    setTimeout(() => setCopiedSlug(null), 2000);
                                  }}
                                  className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-medium ${
                                    copiedSlug === p.id 
                                      ? "bg-emerald-100 text-emerald-800" 
                                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                  }`}
                                  title="Sao chép đường dẫn tĩnh URL Slug"
                                >
                                  {copiedSlug === p.id ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                                  )}
                                </button>
                                <a
                                  href={`/san-pham/${p.slug || getProductSlug(p)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors inline-flex items-center"
                                  title="Mở xem trang chi tiết sản phẩm"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                                <button
                                  onClick={() => handleOpenEditProduct(p)}
                                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                                  title="Chỉnh sửa sản phẩm"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setDeleteTarget({
                                      itemType: "product",
                                      itemTitle: p.name,
                                      itemId: p.id,
                                      itemImage: p.images?.[0] || p.thumbnail,
                                      itemSubtitle: `Mã SKU: ${p.sku || "N/A"} • Giá: ${p.price?.toLocaleString("vi-VN")}₫`,
                                      onConfirm: async () => {
                                        await onDeleteProduct(p.id);
                                      },
                                    });
                                  }}
                                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer"
                                  title="Xóa sản phẩm"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: QUẢN TRỊ DANH MỤC KÍNH (PRODUCT CATEGORIES) */}
          {/* ======================================================== */}
          {activeTab === "product_categories" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Quản Lý Danh Mục Sản Phẩm</h3>
                  <p className="text-xs text-slate-500">Các danh mục phân loại kính mắt hiển thị trên bộ lọc trang chủ</p>
                </div>
                <button
                  onClick={() => setShowAddProdCatModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Danh Mục Kính</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {productCategories.map((pcat) => (
                  <div key={pcat.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md">
                          Slug: {pcat.slug}
                        </span>
                        <button
                          onClick={() => handleRequestDeleteProdCat(pcat)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Xóa danh mục"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mb-1">{pcat.name}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{pcat.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB: BÀI VIẾT TRÒNG KÍNH (DEDICATED LENS ARTICLES) */}
          {/* ======================================================== */}
          {activeTab === "lens_articles" && (
            <AdminLensArticlesManager
              articles={lensArticles}
              lensBrands={lensBrands}
              onAddArticle={handleAddLensArticle}
              onUpdateArticle={handleUpdateLensArticle}
              onDeleteArticle={handleDeleteLensArticle}
              onTogglePinArticle={handleTogglePinLensArticle}
            />
          )}

          {/* ======================================================== */}
          {/* TAB: THƯƠNG HIỆU TRÒNG KÍNH (LENS BRANDS) */}
          {/* ======================================================== */}
          {activeTab === "lens_brands" && (
            <AdminLensBrandsManager
              brands={lensBrands}
              onAddBrand={handleAddLensBrand}
              onUpdateBrand={handleUpdateLensBrand}
              onDeleteBrand={handleDeleteLensBrand}
            />
          )}

          {/* ======================================================== */}
          {/* TAB 3: QUẢN TRỊ BÀI VIẾT CẨM NANG & TIN TỨC (ARTICLES) */}
          {/* ======================================================== */}
          {activeTab === "articles" && (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex flex-1 flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-[200px] max-w-md">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Tìm bài viết theo tiêu đề, slug, tác giả..."
                      value={artSearchFilter}
                      onChange={(e) => setArtSearchFilter(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                    />
                  </div>

                  <select
                    value={artCategoryFilter}
                    onChange={(e) => setArtCategoryFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs text-slate-700 font-medium focus:ring-2 focus:ring-blue-600 cursor-pointer"
                  >
                    <option value="all">Tất Cả Chuyên Mục</option>
                    {articleCategories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleOpenAddArticle}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Viết Bài Cẩm Nang Mới</span>
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-gray-200">
                      <tr>
                        <th className="p-3.5">Bài Viết</th>
                        <th className="p-3.5">Đường Dẫn URL (Slug SEO)</th>
                        <th className="p-3.5">Chuyên Mục</th>
                        <th className="p-3.5 text-center">Nổi Bật (Trang Chủ)</th>
                        <th className="p-3.5">Tác Giả</th>
                        <th className="p-3.5">Lượt Xem</th>
                        <th className="p-3.5 text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {articles
                        .filter((art) => {
                          const matchSearch =
                            art.title.toLowerCase().includes(artSearchFilter.toLowerCase()) ||
                            (art.slug && art.slug.toLowerCase().includes(artSearchFilter.toLowerCase())) ||
                            art.author.toLowerCase().includes(artSearchFilter.toLowerCase()) ||
                            art.category.toLowerCase().includes(artSearchFilter.toLowerCase());
                          const matchCat =
                            artCategoryFilter === "all" || art.category === artCategoryFilter;
                          return matchSearch && matchCat;
                        })
                        .map((art) => {
                          const slugVal = art.slug || getArticleSlug(art);
                          const fullUrl = `https://matkinhsaigonone.com/bai-viet/${slugVal}`;

                          return (
                            <tr key={art.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="p-3.5 max-w-sm">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={art.thumbnail || "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=600&q=80"}
                                    alt={art.title}
                                    className="w-13 h-13 object-cover rounded-lg border border-gray-200 shrink-0"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="min-w-0">
                                    <div className="font-bold text-slate-900 line-clamp-1 hover:text-blue-600 transition-colors">
                                      <span className="truncate">{art.title}</span>
                                    </div>
                                    <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                      {art.summary}
                                    </div>
                                    <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                                      <span>{art.category || "Bài viết"}</span>
                                      <span>•</span>
                                      <span>{art.readTime || "4 phút đọc"}</span>
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td className="p-3.5">
                                <div className="inline-flex flex-col gap-1">
                                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-1 rounded-md max-w-xs truncate">
                                    <Globe className="w-3 h-3 text-blue-600 shrink-0" />
                                    <span className="truncate">/bai-viet/{slugVal}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard.writeText(fullUrl);
                                      setCopiedSlug(art.id);
                                      setTimeout(() => setCopiedSlug(null), 2000);
                                    }}
                                    className="text-[10px] text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors cursor-pointer w-fit"
                                  >
                                    {copiedSlug === art.id ? (
                                      <>
                                        <Check className="w-3 h-3 text-emerald-600" />
                                        <span className="text-emerald-600 font-semibold">Đã sao chép link</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3 h-3" />
                                        <span>Sao chép link đầy đủ</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </td>

                              <td className="p-3.5">
                                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-medium text-[11px]">
                                  {art.category}
                                </span>
                              </td>

                              <td className="p-3.5 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleToggleFeaturedArticle(art)}
                                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                                    art.isFeatured
                                      ? "bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200"
                                      : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 border border-slate-200"
                                  }`}
                                  title={art.isFeatured ? "Đang nổi bật trên Trang Chủ (Bấm để gỡ bỏ)" : "Bấm để ghim làm Bài Viết Nổi Bật Trang Chủ"}
                                >
                                  <Star className={`w-3.5 h-3.5 ${art.isFeatured ? "fill-amber-500 text-amber-500" : "text-slate-400"}`} />
                                  <span>{art.isFeatured ? "★ Nổi Bật" : "Bình Thường"}</span>
                                </button>
                              </td>

                              <td className="p-3.5">
                                <div className="font-semibold text-slate-800">{art.author}</div>
                                <div className="text-[10px] text-slate-400">Biên tập viên</div>
                              </td>

                              <td className="p-3.5">
                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded text-[11px] flex items-center gap-1 w-fit">
                                  <Eye className="w-3 h-3" />
                                  <span>{art.viewsCount || 0}</span>
                                </span>
                              </td>

                              <td className="p-3.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleOpenEditArticle(art)}
                                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                                    title="Chỉnh sửa bài viết"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleRequestDeleteArticle(art)}
                                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer"
                                    title="Xóa bài viết"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      {articles.length === 0 && (
                        <tr>
                          <td colSpan={9} className="text-center py-10 text-slate-400">
                            Chưa có bài viết nào trong hệ thống. Hãy nhấn "Viết Bài Mới" để tạo bài viết đầu tiên!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: CHUYÊN MỤC BÀI VIẾT (ARTICLE CATEGORIES) */}
          {/* ======================================================== */}
          {activeTab === "article_categories" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Quản Lý Chuyên Mục Bài Viết</h3>
                  <p className="text-xs text-slate-500">Các tab chuyên mục tin tức (Cẩm nang, Xu hướng, Kiến thức thị lực...)</p>
                </div>
                <button
                  onClick={() => setShowAddArtCatModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Chuyên Mục Tin</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {articleCategories.map((cat) => (
                  <div key={cat.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-md">
                          Slug: {cat.slug}
                        </span>
                        <button
                          onClick={() => handleRequestDeleteArtCat(cat)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mb-1">{cat.name}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{cat.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: QUẢN TRỊ VIÊN (ADMINS) */}
          {/* ======================================================== */}
          {activeTab === "admins" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Danh Sách Quản Trị Viên</h3>
                  <p className="text-xs text-slate-500">Tài khoản có quyền đăng nhập vào Bảng Điều Khiển</p>
                </div>
                <button
                  onClick={() => setShowAddAdminModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Thêm Quản Trị Viên Mới</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {admins.map((adm) => (
                  <div key={adm.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                          adm.role === "super_admin" ? "bg-purple-100 text-purple-700" :
                          adm.role === "technician" ? "bg-amber-100 text-amber-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {adm.role === "super_admin" ? "Super Admin" : adm.role === "technician" ? "Kỹ Thuật Viên" : "Biên Tập Viên"}
                        </span>
                        {admins.length > 1 && (
                          <button
                            onClick={() => handleRequestDeleteAdmin(adm)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="font-bold text-slate-900 text-base">{adm.fullName}</div>
                      <div className="text-xs font-mono text-blue-600 font-semibold mt-0.5">User: @{adm.username}</div>
                      <div className="text-xs text-slate-400 mt-1 truncate">{adm.email}</div>

                      <div className="mt-3.5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-slate-600 font-mono text-[11px]">
                          <KeyRound className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-semibold">
                            {adm.password ? (showPasswordId === adm.id ? adm.password : "••••••••") : "Mật khẩu mặc định"}
                          </span>
                          {adm.password && (
                            <button
                              type="button"
                              onClick={() => setShowPasswordId(showPasswordId === adm.id ? null : adm.id)}
                              className="text-slate-400 hover:text-slate-700 ml-1 p-0.5 transition-colors cursor-pointer"
                              title={showPasswordId === adm.id ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                            >
                              {showPasswordId === adm.id ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenChangePassword(adm)}
                          className="text-blue-600 hover:text-blue-800 font-semibold text-[11px] hover:underline cursor-pointer"
                        >
                          Đổi mật khẩu
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: QUẢN LÝ ĐƠN HÀNG */}
          {/* ======================================================== */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
                  <div className="text-xs text-slate-400 font-medium">Tổng Đơn Đã Đặt</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{orders.length} đơn</div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
                  <div className="text-xs text-slate-400 font-medium">Doanh Thu Tạm Tính</div>
                  <div className="text-2xl font-bold text-blue-600 mt-1">{formatPrice(totalRevenue)}</div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
                  <div className="text-xs text-slate-400 font-medium">Đơn Cần Mài Kính</div>
                  <div className="text-2xl font-bold text-amber-600 mt-1">
                    {orders.filter(o => o.status === "pending" || o.status === "confirmed" || o.status === "lens_crafting").length} đơn
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-gray-200">
                      <tr>
                        <th className="p-3.5">Mã Đơn / Ngày</th>
                        <th className="p-3.5">Khách Hàng</th>
                        <th className="p-3.5">Sản Phẩm & Tròng</th>
                        <th className="p-3.5">Tổng Tiền</th>
                        <th className="p-3.5">Trạng Thái Đơn</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.map((o) => (
                        <tr key={o.orderCode} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5">
                            <div className="font-mono font-bold text-blue-600">{o.orderCode}</div>
                            <div className="text-[11px] text-slate-400">
                              {o.createdAt ? new Date(o.createdAt).toLocaleDateString("vi-VN") : "Hôm nay"}
                            </div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-slate-900">{o.customer?.fullName}</div>
                            <div className="text-[11px] text-slate-500 font-mono">{o.customer?.phone}</div>
                            <div className="text-[11px] text-slate-400 truncate max-w-xs">{o.customer?.address}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="space-y-1">
                              {o.items?.map((it, idx) => (
                                <div key={idx} className="text-[11px]">
                                  <span className="font-semibold text-slate-800">{it.product?.name}</span>
                                  {it.selectedLens && (
                                    <span className="text-blue-600 block text-[10px]">Tròng: {it.selectedLens.name}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="p-3.5 font-bold text-slate-900">
                            {formatPrice(o.total)}
                          </td>
                          <td className="p-3.5">
                            <select
                              value={o.status}
                              onChange={(e) => handleStatusChange(o.orderCode, e.target.value)}
                              className="px-2.5 py-1 bg-slate-50 border border-gray-200 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            >
                              <option value="pending">⏳ Chờ xử lý</option>
                              <option value="confirmed">✅ Đã xác nhận</option>
                              <option value="lens_crafting">⚙️ Đang mài tròng</option>
                              <option value="shipping">🚚 Đang giao hàng</option>
                              <option value="completed">🎉 Đã hoàn tất</option>
                              <option value="cancelled">❌ Đã hủy</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 7: QUẢN LÝ LỊCH HẸN ĐO MẮT (178 PHAN ĐĂNG LƯU) */}
          {/* ======================================================== */}
          {activeTab === "appointments" && (
            <div className="space-y-6">
              {/* Header metrics banner */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
                  <div className="text-xs text-slate-400 font-medium">Tổng Lịch Hẹn Đã Đặt</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{appointments.length} lượt</div>
                </div>

                <div className="bg-amber-50/80 p-5 rounded-xl border border-amber-200 shadow-xs">
                  <div className="text-xs text-amber-700 font-medium flex items-center justify-between">
                    <span>Chờ Xác Nhận</span>
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                  </div>
                  <div className="text-2xl font-bold text-amber-900 mt-1">
                    {appointments.filter(a => a.status === "pending").length} lịch
                  </div>
                </div>

                <div className="bg-emerald-50/80 p-5 rounded-xl border border-emerald-200 shadow-xs">
                  <div className="text-xs text-emerald-700 font-medium">Đã Đo Khám Xong</div>
                  <div className="text-2xl font-bold text-emerald-900 mt-1">
                    {appointments.filter(a => a.status === "completed").length} lượt
                  </div>
                </div>

                <div className="bg-blue-50/80 p-5 rounded-xl border border-blue-200 shadow-xs">
                  <div className="text-xs text-blue-700 font-medium">Email Thông Báo Tự Động</div>
                  <div className="text-xs font-bold text-blue-900 mt-2 font-mono truncate" title="matkinhsaigonone@gmail.com">
                    matkinhsaigonone@gmail.com
                  </div>
                  <div className="text-[10px] text-blue-600 mt-0.5">Lưu đồng thời trong Firestore Cloud</div>
                </div>
              </div>

              {/* Filter bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 overflow-x-auto">
                  <span className="text-xs font-semibold text-slate-600 shrink-0">Lọc theo:</span>
                  <button
                    onClick={() => setAppointmentFilter("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                      appointmentFilter === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Tất cả ({appointments.length})
                  </button>
                  <button
                    onClick={() => setAppointmentFilter("pending")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                      appointmentFilter === "pending" ? "bg-amber-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Chờ xác nhận ({appointments.filter(a => a.status === "pending").length})
                  </button>
                  <button
                    onClick={() => setAppointmentFilter("confirmed")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                      appointmentFilter === "confirmed" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Đã xác nhận ({appointments.filter(a => a.status === "confirmed").length})
                  </button>
                  <button
                    onClick={() => setAppointmentFilter("completed")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                      appointmentFilter === "completed" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Đã hoàn tất ({appointments.filter(a => a.status === "completed").length})
                  </button>
                </div>

                <div className="text-xs text-slate-500">
                  📍 Địa điểm đo mắt: <strong className="text-slate-800">178 Phan Đăng Lưu, P. Đức Nhuận, TP.HCM</strong>
                </div>
              </div>

              {/* Appointments List */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
                {appointments.filter(a => appointmentFilter === "all" || a.status === appointmentFilter).length === 0 ? (
                  <div className="p-12 text-center text-slate-400">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p className="font-semibold text-slate-600">Chưa có lịch hẹn nào</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Khi khách hàng đăng ký đo mắt qua biểu mẫu tại 178 Phan Đăng Lưu, thông tin sẽ được tự động lưu tại đây và gửi tới matkinhsaigonone@gmail.com
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-gray-200">
                        <tr>
                          <th className="p-3.5">Khách Hàng</th>
                          <th className="p-3.5">Ngày & Khung Giờ Đo</th>
                          <th className="p-3.5">Ghi Chú Yêu Cầu</th>
                          <th className="p-3.5">Kênh Thông Báo</th>
                          <th className="p-3.5">Trạng Thái</th>
                          <th className="p-3.5 text-right">Thao Tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {appointments
                          .filter(a => appointmentFilter === "all" || a.status === appointmentFilter)
                          .map((apt) => (
                            <tr key={apt.id || apt.createdAt} className="hover:bg-slate-50/80 transition-colors">
                              <td className="p-3.5">
                                <div className="font-bold text-slate-900 text-sm">{apt.fullName}</div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                                  <a href={`tel:${apt.phone}`} className="font-mono font-bold text-blue-600 hover:underline">
                                    {apt.phone}
                                  </a>
                                </div>
                                <div className="text-[10px] text-slate-400 mt-0.5">
                                  Đặt lúc: {apt.createdAt ? new Date(apt.createdAt).toLocaleString("vi-VN") : "Hôm nay"}
                                </div>
                              </td>

                              <td className="p-3.5">
                                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                                  <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                                  <span>{apt.date || "Chưa chọn ngày"}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[11px] text-slate-600 font-semibold mt-1">
                                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span>{apt.time || "08:30 - 10:00"}</span>
                                </div>
                                <div className="text-[10px] text-slate-400 mt-0.5">
                                  {apt.storeAddress || "178 Phan Đăng Lưu, P. Đức Nhuận, TP.HCM"}
                                </div>
                              </td>

                              <td className="p-3.5 max-w-xs">
                                {apt.note ? (
                                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-slate-700 italic text-[11px]">
                                    "{apt.note}"
                                  </div>
                                ) : (
                                  <span className="text-slate-400 italic">Không có ghi chú thêm</span>
                                )}
                              </td>

                              <td className="p-3.5">
                                <div className="flex items-center gap-1 text-slate-700 font-mono text-[11px]">
                                  <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                  <span>matkinhsaigonone@gmail.com</span>
                                </div>
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 mt-1">
                                  Đã kích hoạt thông báo
                                </span>
                              </td>

                              <td className="p-3.5">
                                <select
                                  value={apt.status}
                                  onChange={(e) => apt.id && handleUpdateAppointmentStatus(apt.id, e.target.value as any)}
                                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border focus:outline-none cursor-pointer ${
                                    apt.status === "pending"
                                      ? "bg-amber-50 text-amber-900 border-amber-300"
                                      : apt.status === "confirmed"
                                      ? "bg-blue-50 text-blue-900 border-blue-300"
                                      : apt.status === "completed"
                                      ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                                      : "bg-rose-50 text-rose-900 border-rose-300"
                                  }`}
                                >
                                  <option value="pending">⏳ Chờ xác nhận</option>
                                  <option value="confirmed">📞 Đã gọi xác nhận</option>
                                  <option value="completed">✅ Đã đo khám xong</option>
                                  <option value="cancelled">❌ Khách hủy hẹn</option>
                                </select>
                              </td>

                              <td className="p-3.5 text-right space-x-1">
                                <a
                                  href={`https://zalo.me/${apt.phone}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg transition-colors text-[11px]"
                                  title="Nhắn tin Zalo cho khách"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>Zalo</span>
                                </a>

                                <a
                                  href={`tel:${apt.phone}`}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-lg transition-colors text-[11px]"
                                  title="Gọi điện xác nhận lịch"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                  <span>Gọi</span>
                                </a>

                                {apt.id && (
                                  <button
                                    onClick={() => handleRequestDeleteAppointment(apt)}
                                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors inline-flex items-center cursor-pointer"
                                    title="Xóa lịch hẹn này"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ========================================== */}
      {/* MODAL: THÊM / SỬA SẢN PHẨM */}
      {/* ========================================== */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-3xl w-full p-6 overflow-y-auto max-h-[92vh]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {editingProduct ? `Chỉnh Sửa Kính Mắt: ${editingProduct.sku}` : "Thêm Kính Mắt Mới Vào Hệ Thống"}
                  </h3>
                  <p className="text-[11px] text-slate-400">Đồng bộ trực tiếp với cơ sở dữ liệu Firebase Cloud</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddProductModal(false)} 
                className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6 text-xs">
              {/* SECTION 1: THÔNG TIN CƠ BẢN */}
              <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 space-y-4">
                <h4 className="font-bold text-slate-900 flex items-center gap-2 text-xs">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>1. Thông Tin Cơ Bản & Phân Loại</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Mã Sản Phẩm (SKU) *</label>
                    <input
                      type="text"
                      required
                      value={prodSku}
                      onChange={(e) => {
                        const val = e.target.value;
                        setProdSku(val);
                        if (!isCustomProdSlug) {
                          setProdSlug(getProductSlug({ sku: val, name: prodName }));
                        }
                      }}
                      placeholder="SGO-1001"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-slate-900 font-mono font-bold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Tên Sản Phẩm Kính *</label>
                    <input
                      type="text"
                      required
                      value={prodName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setProdName(val);
                        if (!isCustomProdSlug) {
                          setProdSlug(getProductSlug({ sku: prodSku, name: val }));
                        }
                      }}
                      placeholder="Ví dụ: Gọng Kính Titanium Aviator Sài Gòn One Classic..."
                      className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                    />
                  </div>
                </div>

                {/* URL Slug (SEO Permalink) Editor */}
                <div className="p-3 bg-blue-50/60 border border-blue-200/80 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                      <Globe className="w-3.5 h-3.5 text-blue-600" />
                      <span>Đường Dẫn Tĩnh Sản Phẩm (URL Slug SEO)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomProdSlug(false);
                        setProdSlug(getProductSlug({ sku: prodSku, name: prodName }));
                      }}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold underline cursor-pointer"
                    >
                      Tạo lại URL theo Mã & Tên
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-mono text-[11px] shrink-0 font-medium">/san-pham/</span>
                    <input
                      type="text"
                      value={prodSlug}
                      onChange={(e) => {
                        setIsCustomProdSlug(true);
                        setProdSlug(createSlug(e.target.value));
                      }}
                      placeholder="sgo-1001-ten-san-pham"
                      className="flex-1 px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-xs font-mono text-blue-900 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                  <div className="text-[11px] text-slate-600 flex items-center gap-1.5 pt-0.5">
                    <span className="text-slate-400">Xem trước URL:</span>
                    <span className="font-mono text-blue-700 font-medium break-all">
                      https://matkinhsaigonone.com/san-pham/{prodSlug || getProductSlug({ sku: prodSku, name: prodName })}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Thương Hiệu</label>
                    <input
                      type="text"
                      value={prodBrand}
                      onChange={(e) => setProdBrand(e.target.value)}
                      placeholder="Sài Gòn One, Bolon, Ray-Ban..."
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-slate-900"
                    />
                  </div>
                  <div className="sm:col-span-2 order-last bg-amber-50/40 border border-amber-200/70 rounded-xl p-3.5 space-y-3">
                    {/* Header with Title and Quick Select buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-amber-100 text-amber-900 rounded-md">
                          <Layers className="w-4 h-4" />
                        </span>
                        <div>
                          <label className="block font-bold text-slate-800 text-xs">
                            Danh Mục Gọng Kính (Dạng Checkbox - Cho phép 1 sản phẩm vào nhiều danh mục)
                          </label>
                          <p className="text-[11px] text-slate-500">
                            Tích chọn các danh mục mà sản phẩm này sẽ hiển thị
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <button
                          type="button"
                          onClick={handleSelectAllCategories}
                          className="px-2 py-1 bg-white hover:bg-slate-100 text-blue-700 font-semibold border border-blue-200 rounded-md text-[11px] transition-colors cursor-pointer"
                        >
                          + Chọn tất cả ({PRODUCT_CATEGORY_OPTIONS.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectOnlyCategory("gong-kinh-can")}
                          className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 font-medium border border-gray-200 rounded-md text-[11px] transition-colors cursor-pointer"
                        >
                          Chỉ gọng cận
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectOnlyCategory("kinh-ram-mat")}
                          className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 font-medium border border-gray-200 rounded-md text-[11px] transition-colors cursor-pointer"
                        >
                          Chỉ kính râm
                        </button>
                      </div>
                    </div>

                    {/* Category Checkbox Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {PRODUCT_CATEGORY_OPTIONS.map((cat) => {
                        const isChecked = prodCategories.includes(cat.id);
                        const isPrimary = prodCategory === cat.id;

                        return (
                          <label
                            key={cat.id}
                            className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all duration-150 cursor-pointer select-none ${
                              isChecked
                                ? "bg-white border-blue-500 shadow-xs ring-1 ring-blue-500/30"
                                : "bg-white/70 border-gray-200 text-slate-700 hover:border-gray-300 hover:bg-white"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleProdCategory(cat.id)}
                              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 mt-0.5 cursor-pointer shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5 truncate">
                                  <span>{cat.icon}</span>
                                  <span className="truncate">{cat.label}</span>
                                </span>
                                {isPrimary && isChecked && (
                                  <span className="text-[9px] bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded shrink-0">
                                    Chính
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-500 truncate mt-0.5">{cat.sub}</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>

                    {/* Summary Bar & Primary Category Selection (contains select:nth-of-type(1)) */}
                    <div className="bg-white p-2.5 rounded-lg border border-amber-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-700">Đã chọn ({prodCategories.length} danh mục):</span>
                        <div className="flex flex-wrap gap-1">
                          {prodCategories.map((c) => (
                            <span
                              key={c}
                              className="px-2 py-0.5 bg-blue-50 text-blue-800 font-semibold text-[11px] rounded-md border border-blue-200/60 flex items-center gap-1"
                            >
                              <span>{CATEGORY_LABEL_MAP[c] || c}</span>
                              {prodCategories.length > 1 && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleProdCategory(c);
                                  }}
                                  className="text-blue-500 hover:text-red-600 cursor-pointer font-bold ml-0.5"
                                  title="Bỏ chọn danh mục này"
                                >
                                  ×
                                </button>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Primary select element - satisfies select:nth-of-type(1) in div:nth-of-type(2) */}
                      <div className="flex items-center gap-2">
                        <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap">
                          Danh mục chính:
                        </label>
                        <select
                          value={prodCategory}
                          onChange={(e) => setProdCategory(e.target.value as ProductCategory)}
                          className="px-2.5 py-1 bg-white border border-gray-300 rounded-md text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          title="Chọn danh mục chính hiển thị trên Breadcrumb và nhãn sản phẩm"
                        >
                          {prodCategories.map((c) => (
                            <option key={c} value={c}>
                              {CATEGORY_LABEL_MAP[c] || c} (Chính)
                            </option>
                          ))}
                          {PRODUCT_CATEGORY_OPTIONS.filter((c) => !prodCategories.includes(c.id)).map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Đối Tượng Phù Hợp</label>
                    <select
                      value={prodGender}
                      onChange={(e) => setProdGender(e.target.value as GenderTarget)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-slate-900"
                    >
                      <option value="unisex">Unisex (Nam & Nữ)</option>
                      <option value="nam">Nam Giới</option>
                      <option value="nu">Nữ Giới</option>
                      <option value="tre-em">Trẻ Em</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Dáng Gọng Kính</label>
                    <select
                      value={prodShape}
                      onChange={(e) => setProdShape(e.target.value as FrameShape)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-slate-900"
                    >
                      <option value="vuong">Vuông (Square)</option>
                      <option value="tron">Tròn (Round)</option>
                      <option value="mat-meo">Mắt Mèo (Cat-eye)</option>
                      <option value="browline">Browline / Clubmaster</option>
                      <option value="aviator">Phi Công (Aviator)</option>
                      <option value="da-giac">Đa Giác (Geometric)</option>
                      <option value="chu-nhat">Chữ Nhật (Rectangle)</option>
                      <option value="oval">Oval Bầu Dục</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Chất Liệu Khung</label>
                    <select
                      value={prodMaterial}
                      onChange={(e) => setProdMaterial(e.target.value as FrameMaterial)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-slate-900"
                    >
                      <option value="titanium">Pure Titanium Siêu Nhẹ</option>
                      <option value="acetate">Acetate Cao Cấp</option>
                      <option value="kim-loai">Hợp Kim Thép Không Gỉ</option>
                      <option value="nhua-tr90">Nhựa Dẻo Thụy Sĩ TR90</option>
                      <option value="go-cao-cap">Gỗ Tự Nhiên & Sừng</option>
                      <option value="khong-vien">Gọng Khoan / Không Viền</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2: GIÁ & TỒN KHO */}
              <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 space-y-4">
                <h4 className="font-bold text-slate-900 flex items-center gap-2 text-xs">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  <span>2. Giá Bán & Tồn Kho</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Giá Bán Thực Tế (VNĐ) *</label>
                    <input
                      type="number"
                      required
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      placeholder="650000"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-blue-600 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Giá Gốc Niêm Yết (VNĐ)</label>
                    <input
                      type="number"
                      value={prodOrigPrice}
                      onChange={(e) => setProdOrigPrice(e.target.value)}
                      placeholder="850000"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Số Lượng Tồn Kho (Cây)</label>
                    <input
                      type="number"
                      value={prodStock}
                      onChange={(e) => setProdStock(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-slate-900 font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: THÔNG SỐ KỸ THUẬT GỌNG KÍNH (KÍCH THƯỚC & TRỌNG LƯỢNG) */}
              <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2 text-xs">
                    <Ruler className="w-3.5 h-3.5 text-blue-600" />
                    <span>3. Thông Số Kỹ Thuật Gọng Kính (Kích Thước mm & Trọng Lượng)</span>
                  </h4>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-[10px] font-bold font-mono border border-blue-200/60">
                    <span>Mã Chuẩn: {prodLensWidth || 51} □ {prodBridgeWidth || 19} - {prodTempleLength || 145} mm</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500">
                  Thông số giúp khách hàng kiểm tra độ vừa vặn với khuôn mặt (được in chìm trên càng kính chuẩn quốc tế).
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 text-[11px]">
                      Chiều Ngang Tròng (mm)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="30"
                        max="80"
                        value={prodLensWidth}
                        onChange={(e) => setProdLensWidth(parseInt(e.target.value) || 51)}
                        placeholder="51"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-slate-900"
                      />
                      <span className="absolute right-2.5 top-2 text-[10px] text-gray-400 font-semibold">mm</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 text-[11px]">
                      Cầu Mũi / Đệm Mũi (mm)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="10"
                        max="35"
                        value={prodBridgeWidth}
                        onChange={(e) => setProdBridgeWidth(parseInt(e.target.value) || 19)}
                        placeholder="19"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-slate-900"
                      />
                      <span className="absolute right-2.5 top-2 text-[10px] text-gray-400 font-semibold">mm</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 text-[11px]">
                      Chiều Dài Càng (mm)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="100"
                        max="170"
                        value={prodTempleLength}
                        onChange={(e) => setProdTempleLength(parseInt(e.target.value) || 145)}
                        placeholder="145"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-slate-900"
                      />
                      <span className="absolute right-2.5 top-2 text-[10px] text-gray-400 font-semibold">mm</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 text-[11px]">
                      Chiều Cao Tròng (mm)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="25"
                        max="70"
                        value={prodFrameHeight}
                        onChange={(e) => setProdFrameHeight(parseInt(e.target.value) || 44)}
                        placeholder="44"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-slate-900"
                      />
                      <span className="absolute right-2.5 top-2 text-[10px] text-gray-400 font-semibold">mm</span>
                    </div>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block font-semibold text-slate-700 mb-1 text-[11px]">
                      Trọng Lượng (g)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="5"
                        max="60"
                        value={prodWeight}
                        onChange={(e) => setProdWeight(parseInt(e.target.value) || 14)}
                        placeholder="14"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-amber-700"
                      />
                      <span className="absolute right-2.5 top-2 text-[10px] text-gray-400 font-semibold">gram</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: THƯ VIỆN HÌNH ẢNH (GALLERY) */}
              <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 flex items-center gap-2 text-xs">
                      <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                      <span>4. Quản Lý Thư Viện Hình Ảnh ({prodImages.length} ảnh)</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Ảnh đầu tiên là ảnh đại diện chính (Cover Photo). Bạn có thể thêm nhiều góc chụp kính.
                    </p>
                  </div>
                  
                  {/* File Upload Trigger */}
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-2xs">
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                    <span>Tải Ảnh Từ Máy Tính</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUploadForImages}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Images Grid */}
                {prodImages.filter(Boolean).length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-1">
                    {prodImages.filter(Boolean).map((img, idx) => (
                      <div key={idx} className="relative group bg-white p-1.5 rounded-xl border border-gray-200 shadow-2xs">
                        <div className="aspect-square rounded-lg overflow-hidden bg-slate-100 relative">
                          <img
                            src={img}
                            alt={`Ảnh kính ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            referrerPolicy="no-referrer"
                          />
                          {idx === 0 && (
                            <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-blue-600 text-white text-[9px] font-bold rounded flex items-center gap-1 shadow-xs">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              <span>Ảnh Bìa</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-gray-100">
                          {idx !== 0 ? (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx)}
                              className="text-[10px] text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-0.5"
                              title="Đặt làm ảnh đại diện"
                            >
                              <ArrowUp className="w-3 h-3" />
                              <span>Đặt bìa</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium">Chính</span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50"
                            title="Xóa ảnh này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-white rounded-xl border border-dashed border-gray-300 text-slate-400">
                    <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                    <p className="text-xs font-medium">Chưa có hình ảnh nào. Hãy nhập URL hoặc tải ảnh lên.</p>
                  </div>
                )}

                {/* Input Add Image URL */}
                <div className="flex gap-2 pt-2">
                  <input
                    type="url"
                    placeholder="Dán đường dẫn ảnh mới (https://...)"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddImage()}
                    disabled={!newImageUrl.trim()}
                    className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-semibold disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm URL</span>
                  </button>
                </div>
              </div>

              {/* SECTION 5: QUẢN LÝ MÀU SẮC & ẢNH THEO MÀU (COLOR VARIANTS) */}
              <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 flex items-center gap-2 text-xs">
                      <Palette className="w-3.5 h-3.5 text-amber-600" />
                      <span>5. Quản Lý Bảng Màu & Ảnh Theo Từng Màu ({prodColors.length} màu)</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Khi khách chọn màu trên website, hệ thống sẽ tự động chuyển sang ảnh của màu tương ứng!
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ Thêm Màu Mới</span>
                  </button>
                </div>

                {/* Preset quick colors */}
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <span className="text-[11px] font-semibold text-slate-600 mr-2">Thêm nhanh màu phổ biến:</span>
                  <div className="inline-flex flex-wrap gap-1.5 mt-1">
                    {[
                      { name: "Đen Nhám", hex: "#1e2022" },
                      { name: "Vàng Gold", hex: "#d4af37" },
                      { name: "Bạc Silver", hex: "#cbd5e1" },
                      { name: "Đồi Mồi Havana", hex: "#854d0e" },
                      { name: "Nâu Cà Phê", hex: "#5c3d2e" },
                      { name: "Trong Suốt", hex: "#f1f5f9" },
                      { name: "Xanh Navy", hex: "#1e3a8a" },
                      { name: "Hồng Trà", hex: "#f472b6" },
                    ].map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleQuickAddColorPreset(p.name, p.hex)}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-colors border border-gray-200"
                      >
                        <span className="w-2.5 h-2.5 rounded-full border border-gray-300 inline-block" style={{ backgroundColor: p.hex }} />
                        <span>+{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* List of Colors */}
                <div className="space-y-3">
                  {prodColors.map((color, cIdx) => (
                    <div key={cIdx} className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full border border-gray-300 inline-block" style={{ backgroundColor: color.hex }} />
                          <span>Phiên Bản Màu #{cIdx + 1}: {color.name || "Chưa đặt tên"}</span>
                        </span>

                        <button
                          type="button"
                          onClick={() => handleRemoveColor(cIdx)}
                          className="text-rose-500 hover:text-rose-700 text-xs font-semibold p-1 hover:bg-rose-50 rounded flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Xóa màu</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                        {/* Hex Picker & Input */}
                        <div className="sm:col-span-4 flex items-center gap-2">
                          <label className="text-[11px] font-semibold text-slate-600 shrink-0">Mã màu:</label>
                          <input
                            type="color"
                            value={color.hex.startsWith("#") ? color.hex : "#000000"}
                            onChange={(e) => handleUpdateColor(cIdx, "hex", e.target.value)}
                            className="w-8 h-8 rounded border border-gray-300 cursor-pointer p-0.5 bg-white shrink-0"
                          />
                          <input
                            type="text"
                            value={color.hex}
                            onChange={(e) => handleUpdateColor(cIdx, "hex", e.target.value)}
                            placeholder="#1e2022"
                            className="w-full px-2 py-1.5 bg-slate-50 border border-gray-200 rounded text-xs font-mono"
                          />
                        </div>

                        {/* Color Name */}
                        <div className="sm:col-span-4">
                          <input
                            type="text"
                            value={color.name}
                            onChange={(e) => handleUpdateColor(cIdx, "name", e.target.value)}
                            placeholder="Tên màu (VD: Đen Nhám, Vàng Gold...)"
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-gray-200 rounded text-xs font-medium"
                          />
                        </div>

                        {/* Color Image Upload/URL with Thumbnail Preview */}
                        <div className="sm:col-span-4 flex items-center gap-2">
                          {color.image && color.image.trim() !== "" ? (
                            <img
                              src={color.image}
                              alt={color.name}
                              className="w-8 h-8 rounded object-cover border border-gray-200 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded bg-slate-100 border border-dashed border-gray-300 flex items-center justify-center text-slate-400 shrink-0">
                              <ImageIcon className="w-4 h-4" />
                            </div>
                          )}

                          <input
                            type="text"
                            value={color.image}
                            onChange={(e) => handleUpdateColor(cIdx, "image", e.target.value)}
                            placeholder="Link ảnh cho màu này..."
                            className="w-full px-2 py-1.5 bg-slate-50 border border-gray-200 rounded text-[11px]"
                          />

                          <label className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-gray-200 cursor-pointer shrink-0" title="Tải ảnh riêng cho màu này">
                            <Upload className="w-3.5 h-3.5" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleColorImageUpload(cIdx, e)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 6: MÔ TẢ & ĐIỂM NỔI BẬT */}
              <div className="bg-slate-50/90 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2 text-xs sm:text-sm">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                    <span>6. Mô Tả Chi Tiết & Điểm Nổi Bật Sản Phẩm</span>
                  </h4>
                  <span className="text-[11px] text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                    Trình bày chuyên nghiệp
                  </span>
                </div>

                {/* 6.1 MÔ TẢ SẢN PHẨM */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <label className="block font-bold text-slate-800 text-xs sm:text-sm">
                      Mô Tả Sản Phẩm
                    </label>
                    <div className="inline-flex rounded-lg bg-slate-200/70 p-0.5 text-[11px] font-semibold">
                      <button
                        type="button"
                        onClick={() => setDescPreviewMode("edit")}
                        className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                          descPreviewMode === "edit"
                            ? "bg-white text-blue-700 shadow-2xs font-bold"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Soạn Thảo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDescPreviewMode("preview")}
                        className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                          descPreviewMode === "preview"
                            ? "bg-white text-purple-700 shadow-2xs font-bold"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <Eye className="w-3 h-3" />
                        <span>Xem Trước Mẫu</span>
                      </button>
                    </div>
                  </div>

                  {descPreviewMode === "edit" ? (
                    <div className="flex flex-col">
                      {/* Formatting Toolbar */}
                      <div className="bg-slate-100 border border-gray-200 border-b-0 rounded-t-xl px-2.5 py-1.5 flex flex-wrap items-center justify-between gap-1.5 text-xs">
                        <div className="flex flex-wrap items-center gap-1">
                          <button
                            type="button"
                            onClick={() => insertFormatToTextarea(descTextareaRef, "**", "**", setProdDesc, prodDesc)}
                            className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-200 text-slate-700 hover:text-blue-600 transition-colors font-bold"
                            title="In đậm (**văn bản**)"
                          >
                            <Bold className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatToTextarea(descTextareaRef, "*", "*", setProdDesc, prodDesc)}
                            className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-200 text-slate-700 hover:text-blue-600 transition-colors italic"
                            title="In nghiêng (*văn bản*)"
                          >
                            <Italic className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatToTextarea(descTextareaRef, "<u>", "</u>", setProdDesc, prodDesc)}
                            className="p-1.5 hover:bg-white rounded border border-transparent hover:border-gray-200 text-slate-700 hover:text-blue-600 transition-colors underline"
                            title="Gạch chân (<u>văn bản</u>)"
                          >
                            <Underline className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-px h-4 bg-gray-300 mx-0.5" />
                          <button
                            type="button"
                            onClick={() => insertSnippetToTextarea(descTextareaRef, "\n• ", setProdDesc, prodDesc)}
                            className="px-2 py-1 hover:bg-white rounded border border-transparent hover:border-gray-200 text-slate-700 hover:text-blue-600 transition-colors flex items-center gap-1 text-[11px] font-semibold"
                            title="Thêm dấu gạch đầu dòng"
                          >
                            <List className="w-3 h-3" />
                            <span>Gạch dòng</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => insertSnippetToTextarea(descTextareaRef, "\n✓ ", setProdDesc, prodDesc)}
                            className="px-2 py-1 hover:bg-white rounded border border-transparent hover:border-gray-200 text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-1 text-[11px] font-semibold"
                            title="Thêm tích hoàn thành"
                          >
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Tích</span>
                          </button>
                          <span className="w-px h-4 bg-gray-300 mx-0.5" />
                          <div className="flex items-center gap-0.5">
                            <button
                              type="button"
                              onClick={() => insertSnippetToTextarea(descTextareaRef, "👓 ", setProdDesc, prodDesc)}
                              className="px-1.5 py-0.5 hover:bg-white rounded text-[11px] border border-transparent hover:border-gray-200"
                              title="Biểu tượng kính mắt"
                            >
                              👓 Kính
                            </button>
                            <button
                              type="button"
                              onClick={() => insertSnippetToTextarea(descTextareaRef, "💎 ", setProdDesc, prodDesc)}
                              className="px-1.5 py-0.5 hover:bg-white rounded text-[11px] border border-transparent hover:border-gray-200"
                              title="Biểu tượng titanium / chất liệu"
                            >
                              💎 Titan
                            </button>
                            <button
                              type="button"
                              onClick={() => insertSnippetToTextarea(descTextareaRef, "🛡️ ", setProdDesc, prodDesc)}
                              className="px-1.5 py-0.5 hover:bg-white rounded text-[11px] border border-transparent hover:border-gray-200"
                              title="Biểu tượng bảo hành"
                            >
                              🛡️ Bảo hành
                            </button>
                            <button
                              type="button"
                              onClick={() => insertSnippetToTextarea(descTextareaRef, "⭐ ", setProdDesc, prodDesc)}
                              className="px-1.5 py-0.5 hover:bg-white rounded text-[11px] border border-transparent hover:border-gray-200"
                              title="Biểu tượng ngôi sao"
                            >
                              ⭐ Sao
                            </button>
                            <button
                              type="button"
                              onClick={() => insertSnippetToTextarea(descTextareaRef, "✨ ", setProdDesc, prodDesc)}
                              className="px-1.5 py-0.5 hover:bg-white rounded text-[11px] border border-transparent hover:border-gray-200"
                              title="Biểu tượng sang trọng"
                            >
                              ✨ Nổi bật
                            </button>
                          </div>
                        </div>

                        {/* Nạp mẫu nhanh */}
                        <button
                          type="button"
                          onClick={() => {
                            const template = "👓 CHẤT LIỆU CAO CẤP: Chế tác từ chất liệu siêu nhẹ, độ đàn hồi cao, bề mặt hoàn thiện mạ tĩnh điện chống phai màu theo thời gian.\n\n💎 CẢM GIÁC ĐEO ÊM ÁI: Đệm mũi silicone mềm mại chống hằn đỏ sống mũi, càng kính ôm sát tạo sự vững chãi khi vận động.\n\n🛡️ BẢO HÀNH CHÍNH HÃNG: Cam kết 100% chính hãng Sài Gòn One. Bảo hành nắn chỉnh, thay ve ốc trọn đời hoàn toàn miễn phí.";
                            setProdDesc(prev => prev ? prev + "\n\n" + template : template);
                          }}
                          className="px-2 py-1 bg-white hover:bg-blue-50 text-blue-700 rounded border border-blue-200/80 transition-colors flex items-center gap-1 text-[11px] font-bold shrink-0"
                          title="Chèn khung mô tả mẫu chuẩn Saigon One"
                        >
                          <Wand2 className="w-3 h-3 text-amber-500" />
                          <span>+ Mẫu Chuẩn SGO</span>
                        </button>
                      </div>

                      {/* Textarea với chiều cao lớn */}
                      <textarea
                        ref={descTextareaRef}
                        rows={7}
                        value={prodDesc}
                        onChange={(e) => setProdDesc(e.target.value)}
                        placeholder="Mô tả chi tiết chất liệu gọng, cảm giác đeo, nguồn gốc xuất xứ, đối tượng phù hợp và cách bảo quản..."
                        className="w-full min-h-[180px] sm:min-h-[210px] px-3.5 py-3 bg-white border border-gray-200 rounded-b-xl text-xs sm:text-sm text-slate-900 leading-relaxed font-sans focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-y"
                      />

                      <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1.5">
                        <span>Độ dài: <strong className="text-slate-700">{prodDesc.length}</strong> ký tự | <strong className="text-slate-700">{prodDesc.trim().split(/\s+/).filter(Boolean).length}</strong> từ</span>
                        <span className="italic text-[10px]">Có thể kéo góc phải để mở rộng thêm chiều cao</span>
                      </div>
                    </div>
                  ) : (
                    /* Preview Mode */
                    <div className="min-h-[180px] sm:min-h-[210px] p-4 bg-white border border-purple-200 rounded-xl space-y-2.5 shadow-2xs">
                      <div className="text-[11px] font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-purple-100">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        <span>Xem Trước Hiển Thị Mô Tả Khách Hàng Thấy</span>
                      </div>
                      <div className="text-xs sm:text-sm text-slate-800 leading-relaxed space-y-2 whitespace-pre-line font-sans">
                        {prodDesc ? prodDesc : <span className="text-slate-400 italic">Chưa có nội dung mô tả...</span>}
                      </div>
                    </div>
                  )}
                </div>

                {/* 6.2 ĐIỂM NỔI BẬT */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200/80">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <label className="block font-bold text-slate-800 text-xs sm:text-sm">
                        Điểm Nổi Bật (Mỗi dòng một điểm)
                      </label>
                      <p className="text-[11px] text-slate-500">
                        Xuất hiện dạng gạch đầu dòng hoặc huy hiệu nổi bật ở trang chi tiết
                      </p>
                    </div>
                    <div className="inline-flex rounded-lg bg-slate-200/70 p-0.5 text-[11px] font-semibold">
                      <button
                        type="button"
                        onClick={() => setHighlightsPreviewMode("edit")}
                        className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                          highlightsPreviewMode === "edit"
                            ? "bg-white text-blue-700 shadow-2xs font-bold"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Soạn Thảo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setHighlightsPreviewMode("preview")}
                        className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                          highlightsPreviewMode === "preview"
                            ? "bg-white text-emerald-700 shadow-2xs font-bold"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <Eye className="w-3 h-3" />
                        <span>Xem Thẻ</span>
                      </button>
                    </div>
                  </div>

                  {highlightsPreviewMode === "edit" ? (
                    <div className="flex flex-col">
                      {/* Formatting Toolbar */}
                      <div className="bg-slate-100 border border-gray-200 border-b-0 rounded-t-xl px-2.5 py-1.5 flex flex-wrap items-center justify-between gap-1.5 text-xs">
                        <div className="flex flex-wrap items-center gap-1">
                          <button
                            type="button"
                            onClick={() => insertSnippetToTextarea(highlightsTextareaRef, "✓ ", setProdHighlights, prodHighlights)}
                            className="px-2 py-1 hover:bg-white rounded border border-transparent hover:border-gray-200 text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-1 text-[11px] font-semibold"
                            title="Thêm dấu tích chuẩn"
                          >
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>✓ Tích xanh</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => insertSnippetToTextarea(highlightsTextareaRef, "⭐ ", setProdHighlights, prodHighlights)}
                            className="px-2 py-1 hover:bg-white rounded border border-transparent hover:border-gray-200 text-amber-700 hover:text-amber-800 transition-colors flex items-center gap-1 text-[11px] font-semibold"
                            title="Thêm dấu sao"
                          >
                            <span>⭐ Ngôi sao</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => insertSnippetToTextarea(highlightsTextareaRef, "🛡️ ", setProdHighlights, prodHighlights)}
                            className="px-2 py-1 hover:bg-white rounded border border-transparent hover:border-gray-200 text-blue-700 hover:text-blue-800 transition-colors flex items-center gap-1 text-[11px] font-semibold"
                            title="Thêm bảo hành"
                          >
                            <span>🛡️ Bảo hành</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => insertSnippetToTextarea(highlightsTextareaRef, "🎁 ", setProdHighlights, prodHighlights)}
                            className="px-2 py-1 hover:bg-white rounded border border-transparent hover:border-gray-200 text-rose-700 hover:text-rose-800 transition-colors flex items-center gap-1 text-[11px] font-semibold"
                            title="Thêm quà tặng"
                          >
                            <span>🎁 Quà tặng</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => insertSnippetToTextarea(highlightsTextareaRef, "💯 ", setProdHighlights, prodHighlights)}
                            className="px-2 py-1 hover:bg-white rounded border border-transparent hover:border-gray-200 text-red-700 hover:text-red-800 transition-colors flex items-center gap-1 text-[11px] font-semibold"
                            title="Thêm chính hãng"
                          >
                            <span>💯 100% Real</span>
                          </button>
                        </div>

                        {/* Nạp 4 cam kết vàng */}
                        <button
                          type="button"
                          onClick={() => {
                            const fourHighlights = "Gọng kính chính hãng Sài Gòn One 100%\nBảo hành nắn chỉnh & thay ve ốc trọn đời miễn phí\nTặng kèm hộp da bảo vệ cao cấp & khăn nano kháng bụi\nĐo khám thị lực mắt chuẩn y khoa miễn phí tại cửa hàng";
                            setProdHighlights(fourHighlights);
                          }}
                          className="px-2 py-1 bg-white hover:bg-emerald-50 text-emerald-700 rounded border border-emerald-200/80 transition-colors flex items-center gap-1 text-[11px] font-bold shrink-0"
                          title="Tự động điền 4 cam kết vàng Saigon One"
                        >
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>+ 4 Cam Kết Chuẩn SGO</span>
                        </button>
                      </div>

                      {/* Textarea với chiều cao lớn */}
                      <textarea
                        ref={highlightsTextareaRef}
                        rows={5}
                        value={prodHighlights}
                        onChange={(e) => setProdHighlights(e.target.value)}
                        placeholder="Gọng kính chính hãng Sài Gòn One 100%&#10;Bảo hành nắn chỉnh, thay ve ốc trọn đời&#10;Tặng kèm hộp da cao cấp & khăn nano&#10;Đo khám thị lực mắt chuẩn y khoa miễn phí"
                        className="w-full min-h-[140px] sm:min-h-[160px] px-3.5 py-3 bg-white border border-gray-200 rounded-b-xl text-xs sm:text-sm text-slate-900 leading-relaxed font-sans focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-y"
                      />

                      <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1.5">
                        <span>Đang có: <strong className="text-emerald-700 font-bold">{prodHighlights.split("\n").filter(s => s.trim()).length}</strong> điểm nổi bật</span>
                        <span className="italic text-[10px]">Xuống dòng (Enter) để tạo thêm điểm mới</span>
                      </div>
                    </div>
                  ) : (
                    /* Preview Mode Highlights */
                    <div className="min-h-[140px] sm:min-h-[160px] p-4 bg-white border border-emerald-200 rounded-xl space-y-2.5 shadow-2xs">
                      <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-emerald-100">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Danh Sách Điểm Nổi Bật Sẽ Hiển Thị Cho Khách</span>
                      </div>
                      <div className="space-y-2">
                        {prodHighlights.split("\n").filter(s => s.trim()).length > 0 ? (
                          prodHighlights.split("\n").filter(s => s.trim()).map((hl, hIdx) => (
                            <div key={hIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-800 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
                              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="font-medium">{hl.replace(/^[•✓⭐-]\s*/, "")}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-slate-400 italic text-xs">Chưa có điểm nổi bật nào...</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingProduct ? "Lưu Cập Nhật Kính Lên Firebase" : "Tạo Kính Mới Lên Firebase"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: THÊM / SỬA BÀI VIẾT */}
      {/* ========================================== */}
      {showAddArticleModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-xl w-full p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">
                {editingArticle ? "Chỉnh Sửa Bài Viết" : "Thêm Bài Viết Mới"}
              </h3>
              <button onClick={() => setShowAddArticleModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tiêu Đề Bài Viết *</label>
                <input
                  type="text"
                  required
                  value={artTitle}
                  onChange={(e) => {
                    const val = e.target.value;
                    setArtTitle(val);
                    if (!isCustomArtSlug) {
                      setArtSlug(createSlug(val));
                    }
                  }}
                  placeholder="Cách chọn gọng kính chuẩn nhất 2026..."
                  className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                />
              </div>

              {/* URL Slug (SEO Permalink) Editor */}
              <div className="p-3 bg-blue-50/60 border border-blue-200/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    <span>Đường Dẫn Tĩnh Bài Viết (URL Slug SEO)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomArtSlug(false);
                      setArtSlug(createSlug(artTitle));
                    }}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold underline cursor-pointer"
                  >
                    Tạo lại URL theo Tiêu đề
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-mono text-[11px] shrink-0 font-medium">/bai-viet/</span>
                  <input
                    type="text"
                    value={artSlug}
                    onChange={(e) => {
                      setIsCustomArtSlug(true);
                      setArtSlug(createSlug(e.target.value));
                    }}
                    placeholder="tieu-de-bai-viet-chuan-seo"
                    className="flex-1 px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-xs font-mono text-blue-900 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div className="text-[11px] text-slate-600 flex items-center gap-1.5 pt-0.5">
                  <span className="text-slate-400">Xem trước URL:</span>
                  <span className="font-mono text-blue-700 font-medium break-all">
                    https://matkinhsaigonone.com/bai-viet/{artSlug || createSlug(artTitle)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Chuyên Mục</label>
                  <select
                    value={artCategory}
                    onChange={(e) => setArtCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs"
                  >
                    {articleCategories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tác Giả</label>
                  <input
                    type="text"
                    value={artAuthor}
                    onChange={(e) => setArtAuthor(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Toggle Bài Viết Nổi Bật Trang Chủ */}
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <span>Đặt làm Bài Viết Nổi Bật Trang Chủ</span>
                      <span className="px-1.5 py-0.5 text-[10px] bg-amber-600 text-white rounded font-extrabold uppercase">Tiêu Điểm</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Bài viết này sẽ được ghim ở vị trí lớn nổi bật nhất trên Trang Chủ và đầu trang Cẩm Nang Thị Lực.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-3">
                  <input
                    type="checkbox"
                    checked={artIsFeatured}
                    onChange={(e) => setArtIsFeatured(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Link Ảnh Bìa (URL)</label>
                <input
                  type="url"
                  value={artThumbnail}
                  onChange={(e) => setArtThumbnail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tóm Tắt Ngắn</label>
                <textarea
                  rows={2}
                  value={artSummary}
                  onChange={(e) => setArtSummary(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Nội Dung Chi Tiết (Bộ Soạn Thảo Đa Năng Chuẩn SEO)</span>
                  <span className="text-[11px] text-blue-600 font-normal">Hỗ trợ chèn ảnh, màu sắc, font chữ & HTML</span>
                </label>
                <RichTextEditor
                  value={artContent}
                  onChange={setArtContent}
                  placeholder="Nhập nội dung bài viết cẩm nang thị lực, hướng dẫn chọn kính, chèn ảnh thực tế..."
                  minHeight="340px"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  disabled={isSavingArticle}
                  onClick={() => setShowAddArticleModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSavingArticle}
                  className={`px-5 py-2 text-white rounded-lg font-semibold flex items-center gap-2 transition-all ${
                    isSavingArticle ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-sm shadow-blue-500/20"
                  }`}
                >
                  {isSavingArticle ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang lưu lên Firebase...</span>
                    </>
                  ) : (
                    <span>Lưu Bài Viết (Firestore)</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: THÊM CHUYÊN MỤC BÀI VIẾT */}
      {/* ========================================== */}
      {showAddArtCatModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Thêm Chuyên Mục Tin</h3>
              <button onClick={() => setShowAddArtCatModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArtCat} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên Chuyên Mục *</label>
                <input
                  type="text"
                  required
                  value={newArtCatName}
                  onChange={(e) => setNewArtCatName(e.target.value)}
                  placeholder="VD: Cẩm Nang Mắt Kính..."
                  className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mô Tả</label>
                <textarea
                  rows={2}
                  value={newArtCatDesc}
                  onChange={(e) => setNewArtCatDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddArtCatModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  Thêm Chuyên Mục
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: THÊM DANH MỤC SẢN PHẨM */}
      {/* ========================================== */}
      {showAddProdCatModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Thêm Danh Mục Kính</h3>
              <button onClick={() => setShowAddProdCatModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProdCat} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên Danh Mục *</label>
                <input
                  type="text"
                  required
                  value={newProdCatName}
                  onChange={(e) => setNewProdCatName(e.target.value)}
                  placeholder="VD: Kính Thể Thao..."
                  className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mã Phân Loại (Slug)</label>
                <select
                  value={newProdCatSlug}
                  onChange={(e) => setNewProdCatSlug(e.target.value as ProductCategory)}
                  className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs"
                >
                  <option value="gong-kinh-can">gong-kinh-can</option>
                  <option value="kinh-ram-mat">kinh-ram-mat</option>
                  <option value="trong-kinh">trong-kinh</option>
                  <option value="kinh-doi-mau">kinh-doi-mau</option>
                  <option value="kinh-tre-em">kinh-tre-em</option>
                  <option value="phu-kien">phu-kien</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mô Tả</label>
                <textarea
                  rows={2}
                  value={newProdCatDesc}
                  onChange={(e) => setNewProdCatDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddProdCatModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  Thêm Danh Mục
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: THÊM QUẢN TRỊ VIÊN */}
      {/* ========================================== */}
      {showAddAdminModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Thêm Quản Trị Viên</h3>
              <button onClick={() => setShowAddAdminModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdmin} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên Đăng Nhập (Username) *</label>
                <input
                  type="text"
                  required
                  value={newAdminUser}
                  onChange={(e) => setNewAdminUser(e.target.value)}
                  placeholder="admin_nv01..."
                  className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mật Khẩu (Password) *</label>
                <div className="relative">
                  <input
                    type={showNewAdminPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)..."
                    className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewAdminPassword(!showNewAdminPassword)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNewAdminPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Lưu trực tiếp vào document của tài khoản trong collection admins.</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Họ và Tên</label>
                <input
                  type="text"
                  value={newAdminFullName}
                  onChange={(e) => setNewAdminFullName(e.target.value)}
                  placeholder="Nguyễn Văn A..."
                  className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Quản Trị</label>
                <input
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="admin@saigonone.vn..."
                  className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vai Trò / Phân Quyền</label>
                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs"
                >
                  <option value="admin">Quản Trị Viên (Admin)</option>
                  <option value="editor">Biên Tập Viên (Editor)</option>
                  <option value="technician">Kỹ Thuật Viên (Technician)</option>
                  <option value="super_admin">Quản Trị Trưởng (Super Admin)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddAdminModal(false);
                    setNewAdminPassword("");
                    setShowNewAdminPassword(false);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  Tạo Tài Khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: ĐỔI MẬT KHẨU QUẢN TRỊ VIÊN */}
      {/* ========================================== */}
      {changePassAdmin && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Đổi Mật Khẩu Quản Trị</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Tài khoản: @{changePassAdmin.username} ({changePassAdmin.fullName})</p>
              </div>
              <button 
                onClick={() => setChangePassAdmin(null)} 
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveChangePassword} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mật Khẩu Mới *</label>
                <div className="relative">
                  <input
                    type={showChangePasswordVal ? "text" : "password"}
                    required
                    minLength={6}
                    value={newPasswordVal}
                    onChange={(e) => setNewPasswordVal(e.target.value)}
                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)..."
                    className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowChangePasswordVal(!showChangePasswordVal)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showChangePasswordVal ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Mật khẩu mới sẽ được cập nhật trực tiếp vào Firestore.</p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  disabled={isUpdatingPassword}
                  onClick={() => setChangePassAdmin(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  {isUpdatingPassword ? <span>Đang lưu...</span> : <span>Lưu Mật Khẩu</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: SAO LƯU TOÀN BỘ DỮ LIỆU FIRESTORE (EXPORT JSON) */}
      {/* ======================================================== */}
      <AdminBackupModal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
      />

      {/* ======================================================== */}
      {/* MODAL: XÁC THỰC KÉP XÓA DỮ LIỆU AN TOÀN (CONFIRM DELETE) */}
      {/* ======================================================== */}
      {deleteTarget && (
        <ConfirmDeleteModal
          isOpen={!!deleteTarget}
          itemType={deleteTarget.itemType}
          itemTitle={deleteTarget.itemTitle}
          itemId={deleteTarget.itemId}
          itemImage={deleteTarget.itemImage}
          itemSubtitle={deleteTarget.itemSubtitle}
          onConfirm={async () => {
            if (deleteTarget) {
              await deleteTarget.onConfirm();
              setDeleteTarget(null);
            }
          }}
          onClose={() => setDeleteTarget(null)}
        />
      )}

    </div>
  );
};
