// SOMERION SINTARA
// Firebase Authentication and Firestore client

const firebaseConfig = {
  apiKey: "AIzaSyCoDlwZHahaQeyq0V30PaGKebThrIPIUco",
  authDomain: "somerion-sintara.firebaseapp.com",
  projectId: "somerion-sintara",
  storageBucket: "somerion-sintara.firebasestorage.app",
  messagingSenderId: "804338079646",
  appId: "1:804338079646:web:e39ab278650dabd188e88f"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

const pages = ["overview", "integrations", "alerts", "activity", "settings"];

function showLogin() {
  document.getElementById("dashboard").classList.add("hidden");
  document.getElementById("login").classList.remove("hidden");
}

function showDashboard() {
  document.getElementById("login").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = loginForm.querySelector('input[type="email"]').value.trim();
    const password = loginForm.querySelector('input[type="password"]').value;
    const submitButton = loginForm.querySelector('button[type="submit"]');

    submitButton.disabled = true;
    submitButton.textContent = "Signing in...";

    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error("Somerion sign-in error:", error);
      alert("Sign-in failed: " + error.message);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Sign in";
    }
  });
}

auth.onAuthStateChanged(async function(user) {
  if (!user) {
    showLogin();
    return;
  }

  showDashboard();

  try {
    await db.collection("users").doc(user.uid).set({
      email: user.email || "",
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error("User profile update failed:", error);
    const notice = document.getElementById("notice");
    if (notice) {
      notice.style.display = "block";
      notice.textContent = "You are signed in, but your profile could not be saved. Check the Firestore security rules.";
    }
  }
});

async function logout() {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Somerion sign-out error:", error);
    alert("Could not sign out: " + error.message);
  }
}

function showPage(page, button) {
  if (!pages.includes(page)) return;

  pages.forEach(function(id) {
    const section = document.getElementById(id);
    if (section) section.classList.add("hidden");
  });

  const selectedPage = document.getElementById(page);
  if (selectedPage) selectedPage.classList.remove("hidden");

  document.querySelectorAll("aside button").forEach(function(item) {
    item.classList.remove("active");
  });

  if (button) button.classList.add("active");
}

function connectApp(name) {
  const notice = document.getElementById("notice");
  if (!notice) return;

  notice.style.display = "block";
  notice.textContent = name + " is not connected yet. The live OAuth/API integration has not been implemented.";
}

console.log("Somerion Sintara client initialized.");
