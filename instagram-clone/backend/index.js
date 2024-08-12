import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";

dotenv.config({});

const app = express();
//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOptions = {
	origin: "http://localhost:3000",
	credentials: true,
};
app.use(cors(corsOptions));

//Routes
app.get("/", (req, res) => {
	return res.status(200).json({
		message: "I am working...",
		success: true,
	});
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	connectDB();
	console.log(`Server listen at localhost:${PORT}`);
});