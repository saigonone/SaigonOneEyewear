import { Product, Article, LensBrandCategory } from "../types";

export interface SEOOptions {
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  url?: string;
  canonicalUrl?: string;
  type?: "website" | "product" | "article";
  keywords?: string[];
  product?: Product;
  article?: Article;
  lensBrand?: LensBrandCategory;
  breadcrumbs?: Array<{ name: string; url: string }>;
  noindex?: boolean;
}

export const STORE_SEO_CONFIG = {
  name: "Mắt Kính Sài Gòn One - Sài Gòn One Eyewear",
  shortName: "Sài Gòn One Eyewear",
  legalName: "Hệ Thống Mắt Kính Sài Gòn One",
  slogan: "Chuyên Gia Kính Mắt & Đo Khám Khúc Xạ Chuẩn Y Khoa",
  telephone: "0973.819.928",
  intlTelephone: "+84973819928",
  email: "matkinhsaigonone@gmail.com",
  streetAddress: "178 Phan Đăng Lưu, Phường 3",
  addressLocality: "Quận Phú Nhuận",
  addressRegion: "Hồ Chí Minh",
  postalCode: "700000",
  addressCountry: "VN",
  fullAddress: "178 Phan Đăng Lưu, Phường 3, Quận Phú Nhuận, TP. Hồ Chí Minh",
  latitude: 10.7981,
  longitude: 106.6859,
  openingHours: "Mo-Su 08:30-21:00",
  priceRange: "100.000đ - 10.000.000đ",
  defaultImage: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=1200&q=80",
  logoUrl: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=600&q=80",
  defaultKeywords: [
    "mắt kính sài gòn one",
    "saigon one eyewear",
    "kính mắt phú nhuận",
    "gọng kính cận nam nữ",
    "kính mát thời trang polarized",
    "tròng kính essilor pháp",
    "tròng kính chemi hàn quốc",
    "tròng kính hoya nhật bản",
    "cắt kính lấy ngay 15 phút",
    "đo khám mắt miễn phí",
    "178 phan đăng lưu"
  ]
};

/**
 * Safely sets or updates a meta tag in document.head
 */
function setMetaTag(selector: string, attrName: string, attrValue: string, content: string) {
  if (typeof document === "undefined") return;
  let element = document.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

/**
 * Safely sets or updates a link tag in document.head
 */
function setLinkTag(rel: string, href: string) {
  if (typeof document === "undefined") return;
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

/**
 * Safely removes a meta tag if present
 */
function removeMetaTag(selector: string) {
  if (typeof document === "undefined") return;
  const element = document.querySelector(selector);
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
}

/**
 * Injects or updates a JSON-LD structured data script
 */
function setOrUpdateLdJson(id: string, data: object | null) {
  if (typeof document === "undefined") return;
  let script = document.getElementById(id) as HTMLScriptElement | null;

  if (!data) {
    if (script && script.parentNode) {
      script.parentNode.removeChild(script);
    }
    return;
  }

  if (!script) {
    script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data, null, 2);
}

/**
 * Generates Schema.org LocalBusiness / Optician structured data
 */
export function generateLocalBusinessSchema(currentOrigin: string) {
  return {
    "@context": "https://schema.org",
    "@type": ["Optician", "LocalBusiness", "MedicalBusiness", "Store"],
    "@id": `${currentOrigin}/#store-local-business`,
    "name": STORE_SEO_CONFIG.name,
    "alternateName": STORE_SEO_CONFIG.shortName,
    "legalName": STORE_SEO_CONFIG.legalName,
    "slogan": STORE_SEO_CONFIG.slogan,
    "description": "Hệ thống mắt kính chính hãng Sài Gòn One Eyewear tại Phú Nhuận TP.HCM. Chuyên gọng kính cận titanium, kính mát thời trang polarized, tròng kính đổi màu chống ánh sáng xanh Essilor, Chemi, Hoya. Đo khúc xạ mắt chuẩn y khoa miễn phí và cắt kính lấy ngay sau 15 phút.",
    "url": currentOrigin,
    "logo": STORE_SEO_CONFIG.logoUrl,
    "image": [
      STORE_SEO_CONFIG.defaultImage,
      STORE_SEO_CONFIG.logoUrl
    ],
    "telephone": STORE_SEO_CONFIG.telephone,
    "email": STORE_SEO_CONFIG.email,
    "priceRange": STORE_SEO_CONFIG.priceRange,
    "currenciesAccepted": "VND",
    "paymentAccepted": "Cash, Credit Card, Bank Transfer, MoMo, ZaloPay, VNPAY, QR Pay",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": STORE_SEO_CONFIG.streetAddress,
      "addressLocality": STORE_SEO_CONFIG.addressLocality,
      "addressRegion": STORE_SEO_CONFIG.addressRegion,
      "postalCode": STORE_SEO_CONFIG.postalCode,
      "addressCountry": STORE_SEO_CONFIG.addressCountry
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": STORE_SEO_CONFIG.latitude,
      "longitude": STORE_SEO_CONFIG.longitude
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
        ],
        "opens": "08:30",
        "closes": "21:00"
      }
    ],
    "hasMap": "https://maps.google.com/?q=178+Phan+Đăng+Lưu+Phú+Nhuận",
    "sameAs": [
      "https://www.facebook.com/matkinhsaigonone",
      "https://zalo.me/0973819928"
    ]
  };
}

