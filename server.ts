import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { 
  resolveRouteMetadata, 
  injectSSRMetadata, 
  getDynamicSitemapXml 
} from "./src/server/ssrHandler";

async function startServer() {
  const app = express();
  const PORT = 3000;
  const isProd = process.env.NODE_ENV === "production";

  console.log(`[Server] Starting in ${isProd ? "PRODUCTION" : "DEVELOPMENT"} mode...`);

  // 1. Health API
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      service: "saigon-one-eyewear-ssr",
      mode: isProd ? "production" : "development",
      timestamp: new Date().toISOString()
    });
  });

  // 2. Dynamic Sitemap on the fly
  app.get(["/sitemap.xml", "/api/sitemap.xml"], async (req, res) => {
    try {
      const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
      const host = req.headers["x-forwarded-host"] || req.get("host") || "matkinhsaigonone.com";
      const origin = `${protocol}://${host}`;
      const xml = await getDynamicSitemapXml(origin);
      res.header("Content-Type", "application/xml; charset=utf-8");
      res.send(xml);
    } catch (err) {
      console.error("[Sitemap Error]", err);
      // Fallback to static sitemap if available
      const staticSitemap = path.join(process.cwd(), isProd ? "dist" : "public", "sitemap.xml");
      if (fs.existsSync(staticSitemap)) {
        res.sendFile(staticSitemap);
      } else {
        res.status(500).send("Error generating sitemap");
      }
    }
  });

  // 3. robots.txt
  app.get("/robots.txt", (req, res) => {
    const robotsPath = isProd 
      ? path.join(process.cwd(), "dist", "robots.txt")
      : path.join(process.cwd(), "public", "robots.txt");
    if (fs.existsSync(robotsPath)) {
      res.sendFile(robotsPath);
    } else {
      res.type("text/plain").send("User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /quan-tri\nDisallow: /tra-cuu-don-hang\nSitemap: https://matkinhsaigonone.com/sitemap.xml");
    }
  });

  let vite: any = null;
  if (!isProd) {
    // Development: integrate Vite as middleware
    vite = await createViteServer({
      server: { 
        middlewareMode: true,
        host: "0.0.0.0",
        port: 3000
      },
      appType: "custom",
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve static assets from dist
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, { index: false }));
  }

  // 4. Server-Side Rendering & Dynamic Meta Injection for all web routes
  app.get("*", async (req, res, next) => {
    const url = req.originalUrl;

    // Skip static assets (e.g. .js, .css, .png, .jpg, .ico, .svg, etc.)
    if (url.includes(".") && !url.endsWith(".html")) {
      return next();
    }

    try {
      const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
      const host = req.headers["x-forwarded-host"] || req.get("host") || "matkinhsaigonone.com";
      const origin = `${protocol}://${host}`;

      let rawHtml = "";
      if (!isProd) {
        const templatePath = path.join(process.cwd(), "index.html");
        rawHtml = fs.readFileSync(templatePath, "utf-8");
        // Vite transforms module scripts and injects Vite HMR client
        rawHtml = await vite.transformIndexHtml(url, rawHtml);
      } else {
        const distIndexPath = path.join(process.cwd(), "dist", "index.html");
        if (fs.existsSync(distIndexPath)) {
          rawHtml = fs.readFileSync(distIndexPath, "utf-8");
        } else {
          rawHtml = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf-8");
        }
      }

      // Resolve metadata specific to this page (Product, Article, Category, etc.)
      const meta = await resolveRouteMetadata(url, origin);

      // Inject the dynamic metadata (title, meta description, og:*, twitter:*, schema JSON-LD, and SSR content)
      const finalHtml = injectSSRMetadata(rawHtml, meta);

      res.status(200).set({ "Content-Type": "text/html; charset=utf-8" }).send(finalHtml);
    } catch (e: any) {
      if (!isProd && vite) {
        vite.ssrFixStacktrace(e);
      }
      console.error(`[SSR Error on ${url}]:`, e);
      next(e);
    }
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✨ Sài Gòn One Eyewear SSR Server is live on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
