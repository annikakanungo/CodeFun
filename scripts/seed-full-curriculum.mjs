import fs from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(new URL("../lib/db/package.json", import.meta.url));
const pg = require("pg");

const { Client } = pg;

const lesson = (title, description, focus, example, practice, objectives = []) => ({
  title,
  description,
  focus,
  example,
  practice,
  objectives: objectives.length ? objectives : [
    `Explain the main idea behind ${focus.toLowerCase()}.`,
    `Use ${focus.toLowerCase()} in a small program.`,
    "Test the result and describe what changed.",
  ],
});

const courseCatalog = [
  {
    id: 1,
    description: "Welcome to your first coding adventure. In this beginner-friendly Grade 4 course, students learn how computers follow instructions, then use Python to create programs with variables, decisions, loops, and keyboard input. By the end, every learner will build a simple number-guessing game.",
    objectives: ["Think in steps", "Write beginner Python programs", "Use variables, decisions, loops, and input"],
    weeklyTopics: ["Algorithms and instructions", "Variables and data", "Conditions", "Loops", "Input", "Number Guesser project"],
    lessons: [
      lesson("What Is Code?", "Discover what programming is and why it matters. Write your very first Python line.", "turning instructions into a sequence a computer can follow", 'print("Hello, coder!")', "Write three print statements that introduce your favourite hobby."),
      lesson("Variables and Data", "Store information in variables and understand numbers and text.", "storing values in named containers", 'score = 10\nname = "Ari"', "Create a score, a player name, and a sentence that uses both."),
      lesson("Conditions and Decisions", "Make programs choose what to do based on information.", "using if and else to make a decision", 'if score >= 10:\n    print("Level up!")\nelse:\n    print("Keep practising!")', "Build a weather helper that recommends a jacket when it is cold."),
      lesson("Loops: Say It Again", "Repeat actions without writing the same code over and over.", "using a loop to repeat predictable work", 'for step in range(3):\n    print("Step", step + 1)', "Print a countdown from five to one and then print a finish message."),
      lesson("Getting Input from Users", "Ask questions and use answers inside a program.", "turning keyboard input into useful data", 'name = input("What is your name? ")\nprint("Welcome,", name)', "Ask for a name and favourite colour, then create a personalised greeting."),
      lesson("Mini Project: Number Guesser", "Combine input, decisions, and loops in a guessing game.", "planning a small program from rules and reusable steps", 'secret = 7\nguess = int(input("Guess: "))\nif guess == secret:\n    print("Correct!")', "Create a game with a secret number, helpful higher/lower clues, and a limited number of tries."),
    ],
  },
  {
    id: 2,
    description: "Python Adventures helps Grade 5 learners move from simple instructions to programs that work with collections of information. Students explore strings, lists, functions, and dictionaries while building a choose-your-own-story project that makes their code feel creative and personal.",
    objectives: ["Work confidently with Python collections", "Break problems into functions", "Build a text-based project"],
    weeklyTopics: ["Strings", "Lists", "Loops over collections", "Functions", "Dictionaries", "Text adventure project"],
    lessons: [
      lesson("Strings: Words in Code", "Explore text values, joining words, and useful string methods.", "treating text as data that a program can inspect and transform", 'word = "coding"\nprint(word.upper())\nprint(len(word))', "Build a username formatter that trims spaces and creates a display name."),
      lesson("Lists: Collections of Things", "Store an ordered group of values and access items by position.", "using a list to keep related values together", 'favourites = ["music", "games", "art"]\nprint(favourites[0])', "Create a snack list that lets a user add an item and print the full list."),
      lesson("Looping Through Lists", "Use for loops to process every item in a collection.", "repeating the same operation for each list item", 'for subject in subjects:\n    print("I study", subject)', "Calculate the total points in a list of game scores."),
      lesson("Functions: Name a Recipe", "Create reusable functions with parameters and return values.", "packaging steps into a function you can call again", 'def double(number):\n    return number * 2', "Write two functions: one for a greeting and one for converting minutes to seconds."),
      lesson("Dictionaries: Labelled Data", "Use key-value pairs for information that has labels.", "looking up a value by a meaningful key", 'player = {"name": "Ari", "level": 3}\nprint(player["level"])', "Create a mini profile dictionary and safely read a key that may not exist."),
      lesson("Project: Story Builder", "Combine strings, lists, dictionaries, and functions in a choose-your-own story.", "designing a small program with data, choices, and reusable steps", 'def scene(character, place):\n    return f"{character} arrives at {place}."', "Build three connected story scenes where the player chooses what happens next."),
    ],
  },
  {
    id: 3,
    description: "This Grade 6 course turns Python learners into confident problem-solvers. Students practise designing functions, choosing loop patterns, debugging errors, reading files, and using modules. The course ends with an arcade toolkit project that brings several reusable mini-games together.",
    objectives: ["Write modular Python programs", "Debug with confidence", "Use files and libraries in projects"],
    weeklyTopics: ["Function design", "Parameters and returns", "Scope", "Loop patterns", "Debugging", "Files", "Modules", "Capstone"],
    lessons: [
      lesson("Functions with Parameters", "Design functions that accept different inputs instead of repeating code.", "making one function useful for many situations", 'def greet(name, mood):\n    return f"Hi {name}, you seem {mood}!"', "Create a function that formats a game score for any player and score."),
      lesson("Return Values and Composition", "Use returned values as inputs for other functions.", "combining small functions into a larger solution", 'def tax(price):\n    return price * 0.13\n\ndef total(price):\n    return price + tax(price)', "Build a bill calculator from separate subtotal, tax, and tip functions."),
      lesson("Scope and State", "Understand where variables exist and how to avoid hidden state.", "keeping data local to the function that owns it", 'def add_points(points):\n    new_total = points + 10\n    return new_total', "Refactor a program so each function receives and returns the state it needs."),
      lesson("Loop Patterns", "Use accumulators, counters, and sentinels to solve repeated problems.", "choosing a loop pattern that matches the problem", 'total = 0\nfor value in values:\n    total += value', "Find the largest value and average value in a list without using built-in shortcuts."),
      lesson("Debugging Detective", "Read error messages, isolate a bug, and test a fix.", "using a repeatable debugging process instead of guessing", 'print("before calculation")\nresult = int(value)\nprint("after calculation", result)', "Fix a deliberately broken quiz program and write down the clue that revealed each bug."),
      lesson("Reading and Writing Files", "Save program data to a text file and load it again later.", "using files for simple persistence", 'with open("notes.txt", "w") as file:\n    file.write("Remember loops!")', "Create a tiny journal that appends entries and prints them on startup."),
      lesson("Modules and Libraries", "Split code across files and import useful standard-library tools.", "reusing code without copying it", 'import random\nnumber = random.randint(1, 10)', "Move helper functions into a module and import them into a main program."),
      lesson("Capstone: Arcade Toolkit", "Plan and build a small collection of reusable mini-games.", "turning a feature list into a modular project", 'games = {"coin": flip_coin, "dice": roll_dice}', "Build an arcade menu with at least two games, shared helpers, and a saveable high score."),
    ],
  },
  {
    id: 4,
    description: "In this Grade 7 web design course, students learn how the web is built from the ground up. They use semantic HTML to structure information and CSS to style, align, and adapt pages for different screens. Their final project is an accessible personal website with responsive design.",
    objectives: ["Build structured web pages", "Style layouts with CSS", "Create accessible responsive pages"],
    weeklyTopics: ["HTML structure", "Tags and content", "CSS basics", "Box model", "Flexbox", "Personal website", "Responsive design", "Accessibility and forms"],
    lessons: [
      lesson("HTML Structure", "Assemble a webpage from a clear document structure.", "organising a page with meaningful HTML sections", '<main>\n  <h1>My Page</h1>\n  <p>Welcome!</p>\n</main>', "Create a page with a header, main content, and footer."),
      lesson("Tags and Content", "Use headings, paragraphs, links, lists, and images to communicate clearly.", "matching HTML tags to the meaning of content", '<h2>My hobbies</h2>\n<ul><li>Drawing</li><li>Robotics</li></ul>', "Turn a short biography into a well-structured HTML page."),
      lesson("CSS Basics", "Style a page with colours, typography, selectors, and reusable classes.", "separating content from presentation with CSS", 'body { font-family: sans-serif; }\n.card { color: #5b21b6; }', "Create a visual theme for a page using at least three selectors."),
      lesson("Box Model and Layout", "Control spacing with content, padding, borders, and margins.", "seeing every element as a measurable box", '.card {\n  padding: 20px;\n  margin: 12px;\n  border: 2px solid purple;\n}', "Tune a card layout until its spacing is balanced and explain each box-model property."),
      lesson("Flexbox", "Lay out elements side by side and build page sections.", "using a flexible parent layout to align children", '.nav { display: flex; gap: 16px; align-items: center; }', "Build a navigation bar that aligns a logo, links, and a call-to-action."),
      lesson("Project: Personal Website", "Design and build a personal website with a bio, photo, and links.", "combining semantic HTML and CSS into a complete page", '<section class="hero">\n  <h1>Hi, I am Sam.</h1>\n</section>', "Publish a three-section personal website with a consistent colour and type system."),
      lesson("Responsive Design", "Make layouts adapt gracefully to phones, tablets, and desktops.", "using relative sizing and media queries for different screens", '@media (max-width: 640px) {\n  .layout { flex-direction: column; }\n}', "Add a mobile breakpoint to your personal site and test it at three widths."),
      lesson("Accessibility and Forms", "Build keyboard-friendly forms with labels, focus states, and useful structure.", "making websites usable by more people", '<label for="email">Email</label>\n<input id="email" type="email" required>', "Add a contact form with labels, validation, visible focus, and a clear success message."),
    ],
  },
  {
    id: 5,
    description: "Grade 8 students make their websites come alive with JavaScript. They learn how to work with values, the DOM, events, arrays, objects, and reusable functions, then combine these skills in an interactive study board that responds to real user actions.",
    objectives: ["Write JavaScript in the browser", "Respond to user events", "Build interactive web pages"],
    weeklyTopics: ["JavaScript values", "Conditionals and loops", "DOM selection", "Events", "Arrays and objects", "Functions", "State", "Interactive website project"],
    lessons: [
      lesson("JavaScript in the Browser", "Connect a JavaScript file to a webpage and run your first script.", "using JavaScript to add behaviour to HTML", 'const message = "Hello from JavaScript";\nconsole.log(message);', "Add a script that changes a welcome message when the page loads."),
      lesson("Values, Variables, and Types", "Work with strings, numbers, booleans, and constants.", "choosing the right value type for a task", 'const points = 25;\nconst ready = points > 10;', "Create a score panel that calculates whether a player has unlocked a badge."),
      lesson("Decisions and Loops in JavaScript", "Use if statements and loops to control browser behaviour.", 'if (isReady) {\n  console.log("Go!");\n}', "Build a password-strength checker with clear feedback."),
      lesson("Selecting HTML Elements", "Find and update elements through the DOM.", "using selectors to connect JavaScript to the page", 'const heading = document.querySelector("h1");\nheading.textContent = "Updated!";', "Create a theme switcher that changes a page class."),
      lesson("Events and Buttons", "Listen for clicks, keyboard input, and form submissions.", "making a page react to what the user does", 'button.addEventListener("click", () => {\n  count += 1;\n});', "Build a click counter with reset and accessible button labels."),
      lesson("Arrays and Objects", "Represent lists and labelled records in JavaScript.", "organising data for an interactive interface", 'const cards = [{ title: "Loops", done: false }];', "Render a list of learning goals from an array of objects."),
      lesson("Functions and Reusable UI", "Write functions that transform data and update the page.", "keeping interactive code small and reusable", 'function renderCard(card) {\n  return `<article>${card.title}</article>`;\n}', "Create a reusable function that renders a course card."),
      lesson("Project: Interactive Study Board", "Combine DOM updates, events, arrays, and functions in a useful website.", "planning a browser application from user actions and state", 'let tasks = [];\nfunction addTask(title) { tasks.push({ title, done: false }); }', "Build a study board where users add, complete, filter, and clear tasks."),
    ],
  },
  {
    id: 6,
    description: "Python Projects, Git, and GitHub introduces Grade 9 learners to the habits of real software teams. Students plan projects, organise code into modules, work with files and JSON, handle errors, write tests, and use Git branches and pull requests. They finish by publishing a complete Python tool with documentation.",
    objectives: ["Build maintainable Python projects", "Use Git and GitHub workflows", "Collaborate like a developer"],
    weeklyTopics: ["Project planning", "Modules", "Files and JSON", "Errors", "Classes", "Testing", "Git basics", "Branches", "Pull requests", "Capstone"],
    lessons: [
      lesson("Plan a Python Project", "Turn an idea into features, data, tasks, and a small first release.", "scoping a project before writing code", "Feature list: import data → transform data → display a report", "Write a one-page plan and split it into three small milestones."),
      lesson("Project Structure and Modules", "Organise a Python project into modules with clear responsibilities.", "giving each file one focused job", 'from app.formatting import format_report\nprint(format_report(data))', "Refactor a single-file app into input, logic, and output modules."),
      lesson("Files and JSON Data", "Read and write structured JSON data for a project.", "persisting dictionaries and lists in a portable format", 'import json\njson.dump({"theme": "violet"}, file)', "Create a settings file and load it with a safe default when it is missing."),
      lesson("Exceptions and Validation", "Handle expected errors and validate user data at the boundary.", "failing clearly without crashing the whole program", 'try:\n    age = int(raw_age)\nexcept ValueError:\n    print("Enter a whole number.")', "Add validation to a command-line form and explain each error message."),
      lesson("Classes and Objects", "Model repeated entities with classes and methods.", "grouping data and behaviour into a useful object", 'class Player:\n    def __init__(self, name):\n        self.name = name', "Create a small inventory model with add, remove, and total methods."),
      lesson("Testing with Examples", "Use small tests to protect important behaviour.", "turning expected behaviour into repeatable checks", 'assert add_points(2, 3) == 5', "Write tests for valid input, invalid input, and an edge case."),
      lesson("Git: Save Your Work", "Create commits that tell the story of a project.", "using version control to make change safe", 'git add .\ngit commit -m "Add score calculation"', "Make three focused commits and write a useful message for each."),
      lesson("Branches and Experiments", "Use branches to work without disrupting the main version.", "isolating a feature until it is ready", 'git switch -c add-search', "Create a feature branch, make a change, and merge it into main."),
      lesson("GitHub and Pull Requests", "Share code, explain changes, and review work with a pull request.", "collaborating through discussion and review", "PR checklist: summary, screenshots, test steps, known limitations", "Open a mock pull request description for one project feature."),
      lesson("Capstone: Publish a Python Tool", "Plan, build, test, document, and share a complete Python tool.", "shipping a project from idea to a usable release", "README sections: purpose, setup, usage, examples, next steps", "Deliver a command-line tool with a README, tests, sample data, and a clean Git history."),
    ],
  },
  {
    id: 7,
    description: "This Grade 10 course explores the data structures and web services behind modern software. Students compare ways to store and search information, study efficiency, work with stacks and queues, and consume JSON APIs reliably. A data dashboard project gives them practice turning external data into useful results.",
    objectives: ["Choose appropriate data structures", "Use APIs safely", "Build data-driven Python tools"],
    weeklyTopics: ["Collections", "Complexity", "Stacks and queues", "Recursion", "Searching and sorting", "HTTP", "JSON APIs", "Errors and pagination", "API project", "Testing"],
    lessons: [
      lesson("Choosing Data Structures", "Compare lists, tuples, dictionaries, and sets for different jobs.", "matching a data structure to the operations you need", 'tags = {"python", "api"}\nprofile = {"name": "Ari"}', "Choose structures for a contact book, unique tags, and a fixed coordinate."),
      lesson("Efficiency and Big-O Thinking", "Describe how work grows as input gets larger.", "noticing the cost of repeated searches and loops", "One pass through n items is linear; nested passes can be quadratic.", "Compare two ways to find a duplicate and explain which scales better."),
      lesson("Stacks and Queues", "Model last-in-first-out and first-in-first-out workflows.", "using the right order for tasks", 'stack = []\nstack.append("page")\nlast = stack.pop()', "Build an undo stack and a customer queue with clear operations."),
      lesson("Recursion", "Solve a problem by reducing it to a smaller version of itself.", "identifying a base case and a recursive step", 'def countdown(n):\n    if n == 0: return\n    countdown(n - 1)', "Write a recursive function that walks through nested folders."),
      lesson("Searching and Sorting", "Use built-in and custom strategies to organise and find data.", "making data easier to query", 'ordered = sorted(scores, reverse=True)\nfound = 42 in ordered', "Sort a leaderboard and find the first score above a target."),
      lesson("HTTP and Request Methods", "Understand URLs, requests, responses, and common HTTP methods.", "describing how software talks over the web", "GET reads data; POST creates data; status codes describe the result.", "Map the request and response for a weather search feature."),
      lesson("Reading JSON APIs", "Fetch JSON, inspect its shape, and turn it into useful program data.", "consuming structured data from an API", 'response = requests.get(url)\ndata = response.json()', "Build a small API reader that prints three selected fields."),
      lesson("API Errors and Pagination", "Handle timeouts, missing data, rate limits, and multi-page results.", "making API clients reliable", 'if response.status_code == 429:\n    print("Try again later.")', "Add retries and pagination to a client without hiding real errors."),
      lesson("Project: Data Dashboard API", "Combine data structures and API calls into a useful report.", "transforming external data into a clear output", "API → validation → transformation → summary table", "Build a dashboard script that fetches data, calculates two metrics, and exports JSON."),
      lesson("Testing Data Pipelines", "Test transformations and API boundaries with predictable fixtures.", "separating network concerns from data logic", 'def normalise(item):\n    return {"name": item["name"].strip()}', "Write tests using a local fixture instead of relying on a live API."),
    ],
  },
  {
    id: 8,
    description: "SQL and React gives Grade 11 learners two essential full-stack skills. Students design relational data, write queries and joins, and then build React interfaces with components, props, state, forms, and API requests. The course culminates in a course planner that connects a polished frontend to structured data.",
    objectives: ["Design relational data", "Query databases with SQL", "Build React interfaces"],
    weeklyTopics: ["Data modelling", "SELECT and filtering", "Joins", "Aggregates", "CRUD", "React components", "Props", "State", "Effects", "Forms", "API integration", "Full-stack project"],
    lessons: [
      lesson("Tables and Data Models", "Turn a real-world problem into related database tables.", "representing entities and relationships", "Users have many notes; each note belongs to one user.", "Sketch tables for a classroom notes app and identify primary keys."),
      lesson("SELECT and Filtering", "Read rows with SELECT, WHERE, ORDER BY, and LIMIT.", "asking precise questions of stored data", 'SELECT title FROM lessons WHERE grade = 7 ORDER BY title;', "Write four queries for a course catalogue."),
      lesson("Joins and Relationships", "Combine related rows with INNER JOIN and LEFT JOIN.", "following a relationship across tables", 'SELECT courses.title, lessons.title\nFROM courses JOIN lessons ON lessons.course_id = courses.id;', "Query each course with its lesson titles and keep empty courses visible."),
      lesson("Aggregates and GROUP BY", "Count, average, and group data to create useful summaries.", "turning rows into metrics", 'SELECT course_id, COUNT(*) FROM lessons GROUP BY course_id;', "Create a report showing lesson counts and average duration."),
      lesson("CRUD and Constraints", "Create, update, and delete records safely with constraints.", "protecting data quality at the database boundary", 'INSERT INTO courses (title, grade) VALUES ("Python", 5);', "Design constraints for a course and lesson editor."),
      lesson("React Components", "Split an interface into small components that each have a clear job.", "building a UI from reusable pieces", 'function CourseCard({ title }) {\n  return <article>{title}</article>;\n}', "Break a course page into header, card, and lesson list components."),
      lesson("Props and Composition", "Pass data into components and compose larger interfaces.", "keeping components reusable and predictable", '<CourseCard title={course.title} grade={course.grade} />', "Create a reusable lesson row with optional metadata."),
      lesson("State and Events", "Use state to respond to clicks, forms, and selections.", "tracking changing interface data", 'const [query, setQuery] = useState("");', "Add a course search field and filtered results."),
      lesson("Effects and Fetching", "Load server data and handle loading, error, and empty states.", "connecting a React screen to an API", 'useEffect(() => { fetch("/api/courses").then(...); }, []);', "Build a lesson list with all three async states."),
      lesson("Forms and Validation", "Control form inputs and give helpful feedback before submitting.", "making user input reliable", 'const [title, setTitle] = useState("");\nconst valid = title.trim().length > 2;', "Create a lesson form with required fields and a disabled submit state."),
      lesson("React and SQL API Integration", "Connect a React client to a server that reads and writes SQL data.", "moving data through a full request cycle", "form → POST → database → response → cache refresh", "Wire a course note form to a mock API contract."),
      lesson("Project: Course Planner", "Build a small full-stack planner for courses and lessons.", "combining SQL, APIs, and React into one product", "Course list + lesson detail + add lesson form + loading/error states", "Deliver a planner with a relational schema, API endpoints, and a polished React UI."),
    ],
  },
  {
    id: 9,
    description: "Full-Stack Web Apps and AI is the Grade 12 capstone experience. Students design a production-style application, build REST APIs, connect a database, protect user data, prepare forms, and plan a deployment. They also learn the strengths and limits of AI before adding a safe, evaluated AI feature to their final project.",
    objectives: ["Design a production-style web app", "Integrate a safe AI feature", "Ship and explain a full-stack project"],
    weeklyTopics: ["App architecture", "Node and Express", "REST APIs", "Database design", "Authentication", "Security", "Forms", "Deployment", "AI concepts", "Prompting", "AI integration", "Capstone"],
    lessons: [
      lesson("Full-Stack Architecture", "Map the browser, server, database, and external service boundaries.", "choosing where each responsibility belongs", "Browser UI → API server → database; server → AI provider", "Draw the request path for one feature and identify every failure point."),
      lesson("Node and Express", "Create a server with routes, middleware, and clear responses.", "building an HTTP service in JavaScript", 'app.get("/api/health", (req, res) => res.json({ ok: true }));', "Add a health route and a route that returns a typed list."),
      lesson("REST API Design", "Design resource-oriented endpoints with predictable inputs and outputs.", "making a backend easy for clients to use", "GET /courses, GET /courses/:id, POST /courses", "Write an API contract for a study planner."),
      lesson("Database Design for Apps", "Choose tables, keys, and indexes for a real product feature.", "turning product requirements into durable data", "users, projects, messages, and timestamps with ownership fields", "Model the tables for an AI-assisted notes app."),
      lesson("Authentication and Ownership", "Protect routes and ensure users can only access their own data.", "separating identity from authorization", "authenticate user → load role → check resource ownership", "List authorization checks for create, read, update, and delete."),
      lesson("Security at the Boundary", "Validate inputs, protect secrets, and avoid trusting the browser.", "making unsafe requests fail safely", "Validate JSON, limit sizes, parameterise SQL, keep keys server-side.", "Threat-model one endpoint and add three concrete safeguards."),
      lesson("Production-Ready Forms", "Build a form with validation, optimistic feedback, and recoverable errors.", "making a user flow reliable from browser to database", "idle → submitting → success/error with preserved input", "Design a form state machine for creating an AI prompt."),
      lesson("Deployment and Observability", "Prepare a full-stack app for deployment with health checks and useful logs.", "knowing whether a shipped app is working", "environment variables, build command, health endpoint, structured errors", "Write a launch checklist and define two useful operational signals."),
      lesson("AI Concepts and Limits", "Understand models, tokens, context, hallucinations, and evaluation.", "using AI with realistic expectations", "Input context + instructions → model output → validation and review", "Create an evaluation rubric for an AI-generated summary."),
      lesson("Prompting for Useful Results", "Write prompts with role, context, constraints, examples, and output format.", "making model output more consistent", 'Return JSON with keys: summary, next_steps, confidence.', "Improve a vague prompt into a structured, testable prompt."),
      lesson("Adding AI Safely", "Integrate an AI feature behind a server route with validation and fallbacks.", "keeping provider calls and secrets off the client", "client → server validation → provider call → schema check → response", "Design an AI hint endpoint that refuses unsafe or empty input."),
      lesson("Capstone: Full-Stack AI App", "Plan, build, test, deploy, and demo an app with a meaningful AI feature.", "bringing the complete development workflow together", "Problem → data model → API → UI → AI feature → evaluation → launch", "Ship a small app with authentication, persistence, one AI workflow, and a clear demo README."),
    ],
  },
];

