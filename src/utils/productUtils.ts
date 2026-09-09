import { Product, ProductColor } from "../types";

export const DEFAULT_PRODUCT_FALLBACK_IMAGE = 
  "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=900&q=80";

/**
 * Trích xuất chuẩn xác hình ảnh đại diện (thumbnail / representative image) mới nhất của sản phẩm.
 * Ưu tiên:
 * 1. Trường thumbnail từ Firestore / Database (chuỗi URL hợp lệ)
 * 2. Trường image từ Firestore / Database
 * 3. Trường imageUrl hoặc image_url từ Firestore / Database
 * 4. Phần tử đầu tiên trong mảng images (images[0])
 * 5. Ảnh trong mảng colors đầu tiên nếu có
 * 6. Ảnh mặc định fallback (chỉ khi không có bất kỳ nguồn ảnh nào)
 */
export function getProductRepresentativeImage(product: Product | null | undefined): string {
  if (!product) return DEFAULT_PRODUCT_FALLBACK_IMAGE;

  // 1. Kiểm tra trường thumbnail trực tiếp từ Firestore
  if (typeof product.thumbnail === "string" && product.thumbnail.trim().length > 0) {
    return product.thumbnail.trim();
  }

  // 2. Kiểm tra trường image trực tiếp từ Firestore
  if (typeof product.image === "string" && product.image.trim().length > 0) {
    return product.image.trim();
  }

  // 3. Kiểm tra trường imageUrl hoặc image_url
  if (typeof product.imageUrl === "string" && product.imageUrl.trim().length > 0) {
    return product.imageUrl.trim();
  }
  if (typeof product.image_url === "string" && product.image_url.trim().length > 0) {
    return product.image_url.trim();
  }

  // 4. Kiểm tra mảng images
  if (Array.isArray(product.images) && product.images.length > 0) {
    const firstValid = product.images.find((img) => typeof img === "string" && img.trim().length > 0);
    if (firstValid) return firstValid.trim();
  }

  // 5. Kiểm tra mảng màu colors
  if (Array.isArray(product.colors) && product.colors.length > 0) {
    const firstColorImg = product.colors.find(
      (c) => c && typeof c.image === "string" && c.image.trim().length > 0
    );
    if (firstColorImg) return firstColorImg.image.trim();
  }

  return DEFAULT_PRODUCT_FALLBACK_IMAGE;
}

/**
 * Chuẩn hóa đối tượng sản phẩm lấy từ Firestore, RTDB hoặc LocalStorage cache.
 * Đảm bảo mọi trường ảnh (thumbnail, image, imageUrl, image_url, images, colors)
 * luôn đồng bộ và trỏ chuẩn xác vào ảnh mới nhất, loại bỏ tình trạng lưu đệm cứng.
 */
