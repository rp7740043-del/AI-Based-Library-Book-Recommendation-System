# AI-Based Library Book Recommendation System with Book Allotment History Analysis
**Course:** Foundations of Artificial Intelligence (Mini Project)  
**Architecture:** Plain HTML5, Vanilla CSS3 (Custom Design System with Dark/Light Themes), JavaScript (ES6+), localStorage, Chart.js  

---

## 🌟 Overview
This project is an enterprise-grade academic portal designed for a university library. It addresses a real-world problem in university resource discovery: students often struggle to identify relevant textbooks, reference guides, and research materials that build upon their branch curriculum, active project interests, and previous borrowings.

The system combines:
1. **Content-Based Filtering** using the Vector Space Model (VSM) and Cosine Similarity.
2. **Allotment History Frequency Analysis** to implicitly weight past readings.
3. **Curriculum Domain Graph** to propagate interests from foundational topics (e.g., Python & Data Science) to advanced domains (e.g., Machine Learning & Deep Learning).
4. **Academic Rating Weighting** to prioritize highly regarded literature.
5. **Collaborative Filtering Toggle** to surface popular texts among peer students with similar borrowing habits using Jaccard profile overlap.
6. **Semester Quota Tracking & Allotment Management** with real-time stock decrement, instant 14-day loan issuance, overdue tracking, 14-day renewal, and one-click returns.
7. **Dual Chart.js Visual Analytics** (Category Frequency Bar Chart & Allotment Status Ratio Doughnut Chart).
8. **Interactive AI Engine Lab & Simulator** for step-by-step viva mathematical demonstration.
9. **Explainable AI (XAI) Inspector Modal** providing exact mathematical vector dot-product breakdowns.
10. **Printable Institutional Allotment Slip** for physical or PDF library receipts.

---

## 🚀 How to Run
No backend server, Node.js, or complex installation is required.

