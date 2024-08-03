import express from "express";
import { register, loginUser, logoutCurrentUser, getAllUsers, getUserProfile, updateCurrentUserProfile } from '../controllers/userController';
const { authenticate, authorizeAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.route('/').post(register).get(authenticate, authorizeAdmin, getAllUsers);

router.post('/auth', loginUser);
router.post('/logout', logoutCurrentUser);

router.route("/profile").get(authenticate, getUserProfile);
router.route("/profile/edit:").put(authenticate,updateCurrentUserProfile);

export default router;
