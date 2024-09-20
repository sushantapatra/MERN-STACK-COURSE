import express from "express";
import {
	editProfile,
	followOrUnfollow,
	getProfile,
	getSuggestedUsers,
	login,
	logout,
	register,
} from "../controllers/UserController.js";
import isAuthenticated from "../middlewares/AuthenticationMiddleware.js";
import upload from "../middlewares/Multer.js";
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/:id/profile/").get(isAuthenticated, getProfile);
router
	.route("/profile/edit")
	.post(isAuthenticated, upload.single("profilePicture"), editProfile);
router.route("/suggested").get(isAuthenticated, getSuggestedUsers);
router.route("/follow-unfollow/:id").post(isAuthenticated, followOrUnfollow);

export default router;
