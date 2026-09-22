import React, { useState } from "react";
import { 
  Globe, 
  FileText, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Copy, 
  Check, 
  Search, 
  MapPin, 
  Tag, 
  Code2, 
  Sparkles, 
  RefreshCw 
} from "lucide-react";
import { Product, Article, LensBrandCategory } from "../types";
import { generateSitemapXml, downloadSitemapFile } from "../utils/sitemap";
import { STORE_SEO_CONFIG, generateLocalBusinessSchema, generateProductSchema } from "../utils/seo";

interface AdminSEOManagerProps {
  products: Product[];
  articles: Article[];
  lensBrands: LensBrandCategory[];
}

export const AdminSEOManager: React.FC<AdminSEOManagerProps> = ({
  products,
  articles,
  lensBrands,
}) => {
  const [copiedSitemap, setCopiedSitemap] = useState(false);
  const [copiedRobots, setCopiedRobots] = useState(false);
  const [activeSchemaTab, setActiveSchemaTab] = useState<"local" | "product">("local");
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://matkinhsaigonone.com";
  const sitemapUrl = `${origin}/sitemap.xml`;
  const robotsUrl = `${origin}/robots.txt`;

  // Calculate statistics
  const corePagesCount = 10;
  const brandPagesCount = lensBrands.length;
  const articlePagesCount = articles.length;
  const productPagesCount = products.length;
  const totalIndexedUrls = corePagesCount + brandPagesCount + articlePagesCount + productPagesCount;

  const handleDownloadSitemap = () => {
    const xml = generateSitemapXml(products, articles, lensBrands, origin);
    downloadSitemapFile(xml, "sitemap.xml");
  };

  const handleCopySitemapUrl = () => {
    navigator.clipboard.writeText(sitemapUrl);
    setCopiedSitemap(true);
    setTimeout(() => setCopiedSitemap(false), 2000);
  };

  const handleCopyRobotsUrl = () => {
    navigator.clipboard.writeText(robotsUrl);
    setCopiedRobots(true);
    setTimeout(() => setCopiedRobots(false), 2000);
  };

  const sampleProduct = products[selectedProductIndex] || products[0];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold mb-3 border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SEO Toàn Diện &amp; Google Search Console</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Tối Ưu Hóa Tìm Kiếm (SEO) &amp; Schema JSON-LD</h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              Hệ thống tự động cập nhật thẻ Dynamic Meta Tags (Title, Description, OG Image), dữ liệu có cấu trúc Schema.org 
              (LocalBusiness, Product, Article) và sơ đồ trang web sitemap.xml cho GoogleBot.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadSitemap}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Tải file sitemap.xml</span>
            </button>
            <a
              href="https://search.google.com/test/rich-results"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border border-slate-700"
            >
              <ExternalLink className="w-4 h-4 text-cyan-400" />
              <span>Kiểm tra Google Rich Results</span>
            </a>
          </div>
        </div>
      </div>

      {/* 4 Feature Checklist Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Tag className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Hoạt động
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-800">Dynamic Meta Tags</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Tự động đổi Title, Description, OpenGraph, Canonical theo từng sản phẩm &amp; bài viết cụ thể.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Code2 className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Chuẩn JSON-LD
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-800">Schema Markup</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Nhúng mã Schema.org: Optician, LocalBusiness, Product (giá, ảnh, tồn kho) và Article tin tức.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Globe className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Sẵn sàng
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-800">Sơ Đồ Sitemap.xml</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Tự động tổng hợp {totalIndexedUrls} URL bao gồm sản phẩm, bài viết và danh mục để nộp Google Search Console.
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <FileText className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Chuẩn SEO
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-800">Cấu Hình robots.txt</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Mở index công khai toàn bộ sản phẩm, chặn bot crawl vào trang nhạy cảm như /admin và /tra-cuu-don-hang.
          </p>
        </div>
      </div>

      {/* Sitemap & Robots Integration Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sitemap Box */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-800">Sơ Đồ Trang Web (sitemap.xml)</h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">
              {totalIndexedUrls} Liên kết hợp lệ
            </span>
          </div>

          <p className="text-xs text-slate-600 mb-4 leading-relaxed">
            Đường dẫn nộp sitemap chính thức cho Google Search Console và Bing Webmaster Tools:
          </p>

          <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 mb-4 font-mono text-xs text-slate-700">
            <span className="truncate flex-1">{sitemapUrl}</span>
            <button
              onClick={handleCopySitemapUrl}
              className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors cursor-pointer"
              title="Sao chép URL Sitemap"
            >
              {copiedSitemap ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 hover:bg-slate-200 text-blue-600 rounded-lg transition-colors"
              title="Mở sitemap.xml trong tab mới"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Breakdown numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs mb-4">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="block text-slate-400 font-semibold text-[10px] uppercase">Trang Cố Định</span>
              <span className="font-bold text-slate-800 text-base">{corePagesCount}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="block text-slate-400 font-semibold text-[10px] uppercase">Thương Hiệu Tròng</span>
              <span className="font-bold text-slate-800 text-base">{brandPagesCount}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="block text-slate-400 font-semibold text-[10px] uppercase">Cẩm Nang / Tin</span>
              <span className="font-bold text-slate-800 text-base">{articlePagesCount}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="block text-slate-400 font-semibold text-[10px] uppercase">Sản Phẩm</span>
              <span className="font-bold text-blue-600 text-base">{productPagesCount}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleDownloadSitemap}
              className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-blue-400" />
              <span>Tải file sitemap.xml</span>
            </button>
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Vào Search Console</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Robots.txt Box */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-800">Quy Tắc Thu Thập (robots.txt)</h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full">
              Hợp Lệ
            </span>
          </div>

          <p className="text-xs text-slate-600 mb-4 leading-relaxed">
            Tệp tin chỉ dẫn trực tiếp cho Googlebot, Googlebot-Image và Bingbot:
          </p>

          <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 mb-4 font-mono text-xs text-slate-700">
            <span className="truncate flex-1">{robotsUrl}</span>
            <button
              onClick={handleCopyRobotsUrl}
              className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors cursor-pointer"
              title="Sao chép URL robots.txt"
            >
              {copiedRobots ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 hover:bg-slate-200 text-indigo-600 rounded-lg transition-colors"
              title="Mở robots.txt trong tab mới"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="bg-slate-900 rounded-xl p-3 text-slate-300 font-mono text-[11px] leading-relaxed max-h-[148px] overflow-y-auto mb-4 border border-slate-800">
            <span className="text-slate-500"># robots.txt Sài Gòn One Eyewear</span><br />
            <span className="text-blue-400">User-agent:</span> *<br />
            <span className="text-emerald-400">Allow:</span> /<br />
            <span className="text-rose-400">Disallow:</span> /admin<br />
            <span className="text-rose-400">Disallow:</span> /quan-tri<br />
            <span className="text-rose-400">Disallow:</span> /tra-cuu-don-hang<br />
            <span className="text-cyan-400">Sitemap:</span> {sitemapUrl}
          </div>

          <div className="flex justify-end">
            <a
              href="/robots.txt"
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Xem trực tiếp file robots.txt</span>
            </a>
          </div>
        </div>
      </div>

      {/* Schema.org (JSON-LD) Inspector */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-800 text-base">Xem Trước Cấu Trúc Dữ Liệu Schema.org (JSON-LD)</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Google sử dụng các định dạng dữ liệu này để hiển thị Rich Snippets (sao đánh giá, giá tiền, địa chỉ, logo) trên trang tìm kiếm.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveSchemaTab("local")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeSchemaTab === "local" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              LocalBusiness (Cửa Hàng)
            </button>
            <button
              onClick={() => setActiveSchemaTab("product")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeSchemaTab === "product" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Product (Sản Phẩm)
            </button>
          </div>
        </div>

        {activeSchemaTab === "local" ? (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                Dữ liệu định vị cửa hàng tại: {STORE_SEO_CONFIG.fullAddress}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Type: Optician / LocalBusiness / MedicalBusiness</span>
            </div>
            <pre className="bg-slate-950 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-[360px] leading-relaxed border border-slate-800">
              {JSON.stringify(generateLocalBusinessSchema(origin), null, 2)}
            </pre>
          </div>
        ) : (
          <div>
            <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">Chọn sản phẩm mẫu:</span>
                <select
                  value={selectedProductIndex}
                  onChange={(e) => setSelectedProductIndex(Number(e.target.value))}
                  className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 cursor-pointer"
                >
                  {products.slice(0, 15).map((p, idx) => (
                    <option key={p.id} value={idx}>
                      {p.name} ({p.brand})
                    </option>
                  ))}
                </select>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Type: Product / Offer / AggregateRating</span>
            </div>
            <pre className="bg-slate-950 text-cyan-400 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-[360px] leading-relaxed border border-slate-800">
              {sampleProduct 
                ? JSON.stringify(generateProductSchema(sampleProduct, `${origin}/san-pham/${sampleProduct.slug || sampleProduct.id}`), null, 2)
                : "// Không có sản phẩm"}
            </pre>
          </div>
        )}
      </div>

      {/* Guide & Instructions */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
        <h4 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2">
          <Search className="w-4 h-4 text-blue-600" />
          Hướng Dẫn Nộp Sitemap Vào Google Search Console
        </h4>
        <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600 leading-relaxed">
          <li>
            Đăng nhập vào tài khoản <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" className="text-blue-600 font-bold underline">Google Search Console</a> của bạn.
          </li>
          <li>
            Thêm thuộc tính website với tên miền <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 font-bold">{origin}</span> (hoặc tên miền chính thức của cửa hàng).
          </li>
          <li>
            Tại menu bên trái, nhấp chọn mục <span className="font-bold text-slate-800">"Sơ đồ trang web" (Sitemaps)</span>.
          </li>
          <li>
            Nhập <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 font-bold">sitemap.xml</span> vào ô và bấm <span className="font-bold text-blue-600">"Gửi" (Submit)</span>.
          </li>
          <li>
            Googlebot sẽ tự động lập chỉ mục đầy đủ các danh mục kính, bài viết cẩm nang và sản phẩm gọng kính mới nhất.
          </li>
        </ol>
      </div>
    </div>
  );
};
