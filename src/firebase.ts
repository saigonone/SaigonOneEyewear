import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  initializeFirestore,
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot 
} from "firebase/firestore";
import { 
  getDatabase, 
  ref, 
  set, 
  get, 
  child, 
  update, 
  remove, 
  onValue 
} from "firebase/database";
import { getAuth } from "firebase/auth";
import { createSlug } from "./utils/slug";
import { normalizeProduct } from "./utils/productUtils";
import { sortArticlesByNewest } from "./utils/articleUtils";
import { Product, Order, Article, ArticleCategory, ProductCategoryItem, AdminUser, BannerSlide, Appointment, LensBrandCategory } from "./types";

// Web app's Firebase configuration provided by user
export const firebaseConfig = {
  apiKey: "AIzaSyDKRHNLyrwOXgskiv74_rnl0GXjrbs82Ow",
  authDomain: "saigononeeyewear.firebaseapp.com",
  databaseURL: "https://saigononeeyewear-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "saigononeeyewear",
  storageBucket: "saigononeeyewear.firebasestorage.app",
  messagingSenderId: "735987618998",
  appId: "1:735987618998:web:fbe0f5a556b3fc19618217",
  measurementId: "G-7XR02E1ED1"
};

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with ignoreUndefinedProperties to prevent undefined field crashes
let firestoreDb;
try {
  firestoreDb = initializeFirestore(app, {
    ignoreUndefinedProperties: true,
  });
} catch (e) {
  firestoreDb = getFirestore(app);
}
export const db = firestoreDb;
export const rtdb = getDatabase(app);
export const auth = getAuth(app);

/**
 * Loại bỏ toàn bộ các thuộc tính undefined trước khi đẩy dữ liệu lên Firestore
 * (Đảm bảo không bao giờ bị lỗi 'Unsupported field value: undefined')
 */
export function sanitizeFirestorePayload<T extends Record<string, any>>(data: T): Record<string, any> {
  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      if (value !== null && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
        cleaned[key] = sanitizeFirestorePayload(value);
      } else {
        cleaned[key] = value;
      }
    }
  }
  return cleaned;
}

// =========================================================================
// CROSS-TAB BROADCAST SYNC (TỰ ĐỘNG LÀM MỚI ĐỒNG BỘ GIỮA CÁC TAB TRÌNH DUYỆT)
// =========================================================================
export const realtimeBroadcast = typeof window !== "undefined" && "BroadcastChannel" in window 
  ? new BroadcastChannel("saigonone_realtime_sync") 
  : null;

export function notifyCrossTabUpdate(entity: "products" | "articles" | "lens_articles" | "lens_brands" | "banners" | "all") {
  try {
    realtimeBroadcast?.postMessage({ type: "DATA_UPDATED", entity, timestamp: Date.now() });
  } catch (e) {}
}

// =========================================================================
// 1. PRODUCTS CRUD - THAO TÁC TRỰC TIẾP VÀ LẮNG NGHE REALTIME FIRESTORE
// =========================================================================

export async function getProductsFromFirebase(): Promise<Product[]> {
  try {
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);
    if (!snapshot.empty) {
      const list: Product[] = [];
      snapshot.forEach((docSnapshot) => {
        list.push(normalizeProduct(docSnapshot.data(), docSnapshot.id));
      });
      try {
        localStorage.setItem("saigonone_products", JSON.stringify(list));
      } catch (e) {}
      return list;
    }
  } catch (err) {
    console.warn("[Firebase Firestore] Lấy products thất bại, thử RTDB:", err);
  }

  try {
    const rtdbRef = ref(rtdb);
    const rtdbSnapshot = await get(child(rtdbRef, "products"));
    if (rtdbSnapshot.exists()) {
      const data = rtdbSnapshot.val();
      const list = Object.entries(data).map(([id, val]) => normalizeProduct(val, id));
      if (list && list.length > 0) return list;
    }
  } catch (err) {
    console.warn("[Firebase RTDB] Lỗi đọc products:", err);
  }

  // Không tự động nạp dữ liệu mẫu - chỉ đọc dữ liệu thực tế
  return [];
}

export async function addProductToFirebase(product: Product): Promise<{ success: boolean; id: string }> {
  const timestamp = new Date().toISOString();
  const normalized = normalizeProduct(product, product.id);
  const productWithMeta = {
    ...normalized,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  try {
    await setDoc(doc(db, "products", product.id), productWithMeta);
  } catch (e) {
    console.error("[Firestore] Thêm sản phẩm thất bại:", e);
  }

  try {
    await set(ref(rtdb, `products/${product.id}`), productWithMeta);
  } catch (e) {
    console.error("[RTDB] Thêm sản phẩm thất bại:", e);
  }

  notifyCrossTabUpdate("products");
  return { success: true, id: product.id };
}

export async function updateProductInFirebase(product: Product): Promise<boolean> {
  const timestamp = new Date().toISOString();
  const normalized = normalizeProduct(product, product.id);
  const updateData = { ...normalized, updatedAt: timestamp };
  const cleanData = sanitizeFirestorePayload(updateData);

  try {
    await setDoc(doc(db, "products", product.id), cleanData);
    console.log(`[Firebase Firestore] ✅ Đã ghi đè trực tiếp sản phẩm ID: ${product.id}`);
  } catch (e) {
    console.error("[Firebase] Lỗi ghi đè setDoc sản phẩm:", e);
    throw e;
  }

  try {
    await set(ref(rtdb, `products/${product.id}`), cleanData);
  } catch (e) {}

  try {
    const cached = localStorage.getItem("saigonone_products");
    if (cached) {
      const list = JSON.parse(cached);
      const nextList = list.map((p: any) => p.id === product.id ? cleanData : p);
      if (!nextList.some((p: any) => p.id === product.id)) {
        nextList.unshift(cleanData);
      }
      localStorage.setItem("saigonone_products", JSON.stringify(nextList));
    }
  } catch (e) {}

  notifyCrossTabUpdate("products");
  return true;
}

export async function deleteProductFromFirebase(productId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "products", productId));
  } catch (e) {}

  try {
    await remove(ref(rtdb, `products/${productId}`));
  } catch (e) {}

  notifyCrossTabUpdate("products");
  return true;
}

