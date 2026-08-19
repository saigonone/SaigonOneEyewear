import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc,
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
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { Product, Order } from "./types";
import { MOCK_PRODUCTS } from "./data/mockProducts";

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

// Initialize Firestore, Realtime Database and Auth
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const auth = getAuth(app);

// =========================================================================
// 1. PRODUCTS CRUD - THAO TÁC TRỰC TIẾP VỚI FIREBASE (KHÔNG DÙNG LOCALSTORAGE)
// =========================================================================

/**
 * Lấy toàn bộ danh sách sản phẩm trực tiếp từ Firebase (Firestore hoặc Realtime Database)
 * Nếu trên Firebase chưa có sản phẩm nào, tự động đẩy danh mục kính ban đầu lên Firebase.
 */
export async function getProductsFromFirebase(): Promise<Product[]> {
  try {
    // 1. Thử lấy từ Firestore
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);
    
    if (!snapshot.empty) {
      const productsList: Product[] = [];
      snapshot.forEach((docSnapshot) => {
        productsList.push({ id: docSnapshot.id, ...docSnapshot.data() } as Product);
      });
      console.log(`[Firebase Firestore] Đã tải thành công ${productsList.length} sản phẩm.`);
      return productsList;
    }
  } catch (firestoreErr) {
    console.warn("[Firebase Firestore] Lỗi đọc products, chuyển sang Realtime Database:", firestoreErr);
  }

  try {
    // 2. Thử lấy từ Realtime Database
    const rtdbRef = ref(rtdb);
    const rtdbSnapshot = await get(child(rtdbRef, "products"));
    if (rtdbSnapshot.exists()) {
      const data = rtdbSnapshot.val();
      const list = Object.values(data) as Product[];
      if (list && list.length > 0) {
        console.log(`[Firebase RTDB] Đã tải thành công ${list.length} sản phẩm.`);
        return list;
      }
    }
  } catch (rtdbErr) {
    console.warn("[Firebase RTDB] Lỗi đọc products từ Realtime DB:", rtdbErr);
  }

  // 3. Nếu Firebase trống dữ liệu, tự động đồng bộ danh sách sản phẩm ban đầu lên Firebase
  console.log("[Firebase] Database sản phẩm đang trống. Tự động khởi tạo dữ liệu mẫu lên Firebase...");
  await seedInitialProductsToFirebase();
  return MOCK_PRODUCTS;
}

/**
 * Thêm sản phẩm mới trực tiếp lên Firebase (Firestore & Realtime Database)
 */
