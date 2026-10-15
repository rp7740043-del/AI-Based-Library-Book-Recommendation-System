/**
 * data.js - Sample dataset for AI-Based Library Book Recommendation System
 * Foundations of AI Mini Project
 * 
 * Contains:
 * 1. 30 Curated Books across 9 Categories with real ISBNs, tags, ratings, and availability
 * 2. 5 Sample Students with realistic allotment histories and default interests
 * 3. Predefined interest categories
 */

const DEFAULT_CATEGORIES = [
  "Python",
  "Data Science",
  "Machine Learning",
  "AI",
  "Web Dev",
  "DBMS",
  "Networks",
  "Fiction",
  "Self-Help"
];

if (typeof window !== "undefined") {
  window.DEFAULT_CATEGORIES = DEFAULT_CATEGORIES;
}
if (typeof global !== "undefined") {
  global.DEFAULT_CATEGORIES = DEFAULT_CATEGORIES;
}

// 30 Books across academic & general categories
const INITIAL_BOOKS = [
  // --- PYTHON ---
  {
    id: "B001",
    title: "Python Crash Course: A Hands-On, Project-Based Introduction",
    author: "Eric Matthes",
    isbn: "9781593279288",
    category: "Python",
    tags: ["python", "programming", "coding", "beginners", "automation", "projects"],
    rating: 4.8,
    totalCopies: 5,
    availableCopies: 3,
    publicationYear: 2019,
    description: "A fast-paced, thorough introduction to Python that will have you writing programs, solving problems, and making things work in no time."
  },
  {
    id: "B002",
    title: "Automate the Boring Stuff with Python",
    author: "Al Sweigart",
    isbn: "9781593279929",
    category: "Python",
    tags: ["python", "automation", "scripting", "productivity", "web scraping"],
    rating: 4.7,
    totalCopies: 4,
    availableCopies: 2,
    publicationYear: 2019,
    description: "Learn how to use Python to write programs that do in minutes what would take you hours to do by hand."
  },
  {
    id: "B003",
    title: "Fluent Python: Clear, Concise, and Effective Programming",
    author: "Luciano Ramalho",
    isbn: "9781491957660",
    category: "Python",
    tags: ["python", "advanced", "oop", "metaprogramming", "concurrency"],
    rating: 4.9,
    totalCopies: 3,
    availableCopies: 1,
    publicationYear: 2021,
    description: "Python's simplicity lets you become productive quickly, but it often means you aren't using everything it has to offer."
  },

  // --- DATA SCIENCE ---
  {
    id: "B004",
    title: "Python for Data Analysis: Data Wrangling with Pandas, NumPy, and Jupyter",
    author: "Wes McKinney",
    isbn: "9781491957660",
    category: "Data Science",
    tags: ["data science", "python", "pandas", "numpy", "data analysis", "jupyter"],
    rating: 4.7,
    totalCopies: 6,
    availableCopies: 4,
    publicationYear: 2022,
    description: "Get complete instructions for manipulating, processing, cleaning, and crunching datasets in Python."
  },
  {
    id: "B005",
    title: "Practical Statistics for Data Scientists",
    author: "Peter Bruce & Andrew Bruce",
    isbn: "9781492072942",
    category: "Data Science",
    tags: ["data science", "statistics", "probability", "eda", "modeling", "hypothesis testing"],
    rating: 4.6,
    totalCopies: 4,
    availableCopies: 2,
    publicationYear: 2020,
    description: "Statistical methods are a key part of data science, yet very few data scientists have formal statistical training."
  },
  {
    id: "B006",
    title: "Data Science from Scratch: First Principles with Python",
    author: "Joel Grus",
    isbn: "9781492041139",
    category: "Data Science",
    tags: ["data science", "python", "algorithms", "linear algebra", "statistics"],
    rating: 4.5,
    totalCopies: 5,
    availableCopies: 3,
    publicationYear: 2019,
    description: "To really learn data science, you should not only master the libraries, but understand the algorithms from scratch."
  },
  {
    id: "B007",
    title: "Storytelling with Data: A Data Visualization Guide",
    author: "Cole Nussbaumer Knaflic",
    isbn: "9781119002253",
    category: "Data Science",
    tags: ["data science", "visualization", "communication", "charts", "presentation"],
    rating: 4.8,
    totalCopies: 4,
    availableCopies: 2,
    publicationYear: 2015,
    description: "Don't simply show your data; tell a story with it. Learn the fundamentals of effective data communication."
  },

  // --- MACHINE LEARNING ---
  {
    id: "B008",
    title: "Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow",
    author: "Aurélien Géron",
    isbn: "9781492032649",
    category: "Machine Learning",
    tags: ["machine learning", "deep learning", "python", "scikit-learn", "tensorflow", "neural networks"],
    rating: 4.9,
    totalCopies: 6,
    availableCopies: 3,
    publicationYear: 2019,
    description: "Through a series of recent breakthroughs, deep learning has boosted the entire field of machine learning."
  },
  {
    id: "B009",
    title: "Pattern Recognition and Machine Learning",
    author: "Christopher M. Bishop",
    isbn: "9780387310732",
    category: "Machine Learning",
    tags: ["machine learning", "pattern recognition", "bayesian", "mathematics", "theory"],
    rating: 4.7,
    totalCopies: 3,
    availableCopies: 1,
    publicationYear: 2006,
    description: "The first textbook on pattern recognition to present the Bayesian viewpoint, widely used in graduate courses."
  },
  {
    id: "B010",
    title: "Introduction to Machine Learning with Python",
    author: "Andreas C. Müller & Sarah Guido",
    isbn: "9781449369415",
    category: "Machine Learning",
    tags: ["machine learning", "python", "scikit-learn", "supervised learning", "classification"],
    rating: 4.6,
    totalCopies: 5,
    availableCopies: 3,
    publicationYear: 2016,
    description: "Many Python developers are fascinated by machine learning. This book teaches you how to build your own solutions."
  },

  // --- ARTIFICIAL INTELLIGENCE ---
  {
    id: "B011",
    title: "Artificial Intelligence: A Modern Approach (4th Edition)",
    author: "Stuart Russell & Peter Norvig",
    isbn: "9780136042594",
    category: "AI",
    tags: ["ai", "search algorithms", "knowledge representation", "planning", "agents", "foundations"],
    rating: 4.9,
    totalCopies: 8,
    availableCopies: 4,
    publicationYear: 2020,
    description: "The leading textbook in Artificial Intelligence, used in over 1,400 universities worldwide."
  },
  {
    id: "B012",
    title: "Deep Learning (Adaptive Computation and Machine Learning)",
    author: "Ian Goodfellow, Yoshua Bengio & Aaron Courville",
    isbn: "9780262035613",
    category: "AI",
    tags: ["ai", "deep learning", "neural networks", "linear algebra", "optimization"],
    rating: 4.8,
    totalCopies: 4,
    availableCopies: 2,
    publicationYear: 2016,
    description: "Written by three pioneers in the field, Deep Learning is the definitive academic text on neural architectures."
  },
  {
    id: "B013",
    title: "Life 3.0: Being Human in the Age of Artificial Intelligence",
    author: "Max Tegmark",
    isbn: "9781101946596",
    category: "AI",
    tags: ["ai", "ethics", "future of ai", "agi", "philosophy", "society"],
    rating: 4.6,
    totalCopies: 3,
    availableCopies: 2,
    publicationYear: 2017,
    description: "Explores how artificial intelligence will affect crime, war, justice, jobs, society, and our sense of being human."
  },
  {
    id: "B014",
    title: "Reinforcement Learning: An Introduction",
    author: "Richard S. Sutton & Andrew G. Barto",
    isbn: "9780262039246",
    category: "AI",
    tags: ["ai", "reinforcement learning", "markov decision", "q-learning", "policy gradient"],
    rating: 4.8,
    totalCopies: 3,
    availableCopies: 1,
    publicationYear: 2018,
    description: "The complete, accessible introduction to the core ideas and algorithms of reinforcement learning."
  },

  // --- WEB DEVELOPMENT ---
  {
    id: "B015",
    title: "Eloquent JavaScript: A Modern Introduction to Programming",
    author: "Marijn Haverbeke",
    isbn: "9781593279509",
    category: "Web Dev",
    tags: ["web dev", "javascript", "frontend", "dom", "async", "nodejs"],
    rating: 4.7,
    totalCopies: 5,
    availableCopies: 3,
    publicationYear: 2018,
    description: "A deep dive into JavaScript that immerses you in clean, beautiful and effective web coding practices."
  },
  {
    id: "B016",
    title: "You Don't Know JS: Scope & Closures",
    author: "Kyle Simpson",
    isbn: "9781491904244",
    category: "Web Dev",
    tags: ["web dev", "javascript", "closures", "scope", "es6", "internals"],
    rating: 4.8,
    totalCopies: 4,
    availableCopies: 2,
    publicationYear: 2014,
    description: "An in-depth look into the core mechanisms of JavaScript, focusing on how lexical scoping and closures work."
  },
  {
    id: "B017",
    title: "Learning React: Modern Patterns for Developing React Apps",
    author: "Alex Banks & Eve Porcello",
    isbn: "9781492051725",
    category: "Web Dev",
    tags: ["web dev", "react", "frontend", "components", "hooks", "javascript"],
    rating: 4.6,
    totalCopies: 4,
    availableCopies: 2,
    publicationYear: 2020,
    description: "If you want to learn how to build efficient React applications, this book will show you the modern patterns."
  },
  {
    id: "B018",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    isbn: "9781449373320",
    category: "Web Dev",
    tags: ["web dev", "distributed systems", "backend", "scalability", "architecture", "caching"],
    rating: 4.9,
    totalCopies: 6,
    availableCopies: 2,
    publicationYear: 2017,
    description: "The definitive guide to architecture, reliable data systems, replication, partitioning, and consistency."
  },

  // --- DBMS ---
  {
    id: "B019",
    title: "Database System Concepts (7th Edition)",
    author: "Abraham Silberschatz, Henry F. Korth & S. Sudarshan",
    isbn: "9780073523323",
    category: "DBMS",
    tags: ["dbms", "sql", "relational database", "transactions", "indexing", "acid"],
    rating: 4.7,
    totalCopies: 7,
    availableCopies: 3,
    publicationYear: 2019,
    description: "The renowned textbook covering fundamental concepts of database management, SQL, and query processing."
  },
  {
    id: "B020",
    title: "Fundamentals of Database Systems",
    author: "Ramez Elmasri & Shamkant B. Navathe",
    isbn: "9780136086208",
    category: "DBMS",
    tags: ["dbms", "normalization", "er modeling", "query optimization", "nosql"],
    rating: 4.5,
    totalCopies: 5,
    availableCopies: 2,
    publicationYear: 2015,
    description: "A comprehensive foundation for designing, using, and implementing database systems and database applications."
  },
  {
    id: "B021",
    title: "High Performance MySQL: Optimization, Backups, and Replication",
    author: "Silvia Botros & Jeremy Tinley",
    isbn: "9781492080510",
    category: "DBMS",
    tags: ["dbms", "mysql", "performance", "indexing", "replication", "query optimization"],
    rating: 4.6,
    totalCopies: 3,
    availableCopies: 2,
    publicationYear: 2021,
    description: "How can you bring out MySQL's full power? Learn high-level architectural techniques for tuning databases."
  },

  // --- NETWORKS ---
  {
    id: "B022",
    title: "Computer Networking: A Top-Down Approach (8th Edition)",
    author: "James Kurose & Keith Ross",
    isbn: "9780133594140",
    category: "Networks",
    tags: ["networks", "tcp/ip", "protocols", "routing", "transport layer", "dns", "http"],
    rating: 4.8,
    totalCopies: 6,
    availableCopies: 3,
    publicationYear: 2020,
    description: "Motivates students with its top-down approach focusing on the application layer first before deep routing protocols."
  },
  {
    id: "B023",
    title: "Computer Networks (5th Edition)",
    author: "Andrew S. Tanenbaum & David J. Wetherall",
    isbn: "9780132126953",
    category: "Networks",
    tags: ["networks", "osi model", "ethernet", "wireless", "routing algorithms", "network security"],
    rating: 4.6,
    totalCopies: 4,
    availableCopies: 2,
    publicationYear: 2010,
    description: "The classic networking bible explaining how hardware and software work together to transmit digital bits across the globe."
  },
  {
    id: "B024",
    title: "TCP/IP Illustrated, Volume 1: The Protocols",
    author: "W. Richard Stevens & Kevin R. Fall",
    isbn: "9780321336316",
    category: "Networks",
    tags: ["networks", "tcp/ip", "packet analysis", "wireshark", "sockets", "congestion control"],
    rating: 4.8,
    totalCopies: 3,
    availableCopies: 1,
    publicationYear: 2011,
    description: "Provides a thorough, detailed analysis of the core internet protocol suite with live packet captures."
  },

  // --- FICTION ---
  {
    id: "B025",
    title: "The Phoenix Project: A Novel about IT, DevOps, and Helping Your Business Win",
    author: "Gene Kim, Kevin Behr & George Spafford",
    isbn: "9780988262591",
    category: "Fiction",
    tags: ["fiction", "devops", "tech culture", "agile", "sysadmin", "story"],
    rating: 4.7,
    totalCopies: 4,
    availableCopies: 2,
    publicationYear: 2013,
    description: "A captivating novel that demonstrates DevOps principles and IT transformation in a high-stakes corporate environment."
  },
  {
    id: "B026",
    title: "Neuromancer (Sprawl Trilogy)",
    author: "William Gibson",
    isbn: "9780441569595",
    category: "Fiction",
    tags: ["fiction", "cyberpunk", "ai", "virtual reality", "sci-fi", "classic"],
    rating: 4.6,
    totalCopies: 3,
    availableCopies: 1,
    publicationYear: 1984,
    description: "The groundbreaking cyberpunk novel that coined the term 'cyberspace' and envisioned artificial intelligences."
  },
  {
    id: "B027",
    title: "1984",
    author: "George Orwell",
    isbn: "9780451524935",
    category: "Fiction",
    tags: ["fiction", "dystopia", "surveillance", "society", "classic", "politics"],
    rating: 4.7,
    totalCopies: 6,
    availableCopies: 4,
    publicationYear: 1949,
    description: "The timeless cautionary tale of totalitarianism, state surveillance, and psychological control."
  },

  // --- SELF-HELP ---
  {
    id: "B028",
    title: "Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones",
    author: "James Clear",
    isbn: "9780735211292",
    category: "Self-Help",
    tags: ["self-help", "productivity", "habits", "psychology", "personal development"],
    rating: 4.9,
    totalCopies: 8,
    availableCopies: 5,
    publicationYear: 2018,
    description: "A supremely practical guide on how small changes can lead to remarkable, transformative results in life and study."
  },
  {
    id: "B029",
    title: "Deep Work: Rules for Focused Success in a Distracted World",
    author: "Cal Newport",
    isbn: "9781455586691",
    category: "Self-Help",
    tags: ["self-help", "productivity", "focus", "study skills", "cognition", "time management"],
    rating: 4.8,
    totalCopies: 5,
    availableCopies: 2,
    publicationYear: 2016,
    description: "One of the most valuable skills in our economy is becoming increasingly rare. If you master this skill, you'll achieve great results."
  },
  {
    id: "B030",
    title: "The Pragmatic Programmer: Your Journey To Mastery (20th Anniv. Edition)",
    author: "David Thomas & Andrew Hunt",
    isbn: "9780135957059",
    category: "Self-Help",
    tags: ["self-help", "software engineering", "career", "craftsmanship", "best practices", "coding"],
    rating: 4.9,
    totalCopies: 5,
    availableCopies: 3,
    publicationYear: 2019,
    description: "Filled with practical advice on software development, career growth, code organization, and professional responsibility."
  }
];

