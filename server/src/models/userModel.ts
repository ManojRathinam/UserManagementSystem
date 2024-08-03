import mongoose, {Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    isAdmin: boolean;
    bio: string;
}

const userSchema = new mongoose.Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    bio: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model<IUser>('User', userSchema);

export default User;
