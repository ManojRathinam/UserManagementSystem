import { Request } from 'express';
import { IUser } from './models/userModel'; // Adjust the path as needed

// Extend the Request interface to include user
export interface AuthenticatedRequest extends Request {
    user?: IUser;
}
