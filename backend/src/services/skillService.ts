import { prisma } from "../lib/prisma";

export const skillService = {
    create: async (data: { name: string; description?: string }) =>
        prisma.skill.create({ data }),

    findAll: async () => prisma.skill.findMany({
        where: { isDeleted: false },
    }),

    findByName: async (name: string) => prisma.skill.findUnique({ where: { name, isDeleted: false } }),

    update: async (id: number, data: any) =>
        prisma.skill.update({ where: { id }, data }),

    delete: async (id: number) =>
        await prisma.skill.update({
            where: { id },
            data: { isDeleted: true, deletedAt: new Date() },
        })
};
