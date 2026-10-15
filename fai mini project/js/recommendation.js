/**
 * recommendation.js - Recommendation Engine for Library Portal
 * Course: Foundations of AI (Mini Project)
 * 
 * Implements:
 * 1. Content-Based Filtering using Vector Space Model (TF-IDF / Term Frequency Cosine Similarity)
 * 2. User Profile Vectorization from explicit interests & weighted allotment history
 * 3. Duplicate Prevention (filters already borrowed/returned books)
 * 4. Academic Rating Boost
 * 5. Optional Collaborative Filtering (Peer Student Similarity)
 * 6. Explainable AI (XAI) reason generation
 */

// Domain association graph to reflect real academic relationships
// E.g., Python + Data Science strongly bridges into Machine Learning & AI
const DOMAIN_ASSOCIATIONS = {
  "Python": ["Data Science", "Machine Learning", "Web Dev"],
  "Data Science": ["Machine Learning", "AI", "Python", "DBMS"],
  "Machine Learning": ["AI", "Data Science", "Python"],
  "AI": ["Machine Learning", "Data Science", "Python"],
  "Web Dev": ["DBMS", "Networks", "Python"],
  "DBMS": ["Web Dev", "Data Science", "Networks"],
  "Networks": ["Web Dev", "DBMS"],
  "Fiction": ["AI", "Self-Help"],
  "Self-Help": ["Fiction"]
};

/**
 * Text tokenizer and stop-word remover
 * Cleans words into canonical lowercase tokens
 */
function tokenize(text) {
  if (!text) return [];
  const stopWords = new Set([
    "a", "an", "the", "and", "or", "in", "on", "at", "to", "for", "with",
    "by", "about", "your", "you", "from", "of", "is", "it", "its", "into",
    "how", "what", "first", "edition", "vol", "volume", "hands", "approach"
  ]);

  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#\s-]/g, " ")
    .split(/\s+/)
    .map(w => w.trim())
    .filter(w => w.length > 1 && !stopWords.has(w));
}

/**
 * Builds the unique vocabulary across all books and categories
 */
function buildVocabulary(books) {
  const vocab = new Set();

  const categories = (typeof DEFAULT_CATEGORIES !== 'undefined') ? DEFAULT_CATEGORIES : [
    "Python", "Data Science", "Machine Learning", "AI", "Web Dev", "DBMS", "Networks", "Fiction", "Self-Help"
  ];

  categories.forEach(cat => {
    tokenize(cat).forEach(token => vocab.add(token));
  });

  books.forEach(book => {
    tokenize(book.title).forEach(token => vocab.add(token));
    tokenize(book.category).forEach(token => vocab.add(token));
    if (Array.isArray(book.tags)) {
      book.tags.forEach(tag => {
        tokenize(tag).forEach(token => vocab.add(token));
      });
    }
  });

  return Array.from(vocab);
}

/**
 * Generates a normalized feature vector for a book
 * Gives higher weights to Category and Tags, baseline weight to Title words
 */
function createBookVector(book, vocabulary) {
  const vector = {};
  vocabulary.forEach(word => (vector[word] = 0));

  // 1. Category has high salience (weight = 3.5)
  tokenize(book.category).forEach(token => {
    if (vector[token] !== undefined) vector[token] += 3.5;
  });

  // 2. Curated tags have high importance (weight = 2.5)
  if (Array.isArray(book.tags)) {
    book.tags.forEach(tag => {
      tokenize(tag).forEach(token => {
        if (vector[token] !== undefined) vector[token] += 2.5;
      });
    });
  }

  // 3. Title terms provide specific context (weight = 1.0)
  tokenize(book.title).forEach(token => {
    if (vector[token] !== undefined) vector[token] += 1.0;
  });

  // Compute L2 Euclidean norm
  let sumSq = 0;
  for (const word in vector) {
    sumSq += vector[word] * vector[word];
  }
  const norm = Math.sqrt(sumSq) || 1;

  // Normalize to unit vector for cosine distance computation
  const normalizedVector = {};
  for (const word in vector) {
    normalizedVector[word] = vector[word] / norm;
  }

  return normalizedVector;
}

