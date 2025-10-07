import { PrismaClient } from "../../generated/prisma";

// ============================================
// Types & Interfaces
// ============================================

export interface TopicWiseReport {
  quizId: number;
  skillName: string;
  skillId: number;
  correct: number;
  total: number;
  scorePercent: number;
  createdAt: string;
  difficulty?: string;
}

export interface SkillGap {
  skillId: number;
  skillName: string;
  averageScore: number;
  quizzesTaken: number;
  lastAttempted: string;
  status: "critical" | "needs-improvement" | "good" | "excellent";
  trend: "improving" | "declining" | "stable";
}

export interface QuizReport {
  totalQuizzes: number;
  averageScore: number;
  excellentScore: number;
  topicWise: TopicWiseReport[];
  skillGaps: SkillGap[];
  recentActivity: {
    week: number;
    month: number;
    total: number;
  };
}

export type TimeFilter = "week" | "month" | "all";

// ============================================
// Prisma Service Layer
// ============================================

const prisma = new PrismaClient();

export class ReportsService {
  /**
   * Get date range based on time filter
   */
  private getDateRange(filter: TimeFilter): Date | null {
    const now = new Date();
    switch (filter) {
      case "week":
        return new Date(now.setDate(now.getDate() - 7));
      case "month":
        return new Date(now.setMonth(now.getMonth() - 1));
      case "all":
        return null;
      default:
        return null;
    }
  }

