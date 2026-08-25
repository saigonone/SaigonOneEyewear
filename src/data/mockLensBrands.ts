import { LensBrandCategory, Article } from "../types";

export const INITIAL_LENS_BRANDS: LensBrandCategory[] = [
  {
    id: "lens-brand-hoya",
    name: "Tròng Kính Hoya Nhật Bản",
    brandKey: "hoya",
    country: "Nhật Bản",
    slug: "trong-kinh-hoya-nhat-ban",
    description: "Tập đoàn quang học hàng đầu thế giới với công nghệ phủ váng Hi-Vision LongLife siêu chống trầy, lọc ánh sáng xanh Stellify BlueControl và thiết kế tròng Nulux siêu mỏng.",
    bannerImage: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=1200&q=80",
    featuredArticleId: "art-lens-hoya-01",
    order: 1,
    isActive: true,
  },
  {
    id: "lens-brand-kodak",
    name: "Tròng Kính Kodak của Mỹ",
    brandKey: "kodak",
    country: "Mỹ",
    slug: "trong-kinh-kodak-my",
    description: "Thương hiệu hình ảnh & quang học huyền thoại từ Hoa Kỳ. Tròng kính Kodak City Lens và Kodak Digital Lenses nổi tiếng với độ sắc nét tuyệt đối, chống chói và hạn chế bám bụi bẩn.",
    bannerImage: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1200&q=80",
    featuredArticleId: "art-lens-kodak-01",
    order: 2,
    isActive: true,
  },
  {
    id: "lens-brand-essilor",
    name: "Tròng Kính Essilor Pháp",
    brandKey: "essilor",
    country: "Pháp",
    slug: "trong-kinh-essilor-phap",
    description: "Số 1 thế giới về giải pháp thị lực với các công nghệ độc quyền Crizal Sapphire HR, tròng đổi màu thông minh Transitions Gen 8, và Eyezen dành cho người dùng thiết bị kỹ thuật số.",
    bannerImage: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1200&q=80",
    featuredArticleId: "art-lens-essilor-01",
    order: 3,
    isActive: true,
  },
  {
    id: "lens-brand-chemi",
    name: "Tròng Kính Chemi Hàn Quốc",
    brandKey: "chemi",
    country: "Hàn Quốc",
    slug: "trong-kinh-chemi-han-quoc",
    description: "Dòng tròng kính quốc dân được tin dùng số 1 tại Việt Nam. Độ trong suốt cao, chiết suất đa dạng 1.56, 1.60, 1.67, 1.74 với công nghệ phủ chống tia UV400 và BlueCut U6 ưu việt.",
    bannerImage: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80",
    featuredArticleId: "art-lens-chemi-01",
    order: 4,
    isActive: true,
  },
  {
    id: "lens-brand-zeiss",
    name: "Tròng Kính Zeiss Đức",
    brandKey: "zeiss",
    country: "Đức",
    slug: "trong-kinh-zeiss-duc",
    description: "Đỉnh cao thấu kính quang học từ CHLB Đức. Lớp phủ DuraVision Platinum và công nghệ SmartLife mang lại tầm nhìn chân thực, độ nét siêu phân giải chuẩn y khoa.",
    bannerImage: "https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=1200&q=80",
    featuredArticleId: "art-lens-zeiss-01",
    order: 5,
    isActive: true,
  }
];