// 5 Sample Students with past allotment records (3-6 each)
const INITIAL_STUDENTS = [
  {
    id: "STU001",
    name: "Rohit Sharma",
    rollNo: "CS21B042",
    department: "Computer Science & Engineering",
    year: "3rd Year",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80",
    interests: ["Python", "Data Science", "Machine Learning"],
    history: [
      {
        allotmentId: "ALT-101",
        bookId: "B001",
        bookTitle: "Python Crash Course: A Hands-On, Project-Based Introduction",
        category: "Python",
        issueDate: "2026-08-10",
        dueDate: "2026-08-24",
        returnDate: "2026-08-22",
        status: "Returned"
      },
      {
        allotmentId: "ALT-102",
        bookId: "B004",
        bookTitle: "Python for Data Analysis: Data Wrangling with Pandas, NumPy, and Jupyter",
        category: "Data Science",
        issueDate: "2026-08-26",
        dueDate: "2026-09-09",
        returnDate: "2026-09-07",
        status: "Returned"
      },
      {
        allotmentId: "ALT-103",
        bookId: "B005",
        bookTitle: "Practical Statistics for Data Scientists",
        category: "Data Science",
        issueDate: "2026-09-12",
        dueDate: "2026-09-26",
        returnDate: "2026-09-25",
        status: "Returned"
      },
      {
        allotmentId: "ALT-104",
        bookId: "B002",
        bookTitle: "Automate the Boring Stuff with Python",
        category: "Python",
        issueDate: "2026-09-28",
        dueDate: "2026-10-12",
        returnDate: null,
        status: "Overdue"
      },
      {
        allotmentId: "ALT-105",
        bookId: "B028",
        bookTitle: "Atomic Habits: An Easy & Proven Way to Build Good Habits",
        category: "Self-Help",
        issueDate: "2026-10-01",
        dueDate: "2026-10-15",
        returnDate: null,
        status: "Issued"
      }
    ]
  },
  {
    id: "STU002",
    name: "Priya Patel",
    rollNo: "AI22B019",
    department: "Artificial Intelligence & Data Science",
    year: "3rd Year",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    interests: ["Machine Learning", "AI", "Python"],
    history: [
      {
        allotmentId: "ALT-201",
        bookId: "B008",
        bookTitle: "Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow",
        category: "Machine Learning",
        issueDate: "2026-07-15",
        dueDate: "2026-07-29",
        returnDate: "2026-07-28",
        status: "Returned"
      },
      {
        allotmentId: "ALT-202",
        bookId: "B011",
        bookTitle: "Artificial Intelligence: A Modern Approach (4th Edition)",
        category: "AI",
        issueDate: "2026-08-01",
        dueDate: "2026-08-15",
        returnDate: "2026-08-14",
        status: "Returned"
      },
      {
        allotmentId: "ALT-203",
        bookId: "B003",
        bookTitle: "Fluent Python: Clear, Concise, and Effective Programming",
        category: "Python",
        issueDate: "2026-08-20",
        dueDate: "2026-09-03",
        returnDate: "2026-09-02",
        status: "Returned"
      },
      {
        allotmentId: "ALT-204",
        bookId: "B012",
        bookTitle: "Deep Learning (Adaptive Computation and Machine Learning)",
        category: "AI",
        issueDate: "2026-09-22",
        dueDate: "2026-10-06",
        returnDate: null,
        status: "Overdue"
      }
    ]
  },
  {
    id: "STU003",
    name: "Amit Verma",
    rollNo: "IT20B088",
    department: "Information Technology",
    year: "4th Year",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    interests: ["Web Dev", "DBMS", "Networks"],
    history: [
      {
        allotmentId: "ALT-301",
        bookId: "B015",
        bookTitle: "Eloquent JavaScript: A Modern Introduction to Programming",
        category: "Web Dev",
        issueDate: "2026-07-02",
        dueDate: "2026-07-16",
        returnDate: "2026-07-15",
        status: "Returned"
      },
      {
        allotmentId: "ALT-302",
        bookId: "B019",
        bookTitle: "Database System Concepts (7th Edition)",
        category: "DBMS",
        issueDate: "2026-07-25",
        dueDate: "2026-08-08",
        returnDate: "2026-08-07",
        status: "Returned"
      },
      {
        allotmentId: "ALT-303",
        bookId: "B022",
        bookTitle: "Computer Networking: A Top-Down Approach",
        category: "Networks",
        issueDate: "2026-08-18",
        dueDate: "2026-09-01",
        returnDate: "2026-08-30",
        status: "Returned"
      },
      {
        allotmentId: "ALT-304",
        bookId: "B017",
        bookTitle: "Learning React: Modern Patterns for Developing React Apps",
        category: "Web Dev",
        issueDate: "2026-09-05",
        dueDate: "2026-09-19",
        returnDate: "2026-09-18",
        status: "Returned"
      },
      {
        allotmentId: "ALT-305",
        bookId: "B018",
        bookTitle: "Designing Data-Intensive Applications",
        category: "Web Dev",
        issueDate: "2026-10-02",
        dueDate: "2026-10-16",
        returnDate: null,
        status: "Issued"
      },
      {
        allotmentId: "ALT-306",
        bookId: "B030",
        bookTitle: "The Pragmatic Programmer: Your Journey To Mastery",
        category: "Self-Help",
        issueDate: "2026-09-29",
        dueDate: "2026-10-13",
        returnDate: null,
        status: "Overdue"
      }
    ]
  },
  {
    id: "STU004",
    name: "Neha Gupta",
    rollNo: "EC23B011",
    department: "Electronics & Communication",
    year: "2nd Year",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    interests: ["Networks", "Python", "Self-Help"],
    history: [
      {
        allotmentId: "ALT-401",
        bookId: "B023",
        bookTitle: "Computer Networks (5th Edition)",
        category: "Networks",
        issueDate: "2026-08-05",
        dueDate: "2026-08-19",
        returnDate: "2026-08-18",
        status: "Returned"
      },
      {
        allotmentId: "ALT-402",
        bookId: "B001",
        bookTitle: "Python Crash Course: A Hands-On, Project-Based Introduction",
        category: "Python",
        issueDate: "2026-08-25",
        dueDate: "2026-09-08",
        returnDate: "2026-09-06",
        status: "Returned"
      },
      {
        allotmentId: "ALT-403",
        bookId: "B029",
        bookTitle: "Deep Work: Rules for Focused Success in a Distracted World",
        category: "Self-Help",
        issueDate: "2026-09-20",
        dueDate: "2026-10-04",
        returnDate: "2026-10-03",
        status: "Returned"
      }
    ]
  },
  {
    id: "STU005",
    name: "Suresh Kumar",
    rollNo: "CS20B102",
    department: "Computer Science & Engineering",
    year: "4th Year",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    interests: ["AI", "Machine Learning", "Fiction", "DBMS"],
    history: [
      {
        allotmentId: "ALT-501",
        bookId: "B011",
        bookTitle: "Artificial Intelligence: A Modern Approach (4th Edition)",
        category: "AI",
        issueDate: "2026-07-10",
        dueDate: "2026-07-24",
        returnDate: "2026-07-22",
        status: "Returned"
      },
      {
        allotmentId: "ALT-502",
        bookId: "B026",
        bookTitle: "Neuromancer (Sprawl Trilogy)",
        category: "Fiction",
        issueDate: "2026-08-02",
        dueDate: "2026-08-16",
        returnDate: "2026-08-15",
        status: "Returned"
      },
      {
        allotmentId: "ALT-503",
        bookId: "B019",
        bookTitle: "Database System Concepts (7th Edition)",
        category: "DBMS",
        issueDate: "2026-08-20",
        dueDate: "2026-09-03",
        returnDate: "2026-09-01",
        status: "Returned"
      },
      {
        allotmentId: "ALT-504",
        bookId: "B014",
        bookTitle: "Reinforcement Learning: An Introduction",
        category: "AI",
        issueDate: "2026-09-10",
        dueDate: "2026-09-24",
        returnDate: "2026-09-23",
        status: "Returned"
      },
      {
        allotmentId: "ALT-505",
        bookId: "B025",
        bookTitle: "The Phoenix Project: A Novel about IT, DevOps",
        category: "Fiction",
        issueDate: "2026-10-01",
        dueDate: "2026-10-15",
        returnDate: null,
        status: "Issued"
      }
    ]
  }
];

