import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
}

export interface AuthenticatedRequest extends Request {
  user?: string;
}

const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    ) as JwtPayload;
    req.user = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default authMiddleware;