/**
 * Lắng nghe thời gian thực (onSnapshot) cho Sản Phẩm (Products):
 * Tự động cập nhật ngay lập tức khi có bất kỳ thay đổi nào (thêm, sửa, xóa) trên Firestore.
 */
export function subscribeToProductsFromFirebase(
  onUpdate: (products: Product[]) => void,
  onError?: (error: any) => void
): () => void {
  let isFirestoreWorking = false;
  let unsubscribeRtdb: (() => void) | null = null;

  try {
    const q = collection(db, "products");
    const unsubscribeFirestore = onSnapshot(
      q,
      (snapshot) => {
        isFirestoreWorking = true;
        const list: Product[] = [];
        if (!snapshot.empty) {
          snapshot.forEach((d) => {
            list.push(normalizeProduct(d.data(), d.id));
          });
        }
        try {
          localStorage.setItem("saigonone_products", JSON.stringify(list));
        } catch (e) {}
        onUpdate(list);
      },
      (err) => {
        console.warn("[Firebase Firestore] Lỗi realtime onSnapshot products:", err);
        if (onError) onError(err);
      }
    );

    // Fallback RTDB realtime listener nếu Firestore bị ngắt kết nối
    try {
      const rtdbRef = ref(rtdb, "products");
      unsubscribeRtdb = onValue(rtdbRef, (snap) => {
        if (!isFirestoreWorking && snap.exists()) {
          const data = snap.val();
          const list = Object.entries(data).map(([id, val]) => normalizeProduct(val, id));
          onUpdate(list);
        }
      });
    } catch (e) {}

    return () => {
      unsubscribeFirestore();
      if (unsubscribeRtdb) unsubscribeRtdb();
    };
  } catch (e) {
    console.error("[Firebase] Không thể khởi tạo listener products:", e);
    return () => {};
  }
}

// =========================================================================
// 2. ARTICLES / BÀI VIẾT CẨM NANG (CẨM NANG & TIN TỨC) CRUD
// =========================================================================

export async function getArticlesFromFirebase(): Promise<Article[]> {
  // 1. First Priority: Direct Firestore 'articles' collection query
  try {
    const articlesRef = collection(db, "articles");
    const snapshot = await getDocs(articlesRef);
    if (!snapshot.empty) {
      const list: Article[] = [];
      snapshot.forEach((d) => {
        const raw = d.data();
        const item: Article = {
          id: d.id,
          title: raw.title || raw.name || "",
          slug: raw.slug || "",
          summary: raw.summary || raw.description || raw.excerpt || "",
          content: raw.content || raw.body || raw.htmlContent || "",
          thumbnail: raw.thumbnail || raw.image || raw.imageUrl || raw.cover || "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=900&q=80",
          category: raw.category || "Cẩm Nang Thị Lực",
          author: raw.author || raw.authorName || "Ban Biên Tập Mắt Kính Sài Gòn One",
          authorRole: raw.authorRole || raw.role || "Chuyên Viên Khúc Xạ",
          publishedAt: raw.publishedAt || raw.publishedDate || raw.createdAt || "2026",
          readTime: raw.readTime || "5 phút đọc",
          views: typeof raw.views === "number" ? raw.views : 120,
          tags: Array.isArray(raw.tags) ? raw.tags : [],
          isFeatured: Boolean(raw.isFeatured || raw.featured || raw.isPinned || raw.pinned),
          isPinned: Boolean(raw.isPinned || raw.pinned),
          isPublished: raw.isPublished !== false,
          lensBrandId: raw.lensBrandId || undefined,
          ...raw,
        };
        if (!item.lensBrandId) {
          list.push(item);
        }
      });
      if (list.length > 0) {
        const sorted = sortArticlesByNewest(list);
        try { localStorage.setItem("saigonone_articles", JSON.stringify(sorted)); } catch (e) {}
        return sorted;
      }
    }
  } catch (err) {
    console.warn("[Firebase Firestore] Lấy articles thất bại, thử RTDB/Local:", err);
  }

  // 2. Second Priority: Try RTDB 'articles'
  try {
    const rtdbRef = ref(rtdb);
    const snap = await get(child(rtdbRef, "articles"));
    if (snap.exists()) {
      const data = snap.val();
      const list = (Object.values(data) as Article[]).filter(a => !a.lensBrandId);
      if (list.length > 0) {
        const sorted = sortArticlesByNewest(list);
        try { localStorage.setItem("saigonone_articles", JSON.stringify(sorted)); } catch (e) {}
        return sorted;
      }
    }
  } catch (e) {}

  // Không tự động nạp dữ liệu mẫu - chỉ đọc dữ liệu thực tế
  return [];
}

/**
 * Lắng nghe thời gian thực (onSnapshot) cho Bài Viết Cẩm Nang (Articles):
 * Bất kỳ thao tác thêm/sửa/xóa bài viết trên Firestore sẽ tự động cập nhật ngay trên mọi trình duyệt.
 */
