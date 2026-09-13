import React, { useState } from "react";
import { AlertTriangle, Trash2, X, ShieldAlert, CheckCircle2, Loader2 } from "lucide-react";

export type DeletableItemType = 
  | "product" 
  | "article" 
  | "lens_article" 
  | "banner" 
  | "lens_brand" 
  | "article_category" 
  | "product_category" 
  | "admin" 
  | "appointment";

export interface ConfirmDeleteModalProps {
  isOpen: boolean;
  itemType: DeletableItemType;
  itemTitle: string;
  itemId?: string;
  itemImage?: string;
  itemSubtitle?: string;
  onConfirm: () => Promise<void> | void;
  onClose: () => void;
}

const TYPE_CONFIG: Record<DeletableItemType, { label: string; badgeColor: string; icon: string }> = {
  product: {
    label: "Sản Phẩm Kính Mắt",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "👓",
  },
  article: {
    label: "Bài Viết Cẩm Nang / Tin Tức",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: "📰",
  },
  lens_article: {
    label: "Bài Viết Tròng Kính Chuyên Sâu",
    badgeColor: "bg-cyan-100 text-cyan-800 border-cyan-200",
    icon: "🔬",
  },
  banner: {
    label: "Banner Trang Chủ",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    icon: "🖼️",
  },
  lens_brand: {
    label: "Thương Hiệu Tròng Kính",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
    icon: "🏷️",
  },
  article_category: {
    label: "Chuyên Mục Bài Viết",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    icon: "📁",
  },
  product_category: {
    label: "Danh Mục Sản Phẩm",
    badgeColor: "bg-violet-100 text-violet-800 border-violet-200",
    icon: "📂",
  },
  admin: {
    label: "Tài Khoản Quản Trị Viên",
    badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
    icon: "🛡️",
  },
  appointment: {
    label: "Lịch Hẹn Đo Mắt Khách Hàng",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    icon: "📅",
  },
};

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  itemType,
  itemTitle,
  itemId,
  itemImage,
  itemSubtitle,
  onConfirm,
  onClose,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const typeInfo = TYPE_CONFIG[itemType] || {
    label: "Mục Dữ Liệu",
    badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
    icon: "⚠️",
  };

  const isConfirmed = isChecked && (
    confirmInput.trim().toUpperCase() === "XÓA" || 
    confirmInput.trim().toUpperCase() === "XOA"
  );

  const handleExecuteDelete = async () => {
    if (!isConfirmed || isDeleting) return;
    setIsDeleting(true);
    setErrorMsg("");
    try {
      await onConfirm();
      onClose();
    } catch (err: any) {
      console.error("[ConfirmDeleteModal] Lỗi khi thực hiện xóa:", err);
      setErrorMsg(err?.message || "Đã xảy ra lỗi khi xóa dữ liệu. Vui lòng thử lại.");
      setIsDeleting(false);
    }
  };

  const handleResetAndClose = () => {
    if (isDeleting) return;
    setIsChecked(false);
    setConfirmInput("");
    setErrorMsg("");
    onClose();
  };

  return (
    <div 
      id="confirm-delete-modal-overlay"
      className="fixed inset-0 z-100 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) {
          handleResetAndClose();
        }
      }}
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-rose-100 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        {/* Header with Security Red Accent */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-rose-600 via-rose-700 to-red-700 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs text-white">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Xác Nhận Xóa An Toàn (Bảo Vệ Kép)</h3>
              <p className="text-[11px] text-rose-100 font-medium">
                Ngăn ngừa tuyệt đối thao tác bấm nhầm hoặc mất dữ liệu vô ý
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            disabled={isDeleting}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            title="Đóng / Giữ lại"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Target Item Card Summary */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3.5">
            {itemImage ? (
              <img
                src={itemImage}
                alt={itemTitle}
                className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0 bg-white"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center text-xl shrink-0 font-bold">
                {typeInfo.icon}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`px-2 py-0.5 text-[11px] font-bold rounded-md border ${typeInfo.badgeColor}`}>
                  {typeInfo.label}
                </span>
                {itemId && (
                  <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                    ID: {itemId}
                  </span>
                )}
              </div>
              <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                {itemTitle || "Không có tên"}
              </h4>
              {itemSubtitle && (
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{itemSubtitle}</p>
              )}
            </div>
          </div>

          {/* Warning Message Box */}
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-900 leading-relaxed">
              <p className="font-bold mb-0.5">Cảnh báo hành động vĩnh viễn:</p>
              <p className="text-rose-800">
                Mục này sẽ được xóa khỏi cơ sở dữ liệu Firebase. Để đảm bảo an toàn tuyệt đối và tránh vô tình bấm nhầm, vui lòng hoàn tất xác thực 2 bước sau:
              </p>
            </div>
          </div>

          {/* Verification Step 1: Mandatory Checkbox */}
          <label className="flex items-start gap-3 p-3 bg-amber-50/70 border border-amber-200 rounded-xl cursor-pointer hover:bg-amber-50 transition-colors">
            <input
              type="checkbox"
              id="confirm-delete-checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              disabled={isDeleting}
              className="mt-0.5 w-4 h-4 text-rose-600 rounded border-amber-300 focus:ring-rose-500 cursor-pointer"
            />
            <span className="text-xs text-amber-950 font-medium leading-normal select-none">
              <strong>Bước 1:</strong> Tôi đã kiểm tra đúng mục cần xóa và xác nhận muốn xóa mục này khỏi cơ sở dữ liệu.
            </span>
          </label>

          {/* Verification Step 2: Type Confirmation Word */}
          <div className="space-y-1.5">
            <label 
              htmlFor="confirm-delete-text-input" 
              className="block text-xs font-bold text-slate-700"
            >
              <strong>Bước 2:</strong> Nhập chính xác chữ <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 font-mono font-black rounded text-xs">XÓA</span> vào ô dưới để mở khóa:
            </label>
            <div className="relative">
              <input
                id="confirm-delete-text-input"
                type="text"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                disabled={!isChecked || isDeleting}
                placeholder={isChecked ? "Gõ XÓA để xác nhận" : "Vui lòng tick chọn Bước 1 trước..."}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border transition-all ${
                  !isChecked 
                    ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                    : isConfirmed
                    ? "bg-emerald-50 text-emerald-900 border-emerald-300 ring-2 ring-emerald-400/20"
                    : "bg-white text-slate-900 border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-400/20"
                }`}
                autoComplete="off"
              />
              {isConfirmed && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 absolute right-3 top-2.5 animate-in zoom-in" />
              )}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            type="button"
            id="btn-cancel-delete"
            onClick={handleResetAndClose}
            disabled={isDeleting}
            className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
          >
            Hủy Bỏ / Giữ Lại
          </button>

          <button
            type="button"
            id="btn-confirm-delete-permanent"
            onClick={handleExecuteDelete}
            disabled={!isConfirmed || isDeleting}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              isConfirmed && !isDeleting
                ? "bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/25 cursor-pointer transform active:scale-95"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang Xóa An Toàn...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Xác Nhận Xóa Vĩnh Viễn</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
