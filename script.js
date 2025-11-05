// App State
const appState = {
  strains: [],
  currentStrain: null,
  isEditing: false,
  // Auth state
  user: null,
  authToken: null,
};

// DOM Elements
const elements = {
  listView: document.getElementById("listView"),
  gridView: document.getElementById("gridView"),
  detailView: document.getElementById("detailView"),
  strainList: document.getElementById("strainList"),
  strainGrid: document.getElementById("strainGrid"),
  searchInput: document.getElementById("searchInput"),
  modalOverlay: document.getElementById("modalOverlay"),
  strainForm: document.getElementById("strainForm"),
  modalTitle: document.getElementById("modalTitle"),
  btnAdd: document.getElementById("btnAdd"),
  btnEdit: document.getElementById("btnEdit"),
  btnDelete: document.getElementById("btnDelete"),
  btnBack: document.getElementById("btnBack"),
  btnClose: document.getElementById("btnClose"),
  btnCancel: document.getElementById("btnCancel"),
  navBtns: document.querySelectorAll(".nav-btn"),
  // Auth elements
  btnAuth: document.getElementById("btnAuth"),
  authModalOverlay: document.getElementById("authModalOverlay"),
  authModalTitle: document.getElementById("authModalTitle"),
  btnCloseAuth: document.getElementById("btnCloseAuth"),
  tabLogin: document.getElementById("tabLogin"),
  tabRegister: document.getElementById("tabRegister"),
  loginForm: document.getElementById("loginForm"),
  registerForm: document.getElementById("registerForm"),
  loginError: document.getElementById("loginError"),
  registerError: document.getElementById("registerError"),
  authLabel: document.getElementById("authLabel"),
  authIcon: document.getElementById("authIcon"),
  accountManagement: document.getElementById("accountManagement"),
  loggedInEmail: document.getElementById("loggedInEmail"),
  btnDeleteAccount: document.getElementById("btnDeleteAccount"),
  // Detail elements
  detailTitle: document.getElementById("detailTitle"),
  detailType: document.getElementById("detailType"),
  detailImage: document.getElementById("detailImage"),
  detailSetting: document.getElementById("detailSetting"),
  detailSource: document.getElementById("detailSource"),
  detailFormat: document.getElementById("detailFormat"),
  detailStoner: document.getElementById("detailStoner"),
  detailImpressions: document.getElementById("detailImpressions"),
  detailOther: document.getElementById("detailOther"),
};

// Initialize App
async function init() {
  // Check for existing auth session
  checkAuthStatus();

  await loadStrains();
  renderList();
  renderGrid();
  attachEventListeners();
  initThemeToggle();
  initAuth();
}

// API Configuration - Auto-detect environment
const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000/api"
    : "https://franky-app-ix96j.ondigitalocean.app/api";

// Debug: Log API base URL
console.log("🌐 API_BASE:", API_BASE);
console.log("📍 Hostname:", window.location.hostname);

// Cloudinary Configuration
const CLOUDINARY_CONFIG = {
  cloudName: "dqjhgnivi",
  uploadPreset: "smokestack_upload", // You'll need to create this unsigned preset in Cloudinary
};

// Cloudinary Upload Widget
function openCloudinaryWidget() {
  if (typeof cloudinary === "undefined") {
    alert("Cloudinary widget is loading. Please try again in a moment.");
    return;
  }

  cloudinary.openUploadWidget(
    {
      cloudName: CLOUDINARY_CONFIG.cloudName,
      uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
      sources: ["local", "url", "camera"],
      multiple: false,
      maxFileSize: 10000000, // 10MB
      clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
      cropping: true,
      croppingAspectRatio: 1,
      croppingShowDimensions: true,
      folder: "smokestack",
    },
    (error, result) => {
      if (error) {
        console.error("Upload error:", error);
        alert("Upload failed. Please try again.");
        return;
      }

      if (result?.event === "success") {
        const imageUrl = result.info.secure_url;
        document.getElementById("inputImage").value = imageUrl;

        // Show preview
        const preview = document.getElementById("imagePreview");
        preview.innerHTML = `
          <img src="${imageUrl}" 
               style="max-width: 100%; max-height: 150px; border-radius: 8px; object-fit: contain; background-color: rgba(20, 60, 40, 0.2);" 
               alt="Preview" />
          <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px;">✓ Image uploaded successfully</p>
        `;
      }
    }
  );
}

