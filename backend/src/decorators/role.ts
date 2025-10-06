// decorators/Role.ts
import { Request, Response, NextFunction } from 'express';

export function Role(allowedRoles: string[]) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (req: Request, res: Response, next: NextFunction) {
      const user = (req as any).user;
      if (!user) return res.status(401).json({ error: 'Not authenticated' });

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      }

      return originalMethod.apply(this, [req, res, next]);
    };

    return descriptor;
  };
}
