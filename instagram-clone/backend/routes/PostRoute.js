import express from "express";
import {
	addNewPost,
	getAllPost,
	getUserPost,
	likePost,
	dislikePost,
	addComment,
	getCommentOfPost,
	deletePost,
	bookmarkPost,
} from "../controllers/PostController.js";
import isAuthenticated from "../middlewares/AuthenticationMiddleware.js";
import upload from "../middlewares/Multer.js";
const router = express.Router();

router
	.route("/add-post")
	.post(isAuthenticated, upload.single("image"), addNewPost);
router.route("/get-all-post").get(isAuthenticated, getAllPost);
router.route("/get-user-post").get(isAuthenticated, getUserPost);
router.route("/like-post/:id").get(isAuthenticated, likePost);
router.route("/dislike-post/:id").get(isAuthenticated, dislikePost);
router.route("/add-comment/:id").post(isAuthenticated, addComment);
router.route("/get-comment-post/:id").get(isAuthenticated, getCommentOfPost);
router.route("/delete-post/:id").delete(isAuthenticated, deletePost);
router.route("/bookmark-post/:id").get(isAuthenticated, bookmarkPost);

export default router;
