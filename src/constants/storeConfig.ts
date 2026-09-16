import { LensOption, StoreLocation } from "../types";

export const LENS_OPTIONS: LensOption[] = [
  {
    id: "lens-none",
    name: "Không lắp tròng (Chỉ lấy gọng nguyên bản)",
    brand: "Chính Hãng SaigonOne",
    index: "1.56 (Chuẩn)",
    type: "chong-choi-uv400",
    description: "Kính giữ nguyên tròng mẫu 0 độ ban đầu của nhà sản xuất.",
    price: 0,
    features: ["Bảo vệ chống bụi", "Tròng mẫu demo"],
  },
  {
    id: "lens-chemi-156-bluecut",
    name: "Tròng Chemi Perfect UV 1.56 U6 BlueCut",
    brand: "Chemi (Hàn Quốc)",
    index: "1.56 (Chuẩn)",
    type: "chong-anh-sang-xanh",
    description: "Cắt 99% tia UV400 và lọc triệt để ánh sáng xanh có hại từ máy tính, điện thoại, giảm mỏi mắt tức thì.",
    price: 380000,
    originalPrice: 480000,
    features: ["Lọc ánh sáng xanh", "Chống tia UV400", "Lớp phủ hạn chế bám vân tay & bụi bẩn"],
    isPopular: true,
  },
  {
    id: "lens-chemi-160-bluecut",
    name: "Tròng Chemi Mỏng 1.60 U6 BlueCut Chống Vỡ",
    brand: "Chemi (Hàn Quốc)",
    index: "1.60 (Mỏng)",
    type: "chong-anh-sang-xanh",
    description: "Mỏng hơn 20% so với tròng chuẩn, độ dai cao chống vỡ, rất phù hợp gọng xẻ cước và gọng khoan.",
    price: 650000,
    originalPrice: 850000,
    features: ["Mỏng nhẹ hơn 20%", "Chất liệu MR8 chống vỡ tuyệt đối", "Lọc ánh sáng xanh màn hình"],
  },
  {
    id: "lens-chemi-167-ultraslim",
    name: "Tròng Siêu Mỏng Chemi 1.67 ASP U6",
    brand: "Chemi (Hàn Quốc)",
    index: "1.67 (Siêu mỏng)",
    type: "chong-anh-sang-xanh",
    description: "Mỏng hơn 35%, triệt tiêu độ cầu lồi giúp mắt tự nhiên không bị thu nhỏ khi nhìn từ ngoài vào (dành cho độ cận từ 3.50D - 8.00D).",
    price: 1150000,
    originalPrice: 1450000,
    features: ["Siêu mỏng nhẹ 35%", "Mặt phẳng phi cầu ASP", "Thẩm mỹ cao cho độ cận nặng"],
    isPopular: true,
  },
  {
    id: "lens-chemi-photochromic",
    name: "Tròng Đổi Màu Chemi 1.56 Photochromic Grey/Brown",
    brand: "Chemi (Hàn Quốc)",
    index: "1.56 (Chuẩn)",
    type: "doi-mau-khai-sang",
    description: "Trong suốt khi ở trong nhà và tự động đổi sang màu râm mát đậm khi ra nắng, bảo vệ mắt 2-trong-1.",
    price: 850000,
    originalPrice: 1100000,
    features: ["Đổi màu nhanh dưới ánh nắng", "Trong suốt trong nhà", "Chống chói & UV 100%"],
    isPopular: true,
  },
  {
    id: "lens-essilor-crizal-160",
    name: "Tròng Essilor Crizal Rock 1.60 Siêu Bền & Siêu Trong",
    brand: "Essilor (Pháp)",
    index: "1.60 (Mỏng)",
    type: "chong-bam-nuoc-hoi-nuoc",
    description: "Công nghệ tiên tiến từ Pháp, tăng gấp 3 lần khả năng chống trầy xước, chống bám nước mưa cực tốt.",
    price: 1880000,
    originalPrice: 2350000,
    features: ["Chống trầy Rock công nghệ mới", "Chống bám nước mưa trượt giọt", "Độ trong suốt quang học cao nhất"],
  },
  {
    id: "lens-essilor-transitions-gen8",
    name: "Tròng Essilor Transitions Signature Gen 8 (1.60)",
    brand: "Essilor (Pháp)",
    index: "1.60 (Mỏng)",
    type: "doi-mau-khai-sang",
    description: "Đỉnh cao tròng đổi màu số 1 thế giới, chuyển màu và nhả màu tức thì, bảo vệ mắt tối thượng trong mọi điều kiện ánh sáng.",
    price: 3380000,
    originalPrice: 4200000,
    features: ["Đổi màu thông minh thế hệ Gen 8", "Lọc ánh sáng xanh cả trong nhà & ngoài trời", "7 tông màu sang trọng"],
  },
  {
    id: "lens-hoya-stellify-174",
    name: "Tròng Cực Mỏng Hoya Nulux 1.74 Cao Cấp",
    brand: "Hoya (Nhật Bản)",
    index: "1.74 (Cực mỏng cao cấp)",
    type: "chong-anh-sang-xanh",
    description: "Chiết suất mỏng nhất hiện nay, phẳng tuyệt đối, hoàn hảo cho độ cận từ 6.00D đến 15.00D.",
    price: 3950000,
    originalPrice: 4800000,
    features: ["Mỏng nhẹ tối đa 50%", "Công nghệ kiểm định quang học Nhật Bản", "Lớp phủ VG siêu chống tĩnh điện"],
  }
];

export const STORE_LOCATIONS: StoreLocation[] = [
  {
    id: "store-phandangluu",
    name: "Showroom Saigon One Eyewear - 178 Phan Đăng Lưu",
    address: "178 Phan Đăng Lưu, Phường Đức Nhuận, TP. Hồ Chí Minh",
    district: "Phường Đức Nhuận",
    city: "TP. Hồ Chí Minh",
    phone: "0973.819.928",
    hotline: "0973.819.928",
    openHours: "08:30 - 21:00 (Mở cửa tất cả các ngày trong tuần)",
    services: [
      "Đo khám khúc xạ mắt miễn phí bằng máy đo tự động Topcon chuẩn y khoa Nhật Bản",
      "Cắt mài lắp kính lấy ngay siêu tốc trong 15 - 20 phút",
      "Khu trưng bày gọng kính Titanium, Acetate, Kính râm Polarized & Tròng kính chính hãng",
      "Vệ sinh kính bằng sóng siêu âm, nắn chỉnh gọng, thay ve đệm mũi miễn phí trọn đời",
      "Hỗ trợ tư vấn trực tiếp qua Zalo / Hotline: 0973.819.928",
      "Chỗ đỗ xe máy và ô tô thuận tiện, an toàn"
    ],
    image: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=1200&q=80",
    isMainFlagship: true,
  }
];

export const PROMO_CODES: Record<string, { discountPercent: number; maxDiscount: number; minOrder: number; description: string }> = {
  "SAIGONONE": { discountPercent: 10, maxDiscount: 150000, minOrder: 500000, description: "Giảm 10% tối đa 150K cho khách hàng thân thiết" },
  "CHAOHANG2026": { discountPercent: 15, maxDiscount: 300000, minOrder: 1000000, description: "Giảm 15% tối đa 300K mừng bộ sưu tập mới" },
  "FREESHIP": { discountPercent: 0, maxDiscount: 30000, minOrder: 300000, description: "Miễn phí vận chuyển toàn quốc" },
  "VIPKHACHHANG": { discountPercent: 20, maxDiscount: 500000, minOrder: 2000000, description: "Giảm 20% cho đơn hàng từ 2 triệu" }
};
