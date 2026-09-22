import { Product, Article, LensBrandCategory } from "../types";
import { 
  STORE_SEO_CONFIG, 
  generateProductSchema, 
  generateArticleSchema, 
  generateLocalBusinessSchema,
  generateBreadcrumbSchema
} from "../utils/seo";
import { getProductSlug, getArticleSlug, createSlug } from "../utils/slug";
import { 
  getProductsFromFirebase, 
  getArticlesFromFirebase, 
  getLensArticlesFromFirebase, 
  getLensBrandsFromFirebase 
} from "../firebase";
import { generateSitemapXml } from "../utils/sitemap";

// In-memory cache for server-side queries (TTL: 60 seconds)
interface ServerCache {
  products: Product[];
  articles: Article[];
  lensBrands: LensBrandCategory[];
  lastUpdated: number;
}

let cache: ServerCache = {
  products: [],
  articles: [],
  lensBrands: [],
  lastUpdated: 0,
};

const CACHE_TTL_MS = 60 * 1000; // 1 minute

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms))
  ]);
}

export async function getServerData(): Promise<{
  products: Product[];
  articles: Article[];
  lensBrands: LensBrandCategory[];
}> {
  const now = Date.now();
  if (cache.products.length > 0 && (now - cache.lastUpdated) < CACHE_TTL_MS) {
    return {
      products: cache.products,
      articles: cache.articles,
      lensBrands: cache.lensBrands,
    };
  }

  try {
    const fetchData = Promise.all([
      getProductsFromFirebase().catch(() => []),
      getArticlesFromFirebase().catch(() => []),
      getLensArticlesFromFirebase().catch(() => []),
      getLensBrandsFromFirebase().catch(() => []),
    ]);

    const [prods, arts, lensArts, brands] = await withTimeout(fetchData, 4000, [[], [], [], []]);

    const combinedArticles = [...(arts || []), ...(lensArts || [])];

    if (prods.length > 0 || combinedArticles.length > 0) {
      cache = {
        products: prods || [],
        articles: combinedArticles,
        lensBrands: brands || [],
        lastUpdated: now,
      };
    }
  } catch (err) {
    console.error("[SSR Server] Error fetching data from Firebase:", err);
  }

  return {
    products: cache.products,
    articles: cache.articles,
    lensBrands: cache.lensBrands,
  };
}

const CATEGORY_MAP: Record<string, { name: string; desc: string }> = {
  "gong-kinh-can": {
    name: "Gọng Kính Cận Nam Nữ Cao Cấp",
    desc: "Bộ sưu tập gọng kính cận nam nữ thời trang, siêu nhẹ từ chất liệu Titanium, Acetate, nhựa TR90 chính hãng tại Sài Gòn One Eyewear.",
  },
  "kinh-ram-mat": {
    name: "Kính Râm Thời Trang Chống Chói UV400",
    desc: "Kính mát, kính râm thời trang bảo vệ mắt 100% trước tia UV, tròng Polarized phân cực chống chói cao cấp tại Sài Gòn One Eyewear.",
  },
  "kinh-doi-mau": {
    name: "Kính Đổi Màu Đi Nắng & Chống Ánh Sáng Xanh",
    desc: "Tròng kính đổi màu nhanh chóng khi ra nắng và trong suốt khi vào nhà, tiện lợi 2 trong 1 bảo vệ mắt tối đa.",
  },
  "trong-kinh": {
    name: "Tròng Kính Chính Hãng Essilor, Hoya, Chemi",
    desc: "Bảng giá và các dòng tròng kính cận, loạn, viễn, đa tròng chính hãng từ các thương hiệu hàng đầu thế giới tại TP.HCM.",
  },
  "kinh-tre-em": {
    name: "Kính Mắt Trẻ Em Siêu Dẻo An Toàn",
    desc: "Gọng kính trẻ em chất liệu nhựa sinh học an toàn, chống gãy gập, chống ánh sáng xanh cho bé khi học tập.",
  },
  "phu-kien": {
    name: "Phụ Kiện Kính Mắt Chính Hãng",
    desc: "Hộp đựng kính da cao cấp, khăn lau nano chống bám hơi nước, nước lau kính chuyên dụng và dây đeo kính thời trang.",
  },
};

