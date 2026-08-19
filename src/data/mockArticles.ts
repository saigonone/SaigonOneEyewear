import { Article, ArticleCategory, ProductCategoryItem, AdminUser } from "../types";

export const INITIAL_ARTICLE_CATEGORIES: ArticleCategory[] = [
  {
    id: "cat-guide",
    name: "Cẩm Nang Chọn Kính",
    slug: "cam-nang-chon-kinh",
    description: "Bí quyết chọn gọng kính chuẩn dáng mặt và phong cách",
  },
  {
    id: "cat-health",
    name: "Kiến Thức Thị Lực",
    slug: "kien-thuc-thi-luc",
    description: "Chăm sóc mắt, tật khúc xạ và lời khuyên từ chuyên gia đo khám",
  },
  {
    id: "cat-trends",
    name: "Xu Hướng 2026",
    slug: "xu-huong-2026",
    description: "Bộ sưu tập gọng kính hot trend và phong cách thời trang mới nhất",
  },
  {
    id: "cat-tech",
    name: "Công Nghệ Tròng Kính",
    slug: "cong-nghe-trong-kinh",
    description: "Tìm hiểu chiết suất tròng 1.60, 1.67, 1.74 và lớp phủ lọc ánh sáng xanh",
  }
];

export const INITIAL_PRODUCT_CATEGORIES: ProductCategoryItem[] = [
  {
    id: "pcat-gong-can",
    slug: "gong-kinh-can",
    name: "Gọng Kính Cận",
    description: "Gọng Titanium siêu nhẹ, Acetate dẻo dai và hợp kim cao cấp",
  },
  {
    id: "pcat-kinh-ram",
    slug: "kinh-ram-mat",
    name: "Kính Râm Thời Trang",
    description: "Kính mát phân cực Polarized chống chói UV400 bảo vệ mắt ngoài trời",
  },
  {
    id: "pcat-trong-kinh",
    slug: "trong-kinh",
    name: "Tròng Kính Chính Hãng",
    description: "Tròng Chemi, Essilor, Hoya, Zeiss chiết suất từ 1.56 đến 1.74",
  },
  {
    id: "pcat-doi-mau",
    slug: "kinh-doi-mau",
    name: "Kính Đổi Màu Khai Sáng",
    description: "Trong suốt khi ở trong nhà và tự đổi màu râm sành điệu khi ra nắng",
  },
  {
    id: "pcat-tre-em",
    slug: "kinh-tre-em",
    name: "Kính Trẻ Em Chống Va Đập",
    description: "Chất liệu Silicon dẻo an toàn, kiểm soát độ cận học đường",
  },
  {
    id: "pcat-phu-kien",
    slug: "phu-kien",
    name: "Phụ Kiện Kính Mắt",
    description: "Hộp da đựng kính, nước lau nano, khăn lau chống mờ sương",
  }
];