export function subscribeToArticlesFromFirebase(
  onUpdate: (articles: Article[]) => void,
  onError?: (err: any) => void
): () => void {
  let isFirestoreWorking = false;
  let unsubscribeRtdb: (() => void) | null = null;

  try {
    const q = collection(db, "articles");
    const unsubscribeFirestore = onSnapshot(
      q,
      (snapshot) => {
        isFirestoreWorking = true;
        const list: Article[] = [];
        snapshot.forEach((d) => {
          const raw = d.data();
          const item: Article = {
            id: d.id,
            title: raw.title || raw.name || "",
            slug: raw.slug || "",
            summary: raw.summary || raw.description || raw.excerpt || "",
            content: raw.content || raw.body || raw.htmlContent || "",
            thumbnail: raw.thumbnail || raw.image || raw.imageUrl || raw.cover || "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=900&q=80",
            category: raw.category || "Cẩm Nang Thị Lực",
            author: raw.author || raw.authorName || "Ban Biên Tập Mắt Kính Sài Gòn One",
            authorRole: raw.authorRole || raw.role || "Chuyên Viên Khúc Xạ",
            publishedAt: raw.publishedAt || raw.publishedDate || raw.createdAt || "2026",
            readTime: raw.readTime || "5 phút đọc",
            views: typeof raw.views === "number" ? raw.views : (typeof raw.viewsCount === "number" ? raw.viewsCount : 120),
            viewsCount: typeof raw.viewsCount === "number" ? raw.viewsCount : (typeof raw.views === "number" ? raw.views : 120),
            tags: Array.isArray(raw.tags) ? raw.tags : [],
            isFeatured: Boolean(raw.isFeatured || raw.featured || raw.isPinned || raw.pinned),
            isPinned: Boolean(raw.isPinned || raw.pinned),
            isPublished: raw.isPublished !== false,
            lensBrandId: raw.lensBrandId || undefined,
            ...raw,
          };
          if (!item.lensBrandId) {
            list.push(item);
          }
        });

        // Sắp xếp bài viết mới nhất lên trên cùng
        const sorted = sortArticlesByNewest(list);
        try { localStorage.setItem("saigonone_articles", JSON.stringify(sorted)); } catch (e) {}
        onUpdate(sorted);
      },
      (err) => {
        console.warn("[Firebase Firestore] Realtime articles onSnapshot error:", err);
        if (onError) onError(err);
      }
    );

    // Fallback RTDB realtime listener
    try {
      const rtdbRef = ref(rtdb, "articles");
      unsubscribeRtdb = onValue(rtdbRef, (snap) => {
        if (!isFirestoreWorking && snap.exists()) {
          const data = snap.val();
          const list = (Object.values(data) as Article[]).filter(a => !a.lensBrandId);
          if (list && list.length > 0) {
            const sorted = sortArticlesByNewest(list);
            onUpdate(sorted);
          }
        }
      });
    } catch (e) {}

    return () => {
      unsubscribeFirestore();
      if (unsubscribeRtdb) unsubscribeRtdb();
    };
  } catch (e) {
    console.error("[Firebase] Lỗi khởi tạo listener articles:", e);
    return () => {};
  }
}

