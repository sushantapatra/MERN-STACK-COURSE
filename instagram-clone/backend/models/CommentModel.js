import mongoose from "mongoose";
const commentSchema = new mongoose.Schema(
	{
		text: {
			type: String,
			required: [true, "Text is required"],
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "Author required"],
		},
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
			required: [true, "Post required"],
		},
	},
	{ timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);
