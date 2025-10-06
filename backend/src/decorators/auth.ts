// decorators/Auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';


export function Auth() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).json({ error: 'No token provided' });

      const token = authHeader.split(' ')[1];
      if (!token) return res.status(401).json({ error: 'Invalid token format' });

      try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user) return res.status(401).json({ error: 'User not found' });

        (req as any).user = user;
        (req as any).userId = user.id
        return originalMethod.apply(this, [req, res, next]);
      } catch (err) {
        return res.status(401).json({ error: 'Token invalid or expired' });
      }
    };

    return descriptor;
  };
}
