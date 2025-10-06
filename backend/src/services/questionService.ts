import { prisma } from "../lib/prisma";

export const questionService = {
  create: async (data: any) => prisma.question.create({ data }),

  findAll: async () =>
    prisma.question.findMany({
      where: { isDeleted: false },
      include: { skill: true },
    }),

  findById: async (skillId: number) =>
    prisma.question.findMany({
      where: { skillId, isDeleted: false },
      include: { skill: true },
    }),

  update: async (id: number, data: any) =>
    prisma.question.update({ where: { id }, data }),

  delete: async (id: number) =>
    await prisma.question.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    }),
};
