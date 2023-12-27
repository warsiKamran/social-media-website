import express from "express";
import { deletePost, getPost, likeAndUnlike, updateCaption, upload } from "../controllers/postController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

//post anything
router.route("/post/upload").post(isAuthenticated,upload);

//like and unlike
router.route("/post/:id").get(isAuthenticated, likeAndUnlike);

//delete post
router.route("/post/:id").delete(isAuthenticated, deletePost);

//get post of following
router.route("/post").get(isAuthenticated, getPost);

//update caption
router.route("/post/:id").put(isAuthenticated, updateCaption);

export default router;

