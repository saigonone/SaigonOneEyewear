import React, { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Eye,
  Undo,
  Redo,
  Upload,
  Palette,
  Highlighter,
  Check,
  X,
  Type,
  AlertCircle,
  HelpCircle,
  Minus,
  Sparkles
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const TEXT_COLORS = [
  { name: "Mặc định (Đen)", value: "#0f172a" },
  { name: "Xanh Saigon One", value: "#2563eb" },
  { name: "Xanh lá ngọc", value: "#059669" },
  { name: "Đỏ nổi bật", value: "#dc2626" },
  { name: "Cam vàng hổ phách", value: "#d97706" },
  { name: "Tím thời trang", value: "#7c3aed" },
  { name: "Xám trung tính", value: "#64748b" },
];

const HIGHLIGHT_COLORS = [
  { name: "Không màu", value: "transparent" },
  { name: "Vàng nhạt (Highlight)", value: "#fef08a" },
  { name: "Xanh dương nhạt", value: "#dbeafe" },
  { name: "Xanh ngọc nhạt", value: "#dcfce7" },
  { name: "Hồng đào nhạt", value: "#ffe4e6" },
  { name: "Xám nhạt", value: "#f1f5f9" },
];

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Nhập nội dung bài viết cẩm nang...",
  minHeight = "320px",
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [viewMode, setViewMode] = useState<"visual" | "html" | "preview">("visual");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [imageAlign, setImageAlign] = useState<"center" | "left" | "right" | "full">("center");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [selectedTextColor, setSelectedTextColor] = useState("#0f172a");

  // Keep editor content in sync with external value if needed
  useEffect(() => {
    if (editorRef.current && viewMode === "visual") {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [viewMode]);

  // Execute standard formatting commands on document selection
  const execCmd = (command: string, arg: string | undefined = undefined) => {
    if (viewMode !== "visual") return;
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Insert Custom Blocks
  const insertCustomHTML = (html: string) => {
    if (viewMode === "html") {
      onChange(value + "\n" + html);
      return;
    }
    execCmd("insertHTML", html);
  };

  // Insert Callout / Highlight Box
  const handleInsertCallout = (type: "info" | "tip" | "warning") => {
    let calloutHtml = "";
    if (type === "info") {
      calloutHtml = `
<div style="padding: 16px 20px; background-color: #eff6ff; border-left: 4px solid #2563eb; border-radius: 8px; margin: 16px 0; color: #1e3a8a;">
  <strong>💡 Lời khuyên từ Saigon One:</strong> Nhập lời khuyên hoặc hướng dẫn chuyên môn tại đây...
</div>
`;
    } else if (type === "tip") {
      calloutHtml = `
<div style="padding: 16px 20px; background-color: #ecfdf5; border-left: 4px solid #059669; border-radius: 8px; margin: 16px 0; color: #065f46;">
  <strong>✓ Mẹo chọn kính:</strong> Gọng kính vừa vặn sẽ giúp tôn đường nét khuôn mặt và tạo cảm giác thoải mái suốt cả ngày.
</div>
`;
    } else {
      calloutHtml = `
<div style="padding: 16px 20px; background-color: #fffbeb; border-left: 4px solid #d97706; border-radius: 8px; margin: 16px 0; color: #92400e;">
  <strong>⚠️ Lưu ý quan trọng:</strong> Nên đo khám mắt định kỳ 6 tháng/lần tại cơ sở chuyên khoa khúc xạ y tế uy tín.
</div>
`;
    }
    insertCustomHTML(calloutHtml);
  };

  // Insert Image Action
  const handleInsertImage = () => {
    if (!imageUrl.trim()) return;
    let style = "max-width: 100%; height: auto; border-radius: 12px; margin: 16px auto; display: block; box-shadow: 0 4px 12px rgba(0,0,0,0.06);";
    if (imageAlign === "left") {
      style = "max-width: 45%; float: left; margin: 8px 16px 12px 0; border-radius: 10px;";
    } else if (imageAlign === "right") {
      style = "max-width: 45%; float: right; margin: 8px 0 12px 16px; border-radius: 10px;";
    } else if (imageAlign === "full") {
      style = "width: 100%; border-radius: 12px; margin: 20px 0; display: block;";
    }

    const captionHtml = imageCaption
      ? `<figcaption style="text-align: center; font-size: 13px; color: #64748b; margin-top: 6px; font-style: italic;">${imageCaption}</figcaption>`
      : "";

    const figureHtml = `
<figure style="margin: 16px 0; text-align: center;">
  <img src="${imageUrl}" alt="${imageCaption || 'Hình ảnh cẩm nang kính mắt Saigon One'}" style="${style}" />
  ${captionHtml}
</figure>
`;
    insertCustomHTML(figureHtml);
    setImageUrl("");
    setImageCaption("");
    setShowImageModal(false);
  };

  // Image Upload Local Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        const base64 = loadEvt.target?.result as string;
        if (base64) {
          setImageUrl(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Insert Link Action
  const handleInsertLink = () => {
    if (!linkUrl.trim()) return;
    const text = linkText.trim() || linkUrl;
    const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline; font-weight: 600;">${text}</a>`;
    insertCustomHTML(linkHtml);
    setLinkUrl("");
    setLinkText("");
    setShowLinkModal(false);
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-xs">
      
      {/* Top Toolbar */}
      <div className="bg-slate-50 border-b border-gray-200 p-2 flex flex-wrap items-center justify-between gap-1.5 select-none">
        
        {/* Left Toolbar Buttons */}
        <div className="flex flex-wrap items-center gap-1">
          
          {/* View Mode Toggle */}
          <div className="bg-slate-200/80 p-0.5 rounded-lg flex items-center gap-0.5 mr-2">
            <button
              type="button"
              onClick={() => setViewMode("visual")}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                viewMode === "visual" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
              title="Soạn thảo trực quan"
            >
              <Type className="w-3.5 h-3.5" />
              <span>Trực Quan</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("html")}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                viewMode === "html" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
              title="Mã nguồn HTML"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Mã HTML</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                viewMode === "preview" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
              title="Xem trước kết quả"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Xem Trước</span>
            </button>
          </div>

          {viewMode === "visual" && (
            <>
              {/* Headings */}
              <div className="flex items-center gap-0.5 border-r border-gray-200 pr-1.5 mr-1">
                <button
                  type="button"
                  onClick={() => execCmd("formatBlock", "<h2>")}
                  className="p-1.5 text-slate-700 hover:bg-slate-200 rounded text-xs font-bold transition-colors cursor-pointer"
                  title="Tiêu đề H2"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd("formatBlock", "<h3>")}
                  className="p-1.5 text-slate-700 hover:bg-slate-200 rounded text-xs font-bold transition-colors cursor-pointer"
                  title="Tiêu đề H3"
                >
                  <Heading3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd("formatBlock", "<p>")}
                  className="px-2 py-1 text-slate-700 hover:bg-slate-200 rounded text-xs font-medium transition-colors cursor-pointer"
                  title="Đoạn văn thường"
                >
                  Đoạn
                </button>
              </div>

              {/* Bold, Italic, Underline, Strikethrough */}
              <div className="flex items-center gap-0.5 border-r border-gray-200 pr-1.5 mr-1">
                <button
                  type="button"
                  onClick={() => execCmd("bold")}
                  className="p-1.5 text-slate-700 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                  title="In đậm (Ctrl+B)"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd("italic")}
                  className="p-1.5 text-slate-700 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                  title="In nghiêng (Ctrl+I)"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd("underline")}
                  className="p-1.5 text-slate-700 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                  title="Gạch chân (Ctrl+U)"
                >
                  <Underline className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd("strikeThrough")}
                  className="p-1.5 text-slate-700 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                  title="Gạch ngang chữ"
                >
                  <Strikethrough className="w-4 h-4" />
                </button>
              </div>

              {/* Text & Highlight Color Dropdown */}
              <div className="flex items-center gap-1 border-r border-gray-200 pr-1.5 mr-1 relative">
                {/* Text Color */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowColorPicker(!showColorPicker);
                      setShowHighlightPicker(false);
                    }}
                    className="p-1.5 text-slate-700 hover:bg-slate-200 rounded transition-colors flex items-center gap-1 cursor-pointer"
                    title="Màu chữ"
                  >
                    <Palette className="w-4 h-4 text-blue-600" />
                    <span className="w-2.5 h-2.5 rounded-full border border-gray-300" style={{ backgroundColor: selectedTextColor }}></span>
                  </button>

                  {showColorPicker && (
                    <div className="absolute top-full left-0 mt-1 z-30 bg-white border border-gray-200 rounded-xl shadow-xl p-2 w-48 space-y-1">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                        Chọn màu chữ
                      </div>
                      {TEXT_COLORS.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => {
                            execCmd("foreColor", c.value);
                            setSelectedTextColor(c.value);
                            setShowColorPicker(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 hover:bg-slate-100 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 rounded-full border border-gray-200 shadow-xs" style={{ backgroundColor: c.value }}></span>
                            <span className="font-medium text-slate-700">{c.name}</span>
                          </div>
                          {selectedTextColor === c.value && <Check className="w-3.5 h-3.5 text-blue-600" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Highlight Background Color */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowHighlightPicker(!showHighlightPicker);
                      setShowColorPicker(false);
                    }}
                    className="p-1.5 text-slate-700 hover:bg-slate-200 rounded transition-colors flex items-center gap-1 cursor-pointer"
                    title="Đánh dấu highlight màu nền"
                  >
                    <Highlighter className="w-4 h-4 text-amber-500" />
                  </button>

                  {showHighlightPicker && (
                    <div className="absolute top-full left-0 mt-1 z-30 bg-white border border-gray-200 rounded-xl shadow-xl p-2 w-52 space-y-1">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                        Màu highlight nền
                      </div>
                      {HIGHLIGHT_COLORS.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => {
                            execCmd("hiliteColor", c.value);
                            setShowHighlightPicker(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 hover:bg-slate-100 rounded-lg text-xs flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <span className="w-4 h-4 rounded border border-gray-200 shadow-xs" style={{ backgroundColor: c.value }}></span>
                          <span className="font-medium text-slate-700">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Alignments */}
              <div className="flex items-center gap-0.5 border-r border-gray-200 pr-1.5 mr-1">
                <button
                  type="button"
                  onClick={() => execCmd("justifyLeft")}
                  className="p-1.5 text-slate-700 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                  title="Căn trái"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd("justifyCenter")}
                  className="p-1.5 text-slate-700 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                  title="Căn giữa"
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd("justifyRight")}
                  className="p-1.5 text-slate-700 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                  title="Căn phải"
                >
                  <AlignRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd("justifyFull")}
                  className="p-1.5 text-slate-700 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                  title="Căn đều hai bên"
                >
                  <AlignJustify className="w-4 h-4" />
                </button>
              </div>

              {/* Lists & Quote */}
              <div className="flex items-center gap-0.5 border-r border-gray-200 pr-1.5 mr-1">
                <button
                  type="button"
                  onClick={() => execCmd("insertUnorderedList")}
                  className="p-1.5 text-slate-700 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                  title="Danh sách dấu chấm"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd("insertOrderedList")}
                  className="p-1.5 text-slate-700 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                  title="Danh sách số thứ tự"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd("formatBlock", "<blockquote>")}
                  className="p-1.5 text-slate-700 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                  title="Trích dẫn đoạn văn"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => execCmd("insertHorizontalRule")}
                  className="p-1.5 text-slate-700 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                  title="Đường kẻ phân cách ngang"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>

              {/* Link & Media Inserts */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(true)}
                  className="px-2 py-1 bg-white border border-gray-200 hover:bg-blue-50 hover:border-blue-300 text-slate-700 hover:text-blue-700 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                  title="Chèn liên kết URL"
                >
                  <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span>Chèn Link</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowImageModal(true)}
                  className="px-2 py-1 bg-white border border-gray-200 hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                  title="Chèn hình ảnh"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Chèn Ảnh</span>
                </button>

                {/* Quick Callout Presets */}
                <div className="flex items-center gap-1 ml-1">
                  <button
                    type="button"
                    onClick={() => handleInsertCallout("info")}
                    className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-xs font-medium flex items-center gap-1 cursor-pointer"
                    title="Chèn khung lời khuyên Saigon One"
                  >
                    <Sparkles className="w-3 h-3 text-blue-600" />
                    <span>Khung Lời Khuyên</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertCallout("warning")}
                    className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded text-xs font-medium flex items-center gap-1 cursor-pointer"
                    title="Chèn khung lưu ý"
                  >
                    <AlertCircle className="w-3 h-3 text-amber-600" />
                    <span>Khung Lưu Ý</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Status */}
        <div className="text-[11px] text-slate-400 flex items-center gap-2">
          <span>{value.replace(/<[^>]*>?/gm, "").length} ký tự</span>
          <span>•</span>
          <span>~{Math.max(1, Math.ceil(value.replace(/<[^>]*>?/gm, "").split(/\s+/).length / 200))} phút đọc</span>
        </div>
      </div>

      {/* Editor Body Area */}
      <div className="relative">
        
        {/* 1. Visual WYSIWYG Mode */}
        {viewMode === "visual" && (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            style={{ minHeight }}
            className="p-4 sm:p-6 text-sm sm:text-base text-slate-800 focus:outline-none overflow-y-auto leading-relaxed prose prose-slate max-w-none empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none"
            data-placeholder={placeholder}
          />
        )}

        {/* 2. Raw HTML Source Code Mode */}
        {viewMode === "html" && (
          <div className="p-2 bg-slate-900 text-slate-100 font-mono text-xs">
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              style={{ minHeight }}
              placeholder="Nhập mã HTML tùy chỉnh..."
              className="w-full h-full bg-transparent text-emerald-400 p-3 focus:outline-none resize-y font-mono leading-relaxed"
            />
          </div>
        )}

        {/* 3. Live Preview Mode */}
        {viewMode === "preview" && (
          <div
            style={{ minHeight }}
            className="p-6 sm:p-8 bg-slate-50/50 overflow-y-auto text-slate-800 prose prose-slate max-w-none text-sm sm:text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: value || "<p class='text-slate-400 italic'>Chưa có nội dung bài viết...</p>" }}
          />
        )}
      </div>

      {/* MODAL: Insert Image */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>Chèn Hình Ảnh Vào Bài Viết</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Đường dẫn ảnh (URL) hoặc Tải từ máy tính *
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Tải file</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Image Preview if available */}
              {imageUrl && (
                <div className="relative h-32 rounded-lg overflow-hidden border border-gray-200 bg-slate-100">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chú thích ảnh (Caption)
                </label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="Ví dụ: Đo mắt cận thị miễn phí tại Saigon One Eyewear..."
                  className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Vị trí canh lề ảnh
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setImageAlign("center")}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border text-center transition-colors cursor-pointer ${
                      imageAlign === "center"
                        ? "bg-blue-50 border-blue-400 text-blue-700"
                        : "bg-slate-50 border-gray-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    Ở Giữa
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageAlign("left")}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border text-center transition-colors cursor-pointer ${
                      imageAlign === "left"
                        ? "bg-blue-50 border-blue-400 text-blue-700"
                        : "bg-slate-50 border-gray-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    Trái (35%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageAlign("right")}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border text-center transition-colors cursor-pointer ${
                      imageAlign === "right"
                        ? "bg-blue-50 border-blue-400 text-blue-700"
                        : "bg-slate-50 border-gray-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    Phải (35%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageAlign("full")}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border text-center transition-colors cursor-pointer ${
                      imageAlign === "full"
                        ? "bg-blue-50 border-blue-400 text-blue-700"
                        : "bg-slate-50 border-gray-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    100% Khổ Rộng
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleInsertImage}
                disabled={!imageUrl.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Chèn Vào Bài Viết</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Insert Link */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-blue-600" />
                <span>Chèn Liên Kết Hyperlink</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Đường dẫn liên kết (URL) *
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://matkinhsaigonone.com/san-pham/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Văn bản hiển thị (Anchor Text)
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Ví dụ: Xem các mẫu gọng kính cận titanium..."
                  className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleInsertLink}
                disabled={!linkUrl.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Chèn Liên Kết</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