export function normalizeProduct(raw: any, fallbackId?: string): Product {
  if (!raw || typeof raw !== "object") {
    return {
      id: fallbackId || `sgo-prod-${Date.now()}`,
      sku: "SGO-0000",
      name: "Sản Phẩm Saigon One",
      brand: "Sài Gòn One",
      category: "gong-kinh-can",
      categories: ["gong-kinh-can"],
      gender: "unisex",
      price: 500000,
      originalPrice: 500000,
      discountPercent: 0,
      thumbnail: DEFAULT_PRODUCT_FALLBACK_IMAGE,
      image: DEFAULT_PRODUCT_FALLBACK_IMAGE,
      imageUrl: DEFAULT_PRODUCT_FALLBACK_IMAGE,
      image_url: DEFAULT_PRODUCT_FALLBACK_IMAGE,
      images: [DEFAULT_PRODUCT_FALLBACK_IMAGE],
      colors: [{ name: "Màu Tiêu Chuẩn", hex: "#1e2022", image: DEFAULT_PRODUCT_FALLBACK_IMAGE }],
      frameShape: "vuong",
      faceShapes: ["tron", "trai-xoan", "vuong"],
      material: "titanium",
      weight: 14,
      dimensions: { lensWidth: 51, bridgeWidth: 19, templeLength: 145, frameHeight: 44 },
      description: "",
      highlights: ["Gọng kính chính hãng Sài Gòn One"],
      stock: 10,
      rating: 5.0,
      reviewsCount: 1,
      tryOnOverlayType: "polygon",
    };
  }

  const id = raw.id || fallbackId || `sgo-prod-${Date.now()}`;

  // Thu thập tất cả các trường ảnh tiềm năng
  const rawThumbnail = typeof raw.thumbnail === "string" ? raw.thumbnail.trim() : "";
  const rawImage = typeof raw.image === "string" ? raw.image.trim() : "";
  const rawImageUrl = typeof raw.imageUrl === "string" ? raw.imageUrl.trim() : "";
  const rawImageUrlSnake = typeof raw.image_url === "string" ? raw.image_url.trim() : "";

  // Trích xuất mảng images
  let rawImages: string[] = [];
  if (Array.isArray(raw.images)) {
    rawImages = raw.images
      .map((img: any) => (typeof img === "string" ? img.trim() : ""))
      .filter((img: string) => img.length > 0);
  } else if (typeof raw.images === "string" && raw.images.trim()) {
    rawImages = [raw.images.trim()];
  }

  // Trích xuất ảnh từ mảng colors nếu có
  let firstColorImage = "";
  if (Array.isArray(raw.colors) && raw.colors.length > 0) {
    const colWithImg = raw.colors.find((c: any) => c && typeof c.image === "string" && c.image.trim().length > 0);
    if (colWithImg) firstColorImage = colWithImg.image.trim();
  }

  // Xác định ảnh đại diện chính nhất quán theo thứ tự ưu tiên
  const primaryRepresentativeImage =
    rawThumbnail ||
    rawImage ||
    rawImageUrl ||
    rawImageUrlSnake ||
    rawImages[0] ||
    firstColorImage ||
    DEFAULT_PRODUCT_FALLBACK_IMAGE;

  // Đảm bảo mảng images luôn có ảnh đại diện ở vị trí đầu tiên
  let finalImages: string[] = [];
  if (rawImages.length > 0) {
    if (rawImages[0] === primaryRepresentativeImage) {
      finalImages = rawImages;
    } else {
      finalImages = [
        primaryRepresentativeImage,
        ...rawImages.filter((img) => img !== primaryRepresentativeImage),
      ];
    }
  } else {
    finalImages = [primaryRepresentativeImage];
  }

  // Chuẩn hóa mảng colors
  let finalColors: ProductColor[] = [];
  if (Array.isArray(raw.colors) && raw.colors.length > 0) {
    finalColors = raw.colors.map((c: any, index: number) => {
      const colImg = typeof c?.image === "string" && c.image.trim().length > 0 ? c.image.trim() : primaryRepresentativeImage;
      return {
        name: c?.name || (index === 0 ? "Màu Tiêu Chuẩn" : `Màu ${index + 1}`),
        hex: c?.hex || "#1e2022",
        image: colImg,
        tryOnModelUrl: c?.tryOnModelUrl,
      };
    });
  } else {
    finalColors = [
      {
        name: "Màu Tiêu Chuẩn",
        hex: "#1e2022",
        image: primaryRepresentativeImage,
      },
    ];
  }

  const effectiveSku = raw.sku || `SGO-${id.toString().slice(-4)}`;
  const priceNum = typeof raw.price === "number" ? raw.price : parseInt(raw.price) || 500000;
  const origPriceNum = typeof raw.originalPrice === "number" ? raw.originalPrice : parseInt(raw.originalPrice) || priceNum;

  const categories = Array.isArray(raw.categories) && raw.categories.length > 0
    ? raw.categories
    : [raw.category || "gong-kinh-can"];
  const category = categories.includes(raw.category) ? raw.category : categories[0];

  return {
    ...raw,
    id,
    sku: effectiveSku,
    name: raw.name || "Sản Phẩm Saigon One",
    slug: raw.slug,
    brand: raw.brand || "Sài Gòn One",
    category,
    categories,
    gender: raw.gender || "unisex",
    price: priceNum,
    originalPrice: origPriceNum,
    discountPercent: origPriceNum > priceNum ? Math.round(((origPriceNum - priceNum) / origPriceNum) * 100) : (raw.discountPercent || 0),
    // Đồng bộ hóa toàn bộ các trường ảnh đại diện để tương thích mọi truy vấn
    thumbnail: primaryRepresentativeImage,
    image: primaryRepresentativeImage,
    imageUrl: primaryRepresentativeImage,
    image_url: primaryRepresentativeImage,
    images: finalImages,
    colors: finalColors,
    frameShape: raw.frameShape || "vuong",
    faceShapes: Array.isArray(raw.faceShapes) && raw.faceShapes.length > 0 ? raw.faceShapes : ["tron", "trai-xoan", "vuong"],
    material: raw.material || "titanium",
    weight: typeof raw.weight === "number" ? raw.weight : 14,
    dimensions: raw.dimensions || { lensWidth: 51, bridgeWidth: 19, templeLength: 145, frameHeight: 44 },
    description: raw.description || "",
    highlights: Array.isArray(raw.highlights) && raw.highlights.length > 0 ? raw.highlights : ["Gọng kính chính hãng Sài Gòn One", "Bảo hành nắn chỉnh trọn đời"],
    isNewArrival: Boolean(raw.isNewArrival),
    isBestSeller: Boolean(raw.isBestSeller),
    isFeatured: Boolean(raw.isFeatured),
    createdAt: raw.createdAt,
    stock: typeof raw.stock === "number" ? raw.stock : 10,
    rating: typeof raw.rating === "number" ? raw.rating : 5.0,
    reviewsCount: typeof raw.reviewsCount === "number" ? raw.reviewsCount : 1,
    tryOnOverlayType: raw.tryOnOverlayType || "polygon",
    tryOnSvgColor: raw.tryOnSvgColor,
  };
}
