// firebase-config.js
// Firebase Config - 來自使用者提供的設定
const firebaseConfig = {
  apiKey: "AIzaSyCpbWKqWLaNJ12EyoCOiqgZ6uHN-TQVJ6I",
  authDomain: "gamerk-74746.firebaseapp.com",
  projectId: "gamerk-74746",
  storageBucket: "gamerk-74746.firebasestorage.app",
  messagingSenderId: "993166553526",
  appId: "1:993166553526:web:867c606450916487e49117",
  measurementId: "G-3HPV87WW7V"
};

// 初始化 Firebase (Compat 版本)
// 因為 index.html 使用了 -compat.js 的 SDK，所以這裡使用全域 firebase 物件
try {
  firebase.initializeApp(firebaseConfig);
  console.log("Firebase Initialized Successfully");

  // 將常用的功能掛載到 window，方便在遊戲其他地方呼叫
  window.db = firebase.firestore();
  window.auth = firebase.auth();
  // window.analytics = firebase.analytics(); // 暫時註解，analytics 在 compat 中需要額外引入 script

} catch (error) {
  console.error("Firebase Initialization Error:", error);
}
