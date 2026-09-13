import React, { useState } from "react";
import { 
  Download, 
  Database, 
  CheckCircle2, 
  ShieldCheck, 
  FileJson, 
  X, 
  Package, 
  BookOpen, 
  Layers, 
  SlidersHorizontal, 
  ShoppingBag, 
  Calendar, 
  FolderTree,
  HardDrive
} from "lucide-react";
import { Product, Article, BannerSlide, LensBrandCategory, ArticleCategory, ProductCategoryItem, Order, Appointment } from "../types";

export interface AdminBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  articles: Article[];
  lensArticles: Article[];
  banners: BannerSlide[];
  lensBrands: LensBrandCategory[];
  orders: Order[];
  appointments: Appointment[];
  articleCategories: ArticleCategory[];
  productCategories: ProductCategoryItem[];
}

export const AdminBackupModal: React.FC<AdminBackupModalProps> = ({
  isOpen,
  onClose,
  products,
  articles,
  lensArticles,
  banners,
  lensBrands,
  orders,
  appointments,
  articleCategories,
  productCategories,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [lastExportTime, setLastExportTime] = useState<string | null>(null);
  const [downloadedFileName, setDownloadedFileName] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalRecords = 
    products.length + 
    articles.length + 
    lensArticles.length + 
    banners.length + 
    lensBrands.length + 
    orders.length + 
    appointments.length + 
    articleCategories.length + 
    productCategories.length;

  const handleExportJSON = () => {
    try {
      setIsExporting(true);
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");
      const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
      const timeStr = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
      const fileName = `saigonone_backup_${dateStr}_${timeStr}.json`;

      const backupData = {
        backupMetadata: {
          system: "Mắt Kính Sài Gòn One - Hệ Thống Quản Trị Trung Tâm",
          exportTimestamp: now.toISOString(),
          exportDateFormatted: `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
          version: "2.0",
          totalRecords,
          summary: {
            productsCount: products.length,
            articlesCount: articles.length,
            lensArticlesCount: lensArticles.length,
            bannersCount: banners.length,
            lensBrandsCount: lensBrands.length,
            ordersCount: orders.length,
            appointmentsCount: appointments.length,
            articleCategoriesCount: articleCategories.length,
            productCategoriesCount: productCategories.length,
          }
        },
        data: {
          products,
          articles,
          lensArticles,
          banners,
          lensBrands,
          orders,
          appointments,
          articleCategories,
          productCategories,
        }
      };

      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setLastExportTime(backupData.backupMetadata.exportDateFormatted);
      setDownloadedFileName(fileName);
      setIsExporting(false);
    } catch (err) {
      console.error("[Backup] Lỗi khi trích xuất file JSON:", err);
      alert("Đã xảy ra sự cố khi chuẩn bị file sao lưu. Vui lòng thử lại!");
      setIsExporting(false);
    }
  };

  const statItems = [
    { label: "Sản phẩm kính mắt", count: products.length, icon: Package, color: "text-blue-600 bg-blue-50" },
    { label: "Cẩm nang & Tin tức", count: articles.length, icon: BookOpen, color: "text-emerald-600 bg-emerald-50" },
    { label: "Bài viết tròng kính", count: lensArticles.length, icon: Layers, color: "text-cyan-600 bg-cyan-50" },
    { label: "Banner trang chủ", count: banners.length, icon: SlidersHorizontal, color: "text-amber-600 bg-amber-50" },
    { label: "Thương hiệu tròng kính", count: lensBrands.length, icon: Layers, color: "text-indigo-600 bg-indigo-50" },
    { label: "Đơn hàng khách", count: orders.length, icon: ShoppingBag, color: "text-purple-600 bg-purple-50" },
    { label: "Lịch hẹn đo mắt", count: appointments.length, icon: Calendar, color: "text-rose-600 bg-rose-50" },
    { label: "Danh mục & Chuyên mục", count: articleCategories.length + productCategories.length, icon: FolderTree, color: "text-slate-600 bg-slate-100" },
  ];

  return (
    <div 
      className="fixed inset-0 z-100 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-xs text-white">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Sao Lưu Dữ Liệu Toàn Bộ Hệ Thống (Export JSON)</h3>
              <p className="text-[11px] text-emerald-100 font-medium">
                Tải bản snapshot đầy đủ của toàn bộ cơ sở dữ liệu về máy tính an toàn
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Top Notice */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3.5">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-950 leading-relaxed">
              <p className="font-bold text-emerald-900 mb-1">Bảo Vệ Dữ Liệu An Toàn Tuyệt Đối</p>
              <p className="text-emerald-800">
                Tính năng này sẽ trích xuất 100% dữ liệu đang lưu trên Firestore & RTDB thành tệp tin định dạng JSON chuẩn. 
                Bạn có thể lưu trữ tệp này vào USB, Google Drive hoặc máy tính cá nhân để dự phòng bất cứ lúc nào.
              </p>
            </div>
          </div>

          {/* Records Breakdown Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" />
                <span>Bảng Thống Kê Bản Ghi Sẽ Được Sao Lưu:</span>
              </h4>
              <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                Tổng cộng: {totalRecords} bản ghi
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {statItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg shrink-0 ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-extrabold text-slate-900 leading-none">{item.count}</div>
                      <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">{item.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Success Download Badge if exported */}
          {lastExportTime && (
            <div className="p-3.5 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
              <div className="text-xs text-green-900">
                <span className="font-bold">Đã tải về máy tính thành công:</span>{" "}
                <span className="font-mono text-[11px] bg-green-100/80 px-1.5 py-0.5 rounded text-green-800">
                  {downloadedFileName}
                </span>{" "}
                (Thời điểm: {lastExportTime})
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <FileJson className="w-4 h-4 text-slate-400" />
            <span>Định dạng JSON chuẩn UTF-8</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Đóng
            </button>

            <button
              type="button"
              id="btn-trigger-export-json"
              onClick={handleExportJSON}
              disabled={isExporting}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? "Đang Trích Xuất..." : "Tải Về Máy Tính Ngay (Export JSON)"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
