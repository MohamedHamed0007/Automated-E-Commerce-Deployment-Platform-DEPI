import { Request, Response, NextFunction, RequestHandler } from 'express';

export const asyncHandler = <Req extends Request = Request>(
  fn: (req: Req, res: Response, next: NextFunction) => Promise<any>
): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req as Req, res, next);
    } catch (err) {
      next(err);
    }
  };