// Helper to convert API _id to app id
function normalizeStrain(strain) {
  return {
    ...strain,
    id: strain._id || strain.id,
  };
}

// Load Strains from API with fallback to LocalStorage
async function loadStrains() {
  try {
    // Try API first
    const response = await fetch(`${API_BASE}/strains`);
    if (response.ok) {
      const data = await response.json();
      appState.strains = data.map(normalizeStrain);
      saveToLocalStorage(); // Cache in LocalStorage
      return;
    }
  } catch (error) {
    console.log("API unavailable, using LocalStorage:", error);
  }

  // Fallback to LocalStorage
  const saved = localStorage.getItem("smokestack_strains");
  if (saved) {
    appState.strains = JSON.parse(saved);
  } else {
    // Last resort: load from JSON file
    try {
      const response = await fetch("strains.json");
      const data = await response.json();
      appState.strains = data;
      saveToLocalStorage();
    } catch (error) {
      console.error("Error loading strains:", error);
      appState.strains = [];
    }
  }
}

// Save to LocalStorage
function saveToLocalStorage() {
  localStorage.setItem("smokestack_strains", JSON.stringify(appState.strains));
}

// Render List View
function renderList(filteredStrains = null) {
  const strains = filteredStrains !== null ? filteredStrains : appState.strains;

  elements.strainList.innerHTML = "";

  if (strains.length === 0) {
    elements.strainList.innerHTML = `
            <li class="empty-state">
                <h3>No strains found</h3>
                <p>Add your first strain to get started!</p>
            </li>
        `;
    return;
  }

  strains.forEach((strain) => {
    const item = createStrainListItem(strain);
    elements.strainList.appendChild(item);
  });
}

// Create Strain List Item
function createStrainListItem(strain) {
  const li = document.createElement("li");
  li.className = "strain-item";
  li.dataset.id = strain.id;

  const badgeClass = getBadgeClass(strain.type);
  const imageHTML = strain.image
    ? `<img src="${strain.image}" alt="${escapeHtml(
        strain.name
      )}" class="strain-thumbnail" />`
    : "";

  li.innerHTML = `
        ${imageHTML}
        <div class="strain-content">
            <span class="strain-badge ${badgeClass}">${strain.type}</span>
            <div class="strain-name">${escapeHtml(strain.name)}</div>
            <div class="strain-source">${escapeHtml(strain.source)}</div>
        </div>
        <svg class="strain-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
    `;

  li.addEventListener("click", () => showDetail(strain.id));

  return li;
}

// Render Grid View
function renderGrid(filteredStrains = null) {
  const strains = filteredStrains !== null ? filteredStrains : appState.strains;

  elements.strainGrid.innerHTML = "";

  if (strains.length === 0) {
    elements.strainGrid.innerHTML = `
      <div class="empty-state">
        <h3>No strains found</h3>
        <p>Add your first strain to get started!</p>
      </div>
    `;
    return;
  }

  strains.forEach((strain) => {
    const item = createGridItem(strain);
    elements.strainGrid.appendChild(item);
  });
}

// Create Grid Item
function createGridItem(strain) {
  const div = document.createElement("div");
  div.className = "grid-item";
  div.dataset.id = strain.id;

  const badgeClass = getBadgeClass(strain.type);
  const imageHTML = strain.image
    ? `<img src="${strain.image}" alt="${escapeHtml(
        strain.name
      )}" class="grid-item-image" />`
    : '<div class="grid-item-image" style="background: var(--gray-light)"></div>';

  div.innerHTML = `
    ${imageHTML}
    <div class="grid-item-content">
      <div class="grid-item-name">${escapeHtml(strain.name)}</div>
      <span class="grid-item-badge ${badgeClass}">${strain.type}</span>
    </div>
  `;

  div.addEventListener("click", () => showDetail(strain.id));

  return div;
}

// Get Badge Class
function getBadgeClass(type) {
  switch (type.toLowerCase()) {
    case "sativa":
      return "badge-sativa";
    case "indica":
      return "badge-indica";
    case "hybrid":
      return "badge-hybrid";
    default:
      return "badge-hybrid";
  }
}