// Helper functions for LocalStorage management
const STORAGE_KEYS = {
  BOOKS: "fai_lib_books_v1",
  STUDENTS: "fai_lib_students_v1",
  CURRENT_STUDENT: "fai_lib_current_student_v1",
  COLLAB_FILTER: "fai_lib_collab_filter_v1",
  WISHLIST: "fai_lib_wishlist_v1",
  THEME: "fai_lib_theme_v1"
};

/**
 * Initializes localStorage with sample data if not already present
 */
function initializeData() {
  if (!localStorage.getItem(STORAGE_KEYS.BOOKS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(INITIAL_BOOKS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_STUDENT)) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT, "STU001");
  }
  if (localStorage.getItem(STORAGE_KEYS.COLLAB_FILTER) === null) {
    localStorage.setItem(STORAGE_KEYS.COLLAB_FILTER, "false");
  }
  if (!localStorage.getItem(STORAGE_KEYS.WISHLIST)) {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify({}));
  }
}

/**
 * Get all books from localStorage
 */
function getBooks() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKS);
    return data ? JSON.parse(data) : INITIAL_BOOKS;
  } catch (e) {
    console.error("Error loading books:", e);
    return INITIAL_BOOKS;
  }
}

/**
 * Save books to localStorage
 */
function saveBooks(books) {
  localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
}

