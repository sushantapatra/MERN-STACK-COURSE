import cloudinary from "../utils/Cloudnary.js";
import sharp from "sharp";
import { Post } from "../models/PostModel.js";
import User from "../models/UserModel.js";
import { Comment } from "../models/CommentModel.js";
export const addNewPost = async (req, res) => {
	try {
		const { caption } = req.body;
		const image = req.file;
		const authorId = req.id;

		if (!image) {
			return res
				.status(400)
				.json({ success: false, message: "Image required." });
		}
		//image upload with image quality reduce using "sharp" package
		const optimizedImageBuffer = await sharp(image.buffer)
			.resize({ width: 800, height: 400, fit: "inside" })
			.toFormat("jpeg", { quality: 80 })
			.toBuffer();

		// console.log(optimizedImageBuffer, "optimize Image buffer");

		//buffer to data uri
		const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
			"base64"
		)}`;
		// console.log(fileUri, "File URI");
		const cloudinaryResponse = await cloudinary.uploader.upload(fileUri);
		const post = await Post.create({
			caption,
			image: cloudinaryResponse.secure_url,
			author: authorId,
		});
		// after post create update to user Schema
		const user = await User.findById(authorId);
		if (user) {
			user.posts.push(post._id);
			await user.save();
		}
		//getting author details (using reference id getting all details about author)
		await post.populate({ path: "author", select: "-password" });
		return res.status(201).json({
			success: true,
			message: "Post created successfully",
			post,
		});
	} catch (error) {
		console.log(`Add New Post Error :${error}`);
	}
};

export const getAllPost = async (req, res) => {
	try {
		//populate method basically create a relation with to collection
		const posts = await Post.find()
			.sort({ createdAt: -1 })
			.populate({
				path: "author",
				select: "username, profilePicture",
			})
			.populate({
				path: "comments",
				sort: { createdAt: -1 },
				populate: {
					path: "author",
					select: "username, profilePicture",
				},
			});
		if (!posts) {
			return res.status(404).json({
				success: false,
				message: "No result found",
			});
		}
		return res.status(200).json({
			success: true,
			posts,
		});
	} catch (error) {
		console.log(`Get All Post Error :${error}`);
	}
};
export const getUserPost = async (req, res) => {
	try {
		const authorId = req.id;
		const posts = await Post.find({ author: authorId })
			.sort({ createdAt: -1 })
			.populate({
				path: "author",
				select: "username, profilePicture",
			})
			.populate({
				path: "comments",
				sort: { createdAt: -1 },
				populate: {
					path: "author",
					select: "username, profilePicture",
				},
			});
		if (!posts) {
			return res.status(404).json({
				success: false,
				message: "No result found",
			});
		}
		return res.status(200).json({
			success: true,
			posts,
		});
	} catch (error) {
		console.log(`Get User Post Error :${error}`);
	}
};

export const likePost = async (req, res) => {
	try {
		const likeWalaUserId = req.id;
		const postId = req.params.id;
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({
				success: false,
				message: "Post not found",
			});
		}
		//Like Logic Started
		//$addToSet  => allways allow unique value
		await post.updateOne({ $addToSet: { likes: likeWalaUserId } });
		await post.save();
		//Impliment socket io for real time notification
		return res.status(200).json({
			success: true,
			message: "Post Liked",
		});
	} catch (error) {
		console.log(`Like Post Error :${error}`);
	}
};
export const dislikePost = async (req, res) => {
	try {
		const dislikeWalaUserId = req.id;
		const postId = req.params.id;
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({
				success: false,
				message: "Post not found",
			});
		}
		//Dis Like Logic Started
		//$pull  => delete the id
		await post.updateOne({ $pull: { likes: dislikeWalaUserId } });
		await post.save();
		//Impliment socket io for real time notification
		return res.status(200).json({
			success: true,
			message: "Post Disliked",
		});
	} catch (error) {
		console.log(`Dislike Post Error :${error}`);
	}
};
export const addComment = async (req, res) => {
	try {
		const commentKaraneWalaUserId = req.id;
		const postId = req.params.id;
		const { text } = req.body;

		//Comment Logic Started
		if (!text) {
			return res.status(400).json({
				success: false,
				message: "Comment is required.",
			});
		}
		// Step 1: Create and save the comment
		const comment = await Comment.create({
			text,
			author: commentKaraneWalaUserId,
			post: postId,
		});

		// Step 2: Find the comment by its ID and populate the 'author' field
		const populatedComment = await Comment.findById(comment._id)
			.populate({
				path: "author",
				select: "username profileImage",
			})
			.exec();

		//console.log("Populated Comment:", populatedComment);
		// Step 3: Update the post to add the comment ID
		const post = await Post.findById(postId); // Ensure you have a Post model
		if (!post) {
			return res.status(404).json({
				success: false,
				message: "Post not found",
			});
		}

		post.comments.push(populatedComment._id);
		await post.save();

		//Impliment socket io for real time notification
		return res.status(201).json({
			success: true,
			message: "Comment Added",
		});
	} catch (error) {
		console.log(`Add Comment Error :${error}`);
	}
};

export const getCommentOfPost = async (req, res) => {
	try {
		const postId = req.params.id;
		const comments = await Comment.find({ post: postId })
			.populate({
				path: "author",
				select: "username profileImage",
			})
			.exec();
		if (!comments) {
			return res.status(404).json({
				success: false,
				message: "Comments not found",
			});
		}
		return res.status(200).json({
			success: true,
			comments,
		});
	} catch (error) {
		console.log(`Get Comment Error :${error}`);
	}
};

export const deletePost = async (req, res) => {
	try {
		const authorId = req.id;
		const postId = req.params.id;
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({
				success: false,
				message: "Post not found",
			});
		}
		// check if the logged in user is the owner of the post
		if (post.author.toString() !== authorId) {
			return res.status(403).json({
				success: false,
				message: "Unauthorized.",
			});
		}
		//delete post
		await Post.findByIdAndDelete(postId);
		//remove post from user model
		const user = await User.findById(authorId);
		user.posts = user.posts.filter((id) => id.toString() !== postId);
		await user.save();

		//delte associated comments
		const comment = await Comment.deleteMany({ post: postId });
		return res.status(200).json({
			success: true,
			message: "Post deleted successfully.",
		});
	} catch (error) {
		console.log(`Add Comment Error :${error}`);
	}
};
export const bookmarkPost = async (req, res) => {
	try {
		const authorId = req.id;
		const postId = req.params.id;
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({
				success: false,
				message: "Post not found",
			});
		}
		//add bookmarks logic
		const user = await User.findById(authorId);
		if (user.bookmarks.includes(post._id)) {
			//allready bookmarks -> remove from bookmark
			await user.updateOne({ $pull: { bookmarks: post._id } });
			await user.save();
			return res.status(200).json({
				success: true,
				message: "Post removed from bookmarks",
			});
		} else {
			// add bookmark
			await user.updateOne({ $addToSet: { bookmarks: post._id } });
			await user.save();
			return res.status(200).json({
				success: true,
				message: "Post add to bookmarked",
			});
		}
	} catch (error) {
		console.log(`Add Comment Error :${error}`);
	}
};