// Show Detail View
function showDetail(strainId) {
  const strain = appState.strains.find((s) => s.id === strainId);
  if (!strain) return;

  appState.currentStrain = strain;

  // Populate detail elements
  elements.detailTitle.textContent = strain.name;
  elements.detailType.textContent = strain.type;
  elements.detailSetting.textContent = strain.setting || "";
  elements.detailSource.textContent = strain.source || "";
  elements.detailFormat.textContent = strain.format || "";
  elements.detailStoner.textContent = strain.stoner || "";
  elements.detailImpressions.textContent = strain.impressions || "";
  elements.detailOther.textContent = strain.other || "";

  // Handle image
  if (strain.image) {
    elements.detailImage.src = strain.image;
    elements.detailImage.alt = strain.name;
    elements.detailImage.style.display = "block";
  } else {
    elements.detailImage.style.display = "none";
  }

  // Switch views with animation
  elements.listView.classList.add("hidden");
  elements.gridView.classList.add("hidden");
  elements.detailView.classList.remove("hidden");
}

// Show Add Modal
function showAddModal() {
  appState.isEditing = false;
  elements.modalTitle.textContent = "Add Strain";
  elements.strainForm.reset();
  document.getElementById("editId").value = "";
  elements.modalOverlay.classList.remove("hidden");
}

// Handle Delete Click
function handleDeleteClick() {
  if (!appState.currentStrain) return;

  const strainName = appState.currentStrain.name;
  if (
    confirm(
      `Are you sure you want to delete "${strainName}"? This cannot be undone.`
    )
  ) {
    deleteStrain(appState.currentStrain.id);
  }
}

// Show Edit Modal
function showEditModal() {
  if (!appState.currentStrain) return;

  appState.isEditing = true;
  elements.modalTitle.textContent = "Edit Strain";
  elements.strainForm.reset();

  // Populate form with current strain data
  const strain = appState.currentStrain;
  document.getElementById("editId").value = strain.id;
  document.getElementById("inputName").value = strain.name;
  document.getElementById("inputType").value = strain.type;
  document.getElementById("inputSource").value = strain.source;
  document.getElementById("inputImage").value = strain.image || "";
  document.getElementById("inputSetting").value = strain.setting || "";
  document.getElementById("inputFormat").value = strain.format || "";
  document.getElementById("inputStoner").value = strain.stoner || "";
  document.getElementById("inputImpressions").value = strain.impressions || "";
  document.getElementById("inputOther").value = strain.other || "";

  elements.modalOverlay.classList.remove("hidden");
}

// Close Modal
function closeModal() {
  elements.modalOverlay.classList.add("hidden");
  elements.strainForm.reset();
  appState.isEditing = false;
}

// Handle Form Submit
async function handleFormSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const id = formData.get("id");
  const strainData = {
    name: formData.get("name"),
    type: formData.get("type"),
    source: formData.get("source"),
    image:
      formData.get("image") ||
      "https://res.cloudinary.com/dqjhgnivi/image/upload/v1752803556/nub5c65r4a2x4ktdakdc.jpg",
    setting: formData.get("setting"),
    format: formData.get("format"),
    stoner: formData.get("stoner"),
    impressions: formData.get("impressions"),
    other: formData.get("other"),
  };

  if (id) {
    // Edit existing strain
    await editStrain(id, strainData);
  } else {
    // Add new strain
    await addStrain(strainData);
  }

  closeModal();
}

// Add New Strain
async function addStrain(strainData) {
  try {
    // Try API first
    const response = await fetch(`${API_BASE}/strains`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(strainData),
    });

    if (response.ok) {
      const newStrain = await response.json();
      appState.strains.unshift(normalizeStrain(newStrain));
      saveToLocalStorage(); // Cache
      renderList();
      renderGrid();
      return;
    }
  } catch (error) {
    console.log("API unavailable, saving locally:", error);
  }

  // Fallback to LocalStorage only
  const newStrain = {
    id: Date.now(),
    ...strainData,
  };

  appState.strains.unshift(newStrain);
  saveToLocalStorage();
  renderList();
  renderGrid();
}

