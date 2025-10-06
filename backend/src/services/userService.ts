import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';


export const userService = {
  register: async (name: string, email: string, password: string) => {
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, passwordHash: hashed },
    });
    return user;
  },

  login: async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Invalid credentials');

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) throw new Error('Invalid credentials');

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    return { user, token };
  },

  getById: async (id: number) => prisma.user.findUnique({ where: { id } }),

  listUsers: async () => {
    return await prisma.user.findMany({
      where: {
        isDeleted: false
      }
    })
  }
};
