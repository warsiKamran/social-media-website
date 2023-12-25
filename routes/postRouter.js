import express from "express";
import { deletePost, likeAndUnlike, upload } from "../controllers/postController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

//post anything
router.route("/post/upload").post(isAuthenticated,upload);

//like and unlike
router.route("/post/:id").get(isAuthenticated, likeAndUnlike);

//delete post
router.route("/post/:id").delete(isAuthenticated, deletePost);

export default router;

