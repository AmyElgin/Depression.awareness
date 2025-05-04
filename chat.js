// Firebase SDK v10.12
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ✅ Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSZaEt4DD_TaXQ3nKe7XCLEIV8MOJ4Mug",
  authDomain: "depressionchat-23bea.firebaseapp.com",
  projectId: "depressionchat-23bea",
  storageBucket: "depressionchat-23bea.appspot.com",
  messagingSenderId: "225588915918",
  appId: "1:225588915918:web:211f0be3781d937aad2a9f"
};

// ✅ Initialize Firebase services
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ✅ Sign in anonymously
signInAnonymously(auth)
  .then(() => console.log("Signed in anonymously"))
  .catch(console.error);

// ✅ Get references to DOM
const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message");
const sendBtn = document.getElementById("send");

// ✅ Send message
sendBtn.addEventListener("click", async () => {
  const text = messageInput.value.trim();
  if (text) {
    await addDoc(collection(db, "messages"), {
      text,
      timestamp: serverTimestamp()
    });
    messageInput.value = "";
  }
});

// ✅ Load messages in real time
const q = query(collection(db, "messages"), orderBy("timestamp"));
onSnapshot(q, snapshot => {
  chatBox.innerHTML = "";
  snapshot.forEach(doc => {
    const msg = document.createElement("p");
    msg.textContent = doc.data().text;
    chatBox.appendChild(msg);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
});
