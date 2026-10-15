/**
 * app.js - Main Application Controller & UI Orchestrator
 * Course: Foundations of AI (Mini Project)
 * 
 * Features:
 * - Centralized state management & reactive re-rendering
 * - In-navbar and workspace student profile switcher
 * - Semester allotment quota gauge (e.g., 2 / 6 books limit)
 * - Interactive student interests matrix with instant AI recalculation
 * - Content-based Cosine Similarity recommendation ranking with Collaborative Filtering toggle
 * - Explainable AI (XAI) Mathematical Inspector modal with step-by-step vector proofs
 * - Comprehensive book catalog with multi-field search, category counts, sorting, and view modes (Grid / List)
 * - Book Details Modal with complete synopsis, ISBN, and direct issue workflow
 * - Dual Chart.js visual analytics: Category Frequency Bar Chart & Allotment Status Doughnut Chart
 * - Allotment transaction ledger with countdown deadlines, 14-day renewal, and one-click return
 * - Printable institutional allotment slip generator
 * - AI Engine Lab & Simulator for interactive viva demonstration
 * - Dark / Light theme toggle with local persistence
 */

let categoryChartInstance = null;
let statusChartInstance = null;
let currentCategoryFilter = "All";
let currentSearchQuery = "";
let currentHistoryFilter = "All";
let currentCatalogViewMode = "grid"; // "grid" or "list"

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  initializeData();
  initializeTheme();
  setupClock();
  setupNavigation();
  setupStudentControls();
  setupBrowseControls();
  setupRecommendationControls();
  setupBackToTop();
  populateCategorySelects();
  populateAiLabBookSelect();
  renderAll();
});

/**
 * Main synchronizer to refresh all views across the application
 */
function renderAll() {
  renderStudentWorkspace();
  renderRecommendations();
  renderBrowseBooks();
  renderHistoryAndAnalytics();
  runAiLabSimulation();
  updateNavbarState();
  updateFooterStudentLinks();
}

/* ==========================================================================
   1. Theme Management (Light / Dark Mode)
   ========================================================================== */
