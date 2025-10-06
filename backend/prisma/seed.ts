import { PrismaClient, Role, Option, Difficulty } from '../generated/prisma';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with extensive test data...');

  const saltRounds = 10;

  // 1️⃣ Admin user
  const adminPasswordHash = await bcrypt.hash('admin123', saltRounds);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
    },
  });

  // 2️⃣ Regular users
  const usersData = [
    { name: 'Alice', email: 'alice@example.com', password: 'password1' },
    { name: 'Bob', email: 'bob@example.com', password: 'password2' },
    { name: 'Charlie', email: 'charlie@example.com', password: 'password3' },
    { name: 'Dave', email: 'dave@example.com', password: 'password4' },
    { name: 'Eve', email: 'eve@example.com', password: 'password5' },
  ];

  for (const u of usersData) {
    const hash = await bcrypt.hash(u.password, saltRounds);
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { name: u.name, email: u.email, passwordHash: hash, role: Role.USER },
    });
  }

  // 3️⃣ Skills
  const skills = [
    { name: 'JavaScript', description: 'JS fundamentals' },
    { name: 'Node.js', description: 'Backend with Node' },
    { name: 'React', description: 'Frontend framework' },
  ];

  const createdSkills = [];
  for (const s of skills) {
    const skill = await prisma.skill.upsert({
      where: { name: s.name },
      update: {},
      create: s,
    });
    createdSkills.push(skill);
  }

  // 4️⃣ Questions (5 per skill)
  const questionsPerSkill = [
    [
      'What is closure in JS?',
      'What is the difference between var, let, const?',
      'What is hoisting?',
      'Explain async/await',
      'What is a promise?'
    ],
    [
      'What is Event Loop in Node.js?',
      'Explain middleware in Express.',
      'What is non-blocking I/O?',
      'Difference between require and import',
      'What is process.nextTick?'
    ],
    [
      'What is JSX?',
      'Explain state vs props',
      'What is useEffect hook?',
      'What is virtual DOM?',
      'How to optimize React performance?'
    ]
  ];

  for (let i = 0; i < createdSkills.length; i++) {
    const skill = createdSkills[i];
    const questions = questionsPerSkill[i];
    for (let qText of questions) {
      await prisma.question.create({
        data: {
          skillId: skill.id,
          questionText: qText,
          optionA: 'Option A',
          optionB: 'Option B',
          optionC: 'Option C',
          optionD: 'Option D',
          correctOption: Object.values(Option)[Math.floor(Math.random() * 4)],
          difficulty: Object.values(Difficulty)[Math.floor(Math.random() * 3)],
        },
      });
    }
  }

  console.log('Extensive seeding finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
