import { Request, Response, NextFunction } from 'express';

type AsyncHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>;

const asyncHandler = (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(error => {
        res.status(500).json({ message: error.message });
    });
};

export default asyncHandler;
