import bcrypt from "bcrypt";
import { Option, PrismaClient, Role } from "../../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // --- USERS ---
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });

  const userPromises = Array.from({ length: 5 }).map(async (_, i) => {
    const password = await bcrypt.hash(`user${i + 1}pass`, 10);
    return prisma.user.create({
      data: {
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        passwordHash: password,
      },
    });
  });

  const users = await Promise.all(userPromises);

  // --- SKILLS ---
  const skillNames = ["JavaScript", "TypeScript", "React", "Node.js", "SQL"];
  const skillPromises = skillNames.map((name) =>
    prisma.skill.create({
      data: {
        name,
        description: `${name} related questions`,
      },
    })
  );

  const skills = await Promise.all(skillPromises);

  // --- QUESTIONS ---
  const questionsData = [
    // JavaScript
    {
      skill: skills[0],
      text: "Which of the following is a correct way to declare a variable in JavaScript?",
      options: ["let x = 5;", "int x = 5;", "var x := 5;", "x = 5"],
      correct: Option.A,
    },
    {
      skill: skills[0],
      text: "Which method converts a JSON string into a JavaScript object?",
      options: [
        "JSON.parse()",
        "JSON.stringify()",
        "JSON.toObject()",
        "JSON.convert()",
      ],
      correct: Option.A,
    },
    {
      skill: skills[0],
      text: "Which of these is NOT a JavaScript data type?",
      options: ["Boolean", "Number", "Float", "String"],
      correct: Option.C,
    },

    // TypeScript
    {
      skill: skills[1],
      text: "Which TypeScript feature allows type-checking at compile time?",
      options: ["Interfaces", "Variables", "Functions", "Loops"],
      correct: Option.A,
    },
    {
      skill: skills[1],
      text: "How do you define an optional property in TypeScript interface?",
      options: [
        "name?: string",
        "name: optional string",
        "optional name: string",
        "name: string?",
      ],
      correct: Option.A,
    },

    // React
    {
      skill: skills[2],
      text: "Which hook is used to manage state in functional components?",
      options: ["useState", "useEffect", "useContext", "useReducer"],
      correct: Option.A,
    },
    {
      skill: skills[2],
      text: "What is the purpose of the key prop in React lists?",
      options: [
        "To uniquely identify elements",
        "To bind events",
        "To style components",
        "To store state",
      ],
      correct: Option.A,
    },
    {
      skill: skills[2],
      text: "Which method is used to render React components to the DOM?",
      options: [
        "ReactDOM.render()",
        "React.render()",
        "DOM.render()",
        "renderReact()",
      ],
      correct: Option.A,
    },

    // Node.js
    {
      skill: skills[3],
      text: "Which module in Node.js is used to handle file operations?",
      options: ["fs", "http", "path", "url"],
      correct: Option.A,
    },
    {
      skill: skills[3],
      text: "Which method is used to create an HTTP server in Node.js?",
      options: [
        "http.createServer()",
        "http.server()",
        "http.listen()",
        "http.init()",
      ],
      correct: Option.A,
    },

    // SQL
    {
      skill: skills[4],
      text: "Which SQL statement is used to retrieve data from a database?",
      options: ["SELECT", "INSERT", "UPDATE", "DELETE"],
      correct: Option.A,
    },
    {
      skill: skills[4],
      text: "Which SQL clause is used to filter records?",
      options: ["WHERE", "GROUP BY", "ORDER BY", "HAVING"],
      correct: Option.A,
    },
    {
      skill: skills[4],
      text: "Which SQL keyword is used to sort the result-set?",
      options: ["ORDER BY", "GROUP BY", "SORT BY", "FILTER BY"],
      correct: Option.A,
    },
    {
      skill: skills[4],
      text: "Which SQL function returns the number of rows that match a specified condition?",
      options: ["COUNT()", "SUM()", "AVG()", "TOTAL()"],
      correct: Option.A,
    },
  ];

  const questionPromises = questionsData.map((q) =>
    prisma.question.create({
      data: {
        skillId: q.skill.id,
        questionText: q.text,
        optionA: "Option A",
        optionB: "Option B",
        optionC: "Option C",
        optionD: "Option D",
        correctOption: q.correct,
      },
    })
  );

  await Promise.all(questionPromises);

  console.log("✅ Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