// Edit Strain
async function editStrain(id, strainData) {
  try {
    // Try API first
    const response = await fetch(`${API_BASE}/strains/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(strainData),
    });

    if (response.ok) {
      const updatedStrain = await response.json();
      const index = appState.strains.findIndex((s) => s.id === id);
      if (index !== -1) {
        appState.strains[index] = normalizeStrain(updatedStrain);
        saveToLocalStorage(); // Cache
        renderList();
        renderGrid();

        // Update detail view if we're viewing this strain
        if (appState.currentStrain && appState.currentStrain.id === id) {
          showDetail(id);
        }
      }
      return;
    }
  } catch (error) {
    console.log("API unavailable, saving locally:", error);
  }

  // Fallback to LocalStorage only
  const index = appState.strains.findIndex((s) => s.id === id);
  if (index === -1) return;

  appState.strains[index] = {
    ...appState.strains[index],
    ...strainData,
  };

  saveToLocalStorage();
  renderList();
  renderGrid();

  // Update detail view if we're viewing this strain
  if (appState.currentStrain && appState.currentStrain.id === id) {
    showDetail(id);
  }
}

// Delete Strain
async function deleteStrain(id) {
  try {
    // Try API first
    const response = await fetch(`${API_BASE}/strains/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      appState.strains = appState.strains.filter((s) => s.id !== id);
      saveToLocalStorage(); // Cache
      renderList();
      renderGrid();
      goToListView();
      return;
    }
  } catch (error) {
    console.log("API unavailable, deleting locally:", error);
  }

  // Fallback to LocalStorage only
  appState.strains = appState.strains.filter((s) => s.id !== id);
  saveToLocalStorage();
  renderList();
  renderGrid();
  goToListView();
}

// Switch View
function switchView(viewName) {
  // Hide all views
  elements.listView.classList.add("hidden");
  elements.gridView.classList.add("hidden");
  elements.detailView.classList.add("hidden");

  // Show selected view
  if (viewName === "list") {
    elements.listView.classList.remove("hidden");
  } else if (viewName === "grid") {
    elements.gridView.classList.remove("hidden");
  }

  // Update active nav button
  elements.navBtns.forEach((btn) => {
    if (btn.dataset.view === viewName) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

// Go to List View (legacy, now redirects to switchView)
function goToListView() {
  switchView("list");
  appState.currentStrain = null;
}

// Search Handler
function handleSearch(e) {
  const query = e.target.value.toLowerCase().trim();

  if (query === "") {
    renderList();
    renderGrid();
    return;
  }

  const filtered = appState.strains.filter((strain) => {
    return (
      strain.name.toLowerCase().includes(query) ||
      strain.type.toLowerCase().includes(query) ||
      strain.source.toLowerCase().includes(query) ||
      (strain.setting && strain.setting.toLowerCase().includes(query))
    );
  });

  renderList(filtered);
  renderGrid(filtered);
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Attach Event Listeners
function attachEventListeners() {
  // Add button
  elements.btnAdd.addEventListener("click", showAddModal);

  // Edit button
  elements.btnEdit.addEventListener("click", showEditModal);

  // Delete button
  elements.btnDelete.addEventListener("click", handleDeleteClick);

  // Cloudinary upload button
  const uploadBtn = document.getElementById("uploadWidgetBtn");
  if (uploadBtn) {
    uploadBtn.addEventListener("click", openCloudinaryWidget);
  }

  // Back button
  elements.btnBack.addEventListener("click", goToListView);

  // Modal close buttons
  elements.btnClose.addEventListener("click", closeModal);
  elements.btnCancel.addEventListener("click", closeModal);

  // Form submit
  elements.strainForm.addEventListener("submit", handleFormSubmit);

  // Search
  elements.searchInput.addEventListener("input", handleSearch);

  // Navigation buttons
  elements.navBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const viewName = btn.dataset.view;
      if (viewName && viewName !== "detail") {
        switchView(viewName);
      }
    });
  });

  // Close modal on overlay click
  elements.modalOverlay.addEventListener("click", (e) => {
    if (e.target === elements.modalOverlay) {
      closeModal();
    }
  });
}

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

// Check if user is already logged in
function checkAuthStatus() {
  const storedToken = localStorage.getItem("smokestack_auth_token");
  const storedUser = localStorage.getItem("smokestack_user");

  if (storedToken && storedUser) {
    try {
      appState.authToken = storedToken;
      appState.user = JSON.parse(storedUser);
      updateAuthUI(true);
    } catch (e) {
      console.error("Error parsing stored user data:", e);
      clearAuth();
    }
  } else {
    updateAuthUI(false);
  }
}

