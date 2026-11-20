// SOMERION SINTARA
// Firebase Authentication and Firestore client.
// Third-party integrations are intentionally not represented as active.

const firebaseConfig = {
  apiKey: "AIzaSyCoDlwZHahaQeyq0V30PaGKebThrIPIUco",
  authDomain: "somerion-sintara.firebaseapp.com",
  projectId: "somerion-sintara",
  storageBucket: "somerion-sintara.firebasestorage.app",
  messagingSenderId: "804338079646",
  appId: "1:804338079646:web:e39ab278650dabd188e88f"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

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

function setAuthMessage(message, isError = false) {
  const target = document.getElementById("authMessage");
  if (!target) return;
  target.textContent = message;
  target.style.color = isError ? "#ff9a9a" : "#a8ceff";
}

const loginForm = document.getElementById("loginForm");
const registerModeButton = document.getElementById("registerMode");
const signInModeButton = document.getElementById("signInMode");
const resetPasswordButton = document.getElementById("resetPassword");
const confirmPasswordGroup = document.getElementById("confirmPasswordGroup");
const confirmPasswordInput = document.getElementById("confirmPassword");
const authSubmitButton = document.getElementById("authSubmit");
const passwordInput = document.getElementById("authPassword");
let authMode = "signin";

function setAuthMode(mode) {
  authMode = mode;
  const registering = mode === "register";
  confirmPasswordGroup.classList.toggle("hidden", !registering);
  confirmPasswordInput.required = registering;
  passwordInput.autocomplete = registering ? "new-password" : "current-password";
  authSubmitButton.textContent = registering ? "Create account" : "Sign in";
  registerModeButton.classList.toggle("hidden", registering);
  signInModeButton.classList.toggle("hidden", !registering);
  resetPasswordButton.classList.toggle("hidden", registering);
  setAuthMessage(registering
    ? "Create an account using your email address."
    : "Sign in with your registered email address.");
}

registerModeButton.addEventListener("click", function() {
  setAuthMode("register");
});

signInModeButton.addEventListener("click", function() {
  setAuthMode("signin");
});

resetPasswordButton.addEventListener("click", async function() {
  const email = document.getElementById("authEmail").value.trim();
  if (!email) {
    setAuthMessage("Enter your email address first, then choose Reset password.", true);
    document.getElementById("authEmail").focus();
    return;
  }

  resetPasswordButton.disabled = true;
  setAuthMessage("Sending password reset email...");
  try {
    await auth.sendPasswordResetEmail(email);
    setAuthMessage("If an account exists for that email, Firebase will send a password reset message.");
  } catch (error) {
    console.error("Password reset request failed:", error);
    setAuthMessage("Password reset could not be requested: " + error.message, true);
  } finally {
    resetPasswordButton.disabled = false;
  }
});

loginForm.addEventListener("submit", async function(event) {
  event.preventDefault();

  const email = document.getElementById("authEmail").value.trim();
  const password = passwordInput.value;
  const submitButton = authSubmitButton;

  if (authMode === "register" && password !== confirmPasswordInput.value) {
    setAuthMessage("The passwords do not match.", true);
    return;
  }

  submitButton.disabled = true;
  registerModeButton.disabled = true;
  signInModeButton.disabled = true;
  resetPasswordButton.disabled = true;
  setAuthMessage(authMode === "register" ? "Creating your account..." : "Signing in...");

  try {
    if (authMode === "register") {
      await auth.createUserWithEmailAndPassword(email, password);
      setAuthMessage("Your account has been created.");
    } else {
      await auth.signInWithEmailAndPassword(email, password);
    }
  } catch (error) {
    console.error("Somerion authentication error:", error);
    setAuthMessage("Authentication failed: " + error.message, true);
  } finally {
    submitButton.disabled = false;
    registerModeButton.disabled = false;
    signInModeButton.disabled = false;
    resetPasswordButton.disabled = false;
  }
});

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

    const notice = document.getElementById("notice");
    if (notice) {
      notice.style.display = "none";
      notice.textContent = "";
    }
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

  const sectionTitle = document.getElementById("currentSection");
  if (sectionTitle) {
    const titles = { overview: "Overview", integrations: "Connections", alerts: "Alerts", activity: "Activity", settings: "Settings" };
    sectionTitle.textContent = titles[page] || "Workspace";
  }

  document.querySelectorAll("aside button").forEach(function(item) {
    item.classList.remove("active");
  });

  if (button) button.classList.add("active");
}

console.log("Somerion Sintara authentication client initialized.");
