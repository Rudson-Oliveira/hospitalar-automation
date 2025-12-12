import { Request, Response, NextFunction } from 'express';

// Tipos de permissão
export type UserRole = 'admin' | 'collaborator';

// Mock de usuário (em produção viria do JWT)
const MOCK_USER = {
  id: '1',
  name: 'Rudson',
  role: 'admin' as UserRole
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Injetar usuário no request
  (req as any).user = MOCK_USER;
  next();
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (user && user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Acesso negado. Requer privilégios de Admin.' });
  }
};
