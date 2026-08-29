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
    publishedAt: "25/08/2026",
    viewsCount: 1420,
    tags: ["ChonKinh", "DangMat", "GongKinhCan", "TuVanMatKinh"],
    isFeatured: true,
    isPublished: true,
  },
  {
    id: "art-02",
    title: "Bí Quyết Chọn Gọng Kính Siêu Bền Nhẹ Cho Người Độ Cận Cao",
    slug: "bi-quyet-chon-gong-kinh-sieu-ben-nhe-do-can-cao",
    category: "Cẩm Nang Chọn Kính",
    summary: "Những tiêu chí quan trọng khi chọn gọng kính cho mắt cận từ 4 độ trở lên giúp giảm trọng lượng tì đè lên sống mũi và giấu viền dày hiệu quả.",
    content: `Người có độ cận cao thường gặp trở ngại khi đeo kính lâu: sống mũi bị lằn đỏ, vành tai đau nhức và mắt kính có xu hướng trĩu nặng về phía trước.

### 1. Ưu tiên gọng có size mắt nhỏ (Lens Width dưới 50mm)
Gọng kính có đường kính tròng càng nhỏ thì phần rìa ngoài cùng (nơi dày nhất của tròng cận) sẽ được mài cắt bỏ càng nhiều, giúp kính tổng thể mỏng nhẹ hơn đến 40%.

### 2. Chọn chất liệu Titanium Beta hoặc Acetate bản dày vừa phải
- **Titanium B**: Siêu nhẹ chỉ từ 7 - 12g, không gây dị ứng mồ hôi muối.
- **Acetate**: Bản viền dày khéo léo che đi phần cạnh rìa của tròng kính cận độ cao.

### 3. Đệm mũi silicon êm ái
Nên chọn gọng có ve mũi rời bọc silicon công thái học chống trượt khi vận động hoặc ra mồ hôi.`,
    thumbnail: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=900&q=80",
    author: "KTV Trưởng Trần Quang Minh",
    readTime: "5 phút đọc",
    publishedAt: "22/08/2026",
    viewsCount: 1890,
    tags: ["GongKinhCan", "DoCanCao", "Titanium", "MeoHay"],
    isFeatured: false,
    isPublished: true,
  },
  {
    id: "art-03",
    title: "Tác Hại Của Ánh Sáng Xanh Từ Màn Hình Điện Thoại & Cách Bảo Vệ Đôi Mắt Dân Văn Phòng",
    slug: "tac-hai-anh-sang-xanh-va-cach-phong-ngua",
    category: "Kiến Thức Thị Lực",
    summary: "Tại sao mắt bạn thường khô rát, nhức mỏi và khó ngủ sau ngày dài làm việc máy tính? Giải pháp bảo vệ thị lực chuẩn y khoa.",
    content: `Ánh sáng xanh năng lượng cao (HEV Light bước sóng 380 - 450nm) phát ra từ màn hình laptop, smartphone và đèn LED là nguyên nhân hàng đầu gây ra hội chứng thị giác màn hình (CVS), khô giác mạc và thoái hóa điểm vàng sớm.

### Các dấu hiệu mắt bạn đang bị quá tải:
1. Mắt cay rát, nhòe chữ sau 2 giờ nhìn màn hình liên tục.
2. Thường xuyên đau nửa đầu hoặc mỏi vùng hốc mắt.
3. Khó đi vào giấc ngủ do ánh sáng xanh ức chế hormone Melatonin.

### Giải pháp bảo vệ mắt:
- **Áp dụng quy tắc 20-20-20**: Cứ 20 phút làm việc, hãy nhìn ra xa 20 feet (6m) trong vòng 20 giây.
- **Tập chớp mắt có ý thức**: Giúp màng nước mắt phủ đều bề mặt giác mạc.
- **Sử dụng kính bảo vệ chuyên dụng**: Giảm căng thẳng thị giác khi làm việc ban đêm.`,
    thumbnail: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=900&q=80",
    author: "Ths. Vũ Kim Oanh",
    readTime: "3 phút đọc",
    publishedAt: "19/08/2026",
    viewsCount: 2120,
    tags: ["AnhSangXanh", "BaoVeMat", "ChamSocMat", "MatKinhVanPhong"],
    isFeatured: true,
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
    publishedAt: "16/08/2026",
    viewsCount: 1850,
    tags: ["Titanium", "XuHuong2026", "Minimalism", "ThoiTrang"],
    isFeatured: false,
    isPublished: true,
  },
  {
    id: "art-05",
    title: "Hướng Dẫn Vệ Sinh & Bảo Quản Kính Mắt Đúng Cách Giúp Gọng Luôn Bền Đẹp Như Mới",
    slug: "huong-dan-ve-sinh-bao-quan-kinh-mat-dung-cach",
    category: "Cẩm Nang Chọn Kính",
    summary: "Tránh 5 thói quen sai lầm làm trầy xước mắt kính và cong vênh càng kính. Hướng dẫn rửa kính bằng nước lau chuyên dụng đúng cách.",
    content: `Rất nhiều người có thói quen dùng vạt áo hoặc khăn giấy khô để lau kính khi bị mờ. Đây chính là thủ phạm lớn nhất gây ra các vết trầy xước li ti trên bề mặt kính!

### 1. Không lau kính bằng vải áo hoặc khăn giấy thô ráp
Các sợi xơ trong giấy ăn có chứa bột gỗ cứng sẽ cào xước các lớp phủ quang học. Chỉ nên dùng khăn nano microfiber chuyên dụng được tặng kèm khi mua kính tại Sài Gòn One.

### 2. Rửa kính dưới vòi nước chảy nhẹ
Khi kính dính bụi bẩn cát mịn, hãy xả nhẹ dưới vòi nước để trôi hạt bụi trước khi lau bằng dung dịch xịt kính nano.

### 3. Không để kính trong cốp xe máy hoặc dưới nắng gắt
Nhiệt độ cao trong cốp xe hoặc taplo ô tô sẽ làm biến dạng gọng nhựa Acetate và gây rạn nứt lớp váng phủ kính.

### 4. Dùng cả 2 tay khi đeo và tháo kính
Thao tác bằng 1 tay sẽ làm lệch tâm kính và làm lỏng ốc bản lề bên càng kính đối diện.`,
    thumbnail: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
    author: "KTV Trần Quang Minh",
    readTime: "4 phút đọc",
    publishedAt: "14/08/2026",
    viewsCount: 1650,
    tags: ["VeSinhKinh", "BaoQuanKinh", "MeoKinhMat", "SaigonOne"],
    isFeatured: false,
    isPublished: true,
  },
  {
    id: "art-06",
    title: "Dấu Hiệu Nhận Biết Bạn Cần Phải Đi Đo Khám Mắt & Thay Độ Kính Kịp Thời",
    slug: "dau-hieu-can-di-do-kham-mat-thay-do-kinh",
    category: "Kiến Thức Thị Lực",
    summary: "Nheo mắt, nhức đầu, nhìn đôi hay mờ khi lái xe ban đêm là những cảnh báo thị lực đã thay đổi. Khám mắt định kỳ 6 tháng/lần tại Saigon One.",
    content: `Nhiều người vẫn tiếp tục đeo chiếc kính cũ từ 2-3 năm trước dù độ khúc xạ đã tăng mà không hề hay biết.

### 4 Dấu hiệu cảnh báo kính của bạn đã không còn phù hợp:
1. **Thường xuyên nheo mắt khi nhìn xa hoặc đọc bảng hiệu**: Thói quen nheo mắt khiến cơ thể mi căng thẳng liên tục, đẩy nhanh tốc độ tăng độ cận.
2. **Nhức mỏi vùng thái dương và đỉnh đầu vào cuối ngày**: Mắt phải gồng điều tiết quá mức để bù trừ cho độ kính không chuẩn.
3. **Chói lóa và nhòe đèn xe khi lái xe ban đêm**: Có thể do mắt tăng độ loạn thị hoặc lớp phủ chống chói của kính cũ đã bị xước mòn.
4. **Cảm giác chóng mặt hoặc nhìn đường thấy bấp bênh**: Dấu hiệu tâm kính bị lệch hoặc sai khoảng cách đồng tử (PD).

**Lời khuyên từ chuyên gia**: Hãy khám mắt định kỳ 6 tháng một lần. Tại Sài Gòn One Eyewear (178 Phan Đăng Lưu), quy trình đo mắt khúc xạ 12 bước chuẩn y khoa được thực hiện hoàn toàn MIỄN PHÍ bằng máy đo tự động Nhật Bản.`,
    thumbnail: "https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=900&q=80",
    author: "Bác Sĩ Khúc Xạ Nguyễn Hoàng",
    readTime: "5 phút đọc",
    publishedAt: "10/08/2026",
    viewsCount: 2480,
    tags: ["KhamMat", "DoMatMienPhi", "ThiLuc", "SucKhoeMat"],
    isFeatured: true,
    isPublished: true,
  },
  {
    id: "art-07",
    title: "Top 5 Mẫu Kính Râm Polarized Thời Trang Hot Nhất Mùa Hè 2026",
    slug: "top-5-mau-kinh-ram-polarized-thoi-trang-2026",
    category: "Xu Hướng 2026",
    summary: "Điểm danh những mẫu kính mát phân cực chống chói UV400 vừa bảo vệ mắt vừa khẳng định gu thẩm mỹ sành điệu trong các chuyến du lịch hè.",
    content: `Kính râm không chỉ là món đồ bảo hộ mắt trước tia cực tím độc hại mà còn là điểm nhấn thời trang không thể thiếu trong tủ đồ của bất kỳ tín đồ thời trang nào.

### 1. Kính Râm Aviator Phi Công Cổ Điển
Kiểu dáng phi công giọt nước kinh điển với tròng xanh rau muống G15 phân cực Polarized mang lại vẻ phong trần, nam tính và khả năng lọc tia chói mặt nước cực đỉnh.

### 2. Kính Mắt Mèo Cat-Eye Đính Kim Loại Sang Trọng
Dáng mắt mèo xếch nhẹ tạo hiệu ứng nâng cơ mặt, là sự lựa chọn hoàn hảo của phái đẹp trong các buổi tiệc ngoài trời và dạo phố biển.

### 3. Gọng Vuông Oversize Phong Cách Hàn Quốc
Thiết kế gọng vuông to bản giúp gương mặt thon gọn ngay tức thì, phù hợp với hầu hết mọi dáng khuôn mặt châu Á.

### 4. Kính Râm Đa Giác Viền Mỏng Sleek
Dành cho những bạn trẻ yêu thích phong cách Y2K và Cyberpunk hiện đại.

### 5. Kính Râm Thể Thao Ôm Sát Mặt Cho Người Lái Xe & Chạy Bộ
Tròng polycarbonate chống va đập siêu nhẹ, ôm trọn hốc mắt ngăn gió bụi từ mọi góc độ.`,
    thumbnail: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80",
    author: "Stylist Lê Nam",
    readTime: "4 phút đọc",
    publishedAt: "05/08/2026",
    viewsCount: 3120,
    tags: ["KinhRam", "Polarized", "UV400", "XuHuong2026", "KinhMatThoiTrang"],
    isFeatured: false,
    isPublished: true,
  }
];