export async function addArticleToFirebase(article: Article): Promise<{ success: boolean; id: string }> {
  console.log("[Firebase] 🚀 Chuẩn bị gửi bài viết lên Firestore collection 'articles'...", article);
  const timestamp = new Date().toISOString();

  // 1. Gom và chuẩn hóa dữ liệu đầu vào (Payload)
  const effectiveId = (article.id && article.id.trim()) ? article.id.trim() : `art-${Date.now()}`;
  const effectiveTitle = (article.title || "").trim();
  const effectiveSlug = (article.slug || "").trim() || createSlug(effectiveTitle || "bai-viet");
  const effectiveSummary = (article.summary || "").trim() || effectiveTitle;
  const effectiveContent = (article.content || "").trim();
  const effectiveThumbnail = (article.thumbnail || "").trim() || "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=900&q=80";
  const effectiveCategory = (article.category || "").trim() || "Cẩm Nang Thị Lực";
  const effectiveAuthor = (article.author || "").trim() || "Ban Biên Tập Mắt Kính Sài Gòn One";
  const effectivePublishedAt = (article.publishedAt || "").trim() || new Date().toLocaleDateString("vi-VN");
  const effectiveReadTime = (article.readTime || "").trim() || "4 phút đọc";

  const rawData: Record<string, any> = {
    id: effectiveId,
    title: effectiveTitle,
    slug: effectiveSlug,
    summary: effectiveSummary,
    content: effectiveContent,
    thumbnail: effectiveThumbnail,
    category: effectiveCategory,
    author: effectiveAuthor,
    authorRole: (article.authorRole || "").trim() || "Chuyên Viên Khúc Xạ",
    publishedAt: effectivePublishedAt,
    readTime: effectiveReadTime,
    views: typeof article.views === "number" ? article.views : (typeof article.viewsCount === "number" ? article.viewsCount : 120),
    viewsCount: typeof article.viewsCount === "number" ? article.viewsCount : (typeof article.views === "number" ? article.views : 120),
    tags: Array.isArray(article.tags) && article.tags.length > 0 ? article.tags : ["CamNang", "KinhMat", "SaigonOne"],
    isFeatured: Boolean(article.isFeatured),
    isPinned: Boolean(article.isPinned),
    isPublished: article.isPublished !== false,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  if (article.lensBrandId && article.lensBrandId.trim()) {
    rawData.lensBrandId = article.lensBrandId.trim();
  }

  // Làm sạch payload loại trừ tất cả các giá trị undefined để Firestore không từ chối ghi
  const cleanData = sanitizeFirestorePayload(rawData);

  // 2. Ghi trực tiếp vào Firestore: Collection 'articles'
  try {
    const articleDocRef = doc(db, "articles", effectiveId);
    console.log(`[Firebase Firestore] Thực thi setDoc tại collection 'articles', docId: '${effectiveId}':`, cleanData);
    await setDoc(articleDocRef, cleanData);
    console.log(`[Firebase Firestore] ✅ THÀNH CÔNG: Đã lưu bài viết vào Firestore collection 'articles' (Doc ID: ${effectiveId})`);
  } catch (firestoreErr: any) {
    console.error("[Firebase Firestore ERROR] ❌ Lỗi nghiêm trọng khi đẩy bài viết vào collection 'articles':", firestoreErr);
    throw firestoreErr;
  }

  // 3. Đồng bộ dự phòng sang RTDB
  try {
    await set(ref(rtdb, `articles/${effectiveId}`), cleanData);
    console.log(`[Firebase RTDB] ✅ Đã đồng bộ bài viết vào RTDB 'articles/${effectiveId}'`);
  } catch (rtdbErr) {
    console.warn("[Firebase RTDB WARNING] Không thể đồng bộ RTDB (không ảnh hưởng Firestore):", rtdbErr);
  }

  // 4. Cập nhật cache LocalStorage
  try {
    const current = await getArticlesFromFirebase();
    const updated = [cleanData as Article, ...current.filter(a => a.id !== effectiveId)];
    localStorage.setItem("saigonone_articles", JSON.stringify(updated));
  } catch (localErr) {
    console.warn("[LocalStorage] Lỗi lưu cache articles:", localErr);
  }

  notifyCrossTabUpdate("articles");
  return { success: true, id: effectiveId };
}

export async function updateArticleInFirebase(article: Article): Promise<boolean> {
  console.log("[Firebase] 🚀 Chuẩn bị cập nhật bài viết trong Firestore collection 'articles'...", article);
  const timestamp = new Date().toISOString();

  const effectiveId = (article.id || "").trim();
  if (!effectiveId) {
    const err = new Error("Không thể cập nhật bài viết không có ID!");
    console.error("[Firebase] ❌", err);
    throw err;
  }

  const effectiveTitle = (article.title || "").trim();
  const effectiveSlug = (article.slug || "").trim() || createSlug(effectiveTitle || "bai-viet");
  const effectiveSummary = (article.summary || "").trim() || effectiveTitle;
  const effectiveContent = (article.content || "").trim();
  const effectiveThumbnail = (article.thumbnail || "").trim() || "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=900&q=80";
  const effectiveCategory = (article.category || "").trim() || "Cẩm Nang Thị Lực";
  const effectiveAuthor = (article.author || "").trim() || "Ban Biên Tập Mắt Kính Sài Gòn One";
  const effectivePublishedAt = (article.publishedAt || "").trim() || new Date().toLocaleDateString("vi-VN");
  const effectiveReadTime = (article.readTime || "").trim() || "4 phút đọc";

  const rawData: Record<string, any> = {
    id: effectiveId,
    title: effectiveTitle,
    slug: effectiveSlug,
    summary: effectiveSummary,
    content: effectiveContent,
    thumbnail: effectiveThumbnail,
    category: effectiveCategory,
    author: effectiveAuthor,
    publishedAt: effectivePublishedAt,
    readTime: effectiveReadTime,
    views: typeof article.views === "number" ? article.views : (typeof article.viewsCount === "number" ? article.viewsCount : 120),
    viewsCount: typeof article.viewsCount === "number" ? article.viewsCount : 120,
    tags: Array.isArray(article.tags) ? article.tags : ["CamNang", "KinhMat", "SaigonOne"],
    isFeatured: Boolean(article.isFeatured),
    isPinned: Boolean(article.isPinned),
    isPublished: article.isPublished !== false,
    updatedAt: timestamp,
  };

  if (article.authorRole && article.authorRole.trim()) {
    rawData.authorRole = article.authorRole.trim();
  }
  if (article.lensBrandId && article.lensBrandId.trim()) {
    rawData.lensBrandId = article.lensBrandId.trim();
  }

  const cleanData = sanitizeFirestorePayload(rawData);

  // 1. Ghi đè trực tiếp nội dung mới hoàn toàn lên Firestore collection 'articles' bằng ID hiện tại
  try {
    const articleDocRef = doc(db, "articles", effectiveId);
    console.log(`[Firebase Firestore] Ghi đè trực tiếp setDoc tại collection 'articles', docId: '${effectiveId}':`, cleanData);
    await setDoc(articleDocRef, cleanData); // Ghi đè hoàn toàn, không merge để triệt tiêu mọi dữ liệu cũ
    console.log(`[Firebase Firestore] ✅ THÀNH CÔNG: Đã ghi đè trực tiếp bài viết trong Firestore collection 'articles' (Doc ID: ${effectiveId})`);
  } catch (firestoreErr: any) {
    console.error("[Firebase Firestore ERROR] ❌ Lỗi khi cập nhật bài viết trong collection 'articles':", firestoreErr);
    throw firestoreErr;
  }

  // 2. Ghi đè trực tiếp vào RTDB (set thay vì update để không giữ lại thuộc tính cũ)
  try {
    await set(ref(rtdb, `articles/${effectiveId}`), cleanData);
  } catch (rtdbErr) {
    console.warn("[Firebase RTDB] Ghi đè RTDB thất bại:", rtdbErr);
  }

  // 3. Cập nhật LocalStorage - thay thế hoàn toàn đối tượng
  try {
    const current = await getArticlesFromFirebase();
    const updated = current.map(a => a.id === effectiveId ? (cleanData as Article) : a);
    if (!updated.some(a => a.id === effectiveId)) {
      updated.unshift(cleanData as Article);
    }
    localStorage.setItem("saigonone_articles", JSON.stringify(updated));
  } catch (e) {}

  notifyCrossTabUpdate("articles");
  return true;
}

export async function deleteArticleFromFirebase(articleId: string): Promise<boolean> {
  console.log(`[Firebase] 🚀 Chuẩn bị xóa bài viết khỏi Firestore collection 'articles' (ID: ${articleId})...`);

  // 1. Xóa khỏi Firestore: collection 'articles'
  try {
    const articleDocRef = doc(db, "articles", articleId);
    await deleteDoc(articleDocRef);
    console.log(`[Firebase Firestore] ✅ THÀNH CÔNG: Đã xóa bài viết khỏi collection 'articles' (Doc ID: ${articleId})`);
  } catch (firestoreErr: any) {
    console.error("[Firebase Firestore ERROR] ❌ Lỗi khi xóa bài viết khỏi collection 'articles':", firestoreErr);
    throw firestoreErr;
  }

  // 2. Xóa khỏi RTDB
  try {
    await remove(ref(rtdb, `articles/${articleId}`));
  } catch (e) {}

  // 3. Cập nhật LocalStorage
  try {
    const current = await getArticlesFromFirebase();
    const updated = current.filter(a => a.id !== articleId);
    localStorage.setItem("saigonone_articles", JSON.stringify(updated));
  } catch (e) {}

  notifyCrossTabUpdate("articles");
  return true;
}

// =========================================================================
// 3. CHUYÊN MỤC BÀI VIẾT (Article Categories) CRUD
// =========================================================================

export async function getArticleCategoriesFromFirebase(): Promise<ArticleCategory[]> {
  try {
    const snap = await getDocs(collection(db, "article_categories"));
    if (!snap.empty) {
      const list: ArticleCategory[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() } as ArticleCategory));
      return list;
    }
  } catch (e) {}

  try {
    const snap = await get(child(ref(rtdb), "article_categories"));
    if (snap.exists()) {
      return Object.values(snap.val()) as ArticleCategory[];
    }
  } catch (e) {}

  return [];
}

export async function addArticleCategoryToFirebase(category: ArticleCategory): Promise<boolean> {
  try {
    await setDoc(doc(db, "article_categories", category.id), category);
    await set(ref(rtdb, `article_categories/${category.id}`), category);
    return true;
  } catch (e) {
    return false;
  }
}

export async function deleteArticleCategoryFromFirebase(categoryId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "article_categories", categoryId));
    await remove(ref(rtdb, `article_categories/${categoryId}`));
    return true;
  } catch (e) {
    return false;
  }
}

// =========================================================================
// 4. DANH MỤC SẢN PHẨM (Product Categories) CRUD
// =========================================================================

