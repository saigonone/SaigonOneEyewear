export type ProductCategory = 
  | "all"
  | "gong-kinh-can" 
  | "kinh-ram-mat" 
  | "trong-kinh" 
  | "kinh-doi-mau" 
  | "kinh-tre-em" 
  | "phu-kien";

export type GenderTarget = "unisex" | "nam" | "nu" | "tre-em";

export type FrameShape = "vuong" | "tron" | "mat-meo" | "browline" | "aviator" | "da-giac" | "chu-nhat" | "oval";

export type FaceShape = "tron" | "vuong" | "trai-xoan" | "kim-cuong" | "trai-tim" | "dai";

export type FrameMaterial = "titanium" | "acetate" | "kim-loai" | "nhua-tr90" | "go-cao-cap" | "khong-vien";

export interface LensOption {
  id: string;
  name: string;
  brand: "Essilor (Pháp)" | "Chemi (Hàn Quốc)" | "Hoya (Nhật Bản)" | "Zeiss (Đức)" | "Chính Hãng SaigonOne";
  index: "1.56 (Chuẩn)" | "1.60 (Mỏng)" | "1.67 (Siêu mỏng)" | "1.74 (Cực mỏng cao cấp)";
  type: "chong-anh-sang-xanh" | "doi-mau-khai-sang" | "chong-choi-uv400" | "chong-bam-nuoc-hoi-nuoc" | "kiem-soat-can-thi";
  description: string;
  price: number;
  originalPrice?: number;
  features: string[];
  isPopular?: boolean;
}

export interface EyePrescription {
  hasPrescription: boolean;
  leftEye: {
    sph: number; // Độ cầu (Cận/Viễn)
    cyl: number; // Độ loạn
    axis: number; // Trục loạn
  };
  rightEye: {
    sph: number;
    cyl: number;
    axis: number;
  };
  pd: number; // Khoảng cách đồng tử (mm)
  note?: string;
  prescriptionImage?: string; // Base64 or URL
}

export interface ProductColor {
  name: string;
  hex: string;
  image: string;
  tryOnModelUrl?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug?: string;
  brand: string;
  category: ProductCategory;
  gender: GenderTarget;
  price: number;
  originalPrice: number;
  discountPercent?: number;
  images: string[];
  colors: ProductColor[];
  frameShape: FrameShape;
  faceShapes: FaceShape[];
  material: FrameMaterial;
  weight: number; // grams
  dimensions: {
    lensWidth: number; // Chiều rộng tròng (mm)
    bridgeWidth: number; // Cầu mũi (mm)
    templeLength: number; // Chiều dài càng kính (mm)
    frameHeight: number; // Chiều cao gọng (mm)
  };
  description: string;
  highlights: string[];
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  stock: number;
  rating: number;
  reviewsCount: number;
  tryOnOverlayType: "classic-round" | "modern-square" | "cat-eye" | "aviator" | "browline" | "polygon";
  tryOnSvgColor?: string;
}

export interface CartItem {
  id: string; // unique item id in cart (productId + selectedColor + selectedLens)
  product: Product;
  selectedColor: ProductColor;
  selectedLens?: LensOption;
  prescription?: EyePrescription;
  quantity: number;
}

export interface OrderCustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  note: string;
  paymentMethod: "cod" | "vietqr" | "momo" | "credit_card";
  requireEyeTestAtStore?: boolean;
  selectedStoreId?: string;
}

export interface Order {
  id?: string;
  orderCode: string;
  customer: OrderCustomerInfo;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  promoCode?: string;
  status: "pending" | "confirmed" | "lens_crafting" | "shipping" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  paymentStatus: "unpaid" | "paid";
  paymentDetails?: {
    bankName?: string;
    accountNo?: string;
    accountName?: string;
    transactionId?: string;
    qrUrl?: string;
  };
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  district: string;
  city: string;
  phone: string;
  hotline: string;
  openHours: string;
  mapUrl?: string;
  services: string[];
  image: string;
  isMainFlagship?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  productColorPurchased?: string;
  verifiedPurchase: boolean;
  images?: string[];
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  content: string;
  thumbnail: string;
  author: string;
  readTime: string;
  publishedAt: string;
  viewsCount?: number;
  tags?: string[];
  isFeatured?: boolean;
  isPublished: boolean;
}

export interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface ProductCategoryItem {
  id: string;
  slug: ProductCategory;
  name: string;
  description: string;
  itemCount?: number;
}

export interface AdminUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: "super_admin" | "admin" | "editor" | "technician";
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export interface BannerSlide {
  id: string;
  collectionTag: string;
  titleLine1: string;
  titleLine2: string;
  desc: string;
  buttonText: string;
  secondaryButtonText?: string;
  category: ProductCategory;
  featureBadge: string;
  featureDesc: string;
  image: string;
  brandNote?: string;
  isActive: boolean;
  order?: number;
}

export interface Appointment {
  id?: string;
  fullName: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  note?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
  storeAddress?: string;
}
