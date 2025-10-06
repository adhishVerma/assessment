import { prisma } from "../lib/prisma";


export const reportService = {
  userPerformance: async (userId: number) => {
    return prisma.quizSession.findMany({
      where: { userId },
      include: {
        skill: true,
        answers: {
          include: { question: true }
        }
      }
    });
  },

  skillGap: async (userId: number) => {
    const skills = await prisma.skill.findMany({
      include: {
        QuizSession: {
          where: { userId },
          include: { answers: true },
        },
      },
    });

    return skills.map((skill) => {
      const total = skill.QuizSession.flatMap((s) => s.answers).length;
      const correct = skill.QuizSession.flatMap((s) => s.answers).filter(
        (a) => a.isCorrect
      ).length;

      return {
        skill: skill.name,
        accuracy: total ? (correct / total) * 100 : 0,
      };
    });
  },

  timeBasedReport: async (userId: number, start: Date, end: Date) => {
    return prisma.quizSession.findMany({
      where: { userId, startTime: { gte: start }, endTime: { lte: end } },
      include: { answers: true, skill: true },
    });
  },
};
