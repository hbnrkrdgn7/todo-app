import { auth, provider, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

// Email/şifre ile kullanıcı kaydı ve Firestore'a profil kaydı
export const registerUser = async ({ email, password, username, firstName, lastName, phone, birthDate, city }) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: username });
    // Firestore'a profil kaydı
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      uid: userCredential.user.uid,
      email,
      username,
      firstName,
      lastName,
      phone,
      birthDate,
      city
    });
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Email/şifre ile giriş
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Google ile giriş ve Firestore'a profil kaydı
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    // Firestore'da profil yoksa oluştur
    const userDoc = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userDoc);
    if (!userSnap.exists()) {
      await setDoc(userDoc, {
        uid: user.uid,
        email: user.email,
        username: user.displayName || user.email.split('@')[0],
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
        phone: '',
        birthDate: '',
        city: ''
      });
    }
    return { success: true, user };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Çıkış
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Mevcut kullanıcıyı al (async değil, observer ile güncel kalır)
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Auth state değişimini dinle (kullanıcı giriş/çıkış)
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Kullanıcı adını güncelle (hem auth hem Firestore)
export const updateUsername = async (newUsername) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Kullanıcı bulunamadı");
    await updateProfile(user, { displayName: newUsername });
    await updateDoc(doc(db, "users", user.uid), { username: newUsername });
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Şifre güncelleme fonksiyonu
export const updateUserPassword = async (currentPassword, newPassword) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Kullanıcı bulunamadı");
    // Re-authenticate
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Firestore'dan kullanıcı profilini getir
export const getUserProfile = async (uid) => {
  try {
    const userDoc = doc(db, 'users', uid);
    const userSnap = await getDoc(userDoc);
    if (userSnap.exists()) {
      return { success: true, profile: userSnap.data() };
    } else {
      return { success: false, message: 'Profil bulunamadı.' };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
}; 