/**
 * Builds the User Profile Vector:
 * - Selected checkboxes (interests) provide baseline topic vectors
 * - Allotment history provides weighted frequency feedback:
 *   each borrowed book in a category multiplies interest in that topic & associated domains
 */
function createUserVector(student, allBooks, vocabulary) {
  const vector = {};
  vocabulary.forEach(word => (vector[word] = 0));

  // 1. Explicit user interests (weight = 3.0)
  const interests = student.interests || [];
  interests.forEach(interest => {
    tokenize(interest).forEach(token => {
      if (vector[token] !== undefined) vector[token] += 3.0;
    });

    // Semantic domain association boost (weight = 1.2)
    const associated = DOMAIN_ASSOCIATIONS[interest] || [];
    associated.forEach(assocCat => {
      tokenize(assocCat).forEach(token => {
        if (vector[token] !== undefined) vector[token] += 1.2;
      });
    });
  });

  // 2. Allotment History Analysis (Implicit feedback)
  // Compute category borrow frequencies
  const categoryFreq = {};
  const borrowedBookMap = {};

  (student.history || []).forEach(record => {
    categoryFreq[record.category] = (categoryFreq[record.category] || 0) + 1;
    borrowedBookMap[record.bookId] = record;
  });

  // Weight by frequency: more borrows in a category = much stronger affinity
  for (const category in categoryFreq) {
    const freq = categoryFreq[category];
    const weightBoost = 2.0 * freq; // e.g., 2 borrows = +4.0 weight

    tokenize(category).forEach(token => {
      if (vector[token] !== undefined) vector[token] += weightBoost;
    });

    // Associated fields also receive a frequency-based propagation
    const linked = DOMAIN_ASSOCIATIONS[category] || [];
    linked.forEach(assoc => {
      tokenize(assoc).forEach(token => {
        if (vector[token] !== undefined) vector[token] += 0.8 * freq;
      });
    });
  }

  // Also incorporate the tags of books previously borrowed
  (student.history || []).forEach(record => {
    const bookObj = allBooks.find(b => b.id === record.bookId);
    if (bookObj && Array.isArray(bookObj.tags)) {
      bookObj.tags.forEach(tag => {
        tokenize(tag).forEach(token => {
          if (vector[token] !== undefined) vector[token] += 1.0;
        });
      });
    }
  });

  // Normalize to unit vector
  let sumSq = 0;
  for (const word in vector) {
    sumSq += vector[word] * vector[word];
  }
  const norm = Math.sqrt(sumSq) || 1;

  const normalizedVector = {};
  for (const word in vector) {
    normalizedVector[word] = vector[word] / norm;
  }

  return {
    vector: normalizedVector,
    categoryFreq,
    borrowedBookMap
  };
}

/**
 * Calculates Cosine Similarity between two unit vectors:
 * cos(theta) = (A . B) / (||A|| * ||B||)
 * Since vectors are already L2 normalized, dot product equals cosine similarity.
 */
function calculateCosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  for (const word in vecA) {
    if (vecB[word] !== undefined) {
      dotProduct += vecA[word] * vecB[word];
    }
  }
  return Math.max(0, Math.min(1, dotProduct));
}

/**
 * Collaborative Filtering Module:
 * Finds peer students who have similar borrowing histories or shared interests.
 * Boosts books borrowed by peers that the target student hasn't read yet.
 */
