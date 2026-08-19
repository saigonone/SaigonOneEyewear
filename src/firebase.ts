import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
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
import { Product, Order, Article, ArticleCategory, ProductCategoryItem, AdminUser } from "./types";
import { MOCK_PRODUCTS } from "./data/mockProducts";
import { 
  INITIAL_ARTICLES, 
  INITIAL_ARTICLE_CATEGORIES, 
  INITIAL_PRODUCT_CATEGORIES, 
  INITIAL_ADMINS 
} from "./data/mockArticles";

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
// 1. PRODUCTS CRUD - THAO TÁC TRỰC TIẾP VỚI FIREBASE
// =========================================================================

export async function getProductsFromFirebase(): Promise<Product[]> {
  try {
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);
    if (!snapshot.empty) {
      const list: Product[] = [];
      snapshot.forEach((docSnapshot) => {
        list.push({ id: docSnapshot.id, ...docSnapshot.data() } as Product);
      });
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
      const list = Object.values(data) as Product[];
      if (list && list.length > 0) return list;
    }
  } catch (err) {
    console.warn("[Firebase RTDB] Lỗi đọc products:", err);
  }

  // Tự động nạp mẫu lên Firebase nếu chưa có
  await seedInitialProductsToFirebase();
  return MOCK_PRODUCTS;
}

export async function addProductToFirebase(product: Product): Promise<{ success: boolean; id: string }> {
  const timestamp = new Date().toISOString();
  const productWithMeta = {
    ...product,
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

  return { success: true, id: product.id };
}

export async function updateProductInFirebase(product: Product): Promise<boolean> {
  const timestamp = new Date().toISOString();
  const updateData = { ...product, updatedAt: timestamp };

  try {
    await setDoc(doc(db, "products", product.id), updateData);
  } catch (e) {}

  try {
    await update(ref(rtdb, `products/${product.id}`), updateData);
  } catch (e) {}

  return true;
}

export async function deleteProductFromFirebase(productId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "products", productId));
  } catch (e) {}

  try {
    await remove(ref(rtdb, `products/${productId}`));
  } catch (e) {}

  return true;
}

export function subscribeToProductsFromFirebase(onUpdate: (products: Product[]) => void) {
  try {
    const q = collection(db, "products");
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const list: Product[] = [];
        snapshot.forEach((d) => list.push({ id: d.id, ...d.data() } as Product));
        onUpdate(list);
      }
    }, () => {});
  } catch (e) {
    return () => {};
  }
}

export async function seedInitialProductsToFirebase() {
  for (const item of MOCK_PRODUCTS) {
    try {
      await setDoc(doc(db, "products", item.id), item);
      await set(ref(rtdb, `products/${item.id}`), item);
    } catch (e) {}
  }
}

// =========================================================================
// 2. ARTICLES / BÀI VIẾT CRUD - THAO TÁC TRỰC TIẾP VỚI FIREBASE
// =========================================================================

export async function getArticlesFromFirebase(): Promise<Article[]> {
  try {
    const articlesRef = collection(db, "articles");
    const snapshot = await getDocs(articlesRef);
    if (!snapshot.empty) {
      const list: Article[] = [];
      snapshot.forEach((d) => list.push({ id: d.id, ...d.data() } as Article));
      return list;
    }
  } catch (err) {
    console.warn("[Firebase Firestore] Lấy articles thất bại, thử RTDB:", err);
  }

  try {
    const rtdbRef = ref(rtdb);
    const snap = await get(child(rtdbRef, "articles"));
    if (snap.exists()) {
      const data = snap.val();
      return Object.values(data) as Article[];
    }
  } catch (e) {}

  // Nạp bài viết mẫu ban đầu lên Firebase
  await seedInitialArticlesToFirebase();
  return INITIAL_ARTICLES;
}

export async function addArticleToFirebase(article: Article): Promise<boolean> {
  const timestamp = new Date().toISOString();
  const data = {
    ...article,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  try {
    await setDoc(doc(db, "articles", article.id), data);
  } catch (e) {}

  try {
    await set(ref(rtdb, `articles/${article.id}`), data);
  } catch (e) {}

  return true;
}

export async function updateArticleInFirebase(article: Article): Promise<boolean> {
  const timestamp = new Date().toISOString();
  const data = {
    ...article,
    updatedAt: timestamp,
  };

  try {
    await setDoc(doc(db, "articles", article.id), data);
  } catch (e) {}

  try {
    await update(ref(rtdb, `articles/${article.id}`), data);
  } catch (e) {}

  return true;
}

export async function deleteArticleFromFirebase(articleId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "articles", articleId));
  } catch (e) {}

  try {
    await remove(ref(rtdb, `articles/${articleId}`));
  } catch (e) {}

  return true;
}

export async function seedInitialArticlesToFirebase() {
  for (const art of INITIAL_ARTICLES) {
    try {
      await setDoc(doc(db, "articles", art.id), art);
      await set(ref(rtdb, `articles/${art.id}`), art);
    } catch (e) {}
  }
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

  // Seed default categories
  for (const cat of INITIAL_ARTICLE_CATEGORIES) {
    try {
      await setDoc(doc(db, "article_categories", cat.id), cat);
      await set(ref(rtdb, `article_categories/${cat.id}`), cat);
    } catch (e) {}
  }
  return INITIAL_ARTICLE_CATEGORIES;
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

  // Seed default product categories
  for (const cat of INITIAL_PRODUCT_CATEGORIES) {
    try {
      await setDoc(doc(db, "product_categories", cat.id), cat);
      await set(ref(rtdb, `product_categories/${cat.id}`), cat);
    } catch (e) {}
  }
  return INITIAL_PRODUCT_CATEGORIES;
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

  // Seed default admin accounts
  for (const adm of INITIAL_ADMINS) {
    try {
      await setDoc(doc(db, "admins", adm.id), adm);
      await set(ref(rtdb, `admins/${adm.id}`), adm);
    } catch (e) {}
  }
  return INITIAL_ADMINS;
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
