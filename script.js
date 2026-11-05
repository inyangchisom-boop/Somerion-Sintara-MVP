// SOMERION SINTARA - FIREBASE SETUP

const firebaseConfig = {
  apiKey: "AIzaSyCoDlwZHahaQeyq0V30PaGKebThrIPIUco",
  authDomain: "somerion-sintara.firebaseapp.com",
  projectId: "somerion-sintara",
  storageBucket: "somerion-sintara.firebasestorage.app",
  messagingSenderId: "804338079646",
  appId: "1:804338079646:web:e39ab278650dabd188e88f"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Authentication
const auth = firebase.auth();
const db = firebase.firestore();
console.log("Somerion Firebase initialized");
// =====================================
// SOMERION SINTARA
// Business Integration Platform
// Parent Company: Somerion
// =====================================

const pages = [
  "overview",
  "integrations",
  "alerts",
  "activity",
  "settings"
];

// LOGIN

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = loginForm.querySelector('input[type="email"]').value.trim();
    const password = loginForm.querySelector('input[type="password"]').value;

    try {
      await auth.signInWithEmailAndPassword(email, password);

      document.getElementById("login").classList.add("hidden");
      document.getElementById("dashboard").classList.remove("hidden");

    } catch (error) {
      alert("Login failed: " + error.message);
    }
  });
}

// LOGOUT

function logout() {
  document.getElementById("dashboard").classList.add("hidden");
  document.getElementById("login").classList.remove("hidden");
}

// DASHBOARD NAVIGATION

function showPage(page, button) {
  pages.forEach(function(id) {
    const section = document.getElementById(id);

    if (section) {
      section.classList.add("hidden");
    }
  });

  const selectedPage = document.getElementById(page);

  if (selectedPage) {
    selectedPage.classList.remove("hidden");
  }

  document.querySelectorAll("aside button").forEach(function(btn) {
    btn.classList.remove("active");
  });

  if (button) {
    button.classList.add("active");
  }
}

// APPLICATION CONNECTIONS

function connectApp(name) {
  const notice = document.getElementById("notice");

  if (!notice) return;

  notice.style.display = "block";

  notice.textContent =
    name + " connection is not active yet. Secure API integration will be added in a future milestone.";
}

// INITIALIZATION

document.addEventListener("DOMContentLoaded", function() {
  console.log("Somerion Sintara initialized.");

  console.log("Parent company: Somerion");

  console.log("Integration monitoring: Pending implementation.");

  console.log("AI assistant: Planned feature.");
});
