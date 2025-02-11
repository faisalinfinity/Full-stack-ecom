import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { AuthenticatedRequest } from './auth';

const adminMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user);
    if (user && user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Access denied, admin only' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export default adminMiddleware;
