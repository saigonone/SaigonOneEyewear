import fs from "fs";
import path from "path";
import { 
  getServerData, 
  resolveRouteMetadata, 
  injectSSRMetadata, 
  getDynamicSitemapXml 
} from "../src/server/ssrHandler";
import { getProductSlug, getArticleSlug } from "../src/utils/slug";

async function runPrerender() {
  console.log("🚀 [Prerender] Starting static HTML prerendering...");

  const distDir = path.join(process.cwd(), "dist");
  const templatePath = path.join(distDir, "index.html");

  if (!fs.existsSync(templatePath)) {
    console.error("❌ [Prerender] dist/index.html not found! Please run 'vite build' first.");
    process.exit(1);
  }

  const rawHtml = fs.readFileSync(templatePath, "utf-8");
  const origin = "https://matkinhsaigonone.com";

  const { products, articles, lensBrands } = await getServerData();
  console.log(`📦 [Prerender] Found ${products.length} products, ${articles.length} articles, ${lensBrands.length} lens brands.`);

  const routes: string[] = [
    "/",
    "/gioi-thieu",
    "/lien-he",
    "/bang-gia-trong-kinh",
    "/cam-nang",
    "/san-pham",
    "/gong-kinh-can",
    "/kinh-ram-mat",
    "/kinh-doi-mau",
    "/trong-kinh",
    "/kinh-tre-em",
    "/phu-kien",
  ];

  // Add all products
  products.forEach((p) => {
    const slug = getProductSlug(p);
    if (slug) routes.push(`/san-pham/${slug}`);
  });

  // Add all articles
  articles.forEach((a) => {
    const slug = getArticleSlug(a);
    if (slug) routes.push(`/cam-nang/${slug}`);
  });

  // Add all lens brands
  lensBrands.forEach((b) => {
    if (b.slug) routes.push(`/trong-kinh/${b.slug}`);
  });

  console.log(`🌐 [Prerender] Generating static HTML for ${routes.length} total routes...`);

  let generatedCount = 0;
  for (const route of routes) {
    try {
      const meta = await resolveRouteMetadata(route, origin);
      const html = injectSSRMetadata(rawHtml, meta);

      const targetDir = route === "/" 
        ? distDir 
        : path.join(distDir, route.replace(/^\//, ""));

      fs.mkdirSync(targetDir, { recursive: true });
      fs.writeFileSync(path.join(targetDir, "index.html"), html, "utf-8");
      generatedCount++;
    } catch (err) {
      console.warn(`⚠️ [Prerender] Failed to prerender ${route}:`, err);
    }
  }

  // Also write dynamic sitemap.xml to dist/sitemap.xml
  try {
    const sitemapXml = await getDynamicSitemapXml(origin);
    fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemapXml, "utf-8");
    console.log("✅ [Prerender] Updated dist/sitemap.xml successfully.");
  } catch (err) {
    console.warn("⚠️ [Prerender] Failed to generate sitemap.xml:", err);
  }

  console.log(`🎉 [Prerender] Finished! Successfully generated ${generatedCount} static HTML pages in /dist.`);
  process.exit(0);
}

runPrerender().catch((err) => {
  console.error("❌ [Prerender Error]:", err);
  process.exit(1);
});