export async function getProductCategoriesFromFirebase(): Promise<ProductCategoryItem[]> {
  try {
    const snap = await getDocs(collection(db, "product_categories"));
    if (!snap.empty) {
      const list: ProductCategoryItem[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() } as ProductCategoryItem));
      return list;
    }
  } catch (e) {}

  try {
    const snap = await get(child(ref(rtdb), "product_categories"));
    if (snap.exists()) {
      return Object.values(snap.val()) as ProductCategoryItem[];
    }
  } catch (e) {}

  return [];
}

export async function addProductCategoryToFirebase(category: ProductCategoryItem): Promise<boolean> {
  try {
    await setDoc(doc(db, "product_categories", category.id), category);
    await set(ref(rtdb, `product_categories/${category.id}`), category);
    return true;
  } catch (e) {
    return false;
  }
}

export async function deleteProductCategoryFromFirebase(categoryId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "product_categories", categoryId));
    await remove(ref(rtdb, `product_categories/${categoryId}`));
    return true;
  } catch (e) {
    return false;
  }
}

// =========================================================================
// 5. QUẢN TRỊ VIÊN & TÀI KHOẢN ADMIN (Admins CRUD)
// =========================================================================

export async function getAdminsFromFirebase(): Promise<AdminUser[]> {
  try {
    const snap = await getDocs(collection(db, "admins"));
    if (!snap.empty) {
      const list: AdminUser[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() } as AdminUser));
      return list;
    }
  } catch (e) {}

  try {
    const snap = await get(child(ref(rtdb), "admins"));
    if (snap.exists()) {
      return Object.values(snap.val()) as AdminUser[];
    }
  } catch (e) {}

  return [];
}

export async function addAdminToFirebase(admin: AdminUser): Promise<boolean> {
  try {
    await setDoc(doc(db, "admins", admin.id), admin);
    await set(ref(rtdb, `admins/${admin.id}`), admin);
    return true;
  } catch (e) {
    return false;
  }
}

export async function updateAdminInFirebase(admin: AdminUser): Promise<boolean> {
  try {
    await setDoc(doc(db, "admins", admin.id), admin);
    await update(ref(rtdb, `admins/${admin.id}`), admin);
    return true;
  } catch (e) {
    return false;
  }
}

export async function deleteAdminFromFirebase(adminId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "admins", adminId));
    await remove(ref(rtdb, `admins/${adminId}`));
    return true;
  } catch (e) {
    return false;
  }
}

// =========================================================================
// 6. ORDERS CRUD
// =========================================================================

export async function saveOrderToFirebase(orderData: any) {
  const timestamp = new Date().toISOString();
  const orderWithTime = {
    ...orderData,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  let firestoreSuccess = false;
  let rtdbSuccess = false;

  try {
    const docRef = await addDoc(collection(db, "orders"), orderWithTime);
    firestoreSuccess = true;
  } catch (err) {}

  try {
    const ordersRef = ref(rtdb, 'orders/' + orderData.orderCode);
    await set(ordersRef, orderWithTime);
    rtdbSuccess = true;
  } catch (err) {}

  return { orderCode: orderData.orderCode, firestoreSuccess, rtdbSuccess };
}

export async function fetchOrdersFromFirebase(): Promise<any[]> {
  try {
    const dbRef = ref(rtdb);
    const snapshot = await get(child(dbRef, 'orders'));
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.values(data).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  } catch (err) {}

  try {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const list: any[] = [];
    querySnapshot.forEach((docSnap) => list.push({ id: docSnap.id, ...docSnap.data() }));
    if (list.length > 0) return list;
  } catch (err) {}

  return [];
}

export async function updateOrderStatusInFirebase(orderCode: string, newStatus: string): Promise<boolean> {
  const timestamp = new Date().toISOString();
  try {
    const orderRtdbRef = ref(rtdb, `orders/${orderCode}`);
    await update(orderRtdbRef, { status: newStatus, updatedAt: timestamp });
    return true;
  } catch (e) {
    return false;
  }
}

// =========================================================================
// 7. BANNERS & SLIDERS CRUD - LẮNG NGHE REALTIME FIRESTORE (onSnapshot)
// =========================================================================

export async function getBannersFromFirebase(): Promise<BannerSlide[]> {
  try {
    const bannersRef = collection(db, "banners");
    const snapshot = await getDocs(bannersRef);
    if (!snapshot.empty) {
      const list: BannerSlide[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as BannerSlide);
      });
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      try {
        localStorage.setItem("saigonone_banners", JSON.stringify(list));
      } catch (e) {}
      return list;
    }
  } catch (err) {
    console.warn("[Firebase Firestore] Lỗi đọc banners:", err);
  }

  try {
    const rtdbRef = ref(rtdb);
    const snapshot = await get(child(rtdbRef, "banners"));
    if (snapshot.exists()) {
      const data = snapshot.val();
      const list = Object.values(data) as BannerSlide[];
      if (list && list.length > 0) {
        list.sort((a, b) => (a.order || 0) - (b.order || 0));
        try {
          localStorage.setItem("saigonone_banners", JSON.stringify(list));
        } catch (e) {}
        return list;
      }
    }
  } catch (err) {
    console.warn("[Firebase RTDB] Lỗi đọc banners:", err);
  }

  // Không tự động nạp dữ liệu mẫu - chỉ đọc dữ liệu thực tế
  return [];
}

/**
 * Lắng nghe thời gian thực (onSnapshot) cho Banners & Sliders Trang Chủ:
 * Bất kỳ thao tác thêm/sửa/xóa banner trên Firestore sẽ tự động cập nhật ngay trên mọi trình duyệt.
 */