const languageByCourse = {
  1: "Python",
  2: "Python",
  3: "Python",
  4: "HTML/CSS",
  5: "JavaScript",
  6: "Python + Git",
  7: "Python",
  8: "SQL + React",
  9: "React + Node + AI",
};

const difficultyFor = (courseId, order) => {
  if (courseId <= 2) return order >= 5 ? "intermediate" : "beginner";
  if (courseId <= 5) return order >= 6 ? "intermediate" : "beginner";
  return order >= 5 ? "advanced" : "intermediate";
};

const quizFor = (entry) => [
  {
    question: `Which idea is the best match for ${entry.title}?`,
    options: [entry.focus[0].toUpperCase() + entry.focus.slice(1) + ".", "Changing a monitor's brightness.", "Renaming a computer.", "Closing every browser tab."],
    correctIndex: 0,
  },
  {
    question: `What is a strong way to practise ${entry.title.toLowerCase()}?`,
    options: [entry.practice, "Skip the example and never test it.", "Copy code without changing or explaining it.", "Delete the inputs before running the program."],
    correctIndex: 0,
  },
];

const contentFor = (entry, language) => `## Goal
${entry.description}

## Core idea
${entry.focus[0].toUpperCase() + entry.focus.slice(1)}. Good developers make the idea visible by naming data clearly, taking one small step at a time, and checking the result after each change.

## Example
\`\`\`${language.split(" ")[0].toLowerCase()}
${entry.example}
\`\`\`

## Try it
${entry.practice}

## Check your thinking
- What input does this example expect?
- What would change if one value were different?
- How could you test an edge case?

## Wrap-up
Explain the idea in your own words, then make one small improvement to the example.`;

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

