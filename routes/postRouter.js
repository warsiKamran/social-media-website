import express from "express";
import { addAndUpdateComment, deleteComment, deletePost, getPost, likeAndUnlike, updateCaption, upload } from "../controllers/postController.js";
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

//add and update comment
router.route("/post/comment/:id").put(isAuthenticated, addAndUpdateComment);

//delete comment
router.route("/post/comment/:id").delete(isAuthenticated, deleteComment);

export default router;