export function subscribeToBannersFromFirebase(
  onUpdate: (banners: BannerSlide[]) => void,
  onError?: (error: any) => void
): () => void {
  let isFirestoreWorking = false;
  let unsubscribeRtdb: (() => void) | null = null;

  try {
    const bannersCol = collection(db, "banners");
    const unsubscribeFirestore = onSnapshot(
      bannersCol,
      (snapshot) => {
        isFirestoreWorking = true;
        const list: BannerSlide[] = [];
        if (!snapshot.empty) {
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() } as BannerSlide);
          });
          list.sort((a, b) => (a.order || 0) - (b.order || 0));
        }
        try {
          localStorage.setItem("saigonone_banners", JSON.stringify(list));
        } catch (e) {}
        onUpdate(list);
      },
      (err) => {
        console.warn("[Firebase Firestore] Lỗi realtime onSnapshot banners:", err);
        if (onError) onError(err);
      }
    );

    // Fallback RTDB realtime listener nếu Firestore bị ngắt kết nối
    try {
      const rtdbRef = ref(rtdb, "banners");
      unsubscribeRtdb = onValue(rtdbRef, (snapshot) => {
        if (!isFirestoreWorking && snapshot.exists()) {
          const data = snapshot.val();
          const list = Object.values(data) as BannerSlide[];
          list.sort((a, b) => (a.order || 0) - (b.order || 0));
          onUpdate(list);
        }
      });
    } catch (e) {}

    return () => {
      unsubscribeFirestore();
      if (unsubscribeRtdb) unsubscribeRtdb();
    };
  } catch (e) {
    console.error("[Firebase] Lỗi khởi tạo listener banners:", e);
    return () => {};
  }
}

export async function saveBannerToFirebase(slide: BannerSlide): Promise<boolean> {
  const clean = sanitizeFirestorePayload(slide);
  try {
    await setDoc(doc(db, "banners", slide.id), clean);
    console.log(`[Firebase Firestore] ✅ Đã ghi đè trực tiếp banner ID: ${slide.id}`);
  } catch (e) {
    console.error("[Firebase] Lỗi ghi đè banner:", e);
    throw e;
  }

  try {
    await set(ref(rtdb, `banners/${slide.id}`), clean);
  } catch (e) {}

  // Update localStorage cache
  try {
    const current = await getBannersFromFirebase();
    const existingIdx = current.findIndex(s => s.id === slide.id);
    let updated: BannerSlide[];
    if (existingIdx >= 0) {
      updated = current.map(s => s.id === slide.id ? (clean as BannerSlide) : s);
    } else {
      updated = [...current, (clean as BannerSlide)];
    }
    localStorage.setItem("saigonone_banners", JSON.stringify(updated));
  } catch (e) {}

  notifyCrossTabUpdate("banners");
  return true;
}

export async function deleteBannerFromFirebase(slideId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "banners", slideId));
  } catch (e) {}

  try {
    await remove(ref(rtdb, `banners/${slideId}`));
  } catch (e) {}

  try {
    const current = await getBannersFromFirebase();
    const filtered = current.filter(s => s.id !== slideId);
    localStorage.setItem("saigonone_banners", JSON.stringify(filtered));
  } catch (e) {}

  notifyCrossTabUpdate("banners");
  return true;
}

export async function saveAllBannersToFirebase(slides: BannerSlide[]): Promise<boolean> {
  if (!slides || slides.length === 0) {
    console.warn("[Firebase] Từ chối lưu danh sách banner rỗng để bảo vệ dữ liệu!");
    return false;
  }
  localStorage.setItem("saigonone_banners", JSON.stringify(slides));
  try {
    for (const slide of slides) {
      await setDoc(doc(db, "banners", slide.id), slide);
      await set(ref(rtdb, `banners/${slide.id}`), slide);
    }
    notifyCrossTabUpdate("banners");
    return true;
  } catch (e) {
    return true;
  }
}

// =========================================================================
// 8. APPOINTMENTS (LỊCH HẸN ĐO MẮT) - FIRESTORE + RTDB + LOCALSTORAGE
// =========================================================================

export async function getAppointmentsFromFirebase(): Promise<Appointment[]> {
  try {
    const apptsRef = collection(db, "appointments");
    const snapshot = await getDocs(apptsRef);
    if (!snapshot.empty) {
      const list: Appointment[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Appointment);
      });
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      localStorage.setItem("saigonone_appointments", JSON.stringify(list));
      return list;
    }
  } catch (err) {
    console.warn("[Firebase Firestore] Lỗi đọc appointments:", err);
  }

  try {
    const rtdbRef = ref(rtdb);
    const snapshot = await get(child(rtdbRef, "appointments"));
    if (snapshot.exists()) {
      const data = snapshot.val();
      const list = Object.values(data) as Appointment[];
      if (list && list.length > 0) {
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        localStorage.setItem("saigonone_appointments", JSON.stringify(list));
        return list;
      }
    }
  } catch (err) {
    console.warn("[Firebase RTDB] Lỗi đọc appointments:", err);
  }

  try {
    const cached = localStorage.getItem("saigonone_appointments");
    if (cached) {
      return JSON.parse(cached) as Appointment[];
    }
  } catch (e) {}

  return [];
}

export async function addAppointmentToFirebase(appointment: Omit<Appointment, "id">): Promise<{ success: boolean; id: string }> {
  const id = `apt-${Date.now()}`;
  const record: Appointment = {
    ...appointment,
    id,
    status: appointment.status || "pending",
    createdAt: appointment.createdAt || new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, "appointments", id), record);
  } catch (e) {
    console.error("[Firestore] Lưu lịch hẹn thất bại:", e);
  }

  try {
    await set(ref(rtdb, `appointments/${id}`), record);
  } catch (e) {
    console.error("[RTDB] Lưu lịch hẹn thất bại:", e);
  }

  try {
    const current = await getAppointmentsFromFirebase();
    const updated = [record, ...current.filter(a => a.id !== id)];
    localStorage.setItem("saigonone_appointments", JSON.stringify(updated));
  } catch (e) {}

  return { success: true, id };
}

export async function updateAppointmentStatusInFirebase(
  id: string, 
  status: "pending" | "confirmed" | "completed" | "cancelled"
): Promise<boolean> {
  try {
    await updateDoc(doc(db, "appointments", id), { status });
  } catch (e) {}

  try {
    await update(ref(rtdb, `appointments/${id}`), { status });
  } catch (e) {}

  try {
    const current = await getAppointmentsFromFirebase();
    const updated = current.map(a => a.id === id ? { ...a, status } : a);
    localStorage.setItem("saigonone_appointments", JSON.stringify(updated));
  } catch (e) {}

  return true;
}

export async function deleteAppointmentFromFirebase(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "appointments", id));
  } catch (e) {}

  try {
    await remove(ref(rtdb, `appointments/${id}`));
  } catch (e) {}

  try {
    const current = await getAppointmentsFromFirebase();
    const updated = current.filter(a => a.id !== id);
    localStorage.setItem("saigonone_appointments", JSON.stringify(updated));
  } catch (e) {}

  return true;
}