function calculateCollaborativeBoost(targetStudent, candidateBook, allStudents) {
  let totalBoost = 0;
  let peerCount = 0;

  const targetBorrowedIds = new Set((targetStudent.history || []).map(h => h.bookId));
  const targetInterests = new Set(targetStudent.interests || []);

  allStudents.forEach(otherStudent => {
    if (otherStudent.id === targetStudent.id) return;

    // Check if other student borrowed this candidate book
    const otherBorrowedIds = new Set((otherStudent.history || []).map(h => h.bookId));
    if (!otherBorrowedIds.has(candidateBook.id)) return;

    // Calculate Jaccard similarity between target and other student
    // Based on overlap of borrowed books and overlap of interests
    let bookIntersection = 0;
    targetBorrowedIds.forEach(id => {
      if (otherBorrowedIds.has(id)) bookIntersection++;
    });

    let interestIntersection = 0;
    targetInterests.forEach(interest => {
      if ((otherStudent.interests || []).includes(interest)) interestIntersection++;
    });

    const unionSize = targetBorrowedIds.size + otherBorrowedIds.size - bookIntersection + 1;
    const similarityScore = (bookIntersection * 2.0 + interestIntersection * 1.0) / unionSize;

    if (similarityScore > 0) {
      totalBoost += similarityScore;
      peerCount++;
    }
  });

  return peerCount > 0 ? Math.min(0.20, (totalBoost / peerCount) * 0.25) : 0;
}

/**
 * Synthesizes an explainable reason for the recommendation
 */
function generateExplanation(book, student, userProfile, cosineSim, collabBoost) {
  const history = student.history || [];
  const interests = student.interests || [];

  // Check if user previously borrowed a book in the exact same or related category
  const sameCategoryBorrow = history.find(h => h.category === book.category);
  const relatedCategory = Object.keys(DOMAIN_ASSOCIATIONS).find(cat => {
    return DOMAIN_ASSOCIATIONS[cat]?.includes(book.category) && history.some(h => h.category === cat);
  });

  if (sameCategoryBorrow) {
    return `Recommended because you borrowed "${sameCategoryBorrow.bookTitle.split(':')[0]}" in ${book.category}.`;
  }

  if (relatedCategory) {
    const pastBook = history.find(h => h.category === relatedCategory);
    const titleSnippet = pastBook ? `"${pastBook.bookTitle.split(':')[0]}"` : relatedCategory;
    return `Recommended based on your ${relatedCategory} history (${titleSnippet}) leading to ${book.category}.`;
  }

  if (interests.includes(book.category)) {
    return `Directly matches your selected interest in ${book.category} (${book.rating}★ rating).`;
  }

  if (collabBoost > 0.05) {
    return `Popular among students with similar reading patterns in ${student.department}.`;
  }

  return `High match (${(cosineSim * 100).toFixed(0)}%) with your technical keywords and reading profile.`;
}

/**
 * Main AI Recommendation Function
 * 
 * Returns top N recommended books with match scores, reasons, and breakdown.
 */
function getRecommendations(studentId, options = {}) {
  const books = getBooks();
  const students = getStudents();
  const student = students.find(s => s.id === studentId) || students[0];
  const useCollabFilter = options.collaborative !== undefined ? options.collaborative : getCollabFilterEnabled();
  const limit = options.limit || 6;

  // 1. DUPLICATE PREVENTION:
  // Identify all books already borrowed or returned by this student
  const borrowedBookIds = new Set((student.history || []).map(item => item.bookId));

  // 2. Build feature vocabulary and vector representations
  const vocabulary = buildVocabulary(books);
  const userProfile = createUserVector(student, books, vocabulary);

  // 3. Score all unborrowed candidate books
  const candidateScores = [];

  books.forEach(book => {
    // Exclude books already in student's history
    if (borrowedBookIds.has(book.id)) {
      return;
    }

    const bookVector = createBookVector(book, vocabulary);
    const cosineSim = calculateCosineSimilarity(userProfile.vector, bookVector);

    // Rating boost (weights books rated 4.5 - 5.0 with up to 0.12 bonus)
    const ratingNorm = (book.rating - 3.5) / 1.5; // normalized 0 to 1
    const ratingBoost = Math.max(0, ratingNorm) * 0.12;

    // Availability slight weight (give slight priority to available books)
    const availBonus = book.availableCopies > 0 ? 0.03 : 0.0;

    // Optional collaborative filtering boost
    let collabBoost = 0;
    if (useCollabFilter) {
      collabBoost = calculateCollaborativeBoost(student, book, students);
    }

    // Composite Score:
    // Base Cosine Similarity: 75%
    // Rating boost: 12%
    // Collaborative filtering boost: up to 15%
    // Availability bonus: 3%
    const compositeScore = (cosineSim * 0.72) + ratingBoost + availBonus + collabBoost;

    // Map to realistic match percentage (65% to 98% for meaningful UI)
    const matchPercentage = Math.min(99, Math.round(55 + compositeScore * 42));

    const reason = generateExplanation(book, student, userProfile, cosineSim, collabBoost);

    candidateScores.push({
      book,
      cosineSimilarity: cosineSim,
      ratingBoost,
      collabBoost,
      compositeScore,
      matchPercentage,
      reason
    });
  });

  // 4. Sort descending by composite score
  candidateScores.sort((a, b) => b.compositeScore - a.compositeScore);

  // 5. Return top N recommendations
  return candidateScores.slice(0, limit);
}