export interface PageMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  image: string;
  imageAlt: string;
  type: string;
  keywords?: string[];
  product?: Product;
  article?: Article;
  lensBrand?: LensBrandCategory;
  categoryName?: string;
  jsonLdSchemas: object[];
  prerenderHtml?: string;
}

export async function resolveRouteMetadata(
  urlPath: string, 
  origin: string
): Promise<PageMetadata> {
  const { products, articles, lensBrands } = await getServerData();
  const cleanPath = urlPath.split("?")[0].replace(/\/+$/, "") || "/";
  const fullUrl = `${origin}${cleanPath === "/" ? "" : cleanPath}`;

  // Default homepage meta
  const defaultMeta: PageMetadata = {
    title: "Mắt Kính Sài Gòn One - Hệ Thống Kính Mắt & Tròng Kính Cao Cấp",
    description: "Hệ thống mắt kính Sài Gòn One Eyewear chính hãng - Gọng kính cận nam nữ, kính mát thời trang, tròng kính đổi màu chống ánh sáng xanh, đo khám mắt miễn phí tại 178 Phan Đăng Lưu, Phú Nhuận, TP.HCM.",
    canonicalUrl: `${origin}/`,
    image: STORE_SEO_CONFIG.defaultImage,
    imageAlt: "Mắt Kính Sài Gòn One Eyewear - 178 Phan Đăng Lưu, Phú Nhuận",
    type: "website",
    keywords: STORE_SEO_CONFIG.defaultKeywords,
    jsonLdSchemas: [
      generateLocalBusinessSchema(origin),
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        "url": `${origin}/`,
        "name": "Mắt Kính Sài Gòn One",
        "alternateName": "Sài Gòn One Eyewear",
      }
    ],
    prerenderHtml: `
      <div class="ssr-hero-content" style="max-width:1200px;margin:0 auto;padding:40px 20px;font-family:system-ui,-apple-system,sans-serif;">
        <h1 style="font-size:32px;font-weight:800;color:#0f172a;margin-bottom:12px;">Mắt Kính Sài Gòn One - Hệ Thống Kính Mắt &amp; Tròng Kính Cao Cấp</h1>
        <p style="font-size:16px;color:#475569;line-height:1.6;margin-bottom:24px;">Chuyên gọng kính cận nam nữ, kính mát thời trang Polarized UV400, tròng kính đổi màu chống ánh sáng xanh chính hãng Essilor Pháp, Chemi Hàn Quốc, Hoya Nhật Bản.</p>
        <p style="font-size:15px;color:#1e293b;font-weight:600;">Địa chỉ: 178 Phan Đăng Lưu, Phường 3, Quận Phú Nhuận, TP.HCM | Hotline: 0973.819.928</p>
      </div>
    `,
  };

  // 1. Chi tiết sản phẩm: /san-pham/:slug hoặc /product/:slug
  if (cleanPath.startsWith("/san-pham/") || cleanPath.startsWith("/product/")) {
    const slug = cleanPath.replace(/^\/(san-pham|product)\//, "");
    const product = products.find((p) => {
      const pSlug = getProductSlug(p);
      const nameSlug = createSlug(p.name);
      return p.id === slug || p.slug === slug || pSlug === slug || nameSlug === slug;
    });

    if (product) {
      const prodImg = (product.images && product.images.length > 0) ? product.images[0] : product.thumbnail || STORE_SEO_CONFIG.defaultImage;
      const title = `${product.name} - ${product.brand} Chính Hãng | Saigon One`;
      const desc = (product.description || "").slice(0, 160) || `Mua ${product.name} chính hãng ${product.brand} tại Sài Gòn One Eyewear. Giá tốt, bảo hành chính hãng, đo mắt miễn phí.`;

      const breadcrumb = generateBreadcrumbSchema([
        { name: "Trang chủ", url: `${origin}/` },
        { name: "Sản phẩm", url: `${origin}/san-pham` },
        { name: product.name, url: fullUrl }
      ], origin);

      const productSchema = generateProductSchema(product, fullUrl);

      return {
        title,
        description: desc,
        canonicalUrl: fullUrl,
        image: prodImg,
        imageAlt: `${product.name} - ${product.brand}`,
        type: "product",
        keywords: [product.name, product.brand, "gọng kính cận", "kính mắt chính hãng", "sài gòn one"],
        product,
        jsonLdSchemas: [
          generateLocalBusinessSchema(origin),
          productSchema,
          breadcrumb
        ],
        prerenderHtml: `
          <div class="ssr-product-container" style="max-width:1100px;margin:0 auto;padding:40px 20px;font-family:system-ui,-apple-system,sans-serif;">
            <nav style="font-size:13px;color:#64748b;margin-bottom:20px;">
              <a href="/" style="color:#2563eb;text-decoration:none;">Trang chủ</a> &rsaquo; 
              <a href="/san-pham" style="color:#2563eb;text-decoration:none;">Sản phẩm</a> &rsaquo; 
              <span>${product.name}</span>
            </nav>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:32px;align-items:start;">
              <div>
                <img src="${prodImg}" alt="${product.name}" style="width:100%;max-width:500px;border-radius:16px;border:1px solid #e2e8f0;" />
              </div>
              <div>
                <span style="font-size:12px;font-weight:700;color:#2563eb;text-transform:uppercase;letter-spacing:1px;">${product.brand}</span>
                <h1 style="font-size:28px;font-weight:800;color:#0f172a;margin:8px 0 16px;">${product.name}</h1>
                <div style="font-size:24px;font-weight:800;color:#dc2626;margin-bottom:16px;">
                  ${product.price.toLocaleString("vi-VN")}₫
                  ${product.originalPrice && product.originalPrice > product.price ? `<span style="font-size:16px;color:#94a3b8;text-decoration:line-through;margin-left:8px;">${product.originalPrice.toLocaleString("vi-VN")}₫</span>` : ""}
                </div>
                <div style="font-size:14px;line-height:1.6;color:#334155;margin-bottom:24px;">${product.description}</div>
                <div style="padding:16px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;font-size:13px;color:#475569;">
                  <p style="margin:0 0 8px;"><strong>Mã sản phẩm (SKU):</strong> ${product.sku || product.id}</p>
                  <p style="margin:0 0 8px;"><strong>Chất liệu gọng:</strong> ${product.material || "Titanium / Acetate"}</p>
                  <p style="margin:0;"><strong>Tình trạng:</strong> ${product.stock > 0 ? "Còn hàng sẵn tại cửa hàng" : "Liên hệ đặt trước"}</p>
                </div>
              </div>
            </div>
          </div>
        `
      };
    }
  }

  // 2. Chi tiết bài viết cẩm nang: /cam-nang/:slug hoặc /bai-viet/:slug hoặc /tin-tuc/:slug
  if (cleanPath.startsWith("/cam-nang/") || cleanPath.startsWith("/bai-viet/") || cleanPath.startsWith("/tin-tuc/")) {
    const slug = cleanPath.replace(/^\/(cam-nang|bai-viet|tin-tuc)\//, "");
    const article = articles.find((a) => {
      const aSlug = getArticleSlug(a);
      const titleSlug = createSlug(a.title);
      return a.id === slug || a.slug === slug || aSlug === slug || titleSlug === slug;
    });

    if (article) {
      const artImg = article.thumbnail || STORE_SEO_CONFIG.defaultImage;
      const title = `${article.title} | Saigon One Eyewear`;
      const desc = (article.summary || "").slice(0, 160);

      const breadcrumb = generateBreadcrumbSchema([
        { name: "Trang chủ", url: `${origin}/` },
        { name: "Cẩm nang", url: `${origin}/cam-nang` },
        { name: article.title, url: fullUrl }
      ], origin);

      const articleSchema = generateArticleSchema(article, fullUrl);

      return {
        title,
        description: desc,
        canonicalUrl: fullUrl,
        image: artImg,
        imageAlt: article.title,
        type: "article",
        keywords: [article.title, article.category, "cẩm nang mắt kính", "chăm sóc mắt", "sài gòn one"],
        article,
        jsonLdSchemas: [
          generateLocalBusinessSchema(origin),
          articleSchema,
          breadcrumb
        ],
        prerenderHtml: `
          <div class="ssr-article-container" style="max-width:860px;margin:0 auto;padding:40px 20px;font-family:system-ui,-apple-system,sans-serif;">
            <nav style="font-size:13px;color:#64748b;margin-bottom:20px;">
              <a href="/" style="color:#2563eb;text-decoration:none;">Trang chủ</a> &rsaquo; 
              <a href="/cam-nang" style="color:#2563eb;text-decoration:none;">Cẩm nang</a> &rsaquo; 
              <span>${article.category || "Bài viết"}</span>
            </nav>
            <h1 style="font-size:32px;font-weight:800;color:#0f172a;line-height:1.3;margin-bottom:16px;">${article.title}</h1>
            <div style="display:flex;align-items:center;gap:12px;font-size:13px;color:#64748b;margin-bottom:24px;">
              <span>Tác giả: <strong>${article.author || "Saigon One"}</strong></span> &bull; 
              <span>Ngày đăng: ${article.publishedAt ? article.publishedAt.split("T")[0] : "2026"}</span>
            </div>
            <p style="font-size:18px;font-weight:500;color:#334155;line-height:1.6;margin-bottom:24px;border-left:4px solid #2563eb;padding-left:16px;">${article.summary}</p>
            <img src="${artImg}" alt="${article.title}" style="width:100%;border-radius:16px;margin-bottom:32px;border:1px solid #e2e8f0;" />
            <div style="font-size:16px;line-height:1.8;color:#1e293b;">${article.content}</div>
          </div>
        `
      };
    }
  }

  // 3. Thương hiệu tròng kính: /trong-kinh/:slug
  if (cleanPath.startsWith("/trong-kinh/")) {
    const slug = cleanPath.replace(/^\/trong-kinh\//, "");
    const brand = lensBrands.find((b) => b.slug === slug || b.brandKey === slug || b.id === slug);

    if (brand) {
      const brandImg = brand.bannerImage || brand.logo || STORE_SEO_CONFIG.defaultImage;
      const title = `${brand.name} Chính Hãng (${brand.country || brand.origin || "Cao Cấp"}) | Saigon One`;
      const desc = brand.description || `Bảng giá và công nghệ tròng kính ${brand.name} chính hãng tại Sài Gòn One Eyewear.`;

      const breadcrumb = generateBreadcrumbSchema([
        { name: "Trang chủ", url: `${origin}/` },
        { name: "Tròng kính", url: `${origin}/trong-kinh` },
        { name: brand.name, url: fullUrl }
      ], origin);

      return {
        title,
        description: desc,
        canonicalUrl: fullUrl,
        image: brandImg,
        imageAlt: brand.name,
        type: "website",
        keywords: [brand.name, "tròng kính chính hãng", "bảng giá tròng kính", "sài gòn one"],
        lensBrand: brand,
        jsonLdSchemas: [
          generateLocalBusinessSchema(origin),
          breadcrumb
        ],
        prerenderHtml: `
          <div class="ssr-brand-container" style="max-width:1100px;margin:0 auto;padding:40px 20px;font-family:system-ui,-apple-system,sans-serif;">
            <h1 style="font-size:32px;font-weight:800;color:#0f172a;margin-bottom:12px;">${brand.name}</h1>
            <p style="font-size:16px;color:#475569;line-height:1.6;margin-bottom:24px;">${brand.description}</p>
          </div>
        `
      };
    }
  }

  // 4. Danh mục sản phẩm: /gong-kinh-can, /kinh-ram-mat, /kinh-doi-mau, v.v.
  const catKey = cleanPath.replace(/^\//, "");
  if (CATEGORY_MAP[catKey]) {
    const cat = CATEGORY_MAP[catKey];
    const title = `${cat.name} | Sài Gòn One Eyewear`;
    const desc = cat.desc;

    const breadcrumb = generateBreadcrumbSchema([
      { name: "Trang chủ", url: `${origin}/` },
      { name: cat.name, url: fullUrl }
    ], origin);

    return {
      title,
      description: desc,
      canonicalUrl: fullUrl,
      image: STORE_SEO_CONFIG.defaultImage,
      imageAlt: cat.name,
      type: "website",
      keywords: [cat.name, "mắt kính sài gòn one", "kính mắt cao cấp"],
      categoryName: cat.name,
      jsonLdSchemas: [
        generateLocalBusinessSchema(origin),
        breadcrumb
      ],
      prerenderHtml: `
        <div class="ssr-category-container" style="max-width:1200px;margin:0 auto;padding:40px 20px;font-family:system-ui,-apple-system,sans-serif;">
          <h1 style="font-size:30px;font-weight:800;color:#0f172a;margin-bottom:12px;">${cat.name}</h1>
          <p style="font-size:16px;color:#475569;line-height:1.6;margin-bottom:24px;">${cat.desc}</p>
        </div>
      `
    };
  }

  // 5. Trang Cố Định khác: /gioi-thieu, /lien-he, /bang-gia-trong-kinh
  if (cleanPath === "/gioi-thieu") {
    return {
      ...defaultMeta,
      title: "Về Chúng Tôi - Showroom Mắt Kính Sài Gòn One Phú Nhuận",
      description: "Tìm hiểu hành trình phát triển, đội ngũ chuyên viên khúc xạ và sứ mệnh đem lại thị lực hoàn hảo cho khách hàng của Sài Gòn One Eyewear.",
      canonicalUrl: `${origin}/gioi-thieu`
    };
  }

  if (cleanPath === "/lien-he" || cleanPath === "/he-thong-cua-hang") {
    return {
      ...defaultMeta,
      title: "Hệ Thống Cửa Hàng & Liên Hệ | Sài Gòn One Eyewear",
      description: "Ghé thăm trực tiếp showroom Mắt Kính Sài Gòn One tại 178 Phan Đăng Lưu, P.3, Q.Phú Nhuận, TP.HCM. Hotline tư vấn: 0973.819.928.",
      canonicalUrl: `${origin}/lien-he`
    };
  }

  if (cleanPath === "/bang-gia-trong-kinh") {
    return {
      ...defaultMeta,
      title: "Bảng Giá Tròng Kính Chính Hãng 2026 - Mắt Kính Sài Gòn One",
      description: "Cập nhật bảng giá tròng kính đổi màu, tròng lọc ánh sáng xanh, tròng siêu mỏng chính hãng Essilor, Hoya, Chemi mới nhất.",
      canonicalUrl: `${origin}/bang-gia-trong-kinh`
    };
  }

  if (cleanPath === "/cam-nang" || cleanPath === "/bai-viet" || cleanPath === "/tin-tuc") {
    return {
      ...defaultMeta,
      title: "Cẩm Nang Kính Mắt & Chăm Sóc Thị Lực | Sài Gòn One Eyewear",
      description: "Tổng hợp kiến thức khúc xạ, kinh nghiệm chọn gọng kính phù hợp khuôn mặt và cách bảo quản tròng kính từ chuyên gia.",
      canonicalUrl: `${origin}/cam-nang`
    };
  }

  return defaultMeta;
}

/**
 * Injects dynamic Meta Tags, OpenGraph, Twitter Cards, Schema.org JSON-LD and SSR Pre-render HTML
 * into the raw HTML string of index.html.
 */
export function injectSSRMetadata(rawHtml: string, meta: PageMetadata): string {
  let html = rawHtml;

  // 1. Replace <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(meta.title)}</title>`);

  // 2. Replace or inject <meta name="description" ...>
  if (/<meta\s+name=["']description["']/i.test(html)) {
    html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${escapeHtml(meta.description)}" />`);
  } else {
    html = html.replace(/<\/head>/i, `  <meta name="description" content="${escapeHtml(meta.description)}" />\n</head>`);
  }

  // 3. Canonical URL
  if (/<link\s+rel=["']canonical["']/i.test(html)) {
    html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${meta.canonicalUrl}" />`);
  } else {
    html = html.replace(/<\/head>/i, `  <link rel="canonical" href="${meta.canonicalUrl}" />\n</head>`);
  }

  // 4. OpenGraph Tags
  const ogReplacements: Record<string, string> = {
    "og:title": meta.title,
    "og:description": meta.description,
    "og:url": meta.canonicalUrl,
    "og:image": meta.image,
    "og:image:alt": meta.imageAlt,
    "og:type": meta.type,
  };

  for (const [prop, val] of Object.entries(ogReplacements)) {
    const regex = new RegExp(`<meta\\s+property=["']${prop}["'][^>]*>`, "i");
    if (regex.test(html)) {
      html = html.replace(regex, `<meta property="${prop}" content="${escapeHtml(val)}" />`);
    } else {
      html = html.replace(/<\/head>/i, `  <meta property="${prop}" content="${escapeHtml(val)}" />\n</head>`);
    }
  }

  // 5. Twitter Tags
  const twitterReplacements: Record<string, string> = {
    "twitter:title": meta.title,
    "twitter:description": meta.description,
    "twitter:image": meta.image,
  };

  for (const [name, val] of Object.entries(twitterReplacements)) {
    const regex = new RegExp(`<meta\\s+name=["']${name}["'][^>]*>`, "i");
    if (regex.test(html)) {
      html = html.replace(regex, `<meta name="${name}" content="${escapeHtml(val)}" />`);
    } else {
      html = html.replace(/<\/head>/i, `  <meta name="${name}" content="${escapeHtml(val)}" />\n</head>`);
    }
  }

  // 6. Product-specific OpenGraph meta
  if (meta.product) {
    const prodMeta = `
  <meta property="product:price:amount" content="${meta.product.price}" />
  <meta property="product:price:currency" content="VND" />
  <meta property="product:brand" content="${escapeHtml(meta.product.brand)}" />
  <meta property="product:availability" content="${meta.product.stock > 0 ? "in stock" : "out of stock"}" />`;
    html = html.replace(/<\/head>/i, `${prodMeta}\n</head>`);
  }

  // 7. Inject / replace JSON-LD Schemas
  const schemaScripts = meta.jsonLdSchemas.map((schema, i) => `
  <script id="schema-ssr-${i}" type="application/ld+json">
${JSON.stringify(schema, null, 2)}
  </script>`).join("\n");

  // Remove existing static placeholder scripts if present
  html = html.replace(/<script\s+id=["']schema-page-entity["'][\s\S]*?<\/script>/gi, "");
  html = html.replace(/<script\s+id=["']schema-local-business["'][\s\S]*?<\/script>/gi, "");

  // Insert fresh SSR schemas before </head>
  html = html.replace(/<\/head>/i, `${schemaScripts}\n</head>`);

  // 8. Inject Server-Side Semantic HTML into <div id="root">
  if (meta.prerenderHtml) {
    html = html.replace(
      /<div\s+id=["']root["']>[\s\S]*?<\/div>/i,
      `<div id="root">\n  <!-- SSR Pre-rendered Content for Search Crawlers -->\n  ${meta.prerenderHtml}\n</div>`
    );
  }

  return html;
}

function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Returns dynamic sitemap.xml generated on the fly
 */
export async function getDynamicSitemapXml(origin: string): Promise<string> {
  const { products, articles, lensBrands } = await getServerData();
  return generateSitemapXml(products, articles, lensBrands, origin);
}