// =========================================================================
// 9. LENS BRAND CATEGORIES (DANH MỤC THƯƠNG HIỆU TRÒNG KÍNH) CRUD
// =========================================================================

export async function getLensBrandsFromFirebase(): Promise<LensBrandCategory[]> {
  try {
    const snap = await getDocs(collection(db, "lens_brands"));
    if (!snap.empty) {
      const list: LensBrandCategory[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() } as LensBrandCategory));
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      try {
        localStorage.setItem("saigonone_lens_brands", JSON.stringify(list));
      } catch (e) {}
      return list;
    }
  } catch (e) {}

  try {
    const snap = await get(child(ref(rtdb), "lens_brands"));
    if (snap.exists()) {
      const list = Object.values(snap.val()) as LensBrandCategory[];
      if (list && list.length > 0) {
        list.sort((a, b) => (a.order || 0) - (b.order || 0));
        try {
          localStorage.setItem("saigonone_lens_brands", JSON.stringify(list));
        } catch (e) {}
        return list;
      }
    }
  } catch (e) {}

  // Không tự động nạp dữ liệu mẫu - chỉ đọc dữ liệu thực tế
  return [];
}

export function subscribeToLensBrandsFromFirebase(
  onUpdate: (brands: LensBrandCategory[]) => void,
  onError?: (err: any) => void
): () => void {
  try {
    const q = collection(db, "lens_brands");
    return onSnapshot(
      q,
      (snapshot) => {
        const list: LensBrandCategory[] = [];
        if (!snapshot.empty) {
          snapshot.forEach((d) => list.push({ id: d.id, ...d.data() } as LensBrandCategory));
          list.sort((a, b) => (a.order || 0) - (b.order || 0));
        }
        try { localStorage.setItem("saigonone_lens_brands", JSON.stringify(list)); } catch (e) {}
        onUpdate(list);
      },
      (err) => {
        if (onError) onError(err);
      }
    );
  } catch (e) {
    return () => {};
  }
}

export async function addLensBrandToFirebase(brand: LensBrandCategory): Promise<boolean> {
  try {
    await setDoc(doc(db, "lens_brands", brand.id), brand);
  } catch (e) {}

  try {
    await set(ref(rtdb, `lens_brands/${brand.id}`), brand);
  } catch (e) {}

  try {
    const current = await getLensBrandsFromFirebase();
    const updated = [...current.filter(b => b.id !== brand.id), brand];
    updated.sort((a, b) => (a.order || 0) - (b.order || 0));
    localStorage.setItem("saigonone_lens_brands", JSON.stringify(updated));
  } catch (e) {}

  return true;
}

export async function updateLensBrandInFirebase(brand: LensBrandCategory): Promise<boolean> {
  const cleanData = sanitizeFirestorePayload(brand);
  try {
    await setDoc(doc(db, "lens_brands", brand.id), cleanData);
    console.log(`[Firebase Firestore] ✅ Đã ghi đè trực tiếp thương hiệu tròng ID: ${brand.id}`);
  } catch (e) {
    console.error("[Firebase] Lỗi ghi đè lens_brand:", e);
    throw e;
  }

  try {
    await set(ref(rtdb, `lens_brands/${brand.id}`), cleanData);
  } catch (e) {}

  try {
    const current = await getLensBrandsFromFirebase();
    const updated = current.map(b => b.id === brand.id ? (cleanData as LensBrandCategory) : b);
    if (!updated.some(b => b.id === brand.id)) {
      updated.push(cleanData as LensBrandCategory);
    }
    updated.sort((a, b) => (a.order || 0) - (b.order || 0));
    localStorage.setItem("saigonone_lens_brands", JSON.stringify(updated));
  } catch (e) {}

  notifyCrossTabUpdate("lens_brands");
  return true;
}

export async function deleteLensBrandFromFirebase(brandId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "lens_brands", brandId));
  } catch (e) {}

  try {
    await remove(ref(rtdb, `lens_brands/${brandId}`));
  } catch (e) {}

  try {
    const current = await getLensBrandsFromFirebase();
    const updated = current.filter(b => b.id !== brandId);
    localStorage.setItem("saigonone_lens_brands", JSON.stringify(updated));
  } catch (e) {}

  return true;
}

// =========================================================================
// 10. LENS ARTICLES (BÀI VIẾT TRÒNG KÍNH - COLLECTION 'lens_articles') CRUD
// =========================================================================

export async function getLensArticlesFromFirebase(): Promise<Article[]> {
  // 1. First Priority: Direct query to Firestore 'lens_articles' collection
  try {
    const lensArticlesRef = collection(db, "lens_articles");
    const snapshot = await getDocs(lensArticlesRef);
    if (!snapshot.empty) {
      const list: Article[] = [];
      snapshot.forEach((d) => {
        const raw = d.data();
        const item: Article = {
          id: d.id,
          title: raw.title || raw.name || "Bài Viết Tròng Kính",
          slug: raw.slug || "",
          summary: raw.summary || raw.description || raw.excerpt || "",
          content: raw.content || raw.body || raw.htmlContent || "",
          thumbnail: raw.thumbnail || raw.image || raw.imageUrl || raw.cover || "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=900&q=80",
          category: raw.category || "Tròng Kính Chính Hãng",
          author: raw.author || raw.authorName || "Chuyên Gia Kính Thuốc Saigon One",
          authorRole: raw.authorRole || raw.role || "Chuyên Viên Khúc Xạ",
          publishedAt: raw.publishedAt || raw.publishedDate || raw.createdAt || "2026",
          readTime: raw.readTime || "5 phút đọc",
          views: typeof raw.views === "number" ? raw.views : 150,
          tags: Array.isArray(raw.tags) ? raw.tags : [],
          isFeatured: Boolean(raw.isFeatured || raw.featured || raw.isPinned || raw.pinned),
          isPinned: Boolean(raw.isPinned || raw.pinned),
          isPublished: raw.isPublished !== false,
          lensBrandId: raw.lensBrandId || "",
          ...raw,
        };
        list.push(item);
      });
      if (list.length > 0) {
        try { localStorage.setItem("saigonone_lens_articles", JSON.stringify(list)); } catch (e) {}
        return list;
      }
    }
  } catch (err) {
    console.warn("[Firebase Firestore] Lấy lens_articles thất bại, thử RTDB/Local:", err);
  }

  // 2. Second Priority: Try RTDB 'lens_articles'
  try {
    const rtdbRef = ref(rtdb);
    const snap = await get(child(rtdbRef, "lens_articles"));
    if (snap.exists()) {
      const data = snap.val();
      const list = Object.values(data) as Article[];
      if (list && list.length > 0) {
        try { localStorage.setItem("saigonone_lens_articles", JSON.stringify(list)); } catch (e) {}
        return list;
      }
    }
  } catch (e) {}

  // Không tự động nạp dữ liệu mẫu - chỉ đọc dữ liệu thực tế
  return [];
}