function initializeTheme() {
  const savedTheme = getActiveTheme();
  applyTheme(savedTheme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const icon = document.getElementById("themeToggleIcon");
  const text = document.getElementById("themeToggleText");
  if (icon && text) {
    if (theme === "dark") {
      icon.textContent = "☀️";
      text.textContent = "Light Mode";
    } else {
      icon.textContent = "🌙";
      text.textContent = "Dark Mode";
    }
  }
}

window.toggleTheme = function() {
  const current = getActiveTheme();
  const next = current === "dark" ? "light" : "dark";
  setActiveTheme(next);
  applyTheme(next);
  // Re-render charts for theme color adaptation
  renderHistoryAndAnalytics();
  showToast(`Switched to ${next === "dark" ? "Dark" : "Light"} theme`, "info");
};

/* ==========================================================================
   2. Digital Clock & Navbar Utilities
   ========================================================================== */
function setupClock() {
  const clockEl = document.getElementById("livePortalClock");
  if (!clockEl) return;
  const update = () => {
    const now = new Date();
    clockEl.textContent = `📅 ${now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} • ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };
  update();
  setInterval(update, 30000);
}

function setupNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");
  const mobileToggle = document.getElementById("mobileMenuToggle");
  const navMenu = document.getElementById("navLinksMenu");

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      if (navMenu && navMenu.classList.contains("open")) {
        navMenu.classList.remove("open");
      }
    });
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });
  }

  // Active section tracking on scroll
  const sections = document.querySelectorAll("section[id]");
  window.addEventListener("scroll", () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute("id");
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll(`.nav-link[href*="${sectionId}"]`).forEach(l => {
          navLinks.forEach(item => item.classList.remove("active"));
          l.classList.add("active");
        });
      }
    });
  });
}

function setupBackToTop() {
  const btn = document.getElementById("backToTopBtn");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 400) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  });
}

window.scrollToTop = function() {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

/* ==========================================================================
   3. Student Management & Workspace Controllers
   ========================================================================== */
function setupStudentControls() {
  const mainSelect = document.getElementById("studentSelect");
  const navSelect = document.getElementById("navStudentSelect");
  const students = getStudents();
  const currentStudentId = getCurrentStudentId();

  const optionsHtml = students.map(s => `
    <option value="${s.id}" ${s.id === currentStudentId ? "selected" : ""}>
      ${s.name} (${s.rollNo} • ${s.department})
    </option>
  `).join("");

  if (mainSelect) {
    mainSelect.innerHTML = optionsHtml;
    mainSelect.addEventListener("change", (e) => switchActiveStudent(e.target.value));
  }

  if (navSelect) {
    navSelect.innerHTML = optionsHtml;
    navSelect.addEventListener("change", (e) => switchActiveStudent(e.target.value));
  }
}

function switchActiveStudent(studentId) {
  setCurrentStudentId(studentId);
  const mainSelect = document.getElementById("studentSelect");
  const navSelect = document.getElementById("navStudentSelect");
  if (mainSelect) mainSelect.value = studentId;
  if (navSelect) navSelect.value = studentId;

  renderAll();
  const student = getCurrentStudent();
  showToast(`Active Student: ${student.name} (${student.rollNo})`, "info");
}

function updateNavbarState() {
  const currentStudent = getCurrentStudent();
  const chipAvatar = document.getElementById("chipAvatar");
  const navSelect = document.getElementById("navStudentSelect");

  if (chipAvatar && currentStudent) {
    chipAvatar.src = currentStudent.avatar;
    chipAvatar.alt = currentStudent.name;
  }
  if (navSelect && currentStudent) {
    navSelect.value = currentStudent.id;
  }
}

function getCurrentStudent() {
  const students = getStudents();
  const currentId = getCurrentStudentId();
  return students.find(s => s.id === currentId) || students[0];
}

/**
 * Render Student Profile, Quick Switcher Cards, Quota Gauge, and Interest Checkboxes
 */
function renderStudentWorkspace() {
  const student = getCurrentStudent();
  if (!student) return;

  const students = getStudents();

  // 1. Render Student Quick Switcher Cards
  const cardsGrid = document.getElementById("studentQuickCardsGrid");
  if (cardsGrid) {
    cardsGrid.innerHTML = students.map(s => {
      const isCurrent = s.id === student.id;
      const activeLoans = (s.history || []).filter(h => h.status === "Issued").length;
      return `
        <div class="student-mini-card ${isCurrent ? 'active' : ''}" onclick="switchActiveStudent('${s.id}')">
          <img src="${s.avatar}" alt="${escapeHtml(s.name)}" class="student-mini-avatar" />
          <div class="student-mini-info">
            <h5 class="student-mini-name">${escapeHtml(s.name)}</h5>
            <p class="student-mini-meta">${escapeHtml(s.rollNo)} • ${escapeHtml(s.department)}</p>
            <div class="student-mini-badge-row">
              <span class="badge ${activeLoans > 0 ? 'badge-primary' : 'badge-outline'}">${activeLoans} Active Loans</span>
            </div>
          </div>
          ${isCurrent ? '<span class="student-mini-check">✓ Active</span>' : ''}
        </div>
      `;
    }).join("");
  }

  // 2. Render Main Profile Card Summary
  const profileSummary = document.getElementById("studentProfileSummary");
  if (profileSummary) {
    const activeLoans = (student.history || []).filter(h => h.status === 'Issued').length;
    const overdueCount = (student.history || []).filter(h => h.status === 'Overdue').length;
    const returnedCount = (student.history || []).filter(h => h.status === 'Returned').length;

    profileSummary.innerHTML = `
      <div class="profile-header-strip">
        <img src="${student.avatar}" alt="${escapeHtml(student.name)}" class="profile-avatar-large" />
        <div class="profile-title-block">
          <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
            <h3 class="profile-name-text">${escapeHtml(student.name)}</h3>
            <span class="badge badge-primary">${escapeHtml(student.rollNo)}</span>
          </div>
          <p class="profile-department-text">${escapeHtml(student.department)} • ${escapeHtml(student.year)}</p>
          <p style="font-size:0.82rem; color:var(--text-muted); margin:0.15rem 0;">
            Apex Central Library Card ID: <strong>LIB-${student.id}</strong>
          </p>
        </div>
      </div>

      <div class="profile-stat-pills">
        <div class="profile-pill-item">
          <span class="pill-number">${student.history ? student.history.length : 0}</span>
          <span class="pill-label">Total Allotted</span>
        </div>
        <div class="profile-pill-item">
          <span class="pill-number text-amber">${activeLoans}</span>
          <span class="pill-label">Currently Issued</span>
        </div>
        <div class="profile-pill-item">
          <span class="pill-number text-green">${returnedCount}</span>
          <span class="pill-label">Returned</span>
        </div>
        <div class="profile-pill-item">
          <span class="pill-number ${overdueCount > 0 ? 'text-danger' : ''}">${overdueCount}</span>
          <span class="pill-label">Overdue</span>
        </div>
      </div>
    `;
  }

  // 3. Render Quota Progress Gauge (6 Books Limit)
  const quotaCountText = document.getElementById("quotaCountText");
  const quotaProgressBar = document.getElementById("quotaProgressBar");
  const quotaCaption = document.getElementById("quotaCaption");

  if (quotaCountText && quotaProgressBar && quotaCaption) {
    const activeCount = (student.history || []).filter(h => h.status === "Issued").length;
    const maxLimit = 6;
    const pct = Math.min(100, Math.round((activeCount / maxLimit) * 100));
    
    quotaCountText.textContent = `${activeCount} / ${maxLimit} Books`;
    quotaProgressBar.style.width = `${pct}%`;

    if (activeCount >= maxLimit) {
      quotaProgressBar.style.backgroundColor = "var(--danger)";
      quotaCaption.innerHTML = `<span class="text-danger font-semibold">⚠️ Allotment Limit Reached (6/6).</span> Return a book before requesting a new issue.`;
    } else if (activeCount >= 4) {
      quotaProgressBar.style.backgroundColor = "var(--accent)";
      quotaCaption.textContent = `${maxLimit - activeCount} book allotments remaining before semester limit.`;
    } else {
      quotaProgressBar.style.backgroundColor = "var(--primary)";
      quotaCaption.textContent = `${maxLimit - activeCount} book allotments remaining before semester limit.`;
    }
  }

  // 4. Render Interests Checkboxes
  const interestsContainer = document.getElementById("interestsCheckboxes");
  if (interestsContainer) {
    const studentInterests = new Set(student.interests || []);
    interestsContainer.innerHTML = DEFAULT_CATEGORIES.map(category => {
      const isChecked = studentInterests.has(category);
      return `
        <label class="interest-checkbox-label ${isChecked ? 'checked' : ''}">
          <input type="checkbox" value="${category}" ${isChecked ? 'checked' : ''} onchange="toggleInterest('${category}', this.checked)" />
          <span class="interest-chip-text">${category}</span>
          ${isChecked ? '<span class="interest-chip-dot">●</span>' : ''}
        </label>
      `;
    }).join("");
  }
}

/**
 * Handle student interest checkbox changes
 */
window.toggleInterest = function(category, isChecked) {
  const students = getStudents();
  const currentId = getCurrentStudentId();
  const student = students.find(s => s.id === currentId);

  if (student) {
    if (!Array.isArray(student.interests)) student.interests = [];
    if (isChecked) {
      if (!student.interests.includes(category)) student.interests.push(category);
    } else {
      student.interests = student.interests.filter(c => c !== category);
    }
    saveStudents(students);
    renderStudentWorkspace();
    renderRecommendations();
    runAiLabSimulation();
    showToast(`Updated interests: ${category} ${isChecked ? 'added' : 'removed'}`, "info");
  }
};

window.selectAllInterests = function() {
  const students = getStudents();
  const student = students.find(s => s.id === getCurrentStudentId());
  if (student) {
    student.interests = [...DEFAULT_CATEGORIES];
    saveStudents(students);
    renderStudentWorkspace();
    renderRecommendations();
    runAiLabSimulation();
    showToast("All academic domains selected", "success");
  }
};

window.clearAllInterests = function() {
  const students = getStudents();
  const student = students.find(s => s.id === getCurrentStudentId());
  if (student) {
    student.interests = [];
    saveStudents(students);
    renderStudentWorkspace();
    renderRecommendations();
    runAiLabSimulation();
    showToast("Cleared all interests (Recommendations now driven purely by borrow history)", "warning");
  }
};

window.resetBranchInterests = function() {
  const students = getStudents();
  const student = students.find(s => s.id === getCurrentStudentId());
  if (student) {
    // Find initial default interests for this student
    const original = INITIAL_STUDENTS.find(s => s.id === student.id);
    student.interests = original ? [...original.interests] : ["Python", "Data Science"];
    saveStudents(students);
    renderStudentWorkspace();
    renderRecommendations();
    runAiLabSimulation();
    showToast(`Restored default interests for ${student.name}`, "info");
  }
};

/* ==========================================================================
   4. Recommendation Section Controls & Rendering
   ========================================================================== */
function setupRecommendationControls() {
  const collabToggle = document.getElementById("collabFilterToggle");
  const collabStatusText = document.getElementById("collabStatusText");

  if (collabToggle) {
    collabToggle.checked = getCollabFilterEnabled();
    if (collabStatusText) {
      collabStatusText.textContent = collabToggle.checked ? "On (Peer Jaccard Boost Active)" : "Off (Pure Content-Based)";
    }

    collabToggle.addEventListener("change", (e) => {
      setCollabFilterEnabled(e.target.checked);
      if (collabStatusText) {
        collabStatusText.textContent = e.target.checked ? "On (Peer Jaccard Boost Active)" : "Off (Pure Content-Based)";
      }
      renderRecommendations();
      runAiLabSimulation();
      showToast(e.target.checked 
        ? "Collaborative Filtering enabled: Jaccard peer similarity boost active" 
        : "Standard Content-Based Filtering active", "info");
    });
  }
}

/**
 * Render Recommendations for Currently Active Student
 */
function renderRecommendations() {
  const recsContainer = document.getElementById("recommendationsGrid");
  const recsStudentName = document.getElementById("recsStudentName");
  if (!recsContainer) return;

  const student = getCurrentStudent();
  if (recsStudentName) recsStudentName.textContent = student.name;

  // AI Recommendation Engine Call
  let recommendations = getRecommendations(student.id, {
    collaborative: getCollabFilterEnabled(),
    limit: 6
  });

  // Handle Sort Selector in Recommendations Header
  const sortSelect = document.getElementById("recSortSelect");
  if (sortSelect) {
    const val = sortSelect.value;
    if (val === "rating") {
      recommendations.sort((a, b) => b.book.rating - a.book.rating);
    } else if (val === "copies") {
      recommendations.sort((a, b) => b.book.availableCopies - a.book.availableCopies);
    } else if (val === "year") {
      recommendations.sort((a, b) => b.book.publicationYear - a.book.publicationYear);
    }
  }

  if (recommendations.length === 0) {
    recsContainer.innerHTML = `
      <div class="empty-state-card" style="grid-column: 1 / -1;">
        <span class="empty-state-icon">🎉</span>
        <h4>All matching books in your curriculum portfolio have been read!</h4>
        <p>You have explored every title in this domain. Add more interests in the workspace above or browse the complete catalog.</p>
        <button class="btn btn-primary btn-sm" onclick="clearAllInterests(); selectAllInterests();">Reset & Select All Categories</button>
      </div>
    `;
    return;
  }

  const wishlist = new Set(getStudentWishlist(student.id));
  const activeCount = (student.history || []).filter(h => h.status === "Issued").length;
  const isQuotaFull = activeCount >= 6;

  recsContainer.innerHTML = recommendations.map((item, idx) => {
    const book = item.book;
    const coverUrl = `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`;
    const isOutOfStock = book.availableCopies <= 0;
    const isWishlisted = wishlist.has(book.id);

    return `
      <div class="rec-book-card">
        <div class="rec-card-top-bar">
          <div class="rec-rank-chip">#${idx + 1} Recommendation</div>
          <div class="rec-match-score-badge">
            <span class="score-sparkle">★</span>
            <span class="score-val">${item.matchPercentage}%</span>
            <span class="score-label">Match</span>
          </div>
        </div>

        <div class="book-cover-container" onclick="openBookDetailsModal('${book.id}')" title="Click to view book overview">
          <img 
            src="${coverUrl}" 
            alt="${escapeHtml(book.title)}" 
            class="book-cover-img"
            loading="lazy"
            onerror="renderCoverFallback(this, '${escapeHtml(book.title)}', '${book.category}', '${escapeHtml(book.author)}')"
          />
          <button class="wishlist-btn-corner ${isWishlisted ? 'active' : ''}" onclick="event.stopPropagation(); handleToggleWishlist('${book.id}')" title="${isWishlisted ? 'Remove from saved' : 'Save for later'}">
            ${isWishlisted ? '❤️' : '🤍'}
          </button>
        </div>

        <div class="book-body">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem;">
            <span class="book-category-tag">${book.category}</span>
            <span class="book-year-tag">${book.publicationYear}</span>
          </div>

          <h4 class="book-title" title="${escapeHtml(book.title)}" onclick="openBookDetailsModal('${book.id}')">
            ${escapeHtml(book.title)}
          </h4>
          <p class="book-author">By ${escapeHtml(book.author)}</p>
          
          <div class="book-rating-row">
            <span class="stars">${renderStars(book.rating)}</span>
            <span class="rating-number">${book.rating.toFixed(1)}</span>
            <span class="copies-badge ${book.availableCopies > 0 ? (book.availableCopies > 1 ? 'copies-good' : 'copies-low') : 'copies-none'}">
              ${book.availableCopies > 0 ? `${book.availableCopies} Copies Available` : 'Out of Stock'}
            </span>
          </div>

          <div class="rec-reason-box" onclick="openXaiModal('${book.id}')" title="Click to view mathematical proof">
            <span class="rec-reason-icon">💡</span>
            <span class="rec-reason-text">${item.reason}</span>
            <span class="rec-math-link">Inspect Math →</span>
          </div>

          <div class="book-card-actions-row">
            <button 
              class="btn btn-accent btn-sm btn-flex" 
              onclick="issueBook('${book.id}')"
              ${(isOutOfStock || isQuotaFull) ? 'disabled' : ''}
              title="${isQuotaFull ? 'Allotment limit of 6 books reached' : (isOutOfStock ? 'No copies available' : 'Issue this book for 14 days')}">
              <span>⚡</span> ${isQuotaFull ? 'Quota Full' : (isOutOfStock ? 'Out of Stock' : 'Issue Book Now')}
            </button>
            <button class="btn btn-outline btn-sm" onclick="openBookDetailsModal('${book.id}')" title="Quick overview">
              Details
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

/* ==========================================================================
   5. Browse Catalog Controls, Filtering & View Modes
   ========================================================================== */
function setupBrowseControls() {
  const searchInput = document.getElementById("bookSearchInput");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentSearchQuery = e.target.value.toLowerCase().trim();
      const clearBtn = document.getElementById("searchClearBtn");
      if (clearBtn) clearBtn.style.display = currentSearchQuery ? "block" : "none";
      renderBrowseBooks();
    });
  }

  renderCategoryPills();
}

