// src/utils/debug.js - Geçici debug dosyası

export const checkLocalStorage = () => {
  console.log("=== LOCALSTORAGE DEBUG ===");
  
  // Kayıtlı kullanıcıları kontrol et
  const registeredUsers = localStorage.getItem('registeredUsers');
  console.log("Kayıtlı kullanıcılar:", registeredUsers);
  
  if (registeredUsers) {
    try {
      const users = JSON.parse(registeredUsers);
      console.log("Parse edilmiş kullanıcılar:", users);
    } catch (error) {
      console.error("JSON parse hatası:", error);
    }
  }
  
  // Mevcut kullanıcıyı kontrol et
  const currentUser = localStorage.getItem('currentUser');
  console.log("Mevcut kullanıcı:", currentUser);
  
  // Eski user verisini kontrol et
  const oldUser = localStorage.getItem('user');
  console.log("Eski user verisi:", oldUser);
  
  console.log("=== DEBUG SONU ===");
}; 