import { Product, LensOption, StoreLocation, Review } from "../types";

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

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "sg-one-titan-01",
    sku: "SGO-TITAN-8021",
    name: "Gọng Kính Titan Siêu Nhẹ Sài Gòn One AirLight",
    brand: "Sài Gòn One PureTitan",
    category: "gong-kinh-can",
    gender: "unisex",
    price: 890000,
    originalPrice: 1250000,
    discountPercent: 29,
    images: [
      "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      { name: "Đen Nhám (Matte Black)", hex: "#1e2022", image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=900&q=80" },
      { name: "Vàng Champagne (Gold)", hex: "#d4af37", image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=900&q=80" },
      { name: "Bạc Ánh Kim (Silver)", hex: "#c0c0c0", image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=900&q=80" },
      { name: "Xám Nòng Súng (Gunmetal)", hex: "#4a4e51", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80" }
    ],
    frameShape: "da-giac",
    faceShapes: ["tron", "trai-xoan", "trai-tim"],
    material: "titanium",
    weight: 8.5,
    dimensions: {
      lensWidth: 51,
      bridgeWidth: 19,
      templeLength: 145,
      frameHeight: 44
    },
    description: "Được chế tác từ hợp kim Titanium hàng không Nhật Bản, gọng kính Sài Gòn One AirLight mang lại cảm giác đeo nhẹ tênh như không đeo. Thiết kế đa giác thanh mảnh thời thượng tôn trọn đường nét gương mặt.",
    highlights: [
      "Chất liệu Beta Titanium siêu bền, uốn dẻo đàn hồi chống gãy",
      "Trọng lượng siêu nhẹ chỉ 8.5g không gây hằn sống mũi",
      "Đệm mũi Silicon đúc nguyên khối mềm mại êm ái",
      "Bảo hành nắn chỉnh gọng trọn đời tại mọi chi nhánh Sài Gòn One"
    ],
    isNewArrival: true,
    isBestSeller: true,
    isFeatured: true,
    stock: 45,
    rating: 4.9,
    reviewsCount: 128,
    tryOnOverlayType: "polygon",
    tryOnSvgColor: "#1e2022"
  },
  {
    id: "sg-one-acetate-retro",
    sku: "SGO-ACE-9902",
    name: "Gọng Kính Cận Acetate Vintage Cao Cấp Saigon Retro",
    brand: "Sài Gòn One Heritage",
    category: "gong-kinh-can",
    gender: "unisex",
    price: 750000,
    originalPrice: 990000,
    discountPercent: 24,
    images: [
      "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      { name: "Đồi Mồi Cổ Điển (Tortoise)", hex: "#5c3818", image: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=900&q=80" },
      { name: "Đen Bóng Sang Trọng (Piano Black)", hex: "#0b0c10", image: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=900&q=80" },
      { name: "Xám Khói Trong Suốt (Crystal Grey)", hex: "#7a8288", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80" }
    ],
    frameShape: "vuong",
    faceShapes: ["tron", "trai-xoan", "dai"],
    material: "acetate",
    weight: 18.2,
    dimensions: {
      lensWidth: 49,
      bridgeWidth: 21,
      templeLength: 148,
      frameHeight: 42
    },
    description: "Lấy cảm hứng từ phong cách tri thức Sài Gòn thập niên 80, gọng Acetate cellulose gốc thực vật được mài bóng thủ công tỉ mỉ, lõi kim loại khắc chìm tinh xảo chạy dọc hai bên càng kính.",
    highlights: [
      "Chất liệu nhựa Acetate tự nhiên bóng đẹp không phai màu theo thời gian",
      "Lõi thép gia cường định hình form kính chuẩn xác",
      "Bản lề 5 chấu chuẩn Nhật Bản đóng mở chắc nịch",
      "Phù hợp cả học sinh, sinh viên và dân văn phòng công sở"
    ],
    isNewArrival: false,
    isBestSeller: true,
    isFeatured: true,
    stock: 32,
    rating: 4.8,
    reviewsCount: 94,
    tryOnOverlayType: "modern-square",
    tryOnSvgColor: "#5c3818"
  },
  {
    id: "sg-one-sun-aviator",
    sku: "SGO-SUN-7701",
    name: "Kính Mát Phi Công Sài Gòn One Polarized Aviator",
    brand: "Sài Gòn One SunLine",
    category: "kinh-ram-mat",
    gender: "nam",
    price: 1250000,
    originalPrice: 1650000,
    discountPercent: 24,
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      { name: "Khung Vàng Tròng Xanh Rau Muống (G15)", hex: "#3b4d3c", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80" },
      { name: "Khung Đen Tròng Xám Khói Polarized", hex: "#1f2421", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80" },
      { name: "Khung Bạc Tròng Tráng Gương Xanh Biển", hex: "#2b580c", image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=900&q=80" }
    ],
    frameShape: "aviator",
    faceShapes: ["vuong", "trai-xoan", "kim-cuong"],
    material: "kim-loai",
    weight: 22.0,
    dimensions: {
      lensWidth: 58,
      bridgeWidth: 14,
      templeLength: 140,
      frameHeight: 50
    },
    description: "Kính mát phi công huyền thoại với tròng phân cực Polarized chuẩn HD, khử hoàn toàn tia phản xạ lóa khi lái xe dưới trời nắng gắt hay đi biển mùa hè.",
    highlights: [
      "Tròng Polarized chống lóa mắt tuyệt đối chuẩn UV400",
      "Cầu đôi thanh lịch phong thái doanh nhân và du lịch biển",
      "Đệm mũi điều chỉnh linh hoạt ôm khít gương mặt",
      "Tặng kèm hộp da dập chìm logo Sài Gòn One Eyewear và khăn lau nano"
    ],
    isNewArrival: true,
    isBestSeller: true,
    isFeatured: true,
    stock: 28,
    rating: 5.0,
    reviewsCount: 156,
    tryOnOverlayType: "aviator",
    tryOnSvgColor: "#3b4d3c"
  },
  {
    id: "sg-one-cateye-glam",
    sku: "SGO-CAT-5509",
    name: "Gọng Kính Mắt Mèo Nữ Quyến Rũ Sài Gòn One Glamour",
    brand: "Sài Gòn One Diva",
    category: "gong-kinh-can",
    gender: "nu",
    price: 820000,
    originalPrice: 1100000,
    discountPercent: 25,
    images: [
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      { name: "Hồng Nude Pastel", hex: "#e8c5c8", image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=900&q=80" },
      { name: "Đen Viền Vàng Hồng (Black Rose Gold)", hex: "#232323", image: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=900&q=80" },
      { name: "Trắng Trong Suốt (Crystal Clear)", hex: "#f0f2f5", image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=900&q=80" }
    ],
    frameShape: "mat-meo",
    faceShapes: ["tron", "vuong", "trai-xoan"],
    material: "acetate",
    weight: 14.5,
    dimensions: {
      lensWidth: 52,
      bridgeWidth: 17,
      templeLength: 142,
      frameHeight: 46
    },
    description: "Đuôi mắt xếch nhẹ tinh tế nâng cung mày và tạo hiệu ứng thon gọn cho gương mặt phái đẹp. Sự hòa quyện giữa chất liệu Acetate pha kim loại mạ vàng hồng sang chảnh.",
    highlights: [
      "Dáng mắt mèo thời trang làm nổi bật gò má và đôi mắt",
      "Phù hợp lắp tròng cận, tròng đổi màu hoặc tròng 0 độ đi chơi",
      "Bản lề trợ lực êm ái không gây đau vành tai",
      "Mẫu kính hot trend được nhiều hot girl & beauty blogger yêu thích"
    ],
    isNewArrival: true,
    isBestSeller: false,
    isFeatured: true,
    stock: 20,
    rating: 4.9,
    reviewsCount: 88,
    tryOnOverlayType: "cat-eye",
    tryOnSvgColor: "#e8c5c8"
  },
  {
    id: "sg-one-browline-club",
    sku: "SGO-BROW-4401",
    name: "Gọng Kính Nửa Viền Browline Tri Thức Sài Gòn One Executive",
    brand: "Sài Gòn One Heritage",
    category: "gong-kinh-can",
    gender: "unisex",
    price: 950000,
    originalPrice: 1350000,
    discountPercent: 30,
    images: [
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      { name: "Đen Viền Vàng Cổ Điển", hex: "#1b1b1b", image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=900&q=80" },
      { name: "Đồi Mồi Viền Đồng (Tortoise Bronze)", hex: "#4a2c11", image: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=900&q=80" },
      { name: "Xanh Navy Viền Bạc", hex: "#0f2027", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80" }
    ],
    frameShape: "browline",
    faceShapes: ["trai-xoan", "kim-cuong", "trai-tim", "vuong"],
    material: "kim-loai",
    weight: 16.0,
    dimensions: {
      lensWidth: 51,
      bridgeWidth: 20,
      templeLength: 145,
      frameHeight: 43
    },
    description: "Thiết kế nửa viền Clubmaster với phần viền trên nhấn đậm tạo điểm nhấn quyền lực, phong thái đĩnh đạc và uy tín cho các buổi họp, thuyết trình và công việc thường nhật.",
    highlights: [
      "Thiết kế Browline kinh điển trường tồn với thời gian",
      "Kết hợp kim loại chống rỉ sét và nhựa cao cấp",
      "Cấu trúc cân bằng trọng tâm tối ưu cho người đeo cả ngày"
    ],
    isNewArrival: false,
    isBestSeller: true,
    isFeatured: false,
    stock: 19,
    rating: 4.8,
    reviewsCount: 72,
    tryOnOverlayType: "browline",
    tryOnSvgColor: "#1b1b1b"
  },
  {
    id: "sg-one-round-korean",
    sku: "SGO-RND-3305",
    name: "Gọng Kính Tròn Hàn Quốc Thanh Mảnh Sài Gòn One Seoul Vibe",
    brand: "Sài Gòn One Young",
    category: "gong-kinh-can",
    gender: "unisex",
    price: 620000,
    originalPrice: 850000,
    discountPercent: 27,
    images: [
      "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      { name: "Bạc Thanh Lịch (Silver)", hex: "#d9dadb", image: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=900&q=80" },
      { name: "Vàng Hồng Dễ Thương (Rose Gold)", hex: "#b76e79", image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=900&q=80" },
      { name: "Đen Nhám Tối Giản", hex: "#111213", image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=900&q=80" }
    ],
    frameShape: "tron",
    faceShapes: ["vuong", "kim-cuong", "trai-xoan", "dai"],
    material: "titanium",
    weight: 9.2,
    dimensions: {
      lensWidth: 48,
      bridgeWidth: 20,
      templeLength: 142,
      frameHeight: 46
    },
    description: "Mẫu kính tròn phong cách idol Hàn Quốc trẻ trung, làm mềm mại góc cạnh gương mặt và mang lại vẻ ngoài thư sinh, đáng yêu cho người đeo.",
    highlights: [
      "Gọng tròn thanh mảnh không kén mặt",
      "Chất liệu hợp kim Titan dẻo dai khó gãy",
      "Phù hợp lắp các loại tròng đổi màu khi ra nắng"
    ],
    isNewArrival: false,
    isBestSeller: true,
    isFeatured: true,
    stock: 50,
    rating: 4.9,
    reviewsCount: 210,
    tryOnOverlayType: "classic-round",
    tryOnSvgColor: "#d9dadb"
  },
  {
    id: "sg-one-sun-oversized",
    sku: "SGO-SUN-6612",
    name: "Kính Râm Nữ Oversized Vuông Sài Gòn One Parisian Chic",
    brand: "Sài Gòn One SunLine",
    category: "kinh-ram-mat",
    gender: "nu",
    price: 1100000,
    originalPrice: 1500000,
    discountPercent: 27,
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      { name: "Đen Huyền Bí Đính Đá Tinh Xảo", hex: "#000000", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80" },
      { name: "Nâu Trà Gradient Nữ Tính", hex: "#634735", image: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=900&q=80" }
    ],
    frameShape: "vuong",
    faceShapes: ["tron", "trai-xoan", "trai-tim"],
    material: "acetate",
    weight: 24.5,
    dimensions: {
      lensWidth: 56,
      bridgeWidth: 18,
      templeLength: 145,
      frameHeight: 52
    },
    description: "Form vuông to bản che trọn vùng da quanh mắt, ngăn ngừa hình thành nếp nhăn do ánh nắng mặt trời và mang lại vẻ ngoài quyền lực như ngôi sao thảm đỏ.",
    highlights: [
      "Bảo vệ toàn diện 100% tia tử ngoại UV400",
      "Tròng kính Gradient chuyển màu dịu mắt khi lái xe ban ngày",
      "Càng kính khắc họa tiết hoa văn chạm trổ thủ công"
    ],
    isNewArrival: true,
    isBestSeller: false,
    isFeatured: true,
    stock: 15,
    rating: 4.9,
    reviewsCount: 47,
    tryOnOverlayType: "modern-square",
    tryOnSvgColor: "#000000"
  },
  {
    id: "sg-one-kids-flex",
    sku: "SGO-KID-1108",
    name: "Gọng Kính Trẻ Em Uốn Dẻo Không Gãy Sài Gòn One SmartKid",
    brand: "Sài Gòn One Kids",
    category: "kinh-tre-em",
    gender: "tre-em",
    price: 490000,
    originalPrice: 650000,
    discountPercent: 25,
    images: [
      "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      { name: "Xanh Dương Năng Động", hex: "#1e3d59", image: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=900&q=80" },
      { name: "Hồng Dâu Ngọt Ngào", hex: "#f5b0cb", image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=900&q=80" },
      { name: "Vàng Tươi Rực Rỡ", hex: "#f5d061", image: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=900&q=80" }
    ],
    frameShape: "oval",
    faceShapes: ["tron", "trai-xoan", "vuong"],
    material: "nhua-tr90",
    weight: 7.0,
    dimensions: {
      lensWidth: 44,
      bridgeWidth: 15,
      templeLength: 125,
      frameHeight: 36
    },
    description: "Sử dụng vật liệu Silicone y tế & nhựa TR90 sinh học siêu dẻo có thể bẻ cong 180 độ không gãy, tuyệt đối an toàn cho các bé khi vận động, chạy nhảy và học tập.",
    highlights: [
      "Bẻ cong 180 độ chống gãy và không gây chấn thương",
      "Trọng lượng siêu nhẹ chỉ 7g không trượt mũi",
      "Tặng kèm dây silicon đeo chống rơi khi chơi thể thao",
      "Chuyên dụng kết hợp cùng tròng chống ánh sáng xanh hoặc kiểm soát cận thị"
    ],
    isNewArrival: false,
    isBestSeller: true,
    isFeatured: false,
    stock: 40,
    rating: 5.0,
    reviewsCount: 83,
    tryOnOverlayType: "classic-round",
    tryOnSvgColor: "#1e3d59"
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

export const MOCK_REVIEWS: Review[] = [
  {
    id: "rev-1",
    productId: "sg-one-titan-01",
    userName: "Nguyễn Minh Khang (Q.1, TP.HCM)",
    rating: 5,
    date: "14/08/2026",
    comment: "Gọng Titan nhẹ kinh khủng, đeo từ sáng 8h đến tối 10h làm việc văn phòng mà không thấy nặng hay hằn sống mũi chút nào. Mình chọn lắp thêm tròng Chemi 1.67 siêu mỏng nhìn rất thẩm mỹ!",
    productColorPurchased: "Đen Nhám (Matte Black)",
    verifiedPurchase: true,
  },
  {
    id: "rev-2",
    productId: "sg-one-titan-01",
    userName: "Trần Thảo My",
    rating: 5,
    date: "10/08/2026",
    comment: "Giao hàng siêu nhanh chỉ 2 tiếng trong nội thành Sài Gòn. Được tặng kèm bao da xịn và nước lau kính. Thử kính online thấy hợp mặt tròn thật sự luôn.",
    productColorPurchased: "Vàng Champagne (Gold)",
    verifiedPurchase: true,
  },
  {
    id: "rev-3",
    productId: "sg-one-sun-aviator",
    userName: "Lê Hoàng Quân (Bình Thạnh)",
    rating: 5,
    date: "05/08/2026",
    comment: "Đi phượt Đà Lạt và Vũng Tàu mang kính này bao ngầu, tròng Polarized chống lóa đường nắng cực tốt. Đáng tiền từng xu!",
    productColorPurchased: "Khung Vàng Tròng Xanh Rau Muống (G15)",
    verifiedPurchase: true,
  },
  {
    id: "rev-4",
    productId: "sg-one-acetate-retro",
    userName: "Phạm Hải Đăng",
    rating: 5,
    date: "28/07/2026",
    comment: "Form kính vuông retro đồi mồi rất có chất riêng, cầm đầm tay, bản lề chắc nịch. Đã đo mắt tại chi nhánh Nguyễn Trãi Q1 các bạn kỹ thuật viên rất nhiệt tình.",
    productColorPurchased: "Đồi Mồi Cổ Điển (Tortoise)",
    verifiedPurchase: true,
  }
];

export const PROMO_CODES: Record<string, { discountPercent: number; maxDiscount: number; minOrder: number; description: string }> = {
  "SAIGONONE": { discountPercent: 10, maxDiscount: 150000, minOrder: 500000, description: "Giảm 10% tối đa 150K cho khách hàng thân thiết" },
  "CHAOHANG2026": { discountPercent: 15, maxDiscount: 300000, minOrder: 1000000, description: "Giảm 15% tối đa 300K mừng bộ sưu tập mới" },
  "FREESHIP": { discountPercent: 0, maxDiscount: 30000, minOrder: 300000, description: "Miễn phí vận chuyển toàn quốc" },
  "VIPKHACHHANG": { discountPercent: 20, maxDiscount: 500000, minOrder: 2000000, description: "Giảm 20% cho đơn hàng từ 2 triệu" }
};
