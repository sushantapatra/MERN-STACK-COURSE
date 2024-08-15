import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
	caption: {
		type: String,
		default: "",
	},
	image: {
		type: String,
		required: [true, "Image is required"],
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: [true, "Author required"],
	},
	likes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment",
		},
	],
});

export const Post = mongoose.model("Post", postSchema);
