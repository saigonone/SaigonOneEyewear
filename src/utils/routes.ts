import { ProductCategory, Product, Article } from "../types";
import { 
  createSlug, 
  getProductSlug, 
  getArticleSlug, 
  getProductUrl, 
  getArticleUrl 
} from "./slug";

export { 
  createSlug, 
  getProductSlug, 
  getArticleSlug, 
  getProductUrl, 
  getArticleUrl 
};

export interface RouteState {
  path: string;
  category?: ProductCategory;
  productId?: string;
  articleId?: string;
  isAbout?: boolean;
  isStores?: boolean;
  isTryOn?: boolean;
  isOrderLookup?: boolean;
  isAdmin?: boolean;
  isArticlesPage?: boolean;
  title: string;
  description?: string;
}

export const CATEGORY_TO_PATH: Record<ProductCategory, string> = {
  "all": "/san-pham",
  "gong-kinh-can": "/gong-kinh",
  "kinh-ram-mat": "/kinh-thoi-trang",
  "kinh-doi-mau": "/kinh-ap-trong",
  "trong-kinh": "/trong-kinh",
  "kinh-tre-em": "/kinh-tre-em",
  "phu-kien": "/phu-kien-kinh",
};

export const PATH_TO_CATEGORY: Record<string, ProductCategory> = {
  "/san-pham": "all",
  "/tat-ca-san-pham": "all",
  "/gong-kinh": "gong-kinh-can",
  "/gong-kinh-can": "gong-kinh-can",
  "/danh-muc/gong-kinh-can": "gong-kinh-can",
  "/kinh-thoi-trang": "kinh-ram-mat",
  "/kinh-ram": "kinh-ram-mat",
  "/kinh-ram-mat": "kinh-ram-mat",
  "/danh-muc/kinh-ram-mat": "kinh-ram-mat",
  "/kinh-ap-trong": "kinh-doi-mau",
  "/kinh-doi-mau": "kinh-doi-mau",
  "/danh-muc/kinh-doi-mau": "kinh-doi-mau",
  "/trong-kinh": "trong-kinh",
  "/danh-muc/trong-kinh": "trong-kinh",
  "/kinh-tre-em": "kinh-tre-em",
  "/danh-muc/kinh-tre-em": "kinh-tre-em",
  "/phu-kien-kinh": "phu-kien",
  "/phu-kien": "phu-kien",
};

/**
 * Update Document Title and Meta Description for SEO
 */
export function updateSEOMeta(title: string, description?: string, canonicalUrl?: string) {
  if (typeof document === "undefined") return;

  document.title = title;

  if (description) {
    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement("meta");
      descMeta.setAttribute("name", "description");
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute("content", description);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute("content", description);
    }
  }

  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute("content", title);
  }

  if (canonicalUrl) {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);
  }
}

/**
 * Parses current window.location.pathname into structured route state
 */
