import React, { useState, useRef, useEffect } from "react";
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Glasses, 
  MapPin, 
  Phone,
  HelpCircle,
  Camera
} from "lucide-react";

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
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "bot",
      text: "Xin chào quý khách! Em là Trợ Lý Ảo Sài Gòn One Eyewear. Em có thể tư vấn dáng kính hợp mặt, bảng giá tròng kính chính hãng và lịch đo khám mắt miễn phí. Quý khách đang cần hỗ trợ gì ạ?",
      timestamp: "Vừa xong",
      actions: [
        { label: "📸 Thử kính AR 3D", action: onOpenTryOn },
        { label: "✨ Tư vấn dáng mặt", action: onOpenFaceAdvisor },
        { label: "🔬 Bảng giá tròng cận", action: onOpenLensGuide },
        { label: "📍 Địa chỉ 4 cửa hàng", action: onOpenStores },
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

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

    // Generate intelligent response based on keywords
    setTimeout(() => {
      let botResponse = "";
      let botActions: { label: string; action: () => void }[] | undefined = undefined;
      const lower = query.toLowerCase();

      if (lower.includes("mặt tròn") || lower.includes("mat tron")) {
        botResponse = "Với gương mặt tròn đầy đặn, quý khách nên ưu tiên chọn các mẫu Gọng Kính Vuông, Gọng Đa Giác Titan hoặc Gọng Mắt Mèo. Các góc cạnh sắc sảo của gọng sẽ giúp gương mặt trông thon gọn và dài hơn rất nhiều ạ!";
        botActions = [
          { label: "Xem gợi ý kính mặt tròn", action: onOpenFaceAdvisor },
          { label: "Thử kính AR ngay", action: onOpenTryOn }
        ];
      } else if (lower.includes("độ cận") || lower.includes("mỏng") || lower.includes("chiết suất") || lower.includes("tròng")) {
        botResponse = "Dạ, nếu độ cận của quý khách từ 0.50D - 2.50D thì dùng tròng 1.56 hoặc 1.60. Nếu từ 3.00D - 6.00D thì nên chọn tròng 1.67 siêu mỏng để viền kính mỏng nhẹ không tì cấn sống mũi. Cận trên 6.00D thì tròng 1.74 Hoya/Chemi là sự lựa chọn tối ưu nhất ạ!";
        botActions = [
          { label: "Xem chi tiết bảng tròng", action: onOpenLensGuide }
        ];
      } else if (lower.includes("đo mắt") || lower.includes("khám") || lower.includes("cắt kính") || lower.includes("thời gian")) {
        botResponse = "Tại 4 chi nhánh Sài Gòn One Eyewear (Q1, Q3, Q10, Gò Vấp), chúng em đo khám khúc xạ mắt HOÀN TOÀN MIỄN PHÍ bằng máy tự động Topcon Nhật Bản. Sau khi chọn gọng & tròng, kỹ thuật viên sẽ mài lắp lấy liền chỉ trong 15 - 20 phút ạ!";
        botActions = [
          { label: "Xem danh sách chi nhánh", action: onOpenStores }
        ];
      } else if (lower.includes("thử") || lower.includes("camera") || lower.includes("ar")) {
        botResponse = "Quý khách có thể bấm vào nút 'Thử Kính AR 3D' để bật camera trực tiếp hoặc chọn ảnh mẫu người thật để xem ngay gọng kính lên mặt có hợp không nhé!";
        botActions = [
          { label: "Mở phòng thử kính AR", action: onOpenTryOn }
        ];
      } else if (lower.includes("địa chỉ") || lower.includes("ở đâu") || lower.includes("chi nhánh") || lower.includes("cửa hàng")) {
        botResponse = "Dạ hệ thống Sài Gòn One có 4 chi nhánh tại TP.HCM:\n1. 92 Nguyễn Trãi, Q.1\n2. 348 Cách Mạng Tháng 8, Q.3\n3. 526 Ba Tháng Hai, Q.10\n4. 688 Quang Trung, Gò Vấp.\nMở cửa 08:30 - 21:30 tất cả các ngày!";
        botActions = [
          { label: "Chỉ đường Google Maps", action: onOpenStores }
        ];
      } else {
        botResponse = "Cảm ơn quý khách đã nhắn tin! Quý khách có thể xem nhanh các chức năng dưới đây hoặc gọi trực tiếp hotline 0903.372.556 để chuyên viên hỗ trợ tức thì ạ.";
        botActions = [
          { label: "📸 Thử kính AR", action: onOpenTryOn },
          { label: "✨ Tư vấn khuôn mặt", action: onOpenFaceAdvisor },
          { label: "📍 Cửa hàng gần nhất", action: onOpenStores }
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
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          id="btn-open-ai-chat"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 bg-[#0f172a] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl hover:bg-blue-900 border border-slate-700 transition-all duration-300 hover:scale-105 cursor-pointer"
          aria-label="Tư vấn kính mắt AI"
        >
          <div className="relative">
            <Glasses className="w-5 h-5 text-blue-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-900 animate-pulse" />
          </div>
          <span className="hidden sm:inline font-bold text-xs">
            Tư Vấn Kính Trực Tuyến
          </span>
          <span className="hidden sm:inline text-[9px] bg-blue-600 text-white font-extrabold px-1.5 py-0.2 rounded-full uppercase">
            AI 24/7
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-96 bg-white rounded-2xl border border-gray-100 shadow-2xl flex flex-col h-[500px] overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          
          {/* Chat Header */}
          <div className="p-4 bg-[#0f172a] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <Glasses className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-white flex items-center gap-1.5">
                  <span>Trợ Lý Sài Gòn One</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </h3>
                <p className="text-[10px] text-slate-400">Tư vấn dáng kính & đo khám 24/7</p>
              </div>
            </div>

            <button
              id="btn-close-ai-chat"
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/60 text-xs">
            {messages.map((m) => {
              const isBot = m.sender === "bot";
              return (
                <div key={m.id} className={`flex gap-2.5 ${isBot ? "items-start" : "items-end justify-end"}`}>
                  {isBot && (
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className={`max-w-[82%] space-y-2`}>
                    <div className={`p-3 rounded-xl leading-relaxed whitespace-pre-line shadow-xs ${
                      isBot 
                        ? "bg-white text-slate-800 border border-gray-100 rounded-tl-xs" 
                        : "bg-[#0f172a] text-white rounded-tr-xs font-medium"
                    }`}>
                      {m.text}
                    </div>

                    {/* Action buttons inside message if any */}
                    {m.actions && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {m.actions.map((act, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              act.action();
                              setIsOpen(false);
                            }}
                            className="text-[11px] font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                          >
                            {act.label}
                          </button>
                        ))}
                      </div>
                    )}

                    <span className={`text-[9px] text-gray-400 block ${isBot ? "text-left" : "text-right"}`}>
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 bg-white flex items-center gap-2">
            <input
              type="text"
              placeholder="Nhập câu hỏi (ví dụ: Mặt tròn đeo kính gì?)..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="submit"
              className="p-2 bg-[#0f172a] hover:bg-blue-900 text-white rounded-lg transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};
