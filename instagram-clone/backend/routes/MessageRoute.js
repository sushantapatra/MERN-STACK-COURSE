import express from "express";

import isAuthenticated from "../middlewares/AuthenticationMiddleware.js";
import upload from "../middlewares/Multer.js";

import { sendMessage, getMessage } from "../controllers/MessageController.js";
const router = express.Router();
router.route("/send/:id").post(isAuthenticated, sendMessage);
router.route("/all/:id").get(isAuthenticated, getMessage);

export default router;