function renderCategoryPills() {
  const filterPillsContainer = document.getElementById("categoryFilterPills");
  if (!filterPillsContainer) return;

  const books = getBooks();
  const allCategories = ["All", ...DEFAULT_CATEGORIES];

  filterPillsContainer.innerHTML = allCategories.map(cat => {
    const count = cat === "All" ? books.length : books.filter(b => b.category === cat).length;
    const isActive = cat === currentCategoryFilter;
    return `
      <button class="filter-pill ${isActive ? 'active' : ''}" onclick="setCategoryFilter('${cat}')">
        <span>${cat}</span>
        <span class="pill-count-bubble">${count}</span>
      </button>
    `;
  }).join("");
}

window.setCategoryFilter = function(category) {
  currentCategoryFilter = category;
  renderCategoryPills();
  renderBrowseBooks();
};

window.clearSearch = function() {
  const searchInput = document.getElementById("bookSearchInput");
  if (searchInput) searchInput.value = "";
  currentSearchQuery = "";
  const clearBtn = document.getElementById("searchClearBtn");
  if (clearBtn) clearBtn.style.display = "none";
  renderBrowseBooks();
};

window.clearFilters = function() {
  currentCategoryFilter = "All";
  currentSearchQuery = "";
  const searchInput = document.getElementById("bookSearchInput");
  if (searchInput) searchInput.value = "";
  const stockCheckbox = document.getElementById("browseStockOnly");
  if (stockCheckbox) stockCheckbox.checked = false;
  const sortSelect = document.getElementById("browseSortSelect");
  if (sortSelect) sortSelect.value = "default";

  renderCategoryPills();
  renderBrowseBooks();
  showToast("Catalog filters reset", "info");
};

