import { z } from "zod";
import { NextFunction, Request, Response } from "express";

export function validateBody<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    // console.debug("Validating request body:", req.body);
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errorMessages = result.error.issues.map((issue: any) => `${issue.path.join('.')} is ${issue.message}`);
      res.status(400).json({ error: 'Invalid data', details: errorMessages });
      return;
    }
    // attach parsed data
    (req as any).validated = result.data;
    next();
  };
}