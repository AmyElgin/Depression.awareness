// 1) Firebase SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, collection, addDoc, serverTimestamp,
  onSnapshot, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 2) Your Firebase config
const firebaseConfig = {
  apiKey: "...",
  authDomain: "depressionchat-23bea.firebaseapp.com",
  projectId: "depressionchat-23bea",
  storageBucket: "depressionchat-23bea.appspot.com",
  messagingSenderId: "225588915918",
  appId: "1:225588915918:web:211f0be3781d937aad2a9f"
};

// 3) Initialize
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 4) Sign in anonymously
await signInAnonymously(auth).catch(console.error);

// 5) Admin UID (fixed—you) and current user UID
const ADMIN_UID = "ADMIN_USER_UID";         // pick a constant for your admin account
const currentUser = auth.currentUser || await new Promise(res =>
  auth.onAuthStateChanged(u => res(u))
);

// 6) Generate a consistent conversation ID between two UIDs
function genConversationId(a, b) {
  return [a, b].sort().join("_");
}

// 7) Determine chat participants
const userA = currentUser.uid;
const userB = ADMIN_UID;
const conversationId = genConversationId(userA, userB);

// 8) DOM refs
const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message");
const sendBtn = document.getElementById("send");

// 9) Send a message into conversations/{conversationId}/messages
sendBtn.addEventListener("click", async () => {
  const text = messageInput.value.trim();
  if (!text) return;

  await addDoc(
    collection(db, "conversations", conversationId, "messages"),
    {
      sender: userA,
      text,
      timestamp: serverTimestamp()
    }
  );
  messageInput.value = "";
});

// 10) Listen to messages for this conversation
const messagesQuery = query(
  collection(db, "conversations", conversationId, "messages"),
  orderBy("timestamp")
);

onSnapshot(messagesQuery, snapshot => {
  chatBox.innerHTML = "";
  snapshot.forEach(doc => {
    const { sender, text } = doc.data();
    const p = document.createElement("p");
    p.textContent = text;
    p.className = sender === userA ? "message user" : "message admin";
    chatBox.appendChild(p);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
});
