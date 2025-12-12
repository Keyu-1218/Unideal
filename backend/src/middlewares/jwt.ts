import jwt, { SignOptions } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "../repository/users";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET!;



export function issueJwt(payload: object, expiresIn: SignOptions['expiresIn'] = "7D") {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

function extractToken(req: Request) {
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

export function jwtMiddleware(required: boolean = true) {
  const secret = JWT_SECRET;

  if (!secret) throw new Error("JWT secret not configured");

  return (req: Request, res: Response, next: NextFunction) => {
    const token = extractToken(req);
    if (!token && !required) {
      next();
      return;
    }
    if (!token) return res.status(401).json({ error: "Missing token" });

    jwt.verify(token, secret, {}, (err, payload) => {
      if (err) return res.status(401).json({ error: "Invalid or expired token" });
      // console.log('jwt payload');
      // console.log(payload)
      req.user = payload as User;
      next();
    });
  };
};