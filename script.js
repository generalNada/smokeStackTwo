// App State
const appState = {
  strains: [],
  currentStrain: null,
  isEditing: false,
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
  btnBack: document.getElementById("btnBack"),
  btnClose: document.getElementById("btnClose"),
  btnCancel: document.getElementById("btnCancel"),
  navBtns: document.querySelectorAll(".nav-btn"),
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
  await loadStrains();
  renderList();
  renderGrid();
  attachEventListeners();
}

// Load Strains from JSON or LocalStorage
async function loadStrains() {
  try {
    // Try to load from localStorage first
    const saved = localStorage.getItem("smokestack_strains");
    if (saved) {
      appState.strains = JSON.parse(saved);
    } else {
      // Load from JSON file
      const response = await fetch("strains.json");
      const data = await response.json();
      appState.strains = data;
      saveToLocalStorage();
    }
  } catch (error) {
    console.error("Error loading strains:", error);
    appState.strains = [];
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
function handleFormSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const id = formData.get("id");
  const strainData = {
    name: formData.get("name"),
    type: formData.get("type"),
    source: formData.get("source"),
    image: formData.get("image"),
    setting: formData.get("setting"),
    format: formData.get("format"),
    stoner: formData.get("stoner"),
    impressions: formData.get("impressions"),
    other: formData.get("other"),
  };

  if (id) {
    // Edit existing strain
    editStrain(parseInt(id), strainData);
  } else {
    // Add new strain
    addStrain(strainData);
  }

  closeModal();
}

// Add New Strain
function addStrain(strainData) {
  const newStrain = {
    id: Date.now(),
    ...strainData,
  };

  appState.strains.unshift(newStrain); // Add to beginning
  saveToLocalStorage();
  renderList();
  renderGrid();
}

// Edit Strain
function editStrain(id, strainData) {
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

// Delete Strain (optional, can be added later)
function deleteStrain(id) {
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

// Initialize on load
init();
