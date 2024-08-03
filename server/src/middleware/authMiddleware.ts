import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/userModel'; // Adjust the path as needed
import asyncHandler from './asyncHandler';
import { AuthenticatedRequest } from '../@types/types'; // Import the extended request type

const authenticate = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
            const user = await User.findById(decoded.userId).select('-password') as IUser | null;

            if (user) {
                req.user = user; // Directly assign the user
                next();
            } else {
                res.status(401).json({ message: "Not authorized, user not found" });
            }
        } catch (error) {
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    } else {
        res.status(401).json({ message: "Not authorized, no token" });
    }
});

const authorizeAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).send("Not authorized as admin");
    }
};

export { authenticate, authorizeAdmin };
