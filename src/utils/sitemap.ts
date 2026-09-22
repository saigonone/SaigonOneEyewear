import { Product, Article, LensBrandCategory } from "../types";
import { getProductSlug, getArticleSlug } from "./slug";

/**
 * Escapes special XML characters
 */
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}

/**
 * Generates dynamic XML Sitemap according to sitemaps.org & Google Search Console specifications
 */
export function generateSitemapXml(
  products: Product[] = [],
  articles: Article[] = [],
  lensBrands: LensBrandCategory[] = [],
  baseUrl?: string
): string {
  const domain = (baseUrl || (typeof window !== "undefined" ? window.location.origin : "https://matkinhsaigonone.com")).replace(/\/+$/, "");
  const today = new Date().toISOString().split("T")[0];

  interface SitemapEntry {
    loc: string;
    lastmod: string;
    changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
    priority: string;
    image?: {
      loc: string;
      title?: string;
    };
  }

  const entries: SitemapEntry[] = [
    // 1. Core Pages
    { loc: `${domain}/`, lastmod: today, changefreq: "daily", priority: "1.0" },
    { loc: `${domain}/san-pham`, lastmod: today, changefreq: "daily", priority: "0.9" },
    { loc: `${domain}/gong-kinh`, lastmod: today, changefreq: "weekly", priority: "0.9" },
    { loc: `${domain}/kinh-thoi-trang`, lastmod: today, changefreq: "weekly", priority: "0.9" },
    { loc: `${domain}/trong-kinh`, lastmod: today, changefreq: "daily", priority: "0.9" },
    { loc: `${domain}/kinh-ap-trong`, lastmod: today, changefreq: "weekly", priority: "0.8" },
    { loc: `${domain}/thu-kinh-ar`, lastmod: today, changefreq: "weekly", priority: "0.8" },
    { loc: `${domain}/cam-nang`, lastmod: today, changefreq: "daily", priority: "0.8" },
    { loc: `${domain}/gioi-thieu`, lastmod: today, changefreq: "monthly", priority: "0.7" },
    { loc: `${domain}/lien-he`, lastmod: today, changefreq: "monthly", priority: "0.8" }
  ];

  // 2. Lens Brands
  lensBrands.forEach((brand) => {
    if (!brand.slug) return;
    entries.push({
      loc: `${domain}/trong-kinh/${encodeURIComponent(brand.slug)}`,
      lastmod: today,
      changefreq: "weekly",
      priority: "0.8",
      image: brand.logo ? { loc: brand.logo, title: brand.name } : undefined
    });
  });

  // 3. Articles & News
  articles.forEach((art) => {
    const slug = getArticleSlug(art);
    if (!slug) return;
    const lastmod = art.publishedAt ? art.publishedAt.split("T")[0] : today;
    entries.push({
      loc: `${domain}/cam-nang/${encodeURIComponent(slug)}`,
      lastmod,
      changefreq: "weekly",
      priority: "0.75",
      image: art.thumbnail ? { loc: art.thumbnail, title: art.title } : undefined
    });
  });

  // 4. Products
  products.forEach((prod) => {
    const slug = getProductSlug(prod);
    if (!slug) return;
    const img = (prod.images && prod.images.length > 0) ? prod.images[0] : undefined;
    entries.push({
      loc: `${domain}/san-pham/${encodeURIComponent(slug)}`,
      lastmod: today,
      changefreq: "daily",
      priority: "0.85",
      image: img ? { loc: img, title: `${prod.name} - ${prod.brand}` } : undefined
    });
  });

  // Build XML String
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  entries.forEach((entry) => {
    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(entry.loc)}</loc>\n`;
    xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    xml += `    <priority>${entry.priority}</priority>\n`;
    if (entry.image && entry.image.loc) {
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${escapeXml(entry.image.loc)}</image:loc>\n`;
      if (entry.image.title) {
        xml += `      <image:title>${escapeXml(entry.image.title)}</image:title>\n`;
      }
      xml += `    </image:image>\n`;
    }
    xml += `  </url>\n`;
  });

  xml += `</urlset>\n`;
  return xml;
}

/**
 * Triggers a browser download of the sitemap XML file
 */
export function downloadSitemapFile(xmlContent: string, fileName: string = "sitemap.xml") {
  if (typeof window === "undefined") return;
  const blob = new Blob([xmlContent], { type: "application/xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
