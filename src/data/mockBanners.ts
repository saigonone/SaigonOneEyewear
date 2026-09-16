import { BannerSlide } from "../types";

// Banner mặc định an toàn khi mới tải trang hoặc chưa có dữ liệu từ Firestore/localStorage
export const DEFAULT_FALLBACK_BANNER: BannerSlide = {
  id: "saigonone-default-banner",
  collectionTag: "MẮT KÍNH SÀI GÒN ONE",
  titleLine1: "Tầm Nhìn Sắc Nét",
  titleLine2: "Bảo Vệ Thị Lực Toàn Diện",
  desc: "Tròng kính lọc ánh sáng xanh Essilor Crizal & Hoya BlueControl cao cấp. Tối ưu thị lực sắc nét, chống mỏi mắt kỹ thuật số và bảo hành trọn đời.",
  category: "trong-kinh",
  buttonText: "Bảng Giá Tròng Kính",
  secondaryButtonText: "Hướng Dẫn Chọn Tròng",
  image: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=1200&q=85",
  isActive: true,
  order: 1,
  featureBadge: "Essilor Crizal & Hoya BlueControl",
  featureDesc: "Lọc 99% ánh sáng xanh tím có hại, chống chói lóa, hạn chế trầy xước và bám bụi bẩn.",
  brandNote: "Chính Hãng: Essilor (Pháp) • Hoya (Nhật Bản) • Chemi (Hàn Quốc)"
};

export const INITIAL_BANNER_SLIDES: BannerSlide[] = [DEFAULT_FALLBACK_BANNER];

