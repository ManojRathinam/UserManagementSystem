import jwt from 'jsonwebtoken';
import { Response } from 'express';

const createToken = (res: Response, userId: string): void => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
        expiresIn: '30d',
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
};

export default createToken;