// Initialize Auth UI
function initAuth() {
  // Auth button click
  if (elements.btnAuth) {
    elements.btnAuth.addEventListener("click", () => {
      if (appState.user) {
        // Logout
        handleLogout();
      } else {
        // Show login modal
        showAuthModal("login");
      }
    });
  }

  // Auth modal close
  if (elements.btnCloseAuth) {
    elements.btnCloseAuth.addEventListener("click", closeAuthModal);
  }

  // Auth modal overlay click
  if (elements.authModalOverlay) {
    elements.authModalOverlay.addEventListener("click", (e) => {
      if (e.target === elements.authModalOverlay) {
        closeAuthModal();
      }
    });
  }

  // Tab switching
  if (elements.tabLogin) {
    elements.tabLogin.addEventListener("click", () => {
      switchAuthTab("login");
    });
  }

  if (elements.tabRegister) {
    elements.tabRegister.addEventListener("click", () => {
      switchAuthTab("register");
    });
  }

  // Form submissions
  if (elements.loginForm) {
    elements.loginForm.addEventListener("submit", handleLogin);
  }

  if (elements.registerForm) {
    elements.registerForm.addEventListener("submit", handleRegister);
  }

  // Delete account button
  if (elements.btnDeleteAccount) {
    elements.btnDeleteAccount.addEventListener("click", handleDeleteAccount);
  }
}

