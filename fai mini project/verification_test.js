// verification_test.js - Verify AI Recommendation Engine in Node.js
const fs = require('fs');

// Mock localStorage for Node test
const storage = {};
global.localStorage = {
  getItem: (key) => storage[key] || null,
  setItem: (key, val) => { storage[key] = String(val); }
};

// Evaluate data.js
const dataCode = fs.readFileSync('./js/data.js', 'utf8');
eval(dataCode);

// Evaluate recommendation.js
const recCode = fs.readFileSync('./js/recommendation.js', 'utf8');
eval(recCode);

console.log("--> Testing initializeData...");
initializeData();

const books = getBooks();
const students = getStudents();

console.log(`Books loaded: ${books.length} books`);
console.log(`Students loaded: ${students.length} students`);

if (books.length !== 30) throw new Error("Expected 30 books, found: " + books.length);
if (students.length !== 5) throw new Error("Expected 5 students, found: " + students.length);

// Test student 1 (Rohit Sharma - borrowed Python + Data Science)
console.log("\n--> Testing recommendations for Rohit Sharma (CS)...");
const rohit = students[0];
console.log(`Student: ${rohit.name}, Interests: ${rohit.interests.join(', ')}`);
console.log(`Past Allotments (${rohit.history.length}):`);
rohit.history.forEach(h => console.log(` - [${h.category}] ${h.bookTitle} (${h.status})`));

const recsRohit = getRecommendations("STU001", { collaborative: false, limit: 6 });
console.log(`\nTop ${recsRohit.length} Content-Based Recommendations for Rohit:`);
recsRohit.forEach((rec, idx) => {
  console.log(`${idx + 1}. [${rec.book.category}] "${rec.book.title}"`);
  console.log(`   Match: ${rec.matchPercentage}% | Cosine: ${rec.cosineSimilarity.toFixed(3)}`);
  console.log(`   Reason: ${rec.reason}`);
});

// Verify duplicate prevention
const rohitHistoryIds = new Set(rohit.history.map(h => h.bookId));
recsRohit.forEach(rec => {
  if (rohitHistoryIds.has(rec.book.id)) {
    throw new Error(`Duplicate book found in recommendations: ${rec.book.title}`);
  }
});
console.log("✅ Duplicate prevention verified: No already-borrowed books present in recommendations.");

// Verify expected behavior: A student who borrowed Python + Data Science gets Machine Learning and AI books recommended
const recommendedCategories = recsRohit.map(r => r.book.category);
const hasMLorAI = recommendedCategories.includes("Machine Learning") || recommendedCategories.includes("AI");
console.log(`Contains Machine Learning / AI recommendations: ${hasMLorAI}`);
if (!hasMLorAI) {
  throw new Error("Expected ML or AI recommendations for Python + Data Science student!");
}
console.log("✅ Expected behavior verified: Python & Data Science history correctly yielded Machine Learning & AI recommendations!");

// Test Collaborative Filtering Toggle
console.log("\n--> Testing Collaborative Filtering Toggle for Priya Patel...");
const recsPriyaCollab = getRecommendations("STU002", { collaborative: true, limit: 6 });
console.log(`Priya Recommendations with Collaborative Filtering: ${recsPriyaCollab.length} books returned.`);
recsPriyaCollab.forEach((rec, idx) => {
  console.log(`${idx + 1}. [${rec.book.category}] "${rec.book.title}" (${rec.matchPercentage}%)`);
});

console.log("\n🎉 ALL AI RECOMMENDATION ENGINE TESTS PASSED SUCCESSFULLY!");