/**
 * Lắng nghe thời gian thực (onSnapshot) cho Bài Viết Tròng Kính (Lens Articles):
 * Bất kỳ thao tác thêm/sửa/xóa trên Firestore sẽ tự động cập nhật ngay trên mọi trình duyệt.
 */
export function subscribeToLensArticlesFromFirebase(
  onUpdate: (articles: Article[]) => void,
  onError?: (error: any) => void
): () => void {
  let isFirestoreWorking = false;
  let unsubscribeRtdb: (() => void) | null = null;

  try {
    const q = collection(db, "lens_articles");
    const unsubscribeFirestore = onSnapshot(
      q,
      (snapshot) => {
        isFirestoreWorking = true;
        const list: Article[] = [];
        snapshot.forEach((d) => {
          const raw = d.data();
          const item: Article = {
            id: d.id,
            title: raw.title || raw.name || "Bài Viết Tròng Kính",
            slug: raw.slug || "",
            summary: raw.summary || raw.description || raw.excerpt || "",
            content: raw.content || raw.body || raw.htmlContent || "",
            thumbnail: raw.thumbnail || raw.image || raw.imageUrl || raw.cover || "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=900&q=80",
            category: raw.category || "Tròng Kính Chính Hãng",
            author: raw.author || raw.authorName || "Chuyên Gia Kính Thuốc Saigon One",
            authorRole: raw.authorRole || raw.role || "Chuyên Viên Khúc Xạ",
            publishedAt: raw.publishedAt || raw.publishedDate || raw.createdAt || "2026",
            readTime: raw.readTime || "5 phút đọc",
            views: typeof raw.views === "number" ? raw.views : 150,
            viewsCount: typeof raw.viewsCount === "number" ? raw.viewsCount : 150,
            tags: Array.isArray(raw.tags) ? raw.tags : [],
            isFeatured: Boolean(raw.isFeatured || raw.featured || raw.isPinned || raw.pinned),
            isPinned: Boolean(raw.isPinned || raw.pinned),
            isPublished: raw.isPublished !== false,
            lensBrandId: raw.lensBrandId || "",
            ...raw,
          };
          list.push(item);
        });

        // Sắp xếp bài viết tròng kính: Ghim lên đầu, sau đó theo ngày
        list.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          const timeB = new Date(b.publishedAt || (b as any).createdAt || 0).getTime();
          const timeA = new Date(a.publishedAt || (a as any).createdAt || 0).getTime();
          return timeB - timeA;
        });

        try { localStorage.setItem("saigonone_lens_articles", JSON.stringify(list)); } catch (e) {}
        onUpdate(list);
      },
      (err) => {
        console.warn("[Firebase Firestore] Realtime lens_articles onSnapshot error:", err);
        if (onError) onError(err);
      }
    );

    // Fallback RTDB realtime listener
    try {
      const rtdbRef = ref(rtdb, "lens_articles");
      unsubscribeRtdb = onValue(rtdbRef, (snap) => {
        if (!isFirestoreWorking && snap.exists()) {
          const data = snap.val();
          const list = Object.values(data) as Article[];
          if (list && list.length > 0) {
            onUpdate(list);
          }
        }
      });
    } catch (e) {}

    return () => {
      unsubscribeFirestore();
      if (unsubscribeRtdb) unsubscribeRtdb();
    };
  } catch (e) {
    console.error("[Firebase] Lỗi khởi tạo listener lens_articles:", e);
    return () => {};
  }
}

export async function addLensArticleToFirebase(article: Article): Promise<boolean> {
  const timestamp = new Date().toISOString();
  const data = {
    ...article,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  try {
    await setDoc(doc(db, "lens_articles", article.id), data);
  } catch (e) {}

  try {
    await set(ref(rtdb, `lens_articles/${article.id}`), data);
  } catch (e) {}

  try {
    const current = await getLensArticlesFromFirebase();
    const updated = [data, ...current.filter(a => a.id !== article.id)];
    localStorage.setItem("saigonone_lens_articles", JSON.stringify(updated));
  } catch (e) {}

  notifyCrossTabUpdate("lens_articles");
  return true;
}

export async function updateLensArticleInFirebase(article: Article): Promise<boolean> {
  const timestamp = new Date().toISOString();
  const data = {
    ...article,
    updatedAt: timestamp,
  };
  const cleanData = sanitizeFirestorePayload(data);

  try {
    await setDoc(doc(db, "lens_articles", article.id), cleanData);
    console.log(`[Firebase Firestore] ✅ Đã ghi đè trực tiếp bài viết tròng kính ID: ${article.id}`);
  } catch (e) {
    console.error("[Firebase] Lỗi ghi đè lens_article:", e);
    throw e;
  }

  try {
    await set(ref(rtdb, `lens_articles/${article.id}`), cleanData);
  } catch (e) {}

  try {
    const current = await getLensArticlesFromFirebase();
    const updated = current.map(a => a.id === article.id ? (cleanData as Article) : a);
    if (!updated.some(a => a.id === article.id)) {
      updated.unshift(cleanData as Article);
    }
    localStorage.setItem("saigonone_lens_articles", JSON.stringify(updated));
  } catch (e) {}

  notifyCrossTabUpdate("lens_articles");
  return true;
}

export async function deleteLensArticleFromFirebase(articleId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "lens_articles", articleId));
  } catch (e) {}

  try {
    await remove(ref(rtdb, `lens_articles/${articleId}`));
  } catch (e) {}

  try {
    const current = await getLensArticlesFromFirebase();
    const updated = current.filter(a => a.id !== articleId);
    localStorage.setItem("saigonone_lens_articles", JSON.stringify(updated));
  } catch (e) {}

  notifyCrossTabUpdate("lens_articles");
  return true;
}