// Show Auth Modal
function showAuthModal(mode = "login") {
  if (!elements.authModalOverlay) return;

  // If user is logged in, show account management instead
  if (appState.user && mode === "login") {
    showAccountManagement();
    return;
  }

  // Hide account management when showing login/register
  if (elements.accountManagement) {
    elements.accountManagement.classList.add("hidden");
  }

  switchAuthTab(mode);
  elements.authModalOverlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

// Show Account Management (when logged in)
function showAccountManagement() {
  if (!elements.authModalOverlay || !elements.accountManagement) return;

  // Hide login/register forms
  if (elements.loginForm) elements.loginForm.classList.add("hidden");
  if (elements.registerForm) elements.registerForm.classList.add("hidden");
  if (elements.tabLogin) elements.tabLogin.classList.add("hidden");
  if (elements.tabRegister) elements.tabRegister.classList.add("hidden");

  // Show account management
  elements.accountManagement.classList.remove("hidden");

  // Update modal title
  if (elements.authModalTitle) {
    elements.authModalTitle.textContent = "Account";
  }

  // Show logged in email
  if (elements.loggedInEmail && appState.user) {
    elements.loggedInEmail.textContent = appState.user.email || "User";
  }

  elements.authModalOverlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

// Close Auth Modal
function closeAuthModal() {
  if (!elements.authModalOverlay) return;

  elements.authModalOverlay.classList.add("hidden");
  document.body.style.overflow = "";

  // Clear forms
  if (elements.loginForm) elements.loginForm.reset();
  if (elements.registerForm) elements.registerForm.reset();
  hideAuthErrors();

  // Hide account management
  if (elements.accountManagement) {
    elements.accountManagement.classList.add("hidden");
  }

  // Show tabs again
  if (elements.tabLogin) elements.tabLogin.classList.remove("hidden");
  if (elements.tabRegister) elements.tabRegister.classList.remove("hidden");
}

// Switch between Login/Register tabs
function switchAuthTab(mode) {
  if (!elements.tabLogin || !elements.tabRegister) return;

  // Hide account management when switching tabs
  if (elements.accountManagement) {
    elements.accountManagement.classList.add("hidden");
  }

  // Show tabs
  elements.tabLogin.classList.remove("hidden");
  elements.tabRegister.classList.remove("hidden");

  const isLogin = mode === "login";

  // Update tabs
  if (isLogin) {
    elements.tabLogin.classList.add("active");
    elements.tabRegister.classList.remove("active");
    elements.loginForm.classList.remove("hidden");
    elements.registerForm.classList.add("hidden");
    if (elements.authModalTitle) elements.authModalTitle.textContent = "Login";
  } else {
    elements.tabLogin.classList.remove("active");
    elements.tabRegister.classList.add("active");
    elements.loginForm.classList.add("hidden");
    elements.registerForm.classList.remove("hidden");
    if (elements.authModalTitle)
      elements.authModalTitle.textContent = "Sign Up";
  }

  hideAuthErrors();
}

// Handle Login
async function handleLogin(e) {
  e.preventDefault();
  hideAuthErrors();

  const email = document.getElementById("loginEmail").value.trim();
  const pin = document.getElementById("loginPin").value;

  if (!email || !pin) {
    showAuthError("loginError", "Please enter email and PIN");
    return;
  }

  // TODO: Replace with actual API call when backend is ready
  // For now, this is a placeholder that simulates login
  try {
    console.log("🔐 Attempting login:", { email, pin: "***" });

    // PLACEHOLDER: Simulate API call
    // When backend is ready, replace with:
    /*
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, pin }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }
    
    const data = await response.json();
    appState.authToken = data.token;
    appState.user = data.user;
    */

    // TEMPORARY: Simulate successful login (remove when backend is ready)
    appState.authToken = "placeholder_token_" + Date.now();
    appState.user = { email, _id: "user_" + Date.now() };

    // Save to localStorage
    localStorage.setItem("smokestack_auth_token", appState.authToken);
    localStorage.setItem("smokestack_user", JSON.stringify(appState.user));

    updateAuthUI(true);
    closeAuthModal();

    // Reload strains (will filter by user when backend is ready)
    await loadStrains();
    renderList();
    renderGrid();

    console.log("✅ Login successful (placeholder)");
    alert(
      "✅ Login successful! (This is a placeholder - backend not connected yet)"
    );
  } catch (error) {
    console.error("Login error:", error);
    showAuthError(
      "loginError",
      error.message || "Login failed. Please check your credentials."
    );
  }
}

// Handle Register
async function handleRegister(e) {
  e.preventDefault();
  hideAuthErrors();

  const email = document.getElementById("registerEmail").value.trim();
  const pin = document.getElementById("registerPin").value;
  const pinConfirm = document.getElementById("registerPinConfirm").value;

  if (!email || !pin || !pinConfirm) {
    showAuthError("registerError", "Please fill in all fields");
    return;
  }

  if (pin.length < 4 || pin.length > 10) {
    showAuthError("registerError", "PIN must be 4-10 digits");
    return;
  }

  if (!/^\d+$/.test(pin)) {
    showAuthError("registerError", "PIN must contain only numbers");
    return;
  }

  if (pin !== pinConfirm) {
    showAuthError("registerError", "PINs do not match");
    return;
  }

  // TODO: Replace with actual API call when backend is ready
  try {
    console.log("📝 Attempting registration:", { email, pin: "***" });

    // PLACEHOLDER: Simulate API call
    // When backend is ready, replace with:
    /*
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, pin }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }
    
    const data = await response.json();
    appState.authToken = data.token;
    appState.user = data.user;
    */

    // TEMPORARY: Simulate successful registration (remove when backend is ready)
    appState.authToken = "placeholder_token_" + Date.now();
    appState.user = { email, _id: "user_" + Date.now() };

    // Save to localStorage
    localStorage.setItem("smokestack_auth_token", appState.authToken);
    localStorage.setItem("smokestack_user", JSON.stringify(appState.user));

    updateAuthUI(true);
    closeAuthModal();

    // Reload strains
    await loadStrains();
    renderList();
    renderGrid();

    console.log("✅ Registration successful (placeholder)");
    alert(
      "✅ Account created! (This is a placeholder - backend not connected yet)"
    );
  } catch (error) {
    console.error("Registration error:", error);
    showAuthError(
      "registerError",
      error.message || "Registration failed. Please try again."
    );
  }
}

// Handle Logout
function handleLogout() {
  if (confirm("Are you sure you want to logout?")) {
    clearAuth();
    updateAuthUI(false);

    // Reload strains (will show all or none when backend is ready)
    loadStrains().then(() => {
      renderList();
      renderGrid();
    });

    console.log("👋 Logged out");
  }
}

// Handle Delete Account
async function handleDeleteAccount() {
  if (!appState.user) {
    alert("You must be logged in to delete your account.");
    return;
  }

  const email = appState.user.email || "your account";
  const confirmMessage = `⚠️ WARNING: This will permanently delete your account and ALL your strains!\n\nEmail: ${email}\n\nThis action CANNOT be undone.\n\nType "DELETE" to confirm:`;

  // Double confirmation
  const userInput = prompt(confirmMessage);

  if (userInput !== "DELETE") {
    if (userInput !== null) {
      alert(
        "Account deletion cancelled. You must type 'DELETE' exactly to confirm."
      );
    }
    return;
  }

  // Final confirmation
  if (
    !confirm(
      `Are you absolutely sure you want to delete ${email}?\n\nThis will:\n- Delete your account\n- Delete all your strains\n- Cannot be undone\n\nProceed?`
    )
  ) {
    return;
  }

  try {
    console.log("🗑️ Attempting to delete account:", { email });

    // TODO: Replace with actual API call when backend is ready
    // PLACEHOLDER: Simulate API call
    // When backend is ready, replace with:
    /*
    const response = await fetch(`${API_BASE}/auth/account`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Account deletion failed");
    }
    */

    // TEMPORARY: Simulate successful account deletion (remove when backend is ready)
    // Simulate deletion delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Clear all user data
    clearAuth();

    // Clear all strains (user's private data)
    appState.strains = [];
    localStorage.removeItem("smokestack_strains");

    // Update UI
    updateAuthUI(false);
    closeAuthModal();
    renderList();
    renderGrid();

    console.log("✅ Account deleted successfully (placeholder)");
    alert(
      "✅ Account deleted successfully! (This is a placeholder - backend not connected yet)"
    );
  } catch (error) {
    console.error("Account deletion error:", error);
    alert(`❌ Failed to delete account: ${error.message || "Unknown error"}`);
  }
}

// Clear Auth
function clearAuth() {
  appState.user = null;
  appState.authToken = null;
  localStorage.removeItem("smokestack_auth_token");
  localStorage.removeItem("smokestack_user");
}

// Update Auth UI
function updateAuthUI(isLoggedIn) {
  // Wait for elements to be available (in case called before DOM is ready)
  if (!elements.btnAuth || !elements.authLabel || !elements.authIcon) {
    // Retry after a short delay if elements aren't ready yet
    if (document.readyState === "loading") {
      setTimeout(() => updateAuthUI(isLoggedIn), 100);
    }
    return;
  }

  if (isLoggedIn && appState.user) {
    // Logged in state
    elements.authLabel.textContent = "Account";

    // Change icon to logout icon
    const loginIcon = elements.authIcon.querySelector("#loginIcon");
    const loginArrow = elements.authIcon.querySelector("#loginArrow");
    const loginLine = elements.authIcon.querySelector("#loginLine");

    if (loginIcon)
      loginIcon.setAttribute("d", "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4");
    if (loginArrow) loginArrow.setAttribute("points", "16 17 21 12 16 7");
    if (loginLine) loginLine.setAttribute("x2", "21");

    // Update button title
    elements.btnAuth.setAttribute("aria-label", "Logout");
  } else {
    // Logged out state
    elements.authLabel.textContent = "Login";

    // Change icon to login icon
    const loginIcon = elements.authIcon.querySelector("#loginIcon");
    const loginArrow = elements.authIcon.querySelector("#loginArrow");
    const loginLine = elements.authIcon.querySelector("#loginLine");

    if (loginIcon)
      loginIcon.setAttribute("d", "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4");
    if (loginArrow) loginArrow.setAttribute("points", "10 17 15 12 10 7");
    if (loginLine) loginLine.setAttribute("x2", "3");

    // Update button title
    elements.btnAuth.setAttribute("aria-label", "Login");
  }
}

// Show Auth Error
function showAuthError(errorElementId, message) {
  const errorEl = document.getElementById(errorElementId);
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");
  }
}

// Hide Auth Errors
function hideAuthErrors() {
  if (elements.loginError) elements.loginError.classList.add("hidden");
  if (elements.registerError) elements.registerError.classList.add("hidden");
}

// Get Auth Headers (for API requests)
function getAuthHeaders() {
  const headers = { "Content-Type": "application/json" };
  if (appState.authToken) {
    headers["Authorization"] = `Bearer ${appState.authToken}`;
  }
  return headers;
}

// Theme Toggle Function
function initThemeToggle() {
  const appTitle = document.querySelector(".app-title");

  // Load saved theme preference
  const savedTheme = localStorage.getItem("smokestack_theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
  }

  // Add click event to toggle theme
  appTitle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    // Save preference
    const isLight = document.body.classList.contains("light-mode");
    localStorage.setItem("smokestack_theme", isLight ? "light" : "dark");
  });
}

// Initialize on load
init();