export const INITIAL_ADMINS: AdminUser[] = [
  {
    id: "adm-01",
    username: "admin",
    fullName: "Quản Trị Viên Trưởng (Super Admin)",
    email: "matkinhsaigonone@gmail.com",
    role: "super_admin",
    createdAt: "2026-01-01T08:00:00.000Z",
    isActive: true,
  },
  {
    id: "adm-02",
    username: "kythuat_q1",
    fullName: "Kỹ Thuật Viên Mài Kính Q.1",
    email: "kythuat.q1@saigonone.vn",
    role: "technician",
    createdAt: "2026-02-10T09:30:00.000Z",
    isActive: true,
  },
  {
    id: "adm-03",
    username: "editor_content",
    fullName: "Biên Tập Viên Tin Tức & Cẩm Nang",
    email: "content@saigonone.vn",
    role: "editor",
    createdAt: "2026-03-05T14:15:00.000Z",
    isActive: true,
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: "art-01",
    title: "Cách Chọn Gọng Kính Hợp Với Từng Khuôn Mặt Chuẩn Nhất 2026",
    slug: "cach-chon-gong-kinh-hop-khuon-mat",
    category: "Cẩm Nang Chọn Kính",
    summary: "Hướng dẫn chi tiết cách xác định gương mặt tròn, vuông, trái xoan, trái tim và chọn dáng gọng kính tôn trọn đường nét thẩm mỹ.",
    content: `Gương mặt mỗi người đều có những nét độc đáo riêng. Việc chọn đúng gọng kính không chỉ cải thiện thị lực mà còn là phụ kiện thời trang quan trọng giúp khuôn mặt bạn cân đối và cuốn hút hơn.

### 1. Mặt tròn nên chọn gọng kính nào?
Người mặt tròn có chiều dài và chiều rộng gương mặt tương đương nhau, đường cằm mềm mại. Bạn nên ưu tiên chọn **Gọng Kính Vuông, Chữ Nhật hoặc Đa Giác góc cạnh**. Các góc nhọn của gọng sẽ tạo cảm giác gương mặt thon gọn và dài hơn. Tránh các mẫu gọng tròn xoe vì sẽ làm mặt trông đầy đặn hơn.

### 2. Mặt vuông chữ điền
Với đường quai hàm sắc nét và vầng trán rộng, **Gọng Kính Tròn, Oval hoặc Browline** với đường cong mềm mại sẽ giúp trung hòa các góc cạnh cứng cáp của khuôn mặt.

### 3. Mặt trái xoan (Oval)
Đây là tỉ lệ gương mặt lý tưởng nhất, phù hợp với hầu hết mọi kiểu dáng gọng kính từ Aviator phi công, gọng mắt mèo Cat-eye đến gọng Titan thanh mảnh.

### 4. Mặt kim cương và trái tim
Nên chọn các mẫu gọng có phần viền trên thanh thoát hoặc gọng khoan không viền để làm mềm mại phần gò má cao.

Đến ngay các chi nhánh **Sài Gòn One Eyewear** để được chuyên viên đo khám và tư vấn dáng kính trực tiếp qua gương soi AR hiện đại!`,
    thumbnail: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=900&q=80",
    author: "Bác Sĩ Khúc Xạ Nguyễn Hoàng",
    readTime: "4 phút đọc",
    publishedAt: "15/08/2026",
    viewsCount: 1420,
    isFeatured: true,
    isPublished: true,
  },
  {
    id: "art-02",
    title: "Phân Biệt Tròng Kính Chiết Suất 1.56, 1.60, 1.67 và 1.74: Bạn Nên Chọn Loại Nào?",
    slug: "phan-biet-chiet-suat-trong-kinh",
    category: "Công Nghệ Tròng Kính",
    summary: "Giải mã thông số chiết suất (Index) của tròng kính. Làm thế nào để mắt kính mỏng nhẹ, không tì cấn sống mũi khi độ cận cao.",
    content: `Chiết suất (Refractive Index) là chỉ số thể hiện khả năng bẻ cong ánh sáng của vật liệu làm tròng kính. Chiết suất càng cao thì tròng kính càng mỏng, nhẹ và thẩm mỹ hơn ở cùng một độ cận.

- **Chiết suất 1.56 (Chuẩn)**: Phù hợp độ cận nhẹ từ 0.00D đến 2.50D. Mức giá tiết kiệm, độ bền cơ bản.
- **Chiết suất 1.60 (Mỏng & Chống Vỡ)**: Mỏng hơn 20%, chất liệu dai bền MR-8, rất phù hợp cho gọng xẻ cước và gọng khoan ốc vít. Phù hợp độ cận từ 2.50D đến 4.00D.
- **Chiết suất 1.67 (Siêu Mỏng ASP)**: Mỏng hơn 35%, bề mặt phẳng phi cầu triệt tiêu độ méo biên, giúp mắt không bị thu nhỏ khi người khác nhìn vào. Khuyên dùng cho độ cận từ 4.00D đến 7.00D.
- **Chiết suất 1.74 (Cực Mỏng Cao Cấp)**: Mỏng hơn đến 50%, trọng lượng siêu nhẹ, độ trong suốt quang học đỉnh cao. Giải pháp hoàn hảo cho độ cận nặng từ 7.00D trở lên.

Tại Sài Gòn One, tất cả tròng kính đều được nhập khẩu chính ngạch từ các thương hiệu hàng đầu thế giới: **Chemi (Hàn Quốc), Essilor (Pháp), Hoya (Nhật Bản)**.`,
    thumbnail: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=900&q=80",
    author: "KTV Trưởng Trần Quang Minh",
    readTime: "5 phút đọc",
    publishedAt: "12/08/2026",
    viewsCount: 2310,
    isFeatured: true,
    isPublished: true,
  },
  {
    id: "art-03",
    title: "Tác Hại Của Ánh Sáng Xanh Từ Màn Hình Điện Thoại & Cách Bảo Vệ Đôi Mắt Dân Văn Phòng",
    slug: "tac-hai-anh-sang-xanh-va-cach-phong-ngua",
    category: "Kiến Thức Thị Lực",
    summary: "Tại sao mắt bạn thường khô rát, nhức mỏi và khó ngủ sau ngày dài làm việc máy tính? Giải pháp với tròng kính BlueCut công nghệ mới.",
    content: `Ánh sáng xanh năng lượng cao (HEV Light bước sóng 380 - 450nm) phát ra từ màn hình laptop, smartphone và đèn LED là nguyên nhân hàng đầu gây ra hội chứng thị giác màn hình (CVS), khô giác mạc và thoái hóa điểm vàng sớm.

### Các dấu hiệu mắt bạn đang bị quá tải:
1. Mắt cay rát, nhòe chữ sau 2 giờ nhìn màn hình liên tục.
2. Thường xuyên đau nửa đầu hoặc mỏi vùng hốc mắt.
3. Khó đi vào giấc ngủ do ánh sáng xanh ức chế hormone Melatonin.

### Giải pháp bảo vệ mắt:
- **Áp dụng quy tắc 20-20-20**: Cứ 20 phút làm việc, hãy nhìn ra xa 20 feet (6m) trong vòng 20 giây.
- **Đeo tròng kính lọc ánh sáng xanh BlueCut**: Lớp phủ nano U6 cắt chọn lọc ánh sáng xanh tím có hại mà vẫn giữ lại ánh sáng xanh ngọc có lợi cho nhịp sinh học.`,
    thumbnail: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=900&q=80",
    author: "Ths. Vũ Kim Oanh",
    readTime: "3 phút đọc",
    publishedAt: "08/08/2026",
    viewsCount: 980,
    isFeatured: false,
    isPublished: true,
  },
  {
    id: "art-04",
    title: "Xu Hướng Gọng Kính Titanium Đa Giác: Sự Lên Ngôi Của Phong Cách Tối Giản Sleek",
    slug: "xu-huong-gong-kinh-titanium-da-giac-2026",
    category: "Xu Hướng 2026",
    summary: "Khám phá bộ sưu tập gọng kính Titan hàng không Nhật Bản với đường nét đa giác sắc sảo tôn vinh thần thái tri thức hiện đại.",
    content: `Năm 2026 đánh dấu sự trở lại mạnh mẽ của phong cách Minimalism (Tối giản thanh lịch). Những chiếc gọng kính dày cộm đang dần nhường chỗ cho dòng **Gọng Titanium siêu mảnh với trọng lượng chỉ từ 7 - 9 grams**.

Thiết kế hình học đa giác (Polygon / Hexagonal) kết hợp giữa nét cổ điển và hơi thở công nghệ tương lai mang lại vẻ ngoài thông minh, trẻ trung và dễ dàng kết hợp cùng mọi trang phục từ công sở đến dạo phố.`,
    thumbnail: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80",
    author: "Stylist Lê Nam",
    readTime: "4 phút đọc",
    publishedAt: "01/08/2026",
    viewsCount: 1850,
    isFeatured: false,
    isPublished: true,
  }
];
