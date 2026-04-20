// Firebase Configuration
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, serverTimestamp } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoKeyForGlobalTalent",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "global-talent-5426f.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "global-talent-5426f",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "global-talent-5426f.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

// Google Auth Provider
const googleProvider = new GoogleAuthProvider()

// Auth Functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    return result.user
  } catch (error) {
    console.error("Google sign in error:", error)
    throw error
  }
}

export const signUpWithEmail = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    return result.user
  } catch (error) {
    console.error("Sign up error:", error)
    throw error
  }
}

export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result.user
  } catch (error) {
    console.error("Sign in error:", error)
    throw error
  }
}

export const logoutUser = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error("Logout error:", error)
    throw error
  }
}

// Firestore Functions
export const createUserProfile = async (userId, userData) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error("Create user profile error:", error)
    throw error
  }
}

export const getUserProfile = async (userId) => {
  try {
    const docRef = doc(db, 'users', userId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return docSnap.data()
    }
    return null
  } catch (error) {
    console.error("Get user profile error:", error)
    throw error
  }
}

export const updateUserProfile = async (userId, data) => {
  try {
    const docRef = doc(db, 'users', userId)
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error("Update user profile error:", error)
    throw error
  }
}

// Gigs Functions
export const createGig = async (gigData) => {
  try {
    const docRef = await addDoc(collection(db, 'gigs'), {
      ...gigData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return docRef.id
  } catch (error) {
    console.error("Create gig error:", error)
    throw error
  }
}

export const getGigs = async (category = null, limit_count = 50) => {
  try {
    let q = query(collection(db, 'gigs'), orderBy('createdAt', 'desc'), limit(limit_count))
    if (category && category !== 'all') {
      q = query(collection(db, 'gigs'), where('category', '==', category), orderBy('createdAt', 'desc'), limit(limit_count))
    }
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error("Get gigs error:", error)
    throw error
  }
}

export const getGigById = async (gigId) => {
  try {
    const docRef = doc(db, 'gigs', gigId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    }
    return null
  } catch (error) {
    console.error("Get gig error:", error)
    throw error
  }
}

// Orders Functions
export const createOrder = async (orderData) => {
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return docRef.id
  } catch (error) {
    console.error("Create order error:", error)
    throw error
  }
}

export const getUserOrders = async (userId, as = 'buyer') => {
  try {
    const field = as === 'buyer' ? 'buyerId' : 'sellerId'
    const q = query(collection(db, 'orders'), where(field, '==', userId), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error("Get orders error:", error)
    throw error
  }
}

export const updateOrderStatus = async (orderId, status) => {
  try {
    const docRef = doc(db, 'orders', orderId)
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error("Update order error:", error)
    throw error
  }
}

// Messages Functions
export const sendMessage = async (messageData) => {
  try {
    const docRef = await addDoc(collection(db, 'messages'), {
      ...messageData,
      createdAt: serverTimestamp()
    })
    return docRef.id
  } catch (error) {
    console.error("Send message error:", error)
    throw error
  }
}

export const getConversation = async (userId1, userId2) => {
  try {
    const q = query(
      collection(db, 'messages'),
      where('participants', 'array-contains-any', [userId1, userId2]),
      orderBy('createdAt', 'asc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error("Get conversation error:", error)
    throw error
  }
}

// Favorites Functions
export const addToFavorites = async (userId, gigId) => {
  try {
    const docRef = doc(db, 'favorites', `${userId}_${gigId}`)
    await setDoc(docRef, {
      userId,
      gigId,
      createdAt: serverTimestamp()
    })
  } catch (error) {
    console.error("Add favorite error:", error)
    throw error
  }
}

export const removeFromFavorites = async (userId, gigId) => {
  try {
    await deleteDoc(doc(db, 'favorites', `${userId}_${gigId}`))
  } catch (error) {
    console.error("Remove favorite error:", error)
    throw error
  }
}

export const getUserFavorites = async (userId) => {
  try {
    const q = query(collection(db, 'favorites'), where('userId', '==', userId))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => doc.data().gigId)
  } catch (error) {
    console.error("Get favorites error:", error)
    throw error
  }
}

// Storage Functions
export const uploadImage = async (file, path) => {
  try {
    const storageRef = ref(storage, path)
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error) {
    console.error("Upload image error:", error)
    throw error
  }
}

export { app, auth, db, storage, onAuthStateChanged }