/**
 * Generates Schema.org Product structured data
 */
export function generateProductSchema(product: Product, pageUrl: string) {
  const images = (product.images && product.images.length > 0) 
    ? product.images 
    : [STORE_SEO_CONFIG.defaultImage];

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${pageUrl}#product`,
    "name": product.name,
    "description": product.description || `${product.name} chính hãng ${product.brand}. Chất liệu ${product.material}.`,
    "image": images,
    "sku": product.sku || product.id,
    "mpn": product.sku || product.id,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Saigon One"
    },
    "category": product.category,
    "material": product.material,
    "offers": {
      "@type": "Offer",
      "url": pageUrl,
      "priceCurrency": "VND",
      "price": product.price,
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": STORE_SEO_CONFIG.name
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating || 5.0,
      "reviewCount": product.reviewsCount || 24,
      "bestRating": "5",
      "worstRating": "1"
    }
  };
}

/**
 * Generates Schema.org Article / NewsArticle structured data
 */
export function generateArticleSchema(article: Article, pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": ["Article", "NewsArticle"],
    "@id": `${pageUrl}#article`,
    "headline": article.title,
    "description": article.summary,
    "image": article.thumbnail || STORE_SEO_CONFIG.defaultImage,
    "datePublished": article.publishedAt || new Date().toISOString(),
    "dateModified": article.publishedAt || new Date().toISOString(),
    "author": {
      "@type": "Person",
      "name": article.author || "Chuyên gia khúc xạ Saigon One",
      "jobTitle": "Khúc xạ nhãn khoa"
    },
    "publisher": {
      "@type": "Organization",
      "name": STORE_SEO_CONFIG.name,
      "logo": {
        "@type": "ImageObject",
        "url": STORE_SEO_CONFIG.logoUrl
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": pageUrl
    }
  };
}

/**
 * Generates Schema.org BreadcrumbList structured data
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>, origin: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith("http") ? item.url : `${origin}${item.url}`
    }))
  };
}

/**
 * Core Dynamic SEO Manager:
 * Updates document.title, all meta tags, OpenGraph, Twitter cards, and Schema.org JSON-LD
 */