/**
 * Get all students from localStorage
 */
function getStudents() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return data ? JSON.parse(data) : INITIAL_STUDENTS;
  } catch (e) {
    console.error("Error loading students:", e);
    return INITIAL_STUDENTS;
  }
}

/**
 * Save students to localStorage
 */
function saveStudents(students) {
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
}

/**
 * Get the currently active student ID
 */
function getCurrentStudentId() {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_STUDENT) || "STU001";
}

/**
 * Set the currently active student ID
 */
function setCurrentStudentId(studentId) {
  localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT, studentId);
}

/**
 * Get the collaborative filtering toggle state
 */
function getCollabFilterEnabled() {
  return localStorage.getItem(STORAGE_KEYS.COLLAB_FILTER) === "true";
}

/**
 * Set collaborative filtering toggle state
 */
function setCollabFilterEnabled(enabled) {
  localStorage.setItem(STORAGE_KEYS.COLLAB_FILTER, enabled ? "true" : "false");
}

/**
 * Get student wishlist book IDs
 */
function getStudentWishlist(studentId) {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    const map = data ? JSON.parse(data) : {};
    return Array.isArray(map[studentId]) ? map[studentId] : [];
  } catch (e) {
    return [];
  }
}

/**
 * Toggle book in student wishlist
 */
