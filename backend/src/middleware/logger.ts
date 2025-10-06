import { Request, Response, NextFunction } from "express";

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // Safely log body and query
  console.log("Body:", req.body ? req.body : {});
  console.log("Query:", req.query ? req.query : {});
  console.log("Headers:", req.headers ? req.headers : {});

  next();
}