  /**
   * Get user reports with optional time filtering
   */
  async getUserReport(
    userId: number,
    timeFilter: TimeFilter = "all"
  ): Promise<QuizReport> {
    const startDate = this.getDateRange(timeFilter);

    // Build where clause
    const whereClause: any = {
      userId,
      endTime: { not: null }, // Only completed quizzes
    };

    if (startDate) {
      whereClause.startTime = { gte: startDate };
    }

    // Fetch all quiz sessions with related data
    const sessions = await prisma.quizSession.findMany({
      where: whereClause,
      include: {
        skill: true,
        answers: {
          include: {
            question: true,
          },
        },
      },
      orderBy: {
        startTime: "desc",
      },
    });

    // Calculate topic-wise reports
    const topicWise: TopicWiseReport[] = sessions.map((session) => {
      const correctAnswers = session.answers.filter((a) => a.isCorrect).length;
      const totalQuestions = session.answers.length;
      const scorePercent =
        totalQuestions > 0
          ? Math.round((correctAnswers / totalQuestions) * 100)
          : 0;

      return {
        quizId: session.id,
        skillName: session.skill.name,
        skillId: session.skillId,
        correct: correctAnswers,
        total: totalQuestions,
        scorePercent,
        createdAt: session.startTime.toISOString(),
      };
    });

    // Calculate overall stats
    const totalQuizzes = sessions.length;
    const averageScore =
      totalQuizzes > 0
        ? Math.round(
            topicWise.reduce((sum, t) => sum + t.scorePercent, 0) / totalQuizzes
          )
        : 0;
    const excellentScore = topicWise.filter((t) => t.scorePercent >= 90).length;

    // Get skill gaps
    const skillGaps = await this.getSkillGaps(userId, timeFilter);

    // Get recent activity counts
    const weekSessions = await prisma.quizSession.count({
      where: {
        userId,
        endTime: { not: null },
        startTime: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    });

    const monthSessions = await prisma.quizSession.count({
      where: {
        userId,
        endTime: { not: null },
        startTime: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    });

    return {
      totalQuizzes,
      averageScore,
      excellentScore,
      topicWise,
      skillGaps,
      recentActivity: {
        week: weekSessions,
        month: monthSessions,
        total: await prisma.quizSession.count({
          where: { userId, endTime: { not: null } },
        }),
      },
    };
  }

  /**
   * Identify skill gaps based on performance
   */
  async getSkillGaps(
    userId: number,
    timeFilter: TimeFilter = "all"
  ): Promise<SkillGap[]> {
    const startDate = this.getDateRange(timeFilter);

    const whereClause: any = {
      userId,
      endTime: { not: null },
    };

    if (startDate) {
      whereClause.startTime = { gte: startDate };
    }

    // Get all sessions grouped by skill
    const sessions = await prisma.quizSession.findMany({
      where: whereClause,
      include: {
        skill: true,
        answers: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    // Group by skill
    const skillMap = new Map<number, any[]>();
    sessions.forEach((session) => {
      if (!skillMap.has(session.skillId)) {
        skillMap.set(session.skillId, []);
      }
      skillMap.get(session.skillId)!.push(session);
    });

    // Calculate skill gaps
    const skillGaps: SkillGap[] = [];

    for (const [skillId, skillSessions] of skillMap.entries()) {
      const skill = skillSessions[0].skill;

      // Calculate scores for each session
      const scores = skillSessions.map((session) => {
        const correctAnswers = session.answers.filter(
          (a: any) => a.isCorrect
        ).length;
        const totalQuestions = session.answers.length;
        return totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
      });

      const averageScore = Math.round(
        scores.reduce((sum, score) => sum + score, 0) / scores.length
      );

      // Determine status
      let status: SkillGap["status"];
      if (averageScore >= 90) status = "excellent";
      else if (averageScore >= 75) status = "good";
      else if (averageScore >= 60) status = "needs-improvement";
      else status = "critical";

      // Calculate trend (compare first half vs second half)
      let trend: SkillGap["trend"] = "stable";
      if (scores.length >= 4) {
        const midpoint = Math.floor(scores.length / 2);
        const firstHalfAvg =
          scores.slice(0, midpoint).reduce((a, b) => a + b, 0) / midpoint;
        const secondHalfAvg =
          scores.slice(midpoint).reduce((a, b) => a + b, 0) /
          (scores.length - midpoint);

        if (secondHalfAvg > firstHalfAvg + 5) trend = "improving";
        else if (secondHalfAvg < firstHalfAvg - 5) trend = "declining";
      }

      const lastSession = skillSessions[skillSessions.length - 1];

      skillGaps.push({
        skillId,
        skillName: skill.name,
        averageScore,
        quizzesTaken: skillSessions.length,
        lastAttempted: lastSession.startTime.toISOString(),
        status,
        trend,
      });
    }

    // Sort by average score (lowest first to highlight gaps)
    return skillGaps.sort((a, b) => a.averageScore - b.averageScore);
  }

  /**
   * Get comparative analysis across all users (for admin)
   */
  async getComparativeReport(userId: number): Promise<any> {
    const userReport = await this.getUserReport(userId, "all");

    // Get average scores across all users
    const allSessions = await prisma.quizSession.findMany({
      where: {
        endTime: { not: null },
      },
      include: {
        answers: true,
      },
    });

    const allScores = allSessions.map((session) => {
      const correctAnswers = session.answers.filter((a) => a.isCorrect).length;
      const totalQuestions = session.answers.length;
      return totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    });

    const overallAverage =
      allScores.length > 0
        ? Math.round(
            allScores.reduce((sum, score) => sum + score, 0) / allScores.length
          )
        : 0;

    return {
      userAverage: userReport.averageScore,
      overallAverage,
      percentile: this.calculatePercentile(userReport.averageScore, allScores),
      rank: this.calculateRank(userId, allScores),
    };
  }

  private calculatePercentile(userScore: number, allScores: number[]): number {
    const belowScore = allScores.filter((score) => score < userScore).length;
    return Math.round((belowScore / allScores.length) * 100);
  }

  private calculateRank(userId: number, allScores: number[]): number {
    // Simplified rank calculation
    const sorted = allScores.sort((a, b) => b - a);
    return sorted.findIndex((score) => score === allScores[0]) + 1;
  }
}

// ============================================
// Express Routes
// ============================================

import { Router, Request, Response } from "express";

const router = Router();
const reportsService = new ReportsService();

/**
 * GET /api/reports/user/:userId
 * Get user's quiz reports with optional time filtering
 */
router.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const timeFilter = (req.query.filter as TimeFilter) || "all";

    // Verify user has permission to view this report
    // Add your authorization logic here

    const report = await reportsService.getUserReport(userId, timeFilter);

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("Error fetching user report:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user report",
    });
  }
});

/**
 * GET /api/reports/skill-gaps/:userId
 * Get skill gap analysis for a user
 */
router.get("/skill-gaps/:userId", async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const timeFilter = (req.query.filter as TimeFilter) || "all";

    const skillGaps = await reportsService.getSkillGaps(userId, timeFilter);

    res.json({
      success: true,
      data: skillGaps,
    });
  } catch (error) {
    console.error("Error fetching skill gaps:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch skill gaps",
    });
  }
});

/**
 * GET /api/reports/comparative/:userId
 * Get comparative analysis for a user
 */
router.get("/comparative/:userId", async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);

    const report = await reportsService.getComparativeReport(userId);

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("Error fetching comparative report:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch comparative report",
    });
  }
});

export default router;