function toggleStudentWishlist(studentId, bookId) {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    const map = data ? JSON.parse(data) : {};
    if (!Array.isArray(map[studentId])) {
      map[studentId] = [];
    }
    const idx = map[studentId].indexOf(bookId);
    let added = false;
    if (idx >= 0) {
      map[studentId].splice(idx, 1);
      added = false;
    } else {
      map[studentId].push(bookId);
      added = true;
    }
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(map));
    return added;
  } catch (e) {
    console.error("Error updating wishlist:", e);
    return false;
  }
}

/**
 * Renew an issued book (extends due date by 14 days)
 */
function renewAllotmentRecord(studentId, allotmentId) {
  const students = getStudents();
  const student = students.find(s => s.id === studentId);
  if (!student) return { success: false, message: "Student not found" };

  const record = (student.history || []).find(h => h.allotmentId === allotmentId);
  if (!record) return { success: false, message: "Allotment record not found" };

  if (record.status !== "Issued") {
    return { success: false, message: `Cannot renew a book with status: ${record.status}` };
  }

  // Parse current due date or use today
  const baseDate = new Date(record.dueDate || new Date());
  baseDate.setDate(baseDate.getDate() + 14);
  record.dueDate = baseDate.toISOString().split("T")[0];
  record.renewed = (record.renewed || 0) + 1;

  saveStudents(students);
  return { success: true, newDueDate: record.dueDate, record };
}