window.setCatalogViewMode = function(mode) {
  currentCatalogViewMode = mode;
  document.getElementById("viewModeGrid")?.classList.toggle("active", mode === "grid");
  document.getElementById("viewModeList")?.classList.toggle("active", mode === "list");
  renderBrowseBooks();
};

/**
 * Render Browse Books Grid or Table View
 */
function renderBrowseBooks() {
  const booksContainer = document.getElementById("browseBooksGrid");
  const countLabel = document.getElementById("catalogResultsCount");
  if (!booksContainer) return;

  const books = getBooks();
  const student = getCurrentStudent();
  const currentlyIssuedOrBorrowed = new Set((student.history || []).map(h => h.bookId));
  const activeCount = (student.history || []).filter(h => h.status === "Issued").length;
  const isQuotaFull = activeCount >= 6;
  const wishlist = new Set(getStudentWishlist(student.id));

  const stockOnly = document.getElementById("browseStockOnly")?.checked || false;
  const sortVal = document.getElementById("browseSortSelect")?.value || "default";

  // Filter
  let filtered = books.filter(book => {
    const matchesCategory = currentCategoryFilter === "All" || book.category === currentCategoryFilter;
    const matchesStock = !stockOnly || book.availableCopies > 0;
    const matchesSearch = !currentSearchQuery || 
      book.title.toLowerCase().includes(currentSearchQuery) ||
      book.author.toLowerCase().includes(currentSearchQuery) ||
      book.category.toLowerCase().includes(currentSearchQuery) ||
      book.isbn.toLowerCase().includes(currentSearchQuery) ||
      (book.tags && book.tags.some(t => t.toLowerCase().includes(currentSearchQuery)));
    
    return matchesCategory && matchesStock && matchesSearch;
  });

  // Sort
  if (sortVal === "rating-desc") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortVal === "avail-desc") {
    filtered.sort((a, b) => b.availableCopies - a.availableCopies);
  } else if (sortVal === "year-desc") {
    filtered.sort((a, b) => b.publicationYear - a.publicationYear);
  } else if (sortVal === "title-asc") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  }

  if (countLabel) {
    countLabel.textContent = `Showing ${filtered.length} of ${books.length} books in catalog`;
  }

  // Update hero stats as well
  const heroBookCount = document.getElementById("heroBookCount");
  if (heroBookCount) heroBookCount.textContent = `${books.length}+`;

  if (filtered.length === 0) {
    booksContainer.innerHTML = `
      <div class="empty-state-card" style="grid-column: 1 / -1;">
        <span class="empty-state-icon">🔍</span>
        <h4>No books match your search or filter criteria.</h4>
        <p>Try searching for a different term (e.g. Python, SQL, Neural Networks) or clear active category filters.</p>
        <button class="btn btn-outline btn-sm" onclick="clearFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  // Check view mode: GRID vs LIST
  if (currentCatalogViewMode === "list") {
    booksContainer.className = "catalog-list-view";
    booksContainer.innerHTML = filtered.map(book => {
      const isAlreadyBorrowed = currentlyIssuedOrBorrowed.has(book.id);
      const isOutOfStock = book.availableCopies <= 0;
      const isWishlisted = wishlist.has(book.id);

      return `
        <div class="catalog-list-row">
          <div class="list-cover-col" onclick="openBookDetailsModal('${book.id}')">
            <img 
              src="https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg" 
              alt="${escapeHtml(book.title)}" 
              class="list-cover-thumb" 
              onerror="renderCoverFallback(this, '${escapeHtml(book.title)}', '${book.category}', '${escapeHtml(book.author)}')"
            />
          </div>
          <div class="list-details-col">
            <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
              <span class="book-category-tag">${book.category}</span>
              <span style="font-size:0.8rem; color:var(--text-muted);">ISBN: ${book.isbn} • Pub: ${book.publicationYear}</span>
            </div>
            <h4 class="list-book-title" onclick="openBookDetailsModal('${book.id}')">${escapeHtml(book.title)}</h4>
            <p class="list-book-author">By ${escapeHtml(book.author)}</p>
            <p class="list-book-desc">${escapeHtml(book.description ? book.description.slice(0, 140) + '...' : '')}</p>
          </div>
          <div class="list-meta-col">
            <div class="book-rating-row">
              <span class="stars">${renderStars(book.rating)}</span>
              <span class="rating-number">${book.rating.toFixed(1)}</span>
            </div>
            <span class="copies-badge ${book.availableCopies > 0 ? (book.availableCopies > 1 ? 'copies-good' : 'copies-low') : 'copies-none'}">
              ${book.availableCopies} / ${book.totalCopies} Available
            </span>
            <div class="list-actions-group">
              <button 
                class="btn btn-primary btn-sm" 
                onclick="issueBook('${book.id}')"
                ${(isAlreadyBorrowed || isOutOfStock || isQuotaFull) ? 'disabled' : ''}>
                ${isAlreadyBorrowed ? 'In History' : (isQuotaFull ? 'Quota Full' : (isOutOfStock ? 'Out of Stock' : 'Issue Book'))}
              </button>
              <button class="btn btn-outline btn-xs" onclick="openBookDetailsModal('${book.id}')">
                Details
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  } else {
    // Standard Grid View
    booksContainer.className = "books-grid";
    booksContainer.innerHTML = filtered.map(book => {
      const isAlreadyBorrowed = currentlyIssuedOrBorrowed.has(book.id);
      const isOutOfStock = book.availableCopies <= 0;
      const isWishlisted = wishlist.has(book.id);
      const coverUrl = `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`;

      return `
        <div class="book-card">
          <div class="book-cover-container" onclick="openBookDetailsModal('${book.id}')">
            <img 
              src="${coverUrl}" 
              alt="${escapeHtml(book.title)}" 
              class="book-cover-img"
              loading="lazy"
              onerror="renderCoverFallback(this, '${escapeHtml(book.title)}', '${book.category}', '${escapeHtml(book.author)}')"
            />
            <button class="wishlist-btn-corner ${isWishlisted ? 'active' : ''}" onclick="event.stopPropagation(); handleToggleWishlist('${book.id}')" title="${isWishlisted ? 'Remove bookmark' : 'Bookmark book'}">
              ${isWishlisted ? '❤️' : '🤍'}
            </button>
          </div>
          <div class="book-body">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem;">
              <span class="book-category-tag">${book.category}</span>
              <span class="book-year-tag">${book.publicationYear}</span>
            </div>

            <h4 class="book-title" title="${escapeHtml(book.title)}" onclick="openBookDetailsModal('${book.id}')">
              ${escapeHtml(book.title)}
            </h4>
            <p class="book-author">By ${escapeHtml(book.author)}</p>
            
            <div class="book-rating-row">
              <span class="stars">${renderStars(book.rating)}</span>
              <span class="rating-number">${book.rating.toFixed(1)}</span>
              <span class="copies-badge ${book.availableCopies > 0 ? (book.availableCopies > 1 ? 'copies-good' : 'copies-low') : 'copies-none'}">
                ${book.availableCopies > 0 ? `${book.availableCopies} Available` : 'Out of Stock'}
              </span>
            </div>

            <div class="book-card-footer">
              <button 
                class="btn btn-primary btn-sm btn-flex" 
                onclick="issueBook('${book.id}')"
                ${(isAlreadyBorrowed || isOutOfStock || isQuotaFull) ? 'disabled' : ''}
                title="${isAlreadyBorrowed ? 'Already in your allotment history' : (isQuotaFull ? 'Semester allotment limit reached (6 books)' : (isOutOfStock ? 'No copies available' : 'Issue this book for 14 days'))}">
                ${isAlreadyBorrowed ? 'In History' : (isQuotaFull ? 'Quota Full' : (isOutOfStock ? 'Out of Stock' : 'Issue Book'))}
              </button>
              <button class="btn btn-outline btn-sm" onclick="openBookDetailsModal('${book.id}')" title="View details">
                Details
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }
}

/* ==========================================================================
   6. Allotment Issuance, Renewal & Return Workflows
   ========================================================================== */
window.issueBook = function(bookId) {
  const students = getStudents();
  const books = getBooks();
  const currentId = getCurrentStudentId();

  const student = students.find(s => s.id === currentId);
  const book = books.find(b => b.id === bookId);

  if (!student || !book) {
    showToast("Error locating record", "error");
    return;
  }

  // Quota enforcement
  const activeCount = (student.history || []).filter(h => h.status === "Issued").length;
  if (activeCount >= 6) {
    showToast("Semester quota reached! Maximum 6 active books allotted. Return a book first.", "warning");
    return;
  }

  // Duplicate check
  if (student.history.some(h => h.bookId === bookId)) {
    showToast(`"${book.title.split(':')[0]}" is already in your allotment ledger!`, "warning");
    return;
  }

  if (book.availableCopies <= 0) {
    showToast("No physical copies available right now.", "warning");
    return;
  }

  const today = new Date();
  const dueDate = new Date();
  dueDate.setDate(today.getDate() + 14);
  const formatDate = (d) => d.toISOString().split("T")[0];

  const newAllotment = {
    allotmentId: `ALT-${Date.now().toString().slice(-4)}`,
    bookId: book.id,
    bookTitle: book.title,
    category: book.category,
    issueDate: formatDate(today),
    dueDate: formatDate(dueDate),
    returnDate: null,
    status: "Issued"
  };

  student.history.unshift(newAllotment);
  book.availableCopies = Math.max(0, book.availableCopies - 1);

  saveStudents(students);
  saveBooks(books);

  closeModal('bookDetailsModal');
  renderAll();
  showToast(`Successfully issued "${book.title.split(':')[0]}"! 14-day loan recorded.`, "success");
};

window.renewBook = function(allotmentId) {
  const currentId = getCurrentStudentId();
  const res = renewAllotmentRecord(currentId, allotmentId);

  if (res.success) {
    renderAll();
    showToast(`Loan extended! New due date: ${res.newDueDate} (+14 days)`, "success");
  } else {
    showToast(res.message || "Failed to renew book", "warning");
  }
};

window.returnBook = function(allotmentId) {
  const students = getStudents();
  const books = getBooks();
  const currentId = getCurrentStudentId();

  const student = students.find(s => s.id === currentId);
  if (!student) return;

  const record = student.history.find(h => h.allotmentId === allotmentId);
  if (!record) return;

  const today = new Date().toISOString().split("T")[0];
  record.returnDate = today;
  record.status = "Returned";

  // Increment available copies of book
  const book = books.find(b => b.id === record.bookId);
  if (book) {
    book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1);
  }

  saveStudents(students);
  saveBooks(books);

  renderAll();
  showToast(`Book returned successfully: "${record.bookTitle.split(':')[0]}"`, "success");
};

window.handleToggleWishlist = function(bookId) {
  const currentId = getCurrentStudentId();
  const added = toggleStudentWishlist(currentId, bookId);
  renderAll();
  showToast(added ? "Added book to your saved list" : "Removed book from saved list", "info");
};

/* ==========================================================================
   7. History & Visual Analytics Section (Dual Charts & Filterable Ledger)
   ========================================================================== */
window.setHistoryFilter = function(filter) {
  currentHistoryFilter = filter;
  document.querySelectorAll("#historyTabGroup .tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.textContent.startsWith(filter === "Issued" ? "Active" : filter));
  });
  renderHistoryTable();
};

function renderHistoryAndAnalytics() {
  const student = getCurrentStudent();
  if (!student) return;

  const history = student.history || [];

  // Summary Metrics
  const totalBorrowed = history.length;
  const currentlyIssued = history.filter(h => h.status === "Issued").length;
  const returnedCount = history.filter(h => h.status === "Returned").length;
  const overdueCount = history.filter(h => h.status === "Overdue").length;

  document.getElementById("statTotalBorrowed") && (document.getElementById("statTotalBorrowed").textContent = totalBorrowed);
  document.getElementById("statCurrentlyIssued") && (document.getElementById("statCurrentlyIssued").textContent = currentlyIssued);
  document.getElementById("statReturned") && (document.getElementById("statReturned").textContent = returnedCount);
  document.getElementById("statOverdue") && (document.getElementById("statOverdue").textContent = overdueCount);

  // Tab counts
  document.getElementById("tabCountAll") && (document.getElementById("tabCountAll").textContent = totalBorrowed);
  document.getElementById("tabCountIssued") && (document.getElementById("tabCountIssued").textContent = currentlyIssued);
  document.getElementById("tabCountReturned") && (document.getElementById("tabCountReturned").textContent = returnedCount);
  document.getElementById("tabCountOverdue") && (document.getElementById("tabCountOverdue").textContent = overdueCount);

  renderHistoryTable();
  renderCategoryChart(history);
  renderStatusRatioChart(currentlyIssued, returnedCount, overdueCount);
}

function renderHistoryTable() {
  const student = getCurrentStudent();
  const tableBody = document.getElementById("historyTableBody");
  if (!tableBody || !student) return;

  let history = student.history || [];
  if (currentHistoryFilter !== "All") {
    history = history.filter(h => h.status === currentHistoryFilter);
  }

  if (history.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding:2.5rem; color:var(--text-muted);">
          No allotment transactions found matching "${currentHistoryFilter}".
        </td>
      </tr>
    `;
    return;
  }

  const today = new Date();

  tableBody.innerHTML = history.map(item => {
    let statusBadgeClass = "badge-primary";
    if (item.status === "Returned") statusBadgeClass = "badge-success";
    else if (item.status === "Issued") statusBadgeClass = "badge-warning";
    else if (item.status === "Overdue") statusBadgeClass = "badge-danger";

    // Countdown / Days Remaining calculation
    let countdownDisplay = '<span style="color:var(--text-muted);">-</span>';
    if (item.status === "Issued" && item.dueDate) {
      const due = new Date(item.dueDate);
      const diffTime = due - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        countdownDisplay = `<span class="badge badge-success">🟢 ${diffDays} days left</span>`;
      } else if (diffDays === 0) {
        countdownDisplay = `<span class="badge badge-warning">🟡 Due Today!</span>`;
      } else {
        countdownDisplay = `<span class="badge badge-danger">🔴 Overdue by ${Math.abs(diffDays)}d</span>`;
      }
    } else if (item.status === "Overdue") {
      countdownDisplay = `<span class="badge badge-danger">🔴 Overdue</span>`;
    } else if (item.status === "Returned") {
      countdownDisplay = `<span style="color:var(--text-muted); font-size:0.85rem;">Completed (${item.returnDate || 'Returned'})</span>`;
    }

    const canReturn = item.status === "Issued" || item.status === "Overdue";
    const canRenew = item.status === "Issued";

    return `
      <tr>
        <td><code>${item.allotmentId}</code></td>
        <td>
          <div class="book-table-title" onclick="openBookDetailsModal('${item.bookId}')">${escapeHtml(item.bookTitle)}</div>
        </td>
        <td><span class="badge badge-primary">${item.category}</span></td>
        <td>${item.issueDate}</td>
        <td><strong>${item.dueDate}</strong></td>
        <td>${countdownDisplay}</td>
        <td><span class="badge ${statusBadgeClass}">${item.status}</span></td>
        <td>
          <div style="display:flex; gap:0.35rem; align-items:center;">
            ${canRenew ? `
              <button class="btn btn-outline btn-xs" onclick="renewBook('${item.allotmentId}')" title="Extend due date by 14 days">
                Renew
              </button>
            ` : ''}
            ${canReturn ? `
              <button class="btn btn-primary btn-xs" onclick="returnBook('${item.allotmentId}')" title="Return this book">
                Return
              </button>
            ` : `
              <span style="color:var(--text-muted); font-size:0.8rem;">Archived</span>
            `}
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

/**
 * Category Borrow Frequency Bar Chart (Chart.js)
 */
function renderCategoryChart(history) {
  const chartCanvas = document.getElementById("categoryBorrowChart");
  if (!chartCanvas) return;

  const counts = {};
  DEFAULT_CATEGORIES.forEach(cat => (counts[cat] = 0));

  history.forEach(item => {
    if (counts[item.category] !== undefined) counts[item.category]++;
    else counts[item.category] = 1;
  });

  const labels = Object.keys(counts);
  const data = Object.values(counts);

  if (categoryChartInstance) categoryChartInstance.destroy();

  const isDark = getActiveTheme() === "dark";
  const textColor = isDark ? "#cbd5e1" : "#475569";
  const gridColor = isDark ? "#1e293b" : "#e2e8f0";

  const ctx = chartCanvas.getContext("2d");
  categoryChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Books Borrowed",
        data: data,
        backgroundColor: [
          "#2563eb", "#3b82f6", "#06b6d4", "#f59e0b",
          "#d97706", "#10b981", "#059669", "#8b5cf6", "#ec4899"
        ],
        borderRadius: 6,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isDark ? "#1e293b" : "#0f172a",
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: (ctx) => ` ${ctx.parsed.y} books borrowed in this domain`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: "Inter", size: 10 }, color: textColor }
        },
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1, precision: 0, font: { family: "Inter", size: 11 }, color: textColor },
          grid: { color: gridColor }
        }
      }
    }
  });
}

/**
 * Allotment Status Ratio Doughnut Chart (Chart.js)
 */
function renderStatusRatioChart(issued, returned, overdue) {
  const chartCanvas = document.getElementById("statusRatioChart");
  if (!chartCanvas) return;

  if (statusChartInstance) statusChartInstance.destroy();

  const isDark = getActiveTheme() === "dark";
  const ctx = chartCanvas.getContext("2d");

  statusChartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Active Loans", "Returned", "Overdue"],
      datasets: [{
        data: [issued, returned, overdue],
        backgroundColor: ["#f59e0b", "#10b981", "#ef4444"],
        borderColor: isDark ? "#111827" : "#ffffff",
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "68%",
      plugins: {
        legend: {
          position: "bottom",
          labels: { font: { family: "Inter", size: 11 }, color: isDark ? "#cbd5e1" : "#475569" }
        }
      }
    }
  });
}

/* ==========================================================================
   8. AI Engine Lab & Interactive Simulator
   ========================================================================== */
function populateAiLabBookSelect() {
  const select = document.getElementById("aiLabBookSelect");
  if (!select) return;
  const books = getBooks();
  select.innerHTML = books.map(b => `
    <option value="${b.id}">[${b.category}] ${b.title} (Rating: ${b.rating}★)</option>
  `).join("");
}

window.runAiLabSimulation = function() {
  const select = document.getElementById("aiLabBookSelect");
  const container = document.getElementById("aiLabResults");
  if (!select || !container) return;

  const bookId = select.value || "B007";
  const student = getCurrentStudent();
  const math = getRecommendationDetailedMath(student.id, bookId);

  const isAlreadyBorrowed = (student.history || []).some(h => h.bookId === bookId);

  container.innerHTML = `
    <div class="ai-lab-proof-grid">
      
      <!-- Left: Simulation Metrics -->
      <div class="ai-lab-metric-panel">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <span class="badge badge-accent">${math.book.category}</span>
            <h4 style="font-size:1.15rem; font-weight:700; margin:0.35rem 0;">${escapeHtml(math.book.title)}</h4>
            <p style="font-size:0.85rem; color:var(--text-muted); margin:0;">Author: ${escapeHtml(math.book.author)} • ISBN: ${math.book.isbn}</p>
          </div>
          <div class="sim-score-box">
            <span class="sim-score-num">${math.matchPercentage}%</span>
            <span class="sim-score-label">AI Match Score</span>
          </div>
        </div>

        ${isAlreadyBorrowed ? `
          <div class="alert-box alert-warning" style="margin-top:1rem;">
            ⚠️ <strong>Duplicate Prevention Triggered:</strong> This book already exists in ${student.name}'s borrowing history. The production recommendation engine strictly filters this candidate out of top-6 suggestions.
          </div>
        ` : ''}

        <div class="ai-lab-breakdown-strip">
          <div class="ai-breakdown-stat">
            <span class="stat-k">Cosine Similarity (cos θ)</span>
            <span class="stat-v">${math.cosineSim.toFixed(4)}</span>
          </div>
          <div class="ai-breakdown-stat">
            <span class="stat-k">Rating Quality Bonus</span>
            <span class="stat-v">+${math.ratingBoost.toFixed(4)}</span>
          </div>
          <div class="ai-breakdown-stat">
            <span class="stat-k">Peer Collaborative Boost</span>
            <span class="stat-v">+${math.collabBoost.toFixed(4)}</span>
          </div>
          <div class="ai-breakdown-stat">
            <span class="stat-k">Availability Bonus</span>
            <span class="stat-v">+${math.availBonus.toFixed(4)}</span>
          </div>
          <div class="ai-breakdown-stat font-bold">
            <span class="stat-k">Composite Final Score</span>
            <span class="stat-v text-accent">${math.compositeScore.toFixed(4)}</span>
          </div>
        </div>

        <div class="ai-reason-pill-box">
          <strong>Synthesized XAI Reason:</strong> ${math.explanation}
        </div>

        ${math.domainPath.length > 0 ? `
          <div style="margin-top:0.75rem; font-size:0.85rem; color:var(--text-muted);">
            🌐 <strong>Curriculum Domain Graph Bridge:</strong> ${math.domainPath.join(' | ')}
          </div>
        ` : ''}
      </div>

      <!-- Right: Mathematical Formula & Term Dot-Product Table -->
      <div class="ai-lab-math-panel">
        <h5 style="font-size:0.95rem; font-weight:700; margin-bottom:0.4rem;">Vector Dot-Product Breakdown</h5>
        <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.75rem;">
          Intersection between Student Feature Vector $\\hat{\\mathbf{u}}$ and Book Feature Vector $\\hat{\\mathbf{d}}$:
        </p>

        <div class="table-responsive" style="max-height: 220px; overflow-y:auto;">
          <table class="library-table table-sm">
            <thead>
              <tr>
                <th>Matched Token</th>
                <th>Student Weight</th>
                <th>Book Weight</th>
                <th>Dot Contribution</th>
              </tr>
            </thead>
            <tbody>
              ${math.matchedTokens.length === 0 ? `
                <tr><td colspan="4" style="text-align:center; color:var(--text-muted);">No overlapping vocabulary tokens. Score is baseline.</td></tr>
              ` : math.matchedTokens.slice(0, 8).map(t => `
                <tr>
                  <td><code>${t.token}</code></td>
                  <td>${t.userWeight}</td>
                  <td>${t.bookWeight}</td>
                  <td class="text-accent font-semibold">+${t.contribution}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
};

/* ==========================================================================
   9. Modals (Book Details, XAI Inspector, Add Book, Receipt Slip)
   ========================================================================== */
window.openBookDetailsModal = function(bookId) {
  const books = getBooks();
  const book = books.find(b => b.id === bookId);
  if (!book) return;

  const student = getCurrentStudent();
  const isAlreadyBorrowed = (student.history || []).some(h => h.bookId === book.id);
  const activeCount = (student.history || []).filter(h => h.status === "Issued").length;
  const isQuotaFull = activeCount >= 6;
  const isOutOfStock = book.availableCopies <= 0;

  const modalTitle = document.getElementById("modalBookTitle");
  const modalContent = document.getElementById("modalBookContent");
  const modalFooter = document.getElementById("modalBookFooter");

  if (modalTitle) modalTitle.textContent = book.title;

  if (modalContent) {
    modalContent.innerHTML = `
      <div class="modal-book-layout">
        <div class="modal-cover-wrap">
          <img 
            src="https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg" 
            alt="${escapeHtml(book.title)}" 
            class="modal-cover-img" 
            onerror="renderCoverFallback(this, '${escapeHtml(book.title)}', '${book.category}', '${escapeHtml(book.author)}')"
          />
        </div>
        <div class="modal-info-wrap">
          <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap; margin-bottom:0.5rem;">
            <span class="book-category-tag">${book.category}</span>
            <span class="badge badge-primary">ISBN: ${book.isbn}</span>
            <span class="badge badge-outline">Year: ${book.publicationYear}</span>
          </div>

          <h3 style="font-size:1.35rem; font-weight:700; margin-bottom:0.35rem;">${escapeHtml(book.title)}</h3>
          <p style="font-size:0.95rem; color:var(--text-muted); margin-bottom:0.75rem;">By <strong>${escapeHtml(book.author)}</strong></p>

          <div class="book-rating-row" style="margin-bottom:1rem;">
            <span class="stars">${renderStars(book.rating)}</span>
            <span class="rating-number">${book.rating.toFixed(1)} / 5.0</span>
            <span class="copies-badge ${book.availableCopies > 0 ? (book.availableCopies > 1 ? 'copies-good' : 'copies-low') : 'copies-none'}">
              ${book.availableCopies} Copies Available (${book.totalCopies} Total in Central Library)
            </span>
          </div>

          <p style="font-size:0.95rem; line-height:1.6; color:var(--text-body); margin-bottom:1.25rem;">
            ${escapeHtml(book.description || 'Comprehensive university reference textbook.')}
          </p>

          <div style="margin-bottom:1rem;">
            <h5 style="font-size:0.85rem; text-transform:uppercase; color:var(--text-muted); margin-bottom:0.4rem;">Feature Vector Keywords (Tags):</h5>
            <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
              ${(book.tags || []).map(t => `<span class="badge badge-outline">${t}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (modalFooter) {
    modalFooter.innerHTML = `
      <button class="btn btn-outline" onclick="closeModal('bookDetailsModal')">Close</button>
      <button class="btn btn-outline" onclick="openXaiModal('${book.id}'); closeModal('bookDetailsModal');">
        <span>🔬</span> Inspect AI Match
      </button>
      <button 
        class="btn btn-primary" 
        onclick="issueBook('${book.id}')"
        ${(isAlreadyBorrowed || isOutOfStock || isQuotaFull) ? 'disabled' : ''}>
        <span>⚡</span> ${isAlreadyBorrowed ? 'Already in History' : (isQuotaFull ? 'Semester Quota Full' : (isOutOfStock ? 'Out of Stock' : 'Issue Book (14 Days)'))}
      </button>
    `;
  }

  openModal('bookDetailsModal');
};

window.openXaiModal = function(bookId) {
  const student = getCurrentStudent();
  const math = getRecommendationDetailedMath(student.id, bookId);
  const container = document.getElementById("modalXaiContent");

  if (container) {
    container.innerHTML = `
      <div class="xai-modal-body-layout">
        <div style="margin-bottom:1rem; padding-bottom:1rem; border-bottom:1px solid var(--card-border);">
          <span class="badge badge-accent">${math.book.category}</span>
          <h3 style="font-size:1.3rem; font-weight:700; margin:0.35rem 0;">${escapeHtml(math.book.title)}</h3>
          <p style="font-size:0.9rem; color:var(--text-muted);">
            Evaluated for Active Student: <strong>${escapeHtml(student.name)}</strong> (${student.rollNo} • ${student.department})
          </p>
        </div>

        <div class="xai-score-card">
          <div class="xai-big-score">${math.matchPercentage}%</div>
          <div>
            <h4 style="font-size:1.1rem; font-weight:700;">Final Composite AI Match Score</h4>
            <p style="font-size:0.85rem; color:var(--text-muted); margin:0;">
              Computed via Vector Space Model Cosine Similarity (72%) + Academic Rating Boost (12%) + Availability (3%) + Collaborative Filter (${math.collabBoost > 0 ? 'Active' : 'Off'}).
            </p>
          </div>
        </div>

        <div class="math-formula-box" style="margin:1rem 0;">
          <div style="font-family:'JetBrains Mono', monospace; font-size:0.85rem; color:var(--accent); margin-bottom:0.35rem;">
            Score = (0.72 × ${math.cosineSim.toFixed(4)}) + ${math.ratingBoost.toFixed(4)} [Rating] + ${math.availBonus.toFixed(4)} [Stock] + ${math.collabBoost.toFixed(4)} [Collab] = <strong>${math.compositeScore.toFixed(4)}</strong>
          </div>
        </div>

        <div class="rec-reason-box" style="margin-bottom:1.25rem;">
          <span class="rec-reason-icon">💡</span>
          <span><strong>Explainable AI Explanation:</strong> ${math.explanation}</span>
        </div>

        <h5 style="font-size:0.95rem; font-weight:700; margin-bottom:0.5rem;">Token Overlap & Dot-Product Multipliers</h5>
        <div class="table-responsive" style="max-height:220px; overflow-y:auto;">
          <table class="library-table table-sm">
            <thead>
              <tr>
                <th>Token</th>
                <th>Student Profile Weight</th>
                <th>Book Feature Weight</th>
                <th>Contribution</th>
              </tr>
            </thead>
            <tbody>
              ${math.matchedTokens.map(t => `
                <tr>
                  <td><code>${t.token}</code></td>
                  <td>${t.userWeight}</td>
                  <td>${t.bookWeight}</td>
                  <td class="text-accent font-semibold">+${t.contribution}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  openModal('xaiInspectModal');
};

window.openAddBookModal = function() {
  const form = document.getElementById("addBookForm");
  if (form) form.reset();
  openModal('addBookModal');
};

function populateCategorySelects() {
  const newCatSelect = document.getElementById("newBookCategory");
  if (!newCatSelect) return;
  newCatSelect.innerHTML = DEFAULT_CATEGORIES.map(c => `
    <option value="${c}">${c}</option>
  `).join("");
}

window.handleAddNewBook = function(event) {
  event.preventDefault();
  const title = document.getElementById("newBookTitle").value;
  const author = document.getElementById("newBookAuthor").value;
  const category = document.getElementById("newBookCategory").value;
  const publicationYear = document.getElementById("newBookYear").value;
  const totalCopies = document.getElementById("newBookCopies").value;
  const rating = document.getElementById("newBookRating").value;
  const tags = document.getElementById("newBookTags").value;
  const description = document.getElementById("newBookDesc").value;

  const added = addNewBookToCatalog({
    title,
    author,
    category,
    publicationYear,
    totalCopies,
    rating,
    tags,
    description
  });

  closeModal('addBookModal');
  populateAiLabBookSelect();
  renderCategoryPills();
  renderAll();
  showToast(`Book added: "${added.title}" [${added.id}]`, "success");
};

window.openReceiptModal = function() {
  const student = getCurrentStudent();
  const container = document.getElementById("receiptSlipBody");
  if (!container || !student) return;

  const history = student.history || [];
  const activeLoans = history.filter(h => h.status === "Issued");
  const today = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  container.innerHTML = `
    <div class="receipt-slip-printable">
      <div class="receipt-header">
        <div style="font-size:2rem; margin-bottom:0.25rem;">🏛️</div>
        <h2 style="font-size:1.35rem; font-weight:800; margin:0;">Apex University Central Library</h2>
        <p style="font-size:0.85rem; color:var(--text-muted); margin:0;">Official Student Allotment & Borrowing Record</p>
        <p style="font-size:0.8rem; color:var(--text-muted); margin-top:0.25rem;">Generated on: ${today}</p>
      </div>

      <div class="receipt-student-details">
        <div class="receipt-field"><span>Student Name:</span> <strong>${escapeHtml(student.name)}</strong></div>
        <div class="receipt-field"><span>Roll Number:</span> <strong>${escapeHtml(student.rollNo)}</strong></div>
        <div class="receipt-field"><span>Department:</span> <strong>${escapeHtml(student.department)} (${student.year})</strong></div>
        <div class="receipt-field"><span>Library Card ID:</span> <strong>LIB-${student.id}</strong></div>
      </div>

      <h4 style="font-size:0.95rem; font-weight:700; margin:1rem 0 0.5rem;">Active Allotments in Possession (${activeLoans.length}):</h4>
      
      <table class="receipt-table">
        <thead>
          <tr>
            <th>Tx ID</th>
            <th>Book Title</th>
            <th>Category</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          ${activeLoans.length === 0 ? `
            <tr><td colspan="4" style="text-align:center;">No books currently issued.</td></tr>
          ` : activeLoans.map(l => `
            <tr>
              <td><code>${l.allotmentId}</code></td>
              <td>${escapeHtml(l.bookTitle)}</td>
              <td>${l.category}</td>
              <td><strong>${l.dueDate}</strong></td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="receipt-footer-notes">
        <p>• Standard allotment period is 14 days. Statutory overdue fine is ₹5 per day per overdue book.</p>
        <p>• Apex University Library Rules require returning books in good condition before end-semester clearance.</p>
        <div class="receipt-barcode">|||| | |||||| |||| | |||| |||||||| ||||</div>
      </div>
    </div>
  `;

  openModal('receiptModal');
};

/* Modal Helpers */
window.openModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
};

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
};

window.closeModalOnBackdrop = function(event, modalId) {
  if (event.target && event.target.id === modalId) {
    closeModal(modalId);
  }
};

/* ==========================================================================
   10. Utilities & Fallback Generator
   ========================================================================== */
window.renderCoverFallback = function(imgElement, title, category, author) {
  const container = imgElement.parentElement;
  if (!container) return;

  container.innerHTML = `
    <div class="fallback-cover">
      <span class="fallback-category">${escapeHtml(category)}</span>
      <h5 class="fallback-title">${escapeHtml(title)}</h5>
      <span class="fallback-author">${escapeHtml(author)}</span>
    </div>
  `;
};

function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.4;
  let stars = "★".repeat(fullStars);
  if (hasHalf) stars += "★";
  const emptyStars = 5 - stars.length;
  stars += "☆".repeat(Math.max(0, emptyStars));
  return stars;
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  
  let icon = "ℹ️";
  if (type === "success") icon = "✅";
  if (type === "error") icon = "⚠️";
  if (type === "warning") icon = "🔔";

  toast.innerHTML = `<span>${icon}</span><span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

window.resetDemoData = function() {
  if (confirm("Reset all allotment records, student interests, and catalog books to initial demo defaults?")) {
    resetDatabase();
    renderAll();
    showToast("Database successfully restored to original demo state.", "success");
  }
};

function updateFooterStudentLinks() {
  const container = document.getElementById("footerStudentLinks");
  if (!container) return;
  const students = getStudents();
  container.innerHTML = students.map(s => `
    <li>
      <a href="#student-dashboard" onclick="switchActiveStudent('${s.id}')">
        ${escapeHtml(s.name)} (${escapeHtml(s.department)})
      </a>
    </li>
  `).join("");
}