export const INITIAL_LENS_ARTICLES: Article[] = [
  // HOYA ARTICLES
  {
    id: "art-lens-hoya-01",
    title: "Đánh Giá Toàn Diện Tròng Kính Hoya Nhật Bản: Công Nghệ Hi-Vision LongLife & Stellify BlueControl",
    slug: "danh-gia-trong-kinh-hoya-nhat-ban-chinh-hang",
    category: "Tròng Kính Hoya Nhật Bản",
    lensBrandId: "lens-brand-hoya",
    summary: "Tìm hiểu vì sao tròng kính Hoya Nhật Bản luôn là lựa chọn hàng đầu của giới văn phòng và người có tật khúc xạ độ cao nhờ lớp phủ chống trầy xước gấp 5 lần tròng thường.",
    content: `## Giới Thiệu Về Thương Hiệu Tròng Kính Hoya Nhật Bản
Thành lập từ năm 1941 tại Tokyo (Nhật Bản), Hoya là một trong những tập đoàn sản xuất tròng kính quang học lớn nhất toàn cầu. Với triết lý chế tác tỉ mỉ chuẩn xác của người Nhật, tròng kính Hoya nổi tiếng về độ bền, độ trong suốt quang sai cực thấp và khả năng chống bám bẩn hoàn hảo.

### 1. Công nghệ lớp phủ độc quyền Hi-Vision LongLife (HVLL)
Lớp phủ HVLL của Hoya đạt giải thưởng thiết kế quốc tế với khả năng:
- **Siêu chống trầy xước**: Độ cứng gấp 5 lần so với các lớp phủ tiêu chuẩn, hạn chế tối đa các vết xước dăm khi lau kính hàng ngày.
- **Chống bám nước & bụi tĩnh điện**: Hạt nước đọng co tròn và tự trôi đi nhanh chóng, giúp đi mưa không bị nhòe tầm nhìn.
- **Chống chói đèn xe ban đêm**: Giảm 99% tia chói lóa từ đèn xe đối diện và màn hình máy tính.

### 2. Dòng tròng lọc ánh sáng xanh Hoya Stellify BlueControl
Stellify BlueControl sử dụng công nghệ lọc chọn lọc ánh sáng xanh có hại (380 - 450nm) mà không làm ngả vàng quá mức tầm nhìn, bảo vệ mắt tối đa khi làm việc với máy tính liên tục trên 8 tiếng mỗi ngày.

### 3. Dòng tròng siêu mỏng Hoya Nulux Aspheric
Thiết kế mặt cầu phẳng phi cầu (Single Vision Aspheric) giúp triệt tiêu độ biến dạng vùng biên, cho tròng mỏng nhẹ hơn 35% và mang lại tính thẩm mỹ cao nhất cho người đeo kính cận/loạn.

**Tại Sài Gòn One Eyewear (178 Phan Đăng Lưu, Phú Nhuận)**, chúng tôi cam kết phân phối tròng Hoya chính hãng 100% nguyên tem bao bì bảo hành điện tử chính hãng.`,
    thumbnail: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=900&q=80",
    author: "Bác Sĩ Khúc Xạ Nguyễn Hoàng",
    readTime: "6 phút đọc",
    publishedAt: "20/08/2026",
    viewsCount: 2840,
    tags: ["Hoya", "TrongKinhNhatBan", "HiVisionLongLife", "Stellify", "SaigonOne"],
    isFeatured: true,
    isPinned: true,
    isPublished: true,
  },
  {
    id: "art-lens-hoya-02",
    title: "Bảng Giá Tròng Kính Hoya Nhật Bản Mới Nhất 2026: Chiết Suất 1.55, 1.60, 1.67, 1.74",
    slug: "bang-gia-trong-kinh-hoya-nhat-ban-2026",
    category: "Tròng Kính Hoya Nhật Bản",
    lensBrandId: "lens-brand-hoya",
    summary: "Cập nhật bảng giá niêm yết chính hãng các dòng tròng kính Hoya Stellify, Hoya Nulux, Hoya BlueControl kèm chương trình ưu đãi cắt kính lấy liền tại Sài Gòn One.",
    content: `Dưới đây là bảng giá tham khảo các dòng tròng kính Hoya Nhật Bản chính hãng tại Saigon One:

- **Hoya Stellify 1.55 SFT / BlueControl**: Giá từ 650.000đ - 950.000đ/cặp (Phù hợp cận dưới 3.00 độ)
- **Hoya Stellify 1.60 SFT / BlueControl (Chống bể)**: Giá từ 1.250.000đ - 1.650.000đ/cặp (Phù hợp gọng xẻ cước, khoan ốc)
- **Hoya Nulux 1.67 Aspheric HVLL (Siêu mỏng)**: Giá từ 2.450.000đ - 2.850.000đ/cặp (Phù hợp cận 4.00 - 7.00 độ)
- **Hoya Nulux 1.74 Aspheric HVLL (Cực mỏng cao cấp)**: Giá từ 4.500.000đ - 5.200.000đ/cặp (Phù hợp cận nặng từ 7.00 độ trở lên)

*Tất cả sản phẩm đều đi kèm khăn lau chính hãng Hoya, bao bì có mã vạch check thật giả và thẻ bảo hành lớp phủ 12 - 24 tháng.*`,
    thumbnail: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=900&q=80",
    author: "KTV Trần Quang Minh",
    readTime: "4 phút đọc",
    publishedAt: "18/08/2026",
    viewsCount: 1950,
    tags: ["BangGiaHoya", "TrongKinhHoya", "Nulux167", "Nulux174"],
    isFeatured: false,
    isPinned: false,
    isPublished: true,
  },

  // KODAK ARTICLES
  {
    id: "art-lens-kodak-01",
    title: "Tròng Kính Kodak Của Mỹ Có Tốt Không? Khám Phá Công Nghệ Kodak City Lens & Kodak Clean&Clear",
    slug: "trong-kinh-kodak-my-co-tot-khong-danh-gia-chi-tiet",
    category: "Tròng Kính Kodak của Mỹ",
    lensBrandId: "lens-brand-kodak",
    summary: "Tìm hiểu công nghệ thấu kính quang học Kodak Lens từ Mỹ – độ truyền quang 99.6%, lớp phủ chống bám bụi và lọc tia bức xạ bảo vệ mắt tối ưu.",
    content: `## Tròng Kính Kodak (Hoa Kỳ) – Di Sản 130 Năm Công Nghệ Hình Ảnh
Kodak là một trong những tên tuổi lẫy lừng nhất thế giới về công nghệ quang học và tái tạo hình ảnh. Ứng dụng những nghiên cứu độc quyền về tán sắc ánh sáng, tròng kính Kodak mang lại trải nghiệm thị giác trong trẻo, chân thực như nhìn qua ống kính máy ảnh chuyên nghiệp.

### Các ưu điểm vượt trội của tròng kính Kodak:
1. **Lớp phủ Kodak Clean'N'CleAR (CNC)**:
   - Truyền dẫn ánh sáng đến 99.6%, loại bỏ bóng mờ và quầng sáng phản xạ.
   - Bề mặt trơn láng nano chống bám dầu mỡ vân tay, dễ dàng lau sạch bằng khăn nano.
2. **Dòng Kodak City Lens**:
   - Tối ưu hóa đặc biệt cho cư dân thành thị thường xuyên di chuyển dưới ánh nắng gắt và tiếp xúc khói bụi ô nhiễm.
   - Ngăn chặn 100% tia cực tím UVA/UVB và lọc chọn lọc ánh sáng xanh có hại.
3. **Độ bền cơ học cao**:
   - Khả năng chịu lực uốn và va đập đạt tiêu chuẩn an toàn FDA Hoa Kỳ.

Quý khách có thể ghé trực tiếp **Saigon One Eyewear** tại 178 Phan Đăng Lưu, Phú Nhuận để trải nghiệm mẫu thử tròng kính Kodak chính hãng.`,
    thumbnail: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=900&q=80",
    author: "Bác Sĩ Khúc Xạ Nguyễn Hoàng",
    readTime: "5 phút đọc",
    publishedAt: "19/08/2026",
    viewsCount: 2150,
    tags: ["KodakLens", "TrongKinhMy", "KodakCityLens", "CleanNClear"],
    isFeatured: true,
    isPinned: true,
    isPublished: true,
  },

  // ESSILOR ARTICLES
  {
    id: "art-lens-essilor-01",
    title: "Essilor Pháp: Thương Hiệu Tròng Kính Số 1 Thế Giới Với Crizal Sapphire HR & Transitions Gen 8",
    slug: "trong-kinh-essilor-phap-crizal-sapphire-transitions",
    category: "Tròng Kính Essilor Pháp",
    lensBrandId: "lens-brand-essilor",
    summary: "Giải mã công nghệ tròng kính Essilor (Pháp) - Độ trong suốt vô hình Crizal Sapphire HR và tròng đổi màu nhanh nhất thế giới Transitions Signature Gen 8.",
    content: `## Essilor (Pháp) – Dẫn Đầu Thị Trường Quang Học Toàn Cầu
Được tin dùng bởi hơn 1 tỷ người trên thế giới, Essilor là nhà phát minh ra tròng kính đa tròng đầu tiên (Varilux) và các lớp váng phủ tiên tiến nhất hiện nay.

### 1. Lớp phủ Crizal Sapphire HR
- **Công nghệ 360° Multi-Angular**: Triệt tiêu tia phản xạ từ cả mặt trước và mặt sau tròng kính, tạo cảm giác tròng kính "vô hình" trong suốt như pha lê.
- **Chỉ số E-SPF 35**: Bảo vệ mắt toàn diện trước tia cực tím kể cả từ mặt sau tròng kính.

### 2. Tròng kính đổi màu thông minh Transitions Signature Gen 8
- Tự động đổi sang màu râm thời trang (Khói, Nâu trà, Xanh Graphite, Hổ phách, Thạch anh tím...) chỉ trong vài giây khi ra ngoài trời.
- Nhả màu trong suốt nhanh chóng khi bước vào trong nhà.

### 3. Tròng kính Essilor Eyezen
- Thiết kế hỗ trợ điều tiết mắt, giảm căng thẳng thị giác cho thế hệ trẻ thường xuyên dùng smartphone và laptop.

Trải nghiệm đo mắt chuẩn quốc tế và lắp ráp tròng Essilor lấy ngay tại **Saigon One Eyewear (178 Phan Đăng Lưu, Phú Nhuận)**.`,
    thumbnail: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=900&q=80",
    author: "Ths. Vũ Kim Oanh",
    readTime: "7 phút đọc",
    publishedAt: "21/08/2026",
    viewsCount: 3410,
    tags: ["Essilor", "CrizalSapphireHR", "TransitionsGen8", "Eyezen", "TrongKinhPhap"],
    isFeatured: true,
    isPinned: true,
    isPublished: true,
  },

  // CHEMI ARTICLES
  {
    id: "art-lens-chemi-01",
    title: "Tròng Kính Chemi Hàn Quốc: Lựa Chọn Quốc Dân Ngon - Bổ - Rẻ Với Công Nghệ BlueCut U6",
    slug: "trong-kinh-chemi-han-quoc-chinh-hang-bluecut-u6",
    category: "Tròng Kính Chemi Hàn Quốc",
    lensBrandId: "lens-brand-chemi",
    summary: "Đánh giá tròng kính Chemi Hàn Quốc chiết suất 1.56, 1.60, 1.67, 1.74 – Sự kết hợp hoàn hảo giữa mức giá dễ tiếp cận và chất lượng quang học vượt trội.",
    content: `## Chemi Lens – Thương Hiệu Tròng Kính Hàn Quốc Được Yêu Thích Nhất
Chemi (Chemilens) là nhà sản xuất tròng kính số 1 Hàn Quốc với hệ thống dây chuyền máy móc hiện đại nhập khẩu từ Đức và Nhật Bản.

### Những dòng tròng Chemi phổ biến nhất tại Việt Nam:
1. **Chemi Crystal U2 Coated (1.56, 1.60, 1.67)**:
   - Lớp váng phủ siêu trơn bóng, chống bám nước, chống bám bụi và chống tia UV400.
   - Mức giá cực kỳ hợp lý, chỉ từ 350.000đ - 850.000đ/cặp.
2. **Chemi Perfect UV U6 BlueCut**:
   - Cắt 100% tia UV400 và ngăn chặn 96% ánh sáng xanh có hại bước sóng 400 - 420nm.
   - Phù hợp học sinh, sinh viên và nhân viên văn phòng.
3. **Chemi U2 1.74 Aspheric (Siêu mỏng cao cấp)**:
   - Dòng tròng 1.74 có giá thành tốt nhất phân khúc, giải phóng hoàn toàn gánh nặng cho người cận từ 6 - 12 độ.

Tất cả tròng kính Chemi tại **Saigon One** đều có tem cào chống hàng giả, bao bì niêm phong và bảo hành lớp váng 12 tháng.`,
    thumbnail: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80",
    author: "KTV Trưởng Trần Quang Minh",
    readTime: "5 phút đọc",
    publishedAt: "17/08/2026",
    viewsCount: 3100,
    tags: ["Chemi", "TrongKinhChemi", "BlueCutU6", "Chemi174", "TrongKinhHanQuoc"],
    isFeatured: true,
    isPinned: true,
    isPublished: true,
  },

  // ZEISS ARTICLES
  {
    id: "art-lens-zeiss-01",
    title: "Tròng Kính Carl Zeiss Đức: Tuyệt Tác Quang Học Đẳng Cấp Với Lớp Phủ DuraVision Platinum",
    slug: "trong-kinh-zeiss-duc-duravision-platinum",
    category: "Tròng Kính Zeiss Đức",
    lensBrandId: "lens-brand-zeiss",
    summary: "Khám phá Carl Zeiss (Đức) - biểu tượng tối thượng của ngành quang học thế giới với độ sắc nét tinh xảo và logo chữ Z khắc laser chìm độc quyền.",
    content: `## Carl Zeiss (Đức) – Biểu Tượng Huyền Thoại Của Quang Học Thế Giới
Hơn 175 năm lịch sử chế tác các thấu kính vũ trụ, kính hiển vi y khoa và ống kính máy ảnh cao cấp, tròng kính Carl Zeiss đại diện cho đỉnh cao chất lượng mà bất cứ người đeo kính nào cũng ao ước.

### Dấu ấn đẳng cấp của tròng kính Zeiss:
- **Logo chữ Z khắc Laser chìm**: Mỗi chiếc tròng kính Zeiss xuất xưởng đều có logo chữ Z tinh xảo khắc chìm trên bề mặt, khẳng định sản phẩm chính hãng 100%.
- **Lớp phủ DuraVision Platinum**: Sử dụng công nghệ bắn ion chân không dày đặc, mang lại độ cứng bề mặt chống trầy gấp 3 lần và độ phản quang xanh dịu mắt sang trọng.
- **Zeiss ClearView & SmartLife**: Công nghệ trường nhìn rộng tự do FreeForm, mở rộng góc nhìn ngoại vi rõ nét hơn 3 lần so với tròng thông thường.`,
    thumbnail: "https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=900&q=80",
    author: "Bác Sĩ Khúc Xạ Nguyễn Hoàng",
    readTime: "6 phút đọc",
    publishedAt: "14/08/2026",
    viewsCount: 1620,
    tags: ["Zeiss", "CarlZeiss", "TrongKinhDuc", "DuraVisionPlatinum"],
    isFeatured: true,
    isPinned: true,
    isPublished: true,
  }
];