/**
 * Add a new book to the library catalog
 */
function addNewBookToCatalog(bookData) {
  const books = getBooks();
  const nextNum = books.length + 1;
  const newBook = {
    id: `B0${nextNum < 100 ? (nextNum < 10 ? '0' + nextNum : nextNum) : nextNum}`,
    title: bookData.title.trim(),
    author: bookData.author.trim(),
    isbn: bookData.isbn ? bookData.isbn.trim() : "978" + Math.floor(1000000000 + Math.random() * 9000000000),
    category: bookData.category || "AI",
    tags: Array.isArray(bookData.tags) ? bookData.tags : (bookData.tags || "").split(",").map(t => t.trim().toLowerCase()).filter(Boolean),
    rating: parseFloat(bookData.rating) || 4.5,
    totalCopies: parseInt(bookData.totalCopies, 10) || 3,
    availableCopies: parseInt(bookData.availableCopies !== undefined ? bookData.availableCopies : bookData.totalCopies, 10) || 3,
    publicationYear: parseInt(bookData.publicationYear, 10) || new Date().getFullYear(),
    description: bookData.description ? bookData.description.trim() : `Comprehensive university textbook covering core concepts in ${bookData.category}.`
  };

  books.push(newBook);
  saveBooks(books);
  return newBook;
}

/**
 * Theme preference helpers
 */
function getActiveTheme() {
  return localStorage.getItem(STORAGE_KEYS.THEME) || "light";
}

function setActiveTheme(theme) {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
}

/**
 * Reset data back to initial defaults
 */
function resetDatabase() {
  localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(INITIAL_BOOKS));
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
  localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT, "STU001");
  localStorage.setItem(STORAGE_KEYS.COLLAB_FILTER, "false");
  localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify({}));
}