export async function addProductToFirebase(product: Product): Promise<{ success: boolean; id: string }> {
  const timestamp = new Date().toISOString();
  const productWithMeta = {
    ...product,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  let firestoreSuccess = false;
  let rtdbSuccess = false;

  // Thao tác với Firestore qua setDoc hoặc addDoc
  try {
    const docRef = doc(db, "products", product.id);
    await setDoc(docRef, productWithMeta);
    firestoreSuccess = true;
    console.log("[Firebase Firestore] Đã thêm sản phẩm thành công:", product.id);
  } catch (err) {
    console.error("[Firebase Firestore] Lỗi thêm sản phẩm:", err);
  }

  // Thao tác với Realtime Database qua set(ref)
  try {
    const productRtdbRef = ref(rtdb, `products/${product.id}`);
    await set(productRtdbRef, productWithMeta);
    rtdbSuccess = true;
    console.log("[Firebase RTDB] Đã lưu sản phẩm lên Realtime Database:", product.id);
  } catch (err) {
    console.error("[Firebase RTDB] Lỗi lưu sản phẩm:", err);
  }

  return {
    success: firestoreSuccess || rtdbSuccess,
    id: product.id,
  };
}

/**
 * Cập nhật sản phẩm trực tiếp trên Firebase
 */
export async function updateProductInFirebase(product: Product): Promise<boolean> {
  const timestamp = new Date().toISOString();
  const updateData = {
    ...product,
    updatedAt: timestamp,
  };

  let success = false;

  try {
    const docRef = doc(db, "products", product.id);
    await updateDoc(docRef, updateData);
    success = true;
  } catch (err) {
    // Nếu chưa có doc thì dùng setDoc
    try {
      await setDoc(doc(db, "products", product.id), updateData);
      success = true;
    } catch (e) {
      console.error("[Firebase Firestore] Lỗi cập nhật sản phẩm:", e);
    }
  }

  try {
    const productRtdbRef = ref(rtdb, `products/${product.id}`);
    await update(productRtdbRef, updateData);
    success = true;
  } catch (err) {
    console.error("[Firebase RTDB] Lỗi cập nhật sản phẩm:", err);
  }

  return success;
}

/**
 * Xóa sản phẩm trực tiếp trên Firebase (Firestore và Realtime Database)
 */
export async function deleteProductFromFirebase(productId: string): Promise<boolean> {
  let success = false;

  // Xóa trên Firestore qua deleteDoc
  try {
    const docRef = doc(db, "products", productId);
    await deleteDoc(docRef);
    console.log("[Firebase Firestore] Đã xóa sản phẩm:", productId);
    success = true;
  } catch (err) {
    console.error("[Firebase Firestore] Lỗi khi xóa sản phẩm:", err);
  }

  // Xóa trên Realtime Database qua remove(ref)
  try {
    const productRtdbRef = ref(rtdb, `products/${productId}`);
    await remove(productRtdbRef);
    console.log("[Firebase RTDB] Đã xóa sản phẩm khỏi Realtime DB:", productId);
    success = true;
  } catch (err) {
    console.error("[Firebase RTDB] Lỗi khi xóa sản phẩm trên Realtime DB:", err);
  }

  return success;
}

/**
 * Lắng nghe thời gian thực (Realtime Snapshot) danh sách sản phẩm từ Firebase
 */
export function subscribeToProductsFromFirebase(onUpdate: (products: Product[]) => void) {
  try {
    const q = collection(db, "products");
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const list: Product[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...d.data() } as Product);
        });
        onUpdate(list);
      }
    }, (error) => {
      console.warn("[Firebase] onSnapshot error:", error);
    });
  } catch (e) {
    console.warn("Could not subscribe to Firestore products:", e);
    return () => {};
  }
}

/**
 * Đẩy dữ liệu sản phẩm mẫu lên Firebase khi Database khởi tạo lần đầu
 */
export async function seedInitialProductsToFirebase() {
  for (const item of MOCK_PRODUCTS) {
    try {
      // Đẩy lên Firestore
      await setDoc(doc(db, "products", item.id), item);
      // Đẩy lên Realtime Database
      await set(ref(rtdb, `products/${item.id}`), item);
    } catch (e) {
      console.warn(`[Firebase Seed] Bỏ qua lỗi nhỏ khi seed ${item.id}:`, e);
    }
  }
  console.log("[Firebase] Hoàn tất nạp danh mục sản phẩm ban đầu lên Firebase.");
}

// =========================================================================
// 2. ARTICLES / BÀI VIẾT CRUD - THAO TÁC TRỰC TIẾP VỚI FIREBASE
// =========================================================================

export interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  thumbnail: string;
  category: string;
  authorId: string;
  authorName: string;
  isPublished: boolean;
  viewsCount?: number;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Lấy danh sách bài viết từ Firebase
 */
export async function getArticlesFromFirebase(): Promise<ArticleItem[]> {
  try {
    const articlesRef = collection(db, "articles");
    const snapshot = await getDocs(articlesRef);
    if (!snapshot.empty) {
      const list: ArticleItem[] = [];
      snapshot.forEach((d) => list.push({ id: d.id, ...d.data() } as ArticleItem));
      return list;
    }
  } catch (err) {
    console.warn("[Firebase Firestore] Lấy bài viết thất bại:", err);
  }

  try {
    const rtdbRef = ref(rtdb);
    const snap = await get(child(rtdbRef, "articles"));
    if (snap.exists()) {
      return Object.values(snap.val()) as ArticleItem[];
    }
  } catch (e) {
    console.warn("[Firebase RTDB] Lấy bài viết thất bại:", e);
  }

  return [];
}

/**
 * Thêm bài viết mới lên Firebase
 */