try {
  await client.query("BEGIN");

  for (const course of courseCatalog) {
    const language = languageByCourse[course.id];
    await client.query(
      `UPDATE courses
       SET description = $1, objectives = $2, weekly_topics = $3, lesson_count = $4
       WHERE id = $5`,
      [course.description, course.objectives, course.weeklyTopics, course.lessons.length, course.id],
    );

    for (let index = 0; index < course.lessons.length; index += 1) {
      const entry = course.lessons[index];
      const order = index + 1;
      const existingResult = await client.query(
        `SELECT id, video_url FROM lessons WHERE course_id = $1 AND "order" = $2 LIMIT 1`,
        [course.id, order],
      );

      let lessonId;
      let videoUrl = existingResult.rows[0]?.video_url ?? null;
      const localVideoPath = `artifacts/coding-program/public/videos/lesson-${existingResult.rows[0]?.id}.mp4`;
      if (existingResult.rows[0]?.id && fs.existsSync(localVideoPath)) {
        videoUrl = `/videos/lesson-${existingResult.rows[0].id}.mp4`;
      }

      if (existingResult.rows[0]) {
        lessonId = existingResult.rows[0].id;
        await client.query(
          `UPDATE lessons
           SET title = $1, description = $2, duration_minutes = $3,
               has_video = $4, video_url = $5, content = $6,
               objectives = $7
           WHERE id = $8`,
          [
            entry.title,
            entry.description,
            course.id >= 8 ? 60 : 45,
            Boolean(videoUrl),
            videoUrl,
            contentFor(entry, language),
            entry.objectives,
            lessonId,
          ],
        );
      } else {
        const inserted = await client.query(
          `INSERT INTO lessons
             (course_id, title, description, "order", duration_minutes, has_video,
              has_exercises, has_quiz, video_url, content, objectives)
           VALUES ($1, $2, $3, $4, $5, false, false, false, NULL, $6, $7)
           RETURNING id`,
          [
            course.id,
            entry.title,
            entry.description,
            order,
            course.id >= 8 ? 60 : 45,
            contentFor(entry, language),
            entry.objectives,
          ],
        );
        lessonId = inserted.rows[0].id;
      }

      const exerciseCount = await client.query(
        "SELECT COUNT(*)::int AS count FROM exercises WHERE lesson_id = $1",
        [lessonId],
      );
      if (exerciseCount.rows[0].count === 0) {
        await client.query(
          `INSERT INTO exercises
             (lesson_id, title, instructions, starter_code, expected_output, language, "order", difficulty)
           VALUES ($1, $2, $3, $4, $5, $6, 1, $7)`,
          [
            lessonId,
            `Practice: ${entry.title}`,
            `${entry.practice} Start with the example, change one part, and test an edge case. Add a short comment explaining your approach.`,
            entry.example,
            "A working solution with a clear result and a tested edge case.",
            language,
            difficultyFor(course.id, order),
          ],
        );
      }
      await client.query("UPDATE lessons SET has_exercises = true WHERE id = $1", [lessonId]);

      const quizResult = await client.query(
        "SELECT id FROM quizzes WHERE lesson_id = $1 LIMIT 1",
        [lessonId],
      );
      let quizId = quizResult.rows[0]?.id;
      if (!quizId) {
        const insertedQuiz = await client.query(
          "INSERT INTO quizzes (lesson_id) VALUES ($1) RETURNING id",
          [lessonId],
        );
        quizId = insertedQuiz.rows[0].id;
      }
      const questionCount = await client.query(
        "SELECT COUNT(*)::int AS count FROM quiz_questions WHERE quiz_id = $1",
        [quizId],
      );
      if (questionCount.rows[0].count === 0) {
        for (const question of quizFor(entry)) {
          await client.query(
            `INSERT INTO quiz_questions (quiz_id, question, options, correct_index)
             VALUES ($1, $2, $3, $4)`,
            [quizId, question.question, question.options, question.correctIndex],
          );
        }
      }
      await client.query("UPDATE lessons SET has_quiz = true WHERE id = $1", [lessonId]);
    }
  }

  await client.query("COMMIT");
  console.log(`Curriculum ready: ${courseCatalog.reduce((sum, course) => sum + course.lessons.length, 0)} lessons across ${courseCatalog.length} courses.`);
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  await client.end();
}