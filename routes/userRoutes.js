import express from "express";
import { 
    deleteMyProfile, 
    followAndUnfollow, 
    getAllUsers, 
    getMyProfile, 
    getUserProfile, 
    login, 
    logout, 
    signup, 
    updatePassword, 
    updateProfile
} from "../controllers/userController.js";

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

//delete profile
router.route("/delete/me").delete(isAuthenticated, deleteMyProfile);

//my profile
router.route("/profile/me").get(isAuthenticated, getMyProfile);

//other user's profile
router.route("/profile/:user_id").get(isAuthenticated, getUserProfile);

//get all users
router.route("/users").get(isAuthenticated, getAllUsers);

export default router;

