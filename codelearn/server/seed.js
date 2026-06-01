import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Question from './models/Question.js'

dotenv.config()

const questions = [
  // ── PYTHON (10) ──────────────────────────────────────────────────
  {
    language: 'python', topic: 'basics', difficulty: 'Beginner',
    questionText: 'What is the correct way to print "Hello World" in Python?',
    options: ['echo "Hello World"', 'print("Hello World")', 'console.log("Hello World")', 'System.out.println("Hello World")'],
    correctIndex: 1,
  },
  {
    language: 'python', topic: 'basics', difficulty: 'Beginner',
    questionText: 'Which of the following is used to define a function in Python?',
    options: ['function', 'fun', 'def', 'define'],
    correctIndex: 2,
  },
  {
    language: 'python', topic: 'basics', difficulty: 'Beginner',
    questionText: 'What data type is the result of: type(3.14)?',
    options: ['int', 'str', 'float', 'double'],
    correctIndex: 2,
  },
  {
    language: 'python', topic: 'basics', difficulty: 'Beginner',
    questionText: 'How do you create a comment in Python?',
    options: ['// comment', '/* comment */', '# comment', '-- comment'],
    correctIndex: 2,
  },
  {
    language: 'python', topic: 'functions', difficulty: 'Intermediate',
    questionText: 'What does the *args parameter allow in a Python function?',
    options: ['Only keyword arguments', 'A fixed number of arguments', 'Variable number of positional arguments', 'Only default arguments'],
    correctIndex: 2,
  },
  {
    language: 'python', topic: 'functions', difficulty: 'Intermediate',
    questionText: 'What is a lambda function in Python?',
    options: ['A function that returns None', 'An anonymous single-expression function', 'A class method', 'A recursive function'],
    correctIndex: 1,
  },
  {
    language: 'python', topic: 'oop', difficulty: 'Intermediate',
    questionText: 'What is the first parameter of a Python class method called by convention?',
    options: ['this', 'cls', 'self', 'me'],
    correctIndex: 2,
  },
  {
    language: 'python', topic: 'oop', difficulty: 'Intermediate',
    questionText: 'Which method is called when a Python object is created?',
    options: ['__create__', '__init__', '__new__', '__start__'],
    correctIndex: 1,
  },
  {
    language: 'python', topic: 'basics', difficulty: 'Beginner',
    questionText: 'What is the output of: len([1, 2, 3, 4, 5])?',
    options: ['4', '5', '6', 'Error'],
    correctIndex: 1,
  },
  {
    language: 'python', topic: 'basics', difficulty: 'Beginner',
    questionText: 'Which keyword is used for exception handling in Python?',
    options: ['catch', 'except', 'error', 'handle'],
    correctIndex: 1,
  },

  // ── JAVASCRIPT (10) ──────────────────────────────────────────────
  {
    language: 'javascript', topic: 'basics', difficulty: 'Beginner',
    questionText: 'Which keyword declares a block-scoped variable in modern JavaScript?',
    options: ['var', 'let', 'int', 'dim'],
    correctIndex: 1,
  },
  {
    language: 'javascript', topic: 'basics', difficulty: 'Beginner',
    questionText: 'What does === check in JavaScript?',
    options: ['Only value equality', 'Only type equality', 'Both value and type equality', 'Assignment'],
    correctIndex: 2,
  },
  {
    language: 'javascript', topic: 'basics', difficulty: 'Beginner',
    questionText: 'How do you declare an arrow function in JavaScript?',
    options: ['function => {}', 'const fn = () => {}', 'def fn() {}', 'fn -> {}'],
    correctIndex: 1,
  },
  {
    language: 'javascript', topic: 'dom', difficulty: 'Intermediate',
    questionText: 'Which method selects an element by its CSS class name?',
    options: ['getElementById', 'getElementsByClassName', 'querySelector only', 'getByClass'],
    correctIndex: 1,
  },
  {
    language: 'javascript', topic: 'dom', difficulty: 'Intermediate',
    questionText: 'What does addEventListener do?',
    options: ['Removes an event', 'Adds a one-time event', 'Attaches an event handler to an element', 'Creates a DOM element'],
    correctIndex: 2,
  },
  {
    language: 'javascript', topic: 'async', difficulty: 'Intermediate',
    questionText: 'What does a Promise represent in JavaScript?',
    options: ['A completed operation', 'A synchronous function', 'A value that may be available in the future', 'A loop'],
    correctIndex: 2,
  },
  {
    language: 'javascript', topic: 'async', difficulty: 'Intermediate',
    questionText: 'What keyword is used to wait for a Promise inside an async function?',
    options: ['wait', 'pause', 'await', 'hold'],
    correctIndex: 2,
  },
  {
    language: 'javascript', topic: 'es6', difficulty: 'Intermediate',
    questionText: 'What is destructuring in JavaScript?',
    options: ['Deleting an object', 'Extracting values from arrays or objects into variables', 'Merging two objects', 'Converting to string'],
    correctIndex: 1,
  },
  {
    language: 'javascript', topic: 'basics', difficulty: 'Beginner',
    questionText: 'Which method adds an element to the end of an array?',
    options: ['append()', 'push()', 'add()', 'insert()'],
    correctIndex: 1,
  },
  {
    language: 'javascript', topic: 'basics', difficulty: 'Beginner',
    questionText: 'What is the result of typeof null in JavaScript?',
    options: ['"null"', '"undefined"', '"object"', '"boolean"'],
    correctIndex: 2,
  },

  // ── JAVA (10) ────────────────────────────────────────────────────
  {
    language: 'java', topic: 'basics', difficulty: 'Beginner',
    questionText: 'Which method is the entry point of a Java program?',
    options: ['start()', 'run()', 'main()', 'init()'],
    correctIndex: 2,
  },
  {
    language: 'java', topic: 'basics', difficulty: 'Beginner',
    questionText: 'What is the correct way to print in Java?',
    options: ['print("Hello")', 'console.log("Hello")', 'System.out.println("Hello")', 'echo "Hello"'],
    correctIndex: 2,
  },
  {
    language: 'java', topic: 'basics', difficulty: 'Beginner',
    questionText: 'Which data type stores a single character in Java?',
    options: ['String', 'char', 'letter', 'character'],
    correctIndex: 1,
  },
  {
    language: 'java', topic: 'oop', difficulty: 'Intermediate',
    questionText: 'Which keyword is used to inherit a class in Java?',
    options: ['implements', 'extends', 'inherits', 'super'],
    correctIndex: 1,
  },
  {
    language: 'java', topic: 'oop', difficulty: 'Intermediate',
    questionText: 'What is an interface in Java?',
    options: ['A class with all implemented methods', 'An abstract contract with no implementation', 'A private class', 'A static class'],
    correctIndex: 1,
  },
  {
    language: 'java', topic: 'oop', difficulty: 'Intermediate',
    questionText: 'What does the "final" keyword mean when applied to a variable in Java?',
    options: ['The variable is public', 'The variable cannot be reassigned', 'The variable is static', 'The variable is null'],
    correctIndex: 1,
  },
  {
    language: 'java', topic: 'collections', difficulty: 'Intermediate',
    questionText: 'Which Java collection allows duplicate elements and maintains insertion order?',
    options: ['HashSet', 'TreeSet', 'ArrayList', 'HashMap'],
    correctIndex: 2,
  },
  {
    language: 'java', topic: 'collections', difficulty: 'Intermediate',
    questionText: 'What is the time complexity of HashMap.get() on average?',
    options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
    correctIndex: 2,
  },
  {
    language: 'java', topic: 'basics', difficulty: 'Beginner',
    questionText: 'Which access modifier makes a member accessible only within the same class?',
    options: ['public', 'protected', 'default', 'private'],
    correctIndex: 3,
  },
  {
    language: 'java', topic: 'basics', difficulty: 'Beginner',
    questionText: 'What is autoboxing in Java?',
    options: ['Converting a class to an interface', 'Automatic conversion between primitive and wrapper types', 'Creating arrays automatically', 'Boxing a method'],
    correctIndex: 1,
  },

  // ── C++ (10) ─────────────────────────────────────────────────────
  {
    language: 'cpp', topic: 'basics', difficulty: 'Beginner',
    questionText: 'Which header is needed for cout in C++?',
    options: ['<stdio.h>', '<console>', '<iostream>', '<output>'],
    correctIndex: 2,
  },
  {
    language: 'cpp', topic: 'basics', difficulty: 'Beginner',
    questionText: 'What does :: mean in C++?',
    options: ['Pointer dereference', 'Scope resolution operator', 'Bitwise OR', 'String concatenation'],
    correctIndex: 1,
  },
  {
    language: 'cpp', topic: 'pointers', difficulty: 'Intermediate',
    questionText: 'What does the * operator do when placed before a pointer variable?',
    options: ['Gets the address of the variable', 'Dereferences the pointer (gets the value)', 'Multiplies by pointer', 'Declares a pointer'],
    correctIndex: 1,
  },
  {
    language: 'cpp', topic: 'pointers', difficulty: 'Intermediate',
    questionText: 'What does the & operator return when used with a variable?',
    options: ['The value of the variable', 'The memory address of the variable', 'The size of the variable', 'A reference copy'],
    correctIndex: 1,
  },
  {
    language: 'cpp', topic: 'pointers', difficulty: 'Intermediate',
    questionText: 'What is a null pointer in C++?',
    options: ['A pointer to an integer 0', 'A pointer that points to nothing (address 0)', 'A dangling pointer', 'A void pointer'],
    correctIndex: 1,
  },
  {
    language: 'cpp', topic: 'oop', difficulty: 'Intermediate',
    questionText: 'What is a constructor in C++?',
    options: ['A function that destroys an object', 'A special function called when an object is created', 'A static method', 'A virtual function'],
    correctIndex: 1,
  },
  {
    language: 'cpp', topic: 'oop', difficulty: 'Intermediate',
    questionText: 'Which keyword enables polymorphism in C++?',
    options: ['override', 'abstract', 'virtual', 'interface'],
    correctIndex: 2,
  },
  {
    language: 'cpp', topic: 'stl', difficulty: 'Advanced',
    questionText: 'Which STL container gives O(1) average time for insertion and lookup by key?',
    options: ['std::vector', 'std::list', 'std::set', 'std::unordered_map'],
    correctIndex: 3,
  },
  {
    language: 'cpp', topic: 'basics', difficulty: 'Beginner',
    questionText: 'What is the correct way to end a statement in C++?',
    options: ['A newline', 'A colon :', 'A semicolon ;', 'A period .'],
    correctIndex: 2,
  },
  {
    language: 'cpp', topic: 'basics', difficulty: 'Beginner',
    questionText: 'What does "cin >>" do in C++?',
    options: ['Outputs text to console', 'Reads input from the user', 'Compares two values', 'Declares a variable'],
    correctIndex: 1,
  },
]

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing questions
    await Question.deleteMany({})
    console.log('🗑️  Cleared existing questions')

    // Insert all questions
    const inserted = await Question.insertMany(questions)
    console.log(`✅ Seeded ${inserted.length} questions (10 per language)`)

    // Summary
    const langs = ['python', 'javascript', 'java', 'cpp']
    for (const lang of langs) {
      const count = inserted.filter(q => q.language === lang).length
      console.log(`   ${lang}: ${count} questions`)
    }

    console.log('\n🎉 Database seeded successfully!')
    process.exit(0)
  } catch (err) {
    console.error('❌ Seed failed:', err.message)
    process.exit(1)
  }
}

seed()
