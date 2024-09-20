import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: [true, "Username is required"],
			unique: true,
			min: [4, "Must be at least 4, got {VALUE}"],
			max: [12, "Must be at least 12, got {VALUE}"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			min: [4, "Must be at least 4, got {VALUE}"],
			max: [12, "Must be at least 12, got {VALUE}"],
		},
		profilePicture: { type: String, default: "" },
		bio: { type: String, default: "" },
		gender: { type: String, enum: ["male", "female"] },
		followers: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
		following: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
		posts: [{ type: mongoose.Schema.ObjectId, ref: "Post" }],
		bookmarks: [{ type: mongoose.Schema.ObjectId, ref: "Post" }],
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