export function parseCurrentRoute(products: Product[] = [], articles: Article[] = []): RouteState {
  if (typeof window === "undefined") {
    return {
      path: "/",
      title: "Mắt Kính Sài Gòn One - Hệ Thống Kính Mắt Cao Cấp Phú Nhuận",
      description: "Hệ thống mắt kính Sài Gòn One Eyewear chính hãng - 178 Phan Đăng Lưu, Phú Nhuận, TP.HCM."
    };
  }

  const rawPath = window.location.pathname.toLowerCase().replace(/\/+$/, "") || "/";

  // 1. Home
  if (rawPath === "/" || rawPath === "") {
    return {
      path: "/",
      category: "all",
      title: "Saigon One Eyewear - Kính Mắt & Tròng Kính Chính Hãng Phú Nhuận",
      description: "Hệ thống kính mắt Sài Gòn One - Đo khám khúc xạ chuẩn y khoa miễn phí, cắt kính lấy ngay 15 phút tại 178 Phan Đăng Lưu, Phú Nhuận, TP.HCM."
    };
  }

  // 2. Giới Thiệu
  if (rawPath === "/gioi-thieu" || rawPath === "/ve-chung-toi") {
    return {
      path: "/gioi-thieu",
      isAbout: true,
      title: "Giới Thiệu Saigon One Eyewear - 178 Phan Đăng Lưu, Phú Nhuận",
      description: "Tìm hiểu về Saigon One Eyewear - Hệ thống mắt kính thời trang cao cấp & phòng khám đo khúc xạ y khoa uy tín tại TP.HCM."
    };
  }

  // 3. Liên Hệ / Địa Chỉ Cửa Hàng
  if (rawPath === "/lien-he" || rawPath === "/he-thong-cua-hang" || rawPath === "/dia-chi") {
    return {
      path: "/lien-he",
      isStores: true,
      title: "Liên Hệ & Hệ Thống Cửa Hàng - Saigon One Eyewear",
      description: "Địa chỉ trụ sở Flagship Saigon One Eyewear: 178 Phan Đăng Lưu, Phường 3, Phú Nhuận, TP.HCM. Hotline/Zalo: 0973.819.928."
    };
  }

  // 4. Thử Kính AR
  if (rawPath === "/thu-kinh-ar" || rawPath === "/thu-kinh-3d" || rawPath === "/thu-kinh") {
    return {
      path: "/thu-kinh-ar",
      isTryOn: true,
      title: "Thử Kính AR 3D Trực Tuyến - Saigon One Eyewear",
      description: "Trải nghiệm tính năng thử gọng kính AR 3D bằng camera trực tiếp siêu chân thực tại Saigon One Eyewear."
    };
  }

  // 5. Tra cứu đơn hàng
  if (rawPath === "/tra-cuu-don-hang" || rawPath === "/kiem-tra-don-hang") {
    return {
      path: "/tra-cuu-don-hang",
      isOrderLookup: true,
      title: "Tra Cứu Đơn Hàng - Saigon One Eyewear",
      description: "Kiểm tra tiến độ cắt kính, giao hàng và bảo hành đơn hàng tại Saigon One Eyewear."
    };
  }

  // 6. Quản Trị
  if (rawPath === "/admin" || rawPath === "/quan-tri") {
    return {
      path: "/admin",
      isAdmin: true,
      title: "Quản Trị Hệ Thống - Saigon One Eyewear",
      description: "Trang quản trị sản phẩm, đơn hàng và tin tức bài viết Saigon One Eyewear."
    };
  }

  // 7. Cẩm Nang & Tin Tức & Bài Viết
  if (rawPath === "/cam-nang" || rawPath === "/tin-tuc" || rawPath === "/bai-viet") {
    return {
      path: "/cam-nang",
      isArticlesPage: true,
      title: "Cẩm Nang Thị Lực & Tin Tức Kính Mắt - Saigon One Eyewear",
      description: "Chia sẻ kinh nghiệm chọn gọng kính hợp khuôn mặt, chăm sóc mắt và công nghệ tròng kính chống ánh sáng xanh mới nhất."
    };
  }

  // 8. Chi tiết bài viết: /bai-viet/:slug, /cam-nang/:slug hoặc /tin-tuc/:slug
  if (rawPath.startsWith("/bai-viet/") || rawPath.startsWith("/cam-nang/") || rawPath.startsWith("/tin-tuc/")) {
    const slug = rawPath.replace(/^\/(bai-viet|cam-nang|tin-tuc)\//, "");
    const foundArticle = articles.find((a) => {
      const artSlug = getArticleSlug(a);
      const titleSlug = createSlug(a.title);
      return (
        a.id === slug ||
        a.id.toLowerCase() === slug.toLowerCase() ||
        a.slug === slug ||
        artSlug === slug ||
        titleSlug === slug
      );
    });

    return {
      path: rawPath,
      articleId: foundArticle ? foundArticle.id : slug,
      title: foundArticle ? `${foundArticle.title} | Saigon One Eyewear` : "Tin Tức Kính Mắt - Saigon One Eyewear",
      description: foundArticle ? foundArticle.summary : "Bài viết cẩm nang kính mắt và chăm sóc thị lực."
    };
  }

  // 9. Chi tiết sản phẩm: /san-pham/:slug (vd: /san-pham/sgo-1001-gong-kinh-titan)
  if (rawPath.startsWith("/san-pham/")) {
    const prodKey = rawPath.replace("/san-pham/", "");
    const foundProduct = products.find((p) => {
      const pSlug = getProductSlug(p);
      const pNameSlug = createSlug(p.name);
      const pSku = (p.sku || "").toLowerCase();
      const pKeyLower = prodKey.toLowerCase();
      
      return (
        p.id.toLowerCase() === pKeyLower ||
        (p.slug && p.slug.toLowerCase() === pKeyLower) ||
        pSlug === pKeyLower ||
        (pSku && pSku === pKeyLower) ||
        pNameSlug === pKeyLower ||
        (pSku && pKeyLower.startsWith(`${pSku}-`))
      );
    });

    return {
      path: rawPath,
      productId: foundProduct ? foundProduct.id : prodKey,
      title: foundProduct
        ? `${foundProduct.name} - ${foundProduct.brand} | Saigon One Eyewear`
        : "Chi Tiết Sản Phẩm | Saigon One Eyewear",
      description: foundProduct
        ? `${foundProduct.name} chính hãng ${foundProduct.brand}. Chất liệu ${foundProduct.material}. Giá: ${foundProduct.price.toLocaleString("vi-VN")}đ.`
        : "Kính mắt chính hãng tại Saigon One Eyewear."
    };
  }

  // 10. Danh mục sản phẩm (ví dụ: /gong-kinh, /kinh-thoi-trang, /kinh-ap-trong, /trong-kinh, /san-pham)
  if (PATH_TO_CATEGORY[rawPath]) {
    const cat = PATH_TO_CATEGORY[rawPath];
    let catTitle = "Tất Cả Sản Phẩm Kính Mắt | Saigon One Eyewear";
    let catDesc = "Bộ sưu tập kính mắt chính hãng tại Saigon One Eyewear.";

    if (cat === "gong-kinh-can") {
      catTitle = "Gọng Kính Cận Cao Cấp Titanium & Acetate | Saigon One Eyewear";
      catDesc = "Gọng kính cận nam nữ thời trang, siêu nhẹ, bền bỉ, phong cách Hàn Quốc và Châu Âu chính hãng.";
    } else if (cat === "kinh-ram-mat") {
      catTitle = "Kính Thời Trang & Kính Râm Polarized | Saigon One Eyewear";
      catDesc = "Kính mát thời trang cao cấp, tròng phân cực Polarized chống tia UV400 bảo vệ mắt hoàn hảo.";
    } else if (cat === "kinh-doi-mau") {
      catTitle = "Kính Áp Tròng & Kính Đổi Màu Thông Minh | Saigon One Eyewear";
      catDesc = "Kính áp tròng êm ái, tròng kính đổi màu tự động nhanh chóng khi ra nắng.";
    } else if (cat === "trong-kinh") {
      catTitle = "Bảng Giá Tròng Kính Chống Ánh Sáng Xanh & Siêu Mỏng | Saigon One Eyewear";
      catDesc = "Tròng kính chính hãng Essilor, Chemi, Hoya chiết suất 1.60, 1.67, 1.74 chống trầy, lọc ánh sáng xanh.";
    }

    return {
      path: rawPath,
      category: cat,
      title: catTitle,
      description: catDesc
    };
  }

  // Default fallback to Home
  return {
    path: "/",
    category: "all",
    title: "Saigon One Eyewear - Kính Mắt Chính Hãng Phú Nhuận",
    description: "Hệ thống mắt kính Sài Gòn One - 178 Phan Đăng Lưu, Phú Nhuận, TP.HCM."
  };
}

/**
 * Navigate to a specific path using HTML5 History API
 */
export function navigateTo(path: string, state?: Record<string, any>) {
  if (typeof window === "undefined") return;

  if (window.location.pathname !== path) {
    window.history.pushState(state || {}, "", path);
  }
}

/**
 * Replace current path in history
 */
export function replaceRoute(path: string, state?: Record<string, any>) {
  if (typeof window === "undefined") return;

  window.history.replaceState(state || {}, "", path);
}