/**
 * Detailed Mathematical Analysis for Explainable AI (XAI)
 * Returns the exact vector dot products, term weights, and scoring terms for any book and student
 */
function getRecommendationDetailedMath(studentId, bookId) {
  const books = getBooks();
  const students = getStudents();
  const student = students.find(s => s.id === studentId) || students[0];
  const book = books.find(b => b.id === bookId) || books[0];
  const useCollabFilter = getCollabFilterEnabled();

  const vocabulary = buildVocabulary(books);
  const userProfile = createUserVector(student, books, vocabulary);
  const bookVector = createBookVector(book, vocabulary);

  // Calculate term-by-term dot product contributions
  const matchedTokens = [];
  let dotProduct = 0;

  for (const token of vocabulary) {
    const userVal = userProfile.vector[token] || 0;
    const bookVal = bookVector[token] || 0;
    if (userVal > 0 && bookVal > 0) {
      const contribution = userVal * bookVal;
      dotProduct += contribution;
      matchedTokens.push({
        token,
        userWeight: userVal.toFixed(4),
        bookWeight: bookVal.toFixed(4),
        contribution: contribution.toFixed(4)
      });
    }
  }

  matchedTokens.sort((a, b) => parseFloat(b.contribution) - parseFloat(a.contribution));

  const cosineSim = Math.max(0, Math.min(1, dotProduct));
  const ratingNorm = (book.rating - 3.5) / 1.5;
  const ratingBoost = Math.max(0, ratingNorm) * 0.12;
  const availBonus = book.availableCopies > 0 ? 0.03 : 0.0;
  const collabBoost = useCollabFilter ? calculateCollaborativeBoost(student, book, students) : 0;
  const compositeScore = (cosineSim * 0.72) + ratingBoost + availBonus + collabBoost;
  const matchPercentage = Math.min(99, Math.round(55 + compositeScore * 42));
  const explanation = generateExplanation(book, student, userProfile, cosineSim, collabBoost);

  // Check curriculum domain transition
  const domainPath = [];
  const historyCategories = (student.history || []).map(h => h.category);
  for (const histCat of historyCategories) {
    if (DOMAIN_ASSOCIATIONS[histCat]?.includes(book.category)) {
      domainPath.push(`${histCat} → ${book.category}`);
    }
  }

  return {
    student,
    book,
    cosineSim,
    ratingBoost,
    availBonus,
    collabBoost,
    compositeScore,
    matchPercentage,
    matchedTokens,
    explanation,
    domainPath: Array.from(new Set(domainPath)),
    userProfile,
    bookVector
  };
}

if (typeof window !== "undefined") {
  window.getRecommendations = getRecommendations;
  window.getRecommendationDetailedMath = getRecommendationDetailedMath;
}

