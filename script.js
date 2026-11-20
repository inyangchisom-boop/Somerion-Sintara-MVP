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
const pages = ["overview", "integrations", "alerts", "activity", "agent", "settings"];

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
    const titles = { overview: "Overview", integrations: "Connections", alerts: "Alerts", activity: "Activity", agent: "AI Agent", settings: "Settings" };
    sectionTitle.textContent = titles[page] || "Workspace";
  }

  document.querySelectorAll("aside button").forEach(function(item) {
    item.classList.remove("active");
  });

  if (button) button.classList.add("active");
  if (page === "agent") loadAgentPage();
}

console.log("Somerion Sintara authentication client initialized.");
\n
const AGENT_API_URL = "https://somerion-agent-api-v1.somerion-oi.workers.dev";

async function agentRequest(path, options = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error("Please sign in again to use your agent.");
  const token = await user.getIdToken();
  const response = await fetch(AGENT_API_URL + path, {
    method: options.method || "GET",
    headers: { "Authorization": "Bearer " + token, "Content-Type": "application/json" },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.detail || data.error || "The agent service could not complete that request.");
  return data;
}

function agentEscape(value) {
  return String(value == null ? "" : value).replace(/[&<>"']/g, function(char) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
  });
}

function agentDate(value) {
  if (!value) return "No due date";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleString();
}

function agentMessage(target, message, kind) {
  const node = document.createElement("div");
  node.className = "agent-chat-bubble " + (kind === "user" ? "agent-user-bubble" : "agent-bot-bubble");
  node.textContent = message;
  target.appendChild(node);
  target.scrollTop = target.scrollHeight;
}

async function loadAgentPage() {
  const tasksNode = document.getElementById("agentTasksList");
  if (!tasksNode) return;
  tasksNode.innerHTML = '<div class="agent-empty-small">Loading your tasks…</div>';
  try {
    const results = await Promise.all([
      agentRequest("/v1/tasks"),
      agentRequest("/v1/notifications"),
      agentRequest("/v1/preferences")
    ]);
    renderAgentTasks(results[0].tasks || []);
    renderAgentNotifications(results[1].notifications || []);
    const toggle = document.getElementById("agentReminderToggle");
    if (toggle) toggle.checked = results[2].reminders_enabled !== false;
  } catch (error) {
    tasksNode.textContent = error.message;
    const notices = document.getElementById("agentNotificationsList");
    if (notices) notices.textContent = "Could not load notifications.";
  }
}

function renderAgentTasks(tasks) {
  const list = document.getElementById("agentTasksList");
  const count = document.getElementById("agentTaskCount");
  if (!list) return;
  if (count) count.textContent = tasks.length + (tasks.length === 1 ? " task" : " tasks");
  if (!tasks.length) {
    list.innerHTML = '<div class="agent-empty-small">Nothing tracked yet. Add a task above to get started.</div>';
    return;
  }
  list.innerHTML = tasks.map(function(task) {
    const done = task.status === "done";
    return '<article class="agent-task-row" data-task-id="' + agentEscape(task.id) + '">' +
      '<div class="agent-task-main"><strong class="' + (done ? "task-done" : "") + '">' + agentEscape(task.title) + '</strong>' +
      (task.details ? '<p>' + agentEscape(task.details) + '</p>' : '') +
      '<small>' + agentEscape(agentDate(task.due_at)) + '</small></div>' +
      '<span class="agent-task-state ' + (done ? "is-done" : "") + '">' + (done ? "Completed" : task.status === "in_progress" ? "In progress" : "Open") + '</span>' +
      '<div class="agent-task-actions">' + (done ? '' : '<button type="button" data-task-action="done">Complete</button>') +
      '<button type="button" data-task-action="delete" class="delete-task">Delete</button></div></article>';
  }).join("");
}

function renderAgentNotifications(items) {
  const list = document.getElementById("agentNotificationsList");
  const count = document.getElementById("agentNotificationCount");
  if (!list) return;
  const unread = items.filter(function(item) { return !item.read_at; }).length;
  if (count) count.textContent = String(unread);
  if (!items.length) {
    list.innerHTML = '<div class="agent-empty-small">No reminders yet. Upcoming task reminders will appear here.</div>';
    return;
  }
  list.innerHTML = items.map(function(item) {
    return '<div class="agent-notification-row"><span class="notification-dot"></span><div><p>' + agentEscape(item.message) + '</p><small>' + agentEscape(agentDate(item.created_at)) + '</small></div></div>';
  }).join("");
}

const agentTaskForm = document.getElementById("agentTaskForm");
if (agentTaskForm) {
  agentTaskForm.addEventListener("submit", async function(event) {
    event.preventDefault();
    const button = agentTaskForm.querySelector("button[type=submit]");
    button.disabled = true;
    try {
      const dueValue = document.getElementById("agentTaskDue").value;
      await agentRequest("/v1/tasks", { method: "POST", body: {
        title: document.getElementById("agentTaskTitle").value,
        details: document.getElementById("agentTaskDetails").value,
        due_at: dueValue ? new Date(dueValue).toISOString() : null
      }});
      agentTaskForm.reset();
      await loadAgentPage();
    } catch (error) {
      alert(error.message);
    } finally {
      button.disabled = false;
    }
  });
}

const agentTasksList = document.getElementById("agentTasksList");
if (agentTasksList) {
  agentTasksList.addEventListener("click", async function(event) {
    const button = event.target.closest("button[data-task-action]");
    if (!button) return;
    const row = button.closest("[data-task-id]");
    if (!row) return;
    button.disabled = true;
    try {
      const id = row.getAttribute("data-task-id");
      if (button.dataset.taskAction === "done") {
        await agentRequest("/v1/tasks/" + encodeURIComponent(id), { method: "PATCH", body: { status: "done" } });
      } else {
        await agentRequest("/v1/tasks/" + encodeURIComponent(id), { method: "DELETE" });
      }
      await loadAgentPage();
    } catch (error) {
      alert(error.message);
      button.disabled = false;
    }
  });
}

const agentChatForm = document.getElementById("agentChatForm");
if (agentChatForm) {
  agentChatForm.addEventListener("submit", async function(event) {
    event.preventDefault();
    const input = document.getElementById("agentChatInput");
    const messages = document.getElementById("agentChatMessages");
    const send = agentChatForm.querySelector("button");
    const prompt = input.value.trim();
    if (!prompt) return;
    agentMessage(messages, prompt, "user");
    input.value = "";
    send.disabled = true;
    const waiting = document.createElement("div");
    waiting.className = "agent-chat-bubble agent-bot-bubble agent-thinking";
    waiting.textContent = "Thinking…";
    messages.appendChild(waiting);
    messages.scrollTop = messages.scrollHeight;
    try {
      const result = await agentRequest("/v1/assistant/chat", { method: "POST", body: { message: prompt } });
      waiting.remove();
      agentMessage(messages, result.reply || "I could not prepare a response.", "agent");
    } catch (error) {
      waiting.remove();
      agentMessage(messages, "I could not reach the assistant: " + error.message, "agent");
    } finally {
      send.disabled = false;
      input.focus();
    }
  });
}

const agentReminderToggle = document.getElementById("agentReminderToggle");
if (agentReminderToggle) {
  agentReminderToggle.addEventListener("change", async function() {
    agentReminderToggle.disabled = true;
    try {
      await agentRequest("/v1/preferences", { method: "PUT", body: { reminders_enabled: agentReminderToggle.checked } });
    } catch (error) {
      agentReminderToggle.checked = !agentReminderToggle.checked;
      alert(error.message);
    } finally {
      agentReminderToggle.disabled = false;
    }
  });
}