export function updateSEODocument(options: SEOOptions) {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const origin = window.location.origin;
  const currentPath = window.location.pathname;
  const canonicalUrl = options.canonicalUrl || (options.url ? options.url : `${origin}${currentPath}`);
  
  // 1. Title
  const formattedTitle = options.title.includes("Saigon One") || options.title.includes("Sài Gòn One")
    ? options.title
    : `${options.title} | ${STORE_SEO_CONFIG.shortName}`;
  document.title = formattedTitle;

  // 2. Meta Description
  const description = options.description || "Hệ thống mắt kính Sài Gòn One Eyewear chính hãng - Đo khám khúc xạ chuẩn y khoa miễn phí tại 178 Phan Đăng Lưu, Phú Nhuận, TP.HCM.";
  setMetaTag('meta[name="description"]', "name", "description", description);

  // 3. Meta Keywords
  const keywords = Array.from(new Set([...(options.keywords || []), ...STORE_SEO_CONFIG.defaultKeywords])).join(", ");
  setMetaTag('meta[name="keywords"]', "name", "keywords", keywords);

  // 4. Canonical URL
  setLinkTag("canonical", canonicalUrl);

  // 5. Robots tag
  if (options.noindex || currentPath.startsWith("/admin") || currentPath.startsWith("/quan-tri")) {
    setMetaTag('meta[name="robots"]', "name", "robots", "noindex, nofollow");
  } else {
    setMetaTag('meta[name="robots"]', "name", "robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
  }

  // 6. Primary Image (OG / Twitter)
  const metaImage = options.image || (options.product?.images && options.product.images.length > 0 ? options.product.images[0] : null) || options.article?.thumbnail || STORE_SEO_CONFIG.defaultImage;
  const metaImageAlt = options.imageAlt || options.product?.name || options.article?.title || formattedTitle;

  // 7. OpenGraph Tags
  setMetaTag('meta[property="og:title"]', "property", "og:title", formattedTitle);
  setMetaTag('meta[property="og:description"]', "property", "og:description", description);
  setMetaTag('meta[property="og:url"]', "property", "og:url", canonicalUrl);
  setMetaTag('meta[property="og:type"]', "property", "og:type", options.type || (options.product ? "product" : options.article ? "article" : "website"));
  setMetaTag('meta[property="og:image"]', "property", "og:image", metaImage);
  setMetaTag('meta[property="og:image:alt"]', "property", "og:image:alt", metaImageAlt);
  setMetaTag('meta[property="og:site_name"]', "property", "og:site_name", STORE_SEO_CONFIG.name);
  setMetaTag('meta[property="og:locale"]', "property", "og:locale", "vi_VN");

  // 8. Twitter / X Cards
  setMetaTag('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
  setMetaTag('meta[name="twitter:title"]', "name", "twitter:title", formattedTitle);
  setMetaTag('meta[name="twitter:description"]', "name", "twitter:description", description);
  setMetaTag('meta[name="twitter:image"]', "name", "twitter:image", metaImage);
  setMetaTag('meta[name="twitter:image:alt"]', "name", "twitter:image:alt", metaImageAlt);

  // 9. Product-specific OpenGraph meta tags
  if (options.product) {
    setMetaTag('meta[property="product:price:amount"]', "property", "product:price:amount", String(options.product.price));
    setMetaTag('meta[property="product:price:currency"]', "property", "product:price:currency", "VND");
    setMetaTag('meta[property="product:brand"]', "property", "product:brand", options.product.brand);
    setMetaTag('meta[property="product:availability"]', "property", "product:availability", options.product.stock > 0 ? "in stock" : "out of stock");
  } else {
    removeMetaTag('meta[property="product:price:amount"]');
    removeMetaTag('meta[property="product:price:currency"]');
    removeMetaTag('meta[property="product:brand"]');
    removeMetaTag('meta[property="product:availability"]');
  }

  // 10. Article-specific OpenGraph meta tags
  if (options.article) {
    setMetaTag('meta[property="article:published_time"]', "property", "article:published_time", options.article.publishedAt || new Date().toISOString());
    setMetaTag('meta[property="article:author"]', "property", "article:author", options.article.author || "Saigon One Eyewear");
    setMetaTag('meta[property="article:section"]', "property", "article:section", options.article.category || "Kính Mắt");
  } else {
    removeMetaTag('meta[property="article:published_time"]');
    removeMetaTag('meta[property="article:author"]');
    removeMetaTag('meta[property="article:section"]');
  }

  // 11. Schema Markup Injection (JSON-LD)
  // Always inject/update LocalBusiness Schema for store identity & Google Maps / local SEO
  setOrUpdateLdJson("schema-local-business", generateLocalBusinessSchema(origin));

  // Inject or update Page Entity Schema (Product, Article, or Breadcrumbs)
  if (options.product) {
    setOrUpdateLdJson("schema-page-entity", generateProductSchema(options.product, canonicalUrl));
  } else if (options.article) {
    setOrUpdateLdJson("schema-page-entity", generateArticleSchema(options.article, canonicalUrl));
  } else if (options.breadcrumbs && options.breadcrumbs.length > 0) {
    setOrUpdateLdJson("schema-page-entity", generateBreadcrumbSchema(options.breadcrumbs, origin));
  } else if (currentPath === "/" || currentPath === "") {
    // Website SearchAction Schema for Homepage
    setOrUpdateLdJson("schema-page-entity", {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${origin}/#website`,
      "url": origin,
      "name": STORE_SEO_CONFIG.name,
      "alternateName": STORE_SEO_CONFIG.shortName,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${origin}/san-pham?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    });
  } else {
    setOrUpdateLdJson("schema-page-entity", null);
  }
}
