import React, { useState, useRef, useEffect } from "react";
import { 
  X, 
  Send, 
  Bot, 
  Glasses, 
  Phone,
  MessageSquare,
  ArrowUp
} from "lucide-react";
import { ZaloAppIcon } from "./BrandIcons";

interface EyewearAiChatProps {
  onOpenTryOn: () => void;
  onOpenFaceAdvisor: () => void;
  onOpenLensGuide: () => void;
  onOpenStores: () => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  actions?: { label: string; action: () => void }[];
}

export const EyewearAiChat: React.FC<EyewearAiChatProps> = ({
  onOpenTryOn,
  onOpenFaceAdvisor,
  onOpenLensGuide,
  onOpenStores,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "bot",
      text: "Xin chào quý khách! Em là Trợ Lý Kính Mắt. Em có thể tư vấn dáng kính hợp khuôn mặt, chất liệu gọng kính, thông số kích thước và liên hệ đặt hàng qua Zalo: 0973.819.928. Quý khách đang cần tìm mẫu kính gì ạ?",
      timestamp: "Vừa xong",
      actions: [
        { label: "💬 Chat Zalo: 0973.819.928", action: () => window.open("https://zalo.me/0973819928", "_blank") },
        { label: "📸 Thử kính AR 3D", action: onOpenTryOn },
        { label: "✨ Tư vấn dáng mặt", action: onOpenFaceAdvisor },
        { label: "📍 Địa chỉ cửa hàng", action: onOpenStores },
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputMessage.trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");

    setTimeout(() => {
      let botResponse = "";
      let botActions: { label: string; action: () => void }[] | undefined = undefined;
      const lower = query.toLowerCase();

      if (lower.includes("mặt tròn") || lower.includes("mat tron")) {
        botResponse = "Với gương mặt tròn, quý khách nên ưu tiên chọn các mẫu Gọng Kính Vuông, Gọng Đa Giác Titan hoặc Dáng Mắt Mèo để gương mặt trông góc cạnh, thon gọn hơn!";
        botActions = [
          { label: "Xem gợi ý kính mặt tròn", action: onOpenFaceAdvisor },
          { label: "Thử kính AR ngay", action: onOpenTryOn }
        ];
      } else if (lower.includes("địa chỉ") || lower.includes("ở đâu") || lower.includes("chi nhánh")) {
        botResponse = "Showroom Saigon One Eyewear tại 178 Phan Đăng Lưu, Phường Đức Nhuận, TP.HCM, mở cửa 08:30 - 21:00 tất cả các ngày trong tuần. Quý khách liên hệ Zalo 0973.819.928 để được hỗ trợ định vị và đặt lịch hẹn đo mắt!";
        botActions = [
          { label: "Chỉ đường chi nhánh", action: onOpenStores },
          { label: "Chat Zalo ngay", action: () => window.open("https://zalo.me/0973819928", "_blank") }
        ];
      } else {
        botResponse = "Quý khách có thể bấm nút chat Zalo bên dưới hoặc gọi hotline 0973.819.928 để được chuyên viên gửi ảnh và video thực tế sản phẩm chi tiết nhất!";
        botActions = [
          { label: "💬 Nhắn Zalo: 0973.819.928", action: () => window.open("https://zalo.me/0973819928", "_blank") },
          { label: "📸 Thử kính AR", action: onOpenTryOn },
          { label: "✨ Tư vấn dáng mặt", action: onOpenFaceAdvisor },
        ];
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: botResponse,
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        actions: botActions,
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 500);
  };

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-5 sm:right-5 z-40 flex flex-col items-end gap-3 pointer-events-none">
      
      {/* Scroll to Top Button */}
      {showBackToTop && (
        <button
          id="btn-scroll-top"
          onClick={scrollToTop}
          className="pointer-events-auto w-10 h-10 bg-[#18181b] hover:bg-black text-white rounded-full flex items-center justify-center shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
          aria-label="Lên đầu trang"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Floating Action Strip (Desktop Only - Mobile uses the dedicated horizontal bottom bar) */}
      <div className="hidden sm:flex pointer-events-auto items-center gap-2.5">
        
        {/* Hotline Call Button */}
        <a
          id="btn-floating-phone"
          href="tel:0973819928"
          className="w-12 h-12 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white rounded-full flex items-center justify-center shadow-xl transition-all transform hover:scale-105 cursor-pointer relative"
          title="Gọi Hotline: 0973.819.928"
        >
          <span className="absolute inset-0 rounded-full bg-amber-400 opacity-75 animate-ping" />
          <Phone className="w-5 h-5 relative z-10" />
        </a>

        {/* Zalo 24/7 Pill Button */}
        <a
          id="btn-floating-zalo"
          href="https://zalo.me/0973819928"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 bg-[#0068FF] hover:bg-[#0052cc] text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-full shadow-xl transition-all transform hover:scale-105 cursor-pointer"
          title="Tư vấn Zalo 24/7"
        >
          <ZaloAppIcon className="w-4 h-4 shrink-0 rounded-xs overflow-hidden" />
          <span>TƯ VẤN ZALO 24/7</span>
        </a>

      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="pointer-events-auto w-[92vw] sm:w-96 bg-white rounded-2xl border border-neutral-200 shadow-2xl flex flex-col h-[480px] overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Chat Header */}
          <div className="p-4 bg-[#18181b] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Glasses className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-white flex items-center gap-1.5">
                  <span>Tư Vấn Kính Mắt</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </h3>
                <p className="text-[10px] text-neutral-400">Hotline / Zalo: 0973.819.928</p>
              </div>
            </div>

            <button
              id="btn-close-ai-chat"
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-neutral-50 text-xs">
            {messages.map((m) => {
              const isBot = m.sender === "bot";
              return (
                <div key={m.id} className={`flex gap-2.5 ${isBot ? "items-start" : "items-end justify-end"}`}>
                  {isBot && (
                    <div className="w-6 h-6 rounded-full bg-neutral-900 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className="max-w-[82%] space-y-2">
                    <div className={`p-3 rounded-xl leading-relaxed whitespace-pre-line shadow-xs ${
                      isBot 
                        ? "bg-white text-neutral-800 border border-neutral-200 rounded-tl-xs" 
                        : "bg-[#18181b] text-white rounded-tr-xs font-medium"
                    }`}>
                      {m.text}
                    </div>

                    {m.actions && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {m.actions.map((act, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              act.action();
                              setIsOpen(false);
                            }}
                            className="text-[11px] font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                          >
                            {act.label}
                          </button>
                        ))}
                      </div>
                    )}

                    <span className={`text-[9px] text-neutral-400 block ${isBot ? "text-left" : "text-right"}`}>
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-neutral-200 bg-white flex items-center gap-2">
            <input
              type="text"
              placeholder="Nhập câu hỏi (ví dụ: Mặt tròn đeo kính gì?)..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="p-2 bg-[#18181b] hover:bg-black text-white rounded-lg transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
