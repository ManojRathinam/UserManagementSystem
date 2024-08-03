import { Request, Response } from 'express';
import User, { IUser } from '../models/userModel';
import bcrypt from 'bcryptjs';
import asyncHandler from '../middleware/asyncHandler';
import createToken from '../utils/createToken';
import mongoose from 'mongoose';
import { AuthenticatedRequest } from '../@types/types'; //

// Register user
const register = asyncHandler(async (req: Request, res: Response) => {
    const { username, email, password, bio } = req.body;

    if (!username || !email || !password) {
        return res.status(400).send("Please fill all the inputs.");
    }

    const userExists = await User.findOne({ email }) as IUser | null;
    if (userExists) return res.status(400).send("User already exists");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword, bio }) as IUser;

    try {
        await newUser.save();
        const userId = newUser._id as mongoose.Types.ObjectId;
        createToken(res, userId.toString());

        res.status(201).json({ _id: userId.toString(), username: newUser.username, email: newUser.email, isAdmin: newUser.isAdmin });
    } catch (error) {
        return res.status(400).send("Invalid user data");
    }
});

// Login user
const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email }) as IUser | null;

    if (existingUser) {
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordValid) {
            return res.status(401).send("Invalid password");
        }

        const userId = existingUser._id as mongoose.Types.ObjectId;
        createToken(res, userId.toString());

        res.status(201).json({ _id: userId.toString(), username: existingUser.username, email: existingUser.email, isAdmin: existingUser.isAdmin });

        return;
    }

    return res.status(404).send("User not found");
});

// Logout user
const logoutCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(200).json({ message: "Logged out successfully" });
});

// Get all users
const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await User.find({}) as IUser[];
    res.json(users);
});

// Get current user profile
const getUserProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?._id;
        if (userId) {
            const user = await User.findById(userId) as IUser | null;
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } else {
            res.status(400).json({ message: 'No user ID found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
  
  const updateCurrentUserProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.user?._id) as IUser | null;
  
    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.bio = req.body.bio || user.bio;
  
      if (req.body.password) {
        user.password = req.body.password;
      }
  
      const updatedUser = await user.save();
  
      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        bio: updatedUser.bio,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  });

export { register, loginUser, logoutCurrentUser, getAllUsers, getUserProfile, updateCurrentUserProfile };