export async function addArticleToFirebase(article: ArticleItem): Promise<boolean> {
  const timestamp = new Date().toISOString();
  const data = {
    ...article,
    createdAt: article.createdAt || timestamp,
    updatedAt: timestamp,
  };

  let success = false;
  try {
    await setDoc(doc(db, "articles", article.id), data);
    success = true;
  } catch (e) {
    console.error("Lỗi thêm bài viết Firestore:", e);
  }

  try {
    await set(ref(rtdb, `articles/${article.id}`), data);
    success = true;
  } catch (e) {
    console.error("Lỗi thêm bài viết RTDB:", e);
  }

  return success;
}

/**
 * Xóa bài viết khỏi Firebase
 */
export async function deleteArticleFromFirebase(articleId: string): Promise<boolean> {
  let success = false;
  try {
    await deleteDoc(doc(db, "articles", articleId));
    success = true;
  } catch (e) {
    console.error("Lỗi xóa bài viết Firestore:", e);
  }

  try {
    await remove(ref(rtdb, `articles/${articleId}`));
    success = true;
  } catch (e) {
    console.error("Lỗi xóa bài viết RTDB:", e);
  }

  return success;
}

// =========================================================================
// 3. ORDERS / ĐƠN HÀNG CRUD - THAO TÁC TRỰC TIẾP VỚI FIREBASE
// =========================================================================

/**
 * Lưu đơn hàng mới lên Firebase (Firestore qua addDoc & Realtime Database qua set(ref))
 */
export async function saveOrderToFirebase(orderData: any) {
  const timestamp = new Date().toISOString();
  const orderWithTime = {
    ...orderData,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  let firestoreSuccess = false;
  let rtdbSuccess = false;

  // 1. Lưu vào Firestore qua addDoc
  try {
    const docRef = await addDoc(collection(db, "orders"), orderWithTime);
    console.log("[Firebase Firestore] Đơn hàng đã được tạo thành công, Document ID:", docRef.id);
    firestoreSuccess = true;
  } catch (err) {
    console.warn("[Firebase Firestore] Lưu đơn hàng gặp lỗi:", err);
  }

  // 2. Lưu vào Realtime Database qua set(ref)
  try {
    const ordersRef = ref(rtdb, 'orders/' + orderData.orderCode);
    await set(ordersRef, orderWithTime);
    console.log("[Firebase RTDB] Đơn hàng đã lưu với mã:", orderData.orderCode);
    rtdbSuccess = true;
  } catch (err) {
    console.warn("[Firebase RTDB] Lưu đơn hàng gặp lỗi:", err);
  }

  return {
    orderCode: orderData.orderCode,
    firestoreSuccess,
    rtdbSuccess,
  };
}

/**
 * Lấy tất cả đơn hàng từ Firebase
 */
export async function fetchOrdersFromFirebase(): Promise<any[]> {
  try {
    // 1. Thử lấy từ Realtime Database
    const dbRef = ref(rtdb);
    const snapshot = await get(child(dbRef, 'orders'));
    if (snapshot.exists()) {
      const data = snapshot.val();
      const list = Object.values(data) as any[];
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  } catch (err) {
    console.warn("[Firebase RTDB] Không lấy được đơn hàng từ Realtime Database:", err);
  }

  try {
    // 2. Thử lấy từ Firestore qua getDocs
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const list: any[] = [];
    querySnapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() });
    });
    if (list.length > 0) return list;
  } catch (err) {
    console.warn("[Firebase Firestore] Không lấy được đơn hàng từ Firestore:", err);
  }

  return [];
}

/**
 * Cập nhật trạng thái đơn hàng trực tiếp trên Firebase
 */
export async function updateOrderStatusInFirebase(orderCode: string, newStatus: string): Promise<boolean> {
  const timestamp = new Date().toISOString();
  let success = false;

  try {
    const orderRtdbRef = ref(rtdb, `orders/${orderCode}`);
    await update(orderRtdbRef, {
      status: newStatus,
      updatedAt: timestamp,
    });
    success = true;
  } catch (e) {
    console.warn("[Firebase RTDB] Lỗi cập nhật trạng thái đơn hàng:", e);
  }

  return success;
}