1. **Option 1 (Direct):**  
   Simply double-click [`index.html`](file:///c:/Users/rp774/Downloads/fai%20mini%20project/index.html) to open it in Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari.

2. **Option 2 (Local Development Server):**  
   If you have Python installed, run:
   ```bash
   python -m http.server 8000
   ```
   and navigate to `http://localhost:8000`.

---

## 📂 Project Structure & Section Hierarchy
```
fai mini project/
├── index.html              # Clean Single Page Architecture with logical section flow
├── README.md               # Complete system & AI algorithm documentation
├── verification_test.js    # Automated Node.js regression test suite
├── css/
│   └── style.css           # Modern design tokens, Dark/Light modes, glassmorphism, responsive grid
└── js/
    ├── data.js             # 30 curated books, 5 students, allotment records, wishlist & localStorage helpers
    ├── recommendation.js   # Content-based cosine similarity, TF-IDF vectors, XAI explanations & detailed math
    └── app.js              # Centralized reactive controller, dual charts, modals, simulator & workflows
```

### Logical Layout Flow (Proper Functions on the Right Place)
1. **Top Notice Bar:** Real-time digital clock, campus timings, "Add Book" modal trigger, "Reset Demo Defaults", and Dark/Light mode toggle.
2. **Sticky Navigation Bar:** Brand logo, smooth navigation anchors, and **In-Navbar Active Student Dropdown Switcher** for instant profile switching anywhere on the page.
3. **Hero Section (`#home`):** High-impact project headline, Foundations of AI badges, quick action CTAs, and live KPI stats strip.
4. **Student Workspace & Dashboard (`#student-dashboard`):** 
   - Positioned directly after Hero.
   - Quick student switcher cards with active badges.
   - Active student profile console with photo avatar, roll number, and department.
   - **Semester Quota Allowance Gauge:** Visual progress bar tracking active loans against the statutory 6-book limit.
   - **Curriculum Domain Interest Matrix:** Multi-select checkboxes with instant AI recalculation and quick branch reset actions.
5. **AI Personalized Recommendations (`#recommendations`):**
   - Positioned directly after the Student Workspace.
   - Top 6 recommendations tailored for the active student.
   - Collaborative Peer Boost toggle and sorting options (Match Score, Rating, Available Copies, Year).
   - Radial AI Match percentage badge, Open Library covers with CSS fallbacks, and natural language XAI reasons.
   - Action buttons: Instant Issue Book (14 days), Quick Details, Bookmark/Wishlist, and **"Inspect AI Math"** link.
6. **Complete Library Catalog (`#browse`):**
   - Live multi-field search (title, author, category, ISBN, tags).
   - Category filter pills with dynamic book counts.
   - Secondary toolbar: Sort dropdown, "In Stock Only" checkbox, and Grid vs List view mode toggle.
   - "Quick Details" button opening full book synopsis modal.
7. **My Allotment History & Visual Analytics (`#history`):**
   - 4 Metric Stat Cards (Total Allotted, Active Loans, Returned on Time, Overdue).
   - **Dual Chart.js Visualizations:** Category Bar Chart and Allotment Status Doughnut Chart.
   - Filterable Allotment Transaction Ledger (All, Active, Returned, Overdue tabs).
   - Days remaining countdown indicator ("🟢 11 days left", "🟡 Due Today", "🔴 Overdue by 2d").
   - Actions: 14-day Renewal (`renewBook`) and Return Book (`returnBook`).
   - "🖨️ Print Slip" button generating an official institutional library receipt.
8. **AI Engine Lab & Mathematical Simulator (`#ai-lab`):**
   - Dedicated laboratory for viva examination demonstrations.
   - Test any book against the student's vector in real-time.
   - Full mathematical proof breakdown: Cosine Similarity, Dot-Product term table, and Curriculum Domain Graph traversal.
9. **Coursework Specifications & About (`#about`):**
   - Foundations of AI algorithm specifications, LaTeX mathematical definitions, and viva exam guide.

---

## 🧠 AI Recommendation Engine Specification
Implemented in [`js/recommendation.js`](file:///c:/Users/rp774/Downloads/fai%20mini%20project/js/recommendation.js):

### 1. Vector Space Model & Term Weighting
- **Vocabulary Extraction:** Tokenizes words across book titles, categories, and curated tags while filtering common English stop words.
- **Book Vector ($\mathbf{d}$):**
  - Category terms: weight = $3.5$
  - Tags: weight = $2.5$
  - Title terms: weight = $1.0$
  - Normalization: L2 Euclidean norm $\hat{\mathbf{d}} = \frac{\mathbf{d}}{\|\mathbf{d}\|_2}$.

### 2. User Profile Vector ($\mathbf{u}$)
- **Explicit Interests:** Active checkboxes in student workspace assign weights ($3.0$) to matching categories.
- **Implicit Allotment Frequency:** Each book borrowed in past allotments increases subject weight:
  $$\text{weightBoost} = 2.0 \times \text{frequency}$$
- **Curriculum Domain Graph Traversal:** Foundational topics bridge into advanced domains (e.g., Python & Data Science $\to$ Machine Learning & AI).
- Normalization: $\hat{\mathbf{u}} = \frac{\mathbf{u}}{\|\mathbf{u}\|_2}$.

### 3. Cosine Similarity Calculation
$$\cos(\theta) = \hat{\mathbf{u}} \cdot \hat{\mathbf{d}} = \sum_{k=1}^V \hat{u}_k \hat{d}_k$$

### 4. Strict Duplicate Prevention
Any book currently issued or previously returned in the student's allotment history is strictly excluded from recommendation candidates.

### 5. Composite Final Score
$$\text{Composite Score} = (0.72 \times \cos\theta) + \text{RatingBoost} + \text{AvailabilityBonus} + \text{CollabBoost}$$
- **Rating Boost:** Up to $+0.12$ bonus for books rated between $4.5$ and $5.0$.
- **Availability Bonus:** $+0.03$ bonus for in-stock books.
- **Collab Boost:** Jaccard profile overlap between classmate borrowings.

---

## 🧪 Verification & Testing
Run the automated test suite in terminal:
```bash
node verification_test.js
```
All tests verify:
- Initial 30 books & 5 students loaded.
- Duplicate prevention (no past books in recommendations).
- Content-based topic propagation (Python & Data Science history yields Machine Learning & AI recommendations).
- Collaborative filtering peer boost toggle.
