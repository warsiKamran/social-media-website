import express from "express";
import { followAndUnfollow, login, logout, signup, updatePassword, updateProfile } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();


//signup
router.route("/signup").post(signup);

//login
router.route("/login").post(login);

//logout
router.route("/logout").get(logout);

//follow and unfollow
router.route("/follow/:id").get(isAuthenticated, followAndUnfollow);

//update password
router.route("/update/password").put(isAuthenticated, updatePassword);

//update profile
router.route("/update/profile").put(isAuthenticated, updateProfile);

export default router;

