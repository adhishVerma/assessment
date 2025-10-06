import { Option } from "../../generated/prisma";
import { prisma } from "../lib/prisma";

export const quizService = {
  startSession: async (userId: number, skillId: number) =>
    prisma.quizSession.create({ data: { userId, skillId } }),

  submitAnswer: async (
    sessionId: number,
    questionId: number,
    selected: Option
  ) => {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });
    const isCorrect = question?.correctOption === selected;

    await prisma.quizAnswer.create({
      data: {
        sessionId,
        questionId,
        selectedOption: selected,
        isCorrect: isCorrect || false,
      },
    });

    const totalCorrect = await prisma.quizAnswer.count({
      where: { sessionId, isCorrect: true },
    });

    await prisma.quizSession.update({
      where: { id: sessionId },
      data: { totalScore: totalCorrect },
    });

    return { isCorrect };
  },

  completeSession: async (sessionId: number) =>
    prisma.quizSession.update({
      where: { id: sessionId },
      data: { endTime: new Date() },
    }),

  getSessionAnswers: async (sessionId: number) =>
    prisma.quizAnswer.findMany({
      where: { sessionId },
      include: { question: true },
    }),

  getReportSingle: async (sessionId: number) => {
    const report = await prisma.quizSession.findUnique({
      where: { id: sessionId },
      include: { answers: true },
    });
    if (!report) throw new Error();
    return {
      quizId: report.id,
      total: report.answers.length,
      correct: report.answers.filter((a) => a.isCorrect).length,
      createdAt: report.startTime,
    };
  },

  getReports: async (userId: number) => {
    const reports = await prisma.quizSession.findMany({
      where: { userId },
      include: { answers: true, skill: true },
      orderBy: { startTime: "desc" },
    });

    const topicWise = reports.map((r) => {
      const total = r.answers.length;
      const correct = r.answers.filter((a) => a.isCorrect).length;
      const scorePercent = total > 0 ? (correct / total) * 100 : 0;

      return {
        quizId: r.id,
        skillName: r.skill.name,
        skillDescription: r.skill.description,
        total,
        correct,
        scorePercent,
        createdAt: r.startTime,
      };
    });

    const totalQuizzes = reports.length;
    const averageScore =
      totalQuizzes > 0
        ? topicWise.reduce((sum, q) => sum + q.scorePercent, 0) / totalQuizzes
        : 0;

    const excellentScore = topicWise.filter(
      (q) => q.scorePercent === 100
    ).length;

    return {
      totalQuizzes,
      averageScore: Math.round(averageScore),
      excellentScore,
      topicWise,
    };
  },
};
