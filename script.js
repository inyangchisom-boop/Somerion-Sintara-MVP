
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
  loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    document.getElementById("login").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
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
