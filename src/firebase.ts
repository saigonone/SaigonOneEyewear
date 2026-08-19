import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, Timestamp } from "firebase/firestore";
import { getDatabase, ref, set, push, get, child, update } from "firebase/database";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

// Web app's Firebase configuration provided by the user
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

// Initialize Firebase safely
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const auth = getAuth(app);

// Helper for saving orders to Firestore / Realtime DB with offline localStorage fallback
export async function saveOrderToFirebase(orderData: any) {
  const timestamp = new Date().toISOString();
  const orderWithTime = {
    ...orderData,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  let firestoreSuccess = false;
  let rtdbSuccess = false;

  // Try Firestore
  try {
    const docRef = await addDoc(collection(db, "orders"), orderWithTime);
    console.log("Order saved to Firestore with ID: ", docRef.id);
    firestoreSuccess = true;
  } catch (err) {
    console.warn("Firestore save fallback:", err);
  }

  // Try Realtime Database
  try {
    const ordersRef = ref(rtdb, 'orders/' + orderData.orderCode);
    await set(ordersRef, orderWithTime);
    console.log("Order saved to Realtime Database with code: ", orderData.orderCode);
    rtdbSuccess = true;
  } catch (err) {
    console.warn("RTDB save fallback:", err);
  }

  // Always store in local storage as a reliable cache/backup
  try {
    const localOrders = JSON.parse(localStorage.getItem("saigonone_orders") || "[]");
    localOrders.unshift(orderWithTime);
    localStorage.setItem("saigonone_orders", JSON.stringify(localOrders));
  } catch (e) {
    console.error("Local storage error", e);
  }

  return {
    orderCode: orderData.orderCode,
    firestoreSuccess,
    rtdbSuccess,
  };
}

// Fetch all orders
export async function fetchOrdersFromFirebase(): Promise<any[]> {
  const localOrders = JSON.parse(localStorage.getItem("saigonone_orders") || "[]");
  try {
    // Try RTDB first
    const dbRef = ref(rtdb);
    const snapshot = await get(child(dbRef, 'orders'));
    if (snapshot.exists()) {
      const data = snapshot.val();
      const list = Object.values(data);
      // Merge unique orders
      const map = new Map<string, any>();
      list.forEach((item: any) => map.set(item.orderCode, item));
      localOrders.forEach((item: any) => {
        if (!map.has(item.orderCode)) map.set(item.orderCode, item);
      });
      return Array.from(map.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  } catch (err) {
    console.warn("Could not fetch from RTDB, trying Firestore or local:", err);
  }

  try {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const list: any[] = [];
    querySnapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() });
    });
    if (list.length > 0) return list;
  } catch (err) {
    console.warn("Could not fetch from Firestore, returning local orders:", err);
  }

  return localOrders;
}
