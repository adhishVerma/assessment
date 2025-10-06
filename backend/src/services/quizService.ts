import { Option } from "../../generated/prisma";
import { prisma } from "../lib/prisma";

export const quizService = {
  startSession: async (userId: number, skillId: number) =>
    prisma.quizSession.create({ data: { userId, skillId } }),

  submitAnswer: async (sessionId: number, questionId: number, selected: Option) => {
    const question = await prisma.question.findUnique({ where: { id: questionId } });
    const isCorrect = question?.correctOption === selected;

    await prisma.quizAnswer.create({
      data: { sessionId, questionId, selectedOption: selected, isCorrect: isCorrect || false },
    });

    const totalCorrect = await prisma.quizAnswer.count({
      where: { sessionId, isCorrect: true },
    });

    await prisma.quizSession.update({ where: { id: sessionId }, data: { totalScore: totalCorrect } });

    return { isCorrect };
  },

  completeSession: async (sessionId: number) =>
    prisma.quizSession.update({ where: { id: sessionId }, data: { endTime: new Date() } }),

  getSessionAnswers: async (sessionId: number) =>
    prisma.quizAnswer.findMany({ where: { sessionId }, include: { question: true } }),

  getReportSingle: async (sessionId: number) => {
    const report = await prisma.quizSession.findUnique({
      where: { id: sessionId }, include: { answers: true },
    })
    if (!report) throw new Error()
    return {
      quizId: report.id,
      total: report.answers.length,
      correct: report.answers.filter(a => (a.isCorrect)).length,
      createdAt: report.startTime
    }
  },

  getReports: async (userId: number) => {
    const reports = await prisma.quizSession.findMany({
      where: { userId },
      include: { answers: true },
      orderBy: { startTime: "desc" },
    })

    return reports.map((r => ({
      quizId: r.id,
      total: r.answers.length,
      correct: r.answers.filter(a => (a.isCorrect)).length,
      createdAt: r.startTime
    })))
  }
};
