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

// Triệt tiêu hoàn toàn mọi mảng bài viết mẫu gắn cứng theo ID cố định (art-01, art-02...)
// Hệ thống sử dụng 100% dữ liệu bài viết thực tế từ Firestore collection 'articles'
export const INITIAL_ARTICLES: Article[] = [];
